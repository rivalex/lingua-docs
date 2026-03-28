# Gestion des traductions

La page Traductions (`/lingua/translations/{locale?}`) vous permet de parcourir, filtrer et modifier chaque chaîne de traduction.

<Screenshot src="/screenshots/translations-page.png" alt="Page des traductions Lingua" caption="Page des traductions — avec le sélecteur de locale, le filtre de groupe et l'éditeur en ligne." />

## Navigation dans les traductions

### Sélecteur de locale

Les onglets de locale en haut de la page vous permettent de basculer entre les langues installées. L'URL est mise à jour vers `/lingua/translations/{locale}` pour que chaque vue soit mémorisable et partageable.

La colonne de la **locale par défaut** est toujours affichée à gauche comme référence — vous modifiez la locale sélectionnée à droite.

### Filtrage

| Filtre | Description |
|---|---|
| **Recherche** | Recherche dans le nom du groupe, la clé et toutes les valeurs de locale |
| **Groupe** | Filtre selon un groupe spécifique (ex. `auth`, `validation`, `single`) |
| **Type** | Filtre par `text`, `html` ou `markdown` |
| **Afficher uniquement les manquants** | Affiche uniquement les chaînes sans valeur dans la locale sélectionnée |

<Screenshot src="/screenshots/translations-filters.png" alt="Filtres de traduction" caption="Filtrage pour afficher uniquement les traductions françaises manquantes dans le groupe validation." />

### Pagination

Les résultats sont paginés avec un nombre d'éléments par page configurable (25 / 50 / 100). La page courante et le paramètre par page sont persistés dans la chaîne de requête URL.

## Édition des traductions

### Édition en ligne

Cliquez directement dans la cellule de traduction pour commencer l'édition. Les modifications sont sauvegardées lors du blur (quand vous cliquez ailleurs ou appuyez sur Tab).

- Les traductions **texte brut** utilisent un simple `<textarea>`
- Les traductions **HTML** ouvrent l'éditeur de texte enrichi TipTap
- Les traductions **Markdown** ouvrent l'éditeur Markdown TipTap

<Screenshot src="/screenshots/translation-editor-html.png" alt="Éditeur de traduction HTML" caption="L'éditeur HTML TipTap pour les traductions en texte enrichi." width="512px" :center="true"/>

### Synchroniser depuis la valeur par défaut

Chaque ligne de traduction dispose d'un bouton **Synchroniser depuis la valeur par défaut** (↺). En cliquant dessus, la valeur de la locale par défaut est copiée vers la locale courante — utile comme point de départ quand seules de légères modifications de formulation sont nécessaires.

### Modale de modification

Pour la locale par défaut, cliquez sur l'icône crayon pour ouvrir la modale de modification, où vous pouvez changer le type de traduction (texte / html / markdown) ainsi que la valeur.

::: tip Changer le type de traduction
Si vous changez une traduction de `text` à `html`, l'éditeur en ligne de la ligne passera immédiatement à TipTap. La valeur stockée n'est pas modifiée — seul le comportement de l'éditeur change.
:::

## Créer des traductions

Cliquez sur **Nouvelle traduction** pour créer une entrée personnalisée. Renseignez :

- **Groupe** — l'équivalent du nom de fichier (ex. `marketing`, `emails`)
- **Clé** — la clé au sein du groupe (ex. `hero_title`)
- **Type** — `text`, `html` ou `markdown`
- **Valeur** — la traduction pour la locale par défaut

```
group: marketing
key:   hero_title
type:  text
value: Build faster, together.
```

La nouvelle clé est immédiatement disponible via `__('marketing.hero_title')`.

::: warning Traductions de packages
Vous ne pouvez pas créer de traductions directement dans un groupe de package (ex. `validation`, `auth`). Ces groupes sont la propriété de Laravel ou d'autres packages et sont synchronisés automatiquement. Si vous souhaitez remplacer une chaîne de package, modifiez-la directement sur la page des traductions.
:::

## Supprimer des traductions

### Supprimer pour une locale spécifique

Sur n'importe quelle locale non définie par défaut, le bouton de suppression retire uniquement la valeur de cette locale de la colonne JSON. La clé de traduction continue d'exister ; elle retombe simplement sur la locale par défaut.

### Supprimer entièrement

Sur la vue de la locale par défaut, le bouton de suppression retire l'enregistrement complet de `language_lines`. Utilisez ceci pour nettoyer les clés qui ne sont plus utilisées dans votre base de code.

::: danger Protection des traductions de packages
Les traductions de packages ne peuvent pas être supprimées. Toute tentative affiche un avertissement et déclenche un événement `vendor_translation_protected`. Vous pouvez uniquement **modifier** les valeurs des traductions de packages.
:::

## Copier la clé dans le presse-papiers

Chaque ligne possède une icône de presse-papiers qui copie la référence complète `groupe.clé` (ex. `auth.failed`) dans votre presse-papiers — pratique lors du référencement des clés dans Blade ou PHP.

## Raccourcis clavier

| Touche | Action |
|---|---|
| `Tab` | Sauvegarder le champ courant et passer au suivant |
| `Shift + Tab` | Sauvegarder le champ courant et revenir au précédent |
| `Echap` | Annuler les modifications et fermer l'éditeur |
