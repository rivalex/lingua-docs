# Installation

Lingua ships with an interactive installer wizard that handles everything
for you in one command. The manual steps are also documented below if you
prefer more control.

## Step 1 — Install via Composer

```bash
composer require rivalex/lingua
```

That's the only package you need. Lingua 2.0 bundles its own locale data
and translation dataset, so there is nothing else to require.

::: tip Upgrading from 1.x?
Composer automatically removes the old `spatie/laravel-translation-loader`
dependency. If your own `composer.json` still lists
`laravel-lang/common`, remove it: `composer remove laravel-lang/common`.
See the full [Upgrade guide](/en/guide/upgrade).
:::

## Step 2 — Run the installer

```bash
php artisan lingua:install
```

The wizard is interactive. Using
[Laravel Prompts](https://laravel.com/docs/prompts), it asks you to choose
a **storage driver** with an arrow-key selector:

| Driver | Choose it when… |
|---|---|
| **`database`** *(recommended)* | You want the full feature set: HTML/Markdown types, statistics, import/export, vendor guard, and surgical caching. |
| **`file`** | You keep translations in version control or run in a read-only/CI environment and prefer plain `lang/` files. |

The wizard then:

1. Publishes the configuration file to `config/lingua.php`
2. Publishes the **driver-aware** migrations (the `file` driver skips the
   `language_lines` migration)
3. Asks whether to run the migrations automatically
4. Seeds the database with your default language and its translations from
   the bundled dataset — **no GitHub downloads**
5. Optionally stars the repo on GitHub ⭐

When it finishes you will see:

```
✓ Driver selected          →  database
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua installed successfully!
```

## Step 3 — Access the UI

Open your application and visit:

| Page | URL | Route name |
|---|---|---|
| Languages | `your-app.test/lingua/languages` | `lingua.languages` |
| Translations | `your-app.test/lingua/translations` | `lingua.translations` |
| Statistics | `your-app.test/lingua/statistics` | `lingua.statistics` |
| Transfer | `your-app.test/lingua/transfer` | `lingua.transfer` |
| Settings | `your-app.test/lingua/settings` | `lingua.settings` |

That's it. Lingua is running.

---

## Manual installation

If you prefer to publish and run each step individually:

```bash
# 1. Publish config
php artisan vendor:publish --tag="lingua-config"

# 2. Publish migrations (driver-aware)
php artisan vendor:publish --tag="lingua-migrations"

# 3. Run migrations
php artisan migrate

# 4. Add your default language and seed its translations
php artisan lingua:add en
```

See [Publishing Assets](/en/guide/publishing) for the full list of tags.

---

## Protecting the management UI

<Badge type="tip" text="New in 2.0" /> Lingua 2.0 is **secure by
default**. The management routes ship with the `['web', 'auth']`
middleware applied automatically — anonymous visitors cannot reach the UI.

### Tightening access with a gate

For role-based access, define an authorization gate and point Lingua at it
with the `LINGUA_GATE` environment variable. Lingua appends `can:{gate}`
to its admin routes:

```ini
LINGUA_GATE=manage-translations
```

```php
// app/Providers/AppServiceProvider.php — boot()
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $user) => $user->hasRole('admin'));
```

You can also edit the middleware array directly:

```php
// config/lingua.php
'middleware' => ['web', 'auth', 'role:admin'],
```

::: tip
Any middleware accepted by Laravel's router can be added to the array.
Changes take effect immediately — no cache clear needed.
:::

See the [Security reference](/en/guide/security) for the full hardening
overview.

---

## Post-installation checklist

- [ ] Confirm the storage driver in `config/lingua.php` matches your
      deployment (`database` or `file`)
- [ ] Optionally set `LINGUA_GATE` for role-based access
- [ ] Add the language selector component to your layout (see
      [Language Selector](/en/features/language-selector))
- [ ] Set `dir` and `lang` on your `<html>` tag (see
      [RTL/LTR Support](/en/features/rtl-support))
- [ ] Add additional languages via `php artisan lingua:add {locale}`
- [ ] Configure the editor toolbar in `config/lingua.php` if you use
      HTML/Markdown translations (database driver)
