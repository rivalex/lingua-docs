# Statistiche di traduzione

La pagina Statistiche offre una panoramica in tempo reale della copertura delle traduzioni per tutte le lingue installate.

```blade
<a href="{{ route('lingua.statistics') }}">Statistiche di traduzione</a>
```

<Screenshot src="/screenshots/statistics-page.png" alt="Pagina Statistiche di traduzione" caption="La pagina delle statistiche mostra la copertura per lingua, la suddivisione per gruppo e le chiavi mancanti." />

## Panoramica

La pagina mostra tre contatori riassuntivi in cima:

- **Chiavi totali** — numero totale di stringhe di traduzione nel database
- **Gruppi totali** — numero di gruppi di traduzione distinti
- **Lingue installate** — numero di lingue registrate nel sistema

Puoi attivare **Includi traduzioni vendor** per includere o escludere le traduzioni dei pacchetti da tutte le statistiche.

## Copertura per lingua

<Screenshot src="/screenshots/statistics-coverage.png" alt="Sezione copertura per lingua" caption="Ogni riga della lingua mostra una barra di avanzamento, la percentuale e il conteggio delle chiavi mancanti." />

Per ogni lingua installata puoi vedere:

| Colonna | Descrizione |
|---|---|
| Lingua | Nome e bandiera della lingua |
| Copertura | Barra di avanzamento con percentuale di completamento |
| Tradotte | Numero di chiavi che hanno un valore per questa locale |
| Mancanti | Numero di chiavi senza valore — clicca per espandere il pannello delle chiavi mancanti |

La **lingua predefinita** è evidenziata con un badge. Poiché la locale predefinita determina il set di chiavi di riferimento, mostra sempre il 100% di copertura.

## Dettaglio chiavi mancanti

Clicca il **badge del conteggio mancanti** su qualsiasi riga della lingua per espandere inline il pannello delle chiavi mancanti.

<Screenshot src="/screenshots/statistics-missing.png" alt="Pannello chiavi mancanti espanso" caption="Il pannello delle chiavi mancanti mostra gruppo, chiave e un link diretto all'editor delle traduzioni." />

Ogni riga nel pannello mostra:

- **Gruppo** — il gruppo di traduzione (es. `validation`, `auth`)
- **Chiave** — la chiave di traduzione (es. `required`, `failed`)
- **Traduci →** link — apre la pagina Traduzioni pre-filtrata per quella locale

Clicca di nuovo sulla stessa riga della lingua per chiudere il pannello.

## Suddivisione per gruppo

<Screenshot src="/screenshots/statistics-breakdown.png" alt="Tabella di suddivisione per gruppo" caption="La tabella di suddivisione mostra il conteggio delle chiavi tradotte per locale per ogni gruppo." />

La tabella di suddivisione elenca ogni gruppo di traduzione con il numero di chiavi tradotte per ogni lingua installata. Usala per identificare quali gruppi sono completamente tradotti e quali necessitano attenzione.

## Toggle traduzioni vendor

Per impostazione predefinita, le traduzioni vendor (da pacchetti come `laravel/framework`) sono escluse dalle statistiche. Attiva **Includi traduzioni vendor** per includerle.

::: info
Le traduzioni vendor sono spesso mantenute a monte dall'autore del pacchetto. Includerle nelle statistiche potrebbe abbassare la copertura apparente se non hai aggiunto override specifici per la locale.
:::

::: tip Lavorare in modo efficiente
Ordina per conteggio mancanti per dare priorità al tuo lavoro di traduzione. Le lingue con più chiavi mancanti in cima alla lista necessitano della maggiore attenzione.
:::
