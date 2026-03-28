# Lingua Facade

`Lingua` facade आपके application में कहीं से भी पूरे Lingua service तक static access प्रदान करता है।

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## Locale helpers

### `getLocale()`

वर्तमान application locale code return करता है।

```php
Lingua::getLocale(); // 'en'
```

`app()->getLocale()` को mirror करता है।

---

### `getDefaultLocale()`

डेटाबेस में default के रूप में marked भाषा का locale code return करता है।

```php
Lingua::getDefaultLocale(); // 'en'
```

यदि कोई default set नहीं है तो `config('lingua.default_locale', 'en')` पर fallback करता है।

---

### `isDefaultLocale(?string $locale = null): bool`

`true` return करता है यदि दिया हुआ locale (या `null` होने पर वर्तमान locale) system default है।

```php
Lingua::isDefaultLocale();       // true  (वर्तमान locale default है)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (अज्ञात locale, कोई exception नहीं)
```

---

### `hasLocale(string $locale): bool`

`true` return करता है यदि दिए हुए code या regional value के लिए `Language` रिकॉर्ड मौजूद है।

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (regional द्वारा matched)
Lingua::hasLocale('xx');     // false
```

---

### `setDefaultLocale(string $locale): void`

दिए हुए locale को system default के रूप में mark करता है। यदि locale install नहीं है तो `ModelNotFoundException` throw करता है।

```php
Lingua::setDefaultLocale('fr');
```

---

### `getLocaleName(?string $locale = null): string`

Locale का अंग्रेज़ी display name return करता है। नहीं मिलने पर `''` return करता है।

```php
Lingua::getLocaleName();       // 'English'  (वर्तमान locale)
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
Lingua::getLocaleName('zz');   // ''
```

---

### `getLocaleNative(?string $locale = null): string`

Locale का native नाम return करता है। नहीं मिलने पर `''` return करता है।

```php
Lingua::getLocaleNative();       // 'English'
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

---

### `getDirection(?string $locale = null): string`

दिए हुए locale के लिए `'ltr'` या `'rtl'` return करता है। Locale नहीं मिलने पर `'ltr'` default करता है।

```php
Lingua::getDirection();        // 'ltr'  (वर्तमान locale)
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (safe fallback)
```

---

### `info(mixed $locale, bool $withCountry = false, bool $withCurrency = false): LocaleData`

`laravel-lang/locales` से detailed locale information के साथ एक `LocaleData` object return करता है।

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

सभी installed `Language` models का collection return करता है।

```php
$languages = Lingua::languages();
foreach ($languages as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

दिए हुए locale code के लिए `Language` model return करता है, या नहीं मिलने पर `null`।

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

---

### `getDefault(): ?Language`

Default के रूप में marked `Language` model return करता है।

```php
$default = Lingua::getDefault();
$default?->code;       // 'en'
$default?->is_default; // true
```

---

### `getFallback(): ?Language`

`app()->getFallbackLocale()` के लिए `Language` model return करता है।

```php
$fallback = Lingua::getFallback();
```

---

### `languagesWithStatistics(): Collection`

Translation statistics के साथ enriched सभी `Language` models return करता है।

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Missing: {$lang->missing_strings} / {$lang->total_strings}";
}
```

प्रत्येक model चार read-only attributes प्राप्त करता है:

| Attribute | Type | विवरण |
|---|---|---|
| `total_strings` | `int` | `language_lines` में कुल rows |
| `translated_strings` | `int` | इस locale के लिए value वाली rows |
| `missing_strings` | `int` | `total - translated` |
| `completion_percentage` | `float` | `translated / total * 100` |

---

## Locale availability checks

### `available(): array`

