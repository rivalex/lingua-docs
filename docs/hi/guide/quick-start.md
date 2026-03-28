# त्वरित शुरुआत

यह गाइड आपको कुछ ही मिनटों में एक नई Lingua इंस्टॉल से एक पूर्णतः बहुभाषी एप्लिकेशन तक ले जाती है।

## 1. इंस्टॉल और seed करें

```bash
composer require rivalex/lingua
php artisan lingua:install
```

अंग्रेज़ी अब आपकी डिफ़ॉल्ट भाषा है, और सभी Laravel/vendor translation strings डेटाबेस में आयात हो गए हैं।

## 2. अपनी दूसरी भाषा जोड़ें

```bash
php artisan lingua:add fr
```

यह कमांड:
- Laravel Lang के माध्यम से French translation फ़ाइलें डाउनलोड करती है
- डेटाबेस में एक `Language` रिकॉर्ड बनाती है
- नई डाउनलोड की गई सभी strings को `language_lines` में sync करती है

जितने लोकेल चाहिए उनके लिए दोहराएँ:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. अपने layout में language selector जोड़ें

अपनी मुख्य Blade layout खोलें (उदाहरण `resources/views/layouts/app.blade.php`) और:

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

## 4. अपने एप्लिकेशन में अनुवाद का उपयोग करें

Lingua पारदर्शी है - हमेशा की तरह मानक Laravel helpers का उपयोग करें:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

कस्टम `LinguaManager` स्वचालित रूप से फ़ाइल-आधारित अनुवादों के ऊपर डेटाबेस अनुवादों को merge करता है। कोड में कोई बदलाव नहीं करना पड़ता।

## 5. UI के माध्यम से अनुवाद करें

सभी translation strings देखने के लिए `/lingua/translations` पर जाएँ। प्रत्येक भाषा के लिए:

1. लक्ष्य भाषा चुनने के लिए locale switcher (ऊपर दाईं ओर) का उपयोग करें
2. Inline मान संपादित करने के लिए किसी भी पंक्ति पर क्लिक करें
3. अनुवाद न हुई strings पर ध्यान केंद्रित करने के लिए **Show only missing** का उपयोग करें
4. HTML या Markdown types के लिए rich-text editor स्वचालित रूप से सक्रिय होता है

<Screenshot src="/screenshots/translations-page.png" alt="Lingua अनुवाद प्रबंधन पेज" caption="locale switcher, group filter, और inline editor के साथ translations पेज।" />

## 6. फ़ाइलों में वापस sync करें (वैकल्पिक)

यदि आपको disk पर translation फ़ाइलें चाहिए (version control, CI/CD, या अन्य tools के लिए):

```bash
php artisan lingua:sync-to-local
```

यह प्रत्येक DB अनुवाद को सही PHP/JSON format में `lang/` में निर्यात करता है।

---

## सामान्य patterns

### प्रोग्रामेटिक रूप से एक नई key का अनुवाद करें

```php
use Rivalex\Lingua\Facades\Lingua;

// डिफ़ॉल्ट locale के लिए डेटाबेस में अनुवाद बनाएँ
// (यह सामान्यतः UI के माध्यम से किया जाता है, लेकिन आप script भी कर सकते हैं)
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

// बाद में, अन्य locales के लिए अनुवाद जोड़ें:
Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
Lingua::setTranslation('welcome_subject', 'Benvenuto nella nostra piattaforma!', 'it');
```

### अनुवाद पूर्णता जाँचें

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]
```

### प्रोग्रामेटिक रूप से locale बदलें

```php
// Controller, middleware, या service में
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```

::: tip
`LanguageSelector` कंपोनेंट end users के लिए locale switching स्वचालित रूप से संभालता है। उपरोक्त मैनुअल तरीका console commands या jobs में उपयोगी है।
:::

### केवल specific groups निर्यात करें

यदि आप केवल अनुवादों का एक subset फ़ाइलों में निर्यात करना चाहते हैं, तो पहले local में sync करें, फिर जिन groups की ज़रूरत नहीं है उन्हें `lang/` से हटाएँ - रनटाइम पर डेटाबेस हमेशा source of truth होता है।
