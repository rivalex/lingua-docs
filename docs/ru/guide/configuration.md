# Конфигурация

После установки `config/lingua.php` является единственным источником истины для
всех настроек Lingua. На этой странице описан каждый ключ, сгруппированный по назначению.
Ключи, отмеченные <Badge type="tip" text="Новое в 2.0" />, не существовали в 1.x.

## Настройки локали

```php
// config/lingua.php

'lang_dir'         => lang_path(),
'base_translations_path' => null, // ★ Новое в 2.0
'default_locale'   => config('app.locale', 'en'),
'fallback_locale'  => config('app.fallback_locale', 'en'),
'session_variable' => 'locale',
```

### `lang_dir`

**По умолчанию:** `lang_path()` — соответствует `{корень_проекта}/lang/`.

Директория, из которой Lingua читает файлы при синхронизации в базу данных и в которую записывает при экспорте обратно в файлы.

### `base_translations_path` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `null`

Опциональный путь, откуда Lingua читает **встроенный** набор переводов. Оставьте `null`, чтобы использовать набор данных, поставляемый внутри пакета.

### `default_locale`

**По умолчанию:** `config('app.locale', 'en')`

Используется как запасной вариант при установке и когда таблица `languages` пуста. После установки авторитетным значением по умолчанию является строка в таблице `languages` с `is_default = true`.

### `fallback_locale`

**По умолчанию:** `config('app.fallback_locale', 'en')`

Стандартный запасной вариант Laravel — когда ключ отсутствует в активной локали, следующей проверяется эта локаль.

### `session_variable`

**По умолчанию:** `'locale'`

Ключ сессии, в котором Lingua хранит выбранную пользователем локаль.

---

## Безопасность и доступ

```php
'middleware' => ['web', 'auth'],
'gate'       => env('LINGUA_GATE', null), // ★ Новое в 2.0
```

### `middleware`

**По умолчанию:** `['web', 'auth']` <Badge type="warning" text="Изменено в 2.0" />

::: tip Безопасность по умолчанию
В 2.0 по умолчанию используется `['web', 'auth']` — интерфейс управления **не** доступен
публично «из коробки». В 1.x это было `['web']`.
:::

```php
// Со Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// С кастомной политикой Gate
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `gate` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `env('LINGUA_GATE', null)`

Когда установлено, Lingua добавляет `can:{gate}` ко всем admin-маршрутам. Определите gate в сервис-провайдере:

```env
LINGUA_GATE=manage-translations
```

```php
Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

