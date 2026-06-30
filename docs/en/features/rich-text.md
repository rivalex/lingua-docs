# Rich Text Editor

Lingua embeds [TipTap](https://tiptap.dev) as an optional rich-text editor for HTML and Markdown translation types. The correct editor activates automatically based on the translation's `type` column.

## Translation types

| Type | Editor | Description |
|---|---|---|
| `text` | Plain `<textarea>` | Default for all standard translations |
| `html` | TipTap WYSIWYG | Content that renders with HTML formatting |
| `markdown` | TipTap Markdown | Content authored in Markdown syntax |

## Configuring the toolbar

The toolbar is controlled globally via `config/lingua.php`:

```php
'editor' => [
    'headings'      => false,  // H1-H3 heading buttons
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'bullet'        => true,   // Unordered list
    'ordered'       => true,   // Ordered list
    'clear'         => true,   // Clear formatting
],
```

Enable only the options your content needs — a minimal toolbar reduces cognitive load for translators.

<Screenshot src="/screenshots/editor-toolbar.png" alt="Editor Toolbar" caption="The HTML editor toolbar with default options active." />

## Changing a translation's type

In the Edit modal (pencil icon, default locale only), select the desired type from the **Type** dropdown. The editor on the row updates immediately, without a page reload.

::: tip Auto-detection
When you first run `lingua:sync-to-database`, Lingua auto-detects the type from the content. You can override it manually at any time — the stored value is never changed when you change the type, only the editor behaviour.
:::

## Working with HTML translations

HTML translations are stored as raw HTML in the `text` JSON column:

```json
{"en": "<p>Welcome to <strong>Lingua</strong> — the translation manager for Laravel.</p>"}
```

Render them in Blade without double-escaping:

```blade
{{-- Use {!! !!} for HTML translation types --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
Lingua sanitizes HTML translations server-side via `HtmlSanitizer` before storing, but you should still use `{!! __('key') !!}` only for keys you control. Never render untrusted user input as raw HTML. See the [Security guide](/en/guide/security) for details.
:::

## Working with Markdown translations

Markdown translations store raw Markdown:

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**.\n\n- Feature one\n- Feature two"}
```

Render it in Blade with a Markdown parser — Laravel ships `Str::markdown()`:

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

Or use a dedicated package such as [league/commonmark](https://commonmark.thephpleague.com).

## The `x-lingua::editor` component

The editor is exposed as a Blade component you can reuse outside the Lingua management UI:

```blade
{{-- Text mode --}}
<x-lingua::editor wire:model="myField" type="text" placeholder="Enter text…" />

{{-- HTML mode --}}
<x-lingua::editor wire:model="myField" type="html" label="Body content" :required="true" />

{{-- Markdown mode --}}
<x-lingua::editor wire:model="myField" type="markdown" placeholder="Write in Markdown…" />
```

### Props

| Prop | Type | Description |
|---|---|---|
| `wire:model` | string | Livewire property to bind to |
| `type` | string | `'text'`, `'html'`, or `'markdown'` |
| `label` | string | Optional label above the editor |
| `placeholder` | string | Placeholder text |
| `required` | bool | Shows a required badge when `true` |

::: tip
`x-lingua::editor` is a great starting point for any Livewire form that needs a rich-text field. Publish the component view to customise the toolbar or styling.
:::
