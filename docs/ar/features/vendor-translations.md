# ترجمات الحزم الخارجية

ترجمات الحزم الخارجية هي النصوص التي تنتمي إلى حزم طرف ثالث — رسائل التحقق الخاصة بـ Laravel، تسميات الصفحات، نصوص إعادة تعيين كلمة المرور، وترجمات أي حزمة أخرى تشحن بمجلد `lang/` الخاص بها.

## كيف يتم تحديدها

أثناء `lingua:sync-to-database`، تمسح Lingua هيكل مجلد `lang/vendor/`. أي ملف ترجمة موجود هناك يُستورد بـ:

- `is_vendor = true`
- `vendor` = اسم الحزمة (مشتق من اسم المجلد، مثل `spatie`, `laravel`, `filament`)

مثال على صفوف قاعدة البيانات بعد المزامنة:

```
group      | key          | is_vendor | vendor   | text
-----------|--------------|-----------|----------|-----------------------------
validation | required     | false     | null     | {"en":"The :attribute…"}
passwords  | reset        | true      | laravel  | {"en":"Your password…"}
auth       | failed       | true      | laravel  | {"en":"These credentials…"}
```

::: tip
ملفات `lang/en/*.php` الخاصة بـ Laravel (auth، validation، pagination، passwords) تُعامَل كـ **ترجمات حزم خارجية** لأنها تأتي من الإطار، وليس من كود تطبيقك.
:::

## ما يمكنك فعله مع ترجمات الحزم الخارجية

| الإجراء | مسموح؟ | ملاحظات |
|---|---|---|
| **تعديل القيمة** | ✅ نعم | تجاوز أي نص من حزمة خارجية بصياغتك الخاصة |
| **تغيير النوع** | ✅ نعم | التبديل بين text / html / markdown |
| **تعديل المجموعة أو المفتاح** | ❌ لا | حقلا المجموعة والمفتاح مقفلان في نافذة التعديل |
| **الحذف** | ❌ لا | محمية بـ `VendorTranslationProtectedException` |

## تجاوز نص من حزمة خارجية

الحالة الأكثر شيوعًا هي تجاوز رسائل التحقق في Laravel لتتناسب مع أسلوب تطبيقك:

1. افتح `/lingua/translations`
2. ابحث عن النص (مثل `validation.required`)
3. انقر على أيقونة التعديل لفتح نافذة التعديل
4. غيِّر القيمة لأي لغة
5. احفظ — يسري التجاوز فورًا في الطلب التالي

```php
// Or programmatically via the facade:
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Please fill in the :attribute field.',
    locale: 'en'
);
```

## الاستعلام عن ترجمات الحزم الخارجية

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// All vendor translations
$all = Translation::where('is_vendor', true)->get();

// All vendor translations for a specific package
$laravel = Lingua::getVendorTranslations('laravel');

// All vendor translations for a package with French values
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');

// Filter by group and key manually
$required = Translation::where('is_vendor', true)
    ->where('vendor', 'laravel')
    ->where('group', 'validation')
    ->where('key', 'required')
    ->first();
```

## آلية الحماية

محاولة حذف ترجمة حزمة خارجية (من الواجهة أو عبر `Lingua::forgetTranslation()`) تُلقي استثناء `VendorTranslationProtectedException`:

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en'); // key belongs to a vendor translation
} catch (VendorTranslationProtectedException $e) {
    // Handle gracefully
}
```

في واجهة Livewire، محاولات الحذف تُطلق حدث `vendor_translation_protected` وتغلق النافذة دون حذف أي شيء. يمكن الاستماع إلى الحدث في مكونات Livewire الخاصة بك أو كود Alpine.js:

```js
// Alpine.js / Livewire event listener
window.addEventListener('vendor_translation_protected', () => {
    alert('This translation is protected and cannot be deleted.');
});
```

## إعادة مزامنة ترجمات الحزم الخارجية

إذا أضافت حزمة تعتمد عليها مفاتيح ترجمة جديدة في ترقية، أعِد المزامنة لاستيرادها:

```bash
# Pull the latest from laravel-lang and sync to DB
php artisan lingua:update-lang

# Or manually re-sync from your existing lang/ files
php artisan lingua:sync-to-database
```

تستخدم Lingua `updateOrCreate` عند المزامنة، لذا تُحافظ على التجاوزات الموجودة (القيم المعدَّلة).

## تعطيل استيراد ترجمات الحزم الخارجية

إذا لم تكن تريد ترجمات الحزم الخارجية في قاعدة البيانات على الإطلاق، قم بالمزامنة فقط بعد إزالة مجلد `lang/vendor/`. تستورد Lingua فقط ما تجده على القرص.
