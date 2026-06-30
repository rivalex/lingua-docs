# Importación y Exportación (Transfer)

<Badge type="tip" text="Nuevo en 2.0" /> La página de Transfer (`/lingua/transfer`) permite
exportar tus traducciones a archivos y volver a importarlas — ideal para flujos de trabajo
de traducción externa, copias de seguridad o migraciones entre entornos. Comparte el
[menú de navegación](/es/features/settings#menu-de-navegacion) con las demás páginas de Lingua.

<Screenshot src="/screenshots/transfer-page.png" alt="Página de Transfer de Lingua" caption="Página de Transfer — pestañas de Exportar e Importar con controles de formato y alcance." />

## Formatos admitidos

| Formato | Extensión | Integrado | Requiere |
|---|:---:|:---:|---|
| CSV | `.csv` | ✅ | — |
| JSON | `.json` | ✅ | — |
| Excel (XLSX) | `.xlsx` | ❌ | `openspout/openspout` |
| OpenDocument (ODS) | `.ods` | ❌ | `openspout/openspout` |

Para activar XLSX y ODS:

```bash
composer require openspout/openspout
```

Lingua detecta `openspout` en tiempo de ejecución; si no está instalado, los botones
XLSX/ODS estarán deshabilitados en la UI.

## Exportar

### Modos de exportación

| Modo | Descripción |
|---|---|
| **Bilingüe** | Un archivo por par de locales: clave · locale predeterminado · locale destino |
| **Multi-locale** | Un único archivo con todos los locales instalados como columnas |

### Controles

- **Formato** — CSV, JSON, XLSX o ODS
- **Modo** — Bilingüe o Multi-locale
- **Alcance** — Todos los grupos, o un solo grupo
- **Incluir vendor** — Si se incluyen filas con `is_vendor = true`
- **Solo faltantes** — Exportar solo las cadenas sin traducir en el locale destino

El nombre del archivo descargado incluye el locale y la fecha, sanitizados para
evitar inyección de `Content-Disposition`.

### Exportación de JSON nativo

Cuando exportas en formato JSON, las traducciones de tipo `text` se escriben como
cadenas JSON. Las traducciones de tipo `html`/`markdown` incluyen metadatos de tipo
en un campo `_type` de la columna para que la reimportación pueda restaurar el tipo
correcto.

### Vía URL (descarga directa)

```http
GET /lingua/transfer/export?format=csv&mode=bilingual&locale=fr
GET /lingua/transfer/export?format=xlsx&mode=multi&include_vendor=1
```

Autenticado mediante el mismo middleware que el resto de las rutas de Lingua.

## Importar

### Importación en dos pasos

La importación es **siempre no destructiva** hasta que confirmas explícitamente.

**Paso 1 — Diff en seco:** Carga el archivo y Lingua muestra un diff de vista previa:

| Columna | Significado |
|---|---|
| `new` | Clave no existe en la BD — se insertará |
| `changed` | Valor nuevo difiere del existente — se actualizará |
| `unchanged` | Sin cambio — se omitirá |
| `skipped` | Fila rechazada (vendor protegido, locale no instalado, clave comodín, etc.) |

**Paso 2 — Aplicar:** Haz clic en **Confirm Import** para aplicar los cambios en una
transacción atómica. Si cualquier fila falla, toda la importación se revierte.

### Resolución de locale

Para archivos bilingüales con exactamente una columna de locale no-meta, si la cabecera
de la columna no coincide exactamente con el código de locale instalado, Lingua usa esa
única columna como el locale destino (caso de respaldo de candidato único). Los archivos
multi-locale con dos o más columnas candidatas no resueltas se rechazan con un error de
ambigüedad.

### Reglas de importación

- **Protección de vendor:** Las filas que intenten crear o eliminar entradas de vendor son
  **rechazadas silenciosamente** con una entrada de tipo `skipped`. Los valores de vendor
  existentes pueden actualizarse.
- **Locale no instalado:** Las filas dirigidas a un locale no instalado se rechazan (422).
- **Claves comodín:** Las claves `*` o que contengan `\0` son rechazadas.
- **Prioridad de tipo:** El tipo viene del archivo si está presente; de lo contrario, se
  conserva el tipo de la fila existente; de lo contrario, se usa `text`.
- **Inyección de fórmulas:** Las celdas que comiencen con `=`, `+`, `-`, `@`, tab o CR
  son prefijadas con `'` en la exportación; la importación los trata como cadenas literales.

### Mensajes de error

Los errores de importación se logean con `Log::error` internamente. La UI muestra solo
un mensaje localizado genérico para no filtrar rutas de archivo internas u otros detalles
(`F8` del paso de refuerzo de seguridad).

## API programática

```php
use Rivalex\Lingua\Transfer\ExportService;
use Rivalex\Lingua\Transfer\ImportCommitService;
use Rivalex\Lingua\Transfer\ImportDiffService;
use Rivalex\Lingua\Transfer\TransferSchema;

// Exportar
$csv = app(ExportService::class)->export(
    format: 'csv',
    mode: 'bilingual',
    locale: 'fr',
    includeVendor: false,
);

// Diff en seco
$diff = app(ImportDiffService::class)->diff($uploadedFile, 'fr');
// $diff->new / $diff->changed / $diff->unchanged / $diff->skipped

// Aplicar
app(ImportCommitService::class)->commit($diff);
```
