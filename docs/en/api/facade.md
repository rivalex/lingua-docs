# Lingua Facade

The `Lingua` facade provides static access to the full Lingua service from anywhere in your application.

```php
use Rivalex\Lingua\Facades\Lingua;
```

::: tip Storage-driver aware
Every method below works identically whether Lingua is running on the **database** or **file** storage driver. Reads and writes are routed through the active `TranslationRepository`, so your code never needs to know which backend is in use.
:::

---

## Locale helpers

### `getLocale(): string`

Returns the current application locale code. Mirrors `app()->getLocale()`.

```php
Lingua::getLocale(); // 'en'
```

---

### `getDefaultLocale(): string`

Returns the locale code of the language marked as default. Falls back to `config('lingua.default_locale', 'en')` when no default is set.

```php
Lingua::getDefaultLocale(); // 'en'
```

---

### `isDefaultLocale(?string $locale = null): bool`

Returns `true` if the given locale (or the current locale when `null`) is the system default. Never throws on an unknown locale.

```php
Lingua::isDefaultLocale();       // true  (current locale is default)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (unknown locale, no exception)
```

---

### `setDefaultLocale(string $locale): void`

Marks the given locale as the system default and clears the flag on all others. Throws `ModelNotFoundException` if the locale is not installed.

```php
Lingua::setDefaultLocale('fr');
```

---

### `hasLocale(string $locale): bool`

Returns `true` if a `Language` record exists for the given code or regional value.

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (matched by regional)
Lingua::hasLocale('xx');     // false
```

---

### `getLocaleName(?string $locale = null): string`

Returns the English display name of the locale, or `''` if not found.

```php
Lingua::getLocaleName();       // 'English'  (current locale)
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('zz');   // ''
```

---

### `getLocaleNative(?string $locale = null): string`

Returns the native name of the locale, or `''` if not found.

```php
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

---

### `getDirection(?string $locale = null): string`

Returns `'ltr'` or `'rtl'`. Defaults to `'ltr'` if the locale is not found.

```php
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (safe fallback)
```

---

### `info(mixed $locale): ?LocaleInfo` <Badge type="tip" text="Changed in 2.0" />

Returns a `Rivalex\Lingua\Locales\LocaleInfo` value object for the locale, resolved from the **bundled locale registry** — no external `laravel-lang` lookup. Returns `null` when the locale is unknown.

```php
use Rivalex\Lingua\Locales\LocaleInfo;

$info = Lingua::info('en-US');

if ($info === null) {
    // Unknown locale — handle the miss
    return;
}

$info->code;       // 'en'
$info->regional;   // 'en_US'  (nullable)
$info->type;       // 'Latn'   (script type)
$info->name;       // 'English' (English display name)
$info->native;     // 'English' (native display name)
$info->direction;  // 'ltr' | 'rtl'
```

`LocaleInfo` is an immutable `final readonly` object:

| Property | Type | Description |
|---|---|---|
| `code` | `string` | ISO language code (`en`, `ar`) |
| `regional` | `?string` | Regional code (`en_US`), nullable |
| `type` | `string` | Script type (`Latn`, `Arab`) |
| `name` | `string` | English display name |
| `native` | `string` | Native display name |
| `direction` | `string` | `'ltr'` or `'rtl'` |

::: warning Migrating from 1.x
In 1.x, `info()` returned a `LaravelLang\LocaleData\LocaleData` object and accepted `$withCountry` / `$withCurrency` flags. Those flags are gone, and the return type is now Lingua's own `LocaleInfo` with different field names. Always guard for `null`.
:::

---

## Language management

### `languages(): Collection`

Returns a collection of all installed `Language` models.

