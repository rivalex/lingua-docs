# Rich Text редактор

Lingua встраивает [TipTap 3](https://tiptap.dev) в качестве опционального rich-text редактора для типов переводов HTML и Markdown. Нужный редактор активируется автоматически на основе столбца `type` перевода.

## Типы переводов

| Тип | Редактор | Описание |
|---|---|---|
| `text` | Простой `<textarea>` | По умолчанию для всех стандартных переводов |
| `html` | TipTap WYSIWYG | Для контента, который должен отображаться с HTML-форматированием |
| `markdown` | TipTap Markdown | Для контента, написанного в синтаксисе Markdown |

## Настройка панели инструментов

Панель инструментов редактора управляется глобально через `config/lingua.php`:

```php
'editor' => [
    'headings'      => false,  // Кнопки заголовков H1-H3
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'bullet'        => true,   // Маркированный список
    'ordered'       => true,   // Нумерованный список
    'clear'         => true,   // Очистить форматирование
],
```

Включайте только те опции, которые реально нужны вашему контенту. Минималистичная панель инструментов снижает когнитивную нагрузку на переводчиков.

<Screenshot src="/screenshots/editor-toolbar.png" alt="Панель инструментов редактора" caption="Панель инструментов HTML-редактора с активными параметрами по умолчанию." />

## Изменение типа перевода

В модальном окне редактирования (иконка карандаша, только для локали по умолчанию) выберите нужный тип из выпадающего списка **Type**. Редактор в строке обновляется немедленно без перезагрузки страницы.

::: tip Автоопределение
При первом запуске `lingua:sync-to-database` Lingua автоматически определяет тип на основе содержимого. Вы можете переопределить его вручную в любое время - хранимое значение не меняется при смене типа, меняется только поведение редактора.
:::

## Работа с HTML-переводами

HTML-переводы хранятся как сырой HTML в JSON-столбце `text`:

```json
{"en": "<p>Welcome to <strong>Lingua</strong> - the translation manager for Laravel.</p>"}
```

Для отображения в Blade без двойного экранирования:

```blade
{{-- Всегда используйте {!! !!} для типов HTML-переводов --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
Используйте `{!! !!}` только для строк переводов, управляемых авторизованными пользователями в защищённой панели администратора. Никогда не отображайте ненадёжный пользовательский ввод как сырой HTML.
:::

## Работа с Markdown-переводами

Markdown-переводы хранят сырой Markdown:

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**.\n\n- Feature one\n- Feature two"}
```

Для отображения Markdown в Blade используйте парсер Markdown. Laravel поставляется с `Str::markdown()`:

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

Или используйте специализированный пакет, например [league/commonmark](https://commonmark.thephpleague.com).

## Компонент `x-lingua::editor`

Редактор доступен как Blade-компонент, который можно переиспользовать вне интерфейса управления Lingua:

```blade
{{-- Текстовый режим --}}
<x-lingua::editor
    wire:model="myField"
    type="text"
    placeholder="Enter text…"
/>

{{-- HTML-режим --}}
<x-lingua::editor
    wire:model="myField"
    type="html"
    label="Body content"
    :required="true"
/>

{{-- Markdown-режим --}}
<x-lingua::editor
    wire:model="myField"
    type="markdown"
    placeholder="Write in Markdown…"
/>
```

### Пропсы

| Проп | Тип | Описание |
|---|---|---|
| `wire:model` | string | Привязка к свойству Livewire |
| `type` | string | `'text'`, `'html'` или `'markdown'` |
| `label` | string | Опциональная метка над редактором |
| `placeholder` | string | Текст-заполнитель |
| `required` | bool | Показывает значок обязательного поля при `true` |

::: tip
Компонент `x-lingua::editor` - отличная отправная точка для любой Livewire-формы, которой нужно поле rich text. Опубликуйте представление компонента для кастомизации панели инструментов или стилей.
:::
