# Statistiques de traduction

La page Statistiques vous donne un aperçu en temps réel de la couverture de vos traductions pour toutes les langues installées.

```blade
<a href="{{ route('lingua.statistics') }}">Statistiques de traduction</a>
```

<Screenshot src="/screenshots/statistics-page.png" alt="Page Statistiques de traduction" caption="La page des statistiques affiche la couverture par langue, la répartition par groupe et les clés manquantes." />

## Vue d'ensemble

La page affiche trois compteurs récapitulatifs en haut :

- **Clés totales** — nombre total de chaînes de traduction dans la base de données
- **Groupes totaux** — nombre de groupes de traduction distincts
- **Langues installées** — nombre de langues enregistrées dans le système

Vous pouvez activer **Inclure les traductions fournisseur** pour inclure ou exclure les traductions de packages de toutes les statistiques.

## Couverture par langue

<Screenshot src="/screenshots/statistics-coverage.png" alt="Section couverture par langue" caption="Chaque ligne de langue affiche une barre de progression, un pourcentage et le nombre de clés manquantes." />

Pour chaque langue installée, vous pouvez voir :

| Colonne | Description |
|---|---|
| Langue | Nom et drapeau de la langue |
| Couverture | Barre de progression avec pourcentage de complétion |
| Traduites | Nombre de clés ayant une valeur pour cette locale |
| Manquantes | Nombre de clés sans valeur — cliquez pour développer le panneau des clés manquantes |

La **langue par défaut** est mise en évidence avec un badge. Comme la locale par défaut définit l'ensemble de clés de référence, elle affiche toujours 100% de couverture.

## Exploration des clés manquantes

Cliquez sur le **badge du nombre manquant** d'une ligne de langue pour développer le panneau des clés manquantes en ligne.

<Screenshot src="/screenshots/statistics-missing.png" alt="Panneau des clés manquantes développé" caption="Le panneau des clés manquantes affiche le groupe, la clé et un lien direct vers l'éditeur de traductions." />

Chaque ligne du panneau affiche :

- **Groupe** — le groupe de traduction (ex. `validation`, `auth`)
- **Clé** — la clé de traduction (ex. `required`, `failed`)
- **Traduire →** lien — ouvre la page Traductions pré-filtrée sur cette locale

Cliquez à nouveau sur la même ligne de langue pour réduire le panneau.

## Répartition par groupe

<Screenshot src="/screenshots/statistics-breakdown.png" alt="Tableau de répartition par groupe" caption="Le tableau de répartition affiche le nombre de clés traduites par locale pour chaque groupe." />

Le tableau de répartition liste tous les groupes de traduction avec le nombre de clés traduites par langue installée. Utilisez-le pour identifier quels groupes sont entièrement traduits et lesquels nécessitent de l'attention.

## Bascule des traductions fournisseur

Par défaut, les traductions fournisseur (de packages comme `laravel/framework`) sont exclues des statistiques. Activez **Inclure les traductions fournisseur** pour les inclure.

::: info
Les traductions fournisseur sont souvent maintenues en amont par l'auteur du package. Les inclure dans vos statistiques peut abaisser votre couverture apparente si vous n'avez pas ajouté de surcharges spécifiques à la locale.
:::

::: tip Travailler efficacement
Triez par nombre manquant pour prioriser votre effort de traduction. Les langues avec le plus de clés manquantes en haut de votre liste nécessitent le plus d'attention.
:::
