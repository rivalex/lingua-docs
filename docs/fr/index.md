---
layout: home

hero:
  name: "LINGUA"
  text: "Traductions pilotées par la base de données pour Laravel"
  tagline: Installez des langues, gérez vos traductions et changez de locale - le tout via une belle interface Livewire, sans aucun déploiement.
  image:
    light: /logoLinguaVertical-light.svg
    dark: /logoLinguaVertical-dark.svg
    alt: Interface Lingua
  actions:
    - theme: brand
      text: Démarrer
      link: /fr/guide/introduction
    - theme: alt
      text: Voir sur GitHub
      link: https://github.com/rivalex/lingua

features:
  - icon: 🗄️
    title: Traductions en base de données
    details: Toutes les traductions vivent dans la base de données et sont modifiables instantanément - aucun déploiement de fichier n'est nécessaire. Le laravel-translation-loader de Spatie gère la couche de chargement.

  - icon: ⚡
    title: Livewire + Flux UI
    details: Interface de gestion réactive en temps réel, construite avec Livewire 4 et Flux 2. Chaque action - ajout de langue, édition de traduction, synchronisation - se fait sans rechargement de page.

  - icon: 🔄
    title: Synchronisation bidirectionnelle
    details: Importez vos fichiers lang/ PHP/JSON existants dans la base de données en une seule commande, ou exportez tout vers des fichiers pour le contrôle de version et les déploiements.

  - icon: 🌐
    title: 70+ langues
    details: Installez n'importe quelle locale de l'écosystème Laravel Lang avec une seule commande Artisan. Les fichiers de langue, les enregistrements en base et les traductions sont configurés automatiquement.

  - icon: ✍️
    title: Support du texte enrichi
    details: Chaque traduction peut être du texte brut, du HTML ou du Markdown. L'éditeur approprié s'active automatiquement selon le type de traduction.

  - icon: ↔️
    title: Support RTL / LTR
    details: L'arabe, l'hébreu, le persan et les autres langues RTL sont entièrement supportés. Lingua stocke et expose la direction du texte pour chaque langue.

  - icon: 📦
    title: Traductions des packages
    details: Gérez les traductions des packages (messages de validation, pagination, etc.) aux côtés de vos propres chaînes, avec une protection intégrée contre la suppression accidentelle.

  - icon: 📊
    title: Suivi de progression
    details: Chaque langue affiche un pourcentage de complétion et un nombre de traductions manquantes, pour toujours savoir ce qui reste à traduire.

  - icon: 🧪
    title: Entièrement testé
    details: Plus de 150 tests Pest couvrant toutes les commandes Artisan, les composants Livewire, les composants Blade, les helpers et l'intégralité de l'API facade.
---
