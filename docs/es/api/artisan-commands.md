# Comandos Artisan

Lingua incluye seis comandos Artisan para la gestión de idiomas y traducciones desde la terminal.

## Gestión de idiomas

### `lingua:add {locale}`

Instala un nuevo idioma - descarga archivos, crea el registro en BD y sincroniza traducciones.

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**Qué hace:**
1. Obtiene metadatos del idioma de `laravel-lang/locales`
2. Ejecuta `lang:add {locale}` para instalar los archivos de idioma
3. Crea un registro `Language` en la base de datos
4. Ejecuta `lingua:sync-to-database` para importar las nuevas cadenas

**Salida:**
```
Adding language: it...
Installing language files via Laravel Lang...
Creating language record in database...
Syncing translations to database...
Language 'it' added successfully.
```

::: tip
Después de agregar un idioma, visita `/lingua/translations/it` para ver qué cadenas aún necesitan traducirse.
:::

---

### `lingua:remove {locale}`

Elimina un idioma - borra archivos, limpia la base de datos y reordena los idiomas restantes.

```bash
php artisan lingua:remove fr
```

**Qué hace:**
1. Verifica que el idioma no sea el predeterminado (aborta con un error si lo es)
2. Ejecuta `lang:rm {locale} --force` para eliminar los archivos de idioma
3. Elimina todos los valores `{locale}` de `language_lines.text`
4. Elimina el registro `Language`
5. Reordena los valores de orden de los idiomas restantes
6. Ejecuta `lingua:sync-to-database`

::: warning Protección del idioma predeterminado
No puedes eliminar el idioma predeterminado. Establece otro idioma como predeterminado primero:
```bash
php artisan lingua:add fr       # agregar el nuevo predeterminado
# luego en la interfaz: establecer el francés como predeterminado
php artisan lingua:remove en    # ahora es seguro eliminar el inglés
```
:::

---

### `lingua:update-lang`

Actualiza todos los archivos de idioma instalados mediante Laravel Lang y luego re-sincroniza a la base de datos.

```bash
php artisan lingua:update-lang
```

Ejecuta esto después de:
- Actualizar Laravel (nuevos mensajes de validación, etc.)
- Instalar un nuevo paquete que incluye traducciones
- Actualizar paquetes de `laravel-lang/*`

---

## Sincronización de traducciones

### `lingua:sync-to-database`

Importa todos los archivos de traducción PHP/JSON locales en la tabla `language_lines`.

```bash
php artisan lingua:sync-to-database
```

**Qué se importa:**
- `lang/{locale}/*.php` - archivos PHP
- `lang/{locale}.json` - archivos JSON
- `lang/vendor/{package}/{locale}/*.php` - archivos de paquetes de proveedores

Usa `updateOrCreate` con coincidencia en `group + key`, por lo que las ediciones existentes de la interfaz se preservan.

**Casos de uso típicos:**
```bash
# Después de un clone nuevo - poblar la BD desde los archivos lang confirmados
php artisan lingua:sync-to-database

# Después de lang:update - importar las nuevas cadenas
php artisan lingua:sync-to-database

# En un script de despliegue
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

### `lingua:sync-to-local`

Exporta todas las traducciones de la base de datos de vuelta a archivos PHP/JSON locales.

```bash
php artisan lingua:sync-to-local
```

**Qué se exporta:**
- Traducciones de la BD → `lang/{locale}/{group}.php`
- Grupo JSON (`single`) → `lang/{locale}.json`
- Traducciones de proveedores → `lang/vendor/{vendor}/{locale}/{group}.php`

**Casos de uso típicos:**
```bash
# Antes de confirmar - exportar el estado de la BD a archivos para control de versiones
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"

# Antes de desplegar a un servidor que lee desde archivos
php artisan lingua:sync-to-local
```

---

### `lingua:install`

El asistente de configuración interactivo inicial. Ejecutar una vez después de `composer require`.

```bash
php artisan lingua:install
```

No está diseñado para ejecutarse de nuevo después de la configuración inicial. Si necesitas volver a publicar assets individuales, usa los tags `vendor:publish` en su lugar.

---

## Referencia rápida de comandos

<div class="command-table">

| Comando | Descripción |
|---|---|
| `lingua:add {locale}` | Instalar un idioma (archivos + BD + sincronización) |
| `lingua:remove {locale}` | Eliminar un idioma (archivos + BD + sincronización) |
| `lingua:update-lang` | Actualizar archivos de idioma mediante Laravel Lang + sincronizar |
| `lingua:sync-to-database` | Importar archivos locales → base de datos |
| `lingua:sync-to-local` | Exportar base de datos → archivos locales |
| `lingua:install` | Asistente de configuración inicial interactivo |

</div>

---

## Consejos

::: tip Automatizar la sincronización en CI/CD
Agrega la sincronización a tu pipeline de despliegue para mantener la base de datos sincronizada con tu repositorio:

```yaml
# Paso de despliegue en GitHub Actions (ejemplo)
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::

::: tip Agregar múltiples idiomas a la vez
No hay un comando de agregado masivo, pero puedes encadenar llamadas en un bucle de shell:

```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::

::: tip Verificar qué se sincronizará
Antes de ejecutar `lingua:sync-to-database`, puedes previsualizar el número de archivos e idiomas que se procesarán revisando `lang/`:

```bash
ls lang/
# en  fr  it  vendor
```
:::
