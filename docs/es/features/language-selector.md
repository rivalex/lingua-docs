# Selector de Idioma

El componente `x-lingua::select` renderiza un widget de cambio de idioma listo para
producción que puedes colocar en cualquier parte de tu aplicación — en la barra de
navegación, el pie de página o una página de perfil.

<Screenshot src="/screenshots/selector-light.png" alt="Selector de idioma de Lingua en modo claro" caption="El selector de idioma con los idiomas instalados." width="320px" :center="true"/>

## Uso básico

```blade
{{-- Solo necesitas esto --}}
<x-lingua::select />
```

## Props

| Prop | Tipo | Predeterminado | Descripción |
|---|---|---|---|
| `locale` | string | locale actual | Locale seleccionado preseleccionado |
| `size` | `sm` \| `md` \| `lg` | `md` | Tamaño del botón de activación |
| `variant` | `ghost` \| `outline` \| `solid` | `ghost` | Estilo visual del botón |
| `position` | `bottom-start` \| `bottom-end` \| `top-start` \| `top-end` | `bottom-start` | Posición del popover |
| `arrow` | bool | `false` | Mostrar flecha indicadora |
| `search` | bool | `true` | Mostrar campo de búsqueda en el popover |
| `flag` | bool | `true` | Mostrar emoji de bandera junto al nombre |

```blade
{{-- Ejemplo personalizado --}}
<x-lingua::select
    size="sm"
    variant="outline"
    position="bottom-end"
    :search="false"
/>
```

## Cómo funciona el cambio de locale

<Badge type="tip" text="Cambiado en 2.0" /> Al seleccionar un idioma, el componente
recarga la **página actual** — no el inicio. El destino se determina mediante
`ManagesLocale::getRequestUri()` y se valida con una guardia de ruta local para
prevenir redirecciones abiertas (ver
[Seguridad — Protección contra redirecciones abiertas](/es/guide/security#proteccion-contra-redirecciones-abiertas)).

Bajo el capó:

1. `POST /lingua/locale` con `{locale: 'fr', redirect: '/la/ruta/actual'}`
2. `LinguaMiddleware` guarda el nuevo locale en sesión
3. Redirige a `/la/ruta/actual` con el nuevo locale activo

## Implementación con Popover API nativo

<Badge type="tip" text="Nuevo en 2.0" /> `x-lingua::select` usa el
**Popover API nativo del navegador** (`popover="manual"` + `showPopover()`/`hidePopover()`)
en lugar de teleport o posicionamiento absoluto.

Esto soluciona el problema de Flux donde `overflow: hidden` y `transform` en un
contenedor ancestro "atrapaban" el popover y lo renderizaban fuera de lugar. El API
Popover pertenece a la capa superior del navegador — escapa de cualquier contexto de
desbordamiento o transformación.

Sin teleport, sin portal DOM, sin dependencias de Flux para el posicionamiento.
La implementación vive en `resources/views/components/select.blade.php`.

## Incluir el selector en layouts de Blade

```blade
{{-- resources/views/layouts/app.blade.php --}}
<nav>
    <a href="/">{{ config('app.name') }}</a>
    <x-lingua::select />
</nav>
```

## Trait ManagesLocale

El trait `Rivalex\Lingua\Traits\ManagesLocale` alimenta el Livewire o controlador
que responde a los cambios de locale. Úsalo cuando necesites implementar tu propia
lógica de cambio.

```php
use Rivalex\Lingua\Traits\ManagesLocale;

class LocaleSwitchController extends Controller
{
    use ManagesLocale;

    public function switch(Request $request): RedirectResponse
    {
        return $this->switchLocale($request);
    }
}
```

`getRequestUri()` recupera la URI actual, la valida como ruta local (no permite URLs
absolutas ni dominios externos) y devuelve el destino de redirección seguro.

## Modo oscuro

El componente respeta el modo oscuro de Tailwind. Sin configuración necesaria —
funciona si tu layout tiene `dark` en el elemento `<html>`.
