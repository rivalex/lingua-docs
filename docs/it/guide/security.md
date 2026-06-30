# Sicurezza

Lingua 2.0 ha subito un ciclo di hardening completo ed è **sicuro per
impostazione predefinita**. Questa pagina documenta le protezioni in atto e
le azioni da intraprendere per mantenere sicuro il tuo deployment.

::: tip Sicuro per impostazione predefinita
L'interfaccia di gestione è protetta dal middleware `['web', 'auth']`, gli
asset vengono serviti da una jail realpath e l'input delle traduzioni viene
sanificato. Opti *per* un accesso più ampio, non al contrario.
:::

## Ciclo di hardening v2.0 (F1–F9)

| ID | Nome | Cosa protegge | Come | File |
|---|---|---|---|---|
| F1 | Guardia DoS cache | Crescita illimitata della cache da stringhe di locale arbitrarie | Validazione regex della locale prima di `rememberForever` | `src/Database/DatabaseRepository.php` |
| F2 | Blocco SQL injection | Injection tramite funzioni SQL JSON | Funzioni SQL JSON rimosse; tutte le aggregazioni in PHP | `src/Database/DatabaseRepository.php` |
| F3 | Path traversal | Uscita dalla directory delle traduzioni | `PathGuard::assertSafeSegment()` | `src/Support/PathGuard.php`, `src/Locales/BundledTranslationSource.php` |
| F4 | Inquinamento locale / injection nome file | Scrittura su locale non installate; nomi file di download malevoli | Abort 422 su locale di destinazione non installata; `Content-Disposition` sanificato | `src/Livewire/Import.php`, `src/Http/Controllers/TransferExportController.php` |
| F5 | Protezione vendor | Eliminazione di stringhe vendor protette | `VendorTranslationProtectedException` lanciata su `forgetTranslation()` per righe vendor | `src/Exceptions/VendorTranslationProtectedException.php`, entrambi i repository |
| F6 | Rifiuto chiave wildcard | Mass-assignment tramite chiavi wildcard | Rifiuta `*` / `\0` nell'identità di import | `src/Transfer/RowMapper.php` |
| F7 | Limite ReDoS | Backtracking catastrofico nel rilevamento del tipo | Regex del tipo più rigorosa (`\[[^\]]+\]`); salta la regex per stringhe > 10000 caratteri | `src/Livewire/Translation/Row.php` |
| F8 | Non-disclosure eccezioni | Fuga di internals verso l'UI | Errore localizzato generico all'UI; dettaglio a `Log::error` | `src/Livewire/Import.php` |
| F9 | Auth gate | Accesso non autorizzato alle route admin | Middleware `can:{gate}` aggiunto quando `LINGUA_GATE` è impostato | `routes/web.php`, `config/lingua.php` |

## Protezione XSS

Le traduzioni HTML sono sanificate da `HtmlSanitizer`
(`src/Support/HtmlSanitizer.php`) prima dell'archiviazione e del rendering:

- Analisi basata su DOM con una **whitelist di attributi per tag**
- Validazione URI — sono consentiti solo gli schemi `http`, `https` e `mailto`
- Stripping dei caratteri di controllo (neutralizza trucchi come
  `java\tscript:`)

Lo XSS archiviato è limitato al solo tipo `html`; le traduzioni `text` sono
sempre escaped.

## Autenticazione

Le route di gestione hanno come default `['web', 'auth']`. Per l'accesso
basato sui ruoli, imposta un gate di autorizzazione:

```env
LINGUA_GATE=manage-translations
```

```php
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

Lingua aggiunge `can:manage-translations` alle sue route admin. Puoi anche
modificare direttamente l'array `middleware` (vedi
[Configurazione](/it/guide/configuration#sicurezza-e-accesso)).

## Protezione redirect aperto

Quando un utente cambia lingua, Lingua ricarica la pagina **corrente**. La
destinazione è derivata da `ManagesLocale::getRequestUri()` e validata contro
una **guardia regex per percorso locale**, così un attaccante non può inserire
un URL assoluto nel redirect.

## Sicurezza degli asset

I CSS/JS compilati di Lingua sono serviti dalla route `lingua.assets`, che
risolve il file richiesto attraverso una **jail realpath** — le richieste che
si risolvono fuori dalla directory degli asset del pacchetto vengono rifiutate.
La route degli asset si trova **fuori** dal gruppo di route autenticate così
gli stili si caricano nelle schermate di login.

## Sicurezza modalità file

Nel [driver di archiviazione `file`](/it/guide/storage), le modifiche UI
vengono scritte da `AtomicFileWriter` (`src/Support/AtomicFileWriter.php`):

- Scrive su un file temporaneo poi lo **rinomina atomicamente** al posto
  giusto, così una richiesta concorrente non legge mai un file scritto a metà
- Chiama `opcache_invalidate($path, true)` dopo la rinomina così il nuovo
  bytecode viene recuperato nella stessa richiesta

## Guardia formula-injection

Le celle di fogli di calcolo esportati e importati che iniziano con `=`,
`+`, `-`, `@`, tab o a capo vengono prefissate con un singolo apice (`'`)
per neutralizzare l'injection di formule CSV/foglio di calcolo.

## Fix precedenti (v1.1.x)

La linea 1.1.x ha incluso fix aggiuntivi che sono confluiti nella 2.0:

- **3 CRITICI** — path traversal nella route degli asset (jail realpath),
  SQL injection tramite locale-in-JSON, bypass dell'autenticazione
  (middleware `auth` predefinito)
- **2 ALTI** — redirect aperto al cambio lingua, XSS archiviato limitato al
  tipo `html`
- **5 MEDI** — injection argomenti Artisan (passaggio alla forma array),
  TypeError `Language` null, clamp di `$perPage` (≤ 100) e validazione
  dell'input correlata
- **4 BASSI** — vari fix di hardening e disclosure

## Checklist sicurezza

- [ ] Mantieni il middleware `['web', 'auth']` predefinito (o più restrittivo)
- [ ] Imposta `LINGUA_GATE` per l'accesso basato sui ruoli nelle app multi-utente
- [ ] Usa il tipo `html` solo per contenuto attendibile; preferisci `text`
      altrove
- [ ] In modalità file, assicurati che i deployment non espongano percorsi di
      scrittura `lang/` a utenti non attendibili
- [ ] Mantieni Lingua aggiornato per ricevere le correzioni di sicurezza

## Segnalazione vulnerabilità

Segnala i problemi di sicurezza in modo privato a
[security@rivalex.com](mailto:security@rivalex.com). Non aprire issue pubbliche
su GitHub per le vulnerabilità.
