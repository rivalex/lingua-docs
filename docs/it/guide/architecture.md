# Come funziona

Comprendere gli internals di Lingua rende più semplice configurarlo,
eseguirne il debug ed estenderlo.

## Ciclo di vita della richiesta

```
Browser request
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware       │  Legge 'locale' dalla sessione
│  app()->setLocale($locale)  │  Fallback alla locale predefinita nel DB
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│        Your Controller      │
│  __('auth.failed')          │  Helper standard di Laravel
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  estende Illuminate FileLoader
│  Traduzioni DB unite su     │  DB vince sempre in caso di sovrapposizione
│  traduzioni file (DB mode)  │  (modalità file = FileLoader standard)
└───┬─────────────────────────┘
    │
    ▼
Stringa tradotta restituita
```

## Caricamento delle traduzioni

`LinguaManager` estende il
`Illuminate\Translation\FileLoader` di Laravel — **nessuna** dipendenza da
Spatie. Viene registrato decorando il binding del loader del framework:

```php
$app->extend('translation.loader', function ($original, $app) {
    return new LinguaManager($app, $original);
});
```

In **modalità database**, per ogni `(locale, gruppo)` carica le traduzioni
basate su file tramite il loader originale, poi unisce i valori del database
sopra usando `array_replace_recursive`. **Il valore del database vince sempre**
in caso di sovrapposizione, così puoi sovrascrivere qualsiasi stringa vendor
o basata su file senza toccare i file sorgente.

Se la tabella `language_lines` non esiste ancora (es. prima che le migrazioni
siano state eseguite), viene intercettata una `QueryException` e
`LinguaManager` ricade in modo sicuro sulla modalità solo-file.

In **modalità file**, `LinguaManager` si comporta come il `FileLoader`
standard — nessuna query al database. Vedi [Driver di archiviazione](/it/guide/storage).

## Middleware

`LinguaMiddleware` viene aggiunto automaticamente al gruppo di middleware
`web` all'avvio tramite `LinguaServiceProvider`. Viene eseguito per ogni
richiesta web:

```php
// Logica semplificata
$locale = session()->get(config('lingua.session_variable'))
    ?? Language::default()?->code
    ?? config('app.locale');

app()->setLocale($locale);
app()->setFallbackLocale($defaultLocale);
session()->put(config('lingua.session_variable'), $locale);
```

## Service provider

`LinguaServiceProvider` esegue le seguenti operazioni all'avvio:

1. **Registra i componenti Blade anonimi** con il prefisso `lingua::`
2. **Registra i componenti Livewire** con il namespace `lingua::`
3. **Decora il binding `translation.loader`** tramite `$app->extend(...)`,
   avvolgendo il loader di Laravel con `LinguaManager`

Poiché il provider *decora* piuttosto che *sostituire* il loader principale,
si compone in modo pulito con il `TranslationServiceProvider` di Laravel.
L'ordine di autoload di Composer gestisce automaticamente l'ordine di avvio.

## Schema del database

Vengono usate tre tabelle (il driver `file` omette `language_lines`):

### `languages`

| Colonna | Tipo | Note |
|---|---|---|
| `id` | bigint | Chiave primaria |
| `code` | string | Codice ISO 639-1 (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Codice regionale completo (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` o `'standard'` |
| `name` | string | Nome visualizzato in inglese (`French`) |
| `native` | string | Nome nativo (`Français`) |
| `direction` | string | `'ltr'` o `'rtl'` |
| `is_default` | boolean | Solo una riga deve essere `true` |
| `sort` | integer | Ordine di visualizzazione (assegnato automaticamente) |

### `language_lines`

| Colonna | Tipo | Note |
|---|---|---|
| `id` | bigint | Chiave primaria |
| `group` | string | Gruppo di traduzione (`auth`, `validation`, `single`) |
| `key` | string | Chiave di traduzione (`failed`, `required`) |
| `text` | json, **nullable** | `{"en": "…", "fr": "…"}` |
| `type` | string | `'text'`, `'html'` o `'markdown'` |
| `is_vendor` | boolean | `true` per le stringhe di pacchetti di terze parti |
| `vendor` | string, nullable | Nome del vendor (es. `laravel`) |

La colonna JSON `text` archivia **tutte le locale in un'unica riga**:

- Aggiungere una nuova locale non cambia mai lo schema
- Una singola query recupera tutti i valori per ogni locale di una chiave
- Le locale mancanti non hanno semplicemente alcuna chiave nell'oggetto JSON

### `lingua_settings`

Tabella chiave/valore che supporta l'interfaccia Impostazioni (es. il toggle
della navigazione condivisa).

## Dataset integrato

Lingua 2.0 include tutti i dati delle locale nel pacchetto:

- **`LocaleRegistry`** (`Rivalex\Lingua\Locales\LocaleRegistry`) — metadati
  per 129+ locale. `Lingua::info($locale)` restituisce un value object
  `LocaleInfo` readonly immutabile (`->name`, `->native`, `->direction`,
  `->regional`, `->code`, `->type`), o `null` per le locale sconosciute.
- **Traduzioni integrate** — 26 locale × 7 gruppi, 5902 stringhe, allineate
  a Laravel **v13.14.0**. Un `NotificationProjector` deriva le stringhe delle
  notifiche. `lingua:add` popola dal dataset senza chiamate di rete.

## Architettura della cache

In modalità database, Lingua memorizza in cache le traduzioni
**chirurgicamente** per `(locale, gruppo)`:

- Le chiavi hanno il formato `lingua.trans.{locale}.{gruppo}`
- Al salvataggio/eliminazione di una `Translation`, viene eseguita solo
  `Cache::forget('lingua.trans.{locale}.{gruppo}')` per le chiavi
  interessate — non esiste **alcun** `cache:clear` globale in nessun percorso
  di sincronizzazione
- Store e prefisso sono configurabili tramite `cache.store` / `cache.prefix`
- La cache è un'ottimizzazione, il database è la fonte di verità: se lo store della cache non è disponibile (ad esempio un timeout di Redis), le letture e la scrittura di ripristino dopo un miss ricadono sul database. L'eccezione viene segnalata e un circuit breaker con scope di richiesta salta lo store per il resto della richiesta. L'invalidazione (`forget`) **non** è protetta: un forget fallito emerge, così una voce obsoleta non può sopravvivere al ripristino dello store

## Modelli

| Modello | Tabella | Estende |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `Illuminate\Database\Eloquent\Model` |

`Translation` fornisce `getTranslationsForGroup()`, helper di sincronizzazione,
helper per le statistiche e `forgetTranslation()` — che lancia
`VendorTranslationProtectedException` per le righe vendor. Lo scope di query
`scopeOrdered()` sostituisce il vecchio `scopeActive()` (un delegato è
mantenuto per retrocompatibilità).
