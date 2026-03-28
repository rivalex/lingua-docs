# Traduzioni vendor

Le traduzioni vendor sono stringhe appartenenti a pacchetti di terze parti — i messaggi di validazione di Laravel, le etichette di paginazione, le stringhe di reset della password e le traduzioni di qualsiasi altro pacchetto che include la propria directory `lang/`.

## Come vengono identificate

Durante `lingua:sync-to-database`, Lingua analizza la struttura della directory `lang/vendor/`. Qualsiasi file di traduzione trovato lì viene importato con:

- `is_vendor = true`
- `vendor` = il nome del pacchetto (derivato dal nome della directory, es. `spatie`, `laravel`, `filament`)

Esempio di righe del database dopo la sincronizzazione:

```
group      | key          | is_vendor | vendor   | text
-----------|--------------|-----------|----------|-----------------------------
validation | required     | false     | null     | {"en":"The :attribute…"}
passwords  | reset        | true      | laravel  | {"en":"Your password…"}
auth       | failed       | true      | laravel  | {"en":"These credentials…"}
```

::: tip
I file `lang/en/*.php` di Laravel (auth, validation, pagination, passwords) sono trattati come **traduzioni vendor** perché provengono dal framework, non dal codice della tua applicazione.
:::

## Cosa puoi fare con le traduzioni vendor

| Azione | Consentita? | Note |
|---|---|---|
| **Modifica valore** | ✅ Sì | Sovrascrivi qualsiasi stringa vendor con il tuo testo |
| **Cambia tipo** | ✅ Sì | Passa tra text / html / markdown |
| **Modifica gruppo o chiave** | ❌ No | I campi gruppo e chiave sono bloccati nella modale di modifica |
| **Elimina** | ❌ No | Protetta da `VendorTranslationProtectedException` |

## Sovrascrivere una stringa vendor

Il caso d'uso più comune è sovrascrivere i messaggi di validazione di Laravel per adattarli al tono della tua applicazione:

1. Apri `/lingua/translations`
2. Trova la stringa (es. `validation.required`)
3. Clicca sull'icona di modifica per aprire la modale di aggiornamento
4. Cambia il valore per qualsiasi locale
5. Salva — la sovrascrittura ha effetto immediatamente alla richiesta successiva

```php
// Oppure in modo programmatico tramite il facade:
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Per favore compila il campo :attribute.',
    locale: 'it'
);
```

## Interrogare le traduzioni vendor

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// Tutte le traduzioni vendor
$all = Translation::where('is_vendor', true)->get();

// Tutte le traduzioni vendor per un pacchetto specifico
$laravel = Lingua::getVendorTranslations('laravel');

// Tutte le traduzioni vendor per un pacchetto con valori in francese
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');

// Filtra per gruppo e chiave manualmente
$required = Translation::where('is_vendor', true)
    ->where('vendor', 'laravel')
    ->where('group', 'validation')
    ->where('key', 'required')
    ->first();
```

## Meccanismo di protezione

Il tentativo di eliminare una traduzione vendor (dall'interfaccia o tramite `Lingua::forgetTranslation()`) genera una `VendorTranslationProtectedException`:

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en'); // la chiave appartiene a una traduzione vendor
} catch (VendorTranslationProtectedException $e) {
    // Gestisci in modo appropriato
}
```

Nell'interfaccia Livewire, i tentativi di eliminazione generano un evento `vendor_translation_protected` e chiudono la modale senza eliminare nulla. L'evento può essere ascoltato nei tuoi componenti Livewire o nel codice Alpine.js:

```js
// Listener di eventi Alpine.js / Livewire
window.addEventListener('vendor_translation_protected', () => {
    alert('Questa traduzione è protetta e non può essere eliminata.');
});
```

## Risincronizzare le traduzioni vendor

Se un pacchetto da cui dipendi aggiunge nuove chiavi di traduzione in un aggiornamento di versione, risincronizza per importarle:

```bash
# Recupera le ultime da laravel-lang e sincronizza nel DB
php artisan lingua:update-lang

# Oppure risincronizza manualmente dai tuoi file lang/ esistenti
php artisan lingua:sync-to-database
```

Lingua usa `updateOrCreate` durante la sincronizzazione, quindi le sovrascritture esistenti (valori modificati) vengono preservate.

## Disabilitare le importazioni delle traduzioni vendor

Se non vuoi le traduzioni vendor nel database, sincronizza solo dopo aver rimosso la directory `lang/vendor/`. Lingua importa solo ciò che trova su disco.
