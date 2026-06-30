# Configuration

Après l'installation, `config/lingua.php` est la source de vérité unique pour
tous les paramètres de Lingua. Cette page documente chaque clé, regroupée par thème.
Les clés marquées <Badge type="tip" text="Nouveau dans la 2.0" /> n'existaient pas dans la 1.x.

## Paramètres de locale

```php
// config/lingua.php

'lang_dir'         => lang_path(),
'base_translations_path' => null, // ★ Nouveau dans la 2.0
'default_locale'   => config('app.locale', 'en'),
'fallback_locale'  => config('app.fallback_locale', 'en'),
'session_variable' => 'locale',
```

### `lang_dir`

**Par défaut :** `lang_path()` — correspond à `{project_root}/lang/`.

Le répertoire que Lingua lit lors de la synchronisation des fichiers vers la base de données
et dans lequel il écrit lors de l'exportation vers les fichiers.

### `base_translations_path` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `null`

Remplacement optionnel du chemin à partir duquel Lingua lit le jeu de données de traduction
**groupé**. Laissez `null` pour utiliser le jeu de données embarqué dans le package.

### `default_locale`

**Par défaut :** `config('app.locale', 'en')`

Utilisé comme solution de repli lors de l'installation et quand la table `languages` est
vide. Après l'installation, la valeur par défaut faisant autorité est la ligne dans la table
`languages` avec `is_default = true`.

### `fallback_locale`

**Par défaut :** `config('app.fallback_locale', 'en')`

Solution de repli Laravel standard — quand une clé est absente dans la locale active,
cette locale est essayée ensuite.

### `session_variable`

**Par défaut :** `'locale'`

La clé de session où Lingua stocke la locale choisie par l'utilisateur.

---

## Sécurité & accès

```php
'middleware' => ['web', 'auth'],
'gate'       => env('LINGUA_GATE', null), // ★ Nouveau dans la 2.0
```

### `middleware`

**Par défaut :** `['web', 'auth']` <Badge type="warning" text="Modifié dans la 2.0" />

::: tip Sécurisé par défaut
Dans la 2.0, la valeur par défaut est `['web', 'auth']` — l'interface de gestion n'est **pas**
accessible publiquement par défaut. C'était `['web']` dans la 1.x.
:::

```php
// Avec Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// Avec une politique de portail personnalisée
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `gate` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `env('LINGUA_GATE', null)`

Quand défini, Lingua ajoute `can:{gate}` à toutes les routes d'administration. Définissez
le portail dans un fournisseur de services :

```env
LINGUA_GATE=manage-translations
```

```php
Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

