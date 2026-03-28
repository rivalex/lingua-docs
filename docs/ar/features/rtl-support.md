# دعم RTL / LTR

تخزّن Lingua اتجاه النص (`ltr` أو `rtl`) لكل لغة مثبتة وتعرضه عبر `Lingua::getDirection()`. يتطلب إعداد دعم RTL الصحيح تغييرًا صغيرًا لمرة واحدة في تخطيط Blade.

## لغات RTL المدعومة (أمثلة)

| اللغة | الاسم | الاتجاه |
|---|---|---|
| `ar` | العربية | `rtl` |
| `he` | العبرية | `rtl` |
| `fa` | الفارسية | `rtl` |
| `ur` | الأردية | `rtl` |
| `ps` | البشتوية | `rtl` |
| `ug` | الأويغورية | `rtl` |

جميع اللغات الأخرى (بما في ذلك الأوروبية والآسيوية ومعظم لغات النص اللاتيني) تُرجع `ltr`.

## إعداد تخطيط Blade

أضف سمات `lang` و`dir` إلى وسم `<html>` في ملف التخطيط الرئيسي:

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` تستخدم لغة التطبيق الحالية تلقائيًا، لذا تتبع كل تبديل لغة دون أي كود إضافي.

::: tip لماذا كلا `lang` و`dir`؟
- `lang` تخبر المتصفح وقارئات الشاشة باللغة المستخدمة للنطق والضغط الصوتي والتدقيق الإملائي.
- `dir` تخبر المتصفح ومحركات CSS والتخطيط باتجاه تدفق النص. كلاهما مطلوب للامتثال الكامل لإمكانية الوصول (WCAG 2.1 AA).
:::

## اللغة الصريحة

مرِّر لغة صريحة عندما تحتاج إلى الاتجاه خارج سياق الطلب الحالي:

```blade
{{-- E.g. in a per-language email template --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
// In a PHP context
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

مع ضبط `dir` على `<html>`، يعمل متغيِّر `rtl:` المدمج في Tailwind تلقائيًا — لا حاجة لإضافة أو تكوين:

```html
<!-- Flip text alignment -->
<p class="text-left rtl:text-right">Content</p>

<!-- Flip padding -->
<div class="pl-4 rtl:pr-4 rtl:pl-0">Sidebar item</div>

<!-- Flip icon placement -->
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Label</span>
</div>

<!-- Flip border -->
<div class="border-l-4 rtl:border-r-4 rtl:border-l-0 border-blue-500">
    Highlighted content
</div>
```

## خصائص CSS المنطقية (موصى بها)

للتخطيطات أو المكونات الجديدة، فضِّل **خصائص CSS المنطقية** على الخصائص الاتجاهية. يتولى المتصفح قلب LTR/RTL تلقائيًا:

```css
/* ❌ Directional — needs RTL overrides */
.card {
    padding-left: 1rem;
    border-left: 2px solid blue;
    margin-right: auto;
}

/* ✅ Logical — works in both directions automatically */
.card {
    padding-inline-start: 1rem;   /* left in LTR, right in RTL */
    border-inline-start: 2px solid blue;
    margin-inline-end: auto;
}
```

تعيينات الخصائص المنطقية الرئيسية:

| الاتجاهي | المقابل المنطقي |
|---|---|
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |
| `left: 0` | `inset-inline-start: 0` |
| `text-align: left` | `text-align: start` |
| `float: left` | `float: inline-start` |

## التحقق من الاتجاه في Blade

```blade
@if (Lingua::getDirection() === 'rtl')
    {{-- RTL-specific markup --}}
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

## التحقق من الاتجاه في PHP

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // current locale
$direction = Lingua::getDirection('ar');   // explicit locale

if ($direction === 'rtl') {
    // RTL-specific logic
}
```

## اعتبارات الخطوط

تتطلب كثير من لغات RTL خطوطًا محددة. العربية والعبرية بشكل خاص تُعرض بشكل سيئ مع معظم خطوط الويب اللاتينية. فكِّر في تحميل خط مناسب بشكل مشروط:

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans Arabic', sans-serif; }
    </style>
@endif
```

## الاحتياط الآمن

`Lingua::getDirection()` تُرجع دائمًا `'ltr'` كقيمة احتياطية إذا لم توجد اللغة في قاعدة البيانات — لا ترمي استثناءً أبدًا. من الآمن استدعاؤها في أي نقطة من دورة حياة الطلب، بما في ذلك قبل تعبئة جدول اللغات.
