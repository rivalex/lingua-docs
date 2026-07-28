# Settings

The Settings page (`/lingua/settings`) lets you configure Lingua's UI behaviour from the browser — no config edits or redeployment needed.

```blade
<a href="{{ route('lingua.settings') }}">Lingua Settings</a>
```

<Screenshot src="/screenshots/settings-page.png" alt="Lingua Settings page" caption="Selector mode, flag icons, navigation, and storage driver controls." />

## How settings work

Settings are stored in the `lingua_settings` table as typed key/value pairs. On each request, Lingua reads the database first, then falls back to `config/lingua.php`, then to package defaults.

**Priority chain:**
1. `lingua_settings` DB table (highest — set via this UI)
2. `config/lingua.php` (your published config)
3. Package defaults (lowest)

Keep `config/lingua.php` as your baseline and override per environment from the UI without touching files.

## Selector mode

Controls how `<livewire:lingua::language-selector />` renders for end users.

| Mode | Description |
|---|---|
| `sidebar` | Grouped navigation section (default) |
| `dropdown` | Compact dropdown button |
| `modal` | Button that opens a full language picker |
| `headless` | No built-in rendering — you implement the UI |

::: tip Headless mode
When set to `headless`, the built-in selector renders nothing. Use `<livewire:lingua::headless-language-selector />` instead. See [Headless Selector](/en/features/language-selector#headless-mode).
:::

## Show flag icons

Toggle country flag icons next to language names in the selector. Flags are matched to the language's `regional` code (e.g. `en_US` → 🇺🇸), falling back gracefully when absent.

## Navigation menu <Badge type="tip" text="New in 2.0" />

The **Show navigation menu** toggle (under **Routing & Navigation**) controls the shared `x-lingua::nav` menu that renders on all five Lingua pages — Languages, Translations, Statistics, Transfer, and Settings — with active-page highlighting.

<Screenshot src="/screenshots/settings-nav-toggle.png" alt="Navigation toggle in settings" caption="Toggle the shared navigation menu on or off." />

The equivalent config default:

```php
// config/lingua.php
'nav' => [
    'enabled' => true,
],
```

## Appearance <Badge type="tip" text="New" />

Lingua's own CSS uses a class-based `dark:` variant, so it normally
follows the host app's `<html class="dark">` ancestor. If your host app
has no dark-mode toggle (or its state doesn't match the real OS
preference), Lingua's styling can render unstyled.

The **Force dark mode** toggle makes Lingua always render its dark theme,
regardless of the host app or OS color scheme — handy for embedding
Lingua in a host with no dark-mode support, or while developing locally
on a light-mode system.

The equivalent config default:

```php
// config/lingua.php
'dark_mode' => [
    'force' => env('LINGUA_FORCE_DARK_MODE', false),
],
```

## Storage driver <Badge type="tip" text="New in 2.0" />

The page displays the active [storage driver](/en/guide/storage) — `database` or `file` — as **read-only** information.

::: warning Change the driver from the CLI
The driver is not switchable from the UI because it changes how runtime lookups resolve. Use the Artisan command instead:

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```
:::

## Programmatic access

Read and write settings via the `LinguaSetting` model:

```php
use Rivalex\Lingua\Models\LinguaSetting;

// Read with config() fallback
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

// Write
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_SHOW_FLAGS, false);
LinguaSetting::set(LinguaSetting::KEY_NAV_ENABLED, true);
```

Common constants:

| Constant | Key | Type |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |
| `LinguaSetting::KEY_NAV_ENABLED` | `nav.enabled` | `bool` |
| `LinguaSetting::KEY_DARK_MODE_FORCE` | `dark_mode.force` | `bool` |
