<figure style="margin: 30px auto 30px !important; max-width: 640px;">
  <img src="../../public/logoLinguaHorizontal-light.svg" class="logo-light" alt="Sélecteur de langue en mode barre latérale">
  <img src="../../public/logoLinguaHorizontal-dark.svg" class="logo-dark" alt="Sélecteur de langue en mode barre latérale">
</figure>

# Qu'est-ce que Lingua ?

Lingua est un **package Laravel** qui remplace le système de traduction par défaut basé sur des fichiers par un système entièrement piloté par la base de données, accompagné d'une belle interface de gestion réactive construite sur [Livewire 4](https://livewire.laravel.com) et [Flux 2](https://fluxui.dev).

## Le problème qu'il résout

Les traductions Laravel standard vivent dans des fichiers PHP et JSON dans `lang/`. Cela fonctionne bien pour les petits projets, mais crée des frictions à mesure que l'application grandit :

- **Mettre à jour une traduction nécessite un déploiement** — même pour corriger une simple faute de frappe.
- **Les membres non techniques de l'équipe ne peuvent pas modifier les traductions** — les éditeurs ont besoin de Git et d'une révision de code.
- **Suivre la complétude des traductions est manuel** — il faut comparer les fichiers pour trouver les lacunes.
- **Prendre en charge de nombreuses locales encombre la base de code** — des dizaines de fichiers dispersés dans plusieurs répertoires.

Lingua stocke chaque traduction dans la base de données, dans une seule colonne JSON par ligne, et fournit une interface Livewire où tout utilisateur autorisé peut gérer les langues et les chaînes en temps réel.

## Fonctionnement en un coup d'œil

```
┌─────────────────────────────────────────────────────────┐
│                   Application Laravel                   │
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
│  (La DB a la priorité sur les fichiers)                 │
└─────────────────────────────────────────────────────────┘
```

Au moment de l'exécution, Lingua enregistre un `LinguaManager` personnalisé comme chargeur de traductions Laravel. Il fusionne les traductions basées sur des fichiers et celles en base de données — **les entrées en base de données ont toujours la priorité** — vous pouvez ainsi remplacer n'importe quelle chaîne sans toucher aux fichiers sources.

## Concepts clés

| Concept | Description |
|---|---|
| **Langue** | Une locale installée avec ses métadonnées (nom, nom natif, direction, ordre de tri, indicateur par défaut) |
| **Traduction** | Une ligne dans `language_lines` avec un `group`, une `key`, un `type` et une colonne JSON `text` contenant toutes les valeurs de locale |
| **Type de traduction** | `text`, `html` ou `markdown` — détermine quel éditeur est affiché dans l'interface |
| **Traduction de package** | Une traduction appartenant à un package tiers ; protégée contre la suppression accidentelle |
| **Locale par défaut** | La langue principale ; la suppression d'une traduction pour la locale par défaut supprime l'enregistrement entier |
| **Synchronisation** | Le processus d'import des fichiers locaux → base de données (`sync-to-database`) ou d'export base de données → fichiers (`sync-to-local`) |

## Prérequis

| Dépendance | Version |
|---|---------|
| PHP | **8.2+** |
| Laravel | **11 \| 12 \| 13** |
| Livewire | **4.0+** |
| Livewire Flux | **2.0+** |

## Étape suivante

Rendez-vous sur le [guide d'installation](/fr/guide/installation) pour configurer Lingua en moins de cinq minutes.