Consultez la [référence de sécurité](/fr/guide/security#authentication).

---

## Routage

```php
'routes_prefix'           => 'lingua',
'routes_extra_parameters' => null,  // ★ Nouveau dans la 2.0
'navigate'                => false, // ★ Nouveau dans la 2.0 (valeur par défaut modifiée)
'layout'                  => null,  // ★ Nouveau dans la 2.0
```

### `routes_prefix`

**Par défaut :** `'lingua'`

Modifie le préfixe d'URL pour toutes les pages de gestion de Lingua :

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
```

### `routes_extra_parameters` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `null`

Suffixe paramétré optionnel ajouté au préfixe de route — utile pour les préfixes
délimités par tenant ou section.

### `navigate` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `false` <Badge type="warning" text="Modifié dans la 2.0" />

Contrôle `wire:navigate` sur les liens internes de Lingua. La valeur par défaut est maintenant
`false` (redirections pleine page), ce qui évite les cas limites de navigation SPA. Activez
avec `'navigate' => true`.

### `layout` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `null`

Fournissez un layout Blade personnalisé pour les vues de Lingua. Laissez `null` pour utiliser
le layout intégré au package.

---

## Navigation

```php
'nav' => [
    'enabled' => true, // ★ Nouveau dans la 2.0
],
'links' => [
    'translations' => [          // ★ Nouveau dans la 2.0
        'enabled' => true,
        'route'   => 'lingua.translations',
    ],
],
```

### `nav.enabled` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `true`

Active/désactive le menu de navigation partagé `x-lingua::nav` qui apparaît sur toutes
les cinq pages de Lingua. Peut également être activé/désactivé depuis l'interface des paramètres.

### `links.translations` <Badge type="tip" text="Nouveau dans la 2.0" />

Contrôle l'entrée « Traductions » dans la navigation partagée : si elle est affichée
(`enabled`) et quelle route elle pointe (`route`).

---

## Interface

```php
'ui' => [
    'sticky_top' => 0, // ★ Nouveau dans la 2.0
],
'selector' => [
    'mode'       => 'sidebar',  // 'sidebar' | 'modal' | 'dropdown' | 'headless'
    'show_flags' => true,
],
'editor' => [
    'headings' => false, 'bold' => true, 'italic' => true,
    'underline' => true, 'strikethrough' => false,
    'subscript' => true, 'superscript' => true,
    'blockquote' => false, 'code-line' => false, 'code-block' => false,
    'bullet' => true, 'ordered' => true, 'clear' => true, 'code-mode' => false,
],
```

### `ui.sticky_top` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `0`

Décalage en pixels pour les barres d'outils collantes de Lingua. Augmentez-le si votre
application a un en-tête fixe pour que les barres d'outils ne glissent pas dessous.

### `selector.mode`

**Par défaut :** `'sidebar'`

| Valeur | Description |
|---|---|
| `sidebar` | Élément de navigation de barre latérale groupé |
| `dropdown` | Bouton déroulant compact |
| `modal` | Bouton qui ouvre une modal de sélection de locale |
| `headless` | Aucun rendu intégré — utilisez le composant headless |

### `selector.show_flags`

**Par défaut :** `true`

Indique s'il faut afficher les icônes de drapeaux à côté des noms de langues.

### `editor`

Contrôle la barre d'outils de texte riche pour les types de traduction HTML et Markdown
(pilote base de données uniquement). Chaque clé active une option de mise en forme :
`headings`, `bold`, `italic`, `underline`, `strikethrough`, `subscript`,
`superscript`, `blockquote`, `code-line`, `code-block`, `bullet`,
`ordered`, `clear`, `code-mode`.

---

## Pilote de stockage <Badge type="tip" text="Nouveau dans la 2.0" />

```php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

### `storage.driver`

**Par défaut :** `env('LINGUA_STORAGE_DRIVER', 'database')`

Sélectionne où vivent les traductions :

| Pilote | Comportement |
|---|---|
| `database` | Le comportement complet de la 1.x : table `language_lines`, types HTML/Markdown, statistiques, import/export, protection vendor, cache chirurgical. |
| `file` | Lit/écrit directement dans les fichiers PHP+JSON de `lang/` ; pas de table `language_lines` ; les types sont aplatis en texte brut. |

Il s'agit d'une fonctionnalité majeure — consultez [Pilotes de stockage](/fr/guide/storage) pour
la comparaison complète et la commande de basculement `lingua:storage`.

---

## Cache

```php
'cache' => [
    'store'  => env('LINGUA_CACHE_STORE', null),       // ★ Nouveau dans la 2.0
    'prefix' => env('LINGUA_CACHE_PREFIX', 'lingua.trans'), // ★ Nouveau dans la 2.0
],
```

### `cache.store` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `env('LINGUA_CACHE_STORE', null)`

Le magasin de cache que Lingua utilise pour la mise en cache des traductions. `null` utilise
le magasin par défaut de votre application.

### `cache.prefix` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `env('LINGUA_CACHE_PREFIX', 'lingua.trans')`

Préfixe pour les clés de cache. Lingua met en cache les traductions **chirurgicalement** par
`(locale, group)` et n'oublie que la clé affectée lors d'une écriture — il n'y a pas de
`cache:clear` global dans aucun chemin de synchronisation. Voir
[Architecture du cache](/fr/guide/architecture#cache-architecture).

---

## Chargeurs de traductions

```php
'translation_loaders' => [
    // Rivalex\Lingua\Loaders\YourCustomLoader::class,
],
'model'               => Rivalex\Lingua\Models\Translation::class,
'translation_manager' => Rivalex\Lingua\TranslationManager\LinguaManager::class,
```

### `translation_loaders`

Enregistrez des chargeurs supplémentaires implémentant
`Rivalex\Lingua\Contracts\TranslationLoader`. La signature du contrat est
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### `model`

Le modèle Eloquent soutenant `language_lines`. Remplacez-le pour étendre
`Translation` avec votre propre logique.

### `translation_manager`

La classe du chargeur de traductions. Par défaut,
`Rivalex\Lingua\TranslationManager\LinguaManager`, qui étend
`Illuminate\Translation\FileLoader`.

---

## Extensions

```php
'extensions' => [
    'enabled' => env('LINGUA_EXTENSIONS_ENABLED', true), // ★ Nouveau dans la 2.0
],
'suppress_pro_nudge' => env('LINGUA_SUPPRESS_PRO_NUDGE', false), // ★ Nouveau dans la 2.0
'pro_upgrade_url'    => env('LINGUA_PRO_UPGRADE_URL', 'https://lingua.rivalex.dev'), // ★ Nouveau dans la 2.0
```

### `extensions.enabled` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `true`

Interrupteur principal pour les extensions optionnelles de Lingua.

### `suppress_pro_nudge` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `false`

Définissez à `true` pour masquer les suggestions de mise à niveau dans l'interface.

### `pro_upgrade_url` <Badge type="tip" text="Nouveau dans la 2.0" />

**Par défaut :** `https://lingua.rivalex.dev`

URL utilisée par les suggestions de mise à niveau lorsqu'elles sont affichées.
