# Publishing Assets

Lingua ships several publishable groups so you can override only the parts
you need.

## Publish everything at once

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## Available tags

### `lingua-config`

Publishes the configuration file.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Output:** `config/lingua.php`

Use this to customise routes, middleware, the storage driver, selector
mode, editor toolbar, cache, or any other option. See
[Configuration](/en/guide/configuration).

---

### `lingua-migrations`

Publishes the database migrations.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

<Badge type="tip" text="New in 2.0" /> Migrations are now **driver-aware**
and split into three separate files:

| Migration | Published for |
|---|---|
| `create_language_lines_table` | database driver only |
| `create_languages_table` | both drivers |
| `create_lingua_settings_table` | both drivers |

The `file` driver skips `create_language_lines_table`. The
`lingua:install` wizard publishes the correct set for the driver you pick,
so you only need this tag if you want to customise the schema before
running migrations.

::: warning
The `lingua:install` wizard publishes and runs migrations automatically.
Only publish manually if you need to customise the schema first.
:::

---

### `lingua-translations`

Publishes the package's own UI translation strings (9 UI locales).

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Output:** `lang/vendor/lingua/{locale}/lingua.php`

Override any label, heading, button, or message used in the Lingua UI to
translate the interface or adapt wording to your project's style.

```
lang/
└── vendor/
    └── lingua/
        ├── en/lingua.php
        ├── fr/lingua.php
        └── it/lingua.php
```

---

### `lingua-views`

Publishes all Blade and Livewire views.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Output:** `resources/views/vendor/lingua/`

Use this to customise layouts, modals, or the language selector. Laravel
automatically uses your published views instead of the package defaults.

::: tip
Only publish views you intend to change. Unpublished views are served from
the package and receive upstream updates automatically.
:::

---

### `lingua-assets` (removed) <Badge type="warning" text="Removed in 2.0" />

The `lingua-assets` publish tag **no longer exists**. In 2.0, Lingua's
compiled CSS/JS are served internally through the `lingua.assets` route
(behind a realpath jail — see
[Security](/en/guide/security#asset-security)). There is nothing to
publish or copy into `public/`, and nothing to re-publish after an
upgrade.

---

## Updating after upgrades

After updating Lingua via Composer, re-publish the UI translations if you
haven't customised them, and merge any new config keys:

```bash
# Re-publish UI translations (overwrites)
php artisan vendor:publish --tag="lingua-translations" --force

# Re-publish config to pick up new keys, then merge manually
php artisan vendor:publish --tag="lingua-config" --force
```

The `--force` flag overwrites existing files. Omit it for `lingua-views`
and `lingua-config` to preserve your local customisations, and merge new
keys by hand. See the [Upgrade guide](/en/guide/upgrade) for the full 1.x
→ 2.0 checklist.
