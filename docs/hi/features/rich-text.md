# Rich Text Editor

Lingua HTML और Markdown translation types के लिए एक वैकल्पिक rich-text editor के रूप में [TipTap 3](https://tiptap.dev) embed करता है। Translation के `type` column के आधार पर सही editor स्वचालित रूप से सक्रिय होता है।

## Translation types

| Type | Editor | विवरण |
|---|---|---|
| `text` | Plain `<textarea>` | सभी मानक translations के लिए डिफ़ॉल्ट |
| `html` | TipTap WYSIWYG | उस content के लिए जो HTML formatting के साथ render होना चाहिए |
| `markdown` | TipTap Markdown | Markdown syntax में authored content के लिए |

## Toolbar configure करना

Editor toolbar को `config/lingua.php` के माध्यम से globally नियंत्रित किया जाता है:

```php
'editor' => [
    'headings'      => false,  // H1-H3 heading बटन
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'bullet'        => true,   // Unordered list
    'ordered'       => true,   // Ordered list
    'clear'         => true,   // Clear formatting
],
```

केवल वही options enable करें जिनकी आपके content को वास्तव में ज़रूरत है। Toolbar minimal रखने से translators का cognitive load कम होता है।

<Screenshot src="/screenshots/editor-toolbar.png" alt="Editor Toolbar" caption="डिफ़ॉल्ट options सक्रिय के साथ HTML editor toolbar।" />

## Translation का type बदलना

Edit modal में (pencil icon, केवल default locale पर), **Type** dropdown से desired type चुनें। Editor तुरंत page reload के बिना row पर update होता है।

::: tip Auto-detection
जब आप पहली बार `lingua:sync-to-database` चलाते हैं, Lingua content के आधार पर type auto-detect करता है। आप किसी भी समय इसे manually override कर सकते हैं - जब आप type बदलते हैं तो stored value नहीं बदलती, केवल editor व्यवहार बदलता है।
:::

## HTML translations के साथ काम करना

HTML translations को `text` JSON column में raw HTML के रूप में संग्रहीत किया जाता है:

```json
{"en": "<p>Welcome to <strong>Lingua</strong> - the translation manager for Laravel.</p>"}
```

उन्हें Blade में double-escaping के बिना render करने के लिए:

```blade
{{-- HTML translation types के लिए हमेशा {!! !!} का उपयोग करें --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
`{!! !!}` केवल उन translation strings के लिए उपयोग करें जो एक controlled admin panel में authorized users द्वारा प्रबंधित होती हैं। कभी भी अविश्वसनीय user input को raw HTML के रूप में render न करें।
:::

## Markdown translations के साथ काम करना

Markdown translations raw Markdown संग्रहीत करते हैं:

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**.\n\n- Feature one\n- Feature two"}
```

Blade में Markdown render करने के लिए, एक Markdown parser का उपयोग करें। Laravel `Str::markdown()` के साथ आता है:

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

या एक dedicated package जैसे [league/commonmark](https://commonmark.thephpleague.com) का उपयोग करें।

## `x-lingua::editor` component

Editor एक Blade component के रूप में उजागर है जिसे आप Lingua management UI के बाहर reuse कर सकते हैं:

```blade
{{-- Text mode --}}
<x-lingua::editor
    wire:model="myField"
    type="text"
    placeholder="Enter text…"
/>

{{-- HTML mode --}}
<x-lingua::editor
    wire:model="myField"
    type="html"
    label="Body content"
    :required="true"
/>

{{-- Markdown mode --}}
<x-lingua::editor
    wire:model="myField"
    type="markdown"
    placeholder="Write in Markdown…"
/>
```

### Props

| Prop | Type | विवरण |
|---|---|---|
| `wire:model` | string | Bind करने के लिए Livewire property |
| `type` | string | `'text'`, `'html'`, या `'markdown'` |
| `label` | string | Editor के ऊपर optional label |
| `placeholder` | string | Placeholder text |
| `required` | bool | `true` होने पर required badge दिखाता है |

::: tip
`x-lingua::editor` component किसी भी Livewire form के लिए एक बेहतरीन शुरुआती बिंदु है जिसे rich-text field की ज़रूरत है। Toolbar या styling customize करने के लिए component view प्रकाशित करें।
:::
