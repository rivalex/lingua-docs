# Import / Export <Badge type="tip" text="New in 2.0" />

The Transfer page (`/lingua/transfer`) moves translations in and out of Lingua in bulk. Export a spreadsheet for translators, get it back filled in, preview the changes, then commit — all without leaving the admin UI.

<Screenshot src="/screenshots/transfer-page.png" alt="Lingua transfer page" caption="The Transfer page — export and import panels side by side." />

## Supported formats

| Format | Availability | Notes |
|---|---|---|
| **CSV** | Built-in | Bilingual or multi-locale |
| **JSON** | Built-in | Bilingual, multi-locale, or json-native (flat `key: value`) |
| **XLSX** | Optional | Requires `openspout/openspout` |
| **ODS** | Optional | Requires `openspout/openspout` |

CSV and JSON work out of the box. To enable the spreadsheet formats, install OpenSpout:

```bash
composer require openspout/openspout
```

When OpenSpout is absent, Lingua detects it and the XLSX/ODS options are unavailable; CSV and JSON remain fully functional.

## Export

<Screenshot src="/screenshots/transfer-export.png" alt="Transfer export panel" caption="Choosing a format, scope, and locales before downloading." />

Pick a **format**, a **scope**, and the **locales** to include, then download the file via the `lingua.transfer.export` route (handled by `TransferExportController::download`).

### Export scopes

| Scope | Columns produced | Best for |
|---|---|---|
| `bilingual` | Source locale + one target locale | Sending a single language to a translator |
| `multi-locale` | Every installed locale as its own column | A full snapshot or bulk review |
| `json-native` | Flat `key: value` pairs | JSON-based locale files |

### Typical workflow

1. Export the scope and format you need.
2. Edit the file externally (spreadsheet app, translation tool, or by hand).
3. Re-import it and review the dry-run diff.
4. Commit.

## Import

Importing is a deliberate **two-step** process so nothing changes until you have seen exactly what will happen.

### Step 1 — Dry-run preview

`ImportDiffService` parses the uploaded file and produces a diff **without writing anything**. It reports four counts:

| Outcome | Meaning |
|---|---|
| **Create** | Key/locale value does not exist yet and will be added |
| **Update** | Existing value differs and will be overwritten |
| **Skip** | Value is identical, or the row is protected/unmatched |
| **Error** | Row could not be parsed or mapped |

<Screenshot src="/screenshots/transfer-import-diff.png" alt="Import dry-run diff" caption="The dry-run preview shows create / update / skip / error counts before committing." />

### Step 2 — Commit

`ImportCommitService` applies the diff:

- In **database** mode the commit runs inside a transaction — it is all-or-nothing.
- In **file** mode rows are written sequentially to the `lang/` files.

## Safeguards

### Vendor protection

Vendor-owned rows cannot be overwritten through import, mirroring the [delete protection](/en/features/vendor-translations#protection-mechanism) elsewhere in Lingua. Such rows are reported under **Skip**.

### Column-header matching

Bilingual imports match columns to locales intelligently. When the header does not match the locale code exactly (for example a `it_IT` locale against an `it - Italian` column), a single-column fallback resolves it: if exactly one non-meta, non-source column is present, it is used unconditionally. Two or more ambiguous candidates are left unmatched and reported rather than guessed.

### Formula-injection protection

Any cell whose value begins with `=`, `+`, `-`, `@`, a tab, or a carriage return is prefixed with a single quote (`'`) on export. This neutralizes [CSV/spreadsheet formula injection](/en/guide/security) so a malicious value cannot execute when the file is opened in Excel, Sheets, or LibreOffice.

## Driver and dependency notes

- Dry-run and commit work in **both** storage drivers.
- XLSX and ODS require `openspout/openspout`; without it, use CSV or JSON.
- See [Storage drivers](/en/guide/storage) for the database-vs-file tradeoffs.

## Components and routes

| Piece | Reference |
|---|---|
| Page component | `Transfer` Livewire component (`/lingua/transfer`) |
| Export component | `Export` Livewire component |
| Import component | `Import` Livewire component |
| Download route | `lingua.transfer.export` → `TransferExportController::download` |
| Services | `ExportService`, `ImportDiffService`, `ImportCommitService` |
