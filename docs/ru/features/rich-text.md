# Rich Text редактор

Lingua встраивает [TipTap 3](https://tiptap.dev) как опциональный rich-text редактор для
типов переводов HTML и Markdown. Нужный редактор активируется автоматически на основе
столбца `type` перевода.

::: tip Database-драйвер
Типы `html` и `markdown` и rich-text редакторы доступны только в database-драйвере.
В file-драйвере все строки редактируются как обычный текст.
:::

## Типы переводов

| Тип | Редактор | Описание |
|---|---|---|
| `text` | Простой `<textarea>` | По умолчанию для всех стандартных переводов |
| `html` | TipTap WYSIWYG | Контент с HTML-форматированием |
| `markdown` | TipTap Markdown | Контент в синтаксисе Markdown |

## Настройка панели инструментов

Панель управляется через `config/lingua.php`:

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

Включайте только нужные опции. Минималистичная панель снижает когнитивную нагрузку на переводчиков.

## Изменение типа перевода

В модальном окне редактирования (только для локали по умолчанию) выберите тип из
выпадающего списка **Type**. Редактор обновляется немедленно. Хранимое значение не
изменяется при смене типа — меняется только поведение редактора.

## Работа с HTML-переводами

HTML-переводы хранятся как сырой HTML в JSON-столбце `text`:

```json
{"en": "<p>Welcome to <strong>Lingua</strong> — the translation manager for Laravel.</p>"}
```

Для отображения в Blade:

```blade
{{-- Используйте {!! !!} для HTML-типов --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
Используйте `{!! !!}` только для строк, управляемых авторизованными пользователями через
защищённый интерфейс. HTML-переводы санируются `HtmlSanitizer` перед сохранением —
см. [Безопасность](/ru/guide/security#xss-protection).
:::

## Работа с Markdown-переводами

Markdown-переводы хранят сырой Markdown:

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**.\n\n- Feature one\n- Feature two"}
```

Для отображения в Blade используйте `Str::markdown()`:

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

## Компонент `x-lingua::editor`

Редактор доступен как Blade-компонент для переиспользования в собственных шаблонах:

```blade
{{-- Текстовый режим --}}
<x-lingua::editor wire:model="myField" type="text" placeholder="Enter text…" />

{{-- HTML-режим --}}
<x-lingua::editor wire:model="myField" type="html" label="Body content" :required="true" />

{{-- Markdown-режим --}}
<x-lingua::editor wire:model="myField" type="markdown" placeholder="Write in Markdown…" />
```

### Пропсы

| Проп | Тип | Описание |
|---|---|---|
| `wire:model` | string | Привязка к свойству Livewire |
| `type` | string | `'text'`, `'html'` или `'markdown'` |
| `label` | string | Опциональная метка над редактором |
| `placeholder` | string | Текст-заполнитель |
| `required` | bool | Показывает значок обязательного поля при `true` |
