# Traducciones de Proveedores

Las traducciones de proveedores son cadenas que pertenecen a paquetes de terceros - los propios mensajes de validación de Laravel, etiquetas de paginación, cadenas de restablecimiento de contraseña y traducciones de cualquier otro paquete que incluya su propio directorio `lang/`.

## Cómo se identifican

Durante `lingua:sync-to-database`, Lingua escanea la estructura del directorio `lang/vendor/`. Cualquier archivo de traducción que encuentre allí se importa con:

- `is_vendor = true`
- `vendor` = el nombre del paquete (derivado del nombre del directorio, p. ej. `spatie`, `laravel`, `filament`)

Ejemplo de filas en la base de datos después de la sincronización:

```
group      | key          | is_vendor | vendor   | text
-----------|--------------|-----------|----------|-----------------------------
validation | required     | false     | null     | {"en":"The :attribute…"}
passwords  | reset        | true      | laravel  | {"en":"Your password…"}
auth       | failed       | true      | laravel  | {"en":"These credentials…"}
```

::: tip
Los propios archivos `lang/en/*.php` de Laravel (auth, validation, pagination, passwords) se tratan como **traducciones de proveedor** porque provienen del framework, no de tu código de aplicación.
:::

## Qué puedes hacer con las traducciones de proveedores

| Acción | ¿Permitida? | Notas |
|---|---|---|
| **Editar valor** | ✅ Sí | Sobreescribir cualquier cadena de proveedor con tu propia redacción |
| **Cambiar tipo** | ✅ Sí | Cambiar entre text / html / markdown |
| **Editar grupo o clave** | ❌ No | Los campos de grupo y clave están bloqueados en el modal de edición |
| **Eliminar** | ❌ No | Protegido por `VendorTranslationProtectedException` |

## Sobreescribir una cadena de proveedor

El caso de uso más común es sobreescribir los mensajes de validación de Laravel para que coincidan con el tono de tu aplicación:

1. Abre `/lingua/translations`
2. Encuentra la cadena (p. ej. `validation.required`)
3. Haz clic en el icono de edición para abrir el modal de actualización
4. Cambia el valor para cualquier idioma
5. Guarda - la sobreescritura surte efecto inmediatamente en la siguiente solicitud

```php
// O programáticamente mediante el facade:
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Please fill in the :attribute field.',
    locale: 'en'
);
```

## Consultar traducciones de proveedores

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// Todas las traducciones de proveedores
$all = Translation::where('is_vendor', true)->get();

// Todas las traducciones de proveedor de un paquete específico
$laravel = Lingua::getVendorTranslations('laravel');

// Todas las traducciones de proveedor de un paquete con valores en francés
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');

// Filtrar por grupo y clave manualmente
$required = Translation::where('is_vendor', true)
    ->where('vendor', 'laravel')
    ->where('group', 'validation')
    ->where('key', 'required')
    ->first();
```

## Mecanismo de protección

Intentar eliminar una traducción de proveedor (desde la interfaz o mediante `Lingua::forgetTranslation()`) lanza una `VendorTranslationProtectedException`:

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en'); // la clave pertenece a una traducción de proveedor
} catch (VendorTranslationProtectedException $e) {
    // Manejar graciosamente
}
```

En la interfaz Livewire, los intentos de eliminación despachan un evento `vendor_translation_protected` y cierran el modal sin eliminar nada. El evento se puede escuchar en tus propios componentes Livewire o código Alpine.js:

```js
// Listener de eventos Alpine.js / Livewire
window.addEventListener('vendor_translation_protected', () => {
    alert('This translation is protected and cannot be deleted.');
});
```

## Re-sincronizar traducciones de proveedores

Si un paquete del que dependes agrega nuevas claves de traducción en una actualización de versión, vuelve a sincronizar para importarlas:

```bash
# Obtener las últimas actualizaciones de laravel-lang y sincronizar a la BD
php artisan lingua:update-lang

# O volver a sincronizar manualmente desde tus archivos lang/ existentes
php artisan lingua:sync-to-database
```

Lingua usa `updateOrCreate` al sincronizar, por lo que las sobreescrituras existentes (valores editados) se preservan.

## Deshabilitar la importación de traducciones de proveedores

Si no quieres traducciones de proveedores en la base de datos en absoluto, sincroniza solo después de eliminar el directorio `lang/vendor/`. Lingua solo importa lo que encuentra en disco.
