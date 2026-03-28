# Publishing Assets

Lingua ships several publishable groups so you can override only the parts you need.

## Publish everything at once

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## Individual tags

### `lingua-config`

Publishes the configuration file.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Output:** `config/lingua.php`

Use this to customise routes, middleware, selector mode, editor toolbar, or any other option.

---

### `lingua-migrations`

Publishes the database migrations.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

**Output:** `database/migrations/YYYY_MM_DD_HHMMSS_create_lingua_table.php`

Use this if you need to modify the `languages` or `language_lines` schema - for example, to add indexes or change column types. After publishing, run `php artisan migrate` as normal.

::: warning
The `lingua:install` wizard publishes and runs the migrations automatically. Only publish manually if you need to customise the schema before running them.
:::

---

### `lingua-translations`

Publishes the package's own UI translation strings.

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Output:** `lang/vendor/lingua/{locale}/lingua.php`

This exposes every label, heading, button, and message used in the Lingua UI. Override any string to:
- Translate the interface into your application's language
- Adapt wording to your project's style (e.g. "Add language" → "Install locale")

The published files follow the standard Laravel vendor translation structure:

```
lang/
└── vendor/
    └── lingua/
        ├── en/
        │   └── lingua.php
        ├── fr/
        │   └── lingua.php
        └── it/
            └── lingua.php
```

---

### `lingua-views`

Publishes all Blade and Livewire views.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Output:** `resources/views/vendor/lingua/`

Use this to customise layouts, modals, or the language selector component. Laravel automatically uses your published views instead of the package defaults.

```
resources/views/vendor/lingua/
├── components/
│   ├── autocomplete.blade.php
│   ├── clipboard.blade.php
│   ├── editor.blade.php
│   ├── language-flag.blade.php
│   ├── menu-group.blade.php
│   └── message.blade.php
└── livewire/
    ├── languages.blade.php
    ├── language-selector.blade.php
    ├── translations.blade.php
    └── translation/
        ├── create.blade.php
        ├── delete.blade.php
        ├── row.blade.php
        └── update.blade.php
```

::: tip
Only publish views you intend to change. Unpublished views are served directly from the package and receive upstream updates automatically.
:::

---

### `lingua-assets`

Publishes compiled CSS and JavaScript to `public/`.

```bash
php artisan vendor:publish --tag="lingua-assets"
```

**Output:** `public/vendor/lingua/`

Required only if you serve assets directly from `public/` rather than via Vite or a CDN. **Re-run after every Lingua upgrade** to keep assets in sync.

---

## Updating after upgrades

After updating Lingua via Composer, re-publish changed assets:

```bash
# Always re-publish compiled assets
php artisan vendor:publish --tag="lingua-assets" --force

# Re-publish UI translations if you haven't customised them
php artisan vendor:publish --tag="lingua-translations" --force
```

The `--force` flag overwrites existing files. Omit it for `lingua-views` and `lingua-config` to preserve your local customisations.
