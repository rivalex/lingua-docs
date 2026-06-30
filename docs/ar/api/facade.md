# واجهة Lingua (Facade)

توفر واجهة `Lingua` وصولاً ثابتاً إلى خدمة Lingua الكاملة.

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## مساعدات اللغة

### `getLocale()`

يُرجع رمز لغة التطبيق الحالية. يطابق `app()->getLocale()`.

```php
Lingua::getLocale(); // 'en'
```

### `getDefaultLocale()`

يُرجع رمز اللغة المُعلَّمة كافتراضية في قاعدة البيانات.

```php
Lingua::getDefaultLocale(); // 'en'
```

### `isDefaultLocale(?string $locale = null): bool`

```php
Lingua::isDefaultLocale();       // true  (current locale is default)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (unknown locale — no exception)
```

### `hasLocale(string $locale): bool`

يُرجع `true` إذا كان سجل `Language` موجوداً للرمز أو القيمة الإقليمية.

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (matched by regional)
Lingua::hasLocale('xx');     // false
```

### `setDefaultLocale(string $locale): void`

يُلقي `ModelNotFoundException` إذا لم تكن اللغة مثبتة.

```php
Lingua::setDefaultLocale('fr');
```

### `getLocaleName(?string $locale = null): string`

يُرجع اسم العرض الإنجليزي. يُرجع `''` إذا لم توجد اللغة.

```php
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
Lingua::getLocaleName('zz');   // ''
```

### `getLocaleNative(?string $locale = null): string`

```php
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

### `getDirection(?string $locale = null): string`

يُرجع `'ltr'` أو `'rtl'`. الافتراضي `'ltr'` للغات غير المعروفة.

```php
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (safe fallback)
```

### `info(?string $locale): ?LocaleInfo` <Badge type="warning" text="تغيّر في 2.0" />

يُرجع كائن قيمة `LocaleInfo` للقراءة فقط، أو **`null`** للغات غير المعروفة
(كان يرمي في 1.x).

```php
$info = Lingua::info('fr');

if ($info !== null) {
    $info->code;      // 'fr'
    $info->name;      // 'French'
    $info->native;    // 'Français'
    $info->direction; // 'ltr'
    $info->regional;  // 'fr_FR'
    $info->type;      // 'regional'
}

Lingua::info('zz'); // null — always guard!
```

---

## استعلامات اللغات

### `languages(): Collection`

```php
foreach (Lingua::languages() as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

### `get(?string $locale = null): ?Language`

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

### `getDefault(): ?Language`

```php
$default = Lingua::getDefault();
$default?->code;       // 'en'
$default?->is_default; // true
```

### `getFallback(): ?Language`

```php
$fallback = Lingua::getFallback();
```

### `languagesWithStatistics(): Collection`

كل نموذج يكتسب أربع سمات للقراءة فقط: `total_strings`،
`translated_strings`، `missing_strings`، `completion_percentage`.

```php
foreach (Lingua::languagesWithStatistics() as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

---

## التحقق من توفر اللغات

### `available(): array`

يُرجع جميع رموز اللغات المعروفة في السجل المدمج (129+ لغة).

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', …]
```

### `installed(): array`

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

### `notInstalled(): array`

```php
Lingua::notInstalled(); // ['af', 'ar', 'az', …] — all except installed
```

### `isInstalled(?string $locale = null): bool`

```php
Lingua::isInstalled('en');   // true
Lingua::isInstalled('xx');   // false
```

### `isAvailable(?string $locale = null): bool`

يُرجع `true` إذا كانت اللغة معروفة لكن **لم تُثبَّت** بعد.

```php
Lingua::isAvailable('de');   // true  (available, not installed)
Lingua::isAvailable('en');   // false (already installed)
```

---

## قراءات الترجمة

### `translations(): Collection`

```php
$all = Lingua::translations();
```

### `getTranslations(?string $key): array`

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials…', 'fr' => 'Ces identifiants…']
```

### `getTranslation(?string $key, ?string $locale = null): string`

```php
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('nonexistent', 'en');   // ''
```

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

```php
Lingua::getTranslationByGroup('validation');       // all
Lingua::getTranslationByGroup('validation', 'fr'); // only with FR value
```

### `getLocaleStats(?string $locale = null): array`

```php
$stats = Lingua::getLocaleStats('fr');
// ['total' => 1240, 'translated' => 980, 'missing' => 260, 'percentage' => 79.03]

Lingua::getLocaleStats('zz');
// ['total' => 1240, 'translated' => 0, 'missing' => 1240, 'percentage' => 0.0]
```

---

## كتابات الترجمة

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
Lingua::setTranslation('auth.failed', 'Updated message');  // current locale
```

### `forgetTranslation(?string $key, ?string $locale = null): void`

يُلقي `VendorTranslationProtectedException` لترجمات المورّد.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // removes 'fr' value only
Lingua::forgetTranslation('custom.key', 'en');  // deletes entire record (default locale)
```

---

## مساعدات ترجمات المورّد

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frLaravel = Lingua::getVendorTranslations('laravel', 'fr');
```

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

```php
Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'يجب ملء حقل :attribute.',
    locale: 'ar'
);
```

---

## المزامنة والصيانة

### `syncToDatabase(): void`

```php
Lingua::syncToDatabase();
```

### `syncToLocal(): void`

```php
Lingua::syncToLocal();
```

### `updateLanguages(): void`

```php
Lingua::updateLanguages();
```

### `optimize()` — مُهمَل في 2.0

::: warning مُهمَل
`optimize()` مُهمَل في 2.0. احذف جميع استدعاءاته — Lingua تستخدم
الآن الإلغاء الدقيق للتخزين المؤقت لكل `(locale, group)` لا `cache:clear`
العام.
:::

### `addLanguage(string $locale): void`

يثبّت ملفات اللغة فقط. استخدم `php artisan lingua:add` للتدفق الكامل.

```php
Lingua::addLanguage('fr');
```

### `removeLanguage(string $locale): void`

يزيل ملفات اللغة فقط. استخدم `php artisan lingua:remove` للتدفق الكامل.

```php
Lingua::removeLanguage('fr');
```
