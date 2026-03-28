# واجهة Lingua (Facade)

توفر واجهة `Lingua` وصولًا ثابتًا إلى خدمة Lingua الكاملة من أي مكان في تطبيقك.

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## مساعدات اللغة

### `getLocale()`

يُرجع رمز لغة التطبيق الحالية.

```php
Lingua::getLocale(); // 'en'
```

يطابق `app()->getLocale()`.

---

### `getDefaultLocale()`

يُرجع رمز اللغة المُعلَّمة كافتراضية في قاعدة البيانات.

```php
Lingua::getDefaultLocale(); // 'en'
```

يتراجع إلى `config('lingua.default_locale', 'en')` إذا لم يكن هناك افتراضي محدد.

---

### `isDefaultLocale(?string $locale = null): bool`

يُرجع `true` إذا كانت اللغة المعطاة (أو اللغة الحالية عند `null`) هي الافتراضية للنظام.

```php
Lingua::isDefaultLocale();       // true  (current locale is default)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (unknown locale, no exception)
```

---

### `hasLocale(string $locale): bool`

يُرجع `true` إذا كان سجل `Language` موجودًا للرمز أو القيمة الإقليمية المعطاة.

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (matched by regional)
Lingua::hasLocale('xx');     // false
```

---

### `setDefaultLocale(string $locale): void`

يُعلِّم اللغة المعطاة كافتراضية للنظام. يُلقي `ModelNotFoundException` إذا لم تكن اللغة مثبتة.

```php
Lingua::setDefaultLocale('fr');
```

---

### `getLocaleName(?string $locale = null): string`

يُرجع اسم العرض الإنجليزي للغة. يُرجع `''` إذا لم توجد.

```php
Lingua::getLocaleName();       // 'English'  (current locale)
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
Lingua::getLocaleName('zz');   // ''
```

---

### `getLocaleNative(?string $locale = null): string`

يُرجع الاسم الأصلي للغة. يُرجع `''` إذا لم توجد.

```php
Lingua::getLocaleNative();       // 'English'
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

---

### `getDirection(?string $locale = null): string`

يُرجع `'ltr'` أو `'rtl'` للغة المعطاة. الافتراضي `'ltr'` إذا لم توجد اللغة.

```php
Lingua::getDirection();        // 'ltr'  (current locale)
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (safe fallback)
```

---

### `info(mixed $locale, bool $withCountry = false, bool $withCurrency = false): LocaleData`

يُرجع كائن `LocaleData` من `laravel-lang/locales` مع معلومات تفصيلية عن اللغة.

```php
$info = Lingua::info('fr');
$info->code;          // 'fr'
$info->native;        // 'Français'
$info->direction;     // Direction enum

$info = Lingua::info('en-US', withCountry: true, withCurrency: true);
$info->native;        // 'English (United States)'
```

---

## استعلامات اللغات

### `languages(): Collection`

يُرجع مجموعة من جميع نماذج `Language` المثبتة.

```php
$languages = Lingua::languages();
foreach ($languages as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

يُرجع نموذج `Language` لرمز اللغة المعطاة، أو `null` إذا لم يوجد.

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

---

### `getDefault(): ?Language`

يُرجع نموذج `Language` المُعلَّم كافتراضي.

```php
$default = Lingua::getDefault();
$default?->code;       // 'en'
$default?->is_default; // true
```

---

### `getFallback(): ?Language`

يُرجع نموذج `Language` لـ `app()->getFallbackLocale()`.

```php
$fallback = Lingua::getFallback();
```

---

### `languagesWithStatistics(): Collection`

يُرجع جميع نماذج `Language` مُثرَّاة بإحصاءات الترجمة.

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Missing: {$lang->missing_strings} / {$lang->total_strings}";
}
```

كل نموذج يكتسب أربع سمات للقراءة فقط:

| السمة | النوع | الوصف |
|---|---|---|
| `total_strings` | `int` | إجمالي الصفوف في `language_lines` |
| `translated_strings` | `int` | الصفوف التي لها قيمة لهذه اللغة |
| `missing_strings` | `int` | `الإجمالي - المُترجَم` |
| `completion_percentage` | `float` | `مُترجَم / إجمالي * 100` |

---

## التحقق من توفر اللغات

### `available(): array`

