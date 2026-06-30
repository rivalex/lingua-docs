# Artisan Commands

Lingua ships eight Artisan commands for terminal-driven setup, language management, translation sync, and teardown.

## Setup

### `lingua:install`

The interactive first-time setup wizard. Run once after `composer require`.

```bash
php artisan lingua:install
```

**What it does:**
1. Prompts you to choose a **storage driver** — `database` (live UI editing, default) or `file` (version-controlled `lang/` files).
2. Publishes the driver-appropriate migrations via the `MigrationPublisher` (database mode publishes the `language_lines` / `languages` / `lingua_settings` tables; file mode publishes only the settings table).
3. Publishes the config file.
4. Seeds the default language: in database mode it runs the sync; in file mode it calls `Lingua::installDefaultLanguage()` to create the record and write the `lang/` files.

Not intended to be re-run after initial setup. To switch drivers later, use [`lingua:storage`](#lingua-storage-driver). To re-publish individual assets, use the `vendor:publish` tags.

---

## Storage driver

### `lingua:storage {driver}` <Badge type="tip" text="New in 2.0" />

Switches the active translation storage driver between `database` and `file`, ensuring the target backend's migrations exist before it runs.

```bash
php artisan lingua:storage file
php artisan lingua:storage database --write-env
```

**Arguments & options:**

| Argument / Option | Description |
|---|---|
| `driver` | Target driver: `database` or `file` |
| `--force` | Skip the type-loss confirmation prompt when switching to file |
| `--write-env` | Attempt to write `LINGUA_STORAGE_DRIVER` to your `.env` |
| `--no-migrate` | Publish the required migrations but do not run them |

::: warning Switching database → file loses rich types
The file backend stores plain string values only. Translations typed as **HTML** or **Markdown** are flattened to text when exported to `lang/` files. The command warns and asks for confirmation before doing this (bypass with `--force`).
:::

---

## Language management

### `lingua:add {locale}`

Adds a new language. **DB-native** — no GitHub or internet access; the locale is seeded from Lingua's bundled dataset.

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**What it does:**
1. Validates the locale code against the bundled registry.
2. Creates a `Language` record.
3. Projects the locale's notification strings.
4. Seeds its storage via the active driver (DB rows or `lang/` files).

::: tip
After adding a language, visit `/lingua/translations` to see which strings still need translating.
:::

---

### `lingua:remove {locale}`

Removes a language. ISO-validated; the default language is protected.

```bash
php artisan lingua:remove fr
```

**What it does:**
1. Validates the locale code.
2. Un-projects the locale's notification strings.
3. Deletes the `Language` record and the locale's values.

::: warning Default language protection
You cannot remove the default language. Set another language as default first (via the UI or `Lingua::setDefaultLocale()`), then remove the old one.
:::

---

### `lingua:update-lang`

Re-syncs local `lang/` files to the database for **all installed languages**. Reads from the bundled dataset and your `lang/` directory — no `laravel-lang` network fetch.

```bash
php artisan lingua:update-lang
```

Run this after:
- Upgrading Laravel (new validation messages, etc.)
- Installing a package that ships translations
- Editing files in `lang/` directly

---

## Translation sync

### `lingua:sync-to-database`

Imports all local PHP/JSON translation files into the `language_lines` table.

```bash
php artisan lingua:sync-to-database
```

**What gets imported:**
- `lang/{locale}/*.php` — PHP files
- `lang/{locale}.json` — JSON files
- `lang/vendor/{package}/{locale}/*.php` — vendor files

Uses `updateOrCreate` matching on `group + key`, so existing UI edits are preserved.

```bash
# In a deployment script
php artisan migrate
php artisan lingua:sync-to-database
```

---

### `lingua:sync-to-local`

Exports all database translations back to local PHP/JSON files.

```bash
php artisan lingua:sync-to-local
php artisan lingua:sync-to-local --force
```

| Option | Description |
|---|---|
| `--force` | Override the file-mode no-op guard and write anyway |

**What gets exported:**
- DB translations → `lang/{locale}/{group}.php`
- JSON group (`single`) → `lang/{locale}.json`
- Vendor translations → `lang/vendor/{vendor}/{locale}/{group}.php`

```bash
# Export DB state to files for version control
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"
```

---

## Teardown

### `lingua:uninstall` <Badge type="tip" text="New in 2.0" />

Safely removes Lingua from your application. **Always exports the database to `lang/` first** so no translations are lost.

```bash
php artisan lingua:uninstall
php artisan lingua:uninstall --force --keep-published
```

| Option | Description |
|---|---|
| `--force` | Skip all confirmations |
| `--keep-config` | Keep the published `config/lingua.php` |
| `--keep-published` | Keep published views and migration files |

**What it does:**
1. Exports all DB translations to `lang/` (so your strings survive in version control).
2. Drops the `language_lines`, `languages`, and `lingua_settings` tables.
3. Removes published config/views/migrations unless the matching `--keep-*` flag is set.

---

## Command quick reference

<div class="command-table">

| Command | Description |
|---|---|
| `lingua:install` | Interactive setup wizard (driver select, publish, seed) |
| `lingua:storage {driver}` | Switch storage driver (database ⇄ file) |
| `lingua:add {locale}` | Add a language (DB-native, bundled dataset) |
| `lingua:remove {locale}` | Remove a language (default protected) |
| `lingua:update-lang` | Re-sync local files → DB for all languages |
| `lingua:sync-to-database` | Import local files → database |
| `lingua:sync-to-local` | Export database → local files |
| `lingua:uninstall` | Safe teardown (exports first, then drops tables) |

</div>

---

## Tips

::: tip Automating sync in CI/CD
Keep the database in sync with your repository on deploy:

```yaml
# GitHub Actions deploy step (example)
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::

::: tip Adding multiple languages at once
There is no bulk-add command, but you can chain calls in a shell loop:

```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::
