# RTL / LTR Support

Lingua हर इंस्टॉल की हुई भाषा के लिए text direction (`ltr` या `rtl`) संग्रहीत करता है और इसे `Lingua::getDirection()` के माध्यम से उजागर करता है। उचित RTL support सेट करने के लिए आपके Blade layout में एक छोटा, एकबारगी बदलाव आवश्यक है।

## समर्थित RTL भाषाएँ (उदाहरण)

| Locale | भाषा | दिशा |
|---|---|---|
| `ar` | अरबी | `rtl` |
| `he` | हिब्रू | `rtl` |
| `fa` | फ़ारसी (Farsi) | `rtl` |
| `ur` | उर्दू | `rtl` |
| `ps` | पश्तो | `rtl` |
| `ug` | उइगर | `rtl` |

अन्य सभी locales (European, Asian, और अधिकांश Latin-script भाषाओं सहित) `ltr` return करते हैं।

## अपना Blade layout सेट करना

अपनी main layout file में `<html>` टैग पर `lang` और `dir` attributes जोड़ें:

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` स्वचालित रूप से वर्तमान application locale का उपयोग करता है, इसलिए यह बिना किसी अतिरिक्त code के हर locale switch पर follow करता है।

::: tip `lang` और `dir` दोनों क्यों?
- `lang` browser और screen readers को बताता है कि pronunciation, hyphenation और spell-checking के लिए कौन सी भाषा उपयोग करनी है।
- `dir` browser, CSS और layout engines को text flow direction बताता है। पूर्ण accessibility compliance (WCAG 2.1 AA) के लिए दोनों आवश्यक हैं।
:::

## स्पष्ट locale

जब आपको वर्तमान request context के बाहर direction चाहिए तो एक स्पष्ट locale pass करें:

```blade
{{-- उदाहरण: per-language email template में --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
// PHP context में
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

`<html>` पर `dir` set होने के साथ, Tailwind का built-in `rtl:` variant स्वचालित रूप से काम करता है - कोई plugin या configuration आवश्यक नहीं:

```html
<!-- Text alignment flip करें -->
<p class="text-left rtl:text-right">Content</p>

<!-- Padding flip करें -->
<div class="pl-4 rtl:pr-4 rtl:pl-0">Sidebar item</div>

<!-- Icon placement flip करें -->
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Label</span>
</div>

<!-- Border flip करें -->
<div class="border-l-4 rtl:border-r-4 rtl:border-l-0 border-blue-500">
    Highlighted content
</div>
```

## CSS logical properties (अनुशंसित)

नए layouts या components के लिए, directional properties के बजाय **CSS logical properties** prefer करें। Browser LTR/RTL flip स्वचालित रूप से संभालता है:

```css
/* ❌ Directional - RTL overrides की ज़रूरत है */
.card {
    padding-left: 1rem;
    border-left: 2px solid blue;
    margin-right: auto;
}

/* ✅ Logical - दोनों दिशाओं में स्वचालित रूप से काम करता है */
.card {
    padding-inline-start: 1rem;   /* LTR में left, RTL में right */
    border-inline-start: 2px solid blue;
    margin-inline-end: auto;
}
```

मुख्य logical property mappings:

| Directional | Logical समकक्ष |
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

## Blade में direction जाँचना

```blade
@if (Lingua::getDirection() === 'rtl')
    {{-- RTL-specific markup --}}
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

## PHP में direction जाँचना

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // वर्तमान locale
$direction = Lingua::getDirection('ar');   // स्पष्ट locale

if ($direction === 'rtl') {
    // RTL-specific logic
}
```

## Font considerations

कई RTL भाषाओं के लिए specific fonts आवश्यक हैं। अरबी और हिब्रू विशेष रूप से अधिकांश Latin web fonts के साथ ठीक से render नहीं होते। एक उपयुक्त font conditionally load करने पर विचार करें:

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

`Lingua::getDirection()` हमेशा fallback के रूप में `'ltr'` return करता है यदि locale डेटाबेस में नहीं मिला - यह कभी exception नहीं throw करता। Request lifecycle में किसी भी बिंदु पर इसे safely call किया जा सकता है, भले ही languages टेबल अभी populate न हुई हो।
