# Blade Components

Lingua `lingua::` prefix के तहत anonymous Blade components register करता है।

---

## `x-lingua::nav` <Badge type="tip" text="2.0 में नया" />

सभी पाँच Lingua pages पर shared navigation menu।

```blade
<x-lingua::nav :currentPage="'languages'" />
```

Props:

| Prop | Type | विवरण |
|---|---|---|
| `currentPage` | string | Active page highlight: `languages`, `translations`, `statistics`, `transfer`, `settings` |

`config/lingua.php` में `nav.enabled = false` से या Settings UI से disable करें।

---

## `x-lingua::select` <Badge type="tip" text="2.0 में नया" />

Native Popover API-based locale selector। `popover="manual"` और `showPopover()`/`hidePopover()` उपयोग करता है — Flux dialog के `transform`+`overflow` trapping से बचता है।

```blade
<x-lingua::select
    :locales="$locales"
    :current="app()->getLocale()"
    :route="route('lingua.switch')"
    :showFlags="true"
/>
```

Props:

| Prop | Type | Default | विवरण |
|---|---|---|---|
| `locales` | array | — | `['en' => 'English', ...]` |
| `current` | string | — | Active locale code |
| `route` | string | — | Switch endpoint URL |
| `showFlags` | bool | config | Country flags |

---

## `x-lingua::stat` <Badge type="tip" text="2.0 में नया" />

KPI card — Statistics page और custom dashboards के लिए।

```blade
<x-lingua::stat
    label="French Coverage"
    :value="85"
    suffix="%"
    :trend="5"
/>
```

Props: `label`, `value`, `suffix`, `trend` (positive/negative number)।

---

## `x-lingua::card` / `x-lingua::card.row` <Badge type="tip" text="2.0 में नया" />

Settings और Statistics pages में card layout।

```blade
<x-lingua::card title="Storage Driver">
    <x-lingua::card.row label="Driver" value="database" />
    <x-lingua::card.row label="Table" value="language_lines" />
</x-lingua::card>
```

---

## `x-lingua::branding` <Badge type="tip" text="2.0 में नया" />

Lingua logo + version watermark।

```blade
<x-lingua::branding />
```

---

## `x-lingua::validation-errors` <Badge type="tip" text="2.0 में नया" />

Livewire validation errors display करता है।

```blade
<x-lingua::validation-errors />
```

---

## `x-lingua::editor`

Rich-text TipTap editor (database driver में `html`/`markdown` types के लिए)।

```blade
<x-lingua::editor
    :value="$value"
    type="html"
    wire:model="editValue"
/>
```

Props: `value` (string), `type` (`html`/`markdown`), `disabled` (bool)।

---

## `x-lingua::clipboard`

Copy-to-clipboard button।

```blade
<x-lingua::clipboard :text="$translation" />
```

---

## `x-lingua::language-flag`

Language locale code से country flag render करता है।

```blade
<x-lingua::language-flag locale="fr" />
```

---

## `x-lingua::message`

Flash message display।

```blade
<x-lingua::message type="success" :text="__('lingua::settings.saved')" />
```

Props: `type` (`success`/`error`/`warning`/`info`), `text`।

---

## `x-lingua::autocomplete`

Locale search autocomplete input।

```blade
<x-lingua::autocomplete
    :options="$availableLocales"
    wire:model="selectedLocale"
    placeholder="Search locales..."
/>
```

---

## `x-lingua::menu-group`

Sidebar navigation group wrapper।

```blade
<x-lingua::menu-group label="Translations">
    <x-lingua::menu-group.item
        :href="route('lingua.translations')"
        label="Manage"
    />
</x-lingua::menu-group>
```
