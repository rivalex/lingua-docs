# Gestión de Traducciones

La página de Traducciones (`/lingua/translations/{locale?}`) te permite explorar,
filtrar y editar cada cadena de traducción. Comparte el
[menú de navegación](/es/features/settings#menu-de-navegacion) con las demás páginas de Lingua.

<Screenshot src="/screenshots/translations-page.png" alt="Página de traducciones de Lingua" caption="Página de traducciones — con selector de locale, barra de filtros y editor en línea." />

## Navegar por las traducciones

### Selector de locale

Las pestañas de locale en la parte superior te permiten cambiar entre los idiomas
instalados. La URL se actualiza a `/lingua/translations/{locale}` para que cada vista
sea marcable y compartible.

La columna del **locale predeterminado** siempre se muestra a la izquierda como
referencia — editas el locale seleccionado a la derecha.

::: tip <Badge type="tip" text="Cambiado" /> El cambio mantiene tu posición
Cambiar el locale ahora recarga la **página actual** en lugar de redirigir al inicio.
Lo mismo aplica al widget [selector de idioma](/es/features/language-selector#como-funciona-el-cambio-de-locale)
en toda tu aplicación.
:::

### Filtrado

La barra de filtros es una única fila flex que se reorganiza responsivamente:

| Filtro | Descripción |
|---|---|
| **Buscar** | Busca por nombre de grupo, clave y todos los valores de locale |
| **Grupo** | Filtra a un grupo específico (por ejemplo, `auth`, `validation`, `single`) |
| **Tipo** | Filtra por `text`, `html` o `markdown` |
| **Mostrar solo faltantes** | Muestra solo las cadenas sin valor en el locale seleccionado |
| **Incluir vendor** | Activa o desactiva si aparecen las filas de vendor en la lista |

<Screenshot src="/screenshots/translations-filters.png" alt="Filtros de traducción" caption="Filtrado para mostrar solo las traducciones en francés que faltan en el grupo de validación." />

### Paginación

Los resultados se paginan con un número de elementos por página configurable
(25 / 50 / 100). La página actual y la configuración por página se persisten en la
cadena de consulta de la URL.

## Editar traducciones

### Edición en línea

Haz clic directamente en una celda de traducción para empezar a editar. Los cambios
se guardan al perder el foco (cuando haces clic fuera o presionas Tab).

- Las traducciones de **texto plano** usan un simple `<textarea>`
- Las traducciones **HTML** abren el [editor de texto enriquecido TipTap](/es/features/rich-text)
- Las traducciones **Markdown** abren el editor Markdown de TipTap

<Screenshot src="/screenshots/translation-editor-html.png" alt="Editor de traducción HTML" caption="El editor HTML TipTap para traducciones de texto enriquecido." width="512px" :center="true"/>

### Sincronizar desde predeterminado

Cada fila tiene un botón **Sync from default** (↺). Al hacer clic, copia el valor
del locale predeterminado al locale actual — un punto de partida útil cuando solo
necesitas pequeños cambios de redacción.

### Modal de edición

Para cadenas largas, contenido HTML o Markdown, haz clic en el icono de lápiz para
abrir el modal de Edición. En el locale predeterminado también puedes cambiar el **tipo**
de traducción (text / html / markdown) aquí. Cambiar el tipo intercambia el editor
inmediatamente — el valor almacenado no se toca.

## Crear traducciones

Haz clic en **New Translation** y completa:

- **Group** — el equivalente al nombre del archivo (por ejemplo, `marketing`, `emails`)
- **Key** — la clave dentro del grupo (por ejemplo, `hero_title`)
- **Type** — `text`, `html` o `markdown`
- **Value** — la traducción para el locale predeterminado

```
group: marketing
key:   hero_title
type:  text
value: Build faster, together.
```

La nueva clave está disponible inmediatamente mediante `__('marketing.hero_title')`.

::: tip Después de guardar
El campo **Group** se conserva tras la creación para que puedas añadir varias claves
al mismo grupo sin volver a seleccionarlo. Solo los campos **Key** y **Value** se
restablecen. Los espacios iniciales, finales y redundantes internos en Group y Key
se normalizan automáticamente antes de guardar.
:::

::: warning Grupos de vendor
No puedes crear nuevas claves directamente dentro de un grupo de vendor. Esos grupos
son gestionados por Laravel u otros paquetes. Para cambiar una cadena de vendor,
**edítala** en su lugar — consulta [Traducciones de vendor](/es/features/vendor-translations).
:::

## Eliminar traducciones

### Eliminar para un locale específico

En un locale que no sea el predeterminado, el botón de eliminar solo elimina el valor
de ese locale. La clave sigue existiendo y recurre al locale predeterminado.

### Eliminar completamente

En la vista del locale predeterminado, el botón de eliminar elimina toda la fila. Úsalo
para limpiar claves que ya no están referenciadas en tu código.

::: danger Protección de traducciones de vendor
Las filas de vendor **no pueden eliminarse** en ninguno de los dos drivers de
almacenamiento. Un intento lanza `VendorTranslationProtectedException` a nivel del
repositorio; en la UI aparece como una advertencia y despacha un evento
`vendor_translation_protected` sin eliminar nada. Aún puedes **editar** los valores
de vendor. Consulta
[Traducciones de vendor](/es/features/vendor-translations#mecanismo-de-proteccion).
:::

## Copiar clave al portapapeles

Cada fila tiene un icono de portapapeles que copia la referencia completa
`grupo.clave` (por ejemplo, `auth.failed`) — útil cuando haces referencia a
claves en Blade o PHP.

## Atajos de teclado

| Tecla | Acción |
|---|---|
| `Tab` | Guardar el campo actual y pasar al siguiente |
| `Shift + Tab` | Guardar el campo actual y pasar al anterior |
| `Escape` | Descartar cambios y cerrar el editor |
