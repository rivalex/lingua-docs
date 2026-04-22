# Configuración

Después de la instalación, `config/lingua.php` es la única fuente de verdad para todos los ajustes de Lingua.

```php
// config/lingua.php

return [

    /*
    |--------------------------------------------------------------------------
    | Language Files Directory
    |--------------------------------------------------------------------------
    | The path where local PHP/JSON translation files are stored.
    | Used by lingua:sync-to-database and lingua:sync-to-local.
    */
    'lang_dir' => lang_path(),

    /*
    |--------------------------------------------------------------------------
    | Default Locale
    |--------------------------------------------------------------------------
    | The fallback locale code used during installation and when the database
    | has no default language configured.
    */
    'default_locale' => config('app.locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Fallback Locale
    |--------------------------------------------------------------------------
    | When a translation is missing in the active locale, Laravel will try
    | this locale next.
    */
    'fallback_locale' => config('app.fallback_locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Route Middleware
    |--------------------------------------------------------------------------
    | Middleware applied to all Lingua management routes.
    | Add 'auth' (and role/permission guards) before going to production.
    */
    'middleware' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Route Prefix
    |--------------------------------------------------------------------------
    | URL prefix for Lingua's management pages.
    | Default: /lingua/languages and /lingua/translations
    */
    'routes_prefix' => 'lingua',

    /*
    |--------------------------------------------------------------------------
    | Session Variable
    |--------------------------------------------------------------------------
    | The session key used to persist the user's active locale across requests.
    */
    'session_variable' => 'locale',

    /*
    |--------------------------------------------------------------------------
    | Language Selector
    |--------------------------------------------------------------------------
    | Controls the default behaviour of the <livewire:lingua::language-selector>
    | component. Both options can be overridden per-instance via props.
    */
    'selector' => [
        'mode'       => 'sidebar',   // 'sidebar' | 'modal' | 'dropdown' | 'headless'
        'show_flags' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Rich-text Editor Toolbar
    |--------------------------------------------------------------------------
    | Defines which formatting options are available in the TipTap editor
    | for HTML and Markdown translation types.
    */
    'editor' => [
        'headings'      => false,
        'bold'          => true,
        'italic'        => true,
        'underline'     => true,
        'strikethrough' => false,
        'subscript'     => true,
        'superscript'   => true,
        'blockquote'    => false,
        'code-line'     => false,
        'code-block'    => false,
        'bullet'        => true,
        'ordered'       => true,
        'clear'         => true,
        'code-mode'     => false,
    ],

];
```

---

## Referencia de opciones

### `lang_dir`

**Valor por defecto:** `lang_path()` (se resuelve a `{project_root}/lang/`)

El directorio que Lingua lee al sincronizar archivos a la base de datos y al que escribe al exportar de vuelta a archivos. Cámbialo si tus archivos de traducción se encuentran en una ubicación no estándar.

### `default_locale`

**Valor por defecto:** `config('app.locale', 'en')`

Se usa como respaldo durante la instalación y cuando la tabla `languages` está vacía. Después de la instalación, el valor autorizado es la fila en la tabla `languages` con `is_default = true`.

### `fallback_locale`

**Valor por defecto:** `config('app.fallback_locale', 'en')`

Comportamiento estándar de respaldo de Laravel - cuando falta una clave en el idioma activo, se intenta con este idioma.

### `middleware`

**Valor por defecto:** `['web']`

::: danger Requisito de producción
Siempre agrega al menos `'auth'` antes de desplegar. Sin ello, cualquiera que conozca la URL puede modificar tus traducciones.
:::

```php
// Configuración típica de producción
'middleware' => ['web', 'auth'],

// Con Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// Con una política Gate personalizada
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `routes_prefix`

**Valor por defecto:** `'lingua'`

Cambia el prefijo de URL para todas las páginas de gestión de Lingua:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
// → /admin/translations/translations
```

### `session_variable`

**Valor por defecto:** `'locale'`

La clave de sesión donde Lingua almacena el idioma elegido por el usuario. Cámbiala si entra en conflicto con otro paquete.

### `selector.mode`

**Valor por defecto:** `'sidebar'`

Controla el modo de renderizado predeterminado del componente `<livewire:lingua::language-selector>`:

| Valor | Descripción |
|---|---|
| `sidebar` | Se renderiza como un elemento de navegación agrupado en la barra lateral |
| `dropdown` | Se renderiza como un botón desplegable compacto |
| `modal` | Se renderiza como un botón que abre un modal de selección de idioma |

### `selector.show_flags`

**Valor por defecto:** `true`

Determina si se muestran iconos de banderas junto a los nombres de idioma en el selector. Requiere el paquete `outhebox/blade-flags` (instalado automáticamente como dependencia).

### `editor`

Controla la barra de herramientas de TipTap para los tipos de traducción HTML y Markdown. Cada opción corresponde a una extensión de TipTap:

| Clave | Descripción |
|---|---|
| `headings` | Botones de encabezados H1–H3 |
| `bold` | **Negrita** |
| `italic` | *Cursiva* |
| `underline` | Subrayado |
| `strikethrough` | ~~Tachado~~ |
| `bullet` | Lista desordenada |
| `ordered` | Lista ordenada |
| `clear` | Botón para limpiar el formato |

::: tip
La barra de herramientas del editor es global - todos los campos de traducción HTML/Markdown comparten la misma configuración. Si necesitas control por campo, publica las vistas y personaliza el componente del editor directamente.
:::
