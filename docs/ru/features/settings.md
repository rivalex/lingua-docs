# Настройки

Страница Settings (`/lingua/settings`) позволяет изменять поведение UI Lingua прямо
из браузера без редактирования файлов конфигурации и повторного деплоя.

## Как работают настройки

Настройки хранятся в таблице `lingua_settings` как пары ключ/значение. Цепочка приоритетов:

1. Таблица БД `lingua_settings` (наивысший приоритет — задаётся через UI)
2. `config/lingua.php` (опубликованная конфигурация)
3. Значения по умолчанию пакета

Используйте `config/lingua.php` как базовую линию и переопределяйте отдельные настройки для каждой среды через UI.

## Режим переключателя

Управляет тем, как компонент `<livewire:lingua::language-selector />` отображается для конечных пользователей.

| Режим | Описание |
|---|---|
| `sidebar` | Сгруппированный раздел навигации (по умолчанию) |
| `dropdown` | Компактная кнопка с выпадающим меню |
| `modal` | Кнопка, открывающая полноэкранный выбор языка |
| `headless` | Без встроенного рендеринга — UI реализуется вручную |

## Показывать иконки флагов

Включение или отключение SVG-флагов рядом с названиями языков в переключателе. При
отключении показывается только название языка.

## Меню навигации <Badge type="tip" text="Новое в 2.0" />

Переключатель **Navigation menu** показывает или скрывает общую панель навигации
`x-lingua::nav` на всех пяти страницах Lingua. Также управляется через конфиг:

```php
// config/lingua.php
'nav' => ['enabled' => true],
```

## Драйвер хранилища (только чтение)

Отображает текущий активный драйвер (`database` или `file`). Поле только для чтения —
для смены драйвера используйте `php artisan lingua:storage {driver}`. См.
[Драйверы хранилища](/ru/guide/storage).

## Программный доступ

```php
use Rivalex\Lingua\Models\LinguaSetting;

// Чтение с fallback на config()
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

// Запись
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_SHOW_FLAGS, false);
LinguaSetting::set(LinguaSetting::KEY_NAV_ENABLED, false);
```

Доступные константы:

| Константа | Ключ | Тип |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |
| `LinguaSetting::KEY_NAV_ENABLED` | `nav.enabled` | `bool` |
