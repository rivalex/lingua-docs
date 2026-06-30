# دعم RTL / LTR

تخزّن Lingua اتجاه النص (`ltr` أو `rtl`) لكل لغة مثبتة وتعرضه
عبر `Lingua::getDirection()`. يتطلب إعداد دعم RTL الصحيح تغييراً صغيراً
لمرة واحدة في تخطيط Blade.

## لغات RTL المدعومة (أمثلة)

| اللغة | الاسم | الاتجاه |
|---|---|---|
| `ar` | العربية | `rtl` |
| `he` | العبرية | `rtl` |
| `fa` | الفارسية | `rtl` |
| `ur` | الأردية | `rtl` |
| `ps` | البشتوية | `rtl` |
| `ug` | الأويغورية | `rtl` |

جميع اللغات الأخرى تُرجع `ltr`.

## إعداد تخطيط Blade

أضف سمات `lang` و`dir` إلى وسم `<html>` في ملف التخطيط الرئيسي:

```blade
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    …
</head>
```

`Lingua::getDirection()` تستخدم اللغة الحالية تلقائياً — تتبع كل
تبديل لغة دون أي كود إضافي.

::: tip لماذا كلا `lang` و`dir`؟
- `lang` تخبر المتصفح وقارئات الشاشة باللغة للنطق والتدقيق الإملائي.
- `dir` تخبر المتصفح باتجاه تدفق النص. كلاهما مطلوب للامتثال الكامل
  لـ WCAG 2.1 AA.
:::

## اللغة الصريحة

مرِّر لغة صريحة عندما تحتاج الاتجاه خارج سياق الطلب الحالي:

```blade
{{-- في قالب بريد إلكتروني لكل لغة --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

مع ضبط `dir` على `<html>`، يعمل متغيِّر `rtl:` المدمج في Tailwind
تلقائياً:

```html
<!-- Flip text alignment -->
<p class="text-left rtl:text-right">Content</p>

<!-- Flip padding -->
<div class="pl-4 rtl:pr-4 rtl:pl-0">Sidebar item</div>

<!-- Flip icon placement -->
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>…</svg>
    <span>Label</span>
</div>

<!-- Flip border -->
<div class="border-l-4 rtl:border-r-4 rtl:border-l-0 border-blue-500">
    Highlighted content
</div>
```

## خصائص CSS المنطقية (موصى بها)

للتخطيطات الجديدة، فضِّل **خصائص CSS المنطقية** على الخصائص الاتجاهية:

```css
/* ❌ Directional - needs RTL overrides */
.card {
    padding-left: 1rem;
    border-left: 2px solid blue;
    margin-right: auto;
}

/* ✅ Logical - works in both directions automatically */
.card {
    padding-inline-start: 1rem;
    border-inline-start: 2px solid blue;
    margin-inline-end: auto;
}
```

| الاتجاهي | المقابل المنطقي |
|---|---|
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `border-left` | `border-inline-start` |
| `text-align: left` | `text-align: start` |
| `float: left` | `float: inline-start` |
| `left: 0` | `inset-inline-start: 0` |

## التحقق من الاتجاه في Blade وPHP

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // current locale
$direction = Lingua::getDirection('ar');   // explicit locale

if ($direction === 'rtl') {
    // RTL-specific logic
}
```

## اعتبارات الخطوط

لغات RTL تتطلب خطوطاً محددة. فكِّر في التحميل المشروط:

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

`Lingua::getDirection()` تُرجع دائماً `'ltr'` كقيمة احتياطية إذا لم
توجد اللغة في قاعدة البيانات — لا ترمي استثناءً أبداً.
