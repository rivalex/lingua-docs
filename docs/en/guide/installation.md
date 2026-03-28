# Installation

Lingua ships with an interactive installer wizard that handles everything for you in one command. The manual steps are also documented below if you prefer more control.

## Step 1 - Install via Composer

```bash
composer require rivalex/lingua
```

## Step 2 - Run the installer

```bash
php artisan lingua:install
```

The wizard will:

1. Publish the configuration file to `config/lingua.php`
2. Publish the database migrations
3. Ask whether to run the migrations automatically
4. Seed the database with your default language (English by default) and all its translations from Laravel Lang
5. Optionally star the repo on GitHub ⭐

When it finishes you will see:

```
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua package installed successfully!
```

## Step 3 - Access the UI

Open your application and visit:

| Page | URL | Route name |
|---|---|---|
| Languages | `your-app.test/lingua/languages` | `lingua.languages` |
| Translations | `your-app.test/lingua/translations` | `lingua.translations` |

That's it. Lingua is running.

---

## Manual installation

If you prefer to publish and run each step individually:

```bash
# 1. Publish config
php artisan vendor:publish --tag="lingua-config"

# 2. Publish migrations
php artisan vendor:publish --tag="lingua-migrations"

# 3. Run migrations
php artisan migrate

# 4. Seed default language + translations
php artisan db:seed --class="Rivalex\Lingua\Database\Seeders\LinguaSeeder"
```

---

## Protecting the management UI

By default the Lingua routes use only the `web` middleware - there is no authentication guard applied automatically. **You should add your own middleware** before going to production.

### Via config

```php
// config/lingua.php
'middleware' => ['web', 'auth'],
```

### With role/permission guards (e.g. Spatie Permission)

```php
'middleware' => ['web', 'auth', 'role:admin'],
// or
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

::: tip
Any middleware accepted by Laravel's router can be added to the array. Changes take effect immediately - no cache clear needed.
:::

---

## Post-installation checklist

- [ ] Add authentication middleware to `config/lingua.php`
- [ ] Add the language selector component to your layout (see [Language Selector](/features/language-selector))
- [ ] Set `dir` and `lang` on your `<html>` tag (see [RTL/LTR Support](/features/rtl-support))
- [ ] Add additional languages via `php artisan lingua:add {locale}`
- [ ] Configure the editor toolbar in `config/lingua.php` if you use HTML/Markdown translations
