# Pilotes de stockage

<Badge type="tip" text="Nouveau dans la 2.0" /> Lingua 2.0 introduit un système de
**pilote de stockage** pluggable. Vous choisissez où vivent les traductions : dans la
**base de données** (la valeur par défaut complète) ou dans des **fichiers `lang/`** classiques.

```php
// config/lingua.php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

## Choisir un pilote

| Fonctionnalité | `database` | `file` |
|---|:---:|:---:|
| Magasin de stockage | Table `language_lines` | `lang/` PHP + JSON |
| Types HTML / Markdown | ✅ | ❌ (aplati en texte brut) |
| Statistiques de traduction | ✅ | ✅ (calculé depuis les fichiers) |
| Import / export (Transfert) | ✅ | ✅ |
| Protection vendor | ✅ | ✅ |
| Cache chirurgical par (locale, group) | ✅ | n/a |
| Boutons de synchronisation dans l'UI | ✅ | masqués |
| Modifier les traductions dans l'UI | ✅ | ✅ |

::: tip Règle générale
Utilisez **database** pour la meilleure expérience et les remplacements à l'exécution. Utilisez
**file** quand les traductions doivent rester sous contrôle de version ou que le système de
fichiers est la source de vérité.
:::

## Pilote base de données

Le pilote par défaut, identique au comportement de la 1.x.

- Traductions stockées dans la table `language_lines`, toutes les locales dans une
  colonne JSON `text` par ligne
- Prend en charge les types `text`, `html` et `markdown`, chacun avec son propre éditeur
- Cache chirurgical : `Cache::forget('lingua.trans.{locale}.{group}')` à
  chaque écriture — pas de vidage global
- Statistiques complètes, import/export et protection vendor
- Les remplacements à l'exécution l'emportent sur les fichiers `lang/` via `array_replace_recursive`

## Pilote fichier

Lit et écrit directement dans les fichiers PHP et JSON de `lang/`. Il n'y a **pas**
de table `language_lines`.

::: danger Perte de type en mode fichier
Le pilote `file` ne stocke que des chaînes brutes. Les types HTML et Markdown sont
**aplatis en texte brut** — l'éditeur par type et les métadonnées de type ne sont pas
disponibles. Si vous utilisez des traductions HTML/Markdown, utilisez le pilote base de données.
:::

- Pas de requêtes base de données ; se comporte comme le `FileLoader` Laravel standard
- Les boutons de synchronisation sont **masqués** dans l'UI (les fichiers *sont* le magasin)
- `lingua:sync-to-local` est une **opération nulle sans `--force`** (la DB depuis laquelle
  il exporterait n'est pas le magasin actif)
- Les modifications dans l'UI sont écrites directement dans les fichiers via `AtomicFileWriter`
  (renommage atomique + `opcache_invalidate` — voir
  [Sécurité](/fr/guide/security#file-mode-security))

::: warning Mise en garde de déploiement
Sur les plateformes qui reconstruisent `lang/` depuis votre dépôt à chaque déploiement
(p. ex. Forge, Envoyer, images de conteneurs), les modifications de l'UI faites en mode
fichier peuvent être **écrasées** au prochain déploiement. Commitez les modifications dans
votre dépôt, ou utilisez le pilote base de données.
:::

## Changer de pilote

Utilisez la commande `lingua:storage` pour changer à tout moment. Elle **synchronise avant
de changer** pour ne rien perdre.

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```

| Option | Effet |
|---|---|
| `--force` | Ignorer les confirmations |
| `--write-env` | Mettre à jour `LINGUA_STORAGE_DRIVER` dans `.env` |
| `--no-migrate` | Ignorer l'étape d'assurance de migration |

### Base de données → fichier

Lingua **exporte** d'abord la base de données vers `lang/`, en avertissant des chaînes
HTML/Markdown qui perdront leur type, puis change le pilote actif.

### Fichier → base de données

Lingua **synchronise** `lang/` dans la base de données et s'assure que la migration
`language_lines` a été exécutée, puis change.

## Installation avec choix de pilote

L'installateur interactif demande quel pilote utiliser et publie les migrations
**adaptées au pilote** — le pilote `file` ignore entièrement la migration
`language_lines` :

```bash
php artisan lingua:install
```

Voir [Installation](/fr/guide/installation).

## Désinstallation

`lingua:uninstall` démonte Lingua en toute sécurité :

```bash
php artisan lingua:uninstall
```

Il **exporte d'abord la base de données vers `lang/`**, puis supprime les trois tables
Lingua (`language_lines`, `languages`, `lingua_settings`). Votre répertoire `lang/`
est préservé.

| Option | Effet |
|---|---|
| `--force` | Ignorer les confirmations |
| `--keep-config` | Laisser `config/lingua.php` en place |
| `--keep-published` | Laisser les vues/migrations publiées en place |

## Requêtes directes (pilote base de données)

```php
use Rivalex\Lingua\Models\Translation;

// Toutes les traductions qui ont une valeur française
Translation::whereNotNull('text->fr')->get();

// Seulement les traductions françaises manquantes
Translation::whereNull('text->fr')->get();

// Une clé spécifique
Translation::where('group', 'validation')->where('key', 'required')->first();
```

Voir [Traductions vendor](/fr/features/vendor-translations) pour savoir comment
les chaînes de packages sont protégées dans les deux pilotes.
