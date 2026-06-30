# Componentes Blade

Lingua registra componentes Blade anónimos bajo el prefijo `lingua::`. Se usan
internamente en las vistas de Livewire y también pueden reutilizarse en tus propias
plantillas.

## `<x-lingua::nav>` <Badge type="tip" text="Nuevo en 2.0" />

El menú de navegación compartido que aparece en la parte superior de cada página de
Lingua. La página activa se resalta automáticamente.

```blade
<x-lingua::nav :active="'languages'" />
```

| Prop | Tipo | Descripción |
|---|---|---|
| `active` | string | Clave de la página activa (`languages`, `translations`, `statistics`, `transfer`, `settings`) |

El menú respeta la configuración `lingua.nav.enabled` — si está desactivado, no se
renderiza nada. Consulta [Configuración → Menú de navegación](/es/features/settings#menu-de-navegacion).

---

## `<x-lingua::select>` <Badge type="tip" text="Nuevo en 2.0" />

Widget de selector de idioma para usuarios finales, impulsado por el Popover API nativo.
Consulta [Selector de Idioma](/es/features/language-selector) para documentación completa.

```blade
<x-lingua::select />
<x-lingua::select size="sm" variant="outline" position="bottom-end" />
```

---

## `<x-lingua::editor>`

Editor polimórfico que renderiza `<textarea>`, editor HTML TipTap o editor Markdown
TipTap según el prop `type`.

```blade
<x-lingua::editor wire:model="value" type="text" placeholder="Escribe texto…" />
<x-lingua::editor wire:model="value" type="html" label="Contenido" :required="true" />
<x-lingua::editor wire:model="value" type="markdown" placeholder="Escribe en Markdown…" />
```

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'` o `'markdown'` |
| `label` | string | `''` | Etiqueta opcional sobre el campo |
| `placeholder` | string | `''` | Texto de marcador de posición |
| `required` | bool | `false` | Muestra indicador de campo obligatorio |
| `wire:model` | — | — | Vinculación al modelo Livewire |

---

## `<x-lingua::stat>`

Tarjeta KPI para la página de Estadísticas.

```blade
<x-lingua::stat
    :label="$lang->name"
    :value="$lang->completion_percentage . '%'"
    :secondary="$lang->translated_strings . '/' . $lang->total_strings"
/>
```

| Prop | Tipo | Descripción |
|---|---|---|
| `label` | string | Etiqueta de la métrica |
| `value` | string | Valor principal a mostrar |
| `secondary` | string | Texto secundario (conteo, subetiqueta) |

---

## `<x-lingua::card>`

Envoltorio de tarjeta estilizada para agrupar contenido.

```blade
<x-lingua::card title="Sección de idiomas">
    {{-- contenido --}}
</x-lingua::card>
```

| Prop | Tipo | Descripción |
|---|---|---|
| `title` | string | Título del encabezado de la tarjeta |

---

## `<x-lingua::branding>`

Marca de agua "Powered by Lingua" mostrada en las páginas de administración.
Puede ocultarse con `'suppress_pro_nudge' => true` en la configuración.

```blade
<x-lingua::branding />
```

---

## `<x-lingua::validation-errors>`

Muestra errores de validación del formulario en un bloque de alerta.

```blade
<x-lingua::validation-errors :errors="$errors" />
```

---

## `<x-lingua::clipboard>`

Envoltorio que añade un botón de copiar al portapapeles a su contenido.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

| Prop | Tipo | Descripción |
|---|---|---|
| `text-to-copy` | string | El texto a copiar |
| `show-tooltip` | bool | Mostrar tooltip al pasar el cursor (predeterminado: `false`) |

---

## `<x-lingua::message>`

Mensaje transitorio que aparece brevemente tras un evento Livewire.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `on` | string | — | Evento Livewire a escuchar |
| `delay` | int | `1500` | Duración en ms antes de ocultarse |

---

## `<x-lingua::autocomplete>`

Entrada de texto con autocompletado, usada en el formulario de creación de traducciones.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="p.ej. marketing"
/>
```

---

## Personalizar componentes

Publica todas las vistas de componentes:

```bash
php artisan vendor:publish --tag="lingua-views"
```

Vistas publicadas en `resources/views/vendor/lingua/components/`. Laravel usa tu versión
automáticamente.