`laravel-lang/locales` को ज्ञात सभी locale codes return करता है (installed + not installed)।

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', 'bn', …]
```

---

### `installed(): array`

वर्तमान में `languages` टेबल में locale codes return करता है।

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

---

### `notInstalled(): array`

उपलब्ध लेकिन uninstalled locale codes, alphabetically sorted, return करता है।

```php
Lingua::notInstalled(); // ['af', 'ar', 'az', …] (सब 'en', 'fr', 'it' को छोड़कर)
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

`true` return करता है यदि locale laravel-lang को ज्ञात है लेकिन **अभी install नहीं हुआ**।

```php
Lingua::isAvailable('de');   // true  (उपलब्ध, install नहीं)
Lingua::isAvailable('en');   // false (पहले से install)
Lingua::isAvailable(null);   // false
```

---

## Translation reads

### `translations(): Collection`

सभी `Translation` models return करता है।

```php
$all = Lingua::translations();
```

---

### `getTranslations(?string $key): array`

एक translation key के लिए सभी locale values को associative array के रूप में return करता है।

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants ne correspondent pas.']

Lingua::getTranslations('nonexistent'); // []
```

---

### `getTranslation(?string $key, ?string $locale = null): string`

एक key और locale के लिए translated string return करता है। नहीं मिलने पर `''` return करता है।

```php
Lingua::getTranslation('auth.failed');         // वर्तमान locale
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('auth.failed', 'zz');   // ''
Lingua::getTranslation('nonexistent', 'en');   // ''
```

---

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

एक group में सभी `Translation` models return करता है, वैकल्पिक रूप से केवल उन्हें जिनमें दिए हुए locale के लिए value है।

```php
// सभी validation strings
Lingua::getTranslationByGroup('validation');

// केवल validation strings जिनमें French translation है
Lingua::getTranslationByGroup('validation', 'fr');
```

---

### `getLocaleStats(?string $locale = null): array`

दिए हुए locale (या `null` होने पर वर्तमान locale) के लिए translation statistics return करता है।

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

एक translation value save करता है। यदि key मौजूद नहीं है तो कुछ नहीं करता।

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
Lingua::setTranslation('auth.failed', 'Updated message');  // वर्तमान locale
```

---

### `forgetTranslation(?string $key, ?string $locale = null): void`

एक translation key से locale की value remove करता है। यदि locale default है, तो पूरा रिकॉर्ड delete होता है। Vendor translations के लिए `VendorTranslationProtectedException` throw करता है।

```php
Lingua::forgetTranslation('custom.key', 'fr');  // केवल 'fr' value remove करता है
Lingua::forgetTranslation('custom.key', 'en');  // पूरा record delete करता है (default locale)
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

एक vendor translation value update करता है। यदि record मौजूद नहीं है तो `ModelNotFoundException` throw करता है।

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

`lang:add` के माध्यम से दिए हुए locale के लिए language files install करता है।

```php
Lingua::addLanguage('fr');
```

> यह केवल files install करता है। पूरे orchestrated flow (files + DB record + sync) के लिए `php artisan lingua:add {locale}` का उपयोग करें।

---

### `removeLanguage(string $locale): void`

`lang:rm --force` के माध्यम से दिए हुए locale के लिए language files remove करता है।

```php
Lingua::removeLanguage('fr');
```

> यह केवल files remove करता है। पूरे orchestrated flow (files + translations + DB record + reorder) के लिए `php artisan lingua:remove {locale}` का उपयोग करें।

---

## Sync & maintenance

### `syncToDatabase(): void`

सभी local `lang/` files को डेटाबेस में import करता है।

```php
Lingua::syncToDatabase();
```

---

### `syncToLocal(): void`

सभी database translations को local `lang/` files में export करता है।

```php
Lingua::syncToLocal();
```

---

### `updateLanguages(): void`

`laravel-lang` से latest translations fetch करने के लिए `lang:update` चलाता है।

```php
Lingua::updateLanguages();
```

---

### `optimize(): void`

`optimize:clear` के माध्यम से application cache clear करता है।

```php
Lingua::optimize();
```
