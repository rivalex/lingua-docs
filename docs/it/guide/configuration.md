# Configurazione

Dopo l'installazione, `config/lingua.php` è l'unica fonte di verità per
tutte le impostazioni di Lingua. Questa pagina documenta ogni chiave,
raggruppata per argomento. Le chiavi contrassegnate con
<Badge type="tip" text="Novità in 2.0" /> non esistevano nella versione 1.x.

## Impostazioni locale

```php
// config/lingua.php

'lang_dir'         => lang_path(),
'base_translations_path' => null, // ★ Novità in 2.0
'default_locale'   => config('app.locale', 'en'),
'fallback_locale'  => config('app.fallback_locale', 'en'),
'session_variable' => 'locale',
```

### `lang_dir`

**Default:** `lang_path()` — risolve in `{project_root}/lang/`.

La directory che Lingua legge durante la sincronizzazione dei file nel
database e in cui scrive durante l'esportazione verso i file.

### `base_translations_path` <Badge type="tip" text="Novità in 2.0" />

**Default:** `null`

Override opzionale per il percorso da cui Lingua legge il dataset di
traduzioni **integrato**. Lascia `null` per usare il dataset incluso nel
pacchetto.

### `default_locale`

**Default:** `config('app.locale', 'en')`

Usato come fallback durante l'installazione e quando la tabella `languages`
è vuota. Dopo l'installazione, il valore predefinito autorevole è la riga
nella tabella `languages` con `is_default = true`.

### `fallback_locale`

**Default:** `config('app.fallback_locale', 'en')`

Fallback standard di Laravel — quando una chiave è mancante nella locale
attiva, viene tentata questa locale successivamente.

### `session_variable`

**Default:** `'locale'`

La chiave di sessione in cui Lingua archivia la locale scelta dall'utente.

---

## Sicurezza e accesso

```php
'middleware' => ['web', 'auth'],
'gate'       => env('LINGUA_GATE', null), // ★ Novità in 2.0
```

### `middleware`

**Default:** `['web', 'auth']` <Badge type="warning" text="Modificato in 2.0" />

::: tip Sicuro per impostazione predefinita
In 2.0 il default è `['web', 'auth']` — l'interfaccia di gestione **non è**
raggiungibile pubblicamente senza autenticazione. Nella versione 1.x era
`['web']`.
:::

```php
// Con Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// Con una policy Gate personalizzata
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `gate` <Badge type="tip" text="Novità in 2.0" />

**Default:** `env('LINGUA_GATE', null)`

Quando impostato, Lingua aggiunge `can:{gate}` a tutte le route admin.
Definisci il gate in un service provider:

```env
LINGUA_GATE=manage-translations
```

```php
Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

