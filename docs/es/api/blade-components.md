# Componentes Blade

Lingua registra varios componentes Blade anónimos bajo el prefijo `lingua::`. Estos se usan internamente en las vistas de Livewire y también pueden reutilizarse en tus propias plantillas.

## `<x-lingua::editor>`

Un componente editor polimórfico que renderiza un `<textarea>`, editor HTML de TipTap o editor Markdown de TipTap según el prop `type`.

```blade
{{-- Texto plano --}}
<x-lingua::editor
    wire:model="value"
    type="text"
    placeholder="Enter text…"
/>

{{-- HTML --}}
<x-lingua::editor
    wire:model="value"
    type="html"
    label="Body content"
    :required="true"
/>

{{-- Markdown --}}
<x-lingua::editor
    wire:model="value"
    type="markdown"
    placeholder="Write in Markdown…"
/>
```

### Props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'` o `'markdown'` |
| `label` | string | `''` | Etiqueta opcional sobre el campo |
| `placeholder` | string | `''` | Texto de marcador de posición |
| `required` | bool | `false` | Muestra un indicador de campo obligatorio |
| `wire:model` | - | - | Vinculación al modelo Livewire |

---

## `<x-lingua::clipboard>`

Un envoltorio que añade un botón de copiar al portapapeles alrededor de su contenido slot.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

Al hacer clic, el componente copia `text-to-copy` al portapapeles y muestra brevemente una marca de verificación.

### Props

| Prop | Tipo | Descripción |
|---|---|---|
| `text-to-copy` | string | El texto a copiar al portapapeles |
| `show-tooltip` | bool | Mostrar un tooltip al pasar el cursor (por defecto: `false`) |

---

## `<x-lingua::language-flag>`

Renderiza un icono de bandera y el nombre del idioma para un idioma dado.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

### Props

| Prop | Tipo | Descripción |
|---|---|---|
| `name` | string | Nombre del idioma en inglés |
| `code` | string | Código de idioma para buscar la bandera |
| `description` | string | Nombre nativo del idioma (subtítulo) |

Usa `outhebox/blade-flags` para los SVG de las banderas. Si no hay bandera disponible para el código, recurre graciosamente a mostrar el texto del código.

---

## `<x-lingua::message>`

Un componente de mensaje transitorio que se muestra durante un breve período después de un evento Livewire.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

### Props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `on` | string | - | Nombre del evento Livewire a escuchar |
| `delay` | int | `1500` | Duración en milisegundos antes de ocultarse |

---

## `<x-lingua::autocomplete>`

Un componente de entrada de texto con autocompletado usado en el formulario de creación de traducciones.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="e.g. marketing"
/>
```

### Props

| Prop | Tipo | Descripción |
|---|---|---|
| `wire:model` | - | Vinculación al modelo Livewire |
| `suggestions` | array | Array de sugerencias de autocompletado |
| `placeholder` | string | Texto de marcador de posición del input |

---

## `<x-lingua::menu-group>`

Un componente de grupo de navegación para menús de barra lateral.

```blade
<x-lingua::menu-group heading="Languages">
    {{-- items del menú slot --}}
</x-lingua::menu-group>
```

### Props

| Prop | Tipo | Descripción |
|---|---|---|
| `heading` | string | Texto del encabezado del grupo |

---

## Personalizar componentes

Publica todas las vistas de componentes para sobreescribirlas:

```bash
php artisan vendor:publish --tag="lingua-views"
```

Las vistas publicadas se encuentran en `resources/views/vendor/lingua/components/`. Laravel usa tu versión publicada automáticamente.
