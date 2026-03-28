# Configurazione

Dopo l'installazione, `config/lingua.php` è l'unica fonte di verità per tutte le impostazioni di Lingua.

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

## Riferimento opzioni

### `lang_dir`

**Default:** `lang_path()` (risolve in `{project_root}/lang/`)

La directory che Lingua legge durante la sincronizzazione dei file verso il database e in cui scrive durante l'esportazione. Cambia questo valore se i tuoi file di traduzione si trovano in una posizione non standard.

### `default_locale`

**Default:** `config('app.locale', 'en')`

Usato come fallback durante l'installazione e quando la tabella `languages` è vuota. Dopo l'installazione, il valore predefinito autorevole è la riga nella tabella `languages` con `is_default = true`.

### `fallback_locale`

**Default:** `config('app.fallback_locale', 'en')`

Comportamento di fallback standard di Laravel — quando una chiave è mancante nella locale attiva, viene tentata questa locale successivamente.

### `middleware`

**Default:** `['web']`

::: danger Requisito di produzione
Aggiungi sempre almeno `'auth'` prima del deployment. Senza di esso, chiunque conosca l'URL può modificare le tue traduzioni.
:::

```php
// Configurazione tipica di produzione
'middleware' => ['web', 'auth'],

// Con Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// Con una policy Gate personalizzata
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `routes_prefix`

**Default:** `'lingua'`

Cambia il prefisso URL per tutte le pagine di gestione di Lingua:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
// → /admin/translations/translations
```

### `session_variable`

**Default:** `'locale'`

La chiave di sessione in cui Lingua memorizza la locale scelta dall'utente. Cambiala se entra in conflitto con un altro pacchetto.

### `selector.mode`

**Default:** `'sidebar'`

Controlla la modalità di rendering predefinita del componente `<livewire:lingua::language-selector>`:

| Valore | Descrizione |
|---|---|
| `sidebar` | Si renderizza come elemento di navigazione raggruppato nella sidebar |
| `dropdown` | Si renderizza come un pulsante dropdown compatto |
| `modal` | Si renderizza come un pulsante che apre una modale per la selezione della locale |

### `selector.show_flags`

**Default:** `true`

Se mostrare le icone delle bandiere dei paesi accanto ai nomi delle lingue nel selettore. Richiede il pacchetto `outhebox/blade-flags` (installato automaticamente come dipendenza).

### `editor`

Controlla la barra degli strumenti TipTap per i tipi di traduzione HTML e Markdown. Ogni opzione corrisponde a un'estensione TipTap:

| Chiave | Descrizione |
|---|---|
| `headings` | Pulsanti per i titoli H1–H3 |
| `bold` | **Grassetto** |
| `italic` | *Corsivo* |
| `underline` | Sottolineato |
| `strikethrough` | ~~Barrato~~ |
| `bullet` | Elenco non ordinato |
| `ordered` | Elenco ordinato |
| `clear` | Pulsante per rimuovere la formattazione |

::: tip
La barra degli strumenti dell'editor è globale — tutti i campi di traduzione HTML/Markdown condividono la stessa configurazione. Se hai bisogno di un controllo per singolo campo, pubblica le viste e personalizza il componente editor direttamente.
:::
