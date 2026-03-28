# Blade Components

Lingua `lingua::` prefix के तहत कई anonymous Blade components register करता है। ये Livewire views द्वारा internally उपयोग किए जाते हैं और आपके अपने templates में भी reuse किए जा सकते हैं।

## `<x-lingua::editor>`

एक polymorphic editor component जो `type` prop के आधार पर `<textarea>`, TipTap HTML editor, या TipTap Markdown editor render करता है।

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

| Prop | Type | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'`, या `'markdown'` |
| `label` | string | `''` | Field के ऊपर optional label |
| `placeholder` | string | `''` | Placeholder text |
| `required` | bool | `false` | Required badge दिखाता है |
| `wire:model` | — | — | Livewire model binding |

---

## `<x-lingua::clipboard>`

एक wrapper जो slot content के चारों ओर copy-to-clipboard बटन जोड़ता है।

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

Component पर क्लिक करने से `text-to-copy` clipboard में copy होता है और briefly एक checkmark दिखता है।

### Props

| Prop | Type | विवरण |
|---|---|---|
| `text-to-copy` | string | Clipboard में copy करने के लिए text |
| `show-tooltip` | bool | Hover पर tooltip दिखाएँ (default: `false`) |

---

## `<x-lingua::language-flag>`

दिए हुए locale के लिए एक flag icon और language name render करता है।

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

### Props

| Prop | Type | विवरण |
|---|---|---|
| `name` | string | अंग्रेज़ी भाषा का नाम |
| `code` | string | Flag lookup के लिए locale code |
| `description` | string | Native भाषा का नाम (subtitle) |

Flag SVGs के लिए `outhebox/blade-flags` उपयोग करता है। यदि code के लिए कोई flag उपलब्ध नहीं है, तो gracefully code text display पर fallback करता है।

---

## `<x-lingua::message>`

एक transient message component जो Livewire event के बाद कुछ समय के लिए दिखता है।

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

### Props

| Prop | Type | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `on` | string | — | सुनने के लिए Livewire event नाम |
| `delay` | int | `1500` | Hide होने से पहले milliseconds में duration |

---

## `<x-lingua::autocomplete>`

Translation creation form में उपयोग किया जाने वाला एक autocomplete text input component।

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="e.g. marketing"
/>
```

### Props

| Prop | Type | विवरण |
|---|---|---|
| `wire:model` | — | Livewire model binding |
| `suggestions` | array | Autocomplete suggestions का array |
| `placeholder` | string | Input placeholder |

---

## `<x-lingua::menu-group>`

Sidebar menus के लिए एक navigation group component।

```blade
<x-lingua::menu-group heading="Languages">
    {{-- menu items slot --}}
</x-lingua::menu-group>
```

### Props

| Prop | Type | विवरण |
|---|---|---|
| `heading` | string | Group heading text |

---

## Components customize करना

सभी component views override करने के लिए publish करें:

```bash
php artisan vendor:publish --tag="lingua-views"
```

Published views `resources/views/vendor/lingua/components/` में रहती हैं। Laravel स्वचालित रूप से आपके published version का उपयोग करता है।
