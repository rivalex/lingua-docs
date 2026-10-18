# Mise à niveau de la 1.x vers la 2.0

Lingua 2.0 est une version majeure. Ce guide vous accompagne dans la migration
étape par étape, liste chaque changement incompatible et répond aux questions
les plus fréquentes.

## Pourquoi il s'agit d'une version majeure

- **Dépendances externes supprimées.** `spatie/laravel-translation-loader`
  et `laravel-lang/common` ont disparu. Les métadonnées de locale et le jeu de données
  de traductions sont maintenant embarqués dans le package.
- **Pilotes de stockage ajoutés.** Choisissez `database` (le comportement de la 1.x) ou
  `file`. Voir [Pilotes de stockage](/fr/guide/storage).
- **Renforcement de sécurité complet.** Sécurisé par défaut, plus le passage de
  renforcement F1–F9. Voir [Sécurité](/fr/guide/security).
- **Plancher PHP relevé** à 8.3+.

## Migration étape par étape

### 1. Mettre à jour le package

```bash
composer update rivalex/lingua
```

Composer supprime automatiquement `spatie/laravel-translation-loader`. Si votre
propre `composer.json` liste `laravel-lang/common` :

```bash
composer remove laravel-lang/common
```

### 2. Re-publier et fusionner la configuration

```bash
php artisan vendor:publish --tag=lingua-config --force
```

Ensuite, fusionnez les nouvelles clés dans votre configuration existante : `gate`,
`storage.driver`, `nav.enabled`, `navigate`, `routes_extra_parameters`,
`layout`, `links.translations`, `ui.sticky_top`, `cache.store`,
`cache.prefix`, `suppress_pro_nudge`, `pro_upgrade_url`,
`extensions.enabled`. Voir [Configuration](/fr/guide/configuration).

### 3. Définir le pilote de stockage

```env
LINGUA_STORAGE_DRIVER=database
```

```bash
php artisan config:clear
```

`database` est identique au comportement de la 1.x.

### 4. Migrations

Les migrations sont maintenant divisées en **trois** fichiers. Si vous avez effectué
la mise à niveau depuis la 1.x avec des migrations déjà exécutées, **aucune nouvelle
migration n'est nécessaire** — vos tables existent déjà. Vérifiez seulement les
divergences de schéma si vous avez précédemment publié et personnalisé la migration combinée.

### 5. Chargeurs de traductions personnalisés

```php
// Avant
use Spatie\TranslationLoader\TranslationLoaders\TranslationLoader;

// Après
use Rivalex\Lingua\Contracts\TranslationLoader;
```

La signature est inchangée :
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### 6. Modèle Translation personnalisé

```php
// Avant
class Translation extends \Spatie\TranslationLoader\LanguageLine {}

// Après
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $table = 'language_lines';

    public static function getTranslationsForGroup(string $locale, string $group): array
    {
        // …
    }
}
```

### 7. Types

```php
// Avant
use Spatie\TranslationLoader\TranslationLoaderManager;

// Après
use Rivalex\Lingua\TranslationManager\LinguaManager;
```

### 8. Auteurs de packages (Testbench)

Supprimez le fournisseur Spatie de `getPackageProviders()` :

```php
// Supprimez cette ligne
Spatie\TranslationLoader\TranslationServiceProvider::class,
```

## Référence des changements incompatibles

| Changement | Détail |
|---|---|
| Type de retour de `Lingua::info()` <Badge type="warning" text="Incompatible" /> | Retourne maintenant `?LocaleInfo` ; donne `null` pour les locales inconnues (levait une exception avant). Protégez avec `if ($info === null)`. Les noms de champs diffèrent de l'ancien `LaravelLang\LocaleData`. |
| `addLanguage()` / `removeLanguage()` <Badge type="warning" text="Incompatible" /> | N'appellent plus `lang:add` / `lang:rm`. Natif à la DB uniquement — pas d'écriture de fichiers. |
| Middleware par défaut <Badge type="warning" text="Incompatible" /> | `['web', 'auth']` (était `['web']`). |
| `navigate` par défaut <Badge type="warning" text="Incompatible" /> | `false` (était `true`). |
| Plancher PHP <Badge type="warning" text="Incompatible" /> | 8.3+ (était 8.2+). |
| `Language::scopeActive()` <Badge type="warning" text="Incompatible" /> | Renommé `scopeOrdered()` (délégué conservé pour la compatibilité). |
| `Translation::forgetTranslation()` <Badge type="warning" text="Incompatible" /> | Lève `VendorTranslationProtectedException` pour les lignes vendor. |
| `Import $errors` <Badge type="warning" text="Incompatible" /> | Renommé `$rowErrors`. |
| `optimize()` <Badge type="warning" text="Incompatible" /> | Déprécié — supprimez tous les appels. |
| Colonnes nullables | `language_lines.text` et `languages.regional` sont maintenant nullables. |
| Migrations | Divisées en 3 fichiers (était 1 combiné). |
| Tag `lingua-assets` | Supprimé — ressources servies via la route `lingua.assets`. |

## Liste de contrôle rapide

- [ ] `composer update rivalex/lingua`
- [ ] Supprimez `laravel-lang/common` si présent dans votre `composer.json`
- [ ] Re-publiez la configuration et fusionnez les nouvelles clés
- [ ] Définissez `LINGUA_STORAGE_DRIVER=database` et `php artisan config:clear`
- [ ] Mettez à jour les chargeurs/modèles/types personnalisés (Spatie → Lingua)
- [ ] Remplacez les usages de `Lingua::info()` par une vérification `null`
- [ ] Supprimez les appels à `optimize()`
- [ ] Renommez les références `Import::$errors` en `$rowErrors`
- [ ] Confirmez que le middleware/portail correspond à votre politique d'accès

## FAQ

**Mes traductions seront-elles perdues ?**
Non. Avec le pilote `database`, le comportement et les données sont identiques à
la 1.x. Vos lignes `language_lines` existantes ne sont pas touchées.

**Dois-je re-exécuter les migrations ?**
Non, si elles ont déjà été exécutées sous la 1.x. Les tables existent déjà ; le
découpage en 3 fichiers n'affecte que les nouvelles installations.

**Puis-je encore utiliser le stockage basé sur les fichiers ?**
Oui — c'est le nouveau pilote `file`. Changez à tout moment avec
`php artisan lingua:storage file`. Voir
[Pilotes de stockage](/fr/guide/storage).

**Flux est-il toujours requis ?**
Oui. Lingua 2.0 requiert `livewire/flux ^2.12`. Flux n'a **pas** été supprimé.

## Mise à niveau de la 2.0 vers la 2.1

Lingua 2.1 prend en charge Laravel **12 et 13**. Laravel 11 a atteint la fin de son support de sécurité le March 12, 2026. Les applications encore sous Laravel 11 restent sur Lingua 2.0.6, que Composer continue de sélectionner automatiquement ; mettez Laravel à niveau avant de mettre à jour Lingua. Il n'y a pas d'autre rupture : aucun changement de configuration, de migration ou d'API n'est nécessaire.
