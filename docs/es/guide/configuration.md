# Configuración

Después de la instalación, `config/lingua.php` es la única fuente de verdad para
todos los ajustes de Lingua. Esta página documenta cada clave, agrupada por área.
Las claves marcadas con <Badge type="tip" text="Nuevo en 2.0" /> no existían en 1.x.

## Configuración de locales

```php
// config/lingua.php

'lang_dir'         => lang_path(),
'base_translations_path' => null, // ★ Nuevo en 2.0
'default_locale'   => config('app.locale', 'en'),
'fallback_locale'  => config('app.fallback_locale', 'en'),
'session_variable' => 'locale',
```

### `lang_dir`

**Por defecto:** `lang_path()` — se resuelve a `{project_root}/lang/`.

El directorio que Lingua lee al sincronizar archivos a la base de datos y al que
escribe al exportar de vuelta a archivos.

### `base_translations_path` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `null`

Sustitución opcional para la ruta desde la que Lingua lee el conjunto de datos de
traducción **integrado**. Déjalo en `null` para usar el conjunto de datos incluido
en el paquete.

### `default_locale`

**Por defecto:** `config('app.locale', 'en')`

Se usa como respaldo durante la instalación y cuando la tabla `languages` está vacía.
Después de la instalación, el valor autorizado es la fila en la tabla `languages`
con `is_default = true`.

### `fallback_locale`

**Por defecto:** `config('app.fallback_locale', 'en')`

Respaldo estándar de Laravel — cuando falta una clave en el locale activo,
se prueba este locale a continuación.

### `session_variable`

**Por defecto:** `'locale'`

La clave de sesión donde Lingua almacena el locale elegido por el usuario.

---

## Seguridad y acceso

```php
'middleware' => ['web', 'auth'],
'gate'       => env('LINGUA_GATE', null), // ★ Nuevo en 2.0
```

### `middleware`

**Por defecto:** `['web', 'auth']` <Badge type="warning" text="Cambiado en 2.0" />

::: tip Seguro por defecto
En 2.0 el valor por defecto es `['web', 'auth']` — la interfaz de gestión **no**
es accesible públicamente desde el primer momento. En 1.x era `['web']`.
:::

```php
// Con Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// Con una política Gate personalizada
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `gate` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `env('LINGUA_GATE', null)`

Cuando se establece, Lingua añade `can:{gate}` a todas las rutas de administración.
Define la puerta en un proveedor de servicios:

```env
LINGUA_GATE=manage-translations
```

```php
Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

