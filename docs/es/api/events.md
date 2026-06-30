# Eventos Livewire

Los componentes Livewire de Lingua se comunican mediante eventos con nombre. Puedes
escucharlos en tus propios componentes Livewire, código Alpine.js o JavaScript.

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
    console.log('Nuevo idioma agregado!', event.detail);
});

// O mediante el sistema de eventos de Livewire:
Livewire.on('language_added', () => { /* ... */ });
```

---

## Eventos de idiomas

| Evento | Despachado cuando |
|---|---|
| `language_added` | Se agregó un nuevo idioma correctamente |
| `language_added_fail` | Falló al agregar un idioma |
| `refreshLanguages` | Cualquier cambio que requiera re-renderizar la lista de idiomas |
| `language_default_set` | Se cambió el idioma predeterminado |
| `language_default_fail` | Falló al establecer el idioma predeterminado |
| `languages_sorted` | Se reordenaron los idiomas mediante arrastrar y soltar |
| `languages_sorted_fail` | Falló el reordenamiento |
| `lang_updated` | `lingua:update-lang` se completó correctamente |
| `lang_updated_fail` | `lingua:update-lang` falló |
| `synced_database` | Sincronización a BD completada correctamente |
| `synced_database_fail` | Sincronización a BD falló |
| `synced_local` | Sincronización a archivos locales completada |
| `synced_local_fail` | Sincronización a archivos locales falló |

---

## Eventos de traducciones

| Evento | Despachado cuando |
|---|---|
| `translation_deleted` | Se eliminó completamente un registro de traducción |
| `translation_delete_fail` | Falló al eliminar una traducción |
| `translation_locale_deleted` | Se eliminó el valor de un locale específico |
| `translation_locale_delete_fail` | Falló al eliminar el valor de un locale |
| `vendor_translation_protected` | Se intentó eliminar una traducción de vendor |
| `refreshTranslationsTableDefaults` | La tabla de traducciones debe recargar la columna del locale predeterminado |
| `refreshTranslationRow.{id}` | Una fila específica debe actualizarse (parametrizado por ID) |
| `updateTranslationModal.{id}` | El modal de actualización para una traducción debe actualizarse |

---

## Eventos de Transfer <Badge type="tip" text="Nuevo en 2.0" />

| Evento | Despachado cuando |
|---|---|
| `export_complete` | Exportación completada; el archivo de descarga está listo |
| `export_failed` | La exportación falló (error logueado, mensaje genérico a la UI) |
| `import_diff_ready` | El diff en seco está listo para revisión |
| `import_complete` | La importación fue confirmada y aplicada correctamente |
| `import_failed` | La importación falló (error logueado, mensaje genérico a la UI) |

---

## Eventos de configuración <Badge type="tip" text="Nuevo en 2.0" />

| Evento | Despachado cuando |
|---|---|
| `settings-saved` | Se guardó una configuración en la página de Configuración |

```js
Livewire.on('settings-saved', () => {
    console.log('Configuración de Lingua guardada');
});
```

---

## Eventos de actualización de interfaz

| Evento | Despachado cuando |
|---|---|
| `refreshLanguageRows` | Todas las filas de idioma deben re-renderizarse (p.ej. tras cambio de predeterminado) |

---

## Ejemplo: Toast al agregar un idioma

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = '¡Idioma agregado!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

## Ejemplo: Reaccionar a cambio de configuración

```php
use Livewire\Attributes\On;

class NavbarComponent extends Component
{
    public bool $navEnabled = true;

    #[On('settings-saved')]
    public function refreshNavState(): void
    {
        $this->navEnabled = LinguaSetting::get(LinguaSetting::KEY_NAV_ENABLED, true);
    }
}
```