```php
foreach (Lingua::languages() as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

Returns the `Language` model for the given code, or `null`.

```php
$lang = Lingua::get('fr');
$lang?->name; // 'French'
```

---

### `getDefault(): ?Language`

Returns the `Language` model marked as default.

```php
Lingua::getDefault()?->code; // 'en'
```

---

### `getFallback(): ?Language`

Returns the `Language` model for `app()->getFallbackLocale()`.

```php
Lingua::getFallback();
```

---

### `languagesWithStatistics(): Collection`

Returns all `Language` models enriched with translation statistics.

```php
foreach (Lingua::languagesWithStatistics() as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

Each model gains four read-only attributes: `total_strings`, `translated_strings`, `missing_strings`, `completion_percentage`.

---

### `addLanguage(string $locale): void` <Badge type="tip" text="Changed in 2.0" />

Installs a locale **DB-native**: validates the code, looks it up in the bundled registry, creates the `Language` row, projects notification strings, and seeds the locale's storage via the active repository. No GitHub download, no `lang:add`.

```php
Lingua::addLanguage('it');
```

Throws `InvalidArgumentException` when the code is malformed or unknown to the registry.

---

### `removeLanguage(string $locale): void` <Badge type="tip" text="Changed in 2.0" />

Removes a locale **DB-native**: un-projects its notification strings and deletes its `Language` row. No filesystem writes.

```php
Lingua::removeLanguage('it');
```

---

### `installDefaultLanguage(): void` <Badge type="tip" text="New in 2.0" />

Creates or updates the default `Language` record (`is_default = true`) and seeds its storage. Used by `lingua:install` (file-mode branch) and by the Languages page when it mounts in file mode with no languages configured.

```php
Lingua::installDefaultLanguage();
```

---

## Locale availability checks

### `available(): array`

Returns all locale codes known to the bundled registry (installed + not installed).

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', …]
```

### `installed(): array`

Returns locale codes currently in the `languages` table.

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

### `notInstalled(): array`

Returns available-but-uninstalled codes, sorted alphabetically.

### `isInstalled(?string $locale = null): bool`

```php
Lingua::isInstalled('en');   // true
Lingua::isInstalled('xx');   // false
```

### `isAvailable(?string $locale = null): bool`

Returns `true` if the locale is known to the registry but **not** yet installed.

```php
Lingua::isAvailable('de');   // true  (available, not installed)
Lingua::isAvailable('en');   // false (already installed)
```

---

## Translation access

### `translations(): Collection`

Returns all translation lines (vendor lines included).

### `getTranslations(?string $key): array`

Returns all locale values for a key as an associative array, or `[]`.

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants ne correspondent pas.']
```

### `getTranslation(?string $key, ?string $locale = null): string`

Returns the translated string for a key and locale (current locale when `null`). Returns `''` if not found.

```php
Lingua::getTranslation('auth.failed');         // current locale
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('nonexistent', 'en');   // ''
```

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

Returns all lines in a group, optionally filtered to those with a value for the given locale.

```php
Lingua::getTranslationByGroup('validation');        // all validation strings
Lingua::getTranslationByGroup('validation', 'fr');  // only those with a French value
```

### `getLocaleStats(?string $locale = null): array`

Returns translation statistics for the locale.

```php
Lingua::getLocaleStats('fr');
// ['total' => 1240, 'translated' => 980, 'missing' => 260, 'percentage' => 79.03]
```

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

Saves a translation value. Does nothing if the key does not exist.

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
```

### `forgetTranslation(?string $key, ?string $locale = null): void`

Removes a locale's value from a key. If the locale is the default, the entire record is deleted. Throws `VendorTranslationProtectedException` for vendor lines.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // removes 'fr' value only
Lingua::forgetTranslation('custom.key', 'en');  // deletes the whole record (default locale)
```

---

## Vendor translations

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$french  = Lingua::getVendorTranslations('laravel', 'fr');
```

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

Updates a vendor translation value. Throws `ModelNotFoundException` if the record does not exist.

```php
Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'The :attribute field is mandatory.',
    locale: 'en',
);
```

::: warning Vendor protection
Vendor lines are read-mostly. They can be updated via `setVendorTranslation()` but cannot be deleted through `forgetTranslation()` — attempting to do so throws `VendorTranslationProtectedException`.
:::

---

## Sync & maintenance

### `syncToDatabase(): void`

Imports all local `lang/` files into the database.

```php
Lingua::syncToDatabase();
```

### `syncToLocal(): void`

Exports all database translations to local `lang/` files.

```php
Lingua::syncToLocal();
```

### `updateLanguages(): void`

Re-syncs local language files to the database for all installed languages. Returns early when no languages are installed. (No `laravel-lang` network fetch.)

```php
Lingua::updateLanguages();
```

---

## Helper functions

Lingua also ships free-standing helper functions (always available, no facade needed):

| Helper | Returns | Description |
|---|---|---|
| `linguaDefaultLocale(): string` | `string` | App fallback locale, or `config('lingua.default_locale')` |
| `linguaStorageDriver(): string` | `'database' \| 'file'` | The active storage driver (config-only read) |
| `linguaIsFileMode(): bool` | `bool` | `true` when the file driver is active |
| `linguaAssetUrl(string $path): string` | `string` | Cache-busted URL for a compiled package asset |
| `linguaLanguageCode(?string $locale = null): string` | `string` | Locale lowercased with `_` → `-` (e.g. `en-us`) |

```php
if (linguaIsFileMode()) {
    // running from version-controlled lang/ files
}

$driver = linguaStorageDriver(); // 'database'
```

---

## Deprecated

### `optimize(): void` <Badge type="warning" text="Deprecated" />

Clears the application cache via `optimize:clear`.

```php
Lingua::optimize();
```

::: warning Deprecated in 2.0
Translation cache is now invalidated per-`(locale, group)` by model hooks and the sync finally-block, so a full cache wipe is no longer needed. `optimize()` is retained for backward compatibility only — **remove calls to it**; they wipe the entire host-app cache for no benefit.
:::
