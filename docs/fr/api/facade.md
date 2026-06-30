# Facade Lingua

La facade `Lingua` fournit un accès statique au service Lingua depuis n'importe où dans
votre application.

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## Helpers de locale

### `getLocale(): string`

```php
Lingua::getLocale(); // 'en'
```

Équivalent de `app()->getLocale()`.

### `getDefaultLocale(): string`

```php
Lingua::getDefaultLocale(); // 'en'
```

Retombe sur `config('lingua.default_locale', 'en')` si aucune valeur par défaut DB.

### `isDefaultLocale(?string $locale = null): bool`

```php
Lingua::isDefaultLocale();       // true  (locale courante)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (locale inconnue, pas d'exception)
```

### `hasLocale(string $locale): bool`

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (correspondance par regional)
Lingua::hasLocale('xx');     // false
```

### `setDefaultLocale(string $locale): void`

```php
Lingua::setDefaultLocale('fr');
// Lève ModelNotFoundException si la locale n'est pas installée
```

### `getLocaleName(?string $locale = null): string`

```php
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
Lingua::getLocaleName('zz');   // ''
```

### `getLocaleNative(?string $locale = null): string`

```php
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

### `getDirection(?string $locale = null): string`

```php
Lingua::getDirection();        // 'ltr'  (locale courante)
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('zz');    // 'ltr'  (retour de valeur sûr)
```

### `info(string $locale): ?LocaleInfo` <Badge type="warning" text="Modifié dans la 2.0" />

Retourne un objet valeur `LocaleInfo` depuis le `LocaleRegistry` embarqué, ou `null`
pour les locales inconnues. La signature à deux flags (`$withCountry`, `$withCurrency`)
de la 1.x a été **supprimée**.

```php
$info = Lingua::info('fr');

if ($info !== null) {
    $info->code;      // 'fr'
    $info->name;      // 'French'
    $info->native;    // 'Français'
    $info->direction; // 'ltr'
    $info->regional;  // 'fr_FR'
    $info->type;      // 'standard'
}

Lingua::info('xx'); // null
```

---

## Requêtes de langues

### `languages(): Collection`

```php
$languages = Lingua::languages();
foreach ($languages as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

### `get(?string $locale = null): ?Language`

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

### `getDefault(): ?Language`

```php
$default = Lingua::getDefault();
$default?->code;    // 'en'
```

### `getFallback(): ?Language`

```php
$fallback = Lingua::getFallback();
```

### `languagesWithStatistics(): Collection`

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    // + total_strings, translated_strings, missing_strings
}
```

---

## Vérifications de disponibilité de locale

### `available(): array` <Badge type="warning" text="Modifié dans la 2.0" />

Retourne tous les codes de locale connus depuis le `LocaleRegistry` embarqué (129+ locales).
Plus de dépendance à `laravel-lang/locales`.

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', …]
```

### `installed(): array`

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

### `notInstalled(): array`

```php
Lingua::notInstalled(); // toutes les locales disponibles sauf les installées
```

### `isInstalled(?string $locale = null): bool`

```php
Lingua::isInstalled('en');   // true
Lingua::isInstalled('xx');   // false
```

### `isAvailable(?string $locale = null): bool`

```php
Lingua::isAvailable('de');   // true  (dans le registre, non installée)
Lingua::isAvailable('en');   // false (déjà installée)
```

---

## Lectures de traductions

### `translations(): Collection`

```php
$all = Lingua::translations();
```

### `getTranslations(?string $key): array`

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants…']
```

### `getTranslation(?string $key, ?string $locale = null): string`

```php
Lingua::getTranslation('auth.failed', 'fr'); // 'Ces identifiants…'
Lingua::getTranslation('nonexistent', 'en'); // ''
```

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

```php
Lingua::getTranslationByGroup('validation');
Lingua::getTranslationByGroup('validation', 'fr');
```

### `getLocaleStats(?string $locale = null): array`

```php
$stats = Lingua::getLocaleStats('fr');
// ['total' => 1240, 'translated' => 980, 'missing' => 260, 'percentage' => 79.03]
```

---

## Écritures de traductions

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
```

### `forgetTranslation(?string $key, ?string $locale = null): void`

Supprime la valeur d'une locale. Si la locale est la valeur par défaut, supprime
l'enregistrement entier. Lève `VendorTranslationProtectedException` pour les vendor.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // retire la valeur 'fr'
Lingua::forgetTranslation('custom.key', 'en');  // supprime l'enregistrement entier
```

---

## Helpers de traductions vendor

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frLaravel = Lingua::getVendorTranslations('laravel', 'fr');
```

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

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

### `addLanguage(string $locale): void` <Badge type="warning" text="Modifié dans la 2.0" />

Installe une locale depuis le jeu de données groupé et crée l'enregistrement DB.
Plus de téléchargement via `lang:add` — tout provient du registre embarqué.

```php
Lingua::addLanguage('fr');
```

### `removeLanguage(string $locale): void`

```php
Lingua::removeLanguage('fr');
```

---

## Synchronisation et maintenance

### `syncToDatabase(): void`

```php
Lingua::syncToDatabase();
```

### `syncToLocal(): void`

```php
Lingua::syncToLocal();
```

### `updateLanguages(): void`

Met à jour depuis le jeu de données groupé embarqué (pas de `laravel-lang` dans la 2.0).

```php
Lingua::updateLanguages();
```

### `optimize(): void` <Badge type="warning" text="Déprécié dans la 2.0" />

Exécute `optimize:clear`. Déprécié — préférez `php artisan optimize:clear` directement.

```php
Lingua::optimize();
```

---

## Fonctions helper

```php
lingua_locale();           // Locale active
lingua_default_locale();   // Locale par défaut
lingua_direction();        // 'ltr' ou 'rtl' pour la locale active
lingua_is_rtl();           // bool
```
