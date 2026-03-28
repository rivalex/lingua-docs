# Artisan Commands

Lingua terminal-driven भाषा और translation प्रबंधन के लिए छह Artisan commands के साथ आता है।

## भाषा प्रबंधन

### `lingua:add {locale}`

एक नई भाषा install करता है - files download करता है, DB record बनाता है, translations sync करता है।

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**यह क्या करता है:**
1. `laravel-lang/locales` से locale metadata लाता है
2. Language files install करने के लिए `lang:add {locale}` चलाता है
3. डेटाबेस में एक `Language` record बनाता है
4. नई strings import करने के लिए `lingua:sync-to-database` चलाता है

**Output:**
```
Adding language: it...
Installing language files via Laravel Lang...
Creating language record in database...
Syncing translations to database...
Language 'it' added successfully.
```

::: tip
भाषा जोड़ने के बाद, यह देखने के लिए `/lingua/translations/it` पर जाएँ कि कौन सी strings अभी translate होनी बाकी हैं।
:::

---

### `lingua:remove {locale}`

एक भाषा remove करता है - files delete करता है, database clean करता है, शेष भाषाओं को reorder करता है।

```bash
php artisan lingua:remove fr
```

**यह क्या करता है:**
1. जाँचता है कि भाषा default नहीं है (यदि है तो error के साथ abort करता है)
2. Language files remove करने के लिए `lang:rm {locale} --force` चलाता है
3. `language_lines.text` से सभी `{locale}` values remove करता है
4. `Language` record delete करता है
5. शेष भाषाओं के sort values को reorder करता है
6. `lingua:sync-to-database` चलाता है

::: warning Default language सुरक्षा
आप default language remove नहीं कर सकते। पहले दूसरी भाषा को default set करें:
```bash
php artisan lingua:add fr       # नया default जोड़ें
# फिर UI के माध्यम से: French को default set करें
php artisan lingua:remove en    # अब English को safely remove करें
```
:::

---

### `lingua:update-lang`

Laravel Lang के माध्यम से सभी installed language files update करता है, फिर database में फिर से sync करता है।

```bash
php artisan lingua:update-lang
```

इसे इन स्थितियों में चलाएँ:
- Laravel upgrade करने के बाद (नए validation messages, आदि)
- Translations ship करने वाला नया package install करने के बाद
- `laravel-lang/*` packages update करने के बाद

---

## Translation sync

### `lingua:sync-to-database`

सभी local PHP/JSON translation files को `language_lines` टेबल में import करता है।

```bash
php artisan lingua:sync-to-database
```

**क्या import होता है:**
- `lang/{locale}/*.php` - PHP files
- `lang/{locale}.json` - JSON files
- `lang/vendor/{package}/{locale}/*.php` - vendor package files

`group + key` पर match करते हुए `updateOrCreate` का उपयोग करता है, इसलिए UI से मौजूदा edits preserved रहती हैं।

**सामान्य उपयोग के मामले:**
```bash
# Fresh clone के बाद - committed lang files से DB populate करें
php artisan lingua:sync-to-database

# lang:update के बाद - नई strings import करें
php artisan lingua:sync-to-database

# Deployment script में
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

### `lingua:sync-to-local`

सभी database translations को वापस local PHP/JSON files में export करता है।

```bash
php artisan lingua:sync-to-local
```

**क्या export होता है:**
- DB translations → `lang/{locale}/{group}.php`
- JSON group (`single`) → `lang/{locale}.json`
- Vendor translations → `lang/vendor/{vendor}/{locale}/{group}.php`

**सामान्य उपयोग के मामले:**
```bash
# Commit करने से पहले - version control के लिए DB state को files में export करें
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"

# Files से read करने वाले server पर deploy करने से पहले
php artisan lingua:sync-to-local
```

---

### `lingua:install`

Interactive first-time setup wizard। `composer require` के बाद एक बार चलाएँ।

```bash
php artisan lingua:install
```

Initial setup के बाद फिर से चलाने का इरादा नहीं है। यदि आपको individual assets फिर से publish करने हों, तो `vendor:publish` tags का उपयोग करें।

---

## Commands का quick reference

<div class="command-table">

| Command | विवरण |
|---|---|
| `lingua:add {locale}` | भाषा install करें (files + DB + sync) |
| `lingua:remove {locale}` | भाषा remove करें (files + DB + sync) |
| `lingua:update-lang` | Laravel Lang के माध्यम से lang files update करें + sync |
| `lingua:sync-to-database` | Local files → database import करें |
| `lingua:sync-to-local` | Database → local files export करें |
| `lingua:install` | Interactive first-time setup wizard |

</div>

---

## Tips

::: tip CI/CD में sync automate करना
Database को अपने repository के साथ sync में रखने के लिए deployment pipeline में sync जोड़ें:

```yaml
# GitHub Actions deploy step (उदाहरण)
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::

::: tip एक साथ कई भाषाएँ जोड़ना
कोई bulk-add command नहीं है, लेकिन आप shell loop में calls chain कर सकते हैं:

```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::

::: tip क्या sync होगा यह जाँचना
`lingua:sync-to-database` चलाने से पहले, `lang/` जाँचकर process होने वाली files और locales की संख्या preview कर सकते हैं:

```bash
ls lang/
# en  fr  it  vendor
```
:::
