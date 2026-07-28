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

## Внешний вид <Badge type="tip" text="Новое" />

Собственная CSS Lingua использует классовый вариант `dark:`, поэтому она
обычно следует за предком `<html class="dark">` в хост-приложении. Если в
вашем хост-приложении нет переключателя тёмной темы (или его состояние не
совпадает с реальной настройкой ОС), стили Lingua могут отрендериться
неоформленными.

Переключатель **Force dark mode** заставляет Lingua всегда отображать
тёмную тему независимо от хост-приложения или цветовой схемы ОС —
удобно при встраивании Lingua в хост без поддержки тёмной темы, либо во
время локальной разработки в системе со светлой темой.

Эквивалентное значение по умолчанию в конфиге:

```php
// config/lingua.php
'dark_mode' => [
    'force' => env('LINGUA_FORCE_DARK_MODE', false),
],
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
LinguaSetting::set(LinguaSetting::KEY_DARK_MODE_FORCE, true);
```

Доступные константы:

| Константа | Ключ | Тип |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |
| `LinguaSetting::KEY_NAV_ENABLED` | `nav.enabled` | `bool` |
| `LinguaSetting::KEY_DARK_MODE_FORCE` | `dark_mode.force` | `bool` |
