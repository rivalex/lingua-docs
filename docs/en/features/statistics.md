# Translation Statistics

The Statistics page (`/lingua/statistics`) gives you a real-time overview of translation coverage across all installed languages. It shares the [navigation menu](/en/features/settings#navigation-menu) with the other Lingua pages.

```blade
<a href="{{ route('lingua.statistics') }}">Translation Statistics</a>
```

<Screenshot src="/screenshots/statistics-page.png" alt="Translation Statistics page" caption="Coverage per language, group breakdown, and missing keys." />

## Overview

Three summary counters sit at the top:

- **Total keys** — total number of translation strings
- **Total groups** — number of distinct translation groups
- **Installed languages** — number of languages registered in the system

Toggle **Include vendor translations** to include or exclude package-owned strings from every figure on the page.

## Coverage by language

<Screenshot src="/screenshots/statistics-coverage.png" alt="Coverage by language section" caption="Each language row shows a progress bar, percentage, and missing-key count." />

For each installed language:

| Column | Description |
|---|---|
| Language | Name and flag |
| Coverage | Progress bar with completion percentage |
| Translated | Number of keys with a value for this locale |
| Missing | Keys without a value — click to expand the missing-keys panel |

The **default language** is badged. Because it drives the reference key set, it always shows 100% coverage.

## Missing keys drill-down

Click the **missing count** on any language row to expand the missing-keys panel inline.

<Screenshot src="/screenshots/statistics-missing.png" alt="Missing keys panel expanded" caption="Group, key, and a direct link to the translation editor." />

Each panel row shows:

- **Group** — e.g. `validation`, `auth`
- **Key** — e.g. `required`, `failed`
- **Translate →** — opens the Translations page pre-filtered to that locale

Click the row again to collapse the panel.

## Breakdown by group

<Screenshot src="/screenshots/statistics-breakdown.png" alt="Breakdown by group table" caption="Translated key counts per locale, for every group." />

The breakdown table lists every group with the number of translated keys per installed language — useful for spotting which groups are complete and which need attention.

## Vendor translations toggle

By default, vendor translations (from packages like `laravel/framework`) are excluded. Enable **Include vendor translations** to count them.

::: info
Vendor translations are usually maintained upstream by the package author. Including them may lower your apparent coverage if you have not added locale-specific overrides.
:::

::: tip Working efficiently
Sort by missing count to prioritise effort — the locales with the most gaps need attention first.
:::
