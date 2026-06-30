# Statistiche

La pagina Statistiche (`/lingua/statistics`) offre una panoramica immediata
dello stato delle traduzioni nella tua app.

<Screenshot src="/screenshots/statistics-page.png" alt="Pagina Statistiche di Lingua" caption="Pagina Statistiche — KPI in cima, copertura per lingua e drill-down delle chiavi mancanti." />

## Contatori panoramica

Nella parte alta della pagina sono presenti quattro KPI:

| Metrica | Descrizione |
|---|---|
| **Lingue installate** | Numero di record `Language` nel database |
| **Stringhe totali** | Numero di chiavi distinte nel set di riferimento (locale predefinita) |
| **Traduzioni completate** | Numero di coppie (locale, chiave) con un valore |
| **Copertura media** | Media semplice delle percentuali di completamento tra tutte le locale non predefinite |

```php
use Rivalex\Lingua\Facades\Lingua;

$overview = Lingua::statistics();
// [
//   'languages'    => 5,
//   'total'        => 1240,
//   'completed'    => 4876,
//   'avg_coverage' => 78.6,
// ]
```

## Copertura per lingua

La sezione centrale mostra una riga per ogni lingua installata con:

- **Nome** della lingua e **codice** locale
- **Barra di avanzamento** che riflette la percentuale di completamento
- **Stringhe tradotte / totali** (es. `980 / 1240`)
- **Percentuale** arrotondata a 2 decimali

La lingua predefinita mostra sempre il 100% in quanto è il set di riferimento.

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%\n";
    echo "  Tradotte: {$lang->translated_strings} / {$lang->total_strings}\n";
}
```

## Chiavi mancanti — drill-down

Clicca su qualsiasi riga della lingua per espandere il pannello di drill-down.
Mostra ogni chiave per cui manca la traduzione in quella locale, raggruppate
per gruppo.

```
auth
  ├── auth.failed               ← mancante in fr
  └── auth.throttle             ← mancante in fr

validation
  ├── validation.email          ← mancante in fr
  └── validation.required       ← mancante in fr
```

Ogni chiave mancante ha un link diretto alla pagina Traduzioni filtrata al
gruppo corrispondente così puoi iniziare immediatamente a tradurre.

```php
$missing = Lingua::missingTranslations('fr');
// [
//   'auth'       => ['auth.failed', 'auth.throttle'],
//   'validation' => ['validation.email', 'validation.required'],
// ]
```

## Toggle traduzioni vendor

Per impostazione predefinita le traduzioni vendor sono escluse dalle statistiche.
Attiva **Includi traduzioni vendor** per includerle.

::: info
Le traduzioni vendor sono spesso mantenute a monte dall'autore del pacchetto.
Includerle potrebbe abbassare la copertura apparente se non hai aggiunto
override specifici per la locale.
:::

## Statistiche in tempo reale

Le statistiche vengono calcolate dal [driver di archiviazione](/it/guide/storage)
attivo:

- In modalità **database** i contatori sono calcolati tramite query Eloquent
  e aggregati in PHP (nessuna funzione SQL JSON — constraint multi-DB)
- In modalità **file** i contatori vengono derivati leggendo e confrontando
  i file PHP e JSON in `lang/`

Le statistiche non sono memorizzate nella cache separatamente — la cache di
traduzione per `(locale, gruppo)` serve come proxy. Modificare o sincronizzare
le traduzioni rende le statistiche aggiornate nella stessa richiesta.
