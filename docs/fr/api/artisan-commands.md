# Commandes Artisan

Lingua est livré avec huit commandes Artisan pour la gestion des langues, du stockage
et des traductions en ligne de commande.

## `lingua:install`

L'assistant de configuration interactif initial. À exécuter une seule fois après
`composer require`.

```bash
php artisan lingua:install
```

**Ce qu'il fait :**
1. Sélecteur de pilote (touches directionnelles : `database` ou `file`)
2. Publie `config/lingua.php`
3. Publie les migrations **adaptées au pilote**
4. Exécute les migrations (avec confirmation)
5. Initialise la langue par défaut depuis le jeu de données groupé — **aucun téléchargement**
6. Propose de mettre une étoile sur GitHub

---

## `lingua:storage {driver}` <Badge type="tip" text="Nouveau dans la 2.0" />

Change le pilote de stockage actif. Synchronise avant de changer pour ne rien perdre.

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```

| Option | Effet |
|---|---|
| `--force` | Ignorer les confirmations |
| `--write-env` | Mettre à jour `LINGUA_STORAGE_DRIVER` dans `.env` |
| `--no-migrate` | Ignorer l'étape d'assurance de migration |

Voir [Pilotes de stockage](/fr/guide/storage) pour les détails complets.

---

## `lingua:add {locale}`

Installe une nouvelle langue depuis le registre groupé (129+ locales). Crée l'enregistrement
DB et importe les traductions. **Pas de téléchargement GitHub.**

```bash
php artisan lingua:add fr
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**Ce qu'elle fait :**
1. Récupère les métadonnées depuis `LocaleRegistry`
2. Crée un enregistrement `Language` en DB
3. Importe les chaînes groupées dans `language_lines`

---

## `lingua:remove {locale}`

Supprime une langue et nettoie la base de données.

```bash
php artisan lingua:remove fr
```

**Ce qu'elle fait :**
1. Vérifie que la langue n'est pas la valeur par défaut
2. Efface les valeurs `{locale}` de `language_lines.text`
3. Supprime l'enregistrement `Language`
4. Réordonne les valeurs de tri restantes

::: warning Protection de la langue par défaut
Vous ne pouvez pas supprimer la langue par défaut. Changez d'abord la langue par défaut
dans les Paramètres ou via `Lingua::setDefaultLocale()`.
:::

---

## `lingua:update-lang`

Met à jour les chaînes depuis le jeu de données groupé embarqué et fusionne dans la DB
sans écraser les valeurs existantes.

```bash
php artisan lingua:update-lang
```

Utile après une mise à jour de Lingua qui embarque de nouvelles chaînes Laravel
(p. ex. nouvelles règles de validation dans Laravel 13.x).

---

## `lingua:sync-to-database`

Importe tous les fichiers de traduction PHP/JSON de `lang/` dans `language_lines`.

```bash
php artisan lingua:sync-to-database
```

Utilise `updateOrCreate` sur `group + key` — les modifications UI existantes sont préservées.

```bash
# Dans un script de déploiement
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

## `lingua:sync-to-local`

Exporte toutes les traductions DB vers les fichiers PHP/JSON de `lang/`.

```bash
php artisan lingua:sync-to-local
```

```bash
# Avant de committer pour le contrôle de version
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"
```

---

## `lingua:uninstall` <Badge type="tip" text="Nouveau dans la 2.0" />

Démonte Lingua en toute sécurité. Exporte d'abord la DB vers `lang/`, puis supprime les
trois tables Lingua.

```bash
php artisan lingua:uninstall
```

| Option | Effet |
|---|---|
| `--force` | Ignorer les confirmations |
| `--keep-config` | Laisser `config/lingua.php` en place |
| `--keep-published` | Laisser les vues/migrations publiées en place |

::: warning
Cette opération supprime `language_lines`, `languages` et `lingua_settings`. Vos fichiers
`lang/` sont préservés (exportés avant suppression).
:::

---

## Référence rapide

| Commande | Description |
|---|---|
| `lingua:install` | Assistant d'installation initial (wizard) |
| `lingua:storage {driver}` | Changer le pilote de stockage |
| `lingua:add {locale}` | Installer une langue depuis le registre groupé |
| `lingua:remove {locale}` | Supprimer une langue et ses traductions |
| `lingua:update-lang` | Mettre à jour depuis le jeu de données groupé |
| `lingua:sync-to-database` | Importer les fichiers `lang/` → DB |
| `lingua:sync-to-local` | Exporter DB → fichiers `lang/` |
| `lingua:uninstall` | Démontage sûr complet |
