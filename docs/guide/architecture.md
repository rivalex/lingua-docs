# How It Works

Understanding Lingua's internals makes it easier to configure, debug, and extend.

## Request lifecycle

```
Browser request
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware        │  Reads 'locale' from session
│  app()->setLocale($locale)   │  Falls back to DB default
└──────────────┬──────────────┘
               │
    ▼
┌─────────────────────────────┐
│        Your Controller       │
│  __('auth.failed')           │  Standard Laravel helper
└──────────────┬──────────────┘
               │
    ▼
┌─────────────────────────────┐
│       LinguaManager          │  Custom TranslationLoaderManager
│  1. DB loader (Spatie)       │  DB always wins on overlap
│  2. File loader (fallback)   │
└──────────────┬──────────────┘
               │
    ▼
Translated string returned
```

## Translation loading

`LinguaManager` extends Spatie's `TranslationLoaderManager`. At runtime it merges two sources:

1. **File loader** — reads from `lang/` as normal Laravel does
2. **Database loader** (Spatie's `Db` loader) — reads from `language_lines`

When the same key exists in both sources, **the database value wins**. This lets you override any vendor or file-based translation without touching source files.

If the `language_lines` table does not exist yet (e.g. before migrations have run), `LinguaManager` gracefully falls back to file-only mode.

## Middleware

`LinguaMiddleware` is automatically appended to the `web` middleware group at boot via `LinguaServiceProvider`. It runs on every web request:

```php
// Simplified logic
$locale = session()->get(config('lingua.session_variable'))
    ?? Language::default()?->code
    ?? config('app.locale');

app()->setLocale($locale);
app()->setFallbackLocale($defaultLocale);
session()->put(config('lingua.session_variable'), $locale);
```

## Service provider

`LinguaServiceProvider` does three things at boot:

1. **Registers Blade anonymous components** under the `lingua::` prefix
2. **Registers Livewire components** under the `lingua::` namespace
3. **Replaces the `translator` and `translation.loader` singletons** in the IoC container with Lingua's custom implementations

Because the service provider replaces the core translator binding, it is important that it boots *after* Laravel's `TranslationServiceProvider`. Composer's autoload order handles this automatically.

## Database schema

Two tables are used:

### `languages`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint (auto-increment) | Primary key |
| `code` | string | ISO 639-1 code (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Full regional code (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` or `'standard'` |
| `name` | string | English display name (`French`) |
| `native` | string | Native name (`Français`) |
| `direction` | string | `'ltr'` or `'rtl'` |
| `is_default` | boolean | Only one row should be `true` |
| `sort` | integer | Display order (auto-assigned) |

### `language_lines` (Spatie)

| Column | Type | Notes |
|---|---|---|
| `id` | bigint (auto-increment) | Primary key |
| `group` | string | Translation group (`auth`, `validation`, `single`) |
| `key` | string | Translation key (`failed`, `required`) |
| `text` | json | `{"en": "…", "fr": "…", "it": "…"}` |
| `type` | string | `'text'`, `'html'`, or `'markdown'` |
| `is_vendor` | boolean | `true` for third-party package strings |
| `vendor` | string, nullable | Vendor name (e.g. `spatie`, `laravel`) |

The JSON `text` column stores **all locales in a single row**. This design means:
- Adding a new locale never changes the schema
- A single query fetches all locale values for a key
- Missing locales simply have no key in the JSON object

## Seeder

`LinguaSeeder` is called once during `lingua:install`. It:

1. Reads `config('lingua.default_locale')` (defaults to `config('app.locale')`)
2. Fetches locale metadata from `laravel-lang/locales`
3. Creates a `Language` record with `is_default = true`
4. Calls `lingua:add {locale}` to install language files
5. Calls `lingua:sync-to-database` to import all strings

## Models

| Model | Table | Extends |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | Spatie's `LanguageLine` |

`Translation` inherits Spatie's `setTranslation()` and `forgetTranslation()` methods and adds Lingua-specific scopes, sync methods, and statistics helpers.
