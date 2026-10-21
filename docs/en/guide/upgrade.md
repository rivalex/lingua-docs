# Upgrading from 1.x to 2.0

Lingua 2.0 is a major release. This guide walks you through the migration
step by step, lists every breaking change, and answers the most common
questions.

## Why this is a major release

- **External dependencies removed.** `spatie/laravel-translation-loader`
  and `laravel-lang/common` are gone. Locale metadata and the translation
  dataset now ship inside the package.
- **Storage drivers added.** Choose `database` (the 1.x behaviour) or
  `file`. See [Storage Drivers](/en/guide/storage).
- **Comprehensive security hardening.** Secure by default, plus the F1–F9
  hardening pass. See [Security](/en/guide/security).
- **PHP floor raised** to 8.3+.

## Step-by-step migration

### 1. Update the package

```bash
composer update rivalex/lingua
```

Composer automatically removes `spatie/laravel-translation-loader`. If your
own `composer.json` lists `laravel-lang/common`:

```bash
composer remove laravel-lang/common
```

### 2. Re-publish and merge the config

```bash
php artisan vendor:publish --tag=lingua-config --force
```

Then merge the new keys into your existing config: `gate`,
`storage.driver`, `nav.enabled`, `navigate`, `routes_extra_parameters`,
`layout`, `links.translations`, `ui.sticky_top`, `cache.store`,
`cache.prefix`, `suppress_pro_nudge`, `pro_upgrade_url`,
`extensions.enabled`. See [Configuration](/en/guide/configuration).

### 3. Set the storage driver

```ini
LINGUA_STORAGE_DRIVER=database
```

```bash
php artisan config:clear
```

`database` is identical to 1.x behaviour.

### 4. Migrations

Migrations are now split into **three** files. If you upgraded from 1.x
with migrations already run, **no new migration is needed** — your tables
already exist. Only check for schema divergence if you previously published
and customised the combined migration.

### 5. Custom translation loaders

```php
// Before
use Spatie\TranslationLoader\TranslationLoaders\TranslationLoader;

// After
use Rivalex\Lingua\Contracts\TranslationLoader;
```

The signature is unchanged:
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### 6. Custom Translation model

```php
// Before
class Translation extends \Spatie\TranslationLoader\LanguageLine {}

// After
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $table = 'language_lines';

    public static function getTranslationsForGroup(string $locale, string $group): array
    {
        // …
    }
}
```

### 7. Type-hints

```php
// Before
use Spatie\TranslationLoader\TranslationLoaderManager;

// After
use Rivalex\Lingua\TranslationManager\LinguaManager;
```

### 8. Package authors (Testbench)

Remove the Spatie provider from `getPackageProviders()`:

```php
// Remove this line
Spatie\TranslationLoader\TranslationServiceProvider::class,
```

## Breaking changes reference

| Change | Detail |
|---|---|
| `Lingua::info()` return type <Badge type="warning" text="Breaking" /> | Now returns `?LocaleInfo`; yields `null` for unknown locales (was throwing). Guard with `if ($info === null)`. Field names differ from the old `LaravelLang\LocaleData`. |
| `addLanguage()` / `removeLanguage()` <Badge type="warning" text="Breaking" /> | No longer call `lang:add` / `lang:rm`. DB-native only — no file writes. |
| Middleware default <Badge type="warning" text="Breaking" /> | `['web', 'auth']` (was `['web']`). |
| `navigate` default <Badge type="warning" text="Breaking" /> | `false` (was `true`). |
| PHP floor <Badge type="warning" text="Breaking" /> | 8.3+ (was 8.2+). |
| `Language::scopeActive()` <Badge type="warning" text="Breaking" /> | Renamed `scopeOrdered()` (delegate retained for compat). |
| `Translation::forgetTranslation()` <Badge type="warning" text="Breaking" /> | Throws `VendorTranslationProtectedException` for vendor rows. |
| `Import $errors` <Badge type="warning" text="Breaking" /> | Renamed `$rowErrors`. |
| `optimize()` <Badge type="warning" text="Breaking" /> | Deprecated — remove all calls. |
| Nullable columns | `language_lines.text` and `languages.regional` are now nullable. |
| Migrations | Split into 3 files (was 1 combined). |
| `lingua-assets` tag | Removed — assets served via the `lingua.assets` route. |

## Quick checklist

- [ ] `composer update rivalex/lingua`
- [ ] Remove `laravel-lang/common` if present in your `composer.json`
- [ ] Re-publish config and merge new keys
- [ ] Set `LINGUA_STORAGE_DRIVER=database` and `php artisan config:clear`
- [ ] Update any custom loaders / models / type-hints (Spatie → Lingua)
- [ ] Replace `Lingua::info()` usages with a `null` guard
- [ ] Remove `optimize()` calls
- [ ] Rename `Import::$errors` references to `$rowErrors`
- [ ] Confirm middleware/gate match your access policy

## FAQ

**Will my translations be lost?**
No. With the `database` driver the behaviour and data are identical to
1.x. Your existing `language_lines` rows are untouched.

**Do I need to re-run migrations?**
No, if they were already run under 1.x. The tables already exist; the
3-file split only affects fresh installs.

**Can I still use file-based storage?**
Yes — that's the new `file` driver. Switch any time with
`php artisan lingua:storage file`. See
[Storage Drivers](/en/guide/storage).

**Is Flux still required?**
Yes. Lingua 2.0 requires `livewire/flux ^2.12`. Flux was **not** removed.

## Upgrading from 2.0 to 2.1

Lingua 2.1 supports Laravel **12 and 13**. Laravel 11 reached the end of
security support on March 12, 2026. Applications still on Laravel 11 stay on
Lingua 2.0.5, which Composer keeps selecting automatically; upgrade Laravel
before updating Lingua. There are no other breaking changes: no config,
migration or API change is needed.
