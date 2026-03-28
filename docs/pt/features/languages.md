# Gerenciamento de Idiomas

A página de Idiomas (`/lingua/languages`) é o centro de controle para todos os locales instalados.

<Screenshot src="/screenshots/languages-page.png" alt="Página de gerenciamento de idiomas do Lingua" caption="Página de idiomas — exibindo locales instalados com estatísticas de conclusão." />

## Adicionando um idioma

### Pela interface

Clique em **Add Language**, selecione qualquer um dos 70+ locales disponíveis e confirme. O Lingua irá:

1. Baixar os arquivos de idioma do Laravel Lang
2. Criar um registro `Language` no banco de dados
3. Sincronizar todas as novas strings em `language_lines`
4. Atualizar a tabela com o novo locale

<Screenshot src="/screenshots/language-add-modal.png" alt="Modal de adicionar idioma" caption="O modal de adição de idioma com seletor de locale pesquisável." width="640px" :center="true"/>

### Pela linha de comando

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

### Programaticamente

```php
use Rivalex\Lingua\Facades\Lingua;

// Instalar arquivos de idioma (wrapper de lang:add)
Lingua::addLanguage('fr');

// Depois criar o registro no BD + sincronizar (o que o comando Artisan faz por completo)
// → use lingua:add para o fluxo completo e orquestrado
```

::: tip
Use `Lingua::notInstalled()` para obter a lista de locales disponíveis mas ainda não instalados:

```php
$available = Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```
:::

## Removendo um idioma

Clique no ícone de lixeira em qualquer linha de idioma não-padrão. Um modal de confirmação previne exclusões acidentais — você precisa digitar o nome do idioma para confirmar.

Por baixo dos panos, a operação de exclusão:
1. Remove os arquivos de idioma via `lang:rm {locale} --force`
2. Remove todas as entradas `{locale}` da coluna JSON `language_lines.text`
3. Exclui o registro `Language`
4. Reordena os valores de sort dos idiomas restantes

::: warning
O **idioma padrão não pode ser removido**. Defina outro idioma como padrão primeiro.
:::

```bash
# Pela linha de comando
php artisan lingua:remove fr
```

## Definindo o idioma padrão

Clique no ícone de estrela (⭐) em qualquer linha de idioma. Apenas um idioma pode ser padrão por vez. A alteração é envolvida em uma transação de banco de dados para evitar um momento em que nenhum idioma está marcado como padrão.

```php
// Programaticamente
Lingua::setDefaultLocale('fr');

// Ou via model
$french = Language::where('code', 'fr')->first();
Language::setDefault($french);
```

::: warning Removendo o padrão
Se você definir um novo idioma padrão, certifique-se de que todas as suas traduções estejam ao menos parcialmente completas para esse locale. O idioma padrão é usado como fallback no editor da interface (a coluna da esquerda mostra o valor padrão como referência).
:::

## Reordenando idiomas

Arraste e solte as linhas de idioma para controlar sua ordem de exibição em toda a aplicação — no widget seletor de idioma, no seletor de locale de traduções e em qualquer lugar que você use `Lingua::languages()`.

A ordem de classificação é armazenada na coluna inteira `sort` e reatribuída sequencialmente após cada drop.

## Visualizando estatísticas de conclusão

Cada linha de idioma mostra:

| Métrica | Descrição |
|---|---|
| **Conclusão %** | `traduzidas / total * 100`, arredondado para 2 casas decimais |
| **Ausentes** | Número de strings sem valor para este locale |

Esses valores são calculados em tempo de query via subconsultas de banco de dados contra a tabela `language_lines`, portanto estão sempre atualizados.

```php
// Obter estatísticas para um locale específico
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// Ou obter todos os idiomas com estatísticas em uma única query
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

## Controles de sincronização

A barra de ferramentas da página de Idiomas tem três botões de sincronização:

| Botão | Ação |
|---|---|
| **Sync to database** | Importa todos os arquivos locais `lang/` para `language_lines` |
| **Sync to local** | Exporta todas as traduções do BD de volta para arquivos `lang/` |
| **Update via Laravel Lang** | Executa `lang:update` para buscar as strings mais recentes do upstream, depois sincroniza para o BD |

Todas as três operações são executadas **assincronamente** (atributo `#[Async]` do Livewire) para que a interface permaneça responsiva durante sincronizações demoradas.
