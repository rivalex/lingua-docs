# Come funziona

Comprendere gli internals di Lingua rende più semplice configurarlo, eseguirne il debug ed estenderlo.

## Ciclo di vita della richiesta

```
Browser request
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware       │  Legge 'locale' dalla sessione
│  app()->setLocale($locale)  │  Fallback alla locale DB predefinita
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
│       LinguaManager         │  Custom TranslationLoaderManager
│  1. DB loader (Spatie)      │  Il DB ha sempre la precedenza
│  2. File loader (fallback)  │
└───┬─────────────────────────┘
    │
    ▼
Stringa tradotta restituita
```

## Caricamento delle traduzioni

`LinguaManager` estende il `TranslationLoaderManager` di Spatie. A runtime unisce due sorgenti:

1. **File loader** - legge da `lang/` come fa il normale Laravel
2. **Database loader** (loader `Db` di Spatie) - legge da `language_lines`

Quando la stessa chiave esiste in entrambe le sorgenti, **vince il valore del database**. Questo ti permette di sovrascrivere qualsiasi traduzione vendor o basata su file senza toccare i file sorgente.

Se la tabella `language_lines` non esiste ancora (es. prima che le migrazioni siano state eseguite), `LinguaManager` effettua il fallback in modo sicuro alla modalità solo-file.

## Middleware

`LinguaMiddleware` viene aggiunto automaticamente al gruppo di middleware `web` all'avvio tramite `LinguaServiceProvider`. Viene eseguito per ogni richiesta web:

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

`LinguaServiceProvider` esegue tre operazioni all'avvio:

1. **Registra i componenti Blade anonimi** con il prefisso `lingua::`
2. **Registra i componenti Livewire** con il namespace `lingua::`
3. **Sostituisce i singleton `translator` e `translation.loader`** nel container IoC con le implementazioni personalizzate di Lingua

Poiché il service provider sostituisce il binding del translator principale, è importante che venga avviato *dopo* il `TranslationServiceProvider` di Laravel. L'ordine di autoload di Composer gestisce questo automaticamente.

## Schema del database

Vengono usate due tabelle:

### `languages`

| Colonna | Tipo | Note |
|---|---|---|
| `id` | bigint (auto-increment) | Chiave primaria |
| `code` | string | Codice ISO 639-1 (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Codice regionale completo (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` o `'standard'` |
| `name` | string | Nome visualizzato in inglese (`French`) |
| `native` | string | Nome nativo (`Français`) |
| `direction` | string | `'ltr'` o `'rtl'` |
| `is_default` | boolean | Solo una riga deve essere `true` |
| `sort` | integer | Ordine di visualizzazione (assegnato automaticamente) |

### `language_lines` (Spatie)

| Colonna | Tipo | Note |
|---|---|---|
| `id` | bigint (auto-increment) | Chiave primaria |
| `group` | string | Gruppo di traduzione (`auth`, `validation`, `single`) |
| `key` | string | Chiave di traduzione (`failed`, `required`) |
| `text` | json | `{"en": "…", "fr": "…", "it": "…"}` |
| `type` | string | `'text'`, `'html'` o `'markdown'` |
| `is_vendor` | boolean | `true` per le stringhe di pacchetti di terze parti |
| `vendor` | string, nullable | Nome del vendor (es. `spatie`, `laravel`) |

La colonna JSON `text` memorizza **tutte le locale in un'unica riga**. Questo design significa:
- Aggiungere una nuova locale non cambia mai lo schema
- Una singola query recupera tutti i valori per ogni locale di una chiave
- Le locale mancanti non hanno semplicemente alcuna chiave nell'oggetto JSON

## Seeder

`LinguaSeeder` viene chiamato una volta durante `lingua:install`. Esso:

1. Legge `config('lingua.default_locale')` (default a `config('app.locale')`)
2. Recupera i metadati della locale da `laravel-lang/locales`
3. Crea un record `Language` con `is_default = true`
4. Chiama `lingua:add {locale}` per installare i file della lingua
5. Chiama `lingua:sync-to-database` per importare tutte le stringhe

## Modelli

| Modello | Tabella | Estende |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `LanguageLine` di Spatie |

`Translation` eredita i metodi `setTranslation()` e `forgetTranslation()` di Spatie e aggiunge scope specifici di Lingua, metodi di sincronizzazione e helper per le statistiche.