Consulta la [referencia de seguridad](/es/guide/security#autenticacion).

---

## Enrutamiento

```php
'routes_prefix'           => 'lingua',
'routes_extra_parameters' => null,  // ★ Nuevo en 2.0
'navigate'                => false, // ★ Nuevo en 2.0 (valor por defecto cambiado)
'layout'                  => null,  // ★ Nuevo en 2.0
```

### `routes_prefix`

**Por defecto:** `'lingua'`

Cambia el prefijo de URL para todas las páginas de gestión de Lingua:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
```

### `routes_extra_parameters` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `null`

Sufijo parametrizado opcional añadido al prefijo de ruta — útil para prefijos
con alcance de tenant o sección.

### `navigate` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `false` <Badge type="warning" text="Cambiado en 2.0" />

Controla `wire:navigate` en los enlaces internos de Lingua. El valor por defecto
ahora es `false` (redirecciones de página completa), lo que evita casos límite en
la navegación SPA. Actívalo con `'navigate' => true`.

### `layout` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `null`

Proporciona un layout Blade personalizado para las vistas de Lingua. Déjalo en
`null` para usar el layout integrado del paquete.

---

## Navegación

```php
'nav' => [
    'enabled' => true, // ★ Nuevo en 2.0
],
'links' => [
    'translations' => [          // ★ Nuevo en 2.0
        'enabled' => true,
        'route'   => 'lingua.translations',
    ],
],
```

### `nav.enabled` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `true`

Activa o desactiva el menú de navegación compartido `x-lingua::nav` que aparece en
las cinco páginas de Lingua. También puede activarse desde la interfaz de Configuración.

### `links.translations` <Badge type="tip" text="Nuevo en 2.0" />

Controla la entrada "Traducciones" en el menú compartido: si se muestra (`enabled`)
y a qué ruta apunta (`route`).

---

## Interfaz de usuario

```php
'ui' => [
    'sticky_top' => 0, // ★ Nuevo en 2.0
],
'selector' => [
    'mode'       => 'sidebar',  // 'sidebar' | 'modal' | 'dropdown' | 'headless'
    'show_flags' => true,
],
'editor' => [
    'headings' => false, 'bold' => true, 'italic' => true,
    'underline' => true, 'strikethrough' => false,
    'subscript' => true, 'superscript' => true,
    'blockquote' => false, 'code-line' => false, 'code-block' => false,
    'bullet' => true, 'ordered' => true, 'clear' => true, 'code-mode' => false,
],
```

### `ui.sticky_top` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `0`

Desplazamiento en píxeles para las barras de herramientas fijas de Lingua. Auméntalo
si tu aplicación tiene una cabecera fija para evitar que las barras de herramientas
queden ocultas debajo de ella.

### `selector.mode`

**Por defecto:** `'sidebar'`

| Valor | Descripción |
|---|---|
| `sidebar` | Elemento de navegación agrupado en barra lateral |
| `dropdown` | Botón desplegable compacto |
| `modal` | Botón que abre un modal de selección de locale |
| `headless` | Sin renderizado integrado — usa el componente headless |

### `selector.show_flags`

**Por defecto:** `true`

Si se muestran iconos de bandera junto a los nombres de idioma.

### `editor`

Controla la barra de herramientas de texto enriquecido para los tipos de traducción
HTML y Markdown (solo driver de base de datos). Cada clave activa una opción de formato:
`headings`, `bold`, `italic`, `underline`, `strikethrough`, `subscript`,
`superscript`, `blockquote`, `code-line`, `code-block`, `bullet`,
`ordered`, `clear`, `code-mode`.

---

## Apariencia <Badge type="tip" text="Nuevo" />

```php
'dark_mode' => [
    'force' => env('LINGUA_FORCE_DARK_MODE', false),
],
```

### `dark_mode.force` <Badge type="tip" text="Nuevo" />

**Por defecto:** `env('LINGUA_FORCE_DARK_MODE', false)`

El propio CSS de Lingua usa una variante `dark:` basada en clases
(`&:where(.dark, .dark *)`), por lo que normalmente sigue al ancestro
`<html class="dark">` de la aplicación anfitriona — la misma convención
que la estrategia de clases por defecto de Tailwind. Si tu aplicación
anfitriona no tiene un interruptor de modo oscuro basado en clases (o su
estado no coincide con la preferencia real del sistema operativo o del
navegador), los propios estilos de Lingua pueden quedar sin aplicar
aunque el resto de la página se vea bien.

Establece `force` en `true` para que Lingua renderice siempre su tema
oscuro, independientemente de la aplicación anfitriona o del esquema de
color del sistema operativo. Útil al integrar Lingua en un anfitrión sin
interruptor de modo oscuro, o mientras desarrollas localmente en un
sistema en modo claro. También puede activarse en vivo desde la
[interfaz de Configuración](/es/features/settings#apariencia), que tiene
precedencia sobre este valor de configuración por defecto.

```ini
LINGUA_FORCE_DARK_MODE=true
```

---

## Driver de almacenamiento <Badge type="tip" text="Nuevo en 2.0" />

```php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

### `storage.driver`

**Por defecto:** `env('LINGUA_STORAGE_DRIVER', 'database')`

Selecciona dónde viven las traducciones:

| Driver | Comportamiento |
|---|---|
| `database` | El comportamiento completo de 1.x: tabla `language_lines`, tipos HTML/Markdown, estadísticas, importación/exportación, protección de vendor, caché quirúrgica. |
| `file` | Lee/escribe PHP+JSON en `lang/` directamente; sin tabla `language_lines`; los tipos se aplanan a texto plano. |

Esta es una característica importante — consulta [Drivers de Almacenamiento](/es/guide/storage)
para la comparación completa y el comando de cambio `lingua:storage`.

---

## Caché

```php
'cache' => [
    'store'  => env('LINGUA_CACHE_STORE', null),       // ★ Nuevo en 2.0
    'prefix' => env('LINGUA_CACHE_PREFIX', 'lingua.trans'), // ★ Nuevo en 2.0
],
```

### `cache.store` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `env('LINGUA_CACHE_STORE', null)`

Qué almacén de caché usa Lingua para el almacenamiento en caché de traducciones.
`null` usa el almacén predeterminado de tu aplicación.

### `cache.prefix` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `env('LINGUA_CACHE_PREFIX', 'lingua.trans')`

Prefijo para las claves de caché. Lingua almacena en caché las traducciones
**quirúrgicamente** por `(locale, grupo)` y olvida solo la clave afectada al
escribir — no hay ningún `cache:clear` global en ninguna ruta de sincronización.
Consulta [Arquitectura de caché](/es/guide/architecture#arquitectura-de-cache).

---

## Cargadores de traducción

```php
'translation_loaders' => [
    // Rivalex\Lingua\Loaders\YourCustomLoader::class,
],
'model'               => Rivalex\Lingua\Models\Translation::class,
'translation_manager' => Rivalex\Lingua\TranslationManager\LinguaManager::class,
```

### `translation_loaders`

Registra cargadores adicionales que implementan
`Rivalex\Lingua\Contracts\TranslationLoader`. La firma del contrato es
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### `model`

El modelo Eloquent que respalda `language_lines`. Sustitúyelo para extender
`Translation` con tu propia lógica.

### `translation_manager`

La clase del cargador de traducciones. Por defecto es
`Rivalex\Lingua\TranslationManager\LinguaManager`, que extiende
`Illuminate\Translation\FileLoader`.

---

## Extensiones

```php
'extensions' => [
    'enabled' => env('LINGUA_EXTENSIONS_ENABLED', true), // ★ Nuevo en 2.0
],
'suppress_pro_nudge' => env('LINGUA_SUPPRESS_PRO_NUDGE', false), // ★ Nuevo en 2.0
'pro_upgrade_url'    => env('LINGUA_PRO_UPGRADE_URL', 'https://lingua.rivalex.dev'), // ★ Nuevo en 2.0
```

### `extensions.enabled` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `true`

Interruptor principal para las extensiones opcionales de Lingua.

### `suppress_pro_nudge` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `false`

Establécelo en `true` para ocultar las sugerencias de actualización en la interfaz.

### `pro_upgrade_url` <Badge type="tip" text="Nuevo en 2.0" />

**Por defecto:** `https://lingua.rivalex.dev`

URL utilizada por las sugerencias de actualización cuando se muestran.
