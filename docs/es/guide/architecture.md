# Cómo Funciona

Entender los detalles internos de Lingua facilita su configuración, depuración y extensión.

## Ciclo de vida de una solicitud

```
Browser request
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware       │  Lee 'locale' de la sesión
│  app()->setLocale($locale)  │  Recurre al predeterminado en BD
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│        Your Controller      │
│  __('auth.failed')          │  Helper estándar de Laravel
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  extiende Illuminate FileLoader
│  Traducciones BD fusionadas │  BD siempre gana en solapamientos
│  sobre archivos (modo BD)   │  (modo archivo = FileLoader estándar)
└───┬─────────────────────────┘
    │
    ▼
Translated string returned
```

## Carga de traducciones

`LinguaManager` extiende el propio `Illuminate\Translation\FileLoader` de Laravel
— **sin** dependencia de Spatie. Se registra decorando el binding del cargador del framework:

```php
$app->extend('translation.loader', function ($original, $app) {
    return new LinguaManager($app, $original);
});
```

En **modo base de datos**, para cada `(locale, grupo)` carga las traducciones basadas
en archivos a través del cargador original, luego fusiona los valores de la base de datos
encima usando `array_replace_recursive`. **El valor de la base de datos siempre gana**
en solapamientos, para que puedas sobreescribir cualquier cadena de vendor o de archivo
sin tocar los archivos fuente.

Si la tabla `language_lines` aún no existe (por ejemplo, antes de ejecutar las migraciones),
se captura una `QueryException` y `LinguaManager` recurre graciosamente al modo solo-archivos.

En **modo archivo**, `LinguaManager` se comporta como el `FileLoader` estándar —
no se realizan consultas a la base de datos. Consulta [Drivers de Almacenamiento](/es/guide/storage).

## Middleware

`LinguaMiddleware` se añade automáticamente al grupo de middleware `web` en el arranque
a través de `LinguaServiceProvider`. Se ejecuta en cada solicitud web:

```php
// Lógica simplificada
$locale = session()->get(config('lingua.session_variable'))
    ?? Language::default()?->code
    ?? config('app.locale');

app()->setLocale($locale);
app()->setFallbackLocale($defaultLocale);
session()->put(config('lingua.session_variable'), $locale);
```

## Proveedor de servicios

`LinguaServiceProvider` hace lo siguiente en el arranque:

1. **Registra componentes Blade anónimos** bajo el prefijo `lingua::`
2. **Registra componentes Livewire** bajo el espacio de nombres `lingua::`
3. **Decora el binding `translation.loader`** mediante `$app->extend(...)`,
   envolviendo el cargador de Laravel con `LinguaManager`

Dado que el proveedor *decora* en lugar de *reemplazar* el cargador principal,
se compone limpiamente con el `TranslationServiceProvider` de Laravel. El orden de
autoload de Composer gestiona el orden de arranque automáticamente.

## Esquema de base de datos

Se utilizan tres tablas (el driver `file` omite `language_lines`):

### `languages`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | bigint | Clave primaria |
| `code` | string | Código ISO 639-1 (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Código regional completo (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` o `'standard'` |
| `name` | string | Nombre en inglés (`French`) |
| `native` | string | Nombre nativo (`Français`) |
| `direction` | string | `'ltr'` o `'rtl'` |
| `is_default` | boolean | Solo una fila debe ser `true` |
| `sort` | integer | Orden de presentación (asignado automáticamente) |

### `language_lines`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | bigint | Clave primaria |
| `group` | string | Grupo de traducción (`auth`, `validation`, `single`) |
| `key` | string | Clave de traducción (`failed`, `required`) |
| `text` | json, **nullable** | `{"en": "…", "fr": "…"}` |
| `type` | string | `'text'`, `'html'` o `'markdown'` |
| `is_vendor` | boolean | `true` para cadenas de paquetes de terceros |
| `vendor` | string, nullable | Nombre del vendor (por ejemplo, `laravel`) |

La columna JSON `text` almacena **todos los locales en una sola fila**:

- Agregar un nuevo locale nunca cambia el esquema
- Una sola consulta obtiene todos los valores de locale para una clave
- Los locales faltantes simplemente no tienen clave en el objeto JSON

### `lingua_settings`

Tabla clave/valor que respalda la interfaz de Configuración (por ejemplo, el
interruptor del menú de navegación compartido).

## Conjunto de datos integrado

Lingua 2.0 incluye todos los datos de locale dentro del paquete:

- **`LocaleRegistry`** (`Rivalex\Lingua\Locales\LocaleRegistry`) — metadatos
  para más de 129 locales. `Lingua::info($locale)` devuelve un objeto de valor
  `LocaleInfo` de solo lectura (`->name`, `->native`, `->direction`,
  `->regional`, `->code`, `->type`), o `null` para locales desconocidos.
- **Traducciones integradas** — 26 locales × 7 grupos, 5902 cadenas, alineadas
  con Laravel **v13.14.0**. Un `NotificationProjector` deriva las cadenas de
  notificación. `lingua:add` inicializa desde este conjunto de datos sin llamadas
  de red.

## Arquitectura de caché

En el modo base de datos, Lingua almacena en caché las traducciones **quirúrgicamente**
por `(locale, grupo)`:

- Las claves tienen el aspecto de `lingua.trans.{locale}.{grupo}`
- Al guardar/eliminar un `Translation`, solo se ejecuta
  `Cache::forget('lingua.trans.{locale}.{grupo}')` para las claves afectadas —
  **no** hay ningún `cache:clear` global en ninguna ruta de sincronización
- El almacén y el prefijo son configurables mediante `cache.store` / `cache.prefix`
- La caché es una optimización, la base de datos es la fuente de verdad: si el almacén de caché no está disponible (por ejemplo, un timeout de Redis), las lecturas y la escritura de respaldo tras un fallo recurren a la base de datos. La excepción se notifica, y un cortacircuitos con alcance de petición omite el almacén durante el resto de la petición. La invalidación (`forget`) **no** está protegida: un `forget` fallido se propaga, de modo que una entrada obsoleta nunca puede sobrevivir a la recuperación del almacén

## Modelos

| Modelo | Tabla | Extiende |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `Illuminate\Database\Eloquent\Model` |

`Translation` proporciona `getTranslationsForGroup()`, helpers de sincronización,
helpers de estadísticas y `forgetTranslation()` — que lanza
`VendorTranslationProtectedException` para filas de vendor. El scope de consulta
`scopeOrdered()` reemplaza al antiguo `scopeActive()` (se conserva un delegado por
compatibilidad con versiones anteriores).
