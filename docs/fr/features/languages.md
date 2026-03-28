# Gestion des langues

La page Langues (`/lingua/languages`) est votre centre de contrôle pour toutes les locales installées.

<Screenshot src="/lingua-docs/screenshots/languages-page.png" alt="Page de gestion des langues Lingua" caption="Page des langues — affichant les locales installées avec les statistiques de complétion." />

## Ajouter une langue

### Depuis l'interface

Cliquez sur **Ajouter une langue**, sélectionnez l'une des 70+ locales disponibles, et confirmez. Lingua va :

1. Télécharger les fichiers de langue depuis Laravel Lang
2. Créer un enregistrement `Language` dans la base de données
3. Synchroniser toutes les nouvelles chaînes dans `language_lines`
4. Rafraîchir le tableau avec la nouvelle locale

<Screenshot src="/lingua-docs/screenshots/language-add-modal.png" alt="Modale d'ajout de langue" caption="La modale d'ajout de langue avec le sélecteur de locale avec recherche." width="640px" :center="true"/>

### Depuis la ligne de commande

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

### Par programmation

```php
use Rivalex\Lingua\Facades\Lingua;

// Installer les fichiers de langue (wrapper de lang:add)
Lingua::addLanguage('fr');

// Puis créer l'enregistrement en DB + synchroniser (ce que la commande Artisan fait entièrement)
// → utilisez lingua:add pour le flux complet et orchestré
```

::: tip
Utilisez `Lingua::notInstalled()` pour obtenir la liste des locales disponibles mais pas encore installées :

```php
$available = Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```
:::

## Supprimer une langue

Cliquez sur l'icône de corbeille sur n'importe quelle ligne de langue non définie par défaut. Une modale de confirmation empêche la suppression accidentelle — vous devez saisir le nom de la langue pour confirmer.

En coulisses, l'opération de suppression :
1. Supprime les fichiers de langue via `lang:rm {locale} --force`
2. Supprime toutes les entrées `{locale}` de la colonne JSON `language_lines.text`
3. Supprime l'enregistrement `Language`
4. Réordonne les valeurs de tri des langues restantes

::: warning
La **langue par défaut ne peut pas être supprimée**. Définissez d'abord une autre langue comme langue par défaut.
:::

```bash
# Depuis la ligne de commande
php artisan lingua:remove fr
```

## Définir la langue par défaut

Cliquez sur l'icône étoile (⭐) sur n'importe quelle ligne de langue. Une seule langue peut être par défaut à la fois. La modification est enveloppée dans une transaction de base de données pour éviter un intervalle où aucune langue n'est marquée comme par défaut.

```php
// Par programmation
Lingua::setDefaultLocale('fr');

// Ou via le modèle
$french = Language::where('code', 'fr')->first();
Language::setDefault($french);
```

::: warning Suppression de la valeur par défaut
Si vous définissez une nouvelle langue par défaut, assurez-vous que toutes vos traductions sont au moins partiellement complètes pour cette locale. La langue par défaut est utilisée comme référence dans l'éditeur de l'interface (la colonne de gauche affiche la valeur par défaut comme référence).
:::

## Réordonner les langues

Faites glisser et déposez les lignes de langue pour contrôler leur ordre d'affichage dans toute l'application — dans le widget sélecteur de langue, le sélecteur de locale des traductions, et partout où vous utilisez `Lingua::languages()`.

L'ordre de tri est stocké dans la colonne entière `sort` et réattribué séquentiellement après chaque glisser-déposer.

## Voir les statistiques de complétion

Chaque ligne de langue affiche :

| Métrique | Description |
|---|---|
| **Complétion %** | `traduit / total * 100`, arrondi à 2 décimales |
| **Manquants** | Nombre de chaînes sans valeur pour cette locale |

Ces valeurs sont calculées au moment de la requête via des sous-requêtes de base de données sur la table `language_lines`, elles sont donc toujours à jour.

```php
// Obtenir les statistiques pour une locale spécifique
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// Ou obtenir toutes les langues avec les statistiques en une seule requête
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

## Contrôles de synchronisation

La barre d'outils de la page Langues possède trois boutons de synchronisation :

| Bouton | Action |
|---|---|
| **Synchroniser vers la base de données** | Importe tous les fichiers `lang/` locaux dans `language_lines` |
| **Synchroniser vers le stockage local** | Exporte toutes les traductions de la DB vers les fichiers `lang/` |
| **Mettre à jour via Laravel Lang** | Exécute `lang:update` pour récupérer les dernières chaînes en amont, puis synchronise vers la DB |

Les trois opérations s'exécutent de manière **asynchrone** (attribut Livewire `#[Async]`) pour que l'interface reste réactive lors des synchronisations longues.
