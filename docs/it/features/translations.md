# Gestione delle traduzioni

La pagina Traduzioni (`/lingua/translations/{locale?}`) ti permette di sfogliare, filtrare e modificare ogni stringa di traduzione.

<Screenshot src="/screenshots/translations-page.png" alt="Pagina delle traduzioni di Lingua" caption="Pagina Traduzioni - con selettore di locale, filtro per gruppo e editor inline." />

## Navigare tra le traduzioni

### Selettore di locale

Le schede di locale in cima alla pagina ti permettono di passare tra le lingue installate. L'URL si aggiorna a `/lingua/translations/{locale}` così ogni vista è aggiungibile ai segnalibri e condivisibile.

La colonna della **locale predefinita** è sempre mostrata a sinistra come riferimento - modifichi la locale selezionata a destra.

### Filtri

| Filtro | Descrizione |
|---|---|
| **Cerca** | Ricerca nel nome del gruppo, nella chiave e in tutti i valori delle locale |
| **Gruppo** | Filtra a un gruppo specifico (es. `auth`, `validation`, `single`) |
| **Tipo** | Filtra per `text`, `html` o `markdown` |
| **Mostra solo le mancanti** | Mostra solo le stringhe senza valore nella locale selezionata |

<Screenshot src="/screenshots/translations-filters.png" alt="Filtri delle traduzioni" caption="Filtraggio per mostrare solo le traduzioni francesi mancanti nel gruppo validation." />

### Paginazione

I risultati sono paginati con un conteggio per-pagina configurabile (25 / 50 / 100). La pagina corrente e l'impostazione per-pagina sono persiste nella query string dell'URL.

## Modificare le traduzioni

### Modifica inline

Clicca direttamente nella cella della traduzione per iniziare a modificare. Le modifiche vengono salvate al blur (quando clicchi altrove o premi Tab).

- Le traduzioni **testo semplice** usano un semplice `<textarea>`
- Le traduzioni **HTML** aprono l'editor di testo ricco TipTap
- Le traduzioni **Markdown** aprono l'editor markdown TipTap

<Screenshot src="/screenshots/translation-editor-html.png" alt="Editor HTML delle traduzioni" caption="L'editor HTML TipTap per le traduzioni di testo ricco." width="512px" :center="true"/>

### Sincronizza dalla predefinita

Ogni riga di traduzione ha un pulsante **Sincronizza dalla predefinita** (↺). Cliccandolo si copia il valore della locale predefinita nella locale corrente - utile come punto di partenza quando hai bisogno solo di piccole modifiche al testo.

### Modale di modifica

Per la locale predefinita, clicca sull'icona a matita per aprire la modale di modifica, dove puoi cambiare il tipo di traduzione (text / html / markdown) oltre al valore.

::: tip Cambiare i tipi di traduzione
Se cambi una traduzione da `text` a `html`, l'editor inline sulla riga passerà immediatamente a TipTap. Il valore memorizzato non cambia - cambia solo l'editor.
:::

## Creare traduzioni

Clicca **Nuova traduzione** per creare una voce personalizzata. Compila:

- **Gruppo** - l'equivalente del nome del file (es. `marketing`, `emails`)
- **Chiave** - la chiave all'interno del gruppo (es. `hero_title`)
- **Tipo** - `text`, `html` o `markdown`
- **Valore** - la traduzione per la locale predefinita

```
group: marketing
key:   hero_title
type:  text
value: Build faster, together.
```

La nuova chiave è immediatamente disponibile tramite `__('marketing.hero_title')`.

::: tip Dopo il salvataggio
Il campo **Gruppo** viene preservato dopo la creazione, così puoi aggiungere più chiavi allo stesso gruppo senza doverlo riselezionare. Solo i campi **Chiave** e **Valore** vengono azzerati. Spazi iniziali, finali e interni ridondanti in Gruppo e Chiave vengono normalizzati automaticamente prima del salvataggio.
:::

::: warning Traduzioni vendor
Non puoi creare traduzioni direttamente in un gruppo vendor (es. `validation`, `auth`). Quei gruppi sono di proprietà di Laravel o di altri pacchetti e vengono sincronizzati automaticamente. Se vuoi sovrascrivere una stringa vendor, modificala direttamente nella pagina delle traduzioni.
:::

## Eliminare le traduzioni

### Elimina per una locale specifica

Su qualsiasi locale non predefinita, il pulsante elimina rimuove solo il valore di quella locale dalla colonna JSON. La chiave di traduzione continua ad esistere; semplicemente fa il fallback alla locale predefinita.

### Elimina completamente

Nella vista della locale predefinita, il pulsante elimina rimuove l'intera riga da `language_lines`. Usalo per pulire le chiavi che non sono più usate nel tuo codebase.

::: danger Protezione delle traduzioni vendor
Le traduzioni vendor non possono essere eliminate. Il tentativo di farlo mostra un avviso e genera l'evento `vendor_translation_protected`. Puoi solo **modificare** i valori delle traduzioni vendor.
:::

## Copia chiave negli appunti

Ogni riga ha un'icona degli appunti che copia il riferimento completo `group.key` (es. `auth.failed`) negli appunti - comodo quando si fa riferimento alle chiavi in Blade o PHP.

## Scorciatoie da tastiera

| Tasto | Azione |
|---|---|
| `Tab` | Salva il campo corrente e passa al successivo |
| `Shift + Tab` | Salva il campo corrente e passa al precedente |
| `Escape` | Scarta le modifiche e chiude l'editor |
