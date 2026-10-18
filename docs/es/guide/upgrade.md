# Actualización de 1.x a 2.0

Lingua 2.0 es una versión mayor. Esta guía te lleva por la migración paso a paso,
lista todos los cambios que rompen la compatibilidad y responde las preguntas más
frecuentes.

## Por qué es una versión mayor

- **Dependencias externas eliminadas.** `spatie/laravel-translation-loader`
  y `laravel-lang/common` han desaparecido. Los metadatos de locale y el conjunto
  de datos de traducción ahora se incluyen dentro del paquete.
- **Drivers de almacenamiento añadidos.** Elige `database` (el comportamiento de 1.x)
  o `file`. Consulta [Drivers de Almacenamiento](/es/guide/storage).
- **Refuerzo de seguridad integral.** Seguro por defecto, más el paso de refuerzo F1–F9.
  Consulta [Seguridad](/es/guide/security).
- **Requisito de PHP elevado** a 8.3+.

## Migración paso a paso

### 1. Actualizar el paquete

```bash
composer update rivalex/lingua
```

Composer elimina automáticamente `spatie/laravel-translation-loader`. Si tu propio
`composer.json` lista `laravel-lang/common`:

```bash
composer remove laravel-lang/common
```

### 2. Volver a publicar y fusionar la configuración

```bash
php artisan vendor:publish --tag=lingua-config --force
```

Luego fusiona las nuevas claves en tu configuración existente: `gate`,
`storage.driver`, `nav.enabled`, `navigate`, `routes_extra_parameters`,
`layout`, `links.translations`, `ui.sticky_top`, `cache.store`,
`cache.prefix`, `suppress_pro_nudge`, `pro_upgrade_url`,
`extensions.enabled`. Consulta [Configuración](/es/guide/configuration).

### 3. Establecer el driver de almacenamiento

```env
LINGUA_STORAGE_DRIVER=database
```

```bash
php artisan config:clear
```

`database` es idéntico al comportamiento de 1.x.

### 4. Migraciones

Las migraciones ahora están divididas en **tres** archivos. Si actualizaste desde 1.x
con las migraciones ya ejecutadas, **no se necesita ninguna migración nueva** — tus
tablas ya existen. Solo verifica divergencias en el esquema si previamente publicaste
y personalizaste la migración combinada.

### 5. Cargadores de traducción personalizados

```php
// Antes
use Spatie\TranslationLoader\TranslationLoaders\TranslationLoader;

// Después
use Rivalex\Lingua\Contracts\TranslationLoader;
```

La firma es sin cambios:
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### 6. Modelo Translation personalizado

```php
// Antes
class Translation extends \Spatie\TranslationLoader\LanguageLine {}

// Después
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $table = 'language_lines';

    public static function getTranslationsForGroup(string $locale, string $group): array
    {
        // …
    }
}
```

### 7. Type-hints

```php
// Antes
use Spatie\TranslationLoader\TranslationLoaderManager;

// Después
use Rivalex\Lingua\TranslationManager\LinguaManager;
```

### 8. Autores de paquetes (Testbench)

Elimina el proveedor de Spatie de `getPackageProviders()`:

```php
// Eliminar esta línea
Spatie\TranslationLoader\TranslationServiceProvider::class,
```

## Referencia de cambios que rompen la compatibilidad

| Cambio | Detalle |
|---|---|
| Tipo de retorno de `Lingua::info()` <Badge type="warning" text="Cambio importante" /> | Ahora devuelve `?LocaleInfo`; retorna `null` para locales desconocidos (antes lanzaba excepción). Guarda con `if ($info === null)`. Los nombres de campo difieren del antiguo `LaravelLang\LocaleData`. |
| `addLanguage()` / `removeLanguage()` <Badge type="warning" text="Cambio importante" /> | Ya no llaman a `lang:add` / `lang:rm`. Solo nativo de BD — sin escrituras en archivos. |
| Middleware por defecto <Badge type="warning" text="Cambio importante" /> | `['web', 'auth']` (antes era `['web']`). |
| Valor por defecto de `navigate` <Badge type="warning" text="Cambio importante" /> | `false` (antes era `true`). |
| Requisito de PHP <Badge type="warning" text="Cambio importante" /> | 8.3+ (antes era 8.2+). |
| `Language::scopeActive()` <Badge type="warning" text="Cambio importante" /> | Renombrado a `scopeOrdered()` (se conserva un delegado por compatibilidad). |
| `Translation::forgetTranslation()` <Badge type="warning" text="Cambio importante" /> | Lanza `VendorTranslationProtectedException` para filas de vendor. |
| `Import $errors` <Badge type="warning" text="Cambio importante" /> | Renombrado a `$rowErrors`. |
| `optimize()` <Badge type="warning" text="Cambio importante" /> | Obsoleto — elimina todas las llamadas. |
| Columnas nullable | `language_lines.text` y `languages.regional` ahora son nullable. |
| Migraciones | Divididas en 3 archivos (antes era 1 combinado). |
| Tag `lingua-assets` | Eliminado — los assets se sirven a través de la ruta `lingua.assets`. |

## Lista de verificación rápida

- [ ] `composer update rivalex/lingua`
- [ ] Eliminar `laravel-lang/common` si está en tu `composer.json`
- [ ] Volver a publicar la configuración y fusionar las nuevas claves
- [ ] Establecer `LINGUA_STORAGE_DRIVER=database` y ejecutar `php artisan config:clear`
- [ ] Actualizar cargadores / modelos / type-hints personalizados (Spatie → Lingua)
- [ ] Reemplazar los usos de `Lingua::info()` con una guarda de `null`
- [ ] Eliminar las llamadas a `optimize()`
- [ ] Renombrar las referencias a `Import::$errors` por `$rowErrors`
- [ ] Confirmar que el middleware/gate coincide con tu política de acceso

## Preguntas frecuentes

**¿Se perderán mis traducciones?**
No. Con el driver `database` el comportamiento y los datos son idénticos a 1.x.
Las filas existentes en `language_lines` no se tocan.

**¿Necesito volver a ejecutar las migraciones?**
No, si ya se ejecutaron bajo 1.x. Las tablas ya existen; la división en 3 archivos
solo afecta las instalaciones nuevas.

**¿Puedo seguir usando el almacenamiento basado en archivos?**
Sí — ese es el nuevo driver `file`. Cámbialo en cualquier momento con
`php artisan lingua:storage file`. Consulta
[Drivers de Almacenamiento](/es/guide/storage).

**¿Sigue siendo necesario Flux?**
Sí. Lingua 2.0 requiere `livewire/flux ^2.12`. Flux **no** fue eliminado.

## Actualización de 2.0 a 2.1

Lingua 2.1 es compatible con Laravel **12 y 13**. Laravel 11 dejó de recibir soporte de seguridad el March 12, 2026. Las aplicaciones que siguen en Laravel 11 se quedan en Lingua 2.0.6, que Composer sigue seleccionando automáticamente; actualiza Laravel antes de actualizar Lingua. No hay otros cambios que rompan la compatibilidad: no se necesita ningún cambio en la configuración, las migraciones ni la API.
