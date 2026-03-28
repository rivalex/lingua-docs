# Fonctionnement interne

Comprendre les mécanismes internes de Lingua facilite sa configuration, son débogage et son extension.

## Cycle de vie d'une requête

```
Requête du navigateur
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware       │  Lit 'locale' depuis la session
│  app()->setLocale($locale)  │  Retombe sur la valeur par défaut en DB
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│        Votre contrôleur     │
│  __('auth.failed')          │  Helper standard de Laravel
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  TranslationLoaderManager personnalisé
│  1. Chargeur DB (Spatie)    │  La DB gagne toujours en cas de chevauchement
│  2. Chargeur fichier (repli)│
└───┬─────────────────────────┘
    │
    ▼
Chaîne traduite retournée
```

## Chargement des traductions

`LinguaManager` étend le `TranslationLoaderManager` de Spatie. Au moment de l'exécution, il fusionne deux sources :

1. **Chargeur de fichiers** - lit depuis `lang/` comme Laravel le fait normalement
2. **Chargeur de base de données** (chargeur `Db` de Spatie) - lit depuis `language_lines`

Lorsque la même clé existe dans les deux sources, **la valeur en base de données gagne**. Cela vous permet de remplacer n'importe quelle traduction de package ou de fichier sans toucher aux fichiers sources.

Si la table `language_lines` n'existe pas encore (ex. avant l'exécution des migrations), `LinguaManager` retombe gracieusement en mode fichier uniquement.

## Middleware

`LinguaMiddleware` est automatiquement ajouté au groupe de middleware `web` au démarrage via `LinguaServiceProvider`. Il s'exécute à chaque requête web :

```php
// Logique simplifiée
$locale = session()->get(config('lingua.session_variable'))
    ?? Language::default()?->code
    ?? config('app.locale');

app()->setLocale($locale);
app()->setFallbackLocale($defaultLocale);
session()->put(config('lingua.session_variable'), $locale);
```

## Fournisseur de services

`LinguaServiceProvider` effectue trois choses au démarrage :

1. **Enregistre les composants Blade anonymes** sous le préfixe `lingua::`
2. **Enregistre les composants Livewire** sous l'espace de noms `lingua::`
3. **Remplace les singletons `translator` et `translation.loader`** dans le conteneur IoC par les implémentations personnalisées de Lingua

Comme le fournisseur de services remplace la liaison du traducteur principal, il est important qu'il démarre *après* le `TranslationServiceProvider` de Laravel. L'ordre de chargement automatique de Composer gère cela automatiquement.

## Schéma de base de données

Deux tables sont utilisées :

### `languages`

| Colonne | Type | Notes |
|---|---|---|
| `id` | bigint (auto-increment) | Clé primaire |
| `code` | string | Code ISO 639-1 (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Code régional complet (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` ou `'standard'` |
| `name` | string | Nom d'affichage en anglais (`French`) |
| `native` | string | Nom natif (`Français`) |
| `direction` | string | `'ltr'` ou `'rtl'` |
| `is_default` | boolean | Une seule ligne doit être `true` |
| `sort` | integer | Ordre d'affichage (attribué automatiquement) |

### `language_lines` (Spatie)

| Colonne | Type | Notes |
|---|---|---|
| `id` | bigint (auto-increment) | Clé primaire |
| `group` | string | Groupe de traduction (`auth`, `validation`, `single`) |
| `key` | string | Clé de traduction (`failed`, `required`) |
| `text` | json | `{"en": "…", "fr": "…", "it": "…"}` |
| `type` | string | `'text'`, `'html'` ou `'markdown'` |
| `is_vendor` | boolean | `true` pour les chaînes de packages tiers |
| `vendor` | string, nullable | Nom du package (ex. `spatie`, `laravel`) |

La colonne JSON `text` stocke **toutes les locales dans une seule ligne**. Cette conception signifie :
- L'ajout d'une nouvelle locale ne modifie jamais le schéma
- Une seule requête récupère toutes les valeurs de locale pour une clé
- Les locales manquantes n'ont simplement pas de clé dans l'objet JSON

## Seeder

`LinguaSeeder` est appelé une seule fois pendant `lingua:install`. Il :

1. Lit `config('lingua.default_locale')` (par défaut `config('app.locale')`)
2. Récupère les métadonnées de locale depuis `laravel-lang/locales`
3. Crée un enregistrement `Language` avec `is_default = true`
4. Appelle `lingua:add {locale}` pour installer les fichiers de langue
5. Appelle `lingua:sync-to-database` pour importer toutes les chaînes

## Modèles

| Modèle | Table | Étend |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `LanguageLine` de Spatie |

`Translation` hérite des méthodes `setTranslation()` et `forgetTranslation()` de Spatie et ajoute des scopes, des méthodes de synchronisation et des helpers de statistiques propres à Lingua.
