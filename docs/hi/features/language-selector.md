# Language Selector

`<livewire:lingua::language-selector>` कंपोनेंट आपके end users के लिए embeddable locale switcher है — admin management UI से पूरी तरह अलग।

## बुनियादी उपयोग

```blade
<livewire:lingua::language-selector />
```

डिफ़ॉल्ट mode `config/lingua.php` में `selector.mode` से आता है (default: `sidebar`)।

## Modes

### Sidebar

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

Livewire nav group के रूप में render होता है — sidebar navigation के लिए आदर्श।

### Dropdown

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

एक compact dropdown बटन जो available locales की list खोलता है। Navbar में अच्छा लगता है।

### Modal

```blade
<livewire:lingua::language-selector mode="modal" />
```

एक बटन जो locale picker modal खोलता है।

### Headless

```blade
<livewire:lingua::language-selector mode="headless" />
```

कोई built-in rendering नहीं — `x-lingua::select` component से अपना खुद का UI बनाएं।

## Props

| Prop | Type | Default | विवरण |
|---|---|---|---|
| `mode` | string | config value | `sidebar`, `dropdown`, `modal`, `headless` |
| `showFlags` | bool | config value | Country flags दिखाएं |

## Locale Switch व्यवहार

जब user locale switch करता है:

1. New locale session में store होता है
2. **वर्तमान पेज** reload होता है (home redirect नहीं) — open-redirect से guard किया हुआ
3. `app()->setLocale()` next request पर new locale के साथ call होता है

::: tip Same-page reload
Lingua 2.0 में locale switch हमेशा **उसी URL** पर reload करता है जिस पर user था। 1.x में कुछ modes home redirect करते थे।
:::

## `x-lingua::select` Component

`x-lingua::select` एक standalone headless Blade component है जो native **Popover API** उपयोग करता है:

```blade
<x-lingua::select
    :locales="$availableLocales"
    :current="app()->getLocale()"
    :route="route('lingua.switch')"
/>
```

**Native Popover API:** component `popover="manual"` और `showPopover()`/`hidePopover()` JavaScript methods उपयोग करता है। यह Flux dialog के `transform` + `overflow` trapping issue को avoid करता है — कोई teleport नहीं, कोई `z-index` hack नहीं।

Props:

| Prop | Type | विवरण |
|---|---|---|
| `locales` | array | `['en' => 'English', 'fr' => 'Français']` format |
| `current` | string | Active locale code |
| `route` | string | Switch endpoint URL |
| `showFlags` | bool | Country flags दिखाएं (default: config value) |

## Custom Redirect

यदि locale switch के बाद किसी specific URL पर redirect करना हो:

```php
// LanguageSelector Livewire component publish करें और override करें:
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true);
}
```
