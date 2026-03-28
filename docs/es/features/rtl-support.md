# Soporte RTL / LTR

Lingua almacena la dirección del texto (`ltr` o `rtl`) para cada idioma instalado y la expone mediante `Lingua::getDirection()`. Configurar el soporte RTL correcto requiere un pequeño cambio único en tu layout Blade.

## Idiomas RTL soportados (ejemplos)

| Idioma | Nombre | Dirección |
|---|---|---|
| `ar` | Árabe | `rtl` |
| `he` | Hebreo | `rtl` |
| `fa` | Persa (Farsi) | `rtl` |
| `ur` | Urdu | `rtl` |
| `ps` | Pastún | `rtl` |
| `ug` | Uigur | `rtl` |

Todos los demás idiomas (incluyendo europeos, asiáticos y la mayoría de los idiomas con escritura latina) devuelven `ltr`.

## Configurar tu layout Blade

Agrega los atributos `lang` y `dir` a la etiqueta `<html>` en tu archivo de layout principal:

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` usa el idioma actual de la aplicación automáticamente, por lo que sigue cada cambio de idioma sin necesidad de código adicional.

::: tip ¿Por qué tanto `lang` como `dir`?
- `lang` le dice al navegador y a los lectores de pantalla qué idioma usar para pronunciación, separación en sílabas y corrección ortográfica.
- `dir` le dice al navegador, CSS y motores de layout la dirección del flujo del texto. Ambos son necesarios para el cumplimiento completo de accesibilidad (WCAG 2.1 AA).
:::

## Idioma explícito

Pasa un idioma explícito cuando necesites la dirección fuera del contexto de la solicitud actual:

```blade
{{-- P. ej. en una plantilla de email por idioma --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
// En un contexto PHP
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

Con `dir` establecido en `<html>`, la variante `rtl:` de Tailwind funciona automáticamente - sin plugins ni configuración adicional:

```html
<!-- Invertir alineación del texto -->
<p class="text-left rtl:text-right">Content</p>

<!-- Invertir padding -->
<div class="pl-4 rtl:pr-4 rtl:pl-0">Sidebar item</div>

<!-- Invertir posición del icono -->
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Label</span>
</div>

<!-- Invertir borde -->
<div class="border-l-4 rtl:border-r-4 rtl:border-l-0 border-blue-500">
    Highlighted content
</div>
```

## Propiedades lógicas de CSS (recomendado)

Para nuevos layouts o componentes, prefiere las **propiedades lógicas de CSS** en lugar de las direccionales. El navegador gestiona el cambio LTR/RTL automáticamente:

```css
/* ❌ Direccional - necesita sobreescrituras para RTL */
.card {
    padding-left: 1rem;
    border-left: 2px solid blue;
    margin-right: auto;
}

/* ✅ Lógico - funciona en ambas direcciones automáticamente */
.card {
    padding-inline-start: 1rem;   /* left en LTR, right en RTL */
    border-inline-start: 2px solid blue;
    margin-inline-end: auto;
}
```

Correspondencias clave de propiedades lógicas:

| Direccional | Equivalente lógico |
|---|---|
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |
| `left: 0` | `inset-inline-start: 0` |
| `text-align: left` | `text-align: start` |
| `float: left` | `float: inline-start` |

## Verificar la dirección en Blade

```blade
@if (Lingua::getDirection() === 'rtl')
    {{-- Marcado específico para RTL --}}
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

## Verificar la dirección en PHP

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // idioma actual
$direction = Lingua::getDirection('ar');   // idioma explícito

if ($direction === 'rtl') {
    // Lógica específica para RTL
}
```

## Consideraciones de fuentes

Muchos idiomas RTL requieren fuentes específicas. El árabe y el hebreo en particular se ven mal con la mayoría de las fuentes web latinas. Considera cargar una fuente apropiada de forma condicional:

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans Arabic', sans-serif; }
    </style>
@endif
```

## Respaldo seguro

`Lingua::getDirection()` siempre devuelve `'ltr'` como respaldo si el idioma no se encuentra en la base de datos - nunca lanza una excepción. Es seguro llamarlo en cualquier punto del ciclo de vida de la solicitud, incluso antes de que se llene la tabla de idiomas.
