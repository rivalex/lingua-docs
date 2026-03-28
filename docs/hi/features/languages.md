# भाषा प्रबंधन

Languages पेज (`/lingua/languages`) सभी इंस्टॉल किए हुए locales के लिए आपका नियंत्रण केंद्र है।

<Screenshot src="/screenshots/languages-page.png" alt="Lingua भाषा प्रबंधन पेज" caption="Languages पेज — completion statistics के साथ इंस्टॉल किए हुए locales दिखाता है।" />

## भाषा जोड़ना

### UI से

**Add Language** पर क्लिक करें, उपलब्ध 70+ locales में से कोई चुनें, और confirm करें। Lingua:

1. Laravel Lang से language फ़ाइलें डाउनलोड करेगा
2. डेटाबेस में एक `Language` रिकॉर्ड बनाएगा
3. सभी नई strings को `language_lines` में sync करेगा
4. नए locale के साथ टेबल को refresh करेगा

<Screenshot src="/screenshots/language-add-modal.png" alt="भाषा जोड़ने का modal" caption="searchable locale picker के साथ add-language modal।" width="640px" :center="true"/>

### Command line से

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

### प्रोग्रामेटिक रूप से

```php
use Rivalex\Lingua\Facades\Lingua;

// Language files इंस्टॉल करें (lang:add wrapper)
Lingua::addLanguage('fr');

// फिर DB record + sync बनाएँ (Artisan command पूरा flow करता है)
// → पूरे, orchestrated flow के लिए lingua:add का उपयोग करें
```

::: tip
उन locales की सूची प्राप्त करने के लिए `Lingua::notInstalled()` का उपयोग करें जो उपलब्ध हैं लेकिन अभी इंस्टॉल नहीं हुए:

```php
$available = Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```
:::

## भाषा हटाना

किसी भी non-default language पंक्ति पर trash आइकन पर क्लिक करें। आकस्मिक हटाने से बचाव के लिए एक confirmation modal आता है — आपको confirm करने के लिए भाषा का नाम टाइप करना होगा।

पर्दे के पीछे, delete operation:
1. `lang:rm {locale} --force` के माध्यम से language files हटाता है
2. `language_lines.text` JSON कॉलम से सभी `{locale}` entries हटाता है
3. `Language` रिकॉर्ड हटाता है
4. शेष भाषाओं के sort values को पुनः क्रमबद्ध करता है

::: warning
**डिफ़ॉल्ट भाषा नहीं हटाई जा सकती।** पहले किसी अन्य भाषा को default के रूप में सेट करें।
:::

```bash
# Command line से
php artisan lingua:remove fr
```

## डिफ़ॉल्ट भाषा सेट करना

किसी भी language पंक्ति पर star आइकन (⭐) पर क्लिक करें। एक समय में केवल एक भाषा default हो सकती है। परिवर्तन एक database transaction में wrapped होता है ताकि कोई भी window न हो जहाँ कोई भाषा default के रूप में marked न हो।

```php
// प्रोग्रामेटिक रूप से
Lingua::setDefaultLocale('fr');

// या model के माध्यम से
$french = Language::where('code', 'fr')->first();
Language::setDefault($french);
```

::: warning डिफ़ॉल्ट हटाना
यदि आप एक नई default भाषा सेट करते हैं, तो सुनिश्चित करें कि उस locale के लिए आपके सभी अनुवाद कम से कम आंशिक रूप से पूर्ण हों। UI editor में default भाषा fallback के रूप में उपयोग की जाती है (बाया कॉलम reference के रूप में default value दिखाता है)।
:::

## भाषाओं का क्रम बदलना

Language rows को drag और drop करके पूरे एप्लिकेशन में उनका display order नियंत्रित करें — language selector widget में, translations locale switcher में, और जहाँ भी आप `Lingua::languages()` का उपयोग करते हैं।

Sort order `sort` integer column में संग्रहीत होता है और प्रत्येक drop के बाद क्रमानुसार पुनः असाइन किया जाता है।

## Completion statistics देखना

प्रत्येक language पंक्ति दिखाती है:

| Metric | विवरण |
|---|---|
| **Completion %** | `translated / total * 100`, 2 decimal places तक rounded |
| **Missing** | इस locale के लिए बिना value वाली strings की संख्या |

ये `language_lines` टेबल के विरुद्ध database subqueries के माध्यम से query time पर compute होते हैं, इसलिए ये हमेशा अपडेट रहते हैं।

```php
// किसी specific locale के लिए stats प्राप्त करें
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// या एक query में stats के साथ सभी languages प्राप्त करें
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

## Sync controls

Languages पेज toolbar में तीन sync बटन हैं:

| बटन | कार्य |
|---|---|
| **Sync to database** | सभी local `lang/` files को `language_lines` में import करता है |
| **Sync to local** | सभी DB translations को वापस `lang/` files में export करता है |
| **Update via Laravel Lang** | Latest strings pull करने के लिए `lang:update` चलाता है, फिर DB में sync करता है |

सभी तीन operations **asynchronously** चलती हैं (Livewire `#[Async]` attribute) ताकि लंबे समय तक चलने वाले syncs के दौरान UI responsive रहे।
