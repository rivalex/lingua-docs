# Traductions de packages

Les traductions de packages sont des chaînes appartenant à des packages tiers — les messages de validation de Laravel, les libellés de pagination, les chaînes de réinitialisation de mot de passe, et les traductions de tout autre package livrant son propre répertoire `lang/`.

## Comment elles sont identifiées

Lors de `lingua:sync-to-database`, Lingua analyse la structure du répertoire `lang/vendor/`. Tout fichier de traduction trouvé là est importé avec :

- `is_vendor = true`
- `vendor` = le nom du package (dérivé du nom du répertoire, ex. `spatie`, `laravel`, `filament`)

Exemples de lignes en base de données après synchronisation :

```
group      | key          | is_vendor | vendor   | text
-----------|--------------|-----------|----------|-----------------------------
validation | required     | false     | null     | {"en":"The :attribute…"}
passwords  | reset        | true      | laravel  | {"en":"Your password…"}
auth       | failed       | true      | laravel  | {"en":"These credentials…"}
```

::: tip
Les propres fichiers `lang/en/*.php` de Laravel (auth, validation, pagination, passwords) sont traités comme des **traductions de packages** parce qu'ils viennent du framework, pas de votre code applicatif.
:::

## Ce que vous pouvez faire avec les traductions de packages

| Action | Autorisée ? | Notes |
|---|---|---|
| **Modifier la valeur** | ✅ Oui | Remplacer n'importe quelle chaîne de package par votre propre formulation |
| **Changer le type** | ✅ Oui | Basculer entre text / html / markdown |
| **Modifier le groupe ou la clé** | ❌ Non | Les champs groupe et clé sont verrouillés dans la modale de modification |
| **Supprimer** | ❌ Non | Protégé par `VendorTranslationProtectedException` |

## Remplacer une chaîne de package

Le cas d'utilisation le plus courant est de remplacer les messages de validation de Laravel pour correspondre au ton de votre application :

1. Ouvrez `/lingua/translations`
2. Trouvez la chaîne (ex. `validation.required`)
3. Cliquez sur l'icône de modification pour ouvrir la modale de mise à jour
4. Modifiez la valeur pour n'importe quelle locale
5. Sauvegardez — le remplacement prend effet immédiatement à la prochaine requête

```php
// Ou par programmation via la facade :
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Veuillez renseigner le champ :attribute.',
    locale: 'fr'
);
```

## Interroger les traductions de packages

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// Toutes les traductions de packages
$all = Translation::where('is_vendor', true)->get();

// Toutes les traductions de packages pour un package spécifique
$laravel = Lingua::getVendorTranslations('laravel');

// Toutes les traductions de packages pour un package avec les valeurs françaises
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');

// Filtrer par groupe et clé manuellement
$required = Translation::where('is_vendor', true)
    ->where('vendor', 'laravel')
    ->where('group', 'validation')
    ->where('key', 'required')
    ->first();
```

## Mécanisme de protection

Tenter de supprimer une traduction de package (depuis l'interface ou via `Lingua::forgetTranslation()`) lève une `VendorTranslationProtectedException` :

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en'); // la clé appartient à une traduction de package
} catch (VendorTranslationProtectedException $e) {
    // Gérer gracieusement
}
```

Dans l'interface Livewire, les tentatives de suppression déclenchent un événement `vendor_translation_protected` et ferment la modale sans rien supprimer. Cet événement peut être écouté dans vos propres composants Livewire ou code Alpine.js :

```js
// Écouteur d'événement Alpine.js / Livewire
window.addEventListener('vendor_translation_protected', () => {
    alert('Cette traduction est protégée et ne peut pas être supprimée.');
});
```

## Re-synchroniser les traductions de packages

Si un package dont vous dépendez ajoute de nouvelles clés de traduction dans une mise à jour de version, re-synchronisez pour les importer :

```bash
# Récupérer les dernières depuis laravel-lang et synchroniser vers la DB
php artisan lingua:update-lang

# Ou re-synchroniser manuellement depuis vos fichiers lang/ existants
php artisan lingua:sync-to-database
```

Lingua utilise `updateOrCreate` lors de la synchronisation, les remplacements existants (valeurs modifiées) sont donc préservés.

## Désactiver l'import des traductions de packages

Si vous ne souhaitez pas du tout les traductions de packages dans la base de données, synchronisez uniquement après avoir supprimé le répertoire `lang/vendor/`. Lingua n'importe que ce qu'il trouve sur le disque.
