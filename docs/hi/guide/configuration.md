# कॉन्फ़िगरेशन

इंस्टॉलेशन के बाद, `config/lingua.php` सभी Lingua सेटिंग्स का एकमात्र स्रोत है। यह पेज हर कीज़ को चिंता के अनुसार समूहीकृत करके दस्तावेज़ीकृत करता है। <Badge type="tip" text="2.0 में नया" /> से चिह्नित कीज़ 1.x में मौजूद नहीं थीं।

## लोकेल सेटिंग्स

```php
// config/lingua.php

'lang_dir'         => lang_path(),
'base_translations_path' => null, // ★ 2.0 में नया
'default_locale'   => config('app.locale', 'en'),
'fallback_locale'  => config('app.fallback_locale', 'en'),
'session_variable' => 'locale',
```

### `lang_dir`

**डिफ़ॉल्ट:** `lang_path()` — `{project_root}/lang/` को resolve करता है।

वह डायरेक्टरी जिसे Lingua फ़ाइलों को डेटाबेस में सिंक करते समय पढ़ता है और वापस फ़ाइलों में निर्यात करते समय लिखता है।

### `base_translations_path` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `null`

वह पाथ जहाँ से Lingua **बंडल** ट्रांसलेशन डेटासेट पढ़ता है उसके लिए वैकल्पिक ओवरराइड। पैकेज के अंदर शिप होने वाले डेटासेट का उपयोग करने के लिए `null` छोड़ें।

### `default_locale`

**डिफ़ॉल्ट:** `config('app.locale', 'en')`

इंस्टॉलेशन के दौरान और जब `languages` टेबल खाली हो तब फ़ॉलबैक के रूप में उपयोग किया जाता है। इंस्टॉलेशन के बाद, आधिकारिक डिफ़ॉल्ट `languages` टेबल में `is_default = true` वाली पंक्ति होती है।

### `fallback_locale`

**डिफ़ॉल्ट:** `config('app.fallback_locale', 'en')`

मानक Laravel फ़ॉलबैक — जब active locale में कोई कीज़ गायब हो, तो यह लोकेल अगला प्रयास किया जाता है।

### `session_variable`

**डिफ़ॉल्ट:** `'locale'`

वह session key जहाँ Lingua उपयोगकर्ता का चुना हुआ लोकेल संग्रहीत करता है।

---

## सुरक्षा और पहुंच

```php
'middleware' => ['web', 'auth'],
'gate'       => env('LINGUA_GATE', null), // ★ 2.0 में नया
```

### `middleware`

**डिफ़ॉल्ट:** `['web', 'auth']` <Badge type="warning" text="2.0 में बदला" />

::: tip डिफ़ॉल्ट रूप से सुरक्षित
2.0 में डिफ़ॉल्ट `['web', 'auth']` है — प्रबंधन UI डिफ़ॉल्ट रूप से **सार्वजनिक रूप से पहुंच योग्य नहीं** है। 1.x में यह `['web']` था।
:::

```php
// Spatie Laravel Permission के साथ
'middleware' => ['web', 'auth', 'role:admin'],

// कस्टम Gate policy के साथ
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `gate` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `env('LINGUA_GATE', null)`

सेट होने पर, Lingua सभी एडमिन रूट में `can:{gate}` जोड़ता है। किसी service provider में गेट परिभाषित करें:

```env
LINGUA_GATE=manage-translations
```

```php
Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