يُرجع جميع رموز اللغات المعروفة لـ `laravel-lang/locales` (المثبتة + غير المثبتة).

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', 'bn', …]
```

---

### `installed(): array`

يُرجع رموز اللغات الموجودة حاليًا في جدول `languages`.

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

---

### `notInstalled(): array`

يُرجع رموز اللغات المتاحة وغير المثبتة، مرتبة أبجديًا.

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

يُرجع `true` إذا كانت اللغة معروفة لـ laravel-lang لكن **لم تُثبَّت** بعد.

```php
Lingua::isAvailable('de');   // true  (available, not installed)
Lingua::isAvailable('en');   // false (already installed)
Lingua::isAvailable(null);   // false
```

---

## قراءات الترجمة

### `translations(): Collection`

يُرجع جميع نماذج `Translation`.

```php
$all = Lingua::translations();
```

---

### `getTranslations(?string $key): array`

يُرجع جميع قيم اللغات لمفتاح ترجمة كمصفوفة ترابطية.

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants ne correspondent pas.']

Lingua::getTranslations('nonexistent'); // []
```

---

### `getTranslation(?string $key, ?string $locale = null): string`

يُرجع النص المُترجَم لمفتاح ولغة. يُرجع `''` إذا لم يوجد.

```php
Lingua::getTranslation('auth.failed');         // current locale
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('auth.failed', 'zz');   // ''
Lingua::getTranslation('nonexistent', 'en');   // ''
```

---

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

يُرجع جميع نماذج `Translation` في مجموعة، مُصفَّى اختياريًا لتلك التي لها قيمة للغة المعطاة.

```php
// All validation strings
Lingua::getTranslationByGroup('validation');

// Only validation strings that have a French translation
Lingua::getTranslationByGroup('validation', 'fr');
```

---

### `getLocaleStats(?string $locale = null): array`

يُرجع إحصاءات الترجمة للغة المعطاة (أو اللغة الحالية عند `null`).

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

## كتابات الترجمة

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

يحفظ قيمة ترجمة. لا يفعل شيئًا إذا لم يكن المفتاح موجودًا.

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
Lingua::setTranslation('auth.failed', 'Updated message');  // current locale
```

---

### `forgetTranslation(?string $key, ?string $locale = null): void`

يزيل قيمة اللغة من مفتاح ترجمة. إذا كانت اللغة هي الافتراضية، يُحذف السجل بالكامل. يُلقي `VendorTranslationProtectedException` لترجمات الحزم الخارجية.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // removes 'fr' value only
Lingua::forgetTranslation('custom.key', 'en');  // deletes the entire record (default locale)
```

---

## مساعدات ترجمات الحزم الخارجية

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frenchSpatie = Lingua::getVendorTranslations('spatie', 'fr');
```

---

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

يُحدِّث قيمة ترجمة حزمة خارجية. يُلقي `ModelNotFoundException` إذا لم يكن السجل موجودًا.

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

## دورة حياة اللغة

### `addLanguage(string $locale): void`

يثبّت ملفات اللغة للغة المعطاة عبر `lang:add`.

```php
Lingua::addLanguage('fr');
```

> هذا يثبّت الملفات فقط. استخدم `php artisan lingua:add {locale}` للتدفق الكامل المنسَّق (ملفات + سجل قاعدة البيانات + مزامنة).

---

### `removeLanguage(string $locale): void`

يزيل ملفات اللغة للغة المعطاة عبر `lang:rm --force`.

```php
Lingua::removeLanguage('fr');
```

> هذا يزيل الملفات فقط. استخدم `php artisan lingua:remove {locale}` للتدفق الكامل المنسَّق (ملفات + ترجمات + سجل قاعدة البيانات + إعادة الترتيب).

---

## المزامنة والصيانة

### `syncToDatabase(): void`

يستورد جميع ملفات `lang/` المحلية إلى قاعدة البيانات.

```php
Lingua::syncToDatabase();
```

---

### `syncToLocal(): void`

يُصدِّر جميع ترجمات قاعدة البيانات إلى ملفات `lang/` المحلية.

```php
Lingua::syncToLocal();
```

---

### `updateLanguages(): void`

يشغِّل `lang:update` لجلب أحدث الترجمات من `laravel-lang`.

```php
Lingua::updateLanguages();
```

---

### `optimize(): void`

يمسح ذاكرة التطبيق المؤقتة عبر `optimize:clear`.

```php
Lingua::optimize();
```
