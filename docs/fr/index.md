---
layout: home

hero:
  name: "LINGUA"
  text: "Traductions pilotées par base de données pour Laravel"
  tagline: Zéro dépendance externe. Deux pilotes de stockage. Import/export complet. Sécurité renforcée. Conçu pour PHP 8.3+ et Laravel 11–13.
  image:
    light: /logoLinguaVertical-light.svg
    dark: /logoLinguaVertical-dark.svg
    alt: Lingua UI
  actions:
    - theme: brand
      text: Démarrer
      link: /fr/guide/introduction
    - theme: alt
      text: Voir sur GitHub
      link: https://github.com/rivalex/lingua

features:
  - icon: 🔒
    title: Zéro dépendance
    details: Lingua embarque son propre chargeur de traductions, son registre de locales et son jeu de données groupé. Pas de Spatie, pas de laravel-lang — rien à synchroniser.

  - icon: 🗄️
    title: Deux pilotes de stockage
    details: Utilisez les traductions depuis la base de données (édition live dans l'UI, zéro déploiement) ou depuis les fichiers (versionné, compatible CI). Changez en une seule commande.

  - icon: 📤
    title: Import / Export
    details: "Déplacez les traductions entre formats : CSV, JSON, XLSX, ODS. Bilingue, multi-locale ou json-native. Prévisualisation en mode dry-run avant validation."

  - icon: 🛡️
    title: Sécurité renforcée
    details: "Renforcement F1–F9 : assainisseur XSS, garde anti-traversée de chemin, interdiction d'injection SQL, protection des vendors, portail d'authentification, non-divulgation des exceptions, et plus encore."

  - icon: ⚡
    title: UI réactive
    details: Cinq pages Livewire — Langues, Traductions, Statistiques, Paramètres et Transfert. Chaque action est instantanée, aucun déploiement n'est nécessaire pour corriger une coquille.

  - icon: 🌐
    title: 129+ locales incluses
    details: "Installez n'importe quelle locale depuis le registre intégré. Aucun téléchargement. Inclus : 26 locales, 5902 chaînes, alignées sur Laravel 13.14."

  - icon: ↔️
    title: RTL / LTR prêt
    details: L'arabe, l'hébreu, le persan et autres scripts RTL sont entièrement pris en charge. Les métadonnées de direction sont stockées et exposées pour chaque langue.

  - icon: 📊
    title: Couverture des traductions
    details: Statistiques de complétude par langue — total des chaînes, nombre traduit et clés manquantes par groupe. Sachez toujours ce qui reste à traduire.

  - icon: 🧪
    title: 783 tests
    details: PHP 8.3+ · Laravel 11–13 · Livewire 4.1+ · Flux 2.12+. La suite couvre les commandes, composants, pilotes, import/export et l'API façade complète.
---
