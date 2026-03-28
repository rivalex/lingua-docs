# Configuration

Après l'installation, `config/lingua.php` est la source de vérité unique pour tous les paramètres de Lingua.

```php
// config/lingua.php

return [

    /*
    |--------------------------------------------------------------------------
    | Language Files Directory
    |--------------------------------------------------------------------------
    | The path where local PHP/JSON translation files are stored.
    | Used by lingua:sync-to-database and lingua:sync-to-local.
    */
    'lang_dir' => lang_path(),

    /*
    |--------------------------------------------------------------------------
    | Default Locale
    |--------------------------------------------------------------------------
    | The fallback locale code used during installation and when the database
    | has no default language configured.
    */
    'default_locale' => config('app.locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Fallback Locale
    |--------------------------------------------------------------------------
    | When a translation is missing in the active locale, Laravel will try
    | this locale next.
    */
    'fallback_locale' => config('app.fallback_locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Route Middleware
    |--------------------------------------------------------------------------
    | Middleware applied to all Lingua management routes.
    | Add 'auth' (and role/permission guards) before going to production.
    */
    'middleware' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Route Prefix
    |--------------------------------------------------------------------------
    | URL prefix for Lingua's management pages.
    | Default: /lingua/languages and /lingua/translations
    */
    'routes_prefix' => 'lingua',

    /*
    |--------------------------------------------------------------------------
    | Session Variable
    |--------------------------------------------------------------------------
    | The session key used to persist the user's active locale across requests.
    */
    'session_variable' => 'locale',

    /*
    |--------------------------------------------------------------------------
    | Language Selector
    |--------------------------------------------------------------------------
    | Controls the default behaviour of the <livewire:lingua::language-selector>
    | component. Both options can be overridden per-instance via props.
    */
    'selector' => [
        'mode'       => 'sidebar',   // 'sidebar' | 'modal' | 'dropdown'
        'show_flags' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Rich-text Editor Toolbar
    |--------------------------------------------------------------------------
    | Defines which formatting options are available in the TipTap editor
    | for HTML and Markdown translation types.
    */
    'editor' => [
        'headings'      => false,
        'bold'          => true,
        'italic'        => true,
        'underline'     => true,
        'strikethrough' => false,
        'bullet'        => true,
        'ordered'       => true,
        'clear'         => true,
    ],

];
```

---

## Référence des options

### `lang_dir`

**Par défaut :** `lang_path()` (se résout en `{project_root}/lang/`)

Le répertoire que Lingua lit lors de la synchronisation des fichiers vers la base de données et dans lequel il écrit lors de l'export. Modifiez cette valeur si vos fichiers de traduction se trouvent dans un emplacement non standard.

### `default_locale`

**Par défaut :** `config('app.locale', 'en')`

Utilisé comme valeur de repli lors de l'installation et quand la table `languages` est vide. Après l'installation, la valeur par défaut faisant autorité est la ligne de la table `languages` avec `is_default = true`.

### `fallback_locale`

**Par défaut :** `config('app.fallback_locale', 'en')`

Comportement de repli standard de Laravel - lorsqu'une clé est manquante dans la locale active, cette locale est essayée ensuite.

### `middleware`

**Par défaut :** `['web']`

::: danger Exigence de production
Ajoutez toujours au moins `'auth'` avant le déploiement. Sans cela, quiconque connaît l'URL peut modifier vos traductions.
:::

```php
// Configuration typique en production
'middleware' => ['web', 'auth'],

// Avec Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// Avec une policy Gate personnalisée
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `routes_prefix`

**Par défaut :** `'lingua'`

Modifie le préfixe d'URL de toutes les pages de gestion Lingua :

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
// → /admin/translations/translations
```

### `session_variable`

**Par défaut :** `'locale'`

La clé de session où Lingua stocke la locale choisie par l'utilisateur. Modifiez-la si elle entre en conflit avec un autre package.

### `selector.mode`

**Par défaut :** `'sidebar'`

Contrôle le mode de rendu par défaut du composant `<livewire:lingua::language-selector>` :

| Valeur | Description |
|---|---|
| `sidebar` | Rendu comme un élément de navigation groupé dans la barre latérale |
| `dropdown` | Rendu comme un bouton de liste déroulante compact |
| `modal` | Rendu comme un bouton qui ouvre une modale de sélection de locale |

### `selector.show_flags`

**Par défaut :** `true`

Indique si les icônes de drapeaux de pays doivent être affichées à côté des noms de langue dans le sélecteur. Requiert le package `outhebox/blade-flags` (installé automatiquement comme dépendance).

### `editor`

Contrôle la barre d'outils TipTap pour les types de traduction HTML et Markdown. Chaque option correspond à une extension TipTap :

| Clé | Description |
|---|---|
| `headings` | Boutons de titres H1–H3 |
| `bold` | **Gras** |
| `italic` | *Italique* |
| `underline` | Souligné |
| `strikethrough` | ~~Barré~~ |
| `bullet` | Liste non ordonnée |
| `ordered` | Liste ordonnée |
| `clear` | Bouton d'effacement de la mise en forme |

::: tip
La barre d'outils de l'éditeur est globale - tous les champs de traduction HTML/Markdown partagent la même configuration. Si vous avez besoin d'un contrôle par champ, publiez les vues et personnalisez directement le composant éditeur.
:::
