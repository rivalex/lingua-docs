# Inicio Rápido

Esta guía te lleva desde una instalación nueva de Lingua hasta una aplicación
completamente multilingüe en minutos.

## 1. Instalar e inicializar

```bash
composer require rivalex/lingua
php artisan lingua:install
```

Elige el driver **database** cuando se te solicite (recomendado). El inglés se convierte
en tu idioma predeterminado y las cadenas de traducción integradas se importan a la
base de datos — sin descargas de GitHub.

::: tip Seguro por defecto
Las rutas de gestión están protegidas por `['web', 'auth']` automáticamente.
Establece `LINGUA_GATE` para el acceso basado en roles — consulta
[Instalación](/es/guide/installation#proteger-la-interfaz-de-gestion).
:::

## 2. Agregar tu segundo idioma

```bash
php artisan lingua:add fr
```

Este comando es **nativo de la BD**: inicializa las cadenas en francés desde el conjunto
de datos integrado y crea un registro `Language`. **No** descarga archivos ni escribe
en `lang/`.

Repite para todos los locales que necesites:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. Agregar el selector de idioma a tu layout

Abre tu layout Blade principal (por ejemplo,
`resources/views/layouts/app.blade.php`):

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

::: tip El cambio de locale recarga la página actual
Cuando un usuario cambia de locale, Lingua recarga la **página en la que está**
(no la página de inicio), protegido contra redirecciones abiertas. Consulta
[Seguridad](/es/guide/security#proteccion-contra-redirecciones-abiertas).
:::

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

En el modo base de datos, `LinguaManager` fusiona las traducciones de la base de datos
sobre las basadas en archivos automáticamente. No se necesitan cambios en el código.

## 5. Traducir mediante la interfaz

Visita `/lingua/translations` para ver todas las cadenas de traducción. Para cada idioma:

1. Usa el selector de locale (arriba a la derecha) para seleccionar el idioma destino
2. Haz clic en cualquier fila para editar el valor en línea
3. Usa **Mostrar solo faltantes** para centrarte en las cadenas sin traducir
4. Para los tipos HTML o Markdown, el editor de texto enriquecido se activa automáticamente

<Screenshot src="/screenshots/translations-page.png" alt="Página de gestión de traducciones de Lingua" caption="La página de traducciones con selector de locale, filtro de grupo y editor en línea." />

## 6. Importar / exportar con la página de Transferencia

¿Necesitas editar traducciones en masa en una hoja de cálculo, o enviar un archivo a
una agencia de traducción? Visita `/lingua/transfer`:

- **Exportar** a CSV, JSON, XLSX u ODS — bilingüe, multi-locale o
  disposición JSON-nativa
- **Importar** con una **vista previa de diferencias en seco** antes de que se escriba nada

XLSX/ODS requieren el paquete opcional `openspout/openspout`; CSV y JSON funcionan
de serie.

## 7. Sincronizar de vuelta a archivos (opcional)

Si necesitas archivos de traducción en disco (para control de versiones o CI/CD):

```bash
php artisan lingua:sync-to-local
```

Esto exporta todas las traducciones de la BD de vuelta a `lang/` en el formato
PHP/JSON correcto.

---

## Patrones comunes

### Traducir una nueva clave programáticamente

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
```

### Inspeccionar un locale

```php
use Rivalex\Lingua\Facades\Lingua;

$info = Lingua::info('fr');

if ($info !== null) {
    $info->name;      // "French"
    $info->native;    // "Français"
    $info->direction; // "ltr"
}
```

::: warning Cambiado en 2.0
`Lingua::info()` ahora devuelve `?LocaleInfo` y retorna `null` para locales
desconocidos en lugar de lanzar una excepción. Siempre guarda con `if ($info !== null)`.
:::

### Cambiar de locale programáticamente

```php
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```
