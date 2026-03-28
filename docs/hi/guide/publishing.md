# Assets प्रकाशित करना

Lingua कई publishable groups के साथ आता है ताकि आप केवल वही हिस्से override कर सकें जिनकी आपको ज़रूरत है।

## सब कुछ एक साथ प्रकाशित करें

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## अलग-अलग tags

### `lingua-config`

कॉन्फ़िगरेशन फ़ाइल प्रकाशित करता है।

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Output:** `config/lingua.php`

Routes, middleware, selector mode, editor toolbar, या किसी अन्य विकल्प को customize करने के लिए इसका उपयोग करें।

---

### `lingua-migrations`

डेटाबेस migrations प्रकाशित करता है।

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

**Output:** `database/migrations/YYYY_MM_DD_HHMMSS_create_lingua_table.php`

यदि आपको `languages` या `language_lines` schema को संशोधित करना है - उदाहरण के लिए, indexes जोड़ना या column types बदलना - तो इसका उपयोग करें। प्रकाशित करने के बाद, सामान्य रूप से `php artisan migrate` चलाएँ।

::: warning
`lingua:install` विज़ार्ड migrations को स्वचालित रूप से प्रकाशित और चलाता है। केवल मैनुअल रूप से प्रकाशित करें यदि आपको उन्हें चलाने से पहले schema customize करना है।
:::

---

### `lingua-translations`

पैकेज की अपनी UI translation strings प्रकाशित करता है।

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Output:** `lang/vendor/lingua/{locale}/lingua.php`

यह Lingua UI में उपयोग किए जाने वाले हर label, heading, button और message को उजागर करता है। किसी भी string को override करके:
- Interface को अपने एप्लिकेशन की भाषा में अनुवाद करें
- Wording को अपने प्रोजेक्ट की style के अनुसार ढालें (उदाहरण: "Add language" → "Install locale")

प्रकाशित फ़ाइलें मानक Laravel vendor translation structure का पालन करती हैं:

```
lang/
└── vendor/
    └── lingua/
        ├── en/
        │   └── lingua.php
        ├── fr/
        │   └── lingua.php
        └── it/
            └── lingua.php
```

---

### `lingua-views`

सभी Blade और Livewire views प्रकाशित करता है।

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Output:** `resources/views/vendor/lingua/`

Layouts, modals, या language selector कंपोनेंट को customize करने के लिए इसका उपयोग करें। Laravel स्वचालित रूप से package defaults के बजाय आपके प्रकाशित views का उपयोग करता है।

```
resources/views/vendor/lingua/
├── components/
│   ├── autocomplete.blade.php
│   ├── clipboard.blade.php
│   ├── editor.blade.php
│   ├── language-flag.blade.php
│   ├── menu-group.blade.php
│   └── message.blade.php
└── livewire/
    ├── languages.blade.php
    ├── language-selector.blade.php
    ├── translations.blade.php
    └── translation/
        ├── create.blade.php
        ├── delete.blade.php
        ├── row.blade.php
        └── update.blade.php
```

::: tip
केवल वही views प्रकाशित करें जिन्हें आप बदलने का इरादा रखते हैं। अप्रकाशित views सीधे package से serve होते हैं और upstream updates स्वचालित रूप से प्राप्त करते हैं।
:::

---

### `lingua-assets`

Compiled CSS और JavaScript को `public/` में प्रकाशित करता है।

```bash
php artisan vendor:publish --tag="lingua-assets"
```

**Output:** `public/vendor/lingua/`

केवल तभी आवश्यक है जब आप assets को Vite या CDN के बजाय सीधे `public/` से serve करते हैं। **Assets को sync रखने के लिए हर Lingua upgrade के बाद दोबारा चलाएँ।**

---

## Upgrades के बाद अपडेट करना

Composer के माध्यम से Lingua अपडेट करने के बाद, बदले हुए assets फिर से प्रकाशित करें:

```bash
# हमेशा compiled assets फिर से प्रकाशित करें
php artisan vendor:publish --tag="lingua-assets" --force

# UI translations फिर से प्रकाशित करें यदि आपने उन्हें customize नहीं किया है
php artisan vendor:publish --tag="lingua-translations" --force
```

`--force` flag मौजूदा फ़ाइलों को overwrite करता है। अपने स्थानीय customizations को संरक्षित रखने के लिए `lingua-views` और `lingua-config` के लिए इसे छोड़ दें।
