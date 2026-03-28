# कॉन्फ़िगरेशन

इंस्टॉलेशन के बाद, `config/lingua.php` सभी Lingua सेटिंग्स का एकमात्र स्रोत है।

```php
// config/lingua.php

return [

    /*
    |--------------------------------------------------------------------------
    | Language Files Directory
    |--------------------------------------------------------------------------
    | The path where local PHP/JSON translation files are stored.
    | Used by lingua:sync-to-database and lingua:sync-to-local.
    */
    'lang_dir' => lang_path(),

    /*
    |--------------------------------------------------------------------------
    | Default Locale
    |--------------------------------------------------------------------------
    | The fallback locale code used during installation and when the database
    | has no default language configured.
    */
    'default_locale' => config('app.locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Fallback Locale
    |--------------------------------------------------------------------------
    | When a translation is missing in the active locale, Laravel will try
    | this locale next.
    */
    'fallback_locale' => config('app.fallback_locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Route Middleware
    |--------------------------------------------------------------------------
    | Middleware applied to all Lingua management routes.
    | Add 'auth' (and role/permission guards) before going to production.
    */
    'middleware' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Route Prefix
    |--------------------------------------------------------------------------
    | URL prefix for Lingua's management pages.
    | Default: /lingua/languages and /lingua/translations
    */
    'routes_prefix' => 'lingua',

    /*
    |--------------------------------------------------------------------------
    | Session Variable
    |--------------------------------------------------------------------------
    | The session key used to persist the user's active locale across requests.
    */
    'session_variable' => 'locale',

    /*
    |--------------------------------------------------------------------------
    | Language Selector
    |--------------------------------------------------------------------------
    | Controls the default behaviour of the <livewire:lingua::language-selector>
    | component. Both options can be overridden per-instance via props.
    */
    'selector' => [
        'mode'       => 'sidebar',   // 'sidebar' | 'modal' | 'dropdown'
        'show_flags' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Rich-text Editor Toolbar
    |--------------------------------------------------------------------------
    | Defines which formatting options are available in the TipTap editor
    | for HTML and Markdown translation types.
    */
    'editor' => [
        'headings'      => false,
        'bold'          => true,
        'italic'        => true,
        'underline'     => true,
        'strikethrough' => false,
        'bullet'        => true,
        'ordered'       => true,
        'clear'         => true,
    ],

];
```

---

## विकल्प संदर्भ

### `lang_dir`

**डिफ़ॉल्ट:** `lang_path()` (`{project_root}/lang/` को resolve करता है)

वह डायरेक्टरी जिसे Lingua फ़ाइलों को डेटाबेस में सिंक करते समय पढ़ता है और वापस फ़ाइलों में निर्यात करते समय लिखता है। यदि आपकी translation फ़ाइलें गैर-मानक स्थान पर हैं तो इसे बदलें।

### `default_locale`

**डिफ़ॉल्ट:** `config('app.locale', 'en')`

इंस्टॉलेशन के दौरान और जब `languages` टेबल खाली हो तो fallback के रूप में उपयोग किया जाता है। इंस्टॉलेशन के बाद, आधिकारिक डिफ़ॉल्ट `languages` टेबल में `is_default = true` वाली पंक्ति होती है।

### `fallback_locale`

**डिफ़ॉल्ट:** `config('app.fallback_locale', 'en')`

मानक Laravel fallback व्यवहार — जब active locale में कोई key अनुपस्थित हो, तो यह लोकेल अगला प्रयास किया जाता है।

### `middleware`

**डिफ़ॉल्ट:** `['web']`

::: danger प्रोडक्शन आवश्यकता
डिप्लॉय करने से पहले कम से कम `'auth'` जोड़ें। इसके बिना, URL जानने वाला कोई भी व्यक्ति आपके अनुवाद बदल सकता है।
:::

```php
// सामान्य प्रोडक्शन सेटअप
'middleware' => ['web', 'auth'],

// Spatie Laravel Permission के साथ
'middleware' => ['web', 'auth', 'role:admin'],

// कस्टम Gate policy के साथ
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `routes_prefix`

**डिफ़ॉल्ट:** `'lingua'`

सभी Lingua प्रबंधन पेजों का URL prefix बदलता है:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
// → /admin/translations/translations
```

### `session_variable`

**डिफ़ॉल्ट:** `'locale'`

Session key जहाँ Lingua उपयोगकर्ता का चुना हुआ locale संग्रहीत करता है। यदि यह किसी अन्य पैकेज से conflict करे तो इसे बदलें।

### `selector.mode`

**डिफ़ॉल्ट:** `'sidebar'`

`<livewire:lingua::language-selector>` कंपोनेंट के डिफ़ॉल्ट render मोड को नियंत्रित करता है:

| मान | विवरण |
|---|---|
| `sidebar` | एक grouped sidebar navigation item के रूप में render करता है |
| `dropdown` | एक compact dropdown button के रूप में render करता है |
| `modal` | एक बटन के रूप में render करता है जो locale picker modal खोलता है |

### `selector.show_flags`

**डिफ़ॉल्ट:** `true`

selector में भाषा नामों के बगल में देश के झंडे के आइकन दिखाने हैं या नहीं। इसके लिए `outhebox/blade-flags` पैकेज आवश्यक है (स्वचालित रूप से dependency के रूप में इंस्टॉल होता है)।

### `editor`

HTML और Markdown translation types के लिए TipTap toolbar को नियंत्रित करता है। प्रत्येक विकल्प एक TipTap extension से मैप होता है:

| Key | विवरण |
|---|---|
| `headings` | H1–H3 heading बटन |
| `bold` | **बोल्ड** |
| `italic` | *इटैलिक* |
| `underline` | अंडरलाइन |
| `strikethrough` | ~~स्ट्राइकथ्रू~~ |
| `bullet` | अनुक्रमित सूची |
| `ordered` | क्रमांकित सूची |
| `clear` | फ़ॉर्मेटिंग साफ करें बटन |

::: tip
Editor toolbar वैश्विक है — सभी HTML/Markdown translation फ़ील्ड एक ही कॉन्फ़िगरेशन share करते हैं। यदि आपको प्रति-फ़ील्ड नियंत्रण चाहिए, तो views प्रकाशित करें और editor कंपोनेंट को सीधे कस्टमाइज़ करें।
:::
