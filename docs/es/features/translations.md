# Gestión de Traducciones

La página de Traducciones (`/lingua/translations/{locale?}`) te permite explorar, filtrar y editar cada cadena de traducción.

<Screenshot src="/lingua-docs/screenshots/translations-page.png" alt="Página de traducciones de Lingua" caption="Página de traducciones — con selector de idioma, filtro de grupo y editor en línea." />

## Navegar por las traducciones

### Selector de idioma

Las pestañas de idioma en la parte superior de la página te permiten cambiar entre los idiomas instalados. La URL se actualiza a `/lingua/translations/{locale}` para que cada vista sea marcable y compartible.

La columna del **idioma predeterminado** siempre se muestra a la izquierda como referencia — editas el idioma seleccionado en la derecha.

### Filtrado

| Filtro | Descripción |
|---|---|
| **Buscar** | Busca por nombre de grupo, clave y todos los valores de idioma |
| **Grupo** | Filtra a un grupo específico (p. ej. `auth`, `validation`, `single`) |
| **Tipo** | Filtra por `text`, `html` o `markdown` |
| **Mostrar solo faltantes** | Muestra solo las cadenas sin valor en el idioma seleccionado |

<Screenshot src="/lingua-docs/screenshots/translations-filters.png" alt="Filtros de traducción" caption="Filtrado para mostrar solo las traducciones en francés que faltan en el grupo de validación." />

### Paginación

Los resultados se paginan con un número de elementos por página configurable (25 / 50 / 100). La página actual y la configuración por página se persisten en la cadena de consulta de la URL.

## Editar traducciones

### Edición en línea

Haz clic directamente en la celda de traducción para comenzar a editar. Los cambios se guardan al perder el foco (cuando haces clic fuera o presionas Tab).

- Las traducciones de **texto plano** usan un simple `<textarea>`
- Las traducciones **HTML** abren el editor de texto enriquecido TipTap
- Las traducciones **Markdown** abren el editor Markdown de TipTap

<Screenshot src="/lingua-docs/screenshots/translation-editor-html.png" alt="Editor de traducción HTML" caption="El editor HTML TipTap para traducciones de texto enriquecido." width="512px" :center="true"/>

### Sincronizar desde predeterminado

Cada fila de traducción tiene un botón **Sync from default** (↺). Al hacer clic, copia el valor del idioma predeterminado al idioma actual — útil como punto de partida cuando solo necesitas pequeños cambios de redacción.

### Modal de edición

Para el idioma predeterminado, haz clic en el icono de lápiz para abrir el modal de edición, donde puedes cambiar el tipo de traducción (text / html / markdown) así como el valor.

::: tip Cambiar tipos de traducción
Si cambias una traducción de `text` a `html`, el editor en línea de la fila cambiará inmediatamente a TipTap. El valor almacenado no cambia — solo cambia el editor.
:::

## Crear traducciones

Haz clic en **New Translation** para crear una entrada personalizada. Completa:

- **Group** — el equivalente al nombre del archivo (p. ej. `marketing`, `emails`)
- **Key** — la clave dentro del grupo (p. ej. `hero_title`)
- **Type** — `text`, `html` o `markdown`
- **Value** — la traducción para el idioma predeterminado

```
group: marketing
key:   hero_title
type:  text
value: Build faster, together.
```

La nueva clave está disponible inmediatamente mediante `__('marketing.hero_title')`.

::: warning Traducciones de proveedores
No puedes crear traducciones directamente en un grupo de proveedor (p. ej. `validation`, `auth`). Esos grupos son propiedad de Laravel u otros paquetes y se sincronizan automáticamente. Si quieres sobreescribir una cadena de proveedor, edítala directamente en la página de traducciones.
:::

## Eliminar traducciones

### Eliminar para un idioma específico

En cualquier idioma que no sea el predeterminado, el botón de eliminar solo elimina el valor de ese idioma de la columna JSON. La clave de traducción sigue existiendo; simplemente recurre al idioma predeterminado.

### Eliminar completamente

En la vista del idioma predeterminado, el botón de eliminar elimina toda la fila de `language_lines`. Úsalo para limpiar claves que ya no se usan en tu código.

::: danger Protección de traducciones de proveedores
Las traducciones de proveedores no se pueden eliminar. Intentarlo muestra una advertencia y despacha un evento `vendor_translation_protected`. Solo puedes **editar** los valores de las traducciones de proveedores.
:::

## Copiar clave al portapapeles

Cada fila tiene un icono de portapapeles que copia la referencia completa `grupo.clave` (p. ej. `auth.failed`) al portapapeles — útil cuando haces referencia a claves en Blade o PHP.

## Atajos de teclado

| Tecla | Acción |
|---|---|
| `Tab` | Guardar el campo actual y pasar al siguiente |
| `Shift + Tab` | Guardar el campo actual y pasar al anterior |
| `Escape` | Descartar cambios y cerrar el editor |
