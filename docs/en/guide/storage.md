# Storage Drivers

<Badge type="tip" text="New in 2.0" /> Lingua 2.0 introduces a pluggable
**storage driver** system. You choose where translations live: in the
**database** (the full-featured default) or in plain **`lang/` files**.

```php
// config/lingua.php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

## Choosing a driver

| Feature | `database` | `file` |
|---|:---:|:---:|
| Backing store | `language_lines` table | `lang/` PHP + JSON |
| HTML / Markdown types | ✅ | ❌ (flattened to plain text) |
| Translation statistics | ✅ | ✅ (computed from files) |
| Import / export (Transfer) | ✅ | ✅ |
| Vendor guard | ✅ | ✅ |
| Surgical per-(locale,group) cache | ✅ | n/a |
| Sync buttons in UI | ✅ | hidden |
| Edit translations in the UI | ✅ | ✅ |

::: tip Rule of thumb
Use **database** for the richest experience and runtime overrides. Use
**file** when translations must stay in version control or the filesystem
is the source of truth.
:::

## Database driver

The default, and identical to 1.x behaviour.

- Translations stored in the `language_lines` table, all locales in one
  JSON `text` column per row
- Supports `text`, `html`, and `markdown` types, each with its own editor
- Surgical caching: `Cache::forget('lingua.trans.{locale}.{group}')` on
  every write — no global flush
- Full statistics, import/export, and vendor protection
- Runtime overrides win over `lang/` files via `array_replace_recursive`

## File driver

Reads and writes `lang/` PHP and JSON files directly. There is **no**
`language_lines` table.

::: danger Type loss in file mode
The `file` driver stores plain strings only. HTML and Markdown **types are
flattened to plain text** — the per-type editor and type metadata are not
available. If you rely on HTML/Markdown translations, use the database
driver.
:::

- No database queries; behaves like the standard Laravel `FileLoader`
- Sync buttons are **hidden** in the UI (the files *are* the store)
- `lingua:sync-to-local` is a **no-op without `--force`** (the DB it would
  export from isn't the active store)
- Edits in the UI write straight back to the files via `AtomicFileWriter`
  (atomic rename + `opcache_invalidate` — see
  [Security](/en/guide/security#file-mode-security))

::: warning Deploy caveat
On platforms that rebuild `lang/` from your repository on each deploy
(e.g. Forge, Envoyer, container images), UI edits made in file mode may be
**overwritten** on the next deploy. Commit changes back to your repo, or
use the database driver.
:::

## Switching drivers

Use the `lingua:storage` command to switch at any time. It **syncs before
switching** so nothing is lost.

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```

| Flag | Effect |
|---|---|
| `--force` | Skip confirmation prompts |
| `--write-env` | Update `LINGUA_STORAGE_DRIVER` in `.env` |
| `--no-migrate` | Skip the migration-ensure step |

### Database → file

Lingua **exports** the database to `lang/` first, warning about any
HTML/Markdown strings that will lose their type, then switches the active
driver.

### File → database

Lingua **syncs** `lang/` into the database and ensures the
`language_lines` migration has run, then switches.

## Installing with a driver choice

The interactive installer asks which driver to use and publishes
**driver-aware** migrations — the `file` driver skips the
`language_lines` migration entirely:

```bash
php artisan lingua:install
```

See [Installation](/en/guide/installation).

## Uninstalling

`lingua:uninstall` tears Lingua down safely:

```bash
php artisan lingua:uninstall
```

It **exports the database to `lang/` first**, then drops the three Lingua
tables (`language_lines`, `languages`, `lingua_settings`). Your `lang/`
directory is preserved.

| Flag | Effect |
|---|---|
| `--force` | Skip confirmation prompts |
| `--keep-config` | Leave `config/lingua.php` in place |
| `--keep-published` | Leave published views/migrations in place |

## Direct querying (database driver)

```php
use Rivalex\Lingua\Models\Translation;

// All translations that have a French value
Translation::whereNotNull('text->fr')->get();

// Only missing French translations
Translation::whereNull('text->fr')->get();

// A specific key
Translation::where('group', 'validation')->where('key', 'required')->first();
```

See [Vendor Translations](/en/features/vendor-translations) for how
package strings are protected in both drivers.
