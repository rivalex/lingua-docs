# Translation Storage

अनुवाद कैसे संग्रहीत होते हैं यह समझना उन्हें सही ढंग से query, import और export करने में मदद करता है।

## `language_lines` टेबल

`language_lines` में प्रत्येक पंक्ति एक अनुवाद योग्य **string** को represent करती है — एक locale को नहीं। सभी locale values एकल JSON `text` कॉलम में एक साथ संग्रहीत होती हैं:

```
group      | key        | type | text
-----------|------------|------|---------------------------------------------------
validation | required   | text | {"en":"The :attribute field is required.","fr":"Le champ :attribute est obligatoire."}
auth       | failed     | text | {"en":"These credentials do not match.","it":"Le credenziali non corrispondono."}
single     | Welcome    | text | {"en":"Welcome","fr":"Bienvenue","de":"Willkommen"}
emails     | subject    | html | {"en":"<b>Welcome</b> to our platform!"}
```

### इस डिज़ाइन के फ़ायदे

- **प्रति string एक पंक्ति** — प्रबंधन के लिए per-locale पंक्तियाँ नहीं
- **locale जोड़ना non-destructive है** — बस JSON object में एक नई key जोड़ें
- **गुम अनुवाद स्पष्ट हैं** — यदि JSON में `fr` अनुपस्थित है, तो string अभी अनुवादित नहीं है
- **Single query** — एक `SELECT` किसी key के सभी locale values लाता है

### सीधे query करना

आप मानक Eloquent JSON column syntax का उपयोग करके `language_lines` query कर सकते हैं:

```php
use Rivalex\Lingua\Models\Translation;

// सभी अनुवाद जिनमें French value है
Translation::whereNotNull('text->fr')->get();

// केवल गुम French अनुवाद
Translation::whereNull('text->fr')->get();

// एक specific key खोजें
Translation::where('key', 'required')->where('group', 'validation')->first();

// एक group की सभी strings
Translation::where('group', 'auth')->get();
```

## Translation types

प्रत्येक translation पंक्ति में एक `type` होता है जो UI में उपयोग किया जाने वाला editor निर्धारित करता है:

| Type | उपयोग का मामला | सिंक करते समय auto-detect |
|---|---|---|
| `text` | सादे labels, संदेश, button text | डिफ़ॉल्ट |
| `html` | HTML tags के साथ rich content | String में HTML elements हों |
| `markdown` | Markdown-formatted content | String Markdown के रूप में parse हो |

`lingua:sync-to-database` के दौरान type detection की जाती है। आप किसी भी समय UI के Edit modal के माध्यम से type बदल सकते हैं।

### उदाहरण: HTML translation

```php
Translation::create([
    'group' => 'marketing',
    'key'   => 'hero_subtitle',
    'type'  => 'html',
    'text'  => ['en' => '<strong>Build faster</strong> with fewer tools.'],
]);
```

### उदाहरण: Markdown translation

```php
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_body',
    'type'  => 'markdown',
    'text'  => ['en' => "# Welcome!\n\nThank you for signing up.\n\n**Your account is now active.**"],
]);
```

## Translation keys

Lingua मानक Laravel translations की तरह ही दो-भाग `group.key` convention का उपयोग करता है:

| Format | उदाहरण | `trans()` call |
|---|---|---|
| PHP file key | `auth.failed` | `__('auth.failed')` |
| JSON / single key | `Welcome` | `__('Welcome')` |
| Vendor key | `spatie::messages.error` | vendor namespace के माध्यम से |

::: tip group बनाम key
`group` कॉलम filename से map होता है (`auth` = `lang/en/auth.php`) और `key` उस फ़ाइल के अंदर array key से map होता है। JSON फ़ाइलों के लिए, group `'single'` होता है।
:::

## Vendor translations

Vendor translations को `is_vendor = true` से flag किया जाता है और एक `vendor` string (उदाहरण: `'spatie'`, `'laravel'`) रखते हैं। ये `lang/vendor/{vendor}/{locale}/` डायरेक्टरीज़ से sync होते हैं।

- उन्हें UI में **संपादित किया जा सकता है** (vendor wording ओवरराइड करने के लिए)
- उन्हें **हटाया नहीं जा सकता** — ऐसा करने का प्रयास `vendor_translation_protected` event dispatch करता है
- Update modal में `group` और `key` fields **locked** हैं

पूरी जानकारी के लिए [Vendor Translations](/hi/features/vendor-translations) देखें।
