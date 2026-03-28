# Supporto RTL / LTR

Lingua memorizza la direzione del testo (`ltr` o `rtl`) per ogni lingua installata e la espone tramite `Lingua::getDirection()`. Configurare correttamente il supporto RTL richiede una piccola modifica una-tantum al tuo layout Blade.

## Lingue RTL supportate (esempi)

| Locale | Lingua | Direzione |
|---|---|---|
| `ar` | Arabo | `rtl` |
| `he` | Ebraico | `rtl` |
| `fa` | Persiano (Farsi) | `rtl` |
| `ur` | Urdu | `rtl` |
| `ps` | Pashto | `rtl` |
| `ug` | Uiguro | `rtl` |

Tutte le altre locale (incluse quelle europee, asiatiche e la maggior parte delle lingue a scrittura latina) restituiscono `ltr`.

## Configurare il tuo layout Blade

Aggiungi gli attributi `lang` e `dir` al tag `<html>` nel tuo file di layout principale:

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` usa automaticamente la locale dell'applicazione corrente, quindi segue ogni cambio di locale senza codice aggiuntivo.

::: tip Perché sia `lang` che `dir`?
- `lang` dice al browser e agli screen reader quale lingua usare per la pronuncia, la sillabazione e il controllo ortografico.
- `dir` dice al browser, ai CSS e ai motori di layout la direzione del flusso del testo. Entrambi sono necessari per la piena conformità all'accessibilità (WCAG 2.1 AA).
:::

## Locale esplicita

Passa una locale esplicita quando hai bisogno della direzione al di fuori del contesto della richiesta corrente:

```blade
{{-- Es. in un template email per lingua --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
// In un contesto PHP
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

Con `dir` impostato su `<html>`, la variante integrata `rtl:` di Tailwind funziona automaticamente — non è richiesto alcun plugin o configurazione:

```html
<!-- Inverti l'allineamento del testo -->
<p class="text-left rtl:text-right">Content</p>

<!-- Inverti il padding -->
<div class="pl-4 rtl:pr-4 rtl:pl-0">Sidebar item</div>

<!-- Inverti il posizionamento dell'icona -->
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Label</span>
</div>

<!-- Inverti il bordo -->
<div class="border-l-4 rtl:border-r-4 rtl:border-l-0 border-blue-500">
    Highlighted content
</div>
```

## Proprietà logiche CSS (raccomandato)

Per i nuovi layout o componenti, preferisci le **proprietà logiche CSS** rispetto a quelle direzionali. Il browser gestisce automaticamente l'inversione LTR/RTL:

```css
/* ❌ Direzionale — richiede override RTL */
.card {
    padding-left: 1rem;
    border-left: 2px solid blue;
    margin-right: auto;
}

/* ✅ Logico — funziona in entrambe le direzioni automaticamente */
.card {
    padding-inline-start: 1rem;   /* left in LTR, right in RTL */
    border-inline-start: 2px solid blue;
    margin-inline-end: auto;
}
```

Mappature delle proprietà logiche chiave:

| Direzionale | Equivalente logico |
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

## Verificare la direzione in Blade

```blade
@if (Lingua::getDirection() === 'rtl')
    {{-- Markup specifico per RTL --}}
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

## Verificare la direzione in PHP

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // locale corrente
$direction = Lingua::getDirection('ar');   // locale esplicita

if ($direction === 'rtl') {
    // Logica specifica per RTL
}
```

## Considerazioni sui font

Molte lingue RTL richiedono font specifici. In particolare l'arabo e l'ebraico si renderizzano male con la maggior parte dei web font latini. Considera di caricare condizionalmente un font appropriato:

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans Arabic', sans-serif; }
    </style>
@endif
```

## Fallback sicuro

`Lingua::getDirection()` restituisce sempre `'ltr'` come fallback se la locale non viene trovata nel database — non genera mai un'eccezione. È sicuro da chiamare in qualsiasi punto del ciclo di vita della richiesta, incluso prima che la tabella delle lingue sia popolata.
