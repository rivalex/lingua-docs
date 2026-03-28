# Livewire-события

Livewire-компоненты Lingua общаются через именованные события. Вы можете слушать эти события в своих Livewire-компонентах, коде Alpine.js или JavaScript.

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
Livewire.on('language_added', () => {
    // ...
});
```

---

## События языков

| Событие | Когда вызывается |
|---|---|
| `language_added` | Новый язык успешно добавлен |
| `language_added_fail` | Добавление языка завершилось ошибкой |
| `refreshLanguages` | Любое изменение языка, требующее повторного рендера списка языков |
| `language_default_set` | Язык по умолчанию изменён |
| `language_default_fail` | Установка языка по умолчанию завершилась ошибкой |
| `languages_sorted` | Языки переупорядочены перетаскиванием |
| `languages_sorted_fail` | Переупорядочивание языков завершилось ошибкой |
| `lang_updated` | `lingua:update-lang` успешно завершён |
| `lang_updated_fail` | `lingua:update-lang` завершился ошибкой |
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
| `vendor_translation_protected` | Предпринята попытка удалить перевод пакета |
| `refreshTranslationsTableDefaults` | Таблица переводов должна перезагрузить колонку локали по умолчанию |
| `refreshTranslationRow.{id}` | Конкретная строка перевода должна обновиться (параметризована ID перевода) |
| `updateTranslationModal.{id}` | Модальное окно обновления перевода должно обновиться |

---

## События обновления интерфейса

| Событие | Когда вызывается |
|---|---|
| `refreshLanguageRows` | Все строки языков должны быть перерисованы (например, после смены языка по умолчанию) |

---

## Пример: Показать уведомление при добавлении языка

Используя Alpine.js и библиотеку toast-уведомлений:

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Language added!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

## Пример: Редирект после смены локали

Если вы хотите перенаправлять на другой URL после переключения локали (вместо текущей страницы):

```php
// Опубликуйте LanguageSelector и переопределите changeLocale():
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true); // редирект на главную
}
```
