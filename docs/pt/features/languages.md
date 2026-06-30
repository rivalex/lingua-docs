# Gerenciamento de Idiomas

A página de Idiomas (`/lingua/languages`) é o centro de controle para todos os
locales instalados. Ela compartilha o [menu de navegação](/pt/features/settings#menu-de-navegacao)
com as outras páginas do Lingua, com a página atual destacada.

<Screenshot src="/screenshots/languages-page.png" alt="Página de gerenciamento de idiomas do Lingua" caption="Página de idiomas — locales instalados com estatísticas de conclusão e a barra de ferramentas de duas linhas." />

## A barra de ferramentas

A barra de ferramentas é reorganizada em duas linhas para que os controles
permaneçam utilizáveis em qualquer largura:

- **Linha superior** — o campo de **pesquisa** de locale e o botão **Add language**.
- **Linha inferior** — os três botões de **sync** (Sync from files, Sync to files, Update).

## Adicionando um idioma

### Pela interface

Clique em **Add Language**, pesquise entre os 129+ locales no registro, escolha
um e confirme. O Lingua então:

1. Cria um registro `Language` para o locale
2. Popula suas strings do **conjunto de dados empacotado** (sem download pela internet)
3. Atualiza a tabela com o novo locale

<Screenshot src="/screenshots/language-add-modal.png" alt="Modal de adicionar idioma" caption="O modal de adição de idioma com seletor de locale pesquisável." width="640px" :center="true"/>

::: tip <Badge type="tip" text="Novidade na versão 2.0" /> Sem downloads necessários
`lingua:add` não puxa mais arquivos do GitHub ou `laravel-lang`. Os locales são
populados instantaneamente a partir do conjunto de dados empacotado com o pacote
(26 locales × 7 grupos, 5902 strings, alinhado ao Laravel v13.14.0). Veja
[Sincronização Bidirecional](/pt/features/sync#o-conjunto-de-dados-empacotado).
:::

### Pela linha de comando

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

### Programaticamente

```php
use Rivalex\Lingua\Facades\Lingua;

// Criar o registro Language e popular seu armazenamento para o locale
Lingua::addLanguage('fr');
```

::: tip
Use `Lingua::notInstalled()` para obter os locales disponíveis mas ainda não instalados:

```php
$available = Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```
:::

## Removendo um idioma

Clique no ícone de lixeira em qualquer linha de idioma não-padrão. Um passo de
confirmação previne exclusões acidentais.

Remover um idioma exclui o registro `Language` **e todos os valores de tradução
para aquele locale**, depois reordena os valores de sort dos idiomas restantes.

::: warning
O **idioma padrão não pode ser removido**. Defina outro idioma como padrão primeiro.
:::

```bash
# Pela linha de comando
php artisan lingua:remove fr
```

```php
// Programaticamente
Lingua::removeLanguage('fr');
```

## Definindo o idioma padrão

Clique no ícone de estrela (⭐) em qualquer linha de idioma. Apenas um idioma
pode ser padrão por vez, e a alteração é envolvida em uma transação de banco de
dados para que nunca haja um momento sem padrão.

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::setDefaultLocale('fr');
```

::: warning O padrão define o conjunto de chaves de referência
O locale padrão define o conjunto canônico de chaves. A cobertura para todos os
outros locales é medida em relação a ele, então o padrão sempre exibe 100%.
Certifique-se de que esteja razoavelmente completo antes de alternar.
:::

## Reordenando idiomas

Arraste e solte as linhas de idioma para controlar sua ordem de exibição em todo
lugar onde aparecem — o widget seletor de idioma, o seletor de locale de traduções
e em qualquer lugar que você chame `Lingua::languages()`.

A ordem de classificação é armazenada na coluna inteira `sort` e reatribuída
sequencialmente após cada drop.

## Estatísticas de conclusão

Cada linha de idioma mostra:

| Métrica | Descrição |
|---|---|
| **Total de strings** | O número de chaves no conjunto de chaves de referência |
| **Traduzidas** | Número de strings com valor para este locale |
| **Conclusão %** | `traduzidas / total * 100`, arredondado para 2 casas decimais |

As estatísticas são calculadas através do [driver de armazenamento](/pt/guide/storage)
ativo, então estão corretas tanto no modo `database` quanto no `file`.

```php
use Rivalex\Lingua\Facades\Lingua;

$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// Todos os idiomas com estatísticas em uma única passagem
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

## Controles de sincronização

A linha inferior da barra de ferramentas tem três botões de sincronização:

| Botão | Comando | Ação |
|---|---|---|
| **Sync from files** | `lingua:sync-to-database` | Importa todos os arquivos `lang/` locais (core + vendor) para `language_lines` |
| **Sync to files** | `lingua:sync-to-local` | Escreve todas as traduções do BD de volta para arquivos PHP & JSON em `lang/` |
| **Update** | `lingua:update-lang` | Re-popula locales instalados a partir do conjunto de dados empacotado e `lang/` local |

Veja [Sincronização Bidirecional](/pt/features/sync) para a mecânica completa,
incluindo a invalidação de cache por `(locale, group)` que é executada após
cada operação.

::: tip Consciência do driver
No modo de armazenamento `file` o botão **Sync to files** é bloqueado — o modo
arquivo já escreve em disco, então só é executado com a flag `--force` pela CLI.
Veja [Drivers de armazenamento](/pt/guide/storage).
:::
