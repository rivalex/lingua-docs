# Drivers de Almacenamiento

<Badge type="tip" text="Nuevo en 2.0" /> Lingua 2.0 introduce un sistema de
**driver de almacenamiento** pluggable. Elige dónde viven las traducciones: en la
**base de datos** (el predeterminado con todas las funciones) o en archivos **`lang/`** normales.

```php
// config/lingua.php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

## Elegir un driver

| Característica | `database` | `file` |
|---|:---:|:---:|
| Almacén de respaldo | tabla `language_lines` | PHP + JSON en `lang/` |
| Tipos HTML / Markdown | ✅ | ❌ (aplanado a texto plano) |
| Estadísticas de traducción | ✅ | ✅ (calculadas desde archivos) |
| Importación / exportación (Transfer) | ✅ | ✅ |
| Protección de vendor | ✅ | ✅ |
| Caché quirúrgica por (locale, grupo) | ✅ | n/a |
| Botones de sincronización en la UI | ✅ | ocultos |
| Editar traducciones en la UI | ✅ | ✅ |

::: tip Regla general
Usa **database** para la experiencia más rica y las sustituciones en tiempo de ejecución.
Usa **file** cuando las traducciones deban permanecer en control de versiones o el
sistema de archivos sea la fuente de verdad.
:::

## Driver de base de datos

El predeterminado, e idéntico al comportamiento de 1.x.

- Traducciones almacenadas en la tabla `language_lines`, todos los locales en una
  columna JSON `text` por fila
- Admite tipos `text`, `html` y `markdown`, cada uno con su propio editor
- Caché quirúrgica: `Cache::forget('lingua.trans.{locale}.{grupo}')` en cada
  escritura — sin vaciado global
- Estadísticas completas, importación/exportación y protección de vendor
- Las sustituciones en tiempo de ejecución ganan sobre los archivos `lang/`
  mediante `array_replace_recursive`

## Driver de archivos

Lee y escribe archivos PHP y JSON en `lang/` directamente. **No** hay tabla
`language_lines`.

::: danger Pérdida de tipo en el modo archivo
El driver `file` solo almacena cadenas planas. Los tipos HTML y Markdown **se
aplanan a texto plano** — el editor por tipo y los metadatos de tipo no están
disponibles. Si dependes de traducciones HTML/Markdown, usa el driver de base de datos.
:::

- Sin consultas a la base de datos; se comporta como el `FileLoader` estándar de Laravel
- Los botones de sincronización están **ocultos** en la UI (los archivos *son* el almacén)
- `lingua:sync-to-local` es un **no-op sin `--force`** (la BD desde la que exportaría
  no es el almacén activo)
- Las ediciones en la UI se escriben directamente en los archivos mediante `AtomicFileWriter`
  (renombrado atómico + `opcache_invalidate` — consulta
  [Seguridad](/es/guide/security#seguridad-en-modo-archivo))

::: warning Advertencia sobre el despliegue
En plataformas que reconstruyen `lang/` desde tu repositorio en cada despliegue
(por ejemplo, Forge, Envoyer, imágenes de contenedor), las ediciones realizadas en
la UI en el modo archivo pueden **sobrescribirse** en el próximo despliegue. Confirma
los cambios en tu repositorio o usa el driver de base de datos.
:::

## Cambiar de driver

Usa el comando `lingua:storage` para cambiar en cualquier momento. **Sincroniza antes
de cambiar** para que nada se pierda.

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```

| Opción | Efecto |
|---|---|
| `--force` | Omitir las solicitudes de confirmación |
| `--write-env` | Actualizar `LINGUA_STORAGE_DRIVER` en `.env` |
| `--no-migrate` | Omitir el paso de aseguramiento de migración |

### Base de datos → archivo

Lingua **exporta** la base de datos a `lang/` primero, advirtiendo sobre las cadenas
HTML/Markdown que perderán su tipo, luego cambia el driver activo.

### Archivo → base de datos

Lingua **sincroniza** `lang/` a la base de datos y asegura que la migración
`language_lines` se haya ejecutado, luego cambia.

## Instalar con elección de driver

El instalador interactivo pregunta qué driver usar y publica las migraciones
**conscientes del driver** — el driver `file` omite completamente la migración
`language_lines`:

```bash
php artisan lingua:install
```

Consulta [Instalación](/es/guide/installation).

## Desinstalar

`lingua:uninstall` desmonta Lingua de forma segura:

```bash
php artisan lingua:uninstall
```

**Exporta la base de datos a `lang/` primero**, luego elimina las tres tablas de
Lingua (`language_lines`, `languages`, `lingua_settings`). Tu directorio `lang/`
se conserva.

| Opción | Efecto |
|---|---|
| `--force` | Omitir las solicitudes de confirmación |
| `--keep-config` | Mantener `config/lingua.php` en su lugar |
| `--keep-published` | Mantener las vistas/migraciones publicadas en su lugar |

## Consultas directas (driver de base de datos)

```php
use Rivalex\Lingua\Models\Translation;

// Todas las traducciones que tienen un valor en francés
Translation::whereNotNull('text->fr')->get();

// Solo las traducciones en francés que faltan
Translation::whereNull('text->fr')->get();

// Una clave específica
Translation::where('group', 'validation')->where('key', 'required')->first();
```

Consulta [Traducciones de Vendor](/es/features/vendor-translations) para ver cómo
las cadenas de paquetes están protegidas en ambos drivers.
