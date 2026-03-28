# Editor de Texto Enriquecido

Lingua integra [TipTap 3](https://tiptap.dev) como editor de texto enriquecido opcional para los tipos de traducción HTML y Markdown. El editor correcto se activa automáticamente según la columna `type` de la traducción.

## Tipos de traducción

| Tipo | Editor | Descripción |
|---|---|---|
| `text` | `<textarea>` simple | Predeterminado para todas las traducciones estándar |
| `html` | TipTap WYSIWYG | Para contenido que debe renderizarse con formato HTML |
| `markdown` | TipTap Markdown | Para contenido escrito en sintaxis Markdown |

## Configurar la barra de herramientas

La barra de herramientas del editor se controla globalmente mediante `config/lingua.php`:

```php
'editor' => [
    'headings'      => false,  // Botones de encabezados H1-H3
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'bullet'        => true,   // Lista desordenada
    'ordered'       => true,   // Lista ordenada
    'clear'         => true,   // Limpiar formato
],
```

Activa solo las opciones que tu contenido realmente necesita. Mantener la barra de herramientas mínima reduce la carga cognitiva para los traductores.

<Screenshot src="/lingua-docs/screenshots/editor-toolbar.png" alt="Barra de herramientas del editor" caption="La barra de herramientas del editor HTML con las opciones predeterminadas activas." />

## Cambiar el tipo de una traducción

En el modal de edición (icono de lápiz, solo en el idioma predeterminado), selecciona el tipo deseado en el desplegable **Type**. El editor se actualiza inmediatamente en la fila sin recargar la página.

::: tip Detección automática
Cuando ejecutas por primera vez `lingua:sync-to-database`, Lingua detecta automáticamente el tipo según el contenido. Puedes sobreescribirlo manualmente en cualquier momento — el valor almacenado no cambia cuando cambias el tipo, solo el comportamiento del editor.
:::

## Trabajar con traducciones HTML

Las traducciones HTML se almacenan como HTML sin procesar en la columna JSON `text`:

```json
{"en": "<p>Welcome to <strong>Lingua</strong> — the translation manager for Laravel.</p>"}
```

Para renderizarlas en Blade sin doble escapado:

```blade
{{-- Siempre usa {!! !!} para tipos de traducción HTML --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
Solo usa `{!! !!}` para cadenas de traducción gestionadas por usuarios autorizados en un panel de administración controlado. Nunca renderices entrada de usuario no confiable como HTML sin procesar.
:::

## Trabajar con traducciones Markdown

Las traducciones Markdown almacenan Markdown sin procesar:

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**.\n\n- Feature one\n- Feature two"}
```

Para renderizar Markdown en Blade, usa un parser de Markdown. Laravel incluye `Str::markdown()`:

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

O usa un paquete dedicado como [league/commonmark](https://commonmark.thephpleague.com).

## El componente `x-lingua::editor`

El editor se expone como componente Blade que puedes reutilizar fuera de la interfaz de gestión de Lingua:

```blade
{{-- Modo texto --}}
<x-lingua::editor
    wire:model="myField"
    type="text"
    placeholder="Enter text…"
/>

{{-- Modo HTML --}}
<x-lingua::editor
    wire:model="myField"
    type="html"
    label="Body content"
    :required="true"
/>

{{-- Modo Markdown --}}
<x-lingua::editor
    wire:model="myField"
    type="markdown"
    placeholder="Write in Markdown…"
/>
```

### Props

| Prop | Tipo | Descripción |
|---|---|---|
| `wire:model` | string | Propiedad Livewire a la que vincular |
| `type` | string | `'text'`, `'html'` o `'markdown'` |
| `label` | string | Etiqueta opcional sobre el editor |
| `placeholder` | string | Texto de marcador de posición |
| `required` | bool | Muestra un indicador de campo obligatorio cuando es `true` |

::: tip
El componente `x-lingua::editor` es un excelente punto de partida para cualquier formulario Livewire que necesite un campo de texto enriquecido. Publica la vista del componente para personalizar la barra de herramientas o los estilos.
:::
