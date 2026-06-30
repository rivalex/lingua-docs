# Translation Management

The Translations page (`/lingua/translations/{locale?}`) lets you browse, filter, and edit every translation string. It shares the [navigation menu](/en/features/settings#navigation-menu) with the other Lingua pages.

<Screenshot src="/screenshots/translations-page.png" alt="Lingua translations page" caption="Translations page — with locale switcher, filter bar, and inline editor." />

## Navigating translations

### Locale switcher

The locale tabs at the top let you switch between installed languages. The URL updates to `/lingua/translations/{locale}` so every view is bookmarkable and shareable.

The **default locale** column is always shown on the left as a reference — you edit the selected locale on the right.

::: tip <Badge type="tip" text="Changed" /> Switching keeps your place
Changing the locale now reloads the **current page** rather than redirecting home. The same applies to the [language selector](/en/features/language-selector#how-locale-switching-works) widget across your whole app.
:::

### Filtering

The filter bar is a single flex row that wraps responsively:

| Filter | Description |
|---|---|
| **Search** | Searches across group name, key, and all locale values |
| **Group** | Filters to a specific group (e.g. `auth`, `validation`, `single`) |
| **Type** | Filters by `text`, `html`, or `markdown` |
| **Show only missing** | Shows only strings with no value in the selected locale |
| **Include vendor** | Toggles whether vendor-owned rows appear in the list |

<Screenshot src="/screenshots/translations-filters.png" alt="Translation filters" caption="Filtering to show only missing French translations in the validation group." />

### Pagination

Results are paginated with a configurable per-page count (25 / 50 / 100). The current page and per-page setting are persisted in the URL query string.

## Editing translations

### Inline editing

Click directly into a translation cell to start editing. Changes are saved on blur (when you click away or press Tab).

- **Plain text** translations use a simple `<textarea>`
- **HTML** translations open the [TipTap rich-text editor](/en/features/rich-text)
- **Markdown** translations open the TipTap Markdown editor

<Screenshot src="/screenshots/translation-editor-html.png" alt="HTML translation editor" caption="The TipTap HTML editor for rich-text translations." width="512px" :center="true"/>

### Sync from default

Each row has a **Sync from default** button (↺). Clicking it copies the default locale's value into the current locale — a useful starting point when you only need minor wording changes.

### Edit modal

For long strings, HTML, or Markdown content, click the pencil icon to open the Edit modal. On the default locale you can also change the translation **type** (text / html / markdown) here. Changing the type swaps the editor immediately — the stored value is left untouched.

## Creating translations

Click **New Translation** and fill in:

- **Group** — the file-name equivalent (e.g. `marketing`, `emails`)
- **Key** — the key within the group (e.g. `hero_title`)
- **Type** — `text`, `html`, or `markdown`
- **Value** — the translation for the default locale

```
group: marketing
key:   hero_title
type:  text
value: Build faster, together.
```

The new key is immediately available via `__('marketing.hero_title')`.

::: tip After saving
The **Group** field is preserved after creation so you can add several keys to the same group without reselecting it. Only **Key** and **Value** are reset. Leading, trailing, and excess internal spaces in Group and Key are normalized automatically before saving.
:::

::: warning Vendor groups
You cannot create new keys directly inside a vendor-owned group. Those groups are managed by Laravel or other packages. To change a vendor string, **edit** it in place — see [Vendor translations](/en/features/vendor-translations).
:::

## Deleting translations

### Delete for a specific locale

On a non-default locale, the delete button removes only that locale's value. The key continues to exist and falls back to the default locale.

### Delete entirely

On the default locale view, the delete button removes the whole row. Use this to clean up keys no longer referenced in your codebase.

::: danger Vendor translation protection
Vendor rows **cannot be deleted** in either storage driver. An attempt throws `VendorTranslationProtectedException` at the repository level; in the UI it surfaces as a warning and dispatches a `vendor_translation_protected` event without deleting anything. You can still **edit** vendor values. See [Vendor translations](/en/features/vendor-translations#protection-mechanism).
:::

## Copy key to clipboard

Every row has a clipboard icon that copies the full `group.key` reference (e.g. `auth.failed`) — handy when referencing keys in Blade or PHP.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Tab` | Save current field and move to next |
| `Shift + Tab` | Save current field and move to previous |
| `Escape` | Discard changes and close the editor |
