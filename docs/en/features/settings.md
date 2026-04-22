# Settings

The Settings page lets you configure Lingua's UI behaviour from the browser — no config file edits or redeployment needed.

Navigate to `/lingua/settings` or link from your admin panel:

```blade
<a href="{{ route('lingua.settings') }}">Lingua Settings</a>
```

<Screenshot src="/screenshots/settings-page.png" alt="Lingua Settings page" caption="The settings page with selector mode and flag icon controls." />

## How settings work

Settings are stored in the `lingua_settings` database table as typed key/value pairs. On each request, Lingua reads from the database first, then falls back to `config/lingua.php`, then to hardcoded defaults.

**Priority chain:**
1. `lingua_settings` DB table (highest — set via this UI)
2. `config/lingua.php` (your published config)
3. Package defaults (lowest)

This means you can keep your `config/lingua.php` as the baseline and override specific settings per environment via the UI without touching files.

## Selector mode

Controls how the `<livewire:lingua::language-selector />` component renders for your end users.

| Mode | Description |
|---|---|
| `sidebar` | Renders as a grouped navigation section (default) |
| `modal` | Renders as a button that opens a full language picker modal |
| `dropdown` | Renders as a compact dropdown button |
| `headless` | No built-in rendering — you implement the UI yourself |

::: tip Headless mode
When set to `headless`, the built-in selector renders nothing. Use `<livewire:lingua::headless-language-selector />` instead to build a fully custom switcher. See [Headless Selector](./language-selector#headless-mode) for full documentation.
:::

## Show flag icons

Toggle the display of country flag icons next to language names in the selector. When disabled, only the language name is shown.

Flag icons are matched to the language's `regional` code (e.g. `en_US` → 🇺🇸). If no regional code is set, the flag falls back gracefully.

## Programmatic access

You can read and write settings in PHP using the `LinguaSetting` model:

```php
use Rivalex\Lingua\Models\LinguaSetting;

// Read with config() fallback
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

$showFlags = LinguaSetting::get(
    LinguaSetting::KEY_SHOW_FLAGS,
    config('lingua.selector.show_flags', true)
);

// Write
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_SHOW_FLAGS, false);
```

Available constants:

| Constant | Key | Type |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |

::: warning Migration required
The `lingua_settings` table is created by the `create_lingua_settings_table` migration. If you upgraded from 1.0.x, run `php artisan migrate` to create it.
:::
