# Gestione delle lingue

La pagina Lingue (`/lingua/languages`) è il tuo centro di controllo per tutte
le locale installate. Condivide il [menu di navigazione](/it/features/settings#menu-di-navigazione)
con le altre pagine di Lingua, con la pagina corrente evidenziata.

<Screenshot src="/screenshots/languages-page.png" alt="Pagina di gestione delle lingue di Lingua" caption="Pagina Lingue — locale installate con statistiche di completamento e la toolbar a due righe." />

## La toolbar

La toolbar si ridispone su due righe così i controlli rimangono usabili a
qualsiasi larghezza:

- **Riga superiore** — il campo di **ricerca** locale e il pulsante
  **Aggiungi lingua**.
- **Riga inferiore** — i tre pulsanti di **sincronizzazione** (Sincronizza da
  file, Sincronizza in file, Aggiorna).

## Aggiungere una lingua

### Dall'interfaccia

Clicca **Aggiungi lingua**, cerca tra le 129+ locale nel registro, scegline
una e conferma. Lingua poi:

1. Crea un record `Language` per la locale
2. Popola le sue stringhe dal **dataset integrato** (nessun download da
   internet)
3. Aggiorna la tabella con la nuova locale

<Screenshot src="/screenshots/language-add-modal.png" alt="Modale per aggiungere una lingua" caption="La modale di aggiunta lingua con un selettore di locale ricercabile." width="640px" :center="true"/>

::: tip <Badge type="tip" text="Novità in 2.0" /> Nessun download richiesto
`lingua:add` non scarica più file da GitHub o `laravel-lang`. Le locale
vengono popolate istantaneamente dal dataset integrato nel pacchetto (26
locale × 7 gruppi, 5902 stringhe, allineati a Laravel v13.14.0). Vedi
[Sincronizzazione bidirezionale](/it/features/sync#il-dataset-integrato).
:::

### Dalla riga di comando

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

### In modo programmatico

```php
use Rivalex\Lingua\Facades\Lingua;

// Crea il record Language e popola il suo storage per la locale
Lingua::addLanguage('fr');
```

::: tip
Usa `Lingua::notInstalled()` per ottenere le locale disponibili ma non ancora
installate:

```php
$available = Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```
:::

## Rimuovere una lingua

Clicca sull'icona del cestino su qualsiasi riga di lingua non predefinita. Un
passaggio di conferma previene l'eliminazione accidentale.

La rimozione di una lingua elimina il record `Language` **e ogni valore di
traduzione per quella locale**, poi riordina i valori `sort` delle lingue
rimanenti.

::: warning
La **lingua predefinita non può essere rimossa**. Imposta prima un'altra
lingua come predefinita.
:::

```bash
# Dalla riga di comando
php artisan lingua:remove fr
```

```php
// In modo programmatico
Lingua::removeLanguage('fr');
```

## Impostare la lingua predefinita

Clicca sull'icona a stella (⭐) su qualsiasi riga di lingua. Solo una lingua
può essere predefinita alla volta, e la modifica è avvolta in una transazione
del database così non c'è mai una finestra senza predefinita.

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::setDefaultLocale('fr');
```

::: warning La predefinita definisce il set di chiavi di riferimento
La locale predefinita definisce il set canonico di chiavi. La copertura per
ogni altra locale viene misurata rispetto ad essa, quindi la predefinita mostra
sempre il 100%. Assicurati che sia ragionevolmente completa prima di cambiarla.
:::

## Riordinare le lingue

Trascina e rilascia le righe delle lingue per controllarne l'ordine di
visualizzazione ovunque appaiano — nel widget del selettore di lingua, nel
selettore di locale delle traduzioni e ovunque chiami `Lingua::languages()`.

L'ordine di ordinamento è archiviato nella colonna intera `sort` e
riassegnato sequenzialmente dopo ogni trascinamento.

## Statistiche di completamento

Ogni riga di lingua mostra:

| Metrica | Descrizione |
|---|---|
| **Stringhe totali** | Il numero di chiavi nel set di chiavi di riferimento |
| **Tradotte** | Numero di stringhe con un valore per questa locale |
| **Completamento %** | `tradotte / totale * 100`, arrotondato a 2 decimali |

Le statistiche vengono calcolate tramite il [driver di archiviazione](/it/guide/storage)
attivo, quindi sono corrette sia in modalità `database` che `file`.

```php
use Rivalex\Lingua\Facades\Lingua;

$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// Tutte le lingue con statistiche in un'unica passata
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

## Controlli di sincronizzazione

La riga inferiore della toolbar ha tre pulsanti di sincronizzazione:

| Pulsante | Comando | Azione |
|---|---|---|
| **Sincronizza da file** | `lingua:sync-to-database` | Importa tutti i file locali `lang/` (core + vendor) in `language_lines` |
| **Sincronizza in file** | `lingua:sync-to-local` | Scrive tutte le traduzioni DB nei file PHP & JSON in `lang/` |
| **Aggiorna** | `lingua:update-lang` | Ri-popola le locale installate dal dataset integrato e da `lang/` locale |

Vedi [Sincronizzazione bidirezionale](/it/features/sync) per i dettagli
completi, inclusa l'invalidazione chirurgica della cache per `(locale, gruppo)`
che viene eseguita dopo ogni operazione.

::: tip Consapevolezza del driver
In modalità di archiviazione `file` il pulsante **Sincronizza in file** è
limitato — la modalità file scrive già su disco, quindi si esegue solo con il
flag `--force` dalla CLI. Vedi [Driver di archiviazione](/it/guide/storage).
:::
