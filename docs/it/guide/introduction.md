<figure style="margin: 30px auto 30px !important; max-width: 640px;">
  <img src="../../public/logoLinguaHorizontal-light.svg" class="logo-light" alt="Language selector in sidebar mode">
  <img src="../../public/logoLinguaHorizontal-dark.svg" class="logo-dark" alt="Language selector in sidebar mode">
</figure>

# Che cos'è Lingua?

Lingua è un **pacchetto Laravel** che sostituisce il sistema di traduzione predefinito basato su file con uno completamente gestito dal database, dotato di una bellissima interfaccia di gestione reattiva costruita su [Livewire 4](https://livewire.laravel.com) e [Flux 2](https://fluxui.dev).

## Il problema che risolve

Le traduzioni standard di Laravel risiedono in file PHP e JSON all'interno di `lang/`. Questo funziona bene per i progetti piccoli, ma crea attriti man mano che un'applicazione cresce:

- **Aggiornare una traduzione richiede un deployment** — anche per la correzione di un semplice errore di battitura.
- **I membri non tecnici del team non possono modificare le traduzioni** — i redattori hanno bisogno di Git e di una code review.
- **Tenere traccia della completezza delle traduzioni è manuale** — bisogna confrontare i file per trovare le lacune.
- **Supportare molte lingue ingombra il codebase** — decine di file sparsi nelle directory.

Lingua memorizza ogni traduzione nel database, in un'unica colonna JSON per riga, e fornisce un'interfaccia Livewire dove qualsiasi utente autorizzato può gestire lingue e stringhe in tempo reale.

## Come funziona in sintesi

```
┌─────────────────────────────────────────────────────────┐
│                   Laravel Application                   │
│                                                         │
│  lang/en/messages.php  ──┐                              │
│  lang/fr/messages.php    │  lingua:sync-to-database     │
│  lang/en.json            ├─────────────────────────────►│
│  lang/vendor/…           │                              │
│                         ─┘   language_lines (DB)        │
│                              ┌──────────────────────┐   │
│  LinguaMiddleware  ◄──────── │ group │ key │ text   │   │
│  app()->setLocale()          │ auth  │ … │ {"en":…} │   │
│                              └──────────────────────┘   │
│  __('auth.failed')  ───────────────────────────────────►│
│  (DB ha la precedenza sui file)                         │
└─────────────────────────────────────────────────────────┘
```

In fase di esecuzione, Lingua registra un `LinguaManager` personalizzato come loader di traduzione di Laravel. Unisce le traduzioni basate su file e quelle del database — **le voci del database hanno sempre la precedenza** — così puoi sovrascrivere qualsiasi stringa senza toccare i file sorgente.

## Concetti chiave

| Concetto | Descrizione |
|---|---|
| **Lingua** | Una locale installata con metadati (nome, nome nativo, direzione, ordinamento, flag predefinito) |
| **Traduzione** | Una riga in `language_lines` con un `group`, una `key`, un `type` e una colonna JSON `text` che contiene tutti i valori per ogni locale |
| **Tipo di traduzione** | `text`, `html` o `markdown` — determina quale editor viene mostrato nell'interfaccia |
| **Traduzione vendor** | Una traduzione appartenente a un pacchetto di terze parti; protetta dall'eliminazione accidentale |
| **Locale predefinita** | La lingua principale; eliminare una traduzione per la locale predefinita rimuove l'intero record |
| **Sincronizzazione** | Il processo di importazione dei file locali → DB (`sync-to-database`) o esportazione DB → file (`sync-to-local`) |

## Requisiti

| Dipendenza | Versione  |
|---|----------|
| PHP | **8.2+** |
| Laravel | **11 \| 12 \| 13** |
| Livewire | **4.0+** |
| Livewire Flux | **2.0+** |

## Passo successivo

Vai alla [guida all'installazione](/it/guide/installation) per configurare Lingua in meno di cinque minuti.
