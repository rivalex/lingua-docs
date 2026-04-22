# Estadísticas de traducción

La página de Estadísticas te ofrece una visión general en tiempo real de la cobertura de tus traducciones en todos los idiomas instalados.

```blade
<a href="{{ route('lingua.statistics') }}">Estadísticas de traducción</a>
```

<Screenshot src="/screenshots/statistics-page.png" alt="Página de Estadísticas de traducción" caption="La página de estadísticas muestra la cobertura por idioma, el desglose por grupo y las claves faltantes." />

## Resumen

La página muestra tres contadores de resumen en la parte superior:

- **Claves totales** — número total de cadenas de traducción en la base de datos
- **Grupos totales** — número de grupos de traducción distintos
- **Idiomas instalados** — número de idiomas registrados en el sistema

Puedes activar **Incluir traducciones de proveedor** para incluir o excluir las traducciones de paquetes de todas las estadísticas.

## Cobertura por idioma

<Screenshot src="/screenshots/statistics-coverage.png" alt="Sección de cobertura por idioma" caption="Cada fila de idioma muestra una barra de progreso, porcentaje y recuento de claves faltantes." />

Para cada idioma instalado puedes ver:

| Columna | Descripción |
|---|---|
| Idioma | Nombre y bandera del idioma |
| Cobertura | Barra de progreso con porcentaje de completado |
| Traducidas | Número de claves que tienen un valor para esta locale |
| Faltantes | Número de claves sin valor — haz clic para expandir el panel de claves faltantes |

El **idioma predeterminado** está resaltado con un badge. Como la locale predeterminada impulsa el conjunto de claves de referencia, siempre muestra el 100% de cobertura.

## Detalle de claves faltantes

Haz clic en el **badge del recuento faltante** en cualquier fila de idioma para expandir el panel de claves faltantes en línea.

<Screenshot src="/screenshots/statistics-missing.png" alt="Panel de claves faltantes expandido" caption="El panel de claves faltantes muestra el grupo, la clave y un enlace directo al editor de traducciones." />

Cada fila en el panel muestra:

- **Grupo** — el grupo de traducción (p. ej. `validation`, `auth`)
- **Clave** — la clave de traducción (p. ej. `required`, `failed`)
- **Traducir →** enlace — abre la página de Traducciones pre-filtrada para esa locale

Haz clic de nuevo en la misma fila de idioma para colapsar el panel.

## Desglose por grupo

<Screenshot src="/screenshots/statistics-breakdown.png" alt="Tabla de desglose por grupo" caption="La tabla de desglose muestra el recuento de claves traducidas por locale para cada grupo." />

La tabla de desglose lista cada grupo de traducción con el número de claves traducidas por idioma instalado. Úsala para identificar qué grupos están completamente traducidos y cuáles necesitan atención.

## Toggle de traducciones de proveedor

Por defecto, las traducciones de proveedor (de paquetes como `laravel/framework`) están excluidas de las estadísticas. Activa **Incluir traducciones de proveedor** para incluirlas.

::: info
Las traducciones de proveedor a menudo son mantenidas por el autor del paquete. Incluirlas en tus estadísticas puede reducir tu cobertura aparente si no has añadido sobrescrituras específicas por locale.
:::

::: tip Trabajar eficientemente
Ordena por el recuento faltante para priorizar tu esfuerzo de traducción. Los idiomas con más claves faltantes en la parte superior de tu lista necesitan más atención.
:::
