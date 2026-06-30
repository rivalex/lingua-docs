# Bi-directional Sync

Lingua imports translations from local files into the database and exports them back — giving you both a **database-driven runtime** and **file-based version control**.

## The two directions

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (DB)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄── lingua:sync-to-local
                      ─┘
```

## The bundled dataset <Badge type="tip" text="Changed" />

Lingua ships its own translation dataset — **26 locales × 7 groups, 5902 strings, aligned to Laravel v13.14.0**. `lingua:add` seeds new locales straight from this dataset.

::: tip No more `laravel-lang`
`lingua:add` no longer downloads anything from GitHub or `laravel-lang/common`. Both external dependencies were removed in 2.0. Everything needed to install a locale ships inside the package.
:::

## Sync to database

Imports all translation files from `lang/` (and subdirectories) into `language_lines`.

```bash
php artisan lingua:sync-to-database
```

### What gets imported

- `lang/{locale}/*.php` — standard PHP translation files
- `lang/{locale}.json` — JSON translation files
- `lang/vendor/{package}/{locale}/*.php` — vendor package translations

The **default locale is processed first** so its keys define the reference set, and `language` rows are auto-created for any locale found on disk that is not yet registered.

### Upsert behaviour

Lingua uses `updateOrCreate` matching on `group` + `key`:

- **New keys** are inserted
- **Existing keys** keep the locale values you edited in the UI — they are merged, not clobbered
- **Type detection** runs on the value to assign `text` / `html` / `markdown`

### Type auto-detection

| Rule | Assigned type |
|---|---|
| Contains HTML tags (`<…>`) | `html` |
| Parses as Markdown (headings, lists, etc.) | `markdown` |
| Neither | `text` |

### Via the facade

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
```

---

## Sync to local

Exports all translations from `language_lines` back to `lang/` PHP and JSON files.

```bash
php artisan lingua:sync-to-local
```

In **file** storage mode this is a no-op unless you pass `--force`, since file mode already writes to disk:

```bash
php artisan lingua:sync-to-local --force
```

### What gets exported

- Non-vendor translations → `lang/{locale}/{group}.php`
- JSON-group keys (`single`) → `lang/{locale}.json`
- Vendor translations → `lang/vendor/{vendor}/{locale}/{group}.php`

### Use cases

- **Version control** — commit exported files to track translation changes
- **Deployment** — export before deploying if downstream tooling expects file-based translations
- **Backups** — point-in-time snapshot of all translations

```php
Lingua::syncToLocal();
```

---

## Update

Re-seeds installed locales from the **bundled dataset** plus your local `lang/` files — no internet access required.

```bash
php artisan lingua:update-lang
```

Use it after upgrading Laravel or adding a package that ships translations.

---

## Surgical cache invalidation <Badge type="tip" text="Changed" />

Sync operations no longer flush the whole cache. Lingua invalidates only the affected **`(locale, group)`** pairs with targeted `Cache::forget()` calls — never a global `cache:clear`. Untouched translations stay warm in the cache, so large syncs no longer cause a cold-cache stampede.

## Automated sync workflows

### On deployment

```bash
php artisan lingua:sync-to-database
```

### Via scheduler

If your team edits files directly rather than via the UI, schedule a periodic sync:

```php
// routes/console.php
Schedule::command('lingua:sync-to-database')->hourly();
```

### On package install

When you `composer require` a package that ships translations:

```bash
php artisan lingua:update-lang
```

## Tips and gotchas

::: tip Keep DB as the source of truth
Treat the database as primary. Only sync to local when you need files. Avoid editing local files while the DB is in use — the next sync-to-database merges by key and may overwrite manual edits to existing keys.
:::

::: tip Full roundtrip
A safe way to reorganise translations:
1. `lingua:sync-to-local` — export everything
2. Edit files on disk
3. `lingua:sync-to-database` — re-import
:::
