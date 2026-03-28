# Facade de Lingua

El facade `Lingua` proporciona acceso estático al servicio completo de Lingua desde cualquier parte de tu aplicación.

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## Helpers de idioma

### `getLocale()`

Devuelve el código de idioma actual de la aplicación.

```php
Lingua::getLocale(); // 'en'
```

Equivale a `app()->getLocale()`.

---

### `getDefaultLocale()`

Devuelve el código de idioma marcado como predeterminado en la base de datos.

```php
Lingua::getDefaultLocale(); // 'en'
```

Recurre a `config('lingua.default_locale', 'en')` si no hay ninguno predeterminado configurado.

---

### `isDefaultLocale(?string $locale = null): bool`

Devuelve `true` si el idioma dado (o el idioma actual si es `null`) es el predeterminado del sistema.

```php
Lingua::isDefaultLocale();       // true  (el idioma actual es el predeterminado)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (idioma desconocido, sin excepción)
```

---

### `hasLocale(string $locale): bool`

Devuelve `true` si existe un registro `Language` para el código o valor regional dado.

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (coincide por regional)
Lingua::hasLocale('xx');     // false
```

---

### `setDefaultLocale(string $locale): void`

Marca el idioma dado como predeterminado del sistema. Lanza `ModelNotFoundException` si el idioma no está instalado.

```php
Lingua::setDefaultLocale('fr');
```

---

### `getLocaleName(?string $locale = null): string`

Devuelve el nombre en inglés del idioma. Devuelve `''` si no se encuentra.

```php
Lingua::getLocaleName();       // 'English'  (idioma actual)
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
Lingua::getLocaleName('zz');   // ''
```

---

### `getLocaleNative(?string $locale = null): string`

Devuelve el nombre nativo del idioma. Devuelve `''` si no se encuentra.

```php
Lingua::getLocaleNative();       // 'English'
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

---

### `getDirection(?string $locale = null): string`

Devuelve `'ltr'` o `'rtl'` para el idioma dado. Por defecto `'ltr'` si no se encuentra el idioma.

```php
Lingua::getDirection();        // 'ltr'  (idioma actual)
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (respaldo seguro)
```

---

### `info(mixed $locale, bool $withCountry = false, bool $withCurrency = false): LocaleData`

Devuelve un objeto `LocaleData` de `laravel-lang/locales` con información detallada del idioma.

```php
$info = Lingua::info('fr');
$info->code;          // 'fr'
$info->native;        // 'Français'
$info->direction;     // Direction enum

$info = Lingua::info('en-US', withCountry: true, withCurrency: true);
$info->native;        // 'English (United States)'
```

---

## Consultas de idiomas

### `languages(): Collection`

Devuelve una colección de todos los modelos `Language` instalados.

```php
$languages = Lingua::languages();
foreach ($languages as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

Devuelve el modelo `Language` para el código de idioma dado, o `null` si no se encuentra.

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

---

### `getDefault(): ?Language`

Devuelve el modelo `Language` marcado como predeterminado.

```php
$default = Lingua::getDefault();
$default?->code;       // 'en'
$default?->is_default; // true
```

---

### `getFallback(): ?Language`

Devuelve el modelo `Language` para `app()->getFallbackLocale()`.

```php
$fallback = Lingua::getFallback();
```

---

### `languagesWithStatistics(): Collection`

Devuelve todos los modelos `Language` enriquecidos con estadísticas de traducción.

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Missing: {$lang->missing_strings} / {$lang->total_strings}";
}
```

Cada modelo obtiene cuatro atributos de solo lectura:

| Atributo | Tipo | Descripción |
|---|---|---|
| `total_strings` | `int` | Total de filas en `language_lines` |
| `translated_strings` | `int` | Filas con un valor para este idioma |
| `missing_strings` | `int` | `total - traducidas` |
| `completion_percentage` | `float` | `traducidas / total * 100` |

---

## Verificaciones de disponibilidad de idiomas

### `available(): array`

