# Vendor Translations

Vendor translations are strings owned by third-party packages — Laravel's own validation messages, pagination labels, and password-reset strings, plus any other package that ships its own `lang/` directory.

## How they are identified

During `lingua:sync-to-database`, Lingua scans the `lang/vendor/` directory. Every file it finds is imported with:

- `is_vendor = true`
- `vendor` = the package name (derived from the directory, e.g. `laravel`, `filament`)

Example rows after sync:

```
group      | key       | is_vendor | vendor   | text
-----------|-----------|-----------|----------|-----------------------------
validation | required  | false     | null     | {"en":"The :attribute…"}
passwords  | reset     | true      | laravel  | {"en":"Your password…"}
auth       | failed    | true      | laravel  | {"en":"These credentials…"}
```

::: tip
Laravel's framework `lang/*` files (auth, validation, pagination, passwords) are treated as **vendor translations** because they come from the framework, not your application code.
:::

## What you can do with vendor translations

| Action | Allowed? | Notes |
|---|---|---|
| **Edit value** | ✅ Yes | Override any vendor string with your own wording |
| **Change type** | ✅ Yes | Switch between text / html / markdown |
| **Edit group or key** | ❌ No | Group and key are locked in the Edit modal |
| **Delete** | ❌ No | Protected by `VendorTranslationProtectedException` |
| **Overwrite via import** | ❌ No | Vendor rows are skipped during [Transfer import](/en/features/transfer#vendor-protection) |

## Overriding a vendor string

The common case is matching Laravel's validation messages to your app's tone:

1. Open `/lingua/translations`
2. Find the string (e.g. `validation.required`)
3. Click the edit icon
4. Change the value for any locale
5. Save — the override takes effect on the next request

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Please fill in the :attribute field.',
    locale: 'en'
);
```

`setVendorTranslation()` updates the **value** of an existing vendor row and respects the protection rules — it never creates a new key (it throws `ModelNotFoundException` if the record does not exist).

## Querying vendor translations

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// All vendor translations
$all = Translation::where('is_vendor', true)->get();

// For a specific package
$laravel = Lingua::getVendorTranslations('laravel');

// For a package, with French values
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');
```

## Protection mechanism

Vendor translations are protected **at the repository level in both storage drivers** — `DatabaseRepository` and `FileRepository` enforce it identically, so the guarantee holds regardless of how your app stores translations.

Deleting a vendor translation (from the UI or via `Lingua::forgetTranslation()`) throws `VendorTranslationProtectedException`:

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en'); // belongs to a vendor row
} catch (VendorTranslationProtectedException $e) {
    // Handle gracefully
}
```

In the Livewire UI, a deletion attempt dispatches a `vendor_translation_protected` event and closes the modal without deleting anything:

```js
window.addEventListener('vendor_translation_protected', () => {
    alert('This translation is protected and cannot be deleted.');
});
```

## Re-syncing vendor translations

When a dependency adds new keys in a version bump, re-sync to import them:

```bash
# Re-sync from the bundled dataset + local lang/ files
php artisan lingua:update-lang

# Or import directly from your existing lang/ files (includes vendor)
php artisan lingua:sync-to-database
```

Syncing uses `updateOrCreate`, so your existing overrides are preserved.

## Disabling vendor imports

If you do not want vendor translations in the database at all, remove the `lang/vendor/` directory before syncing. Lingua only imports what it finds on disk.
