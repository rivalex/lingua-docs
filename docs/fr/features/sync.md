# Synchronisation bidirectionnelle

Lingua peut importer les traductions depuis des fichiers locaux vers la base de données et les exporter à nouveau - vous offrant le meilleur des deux mondes : **exécution pilotée par la base de données** et **contrôle de version basé sur des fichiers**.

## Les deux directions

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (DB)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄── lingua:sync-to-local
                      ─┘
```

## Synchroniser vers la base de données

Importe tous les fichiers de traduction depuis `lang/` (et ses sous-répertoires) dans la table `language_lines`.

```bash
php artisan lingua:sync-to-database
```

### Ce qui est importé

- `lang/{locale}/*.php` - fichiers de traduction PHP standard
- `lang/{locale}.json` - fichiers de traduction JSON
- `lang/vendor/{package}/{locale}/*.php` - traductions de packages

### Comportement d'upsert

Lingua utilise `updateOrCreate` en correspondant sur `group` + `key`. Cela signifie :
- Les **nouvelles clés** sont insérées
- Les **clés existantes** ont leur JSON `text` fusionné - les valeurs de locale que vous avez modifiées dans l'interface sont **préservées**
- La **détection de type** s'exécute sur la valeur pour déterminer `text` / `html` / `markdown`

### Détection automatique de type

| Règle | Type assigné |
|---|---|
| La chaîne contient des balises HTML (`<…>`) | `html` |
| La chaîne est analysée comme du Markdown (titres, listes, etc.) | `markdown` |
| Ni l'un ni l'autre | `text` |

::: tip
La détection de type est conservative - elle n'assigne `html` ou `markdown` que lorsque le contenu correspond clairement. Les chaînes simples obtiennent toujours `text`. Vous pouvez changer le type manuellement via la modale de modification.
:::

### Via la facade

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
```

::: warning
La facade appelle `Translation::syncToDatabase()` en interne, qui est un appel statique. Dans les commandes Artisan et les composants Livewire, `app(Translation::class)->syncToDatabase()` est utilisé à la place pour que Mockery puisse l'intercepter dans les tests.
:::

---

## Synchroniser vers le stockage local

Exporte toutes les traductions depuis `language_lines` vers les fichiers PHP et JSON `lang/`.

```bash
php artisan lingua:sync-to-local
```

### Ce qui est exporté

- Toutes les traductions non-packages → `lang/{locale}/{group}.php`
- Clés du groupe JSON (`single`) → `lang/{locale}.json`
- Traductions de packages → `lang/vendor/{vendor}/{locale}/{group}.php`

### Cas d'utilisation

- **Contrôle de version** - committer les fichiers exportés pour suivre les modifications de traduction dans le temps
- **Pipelines de déploiement** - exporter avant le déploiement si les outils en aval attendent des traductions basées sur des fichiers
- **Sauvegardes** - créer un instantané à un instant T de toutes les traductions
- **Autres outils** - exporter pour utilisation dans un service de gestion des traductions ou un importateur CSV

### Via la facade

```php
Lingua::syncToLocal();
```

---

## Mettre à jour depuis Laravel Lang

Récupère les dernières chaînes de traduction de l'écosystème `laravel-lang` et les synchronise vers la base de données. Utile après la mise à niveau de Laravel ou l'ajout d'un nouveau package livrant des traductions.

```bash
php artisan lingua:update-lang
```

Cette commande exécute `lang:update` (depuis `laravel-lang/common`) suivi de `lingua:sync-to-database`.

---

## Workflows de synchronisation automatisés

### Au déploiement

Ajoutez une étape post-déploiement pour maintenir la base de données synchronisée avec vos fichiers lang commités :

```bash
# Dans votre script de déploiement ou pipeline CI/CD
php artisan lingua:sync-to-database
php artisan optimize:clear
```

### Via le planificateur

Si votre équipe de traduction modifie les fichiers directement (plutôt que via l'interface), planifiez une synchronisation périodique :

```php
// routes/console.php
Schedule::command('lingua:sync-to-database')->hourly();
```

### À l'installation d'un package

Quand vous `composer require` un nouveau package livrant des traductions, exécutez :

```bash
php artisan lingua:update-lang
```

Cela récupère toutes les nouvelles chaînes du package installé.

---

## Conseils et pièges à éviter

::: tip Garder la DB comme source de vérité
Traitez la base de données comme la source principale. Ne synchronisez vers le stockage local que lorsque vous avez besoin des fichiers (contrôle de version, déploiement, etc.). Évitez de modifier les fichiers locaux directement pendant que la DB est en cours d'utilisation - la prochaine synchronisation vers la base de données écrasera vos modifications si les clés existent déjà.
:::

::: warning Fichiers de locale et DB désynchronisés
Si vous ajoutez manuellement de nouveaux fichiers PHP de locale sans exécuter `lingua:sync-to-database`, les nouvelles clés ne seront disponibles que via le chargeur de fichiers (priorité inférieure à la DB). Exécutez la synchronisation pour les importer correctement.
:::

::: tip Aller-retour complet
Une façon sûre de réorganiser les traductions :
1. `lingua:sync-to-local` - tout exporter
2. Modifier les fichiers sur le disque
3. `lingua:sync-to-database` - ré-importer
:::
