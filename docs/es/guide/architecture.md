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
└──────────────┬──────────────┘
               │
    ▼
┌─────────────────────────────┐
│        Your Controller      │
│  __('auth.failed')          │  Helper estándar de Laravel
└──────────────┬──────────────┘
               │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  Custom TranslationLoaderManager
│  1. DB loader (Spatie)      │  La BD siempre gana ante conflictos
│  2. File loader (fallback)  │
└──────────────┬──────────────┘
               │
    ▼
Translated string returned
```

## Carga de traducciones

`LinguaManager` extiende el `TranslationLoaderManager` de Spatie. En tiempo de ejecución fusiona dos fuentes:

1. **Cargador de archivos** — lee de `lang/` como lo hace Laravel normalmente
2. **Cargador de base de datos** (cargador `Db` de Spatie) — lee de `language_lines`

Cuando la misma clave existe en ambas fuentes, **el valor de la base de datos tiene prioridad**. Esto te permite sobreescribir cualquier traducción de proveedor o basada en archivos sin tocar los archivos fuente.

Si la tabla `language_lines` aún no existe (p. ej. antes de ejecutar las migraciones), `LinguaManager` recurre graciosamente al modo solo-archivos.

## Middleware

`LinguaMiddleware` se añade automáticamente al grupo de middleware `web` en el arranque a través de `LinguaServiceProvider`. Se ejecuta en cada solicitud web:

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

`LinguaServiceProvider` hace tres cosas en el arranque:

1. **Registra componentes Blade anónimos** bajo el prefijo `lingua::`
2. **Registra componentes Livewire** bajo el espacio de nombres `lingua::`
3. **Reemplaza los singletons `translator` y `translation.loader`** en el contenedor IoC con las implementaciones personalizadas de Lingua

Dado que el proveedor de servicios reemplaza el binding del traductor principal, es importante que arranque *después* del `TranslationServiceProvider` de Laravel. El orden de autocarga de Composer lo gestiona automáticamente.

## Esquema de base de datos

Se utilizan dos tablas:

### `languages`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | bigint (auto-increment) | Clave primaria |
| `code` | string | Código ISO 639-1 (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Código regional completo (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` o `'standard'` |
| `name` | string | Nombre en inglés (`French`) |
| `native` | string | Nombre nativo (`Français`) |
| `direction` | string | `'ltr'` o `'rtl'` |
| `is_default` | boolean | Solo una fila debe ser `true` |
| `sort` | integer | Orden de presentación (asignado automáticamente) |

### `language_lines` (Spatie)

| Columna | Tipo | Notas |
|---|---|---|
| `id` | bigint (auto-increment) | Clave primaria |
| `group` | string | Grupo de traducción (`auth`, `validation`, `single`) |
| `key` | string | Clave de traducción (`failed`, `required`) |
| `text` | json | `{"en": "…", "fr": "…", "it": "…"}` |
| `type` | string | `'text'`, `'html'` o `'markdown'` |
| `is_vendor` | boolean | `true` para cadenas de paquetes de terceros |
| `vendor` | string, nullable | Nombre del proveedor (p. ej. `spatie`, `laravel`) |

La columna JSON `text` almacena **todos los idiomas en una sola fila**. Este diseño implica:
- Agregar un nuevo idioma nunca cambia el esquema
- Una sola consulta obtiene todos los valores de idioma para una clave
- Los idiomas faltantes simplemente no tienen clave en el objeto JSON

## Seeder

`LinguaSeeder` se llama una vez durante `lingua:install`. Este:

1. Lee `config('lingua.default_locale')` (por defecto `config('app.locale')`)
2. Obtiene metadatos del idioma de `laravel-lang/locales`
3. Crea un registro `Language` con `is_default = true`
4. Llama a `lingua:add {locale}` para instalar los archivos de idioma
5. Llama a `lingua:sync-to-database` para importar todas las cadenas

## Modelos

| Modelo | Tabla | Extiende |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `LanguageLine` de Spatie |

`Translation` hereda los métodos `setTranslation()` y `forgetTranslation()` de Spatie y añade scopes específicos de Lingua, métodos de sincronización y helpers de estadísticas.
