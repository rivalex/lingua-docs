# Facade Lingua

La facade `Lingua` fournit un accès statique au service Lingua complet depuis n'importe où dans votre application.

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## Helpers de locale

### `getLocale()`

Retourne le code de locale courant de l'application.

```php
Lingua::getLocale(); // 'en'
```

Équivalent de `app()->getLocale()`.

---

### `getDefaultLocale()`

Retourne le code de locale de la langue marquée comme par défaut dans la base de données.

```php
Lingua::getDefaultLocale(); // 'en'
```

Retombe sur `config('lingua.default_locale', 'en')` si aucune valeur par défaut n'est définie.

---

### `isDefaultLocale(?string $locale = null): bool`

Retourne `true` si la locale donnée (ou la locale courante quand `null`) est la valeur par défaut du système.

```php
Lingua::isDefaultLocale();       // true  (la locale courante est la valeur par défaut)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (locale inconnue, pas d'exception)
```

---

### `hasLocale(string $locale): bool`

Retourne `true` si un enregistrement `Language` existe pour le code ou la valeur régionale donnée.

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (correspondance par regional)
Lingua::hasLocale('xx');     // false
```

---

### `setDefaultLocale(string $locale): void`

Marque la locale donnée comme valeur par défaut du système. Lève `ModelNotFoundException` si la locale n'est pas installée.

```php
Lingua::setDefaultLocale('fr');
```

---

### `getLocaleName(?string $locale = null): string`

Retourne le nom d'affichage en anglais de la locale. Retourne `''` si introuvable.

```php
Lingua::getLocaleName();       // 'English'  (locale courante)
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
Lingua::getLocaleName('zz');   // ''
```

---

### `getLocaleNative(?string $locale = null): string`

Retourne le nom natif de la locale. Retourne `''` si introuvable.

```php
Lingua::getLocaleNative();       // 'English'
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

---

### `getDirection(?string $locale = null): string`

Retourne `'ltr'` ou `'rtl'` pour la locale donnée. Par défaut `'ltr'` si la locale n'est pas trouvée.

```php
Lingua::getDirection();        // 'ltr'  (locale courante)
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (retour de valeur sûr)
```

---

### `info(mixed $locale, bool $withCountry = false, bool $withCurrency = false): LocaleData`

Retourne un objet `LocaleData` de `laravel-lang/locales` avec des informations détaillées sur la locale.

```php
$info = Lingua::info('fr');
$info->code;          // 'fr'
$info->native;        // 'Français'
$info->direction;     // enum Direction

$info = Lingua::info('en-US', withCountry: true, withCurrency: true);
$info->native;        // 'English (United States)'
```

---

## Requêtes de langues

### `languages(): Collection`

Retourne une collection de tous les modèles `Language` installés.

```php
$languages = Lingua::languages();
foreach ($languages as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

Retourne le modèle `Language` pour le code de locale donné, ou `null` si introuvable.

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

---

### `getDefault(): ?Language`

Retourne le modèle `Language` marqué comme par défaut.

```php
$default = Lingua::getDefault();
$default?->code;       // 'en'
$default?->is_default; // true
```

---

### `getFallback(): ?Language`

Retourne le modèle `Language` pour `app()->getFallbackLocale()`.

```php
$fallback = Lingua::getFallback();
```

---

### `languagesWithStatistics(): Collection`

Retourne tous les modèles `Language` enrichis de statistiques de traduction.

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Manquants : {$lang->missing_strings} / {$lang->total_strings}";
}
```

Chaque modèle gagne quatre attributs en lecture seule :

| Attribut | Type | Description |
|---|---|---|
| `total_strings` | `int` | Total des lignes dans `language_lines` |
| `translated_strings` | `int` | Lignes avec une valeur pour cette locale |
| `missing_strings` | `int` | `total - traduit` |
| `completion_percentage` | `float` | `traduit / total * 100` |

---

## Vérifications de disponibilité de locale

### `available(): array`

