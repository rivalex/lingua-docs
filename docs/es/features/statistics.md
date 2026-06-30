# Estadísticas

La página de Estadísticas (`/lingua/statistics`) proporciona una visión general del
estado de completitud de las traducciones en todos los idiomas instalados. Comparte el
[menú de navegación](/es/features/settings#menu-de-navegacion) con las demás páginas de Lingua.

<Screenshot src="/screenshots/statistics-page.png" alt="Página de estadísticas de Lingua" caption="Página de estadísticas con indicadores KPI de completitud por locale." />

## Qué muestra

Para cada idioma instalado:

| Métrica | Descripción |
|---|---|
| **Total de cadenas** | Número de claves en el conjunto de referencia (locale predeterminado) |
| **Traducidas** | Cadenas con valor no vacío para este locale |
| **Faltantes** | `total - traducidas` |
| **Completitud %** | `traducidas / total × 100`, redondeado a 2 decimales |

El locale predeterminado siempre muestra 100% porque es el conjunto de referencia.

## Compatibilidad con drivers

Las estadísticas se calculan a través del
[driver de almacenamiento](/es/guide/storage) activo:

- **Driver `database`** — agrega desde `language_lines` via Eloquent; toda la
  agregación se realiza en PHP (sin funciones SQL JSON) para compatibilidad multi-BD
- **Driver `file`** — recorre los archivos `lang/` y cuenta las claves con valores presentes

Ambos devuelven las mismas métricas normalizadas.

## Acceso programático

```php
use Rivalex\Lingua\Facades\Lingua;

// Estadísticas para un locale específico
$stats = Lingua::getLocaleStats('de');
// [
//   'total'      => 1240,
//   'translated' => 1100,
//   'missing'    => 140,
//   'percentage' => 88.71,
// ]

// Todos los idiomas con estadísticas en una sola llamada
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->translated_strings}/{$lang->total_strings} ({$lang->completion_percentage}%)";
}
```

Cada modelo Language obtiene estos atributos de solo lectura:

| Atributo | Tipo | Descripción |
|---|---|---|
| `total_strings` | `int` | Total de filas de traducción |
| `translated_strings` | `int` | Filas con valor para este idioma |
| `missing_strings` | `int` | `total - traducidas` |
| `completion_percentage` | `float` | `traducidas / total * 100` |

## Componentes de interfaz

```blade
<x-lingua::stat
    :label="$lang->name"
    :value="$lang->completion_percentage . '%'"
    :secondary="$lang->translated_strings . '/' . $lang->total_strings"
/>
```

Consulta [Componentes Blade](/es/api/blade-components) para referencia completa.
