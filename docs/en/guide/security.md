# Security

Lingua 2.0 underwent a comprehensive hardening pass and is **secure by
default**. This page documents the protections in place and the actions
you should take to keep your deployment safe.

::: tip Secure by default
The management UI ships behind `['web', 'auth']` middleware, assets are
served from a realpath jail, and translation input is sanitized. You opt
*in* to wider access, not out of it.
:::

## v2.0 hardening pass (F1–F9)

| ID | Name | What it protects against | How | File |
|---|---|---|---|---|
| F1 | Cache DoS guard | Unbounded cache growth from arbitrary locale strings | Locale regex validation before `rememberForever` | `src/Database/DatabaseRepository.php` |
| F2 | SQL injection ban | Injection via JSON SQL functions | JSON SQL functions removed; all aggregation done in PHP | `src/Database/DatabaseRepository.php` |
| F3 | Path traversal | Escaping the translations directory | `PathGuard::assertSafeSegment()` | `src/Support/PathGuard.php`, `src/Locales/BundledTranslationSource.php` |
| F4 | Locale pollution / filename injection | Writing to non-installed locales; malicious download filenames | 422 abort on non-installed target locale; sanitized `Content-Disposition` | `src/Livewire/Import.php`, `src/Http/Controllers/TransferExportController.php` |
| F5 | Vendor guard | Deleting protected vendor strings | `VendorTranslationProtectedException` thrown on `forgetTranslation()` for vendor rows | `src/Exceptions/VendorTranslationProtectedException.php`, both repositories |
| F6 | Wildcard key rejection | Mass-assignment via wildcard keys | Rejects `*` / `\0` in import identity | `src/Transfer/RowMapper.php` |
| F7 | ReDoS bound | Catastrophic backtracking on type detection | Tighter type regex (`\[[^\]]+\]`); skip regex for strings > 10000 chars | `src/Livewire/Translation/Row.php` |
| F8 | Exception non-disclosure | Leaking internals to the UI | Generic localized error to UI; detail to `Log::error` | `src/Livewire/Import.php` |
| F9 | Auth gate | Unauthorised access to admin routes | `can:{gate}` middleware appended when `LINGUA_GATE` set | `routes/web.php`, `config/lingua.php` |

## XSS protection

HTML translations are sanitized by `HtmlSanitizer`
(`src/Support/HtmlSanitizer.php`) before storage and rendering:

- DOM-based parsing with a **per-tag attribute whitelist**
- URI validation — only `http`, `https`, and `mailto` schemes are allowed
- Control-character stripping (defeats tricks like `java\tscript:`)

Stored XSS is scoped to the `html` type only; `text` translations are
always escaped.

## Authentication

The management routes default to `['web', 'auth']`. For role-based access,
set an authorization gate:

```ini
LINGUA_GATE=manage-translations
```

```php
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

Lingua appends `can:manage-translations` to its admin routes. You may also
edit the `middleware` array directly (see
[Configuration](/en/guide/configuration#security-access)).

## Open-redirect protection

When a user switches locale, Lingua reloads the **current** page. The
target is derived from `ManagesLocale::getRequestUri()` and validated
against a **local-path regex guard**, so an attacker cannot smuggle an
absolute URL into the redirect.

## Asset security

Lingua's compiled CSS/JS are served by the `lingua.assets` route, which
resolves the requested file through a **realpath jail** — requests
resolving outside the package asset directory are rejected. The asset
route lives **outside** the authenticated route group so styles load on
login screens.

## File-mode security

In the [`file` storage driver](/en/guide/storage), UI edits are written by
`AtomicFileWriter` (`src/Support/AtomicFileWriter.php`):

- Writes to a temp file then **atomically renames** it into place, so a
  concurrent request never reads a half-written file
- Calls `opcache_invalidate($path, true)` after the rename so the new
  bytecode is picked up within the same request

## Formula-injection guard

Exported and imported spreadsheet cells beginning with `=`, `+`, `-`,
`@`, tab, or carriage return are prefixed with a single quote (`'`) to
neutralise CSV/spreadsheet formula injection.

## Earlier fixes (v1.1.x)

The 1.1.x line shipped additional fixes that carry forward into 2.0:

- **3 CRITICAL** — asset-route path traversal (realpath jail), SQL
  injection via locale-in-JSON, authentication bypass (default `auth`
  middleware)
- **2 HIGH** — open-redirect on locale switch, stored XSS scoped to the
  `html` type
- **5 MEDIUM** — Artisan argument injection (switched to array form), null
  `Language` TypeError, `$perPage` clamp (≤ 100), and related input
  validation
- **4 LOW** — assorted hardening and disclosure fixes

## Security checklist

- [ ] Keep the default `['web', 'auth']` middleware (or stricter)
- [ ] Set `LINGUA_GATE` for role-based access in multi-user apps
- [ ] Use the `html` type only for trusted content; prefer `text`
      elsewhere
- [ ] In file mode, ensure deploys don't expose `lang/` write paths to
      untrusted users
- [ ] Keep Lingua updated to receive security fixes

## Reporting vulnerabilities

Please report security issues privately to
[security@rivalex.com](mailto:security@rivalex.com). Do not open public
GitHub issues for vulnerabilities.
