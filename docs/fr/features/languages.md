# Page Langues

La page **Langues** (`/lingua/languages`) est le point de départ de la gestion des locales.
Elle liste toutes les langues installées, affiche leur progression de traduction et vous
permet d'en ajouter, supprimer ou réorganiser.

## Barre d'outils

La barre d'outils est divisée en deux lignes qui s'adaptent à la largeur disponible :

**Ligne 1 — Recherche & ajout de langue**
- Champ de recherche pour filtrer les langues affichées
- Bouton **Nouvelle langue** — ouvre la modal d'ajout depuis le registre de 129+ locales

**Ligne 2 — Synchronisation (pilote base de données)**
- **Synchroniser vers la base de données** — importe les fichiers `lang/` dans la DB
- **Synchroniser vers les fichiers** — exporte la DB vers `lang/`
- **Mettre à jour les langues** — récupère les nouvelles chaînes depuis le jeu de données groupé

::: tip Mode fichier
En pilote `file`, les boutons de synchronisation sont masqués — les fichiers sont la
source de vérité.
:::

## Ajouter une langue

Cliquez sur **Nouvelle langue**. La modal affiche toutes les locales du registre groupé
(129+). Tapez pour filtrer, puis cliquez sur une locale pour l'installer.

Langue installée via `lingua:add` ou la modal — dans les deux cas, les chaînes groupées
sont importées depuis le jeu de données embarqué. **Aucun téléchargement GitHub.**

```bash
# Équivalent en ligne de commande
php artisan lingua:add fr
```

## Supprimer une langue

Cliquez sur l'icône corbeille à côté d'une langue dans la liste. Un dialogue de confirmation
s'affiche. La **langue par défaut ne peut pas être supprimée** — changez d'abord la langue
par défaut dans les Paramètres.

::: warning Suppression en mode base de données
La suppression d'une langue efface toutes ses valeurs de la colonne JSON `text` dans
`language_lines`. Cette opération est **irréversible** depuis l'UI — exportez d'abord si
vous avez besoin d'une sauvegarde.
:::

## Réordonner les langues

Glissez-déposez les lignes de la liste pour changer l'ordre d'affichage. L'ordre est
persistant dans la colonne `sort` de la table `languages`. Le composant sélecteur de
langue respecte cet ordre.

## Statistiques de complétude

Chaque carte de langue affiche :

- **Chaînes totales** — nombre de traductions dans la locale par défaut
- **Traduites** — combien ont une valeur dans cette locale
- **Barre de progression** — pourcentage visuel

Cliquez sur une carte pour aller directement à la page Traductions filtrée sur cette langue.

## Langue par défaut

La langue marquée avec l'indicateur **par défaut** est celle utilisée comme valeur de
repli. Une seule langue peut être par défaut.

Pour changer la langue par défaut :
1. Rendez-vous dans **Paramètres** (`/lingua/settings`)
2. Section « Langue par défaut »
3. Sélectionnez la nouvelle locale par défaut

## Commandes associées

| Commande | Description |
|---|---|
| `php artisan lingua:add {locale}` | Ajouter une locale depuis le registre groupé |
| `php artisan lingua:remove {locale}` | Supprimer une locale et ses traductions |
| `php artisan lingua:sync-to-database` | Synchroniser `lang/` → DB |
| `php artisan lingua:sync-to-local` | Synchroniser DB → `lang/` |
| `php artisan lingua:update-lang` | Mettre à jour les traductions depuis le jeu de données groupé |
