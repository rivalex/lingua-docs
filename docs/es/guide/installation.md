# Instalación

Lingua incluye un asistente de instalación interactivo que se encarga de todo con un solo comando. Los pasos manuales también están documentados a continuación si prefieres más control.

## Paso 1 - Instalar con Composer

```bash
composer require rivalex/lingua
```

## Paso 2 - Ejecutar el instalador

```bash
php artisan lingua:install
```

El asistente:

1. Publicará el archivo de configuración en `config/lingua.php`
2. Publicará las migraciones de base de datos
3. Preguntará si deseas ejecutar las migraciones automáticamente
4. Inicializará la base de datos con tu idioma predeterminado (inglés por defecto) y todas sus traducciones desde Laravel Lang
5. Opcionalmente dará una estrella al repositorio en GitHub ⭐

Al finalizar verás:

```
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua package installed successfully!
```

## Paso 3 - Acceder a la interfaz

Abre tu aplicación y visita:

| Página | URL | Nombre de ruta |
|---|---|---|
| Idiomas | `your-app.test/lingua/languages` | `lingua.languages` |
| Traducciones | `your-app.test/lingua/translations` | `lingua.translations` |

Eso es todo. Lingua está funcionando.

---

## Instalación manual

Si prefieres publicar y ejecutar cada paso individualmente:

```bash
# 1. Publicar configuración
php artisan vendor:publish --tag="lingua-config"

# 2. Publicar migraciones
php artisan vendor:publish --tag="lingua-migrations"

# 3. Ejecutar migraciones
php artisan migrate

# 4. Inicializar idioma predeterminado + traducciones
php artisan db:seed --class="Rivalex\Lingua\Database\Seeders\LinguaSeeder"
```

---

## Proteger la interfaz de gestión

Por defecto, las rutas de Lingua solo usan el middleware `web` - no se aplica ningún guard de autenticación automáticamente. **Debes agregar tu propio middleware** antes de pasar a producción.

### Mediante configuración

```php
// config/lingua.php
'middleware' => ['web', 'auth'],
```

### Con guards de roles/permisos (p. ej. Spatie Permission)

```php
'middleware' => ['web', 'auth', 'role:admin'],
// o
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

::: tip
Cualquier middleware aceptado por el router de Laravel puede añadirse al array. Los cambios tienen efecto inmediato - no es necesario limpiar la caché.
:::

---

## Lista de verificación post-instalación

- [ ] Agregar middleware de autenticación en `config/lingua.php`
- [ ] Añadir el componente selector de idioma a tu layout (ver [Selector de Idioma](/es/features/language-selector))
- [ ] Configurar `dir` y `lang` en tu etiqueta `<html>` (ver [Soporte RTL/LTR](/es/features/rtl-support))
- [ ] Agregar idiomas adicionales con `php artisan lingua:add {locale}`
- [ ] Configurar la barra de herramientas del editor en `config/lingua.php` si usas traducciones HTML/Markdown
