# Translation Statistics

The Statistics page gives you a real-time overview of your translation coverage across all installed languages.

```blade
<a href="{{ route('lingua.statistics') }}">Translation Statistics</a>
```

<Screenshot src="/screenshots/statistics-page.png" alt="Translation Statistics page" caption="The statistics page showing coverage per language, group breakdown, and missing keys." />

## Overview

The page shows three summary counters at the top:

- **Total keys** — total number of translation strings in the database
- **Total groups** — number of distinct translation groups
- **Installed languages** — number of languages registered in the system

You can toggle **Include vendor translations** to include or exclude package translations from all statistics.

## Coverage by language

<Screenshot src="/screenshots/statistics-coverage.png" alt="Coverage by language section" caption="Each language row shows a progress bar, percentage, and missing key count." />

For each installed language you can see:

| Column | Description |
|---|---|
| Language | Name and flag of the language |
| Coverage | Progress bar with completion percentage |
| Translated | Number of keys that have a value for this locale |
| Missing | Number of keys without a value — click to expand the missing-keys panel |

The **default language** is highlighted with a badge. Since the default locale drives the reference key set, it always shows 100% coverage.

## Missing keys drill-down

Click the **missing count badge** on any language row to expand the missing-keys panel inline.

<Screenshot src="/screenshots/statistics-missing.png" alt="Missing keys panel expanded" caption="The missing-keys panel shows group, key, and a direct link to the translation editor." />

Each row in the panel shows:

- **Group** — the translation group (e.g. `validation`, `auth`)
- **Key** — the translation key (e.g. `required`, `failed`)
- **Translate →** link — opens the Translations page pre-filtered to that locale

Click the same language row again to collapse the panel.

## Breakdown by group

<Screenshot src="/screenshots/statistics-breakdown.png" alt="Breakdown by group table" caption="The breakdown table shows translated key counts per locale for every group." />

The breakdown table lists every translation group with the number of translated keys per installed language. Use it to identify which groups are fully translated and which need attention.

## Vendor translations toggle

By default, vendor translations (from packages like `laravel/framework`) are excluded from the statistics. Toggle **Include vendor translations** to include them.

::: info
Vendor translations are often maintained upstream by the package author. Including them in your statistics may lower your apparent coverage if you haven't added locale-specific overrides.
:::

::: tip Working efficiently
Sort by the missing count to prioritise your translation effort. Languages with the most missing keys at the top of your list need the most attention.
:::
