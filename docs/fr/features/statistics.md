# Statistiques

La page **Statistiques** (`/lingua/statistics`) donne une vue d'ensemble de la
couverture des traductions pour toutes les langues installées.

## Vue d'ensemble

La page affiche trois compteurs récapitulatifs :

- **Clés totales** — nombre total de chaînes de traduction
- **Groupes totaux** — nombre de groupes de traduction distincts
- **Langues installées** — nombre de langues enregistrées

Toggle **Inclure les traductions vendor** pour inclure ou exclure les chaînes de packages.

## Couverture par langue

Pour chaque langue installée :

| Colonne | Description |
|---|---|
| Langue | Nom natif avec drapeau |
| Couverture | Barre de progression avec pourcentage |
| Traduites | Clés avec valeur |
| Manquantes | Clés sans valeur — cliquez pour les afficher |

La **langue par défaut** est mise en évidence. Elle affiche toujours 100% car elle définit
l'ensemble de référence.

## Exploration des clés manquantes

Cliquez sur le badge de **nombre manquant** d'une langue pour développer le panneau en ligne.
Chaque ligne affiche :

- **Groupe** — le groupe de traduction (ex. `validation`)
- **Clé** — la clé (ex. `required`)
- **Lien Traduire →** — ouvre la page Traductions pré-filtrée sur cette locale

## Répartition par groupe

Tableau listant tous les groupes avec le nombre de clés traduites par langue. Identifie
quels groupes sont complets et lesquels nécessitent de l'attention.

## Mode fichier

En pilote `file`, les statistiques sont calculées en lisant les fichiers `lang/` directement
et en comparant les clés présentes par locale.

## Toggle traductions vendor

Par défaut, les traductions vendor sont exclues. Activez pour les inclure — note : leur
inclusion peut abaisser la couverture apparente si vous n'avez pas traduit toutes les
chaînes de packages.

::: tip
Triez par nombre manquant pour prioriser votre effort. Les langues avec le plus de clés
manquantes nécessitent le plus d'attention avant une mise en production.
:::
