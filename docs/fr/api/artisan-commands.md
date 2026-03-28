# Commandes Artisan

Lingua est livré avec six commandes Artisan pour la gestion des langues et des traductions en ligne de commande.

## Gestion des langues

### `lingua:add {locale}`

Installe une nouvelle langue — télécharge les fichiers, crée l'enregistrement en DB, synchronise les traductions.

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**Ce qu'elle fait :**
1. Récupère les métadonnées de locale depuis `laravel-lang/locales`
2. Exécute `lang:add {locale}` pour installer les fichiers de langue
3. Crée un enregistrement `Language` dans la base de données
4. Exécute `lingua:sync-to-database` pour importer les nouvelles chaînes

**Sortie :**
```
Adding language: it...
Installing language files via Laravel Lang...
Creating language record in database...
Syncing translations to database...
Language 'it' added successfully.
```

::: tip
Après l'ajout d'une langue, visitez `/lingua/translations/it` pour voir quelles chaînes nécessitent encore une traduction.
:::

---

### `lingua:remove {locale}`

Supprime une langue — efface les fichiers, nettoie la base de données, réordonne les langues restantes.

```bash
php artisan lingua:remove fr
```

**Ce qu'elle fait :**
1. Vérifie que la langue n'est pas la valeur par défaut (abandonne avec une erreur si c'est le cas)
2. Exécute `lang:rm {locale} --force` pour supprimer les fichiers de langue
3. Supprime toutes les valeurs `{locale}` de `language_lines.text`
4. Supprime l'enregistrement `Language`
5. Réordonne les valeurs de tri des langues restantes
6. Exécute `lingua:sync-to-database`

::: warning Protection de la langue par défaut
Vous ne pouvez pas supprimer la langue par défaut. Définissez d'abord une autre langue comme valeur par défaut :
```bash
php artisan lingua:add fr       # ajouter la nouvelle langue par défaut
# puis via l'interface : définir le français comme langue par défaut
php artisan lingua:remove en    # maintenant sûr de supprimer l'anglais
```
:::

---

### `lingua:update-lang`

Met à jour tous les fichiers de langue installés via Laravel Lang, puis re-synchronise vers la base de données.

```bash
php artisan lingua:update-lang
```

Exécutez cette commande après :
- La mise à niveau de Laravel (nouveaux messages de validation, etc.)
- L'installation d'un nouveau package livrant des traductions
- La mise à jour des packages `laravel-lang/*`

---

## Synchronisation des traductions

### `lingua:sync-to-database`

Importe tous les fichiers de traduction PHP/JSON locaux dans la table `language_lines`.

```bash
php artisan lingua:sync-to-database
```

**Ce qui est importé :**
- `lang/{locale}/*.php` — fichiers PHP
- `lang/{locale}.json` — fichiers JSON
- `lang/vendor/{package}/{locale}/*.php` — fichiers de packages

Utilise `updateOrCreate` en correspondant sur `group + key`, les modifications existantes depuis l'interface sont donc préservées.

**Cas d'utilisation typiques :**
```bash
# Après un clone frais — peupler la DB depuis les fichiers lang commités
php artisan lingua:sync-to-database

# Après lang:update — importer les nouvelles chaînes
php artisan lingua:sync-to-database

# Dans un script de déploiement
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

### `lingua:sync-to-local`

Exporte toutes les traductions de la base de données vers les fichiers PHP/JSON locaux.

```bash
php artisan lingua:sync-to-local
```

**Ce qui est exporté :**
- Traductions en DB → `lang/{locale}/{group}.php`
- Groupe JSON (`single`) → `lang/{locale}.json`
- Traductions de packages → `lang/vendor/{vendor}/{locale}/{group}.php`

**Cas d'utilisation typiques :**
```bash
# Avant de committer — exporter l'état de la DB vers les fichiers pour le contrôle de version
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"

# Avant de déployer sur un serveur qui lit depuis les fichiers
php artisan lingua:sync-to-local
```

---

### `lingua:install`

L'assistant de configuration interactif initial. À exécuter une seule fois après `composer require`.

```bash
php artisan lingua:install
```

N'est pas destiné à être ré-exécuté après la configuration initiale. Si vous devez re-publier des assets individuels, utilisez plutôt les tags `vendor:publish`.

---

## Référence rapide des commandes

<div class="command-table">

| Commande | Description |
|---|---|
| `lingua:add {locale}` | Installer une langue (fichiers + DB + synchronisation) |
| `lingua:remove {locale}` | Supprimer une langue (fichiers + DB + synchronisation) |
| `lingua:update-lang` | Mettre à jour les fichiers lang via Laravel Lang + synchroniser |
| `lingua:sync-to-database` | Importer les fichiers locaux → base de données |
| `lingua:sync-to-local` | Exporter la base de données → fichiers locaux |
| `lingua:install` | Assistant de configuration interactif initial |

</div>

---

## Conseils

::: tip Automatiser la synchronisation en CI/CD
Ajoutez la synchronisation à votre pipeline de déploiement pour maintenir la base de données synchronisée avec votre dépôt :

```yaml
# Étape de déploiement GitHub Actions (exemple)
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::

::: tip Ajouter plusieurs langues à la fois
Il n'y a pas de commande d'ajout en masse, mais vous pouvez enchaîner les appels dans une boucle shell :

```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::

::: tip Vérifier ce qui sera synchronisé
Avant d'exécuter `lingua:sync-to-database`, vous pouvez prévisualiser le nombre de fichiers et de locales qui seront traités en vérifiant `lang/` :

```bash
ls lang/
# en  fr  it  vendor
```
:::
