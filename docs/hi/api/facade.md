# Lingua Facade

`Lingua` facade पूरे Lingua service तक static access प्रदान करता है।

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## Locale Helpers

### `currentLocale(): string`

Active locale return करता है।

```php
$locale = Lingua::currentLocale(); // "fr"
```

### `defaultLocale(): string`

Default locale return करता है (`languages` table में `is_default = true`)।

```php
$default = Lingua::defaultLocale(); // "en"
```

### `getDirection(?string $locale = null): string`

`"ltr"` या `"rtl"` return करता है। `null` = active locale।

```php
$dir = Lingua::getDirection();     // "ltr"
$dir = Lingua::getDirection('ar'); // "rtl"
```

### `info(string $locale): ?LocaleInfo`

Locale metadata return करता है। Unknown locale के लिए `null`।

```php
$info = Lingua::info('fr');

if ($info !== null) {
    $info->locale;    // "fr"
    $info->name;      // "French"
    $info->native;    // "Français"
    $info->direction; // "ltr"
}
```

::: warning 2.0 में बदला
1.x में unknown locale के लिए exception throw होता था। 2.0 में `null` return होता है।
:::

---

## Language Management

### `addLanguage(string $locale): Language`

नया locale install करता है और bundled dataset से seed करता है।

```php
$lang = Lingua::addLanguage('it');
```

### `removeLanguage(string $locale): bool`

Locale को uninstall करता है (language record + उस locale की सभी translation values)।

```php
Lingua::removeLanguage('it');
```

### `setDefaultLanguage(string $locale): bool`

Default locale बदलता है।

```php
Lingua::setDefaultLanguage('fr');
```

---

## Locale Availability

### `hasLocale(string $locale): bool`

Check करता है कि locale installed है या नहीं।

```php
if (Lingua::hasLocale('fr')) { ... }
```

### `installedLocales(): array`

सभी installed locale codes return करता है।

```php
$locales = Lingua::installedLocales(); // ["en", "fr", "de"]
```

### `allLocales(): array`

Registry में उपलब्ध सभी 129+ locale codes return करता है।

```php
$all = Lingua::allLocales();
```

---

## Translation Access

### `getTranslation(string $key, string $locale, string $group = '*'): ?string`

एक translation value पढ़ता है।

```php
$value = Lingua::getTranslation('failed', 'fr', 'auth');
```

### `setTranslation(string $key, string $value, string $locale, string $group = '*'): bool`

एक translation value write करता है।

```php
Lingua::setTranslation('failed', 'Identifiants invalides.', 'fr', 'auth');
```

---

## Vendor Translations

### `getVendorTranslation(string $locale, string $group, string $key): ?string`

Vendor translation पढ़ता है।

```php
$val = Lingua::getVendorTranslation('fr', 'validation', 'required');
```

### `getVendorTranslationsForGroup(string $locale, string $group): array`

Vendor group की सभी translations return करता है।

---

## Sync & Maintenance

### `syncToDatabase(): void`

`lang/` files से DB में sync करता है।

```php
Lingua::syncToDatabase();
```

### `syncToLocal(): void`

DB से `lang/` files में export करता है।

```php
Lingua::syncToLocal();
```

### `forgetCache(string $locale, string $group): void`

Specific `(locale, group)` pair की cache bust करता है।

```php
Lingua::forgetCache('fr', 'auth');
```

---

## Settings

### `getSetting(string $key, mixed $default = null): mixed`

```php
$mode = Lingua::getSetting('selector_mode', 'sidebar');
```

### `setSetting(string $key, mixed $value): void`

```php
Lingua::setSetting('selector_mode', 'dropdown');
```

---

## Helper Functions

```php
lingua_locale()      // Lingua::currentLocale()
lingua_direction()   // Lingua::getDirection()
lingua_default()     // Lingua::defaultLocale()
```

---

## Deprecated

### `optimize()` *(deprecated)*

1.x में cache warm करने के लिए था। 2.0 में `rememberForever` lazy caching उपयोग करता है — explicit warm-up की आवश्यकता नहीं। Call safe है लेकिन no-op है।
