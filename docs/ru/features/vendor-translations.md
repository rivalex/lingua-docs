# Переводы пакетов (Vendor)

Переводы пакетов — строки, принадлежащие сторонним пакетам: сообщения валидации
Laravel, метки пагинации, строки сброса пароля и переводы любого пакета, поставляющего
свою директорию `lang/`.

## Как они идентифицируются

Во время `lingua:sync-to-database` Lingua сканирует `lang/vendor/`. Найденные файлы
импортируются с `is_vendor = true` и `vendor` = имя пакета (из имени директории).

::: tip
Собственные файлы `lang/en/*.php` Laravel (`auth`, `validation`, `pagination`, `passwords`)
также считаются переводами пакетов (`vendor = 'laravel'`).
:::

Пример строк после синхронизации:

```
group      | key      | is_vendor | vendor  | text
-----------|----------|-----------|---------|-----------------------------
validation | required | false     | null    | {"en":"The :attribute…"}
passwords  | reset    | true      | laravel | {"en":"Your password…"}
auth       | failed   | true      | laravel | {"en":"These credentials…"}
```

## Разрешённые действия

| Действие | Разрешено? | Примечания |
|---|---|---|
| **Редактировать значение** | ✅ | Переопределите любую строку пакета |
| **Изменить тип** | ✅ | Переключайтесь между `text` / `html` / `markdown` |
| **Редактировать `group` или `key`** | ❌ | Поля заблокированы в UI |
| **Удалить** | ❌ | Защищено `VendorTranslationProtectedException` |

## Переопределение строки пакета

**Через UI:**

1. Перейдите на `/lingua/translations`
2. Найдите строку (например, `validation.required`)
3. Нажмите на строку и отредактируйте значение для нужной локали
4. Сохраните — переопределение вступает в силу немедленно

**Программно:**

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Please fill in the :attribute field.',
    locale: 'en'
);
```

## Запросы переводов пакетов

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// Все переводы пакетов
$all = Translation::where('is_vendor', true)->get();

// Все переводы конкретного пакета
$laravel = Lingua::getVendorTranslations('laravel');

// С фильтром по локали
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');
```

## Механизм защиты

Попытка удалить вендорный перевод (через UI или `forgetTranslation()`) выбрасывает
`VendorTranslationProtectedException`:

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en');
} catch (VendorTranslationProtectedException $e) {
    // Обработать корректно
}
```

Защита действует в **обоих драйверах** (`database` и `file`) — `FileRepository` и
`DatabaseRepository` оба выбрасывают это исключение.

В UI попытка удаления вызывает событие `vendor_translation_protected` без удаления строки.

## Повторная синхронизация

После выхода новой версии Laravel или пакета, добавившего строки:

```bash
php artisan lingua:update-lang
```

Lingua использует `updateOrCreate` при синхронизации — существующие переопределения
(отредактированные значения) **сохраняются**.

## Отключение импорта вендорных строк

Если вендорные строки не нужны, запустите синхронизацию после удаления `lang/vendor/`.
Lingua импортирует только то, что найдёт на диске.
