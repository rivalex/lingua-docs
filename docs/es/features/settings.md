# Configuración

La página de Configuración te permite configurar el comportamiento UI de Lingua desde el navegador — sin editar archivos de configuración ni necesidad de redespliegue.

Navega a `/lingua/settings` o enlaza desde tu panel de administración:

```blade
<a href="{{ route('lingua.settings') }}">Configuración de Lingua</a>
```

<Screenshot src="/screenshots/settings-page.png" alt="Página de Configuración de Lingua" caption="La página de configuración con los controles de modo selector e iconos de banderas." />

## Cómo funcionan las configuraciones

Las configuraciones se almacenan en la tabla de base de datos `lingua_settings` como pares clave/valor tipados. En cada solicitud, Lingua lee primero desde la base de datos, luego recurre a `config/lingua.php`, y luego a los valores por defecto del código.

**Cadena de prioridad:**
1. Tabla DB `lingua_settings` (máxima prioridad — configurada a través de esta UI)
2. `config/lingua.php` (tu config publicada)
3. Valores por defecto del paquete (mínima prioridad)

Puedes mantener tu `config/lingua.php` como línea base y sobreescribir configuraciones específicas por entorno a través de la UI sin tocar archivos.

## Modo selector

Controla cómo se renderiza el componente `<livewire:lingua::language-selector />` para tus usuarios finales.

| Modo | Descripción |
|---|---|
| `sidebar` | Se renderiza como una sección de navegación agrupada (por defecto) |
| `modal` | Se renderiza como un botón que abre un modal completo de selección de idioma |
| `dropdown` | Se renderiza como un botón dropdown compacto |
| `headless` | Sin renderizado integrado — implementas la UI tú mismo |

::: tip Modo headless
Cuando se establece en `headless`, el selector integrado no renderiza nada. Usa `<livewire:lingua::headless-language-selector />` en su lugar para construir un selector completamente personalizado. Ver [Selector Headless](./language-selector#modo-headless) para la documentación completa.
:::

## Mostrar iconos de banderas

Activa o desactiva la visualización de iconos de banderas de países junto a los nombres de idiomas en el selector. Cuando está desactivado, solo se muestra el nombre del idioma.

Los iconos de banderas se asocian al código `regional` del idioma (p. ej. `en_US` → 🇺🇸). Si no hay código regional establecido, la bandera recurre de forma elegante.

## Acceso programático

Puedes leer y escribir configuraciones en PHP usando el modelo `LinguaSetting`:

```php
use Rivalex\Lingua\Models\LinguaSetting;

// Leer con fallback config()
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

$showFlags = LinguaSetting::get(
    LinguaSetting::KEY_SHOW_FLAGS,
    config('lingua.selector.show_flags', true)
);

// Escribir
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_SHOW_FLAGS, false);
```

Constantes disponibles:

| Constante | Clave | Tipo |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |

::: warning Migración requerida
La tabla `lingua_settings` es creada por la migración `create_lingua_settings_table`. Si actualizaste desde la versión 1.0.x, ejecuta `php artisan migrate` para crearla.
:::
