# Eventos Livewire

Los componentes Livewire de Lingua se comunican mediante eventos con nombre. Puedes escuchar estos eventos en tus propios componentes Livewire, código Alpine.js o JavaScript.

## Escuchar en Livewire

```php
use Livewire\Attributes\On;

class MyComponent extends Component
{
    #[On('language_added')]
    public function handleLanguageAdded(): void
    {
        // Actualizar algo cuando se agrega un nuevo idioma
    }
}
```

## Escuchar en Alpine.js / JavaScript

```js
window.addEventListener('language_added', (event) => {
    console.log('A new language was added!', event.detail);
});

// O mediante el sistema de eventos de Livewire:
Livewire.on('language_added', () => {
    // ...
});
```

---

## Eventos de idiomas

| Evento | Despachado cuando |
|---|---|
| `language_added` | Se agregó un nuevo idioma correctamente |
| `language_added_fail` | Falló al agregar un idioma |
| `refreshLanguages` | Cualquier cambio de idioma que requiera que la lista de idiomas se re-renderice |
| `language_default_set` | Se cambió el idioma predeterminado |
| `language_default_fail` | Falló al establecer el idioma predeterminado |
| `languages_sorted` | Se reordenaron los idiomas mediante arrastrar y soltar |
| `languages_sorted_fail` | Falló el reordenamiento de idiomas |
| `lang_updated` | `lingua:update-lang` se completó correctamente |
| `lang_updated_fail` | `lingua:update-lang` falló |
| `synced_database` | La sincronización a base de datos se completó correctamente |
| `synced_database_fail` | La sincronización a base de datos falló |
| `synced_local` | La sincronización a archivos locales se completó correctamente |
| `synced_local_fail` | La sincronización a archivos locales falló |

---

## Eventos de traducciones

| Evento | Despachado cuando |
|---|---|
| `translation_deleted` | Se eliminó completamente un registro de traducción |
| `translation_delete_fail` | Falló al eliminar una traducción |
| `translation_locale_deleted` | Se eliminó el valor de un idioma específico de una traducción |
| `translation_locale_delete_fail` | Falló al eliminar el valor de un idioma |
| `vendor_translation_protected` | Se intentó eliminar una traducción de proveedor |
| `refreshTranslationsTableDefaults` | La tabla de traducciones debe recargar su columna del idioma predeterminado |
| `refreshTranslationRow.{id}` | Una fila de traducción específica debe actualizarse (parametrizado por el ID de traducción) |
| `updateTranslationModal.{id}` | El modal de actualización para una traducción debe actualizarse |

---

## Eventos de actualización de interfaz

| Evento | Despachado cuando |
|---|---|
| `refreshLanguageRows` | Todas las filas de idioma deben re-renderizarse (p. ej. después de un cambio de predeterminado) |

---

## Ejemplo: Mostrar un toast cuando se agrega un idioma

Usando Alpine.js y una librería de toasts:

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Language added!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

## Ejemplo: Redirigir después del cambio de idioma

Si quieres redirigir a una URL diferente después de que el selector de idioma cambie (en lugar de a la página actual):

```php
// Publica LanguageSelector y sobreescribe changeLocale():
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true); // redirigir al inicio
}
```
