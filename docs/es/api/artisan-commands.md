# Comandos Artisan

Lingua incluye ocho comandos Artisan para la gestión de idiomas y traducciones.

## Referencia rápida

| Comando | Descripción |
|---|---|
| `lingua:install` | Asistente de configuración inicial interactivo |
| `lingua:storage {driver}` | Cambiar el driver de almacenamiento activo |
| `lingua:add {locale}` | Instalar un idioma (conjunto integrado + BD) |
| `lingua:remove {locale}` | Eliminar un idioma (archivos + BD + reordenación) |
| `lingua:update-lang` | Re-inicializar desde el conjunto de datos integrado |
| `lingua:sync-to-database` | Importar archivos `lang/` locales → `language_lines` |
| `lingua:sync-to-local` | Exportar BD → archivos `lang/` locales |
| `lingua:uninstall` | Desmontar Lingua de forma segura (exportar + eliminar tablas) |

---

## `lingua:install`

El asistente de configuración inicial interactivo. Ejecutar una vez tras `composer require`.

```bash
php artisan lingua:install
```

- Pregunta qué **driver de almacenamiento** usar (`database` o `file`)
- Publica las **migraciones conscientes del driver** (el driver `file` omite `language_lines`)
- Ejecuta `migrate`
- Publica `config/lingua.php` y los assets

No está diseñado para ejecutarse de nuevo tras la configuración. Para volver a publicar
assets individuales, usa los tags `vendor:publish`.

---

## `lingua:storage {driver}` <Badge type="tip" text="Nuevo en 2.0" />

Cambia el driver de almacenamiento activo.

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```

| Opción | Efecto |
|---|---|
| `--force` | Omitir las solicitudes de confirmación |
| `--write-env` | Actualizar `LINGUA_STORAGE_DRIVER` en `.env` |
| `--no-migrate` | Omitir el paso de aseguramiento de migración |

**Base de datos → archivo:** exporta la BD a `lang/` primero, avisa sobre cadenas
HTML/Markdown que perderán su tipo, luego cambia el driver.

**Archivo → base de datos:** sincroniza `lang/` a la BD y asegura que la migración
`language_lines` se haya ejecutado, luego cambia.

---

## `lingua:add {locale}`

Instala un nuevo idioma desde el conjunto de datos integrado.

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

<Badge type="tip" text="Cambiado en 2.0" /> Ya no obtiene archivos de GitHub ni llama
a `laravel-lang`. El locale se inicializa desde el conjunto de datos integrado
(5902 cadenas, 26 locales, Laravel v13.14.0) al instante.

**Qué hace:**
1. Lee metadatos del locale desde `LocaleRegistry`
2. Crea el registro `Language` en la BD
3. Inicializa sus cadenas desde el conjunto integrado
4. Registra el locale en el almacenamiento activo

::: tip
Después de agregar un idioma, visita `/lingua/translations/it` para ver qué cadenas
aún necesitan traducirse.
:::

---

## `lingua:remove {locale}`

Elimina un idioma — limpia la BD y reordena los restantes.

```bash
php artisan lingua:remove fr
```

**Qué hace:**
1. Verifica que el idioma no sea el predeterminado (aborta con error si lo es)
2. Elimina todos los valores `{locale}` de `language_lines.text`
3. Elimina el registro `Language`
4. Reordena los valores de orden de los restantes

::: warning Protección del idioma predeterminado
No puedes eliminar el idioma predeterminado. Establece otro como predeterminado primero.
:::

---

## `lingua:update-lang`

Re-inicializa los locales instalados desde el conjunto de datos integrado más los
archivos `lang/` locales existentes, luego sincroniza a la BD.

```bash
php artisan lingua:update-lang
```

Ejecuta esto tras:
- Actualizar el paquete Lingua (nuevas cadenas integradas)
- Instalar un nuevo paquete con traducciones
- Añadir un nuevo locale que necesita relleno inicial

---

## `lingua:sync-to-database`

Importa todos los archivos de traducción PHP/JSON de `lang/` en la tabla `language_lines`.

```bash
php artisan lingua:sync-to-database
```

**Qué se importa:**
- `lang/{locale}/*.php` — archivos PHP
- `lang/{locale}.json` — archivos JSON
- `lang/vendor/{paquete}/{locale}/*.php` — traducciones de vendor

Usa `updateOrCreate` por `group + key` — las ediciones existentes se preservan.
La caché se invalida quirúrgicamente por `(locale, grupo)` afectado.

**Casos de uso típicos:**
```bash
# Tras un clone nuevo — poblar la BD desde archivos lang confirmados
php artisan lingua:sync-to-database

# En un script de despliegue
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

## `lingua:sync-to-local`

Exporta todas las traducciones de la BD a archivos PHP/JSON locales en `lang/`.

```bash
php artisan lingua:sync-to-local
```

::: tip Consciencia del driver
En el modo de almacenamiento `file`, este comando es un **no-op sin `--force`** —
los archivos ya son el almacén.
:::

**Casos de uso típicos:**
```bash
# Antes de confirmar — exportar el estado de la BD a archivos para control de versiones
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"
```

---

## `lingua:uninstall` <Badge type="tip" text="Nuevo en 2.0" />

Desmonta Lingua de forma segura.

```bash
php artisan lingua:uninstall
```

**Qué hace:**
1. Exporta la BD a `lang/` (tu directorio `lang/` se conserva)
2. Elimina las tres tablas de Lingua (`language_lines`, `languages`, `lingua_settings`)

| Opción | Efecto |
|---|---|
| `--force` | Omitir solicitudes de confirmación |
| `--keep-config` | Mantener `config/lingua.php` |
| `--keep-published` | Mantener vistas/migraciones publicadas |
