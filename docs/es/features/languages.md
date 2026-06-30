# Gestión de Idiomas

La página de Idiomas (`/lingua/languages`) es tu panel de control para todos los locales
instalados. Comparte el [menú de navegación](/es/features/settings#menu-de-navegacion)
con las demás páginas de Lingua, con la página actual resaltada.

<Screenshot src="/screenshots/languages-page.png" alt="Página de gestión de idiomas de Lingua" caption="Página de idiomas — locales instalados con estadísticas de completitud y la barra de herramientas de dos filas." />

## La barra de herramientas

La barra de herramientas se reorganiza en dos filas para que los controles sean
utilizables a cualquier ancho:

- **Fila superior** — el campo de **búsqueda** de locale y el botón **Agregar idioma**.
- **Fila inferior** — los tres botones de **sincronización** (Sincronizar desde archivos, Sincronizar a archivos, Actualizar).

## Agregar un idioma

### Desde la interfaz

Haz clic en **Add Language**, busca entre los más de 129 locales del registro,
elige uno y confirma. Lingua entonces:

1. Crea un registro `Language` para el locale
2. Inicializa sus cadenas desde el **conjunto de datos integrado** (sin descarga de internet)
3. Actualiza la tabla con el nuevo locale

<Screenshot src="/screenshots/language-add-modal.png" alt="Modal para agregar idioma" caption="El modal de agregar idioma con un selector de locale con búsqueda." width="640px" :center="true"/>

::: tip <Badge type="tip" text="Nuevo en 2.0" /> Sin descargas requeridas
`lingua:add` ya no obtiene archivos de GitHub ni de `laravel-lang`. Los locales se
inicializan instantáneamente desde el conjunto de datos incluido en el paquete
(26 locales × 7 grupos, 5902 cadenas, alineados con Laravel v13.14.0). Consulta
[Sincronización Bidireccional](/es/features/sync#el-conjunto-de-datos-integrado).
:::

### Desde la línea de comandos

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

### Programáticamente

```php
use Rivalex\Lingua\Facades\Lingua;

// Crear el registro Language e inicializar su almacenamiento para el locale
Lingua::addLanguage('fr');
```

::: tip
Usa `Lingua::notInstalled()` para obtener los locales disponibles pero aún no instalados:

```php
$available = Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```
:::

## Eliminar un idioma

Haz clic en el icono de papelera de cualquier fila de idioma que no sea el predeterminado.
Un paso de confirmación previene eliminaciones accidentales.

Eliminar un idioma borra el registro `Language` **y cada valor de traducción para ese
locale**, luego reordena los valores de orden de los idiomas restantes.

::: warning
**El idioma predeterminado no puede eliminarse**. Establece otro idioma como
predeterminado primero.
:::

```bash
# Desde la línea de comandos
php artisan lingua:remove fr
```

```php
// Programáticamente
Lingua::removeLanguage('fr');
```

## Establecer el idioma predeterminado

Haz clic en el icono de estrella (⭐) de cualquier fila de idioma. Solo un idioma puede
ser el predeterminado a la vez, y el cambio está envuelto en una transacción de base de
datos para que nunca haya un instante sin predeterminado.

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::setDefaultLocale('fr');
```

::: warning El idioma predeterminado define el conjunto de claves de referencia
El locale predeterminado define el conjunto canónico de claves. La cobertura de todos
los demás locales se mide contra él, por lo que el predeterminado siempre muestra el
100%. Asegúrate de que esté razonablemente completo antes de cambiar.
:::

## Reordenar idiomas

Arrastra y suelta las filas de idioma para controlar su orden de presentación en todos
los lugares donde aparecen — el widget selector de idioma, el selector de locale de
traducciones y cualquier lugar donde llames a `Lingua::languages()`.

El orden de clasificación se almacena en la columna entera `sort` y se reasigna
secuencialmente después de cada arrastre.

## Estadísticas de completitud

Cada fila de idioma muestra:

| Métrica | Descripción |
|---|---|
| **Total de cadenas** | El número de claves en el conjunto de claves de referencia |
| **Traducidas** | Número de cadenas con un valor para este locale |
| **Completitud %** | `traducidas / total * 100`, redondeado a 2 decimales |

Las estadísticas se calculan a través del [driver de almacenamiento](/es/guide/storage)
activo, por lo que son correctas tanto en el modo `database` como en el modo `file`.

```php
use Rivalex\Lingua\Facades\Lingua;

$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// Todos los idiomas con estadísticas en una sola pasada
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

## Controles de sincronización

La fila inferior de la barra de herramientas tiene tres botones de sincronización:

| Botón | Comando | Acción |
|---|---|---|
| **Sincronizar desde archivos** | `lingua:sync-to-database` | Importa todos los archivos `lang/` locales (núcleo + vendor) en `language_lines` |
| **Sincronizar a archivos** | `lingua:sync-to-local` | Escribe todas las traducciones de la BD de vuelta a archivos PHP y JSON en `lang/` |
| **Actualizar** | `lingua:update-lang` | Re-inicializa los locales instalados desde el conjunto de datos integrado y `lang/` local |

Consulta [Sincronización Bidireccional](/es/features/sync) para la mecánica completa,
incluyendo la invalidación de caché quirúrgica por `(locale, grupo)` que se ejecuta
después de cada operación.

::: tip Consciencia del driver
En el modo de almacenamiento `file`, el botón **Sincronizar a archivos** está bloqueado
— el modo archivo ya escribe en disco, por lo que solo se ejecuta con el flag `--force`
desde la CLI. Consulta [Drivers de almacenamiento](/es/guide/storage).
:::
