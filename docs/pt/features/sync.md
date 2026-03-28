# Sincronização Bidirecional

O Lingua pode importar traduções de arquivos locais para o banco de dados e exportá-las de volta — oferecendo o melhor dos dois mundos: **tempo de execução orientado a banco de dados** e **controle de versão baseado em arquivos**.

## As duas direções

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (DB)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄── lingua:sync-to-local
                      ─┘
```

## Sincronizar para o banco de dados

Importa todos os arquivos de tradução de `lang/` (e seus subdiretórios) para a tabela `language_lines`.

```bash
php artisan lingua:sync-to-database
```

### O que é importado

- `lang/{locale}/*.php` — arquivos PHP de tradução padrão
- `lang/{locale}.json` — arquivos JSON de tradução
- `lang/vendor/{package}/{locale}/*.php` — traduções de pacotes de vendor

### Comportamento de upsert

O Lingua usa `updateOrCreate` com correspondência em `group` + `key`. Isso significa que:
- **Novas chaves** são inseridas
- **Chaves existentes** têm seu JSON `text` mesclado — os valores de locale que você editou na interface são **preservados**
- **Detecção de tipo** é executada no valor para determinar `text` / `html` / `markdown`

### Detecção automática de tipo

| Regra | Tipo atribuído |
|---|---|
| String contém tags HTML (`<…>`) | `html` |
| String é analisada como Markdown (títulos, listas, etc.) | `markdown` |
| Nenhum dos dois | `text` |

::: tip
A detecção de tipo é conservadora — atribui `html` ou `markdown` apenas quando o conteúdo claramente corresponde. Strings simples sempre recebem `text`. Você pode alterar o tipo manualmente pelo modal de Edição.
:::

### Via facade

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
```

::: warning
O facade chama `Translation::syncToDatabase()` internamente, que é uma chamada estática. Em comandos Artisan e componentes Livewire, `app(Translation::class)->syncToDatabase()` é usado em vez disso para que o Mockery possa interceptá-lo nos testes.
:::

---

## Sincronizar para local

Exporta todas as traduções de `language_lines` de volta para arquivos PHP e JSON em `lang/`.

```bash
php artisan lingua:sync-to-local
```

### O que é exportado

- Todas as traduções não-vendor → `lang/{locale}/{group}.php`
- Chaves de grupo JSON (`single`) → `lang/{locale}.json`
- Traduções de vendor → `lang/vendor/{vendor}/{locale}/{group}.php`

### Casos de uso

- **Controle de versão** — commit dos arquivos exportados para rastrear alterações de tradução ao longo do tempo
- **Pipelines de deployment** — exportar antes de fazer deploy se as ferramentas downstream esperam traduções baseadas em arquivos
- **Backups** — criar um snapshot em um ponto no tempo de todas as traduções
- **Outras ferramentas** — exportar para uso em um serviço de gerenciamento de traduções ou importador CSV

### Via facade

```php
Lingua::syncToLocal();
```

---

## Atualizar a partir do Laravel Lang

Busca as strings de tradução mais recentes do ecossistema `laravel-lang` e as sincroniza para o banco de dados. Útil após atualizar o Laravel ou adicionar um novo pacote que inclui traduções.

```bash
php artisan lingua:update-lang
```

Isso executa `lang:update` (do `laravel-lang/common`) seguido de `lingua:sync-to-database`.

---

## Fluxos de trabalho de sincronização automatizados

### No deployment

Adicione uma etapa pós-deploy para manter o banco de dados sincronizado com seus arquivos lang commitados:

```bash
# No seu script de deploy ou pipeline CI/CD
php artisan lingua:sync-to-database
php artisan optimize:clear
```

### Via scheduler

Se sua equipe de tradução edita arquivos diretamente (em vez de pela interface), agende uma sincronização periódica:

```php
// routes/console.php
Schedule::command('lingua:sync-to-database')->hourly();
```

### Ao instalar um pacote

Quando você fizer `composer require` de um novo pacote que inclui traduções, execute:

```bash
php artisan lingua:update-lang
```

Isso importa quaisquer novas strings do pacote instalado.

---

## Dicas e pegadinhas

::: tip Mantenha o BD como fonte de verdade
Trate o banco de dados como fonte primária. Sincronize para local apenas quando precisar de arquivos (controle de versão, deployment, etc.). Evite editar arquivos locais diretamente enquanto o BD estiver em uso — a próxima sincronização-para-banco-de-dados sobrescreverá suas edições se as chaves já existirem.
:::

::: warning Arquivos de locale e BD fora de sincronia
Se você adicionar novos arquivos PHP de locale manualmente sem executar `lingua:sync-to-database`, as novas chaves estarão disponíveis apenas via file loader (prioridade menor que o BD). Execute sync para importá-las corretamente.
:::

::: tip Roundtrip completo
Uma forma segura de reorganizar traduções:
1. `lingua:sync-to-local` — exportar tudo
2. Editar arquivos em disco
3. `lingua:sync-to-database` — reimportar
:::
