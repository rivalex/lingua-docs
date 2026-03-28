# यह कैसे काम करता है

Lingua की आंतरिक संरचना को समझने से इसे configure, debug और extend करना आसान हो जाता है।

## Request lifecycle

```
Browser request
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware       │  Session से 'locale' पढ़ता है
│  app()->setLocale($locale)  │  DB default पर fallback करता है
└──────────────┬──────────────┘
               │
    ▼
┌─────────────────────────────┐
│        Your Controller      │
│  __('auth.failed')          │  मानक Laravel helper
└──────────────┬──────────────┘
               │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  Custom TranslationLoaderManager
│  1. DB loader (Spatie)      │  DB ओवरलैप पर हमेशा जीतता है
│  2. File loader (fallback)  │
└──────────────┬──────────────┘
               │
    ▼
अनुवादित string वापस आती है
```

## Translation loading

`LinguaManager` Spatie के `TranslationLoaderManager` को extend करता है। रनटाइम पर यह दो sources को merge करता है:

1. **File loader** — सामान्य Laravel की तरह `lang/` से पढ़ता है
2. **Database loader** (Spatie का `Db` loader) — `language_lines` से पढ़ता है

जब एक ही key दोनों sources में मौजूद हो, **डेटाबेस मान जीतता है**। इससे आप सोर्स फ़ाइलों को छुए बिना किसी भी vendor या file-based अनुवाद को ओवरराइड कर सकते हैं।

यदि `language_lines` टेबल अभी मौजूद नहीं है (उदाहरण: migration चलाने से पहले), तो `LinguaManager` gracefully केवल-फ़ाइल मोड पर fallback करता है।

## Middleware

`LinguaMiddleware` को `LinguaServiceProvider` द्वारा boot पर `web` middleware group में स्वचालित रूप से जोड़ा जाता है। यह प्रत्येक web request पर चलता है:

```php
// सरल logic
$locale = session()->get(config('lingua.session_variable'))
    ?? Language::default()?->code
    ?? config('app.locale');

app()->setLocale($locale);
app()->setFallbackLocale($defaultLocale);
session()->put(config('lingua.session_variable'), $locale);
```

## Service provider

`LinguaServiceProvider` boot पर तीन काम करता है:

1. **Blade anonymous components** को `lingua::` prefix के तहत register करता है
2. **Livewire components** को `lingua::` namespace के तहत register करता है
3. **`translator` और `translation.loader` singletons** को IoC container में Lingua के कस्टम implementations से बदलता है

चूँकि service provider core translator binding को replace करता है, इसलिए यह ज़रूरी है कि यह Laravel के `TranslationServiceProvider` के *बाद* boot हो। Composer का autoload क्रम इसे स्वचालित रूप से संभालता है।

## Database schema

दो टेबल उपयोग की जाती हैं:

### `languages`

| कॉलम | प्रकार | नोट्स |
|---|---|---|
| `id` | bigint (auto-increment) | Primary key |
| `code` | string | ISO 639-1 code (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | पूर्ण regional code (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` या `'standard'` |
| `name` | string | अंग्रेज़ी display नाम (`French`) |
| `native` | string | मूल नाम (`Français`) |
| `direction` | string | `'ltr'` या `'rtl'` |
| `is_default` | boolean | केवल एक पंक्ति `true` होनी चाहिए |
| `sort` | integer | Display क्रम (स्वचालित रूप से असाइन किया जाता है) |

### `language_lines` (Spatie)

| कॉलम | प्रकार | नोट्स |
|---|---|---|
| `id` | bigint (auto-increment) | Primary key |
| `group` | string | Translation group (`auth`, `validation`, `single`) |
| `key` | string | Translation key (`failed`, `required`) |
| `text` | json | `{"en": "…", "fr": "…", "it": "…"}` |
| `type` | string | `'text'`, `'html'`, या `'markdown'` |
| `is_vendor` | boolean | तृतीय-पक्ष पैकेज strings के लिए `true` |
| `vendor` | string, nullable | Vendor नाम (उदाहरण: `spatie`, `laravel`) |

JSON `text` कॉलम **एक ही पंक्ति में सभी locales** संग्रहीत करता है। इस डिज़ाइन का अर्थ है:
- नया locale जोड़ने से schema कभी नहीं बदलता
- एक ही query किसी key के सभी locale values लाती है
- गुम locales के JSON object में बस कोई key नहीं होती

## Seeder

`LinguaSeeder` को `lingua:install` के दौरान एक बार call किया जाता है। यह:

1. `config('lingua.default_locale')` पढ़ता है (डिफ़ॉल्ट: `config('app.locale')`)
2. `laravel-lang/locales` से locale metadata लाता है
3. `is_default = true` के साथ एक `Language` रिकॉर्ड बनाता है
4. भाषा फ़ाइलें इंस्टॉल करने के लिए `lingua:add {locale}` call करता है
5. सभी strings आयात करने के लिए `lingua:sync-to-database` call करता है

## Models

| Model | Table | Extends |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | Spatie का `LanguageLine` |

`Translation` Spatie के `setTranslation()` और `forgetTranslation()` methods inherit करता है और Lingua-specific scopes, sync methods, और statistics helpers जोड़ता है।
