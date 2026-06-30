# Soporte RTL / LTR

Lingua almacena la dirección del texto (`ltr` o `rtl`) para cada idioma instalado y la
expone mediante `Lingua::getDirection()`. Configurar el soporte RTL requiere un pequeño
cambio único en tu layout Blade.

## Idiomas RTL soportados (ejemplos)

| Idioma | Nombre | Dirección |
|---|---|---|
| `ar` | Árabe | `rtl` |
| `he` | Hebreo | `rtl` |
| `fa` | Persa (Farsi) | `rtl` |
| `ur` | Urdu | `rtl` |
| `ps` | Pastún | `rtl` |
| `ug` | Uigur | `rtl` |

Todos los demás idiomas (incluyendo europeos y la mayoría de script latino) devuelven `ltr`.

## Configurar tu layout Blade

Añade los atributos `lang` y `dir` al elemento `<html>`:

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` usa el idioma actual automáticamente — sin código extra por idioma.

::: tip ¿Por qué `lang` y `dir`?
`lang` informa al navegador y lectores de pantalla. `dir` indica el flujo de texto.
Ambos son necesarios para el cumplimiento completo de accesibilidad (WCAG 2.1 AA).
:::

## Idioma explícito

```blade
{{-- P.ej. en plantillas de email --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

Con `dir` en `<html>`, la variante `rtl:` de Tailwind funciona automáticamente:

```html
<p class="text-left rtl:text-right">Contenido</p>
<div class="pl-4 rtl:pr-4 rtl:pl-0">Elemento de barra lateral</div>
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Etiqueta</span>
</div>
```

## Propiedades lógicas de CSS (recomendado)

Para nuevos layouts, prefiere **propiedades lógicas de CSS** — el navegador gestiona
LTR/RTL automáticamente:

```css
/* ❌ Direccional — necesita sobreescrituras para RTL */
.card { padding-left: 1rem; border-left: 2px solid blue; }

/* ✅ Lógico — funciona en ambas direcciones */
.card {
    padding-inline-start: 1rem;
    border-inline-start: 2px solid blue;
}
```

| Direccional | Equivalente lógico |
|---|---|
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `margin-left` | `margin-inline-start` |
| `text-align: left` | `text-align: start` |
| `float: left` | `float: inline-start` |

## Respaldo seguro

`Lingua::getDirection()` siempre devuelve `'ltr'` como respaldo si el idioma no se
encuentra — nunca lanza excepción. Es seguro llamarlo en cualquier punto del ciclo de vida.
