# Конфигурация

После установки `config/lingua.php` является единственным источником истины для всех настроек Lingua.

```php
// config/lingua.php

return [

    /*
    |--------------------------------------------------------------------------
    | Language Files Directory
    |--------------------------------------------------------------------------
    | The path where local PHP/JSON translation files are stored.
    | Used by lingua:sync-to-database and lingua:sync-to-local.
    */
    'lang_dir' => lang_path(),

    /*
    |--------------------------------------------------------------------------
    | Default Locale
    |--------------------------------------------------------------------------
    | The fallback locale code used during installation and when the database
    | has no default language configured.
    */
    'default_locale' => config('app.locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Fallback Locale
    |--------------------------------------------------------------------------
    | When a translation is missing in the active locale, Laravel will try
    | this locale next.
    */
    'fallback_locale' => config('app.fallback_locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Route Middleware
    |--------------------------------------------------------------------------
    | Middleware applied to all Lingua management routes.
    | Add 'auth' (and role/permission guards) before going to production.
    */
    'middleware' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Route Prefix
    |--------------------------------------------------------------------------
    | URL prefix for Lingua's management pages.
    | Default: /lingua/languages and /lingua/translations
    */
    'routes_prefix' => 'lingua',

    /*
    |--------------------------------------------------------------------------
    | Session Variable
    |--------------------------------------------------------------------------
    | The session key used to persist the user's active locale across requests.
    */
    'session_variable' => 'locale',

    /*
    |--------------------------------------------------------------------------
    | Language Selector
    |--------------------------------------------------------------------------
    | Controls the default behaviour of the <livewire:lingua::language-selector>
    | component. Both options can be overridden per-instance via props.
    */
    'selector' => [
        'mode'       => 'sidebar',   // 'sidebar' | 'modal' | 'dropdown'
        'show_flags' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Rich-text Editor Toolbar
    |--------------------------------------------------------------------------
    | Defines which formatting options are available in the TipTap editor
    | for HTML and Markdown translation types.
    */
    'editor' => [
        'headings'      => false,
        'bold'          => true,
        'italic'        => true,
        'underline'     => true,
        'strikethrough' => false,
        'bullet'        => true,
        'ordered'       => true,
        'clear'         => true,
    ],

];
```

---

## Справочник параметров

### `lang_dir`

**По умолчанию:** `lang_path()` (соответствует `{корень_проекта}/lang/`)

Директория, из которой Lingua читает файлы при синхронизации в базу данных и в которую записывает при экспорте обратно в файлы. Измените это значение, если ваши файлы переводов находятся в нестандартном месте.

### `default_locale`

**По умолчанию:** `config('app.locale', 'en')`

Используется как запасной вариант при установке и когда таблица `languages` пуста. После установки авторитетным значением по умолчанию является строка в таблице `languages` с `is_default = true`.

### `fallback_locale`

**По умолчанию:** `config('app.fallback_locale', 'en')`

Стандартное поведение Laravel — когда ключ отсутствует в активной локали, следующей проверяется эта локаль.

### `middleware`

**По умолчанию:** `['web']`

::: danger Требование для продакшна
Всегда добавляйте как минимум `'auth'` перед деплоем. Без этого любой, кто знает URL, может изменить ваши переводы.
:::

```php
// Типичная настройка для продакшна
'middleware' => ['web', 'auth'],

// С Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// С кастомной политикой Gate
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `routes_prefix`

**По умолчанию:** `'lingua'`

Изменяет префикс URL для всех страниц управления Lingua:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
// → /admin/translations/translations
```

### `session_variable`

**По умолчанию:** `'locale'`

Ключ сессии, в котором Lingua хранит выбранную пользователем локаль. Измените, если это конфликтует с другим пакетом.

### `selector.mode`

**По умолчанию:** `'sidebar'`

Управляет режимом отображения компонента `<livewire:lingua::language-selector>` по умолчанию:

| Значение | Описание |
|---|---|
| `sidebar` | Отображается как сгруппированный элемент навигации в сайдбаре |
| `dropdown` | Отображается как компактная кнопка с выпадающим списком |
| `modal` | Отображается как кнопка, открывающая модальное окно выбора локали |

### `selector.show_flags`

**По умолчанию:** `true`

Показывать ли иконки флагов стран рядом с названиями языков в переключателе. Требует пакет `outhebox/blade-flags` (устанавливается автоматически как зависимость).

### `editor`

Управляет панелью инструментов TipTap для типов переводов HTML и Markdown. Каждый параметр соответствует расширению TipTap:

| Ключ | Описание |
|---|---|
| `headings` | Кнопки заголовков H1–H3 |
| `bold` | **Жирный** |
| `italic` | *Курсив* |
| `underline` | Подчёркивание |
| `strikethrough` | ~~Зачёркивание~~ |
| `bullet` | Маркированный список |
| `ordered` | Нумерованный список |
| `clear` | Кнопка очистки форматирования |

::: tip
Панель инструментов редактора глобальна — все поля переводов HTML/Markdown используют одну и ту же конфигурацию. Если вам нужен контроль на уровне отдельного поля, опубликуйте представления и настройте компонент редактора напрямую.
:::
