# Обновление с 1.x до 2.0

Lingua 2.0 — мажорный релиз. Это руководство проведёт вас через миграцию шаг за шагом, перечислит все критические изменения и ответит на наиболее частые вопросы.

## Почему это мажорный релиз

- **Удалены внешние зависимости.** `spatie/laravel-translation-loader`
  и `laravel-lang/common` больше не используются. Метаданные локалей и набор переводов
  теперь поставляются внутри пакета.
- **Добавлены драйверы хранилища.** Выберите `database` (поведение 1.x) или
  `file`. См. [Драйверы хранилища](/ru/guide/storage).
- **Комплексное укрепление безопасности.** Безопасность по умолчанию, плюс комплекс мер F1–F9.
  См. [Безопасность](/ru/guide/security).
- **Минимальная версия PHP повышена** до 8.3+.

## Пошаговая миграция

### 1. Обновление пакета

```bash
composer update rivalex/lingua
```

Composer автоматически удаляет `spatie/laravel-translation-loader`. Если в вашем
`composer.json` указан `laravel-lang/common`:

```bash
composer remove laravel-lang/common
```

### 2. Повторная публикация и слияние конфигурации

```bash
php artisan vendor:publish --tag=lingua-config --force
```

Затем слейте новые ключи в вашу существующую конфигурацию: `gate`,
`storage.driver`, `nav.enabled`, `navigate`, `routes_extra_parameters`,
`layout`, `links.translations`, `ui.sticky_top`, `cache.store`,
`cache.prefix`, `suppress_pro_nudge`, `pro_upgrade_url`,
`extensions.enabled`. См. [Конфигурация](/ru/guide/configuration).

### 3. Установка драйвера хранилища

```env
LINGUA_STORAGE_DRIVER=database
```

```bash
php artisan config:clear
```

`database` идентичен поведению 1.x.

### 4. Миграции

Миграции теперь разделены на **три** файла. Если вы обновились с 1.x и миграции уже
были запущены, **новая миграция не нужна** — ваши таблицы уже существуют. Проверьте
расхождения схемы только если вы ранее публиковали и кастомизировали объединённую миграцию.

### 5. Кастомные загрузчики переводов

```php
// До
use Spatie\TranslationLoader\TranslationLoaders\TranslationLoader;

// После
use Rivalex\Lingua\Contracts\TranslationLoader;
```

Сигнатура не изменилась:
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### 6. Кастомная модель Translation

```php
// До
class Translation extends \Spatie\TranslationLoader\LanguageLine {}

// После
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $table = 'language_lines';

    public static function getTranslationsForGroup(string $locale, string $group): array
    {
        // …
    }
}
```

### 7. Типизация

```php
// До
use Spatie\TranslationLoader\TranslationLoaderManager;

// После
use Rivalex\Lingua\TranslationManager\LinguaManager;
```

### 8. Авторы пакетов (Testbench)

Удалите провайдер Spatie из `getPackageProviders()`:

```php
// Удалите эту строку
Spatie\TranslationLoader\TranslationServiceProvider::class,
```

## Справочник критических изменений

| Изменение | Подробности |
|---|---|
| Тип возврата `Lingua::info()` <Badge type="warning" text="Критическое" /> | Теперь возвращает `?LocaleInfo`; возвращает `null` для неизвестных локалей (раньше выбрасывал исключение). Используйте `if ($info === null)`. Имена полей отличаются от старого `LaravelLang\LocaleData`. |
| `addLanguage()` / `removeLanguage()` <Badge type="warning" text="Критическое" /> | Больше не вызывают `lang:add` / `lang:rm`. Только нативная работа с БД — без записи файлов. |
| Middleware по умолчанию <Badge type="warning" text="Критическое" /> | `['web', 'auth']` (раньше `['web']`). |
| Значение `navigate` по умолчанию <Badge type="warning" text="Критическое" /> | `false` (раньше `true`). |
| Минимальная версия PHP <Badge type="warning" text="Критическое" /> | 8.3+ (раньше 8.2+). |
| `Language::scopeActive()` <Badge type="warning" text="Критическое" /> | Переименован в `scopeOrdered()` (делегат сохранён для совместимости). |
| `Translation::forgetTranslation()` <Badge type="warning" text="Критическое" /> | Выбрасывает `VendorTranslationProtectedException` для вендорных строк. |
| `Import $errors` <Badge type="warning" text="Критическое" /> | Переименован в `$rowErrors`. |
| `optimize()` <Badge type="warning" text="Критическое" /> | Устарел — удалите все вызовы. |
| Nullable-столбцы | `language_lines.text` и `languages.regional` теперь nullable. |
| Миграции | Разделены на 3 файла (раньше 1 объединённый). |
| Тег `lingua-assets` | Удалён — ресурсы обслуживаются через маршрут `lingua.assets`. |

## Краткий чеклист

- [ ] `composer update rivalex/lingua`
- [ ] Удалите `laravel-lang/common` из `composer.json`, если он там есть
- [ ] Повторно опубликуйте конфигурацию и слейте новые ключи
- [ ] Установите `LINGUA_STORAGE_DRIVER=database` и выполните `php artisan config:clear`
- [ ] Обновите кастомные загрузчики / модели / типизацию (Spatie → Lingua)
- [ ] Замените использование `Lingua::info()` с проверкой `null`
- [ ] Удалите вызовы `optimize()`
- [ ] Переименуйте обращения к `Import::$errors` на `$rowErrors`
- [ ] Убедитесь, что middleware/gate соответствует вашей политике доступа

## Часто задаваемые вопросы

**Будут ли потеряны мои переводы?**
Нет. С драйвером `database` поведение и данные идентичны 1.x. Существующие строки `language_lines` не затрагиваются.

**Нужно ли перезапускать миграции?**
Нет, если они уже были запущены в 1.x. Таблицы уже существуют; разделение на 3 файла влияет только на свежие установки.

**Можно ли по-прежнему использовать файловое хранилище?**
Да — это новый драйвер `file`. Переключайтесь в любое время с помощью
`php artisan lingua:storage file`. См.
[Драйверы хранилища](/ru/guide/storage).

**Flux по-прежнему требуется?**
Да. Lingua 2.0 требует `livewire/flux ^2.12`. Flux **не** был удалён.
