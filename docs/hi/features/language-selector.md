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

---

## Headless मोड

Headless selector कोई CSS या framework markup नहीं बनाता — केवल `data-lingua-*` attributes के साथ शुद्ध semantic HTML, जिसे आप पूरी तरह अपने CSS, Tailwind, या किसी अन्य तरीके से style करते हैं।

Headless मोड का उपयोग करें जब आपको locale-switching logic चाहिए लेकिन visual output पर पूरा नियंत्रण चाहते हों।

### बुनियादी उपयोग

```blade
<livewire:lingua::headless-language-selector />
```

भाषा सूची हमेशा DOM में मौजूद रहती है। दृश्यता आपकी जिम्मेदारी है — CSS `display`, Alpine.js `x-show`, या कोई अन्य mechanism उपयोग करें। डिज़ाइन द्वारा कोई built-in trigger button नहीं दिया गया है।

Config या Settings पेज के माध्यम से headless मोड को globally सक्षम करें:

```php
// config/lingua.php
'selector' => ['mode' => 'headless'],
```

### नामित slots

#### `$item` slot

प्रत्येक भाषा `<li>` के अंदर डिफ़ॉल्ट `<button>` markup को बदलता है। `Language` model instance प्राप्त करता है:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        {{ $language->native }} ({{ $language->code }})
    </x-slot>
</livewire:lingua::headless-language-selector>
```

#### `$current` slot

केवल **वर्तमान में चयनित** भाषा के rendering को बदलता है। यदि प्रदान नहीं किया गया तो `$item` पर वापस आता है:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:current="language">
        <strong>{{ $language->native }}</strong>
    </x-slot>
    <x-slot:item="language">
        {{ $language->native }}
    </x-slot>
</livewire:lingua::headless-language-selector>
```

### CSS targeting API

Component CSS और JavaScript targeting के लिए प्रत्येक element पर `data-lingua-*` attributes expose करता है:

| Attribute | Element |
|---|---|
| `data-lingua-selector` | Root `<nav>` element |
| `data-lingua-list` | `<ul>` भाषा सूची |
| `data-lingua-item` | प्रत्येक `<li>` भाषा entry |
| `data-lingua-active` | वर्तमान सक्रिय भाषा का `<li>` |
| `data-lingua-button` | प्रत्येक `<li>` के अंदर `<button>` |
| `data-lingua-name` | भाषा का अंग्रेज़ी नाम `<span>` |
| `data-lingua-native` | भाषा का native नाम `<span>` |
| `data-lingua-code` | भाषा ISO code `<span>` |

### Styling उदाहरण

**सादा CSS:**

```css
[data-lingua-selector] {
    display: flex;
    gap: 0.5rem;
    list-style: none;
}
[data-lingua-item] {
    cursor: pointer;
}
[data-lingua-active] {
    font-weight: bold;
    text-decoration: underline;
}
[data-lingua-button] {
    background: none;
    border: none;
    padding: 0.25rem 0.5rem;
}
```

**Tailwind CSS:**

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        <span class="px-3 py-1 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            {{ $language->native }}
        </span>
    </x-slot>
    <x-slot:current="language">
        <span class="px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900 font-semibold text-red-700 dark:text-red-300">
            {{ $language->native }}
        </span>
    </x-slot>
</livewire:lingua::headless-language-selector>
```

**Alpine.js visibility toggle:**

```blade
<div x-data="{ open: false }">
    <button @click="open = !open">
        {{ app()->getLocale() }}
    </button>

    <div x-show="open" @click.outside="open = false">
        <livewire:lingua::headless-language-selector>
            <x-slot:item="language">
                <button class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                    {{ $language->native }}
                </button>
            </x-slot>
        </livewire:lingua::headless-language-selector>
    </div>
</div>
```

### Props संदर्भ (अपडेट किया गया)

| Prop | प्रकार | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'`, `'modal'`, या `'headless'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | देश के झंडे icons दिखाएं |

::: tip
जब `mode="headless"` को `<livewire:lingua::language-selector />` में पास किया जाता है, तो वह component कुछ भी render नहीं करता। पूर्ण slot और attribute support के लिए सीधे `<livewire:lingua::headless-language-selector />` का उपयोग करें।
:::
