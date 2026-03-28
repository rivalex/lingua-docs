# Inicio Rápido

Esta guía te lleva desde una instalación nueva de Lingua hasta una aplicación completamente multilingüe en minutos.

## 1. Instalar e inicializar

```bash
composer require rivalex/lingua
php artisan lingua:install
```

El inglés es ahora tu idioma predeterminado y todas las cadenas de traducción de Laravel/vendor han sido importadas a la base de datos.

## 2. Agregar tu segundo idioma

```bash
php artisan lingua:add fr
```

Este comando:
- Descarga los archivos de traducción en francés a través de Laravel Lang
- Crea un registro `Language` en la base de datos
- Sincroniza todas las cadenas recién descargadas en `language_lines`

Repite para todos los idiomas que necesites:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. Agregar el selector de idioma a tu layout

Abre tu layout Blade principal (p. ej. `resources/views/layouts/app.blade.php`) y:

**a) Establece `lang` y `dir` en la etiqueta `<html>`:**

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

**b) Inserta el selector de idioma donde encaje en tu diseño:**

```blade
{{-- Como grupo en la barra lateral (predeterminado) --}}
<livewire:lingua::language-selector />

{{-- Como dropdown en una barra de navegación --}}
<livewire:lingua::language-selector mode="dropdown" />
```

## 4. Usar traducciones en tu aplicación

Lingua es transparente — usa los helpers estándar de Laravel como siempre:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

El `LinguaManager` personalizado fusiona las traducciones de la base de datos sobre las basadas en archivos automáticamente. No se necesitan cambios en el código.

## 5. Traducir mediante la interfaz

Visita `/lingua/translations` para ver todas las cadenas de traducción. Para cada idioma:

1. Usa el selector de idioma (arriba a la derecha) para seleccionar el idioma destino
2. Haz clic en cualquier fila para editar el valor en línea
3. Usa **Mostrar solo faltantes** para centrarte en las cadenas sin traducir
4. Para los tipos HTML o Markdown, el editor de texto enriquecido se activa automáticamente

<Screenshot src="/screenshots/translations-page.png" alt="Página de gestión de traducciones de Lingua" caption="La página de traducciones con selector de idioma, filtro de grupo y editor en línea." />

## 6. Sincronizar de vuelta a archivos (opcional)

Si necesitas archivos de traducción en disco (para control de versiones, CI/CD u otras herramientas):

```bash
php artisan lingua:sync-to-local
```

Esto exporta todas las traducciones de la base de datos de vuelta a `lang/` en el formato PHP/JSON correcto.

---

## Patrones comunes

### Crear una nueva clave de traducción programáticamente

```php
use Rivalex\Lingua\Facades\Lingua;

// Crear la traducción en la base de datos para el idioma predeterminado
// (normalmente se hace a través de la interfaz, pero también puedes hacerlo por script)
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

// Luego, agregar traducciones para otros idiomas:
Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
Lingua::setTranslation('welcome_subject', 'Benvenuto nella nostra piattaforma!', 'it');
```

### Verificar la completitud de las traducciones

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]
```

### Cambiar el idioma programáticamente

```php
// En un controlador, middleware o servicio
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```

::: tip
El componente `LanguageSelector` gestiona el cambio de idioma para los usuarios finales automáticamente. El enfoque manual anterior es útil en comandos de consola o jobs.
:::

### Exportar solo grupos específicos

Si quieres exportar solo un subconjunto de traducciones a archivos, sincroniza a local primero y luego elimina los grupos que no necesitas de `lang/` — la base de datos siempre es la fuente de verdad en tiempo de ejecución.
