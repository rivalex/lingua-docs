# Sincronización Bidireccional

Lingua puede importar traducciones desde archivos locales a la base de datos y exportarlas de vuelta - dándote lo mejor de ambos mundos: **runtime gestionado por base de datos** y **control de versiones basado en archivos**.

## Las dos direcciones

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (DB)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄── lingua:sync-to-local
                      ─┘
```

## Sincronizar a la base de datos

Importa todos los archivos de traducción de `lang/` (y sus subdirectorios) en la tabla `language_lines`.

```bash
php artisan lingua:sync-to-database
```

### Qué se importa

- `lang/{locale}/*.php` - archivos de traducción PHP estándar
- `lang/{locale}.json` - archivos de traducción JSON
- `lang/vendor/{package}/{locale}/*.php` - traducciones de paquetes de proveedores

### Comportamiento de upsert

Lingua usa `updateOrCreate` con coincidencia en `group` + `key`. Esto significa:
- **Las claves nuevas** se insertan
- **Las claves existentes** tienen su JSON `text` fusionado - los valores que has editado en la interfaz se **preservan**
- **La detección de tipo** se ejecuta sobre el valor para determinar `text` / `html` / `markdown`

### Detección automática de tipo

| Regla | Tipo asignado |
|---|---|
| La cadena contiene etiquetas HTML (`<…>`) | `html` |
| La cadena se analiza como Markdown (encabezados, listas, etc.) | `markdown` |
| Ninguna de las anteriores | `text` |

::: tip
La detección de tipo es conservadora - solo asigna `html` o `markdown` cuando el contenido claramente coincide. Las cadenas simples siempre obtienen `text`. Puedes cambiar el tipo manualmente mediante el modal de edición.
:::

### Mediante el facade

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
```

::: warning
El facade llama a `Translation::syncToDatabase()` internamente, que es una llamada estática. En comandos Artisan y componentes Livewire, se usa `app(Translation::class)->syncToDatabase()` para que Mockery pueda interceptarlo en los tests.
:::

---

## Sincronizar a archivos locales

Exporta todas las traducciones de `language_lines` de vuelta a archivos PHP y JSON en `lang/`.

```bash
php artisan lingua:sync-to-local
```

### Qué se exporta

- Todas las traducciones no-vendor → `lang/{locale}/{group}.php`
- Claves de grupo JSON (`single`) → `lang/{locale}.json`
- Traducciones de proveedores → `lang/vendor/{vendor}/{locale}/{group}.php`

### Casos de uso

- **Control de versiones** - confirma los archivos exportados para rastrear los cambios de traducción a lo largo del tiempo
- **Pipelines de despliegue** - exporta antes de desplegar si las herramientas downstream esperan traducciones basadas en archivos
- **Copias de seguridad** - crea un snapshot en el tiempo de todas las traducciones
- **Otras herramientas** - exporta para usar en un servicio de gestión de traducciones o un importador CSV

### Mediante el facade

```php
Lingua::syncToLocal();
```

---

## Actualizar desde Laravel Lang

Obtiene las últimas cadenas de traducción del ecosistema `laravel-lang` y las sincroniza a la base de datos. Útil después de actualizar Laravel o agregar un nuevo paquete que incluye traducciones.

```bash
php artisan lingua:update-lang
```

Esto ejecuta `lang:update` (de `laravel-lang/common`) seguido de `lingua:sync-to-database`.

---

## Flujos de trabajo de sincronización automatizados

### En el despliegue

Agrega un paso post-despliegue para mantener la base de datos sincronizada con tus archivos lang confirmados:

```bash
# En tu script de despliegue o pipeline CI/CD
php artisan lingua:sync-to-database
php artisan optimize:clear
```

### Mediante el scheduler

Si tu equipo de traducción edita archivos directamente (en lugar de hacerlo a través de la interfaz), programa una sincronización periódica:

```php
// routes/console.php
Schedule::command('lingua:sync-to-database')->hourly();
```

### Al instalar paquetes

Cuando ejecutas `composer require` con un nuevo paquete que incluye traducciones:

```bash
php artisan lingua:update-lang
```

Esto recoge las nuevas cadenas del paquete instalado.

---

## Consejos y advertencias

::: tip Mantén la BD como fuente de verdad
Trata la base de datos como fuente primaria. Solo sincroniza a local cuando necesites los archivos (control de versiones, despliegue, etc.). Evita editar archivos locales directamente mientras la BD está en uso - la próxima sincronización a base de datos sobreescribirá tus ediciones si las claves ya existen.
:::

::: warning Archivos de idioma y BD desincronizados
Si agregas nuevos archivos PHP de idioma manualmente sin ejecutar `lingua:sync-to-database`, las nuevas claves solo estarán disponibles a través del cargador de archivos (menor prioridad que la BD). Ejecuta la sincronización para importarlas correctamente.
:::

::: tip Ida y vuelta completa
Una forma segura de reorganizar traducciones:
1. `lingua:sync-to-local` - exportar todo
2. Editar archivos en disco
3. `lingua:sync-to-database` - re-importar
:::
