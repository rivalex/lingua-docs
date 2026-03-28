# Stockage des traductions

Comprendre la façon dont les traductions sont stockées vous aide à les interroger, les importer et les exporter correctement.

## La table `language_lines`

Chaque ligne dans `language_lines` représente une **chaîne** traduisible — et non une locale. Toutes les valeurs de locale sont stockées ensemble dans une seule colonne JSON `text` :

```
group      | key        | type | text
-----------|------------|------|---------------------------------------------------
validation | required   | text | {"en":"The :attribute field is required.","fr":"Le champ :attribute est obligatoire."}
auth       | failed     | text | {"en":"These credentials do not match.","it":"Le credenziali non corrispondono."}
single     | Welcome    | text | {"en":"Welcome","fr":"Bienvenue","de":"Willkommen"}
emails     | subject    | html | {"en":"<b>Welcome</b> to our platform!"}
```

### Avantages de cette conception

- **Une ligne par chaîne** — pas de lignes par locale à gérer
- **L'ajout d'une locale est non destructif** — il suffit d'ajouter une nouvelle clé à l'objet JSON
- **Les traductions manquantes sont explicites** — si `fr` est absent du JSON, la chaîne n'est pas encore traduite
- **Requête unique** — un seul `SELECT` récupère toutes les valeurs de locale pour une clé

### Requêtes directes

Vous pouvez interroger `language_lines` en utilisant la syntaxe standard de colonne JSON d'Eloquent :

```php
use Rivalex\Lingua\Models\Translation;

// Toutes les traductions ayant une valeur en français
Translation::whereNotNull('text->fr')->get();

// Uniquement les traductions françaises manquantes
Translation::whereNull('text->fr')->get();

// Trouver une clé spécifique
Translation::where('key', 'required')->where('group', 'validation')->first();

// Toutes les chaînes d'un groupe
Translation::where('group', 'auth')->get();
```

## Types de traduction

Chaque ligne de traduction a un `type` qui détermine l'éditeur utilisé dans l'interface :

| Type | Cas d'utilisation | Détection automatique lors de la synchronisation |
|---|---|---|
| `text` | Libellés simples, messages, textes de boutons | Par défaut |
| `html` | Contenu enrichi avec des balises HTML | La chaîne contient des éléments HTML |
| `markdown` | Contenu formaté en Markdown | La chaîne est analysée comme du Markdown |

La détection de type est effectuée lors de `lingua:sync-to-database`. Vous pouvez changer le type à tout moment via la modale d'édition dans l'interface.

### Exemple : traduction HTML

```php
Translation::create([
    'group' => 'marketing',
    'key'   => 'hero_subtitle',
    'type'  => 'html',
    'text'  => ['en' => '<strong>Build faster</strong> with fewer tools.'],
]);
```

### Exemple : traduction Markdown

```php
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_body',
    'type'  => 'markdown',
    'text'  => ['en' => "# Welcome!\n\nThank you for signing up.\n\n**Your account is now active.**"],
]);
```

## Clés de traduction

Lingua utilise la même convention `groupe.clé` en deux parties que les traductions Laravel standard :

| Format | Exemple | Appel `trans()` |
|---|---|---|
| Clé de fichier PHP | `auth.failed` | `__('auth.failed')` |
| Clé JSON / unique | `Welcome` | `__('Welcome')` |
| Clé de package | `spatie::messages.error` | via l'espace de noms du package |

::: tip groupe vs. clé
La colonne `group` correspond au nom du fichier (`auth` = `lang/en/auth.php`) et la `key` correspond à la clé de tableau dans ce fichier. Pour les fichiers JSON, le groupe est `'single'`.
:::

## Traductions de packages

Les traductions de packages sont signalées avec `is_vendor = true` et portent une chaîne `vendor` (ex. `'spatie'`, `'laravel'`). Elles sont synchronisées depuis les répertoires `lang/vendor/{vendor}/{locale}/`.

- Elles **peuvent être modifiées** dans l'interface (pour remplacer le texte du package)
- Elles **ne peuvent pas être supprimées** — toute tentative de suppression déclenche un événement `vendor_translation_protected`
- Les champs `group` et `key` sont **verrouillés** dans la modale de mise à jour

Consultez [Traductions de packages](/fr/features/vendor-translations) pour tous les détails.
