# Rich Text Editor

Lingua HTML और Markdown translation types के लिए [TipTap 3](https://tiptap.dev) को optional rich-text editor के रूप में embed करता है। Translation के `type` column के आधार पर सही editor automatically active होता है।

::: tip केवल Database Driver
Rich-text editor feature **केवल database driver** में available है। File driver में सभी translations plain `text` type के रूप में treat होती हैं।
:::

## Translation Types

| Type | Editor | आउटपुट |
|---|---|---|
| `text` | Simple text input | Plain string |
| `html` | TipTap visual editor | HTML markup |
| `markdown` | TipTap markdown mode | Markdown string |

## Toolbar Configure करना

`config/lingua.php` में `editor` key के माध्यम से toolbar customize करें:

```php
'editor' => [
    'headings'      => false,
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'subscript'     => true,
    'superscript'   => true,
    'blockquote'    => false,
    'code-line'     => false,
    'code-block'    => false,
    'bullet'        => true,
    'ordered'       => true,
    'clear'         => true,
    'code-mode'     => false,
],
```

`false` → वह toolbar button hide होता है।

## `x-lingua::editor` Component

Editor को अपने own Blade templates में embed करें:

```blade
<x-lingua::editor
    :value="$translation"
    :type="'html'"
    wire:model="editValue"
/>
```

Props:

| Prop | Type | विवरण |
|---|---|---|
| `value` | string | Initial content |
| `type` | string | `html` या `markdown` |
| `wire:model` | string | Livewire binding |
| `disabled` | bool | Read-only mode |

## Translation Type बदलना

Translation row पर type badge click करने पर type dropdown खुलता है:

- `text` → `html` या `markdown` में upgrade करें
- Downgrade (`html` → `text`) allowed है लेकिन HTML markup plain text में convert होगा

::: warning Import के दौरान type protection
Import के दौरान, यदि existing record में `html` या `markdown` type है, तो incoming value उसे `text` में downgrade नहीं करती — existing type preserve होती है।
:::