Devuelve todos los códigos de idioma conocidos por `laravel-lang/locales` (instalados + no instalados).

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', 'bn', …]
```

---

### `installed(): array`

Devuelve los códigos de idioma que están actualmente en la tabla `languages`.

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

---

### `notInstalled(): array`

Devuelve los códigos de idioma disponibles pero no instalados, ordenados alfabéticamente.

```php
Lingua::notInstalled(); // ['af', 'ar', 'az', …] (todos excepto 'en', 'fr', 'it')
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

Devuelve `true` si el idioma es conocido por laravel-lang pero **aún no** está instalado.

```php
Lingua::isAvailable('de');   // true  (disponible, no instalado)
Lingua::isAvailable('en');   // false (ya instalado)
Lingua::isAvailable(null);   // false
```

---

## Lectura de traducciones

### `translations(): Collection`

Devuelve todos los modelos `Translation`.

```php
$all = Lingua::translations();
```

---

### `getTranslations(?string $key): array`

Devuelve todos los valores de idioma para una clave de traducción como array asociativo.

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants ne correspondent pas.']

Lingua::getTranslations('nonexistent'); // []
```

---

### `getTranslation(?string $key, ?string $locale = null): string`

Devuelve la cadena traducida para una clave e idioma. Devuelve `''` si no se encuentra.

```php
Lingua::getTranslation('auth.failed');         // idioma actual
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('auth.failed', 'zz');   // ''
Lingua::getTranslation('nonexistent', 'en');   // ''
```

---

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

Devuelve todos los modelos `Translation` de un grupo, opcionalmente filtrados a aquellos con un valor para el idioma dado.

```php
// Todas las cadenas de validación
Lingua::getTranslationByGroup('validation');

// Solo las cadenas de validación que tienen traducción en francés
Lingua::getTranslationByGroup('validation', 'fr');
```

---

### `getLocaleStats(?string $locale = null): array`

Devuelve estadísticas de traducción para el idioma dado (o el idioma actual si es `null`).

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

## Escritura de traducciones

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

Guarda un valor de traducción. No hace nada si la clave no existe.

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
Lingua::setTranslation('auth.failed', 'Updated message');  // idioma actual
```

---

### `forgetTranslation(?string $key, ?string $locale = null): void`

Elimina el valor de un idioma de una clave de traducción. Si el idioma es el predeterminado, se elimina el registro completo. Lanza `VendorTranslationProtectedException` para traducciones de proveedores.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // elimina solo el valor 'fr'
Lingua::forgetTranslation('custom.key', 'en');  // elimina el registro completo (idioma predeterminado)
```

---

## Helpers de traducciones de proveedores

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frenchSpatie = Lingua::getVendorTranslations('spatie', 'fr');
```

---

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

Actualiza el valor de una traducción de proveedor. Lanza `ModelNotFoundException` si el registro no existe.

```php
Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'The :attribute field is mandatory.',
    locale: 'en'
);
```

---

## Ciclo de vida de idiomas

### `addLanguage(string $locale): void`

Instala los archivos de idioma para el idioma dado mediante `lang:add`.

```php
Lingua::addLanguage('fr');
```

> Esto solo instala archivos. Usa `php artisan lingua:add {locale}` para el flujo completo y orquestado (archivos + registro en BD + sincronización).

---

### `removeLanguage(string $locale): void`

Elimina los archivos de idioma para el idioma dado mediante `lang:rm --force`.

```php
Lingua::removeLanguage('fr');
```

> Esto solo elimina archivos. Usa `php artisan lingua:remove {locale}` para el flujo completo y orquestado (archivos + traducciones + registro en BD + reordenación).

---

## Sincronización y mantenimiento

### `syncToDatabase(): void`

Importa todos los archivos `lang/` locales a la base de datos.

```php
Lingua::syncToDatabase();
```

---

### `syncToLocal(): void`

Exporta todas las traducciones de la base de datos a archivos `lang/` locales.

```php
Lingua::syncToLocal();
```

---

### `updateLanguages(): void`

Ejecuta `lang:update` para obtener las últimas traducciones de `laravel-lang`.

```php
Lingua::updateLanguages();
```

---

### `optimize(): void`

Limpia la caché de la aplicación mediante `optimize:clear`.

```php
Lingua::optimize();
```
