# Установка

Lingua поставляется с интерактивным мастером установки, который берёт на себя всё необходимое одной командой. Ниже также описаны шаги ручной установки для тех, кто предпочитает больший контроль.

## Шаг 1 — Установка через Composer

```bash
composer require rivalex/lingua
```

## Шаг 2 — Запуск установщика

```bash
php artisan lingua:install
```

Мастер установки выполнит следующее:

1. Опубликует файл конфигурации в `config/lingua.php`
2. Опубликует миграции базы данных
3. Спросит, нужно ли запустить миграции автоматически
4. Заполнит базу данных языком по умолчанию (английским) и всеми его переводами из Laravel Lang
5. При желании поставит звезду репозиторию на GitHub ⭐

По завершении вы увидите:

```
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua package installed successfully!
```

## Шаг 3 — Доступ к интерфейсу управления

Откройте приложение и перейдите по адресу:

| Страница | URL | Название маршрута |
|---|---|---|
| Языки | `your-app.test/lingua/languages` | `lingua.languages` |
| Переводы | `your-app.test/lingua/translations` | `lingua.translations` |

Всё готово. Lingua работает.

---

## Ручная установка

Если вы предпочитаете публиковать и выполнять каждый шаг отдельно:

```bash
# 1. Публикация конфигурации
php artisan vendor:publish --tag="lingua-config"

# 2. Публикация миграций
php artisan vendor:publish --tag="lingua-migrations"

# 3. Запуск миграций
php artisan migrate

# 4. Заполнение языком по умолчанию и переводами
php artisan db:seed --class="Rivalex\Lingua\Database\Seeders\LinguaSeeder"
```

---

## Защита интерфейса управления

По умолчанию маршруты Lingua используют только middleware `web` — никакой охраны аутентификации не применяется автоматически. **Вы должны добавить собственный middleware** перед выходом в продакшн.

### Через конфигурацию

```php
// config/lingua.php
'middleware' => ['web', 'auth'],
```

### С охраной по ролям/правам (например, Spatie Permission)

```php
'middleware' => ['web', 'auth', 'role:admin'],
// или
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

::: tip
В массив можно добавить любой middleware, принимаемый маршрутизатором Laravel. Изменения вступают в силу немедленно — очистка кеша не требуется.
:::

---

## Чеклист после установки

- [ ] Добавить middleware аутентификации в `config/lingua.php`
- [ ] Добавить компонент выбора языка в ваш layout (см. [Переключатель языков](/ru/features/language-selector))
- [ ] Установить `dir` и `lang` на теге `<html>` (см. [Поддержка RTL/LTR](/ru/features/rtl-support))
- [ ] Добавить дополнительные языки через `php artisan lingua:add {locale}`
- [ ] Настроить панель инструментов редактора в `config/lingua.php`, если вы используете переводы HTML/Markdown
