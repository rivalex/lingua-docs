# Установка

Lingua поставляется с интерактивным мастером установки, который берёт на себя всё необходимое одной командой. Ниже также описаны шаги ручной установки для тех, кто предпочитает больший контроль.

## Шаг 1 — Установка через Composer

```bash
composer require rivalex/lingua
```

Это единственный пакет, который вам нужен. Lingua 2.0 содержит собственные данные локалей и набор переводов, поэтому ничего дополнительного требовать не нужно.

::: tip Обновление с 1.x?
Composer автоматически удаляет старую зависимость `spatie/laravel-translation-loader`.
Если в вашем `composer.json` всё ещё указан `laravel-lang/common`, удалите его:
`composer remove laravel-lang/common`.
См. полное [Руководство по обновлению](/ru/guide/upgrade).
:::

## Шаг 2 — Запуск установщика

```bash
php artisan lingua:install
```

Мастер является интерактивным. Используя
[Laravel Prompts](https://laravel.com/docs/prompts), он предлагает выбрать
**драйвер хранилища** с помощью выбора стрелками:

| Драйвер | Когда выбирать |
|---|---|
| **`database`** *(рекомендуется)* | Нужен полный набор функций: типы HTML/Markdown, статистика, импорт/экспорт, защита от перезаписи вендорных переводов и точечное кеширование. |
| **`file`** | Переводы хранятся в системе контроля версий или работа в read-only/CI среде с обычными файлами `lang/`. |

Затем мастер:

1. Публикует файл конфигурации в `config/lingua.php`
2. Публикует **учитывающие драйвер** миграции (драйвер `file` пропускает миграцию `language_lines`)
3. Спрашивает, нужно ли запустить миграции автоматически
4. Заполняет базу данных языком по умолчанию и его переводами из встроенного набора данных — **без загрузок с GitHub**
5. Опционально ставит звезду репозиторию на GitHub ⭐

По завершении вы увидите:

```
✓ Driver selected          →  database
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua installed successfully!
```

## Шаг 3 — Доступ к UI

Откройте приложение и перейдите по адресу:

| Страница | URL | Название маршрута |
|---|---|---|
| Languages | `your-app.test/lingua/languages` | `lingua.languages` |
| Translations | `your-app.test/lingua/translations` | `lingua.translations` |
| Statistics | `your-app.test/lingua/statistics` | `lingua.statistics` |
| Transfer | `your-app.test/lingua/transfer` | `lingua.transfer` |
| Settings | `your-app.test/lingua/settings` | `lingua.settings` |

Всё готово. Lingua работает.

---

## Ручная установка

Если вы предпочитаете публиковать и выполнять каждый шаг отдельно:

```bash
# 1. Публикация конфигурации
php artisan vendor:publish --tag="lingua-config"

# 2. Публикация миграций (с учётом драйвера)
php artisan vendor:publish --tag="lingua-migrations"

# 3. Запуск миграций
php artisan migrate

# 4. Добавление языка по умолчанию и заполнение его переводами
php artisan lingua:add en
```

См. [Публикация ресурсов](/ru/guide/publishing) для полного списка тегов.

---

## Защита интерфейса управления

<Badge type="tip" text="Новое в 2.0" /> Lingua 2.0 **безопасна по умолчанию**. Маршруты управления поставляются с автоматически применяемым middleware `['web', 'auth']` — анонимные посетители не могут получить доступ к UI.

### Ужесточение доступа с помощью gate

Для доступа на основе ролей определите gate авторизации и укажите его Lingua с помощью переменной окружения `LINGUA_GATE`. Lingua добавляет `can:{gate}` к своим admin-маршрутам:

```env
LINGUA_GATE=manage-translations
```

```php
// app/Providers/AppServiceProvider.php — boot()
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $user) => $user->hasRole('admin'));
```

Также можно напрямую отредактировать массив middleware:

```php
// config/lingua.php
'middleware' => ['web', 'auth', 'role:admin'],
```

::: tip
В массив можно добавить любой middleware, принимаемый маршрутизатором Laravel.
Изменения вступают в силу немедленно — очистка кеша не требуется.
:::

См. [Справочник по безопасности](/ru/guide/security) для полного обзора защитных мер.

---

## Чеклист после установки

- [ ] Убедитесь, что драйвер хранилища в `config/lingua.php` соответствует вашему деплою (`database` или `file`)
- [ ] Опционально установите `LINGUA_GATE` для доступа на основе ролей
- [ ] Добавьте компонент выбора языка в ваш layout (см. [Переключатель языков](/ru/features/language-selector))
- [ ] Установите `dir` и `lang` на теге `<html>` (см. [Поддержка RTL/LTR](/ru/features/rtl-support))
- [ ] Добавьте дополнительные языки через `php artisan lingua:add {locale}`
- [ ] Настройте панель инструментов редактора в `config/lingua.php`, если вы используете переводы HTML/Markdown (database-драйвер)
