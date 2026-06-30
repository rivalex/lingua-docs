# Facade de Lingua

El facade `Lingua` proporciona acceso estático al servicio completo desde cualquier
parte de tu aplicación.

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## Helpers de idioma

### `getLocale(): string`

```php
Lingua::getLocale(); // 'en'  — equivale a app()->getLocale()
```

### `getDefaultLocale(): string`

Devuelve el código marcado como predeterminado en la BD. Recurre a `config('lingua.default_locale', 'en')` si no hay ninguno.

```php
Lingua::getDefaultLocale(); // 'en'
```

### `setDefaultLocale(string $locale): void`

Marca el idioma dado como predeterminado. Lanza `ModelNotFoundException` si no está instalado.

```php
Lingua::setDefaultLocale('fr');
```

### `isDefaultLocale(?string $locale = null): bool`

```php
Lingua::isDefaultLocale();       // true  (locale actual es predeterminado)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
```

### `hasLocale(string $locale): bool`

`true` si existe un registro `Language` para el código o regional dado.

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('xx');     // false
```

### `getLocaleName(?string $locale = null): string`

Nombre en inglés del idioma. Devuelve `''` si no se encuentra.

```php
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
```

### `getLocaleNative(?string $locale = null): string`

Nombre nativo del idioma.

```php
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
```

### `getDirection(?string $locale = null): string`

`'ltr'` o `'rtl'`. Por defecto `'ltr'` si el idioma no se encuentra.

```php
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (respaldo seguro)
```

### `info(string $locale): ?LocaleInfo` <Badge type="tip" text="Cambiado en 2.0" />

Devuelve un objeto de valor `LocaleInfo` de solo lectura, o `null` para locales
desconocidos. **Ya no depende de laravel-lang/locales** — se sirve desde el
`LocaleRegistry` integrado del paquete.

```php
$info = Lingua::info('fr');
$info->code;       // 'fr'
$info->name;       // 'French'
$info->native;     // 'Français'
$info->direction;  // 'ltr'
$info->regional;   // 'fr_FR'
$info->type;       // 'standard'

Lingua::info('xx'); // null — no lanza excepción
```

---

## Consultas de idiomas

### `languages(): Collection`

Todos los modelos `Language` instalados, en orden de clasificación.

```php
foreach (Lingua::languages() as $lang) {
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
$default?->code; // 'en'
```

### `languagesWithStatistics(): Collection`

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Faltantes: {$lang->missing_strings} / {$lang->total_strings}";
}
```

---

## Disponibilidad

### `installed(): array`

Códigos actualmente en la tabla `languages`.

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

### `notInstalled(): array`

Locales disponibles en el registro pero aún no instalados.

```php
Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```

### `isInstalled(?string $locale = null): bool`

```php
Lingua::isInstalled('en');   // true
Lingua::isInstalled('xx');   // false
```

---

## Lectura de traducciones

### `getTranslations(?string $key): array`

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants…']
```

### `getTranslation(?string $key, ?string $locale = null): string`

```php
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('auth.failed', 'zz');   // ''
```

### `getLocaleStats(?string $locale = null): array`

```php
$stats = Lingua::getLocaleStats('fr');
// ['total' => 1240, 'translated' => 980, 'missing' => 260, 'percentage' => 79.03]
```

---

## Escritura de traducciones

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
```

### `forgetTranslation(?string $key, ?string $locale = null): void`

Elimina el valor de un locale. Si el locale es el predeterminado, elimina el registro
completo. Lanza `VendorTranslationProtectedException` para traducciones de vendor.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // solo elimina el valor 'fr'
Lingua::forgetTranslation('custom.key', 'en');  // elimina el registro completo
```

---

## Ciclo de vida de idiomas

### `addLanguage(string $locale): void`

Instala locales desde el conjunto de datos integrado. Para el flujo completo (BD + inicialización), usa `php artisan lingua:add {locale}`.

```php
Lingua::addLanguage('fr');
```

### `removeLanguage(string $locale): void`

Para el flujo completo (archivos + BD + reordenación), usa `php artisan lingua:remove {locale}`.

```php
Lingua::removeLanguage('fr');
```

---

## Sincronización y mantenimiento

### `syncToDatabase(): void`

```php
Lingua::syncToDatabase(); // Importa lang/ → language_lines
```

### `syncToLocal(): void`

```php
Lingua::syncToLocal(); // Exporta language_lines → lang/
```

### `updateLanguages(): void`

Re-inicializa desde el conjunto de datos integrado + `lang/` local.

```php
Lingua::updateLanguages();
```

### `optimize(): void` <Badge type="warning" text="Obsoleto en 2.0" />

Anteriormente llamaba a `optimize:clear`. En 2.0, la invalidación de caché es quirúrgica
por `(locale, grupo)` — ningún comando Artisan de Lingua debería necesitar vaciar toda
la caché. Mantener por compatibilidad hacia atrás; puede eliminarse en 3.0.
