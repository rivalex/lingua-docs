# RTL / LTR Support

Lingua stores the text direction (`ltr` or `rtl`) for every installed language and exposes it via `Lingua::getDirection()`. Setting up proper RTL support requires a small, one-time change to your Blade layout.

## Supported RTL languages (examples)

| Locale | Language | Direction |
|---|---|---|
| `ar` | Arabic | `rtl` |
| `he` | Hebrew | `rtl` |
| `fa` | Persian (Farsi) | `rtl` |
| `ur` | Urdu | `rtl` |
| `ps` | Pashto | `rtl` |
| `ug` | Uyghur | `rtl` |

All other locales (including European, Asian, and most Latin-script languages) return `ltr`.

## Setting up your Blade layout

Add `lang` and `dir` attributes to the `<html>` tag in your main layout file:

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` uses the current application locale automatically, so it follows every locale switch without any additional code.

::: tip Why both `lang` and `dir`?
- `lang` tells the browser and screen readers which language to use for pronunciation, hyphenation, and spell-checking.
- `dir` tells the browser, CSS, and layout engines the text flow direction. Both are needed for full accessibility compliance (WCAG 2.1 AA).
:::

## Explicit locale

Pass an explicit locale when you need the direction outside the current request context:

```blade
{{-- E.g. in a per-language email template --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
// In a PHP context
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

With `dir` set on `<html>`, Tailwind's built-in `rtl:` variant works automatically - no plugin or configuration required:

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

## CSS logical properties (recommended)

For new layouts or components, prefer **CSS logical properties** over directional ones. The browser handles the LTR/RTL flip automatically:

```css
/* ❌ Directional - needs RTL overrides */
.card {
    padding-left: 1rem;
    border-left: 2px solid blue;
    margin-right: auto;
}

/* ✅ Logical - works in both directions automatically */
.card {
    padding-inline-start: 1rem;   /* left in LTR, right in RTL */
    border-inline-start: 2px solid blue;
    margin-inline-end: auto;
}
```

Key logical property mappings:

| Directional | Logical equivalent |
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

## Checking direction in Blade

```blade
@if (Lingua::getDirection() === 'rtl')
    {{-- RTL-specific markup --}}
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

## Checking direction in PHP

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // current locale
$direction = Lingua::getDirection('ar');   // explicit locale

if ($direction === 'rtl') {
    // RTL-specific logic
}
```

## Font considerations

Many RTL languages require specific fonts. Arabic and Hebrew in particular render poorly with most Latin web fonts. Consider loading an appropriate font conditionally:

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans Arabic', sans-serif; }
    </style>
@endif
```

## Safe fallback

`Lingua::getDirection()` always returns `'ltr'` as a fallback if the locale is not found in the database - it never throws an exception. It is safe to call at any point in the request lifecycle, including before the languages table is populated.
