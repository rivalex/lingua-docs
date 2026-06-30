---
layout: home

hero:
  name: "LINGUA"
  text: "Database-driven translations for Laravel"
  tagline: Zero external dependencies. Two storage drivers. Full import/export. Security-hardened. Built for PHP 8.3+ and Laravel 11–13.
  image:
    light: /logoLinguaVertical-light.svg
    dark: /logoLinguaVertical-dark.svg
    alt: Lingua UI
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/rivalex/lingua

features:
  - icon: 🔒
    title: Zero dependencies
    details: Lingua ships its own translation loader, locale registry, and bundled dataset. No Spatie, no laravel-lang — nothing to keep in sync.

  - icon: 🗄️
    title: Two storage drivers
    details: Run translations from the database (live UI editing, zero deploys) or from files (version-controlled, CI-friendly). Switch with one command.

  - icon: 📤
    title: Import / Export
    details: "Move translations between formats: CSV, JSON, XLSX, ODS. Bilingual, multi-locale, or json-native. Dry-run preview before committing."

  - icon: 🛡️
    title: Security-hardened
    details: "F1–F9 hardening: XSS sanitizer, path traversal guard, SQL injection ban, vendor protection, auth gate, exception non-disclosure, and more."

  - icon: ⚡
    title: Reactive UI
    details: Five Livewire pages — Languages, Translations, Statistics, Settings, and Transfer. Every action is live, so no deployment is needed to push a typo fix.

  - icon: 🌐
    title: 129+ locales bundled
    details: "Install any locale from the built-in registry. No internet download. Bundled: 26 locales, 5902 strings, aligned to Laravel 13.14."

  - icon: ↔️
    title: RTL / LTR ready
    details: Arabic, Hebrew, Persian and other RTL scripts are fully supported. Direction metadata is stored and exposed for every language.

  - icon: 📊
    title: Translation coverage
    details: Per-language completion stats — total strings, translated count, and missing keys by group. Always know what needs translating.

  - icon: 🧪
    title: 783 tests
    details: PHP 8.3+ · Laravel 11–13 · Livewire 4.1+ · Flux 2.12+. The suite covers commands, components, drivers, import/export, and the full facade API.
---
