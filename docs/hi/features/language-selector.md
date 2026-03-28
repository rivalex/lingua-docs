# Language Selector

`<livewire:lingua::language-selector>` कंपोनेंट आपके end users के लिए एक embeddable locale switcher है - admin management UI से पूरी तरह अलग।

## बुनियादी उपयोग

```blade
<livewire:lingua::language-selector />
```

इसे अपने Blade layouts में कहीं भी जोड़ें। यह `config/lingua.php` में configured mode (`sidebar` by default) का उपयोग करके render होता है।

## Display modes

### Sidebar mode (डिफ़ॉल्ट)

एक grouped navigation section के रूप में render होता है - Flux के साथ बनाए गए application sidebars के लिए आदर्श।

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/screenshots/selector-sidebar.png" alt="Sidebar mode में language selector" caption="Sidebar mode - सभी इंस्टॉल की हुई भाषाओं को navigation items के रूप में दिखाता है।" width="320px" :center="true"/>

### Dropdown mode

एक compact dropdown button के रूप में render होता है - headers और navigation bars के लिए आदर्श।

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/screenshots/selector-dropdown.png" alt="Dropdown mode में language selector" caption="Dropdown mode - flag icon के साथ वर्तमान भाषा दिखाता है।" width="320px" :center="true"/>

### Modal mode

एक बटन के रूप में render होता है जो full language picker modal खोलता है - landing pages या onboarding flows में prominent locale switching के लिए आदर्श।

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/screenshots/selector-modal.png" alt="Modal mode में language selector" caption="Modal mode - full-screen language picker overlay।"/>

## Props reference

| Prop | Type | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'`, या `'modal'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | देश के झंडे के आइकन दिखाएँ |

```blade
{{-- प्रति-instance mode override करें --}}
<livewire:lingua::language-selector mode="dropdown" :show-flags="false" />
```

## Locale switching कैसे काम करती है

जब कोई उपयोगकर्ता एक भाषा पर क्लिक करता है, तो कंपोनेंट `changeLocale($locale)` call करता है:

1. Validates करता है कि locale `languages` टेबल में मौजूद है (अज्ञात locales को चुपचाप ignore करता है)
2. Locale code को `config('lingua.session_variable')` के तहत session में store करता है
3. वर्तमान request के लिए `app()->setLocale($locale)` call करता है
4. वर्तमान URL पर redirect करता है (एक full page reload trigger होता है ताकि नया locale हर जगह लागू हो)

अगले request पर, `LinguaMiddleware` session पढ़ता है और आपके controllers चलने से पहले locale apply करता है।

## Flag icons

Flag icons [`outhebox/blade-flags`](https://github.com/MohmmedAshraf/blade-flags) package द्वारा powered हैं, जो automatically Lingua dependency के रूप में इंस्टॉल होता है।

Flags को भाषा के `regional` code से match किया जाता है (उदाहरण: `en_US` → 🇺🇸, `fr_FR` → 🇫🇷)। यदि कोई regional code set नहीं है, तो flag component gracefully दो-अक्षर code display पर fallback करता है।

Flags globally disable करें:

```php
// config/lingua.php
'selector' => ['show_flags' => false],
```

या per-instance:

```blade
<livewire:lingua::language-selector :show-flags="false" />
```

## Selector views customize करना

Markup override करने के लिए views प्रकाशित करें:

```bash
php artisan vendor:publish --tag="lingua-views"
```

Selector templates यहाँ हैं:

```
resources/views/vendor/lingua/livewire/
├── language-selector.blade.php
└── selector/
    ├── sidebar.blade.php
    ├── dropdown.blade.php
    └── modal.blade.php
```

::: tip अपने navigation के साथ integrate करें
यदि आप Flux के sidebar या navbar components उपयोग करते हैं, तो `sidebar` mode naturally Flux के `<flux:navlist>` या `<flux:sidebar>` में fit होता है। View प्रकाशित करें और अपनी navigation structure से match करने के लिए markup अनुकूलित करें।
:::

## Changes के बाद selector refresh करना

Selector `refreshLanguages` Livewire event सुनता है। यदि आप management UI से (या programmatically) कोई भाषा जोड़ते या हटाते हैं, तो selector page reload के बिना स्वचालित रूप से re-render होता है।

```js
// किसी भी Livewire component या Alpine.js code से dispatch करें:
this.$dispatch('refreshLanguages')
```
