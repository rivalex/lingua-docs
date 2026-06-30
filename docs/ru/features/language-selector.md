# Переключатель языков

Переключатель языков позволяет посетителям выбирать языковые настройки. Lingua
предоставляет единый Livewire-компонент с четырьмя режимами отображения и
Blade-компонент `x-lingua::select` на нативном Popover API.

## Базовое использование

```blade
<livewire:lingua::language-selector />
```

Отображает переключатель в режиме `sidebar` по умолчанию.

## Режимы отображения

### Sidebar (по умолчанию)

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

Отрисовывает список языков, разделённых по `<flux:menu.group>`. Идеально для боковых навигационных панелей Flux.

### Dropdown

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

Компактная кнопка, показывающая текущую локаль, с выпадающим меню. Подходит для верхних навигационных панелей.

### Modal

```blade
<livewire:lingua::language-selector mode="modal" />
```

Кнопка, открывающая полноэкранное модальное окно со списком языков и поиском. Хорошо работает при большом количестве языков.

### Headless

```blade
<livewire:lingua::language-selector mode="headless" />
```

Не отрисовывает UI — только предоставляет данные. Используйте для полностью кастомного дизайна.

## Справочник пропсов

| Пропс | Тип | По умолчанию | Описание |
|---|---|---|---|
| `mode` | string | `config('lingua.selector.mode')` | Режим: `sidebar`, `dropdown`, `modal`, `headless` |
| `show-flags` | bool | `config('lingua.selector.show_flags')` | Показывать иконки флагов |

```blade
<livewire:lingua::language-selector mode="dropdown" :show-flags="false" />
```

## Как работает переключение локали

При выборе языка Lingua:

1. Сохраняет код локали в сессии (`session()->put('locale', $code)`)
2. **Перезагружает текущую страницу** (не редиректит на главную)

URI текущей страницы извлекается через `ManagesLocale::getRequestUri()` и
проверяется **regex-guard на локальный путь** — абсолютные URL как цель не допускаются.
См. [Безопасность — Защита от открытых редиректов](/ru/guide/security#open-redirect-protection).

## Компонент `x-lingua::select`

<Badge type="tip" text="Новое в 2.0" /> Для UI переключателя используется
`x-lingua::select` — Blade-компонент, построенный на **нативном Popover API** браузера:

```blade
<x-lingua::select
    wire:model="locale"
    :options="$languages"
    placeholder="Select language…"
/>
```

Popover открывается через `showPopover()` и закрывается через `hidePopover()`. Это
устраняет конфликты `transform` + `overflow` диалогов Flux без необходимости в teleport.

### Нативный Popover API

Элемент `[popover="manual"]` рендерится в **верхний слой** браузера, выходя за пределы
любого `overflow: hidden` или `transform` предка. Не требуется ни teleport, ни портал.

## Иконки флагов

Иконки флагов — SVG, поставляемые вместе с пакетом через маршрут `lingua.assets`.
Никаких CDN или внешних ресурсов не нужно.

Отключить глобально:

```php
// config/lingua.php
'selector' => ['show_flags' => false],
```

## Кастомизация представлений

```bash
php artisan vendor:publish --tag="lingua-views"
```

Опубликованные представления — `resources/views/vendor/lingua/`. Laravel автоматически использует их вместо стандартных.

## Обновление переключателя

После программной смены локали диспатчите событие для синхронизации переключателя:

```php
$this->dispatch('locale-changed');
```

## Headless-режим со слотами и CSS-targeting API

```blade
<livewire:lingua::language-selector mode="headless">
    <x-slot:item="language">
        <span class="px-3 py-1 rounded-full">{{ $language->native }}</span>
    </x-slot>
</livewire:lingua::language-selector>
```

Компонент предоставляет атрибуты `data-lingua-*` для CSS/JS таргетинга:

| Атрибут | Элемент |
|---|---|
| `data-lingua-selector` | Корневой `<nav>` |
| `data-lingua-list` | `<ul>` список языков |
| `data-lingua-item` | Каждый `<li>` |
| `data-lingua-active` | `<li>` активного языка |
| `data-lingua-button` | `<button>` внутри `<li>` |
| `data-lingua-native` | `<span>` нативного названия |
| `data-lingua-code` | `<span>` ISO-кода |
