# Vendor Translations

Vendor translations are strings that belong to third-party packages - Laravel's own validation messages, pagination labels, password reset strings, and translations from any other package that ships its own `lang/` directory.

## How they are identified

During `lingua:sync-to-database`, Lingua scans the `lang/vendor/` directory structure. Any translation file found there is imported with:

- `is_vendor = true`
- `vendor` = the package name (derived from the directory name, e.g. `spatie`, `laravel`, `filament`)

Example database rows after sync:

```
group      | key          | is_vendor | vendor   | text
-----------|--------------|-----------|----------|-----------------------------
validation | required     | false     | null     | {"en":"The :attribute…"}
passwords  | reset        | true      | laravel  | {"en":"Your password…"}
auth       | failed       | true      | laravel  | {"en":"These credentials…"}
```

::: tip
Laravel's own `lang/en/*.php` files (auth, validation, pagination, passwords) are treated as **vendor translations** because they come from the framework, not your application code.
:::

## What you can do with vendor translations

| Action | Allowed? | Notes |
|---|---|---|
| **Edit value** | ✅ Yes | Override any vendor string with your own wording |
| **Change type** | ✅ Yes | Switch between text / html / markdown |
| **Edit group or key** | ❌ No | Group and key fields are locked in the Edit modal |
| **Delete** | ❌ No | Protected by `VendorTranslationProtectedException` |

## Overriding a vendor string

The most common use case is overriding Laravel's validation messages to match your application's tone:

1. Open `/lingua/translations`
2. Find the string (e.g. `validation.required`)
3. Click the edit icon to open the Update modal
4. Change the value for any locale
5. Save - the override takes effect immediately on the next request

```php
// Or programmatically via the facade:
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Please fill in the :attribute field.',
    locale: 'en'
);
```

## Querying vendor translations

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// All vendor translations
$all = Translation::where('is_vendor', true)->get();

// All vendor translations for a specific package
$laravel = Lingua::getVendorTranslations('laravel');

// All vendor translations for a package with French values
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');

// Filter by group and key manually
$required = Translation::where('is_vendor', true)
    ->where('vendor', 'laravel')
    ->where('group', 'validation')
    ->where('key', 'required')
    ->first();
```

## Protection mechanism

Attempting to delete a vendor translation (from the UI or via `Lingua::forgetTranslation()`) throws a `VendorTranslationProtectedException`:

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en'); // key belongs to a vendor translation
} catch (VendorTranslationProtectedException $e) {
    // Handle gracefully
}
```

In the Livewire UI, deletion attempts dispatch a `vendor_translation_protected` event and close the modal without deleting anything. The event can be listened to in your own Livewire components or Alpine.js code:

```js
// Alpine.js / Livewire event listener
window.addEventListener('vendor_translation_protected', () => {
    alert('This translation is protected and cannot be deleted.');
});
```

## Re-syncing vendor translations

If a package you depend on adds new translation keys in a version bump, re-sync to import them:

```bash
# Pull the latest from laravel-lang and sync to DB
php artisan lingua:update-lang

# Or manually re-sync from your existing lang/ files
php artisan lingua:sync-to-database
```

Lingua uses `updateOrCreate` when syncing, so existing overrides (edited values) are preserved.

## Disabling vendor translation imports

If you don't want vendor translations in the database at all, sync only after removing the `lang/vendor/` directory. Lingua only imports what it finds on disk.