Vedi il [riferimento sulla sicurezza](/it/guide/security#autenticazione).

---

## Routing

```php
'routes_prefix'           => 'lingua',
'routes_extra_parameters' => null,  // ★ Novità in 2.0
'navigate'                => false, // ★ Novità in 2.0 (default modificato)
'layout'                  => null,  // ★ Novità in 2.0
```

### `routes_prefix`

**Default:** `'lingua'`

Cambia il prefisso URL per tutte le pagine di gestione di Lingua:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
```

### `routes_extra_parameters` <Badge type="tip" text="Novità in 2.0" />

**Default:** `null`

Suffisso parametrizzato opzionale aggiunto al prefisso della route — utile
per prefissi con scope tenant o sezione.

### `navigate` <Badge type="tip" text="Novità in 2.0" />

**Default:** `false` <Badge type="warning" text="Modificato in 2.0" />

Controlla `wire:navigate` sui link interni di Lingua. Il default è ora
`false` (redirect a pagina intera), che evita i casi limite della
navigazione SPA. Opta per `'navigate' => true` per abilitarlo.

### `layout` <Badge type="tip" text="Novità in 2.0" />

**Default:** `null`

Fornisce un layout Blade personalizzato per le viste di Lingua. Lascia `null`
per usare il layout integrato del pacchetto.

---

## Navigazione

```php
'nav' => [
    'enabled' => true, // ★ Novità in 2.0
],
'links' => [
    'translations' => [          // ★ Novità in 2.0
        'enabled' => true,
        'route'   => 'lingua.translations',
    ],
],
```

### `nav.enabled` <Badge type="tip" text="Novità in 2.0" />

**Default:** `true`

Attiva/disattiva il menu di navigazione condiviso `x-lingua::nav` che appare
su tutte e cinque le pagine di Lingua. Può essere attivato/disattivato anche
dall'interfaccia Impostazioni.

### `links.translations` <Badge type="tip" text="Novità in 2.0" />

Controlla la voce "Translations" nella navigazione condivisa: se è mostrata
(`enabled`) e quale route punta (`route`).

---

## UI

```php
'ui' => [
    'sticky_top' => 0, // ★ Novità in 2.0
],
'selector' => [
    'mode'       => 'sidebar',  // 'sidebar' | 'modal' | 'dropdown' | 'headless'
    'show_flags' => true,
],
'editor' => [
    'headings' => false, 'bold' => true, 'italic' => true,
    'underline' => true, 'strikethrough' => false,
    'subscript' => true, 'superscript' => true,
    'blockquote' => false, 'code-line' => false, 'code-block' => false,
    'bullet' => true, 'ordered' => true, 'clear' => true, 'code-mode' => false,
],
```

### `ui.sticky_top` <Badge type="tip" text="Novità in 2.0" />

**Default:** `0`

Offset in pixel per le toolbar fisse di Lingua. Aumentalo se la tua app ha
un header fisso per evitare che le toolbar scorrano sotto di esso.

### `selector.mode`

**Default:** `'sidebar'`

| Valore | Descrizione |
|---|---|
| `sidebar` | Elemento di navigazione raggruppato nella sidebar |
| `dropdown` | Pulsante dropdown compatto |
| `modal` | Pulsante che apre una modale di selezione locale |
| `headless` | Nessun rendering integrato — usa il componente headless |

### `selector.show_flags`

**Default:** `true`

Se mostrare le icone delle bandiere dei paesi accanto ai nomi delle lingue.

### `editor`

Controlla la toolbar di testo ricco per i tipi di traduzione HTML e Markdown
(solo driver database). Ogni chiave attiva/disattiva un'opzione di
formattazione: `headings`, `bold`, `italic`, `underline`, `strikethrough`,
`subscript`, `superscript`, `blockquote`, `code-line`, `code-block`,
`bullet`, `ordered`, `clear`, `code-mode`.

---

## Aspetto <Badge type="tip" text="Novità" />

```php
'dark_mode' => [
    'force' => env('LINGUA_FORCE_DARK_MODE', false),
],
```

### `dark_mode.force` <Badge type="tip" text="Novità" />

**Default:** `env('LINGUA_FORCE_DARK_MODE', false)`

Il CSS di Lingua usa una variante `dark:` basata su classe
(`&:where(.dark, .dark *)`), quindi normalmente segue l'ancestor
`<html class="dark">` della tua app host — la stessa convenzione della
strategia a classe predefinita di Tailwind. Se la tua app host non ha un
toggle dark mode basato su classe (o il suo stato non corrisponde alla
reale preferenza del sistema operativo/browser), lo stile di Lingua può
apparire non stilizzato anche se il resto della pagina appare corretto.

Imposta `force` a `true` per far sì che Lingua mostri sempre il proprio
tema scuro, indipendentemente dall'app host o dal tema del sistema
operativo. Utile quando integri Lingua in un'app host priva di toggle
dark mode, o durante lo sviluppo locale su un sistema in modalità chiara.
Può anche essere attivato in tempo reale dall'
[interfaccia Impostazioni](/it/features/settings#aspetto), che ha
priorità su questo valore di default in config.

```ini
LINGUA_FORCE_DARK_MODE=true
```

---

## Driver di archiviazione <Badge type="tip" text="Novità in 2.0" />

```php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

### `storage.driver`

**Default:** `env('LINGUA_STORAGE_DRIVER', 'database')`

Seleziona dove risiedono le traduzioni:

| Driver | Comportamento |
|---|---|
| `database` | Il comportamento completo della versione 1.x: tabella `language_lines`, tipi HTML/Markdown, statistiche, import/export, protezione vendor, cache chirurgica. |
| `file` | Legge/scrive direttamente i file PHP+JSON in `lang/`; nessuna tabella `language_lines`; i tipi si appiattiscono a testo semplice. |

Questa è una funzionalità importante — vedi [Driver di archiviazione](/it/guide/storage)
per il confronto completo e il comando `lingua:storage`.

---

## Cache

```php
'cache' => [
    'store'  => env('LINGUA_CACHE_STORE', null),       // ★ Novità in 2.0
    'prefix' => env('LINGUA_CACHE_PREFIX', 'lingua.trans'), // ★ Novità in 2.0
],
```

### `cache.store` <Badge type="tip" text="Novità in 2.0" />

**Default:** `env('LINGUA_CACHE_STORE', null)`

Quale store di cache usa Lingua per il caching delle traduzioni. `null` usa
lo store predefinito della tua applicazione.

### `cache.prefix` <Badge type="tip" text="Novità in 2.0" />

**Default:** `env('LINGUA_CACHE_PREFIX', 'lingua.trans')`

Prefisso per le chiavi di cache. Lingua memorizza in cache le traduzioni
**chirurgicamente** per `(locale, gruppo)` e dimentica solo la chiave
interessata in fase di scrittura — non esiste un `cache:clear` globale. Vedi
[Architettura della cache](/it/guide/architecture#architettura-della-cache).

---

## Translation loader

```php
'translation_loaders' => [
    // Rivalex\Lingua\Loaders\YourCustomLoader::class,
],
'model'               => Rivalex\Lingua\Models\Translation::class,
'translation_manager' => Rivalex\Lingua\TranslationManager\LinguaManager::class,
```

### `translation_loaders`

Registra loader aggiuntivi che implementano
`Rivalex\Lingua\Contracts\TranslationLoader`. La firma del contratto è
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### `model`

Il modello Eloquent che supporta `language_lines`. Sovrascrivi per estendere
`Translation` con la tua logica.

### `translation_manager`

La classe del translation loader. Il default è
`Rivalex\Lingua\TranslationManager\LinguaManager`, che estende
`Illuminate\Translation\FileLoader`.

---

## Estensioni

```php
'extensions' => [
    'enabled' => env('LINGUA_EXTENSIONS_ENABLED', true), // ★ Novità in 2.0
],
'suppress_pro_nudge' => env('LINGUA_SUPPRESS_PRO_NUDGE', false), // ★ Novità in 2.0
'pro_upgrade_url'    => env('LINGUA_PRO_UPGRADE_URL', 'https://lingua.rivalex.dev'), // ★ Novità in 2.0
```

### `extensions.enabled` <Badge type="tip" text="Novità in 2.0" />

**Default:** `true`

Interruttore principale per le estensioni opzionali di Lingua.

### `suppress_pro_nudge` <Badge type="tip" text="Novità in 2.0" />

**Default:** `false`

Imposta a `true` per nascondere i suggerimenti di aggiornamento nell'interfaccia.

### `pro_upgrade_url` <Badge type="tip" text="Novità in 2.0" />

**Default:** `https://lingua.rivalex.dev`

URL usato dai suggerimenti di aggiornamento quando mostrati.