[Security reference](/hi/guide/security#authentication) देखें।

---

## राउटिंग

```php
'routes_prefix'           => 'lingua',
'routes_extra_parameters' => null,  // ★ 2.0 में नया
'navigate'                => false, // ★ 2.0 में नया (डिफ़ॉल्ट बदला)
'layout'                  => null,  // ★ 2.0 में नया
```

### `routes_prefix`

**डिफ़ॉल्ट:** `'lingua'`

सभी Lingua प्रबंधन पेजों के URL prefix को बदलता है:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
```

### `routes_extra_parameters` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `null`

रूट prefix के साथ जोड़ा जाने वाला वैकल्पिक parameterized suffix — tenant- या section-scoped prefixes के लिए उपयोगी।

### `navigate` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `false` <Badge type="warning" text="2.0 में बदला" />

Lingua के आंतरिक लिंक पर `wire:navigate` नियंत्रित करता है। डिफ़ॉल्ट अब `false` है (पूर्ण-पेज रीडायरेक्ट), जो SPA-navigation edge cases से बचाता है। `'navigate' => true` के साथ opt in करें।

### `layout` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `null`

Lingua के views के लिए एक कस्टम Blade लेआउट प्रदान करें। पैकेज के बिल्ट-इन लेआउट का उपयोग करने के लिए `null` छोड़ें।

---

## नेविगेशन

```php
'nav' => [
    'enabled' => true, // ★ 2.0 में नया
],
'links' => [
    'translations' => [          // ★ 2.0 में नया
        'enabled' => true,
        'route'   => 'lingua.translations',
    ],
],
```

### `nav.enabled` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `true`

साझा `x-lingua::nav` नेविगेशन मेनू को टॉगल करता है जो सभी पाँच Lingua पेजों पर दिखाई देता है। Settings UI से भी टॉगल किया जा सकता है।

### `links.translations` <Badge type="tip" text="2.0 में नया" />

साझा nav में "Translations" एंट्री को नियंत्रित करता है: यह दिखाई दे या नहीं (`enabled`) और किस रूट पर इशारा करे (`route`)।

---

## UI

```php
'ui' => [
    'sticky_top' => 0, // ★ 2.0 में नया
],
'selector' => [
    'mode'       => 'sidebar',  // 'sidebar' | 'modal' | 'dropdown' | 'headless'
    'show_flags' => true,
],
'editor' => [
    'headings' => false, 'bold' => true, 'italic' => true,
    'underline' => true, 'strikethrough' => false,
    'subscript' => true, 'superscript' => true,
    'blockquote' => false, 'code-line' => false, 'code-block' => false,
    'bullet' => true, 'ordered' => true, 'clear' => true, 'code-mode' => false,
],
```

### `ui.sticky_top` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `0`

Lingua के sticky toolbars के लिए पिक्सेल ऑफसेट। यदि आपके ऐप में एक फिक्स्ड हेडर है तो इसे बढ़ाएं ताकि toolbar उसके नीचे न चली जाए।

### `selector.mode`

**डिफ़ॉल्ट:** `'sidebar'`

| मान | विवरण |
|---|---|
| `sidebar` | ग्रुप किया हुआ sidebar नेविगेशन आइटम |
| `dropdown` | कॉम्पैक्ट dropdown बटन |
| `modal` | एक बटन जो locale picker modal खोलता है |
| `headless` | कोई बिल्ट-इन रेंडरिंग नहीं — headless कंपोनेंट का उपयोग करें |

### `selector.show_flags`

**डिफ़ॉल्ट:** `true`

भाषा नामों के बगल में country flag icons दिखाएं या नहीं।

### `editor`

HTML और Markdown अनुवाद प्रकारों के लिए rich-text toolbar नियंत्रित करता है (केवल database ड्राइवर)। प्रत्येक key एक फ़ॉर्मेटिंग विकल्प को टॉगल करती है: `headings`, `bold`, `italic`, `underline`, `strikethrough`, `subscript`, `superscript`, `blockquote`, `code-line`, `code-block`, `bullet`, `ordered`, `clear`, `code-mode`।

---

## स्टोरेज ड्राइवर <Badge type="tip" text="2.0 में नया" />

```php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

### `storage.driver`

**डिफ़ॉल्ट:** `env('LINGUA_STORAGE_DRIVER', 'database')`

अनुवाद कहाँ रहते हैं यह चुनता है:

| ड्राइवर | व्यवहार |
|---|---|
| `database` | पूर्ण 1.x व्यवहार: `language_lines` टेबल, HTML/Markdown प्रकार, आँकड़े, आयात/निर्यात, वेंडर गार्ड, सर्जिकल कैश। |
| `file` | `lang/` PHP+JSON सीधे पढ़ता/लिखता है; कोई `language_lines` टेबल नहीं; प्रकार plain text में flatten होते हैं। |

यह एक प्रमुख फीचर है — पूर्ण तुलना और `lingua:storage` switch command के लिए [Storage Drivers](/hi/guide/storage) देखें।

---

## कैश

```php
'cache' => [
    'store'  => env('LINGUA_CACHE_STORE', null),       // ★ 2.0 में नया
    'prefix' => env('LINGUA_CACHE_PREFIX', 'lingua.trans'), // ★ 2.0 में नया
],
```

### `cache.store` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `env('LINGUA_CACHE_STORE', null)`

ट्रांसलेशन कैशिंग के लिए Lingua कौन सा cache store उपयोग करता है। `null` आपके एप्लिकेशन के डिफ़ॉल्ट store का उपयोग करता है।

### `cache.prefix` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `env('LINGUA_CACHE_PREFIX', 'lingua.trans')`

Cache कीज़ के लिए prefix। Lingua अनुवादों को **सर्जिकल रूप से** प्रति `(locale, group)` कैश करता है और लिखने पर केवल प्रभावित key को भूलता है — कोई global `cache:clear` नहीं। देखें [Cache architecture](/hi/guide/architecture#cache-architecture)।

---

## ट्रांसलेशन लोडर

```php
'translation_loaders' => [
    // Rivalex\Lingua\Loaders\YourCustomLoader::class,
],
'model'               => Rivalex\Lingua\Models\Translation::class,
'translation_manager' => Rivalex\Lingua\TranslationManager\LinguaManager::class,
```

### `translation_loaders`

`Rivalex\Lingua\Contracts\TranslationLoader` implement करने वाले अतिरिक्त लोडर रजिस्टर करें। Contract signature है `loadTranslations(string $locale, string $group, ?string $namespace = null): array`।

### `model`

`language_lines` को बैक करने वाला Eloquent model। `Translation` को अपने लॉजिक के साथ extend करने के लिए override करें।

### `translation_manager`

ट्रांसलेशन लोडर class। डिफ़ॉल्ट रूप से `Rivalex\Lingua\TranslationManager\LinguaManager`, जो `Illuminate\Translation\FileLoader` extend करता है।

---

## एक्सटेंशन

```php
'extensions' => [
    'enabled' => env('LINGUA_EXTENSIONS_ENABLED', true), // ★ 2.0 में नया
],
'suppress_pro_nudge' => env('LINGUA_SUPPRESS_PRO_NUDGE', false), // ★ 2.0 में नया
'pro_upgrade_url'    => env('LINGUA_PRO_UPGRADE_URL', 'https://lingua.rivalex.dev'), // ★ 2.0 में नया
```

### `extensions.enabled` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `true`

वैकल्पिक Lingua extensions के लिए मास्टर स्विच।

### `suppress_pro_nudge` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `false`

UI में अपग्रेड संकेत छुपाने के लिए `true` सेट करें।

### `pro_upgrade_url` <Badge type="tip" text="2.0 में नया" />

**डिफ़ॉल्ट:** `https://lingua.rivalex.dev`

दिखाए जाने पर अपग्रेड संकेतों द्वारा उपयोग किया जाने वाला URL।
