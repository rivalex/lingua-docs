# Selector de Idioma

El componente `<livewire:lingua::language-selector>` es un selector de idioma embebible para tus usuarios finales - completamente separado de la interfaz de administración.

## Uso básico

```blade
<livewire:lingua::language-selector />
```

Agrégalo en cualquier lugar de tus layouts Blade. Se renderiza usando el modo configurado en `config/lingua.php` (`sidebar` por defecto).

## Modos de presentación

### Modo Sidebar (predeterminado)

Se renderiza como una sección de navegación agrupada - ideal para barras laterales de aplicaciones construidas con Flux.

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/screenshots/selector-sidebar.png" alt="Selector de idioma en modo barra lateral" caption="Modo sidebar - muestra todos los idiomas instalados como elementos de navegación." width="320px" :center="true"/>

### Modo Dropdown

Se renderiza como un botón desplegable compacto - ideal para encabezados y barras de navegación.

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/screenshots/selector-dropdown.png" alt="Selector de idioma en modo dropdown" caption="Modo dropdown - muestra el idioma actual con un icono de bandera." width="320px" :center="true"/>

### Modo Modal

Se renderiza como un botón que abre un modal completo de selección de idioma - ideal para cambios de idioma destacados en páginas de aterrizaje o flujos de incorporación.

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/screenshots/selector-modal.png" alt="Selector de idioma en modo modal" caption="Modo modal - superposición de selección de idioma a pantalla completa."/>

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

---

## Modo headless

El selector headless no genera CSS ni marcado del framework — HTML semántico puro con atributos `data-lingua-*` que puedes estilizar completamente con tu propio CSS, Tailwind o cualquier otro enfoque.

Usa el modo headless cuando necesitas la lógica de cambio de idioma pero quieres control total sobre la salida visual.

### Uso básico

```blade
<livewire:lingua::headless-language-selector />
```

La lista de idiomas siempre está presente en el DOM. La visibilidad es tu responsabilidad — usa CSS `display`, Alpine.js `x-show` o cualquier otro mecanismo. No se proporciona ningún botón desencadenador integrado por diseño.

Habilita el modo headless globalmente a través de la config o la página de Configuración:

```php
// config/lingua.php
'selector' => ['mode' => 'headless'],
```

### Slots con nombre

#### Slot `$item`

Reemplaza el marcado `<button>` predeterminado dentro de cada `<li>` de idioma. Recibe la instancia del modelo `Language`:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        {{ $language->native }} ({{ $language->code }})
    </x-slot>
</livewire:lingua::headless-language-selector>
```

#### Slot `$current`

Reemplaza el renderizado del idioma **actualmente seleccionado** únicamente. Recurre a `$item` si no se proporciona:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:current="language">
        <strong>{{ $language->native }}</strong>
    </x-slot>
    <x-slot:item="language">
        {{ $language->native }}
    </x-slot>
</livewire:lingua::headless-language-selector>
```

### API de selección CSS

El componente expone atributos `data-lingua-*` en cada elemento para la selección con CSS y JavaScript:

| Atributo | Elemento |
|---|---|
| `data-lingua-selector` | Elemento `<nav>` raíz |
| `data-lingua-list` | La lista `<ul>` de idiomas |
| `data-lingua-item` | Cada entrada `<li>` de idioma |
| `data-lingua-active` | El `<li>` del idioma actualmente activo |
| `data-lingua-button` | El `<button>` dentro de cada `<li>` |
| `data-lingua-name` | `<span>` del nombre en inglés del idioma |
| `data-lingua-native` | `<span>` del nombre nativo del idioma |
| `data-lingua-code` | `<span>` del código ISO del idioma |

### Ejemplos de estilo

**CSS simple:**

```css
[data-lingua-selector] {
    display: flex;
    gap: 0.5rem;
    list-style: none;
}
[data-lingua-item] {
    cursor: pointer;
}
[data-lingua-active] {
    font-weight: bold;
    text-decoration: underline;
}
[data-lingua-button] {
    background: none;
    border: none;
    padding: 0.25rem 0.5rem;
}
```

**Tailwind CSS:**

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        <span class="px-3 py-1 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            {{ $language->native }}
        </span>
    </x-slot>
    <x-slot:current="language">
        <span class="px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900 font-semibold text-red-700 dark:text-red-300">
            {{ $language->native }}
        </span>
    </x-slot>
</livewire:lingua::headless-language-selector>
```

**Alternancia de visibilidad con Alpine.js:**

```blade
<div x-data="{ open: false }">
    <button @click="open = !open">
        {{ app()->getLocale() }}
    </button>

    <div x-show="open" @click.outside="open = false">
        <livewire:lingua::headless-language-selector>
            <x-slot:item="language">
                <button class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                    {{ $language->native }}
                </button>
            </x-slot>
        </livewire:lingua::headless-language-selector>
    </div>
</div>
```

### Referencia de props (actualizada)

| Prop | Tipo | Defecto | Descripción |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'`, `'modal'`, o `'headless'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | Mostrar iconos de banderas |

::: tip
Cuando se pasa `mode="headless"` a `<livewire:lingua::language-selector />`, ese componente no renderiza nada. Usa directamente `<livewire:lingua::headless-language-selector />` para soporte completo de slots y atributos.
:::
