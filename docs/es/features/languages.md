# Gestión de Idiomas

La página de Idiomas (`/lingua/languages`) es tu panel de control para todos los idiomas instalados.

<Screenshot src="/screenshots/languages-page.png" alt="Página de gestión de idiomas de Lingua" caption="Página de idiomas — muestra los idiomas instalados con estadísticas de completitud." />

## Agregar un idioma

### Desde la interfaz

Haz clic en **Add Language**, selecciona cualquiera de los más de 70 idiomas disponibles y confirma. Lingua:

1. Descargará los archivos de idioma desde Laravel Lang
2. Creará un registro `Language` en la base de datos
3. Sincronizará todas las cadenas nuevas en `language_lines`
4. Actualizará la tabla con el nuevo idioma

<Screenshot src="/screenshots/language-add-modal.png" alt="Modal para agregar idioma" caption="El modal de agregar idioma con selector de idioma con búsqueda." width="640px" :center="true"/>

### Desde la línea de comandos

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

### Programáticamente

```php
use Rivalex\Lingua\Facades\Lingua;

// Instalar archivos de idioma (wrapper de lang:add)
Lingua::addLanguage('fr');

// Luego crear el registro en BD + sincronizar (lo que el comando Artisan hace completamente)
// → usa lingua:add para el flujo completo y orquestado
```

::: tip
Usa `Lingua::notInstalled()` para obtener la lista de idiomas disponibles pero aún no instalados:

```php
$available = Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```
:::

## Eliminar un idioma

Haz clic en el icono de papelera de cualquier fila de idioma que no sea el predeterminado. Un modal de confirmación previene eliminaciones accidentales — debes escribir el nombre del idioma para confirmar.

Internamente, la operación de eliminación:
1. Elimina los archivos de idioma mediante `lang:rm {locale} --force`
2. Elimina todas las entradas `{locale}` de la columna JSON `language_lines.text`
3. Elimina el registro `Language`
4. Reordena los valores de orden de los idiomas restantes

::: warning
**El idioma predeterminado no puede eliminarse**. Establece otro idioma como predeterminado primero.
:::

```bash
# Desde la línea de comandos
php artisan lingua:remove fr
```

## Establecer el idioma predeterminado

Haz clic en el icono de estrella (⭐) de cualquier fila de idioma. Solo un idioma puede ser el predeterminado a la vez. El cambio está envuelto en una transacción de base de datos para evitar un instante en que ningún idioma esté marcado como predeterminado.

```php
// Programáticamente
Lingua::setDefaultLocale('fr');

// O mediante el modelo
$french = Language::where('code', 'fr')->first();
Language::setDefault($french);
```

::: warning Eliminar el idioma predeterminado
Si estableces un nuevo idioma predeterminado, asegúrate de que todas tus traducciones estén al menos parcialmente completas para ese idioma. El idioma predeterminado se usa como referencia en el editor de la interfaz (la columna de la izquierda muestra el valor predeterminado como referencia).
:::

## Reordenar idiomas

Arrastra y suelta las filas de idioma para controlar su orden de presentación en toda la aplicación — en el widget selector de idioma, en el selector de idioma de traducciones y en cualquier lugar donde uses `Lingua::languages()`.

El orden de clasificación se almacena en la columna entera `sort` y se reasigna secuencialmente después de cada arrastre.

## Ver estadísticas de completitud

Cada fila de idioma muestra:

| Métrica | Descripción |
|---|---|
| **Completitud %** | `traducidas / total * 100`, redondeado a 2 decimales |
| **Faltantes** | Número de cadenas sin valor para este idioma |

Se calculan en tiempo de consulta mediante subconsultas a la base de datos contra la tabla `language_lines`, por lo que siempre están actualizadas.

```php
// Obtener estadísticas para un idioma específico
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// O obtener todos los idiomas con estadísticas en una sola consulta
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

## Controles de sincronización

La barra de herramientas de la página de Idiomas tiene tres botones de sincronización:

| Botón | Acción |
|---|---|
| **Sync to database** | Importa todos los archivos `lang/` locales en `language_lines` |
| **Sync to local** | Exporta todas las traducciones de la BD de vuelta a archivos `lang/` |
| **Update via Laravel Lang** | Ejecuta `lang:update` para obtener las últimas cadenas del upstream, luego sincroniza a la BD |

Las tres operaciones se ejecutan de forma **asíncrona** (atributo `#[Async]` de Livewire) para que la interfaz permanezca responsiva durante las sincronizaciones de larga duración.
