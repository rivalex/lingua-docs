# Translation Storage

Understanding how translations are stored helps you query, import, and export them correctly.

## The `language_lines` table

Each row in `language_lines` represents one translatable **string** - not one locale. All locale values are stored together in a single JSON `text` column:

```
group      | key        | type | text
-----------|------------|------|---------------------------------------------------
validation | required   | text | {"en":"The :attribute field is required.","fr":"Le champ :attribute est obligatoire."}
auth       | failed     | text | {"en":"These credentials do not match.","it":"Le credenziali non corrispondono."}
single     | Welcome    | text | {"en":"Welcome","fr":"Bienvenue","de":"Willkommen"}
emails     | subject    | html | {"en":"<b>Welcome</b> to our platform!"}
```

### Benefits of this design

- **One row per string** - no per-locale rows to manage
- **Adding a locale is non-destructive** - just add a new key to the JSON object
- **Missing translations are explicit** - if `fr` is absent from the JSON, the string isn't translated yet
- **Single query** - one `SELECT` fetches all locale values for a key

### Querying directly

You can query `language_lines` using standard Eloquent JSON column syntax:

```php
use Rivalex\Lingua\Models\Translation;

// All translations that have a French value
Translation::whereNotNull('text->fr')->get();

// Only missing French translations
Translation::whereNull('text->fr')->get();

// Find a specific key
Translation::where('key', 'required')->where('group', 'validation')->first();

// All strings in a group
Translation::where('group', 'auth')->get();
```

## Translation types

Every translation row has a `type` that determines the editor used in the UI:

| Type | Use case | Auto-detected when syncing |
|---|---|---|
| `text` | Plain labels, messages, button text | Default |
| `html` | Rich content with HTML tags | String contains HTML elements |
| `markdown` | Markdown-formatted content | String parses as Markdown |

Type detection is performed during `lingua:sync-to-database`. You can change the type at any time via the Edit modal in the UI.

### Example: HTML translation

```php
Translation::create([
    'group' => 'marketing',
    'key'   => 'hero_subtitle',
    'type'  => 'html',
    'text'  => ['en' => '<strong>Build faster</strong> with fewer tools.'],
]);
```

### Example: Markdown translation

```php
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_body',
    'type'  => 'markdown',
    'text'  => ['en' => "# Welcome!\n\nThank you for signing up.\n\n**Your account is now active.**"],
]);
```

## Translation keys

Lingua uses the same two-part `group.key` convention as standard Laravel translations:

| Format | Example | `trans()` call |
|---|---|---|
| PHP file key | `auth.failed` | `__('auth.failed')` |
| JSON / single key | `Welcome` | `__('Welcome')` |
| Vendor key | `spatie::messages.error` | via vendor namespace |

::: tip group vs. key
The `group` column maps to the filename (`auth` = `lang/en/auth.php`) and the `key` maps to the array key within that file. For JSON files, the group is `'single'`.
:::

## Vendor translations

Vendor translations are flagged with `is_vendor = true` and carry a `vendor` string (e.g. `'spatie'`, `'laravel'`). They are synced from `lang/vendor/{vendor}/{locale}/` directories.

- They **can be edited** in the UI (to override vendor wording)
- They **cannot be deleted** - attempting to do so dispatches a `vendor_translation_protected` event
- The `group` and `key` fields are **locked** in the Update modal

See [Vendor Translations](/features/vendor-translations) for full details.
