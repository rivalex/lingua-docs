# البدء السريع

يأخذك هذا الدليل من تثبيت Lingua الجديد إلى تطبيق متعدد اللغات
بالكامل في دقائق.

## 1. التثبيت والبذر

```bash
composer require rivalex/lingua
php artisan lingua:install
```

اختر محرك **database** عند المطالبة (موصى به). تصبح الإنجليزية
لغتك الافتراضية، وتُستورد سلاسل الترجمة المدمجة
إلى قاعدة البيانات — بدون تنزيلات من GitHub.

::: tip آمن افتراضياً
مسارات الإدارة محمية بـ `['web', 'auth']` تلقائياً.
اضبط `LINGUA_GATE` للوصول القائم على الأدوار — انظر
[التثبيت](/ar/guide/installation#protecting-the-management-ui).
:::

## 2. إضافة لغتك الثانية

```bash
php artisan lingua:add fr
```

هذا الأمر **أصيل لقاعدة البيانات**: يبذر السلاسل النصية الفرنسية من مجموعة
البيانات المدمجة وينشئ سجل `Language`. لا **يُنزِّل** ملفات ولا
يكتب إلى `lang/`.

كرِّر ذلك لأي عدد من اللغات تحتاجها:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. إضافة محدد اللغة إلى تخطيطك

افتح تخطيط Blade الرئيسي (مثل
`resources/views/layouts/app.blade.php`):

**أ) اضبط `lang` و`dir` على وسم `<html>`:**

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

**ب) أدرج محوِّل اللغة في أي مكان يناسب تصميمك:**

```blade
{{-- As a sidebar group (default) --}}
<livewire:lingua::language-selector />

{{-- As a dropdown in a navbar --}}
<livewire:lingua::language-selector mode="dropdown" />
```

::: tip تبديل اللغة يُعيد تحميل الصفحة الحالية
عندما يبدِّل المستخدم اللغة، تُعيد Lingua تحميل **الصفحة التي يوجد عليها** (وليس
الصفحة الرئيسية)، محمية من إعادة التوجيه المفتوحة. انظر
[الأمان](/ar/guide/security#open-redirect-protection).
:::

## 4. استخدام الترجمات في تطبيقك

Lingua شفافة — استخدم مساعدات Laravel القياسية كما اعتدت دائماً:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

في وضع قاعدة البيانات، يدمج `LinguaManager` ترجمات قاعدة البيانات فوق
الترجمات المستندة إلى الملفات تلقائياً. لا حاجة لأي تغييرات في الكود.

## 5. الترجمة عبر الواجهة

زر `/lingua/translations` لعرض جميع سلاسل الترجمة. لكل لغة:

1. استخدم محوِّل اللغة (أعلى اليمين) لاختيار اللغة الهدف
2. انقر على أي صف لتعديل القيمة مباشرةً
3. استخدم **عرض الناقصة فقط** للتركيز على السلاسل غير المترجمة
4. لأنواع HTML أو Markdown يتفعّل محرر النص الغني تلقائياً

<Screenshot src="/screenshots/translations-page.png" alt="صفحة إدارة الترجمات في Lingua" caption="صفحة الترجمات مع محوِّل اللغة وتصفية المجموعة والمحرر المضمَّن." />

## 6. الاستيراد / التصدير مع صفحة النقل

تحتاج إلى تعديل الترجمات بشكل مجمَّع في جدول بيانات، أو تسليم ملف
إلى وكالة ترجمة؟ زر `/lingua/transfer`:

- **تصدير** إلى CSV أو JSON أو XLSX أو ODS — ثنائية اللغة، متعددة اللغات، أو
  JSON الأصلي
- **استيراد** مع **معاينة فرق** جافة قبل كتابة أي شيء

تتطلب XLSX/ODS الحزمة الاختيارية `openspout/openspout`؛ CSV وJSON
تعمل افتراضياً.

## 7. المزامنة مرة أخرى إلى الملفات (اختياري)

إذا كنت بحاجة إلى ملفات الترجمة على القرص (للتحكم بالإصدار أو CI/CD):

```bash
php artisan lingua:sync-to-local
```

يُصدِّر هذا كل ترجمة من قاعدة البيانات مرة أخرى إلى `lang/` بالتنسيق
الصحيح PHP/JSON.

---

## الأنماط الشائعة

### ترجمة مفتاح جديد برمجياً

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
```

### فحص لغة

```php
use Rivalex\Lingua\Facades\Lingua;

$info = Lingua::info('fr');

if ($info !== null) {
    $info->name;      // "French"
    $info->native;    // "Français"
    $info->direction; // "ltr"
}
```

::: warning تغيّر في 2.0
`Lingua::info()` يُرجع الآن `?LocaleInfo` ويُعطي `null` للغات غير
المعروفة بدلاً من الرمي. احرص دائماً على الحراسة بـ `if ($info !== null)`.
:::

### تبديل اللغة برمجياً

```php
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```
