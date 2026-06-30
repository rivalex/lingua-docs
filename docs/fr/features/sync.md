# Synchronisation

La synchronisation dans Lingua est la mécanique bidirectionnelle qui déplace les
traductions entre les fichiers `lang/` et la base de données. En pilote base de données,
elle est disponible via l'UI et les commandes Artisan. En pilote fichier, les fichiers
sont la source de vérité.

## Jeu de données groupé (aucune dépendance externe)

::: tip Nouveau dans la 2.0
Lingua 2.0 supprime la dépendance à `laravel-lang/common`. Le jeu de données de
traduction est **embarqué dans le package** :

- **26 locales** avec 7 groupes chacune
- **5902 chaînes**, alignées sur Laravel **v13.14.0**
- Aucun téléchargement GitHub lors de `lingua:add` ou de la synchronisation
:::

## Directions de synchronisation

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (DB)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄── lingua:sync-to-local
                      ─┘
```

### Fichiers → Base de données (`sync-to-database`)

Lit les fichiers PHP et JSON de `lang/` et upsert les valeurs dans `language_lines`.

```bash
php artisan lingua:sync-to-database
```

Déclenché aussi via le bouton **Synchroniser vers la base de données** dans l'UI Langues.

### Base de données → Fichiers (`sync-to-local`)

Exporte toutes les traductions DB vers `lang/` dans le format PHP/JSON correct.

```bash
php artisan lingua:sync-to-local
```

Déclenché aussi via le bouton **Synchroniser vers les fichiers** dans l'UI Langues.

### Mettre à jour depuis le jeu de données groupé (`update-lang`)

Récupère les nouvelles chaînes depuis le jeu de données embarqué et les fusionne dans
la DB sans écraser les valeurs existantes.

```bash
php artisan lingua:update-lang
```

Use case : après une mise à jour de Lingua qui embarque de nouvelles chaînes Laravel
(p. ex. de nouvelles règles de validation).

## Comportement d'upsert

Lors de `sync-to-database`, Lingua utilise `updateOrCreate` sur `group` + `key` :
- **Nouvelles clés** — insérées
- **Clés existantes** — colonne JSON `text` fusionnée ; les valeurs modifiées via l'UI
  sont **préservées**
- **Protection vendor** — les entrées `is_vendor = true` ne sont jamais écrasées

## Invalidation chirurgicale du cache

À chaque écriture (sync, import, édition UI), Lingua invalide **uniquement** les clés de
cache affectées :

```
Cache::forget('lingua.trans.{locale}.{group}')
```

Il n'y a **aucun** `cache:clear` global dans aucun chemin de synchronisation.

## Pilote fichier — comportement spécial

En mode `file`, les boutons de synchronisation dans l'UI sont **masqués** (les fichiers
sont le magasin, pas une cible de synchronisation). La commande `lingua:sync-to-local`
est une opération nulle sans `--force`.

## Via la façade

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
Lingua::syncToLocal();
```

## Événements de synchronisation

| Événement | Déclenché quand |
|---|---|
| `SyncedToDatabase` | `sync-to-database` terminé |
| `SyncedToLocal` | `sync-to-local` terminé |

Voir [Événements](/fr/api/events#sync-events).
