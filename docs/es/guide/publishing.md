# Publicación de Assets

Lingua incluye varios grupos publicables para que puedas sobreescribir solo las partes que necesitas.

## Publicar todo a la vez

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## Tags individuales

### `lingua-config`

Publica el archivo de configuración.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Resultado:** `config/lingua.php`

Úsalo para personalizar rutas, middleware, modo del selector, barra de herramientas del editor u cualquier otra opción.

---

### `lingua-migrations`

Publica las migraciones de base de datos.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

**Resultado:** `database/migrations/YYYY_MM_DD_HHMMSS_create_lingua_table.php`

Úsalo si necesitas modificar el esquema de `languages` o `language_lines` - por ejemplo, para agregar índices o cambiar tipos de columna. Después de publicar, ejecuta `php artisan migrate` normalmente.

::: warning
El asistente `lingua:install` publica y ejecuta las migraciones automáticamente. Solo publica manualmente si necesitas personalizar el esquema antes de ejecutarlas.
:::

---

### `lingua-translations`

Publica las propias cadenas de traducción de la interfaz del paquete.

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Resultado:** `lang/vendor/lingua/{locale}/lingua.php`

Esto expone cada etiqueta, encabezado, botón y mensaje usado en la interfaz de Lingua. Sobreescribe cualquier cadena para:
- Traducir la interfaz al idioma de tu aplicación
- Adaptar el vocabulario al estilo de tu proyecto (p. ej. "Add language" → "Install locale")

Los archivos publicados siguen la estructura estándar de traducciones de vendor de Laravel:

```
lang/
└── vendor/
    └── lingua/
        ├── en/
        │   └── lingua.php
        ├── fr/
        │   └── lingua.php
        └── it/
            └── lingua.php
```

---

### `lingua-views`

Publica todas las vistas Blade y Livewire.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Resultado:** `resources/views/vendor/lingua/`

Úsalo para personalizar layouts, modales o el componente selector de idioma. Laravel usa automáticamente tus vistas publicadas en lugar de las predeterminadas del paquete.

```
resources/views/vendor/lingua/
├── components/
│   ├── autocomplete.blade.php
│   ├── clipboard.blade.php
│   ├── editor.blade.php
│   ├── language-flag.blade.php
│   ├── menu-group.blade.php
│   └── message.blade.php
└── livewire/
    ├── languages.blade.php
    ├── language-selector.blade.php
    ├── translations.blade.php
    └── translation/
        ├── create.blade.php
        ├── delete.blade.php
        ├── row.blade.php
        └── update.blade.php
```

::: tip
Solo publica las vistas que vayas a modificar. Las vistas no publicadas se sirven directamente desde el paquete y reciben actualizaciones del upstream automáticamente.
:::

---

### `lingua-assets`

Publica CSS y JavaScript compilados en `public/`.

```bash
php artisan vendor:publish --tag="lingua-assets"
```

**Resultado:** `public/vendor/lingua/`

Solo es necesario si sirves los assets directamente desde `public/` en lugar de a través de Vite o una CDN. **Vuelve a ejecutarlo después de cada actualización de Lingua** para mantener los assets sincronizados.

---

## Actualizar tras actualizaciones

Después de actualizar Lingua con Composer, vuelve a publicar los assets modificados:

```bash
# Siempre vuelve a publicar los assets compilados
php artisan vendor:publish --tag="lingua-assets" --force

# Vuelve a publicar las traducciones de la interfaz si no las has personalizado
php artisan vendor:publish --tag="lingua-translations" --force
```

El flag `--force` sobreescribe los archivos existentes. Omítelo para `lingua-views` y `lingua-config` para preservar tus personalizaciones locales.
