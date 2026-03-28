# Artisan-команды

Lingua поставляется с шестью Artisan-командами для управления языками и переводами из терминала.

## Управление языками

### `lingua:add {locale}`

Устанавливает новый язык - скачивает файлы, создаёт запись в БД, синхронизирует переводы.

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**Что делает:**
1. Получает метаданные локали из `laravel-lang/locales`
2. Запускает `lang:add {locale}` для установки языковых файлов
3. Создаёт запись `Language` в базе данных
4. Запускает `lingua:sync-to-database` для импорта новых строк

**Вывод:**
```
Adding language: it...
Installing language files via Laravel Lang...
Creating language record in database...
Syncing translations to database...
Language 'it' added successfully.
```

::: tip
После добавления языка перейдите на `/lingua/translations/it`, чтобы увидеть, какие строки ещё требуют перевода.
:::

---

### `lingua:remove {locale}`

Удаляет язык - удаляет файлы, очищает базу данных, переупорядочивает оставшиеся языки.

```bash
php artisan lingua:remove fr
```

**Что делает:**
1. Проверяет, что язык не является основным (прерывается с ошибкой, если является)
2. Запускает `lang:rm {locale} --force` для удаления языковых файлов
3. Удаляет все значения `{locale}` из `language_lines.text`
4. Удаляет запись `Language`
5. Переупорядочивает значения `sort` для оставшихся языков
6. Запускает `lingua:sync-to-database`

::: warning Защита языка по умолчанию
Нельзя удалить язык по умолчанию. Сначала сделайте другой язык основным:
```bash
php artisan lingua:add fr       # добавить новый основной язык
# затем через интерфейс: установить французский как основной
php artisan lingua:remove en    # теперь можно удалить английский
```
:::

---

### `lingua:update-lang`

Обновляет все установленные языковые файлы через Laravel Lang, затем повторно синхронизирует в базу данных.

```bash
php artisan lingua:update-lang
```

Запускайте после:
- Обновления Laravel (новые сообщения валидации и т.д.)
- Установки нового пакета с переводами
- Обновления пакетов `laravel-lang/*`

---

## Синхронизация переводов

### `lingua:sync-to-database`

Импортирует все локальные PHP/JSON файлы переводов в таблицу `language_lines`.

```bash
php artisan lingua:sync-to-database
```

**Что импортируется:**
- `lang/{locale}/*.php` - PHP-файлы
- `lang/{locale}.json` - JSON-файлы
- `lang/vendor/{package}/{locale}/*.php` - файлы пакетов

Использует `updateOrCreate` с сопоставлением по `group + key`, поэтому существующие правки из интерфейса сохраняются.

**Типичные сценарии:**
```bash
# После свежего клона - заполнить БД из закоммиченных файлов lang
php artisan lingua:sync-to-database

# После lang:update - импортировать новые строки
php artisan lingua:sync-to-database

# В скрипте деплоя
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

### `lingua:sync-to-local`

Экспортирует все переводы из базы данных обратно в локальные PHP/JSON файлы.

```bash
php artisan lingua:sync-to-local
```

**Что экспортируется:**
- Переводы из БД → `lang/{locale}/{group}.php`
- JSON-группа (`single`) → `lang/{locale}.json`
- Переводы пакетов → `lang/vendor/{vendor}/{locale}/{group}.php`

**Типичные сценарии:**
```bash
# Перед коммитом - экспортировать состояние БД в файлы для версионного контроля
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"

# Перед деплоем на сервер, читающий из файлов
php artisan lingua:sync-to-local
```

---

### `lingua:install`

Интерактивный мастер первоначальной настройки. Запускается один раз после `composer require`.

```bash
php artisan lingua:install
```

Не предназначен для повторного запуска после первоначальной настройки. Если нужно повторно опубликовать отдельные ресурсы, используйте теги `vendor:publish`.

---

## Краткий справочник команд

<div class="command-table">

| Команда | Описание |
|---|---|
| `lingua:add {locale}` | Установить язык (файлы + БД + синхронизация) |
| `lingua:remove {locale}` | Удалить язык (файлы + БД + синхронизация) |
| `lingua:update-lang` | Обновить файлы lang через Laravel Lang + синхронизация |
| `lingua:sync-to-database` | Импорт локальных файлов → база данных |
| `lingua:sync-to-local` | Экспорт базы данных → локальные файлы |
| `lingua:install` | Интерактивный мастер первоначальной настройки |

</div>

---

## Советы

::: tip Автоматизация синхронизации в CI/CD
Добавьте синхронизацию в пайплайн деплоя для поддержания актуальности базы данных:

```yaml
# Шаг деплоя GitHub Actions (пример)
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::

::: tip Добавление нескольких языков сразу
Команды массового добавления нет, но можно связать вызовы в цикле оболочки:

```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::

::: tip Проверка того, что будет синхронизировано
Перед запуском `lingua:sync-to-database` можно посмотреть количество файлов и локалей, которые будут обработаны, проверив `lang/`:

```bash
ls lang/
# en  fr  it  vendor
```
:::
