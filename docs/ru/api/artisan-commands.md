# Artisan-команды

Lingua поставляется с восемью Artisan-командами для управления языками, переводами
и драйвером хранилища.

## Краткий справочник

| Команда | Описание |
|---|---|
| `lingua:install` | Интерактивный мастер первоначальной настройки |
| `lingua:storage {driver}` | Переключить драйвер хранилища (**Новое в 2.0**) |
| `lingua:add {locale}` | Установить язык (БД + встроенные данные) |
| `lingua:remove {locale}` | Удалить язык |
| `lingua:update-lang` | Обновить строки из встроенного набора данных |
| `lingua:sync-to-database` | Импорт `lang/` → БД |
| `lingua:sync-to-local` | Экспорт БД → `lang/` |
| `lingua:uninstall` | Безопасное удаление Lingua (**Новое в 2.0**) |

---

## `lingua:install`

Интерактивный мастер первоначальной настройки. Запускается один раз после `composer require`.

```bash
php artisan lingua:install
```

Выбирает драйвер хранилища с помощью стрелок, публикует конфигурацию, публикует
учитывающие драйвер миграции, опционально запускает миграции и заполняет язык по умолчанию
из встроенного набора данных — без сетевых вызовов.

---

## `lingua:storage {driver}` <Badge type="tip" text="Новое в 2.0" />

Переключает активный драйвер хранилища. Синхронизирует перед переключением, чтобы
ничего не потерялось.

```bash
php artisan lingua:storage database
php artisan lingua:storage file
```

| Флаг | Действие |
|---|---|
| `--force` | Пропустить запросы подтверждения |
| `--write-env` | Обновить `LINGUA_STORAGE_DRIVER` в `.env` |
| `--no-migrate` | Пропустить шаг обеспечения миграции |

**database → file:** Сначала экспортирует БД в `lang/`, предупреждает о строках HTML/Markdown.

**file → database:** Синхронизирует `lang/` в БД, обеспечивает запуск миграции `language_lines`.

---

## `lingua:add {locale}` <Badge type="warning" text="Изменено в 2.0" />

Устанавливает новый язык из встроенного набора данных Lingua.

```bash
php artisan lingua:add fr
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

::: tip Изменено в 2.0
Больше не вызывает `lang:add` и не скачивает файлы. Чисто нативная работа с БД —
строки заполняются из встроенного набора данных (26 локалей × 7 групп, Laravel v13.14.0).
Локали вне встроенного набора можно добавить вручную.
:::

---

## `lingua:remove {locale}`

Удаляет язык из БД.

```bash
php artisan lingua:remove fr
```

::: warning Защита языка по умолчанию
Нельзя удалить язык по умолчанию. Сначала сделайте другой язык основным через UI
или `Lingua::setDefaultLocale('fr')`.
:::

---

## `lingua:update-lang`

Загружает последние строки переводов из встроенного набора данных Lingua для всех
установленных языков, не перезаписывая существующие пользовательские переводы.

```bash
php artisan lingua:update-lang
```

Используйте после выхода новой версии Lingua с обновлённым набором строк.

---

## `lingua:sync-to-database`

Импортирует все PHP/JSON файлы из `lang/` в таблицу `language_lines`.

```bash
php artisan lingua:sync-to-database
```

Использует `updateOrCreate` по `group + key` — существующие правки из UI **сохраняются**.

Типичные сценарии:

```bash
# После свежего клона репозитория
php artisan lingua:sync-to-database

# В скрипте деплоя
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

## `lingua:sync-to-local`

Экспортирует все переводы из БД обратно в `lang/` в формате PHP/JSON.

```bash
php artisan lingua:sync-to-local
```

Типичные сценарии:

```bash
# Перед коммитом в репозиторий
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"
```

---

## `lingua:uninstall` <Badge type="tip" text="Новое в 2.0" />

Безопасно удаляет Lingua: экспортирует БД в `lang/`, затем удаляет таблицы
(`language_lines`, `languages`, `lingua_settings`). Директория `lang/` сохраняется.

```bash
php artisan lingua:uninstall
```

| Флаг | Действие |
|---|---|
| `--force` | Пропустить запросы подтверждения |
| `--keep-config` | Оставить `config/lingua.php` |
| `--keep-published` | Оставить опубликованные представления/миграции |

---

## Советы

::: tip Автоматизация синхронизации в CI/CD
```yaml
# GitHub Actions (пример)
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::

::: tip Добавление нескольких языков
```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::
