<figure style="margin: 30px auto 30px !important; max-width: 640px;">
  <img src="../../public/logoLinguaHorizontal-light.svg" class="logo-light" alt="Lingua">
  <img src="../../public/logoLinguaHorizontal-dark.svg" class="logo-dark" alt="Lingua">
</figure>



# Che cos'è Lingua?

Lingua è un **pacchetto Laravel** per la gestione multilingue. Può archiviare
ogni traduzione nel database e include una bellissima interfaccia di gestione
reattiva costruita su [Livewire 4](https://livewire.laravel.com) e
[Flux 2](https://fluxui.dev) — oppure, se preferisci, puoi continuare a
lavorare con i normali file `lang/` usando comunque la stessa interfaccia.

::: tip Novità in 2.0
La versione 2.0 elimina completamente le dipendenze esterne
`spatie/laravel-translation-loader` e `laravel-lang/common`, aggiunge un
sistema di [driver di archiviazione](/it/guide/storage) a plugin (database
**o** file), un flusso di import/export [Transfer](/it/guide/quick-start) e
un [ciclo di hardening della sicurezza](/it/guide/security) completo. È
sicuro fin dalla prima installazione.
:::

## Il problema che risolve

Le traduzioni standard di Laravel risiedono in file PHP e JSON all'interno di
`lang/`. Questo funziona bene per i progetti piccoli, ma crea attriti man mano
che un'applicazione cresce:

- **Aggiornare una traduzione richiede un deployment** — anche per la
  correzione di un semplice refuso.
- **I membri non tecnici del team non possono modificare le traduzioni** — i
  redattori hanno bisogno di Git e di una code review.
- **Tenere traccia della completezza delle traduzioni è manuale** — bisogna
  confrontare i file per trovare le lacune.
- **Supportare molte locale appesantisce il codebase** — decine di file
  sparsi nelle directory.

Con il **driver database** predefinito, Lingua archivia ogni traduzione in
un'unica colonna JSON per riga e fornisce un'interfaccia Livewire dove
qualsiasi utente autorizzato può gestire lingue e stringhe in tempo reale.

## Come funziona in sintesi

```
┌─────────────────────────────────────────────────────────┐
│                   Laravel Application                     │
│                                                           │
│  lang/en/messages.php  ──┐                                │
│  lang/fr/messages.php    │  lingua:sync-to-database       │
│  lang/en.json            ├──────────────────────────────►│
│  lang/vendor/…           │                                │
│                         ─┘   language_lines (DB)          │
│                              ┌──────────────────────┐     │
│  LinguaManager (DB driver) ◄ │ group │ key │ text   │     │
│  app()->setLocale()          │ auth  │ … │ {"en":…} │     │
│                              └──────────────────────┘     │
│  __('auth.failed')  ─────────────────────────────────────►│
│  (DB ha la precedenza sui file)                           │
└─────────────────────────────────────────────────────────┘
```

In fase di esecuzione, il `LinguaManager` di Lingua estende il
`Illuminate\Translation\FileLoader` di Laravel ed è registrato come
translation loader. In **modalità database** unisce le traduzioni basate su
file e quelle del database con `array_replace_recursive` — **le voci del
database hanno sempre la precedenza** — così puoi sovrascrivere qualsiasi
stringa senza toccare i file sorgente. In **modalità file** si comporta come
il loader standard di Laravel, supportato dalla stessa interfaccia.

## Concetti chiave

| Concetto | Descrizione |
|---|---|
| **Driver di archiviazione** | `database` (default) o `file` — vedi [Driver di archiviazione](/it/guide/storage) |
| **Lingua** | Una locale installata con metadati (nome, nome nativo, direzione, ordinamento, flag predefinito) |
| **Traduzione** | Una riga in `language_lines` con un `group`, una `key`, un `type` e una colonna JSON `text` che contiene tutti i valori per ogni locale |
| **Tipo di traduzione** | `text`, `html` o `markdown` — determina quale editor viene mostrato nell'interfaccia (solo driver database) |
| **Traduzione vendor** | Una traduzione appartenente a un pacchetto di terze parti; protetta dall'eliminazione accidentale |
| **Locale predefinita** | La lingua principale; eliminare una traduzione per la locale predefinita rimuove l'intero record |
| **Sincronizzazione** | Importazione dei file locali → DB (`sync-to-database`) o esportazione DB → file (`sync-to-local`) |

## Requisiti

| Dipendenza | Versione |
|---|---|
| PHP | **8.3+** |
| Laravel | **11 \| 12 \| 13** |
| Livewire | **4.1+** |
| Livewire Flux | **2.12+** |

::: tip Nessun translation loader esterno
Lingua 2.0 non ha **alcuna** dipendenza runtime da Spatie o laravel-lang. I
metadati delle locale (129+ locale) e il dataset di traduzioni integrato
(26 locale × 7 gruppi, 5902 stringhe, allineati a Laravel v13.14.0)
sono inclusi nel pacchetto — nessun download da GitHub al momento
dell'installazione.
:::

## Passo successivo

Vai alla [guida all'installazione](/it/guide/installation) per configurare
Lingua in meno di cinque minuti, oppure leggi la
[guida all'aggiornamento](/it/guide/upgrade) se stai passando dalla versione 1.x.
