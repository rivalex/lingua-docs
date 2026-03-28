# Blade-компоненты

Lingua регистрирует несколько анонимных Blade-компонентов под префиксом `lingua::`. Они используются внутренне в Livewire-представлениях и могут быть переиспользованы в ваших собственных шаблонах.

## `<x-lingua::editor>`

Полиморфный компонент редактора, который отображает `<textarea>`, HTML-редактор TipTap или Markdown-редактор TipTap в зависимости от пропа `type`.

```blade
{{-- Простой текст --}}
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

### Пропсы

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'` или `'markdown'` |
| `label` | string | `''` | Опциональная метка над полем |
| `placeholder` | string | `''` | Текст-заполнитель |
| `required` | bool | `false` | Показывает значок обязательного поля |
| `wire:model` | — | — | Привязка к модели Livewire |

---

## `<x-lingua::clipboard>`

Обёртка, добавляющая кнопку копирования в буфер обмена вокруг содержимого слота.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

Нажатие на компонент копирует `text-to-copy` в буфер обмена и ненадолго показывает галочку.

### Пропсы

| Проп | Тип | Описание |
|---|---|---|
| `text-to-copy` | string | Текст для копирования в буфер обмена |
| `show-tooltip` | bool | Показывать всплывающую подсказку при наведении (по умолчанию: `false`) |

---

## `<x-lingua::language-flag>`

Отображает иконку флага и название языка для данной локали.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

### Пропсы

| Проп | Тип | Описание |
|---|---|---|
| `name` | string | Английское название языка |
| `code` | string | Код локали для поиска флага |
| `description` | string | Нативное название языка (подзаголовок) |

Использует `outhebox/blade-flags` для SVG-флагов. Если флаг для кода недоступен, корректно откатывается к отображению текста кода.

---

## `<x-lingua::message>`

Транзитный компонент сообщения, который отображается в течение короткого времени после события Livewire.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

### Пропсы

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `on` | string | — | Имя события Livewire для прослушивания |
| `delay` | int | `1500` | Время в миллисекундах до скрытия |

---

## `<x-lingua::autocomplete>`

Компонент текстового ввода с автодополнением, используемый в форме создания переводов.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="e.g. marketing"
/>
```

### Пропсы

| Проп | Тип | Описание |
|---|---|---|
| `wire:model` | — | Привязка к модели Livewire |
| `suggestions` | array | Массив предложений для автодополнения |
| `placeholder` | string | Заполнитель поля ввода |

---

## `<x-lingua::menu-group>`

Компонент группы навигации для боковых меню.

```blade
<x-lingua::menu-group heading="Languages">
    {{-- слот с пунктами меню --}}
</x-lingua::menu-group>
```

### Пропсы

| Проп | Тип | Описание |
|---|---|---|
| `heading` | string | Текст заголовка группы |

---

## Кастомизация компонентов

Опубликуйте все представления компонентов для их переопределения:

```bash
php artisan vendor:publish --tag="lingua-views"
```

Опубликованные представления находятся в `resources/views/vendor/lingua/components/`. Laravel автоматически использует вашу опубликованную версию.
