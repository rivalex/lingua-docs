# Blade Components

Lingua registers a set of anonymous Blade components under the `lingua::` prefix. They power the five Livewire pages and can be reused in your own templates.

## `<x-lingua::nav>` <Badge type="tip" text="New in 2.0" />

The shared navigation bar rendered at the top of every Lingua page. Shows links to **Languages**, **Translations**, **Statistics**, **Transfer**, and **Settings**, with the current page highlighted automatically (via `request()->routeIs()`).

```blade
<x-lingua::nav />
```

### Props

None. The component reads its own state:
- **Visibility** is controlled by the `LinguaSetting::KEY_NAV_ENABLED` setting, falling back to `config('lingua.nav.enabled', true)`. When disabled it renders nothing.
- **Active state** is derived from the current route.

---

## `<x-lingua::select>` <Badge type="tip" text="New in 2.0" />

A custom select control built on the **native Popover API** (`popover="manual"`). Because the listbox is promoted to the top layer, it never clips inside Flux modals or `overflow-hidden` containers. Supports searchable, clearable, and multiple modes.

Options are provided as child `<x-lingua::select.option>` elements (not an `options` array):

```blade
<x-lingua::select
    searchable
    clearable
    placeholder="Choose a locale"
    label="Target locale"
    wire:model="locale"
>
    <x-lingua::select.option value="en">English</x-lingua::select.option>
    <x-lingua::select.option value="fr">French</x-lingua::select.option>
    <x-lingua::select.option value="ar">Arabic</x-lingua::select.option>
</x-lingua::select>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `searchable` | bool | `false` | Show a search box to filter options |
| `clearable` | bool | `false` | Show a button to clear the selection |
| `multiple` | bool | `false` | Allow selecting more than one option |
| `placeholder` | string | `null` | Text shown when nothing is selected |
| `empty` | string | `null` | "No results" text (defaults to the translated string) |
| `size` | string | `null` | `xs`, `sm`, or default (`h-10`) |
| `selected-suffix` | string | `null` | Suffix shown after the count in multiple mode |
| `label` | string | `null` | Label above the control |
| `description` | string | `null` | Helper text below the label |
| `badge` | string | `null` | Small badge next to the label (defaults to "Required" when `required`) |
| `disabled` | bool | `false` | Disable the control |
| `invalid` | bool | `false` | Apply the error styling |
| `required` | bool | `false` | Mark the field as required |
| `id` | string | `null` | Explicit element id (auto-generated otherwise) |

Any extra attributes (including `wire:model`) are forwarded to the underlying input.

---

## `<x-lingua::stat>` <Badge type="tip" text="New in 2.0" />

A KPI stat tile used on the Statistics page.

```blade
<x-lingua::stat label="Total strings" :value="$total" icon="document-text" />
<x-lingua::stat label="Translated" :value="$translated" icon="check-circle" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | int\|string | `0` | The headline number/value |
| `label` | string | `''` | Uppercase label above the value |
| `icon` | string | `null` | Optional Heroicon name (rendered via `<flux:icon>`) |

---

## `<x-lingua::card>` / `<x-lingua::card.row>` <Badge type="tip" text="New in 2.0" />

A content card container with an optional header, and a two-column settings row for use inside it.

```blade
<x-lingua::card title="Routing & Navigation" icon="cog-6-tooth">
    <x-slot:actions>
        <flux:button size="sm">Save</flux:button>
    </x-slot:actions>

    <x-lingua::card.row
        title="Shared navigation"
        description="Show the Lingua nav bar on every page."
    >
        <flux:switch wire:model.live="navEnabled" />
    </x-lingua::card.row>
</x-lingua::card>
```

### `card` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | `null` | Header title (header is omitted when both `title` and `$actions` are absent) |
| `subtitle` | string | `null` | Header subtitle |
| `icon` | string | `null` | Optional Heroicon name |

Named slot `$actions` renders on the header's right side.

### `card.row` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | `null` | Row label (left column) |
| `description` | string | `null` | Helper text under the label |

The default slot holds the controls (right column).

---

## `<x-lingua::branding>` <Badge type="tip" text="New in 2.0" />

Renders the Lingua branding: a fixed corner watermark (`logoLinguaMark`) plus an inline horizontal logo (`logoLinguaHorizzontal`) followed by a separator.

```blade
<x-lingua::branding />
```

### Props

None. The watermark is rendered once per response (`@once`); the inline logo renders wherever the component is placed.

---

## `<x-lingua::validation-errors>` <Badge type="tip" text="New in 2.0" />

Displays the current Livewire/validation error bag as a styled alert. Renders nothing when there are no errors.

```blade
<x-lingua::validation-errors />
```

### Props

None — it reads the shared `$errors` bag automatically. Extra attributes (e.g. `class`) are merged onto the wrapper.

---

## `<x-lingua::editor>`

A polymorphic editor that renders a `<textarea>`, a TipTap HTML editor, or a TipTap Markdown editor based on the `type` prop.

```blade
<x-lingua::editor wire:model="value" type="text"     placeholder="Enter text…" />
<x-lingua::editor wire:model="value" type="html"     label="Body content" :required="true" />
<x-lingua::editor wire:model="value" type="markdown" placeholder="Write in Markdown…" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'`, or `'markdown'` |
| `label` | string | `''` | Optional label above the field |
| `placeholder` | string | `''` | Placeholder text |
| `required` | bool | `false` | Shows a required badge |

---

## `<x-lingua::clipboard>`

Wraps its slot in a copy-to-clipboard button.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

| Prop | Type | Description |
|---|---|---|
| `text-to-copy` | string | The text to copy |
| `show-tooltip` | bool | Show a tooltip on hover (default: `false`) |

---

## `<x-lingua::language-flag>`

Renders a flag icon and language name for a locale, using `outhebox/blade-flags`. Falls back to the code text when no flag exists.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

| Prop | Type | Description |
|---|---|---|
| `name` | string | English language name |
| `code` | string | Locale code for flag lookup |
| `description` | string | Native language name (subtitle) |

---

## `<x-lingua::message>`

A transient message that shows briefly after a Livewire event.

```blade
<x-lingua::message on="translation_updated" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `on` | string | - | Livewire event name to listen for |
| `delay` | int | `1500` | Milliseconds before hiding |

---

## `<x-lingua::autocomplete>`

A text input with suggestions, used in the translation creation form.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="e.g. marketing"
/>
```

| Prop | Type | Description |
|---|---|---|
| `suggestions` | array | Array of autocomplete suggestions |
| `placeholder` | string | Input placeholder |

---

## `<x-lingua::menu-group>`

A navigation group component for sidebar menus.

```blade
<x-lingua::menu-group heading="Languages">
    {{-- menu items slot --}}
</x-lingua::menu-group>
```

| Prop | Type | Description |
|---|---|---|
| `heading` | string | Group heading text |

---

## Customising components

Publish all component views to override them:

```bash
php artisan vendor:publish --tag="lingua-views"
```

Published views live in `resources/views/vendor/lingua/components/`. Laravel uses your published version automatically.
