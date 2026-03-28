# Artisan Commands

Lingua ships six Artisan commands for terminal-driven language and translation management.

## Language management

### `lingua:add {locale}`

Installs a new language — downloads files, creates the DB record, syncs translations.

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**What it does:**
1. Fetches locale metadata from `laravel-lang/locales`
2. Runs `lang:add {locale}` to install language files
3. Creates a `Language` record in the database
4. Runs `lingua:sync-to-database` to import the new strings

**Output:**
```
Adding language: it...
Installing language files via Laravel Lang...
Creating language record in database...
Syncing translations to database...
Language 'it' added successfully.
```

::: tip
After adding a language, visit `/lingua/translations/it` to see which strings still need translating.
:::

---

### `lingua:remove {locale}`

Removes a language — deletes files, cleans the database, reorders remaining languages.

```bash
php artisan lingua:remove fr
```

**What it does:**
1. Checks the language is not the default (aborts with an error if it is)
2. Runs `lang:rm {locale} --force` to remove language files
3. Removes all `{locale}` values from `language_lines.text`
4. Deletes the `Language` record
5. Reorders remaining languages' sort values
6. Runs `lingua:sync-to-database`

::: warning Default language protection
You cannot remove the default language. Set another language as default first:
```bash
php artisan lingua:add fr       # add the new default
# then via the UI: set French as default
php artisan lingua:remove en    # now safe to remove English
```
:::

---

### `lingua:update-lang`

Updates all installed language files via Laravel Lang, then re-syncs to the database.

```bash
php artisan lingua:update-lang
```

Run this after:
- Upgrading Laravel (new validation messages, etc.)
- Installing a new package that ships translations
- Updating `laravel-lang/*` packages

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
- `lang/vendor/{package}/{locale}/*.php` — vendor package files

Uses `updateOrCreate` matching on `group + key`, so existing edits from the UI are preserved.

**Typical use cases:**
```bash
# After a fresh clone — populate the DB from committed lang files
php artisan lingua:sync-to-database

# After lang:update — import new strings
php artisan lingua:sync-to-database

# In a deployment script
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

### `lingua:sync-to-local`

Exports all database translations back to local PHP/JSON files.

```bash
php artisan lingua:sync-to-local
```

**What gets exported:**
- DB translations → `lang/{locale}/{group}.php`
- JSON group (`single`) → `lang/{locale}.json`
- Vendor translations → `lang/vendor/{vendor}/{locale}/{group}.php`

**Typical use cases:**
```bash
# Before committing — export DB state to files for version control
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"

# Before deploying to a server that reads from files
php artisan lingua:sync-to-local
```

---

### `lingua:install`

The interactive first-time setup wizard. Run once after `composer require`.

```bash
php artisan lingua:install
```

Not intended to be re-run after initial setup. If you need to re-publish individual assets, use the `vendor:publish` tags instead.

---

## Command quick reference

<div class="command-table">

| Command | Description |
|---|---|
| `lingua:add {locale}` | Install a language (files + DB + sync) |
| `lingua:remove {locale}` | Remove a language (files + DB + sync) |
| `lingua:update-lang` | Update lang files via Laravel Lang + sync |
| `lingua:sync-to-database` | Import local files → database |
| `lingua:sync-to-local` | Export database → local files |
| `lingua:install` | Interactive first-time setup wizard |

</div>

---

## Tips

::: tip Automating sync in CI/CD
Add sync to your deployment pipeline to keep the database in sync with your repository:

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

::: tip Checking what will be synced
Before running `lingua:sync-to-database`, you can preview the number of files and locales that will be processed by checking `lang/`:

```bash
ls lang/
# en  fr  it  vendor
```
:::
