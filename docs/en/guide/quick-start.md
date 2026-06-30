# Quick Start

This guide walks you from a fresh Lingua install to a fully multilingual
application in minutes.

## 1. Install and seed

```bash
composer require rivalex/lingua
php artisan lingua:install
```

Pick the **database** driver when prompted (recommended). English becomes
your default language, and the bundled translation strings are imported
into the database — no GitHub downloads.

::: tip Secure by default
The management routes are protected by `['web', 'auth']` automatically.
Set `LINGUA_GATE` for role-based access — see
[Installation](/en/guide/installation#protecting-the-management-ui).
:::

## 2. Add your second language

```bash
php artisan lingua:add fr
```

This command is **DB-native**: it seeds French strings from the bundled
dataset and creates a `Language` record. It does **not** download files or
write to `lang/`.

Repeat for as many locales as you need:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. Add the language selector to your layout

Open your main Blade layout (e.g.
`resources/views/layouts/app.blade.php`):

**a) Set `lang` and `dir` on the `<html>` tag:**

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

**b) Embed the language switcher wherever it fits your design:**

```blade
{{-- As a sidebar group (default) --}}
<livewire:lingua::language-selector />

{{-- As a dropdown in a navbar --}}
<livewire:lingua::language-selector mode="dropdown" />
```

::: tip Locale switch reloads the current page
When a user switches locale, Lingua reloads the **page they're on** (not
the home page), guarded against open-redirects. See
[Security](/en/guide/security#open-redirect-protection).
:::

## 4. Use translations in your application

Lingua is transparent — use standard Laravel helpers as you always would:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

In database mode, `LinguaManager` merges database translations on top of
file-based ones automatically. No code changes needed.

## 5. Translate via the UI

Visit `/lingua/translations` to see all translation strings. For each
language:

1. Use the locale switcher (top right) to select the target language
2. Click any row to edit the value inline
3. Use **Show only missing** to focus on untranslated strings
4. For HTML or Markdown types the rich-text editor activates automatically

<Screenshot src="/screenshots/translations-page.png" alt="Lingua translations management page" caption="The translations page with locale switcher, group filter, and inline editor." />

## 6. Import / export with the Transfer page

Need to bulk-edit translations in a spreadsheet, or hand a file to a
translation agency? Visit `/lingua/transfer`:

- **Export** to CSV, JSON, XLSX, or ODS — bilingual, multi-locale, or
  JSON-native layouts
- **Import** with a dry-run **diff preview** before anything is written

XLSX/ODS require the optional `openspout/openspout` package; CSV and JSON
work out of the box.

## 7. Sync back to files (optional)

If you need translation files on disk (for version control or CI/CD):

```bash
php artisan lingua:sync-to-local
```

This exports every DB translation back to `lang/` in the correct PHP/JSON
format.

---

## Common patterns

### Translate a new key programmatically

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
```

### Inspect a locale

```php
use Rivalex\Lingua\Facades\Lingua;

$info = Lingua::info('fr');

if ($info !== null) {
    $info->name;      // "French"
    $info->native;    // "Français"
    $info->direction; // "ltr"
}
```

::: warning Changed in 2.0
`Lingua::info()` now returns `?LocaleInfo` and yields `null` for unknown
locales instead of throwing. Always guard with `if ($info !== null)`.
:::

### Switch locale programmatically

```php
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```
