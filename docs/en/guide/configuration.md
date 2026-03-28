# Configuration

After installation, `config/lingua.php` is the single source of truth for all Lingua settings.

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

## Option reference

### `lang_dir`

**Default:** `lang_path()` (resolves to `{project_root}/lang/`)

The directory Lingua reads when syncing files to the database and writes to when exporting back to files. Change this if your translation files live in a non-standard location.

### `default_locale`

**Default:** `config('app.locale', 'en')`

Used as a fallback during installation and when the `languages` table is empty. After installation, the authoritative default is the row in the `languages` table with `is_default = true`.

### `fallback_locale`

**Default:** `config('app.fallback_locale', 'en')`

Standard Laravel fallback behaviour - when a key is missing in the active locale, this locale is tried next.

### `middleware`

**Default:** `['web']`

::: danger Production requirement
Always add at least `'auth'` before deploying. Without it, anyone who knows the URL can modify your translations.
:::

```php
// Typical production setup
'middleware' => ['web', 'auth'],

// With Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// With a custom Gate policy
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `routes_prefix`

**Default:** `'lingua'`

Changes the URL prefix for all Lingua management pages:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
// → /admin/translations/translations
```

### `session_variable`

**Default:** `'locale'`

The session key where Lingua stores the user's chosen locale. Change it if it conflicts with another package.

### `selector.mode`

**Default:** `'sidebar'`

Controls the default render mode of the `<livewire:lingua::language-selector>` component:

| Value | Description |
|---|---|
| `sidebar` | Renders as a grouped sidebar navigation item |
| `dropdown` | Renders as a compact dropdown button |
| `modal` | Renders as a button that opens a locale picker modal |

### `selector.show_flags`

**Default:** `true`

Whether to show country flag icons next to language names in the selector. Requires the `outhebox/blade-flags` package (installed automatically as a dependency).

### `editor`

Controls the TipTap toolbar for HTML and Markdown translation types. Each option maps to a TipTap extension:

| Key | Description |
|---|---|
| `headings` | H1–H3 heading buttons |
| `bold` | **Bold** |
| `italic` | *Italic* |
| `underline` | Underline |
| `strikethrough` | ~~Strikethrough~~ |
| `bullet` | Unordered list |
| `ordered` | Ordered list |
| `clear` | Clear formatting button |

::: tip
The editor toolbar is global - all HTML/Markdown translation fields share the same configuration. If you need per-field control, publish the views and customise the editor component directly.
:::
