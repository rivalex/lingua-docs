# Suporte RTL / LTR

O Lingua armazena a **direção de leitura** (`ltr` ou `rtl`) para cada idioma
instalado e a expõe via `Lingua::getDirection()`. Configurar suporte RTL requer
uma única alteração no layout Blade.

## Idiomas RTL suportados

| Locale | Idioma | Direção |
|---|---|---|
| `ar` | Árabe | `rtl` |
| `he` | Hebraico | `rtl` |
| `fa` | Persa (Farsi) | `rtl` |
| `ur` | Urdu | `rtl` |
| `ps` | Pashto | `rtl` |
| `ug` | Uigur | `rtl` |

Todos os outros locales retornam `ltr`.

## Configurando o layout Blade

Adicione `lang` e `dir` à tag `<html>` no seu arquivo de layout principal:

```blade
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` usa o locale ativo automaticamente, seguindo cada troca
de locale sem código adicional.

::: tip Por que `lang` e `dir`?
- `lang` informa ao navegador e leitores de tela qual idioma usar para pronúncia,
  hifenização e verificação ortográfica.
- `dir` instrui o navegador e o motor de layout sobre a direção do fluxo de texto.
  Ambos são necessários para conformidade com WCAG 2.1 AA.
:::

## Locale explícito

Passe um locale explícito quando precisar da direção fora do contexto da requisição:

```blade
{{-- Template de e-mail por idioma --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

Com `dir` definido em `<html>`, a variante `rtl:` do Tailwind funciona
automaticamente — sem plugin ou configuração:

```html
<p class="text-left rtl:text-right">Conteúdo</p>
<div class="pl-4 rtl:pr-4 rtl:pl-0">Item da sidebar</div>
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Rótulo</span>
</div>
<div class="border-l-4 rtl:border-r-4 rtl:border-l-0 border-blue-500">
    Conteúdo destacado
</div>
```

## Propriedades lógicas CSS (recomendado)

Para novos layouts, prefira **propriedades lógicas CSS** — o navegador lida com
LTR/RTL automaticamente:

```css
/* ❌ Direcional — precisa de sobrescritas RTL */
.card {
    padding-left: 1rem;
    border-left: 2px solid blue;
}

/* ✅ Lógico — funciona em ambas as direções */
.card {
    padding-inline-start: 1rem;
    border-inline-start: 2px solid blue;
}
```

| Direcional | Equivalente lógico |
|---|---|
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `border-left` | `border-inline-start` |
| `text-align: left` | `text-align: start` |

Tailwind 3+ expõe essas via `ms-`, `me-`, `ps-`, `pe-` que respeitam a direção
de escrita automaticamente.

## Considerações tipográficas

Scripts RTL como árabe e hebraico usam fontes diferentes de scripts latinos:

```blade
@if (Lingua::getDirection() === 'rtl')
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans Arabic', sans-serif; font-size: 1.05em; line-height: 1.7; }
    </style>
@endif
```

## Verificando direção em PHP

```php
use Rivalex\Lingua\Facades\Lingua;

$dir = Lingua::getDirection();        // locale atual
$dir = Lingua::getDirection('ar');    // 'rtl'

$info = Lingua::info('ar');
if ($info !== null) {
    $info->direction; // 'rtl'
}
```

`Lingua::getDirection()` sempre retorna `'ltr'` como fallback se o locale não
for encontrado — nunca lança exceção.
