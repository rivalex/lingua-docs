# Comment ça fonctionne

Comprendre les mécanismes internes de Lingua facilite sa configuration, son débogage
et son extension.

## Cycle de vie d'une requête

```
Requête du navigateur
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware       │  Lit 'locale' depuis la session
│  app()->setLocale($locale)  │  Repli sur la locale par défaut de la DB
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│        Votre Contrôleur     │
│  __('auth.failed')          │  Helper Laravel standard
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  étend Illuminate FileLoader
│  Traductions DB fusionnées  │  La DB gagne toujours en cas de chevauchement
│  sur les fichiers (mode DB) │  (mode fichier = FileLoader standard)
└───┬─────────────────────────┘
    │
    ▼
Chaîne traduite retournée
```

## Chargement des traductions

`LinguaManager` étend le propre `Illuminate\Translation\FileLoader` de Laravel —
il n'y a **aucune** dépendance à Spatie. Il est enregistré en décorant le binding
du chargeur du framework :

```php
$app->extend('translation.loader', function ($original, $app) {
    return new LinguaManager($app, $original);
});
```

En **mode base de données**, pour chaque `(locale, group)` il charge les traductions
basées sur les fichiers via le chargeur original, puis fusionne les valeurs de la base de
données par-dessus en utilisant `array_replace_recursive`. **La valeur de la base de
données gagne toujours** en cas de chevauchement, vous pouvez donc remplacer n'importe
quelle chaîne vendor ou de fichier sans toucher aux fichiers sources.

Si la table `language_lines` n'existe pas encore (p. ex. avant que les migrations aient
été exécutées), une `QueryException` est interceptée et `LinguaManager` revient
gracieusement au mode fichiers uniquement.

En **mode fichier**, `LinguaManager` se comporte comme le `FileLoader` standard —
aucune requête base de données n'est effectuée. Voir [Pilotes de stockage](/fr/guide/storage).

## Middleware

`LinguaMiddleware` est automatiquement ajouté au groupe de middleware `web`
au démarrage via `LinguaServiceProvider`. Il s'exécute à chaque requête web :

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

`LinguaServiceProvider` effectue les opérations suivantes au démarrage :

1. **Enregistre les composants Blade anonymes** sous le préfixe `lingua::`
2. **Enregistre les composants Livewire** sous l'espace de noms `lingua::`
3. **Décore le binding `translation.loader`** via `$app->extend(...)`,
   enveloppant le chargeur de Laravel avec `LinguaManager`

Parce que le fournisseur *décore* plutôt que *remplace* le chargeur principal,
il se compose proprement avec le `TranslationServiceProvider` de Laravel. L'ordre
d'autoload de Composer gère automatiquement l'ordre de démarrage.

## Schéma de base de données

Trois tables sont utilisées (le pilote `file` omet `language_lines`) :

### `languages`

| Colonne | Type | Notes |
|---|---|---|
| `id` | bigint | Clé primaire |
| `code` | string | Code ISO 639-1 (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Code régional complet (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` ou `'standard'` |
| `name` | string | Nom d'affichage en anglais (`French`) |
| `native` | string | Nom natif (`Français`) |
| `direction` | string | `'ltr'` ou `'rtl'` |
| `is_default` | boolean | Une seule ligne devrait être `true` |
| `sort` | integer | Ordre d'affichage (assigné automatiquement) |

### `language_lines`

| Colonne | Type | Notes |
|---|---|---|
| `id` | bigint | Clé primaire |
| `group` | string | Groupe de traduction (`auth`, `validation`, `single`) |
| `key` | string | Clé de traduction (`failed`, `required`) |
| `text` | json, **nullable** | `{"en": "…", "fr": "…"}` |
| `type` | string | `'text'`, `'html'` ou `'markdown'` |
| `is_vendor` | boolean | `true` pour les chaînes de packages tiers |
| `vendor` | string, nullable | Nom du vendor (p. ex. `laravel`) |

La colonne JSON `text` stocke **toutes les locales dans une seule ligne** :

- Ajouter une nouvelle locale ne modifie jamais le schéma
- Une seule requête récupère toutes les valeurs de locale pour une clé
- Les locales manquantes n'ont simplement pas de clé dans l'objet JSON

### `lingua_settings`

Table clé/valeur soutenant l'interface des paramètres (p. ex. le toggle de navigation partagée).

## Jeu de données groupé

Lingua 2.0 embarque toutes les données de locale dans le package :

- **`LocaleRegistry`** (`Rivalex\Lingua\Locales\LocaleRegistry`) — métadonnées
  pour 129+ locales. `Lingua::info($locale)` retourne un objet valeur `LocaleInfo`
  en lecture seule (`->name`, `->native`, `->direction`,
  `->regional`, `->code`, `->type`), ou `null` pour les locales inconnues.
- **Traductions groupées** — 26 locales × 7 groupes, 5902 chaînes, alignées
  sur Laravel **v13.14.0**. Un `NotificationProjector` dérive les chaînes de notification.
  `lingua:add` initialise depuis ce jeu de données sans appels réseau.

## Architecture du cache

En mode base de données, Lingua met en cache les traductions **chirurgicalement** par
`(locale, group)` :

- Les clés ressemblent à `lingua.trans.{locale}.{group}`
- Lors d'un enregistrement/suppression d'une `Translation`, seul `Cache::forget('lingua.trans.{locale}.{group}')`
  pour les clés affectées s'exécute — il n'y a **pas** de `cache:clear` global dans aucun
  chemin de synchronisation
- Le magasin et le préfixe sont configurables via `cache.store` / `cache.prefix`
- Le cache est une optimisation, la base de données fait foi : si le magasin de cache est indisponible (par exemple un timeout Redis), les lectures et l'écriture de rattrapage après un miss se replient sur la base de données. L'exception est signalée, et un disjoncteur à portée de requête ignore le magasin pour le reste de la requête. L'invalidation (`forget`) n'est **pas** protégée : un `forget` en échec remonte, afin qu'une entrée périmée ne puisse jamais survivre à la reprise du magasin

## Modèles

| Modèle | Table | Étend |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `Illuminate\Database\Eloquent\Model` |

`Translation` fournit `getTranslationsForGroup()`, des helpers de synchronisation,
des helpers de statistiques et `forgetTranslation()` — qui lève
`VendorTranslationProtectedException` pour les lignes vendor. Le scope de requête
`scopeOrdered()` remplace l'ancien `scopeActive()` (un délégué est conservé pour
la compatibilité descendante).
