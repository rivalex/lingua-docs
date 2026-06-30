# RTL / LTR Support

Lingua हर installed भाषा के लिए text direction (`ltr` या `rtl`) संग्रहीत करता है और इसे `Lingua::getDirection()` के माध्यम से expose करता है।

## समर्थित RTL भाषाएं (उदाहरण)

| Locale | भाषा | Direction |
|---|---|---|
| `ar` | Arabic / العربية | `rtl` |
| `fa` | Farsi / فارسی | `rtl` |
| `he` | Hebrew / עברית | `rtl` |
| `ur` | Urdu / اردو | `rtl` |

## Blade Layout सेटअप

अपनी main Blade layout में `<html>` टैग पर `lang` और `dir` attributes set करें:

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

`Lingua::getDirection()` active locale के लिए `ltr` या `rtl` return करता है।

## Tailwind CSS के साथ RTL

Tailwind CSS v3+ में built-in `rtl:` variant है:

```html
{{-- LTR में left-aligned, RTL में right-aligned --}}
<div class="text-left rtl:text-right">
    Hello / مرحبا
</div>

{{-- LTR में left margin, RTL में right margin --}}
<div class="ml-4 rtl:mr-4 rtl:ml-0">
    Content
</div>
```

## CSS Logical Properties

`rtl:` variants की जगह CSS logical properties use करना cleaner approach है:

```css
/* margin-left → margin-inline-start (automatically flips in RTL) */
.element {
    margin-inline-start: 1rem;  /* LTR: left, RTL: right */
    padding-inline-end: 0.5rem; /* LTR: right, RTL: left */
}
```

Tailwind में:

```html
<div class="ms-4 pe-2">  {{-- ms = margin-start, pe = padding-end --}}
    Content
</div>
```

## Font Considerations

Arabic, Farsi, और Urdu के लिए system fonts आमतौर पर adequate हैं, लेकिन quality improve करने के लिए:

```blade
@if(Lingua::getDirection() === 'rtl')
    <link href="https://fonts.googleapis.com/css2?family=Cairo&display=swap" rel="stylesheet">
    <style>body { font-family: 'Cairo', sans-serif; }</style>
@endif
```

## Direction Data

`Language` model में `direction` field है:

```php
use Rivalex\Lingua\Facades\Lingua;

$info = Lingua::info('ar');
echo $info?->direction; // "rtl"
```

Languages पेज पर direction badge हर row में दिखती है।
