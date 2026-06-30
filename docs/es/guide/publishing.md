# Publicación de Assets

Lingua incluye varios grupos publicables para que puedas sobreescribir solo las partes
que necesitas.

## Publicar todo a la vez

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## Tags disponibles

### `lingua-config`

Publica el archivo de configuración.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Resultado:** `config/lingua.php`

Úsalo para personalizar rutas, middleware, el driver de almacenamiento, el modo del
selector, la barra de herramientas del editor, la caché u cualquier otra opción. Consulta
[Configuración](/es/guide/configuration).

---

### `lingua-migrations`

Publica las migraciones de base de datos.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

<Badge type="tip" text="Nuevo en 2.0" /> Las migraciones ahora son **conscientes
del driver** y están divididas en tres archivos separados:

| Migración | Publicada para |
|---|---|
| `create_language_lines_table` | solo el driver de base de datos |
| `create_languages_table` | ambos drivers |
| `create_lingua_settings_table` | ambos drivers |

El driver `file` omite `create_language_lines_table`. El asistente `lingua:install`
publica el conjunto correcto para el driver que eliges, por lo que solo necesitas este
tag si quieres personalizar el esquema antes de ejecutar las migraciones.

::: warning
El asistente `lingua:install` publica y ejecuta las migraciones automáticamente.
Solo publica manualmente si necesitas personalizar el esquema primero.
:::

---

### `lingua-translations`

Publica las propias cadenas de traducción de la interfaz del paquete (9 locales de UI).

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Resultado:** `lang/vendor/lingua/{locale}/lingua.php`

Sobreescribe cualquier etiqueta, encabezado, botón o mensaje usado en la interfaz de
Lingua para traducir la interfaz o adaptar el vocabulario al estilo de tu proyecto.

```
lang/
└── vendor/
    └── lingua/
        ├── en/lingua.php
        ├── fr/lingua.php
        └── it/lingua.php
```

---

### `lingua-views`

Publica todas las vistas Blade y Livewire.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Resultado:** `resources/views/vendor/lingua/`

Úsalo para personalizar layouts, modales o el selector de idioma. Laravel usa
automáticamente tus vistas publicadas en lugar de las predeterminadas del paquete.

::: tip
Solo publica las vistas que vayas a modificar. Las vistas no publicadas se sirven
desde el paquete y reciben actualizaciones del upstream automáticamente.
:::

---

### `lingua-assets` (eliminado) <Badge type="warning" text="Eliminado en 2.0" />

El tag de publicación `lingua-assets` **ya no existe**. En 2.0, los CSS/JS
compilados de Lingua se sirven internamente a través de la ruta `lingua.assets`
(con jaula realpath — consulta
[Seguridad](/es/guide/security#seguridad-de-assets)). No hay nada que publicar
o copiar en `public/`, ni nada que volver a publicar después de una actualización.

---

## Actualizar tras actualizaciones

Después de actualizar Lingua con Composer, vuelve a publicar las traducciones de la
UI si no las has personalizado y fusiona las nuevas claves de configuración:

```bash
# Volver a publicar las traducciones de la UI (sobreescribe)
php artisan vendor:publish --tag="lingua-translations" --force

# Volver a publicar la configuración para recoger las nuevas claves, luego fusiona manualmente
php artisan vendor:publish --tag="lingua-config" --force
```

El flag `--force` sobreescribe los archivos existentes. Omítelo para `lingua-views`
y `lingua-config` para preservar tus personalizaciones locales y fusionar las nuevas
claves manualmente. Consulta la [guía de actualización](/es/guide/upgrade) para la
lista de verificación completa de 1.x → 2.0.
