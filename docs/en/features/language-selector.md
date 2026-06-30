# Language Selector

The `<livewire:lingua::language-selector>` component is an embeddable locale switcher for your end users — completely separate from the admin management UI.

## Basic usage

```blade
<livewire:lingua::language-selector />
```

Add it anywhere in your Blade layouts. It renders using the mode configured in `config/lingua.php` (`sidebar` by default).

## Display modes

### Sidebar mode (default)

Renders as a grouped navigation section — ideal for application sidebars built with Flux.

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/screenshots/selector-sidebar.png" alt="Language selector in sidebar mode" caption="Sidebar mode — all installed languages as navigation items." width="320px" :center="true"/>

### Dropdown mode

Renders as a compact dropdown button — ideal for headers and navigation bars.

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/screenshots/selector-dropdown.png" alt="Language selector in dropdown mode" caption="Dropdown mode — current language with a flag icon." width="320px" :center="true"/>

### Modal mode

Renders as a button that opens a full language picker overlay — ideal for prominent locale switching on landing pages or onboarding flows.

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/screenshots/selector-modal.png" alt="Language selector in modal mode" caption="Modal mode — full-screen language picker overlay."/>

## Props reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'`, `'modal'`, or `'headless'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | Show country flag icons |

```blade
{{-- Override mode per-instance --}}
<livewire:lingua::language-selector mode="dropdown" :show-flags="false" />
```

## How locale switching works

When a user picks a language, the component calls `changeLocale($locale)`:

1. Validates that the locale exists in the `languages` table (unknown locales are ignored)
2. Stores the locale code in the session under `config('lingua.session_variable')`
3. Calls `app()->setLocale($locale)` for the current request
4. Redirects to the **current page** so the new locale takes effect everywhere

::: tip <Badge type="tip" text="Changed" /> Reloads the current page
The selector now returns the user to the page they were on, not the site root. `ManagesLocale` derives the target from `getRequestUri()` and guards it with a local-path check, so the redirect can never be pointed at an external URL.
:::

On the next request, the Lingua middleware reads the session and applies the locale before your controllers run.

## The `x-lingua::select` component <Badge type="tip" text="New in 2.0" />

Internally, the dropdown and modal selectors use `x-lingua::select`, a custom Alpine + Tailwind dropdown built on the **native Popover API** (`popover="manual"` with `showPopover()` / `hidePopover()`) and `position: fixed`.

Why this matters: a Flux modal or dialog applies `overflow` and `transform` to its container, which clips and mispositions ordinary absolutely-positioned dropdowns. Because the native popover renders in the top layer and is positioned in the viewport, **the selector works correctly even when nested inside a Flux modal or dialog** — no teleporting or z-index hacks required.

## Flag icons

Flag icons are powered by [`outhebox/blade-flags`](https://github.com/MohmmedAshraf/blade-flags), installed automatically as a Lingua dependency.

Flags are matched by the language's `regional` code (e.g. `en_US` → 🇺🇸, `fr_FR` → 🇫🇷). If no regional code is set, the component falls back to the two-letter code.

Disable flags globally:

```php
// config/lingua.php
'selector' => ['show_flags' => false],
```

Or per-instance:

```blade
<livewire:lingua::language-selector :show-flags="false" />
```

## Customising the selector views

Publish the views to override the markup:

```bash
php artisan vendor:publish --tag="lingua-views"
```

The selector templates live under:

```
resources/views/vendor/lingua/livewire/
├── language-selector.blade.php
└── selector/
    ├── sidebar.blade.php
    ├── dropdown.blade.php
    └── modal.blade.php
```

## Refreshing the selector after changes

The selector listens for the `refreshLanguages` Livewire event. Adding or removing a language (from the UI or programmatically) re-renders it without a page reload:

```js
this.$dispatch('refreshLanguages')
```

---

## Headless mode

The headless selector renders zero CSS and zero framework markup — pure semantic HTML with `data-lingua-*` attributes that you style entirely with your own CSS, Tailwind, or any other approach. Use it when you need the locale-switching logic but want full control over the visual output.

### Basic usage

```blade
<livewire:lingua::headless-language-selector />
```

The language list is always present in the DOM. Visibility is your responsibility — use CSS `display`, Alpine.js `x-show`, or any other mechanism. No built-in trigger button is provided by design.

Enable headless mode globally via config or the Settings page:

```php
// config/lingua.php
'selector' => ['mode' => 'headless'],
```

### Named slots

#### `$item` slot

Replaces the default `<button>` markup inside every language `<li>`. Receives the `Language` model:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        {{ $language->native }} ({{ $language->code }})
    </x-slot>
</livewire:lingua::headless-language-selector>
```

#### `$current` slot

Replaces the rendering of the **currently selected** language only. Falls through to `$item` when not provided:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:current="language">
        <strong>{{ $language->native }}</strong>
    </x-slot>
    <x-slot:item="language">
        {{ $language->native }}
    </x-slot>
</livewire:lingua::headless-language-selector>
```

### CSS targeting API

| Attribute | Element |
|---|---|
| `data-lingua-selector` | Root `<nav>` element |
| `data-lingua-list` | The `<ul>` language list |
| `data-lingua-item` | Each `<li>` language entry |
| `data-lingua-active` | The `<li>` of the currently active language |
| `data-lingua-button` | The `<button>` inside each `<li>` |
| `data-lingua-name` | Language English display name `<span>` |
| `data-lingua-native` | Language native name `<span>` |
| `data-lingua-code` | Language ISO code `<span>` |

### Styling examples

**Plain CSS:**

```css
[data-lingua-selector] {
    display: flex;
    gap: 0.5rem;
    list-style: none;
}
[data-lingua-active] {
    font-weight: bold;
    text-decoration: underline;
}
[data-lingua-button] {
    background: none;
    border: none;
    padding: 0.25rem 0.5rem;
}
```

**Tailwind CSS:**

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        <span class="px-3 py-1 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            {{ $language->native }}
        </span>
    </x-slot>
    <x-slot:current="language">
        <span class="px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900 font-semibold text-red-700 dark:text-red-300">
            {{ $language->native }}
        </span>
    </x-slot>
</livewire:lingua::headless-language-selector>
```

**Alpine.js visibility toggle:**

```blade
<div x-data="{ open: false }">
    <button @click="open = !open">{{ app()->getLocale() }}</button>

    <div x-show="open" @click.outside="open = false">
        <livewire:lingua::headless-language-selector>
            <x-slot:item="language">
                <button class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                    {{ $language->native }}
                </button>
            </x-slot>
        </livewire:lingua::headless-language-selector>
    </div>
</div>
```

::: tip
When `mode="headless"` is passed to `<livewire:lingua::language-selector />`, that component renders nothing. Use `<livewire:lingua::headless-language-selector />` directly instead for full slot and attribute support.
:::
