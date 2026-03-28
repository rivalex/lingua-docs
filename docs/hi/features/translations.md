# Translation प्रबंधन

Translations पेज (`/lingua/translations/{locale?}`) आपको हर translation string को browse, filter, और edit करने देता है।

<Screenshot src="/screenshots/translations-page.png" alt="Lingua translations पेज" caption="Translations पेज - locale switcher, group filter, और inline editor के साथ।" />

## Translations में नेविगेट करना

### Locale switcher

पेज के शीर्ष पर locale tabs इंस्टॉल की हुई भाषाओं के बीच switch करने देते हैं। URL `/lingua/translations/{locale}` पर update होता है ताकि हर view bookmarkable और shareable हो।

**डिफ़ॉल्ट locale** कॉलम reference के रूप में हमेशा बायीं ओर दिखाया जाता है - आप दाईं ओर selected locale संपादित करते हैं।

### Filtering

| Filter | विवरण |
|---|---|
| **Search** | Group name, key, और सभी locale values में खोजता है |
| **Group** | एक specific group पर filter करता है (उदाहरण: `auth`, `validation`, `single`) |
| **Type** | `text`, `html`, या `markdown` के अनुसार filter करता है |
| **Show only missing** | केवल वे strings दिखाता है जिनका selected locale में कोई value नहीं है |

<Screenshot src="/screenshots/translations-filters.png" alt="Translation filters" caption="validation group में केवल missing French translations दिखाने के लिए filter करना।" />

### Pagination

परिणाम configurable per-page count (25 / 50 / 100) के साथ paginate होते हैं। वर्तमान पेज और per-page setting URL query string में persist होती है।

## Translations संपादित करना

### Inline editing

संपादन शुरू करने के लिए translation cell में सीधे क्लिक करें। परिवर्तन blur पर (जब आप क्लिक करके हटते हैं या Tab दबाते हैं) save होते हैं।

- **Plain text** translations एक साधारण `<textarea>` उपयोग करते हैं
- **HTML** translations TipTap rich-text editor खोलते हैं
- **Markdown** translations TipTap markdown editor खोलते हैं

<Screenshot src="/screenshots/translation-editor-html.png" alt="HTML translation editor" caption="rich-text translations के लिए TipTap HTML editor।" width="512px" :center="true"/>

### Default से sync

प्रत्येक translation पंक्ति में एक **Sync from default** बटन (↺) होता है। इस पर क्लिक करने से default locale की value वर्तमान locale में copy हो जाती है - जब आपको केवल थोड़ी wording changes चाहिए तो शुरुआती बिंदु के रूप में उपयोगी।

### Edit modal

Default locale के लिए, Edit modal खोलने के लिए pencil आइकन पर क्लिक करें, जहाँ आप translation type (text / html / markdown) के साथ-साथ value भी बदल सकते हैं।

::: tip Translation types बदलना
यदि आप एक translation को `text` से `html` में बदलते हैं, तो पंक्ति पर inline editor तुरंत TipTap में switch हो जाएगा। संग्रहीत value नहीं बदलती - केवल editor बदलता है।
:::

## Translations बनाना

कस्टम entry बनाने के लिए **New Translation** पर क्लिक करें। भरें:

- **Group** - file name का समकक्ष (उदाहरण: `marketing`, `emails`)
- **Key** - group के अंदर key (उदाहरण: `hero_title`)
- **Type** - `text`, `html`, या `markdown`
- **Value** - default locale के लिए अनुवाद

```
group: marketing
key:   hero_title
type:  text
value: Build faster, together.
```

नई key तुरंत `__('marketing.hero_title')` के माध्यम से उपलब्ध हो जाती है।

::: warning Vendor translations
आप vendor group में सीधे translations नहीं बना सकते (उदाहरण: `validation`, `auth`)। वे groups Laravel या अन्य packages के हैं और स्वचालित रूप से sync होते हैं। यदि आप कोई vendor string override करना चाहते हैं, तो translations पेज पर इसे सीधे संपादित करें।
:::

## Translations हटाना

### किसी specific locale के लिए हटाएँ

किसी भी non-default locale पर, delete बटन केवल उस locale की value को JSON column से हटाता है। Translation key मौजूद रहती है; यह बस default locale पर fallback हो जाती है।

### पूरी तरह हटाएँ

Default locale view पर, delete बटन `language_lines` से पूरी पंक्ति हटा देता है। उन keys को clean up करने के लिए इसका उपयोग करें जो आपके codebase में अब उपयोग नहीं होतीं।

::: danger Vendor translation सुरक्षा
Vendor translations को हटाया नहीं जा सकता। ऐसा करने का प्रयास एक warning दिखाता है और एक `vendor_translation_protected` event dispatch करता है। आप केवल vendor translation values को **संपादित** कर सकते हैं।
:::

## Key clipboard में copy करें

प्रत्येक पंक्ति में एक clipboard आइकन होता है जो पूर्ण `group.key` reference (उदाहरण: `auth.failed`) आपके clipboard में copy करता है - Blade या PHP में keys reference करते समय उपयोगी।

## Keyboard shortcuts

| Key | कार्य |
|---|---|
| `Tab` | वर्तमान field save करें और अगले पर जाएँ |
| `Shift + Tab` | वर्तमान field save करें और पिछले पर जाएँ |
| `Escape` | परिवर्तन discard करें और editor बंद करें |
