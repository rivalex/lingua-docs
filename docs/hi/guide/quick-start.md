# त्वरित शुरुआत

यह गाइड आपको कुछ ही मिनटों में एक नई Lingua इंस्टॉल से एक पूरी तरह बहुभाषी एप्लिकेशन तक ले जाती है।

## 1. इंस्टॉल करें और सीड करें

```bash
composer require rivalex/lingua
php artisan lingua:install
```

संकेत मिलने पर **database** ड्राइवर चुनें (अनुशंसित)। अंग्रेज़ी आपकी डिफ़ॉल्ट भाषा बन जाती है, और बंडल ट्रांसलेशन स्ट्रिंग डेटाबेस में आयात हो जाते हैं — कोई GitHub डाउनलोड नहीं।

::: tip डिफ़ॉल्ट रूप से सुरक्षित
प्रबंधन रूट स्वचालित रूप से `['web', 'auth']` द्वारा सुरक्षित हैं। रोल-आधारित पहुंच के लिए `LINGUA_GATE` सेट करें — देखें [Installation](/hi/guide/installation#protecting-the-management-ui)।
:::

## 2. अपनी दूसरी भाषा जोड़ें

```bash
php artisan lingua:add fr
```

यह कमांड **DB-native** है: यह बंडल डेटासेट से French स्ट्रिंग सीड करता है और एक `Language` रिकॉर्ड बनाता है। यह फ़ाइलें डाउनलोड **नहीं** करता और `lang/` में **नहीं** लिखता।

जितने लोकेल चाहिए उनके लिए दोहराएं:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. अपने लेआउट में language selector जोड़ें

अपनी मुख्य Blade लेआउट खोलें (जैसे `resources/views/layouts/app.blade.php`):

**a) `<html>` टैग पर `lang` और `dir` सेट करें:**

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

**b) जहाँ आपके डिज़ाइन में सही लगे वहाँ language switcher एम्बेड करें:**

```blade
{{-- Sidebar group के रूप में (डिफ़ॉल्ट) --}}
<livewire:lingua::language-selector />

{{-- Navbar में dropdown के रूप में --}}
<livewire:lingua::language-selector mode="dropdown" />
```

::: tip लोकेल स्विच वर्तमान पेज रीलोड करता है
जब कोई उपयोगकर्ता लोकेल स्विच करता है, Lingua **उसी पेज** को रीलोड करता है जिस पर वे हैं (होम पेज नहीं), open-redirects से गार्ड किया हुआ। देखें [Security](/hi/guide/security#open-redirect-protection)।
:::

## 4. अपने एप्लिकेशन में अनुवाद का उपयोग करें

Lingua पारदर्शी है — हमेशा की तरह मानक Laravel helpers का उपयोग करें:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

database मोड में, `LinguaManager` स्वचालित रूप से file-based अनुवादों के ऊपर database अनुवादों को merge करता है। कोड में कोई बदलाव आवश्यक नहीं।

## 5. UI के माध्यम से अनुवाद करें

सभी translation strings देखने के लिए `/lingua/translations` पर जाएं। प्रत्येक भाषा के लिए:

1. लक्ष्य भाषा चुनने के लिए locale switcher (ऊपर दाईं ओर) का उपयोग करें
2. मान inline संपादित करने के लिए किसी भी पंक्ति पर क्लिक करें
3. अनुवाद न हुई strings पर ध्यान केंद्रित करने के लिए **Show only missing** का उपयोग करें
4. HTML या Markdown प्रकारों के लिए rich-text editor स्वचालित रूप से सक्रिय होता है

<Screenshot src="/screenshots/translations-page.png" alt="Lingua translations management page" caption="locale switcher, group filter, और inline editor के साथ translations पेज।" />

## 6. Transfer पेज के साथ आयात / निर्यात करें

क्या आपको spreadsheet में अनुवादों को bulk-edit करना है, या किसी translation agency को फ़ाइल सौंपनी है? `/lingua/transfer` पर जाएं:

- **Export** CSV, JSON, XLSX, या ODS में — bilingual, multi-locale, या JSON-native लेआउट
- **Import** कुछ भी लिखे जाने से पहले **diff preview** के साथ ड्राई-रन

XLSX/ODS के लिए वैकल्पिक `openspout/openspout` पैकेज आवश्यक है; CSV और JSON बॉक्स से बाहर काम करते हैं।

## 7. फ़ाइलों में वापस sync करें (वैकल्पिक)

यदि आपको disk पर translation files चाहिए (version control या CI/CD के लिए):

```bash
php artisan lingua:sync-to-local
```

यह प्रत्येक DB अनुवाद को सही PHP/JSON format में `lang/` में निर्यात करता है।

---

## सामान्य patterns

### प्रोग्रामेटिक रूप से एक नई key का अनुवाद करें

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
```

### एक लोकेल की जांच करें

```php
use Rivalex\Lingua\Facades\Lingua;

$info = Lingua::info('fr');

if ($info !== null) {
    $info->name;      // "French"
    $info->native;    // "Français"
    $info->direction; // "ltr"
}
```

::: warning 2.0 में बदला
`Lingua::info()` अब `?LocaleInfo` return करता है और अज्ञात locales के लिए `null` देता है (पहले exception throw करता था)। हमेशा `if ($info !== null)` के साथ guard करें।
:::

### प्रोग्रामेटिक रूप से लोकेल बदलें

```php
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```
