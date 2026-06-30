# Blade-компоненты

Lingua регистрирует анонимные Blade-компоненты под префиксом `lingua::`. Они используются
внутренне в Livewire-представлениях и могут быть переиспользованы в ваших шаблонах.

## `<x-lingua::nav>` <Badge type="tip" text="Новое в 2.0" />

Общая панель навигации, отображаемая на всех пяти страницах Lingua.

```blade
<x-lingua::nav :current="'languages'" />
```

| Пропс | Тип | Описание |
|---|---|---|
| `current` | string | Активная страница: `languages`, `translations`, `statistics`, `transfer`, `settings` |

Переключается через `nav.enabled` в конфиге или через UI настроек.

---

## `<x-lingua::select>` <Badge type="tip" text="Новое в 2.0" />

Компонент выбора на **нативном Popover API** браузера. Заменяет Flux dropdown для
устранения конфликтов `transform` + `overflow` диалогов Flux.

```blade
<x-lingua::select
    wire:model="locale"
    :options="$languages"
    placeholder="Select language…"
/>
```

| Пропс | Тип | Описание |
|---|---|---|
| `wire:model` | — | Привязка к свойству Livewire |
| `options` | Collection | Коллекция моделей `Language` |
| `placeholder` | string | Текст при отсутствии выбора |

Popover открывается через `showPopover()` / `hidePopover()` — рендерится в верхний слой
браузера вне любого `overflow: hidden` или `transform` предка.

---

## `<x-lingua::stat>` <Badge type="tip" text="Новое в 2.0" />

Компонент KPI-карточки для страницы Statistics.

```blade
<x-lingua::stat label="Total Languages" :value="$count" icon="globe" />
```

| Пропс | Тип | Описание |
|---|---|---|
| `label` | string | Метка метрики |
| `value` | int\|string | Отображаемое значение |
| `icon` | string | Иконка Flux |

---

## `<x-lingua::card>` и `<x-lingua::card.row>` <Badge type="tip" text="Новое в 2.0" />

Контейнер настроек и его строка.

```blade
<x-lingua::card title="Storage">
    <x-lingua::card.row label="Driver" :value="$driver" />
</x-lingua::card>
```

---

## `<x-lingua::branding>` <Badge type="tip" text="Новое в 2.0" />

Логотип и брендинг Lingua для использования в layout-ах.

```blade
<x-lingua::branding />
```

---

## `<x-lingua::validation-errors>` <Badge type="tip" text="Новое в 2.0" />

Отображает ошибки валидации Livewire в унифицированном формате.

```blade
<x-lingua::validation-errors :errors="$errors" />
```

---

## `<x-lingua::editor>`

Полиморфный редактор: `<textarea>`, TipTap HTML или TipTap Markdown на основе `type`.

```blade
<x-lingua::editor wire:model="value" type="text" placeholder="Enter text…" />
<x-lingua::editor wire:model="value" type="html" label="Body" :required="true" />
<x-lingua::editor wire:model="value" type="markdown" placeholder="Write in Markdown…" />
```

| Пропс | Тип | По умолчанию | Описание |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'` или `'markdown'` |
| `label` | string | `''` | Метка над редактором |
| `placeholder` | string | `''` | Текст-заполнитель |
| `required` | bool | `false` | Значок обязательного поля |

---

## `<x-lingua::clipboard>`

Обёртка с кнопкой копирования в буфер обмена.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

| Пропс | Тип | Описание |
|---|---|---|
| `text-to-copy` | string | Текст для копирования |
| `show-tooltip` | bool | Показывать всплывающую подсказку |

---

## `<x-lingua::language-flag>`

Иконка флага и название языка для локали.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

SVG-флаги поставляются внутри пакета через маршрут `lingua.assets` — без CDN.

---

## `<x-lingua::message>`

Транзитное сообщение, отображающееся после события Livewire.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

| Пропс | Тип | По умолчанию | Описание |
|---|---|---|---|
| `on` | string | — | Имя события Livewire |
| `delay` | int | `1500` | Время видимости (мс) |

---

## `<x-lingua::autocomplete>`

Текстовый ввод с автодополнением для формы создания переводов.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="e.g. marketing"
/>
```

---

## `<x-lingua::menu-group>`

Группа навигации для боковых меню.

```blade
<x-lingua::menu-group heading="Languages">
    {{-- пункты меню --}}
</x-lingua::menu-group>
```

---

## Кастомизация компонентов

```bash
php artisan vendor:publish --tag="lingua-views"
```

Представления публикуются в `resources/views/vendor/lingua/components/`. Laravel
автоматически использует опубликованные версии.
