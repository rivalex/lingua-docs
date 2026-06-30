# Supporto RTL / LTR

Lingua memorizza la direzione del testo (`ltr` o `rtl`) per ogni lingua
installata e la espone tramite `Lingua::getDirection()`. Configurare
correttamente il supporto RTL richiede una piccola modifica una-tantum al
tuo layout Blade.

## Lingue RTL supportate

Tutte le lingue RTL nel `LocaleRegistry` di Lingua hanno `direction: 'rtl'`
nei loro metadati:

| Codice | Lingua | Direzione |
|---|---|---|
| `ar` | Arabo | `rtl` |
| `he` | Ebraico | `rtl` |
| `fa` | Persiano (Farsi) | `rtl` |
| `ur` | Urdu | `rtl` |
| `ps` | Pashto | `rtl` |
| `ku` | Curdo (Kurmanji) | `rtl` |
| `ug` | Uiguro | `rtl` |

```php
use Rivalex\Lingua\Facades\Lingua;

$info = Lingua::info('ar');
echo $info->direction; // 'rtl'
echo $info->native;    // 'العربية'
```

## Configurare il tuo layout Blade

Aggiungi gli attributi `lang` e `dir` al tag `<html>` nel tuo layout
principale:

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` usa automaticamente la locale dell'applicazione
corrente, quindi segue ogni cambio di locale senza codice aggiuntivo.

::: tip Perché sia `lang` che `dir`?
- `lang` dice al browser e agli screen reader quale lingua usare per
  pronuncia, sillabazione e controllo ortografico.
- `dir` dice al browser e ai motori di layout la direzione del flusso
  del testo. Entrambi sono necessari per la piena conformità WCAG 2.1 AA.
:::

## Locale esplicita

Passa una locale esplicita quando hai bisogno della direzione al di fuori
del contesto della richiesta corrente:

```blade
{{-- Es. in un template email per lingua --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

Con `dir` impostato su `<html>`, la variante `rtl:` di Tailwind funziona
automaticamente — nessun plugin o configurazione necessari:

```html
<!-- Inverti l'allineamento del testo -->
<p class="text-left rtl:text-right">Contenuto</p>

<!-- Inverti il padding -->
<div class="pl-4 rtl:pr-4 rtl:pl-0">Elemento sidebar</div>

<!-- Inverti il posizionamento dell'icona -->
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Etichetta</span>
</div>
```

## Proprietà logiche CSS (raccomandato)

Per i nuovi layout o componenti, preferisci le **proprietà logiche CSS**
rispetto a quelle direzionali. Il browser gestisce automaticamente
l'inversione LTR/RTL — l'interfaccia admin di Lingua le usa già:

```css
/* Direzionale — richiede override RTL */
.card { padding-left: 1rem; border-left: 2px solid blue; }

/* Logico — funziona in entrambe le direzioni automaticamente */
.card {
    padding-inline-start: 1rem;
    border-inline-start: 2px solid blue;
}
```

Mappature chiave:

| Direzionale | Equivalente logico |
|---|---|
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `border-left` | `border-inline-start` |
| `text-align: left` | `text-align: start` |
| `left: 0` | `inset-inline-start: 0` |

## Verificare la direzione

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // locale corrente
$direction = Lingua::getDirection('ar');   // locale esplicita
```

## Layout selettore di lingua in RTL

Il componente `<livewire:lingua::language-selector>` si adatta alla direzione
corrente. Il componente `x-lingua::select` usa `position: fixed` tramite la
Popover API nativa, quindi i suoi ancoraggi rispondono correttamente alla
direzione del documento senza regole CSS speciali.

## Fallback sicuro

`Lingua::getDirection()` restituisce sempre `'ltr'` come fallback se la
locale non viene trovata — non genera mai un'eccezione. È sicuro da chiamare
in qualsiasi punto del ciclo di vita della richiesta, incluso prima che la
tabella delle lingue sia popolata.
