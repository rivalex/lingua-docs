# Configuration

After installation, `config/lingua.php` is the single source of truth for
all Lingua settings. This page documents every key, grouped by concern.
Keys marked <Badge type="tip" text="New in 2.0" /> did not exist in 1.x.

## Locale settings

```php
// config/lingua.php

'lang_dir'         => lang_path(),
'base_translations_path' => null, // ★ New in 2.0
'default_locale'   => config('app.locale', 'en'),
'fallback_locale'  => config('app.fallback_locale', 'en'),
'session_variable' => 'locale',
```

### `lang_dir`

**Default:** `lang_path()` — resolves to `{project_root}/lang/`.

The directory Lingua reads when syncing files to the database and writes
to when exporting back to files.

### `base_translations_path` <Badge type="tip" text="New in 2.0" />

**Default:** `null`

Optional override for the path Lingua reads the **bundled** translation
dataset from. Leave `null` to use the dataset shipped inside the package.

### `default_locale`

**Default:** `config('app.locale', 'en')`

Used as a fallback during installation and when the `languages` table is
empty. After installation, the authoritative default is the row in the
`languages` table with `is_default = true`.

### `fallback_locale`

**Default:** `config('app.fallback_locale', 'en')`

Standard Laravel fallback — when a key is missing in the active locale,
this locale is tried next.

### `session_variable`

**Default:** `'locale'`

The session key where Lingua stores the user's chosen locale.

---

## Security & access

```php
'middleware' => ['web', 'auth'],
'gate'       => env('LINGUA_GATE', null), // ★ New in 2.0
```

### `middleware`

**Default:** `['web', 'auth']` <Badge type="warning" text="Changed in 2.0" />

::: tip Secure by default
In 2.0 the default is `['web', 'auth']` — the management UI is **not**
publicly reachable out of the box. This was `['web']` in 1.x.
:::

```php
// With Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// With a custom Gate policy
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `gate` <Badge type="tip" text="New in 2.0" />

**Default:** `env('LINGUA_GATE', null)`

When set, Lingua appends `can:{gate}` to all admin routes. Define the gate
in a service provider:

```ini
LINGUA_GATE=manage-translations
```

```php
Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

