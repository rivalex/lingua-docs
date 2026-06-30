# How It Works

Understanding Lingua's internals makes it easier to configure, debug, and
extend.

## Request lifecycle

```
Browser request
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware       │  Reads 'locale' from session
│  app()->setLocale($locale)  │  Falls back to DB default
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│        Your Controller      │
│  __('auth.failed')          │  Standard Laravel helper
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  extends Illuminate FileLoader
│  DB translations merged over │  DB always wins on overlap
│  file translations (DB mode) │  (file mode = plain FileLoader)
└───┬─────────────────────────┘
    │
    ▼
Translated string returned
```

## Translation loading

`LinguaManager` extends Laravel's own
`Illuminate\Translation\FileLoader` — there is **no** Spatie dependency.
It is registered by decorating the framework's loader binding:

```php
$app->extend('translation.loader', function ($original, $app) {
    return new LinguaManager($app, $original);
});
```

In **database mode**, for each `(locale, group)` it loads the file-based
translations via the original loader, then merges the database values on
top using `array_replace_recursive`. **The database value always wins** on
overlap, so you can override any vendor or file string without touching
source files.

If the `language_lines` table does not exist yet (e.g. before migrations
have run), a `QueryException` is caught and `LinguaManager` gracefully
falls back to file-only mode.

In **file mode**, `LinguaManager` behaves like the standard `FileLoader` —
no database queries are made. See [Storage Drivers](/en/guide/storage).

## Middleware

`LinguaMiddleware` is automatically appended to the `web` middleware group
at boot via `LinguaServiceProvider`. It runs on every web request:

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

`LinguaServiceProvider` does the following at boot:

1. **Registers Blade anonymous components** under the `lingua::` prefix
2. **Registers Livewire components** under the `lingua::` namespace
3. **Decorates the `translation.loader` binding** via `$app->extend(...)`,
   wrapping Laravel's loader with `LinguaManager`

Because the provider *decorates* rather than *replaces* the core loader,
it composes cleanly with Laravel's `TranslationServiceProvider`. Composer's
autoload order handles boot ordering automatically.

## Database schema

Three tables are used (the `file` driver omits `language_lines`):

### `languages`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `code` | string | ISO 639-1 code (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Full regional code (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` or `'standard'` |
| `name` | string | English display name (`French`) |
| `native` | string | Native name (`Français`) |
| `direction` | string | `'ltr'` or `'rtl'` |
| `is_default` | boolean | Only one row should be `true` |
| `sort` | integer | Display order (auto-assigned) |

### `language_lines`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `group` | string | Translation group (`auth`, `validation`, `single`) |
| `key` | string | Translation key (`failed`, `required`) |
| `text` | json, **nullable** | `{"en": "…", "fr": "…"}` |
| `type` | string | `'text'`, `'html'`, or `'markdown'` |
| `is_vendor` | boolean | `true` for third-party package strings |
| `vendor` | string, nullable | Vendor name (e.g. `laravel`) |

The JSON `text` column stores **all locales in a single row**:

- Adding a new locale never changes the schema
- A single query fetches all locale values for a key
- Missing locales simply have no key in the JSON object

### `lingua_settings`

Key/value table backing the Settings UI (e.g. the shared-nav toggle).

## Bundled dataset

Lingua 2.0 ships all locale data inside the package:

- **`LocaleRegistry`** (`Rivalex\Lingua\Locales\LocaleRegistry`) — metadata
  for 129+ locales. `Lingua::info($locale)` returns a readonly
  `LocaleInfo` value object (`->name`, `->native`, `->direction`,
  `->regional`, `->code`, `->type`), or `null` for unknown locales.
- **Bundled translations** — 26 locales × 7 groups, 5902 strings, aligned
  to Laravel **v13.14.0**. A `NotificationProjector` derives notification
  strings. `lingua:add` seeds from this dataset with no network calls.

## Cache architecture

In database mode, Lingua caches translations **surgically** per
`(locale, group)`:

- Keys look like `lingua.trans.{locale}.{group}`
- On a `Translation` save/delete, only `Cache::forget('lingua.trans.{locale}.{group}')`
  for the affected keys runs — there is **no** global `cache:clear` in any
  sync path
- Store and prefix are configurable via `cache.store` / `cache.prefix`

## Models

| Model | Table | Extends |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `Illuminate\Database\Eloquent\Model` |

`Translation` provides `getTranslationsForGroup()`, sync helpers,
statistics helpers, and `forgetTranslation()` — which throws
`VendorTranslationProtectedException` for vendor rows. The
`scopeOrdered()` query scope replaces the old `scopeActive()` (a delegate
is retained for backward compatibility).
