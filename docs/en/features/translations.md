# Translation Management

The Translations page (`/lingua/translations/{locale?}`) lets you browse, filter, and edit every translation string.

<Screenshot src="/screenshots/translations-page.png" alt="Lingua translations page" caption="Translations page - with locale switcher, group filter, and inline editor." />

## Navigating translations

### Locale switcher

The locale tabs at the top of the page let you switch between installed languages. The URL updates to `/lingua/translations/{locale}` so every view is bookmarkable and shareable.

The **default locale** column is always shown on the left as a reference - you edit the selected locale on the right.

### Filtering

| Filter | Description |
|---|---|
| **Search** | Searches across group name, key, and all locale values |
| **Group** | Filters to a specific group (e.g. `auth`, `validation`, `single`) |
| **Type** | Filters by `text`, `html`, or `markdown` |
| **Show only missing** | Shows only strings with no value in the selected locale |

<Screenshot src="/screenshots/translations-filters.png" alt="Translation filters" caption="Filtering to show only missing French translations in the validation group." />

### Pagination

Results are paginated with a configurable per-page count (25 / 50 / 100). The current page and per-page setting are persisted in the URL query string.

## Editing translations

### Inline editing

Click directly into the translation cell to start editing. Changes are saved on blur (when you click away or press Tab).

- **Plain text** translations use a simple `<textarea>`
- **HTML** translations open the TipTap rich-text editor
- **Markdown** translations open the TipTap markdown editor

<Screenshot src="/screenshots/translation-editor-html.png" alt="HTML translation editor" caption="The TipTap HTML editor for rich-text translations." width="512px" :center="true"/>

### Sync from default

Each translation row has a **Sync from default** button (↺). Clicking it copies the default locale's value to the current locale - useful as a starting point when you only need minor wording changes.

### Edit modal

For the default locale, click the pencil icon to open the Edit modal, where you can change the translation type (text / html / markdown) as well as the value.

::: tip Changing translation types
If you change a translation from `text` to `html`, the inline editor on the row will immediately switch to TipTap. The stored value is unchanged - only the editor changes.
:::

## Creating translations

Click **New Translation** to create a custom entry. Fill in:

- **Group** - the file name equivalent (e.g. `marketing`, `emails`)
- **Key** - the key within the group (e.g. `hero_title`)
- **Type** - `text`, `html`, or `markdown`
- **Value** - the translation for the default locale

```
group: marketing
key:   hero_title
type:  text
value: Build faster, together.
```

The new key is immediately available via `__('marketing.hero_title')`.

::: tip After saving
The **Group** field is preserved after creation so you can add multiple keys to the same group without reselecting it. Only the **Key** and **Value** fields are reset. Leading, trailing, and excess internal spaces in Group and Key are normalized automatically before saving.
:::

::: warning Vendor translations
You cannot create translations directly in a vendor group (e.g. `validation`, `auth`). Those groups are owned by Laravel or other packages and are synced automatically. If you want to override a vendor string, edit it directly on the translations page.
:::

## Deleting translations

### Delete for a specific locale

On any non-default locale, the delete button removes only that locale's value from the JSON column. The translation key continues to exist; it just falls back to the default locale.

### Delete entirely

On the default locale view, the delete button removes the entire row from `language_lines`. Use this to clean up keys that are no longer used in your codebase.

::: danger Vendor translation protection
Vendor translations cannot be deleted. Attempting to do so shows a warning and dispatches a `vendor_translation_protected` event. You can only **edit** vendor translation values.
:::

## Copy key to clipboard

Every row has a clipboard icon that copies the full `group.key` reference (e.g. `auth.failed`) to your clipboard - handy when referencing keys in Blade or PHP.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Tab` | Save current field and move to next |
| `Shift + Tab` | Save current field and move to previous |
| `Escape` | Discard changes and close editor |
