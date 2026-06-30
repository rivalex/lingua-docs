# Sincronización Bidireccional

Lingua puede importar traducciones desde archivos locales a la base de datos y
exportarlas de vuelta — lo mejor de ambos mundos: **runtime gestionado por BD** y
**control de versiones basado en archivos**.

## Las dos direcciones

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (BD)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄── lingua:sync-to-local
                      ─┘
```

## El conjunto de datos integrado <Badge type="tip" text="Nuevo en 2.0" />

Lingua 2.0 incluye un conjunto de datos integrado de traducciones en el paquete:

- **26 locales × 7 grupos** — 5902 cadenas alineadas con Laravel **v13.14.0**
- **Sin red** — `lingua:add` inicializa locales al instante; no se llama a GitHub ni a `laravel-lang`
- **`NotificationProjector`** — deriva las cadenas de notificación desde fuentes semánticas
- **`.meta.json` v13.14.0** — verifica la versión del conjunto de datos en cualquier momento

`lingua:update-lang` actualiza los locales instalados desde este conjunto integrado
(más los archivos `lang/` locales existentes) y luego re-sincroniza a la BD.

## Sincronizar a la base de datos

Importa todos los archivos de traducción de `lang/` en la tabla `language_lines`.

```bash
php artisan lingua:sync-to-database
```

### Qué se importa

- `lang/{locale}/*.php` — archivos de traducción PHP
- `lang/{locale}.json` — archivos de traducción JSON
- `lang/vendor/{paquete}/{locale}/*.php` — traducciones de paquetes de vendor

### Comportamiento de upsert

Usa `updateOrCreate` con coincidencia en `group + key`:

- **Claves nuevas** → se insertan
- **Claves existentes** → el JSON `text` se fusiona; los valores editados en la UI se **preservan**
- **Detección de tipo** → se ejecuta sobre el valor para determinar `text` / `html` / `markdown`

### Invalidación de caché

Después de la sincronización, solo las claves `(locale, grupo)` afectadas se invalidan —
`Cache::forget('lingua.trans.{locale}.{grupo}')`. **Sin** `cache:clear` global.

### Mediante el facade

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
```

---

## Sincronizar a archivos locales

Exporta todas las traducciones de la BD a archivos PHP y JSON en `lang/`.

```bash
php artisan lingua:sync-to-local
```

::: tip Consciencia del driver
En el [modo de almacenamiento `file`](/es/guide/storage), este comando es un **no-op
sin `--force`** — el modo archivo ya usa archivos como almacén, por lo que exportar de
nuevo no tiene sentido.
:::

### Qué se exporta

- Traducciones no-vendor → `lang/{locale}/{grupo}.php`
- Grupo JSON (`single`) → `lang/{locale}.json`
- Traducciones de vendor → `lang/vendor/{vendor}/{locale}/{grupo}.php`

### Casos de uso

```bash
# Control de versiones — confirmar archivos exportados
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"

# Antes de cambiar al driver de archivos
php artisan lingua:sync-to-local
php artisan lingua:storage file
```

### Mediante el facade

```php
Lingua::syncToLocal();
```

---

## Actualizar desde el conjunto de datos integrado

Re-inicializa los locales instalados desde el conjunto de datos integrado y `lang/` local.

```bash
php artisan lingua:update-lang
```

Ejecuta esto después de:
- Actualizar el paquete Lingua (nuevas cadenas integradas)
- Instalar un nuevo paquete que incluye traducciones
- Añadir un nuevo locale que necesita relleno inicial

```php
Lingua::updateLanguages();
```

---

## Flujos de trabajo automatizados

### En el despliegue

```bash
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

### Mediante el scheduler

```php
// routes/console.php
Schedule::command('lingua:sync-to-database')->hourly();
```

---

::: tip BD como fuente de verdad
Trata la BD como fuente primaria. Sincroniza a archivos locales solo cuando los
necesitas (control de versiones, despliegue). Evita editar archivos locales directamente
mientras la BD está en uso.
:::

::: warning Archivos y BD desincronizados
Si añades archivos PHP de idioma manualmente sin ejecutar `lingua:sync-to-database`,
las nuevas claves solo estarán disponibles vía el cargador de archivos (menor prioridad).
Ejecuta la sincronización para importarlas correctamente.
:::
