# Traduzioni vendor

Le **traduzioni vendor** sono stringhe appartenenti a Laravel stesso o ad
altri pacchetti di terze parti — i messaggi di validazione, le etichette di
paginazione, le stringhe di reset della password e le traduzioni di qualsiasi
altro pacchetto che include la propria directory `lang/`.

## Come vengono identificate

Ogni riga `Translation` ha due colonne correlate al vendor:

| Colonna | Tipo | Significato |
|---|---|---|
| `is_vendor` | boolean | `true` se la riga appartiene a un vendor |
| `vendor` | string, nullable | Nome del vendor (es. `laravel`, `jetstream`) |

Le righe vengono marcate come vendor durante `lingua:sync-to-database`:
qualsiasi file trovato in `lang/vendor/` o appartenente ai gruppi core
Laravel (`auth`, `validation`, `passwords`, `pagination`) riceve
`is_vendor = true`. Le righe aggiunte manualmente tramite l'interfaccia non
vengono mai marcate come vendor.

```
group      | key      | is_vendor | vendor  | text
-----------|----------|-----------|---------|---------------------------
validation | required | false     | null    | {"en":"The :attribute…"}
passwords  | reset    | true      | laravel | {"en":"Your password…"}
auth       | failed   | true      | laravel | {"en":"These credentials…"}
```

```php
use Rivalex\Lingua\Models\Translation;

// Tutte le righe vendor
Translation::where('is_vendor', true)->get();

// Solo righe vendor Laravel
Translation::where('vendor', 'laravel')->get();
```

## Cosa puoi fare con le traduzioni vendor

| Azione | Consentita? | Note |
|---|---|---|
| **Modifica valore** | Si | Sovrascrivi qualsiasi stringa vendor con il tuo testo |
| **Cambia tipo** | Si | Passa tra `text` / `html` / `markdown` |
| **Modifica gruppo o chiave** | No | I campi sono bloccati nella modale di modifica |
| **Elimina** | No | Protetta da `VendorTranslationProtectedException` |

## Meccanismo di protezione

Il tentativo di eliminare una riga vendor (dall'interfaccia o tramite
`Lingua::forgetTranslation()`) lancia `VendorTranslationProtectedException`
a livello di repository:

```php
// DatabaseRepository::forgetTranslation()
if ($translation->is_vendor) {
    throw new VendorTranslationProtectedException($translation->key);
}
```

Nell'interfaccia Traduzioni il pulsante elimina è nascosto per le righe
vendor. I tentativi di eliminazione generano un evento
`vendor_translation_protected` senza eliminare nulla.

Le righe vendor importate tramite la pagina Transfer vengono riportate sotto
**Skip** — vedi [Import / Export](/it/features/transfer#protezione-vendor).

::: info Puoi modificare i valori vendor
Le righe vendor possono essere **modificate** — solo l'eliminazione è
bloccata. Modifica qualsiasi stringa vendor tramite l'editor inline o la
modale di modifica per sovrascrivere il testo predefinito del vendor con il
tuo.
:::

## Sovrascrivere una stringa vendor

1. Apri `/lingua/translations`
2. Attiva il filtro **Includi vendor** per mostrare le righe vendor
3. Trova la stringa (es. `validation.required`)
4. Clicca sull'icona di modifica e aggiorna il valore per la locale
5. Salva — la sovrascrittura ha effetto alla richiesta successiva

```php
// Oppure in modo programmatico:
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Per favore compila il campo :attribute.',
    locale: 'it'
);
```

## Namespace vendor

I pacchetti che pubblicano le proprie traduzioni con un namespace (es.
`trans('mio-pacchetto::messages.welcome')`) vengono gestiti in modo
trasparente da `LinguaManager`:

- In modalità **database**: `LinguaManager::load()` serve le namespace vendor
  dal DB (memorizzato in cache tramite `CacheKey::forVendorGroup()`) e si
  fonde con le stringhe basate su file
- In modalità **file**: si comporta come il `FileLoader` standard di Laravel

Le righe namespace vendor sono identificate nella tabella `language_lines` dal
prefisso del gruppo — es. gruppo `mio-pacchetto::messages`.

## Risincronizzare le traduzioni vendor

Se un vendor aggiunge nuove chiavi in un aggiornamento, risincronizza per
importarle:

```bash
# Aggiorna dal dataset integrato (no network)
php artisan lingua:update-lang

# Oppure risincronizza dai tuoi file lang/ esistenti
php artisan lingua:sync-to-database
```

Lingua usa `updateOrCreate` durante la sincronizzazione, quindi le
sovrascritture esistenti vengono preservate.

Vedi [Sincronizzazione bidirezionale](/it/features/sync#aggiornamento) per
i dettagli completi.
