# Instalación

Lingua incluye un asistente de instalación interactivo que se encarga de todo
con un solo comando. Los pasos manuales también están documentados a continuación
si prefieres más control.

## Paso 1 — Instalar con Composer

```bash
composer require rivalex/lingua
```

Ese es el único paquete que necesitas. Lingua 2.0 incluye sus propios datos de locale
y conjunto de datos de traducción, por lo que no hay nada más que instalar.

::: tip ¿Actualizando desde 1.x?
Composer elimina automáticamente la antigua dependencia `spatie/laravel-translation-loader`.
Si tu propio `composer.json` todavía lista `laravel-lang/common`, elimínalo:
`composer remove laravel-lang/common`.
Consulta la [guía de actualización](/es/guide/upgrade) completa.
:::

## Paso 2 — Ejecutar el instalador

```bash
php artisan lingua:install
```

El asistente es interactivo. Usando
[Laravel Prompts](https://laravel.com/docs/prompts), te pide que elijas
un **driver de almacenamiento** con un selector de teclas de dirección:

| Driver | Úsalo cuando… |
|---|---|
| **`database`** *(recomendado)* | Quieres el conjunto completo de características: tipos HTML/Markdown, estadísticas, importación/exportación, protección de vendor y caché quirúrgica. |
| **`file`** | Mantienes las traducciones en control de versiones o ejecutas en un entorno de solo lectura/CI y prefieres archivos `lang/` normales. |

El asistente luego:

1. Publica el archivo de configuración en `config/lingua.php`
2. Publica las migraciones **conscientes del driver** (el driver `file` omite la
   migración `language_lines`)
3. Pregunta si ejecutar las migraciones automáticamente
4. Inicializa la base de datos con tu idioma predeterminado y sus traducciones del
   conjunto de datos integrado — **sin descargas de GitHub**
5. Opcionalmente da una estrella al repositorio en GitHub ⭐

Al finalizar verás:

```
✓ Driver selected          →  database
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua installed successfully!
```

## Paso 3 — Acceder a la interfaz

Abre tu aplicación y visita:

| Página | URL | Nombre de ruta |
|---|---|---|
| Idiomas | `your-app.test/lingua/languages` | `lingua.languages` |
| Traducciones | `your-app.test/lingua/translations` | `lingua.translations` |
| Estadísticas | `your-app.test/lingua/statistics` | `lingua.statistics` |
| Transferencia | `your-app.test/lingua/transfer` | `lingua.transfer` |
| Configuración | `your-app.test/lingua/settings` | `lingua.settings` |

Eso es todo. Lingua está funcionando.

---

## Instalación manual

Si prefieres publicar y ejecutar cada paso individualmente:

```bash
# 1. Publicar configuración
php artisan vendor:publish --tag="lingua-config"

# 2. Publicar migraciones (conscientes del driver)
php artisan vendor:publish --tag="lingua-migrations"

# 3. Ejecutar migraciones
php artisan migrate

# 4. Agregar tu idioma predeterminado e inicializar sus traducciones
php artisan lingua:add en
```

Consulta [Publicación de Assets](/es/guide/publishing) para la lista completa de tags.

---

## Proteger la interfaz de gestión

<Badge type="tip" text="Nuevo en 2.0" /> Lingua 2.0 es **seguro por defecto**. Las
rutas de gestión se publican con el middleware `['web', 'auth']` aplicado
automáticamente — los visitantes anónimos no pueden acceder a la interfaz.

### Restringir el acceso con una puerta (gate)

Para el acceso basado en roles, define una puerta de autorización y apunta Lingua
hacia ella con la variable de entorno `LINGUA_GATE`. Lingua añade `can:{gate}`
a sus rutas de administración:

```env
LINGUA_GATE=manage-translations
```

```php
// app/Providers/AppServiceProvider.php — boot()
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $user) => $user->hasRole('admin'));
```

También puedes editar el array de middleware directamente:

```php
// config/lingua.php
'middleware' => ['web', 'auth', 'role:admin'],
```

::: tip
Cualquier middleware aceptado por el router de Laravel puede añadirse al array.
Los cambios tienen efecto inmediato — no es necesario limpiar la caché.
:::

Consulta la [referencia de seguridad](/es/guide/security) para la descripción
completa del refuerzo.

---

## Lista de verificación post-instalación

- [ ] Confirmar que el driver de almacenamiento en `config/lingua.php` coincide con tu
      despliegue (`database` o `file`)
- [ ] Opcionalmente establecer `LINGUA_GATE` para el acceso basado en roles
- [ ] Añadir el componente selector de idioma a tu layout (ver
      [Selector de Idioma](/es/features/language-selector))
- [ ] Establecer `dir` y `lang` en tu etiqueta `<html>` (ver
      [Soporte RTL/LTR](/es/features/rtl-support))
- [ ] Añadir idiomas adicionales con `php artisan lingua:add {locale}`
- [ ] Configurar la barra de herramientas del editor en `config/lingua.php` si usas
      traducciones HTML/Markdown (driver de base de datos)
