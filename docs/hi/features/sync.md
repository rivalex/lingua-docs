# Bi-directional Sync

Lingua local files से translations को database में import कर सकता है और उन्हें वापस export भी कर सकता है — **database-driven runtime** और **file-based version control** दोनों का सर्वश्रेष्ठ।

## दो दिशाएं

| Direction | Command | UI Button | काम |
|---|---|---|---|
| Files → DB | `lingua:sync-to-database` | Sync to DB | `lang/` files पढ़ता है और DB में import करता है |
| DB → Files | `lingua:sync-to-local` | Sync to Local | DB से `lang/` PHP/JSON files generate करता है |

## Bundled Dataset — कोई laravel-lang नहीं

Lingua 2.0 एक **बंडल translation dataset** शिप करता है। `laravel-lang/common` download की आवश्यकता नहीं:

- **26 locales** — ar, cs, da, de, el, en, es, fa, fi, fr, he, hi, hu, id, it, ja, ko, nl, no, pl, pt, ru, sv, tr, uk, zh
- **7 groups** — auth, pagination, passwords, validation, notifications, settings, transfer
- **5902 strings** — Laravel v13.14.0 के अनुरूप

`lingua:add {locale}` या `lingua:update-lang {locale}` इस बंडल से seed करता है।

## Sync to Database

```bash
php artisan lingua:sync-to-database
```

**क्या करता है:**

1. `lang_dir` (default: `lang/`) में सभी PHP और JSON files पढ़ता है
2. हर key को `language_lines` में upsert करता है
3. Vendor namespace strings को protect करता है
4. Affected `(locale, group)` pairs की cache bust करता है — surgical, global नहीं

**UI से:** Languages पेज पर **Sync to Database** button।

## Sync to Local

```bash
php artisan lingua:sync-to-local
```

**क्या करता है:**

1. DB से सभी translations read करता है
2. `lang/{locale}/{group}.php` और `lang/{locale}.json` files generate करता है
3. Existing files को atomic write से overwrite करता है
4. File write के बाद `opcache_invalidate()` call करता है

**UI से:** Languages पेज पर **Sync to Local** button।

## Update — Bundled Dataset Merge

```bash
php artisan lingua:update-lang fr
```

बंडल dataset से **नई keys** merge करता है बिना existing translations को overwrite किए। Laravel नए validation rules add करने पर useful।

## Surgical Cache Invalidation

Sync operations केवल changed `(locale, group)` pairs की cache invalidate करती हैं:

```
"lingua.trans.fr.auth"      ← केवल यही bust होती है यदि fr/auth changed हो
"lingua.trans.fr.validation" ← unchanged, cache में रहती है
```

कोई global `php artisan cache:clear` नहीं। High-traffic production के लिए safe।

## Automated Workflows

CI/CD में sync integrate करें:

```yaml
# GitHub Actions उदाहरण
- name: Sync translations to database
  run: php artisan lingua:sync-to-database
  env:
    DB_CONNECTION: mysql
    DB_HOST: ${{ secrets.DB_HOST }}
```

या Git hook में:

```bash
# .git/hooks/post-merge
php artisan lingua:sync-to-database
```
