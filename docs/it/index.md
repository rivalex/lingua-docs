---
layout: home

hero:
  name: "LINGUA"
  text: "Traduzioni database-driven per Laravel"
  tagline: Zero dipendenze esterne. Due driver di archiviazione. Import/export completo. Sicurezza avanzata. Progettato per PHP 8.3+ e Laravel 11–13.
  image:
    light: /logoLinguaVertical-light.svg
    dark: /logoLinguaVertical-dark.svg
    alt: Lingua UI
  actions:
    - theme: brand
      text: Inizia
      link: /it/guide/introduction
    - theme: alt
      text: Visualizza su GitHub
      link: https://github.com/rivalex/lingua

features:
  - icon: 🔒
    title: Zero dipendenze
    details: Lingua include il proprio translation loader, registro delle locale e dataset integrato. Nessun Spatie, nessun laravel-lang — nulla da sincronizzare.

  - icon: 🗄️
    title: Due driver di archiviazione
    details: Esegui le traduzioni dal database (modifica live tramite UI, zero deploy) o da file (versionati, compatibili con CI). Passa da uno all'altro con un solo comando.

  - icon: 📤
    title: Import / Export
    details: "Sposta le traduzioni tra formati: CSV, JSON, XLSX, ODS. Bilingue, multi-locale o json-native. Anteprima dry-run prima di confermare."

  - icon: 🛡️
    title: Sicurezza avanzata
    details: "Hardening F1–F9: sanitizzatore XSS, protezione path traversal, blocco SQL injection, protezione vendor, auth gate, non-disclosure delle eccezioni e altro."

  - icon: ⚡
    title: UI reattiva
    details: Cinque pagine Livewire — Languages, Translations, Statistics, Settings e Transfer. Ogni azione è in tempo reale, senza deploy necessari per correggere un refuso.

  - icon: 🌐
    title: 129+ locale integrati
    details: "Installa qualsiasi locale dal registro integrato. Nessun download da internet. Inclusi: 26 locale, 5902 stringhe, allineati a Laravel 13.14."

  - icon: ↔️
    title: Supporto RTL / LTR
    details: Arabo, ebraico, persiano e altri script RTL sono completamente supportati. I metadati di direzione sono archiviati ed esposti per ogni lingua.

  - icon: 📊
    title: Copertura traduzioni
    details: Statistiche di completamento per lingua — totale stringhe, conteggio tradotte e chiavi mancanti per gruppo. Sai sempre cosa manca.

  - icon: 🧪
    title: 783 test
    details: PHP 8.3+ · Laravel 11–13 · Livewire 4.1+ · Flux 2.12+. La suite copre comandi, componenti, driver, import/export e l'intera API della facade.
---