См. [Справочник по безопасности](/ru/guide/security#authentication).

---

## Маршрутизация

```php
'routes_prefix'           => 'lingua',
'routes_extra_parameters' => null,  // ★ Новое в 2.0
'navigate'                => false, // ★ Новое в 2.0 (значение по умолчанию изменено)
'layout'                  => null,  // ★ Новое в 2.0
```

### `routes_prefix`

**По умолчанию:** `'lingua'`

Изменяет URL-префикс для всех страниц управления Lingua:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
```

### `routes_extra_parameters` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `null`

Опциональный параметризованный суффикс, добавляемый к префиксу маршрута — полезен для префиксов с областью видимости тенанта или раздела.

### `navigate` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `false` <Badge type="warning" text="Изменено в 2.0" />

Управляет `wire:navigate` на внутренних ссылках Lingua. По умолчанию теперь `false`
(полная перезагрузка страницы), что избегает крайних случаев SPA-навигации. Включите
с `'navigate' => true`.

### `layout` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `null`

Укажите кастомный Blade-layout для представлений Lingua. Оставьте `null`, чтобы использовать встроенный layout пакета.

---

## Навигация

```php
'nav' => [
    'enabled' => true, // ★ Новое в 2.0
],
'links' => [
    'translations' => [          // ★ Новое в 2.0
        'enabled' => true,
        'route'   => 'lingua.translations',
    ],
],
```

### `nav.enabled` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `true`

Переключает общее меню навигации `x-lingua::nav`, отображаемое на всех пяти страницах Lingua. Также можно переключить через UI настроек.

### `links.translations` <Badge type="tip" text="Новое в 2.0" />

Управляет записью «Translations» в общем навигационном меню: отображается ли она (`enabled`) и на какой маршрут указывает (`route`).

---

## UI

```php
'ui' => [
    'sticky_top' => 0, // ★ Новое в 2.0
],
'selector' => [
    'mode'       => 'sidebar',  // 'sidebar' | 'modal' | 'dropdown' | 'headless'
    'show_flags' => true,
],
'editor' => [
    'headings' => false, 'bold' => true, 'italic' => true,
    'underline' => true, 'strikethrough' => false,
    'subscript' => true, 'superscript' => true,
    'blockquote' => false, 'code-line' => false, 'code-block' => false,
    'bullet' => true, 'ordered' => true, 'clear' => true, 'code-mode' => false,
],
```

### `ui.sticky_top` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `0`

Смещение в пикселях для прилипающих панелей инструментов Lingua. Увеличьте, если в вашем приложении есть фиксированный заголовок, чтобы панели инструментов не уходили под него.

### `selector.mode`

**По умолчанию:** `'sidebar'`

| Значение | Описание |
|---|---|
| `sidebar` | Сгруппированный элемент навигации в сайдбаре |
| `dropdown` | Компактная кнопка с выпадающим списком |
| `modal` | Кнопка, открывающая модальное окно выбора локали |
| `headless` | Без встроенного рендеринга — используйте headless-компонент |

### `selector.show_flags`

**По умолчанию:** `true`

Показывать ли иконки флагов стран рядом с названиями языков.

### `editor`

Управляет панелью инструментов rich-text для типов переводов HTML и Markdown
(только database-драйвер). Каждый ключ переключает одну опцию форматирования:
`headings`, `bold`, `italic`, `underline`, `strikethrough`, `subscript`,
`superscript`, `blockquote`, `code-line`, `code-block`, `bullet`,
`ordered`, `clear`, `code-mode`.

---

## Внешний вид <Badge type="tip" text="Новое" />

```php
'dark_mode' => [
    'force' => env('LINGUA_FORCE_DARK_MODE', false),
],
```

### `dark_mode.force` <Badge type="tip" text="Новое" />

**По умолчанию:** `env('LINGUA_FORCE_DARK_MODE', false)`

Собственная сборка CSS Lingua использует классовый вариант `dark:`
(`&:where(.dark, .dark *)`), поэтому она обычно следует за предком
`<html class="dark">` в хост-приложении — та же конвенция, что и
стандартная стратегия классов Tailwind. Если в вашем хост-приложении нет
классового переключателя тёмной темы (или его состояние не совпадает с
реальной настройкой ОС/браузера), собственные стили Lingua могут
отрендериться неоформленными, хотя остальная часть страницы выглядит
нормально.

Установите `force` в `true`, чтобы Lingua всегда отображала свою тёмную
тему независимо от хост-приложения или цветовой схемы ОС. Полезно при
встраивании Lingua в хост без переключателя тёмной темы, либо во время
локальной разработки в системе со светлой темой. Также переключается «на
лету» из [UI настроек](/ru/features/settings#внешний-вид), который имеет
приоритет над этим значением конфигурации по умолчанию.

```ini
LINGUA_FORCE_DARK_MODE=true
```

---

## Драйвер хранилища <Badge type="tip" text="Новое в 2.0" />

```php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

### `storage.driver`

**По умолчанию:** `env('LINGUA_STORAGE_DRIVER', 'database')`

Определяет, где хранятся переводы:

| Драйвер | Поведение |
|---|---|
| `database` | Полное поведение 1.x: таблица `language_lines`, типы HTML/Markdown, статистика, импорт/экспорт, защита вендорных переводов, точечное кеширование. |
| `file` | Читает/записывает PHP+JSON файлы `lang/` напрямую; без таблицы `language_lines`; типы сводятся к простому тексту. |

Это важная функция — см. [Драйверы хранилища](/ru/guide/storage) для полного сравнения
и команды переключения `lingua:storage`.

---

## Кеш

```php
'cache' => [
    'store'  => env('LINGUA_CACHE_STORE', null),       // ★ Новое в 2.0
    'prefix' => env('LINGUA_CACHE_PREFIX', 'lingua.trans'), // ★ Новое в 2.0
],
```

### `cache.store` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `env('LINGUA_CACHE_STORE', null)`

Какой кеш-стор Lingua использует для кеширования переводов. `null` использует стор вашего приложения по умолчанию.

### `cache.prefix` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `env('LINGUA_CACHE_PREFIX', 'lingua.trans')`

Префикс для ключей кеша. Lingua кеширует переводы **точечно** по `(locale, group)` и
забывает только затронутый ключ при записи — нет глобального `cache:clear`.
См. [Архитектура кеша](/ru/guide/architecture#cache-architecture).

---

## Загрузчики переводов

```php
'translation_loaders' => [
    // Rivalex\Lingua\Loaders\YourCustomLoader::class,
],
'model'               => Rivalex\Lingua\Models\Translation::class,
'translation_manager' => Rivalex\Lingua\TranslationManager\LinguaManager::class,
```

### `translation_loaders`

Регистрирует дополнительные загрузчики, реализующие
`Rivalex\Lingua\Contracts\TranslationLoader`. Сигнатура контракта:
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### `model`

Eloquent-модель, стоящая за `language_lines`. Переопределите, чтобы расширить
`Translation` собственной логикой.

### `translation_manager`

Класс загрузчика переводов. По умолчанию
`Rivalex\Lingua\TranslationManager\LinguaManager`, расширяющий
`Illuminate\Translation\FileLoader`.

---

## Расширения

```php
'extensions' => [
    'enabled' => env('LINGUA_EXTENSIONS_ENABLED', true), // ★ Новое в 2.0
],
'suppress_pro_nudge' => env('LINGUA_SUPPRESS_PRO_NUDGE', false), // ★ Новое в 2.0
'pro_upgrade_url'    => env('LINGUA_PRO_UPGRADE_URL', 'https://lingua.rivalex.dev'), // ★ Новое в 2.0
```

### `extensions.enabled` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `true`

Главный переключатель для опциональных расширений Lingua.

### `suppress_pro_nudge` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `false`

Установите `true`, чтобы скрыть подсказки об обновлении в UI.

### `pro_upgrade_url` <Badge type="tip" text="Новое в 2.0" />

**По умолчанию:** `https://lingua.rivalex.dev`

URL, используемый подсказками об обновлении.
