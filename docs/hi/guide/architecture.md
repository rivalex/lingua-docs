# Architecture

यह पेज Lingua की आंतरिक architecture का वर्णन करता है — request lifecycle से लेकर cache model और DB schema तक।

## Request Lifecycle

```
HTTP Request
    │
    ▼
ManagesLocale (Trait)
    ├── session से locale पढ़ता है
    ├── app()->setLocale() call करता है
    └── html lang/dir attributes set करता है
    │
    ▼
LinguaManager (Translation Loader)
    ├── Illuminate\Translation\FileLoader extend करता है
    ├── database driver: DB + files merge करता है (DB wins)
    └── file driver: सीधे lang/ files पढ़ता है
    │
    ▼
TranslationRepository (Contract)
    ├── DatabaseRepository — language_lines query करता है
    └── FileRepository — lang/ filesystem read/write करता है
    │
    ▼
Cache Layer
    ├── प्रति (locale, group) rememberForever
    └── write पर surgical forget
```

## Translation Loading

**Database driver** में, `LinguaManager::load()` दो sources को merge करता है:

```php
$fileTranslations = parent::load($locale, $group, $namespace);
$dbTranslations   = $this->repository->loadTranslations($locale, $group, $namespace);

return array_replace_recursive($fileTranslations, $dbTranslations);
```

DB entries हमेशा file entries को override करती हैं। Vendor namespaces (`*` prefix) DB में cached होती हैं।

**File driver** में, `LinguaManager` parent `FileLoader` को delegate करता है — कोई DB query नहीं।

## Middleware

`ManagesLocale` trait दो HTTP Middleware में inject होती है:

| Middleware | क्या करती है |
|---|---|
| `LocaleFromSession` | Request के शुरू में `app()->setLocale()` call करती है |
| `LocaleSwitchRedirect` | Locale-switch form submissions handle करती है, same-origin redirect करती है |

## Service Provider

`LinguaServiceProvider` bootstrap करता है:

1. `register()` में `extend('translator', ...)` — deferred provider safe binding
2. `boot()` में Livewire components, routes, views, config, migrations register होते हैं
3. `TranslationRepository` contract bind होता है (driver के अनुसार `DatabaseRepository` या `FileRepository`)

## Database Schema

**`languages` टेबल** — installed locales:

| Column | Type | विवरण |
|---|---|---|
| `id` | bigint | Primary key |
| `name` | varchar | "English", "French", आदि |
| `native` | varchar | "English", "Français", आदि |
| `locale` | varchar | "en", "fr", आदि |
| `direction` | varchar | "ltr" या "rtl" |
| `sort_order` | int | Display order |
| `is_default` | boolean | डिफ़ॉल्ट locale flag |

**`language_lines` टेबल** — translations (केवल database driver):

| Column | Type | विवरण |
|---|---|---|
| `id` | bigint | Primary key |
| `group` | varchar | "auth", "validation", vendor namespace |
| `key` | varchar | Translation key |
| `type` | varchar | "text", "html", "markdown" |
| `text` | json | `{"en": "...", "fr": "..."}` |

**`lingua_settings` टेबल** — UI-configurable settings:

| Column | Type | विवरण |
|---|---|---|
| `key` | varchar | Setting key (unique) |
| `value` | text | Setting value |

## बंडल Translation Dataset

Lingua एक बंडल dataset शिप करता है (कोई GitHub download नहीं):

- **26 locales**: ar, cs, da, de, el, en, es, fa, fi, fr, he, hi, hu, id, it, ja, ko, nl, no, pl, pt, ru, sv, tr, uk, zh
- **7 groups**: auth, pagination, passwords, validation, notifications, settings, transfer
- **5902 strings** — Laravel v13.14.0 के अनुरूप
- **Meta**: `.meta.json` में version `v13.14.0`, checksum, string count

`lingua:add {locale}` इस dataset से seed करता है।

## Cache Architecture {#cache-architecture}

Lingua translations को **सर्जिकल रूप से** प्रति `(locale, group)` pair कैश करता है:

```php
// Cache key format:
"{prefix}.{locale}.{group}"
// उदाहरण: "lingua.trans.fr.auth"
```

**Write पर:** केवल modified `(locale, group)` pair की cache bust होती है।

**Read पर:** `rememberForever` — explicit flush तक cache में रहता है।

Cache एक optimisation है, database source of truth है: यदि cache store उपलब्ध नहीं है (उदाहरण के लिए Redis timeout), तो reads और miss के बाद का write-back database पर fallback करते हैं। Exception report होता है, और एक request-scoped circuit breaker बाकी request के लिए store को छोड़ देता है। Invalidation (`forget`) **guarded** नहीं है: विफल forget सामने आता है, ताकि store recovery के बाद कोई stale entry बची न रहे।

यह global `cache:clear` की आवश्यकता को समाप्त करता है। हर translation edit surgical है।

## Models

**`Language` Model** (`Rivalex\Lingua\Models\Language`):

- `$fillable`: `name`, `native`, `locale`, `direction`, `sort_order`, `is_default`
- Accessors: `getTotalStringsAttribute()`, `getTranslatedStringsAttribute()` — `TranslationRepository` के माध्यम से route होते हैं
- Scopes: `default()`, `ordered()`

**`Translation` Model** (`Rivalex\Lingua\Models\Translation`):

- `$casts`: `text` → `array` (JSON)
- Observers: write पर cache invalidation trigger करते हैं
- Scopes: `forGroup()`, `withLocale()`, `vendorOnly()`, `nonVendor()`
