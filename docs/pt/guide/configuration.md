# Configuração

Após a instalação, `config/lingua.php` é a única fonte de verdade para todas as configurações do Lingua.

```php
// config/lingua.php

return [

    /*
    |--------------------------------------------------------------------------
    | Language Files Directory
    |--------------------------------------------------------------------------
    | The path where local PHP/JSON translation files are stored.
    | Used by lingua:sync-to-database and lingua:sync-to-local.
    */
    'lang_dir' => lang_path(),

    /*
    |--------------------------------------------------------------------------
    | Default Locale
    |--------------------------------------------------------------------------
    | The fallback locale code used during installation and when the database
    | has no default language configured.
    */
    'default_locale' => config('app.locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Fallback Locale
    |--------------------------------------------------------------------------
    | When a translation is missing in the active locale, Laravel will try
    | this locale next.
    */
    'fallback_locale' => config('app.fallback_locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Route Middleware
    |--------------------------------------------------------------------------
    | Middleware applied to all Lingua management routes.
    | Add 'auth' (and role/permission guards) before going to production.
    */
    'middleware' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Route Prefix
    |--------------------------------------------------------------------------
    | URL prefix for Lingua's management pages.
    | Default: /lingua/languages and /lingua/translations
    */
    'routes_prefix' => 'lingua',

    /*
    |--------------------------------------------------------------------------
    | Session Variable
    |--------------------------------------------------------------------------
    | The session key used to persist the user's active locale across requests.
    */
    'session_variable' => 'locale',

    /*
    |--------------------------------------------------------------------------
    | Language Selector
    |--------------------------------------------------------------------------
    | Controls the default behaviour of the <livewire:lingua::language-selector>
    | component. Both options can be overridden per-instance via props.
    */
    'selector' => [
        'mode'       => 'sidebar',   // 'sidebar' | 'modal' | 'dropdown'
        'show_flags' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Rich-text Editor Toolbar
    |--------------------------------------------------------------------------
    | Defines which formatting options are available in the TipTap editor
    | for HTML and Markdown translation types.
    */
    'editor' => [
        'headings'      => false,
        'bold'          => true,
        'italic'        => true,
        'underline'     => true,
        'strikethrough' => false,
        'bullet'        => true,
        'ordered'       => true,
        'clear'         => true,
    ],

];
```

---

## Referência de opções

### `lang_dir`

**Padrão:** `lang_path()` (resolve para `{project_root}/lang/`)

O diretório que o Lingua lê ao sincronizar arquivos para o banco de dados e grava ao exportar de volta para arquivos. Altere isso se seus arquivos de tradução estiverem em um local não padrão.

### `default_locale`

**Padrão:** `config('app.locale', 'en')`

Usado como fallback durante a instalação e quando a tabela `languages` está vazia. Após a instalação, o padrão autoritativo é o registro na tabela `languages` com `is_default = true`.

### `fallback_locale`

**Padrão:** `config('app.fallback_locale', 'en')`

Comportamento de fallback padrão do Laravel — quando uma chave está ausente no locale ativo, este locale é tentado em seguida.

### `middleware`

**Padrão:** `['web']`

::: danger Requisito de produção
Sempre adicione pelo menos `'auth'` antes de fazer o deploy. Sem isso, qualquer pessoa que conheça a URL pode modificar suas traduções.
:::

```php
// Configuração típica de produção
'middleware' => ['web', 'auth'],

// Com Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// Com uma Gate policy personalizada
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `routes_prefix`

**Padrão:** `'lingua'`

Altera o prefixo de URL para todas as páginas de gerenciamento do Lingua:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
// → /admin/translations/translations
```

### `session_variable`

**Padrão:** `'locale'`

A chave de sessão onde o Lingua armazena o locale escolhido pelo usuário. Altere se houver conflito com outro pacote.

### `selector.mode`

**Padrão:** `'sidebar'`

Controla o modo de renderização padrão do componente `<livewire:lingua::language-selector>`:

| Valor | Descrição |
|---|---|
| `sidebar` | Renderiza como um item de navegação agrupado na sidebar |
| `dropdown` | Renderiza como um botão dropdown compacto |
| `modal` | Renderiza como um botão que abre um modal de seleção de locale |

### `selector.show_flags`

**Padrão:** `true`

Se deve exibir ícones de bandeiras ao lado dos nomes dos idiomas no seletor. Requer o pacote `outhebox/blade-flags` (instalado automaticamente como dependência).

### `editor`

Controla a barra de ferramentas do TipTap para os tipos de tradução HTML e Markdown. Cada opção corresponde a uma extensão do TipTap:

| Chave | Descrição |
|---|---|
| `headings` | Botões de título H1–H3 |
| `bold` | **Negrito** |
| `italic` | *Itálico* |
| `underline` | Sublinhado |
| `strikethrough` | ~~Tachado~~ |
| `bullet` | Lista não ordenada |
| `ordered` | Lista ordenada |
| `clear` | Botão de limpar formatação |

::: tip
A barra de ferramentas do editor é global — todos os campos de tradução HTML/Markdown compartilham a mesma configuração. Se precisar de controle por campo, publique as views e personalize o componente do editor diretamente.
:::
