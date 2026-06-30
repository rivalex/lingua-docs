# Storage Drivers

Lingua 2.0 दो storage drivers के साथ आता है। अपने deployment की जरूरतों के अनुसार सही driver चुनें।

## तुलना

| Feature | `database` | `file` |
|---|---|---|
| Translation storage | `language_lines` DB table | `lang/` PHP + JSON files |
| Live UI editing | हाँ | हाँ |
| HTML/Markdown types | हाँ | नहीं (plain text में flatten) |
| Statistics page | हाँ | सीमित (counts via filesystem) |
| Import/Export (Transfer) | हाँ | हाँ |
| Vendor guard | हाँ | हाँ |
| Surgical cache | हाँ | N/A (PHP opcache) |
| Version control friendly | नहीं (DB में) | हाँ (files committed) |
| Zero-deploy updates | हाँ | नहीं (file write = deploy) |

## Database Driver (अनुशंसित)

**इसे चुनें जब:**
- Live UI editing चाहिए बिना deploy के
- HTML/Markdown translation types उपयोग करते हैं
- Translation coverage statistics track करते हैं
- Import/Export workflow उपयोग करते हैं

**कैसे काम करता है:**

`LinguaManager` `language_lines` table से translations load करता है, उन्हें `lang/` files के साथ merge करता है (DB wins), और per-(locale, group) कैश करता है।

```php
// config/lingua.php
'storage' => ['driver' => 'database'],
```

## File Driver

**इसे चुनें जब:**
- Translations को Git में version-control करते हैं
- CI environment read-only है
- Simple `lang/` file structure पसंद है

**कैसे काम करता है:**

`LinguaManager` मानक Laravel `FileLoader` की तरह व्यवहार करता है। Translations `lang/{locale}/{group}.php` और `lang/{locale}.json` में रहती हैं। UI edits सीधे files पर atomic write करती हैं।

```php
// config/lingua.php
'storage' => ['driver' => 'file'],
```

::: tip File driver की सीमाएं
`file` driver में translation `type` (html/markdown) समर्थित नहीं है — सब कुछ plain text रहता है। Statistics page में केवल filesystem-based counts दिखती हैं।
:::

## Drivers के बीच Switch करना

`lingua:storage` command interactive driver selector के साथ switch करता है:

```bash
php artisan lingua:storage
```

यह command:
1. Arrow-key selector से नया driver चुनाता है
2. Driver-specific migrations publish और run करता है (यदि आवश्यक हो)
3. `LINGUA_STORAGE_DRIVER` env var update का निर्देश देता है

::: warning Data migration
**Database → File:** पहले existing DB translations export करें:

```bash
php artisan lingua:sync-to-local
php artisan lingua:storage   # फिर switch करें
```

**File → Database:** Switch के बाद files import करें:

```bash
php artisan lingua:storage          # पहले switch करें
php artisan lingua:sync-to-database # फिर import करें
```
:::

## Uninstall करना

```bash
php artisan lingua:uninstall
```

यह command:
- `languages`, `language_lines`, `lingua_settings` tables drop करता है
- Published config, migrations, views remove करता है
- `lang/vendor/lingua` namespace clean करता है

::: danger Irreversible
यह command data destroy करता है। पहले backup लें।
:::
