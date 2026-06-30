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
| `language_default_set` | The default language was changed |
| `language_default_set_fail` | Setting the default language failed |
| `languages_sorted` | Languages were reordered via drag-and-drop |
| `languages_sorted_fail` | Language reordering failed |
| `lang_updated` | `lingua:update-lang` completed successfully |
| `lang_updated_fail` | `lingua:update-lang` failed |

---

## Database sync events

| Event | Dispatched when |
|---|---|
| `synced_database` | Sync-to-database completed successfully |
| `synced_database_fail` | Sync-to-database failed |
| `synced_local` | Sync-to-local completed successfully |
| `synced_local_fail` | Sync-to-local failed |

---

## Translation events

| Event | Dispatched when |
|---|---|
| `translation_added` | A new translation key was created |
| `translation_add_fail` | Creating a translation failed |
| `translation_updated` | A translation value was saved |
| `translation_update_fail` | Saving a translation failed |
| `translation_deleted` | A translation record was fully deleted |
| `translation_delete_fail` | Deleting a translation failed |
| `translation_locale_deleted` | A single locale's value was removed from a translation |
| `translation_locale_delete_fail` | Removing a locale value failed |
| `vendor_translation_protected` <Badge type="tip" text="New in 2.0" /> | A `forgetTranslation()` call was blocked because the line is a protected vendor translation |

::: tip Surfacing vendor protection to users
`vendor_translation_protected` is dispatched whenever a delete is blocked for a vendor line. Listen for it to show the user a clear "this string is managed by a package and can't be deleted" message instead of a silent no-op.
:::

---

## Settings events

| Event | Dispatched when |
|---|---|
| `settings-saved` | The Settings page persisted its changes |

---

## Transfer events <Badge type="tip" text="New in 2.0" />

The Transfer (import/export) page performs its work **synchronously** within the request — there are no asynchronous job-completion events to listen for. Import results (the dry-run diff and the commit outcome) are returned directly to the component state and rendered in the UI.

---

## UI refresh events

These are used internally to coordinate re-renders. They are parameterised by translation ID where noted.

| Event | Dispatched when |
|---|---|
| `refreshTranslationRow.{id}` | A specific translation row should refresh |
| `updateTranslationModal.{id}` | The update modal for a translation should refresh |
| `__close-others` | Open inline editors elsewhere should close |
| `change` / `close` | Select / popover lifecycle signals |

---

## Example: Show a toast when a language is added

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Language added!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast" x-text="message"></div>
</div>
```
