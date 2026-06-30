# Gestione delle traduzioni

La pagina Traduzioni (`/lingua/translations/{locale?}`) ti permette di
sfogliare, filtrare e modificare ogni stringa di traduzione. Condivide il
[menu di navigazione](/it/features/settings#menu-di-navigazione) con le altre
pagine di Lingua.

<Screenshot src="/screenshots/translations-page.png" alt="Pagina delle traduzioni di Lingua" caption="Pagina Traduzioni — con selettore di locale, barra dei filtri e editor inline." />

## Navigare tra le traduzioni

### Selettore di locale

Le schede di locale in cima alla pagina ti permettono di passare tra le
lingue installate. L'URL si aggiorna a `/lingua/translations/{locale}` così
ogni vista è aggiungibile ai segnalibri e condivisibile.

La colonna della **locale predefinita** è sempre mostrata a sinistra come
riferimento — modifichi la locale selezionata a destra.

::: tip <Badge type="tip" text="Modificato" /> Il cambio mantiene la posizione
Cambiare la locale ora ricarica la **pagina corrente** invece di reindirizzare
alla home. Lo stesso vale per il widget del [selettore di lingua](/it/features/language-selector#come-funziona-il-cambio-di-locale)
in tutta la tua app.
:::

### Filtri

La barra dei filtri è una singola riga flex che si ridispone in modo
responsivo:

| Filtro | Descrizione |
|---|---|
| **Cerca** | Ricerca nel nome del gruppo, nella chiave e in tutti i valori delle locale |
| **Gruppo** | Filtra a un gruppo specifico (es. `auth`, `validation`, `single`) |
| **Tipo** | Filtra per `text`, `html` o `markdown` |
| **Mostra solo le mancanti** | Mostra solo le stringhe senza valore nella locale selezionata |
| **Includi vendor** | Attiva/disattiva la visualizzazione delle righe di proprietà vendor nell'elenco |

<Screenshot src="/screenshots/translations-filters.png" alt="Filtri delle traduzioni" caption="Filtraggio per mostrare solo le traduzioni francesi mancanti nel gruppo validation." />

### Paginazione

I risultati sono paginati con un conteggio per-pagina configurabile
(25 / 50 / 100). La pagina corrente e l'impostazione per-pagina sono
persistite nella query string dell'URL.

## Modificare le traduzioni

### Modifica inline

Clicca direttamente nella cella della traduzione per iniziare a modificare.
Le modifiche vengono salvate al blur (quando clicchi altrove o premi Tab).

- Le traduzioni **testo semplice** usano un semplice `<textarea>`
- Le traduzioni **HTML** aprono l'[editor di testo ricco TipTap](/it/features/rich-text)
- Le traduzioni **Markdown** aprono l'editor TipTap Markdown

<Screenshot src="/screenshots/translation-editor-html.png" alt="Editor HTML delle traduzioni" caption="L'editor HTML TipTap per le traduzioni di testo ricco." width="512px" :center="true"/>

### Sincronizza dalla predefinita

Ogni riga ha un pulsante **Sincronizza dalla predefinita** (↺). Cliccandolo
si copia il valore della locale predefinita nella locale corrente — utile come
punto di partenza quando hai bisogno solo di piccole modifiche al testo.

### Modale di modifica

Per stringhe lunghe, contenuto HTML o Markdown, clicca sull'icona a matita
per aprire la modale di modifica. Sulla locale predefinita puoi anche
cambiare il **tipo** di traduzione (text / html / markdown) qui. Cambiare il
tipo aggiorna immediatamente l'editor — il valore archiviato rimane invariato.

## Creare traduzioni

Clicca **Nuova traduzione** e compila:

- **Gruppo** — l'equivalente del nome del file (es. `marketing`, `emails`)
- **Chiave** — la chiave all'interno del gruppo (es. `hero_title`)
- **Tipo** — `text`, `html` o `markdown`
- **Valore** — la traduzione per la locale predefinita

```
group: marketing
key:   hero_title
type:  text
value: Build faster, together.
```

La nuova chiave è immediatamente disponibile tramite
`__('marketing.hero_title')`.

::: tip Dopo il salvataggio
Il campo **Gruppo** viene preservato dopo la creazione così puoi aggiungere
più chiavi allo stesso gruppo senza doverlo riselezionare. Solo i campi
**Chiave** e **Valore** vengono azzerati. Spazi iniziali, finali e interni
ridondanti in Gruppo e Chiave vengono normalizzati automaticamente prima del
salvataggio.
:::

::: warning Gruppi vendor
Non puoi creare nuove chiavi direttamente in un gruppo di proprietà vendor.
Quei gruppi sono gestiti da Laravel o da altri pacchetti. Per cambiare una
stringa vendor, **modificala** in quel posto — vedi
[Traduzioni vendor](/it/features/vendor-translations).
:::

## Eliminare le traduzioni

### Elimina per una locale specifica

Su una locale non predefinita, il pulsante elimina rimuove solo il valore di
quella locale. La chiave continua ad esistere e fa il fallback alla locale
predefinita.

### Elimina completamente

Nella vista della locale predefinita, il pulsante elimina rimuove l'intera
riga. Usalo per pulire le chiavi non più referenziate nel tuo codebase.

::: danger Protezione delle traduzioni vendor
Le righe vendor **non possono essere eliminate** in nessun driver di
archiviazione. Un tentativo lancia `VendorTranslationProtectedException` a
livello di repository; nell'interfaccia si manifesta come un avviso e invia
l'evento `vendor_translation_protected` senza eliminare nulla. Puoi comunque
**modificare** i valori vendor. Vedi
[Traduzioni vendor](/it/features/vendor-translations#meccanismo-di-protezione).
:::

## Copia chiave negli appunti

Ogni riga ha un'icona degli appunti che copia il riferimento completo
`gruppo.chiave` (es. `auth.failed`) — comodo quando si fa riferimento alle
chiavi in Blade o PHP.

## Scorciatoie da tastiera

| Tasto | Azione |
|---|---|
| `Tab` | Salva il campo corrente e passa al successivo |
| `Shift + Tab` | Salva il campo corrente e passa al precedente |
| `Escape` | Scarta le modifiche e chiude l'editor |
