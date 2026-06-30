# Import / Export <Badge type="tip" text="Novità in 2.0" />

La pagina Transfer (`/lingua/transfer`) sposta le traduzioni dentro e fuori
da Lingua in blocco. Esporta un foglio di calcolo per i traduttori, ricevilo
compilato, visualizza in anteprima le modifiche, poi conferma — tutto senza
uscire dall'interfaccia admin.

<Screenshot src="/screenshots/transfer-page.png" alt="Pagina Transfer di Lingua" caption="La pagina Transfer — pannelli di esportazione e importazione affiancati." />

## Formati supportati

| Formato | Disponibilità | Note |
|---|---|---|
| **CSV** | Integrato | Bilingue o multi-locale |
| **JSON** | Integrato | Bilingue, multi-locale o json-native (flat `key: value`) |
| **XLSX** | Opzionale | Richiede `openspout/openspout` |
| **ODS** | Opzionale | Richiede `openspout/openspout` |

CSV e JSON funzionano senza installazioni aggiuntive. Per abilitare i formati
foglio di calcolo, installa OpenSpout:

```bash
composer require openspout/openspout
```

Quando OpenSpout è assente, Lingua lo rileva e le opzioni XLSX/ODS non sono
disponibili; CSV e JSON rimangono completamente funzionali.

## Esportazione

<Screenshot src="/screenshots/transfer-export.png" alt="Pannello di esportazione Transfer" caption="Scegliere un formato, un ambito e le locale prima del download." />

Scegli un **formato**, un **ambito** e le **locale** da includere, poi scarica
il file tramite la route `lingua.transfer.export` (gestita da
`TransferExportController::download`).

### Ambiti di esportazione

| Ambito | Colonne prodotte | Ideale per |
|---|---|---|
| `bilingual` | Locale sorgente + una locale di destinazione | Inviare una singola lingua a un traduttore |
| `multi-locale` | Ogni locale installata come colonna propria | Uno snapshot completo o una revisione in blocco |
| `json-native` | Coppie flat `chiave: valore` | File locale in formato JSON |

### Flusso di lavoro tipico

1. Esporta l'ambito e il formato necessari.
2. Modifica il file esternamente (app foglio di calcolo, strumento di
   traduzione o a mano).
3. Reimportalo e rivedi il diff del dry-run.
4. Conferma.

## Importazione

L'importazione è un processo deliberato **a due fasi** così nulla cambia
finché non hai visto esattamente cosa accadrà.

### Fase 1 — Anteprima dry-run

`ImportDiffService` analizza il file caricato e produce un diff **senza
scrivere nulla**. Riporta quattro conteggi:

| Esito | Significato |
|---|---|
| **Create** | La coppia chiave/locale non esiste ancora e verrà aggiunta |
| **Update** | Il valore esistente differisce e verrà sovrascritto |
| **Skip** | Il valore è identico, o la riga è protetta/non abbinata |
| **Error** | La riga non ha potuto essere analizzata o mappata |

<Screenshot src="/screenshots/transfer-import-diff.png" alt="Diff dry-run dell'importazione" caption="L'anteprima dry-run mostra i conteggi create / update / skip / error prima di confermare." />

### Fase 2 — Conferma

`ImportCommitService` applica il diff:

- In modalità **database** il commit avviene all'interno di una transazione —
  tutto o niente.
- In modalità **file** le righe vengono scritte sequenzialmente nei file
  `lang/`.

## Garanzie di sicurezza

### Protezione vendor

Le righe di proprietà vendor non possono essere sovrascritte tramite
importazione, rispecchiando la
[protezione dall'eliminazione](/it/features/vendor-translations#meccanismo-di-protezione)
presente altrove in Lingua. Tali righe vengono riportate sotto **Skip**.

### Abbinamento intestazioni colonne

Le importazioni bilingue abbinano le colonne alle locale in modo intelligente.
Quando l'intestazione non corrisponde esattamente al codice della locale (ad
esempio una locale `it_IT` contro una colonna `it - Italian`), un fallback a
colonna singola la risolve: se è presente esattamente una colonna
non-meta non-sorgente, viene usata incondizionatamente. Due o più candidati
ambigui vengono lasciati senza corrispondenza e segnalati invece di essere
indovinati.

### Protezione formula-injection

Qualsiasi cella il cui valore inizia con `=`, `+`, `-`, `@`, un tab o un
a capo viene prefissata con un singolo apice (`'`) in fase di esportazione.
Questo neutralizza l'[injection di formule CSV/foglio di calcolo](/it/guide/security)
così un valore malevolo non può essere eseguito quando il file viene aperto in
Excel, Sheets o LibreOffice.

## Note su driver e dipendenze

- Il dry-run e il commit funzionano in **entrambi** i driver di archiviazione.
- XLSX e ODS richiedono `openspout/openspout`; senza di esso, usa CSV o JSON.
- Vedi [Driver di archiviazione](/it/guide/storage) per i compromessi
  database vs file.

## Componenti e route

| Elemento | Riferimento |
|---|---|
| Componente pagina | Componente Livewire `Transfer` (`/lingua/transfer`) |
| Componente esportazione | Componente Livewire `Export` |
| Componente importazione | Componente Livewire `Import` |
| Route download | `lingua.transfer.export` → `TransferExportController::download` |
| Servizi | `ExportService`, `ImportDiffService`, `ImportCommitService` |
