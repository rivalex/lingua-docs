# Language Management

The Languages page (`/lingua/languages`) is your control center for every installed locale. It shares the [navigation menu](/en/features/settings#navigation-menu) with the other Lingua pages, with the current page highlighted.

<Screenshot src="/screenshots/languages-page.png" alt="Lingua languages management page" caption="Languages page — installed locales with completion statistics and the two-row toolbar." />

## The toolbar

The toolbar reflows into two rows so the controls stay usable at any width:

- **Top row** — the locale **search** field and the **Add language** button.
- **Bottom row** — the three **sync** buttons (Sync from files, Sync to files, Update).

## Adding a language

### From the UI

Click **Add Language**, search the 129+ locales in the registry, pick one, and confirm. Lingua then:

1. Creates a `Language` record for the locale
2. Seeds its strings from the **bundled dataset** (no internet download)
3. Refreshes the table with the new locale

<Screenshot src="/screenshots/language-add-modal.png" alt="Add language modal" caption="The add-language modal with a searchable locale picker." width="640px" :center="true"/>

::: tip <Badge type="tip" text="New in 2.0" /> No downloads required
`lingua:add` no longer pulls files from GitHub or `laravel-lang`. Locales are seeded instantly from the dataset bundled with the package (26 locales × 7 groups, 5902 strings, aligned to Laravel v13.14.0). See [Bi-directional Sync](/en/features/sync#the-bundled-dataset).
:::

### From the command line

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

### Programmatically

```php
use Rivalex\Lingua\Facades\Lingua;

// Create the Language record and seed its storage for the locale
Lingua::addLanguage('fr');
```

::: tip
Use `Lingua::notInstalled()` to get the locales that are available but not yet installed:

```php
$available = Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```
:::

## Removing a language

Click the trash icon on any non-default language row. A confirmation step prevents accidental deletion.

Removing a language deletes the `Language` record **and every translation value for that locale**, then reorders the remaining languages' sort values.

::: warning
The **default language cannot be removed**. Set another language as default first.
:::

```bash
# From the command line
php artisan lingua:remove fr
```

```php
// Programmatically
Lingua::removeLanguage('fr');
```

## Setting the default language

Click the star icon (⭐) on any language row. Only one language can be default at a time, and the change is wrapped in a database transaction so there is never a window with no default.

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::setDefaultLocale('fr');
```

::: warning The default drives the reference key set
The default locale defines the canonical set of keys. Coverage for every other locale is measured against it, so the default always shows 100%. Make sure it is reasonably complete before switching.
:::

## Reordering languages

Drag and drop language rows to control their display order everywhere they appear — the language selector widget, the translations locale switcher, and anywhere you call `Lingua::languages()`.

The sort order is stored in the `sort` integer column and reassigned sequentially after every drop.

## Completion statistics

Each language row shows:

| Metric | Description |
|---|---|
| **Total strings** | The number of keys in the reference key set |
| **Translated** | Number of strings with a value for this locale |
| **Completion %** | `translated / total * 100`, rounded to 2 decimals |

Statistics are computed through the active [storage driver](/en/guide/storage), so they are correct in both `database` and `file` mode.

```php
use Rivalex\Lingua\Facades\Lingua;

$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// All languages with statistics in one pass
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

## Sync controls

The bottom toolbar row has three sync buttons:

| Button | Command | Action |
|---|---|---|
| **Sync from files** | `lingua:sync-to-database` | Imports all local `lang/` files (core + vendor) into `language_lines` |
| **Sync to files** | `lingua:sync-to-local` | Writes all DB translations back to `lang/` PHP & JSON files |
| **Update** | `lingua:update-lang` | Re-seeds installed locales from the bundled dataset and local `lang/` |

See [Bi-directional Sync](/en/features/sync) for the full mechanics, including the surgical per-`(locale, group)` cache invalidation that runs after each operation.

::: tip Driver awareness
In `file` storage mode the **Sync to files** button is gated — file mode already writes to disk, so it only runs with the `--force` flag from the CLI. See [Storage drivers](/en/guide/storage).
:::
