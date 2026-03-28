# Selector de Idioma

El componente `<livewire:lingua::language-selector>` es un selector de idioma embebible para tus usuarios finales — completamente separado de la interfaz de administración.

## Uso básico

```blade
<livewire:lingua::language-selector />
```

Agrégalo en cualquier lugar de tus layouts Blade. Se renderiza usando el modo configurado en `config/lingua.php` (`sidebar` por defecto).

## Modos de presentación

### Modo Sidebar (predeterminado)

Se renderiza como una sección de navegación agrupada — ideal para barras laterales de aplicaciones construidas con Flux.

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/screenshots/selector-sidebar.png" alt="Selector de idioma en modo barra lateral" caption="Modo sidebar — muestra todos los idiomas instalados como elementos de navegación." width="320px" :center="true"/>

### Modo Dropdown

Se renderiza como un botón desplegable compacto — ideal para encabezados y barras de navegación.

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/screenshots/selector-dropdown.png" alt="Selector de idioma en modo dropdown" caption="Modo dropdown — muestra el idioma actual con un icono de bandera." width="320px" :center="true"/>

### Modo Modal

Se renderiza como un botón que abre un modal completo de selección de idioma — ideal para cambios de idioma destacados en páginas de aterrizaje o flujos de incorporación.

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/screenshots/selector-modal.png" alt="Selector de idioma en modo modal" caption="Modo modal — superposición de selección de idioma a pantalla completa."/>

## Referencia de props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'` o `'modal'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | Mostrar iconos de banderas |

```blade
{{-- Sobreescribir el modo por instancia --}}
<livewire:lingua::language-selector mode="dropdown" :show-flags="false" />
```

## Cómo funciona el cambio de idioma

Cuando un usuario hace clic en un idioma, el componente llama a `changeLocale($locale)`:

1. Valida que el idioma existe en la tabla `languages` (ignora silenciosamente los idiomas desconocidos)
2. Almacena el código de idioma en la sesión bajo `config('lingua.session_variable')`
3. Llama a `app()->setLocale($locale)` para la solicitud actual
4. Redirige a la URL actual (provoca una recarga completa de la página para que el nuevo idioma surta efecto en todos lados)

En la siguiente solicitud, `LinguaMiddleware` lee la sesión y aplica el idioma antes de que se ejecuten tus controladores.

## Iconos de banderas

Los iconos de banderas son provistos por el paquete [`outhebox/blade-flags`](https://github.com/MohmmedAshraf/blade-flags), que se instala automáticamente como dependencia de Lingua.

Las banderas se emparejan por el código `regional` del idioma (p. ej. `en_US` → 🇺🇸, `fr_FR` → 🇫🇷). Si no hay código regional configurado, el componente de bandera recurre graciosamente a mostrar el código de dos letras.

Deshabilitar banderas globalmente:

```php
// config/lingua.php
'selector' => ['show_flags' => false],
```

O por instancia:

```blade
<livewire:lingua::language-selector :show-flags="false" />
```

## Personalizar las vistas del selector

Publica las vistas para sobreescribir el marcado:

```bash
php artisan vendor:publish --tag="lingua-views"
```

Las plantillas del selector están en:

```
resources/views/vendor/lingua/livewire/
├── language-selector.blade.php
└── selector/
    ├── sidebar.blade.php
    ├── dropdown.blade.php
    └── modal.blade.php
```

::: tip Integrar con tu propia navegación
Si usas los componentes de sidebar o navbar de Flux, el modo `sidebar` encaja naturalmente en `<flux:navlist>` o `<flux:sidebar>`. Publica la vista y adapta el marcado para que coincida con tu estructura de navegación.
:::

## Actualizar el selector tras cambios

El selector escucha el evento Livewire `refreshLanguages`. Si agregas o eliminas un idioma desde la interfaz de administración (o programáticamente), el selector se re-renderiza automáticamente sin recargar la página.

```js
// Despachar desde cualquier componente Livewire o código Alpine.js:
this.$dispatch('refreshLanguages')
```
