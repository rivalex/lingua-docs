# Фасад Lingua

Фасад `Lingua` предоставляет статический доступ к полному сервису Lingua из любого места вашего приложения.

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

Аналогично `app()->getLocale()`.

---

### `getDefaultLocale()`

Возвращает код локали языка, помеченного как основной в базе данных.

```php
Lingua::getDefaultLocale(); // 'en'
```

Возвращает `config('lingua.default_locale', 'en')` как запасной вариант, если основной язык не установлен.

---

### `isDefaultLocale(?string $locale = null): bool`

Возвращает `true`, если указанная локаль (или текущая, если `null`) является системным языком по умолчанию.

```php
Lingua::isDefaultLocale();       // true  (текущая локаль — основная)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (неизвестная локаль, без исключения)
```

---

### `hasLocale(string $locale): bool`

Возвращает `true`, если для данного кода или регионального значения существует запись `Language`.

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (совпадение по regional)
Lingua::hasLocale('xx');     // false
```

---

### `setDefaultLocale(string $locale): void`

Помечает указанную локаль как системный язык по умолчанию. Бросает `ModelNotFoundException`, если локаль не установлена.

```php
Lingua::setDefaultLocale('fr');
```

---

### `getLocaleName(?string $locale = null): string`

Возвращает английское отображаемое название локали. Возвращает `''`, если не найдено.

```php
Lingua::getLocaleName();       // 'English'  (текущая локаль)
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
Lingua::getLocaleName('zz');   // ''
```

---

### `getLocaleNative(?string $locale = null): string`

Возвращает нативное название локали. Возвращает `''`, если не найдено.

```php
Lingua::getLocaleNative();       // 'English'
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

---

### `getDirection(?string $locale = null): string`

Возвращает `'ltr'` или `'rtl'` для указанной локали. По умолчанию возвращает `'ltr'`, если локаль не найдена.

```php
Lingua::getDirection();        // 'ltr'  (текущая локаль)
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (безопасный fallback)
```

---

### `info(mixed $locale, bool $withCountry = false, bool $withCurrency = false): LocaleData`

Возвращает объект `LocaleData` из `laravel-lang/locales` с подробной информацией о локали.

```php
$info = Lingua::info('fr');
$info->code;          // 'fr'
$info->native;        // 'Français'
$info->direction;     // Direction enum

$info = Lingua::info('en-US', withCountry: true, withCurrency: true);
$info->native;        // 'English (United States)'
```

---

## Запросы языков

### `languages(): Collection`

Возвращает коллекцию всех установленных моделей `Language`.

```php
$languages = Lingua::languages();
foreach ($languages as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

Возвращает модель `Language` для данного кода локали или `null`, если не найдена.

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

---

### `getDefault(): ?Language`

Возвращает модель `Language`, помеченную как основной язык.

```php
$default = Lingua::getDefault();
$default?->code;       // 'en'
$default?->is_default; // true
```

---

### `getFallback(): ?Language`

Возвращает модель `Language` для `app()->getFallbackLocale()`.

```php
$fallback = Lingua::getFallback();
```

---

### `languagesWithStatistics(): Collection`

Возвращает все модели `Language`, обогащённые статистикой переводов.

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Missing: {$lang->missing_strings} / {$lang->total_strings}";
}
```

Каждая модель получает четыре атрибута только для чтения:

| Атрибут | Тип | Описание |
|---|---|---|
| `total_strings` | `int` | Общее количество строк в `language_lines` |
| `translated_strings` | `int` | Строки со значением для данной локали |
| `missing_strings` | `int` | `total - translated` |
| `completion_percentage` | `float` | `translated / total * 100` |

---

## Проверка доступности локалей

### `available(): array`

Возвращает все коды локалей, известных `laravel-lang/locales` (установленные + неустановленные).

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', 'bn', …]
```

---

### `installed(): array`

Возвращает коды локалей, текущих в таблице `languages`.

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

---

### `notInstalled(): array`

Возвращает доступные, но неустановленные коды локалей, отсортированные по алфавиту.

```php
Lingua::notInstalled(); // ['af', 'ar', 'az', …] (все кроме 'en', 'fr', 'it')
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

Возвращает `true`, если локаль известна laravel-lang, но ещё **не** установлена.

```php
Lingua::isAvailable('de');   // true  (доступна, не установлена)
Lingua::isAvailable('en');   // false (уже установлена)
Lingua::isAvailable(null);   // false
```

---

## Чтение переводов

### `translations(): Collection`

Возвращает все модели `Translation`.

```php
$all = Lingua::translations();
```

---

### `getTranslations(?string $key): array`

Возвращает все значения локалей для ключа перевода в виде ассоциативного массива.

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants ne correspondent pas.']

Lingua::getTranslations('nonexistent'); // []
```

---

### `getTranslation(?string $key, ?string $locale = null): string`

Возвращает переведённую строку для ключа и локали. Возвращает `''`, если не найдено.

```php
Lingua::getTranslation('auth.failed');         // текущая локаль
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('auth.failed', 'zz');   // ''
Lingua::getTranslation('nonexistent', 'en');   // ''
```

---

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

Возвращает все модели `Translation` в группе, опционально отфильтрованные по наличию значения для данной локали.

```php
// Все строки validation
Lingua::getTranslationByGroup('validation');

// Только строки validation с французским переводом
Lingua::getTranslationByGroup('validation', 'fr');
```

---

### `getLocaleStats(?string $locale = null): array`

Возвращает статистику переводов для данной локали (или текущей, если `null`).

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

## Запись переводов

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

Сохраняет значение перевода. Ничего не делает, если ключ не существует.

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
Lingua::setTranslation('auth.failed', 'Updated message');  // текущая локаль
```

---

### `forgetTranslation(?string $key, ?string $locale = null): void`

Удаляет значение локали из ключа перевода. Если локаль является основной, удаляется вся запись. Бросает `VendorTranslationProtectedException` для переводов пакетов.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // удаляет только значение 'fr'
Lingua::forgetTranslation('custom.key', 'en');  // удаляет всю запись (основная локаль)
```

---

## Хелперы переводов пакетов

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frenchSpatie = Lingua::getVendorTranslations('spatie', 'fr');
```

---

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

Обновляет значение перевода пакета. Бросает `ModelNotFoundException`, если запись не существует.

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

## Жизненный цикл языков

### `addLanguage(string $locale): void`

Устанавливает языковые файлы для данной локали через `lang:add`.

```php
Lingua::addLanguage('fr');
```

> Это только устанавливает файлы. Используйте `php artisan lingua:add {locale}` для полного оркестрированного процесса (файлы + запись в БД + синхронизация).

---

### `removeLanguage(string $locale): void`

Удаляет языковые файлы для данной локали через `lang:rm --force`.

```php
Lingua::removeLanguage('fr');
```

> Это только удаляет файлы. Используйте `php artisan lingua:remove {locale}` для полного оркестрированного процесса (файлы + переводы + запись в БД + переупорядочивание).

---

## Синхронизация и обслуживание

### `syncToDatabase(): void`

Импортирует все локальные файлы `lang/` в базу данных.

```php
Lingua::syncToDatabase();
```

---

### `syncToLocal(): void`

Экспортирует все переводы из базы данных в локальные файлы `lang/`.

```php
Lingua::syncToLocal();
```

---

### `updateLanguages(): void`

Запускает `lang:update` для получения последних переводов из `laravel-lang`.

```php
Lingua::updateLanguages();
```

---

### `optimize(): void`

Очищает кеш приложения через `optimize:clear`.

```php
Lingua::optimize();
```
