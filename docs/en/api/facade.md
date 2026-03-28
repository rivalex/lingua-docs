# Lingua Facade

The `Lingua` facade provides static access to the full Lingua service from anywhere in your application.

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## Locale helpers

### `getLocale()`

Returns the current application locale code.

```php
Lingua::getLocale(); // 'en'
```

Mirrors `app()->getLocale()`.

---

### `getDefaultLocale()`

Returns the locale code of the language marked as default in the database.

```php
Lingua::getDefaultLocale(); // 'en'
```

Falls back to `config('lingua.default_locale', 'en')` if no default is set.

---

### `isDefaultLocale(?string $locale = null): bool`

Returns `true` if the given locale (or the current locale when `null`) is the system default.

```php
Lingua::isDefaultLocale();       // true  (current locale is default)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (unknown locale, no exception)
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

### `setDefaultLocale(string $locale): void`

Marks the given locale as the system default. Throws `ModelNotFoundException` if the locale is not installed.

```php
Lingua::setDefaultLocale('fr');
```

---

### `getLocaleName(?string $locale = null): string`

Returns the English display name of the locale. Returns `''` if not found.

```php
Lingua::getLocaleName();       // 'English'  (current locale)
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
Lingua::getLocaleName('zz');   // ''
```

---

### `getLocaleNative(?string $locale = null): string`

Returns the native name of the locale. Returns `''` if not found.

```php
Lingua::getLocaleNative();       // 'English'
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

---

### `getDirection(?string $locale = null): string`

Returns `'ltr'` or `'rtl'` for the given locale. Defaults to `'ltr'` if the locale is not found.

```php
Lingua::getDirection();        // 'ltr'  (current locale)
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (safe fallback)
```

---

### `info(mixed $locale, bool $withCountry = false, bool $withCurrency = false): LocaleData`

Returns a `LocaleData` object from `laravel-lang/locales` with detailed locale information.

```php
$info = Lingua::info('fr');
$info->code;          // 'fr'
$info->native;        // 'Français'
$info->direction;     // Direction enum

$info = Lingua::info('en-US', withCountry: true, withCurrency: true);
$info->native;        // 'English (United States)'
```

---

## Language queries

### `languages(): Collection`

Returns a collection of all installed `Language` models.

```php
$languages = Lingua::languages();
foreach ($languages as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

Returns the `Language` model for the given locale code, or `null` if not found.

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

---

### `getDefault(): ?Language`

Returns the `Language` model marked as default.

```php
$default = Lingua::getDefault();
$default?->code;       // 'en'
$default?->is_default; // true
```

---

### `getFallback(): ?Language`

Returns the `Language` model for `app()->getFallbackLocale()`.

```php
$fallback = Lingua::getFallback();
```

---

### `languagesWithStatistics(): Collection`

Returns all `Language` models enriched with translation statistics.

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Missing: {$lang->missing_strings} / {$lang->total_strings}";
}
```

Each model gains four read-only attributes:

| Attribute | Type | Description |
|---|---|---|
| `total_strings` | `int` | Total rows in `language_lines` |
| `translated_strings` | `int` | Rows with a value for this locale |
| `missing_strings` | `int` | `total - translated` |
| `completion_percentage` | `float` | `translated / total * 100` |

---

## Locale availability checks

### `available(): array`

Returns all locale codes known to `laravel-lang/locales` (installed + not installed).

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', 'bn', …]
```

---

### `installed(): array`

Returns locale codes currently in the `languages` table.

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

---

### `notInstalled(): array`

Returns available but uninstalled locale codes, sorted alphabetically.

```php
Lingua::notInstalled(); // ['af', 'ar', 'az', …] (all except 'en', 'fr', 'it')
```

---

### `isInstalled(?string $locale = null): bool`

```php
Lingua::isInstalled('en');   // true
Lingua::isInstalled('xx');   // false
Lingua::isInstalled(null);   // false
```

---

### `isAvailable(?string $locale = null): bool`

Returns `true` if the locale is known to laravel-lang but **not** yet installed.

```php
Lingua::isAvailable('de');   // true  (available, not installed)
Lingua::isAvailable('en');   // false (already installed)
Lingua::isAvailable(null);   // false
```

---

## Translation reads

### `translations(): Collection`

Returns all `Translation` models.

```php
$all = Lingua::translations();
```

---

### `getTranslations(?string $key): array`

Returns all locale values for a translation key as an associative array.

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants ne correspondent pas.']

Lingua::getTranslations('nonexistent'); // []
```

---

### `getTranslation(?string $key, ?string $locale = null): string`

Returns the translated string for a key and locale. Returns `''` if not found.

```php
Lingua::getTranslation('auth.failed');         // current locale
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('auth.failed', 'zz');   // ''
Lingua::getTranslation('nonexistent', 'en');   // ''
```

---

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

Returns all `Translation` models in a group, optionally filtered to those with a value for the given locale.

```php
// All validation strings
Lingua::getTranslationByGroup('validation');

// Only validation strings that have a French translation
Lingua::getTranslationByGroup('validation', 'fr');
```

---

### `getLocaleStats(?string $locale = null): array`

Returns translation statistics for the given locale (or current locale when `null`).

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

Lingua::getLocaleStats('zz');
// ['total' => 1240, 'translated' => 0, 'missing' => 1240, 'percentage' => 0.0]
```

---

## Translation writes

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

Saves a translation value. Does nothing if the key does not exist.

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
Lingua::setTranslation('auth.failed', 'Updated message');  // current locale
```

---

### `forgetTranslation(?string $key, ?string $locale = null): void`

Removes a locale's value from a translation key. If the locale is the default, the entire record is deleted. Throws `VendorTranslationProtectedException` for vendor translations.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // removes 'fr' value only
Lingua::forgetTranslation('custom.key', 'en');  // deletes the entire record (default locale)
```

---

## Vendor translation helpers

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frenchSpatie = Lingua::getVendorTranslations('spatie', 'fr');
```

---

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

Updates a vendor translation value. Throws `ModelNotFoundException` if the record does not exist.

```php
Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'The :attribute field is mandatory.',
    locale: 'en'
);
```

---

## Language lifecycle

### `addLanguage(string $locale): void`

Installs language files for the given locale via `lang:add`.

```php
Lingua::addLanguage('fr');
```

> This only installs files. Use `php artisan lingua:add {locale}` for the full orchestrated flow (files + DB record + sync).

---

### `removeLanguage(string $locale): void`

Removes language files for the given locale via `lang:rm --force`.

```php
Lingua::removeLanguage('fr');
```

> This only removes files. Use `php artisan lingua:remove {locale}` for the full orchestrated flow (files + translations + DB record + reorder).

---

## Sync & maintenance

### `syncToDatabase(): void`

Imports all local `lang/` files into the database.

```php
Lingua::syncToDatabase();
```

---

### `syncToLocal(): void`

Exports all database translations to local `lang/` files.

```php
Lingua::syncToLocal();
```

---

### `updateLanguages(): void`

Runs `lang:update` to fetch the latest translations from `laravel-lang`.

```php
Lingua::updateLanguages();
```

---

### `optimize(): void`

Clears the application cache via `optimize:clear`.

```php
Lingua::optimize();
```
