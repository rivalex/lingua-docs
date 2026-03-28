# Quick Start

This guide walks you from a fresh Lingua install to a fully multilingual application in minutes.

## 1. Install and seed

```bash
composer require rivalex/lingua
php artisan lingua:install
```

English is now your default language, and all Laravel/vendor translation strings have been imported into the database.

## 2. Add your second language

```bash
php artisan lingua:add fr
```

This command:
- Downloads French translation files via Laravel Lang
- Creates a `Language` record in the database
- Syncs all newly downloaded strings into `language_lines`

Repeat for as many locales as you need:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. Add the language selector to your layout

Open your main Blade layout (e.g. `resources/views/layouts/app.blade.php`) and:

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

## 4. Use translations in your application

Lingua is transparent - use standard Laravel helpers as you always would:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

The custom `LinguaManager` merges database translations on top of file-based ones automatically. No code changes needed.

## 5. Translate via the UI

Visit `/lingua/translations` to see all translation strings. For each language:

1. Use the locale switcher (top right) to select the target language
2. Click any row to edit the value inline
3. Use **Show only missing** to focus on untranslated strings
4. For HTML or Markdown types the rich-text editor activates automatically

<Screenshot src="/screenshots/translations-page.png" alt="Lingua translations management page" caption="The translations page with locale switcher, group filter, and inline editor." />

## 6. Sync back to files (optional)

If you need translation files on disk (for version control, CI/CD, or other tools):

```bash
php artisan lingua:sync-to-local
```

This exports every DB translation back to `lang/` in the correct PHP/JSON format.

---

## Common patterns

### Translate a new key programmatically

```php
use Rivalex\Lingua\Facades\Lingua;

// Create the translation in the database for the default locale
// (this is normally done via the UI, but you can script it too)
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

// Later, add translations for other locales:
Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
Lingua::setTranslation('welcome_subject', 'Benvenuto nella nostra piattaforma!', 'it');
```

### Check translation completeness

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]
```

### Switch locale programmatically

```php
// In a controller, middleware, or service
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```

::: tip
The `LanguageSelector` component handles locale switching for end users automatically. The manual approach above is useful in console commands or jobs.
:::

### Export only specific groups

If you want to export only a subset of translations to files, sync to local first, then delete the groups you don't need from `lang/` - the database is always the source of truth at runtime.