See the [Security reference](/en/guide/security#authentication).

---

## Routing

```php
'routes_prefix'           => 'lingua',
'routes_extra_parameters' => null,  // ★ New in 2.0
'navigate'                => false, // ★ New in 2.0 (default changed)
'layout'                  => null,  // ★ New in 2.0
```

### `routes_prefix`

**Default:** `'lingua'`

Changes the URL prefix for all Lingua management pages:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
```

### `routes_extra_parameters` <Badge type="tip" text="New in 2.0" />

**Default:** `null`

Optional parameterized suffix appended to the route prefix — useful for
tenant- or section-scoped prefixes.

### `navigate` <Badge type="tip" text="New in 2.0" />

**Default:** `false` <Badge type="warning" text="Changed in 2.0" />

Controls `wire:navigate` on Lingua's internal links. The default is now
`false` (full-page redirects), which avoids SPA-navigation edge cases. Opt
in with `'navigate' => true`.

### `layout` <Badge type="tip" text="New in 2.0" />

**Default:** `null`

Provide a custom Blade layout for Lingua's views. Leave `null` to use the
package's built-in layout.

---

## Navigation

```php
'nav' => [
    'enabled' => true, // ★ New in 2.0
],
'links' => [
    'translations' => [          // ★ New in 2.0
        'enabled' => true,
        'route'   => 'lingua.translations',
    ],
],
```

### `nav.enabled` <Badge type="tip" text="New in 2.0" />

**Default:** `true`

Toggles the shared `x-lingua::nav` navigation menu that appears on all
five Lingua pages. Can also be toggled from the Settings UI.

### `links.translations` <Badge type="tip" text="New in 2.0" />

Controls the "Translations" entry in the shared nav: whether it is shown
(`enabled`) and which route it points to (`route`).

---

## UI

```php
'ui' => [
    'sticky_top' => 0, // ★ New in 2.0
],
'selector' => [
    'mode'       => 'sidebar',  // 'sidebar' | 'modal' | 'dropdown' | 'headless'
    'show_flags' => true,
],
'editor' => [
    'headings' => false, 'bold' => true, 'italic' => true,
    'underline' => true, 'strikethrough' => false,
    'subscript' => true, 'superscript' => true,
    'blockquote' => false, 'code-line' => false, 'code-block' => false,
    'bullet' => true, 'ordered' => true, 'clear' => true, 'code-mode' => false,
],
```

### `ui.sticky_top` <Badge type="tip" text="New in 2.0" />

**Default:** `0`

Pixel offset for Lingua's sticky toolbars. Increase it if your app has a
fixed header so toolbars don't slide underneath it.

### `selector.mode`

**Default:** `'sidebar'`

| Value | Description |
|---|---|
| `sidebar` | Grouped sidebar navigation item |
| `dropdown` | Compact dropdown button |
| `modal` | Button that opens a locale picker modal |
| `headless` | No built-in rendering — use the headless component |

### `selector.show_flags`

**Default:** `true`

Whether to show country flag icons next to language names.

### `editor`

Controls the rich-text toolbar for HTML and Markdown translation types
(database driver only). Each key toggles one formatting option:
`headings`, `bold`, `italic`, `underline`, `strikethrough`, `subscript`,
`superscript`, `blockquote`, `code-line`, `code-block`, `bullet`,
`ordered`, `clear`, `code-mode`.

---

## Appearance <Badge type="tip" text="New" />

```php
'dark_mode' => [
    'force' => env('LINGUA_FORCE_DARK_MODE', false),
],
```

### `dark_mode.force` <Badge type="tip" text="New" />

**Default:** `env('LINGUA_FORCE_DARK_MODE', false)`

Lingua's own CSS build uses a class-based `dark:` variant
(`&:where(.dark, .dark *)`), so it normally follows the host app's
`<html class="dark">` ancestor — the same convention as Tailwind's default
class strategy. If your host app has no class-based dark toggle (or its
state doesn't match the real OS/browser preference), Lingua's own styling
can render unstyled even though the rest of the page looks fine.

Set `force` to `true` to make Lingua always render its dark theme,
regardless of the host app or OS color scheme. Useful when embedding
Lingua in a host with no dark-mode toggle, or while developing locally on
a light-mode system. Can also be toggled live from the
[Settings UI](/en/features/settings#appearance), which takes precedence
over this config default.

```ini
LINGUA_FORCE_DARK_MODE=true
```

---

## Storage driver <Badge type="tip" text="New in 2.0" />

```php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

### `storage.driver`

**Default:** `env('LINGUA_STORAGE_DRIVER', 'database')`

Selects where translations live:

| Driver | Behaviour |
|---|---|
| `database` | The full 1.x behaviour: `language_lines` table, HTML/Markdown types, stats, import/export, vendor guard, surgical cache. |
| `file` | Reads/writes `lang/` PHP+JSON directly; no `language_lines` table; types flatten to plain text. |

This is a major feature — see [Storage Drivers](/en/guide/storage) for the
full comparison and the `lingua:storage` switch command.

---

## Cache

```php
'cache' => [
    'store'  => env('LINGUA_CACHE_STORE', null),       // ★ New in 2.0
    'prefix' => env('LINGUA_CACHE_PREFIX', 'lingua.trans'), // ★ New in 2.0
],
```

### `cache.store` <Badge type="tip" text="New in 2.0" />

**Default:** `env('LINGUA_CACHE_STORE', null)`

Which cache store Lingua uses for translation caching. `null` uses your
application's default store.

### `cache.prefix` <Badge type="tip" text="New in 2.0" />

**Default:** `env('LINGUA_CACHE_PREFIX', 'lingua.trans')`

Prefix for cache keys. Lingua caches translations **surgically** per
`(locale, group)` and forgets only the affected key on write — there is no
global `cache:clear`. See
[Cache architecture](/en/guide/architecture#cache-architecture).

---

## Translation loaders

```php
'translation_loaders' => [
    // Rivalex\Lingua\Loaders\YourCustomLoader::class,
],
'model'               => Rivalex\Lingua\Models\Translation::class,
'translation_manager' => Rivalex\Lingua\TranslationManager\LinguaManager::class,
```

### `translation_loaders`

Register additional loaders implementing
`Rivalex\Lingua\Contracts\TranslationLoader`. The contract signature is
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### `model`

The Eloquent model backing `language_lines`. Override to extend
`Translation` with your own logic.

### `translation_manager`

The translation loader class. Defaults to
`Rivalex\Lingua\TranslationManager\LinguaManager`, which extends
`Illuminate\Translation\FileLoader`.

---

## Extensions

```php
'extensions' => [
    'enabled' => env('LINGUA_EXTENSIONS_ENABLED', true), // ★ New in 2.0
],
'suppress_pro_nudge' => env('LINGUA_SUPPRESS_PRO_NUDGE', false), // ★ New in 2.0
'pro_upgrade_url'    => env('LINGUA_PRO_UPGRADE_URL', 'https://lingua.rivalex.dev'), // ★ New in 2.0
```

### `extensions.enabled` <Badge type="tip" text="New in 2.0" />

**Default:** `true`

Master switch for optional Lingua extensions.

### `suppress_pro_nudge` <Badge type="tip" text="New in 2.0" />

**Default:** `false`

Set to `true` to hide upgrade hints in the UI.

### `pro_upgrade_url` <Badge type="tip" text="New in 2.0" />

**Default:** `https://lingua.rivalex.dev`

URL used by upgrade hints when shown.
