# Traducciones de Vendor

Las traducciones de vendor son cadenas que pertenecen a paquetes de terceros — los
mensajes de validación de Laravel, etiquetas de paginación, cadenas de restablecimiento
de contraseña y traducciones de cualquier otro paquete con su propio directorio `lang/`.
Lingua te permite sobreescribir estas cadenas sin tocar los archivos de vendor, mientras
protege las filas de vendor para que no puedan eliminarse accidentalmente.

## Cómo se identifican

Durante `lingua:sync-to-database`, Lingua escanea `lang/vendor/`. Los archivos encontrados
allí se importan con:

- `is_vendor = true`
- `vendor` = nombre del paquete (del nombre del directorio)

Los archivos del núcleo de Laravel (`lang/en/auth.php`, etc.) también se marcan con
`is_vendor = true` — son parte del framework, no de tu aplicación.

```
group      | key          | is_vendor | vendor   | text
-----------|--------------|-----------|----------|-----------------------------
validation | required     | false     | null     | {"en":"The :attribute…"}
passwords  | reset        | true      | laravel  | {"en":"Your password…"}
auth       | failed       | true      | laravel  | {"en":"These credentials…"}
```

## Qué puedes hacer

| Acción | ¿Permitida? | Notas |
|---|---|---|
| **Editar valor** | ✅ Sí | Sobreescribir cualquier cadena con tu redacción |
| **Cambiar tipo** | ✅ Sí | Cambiar entre text / html / markdown |
| **Editar grupo o clave** | ❌ No | Campos bloqueados en el modal de edición |
| **Eliminar** | ❌ No | Protegido por `VendorTranslationProtectedException` |

## Mecanismo de protección

`VendorTranslationProtectedException` se lanza al intentar **eliminar** una fila de
vendor. Implementado en ambos drivers:

```php
// DatabaseRepository::forgetTranslation() y FileRepository::forgetTranslation()
if ($translation->is_vendor) {
    throw new VendorTranslationProtectedException($translation->key);
}
```

En la UI, un intento de eliminación despacha el evento `vendor_translation_protected`,
muestra una advertencia y **no elimina nada**.

Durante la importación (Transfer), las filas que intenten eliminar entradas de vendor
van al bucket `skipped` del diff — nunca se aplican.

## Ver y editar traducciones de vendor

Por defecto, la vista de Traducciones oculta las filas de vendor. Activa el filtro
**Include vendor** para mostrarlas. Las filas de vendor muestran una insignia `Vendor`
para distinguirlas de tus traducciones personalizadas.

## Protección al importar

| Intento de importación | Resultado |
|---|---|
| Actualizar valor de vendor existente | ✅ Permitido |
| Crear nueva fila de vendor | ❌ `skipped` |
| Eliminar fila de vendor | ❌ `skipped` |

## Acceso programático

```php
use Rivalex\Lingua\Models\Translation;

// Solo filas de vendor
Translation::where('is_vendor', true)->get();

// Por namespace de vendor
Translation::where('vendor', 'laravel')->get();
```

## Sobreescribir programáticamente

```php
use Rivalex\Lingua\Models\Translation;

Translation::where('group', 'auth')->where('key', 'failed')
    ->update(['text->fr' => 'Ces identifiants ne correspondent pas.']);
```

La sobreescritura surte efecto inmediatamente — la caché de `(fr, auth)` se invalida
y `__('auth.failed')` devuelve el nuevo valor en la siguiente llamada.

## Re-sincronizar traducciones de vendor

Cuando un paquete añade nuevas claves de traducción en una actualización:

```bash
# Re-inicializar desde el conjunto de datos integrado y lang/ local
php artisan lingua:update-lang

# O sincronizar manualmente desde los archivos lang/ existentes
php artisan lingua:sync-to-database
```

Lingua usa `updateOrCreate` al sincronizar — las sobreescrituras existentes se preservan.
