<figure style="margin: 30px auto 30px !important; max-width: 640px;">
  <img src="/logoLinguaHorizontal-light.svg" class="logo-light" alt="Language selector in sidebar mode">
  <img src="/logoLinguaHorizontal-dark.svg" class="logo-dark" alt="Language selector in sidebar mode">
</figure>



# What is Lingua?

Lingua is a **Laravel package** that replaces the default file-based translation system with a fully database-driven one, complete with a beautiful, reactive management UI built on [Livewire 4](https://livewire.laravel.com) and [Flux 2](https://fluxui.dev).

## The problem it solves

Standard Laravel translations live in PHP and JSON files inside `lang/`. This works well for small projects, but it creates friction as an application grows:

- **Updating a translation requires a deployment** — even for a simple typo fix.
- **Non-technical team members can't edit translations** — editors need Git and a code review.
- **Tracking translation completeness is manual** — you have to diff files to find gaps.
- **Supporting many locales clutters the codebase** — dozens of files scattered across directories.

Lingua stores every translation in the database, in a single JSON column per row, and provides a Livewire UI where any authorised user can manage languages and strings in real time.

## How it works at a glance

```
┌─────────────────────────────────────────────────────────┐
│                   Laravel Application                   │
│                                                         │
│  lang/en/messages.php  ──┐                              │
│  lang/fr/messages.php    │  lingua:sync-to-database     │
│  lang/en.json            ├─────────────────────────────►│
│  lang/vendor/…           │                              │
│                         ─┘   language_lines (DB)        │
│                              ┌──────────────────────┐   │
│  LinguaMiddleware  ◄──────── │ group │ key │ text   │   │
│  app()->setLocale()          │ auth  │ … │ {"en":…} │   │
│                              └──────────────────────┘   │
│  __('auth.failed')  ───────────────────────────────────►│
│  (DB takes precedence over files)                       │
└─────────────────────────────────────────────────────────┘
```

At runtime, Lingua registers a custom `LinguaManager` as the Laravel translation loader. It merges file-based and database translations — **database entries always take precedence** — so you can override any string without touching source files.

## Key concepts

| Concept | Description |
|---|---|
| **Language** | An installed locale with metadata (name, native name, direction, sort order, default flag) |
| **Translation** | A row in `language_lines` with a `group`, `key`, `type`, and a JSON `text` column holding all locale values |
| **Translation type** | `text`, `html`, or `markdown` — determines which editor is shown in the UI |
| **Vendor translation** | A translation that belongs to a third-party package; protected from accidental deletion |
| **Default locale** | The primary language; deleting a translation for the default locale removes the entire record |
| **Sync** | The process of importing local files → DB (`sync-to-database`) or exporting DB → files (`sync-to-local`) |

## Requirements

| Dependency | Version  |
|---|----------|
| PHP | **8.2+** |
| Laravel | **11 \| 12 \| 13** |
| Livewire | **4.0+** |
| Livewire Flux | **2.0+** |

## Next step

Head to the [Installation guide](/guide/installation) to set up Lingua in under five minutes.