Retourne tous les codes de locale connus de `laravel-lang/locales` (installés + non installés).

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', 'bn', …]
```

---

### `installed(): array`

Retourne les codes de locale actuellement dans la table `languages`.

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

---

### `notInstalled(): array`

Retourne les codes de locale disponibles mais non installés, triés par ordre alphabétique.

```php
Lingua::notInstalled(); // ['af', 'ar', 'az', …] (tous sauf 'en', 'fr', 'it')
```

---

### `isInstalled(?string $locale = null): bool`

```php
Lingua::isInstalled('en');   // true
Lingua::isInstalled('xx');   // false
Lingua::isInstalled(null);   // false
```

---

### `isAvailable(?string $locale = null): bool`

Retourne `true` si la locale est connue de laravel-lang mais **pas encore** installée.

```php
Lingua::isAvailable('de');   // true  (disponible, non installée)
Lingua::isAvailable('en');   // false (déjà installée)
Lingua::isAvailable(null);   // false
```

---

## Lectures de traductions

### `translations(): Collection`

Retourne tous les modèles `Translation`.

```php
$all = Lingua::translations();
```

---

### `getTranslations(?string $key): array`

Retourne toutes les valeurs de locale pour une clé de traduction sous forme de tableau associatif.

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants ne correspondent pas.']

Lingua::getTranslations('nonexistent'); // []
```

---

### `getTranslation(?string $key, ?string $locale = null): string`

Retourne la chaîne traduite pour une clé et une locale. Retourne `''` si introuvable.

```php
Lingua::getTranslation('auth.failed');         // locale courante
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('auth.failed', 'zz');   // ''
Lingua::getTranslation('nonexistent', 'en');   // ''
```

---

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

Retourne tous les modèles `Translation` d'un groupe, optionnellement filtrés à ceux ayant une valeur pour la locale donnée.

```php
// Toutes les chaînes de validation
Lingua::getTranslationByGroup('validation');

// Uniquement les chaînes de validation qui ont une traduction française
Lingua::getTranslationByGroup('validation', 'fr');
```

---

### `getLocaleStats(?string $locale = null): array`

Retourne les statistiques de traduction pour la locale donnée (ou la locale courante quand `null`).

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

Lingua::getLocaleStats('zz');
// ['total' => 1240, 'translated' => 0, 'missing' => 1240, 'percentage' => 0.0]
```

---

## Écritures de traductions

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

Sauvegarde une valeur de traduction. Ne fait rien si la clé n'existe pas.

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
Lingua::setTranslation('auth.failed', 'Message mis à jour');  // locale courante
```

---

### `forgetTranslation(?string $key, ?string $locale = null): void`

Supprime la valeur d'une locale d'une clé de traduction. Si la locale est la valeur par défaut, l'enregistrement entier est supprimé. Lève `VendorTranslationProtectedException` pour les traductions de packages.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // retire uniquement la valeur 'fr'
Lingua::forgetTranslation('custom.key', 'en');  // supprime l'enregistrement entier (locale par défaut)
```

---

## Helpers de traductions de packages

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frenchSpatie = Lingua::getVendorTranslations('spatie', 'fr');
```

---

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

Met à jour une valeur de traduction de package. Lève `ModelNotFoundException` si l'enregistrement n'existe pas.

```php
Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Le champ :attribute est obligatoire.',
    locale: 'fr'
);
```

---

## Cycle de vie des langues

### `addLanguage(string $locale): void`

Installe les fichiers de langue pour la locale donnée via `lang:add`.

```php
Lingua::addLanguage('fr');
```

> Ceci installe uniquement les fichiers. Utilisez `php artisan lingua:add {locale}` pour le flux orchestré complet (fichiers + enregistrement en DB + synchronisation).

---

### `removeLanguage(string $locale): void`

Supprime les fichiers de langue pour la locale donnée via `lang:rm --force`.

```php
Lingua::removeLanguage('fr');
```

> Ceci supprime uniquement les fichiers. Utilisez `php artisan lingua:remove {locale}` pour le flux orchestré complet (fichiers + traductions + enregistrement en DB + réordonnancement).

---

## Synchronisation et maintenance

### `syncToDatabase(): void`

Importe tous les fichiers `lang/` locaux dans la base de données.

```php
Lingua::syncToDatabase();
```

---

### `syncToLocal(): void`

Exporte toutes les traductions de la base de données vers les fichiers `lang/` locaux.

```php
Lingua::syncToLocal();
```

---

### `updateLanguages(): void`

Exécute `lang:update` pour récupérer les dernières traductions depuis `laravel-lang`.

```php
Lingua::updateLanguages();
```

---

### `optimize(): void`

Vide le cache de l'application via `optimize:clear`.

```php
Lingua::optimize();
```
