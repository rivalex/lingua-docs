# सेटिंग्स

सेटिंग्स पृष्ठ आपको ब्राउज़र से Lingua का UI व्यवहार कॉन्फ़िगर करने देता है — कोई config file संपादन या redeployment की आवश्यकता नहीं।

`/lingua/settings` पर जाएं या अपने admin panel से लिंक करें:

```blade
<a href="{{ route('lingua.settings') }}">Lingua सेटिंग्स</a>
```

<Screenshot src="/screenshots/settings-page.png" alt="Lingua सेटिंग्स पृष्ठ" caption="Selector mode और flag icon controls के साथ सेटिंग्स पृष्ठ।" />

## सेटिंग्स कैसे काम करती हैं

सेटिंग्स `lingua_settings` डेटाबेस तालिका में टाइप किए गए key/value pairs के रूप में संग्रहीत होती हैं। प्रत्येक request पर, Lingua पहले डेटाबेस से पढ़ता है, फिर `config/lingua.php` पर वापस आता है, फिर hardcoded defaults पर।

**प्राथमिकता chain:**
1. `lingua_settings` DB तालिका (सर्वोच्च — इस UI के माध्यम से सेट)
2. `config/lingua.php` (आपका published config)
3. Package defaults (न्यूनतम)

इसका मतलब है कि आप अपने `config/lingua.php` को baseline के रूप में रख सकते हैं और files को छुए बिना UI के माध्यम से प्रति environment विशिष्ट सेटिंग्स override कर सकते हैं।

## Selector mode

नियंत्रित करता है कि `<livewire:lingua::language-selector />` component आपके अंतिम उपयोगकर्ताओं के लिए कैसे render होता है।

| Mode | विवरण |
|---|---|
| `sidebar` | Grouped navigation section के रूप में render करता है (default) |
| `modal` | एक button के रूप में render करता है जो पूर्ण language picker modal खोलता है |
| `dropdown` | Compact dropdown button के रूप में render करता है |
| `headless` | कोई built-in rendering नहीं — आप UI स्वयं implement करते हैं |

::: tip Headless mode
जब `headless` पर सेट किया जाता है, तो built-in selector कुछ भी render नहीं करता। इसके बजाय पूरी तरह custom switcher बनाने के लिए `<livewire:lingua::headless-language-selector />` का उपयोग करें। पूर्ण दस्तावेज़ीकरण के लिए [Headless Selector](./language-selector#headless-मोड) देखें।
:::

## Flag icons दिखाएं

Selector में भाषा नामों के बगल में देश के flag icons का प्रदर्शन टॉगल करें। जब अक्षम होता है, केवल भाषा का नाम दिखाया जाता है।

Flag icons भाषा के `regional` code से मेल खाते हैं (जैसे `en_US` → 🇺🇸)। यदि कोई regional code सेट नहीं है, तो flag gracefully वापस आता है।

## Programmatic access

आप `LinguaSetting` model का उपयोग करके PHP में सेटिंग्स पढ़ और लिख सकते हैं:

```php
use Rivalex\Lingua\Models\LinguaSetting;

// config() fallback के साथ पढ़ें
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

$showFlags = LinguaSetting::get(
    LinguaSetting::KEY_SHOW_FLAGS,
    config('lingua.selector.show_flags', true)
);

// लिखें
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_SHOW_FLAGS, false);
```

उपलब्ध constants:

| Constant | Key | Type |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |

::: warning Migration आवश्यक
`lingua_settings` तालिका `create_lingua_settings_table` migration द्वारा बनाई जाती है। यदि आपने 1.0.x से upgrade किया है, तो इसे बनाने के लिए `php artisan migrate` चलाएं।
:::
