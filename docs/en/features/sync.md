# Bi-directional Sync

Lingua can import translations from local files into the database and export them back - giving you the best of both worlds: **database-driven runtime** and **file-based version control**.

## The two directions

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (DB)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄── lingua:sync-to-local
                      ─┘
```

## Sync to database

Imports all translation files from `lang/` (and its subdirectories) into the `language_lines` table.

```bash
php artisan lingua:sync-to-database
```

### What gets imported

- `lang/{locale}/*.php` - standard PHP translation files
- `lang/{locale}.json` - JSON translation files
- `lang/vendor/{package}/{locale}/*.php` - vendor package translations

### Upsert behaviour

Lingua uses `updateOrCreate` matching on `group` + `key`. This means:
- **New keys** are inserted
- **Existing keys** have their `text` JSON merged - locale values you've edited in the UI are **preserved**
- **Type detection** runs on the value to determine `text` / `html` / `markdown`

### Type auto-detection

| Rule | Assigned type |
|---|---|
| String contains HTML tags (`<…>`) | `html` |
| String parses as Markdown (headings, lists, etc.) | `markdown` |
| Neither | `text` |

::: tip
Type detection is conservative - it only assigns `html` or `markdown` when the content clearly matches. Plain strings always get `text`. You can change the type manually via the Edit modal.
:::

### Via the facade

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
```

::: warning
The facade calls `Translation::syncToDatabase()` internally, which is a static call. In Artisan commands and Livewire components, `app(Translation::class)->syncToDatabase()` is used instead so that Mockery can intercept it in tests.
:::

---

## Sync to local

Exports all translations from `language_lines` back to `lang/` PHP and JSON files.

```bash
php artisan lingua:sync-to-local
```

### What gets exported

- All non-vendor translations → `lang/{locale}/{group}.php`
- JSON-group keys (`single`) → `lang/{locale}.json`
- Vendor translations → `lang/vendor/{vendor}/{locale}/{group}.php`

### Use cases

- **Version control** - commit the exported files to track translation changes over time
- **Deployment pipelines** - export before deploying if downstream tooling expects file-based translations
- **Backups** - create a point-in-time snapshot of all translations
- **Other tools** - export for use in a translation management service or CSV importer

### Via the facade

```php
Lingua::syncToLocal();
```

---

## Update from Laravel Lang

Pulls the latest translation strings from the `laravel-lang` ecosystem and syncs them to the database. Useful after upgrading Laravel or adding a new package that ships translations.

```bash
php artisan lingua:update-lang
```

This runs `lang:update` (from `laravel-lang/common`) followed by `lingua:sync-to-database`.

---

## Automated sync workflows

### On deployment

Add a post-deploy step to keep the database in sync with your committed lang files:

```bash
# In your deploy script or CI/CD pipeline
php artisan lingua:sync-to-database
php artisan optimize:clear
```

### Via scheduler

If your translation team edits files directly (rather than via the UI), schedule a periodic sync:

```php
// routes/console.php
Schedule::command('lingua:sync-to-database')->hourly();
```

### On package install

When you `composer require` a new package that ships translations, run:

```bash
php artisan lingua:update-lang
```

This picks up any new strings from the installed package.

---

## Tips and gotchas

::: tip Keep DB as the source of truth
Treat the database as the primary source. Only sync to local when you need files (version control, deployment, etc.). Avoid editing local files directly while the DB is in use - the next sync-to-database will overwrite your edits if the keys already exist.
:::

::: warning Locale files and DB out of sync
If you add new locale PHP files manually without running `lingua:sync-to-database`, the new keys will only be available via the file loader (lower priority than DB). Run sync to import them properly.
:::

::: tip Full roundtrip
A safe way to reorganise translations:
1. `lingua:sync-to-local` - export everything
2. Edit files on disk
3. `lingua:sync-to-database` - re-import
:::
