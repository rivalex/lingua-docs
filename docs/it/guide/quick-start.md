# Avvio rapido

Questa guida ti accompagna da una nuova installazione di Lingua a un'applicazione completamente multilingue in pochi minuti.

## 1. Installa e popola il database

```bash
composer require rivalex/lingua
php artisan lingua:install
```

L'inglese è ora la tua lingua predefinita e tutte le stringhe di traduzione di Laravel/vendor sono state importate nel database.

## 2. Aggiungi la seconda lingua

```bash
php artisan lingua:add fr
```

Questo comando:
- Scarica i file della lingua francese tramite Laravel Lang
- Crea un record `Language` nel database
- Sincronizza tutte le nuove stringhe in `language_lines`

Ripeti per tutte le locale di cui hai bisogno:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. Aggiungi il selettore di lingua al tuo layout

Apri il tuo layout Blade principale (es. `resources/views/layouts/app.blade.php`) e:

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

## 4. Usa le traduzioni nella tua applicazione

Lingua è trasparente — usa gli helper standard di Laravel come hai sempre fatto:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

Il `LinguaManager` personalizzato unisce le traduzioni del database a quelle basate su file automaticamente. Non sono necessarie modifiche al codice.

## 5. Traduci tramite l'interfaccia

Visita `/lingua/translations` per vedere tutte le stringhe di traduzione. Per ogni lingua:

1. Usa il selettore di locale (in alto a destra) per selezionare la lingua di destinazione
2. Clicca su qualsiasi riga per modificare il valore inline
3. Usa **Mostra solo le mancanti** per concentrarti sulle stringhe non tradotte
4. Per i tipi HTML o Markdown l'editor di testo ricco si attiva automaticamente

<Screenshot src="/screenshots/translations-page.png" alt="Pagina di gestione delle traduzioni di Lingua" caption="La pagina delle traduzioni con selettore di locale, filtro per gruppo e editor inline." />

## 6. Sincronizza nuovamente in file (opzionale)

Se hai bisogno dei file di traduzione su disco (per il controllo versione, CI/CD o altri strumenti):

```bash
php artisan lingua:sync-to-local
```

Questo esporta ogni traduzione del DB nuovamente in `lang/` nel formato PHP/JSON corretto.

---

## Pattern comuni

### Tradurre una nuova chiave in modo programmatico

```php
use Rivalex\Lingua\Facades\Lingua;

// Crea la traduzione nel database per la locale predefinita
// (di solito si fa tramite l'interfaccia, ma puoi farlo anche via script)
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

// In seguito, aggiungi le traduzioni per altre locale:
Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
Lingua::setTranslation('welcome_subject', 'Benvenuto nella nostra piattaforma!', 'it');
```

### Verificare la completezza delle traduzioni

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]
```

### Cambiare la locale in modo programmatico

```php
// In un controller, middleware o service
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```

::: tip
Il componente `LanguageSelector` gestisce il cambio di locale per gli utenti finali automaticamente. L'approccio manuale sopra è utile nei comandi console o nei job.
:::

### Esportare solo gruppi specifici

Se vuoi esportare solo un sottoinsieme di traduzioni in file, sincronizza in locale prima, poi elimina i gruppi di cui non hai bisogno da `lang/` — il database è sempre la fonte di verità a runtime.
