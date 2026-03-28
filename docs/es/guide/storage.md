# Almacenamiento de Traducciones

Entender cómo se almacenan las traducciones te ayuda a consultarlas, importarlas y exportarlas correctamente.

## La tabla `language_lines`

Cada fila en `language_lines` representa una **cadena** traducible - no un idioma. Todos los valores de idioma se almacenan juntos en una única columna JSON `text`:

```
group      | key        | type | text
-----------|------------|------|---------------------------------------------------
validation | required   | text | {"en":"The :attribute field is required.","fr":"Le champ :attribute est obligatoire."}
auth       | failed     | text | {"en":"These credentials do not match.","it":"Le credenziali non corrispondono."}
single     | Welcome    | text | {"en":"Welcome","fr":"Bienvenue","de":"Willkommen"}
emails     | subject    | html | {"en":"<b>Welcome</b> to our platform!"}
```

### Ventajas de este diseño

- **Una fila por cadena** - no hay filas por idioma que gestionar
- **Agregar un idioma no es destructivo** - solo se agrega una nueva clave al objeto JSON
- **Las traducciones faltantes son explícitas** - si `fr` no está en el JSON, la cadena aún no está traducida
- **Una sola consulta** - un `SELECT` obtiene todos los valores de idioma para una clave

### Consultas directas

Puedes consultar `language_lines` usando la sintaxis estándar de columnas JSON de Eloquent:

```php
use Rivalex\Lingua\Models\Translation;

// Todas las traducciones que tienen un valor en francés
Translation::whereNotNull('text->fr')->get();

// Solo las traducciones en francés que faltan
Translation::whereNull('text->fr')->get();

// Encontrar una clave específica
Translation::where('key', 'required')->where('group', 'validation')->first();

// Todas las cadenas de un grupo
Translation::where('group', 'auth')->get();
```

## Tipos de traducción

Cada fila de traducción tiene un `type` que determina el editor que se usa en la interfaz:

| Tipo | Caso de uso | Detección automática al sincronizar |
|---|---|---|
| `text` | Etiquetas planas, mensajes, texto de botones | Por defecto |
| `html` | Contenido enriquecido con etiquetas HTML | La cadena contiene elementos HTML |
| `markdown` | Contenido formateado en Markdown | La cadena se analiza como Markdown |

La detección de tipo se realiza durante `lingua:sync-to-database`. Puedes cambiar el tipo en cualquier momento a través del modal de edición en la interfaz.

### Ejemplo: traducción HTML

```php
Translation::create([
    'group' => 'marketing',
    'key'   => 'hero_subtitle',
    'type'  => 'html',
    'text'  => ['en' => '<strong>Build faster</strong> with fewer tools.'],
]);
```

### Ejemplo: traducción Markdown

```php
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_body',
    'type'  => 'markdown',
    'text'  => ['en' => "# Welcome!\n\nThank you for signing up.\n\n**Your account is now active.**"],
]);
```

## Claves de traducción

Lingua usa la misma convención de dos partes `grupo.clave` que las traducciones estándar de Laravel:

| Formato | Ejemplo | Llamada a `trans()` |
|---|---|---|
| Clave de archivo PHP | `auth.failed` | `__('auth.failed')` |
| Clave JSON / single | `Welcome` | `__('Welcome')` |
| Clave de proveedor | `spatie::messages.error` | mediante espacio de nombres de proveedor |

::: tip group vs. key
La columna `group` corresponde al nombre del archivo (`auth` = `lang/en/auth.php`) y `key` corresponde a la clave del array dentro de ese archivo. Para archivos JSON, el grupo es `'single'`.
:::

## Traducciones de proveedores

Las traducciones de proveedores se marcan con `is_vendor = true` y llevan una cadena `vendor` (p. ej. `'spatie'`, `'laravel'`). Se sincronizan desde los directorios `lang/vendor/{vendor}/{locale}/`.

- **Se pueden editar** en la interfaz (para sobreescribir el texto del proveedor)
- **No se pueden eliminar** - intentarlo despacha un evento `vendor_translation_protected`
- Los campos `group` y `key` están **bloqueados** en el modal de actualización

Consulta [Traducciones de Proveedores](/es/features/vendor-translations) para más detalles.
