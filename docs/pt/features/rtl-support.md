# Suporte RTL / LTR

O Lingua armazena a direção do texto (`ltr` ou `rtl`) para cada idioma instalado e a expõe via `Lingua::getDirection()`. Configurar o suporte adequado a RTL requer uma pequena alteração única no seu layout Blade.

## Idiomas RTL suportados (exemplos)

| Locale | Idioma | Direção |
|---|---|---|
| `ar` | Árabe | `rtl` |
| `he` | Hebraico | `rtl` |
| `fa` | Persa (Farsi) | `rtl` |
| `ur` | Urdu | `rtl` |
| `ps` | Pashto | `rtl` |
| `ug` | Uigur | `rtl` |

Todos os outros locales (incluindo europeus, asiáticos e a maioria dos idiomas com escrita latina) retornam `ltr`.

## Configurando seu layout Blade

Adicione os atributos `lang` e `dir` à tag `<html>` no seu arquivo de layout principal:

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` usa o locale da aplicação atual automaticamente, portanto segue cada troca de locale sem nenhum código adicional.

::: tip Por que `lang` e `dir`?
- `lang` informa ao navegador e leitores de tela qual idioma usar para pronúncia, hifenização e verificação ortográfica.
- `dir` informa ao navegador, CSS e motores de layout a direção do fluxo de texto. Ambos são necessários para conformidade total de acessibilidade (WCAG 2.1 AA).
:::

## Locale explícito

Passe um locale explícito quando precisar da direção fora do contexto da requisição atual:

```blade
{{-- Ex: em um template de e-mail por idioma --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
// Em contexto PHP
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

Com `dir` definido em `<html>`, a variante `rtl:` integrada do Tailwind funciona automaticamente — sem plugin ou configuração necessária:

```html
<!-- Inverter alinhamento de texto -->
<p class="text-left rtl:text-right">Content</p>

<!-- Inverter padding -->
<div class="pl-4 rtl:pr-4 rtl:pl-0">Sidebar item</div>

<!-- Inverter posicionamento de ícone -->
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Label</span>
</div>

<!-- Inverter borda -->
<div class="border-l-4 rtl:border-r-4 rtl:border-l-0 border-blue-500">
    Highlighted content
</div>
```

## Propriedades lógicas CSS (recomendado)

Para novos layouts ou componentes, prefira **propriedades lógicas CSS** em vez das direcionais. O navegador lida com a inversão LTR/RTL automaticamente:

```css
/* ❌ Direcional — precisa de sobrescritas RTL */
.card {
    padding-left: 1rem;
    border-left: 2px solid blue;
    margin-right: auto;
}

/* ✅ Lógico — funciona em ambas as direções automaticamente */
.card {
    padding-inline-start: 1rem;   /* esquerda em LTR, direita em RTL */
    border-inline-start: 2px solid blue;
    margin-inline-end: auto;
}
```

Mapeamentos de propriedades lógicas principais:

| Direcional | Equivalente lógico |
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

## Verificando direção em Blade

```blade
@if (Lingua::getDirection() === 'rtl')
    {{-- Markup específico para RTL --}}
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

## Verificando direção em PHP

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // locale atual
$direction = Lingua::getDirection('ar');   // locale explícito

if ($direction === 'rtl') {
    // Lógica específica para RTL
}
```

## Considerações sobre fontes

Muitos idiomas RTL requerem fontes específicas. Árabe e hebraico em particular renderizam mal com a maioria das fontes web latinas. Considere carregar uma fonte apropriada condicionalmente:

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans Arabic', sans-serif; }
    </style>
@endif
```

## Fallback seguro

`Lingua::getDirection()` sempre retorna `'ltr'` como fallback se o locale não for encontrado no banco de dados — nunca lança uma exceção. É seguro chamar em qualquer ponto do ciclo de vida da requisição, inclusive antes que a tabela de idiomas seja populada.
