# Как это работает

Понимание внутренней архитектуры Lingua упрощает настройку, отладку и расширение пакета.

## Жизненный цикл запроса

```
Browser request
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware       │  Читает 'locale' из сессии
│  app()->setLocale($locale)  │  Берёт дефолт из БД при отсутствии
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│        Your Controller      │
│  __('auth.failed')          │  Стандартный хелпер Laravel
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  Custom TranslationLoaderManager
│  1. DB loader (Spatie)      │  БД всегда побеждает при совпадении
│  2. File loader (fallback)  │
└───┬─────────────────────────┘
    │
    ▼
Translated string returned
```

## Загрузка переводов

`LinguaManager` расширяет `TranslationLoaderManager` от Spatie. Во время выполнения он объединяет два источника:

1. **Файловый загрузчик** - читает из `lang/` как обычный Laravel
2. **Database-загрузчик** (Spatie `Db` loader) - читает из `language_lines`

Когда один и тот же ключ существует в обоих источниках, **побеждает значение из базы данных**. Это позволяет переопределить любой перевод из пакета или файла, не трогая исходные файлы.

Если таблица `language_lines` ещё не существует (например, до запуска миграций), `LinguaManager` корректно переходит в режим только файлов.

## Middleware

`LinguaMiddleware` автоматически добавляется в группу middleware `web` при загрузке через `LinguaServiceProvider`. Он выполняется при каждом web-запросе:

```php
// Упрощённая логика
$locale = session()->get(config('lingua.session_variable'))
    ?? Language::default()?->code
    ?? config('app.locale');

app()->setLocale($locale);
app()->setFallbackLocale($defaultLocale);
session()->put(config('lingua.session_variable'), $locale);
```

## Сервис-провайдер

`LinguaServiceProvider` при загрузке выполняет три действия:

1. **Регистрирует анонимные Blade-компоненты** под префиксом `lingua::`
2. **Регистрирует Livewire-компоненты** в пространстве имён `lingua::`
3. **Заменяет синглтоны `translator` и `translation.loader`** в IoC-контейнере кастомными реализациями Lingua

Поскольку сервис-провайдер заменяет привязку основного транслятора, важно, чтобы он загружался *после* `TranslationServiceProvider` Laravel. Порядок автозагрузки Composer обеспечивает это автоматически.

## Схема базы данных

Используются две таблицы:

### `languages`

| Колонка | Тип | Примечания |
|---|---|---|
| `id` | bigint (auto-increment) | Первичный ключ |
| `code` | string | Код ISO 639-1 (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Полный региональный код (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` или `'standard'` |
| `name` | string | Английское отображаемое название (`French`) |
| `native` | string | Нативное название (`Français`) |
| `direction` | string | `'ltr'` или `'rtl'` |
| `is_default` | boolean | Только одна строка должна быть `true` |
| `sort` | integer | Порядок отображения (назначается автоматически) |

### `language_lines` (Spatie)

| Колонка | Тип | Примечания |
|---|---|---|
| `id` | bigint (auto-increment) | Первичный ключ |
| `group` | string | Группа переводов (`auth`, `validation`, `single`) |
| `key` | string | Ключ перевода (`failed`, `required`) |
| `text` | json | `{"en": "…", "fr": "…", "it": "…"}` |
| `type` | string | `'text'`, `'html'` или `'markdown'` |
| `is_vendor` | boolean | `true` для строк сторонних пакетов |
| `vendor` | string, nullable | Название пакета (например, `spatie`, `laravel`) |

JSON-столбец `text` хранит **все локали в одной строке**. Такой дизайн означает:
- Добавление новой локали не изменяет схему
- Один запрос получает значения для всех локалей по ключу
- Отсутствующие локали просто не имеют ключа в JSON-объекте

## Сидер

`LinguaSeeder` вызывается один раз при `lingua:install`. Он:

1. Читает `config('lingua.default_locale')` (по умолчанию `config('app.locale')`)
2. Получает метаданные локали из `laravel-lang/locales`
3. Создаёт запись `Language` с `is_default = true`
4. Вызывает `lingua:add {locale}` для установки языковых файлов
5. Вызывает `lingua:sync-to-database` для импорта всех строк

## Модели

| Модель | Таблица | Расширяет |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | Spatie's `LanguageLine` |

`Translation` наследует методы `setTranslation()` и `forgetTranslation()` от Spatie и добавляет специфичные для Lingua скоупы, методы синхронизации и хелперы статистики.
