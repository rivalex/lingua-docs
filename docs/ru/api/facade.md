# Фасад Lingua

Фасад `Lingua` предоставляет статический доступ к полному сервису Lingua из любого
места вашего приложения.

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## Хелперы локали

### `getLocale()`

Возвращает код текущей локали приложения.

```php
Lingua::getLocale(); // 'en'
```

---

### `getDefaultLocale()`

Возвращает код локали языка, помеченного как основной в БД.

```php
Lingua::getDefaultLocale(); // 'en'
```

Возвращает `config('lingua.default_locale', 'en')` если основной язык не установлен.

---

### `isDefaultLocale(?string $locale = null): bool`

```php
Lingua::isDefaultLocale();       // true  (текущая локаль — основная)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (неизвестная локаль, без исключения)
```

---

### `setDefaultLocale(string $locale): void`

Помечает указанную локаль как основной язык. Бросает `ModelNotFoundException`, если
локаль не установлена.

```php
Lingua::setDefaultLocale('fr');
```

---

### `hasLocale(string $locale): bool`

Возвращает `true`, если для кода или регионального значения существует запись `Language`.

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (совпадение по regional)
Lingua::hasLocale('xx');     // false
```

---

### `getLocaleName(?string $locale = null): string`

Возвращает английское отображаемое название локали. Возвращает `''` если не найдено.

```php
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
```

---

### `getLocaleNative(?string $locale = null): string`

```php
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

---

### `getDirection(?string $locale = null): string`

Возвращает `'ltr'` или `'rtl'`. По умолчанию `'ltr'` если локаль не найдена.

```php
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('zz');    // 'ltr'  (безопасный fallback)
```

---

### `info(?string $locale = null): ?LocaleInfo` <Badge type="warning" text="Изменено в 2.0" />

Возвращает readonly-объект `LocaleInfo` с метаданными локали или `null` для неизвестных
локалей.

```php
$info = Lingua::info('fr');

if ($info !== null) {
    $info->code;      // 'fr'
    $info->name;      // 'French'
    $info->native;    // 'Français'
    $info->direction; // 'ltr'
    $info->regional;  // 'fr_FR'
    $info->type;      // 'standard'
}
```

::: warning Изменено в 2.0
`info()` теперь возвращает `?LocaleInfo` (без `withCountry`/`withCurrency` параметров
Spatie). Для неизвестных локалей возвращает `null` — всегда проверяйте `if ($info !== null)`.
:::

---

## Запросы языков

### `languages(): Collection`

```php
$languages = Lingua::languages();
foreach ($languages as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

---

### `getDefault(): ?Language`

```php
$default = Lingua::getDefault();
$default?->code;       // 'en'
$default?->is_default; // true
```

---

### `getFallback(): ?Language`

```php
$fallback = Lingua::getFallback();
```

---

### `languagesWithStatistics(): Collection`

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Missing: {$lang->missing_strings} / {$lang->total_strings}";
}
```

Каждая модель получает `total_strings`, `translated_strings`, `missing_strings`,
`completion_percentage`.

---

## Управление языками

### `addLanguage(string $locale): void` <Badge type="warning" text="Изменено в 2.0" />

```php
Lingua::addLanguage('fr');
```

::: warning Изменено в 2.0
Больше не вызывает `lang:add`. Только нативная работа с БД из встроенного набора данных.
:::

---

### `removeLanguage(string $locale): void` <Badge type="warning" text="Изменено в 2.0" />

```php
Lingua::removeLanguage('fr');
```

::: warning Изменено в 2.0
Больше не вызывает `lang:rm`. Только нативная работа с БД.
:::

---

### `installDefaultLanguage(string $locale): void` <Badge type="tip" text="Новое в 2.0" />

Устанавливает язык по умолчанию и заполняет его переводами из встроенного набора данных.
Используется мастером `lingua:install`.

```php
Lingua::installDefaultLanguage('en');
```

---

## Проверка доступности локалей

### `available(): array`

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', 'bn', …]  (129+ локалей)
```

---

### `installed(): array`

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

---

### `notInstalled(): array`

```php
Lingua::notInstalled(); // доступные, но неустановленные
```

---

### `isInstalled(?string $locale = null): bool`

```php
Lingua::isInstalled('en');   // true
Lingua::isInstalled('xx');   // false
```

---

### `isAvailable(?string $locale = null): bool`

Возвращает `true`, если локаль известна реестру, но **не** установлена.

```php
Lingua::isAvailable('de');   // true  (доступна, не установлена)
Lingua::isAvailable('en');   // false (уже установлена)
```

---

## Чтение переводов

### `getTranslations(?string $key): array`

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants…']
```

---

### `getTranslation(?string $key, ?string $locale = null): string`

```php
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('nonexistent', 'en');   // ''
```

---

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

```php
Lingua::getTranslationByGroup('validation');
Lingua::getTranslationByGroup('validation', 'fr');
```

---

### `getLocaleStats(?string $locale = null): array`

```php
$stats = Lingua::getLocaleStats('fr');
// ['total' => 1240, 'translated' => 980, 'missing' => 260, 'percentage' => 79.03]
```

---

## Запись переводов

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
```

---

### `forgetTranslation(?string $key, ?string $locale = null): void`

```php
Lingua::forgetTranslation('custom.key', 'fr');  // удаляет только значение 'fr'
Lingua::forgetTranslation('custom.key', 'en');  // удаляет всю запись (основная локаль)
```

Бросает `VendorTranslationProtectedException` для вендорных строк.

---

## Хелперы переводов пакетов

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frFr    = Lingua::getVendorTranslations('laravel', 'fr');
```

---

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

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

## Синхронизация и обслуживание

### `syncToDatabase(): void`

```php
Lingua::syncToDatabase();
```

---

### `syncToLocal(): void`

```php
Lingua::syncToLocal();
```

---

### `updateLanguages(): void`

```php
Lingua::updateLanguages();
```

---

### `optimize()` — устарел <Badge type="warning" text="Устарело в 2.0" />

Метод `optimize()` **устарел** и будет удалён в будущей версии. Удалите все его вызовы.
