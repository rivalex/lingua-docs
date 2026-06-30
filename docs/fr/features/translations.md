# Page Traductions

La page **Traductions** (`/lingua/translations`) est l'endroit où les chaînes de traduction
sont visualisées et modifiées. Elle prend en charge l'édition en ligne, le filtrage et les
statistiques de complétude.

## Interface

La page est divisée en trois zones :

1. **Barre d'outils** — sélecteur de locale, filtre de groupe, filtre de type, toggle
   « Manquantes uniquement »
2. **Tableau de traductions** — liste des clés avec leurs valeurs
3. **Éditeur en ligne** — s'active quand vous cliquez sur une ligne

## Sélecteur de locale

En haut à droite de la barre d'outils. Sélectionnez la langue cible pour afficher et
modifier ses traductions. Langue par défaut sélectionnée automatiquement.

## Filtre de groupe

Filtre les traductions par groupe (`auth`, `validation`, `pagination`, `single`,
etc.). Le groupe `single` contient les traductions des fichiers JSON Laravel.

## Afficher seulement les manquantes

Toggle qui masque toutes les traductions qui ont déjà une valeur dans la locale
sélectionnée. Pratique pour combler les lacunes rapidement.

## Édition en ligne

Cliquez sur n'importe quelle ligne pour ouvrir l'éditeur en ligne :

- **Type `text`** — champ de texte simple
- **Type `html`** — éditeur de texte riche TipTap (voir [Texte riche](/fr/features/rich-text))
- **Type `markdown`** — éditeur Markdown TipTap

Appuyez sur **Entrée** ou cliquez ailleurs pour sauvegarder. La valeur est mise à jour
instantanément et le cache est invalidé chirurgicalement pour `(locale, group)`.

::: tip Locale par défaut
Modifier une traduction dans la **locale par défaut** écrase la valeur de base. Supprimer
une traduction dans la locale par défaut supprime l'**enregistrement entier** — pour toutes
les locales.
:::

## Créer une nouvelle traduction

Cliquez sur **Nouvelle traduction** dans la barre d'outils. Un formulaire s'ouvre pour
saisir le groupe, la clé, le type et la valeur initiale.

## Supprimer une traduction

Cliquez sur l'icône corbeille dans la ligne. Un dialogue de confirmation s'affiche.

::: warning Traductions vendor
Les traductions marquées comme vendor (`is_vendor = true`) ne peuvent pas être supprimées
depuis l'UI — elles lèvent une `VendorTranslationProtectedException`. Voir
[Traductions vendor](/fr/features/vendor-translations).
:::

## Recherche

Le champ de recherche dans la barre d'outils filtre par clé ou par valeur.

## Navigation au clavier

| Touche | Action |
|---|---|
| `Tab` | Passer à la traduction suivante |
| `Shift+Tab` | Revenir à la précédente |
| `Échap` | Fermer l'éditeur sans sauvegarder |
| `Ctrl+Entrée` | Sauvegarder et passer à la suivante |

## Mode fichier

En pilote `file`, les modifications sont écrites directement dans les fichiers PHP/JSON
de `lang/` via `AtomicFileWriter` (renommage atomique + `opcache_invalidate`). Les
types HTML/Markdown ne sont pas disponibles — tout est texte brut.

## Copier la clé

Chaque ligne a une icône presse-papiers qui copie la référence complète `groupe.clé`
(ex. `auth.failed`) dans le presse-papiers.
