# Переключатель языков

Компонент `<livewire:lingua::language-selector>` - встраиваемый переключатель локалей для конечных пользователей, полностью отдельный от административного интерфейса управления.

## Базовое использование

```blade
<livewire:lingua::language-selector />
```

Добавьте его в любое место ваших Blade-layout-ов. Он отображается в режиме, настроенном в `config/lingua.php` (по умолчанию `sidebar`).

## Режимы отображения

### Режим Sidebar (по умолчанию)

Отображается как сгруппированный раздел навигации - идеально для боковых панелей приложений, построенных с Flux.

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/screenshots/selector-sidebar.png" alt="Переключатель языков в режиме sidebar" caption="Режим sidebar - показывает все установленные языки как пункты навигации." width="320px" :center="true"/>

### Режим Dropdown

Отображается как компактная кнопка с выпадающим списком - идеально для заголовков и навигационных панелей.

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/screenshots/selector-dropdown.png" alt="Переключатель языков в режиме dropdown" caption="Режим dropdown - показывает текущий язык с иконкой флага." width="320px" :center="true"/>

### Режим Modal

Отображается как кнопка, открывающая полноценное модальное окно выбора языка - идеально для заметного переключения локали на лендингах или в onboarding-потоках.

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/screenshots/selector-modal.png" alt="Переключатель языков в режиме modal" caption="Режим modal - полноэкранное наложение выбора языка."/>

## Справочник пропсов

| Проп | Тип | По умолчанию | Описание |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'` или `'modal'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | Показывать иконки флагов стран |

```blade
{{-- Переопределить режим для конкретного экземпляра --}}
<livewire:lingua::language-selector mode="dropdown" :show-flags="false" />
```

## Как работает переключение локали

Когда пользователь нажимает на язык, компонент вызывает `changeLocale($locale)`:

1. Проверяет, что локаль существует в таблице `languages` (тихо игнорирует неизвестные локали)
2. Сохраняет код локали в сессии под ключом `config('lingua.session_variable')`
3. Вызывает `app()->setLocale($locale)` для текущего запроса
4. Перенаправляет на текущий URL (вызывает полную перезагрузку страницы, чтобы новая локаль применилась везде)

При следующем запросе `LinguaMiddleware` читает сессию и применяет локаль до выполнения ваших контроллеров.

## Иконки флагов

Иконки флагов работают на основе пакета [`outhebox/blade-flags`](https://github.com/MohmmedAshraf/blade-flags), который устанавливается автоматически как зависимость Lingua.

Флаги сопоставляются по региональному коду языка (например, `en_US` → 🇺🇸, `fr_FR` → 🇫🇷). Если региональный код не установлен, компонент флага корректно откатывается к отображению двухбуквенного кода.

Отключить флаги глобально:

```php
// config/lingua.php
'selector' => ['show_flags' => false],
```

Или для конкретного экземпляра:

```blade
<livewire:lingua::language-selector :show-flags="false" />
```

## Кастомизация представлений переключателя

Опубликуйте представления для переопределения разметки:

```bash
php artisan vendor:publish --tag="lingua-views"
```

Шаблоны переключателя находятся в:

```
resources/views/vendor/lingua/livewire/
├── language-selector.blade.php
└── selector/
    ├── sidebar.blade.php
    ├── dropdown.blade.php
    └── modal.blade.php
```

::: tip Интеграция с вашей навигацией
Если вы используете компоненты sidebar или navbar из Flux, режим `sidebar` естественно встраивается в `<flux:navlist>` или `<flux:sidebar>`. Опубликуйте представление и адаптируйте разметку под свою структуру навигации.
:::

## Обновление переключателя после изменений

Переключатель слушает событие Livewire `refreshLanguages`. Если вы добавляете или удаляете язык из интерфейса управления (или программно), переключатель автоматически перерисовывается без перезагрузки страницы.

```js
// Диспатч из любого компонента Livewire или кода Alpine.js:
this.$dispatch('refreshLanguages')
```
