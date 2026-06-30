# Configuración

La página de Configuración (`/lingua/settings`) permite gestionar opciones de Lingua
desde el navegador sin editar archivos de configuración. Comparte el
[menú de navegación](#menu-de-navegacion) con las demás páginas de Lingua.

<Screenshot src="/screenshots/settings-page.png" alt="Página de configuración de Lingua" caption="Página de configuración — tarjeta de Enrutamiento y Navegación con el interruptor del menú de navegación." />

## Cómo funcionan las configuraciones

Las configuraciones se almacenan en la tabla `lingua_settings` como pares clave/valor
tipados. Cadena de prioridad:

1. Tabla BD `lingua_settings` (máxima prioridad — configurada vía esta UI)
2. `config/lingua.php` (tu configuración publicada)
3. Valores predeterminados del paquete (mínima prioridad)

## Menú de navegación <Badge type="tip" text="Nuevo en 2.0" />

Lingua 2.0 incluye un menú de navegación compartido (`x-lingua::nav`) en la parte
superior de cada página de Lingua:

```
Idiomas | Traducciones | Estadísticas | Transfer | Configuración
```

La página activa se resalta automáticamente.

### Desde la UI de Configuración

Activa/desactiva el interruptor **Habilitar menú de navegación** en la tarjeta
"Enrutamiento y Navegación".

### Desde la configuración

```php
// config/lingua.php
'nav' => [
    'enabled' => env('LINGUA_NAV_ENABLED', true),
],
```

La opción de BD (interruptor de UI) tiene precedencia sobre la variable de entorno.

## Driver de almacenamiento

La página muestra el driver activo en modo solo-lectura. Para cambiarlo:

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```

Consulta [Drivers de almacenamiento](/es/guide/storage) para el flujo completo.

## Constantes disponibles

| Constante | Clave DB | Tipo | Descripción |
|---|---|---|---|
| `LinguaSetting::KEY_NAV_ENABLED` | `lingua.nav.enabled` | bool | Mostrar/ocultar el menú de navegación compartido |

## Acceso programático

```php
use Rivalex\Lingua\Models\LinguaSetting;

// Leer
$navEnabled = LinguaSetting::get(LinguaSetting::KEY_NAV_ENABLED, default: true);

// Escribir
LinguaSetting::set(LinguaSetting::KEY_NAV_ENABLED, false);
```

El componente Livewire `lingua::settings` despacha un evento `settings-saved` después
de guardar — consulta [Eventos](/es/api/events).
