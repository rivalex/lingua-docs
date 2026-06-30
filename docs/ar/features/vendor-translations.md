# ترجمات المورّد

ترجمات المورّد هي النصوص التي تنتمي إلى حزم طرف ثالث — رسائل التحقق
الخاصة بـ Laravel، تسميات الصفحات، نصوص إعادة تعيين كلمة المرور، وترجمات
أي حزمة أخرى تشحن بمجلد `lang/` الخاص بها.

## كيف يتم تحديدها

أثناء `lingua:sync-to-database`، تمسح Lingua هيكل مجلد `lang/vendor/`.
أي ترجمة موجودة هناك تُستورد بـ:

- `is_vendor = true`
- `vendor` = اسم الحزمة (مثل `laravel`، `filament`)

```
group      | key      | is_vendor | vendor  | text
-----------|----------|-----------|---------|-----------------------------
auth       | failed   | true      | laravel | {"en":"These credentials…"}
passwords  | reset    | true      | laravel | {"en":"Your password…"}
messages   | welcome  | false     | null    | {"en":"Welcome!","fr":"…"}
```

::: tip
ملفات `lang/en/*.php` الخاصة بـ Laravel (`auth`، `validation`، `pagination`،
`passwords`) تُعامَل كترجمات مورّد لأنها تأتي من الإطار، وليس من كود
تطبيقك. في Lingua 2.0، تُبذَر هذه الترجمات من مجموعة البيانات المدمجة
(26 لغة، 5902 سلسلة نصية) — بدون تنزيلات.
:::

---

## ما يمكنك فعله مع ترجمات المورّد

| الإجراء | مسموح؟ | ملاحظات |
|---|---|---|
| **تعديل القيمة** | ✅ نعم | تجاوز أي نص من المورّد بصياغتك الخاصة |
| **تغيير النوع** | ✅ نعم | التبديل بين text / html / markdown |
| **تعديل المجموعة أو المفتاح** | ❌ لا | حقلا المجموعة والمفتاح مقفلان |
| **الحذف** | ❌ لا | محمية بحارس F5 — `VendorTranslationProtectedException` |

---

## تجاوز نص من المورّد

### عبر الواجهة

1. افتح `/lingua/translations`
2. ابحث عن النص (مثل `validation.required`)
3. انقر على خلية اللغة المطلوبة وعدِّلها مباشرةً
4. احفظ — يسري التجاوز فوراً في الطلب التالي

### برمجياً

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'يجب ملء حقل :attribute.',
    locale: 'ar'
);
```

---

## الاستعلام عن ترجمات المورّد

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// All vendor translations
$all = Translation::where('is_vendor', true)->get();

// All vendor translations for a specific package
$laravel = Lingua::getVendorTranslations('laravel');

// With locale filter
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');
```

---

## آلية الحماية (F5)

محاولة حذف ترجمة مورّد تُلقي `VendorTranslationProtectedException`:

```php
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en');
} catch (VendorTranslationProtectedException $e) {
    // Handle gracefully
}
```

في واجهة Livewire، محاولات الحذف تُطلق حدث `vendor_translation_protected`
وتغلق النافذة دون حذف أي شيء:

```js
window.addEventListener('vendor_translation_protected', () => {
    alert('This translation is protected and cannot be deleted.');
});
```

---

## إعادة مزامنة ترجمات المورّد

إذا أضافت حزمة ترقية مفاتيح ترجمة جديدة، أعِد المزامنة:

```bash
# Update bundled dataset then sync
php artisan lingua:update-lang

# Or re-sync from existing lang/ files
php artisan lingua:sync-to-database
```

تستخدم Lingua `updateOrCreate` عند المزامنة — تُحافظ على التجاوزات الموجودة.
