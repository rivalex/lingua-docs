# Переводы пакетов (Vendor)

Переводы пакетов - это строки, принадлежащие сторонним пакетам: собственные сообщения валидации Laravel, метки пагинации, строки сброса пароля и переводы любого другого пакета, поставляющего свою директорию `lang/`.

## Как они идентифицируются

Во время `lingua:sync-to-database` Lingua сканирует структуру директории `lang/vendor/`. Любой найденный там файл переводов импортируется с:

- `is_vendor = true`
- `vendor` = название пакета (берётся из имени директории, например, `spatie`, `laravel`, `filament`)

Пример строк базы данных после синхронизации:

```
group      | key          | is_vendor | vendor   | text
-----------|--------------|-----------|----------|-----------------------------
validation | required     | false     | null     | {"en":"The :attribute…"}
passwords  | reset        | true      | laravel  | {"en":"Your password…"}
auth       | failed       | true      | laravel  | {"en":"These credentials…"}
```

::: tip
Собственные файлы `lang/en/*.php` Laravel (auth, validation, pagination, passwords) считаются **переводами пакетов**, поскольку они приходят из фреймворка, а не из кода вашего приложения.
:::

## Что можно делать с переводами пакетов

| Действие | Разрешено? | Примечания |
|---|---|---|
| **Редактировать значение** | ✅ Да | Переопределите любую строку пакета своей формулировкой |
| **Изменить тип** | ✅ Да | Переключайтесь между text / html / markdown |
| **Редактировать group или key** | ❌ Нет | Поля group и key заблокированы в модальном окне редактирования |
| **Удалить** | ❌ Нет | Защищено исключением `VendorTranslationProtectedException` |

## Переопределение строки пакета

Наиболее распространённый случай - переопределение сообщений валидации Laravel под стиль вашего приложения:

1. Откройте `/lingua/translations`
2. Найдите строку (например, `validation.required`)
3. Нажмите иконку редактирования для открытия модального окна обновления
4. Измените значение для любой локали
5. Сохраните - переопределение вступает в силу немедленно при следующем запросе

```php
// Или программно через фасад:
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

// Все переводы пакетов для конкретного пакета
$laravel = Lingua::getVendorTranslations('laravel');

// Все переводы пакетов для конкретного пакета с французскими значениями
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');

// Фильтрация по group и key вручную
$required = Translation::where('is_vendor', true)
    ->where('vendor', 'laravel')
    ->where('group', 'validation')
    ->where('key', 'required')
    ->first();
```

## Механизм защиты

Попытка удалить перевод пакета (из интерфейса или через `Lingua::forgetTranslation()`) бросает исключение `VendorTranslationProtectedException`:

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en'); // ключ принадлежит переводу пакета
} catch (VendorTranslationProtectedException $e) {
    // Обработать корректно
}
```

В Livewire-интерфейсе попытки удаления вызывают событие `vendor_translation_protected` и закрывают модальное окно без удаления. Событие можно слушать в ваших собственных Livewire-компонентах или в коде Alpine.js:

```js
// Обработчик события Alpine.js / Livewire
window.addEventListener('vendor_translation_protected', () => {
    alert('This translation is protected and cannot be deleted.');
});
```

## Повторная синхронизация переводов пакетов

Если зависимый пакет добавил новые ключи переводов в новой версии, выполните повторную синхронизацию для их импорта:

```bash
# Получить последнее из laravel-lang и синхронизировать в БД
php artisan lingua:update-lang

# Или повторно синхронизировать вручную из существующих файлов lang/
php artisan lingua:sync-to-database
```

Lingua использует `updateOrCreate` при синхронизации, поэтому существующие переопределения (отредактированные значения) сохраняются.

## Отключение импорта переводов пакетов

Если вы вообще не хотите видеть переводы пакетов в базе данных, запустите синхронизацию после удаления директории `lang/vendor/`. Lingua импортирует только то, что найдёт на диске.
