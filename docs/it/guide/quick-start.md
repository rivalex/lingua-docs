# Avvio rapido

Questa guida ti accompagna da una nuova installazione di Lingua a
un'applicazione completamente multilingue in pochi minuti.

## 1. Installa e popola il database

```bash
composer require rivalex/lingua
php artisan lingua:install
```

Scegli il driver **database** quando richiesto (consigliato). L'inglese
diventa la lingua predefinita e le stringhe di traduzione integrate vengono
importate nel database — nessun download da GitHub.

::: tip Sicuro per impostazione predefinita
Le route di gestione sono protette automaticamente da `['web', 'auth']`.
Imposta `LINGUA_GATE` per l'accesso basato sui ruoli — vedi
[Installazione](/it/guide/installation#proteggere-linterfaccia-di-gestione).
:::

## 2. Aggiungi la seconda lingua

```bash
php artisan lingua:add fr
```

Questo comando è **nativo DB**: popola le stringhe francesi dal dataset
integrato e crea un record `Language`. **Non** scarica file né scrive in
`lang/`.

Ripeti per tutte le locale di cui hai bisogno:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. Aggiungi il selettore di lingua al tuo layout

Apri il tuo layout Blade principale (es.
`resources/views/layouts/app.blade.php`):

**a) Imposta `lang` e `dir` sul tag `<html>`:**

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

**b) Incorpora il selettore di lingua dove meglio si adatta al tuo design:**

```blade
{{-- Come gruppo nella sidebar (default) --}}
<livewire:lingua::language-selector />

{{-- Come dropdown in una navbar --}}
<livewire:lingua::language-selector mode="dropdown" />
```

::: tip Il cambio di locale ricarica la pagina corrente
Quando un utente cambia lingua, Lingua ricarica la **pagina su cui si trova**
(non la home), protetto contro i redirect aperti. Vedi
[Sicurezza](/it/guide/security#protezione-redirect-aperto).
:::

## 4. Usa le traduzioni nella tua applicazione

Lingua è trasparente — usa gli helper standard di Laravel come hai sempre
fatto:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

In modalità database, `LinguaManager` unisce automaticamente le traduzioni del
database a quelle basate su file. Non sono necessarie modifiche al codice.

## 5. Traduci tramite l'interfaccia

Visita `/lingua/translations` per vedere tutte le stringhe di traduzione. Per
ogni lingua:

1. Usa il selettore di locale (in alto a destra) per selezionare la lingua di
   destinazione
2. Clicca su qualsiasi riga per modificare il valore inline
3. Usa **Mostra solo le mancanti** per concentrarti sulle stringhe non
   tradotte
4. Per i tipi HTML o Markdown l'editor di testo ricco si attiva
   automaticamente

<Screenshot src="/screenshots/translations-page.png" alt="Pagina di gestione delle traduzioni di Lingua" caption="La pagina delle traduzioni con selettore di locale, filtro per gruppo e editor inline." />

## 6. Import / export con la pagina Transfer

Hai bisogno di modificare le traduzioni in blocco in un foglio di calcolo o
di consegnare un file a un'agenzia di traduzione? Visita `/lingua/transfer`:

- **Esporta** in CSV, JSON, XLSX o ODS — layout bilingue, multi-locale o
  JSON-native
- **Importa** con un'**anteprima diff** dry-run prima di scrivere qualsiasi
  cosa

XLSX/ODS richiedono il pacchetto opzionale `openspout/openspout`; CSV e JSON
funzionano senza installazioni aggiuntive.

## 7. Sincronizza nuovamente in file (opzionale)

Se hai bisogno dei file di traduzione su disco (per il controllo versione o
CI/CD):

```bash
php artisan lingua:sync-to-local
```

Questo esporta ogni traduzione DB nuovamente in `lang/` nel formato PHP/JSON
corretto.

---

## Pattern comuni

### Tradurre una nuova chiave in modo programmatico

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
```

### Ispezionare una locale

```php
use Rivalex\Lingua\Facades\Lingua;

$info = Lingua::info('fr');

if ($info !== null) {
    $info->name;      // "French"
    $info->native;    // "Français"
    $info->direction; // "ltr"
}
```

::: warning Modificato in 2.0
`Lingua::info()` ora restituisce `?LocaleInfo` e ritorna `null` per le locale
sconosciute invece di lanciare un'eccezione. Aggiungi sempre la guardia
`if ($info !== null)`.
:::

### Cambiare la locale in modo programmatico

```php
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```
