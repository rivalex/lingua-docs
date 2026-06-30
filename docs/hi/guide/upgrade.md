# 1.x से 2.0 में अपग्रेड

यह गाइड Lingua 1.x से 2.0 में माइग्रेट करने को कवर करती है। अधिकांश एप्लिकेशन के लिए परिवर्तन छोटे हैं।

## तोड़ने वाले परिवर्तन

### 1. `spatie/laravel-translation-loader` हटाया गया

2.0 में अब `spatie/laravel-translation-loader` की **कोई** रनटाइम निर्भरता नहीं है। Lingua अपना स्वयं का `LinguaManager` (ट्रांसलेशन लोडर) शिप करता है।

**क्या करें:**

```bash
composer remove spatie/laravel-translation-loader
```

यदि आपके `config/app.php` में Spatie का ServiceProvider है, तो उसे हटाएं:

```php
// हटाएं:
Spatie\TranslationLoader\TranslationServiceProvider::class,
```

### 2. `laravel-lang/common` हटाया गया

Lingua 2.0 बंडल ट्रांसलेशन डेटासेट (26 लोकेल × 7 ग्रुप) अंदर से शिप करता है। `laravel-lang/common` की अब आवश्यकता नहीं है।

```bash
composer remove laravel-lang/common
```

### 3. `middleware` डिफ़ॉल्ट `['web']` से `['web', 'auth']` में बदला

1.x में प्रबंधन रूट **सार्वजनिक** थे। 2.0 में वे डिफ़ॉल्ट रूप से `auth` Middleware द्वारा सुरक्षित हैं।

यदि आप उन्हें सार्वजनिक रखना चाहते हैं (अनुशंसित नहीं):

```php
// config/lingua.php
'middleware' => ['web'],
```

### 4. `navigate` डिफ़ॉल्ट `true` से `false` में बदला

1.x में Lingua के आंतरिक लिंक पर `wire:navigate` डिफ़ॉल्ट था। 2.0 में डिफ़ॉल्ट `false` है। opt in करने के लिए:

```php
// config/lingua.php
'navigate' => true,
```

### 5. `Lingua::info()` अब `?LocaleInfo` return करता है

1.x में `Lingua::info($locale)` unknown locale के लिए exception throw करता था। 2.0 में यह `null` return करता है।

```php
// पहले (1.x) — exception संभव
$info = Lingua::info('xx');

// अब (2.0) — null-safe पैटर्न उपयोग करें
$info = Lingua::info('fr');
if ($info !== null) {
    echo $info->name; // "French"
}
```

### 6. `lingua-assets` vendor publish tag हटाया गया

2.0 में अब कोई `lingua-assets` publish tag नहीं है। Lingua अपने CSS/JS assets अब Laravel का built-in asset bundling उपयोग करके serve करता है।

यदि आपके deploy scripts में `--tag=lingua-assets` है, तो उस line को हटाएं।

---

## नए कॉन्फ़िग keys जोड़ें

`lingua:install` चलाने के बाद या मैन्युअल अपग्रेड के लिए, अपने `config/lingua.php` में ये नई keys जोड़ें:

```php
// स्टोरेज ड्राइवर (2.0 में नया)
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],

// गेट-आधारित एक्सेस (2.0 में नया)
'gate' => env('LINGUA_GATE', null),

// कैश (2.0 में नया)
'cache' => [
    'store'  => env('LINGUA_CACHE_STORE', null),
    'prefix' => env('LINGUA_CACHE_PREFIX', 'lingua.trans'),
],

// नेविगेशन (2.0 में नया)
'nav' => [
    'enabled' => true,
],

// navigate डिफ़ॉल्ट बदला
'navigate' => false,

// राउटिंग extras (2.0 में नया)
'routes_extra_parameters' => null,
'layout'                  => null,
```

---

## माइग्रेशन

2.0 `lingua_settings` टेबल जोड़ता है (Settings पेज को backend करता है)। यदि आप 1.x से अपग्रेड कर रहे हैं:

```bash
php artisan vendor:publish --tag="lingua-migrations"
php artisan migrate
```

केवल नई माइग्रेशन चलेगी — `language_lines` टेबल को छुआ नहीं जाएगा।

---

## अक्सर पूछे जाने वाले प्रश्न

**क्या मेरा डेटाबेस डेटा सुरक्षित है?**
हाँ। 2.0 में `language_lines` schema अपरिवर्तित है।

**क्या मुझे सभी अनुवाद फिर से sync करने की आवश्यकता है?**
नहीं। यदि आपने पहले से `language_lines` में डेटा है, तो यह सीधे काम करता है।

**`laravel-lang` बंडल और 1.x बंडल में क्या अंतर है?**
2.0 बंडल डेटासेट Laravel v13.14.0 के अनुरूप है, जिसमें `doesnt_contain` और `encoding` validation keys जोड़े गए हैं, और notification subjects update हुए हैं।

**file ड्राइवर पर स्विच करना कब सही है?**
यदि आप CI वातावरण में काम करते हैं या अनुवाद version control में रखना चाहते हैं। देखें [Storage Drivers](/hi/guide/storage)।
