<figure style="margin: 30px auto 30px !important; max-width: 640px;">
  <img src="../../public/logoLinguaHorizontal-light.svg" class="logo-light" alt="Lingua">
  <img src="../../public/logoLinguaHorizontal-dark.svg" class="logo-dark" alt="Lingua">
</figure>



# Qu'est-ce que Lingua ?

Lingua est un **package Laravel** pour la gestion multilingue. Il peut stocker
chaque traduction dans votre base de données et embarque une belle interface
de gestion réactive construite sur [Livewire 4](https://livewire.laravel.com) et
[Flux 2](https://fluxui.dev) — ou, si vous préférez, continuez à travailler avec
des fichiers `lang/` classiques tout en bénéficiant de la même interface.

::: tip Nouveau dans la 2.0
La version 2.0 supprime entièrement les dépendances externes `spatie/laravel-translation-loader` et
`laravel-lang/common`, ajoute un système de [pilote de stockage](/fr/guide/storage) pluggable (base de données **ou** fichiers), un
workflow d'import/export [Transfert](/fr/guide/quick-start), et un
[renforcement de sécurité](/fr/guide/security) complet. Sécurisé par défaut.
:::

## Le problème qu'il résout

Les traductions Laravel standard vivent dans des fichiers PHP et JSON dans `lang/`.
Cela fonctionne bien pour les petits projets, mais crée des frictions à mesure
qu'une application grandit :

- **Mettre à jour une traduction nécessite un déploiement** — même pour corriger une simple coquille.
- **Les membres non techniques de l'équipe ne peuvent pas modifier les traductions** — les éditeurs ont besoin de Git et d'une revue de code.
- **Suivre la complétude des traductions est manuel** — il faut comparer des fichiers pour trouver les lacunes.
- **Supporter de nombreuses locales encombre la base de code** — des dizaines de fichiers dispersés dans les répertoires.

Avec le **pilote base de données** par défaut, Lingua stocke chaque traduction dans
une seule colonne JSON par ligne et fournit une interface Livewire où tout utilisateur
autorisé peut gérer les langues et les chaînes en temps réel.

## Comment ça fonctionne en un coup d'œil

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
│  (DB a la priorité sur les fichiers)                      │
└─────────────────────────────────────────────────────────┘
```

Au moment de l'exécution, `LinguaManager` de Lingua étend le propre
`Illuminate\Translation\FileLoader` de Laravel et est enregistré comme chargeur
de traductions. En **mode base de données**, il fusionne les traductions basées sur
les fichiers et celles de la base de données avec `array_replace_recursive` —
**les entrées de la base de données ont toujours la priorité** — vous pouvez donc
remplacer n'importe quelle chaîne sans toucher aux fichiers sources. En **mode fichier**,
il se comporte comme le chargeur Laravel standard, soutenu par la même interface.

## Concepts clés

| Concept | Description |
|---|---|
| **Pilote de stockage** | `database` (par défaut) ou `file` — voir [Pilotes de stockage](/fr/guide/storage) |
| **Langue** | Une locale installée avec ses métadonnées (nom, nom natif, direction, ordre de tri, indicateur par défaut) |
| **Traduction** | Une ligne dans `language_lines` avec un `group`, une `key`, un `type` et une colonne JSON `text` contenant toutes les valeurs de locale |
| **Type de traduction** | `text`, `html` ou `markdown` — détermine quel éditeur est affiché dans l'interface (pilote base de données uniquement) |
| **Traduction vendor** | Une traduction appartenant à un package tiers ; protégée contre la suppression accidentelle |
| **Locale par défaut** | La langue principale ; supprimer une traduction pour la locale par défaut supprime l'enregistrement entier |
| **Synchronisation** | Importation des fichiers locaux → DB (`sync-to-database`) ou exportation DB → fichiers (`sync-to-local`) |

## Prérequis

| Dépendance | Version |
|---|---|
| PHP | **8.3+** |
| Laravel | **12 \| 13** |
| Livewire | **4.1+** |
| Livewire Flux | **2.12+** |

::: tip Pas de chargeur de traductions externe
Lingua 2.0 n'a **aucune** dépendance à l'exécution sur Spatie ou laravel-lang. Les
métadonnées de locale (129+ locales) et le jeu de données de traduction groupé (26 locales ×
7 groupes, 5902 chaînes, aligné sur Laravel v13.14.0) sont embarqués dans le
package — aucun téléchargement GitHub au moment de l'installation.
:::

## Étape suivante

Rendez-vous sur le [guide d'installation](/fr/guide/installation) pour configurer Lingua
en moins de cinq minutes, ou lisez le [guide de mise à niveau](/fr/guide/upgrade) si
vous venez de la version 1.x.
