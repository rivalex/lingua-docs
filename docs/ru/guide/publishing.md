# Публикация ресурсов

Lingua поставляется с несколькими группами публикуемых ресурсов, чтобы вы могли переопределить только нужные части.

## Публикация всего сразу

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## Отдельные теги

### `lingua-config`

Публикует файл конфигурации.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Результат:** `config/lingua.php`

Используйте для настройки маршрутов, middleware, режима переключателя, панели инструментов редактора и других параметров.

---

### `lingua-migrations`

Публикует миграции базы данных.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

**Результат:** `database/migrations/YYYY_MM_DD_HHMMSS_create_lingua_table.php`

Используйте, если вам нужно изменить схему `languages` или `language_lines` - например, добавить индексы или изменить типы столбцов. После публикации запустите `php artisan migrate` как обычно.

::: warning
Мастер `lingua:install` публикует и запускает миграции автоматически. Публикуйте вручную только если вам нужно настроить схему до их запуска.
:::

---

### `lingua-translations`

Публикует собственные строки UI-переводов пакета.

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Результат:** `lang/vendor/lingua/{locale}/lingua.php`

Это открывает доступ к каждой метке, заголовку, кнопке и сообщению, используемым в интерфейсе Lingua. Переопределите любую строку, чтобы:
- Перевести интерфейс на язык вашего приложения
- Адаптировать формулировки к стилю вашего проекта (например, «Add language» → «Install locale»)

Опубликованные файлы следуют стандартной структуре переводов vendor в Laravel:

```
lang/
└── vendor/
    └── lingua/
        ├── en/
        │   └── lingua.php
        ├── fr/
        │   └── lingua.php
        └── it/
            └── lingua.php
```

---

### `lingua-views`

Публикует все Blade и Livewire-представления.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Результат:** `resources/views/vendor/lingua/`

Используйте для кастомизации layout-ов, модальных окон или компонента выбора языка. Laravel автоматически использует ваши опубликованные представления вместо стандартных из пакета.

```
resources/views/vendor/lingua/
├── components/
│   ├── autocomplete.blade.php
│   ├── clipboard.blade.php
│   ├── editor.blade.php
│   ├── language-flag.blade.php
│   ├── menu-group.blade.php
│   └── message.blade.php
└── livewire/
    ├── languages.blade.php
    ├── language-selector.blade.php
    ├── translations.blade.php
    └── translation/
        ├── create.blade.php
        ├── delete.blade.php
        ├── row.blade.php
        └── update.blade.php
```

::: tip
Публикуйте только те представления, которые намерены изменить. Неопубликованные представления обслуживаются напрямую из пакета и автоматически получают обновления.
:::

---

### `lingua-assets`

Публикует скомпилированные CSS и JavaScript в `public/`.

```bash
php artisan vendor:publish --tag="lingua-assets"
```

**Результат:** `public/vendor/lingua/`

Необходимо только если вы раздаёте ресурсы напрямую из `public/`, а не через Vite или CDN. **Перезапускайте после каждого обновления Lingua**, чтобы синхронизировать ресурсы.

---

## Обновление после апгрейдов

После обновления Lingua через Composer повторно публикуйте изменённые ресурсы:

```bash
# Всегда публикуйте скомпилированные ресурсы повторно
php artisan vendor:publish --tag="lingua-assets" --force

# Повторно публикуйте UI-переводы, если вы их не кастомизировали
php artisan vendor:publish --tag="lingua-translations" --force
```

Флаг `--force` перезаписывает существующие файлы. Опускайте его для `lingua-views` и `lingua-config`, чтобы сохранить локальные настройки.
