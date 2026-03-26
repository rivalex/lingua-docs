# Blade Components

Lingua registers several anonymous Blade components under the `lingua::` prefix. These are used internally by the Livewire views and can also be reused in your own templates.

## `<x-lingua::editor>`

A polymorphic editor component that renders a `<textarea>`, TipTap HTML editor, or TipTap Markdown editor based on the `type` prop.

```blade
{{-- Plain text --}}
<x-lingua::editor
    wire:model="value"
    type="text"
    placeholder="Enter text…"
/>

{{-- HTML --}}
<x-lingua::editor
    wire:model="value"
    type="html"
    label="Body content"
    :required="true"
/>

{{-- Markdown --}}
<x-lingua::editor
    wire:model="value"
    type="markdown"
    placeholder="Write in Markdown…"
/>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'`, or `'markdown'` |
| `label` | string | `''` | Optional label above the field |
| `placeholder` | string | `''` | Placeholder text |
| `required` | bool | `false` | Shows a required badge |
| `wire:model` | — | — | Livewire model binding |

---

## `<x-lingua::clipboard>`

A wrapper that adds a copy-to-clipboard button around its slot content.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

Clicking the component copies `text-to-copy` to the clipboard and briefly shows a checkmark.

### Props

| Prop | Type | Description |
|---|---|---|
| `text-to-copy` | string | The text to copy to the clipboard |
| `show-tooltip` | bool | Show a tooltip on hover (default: `false`) |

---

## `<x-lingua::language-flag>`

Renders a flag icon and language name for a given locale.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `name` | string | English language name |
| `code` | string | Locale code for flag lookup |
| `description` | string | Native language name (subtitle) |

Uses `outhebox/blade-flags` for the flag SVGs. If no flag is available for the code, falls back gracefully to the code text.

---

## `<x-lingua::message>`

A transient message component that shows for a brief duration after a Livewire event.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `on` | string | — | Livewire event name to listen for |
| `delay` | int | `1500` | Duration in milliseconds before hiding |

---

## `<x-lingua::autocomplete>`

An autocomplete text input component used in the translation creation form.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="e.g. marketing"
/>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `wire:model` | — | Livewire model binding |
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

### Props

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
