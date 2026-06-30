# Livewire-события

Livewire-компоненты Lingua общаются через именованные события. Прослушивайте их в
своих Livewire-компонентах, Alpine.js или JavaScript.

## Прослушивание в Livewire

```php
use Livewire\Attributes\On;

class MyComponent extends Component
{
    #[On('language_added')]
    public function handleLanguageAdded(): void
    {
        // Обновить что-то при добавлении нового языка
    }
}
```

## Прослушивание в Alpine.js / JavaScript

```js
window.addEventListener('language_added', (event) => {
    console.log('A new language was added!', event.detail);
});

// Или через систему событий Livewire:
Livewire.on('language_added', () => { /* … */ });
```

---

## События языков

| Событие | Когда вызывается |
|---|---|
| `language_added` | Новый язык успешно добавлен |
| `language_added_fail` | Добавление языка завершилось ошибкой |
| `refreshLanguages` | Любое изменение языка, требующее перерендера списка |
| `language_default_set` | Язык по умолчанию изменён |
| `language_default_fail` | Установка языка по умолчанию завершилась ошибкой |
| `languages_sorted` | Языки переупорядочены перетаскиванием |
| `languages_sorted_fail` | Переупорядочивание завершилось ошибкой |
| `lang_updated` | `lingua:update-lang` успешно завершён |
| `lang_updated_fail` | `lingua:update-lang` завершился ошибкой |

---

## События синхронизации БД

| Событие | Когда вызывается |
|---|---|
| `synced_database` | Синхронизация в БД успешно завершена |
| `synced_database_fail` | Синхронизация в БД завершилась ошибкой |
| `synced_local` | Синхронизация в файлы успешно завершена |
| `synced_local_fail` | Синхронизация в файлы завершилась ошибкой |

---

## События переводов

| Событие | Когда вызывается |
|---|---|
| `translation_deleted` | Запись перевода полностью удалена |
| `translation_delete_fail` | Удаление перевода завершилось ошибкой |
| `translation_locale_deleted` | Значение одной локали удалено из перевода |
| `translation_locale_delete_fail` | Удаление значения локали завершилось ошибкой |
| `vendor_translation_protected` <Badge type="tip" text="Новое в 2.0" /> | Попытка удалить вендорный перевод |
| `refreshTranslationsTableDefaults` | Таблица переводов должна перезагрузить колонку локали по умолчанию |
| `refreshTranslationRow.{id}` | Конкретная строка перевода должна обновиться |
| `updateTranslationModal.{id}` | Модальное окно обновления перевода должно обновиться |

---

## События настроек

| Событие | Когда вызывается |
|---|---|
| `setting_saved` | Настройка сохранена через UI |
| `setting_save_fail` | Сохранение настройки завершилось ошибкой |

---

## События Transfer <Badge type="tip" text="Новое в 2.0" />

События Transfer синхронные (диспатчатся во время запроса, не через очередь).

| Событие | Когда вызывается |
|---|---|
| `transfer_export_started` | Экспорт файла начат |
| `transfer_export_completed` | Файл готов к скачиванию |
| `transfer_export_failed` | Экспорт завершился ошибкой |
| `transfer_import_previewed` | Diff предварительного просмотра сгенерирован |
| `transfer_import_committed` | Импорт применён |
| `transfer_import_failed` | Импорт завершился ошибкой |

---

## События обновления UI

| Событие | Когда вызывается |
|---|---|
| `refreshLanguageRows` | Все строки языков должны быть перерисованы |
| `locale-changed` | Локаль изменена (диспатч для синхронизации переключателя) |

---

## Примеры

### Показать уведомление при добавлении языка

```blade
<div
    x-data="{ show: false }"
    x-on:language_added.window="show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">Language added!</div>
</div>
```

### Слушать защиту вендорных переводов

```js
window.addEventListener('vendor_translation_protected', () => {
    alert('This translation is protected and cannot be deleted.');
});
```

### Синхронизировать переключатель языков после программной смены локали

```php
// В вашем Livewire-компоненте
$this->dispatch('locale-changed');
```
