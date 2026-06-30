# Принцип работы

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
│       LinguaManager         │  расширяет Illuminate FileLoader
│  Переводы из БД накладывают  │  БД всегда побеждает при совпадении
│  файловые переводы (DB mode) │  (file mode = обычный FileLoader)
└───┬─────────────────────────┘
    │
    ▼
Translated string returned
```

## Загрузка переводов

`LinguaManager` расширяет собственный
`Illuminate\Translation\FileLoader` Laravel — зависимость от Spatie **отсутствует**.
Регистрация выполняется путём декорирования привязки загрузчика фреймворка:

```php
$app->extend('translation.loader', function ($original, $app) {
    return new LinguaManager($app, $original);
});
```

В **режиме database** для каждой пары `(locale, group)` загружаются файловые переводы
через оригинальный загрузчик, затем поверх них накладываются значения из базы данных
с помощью `array_replace_recursive`. **Значение из базы данных всегда побеждает** при
совпадении, поэтому можно переопределить любую строку из вендорного пакета или файла
без изменения исходных файлов.

Если таблица `language_lines` ещё не существует (например, до запуска миграций),
`QueryException` перехватывается и `LinguaManager` корректно переходит в режим только файлов.

В **режиме file** `LinguaManager` работает как стандартный `FileLoader` —
запросов к базе данных не выполняется. См. [Драйверы хранилища](/ru/guide/storage).

## Middleware

`LinguaMiddleware` автоматически добавляется в группу middleware `web` при загрузке
через `LinguaServiceProvider`. Он выполняется при каждом web-запросе:

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

`LinguaServiceProvider` при загрузке выполняет следующее:

1. **Регистрирует анонимные Blade-компоненты** под префиксом `lingua::`
2. **Регистрирует Livewire-компоненты** в пространстве имён `lingua::`
3. **Декорирует привязку `translation.loader`** через `$app->extend(...)`,
   оборачивая загрузчик Laravel в `LinguaManager`

Поскольку провайдер *декорирует*, а не *заменяет* основной загрузчик,
он чисто компонуется с `TranslationServiceProvider` Laravel. Порядок автозагрузки
Composer обрабатывает порядок загрузки автоматически.

## Схема базы данных

Используются три таблицы (драйвер `file` не использует `language_lines`):

### `languages`

| Столбец | Тип | Примечания |
|---|---|---|
| `id` | bigint | Первичный ключ |
| `code` | string | Код ISO 639-1 (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Полный региональный код (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` или `'standard'` |
| `name` | string | Английское отображаемое название (`French`) |
| `native` | string | Нативное название (`Français`) |
| `direction` | string | `'ltr'` или `'rtl'` |
| `is_default` | boolean | Только одна строка должна быть `true` |
| `sort` | integer | Порядок отображения (назначается автоматически) |

### `language_lines`

| Столбец | Тип | Примечания |
|---|---|---|
| `id` | bigint | Первичный ключ |
| `group` | string | Группа переводов (`auth`, `validation`, `single`) |
| `key` | string | Ключ перевода (`failed`, `required`) |
| `text` | json, **nullable** | `{"en": "…", "fr": "…"}` |
| `type` | string | `'text'`, `'html'` или `'markdown'` |
| `is_vendor` | boolean | `true` для строк сторонних пакетов |
| `vendor` | string, nullable | Название пакета (например, `laravel`) |

JSON-столбец `text` хранит **все локали в одной строке**:

- Добавление новой локали не изменяет схему
- Один запрос получает значения для всех локалей по ключу
- Отсутствующие локали просто не имеют ключа в JSON-объекте

### `lingua_settings`

Таблица ключ/значение, поддерживающая UI настроек (например, переключатель общей навигации).

## Встроенный набор данных

Lingua 2.0 поставляет все данные локалей внутри пакета:

- **`LocaleRegistry`** (`Rivalex\Lingua\Locales\LocaleRegistry`) — метаданные
  для 129+ локалей. `Lingua::info($locale)` возвращает readonly-объект значения
  `LocaleInfo` (`->name`, `->native`, `->direction`, `->regional`, `->code`, `->type`)
  или `null` для неизвестных локалей.
- **Встроенные переводы** — 26 локалей × 7 групп, 5902 строки, соответствует
  Laravel **v13.14.0**. `NotificationProjector` выводит строки уведомлений.
  `lingua:add` заполняет данные из этого набора без сетевых вызовов.

## Архитектура кеша

В режиме database Lingua кеширует переводы **точечно** по `(locale, group)`:

- Ключи выглядят как `lingua.trans.{locale}.{group}`
- При сохранении/удалении `Translation` выполняется только `Cache::forget('lingua.trans.{locale}.{group}')`
  для затронутых ключей — нет глобального `cache:clear` ни в одном пути синхронизации
- Стор и префикс настраиваются через `cache.store` / `cache.prefix`

## Модели

| Модель | Таблица | Расширяет |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `Illuminate\Database\Eloquent\Model` |

`Translation` предоставляет `getTranslationsForGroup()`, хелперы синхронизации,
хелперы статистики и `forgetTranslation()` — который выбрасывает
`VendorTranslationProtectedException` для вендорных строк. Скоуп запросов
`scopeOrdered()` заменяет старый `scopeActive()` (делегат сохранён для обратной совместимости).
