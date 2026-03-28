# द्विदिशीय Sync

Lingua local files से translations को डेटाबेस में import कर सकता है और उन्हें वापस export भी कर सकता है - आपको दोनों का सर्वश्रेष्ठ देता है: **database-driven runtime** और **file-based version control**।

## दो दिशाएँ

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (DB)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄── lingua:sync-to-local
                      ─┘
```

## Database में Sync

`lang/` (और इसकी subdirectories) से सभी translation files को `language_lines` टेबल में import करता है।

```bash
php artisan lingua:sync-to-database
```

### क्या import होता है

- `lang/{locale}/*.php` - मानक PHP translation files
- `lang/{locale}.json` - JSON translation files
- `lang/vendor/{package}/{locale}/*.php` - vendor package translations

### Upsert व्यवहार

Lingua `group` + `key` पर match करते हुए `updateOrCreate` का उपयोग करता है। इसका अर्थ है:
- **नई keys** insert होती हैं
- **मौजूदा keys** के `text` JSON को merge किया जाता है - UI में आपके द्वारा संपादित locale values **preserved रहती हैं**
- **Type detection** `text` / `html` / `markdown` निर्धारित करने के लिए value पर चलती है

### Type auto-detection

| नियम | असाइन किया गया type |
|---|---|
| String में HTML tags हैं (`<…>`) | `html` |
| String Markdown (headings, lists, आदि) के रूप में parse होती है | `markdown` |
| कोई भी नहीं | `text` |

::: tip
Type detection conservative है - यह केवल तभी `html` या `markdown` असाइन करती है जब content clearly match करे। Plain strings को हमेशा `text` मिलता है। आप Edit modal के माध्यम से type manually बदल सकते हैं।
:::

### Facade के माध्यम से

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
```

::: warning
Facade `Translation::syncToDatabase()` को internally call करता है, जो एक static call है। Artisan commands और Livewire components में, `app(Translation::class)->syncToDatabase()` का उपयोग किया जाता है ताकि Mockery tests में इसे intercept कर सके।
:::

---

## Local में Sync

`language_lines` से सभी translations को वापस `lang/` PHP और JSON files में export करता है।

```bash
php artisan lingua:sync-to-local
```

### क्या export होता है

- सभी non-vendor translations → `lang/{locale}/{group}.php`
- JSON-group keys (`single`) → `lang/{locale}.json`
- Vendor translations → `lang/vendor/{vendor}/{locale}/{group}.php`

### उपयोग के मामले

- **Version control** - समय के साथ translation changes track करने के लिए exported files commit करें
- **Deployment pipelines** - यदि downstream tooling file-based translations expect करता है तो deploy करने से पहले export करें
- **Backups** - सभी translations का point-in-time snapshot बनाएँ
- **अन्य tools** - translation management service या CSV importer में उपयोग के लिए export करें

### Facade के माध्यम से

```php
Lingua::syncToLocal();
```

---

## Laravel Lang से Update

`laravel-lang` ecosystem से latest translation strings pull करता है और उन्हें डेटाबेस में sync करता है। Laravel upgrade करने या translations ship करने वाला नया package जोड़ने के बाद उपयोगी।

```bash
php artisan lingua:update-lang
```

यह `lang:update` (`laravel-lang/common` से) के बाद `lingua:sync-to-database` चलाता है।

---

## स्वचालित sync workflows

### Deployment पर

Committed lang files के साथ डेटाबेस को sync में रखने के लिए एक post-deploy step जोड़ें:

```bash
# अपने deploy script या CI/CD pipeline में
php artisan lingua:sync-to-database
php artisan optimize:clear
```

### Scheduler के माध्यम से

यदि आपकी translation team सीधे files संपादित करती है (UI के बजाय), तो periodic sync schedule करें:

```php
// routes/console.php
Schedule::command('lingua:sync-to-database')->hourly();
```

### Package install पर

जब आप translations ship करने वाला नया package `composer require` करें, तो चलाएँ:

```bash
php artisan lingua:update-lang
```

यह installed package से कोई भी नई strings pick up करता है।

---

## Tips और gotchas

::: tip DB को source of truth रखें
डेटाबेस को primary source मानें। केवल तभी local में sync करें जब आपको files चाहिए (version control, deployment, आदि)। DB use में होने पर local files को directly संपादित करने से बचें - यदि keys पहले से मौजूद हैं तो अगला sync-to-database आपके edits overwrite कर देगा।
:::

::: warning Locale files और DB out of sync
यदि आप `lingua:sync-to-database` चलाए बिना manually नई locale PHP files जोड़ते हैं, तो नई keys केवल file loader (DB से कम priority) के माध्यम से उपलब्ध होंगी। उन्हें properly import करने के लिए sync चलाएँ।
:::

::: tip Full roundtrip
Translations reorganize करने का एक safe तरीका:
1. `lingua:sync-to-local` - सब कुछ export करें
2. Disk पर files संपादित करें
3. `lingua:sync-to-database` - फिर से import करें
:::
