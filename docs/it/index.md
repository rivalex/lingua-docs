---
layout: home

hero:
  name: "LINGUA"
  text: "Traduzioni basate su database per Laravel"
  tagline: Installa le lingue, gestisci le traduzioni e cambia locale — tutto tramite una bellissima interfaccia Livewire, senza alcun deployment.
  image:
    light: logoLinguaVertical-light.svg
    dark: logoLinguaVertical-dark.svg
    alt: Lingua UI
  actions:
    - theme: brand
      text: Inizia subito
      link: /it/guide/introduction
    - theme: alt
      text: Vedi su GitHub
      link: https://github.com/rivalex/lingua

features:
  - icon: 🗄️
    title: Traduzioni su database
    details: Tutte le traduzioni risiedono nel database e sono modificabili istantaneamente — nessun deploy di file necessario. Il caricamento è gestito da laravel-translation-loader di Spatie.

  - icon: ⚡
    title: Livewire + Flux UI
    details: Interfaccia di gestione reattiva e in tempo reale costruita con Livewire 4 e Flux 2. Ogni azione — aggiungere una lingua, modificare una traduzione, sincronizzare — avviene senza ricaricare la pagina.

  - icon: 🔄
    title: Sincronizzazione bidirezionale
    details: Importa i tuoi file PHP/JSON esistenti nel database con un solo comando, oppure esporta tutto nuovamente in file per il controllo versione e i deployment.

  - icon: 🌐
    title: Oltre 70 lingue
    details: Installa qualsiasi locale dall'ecosistema Laravel Lang con un singolo comando Artisan. I file della lingua, i record DB e le traduzioni vengono configurati automaticamente.

  - icon: ✍️
    title: Supporto testo ricco
    details: Ogni traduzione può essere testo semplice, HTML o Markdown. L'editor corretto si attiva automaticamente in base al tipo di traduzione.

  - icon: ↔️
    title: Supporto RTL / LTR
    details: Arabo, ebraico, persiano e altri linguaggi RTL sono completamente supportati. Lingua memorizza ed espone la direzione del testo per ogni lingua.

  - icon: 📦
    title: Traduzioni vendor
    details: Gestisci le traduzioni dei pacchetti (messaggi di validazione, paginazione, ecc.) insieme alle tue stringhe, con protezione integrata contro l'eliminazione accidentale.

  - icon: 📊
    title: Monitoraggio avanzamento
    details: Ogni lingua mostra una percentuale di completamento e il conteggio delle traduzioni mancanti, così sai sempre cosa deve essere tradotto.

  - icon: 🧪
    title: Completamente testato
    details: Oltre 150 test Pest che coprono tutti i comandi Artisan, i componenti Livewire, i componenti Blade, gli helper e l'intera API del facade.
---
