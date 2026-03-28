# Хранение переводов

Понимание того, как хранятся переводы, поможет вам правильно выполнять запросы, импорт и экспорт.

## Таблица `language_lines`

Каждая строка в `language_lines` представляет одну переводимую **строку** — а не одну локаль. Все значения локалей хранятся вместе в едином JSON-столбце `text`:

```
group      | key        | type | text
-----------|------------|------|---------------------------------------------------
validation | required   | text | {"en":"The :attribute field is required.","fr":"Le champ :attribute est obligatoire."}
auth       | failed     | text | {"en":"These credentials do not match.","it":"Le credenziali non corrispondono."}
single     | Welcome    | text | {"en":"Welcome","fr":"Bienvenue","de":"Willkommen"}
emails     | subject    | html | {"en":"<b>Welcome</b> to our platform!"}
```

### Преимущества такого дизайна

- **Одна строка на строку перевода** — не нужно управлять строками для каждой локали
- **Добавление локали не разрушает данные** — просто добавляется новый ключ в JSON-объект
- **Непереведённые строки очевидны** — если `fr` отсутствует в JSON, значит строка ещё не переведена
- **Один запрос** — один `SELECT` получает значения для всех локалей по ключу

### Прямые запросы

Вы можете запрашивать `language_lines`, используя стандартный синтаксис Eloquent для JSON-столбцов:

```php
use Rivalex\Lingua\Models\Translation;

// Все переводы с французским значением
Translation::whereNotNull('text->fr')->get();

// Только непереведённые на французский
Translation::whereNull('text->fr')->get();

// Найти конкретный ключ
Translation::where('key', 'required')->where('group', 'validation')->first();

// Все строки в группе
Translation::where('group', 'auth')->get();
```

## Типы переводов

Каждая строка перевода имеет `type`, который определяет редактор в интерфейсе:

| Тип | Применение | Автоопределение при синхронизации |
|---|---|---|
| `text` | Простые метки, сообщения, текст кнопок | По умолчанию |
| `html` | Контент с HTML-тегами | Строка содержит HTML-элементы |
| `markdown` | Контент в формате Markdown | Строка парсится как Markdown |

Определение типа выполняется при `lingua:sync-to-database`. Вы можете изменить тип в любой момент через модальное окно редактирования в интерфейсе.

### Пример: HTML-перевод

```php
Translation::create([
    'group' => 'marketing',
    'key'   => 'hero_subtitle',
    'type'  => 'html',
    'text'  => ['en' => '<strong>Build faster</strong> with fewer tools.'],
]);
```

### Пример: Markdown-перевод

```php
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_body',
    'type'  => 'markdown',
    'text'  => ['en' => "# Welcome!\n\nThank you for signing up.\n\n**Your account is now active.**"],
]);
```

## Ключи переводов

Lingua использует ту же двухчастную конвенцию `group.key`, что и стандартные переводы Laravel:

| Формат | Пример | Вызов `trans()` |
|---|---|---|
| Ключ PHP-файла | `auth.failed` | `__('auth.failed')` |
| JSON / одиночный ключ | `Welcome` | `__('Welcome')` |
| Ключ пакета (vendor) | `spatie::messages.error` | через пространство имён пакета |

::: tip group vs. key
Столбец `group` соответствует имени файла (`auth` = `lang/en/auth.php`), а `key` — ключу массива в этом файле. Для JSON-файлов группа равна `'single'`.
:::

## Переводы пакетов (vendor)

Переводы пакетов помечены флагом `is_vendor = true` и имеют строку `vendor` (например, `'spatie'`, `'laravel'`). Они синхронизируются из директорий `lang/vendor/{vendor}/{locale}/`.

- Их **можно редактировать** в интерфейсе (для переопределения формулировок пакета)
- Их **нельзя удалить** — попытка удаления вызывает событие `vendor_translation_protected`
- Поля `group` и `key` **заблокированы** в модальном окне обновления

Подробности см. в разделе [Переводы пакетов](/ru/features/vendor-translations).
