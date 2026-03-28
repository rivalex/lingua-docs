# Eventi Livewire

I componenti Livewire di Lingua comunicano tramite eventi nominati. Puoi ascoltare questi eventi nei tuoi componenti Livewire, nel codice Alpine.js o in JavaScript.

## Ascolto in Livewire

```php
use Livewire\Attributes\On;

class MyComponent extends Component
{
    #[On('language_added')]
    public function handleLanguageAdded(): void
    {
        // Aggiorna qualcosa quando viene aggiunta una nuova lingua
    }
}
```

## Ascolto in Alpine.js / JavaScript

```js
window.addEventListener('language_added', (event) => {
    console.log('Una nuova lingua è stata aggiunta!', event.detail);
});

// Oppure tramite il sistema di eventi di Livewire:
Livewire.on('language_added', () => {
    // ...
});
```

---

## Eventi delle lingue

| Evento | Generato quando |
|---|---|
| `language_added` | Una nuova lingua è stata aggiunta con successo |
| `language_added_fail` | L'aggiunta di una lingua è fallita |
| `refreshLanguages` | Qualsiasi modifica alle lingue che richiede il re-render della lista |
| `language_default_set` | La lingua predefinita è stata cambiata |
| `language_default_fail` | L'impostazione della lingua predefinita è fallita |
| `languages_sorted` | Le lingue sono state riordinate tramite drag-and-drop |
| `languages_sorted_fail` | Il riordinamento delle lingue è fallito |
| `lang_updated` | `lingua:update-lang` è stato completato con successo |
| `lang_updated_fail` | `lingua:update-lang` è fallito |
| `synced_database` | La sincronizzazione nel database è stata completata con successo |
| `synced_database_fail` | La sincronizzazione nel database è fallita |
| `synced_local` | La sincronizzazione in locale è stata completata con successo |
| `synced_local_fail` | La sincronizzazione in locale è fallita |

---

## Eventi delle traduzioni

| Evento | Generato quando |
|---|---|
| `translation_deleted` | Un record di traduzione è stato completamente eliminato |
| `translation_delete_fail` | L'eliminazione di una traduzione è fallita |
| `translation_locale_deleted` | Il valore di una singola locale è stato rimosso da una traduzione |
| `translation_locale_delete_fail` | La rimozione di un valore della locale è fallita |
| `vendor_translation_protected` | È stato tentato di eliminare una traduzione vendor |
| `refreshTranslationsTableDefaults` | La tabella delle traduzioni deve ricaricare la colonna della locale predefinita |
| `refreshTranslationRow.{id}` | Una riga di traduzione specifica deve aggiornarsi (parametrizzata dall'ID della traduzione) |
| `updateTranslationModal.{id}` | La modale di aggiornamento per una traduzione deve aggiornarsi |

---

## Eventi di aggiornamento dell'interfaccia

| Evento | Generato quando |
|---|---|
| `refreshLanguageRows` | Tutte le righe delle lingue devono essere re-renderizzate (es. dopo un cambio di predefinita) |

---

## Esempio: mostrare un toast quando viene aggiunta una lingua

Usando Alpine.js e una libreria di toast:

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Lingua aggiunta!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

## Esempio: reindirizzare dopo il cambio di locale

Se vuoi reindirizzare a un URL diverso dopo che il selettore di lingua cambia locale (invece della pagina corrente):

```php
// Pubblica LanguageSelector e sovrascrivi changeLocale():
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true); // reindirizza alla home
}
```
