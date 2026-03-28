# البدء السريع

يأخذك هذا الدليل من تثبيت Lingua الجديد إلى تطبيق متعدد اللغات بالكامل في دقائق.

## 1. التثبيت والبذر

```bash
composer require rivalex/lingua
php artisan lingua:install
```

الإنجليزية هي لغتك الافتراضية الآن، وجميع نصوص ترجمة Laravel/vendor تم استيرادها إلى قاعدة البيانات.

## 2. إضافة لغتك الثانية

```bash
php artisan lingua:add fr
```

هذا الأمر يقوم بـ:
- تنزيل ملفات اللغة الفرنسية عبر Laravel Lang
- إنشاء سجل `Language` في قاعدة البيانات
- مزامنة جميع النصوص المنزَّلة حديثًا إلى `language_lines`

كرِّر ذلك بقدر ما تحتاج من لغات:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. إضافة محدد اللغة إلى تخطيطك

افتح تخطيط Blade الرئيسي (مثل `resources/views/layouts/app.blade.php`) وقم بـ:

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

## 4. استخدام الترجمات في تطبيقك

Lingua شفافة - استخدم مساعدات Laravel القياسية كما اعتدت دائمًا:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

يدمج `LinguaManager` المخصص ترجمات قاعدة البيانات فوق الترجمات المستندة إلى الملفات تلقائيًا. لا حاجة لأي تغييرات في الكود.

## 5. الترجمة عبر الواجهة

زر `/lingua/translations` لعرض جميع نصوص الترجمة. لكل لغة:

1. استخدم محوِّل اللغة (أعلى اليمين) لاختيار اللغة الهدف
2. انقر على أي صف لتعديل القيمة مباشرة
3. استخدم **عرض الناقصة فقط** للتركيز على النصوص غير المترجمة
4. لأنواع HTML أو Markdown يتفعّل محرر النص الغني تلقائيًا

<Screenshot src="/screenshots/translations-page.png" alt="صفحة إدارة الترجمات في Lingua" caption="صفحة الترجمات مع محوِّل اللغة وتصفية المجموعة والمحرر المضمّن." />

## 6. المزامنة مرة أخرى إلى الملفات (اختياري)

إذا كنت بحاجة إلى ملفات ترجمة على القرص (للتحكم في الإصدار، CI/CD، أو أدوات أخرى):

```bash
php artisan lingua:sync-to-local
```

يُصدِّر هذا كل ترجمة من قاعدة البيانات مرة أخرى إلى `lang/` بالتنسيق الصحيح PHP/JSON.

---

## الأنماط الشائعة

### ترجمة مفتاح جديد برمجيًا

```php
use Rivalex\Lingua\Facades\Lingua;

// Create the translation in the database for the default locale
// (this is normally done via the UI, but you can script it too)
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

// Later, add translations for other locales:
Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
Lingua::setTranslation('welcome_subject', 'Benvenuto nella nostra piattaforma!', 'it');
```

### التحقق من اكتمال الترجمة

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]
```

### تبديل اللغة برمجيًا

```php
// In a controller, middleware, or service
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```

::: tip
يتولى مكون `LanguageSelector` تبديل اللغة للمستخدمين النهائيين تلقائيًا. النهج اليدوي أعلاه مفيد في أوامر الكونسول أو الوظائف.
:::

### تصدير مجموعات محددة فقط

إذا كنت تريد تصدير مجموعة فرعية فقط من الترجمات إلى ملفات، قم بالمزامنة إلى المحلي أولًا، ثم احذف المجموعات التي لا تحتاجها من `lang/` - قاعدة البيانات هي دائمًا مصدر الحقيقة في وقت التشغيل.
