# Gestione delle lingue

La pagina Lingue (`/lingua/languages`) è il tuo centro di controllo per tutte le locale installate.

<Screenshot src="/lingua-docs/screenshots/languages-page.png" alt="Pagina di gestione delle lingue di Lingua" caption="Pagina Lingue — mostra le locale installate con le statistiche di completamento." />

## Aggiungere una lingua

### Dall'interfaccia

Clicca **Aggiungi lingua**, seleziona una qualsiasi delle 70+ locale disponibili e conferma. Lingua:

1. Scarica i file della lingua da Laravel Lang
2. Crea un record `Language` nel database
3. Sincronizza tutte le nuove stringhe in `language_lines`
4. Aggiorna la tabella con la nuova locale

<Screenshot src="/lingua-docs/screenshots/language-add-modal.png" alt="Modale per aggiungere una lingua" caption="La modale di aggiunta lingua con selettore di locale ricercabile." width="640px" :center="true"/>

### Dalla riga di comando

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

### In modo programmatico

```php
use Rivalex\Lingua\Facades\Lingua;

// Installa i file della lingua (wrapper di lang:add)
Lingua::addLanguage('fr');

// Poi crea il record DB + sincronizza (quello che fa il comando Artisan completamente)
// → usa lingua:add per il flusso completo e orchestrato
```

::: tip
Usa `Lingua::notInstalled()` per ottenere l'elenco delle locale disponibili ma non ancora installate:

```php
$available = Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```
:::

## Rimuovere una lingua

Clicca sull'icona del cestino su qualsiasi riga di lingua non predefinita. Una modale di conferma previene l'eliminazione accidentale — devi digitare il nome della lingua per confermare.

Internamente, l'operazione di eliminazione:
1. Rimuove i file della lingua tramite `lang:rm {locale} --force`
2. Rimuove tutte le voci `{locale}` dalla colonna JSON `language_lines.text`
3. Elimina il record `Language`
4. Riordina i valori di ordinamento delle lingue rimanenti

::: warning
La **lingua predefinita non può essere rimossa**. Imposta prima un'altra lingua come predefinita.
:::

```bash
# Dalla riga di comando
php artisan lingua:remove fr
```

## Impostare la lingua predefinita

Clicca sull'icona a stella (⭐) su qualsiasi riga di lingua. Solo una lingua può essere predefinita alla volta. La modifica è avvolta in una transazione del database per prevenire una finestra in cui nessuna lingua è contrassegnata come predefinita.

```php
// In modo programmatico
Lingua::setDefaultLocale('fr');

// Oppure tramite il modello
$french = Language::where('code', 'fr')->first();
Language::setDefault($french);
```

::: warning Rimozione della predefinita
Se imposti una nuova lingua predefinita, assicurati che tutte le tue traduzioni siano almeno parzialmente complete per quella locale. La lingua predefinita è usata come fallback nell'editor dell'interfaccia (la colonna sinistra mostra il valore predefinito come riferimento).
:::

## Riordinare le lingue

Trascina e rilascia le righe delle lingue per controllarne l'ordine di visualizzazione in tutta l'applicazione — nel widget del selettore di lingua, nel selettore di locale delle traduzioni e ovunque usi `Lingua::languages()`.

L'ordine di ordinamento è memorizzato nella colonna intera `sort` e riassegnato sequenzialmente dopo ogni trascinamento.

## Visualizzare le statistiche di completamento

Ogni riga di lingua mostra:

| Metrica | Descrizione |
|---|---|
| **Completamento %** | `tradotte / totale * 100`, arrotondato a 2 decimali |
| **Mancanti** | Numero di stringhe senza valore per questa locale |

Questi vengono calcolati al momento della query tramite subquery del database sulla tabella `language_lines`, quindi sono sempre aggiornati.

```php
// Ottieni le statistiche per una locale specifica
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// Oppure ottieni tutte le lingue con le statistiche in un'unica query
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

## Controlli di sincronizzazione

La barra degli strumenti della pagina Lingue ha tre pulsanti di sincronizzazione:

| Pulsante | Azione |
|---|---|
| **Sincronizza nel database** | Importa tutti i file locali `lang/` in `language_lines` |
| **Sincronizza in locale** | Esporta tutte le traduzioni DB nei file `lang/` |
| **Aggiorna tramite Laravel Lang** | Esegue `lang:update` per recuperare le ultime stringhe dall'upstream, poi sincronizza nel DB |

Tutte e tre le operazioni vengono eseguite **in modo asincrono** (attributo Livewire `#[Async]`) così l'interfaccia rimane reattiva durante le sincronizzazioni di lunga durata.
