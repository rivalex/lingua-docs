# Editor de Texto Enriquecido

Lingua integra [TipTap 3](https://tiptap.dev) como editor de texto enriquecido opcional
para los tipos de traducción HTML y Markdown. El editor correcto se activa automáticamente
según la columna `type` de la traducción.

## Tipos de traducción

| Tipo | Editor | Descripción |
|---|---|---|
| `text` | `<textarea>` simple | Predeterminado para todas las traducciones estándar |
| `html` | TipTap WYSIWYG | Para contenido que debe renderizarse con formato HTML |
| `markdown` | TipTap Markdown | Para contenido escrito en sintaxis Markdown |

## Configurar la barra de herramientas

```php
// config/lingua.php
'editor' => [
    'headings'      => false,  // Botones H1–H3
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'bullet'        => true,   // Lista desordenada
    'ordered'       => true,   // Lista ordenada
    'clear'         => true,   // Limpiar formato
],
```

<Screenshot src="/screenshots/editor-toolbar.png" alt="Barra de herramientas del editor" caption="La barra de herramientas del editor HTML con las opciones predeterminadas." />

## Cambiar el tipo de una traducción

En el modal de edición (solo en el idioma predeterminado), selecciona el tipo en el
desplegable **Type**. El editor se actualiza inmediatamente — el valor almacenado
no cambia al cambiar el tipo.

::: tip Detección automática
Al ejecutar `lingua:sync-to-database`, Lingua detecta el tipo según el contenido. Puedes
sobreescribirlo manualmente en cualquier momento.
:::

## Trabajar con traducciones HTML

```json
{"en": "<p>Bienvenido a <strong>Lingua</strong>.</p>"}
```

Para renderizar en Blade sin doble escapado:

```blade
{{-- Siempre usa {!! !!} para tipos HTML --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
Solo usa `{!! !!}` para cadenas gestionadas por usuarios autorizados en un panel
controlado. Nunca renderices entrada de usuario no confiable como HTML sin procesar.
Lingua sanitiza el HTML en el momento del guardado mediante `HtmlSanitizer`.
:::

## Trabajar con traducciones Markdown

```json
{"en": "## Bienvenido!\n\nGracias por elegir **Lingua**.\n\n- Característica uno"}
```

Para renderizar en Blade:

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

## El componente `x-lingua::editor`

El editor se expone como componente Blade reutilizable:

```blade
{{-- Modo texto --}}
<x-lingua::editor wire:model="myField" type="text" placeholder="Escribe texto…" />

{{-- Modo HTML --}}
<x-lingua::editor wire:model="myField" type="html" label="Cuerpo" :required="true" />

{{-- Modo Markdown --}}
<x-lingua::editor wire:model="myField" type="markdown" placeholder="Escribe en Markdown…" />
```

### Props

| Prop | Tipo | Descripción |
|---|---|---|
| `wire:model` | string | Propiedad Livewire a vincular |
| `type` | string | `'text'`, `'html'` o `'markdown'` |
| `label` | string | Etiqueta opcional sobre el editor |
| `placeholder` | string | Texto de marcador de posición |
| `required` | bool | Muestra indicador de campo obligatorio |
