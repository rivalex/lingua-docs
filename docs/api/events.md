# Livewire Events

Lingua's Livewire components communicate via named events. You can listen to these events in your own Livewire components, Alpine.js code, or JavaScript.

## Listening in Livewire

```php
use Livewire\Attributes\On;

class MyComponent extends Component
{
    #[On('language_added')]
    public function handleLanguageAdded(): void
    {
        // Refresh something when a new language is added
    }
}
```

## Listening in Alpine.js / JavaScript

```js
window.addEventListener('language_added', (event) => {
    console.log('A new language was added!', event.detail);
});

// Or via Livewire's event system:
Livewire.on('language_added', () => {
    // ...
});
```

---

## Language events

| Event | Dispatched when |
|---|---|
| `language_added` | A new language was successfully added |
| `language_added_fail` | Adding a language failed |
| `refreshLanguages` | Any language change that requires the language list to re-render |
| `language_default_set` | The default language was changed |
| `language_default_fail` | Setting the default language failed |
| `languages_sorted` | Languages were reordered via drag-and-drop |
| `languages_sorted_fail` | Language reordering failed |
| `lang_updated` | `lingua:update-lang` completed successfully |
| `lang_updated_fail` | `lingua:update-lang` failed |
| `synced_database` | Sync-to-database completed successfully |
| `synced_database_fail` | Sync-to-database failed |
| `synced_local` | Sync-to-local completed successfully |
| `synced_local_fail` | Sync-to-local failed |

---

## Translation events

| Event | Dispatched when |
|---|---|
| `translation_deleted` | A translation record was fully deleted |
| `translation_delete_fail` | Deleting a translation failed |
| `translation_locale_deleted` | A single locale's value was removed from a translation |
| `translation_locale_delete_fail` | Removing a locale value failed |
| `vendor_translation_protected` | An attempt was made to delete a vendor translation |
| `refreshTranslationsTableDefaults` | The translations table should reload its default-locale column |
| `refreshTranslationRow.{id}` | A specific translation row should refresh (parameterised by translation ID) |
| `updateTranslationModal.{id}` | The update modal for a translation should refresh |

---

## UI refresh events

| Event | Dispatched when |
|---|---|
| `refreshLanguageRows` | All language rows should re-render (e.g. after a default change) |

---

## Example: Show a toast when a language is added

Using Alpine.js and a toast library:

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Language added!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

## Example: Redirect after locale change

If you want to redirect to a different URL after the language selector switches locale (instead of the current page):

```php
// Publish LanguageSelector and override changeLocale():
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true); // redirect to home
}
```
