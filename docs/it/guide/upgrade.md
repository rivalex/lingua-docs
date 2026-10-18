# Aggiornamento dalla versione 1.x alla 2.0

Lingua 2.0 è una release major. Questa guida ti accompagna nella migrazione
passo per passo, elenca ogni breaking change e risponde alle domande più
frequenti.

## Perché si tratta di una release major

- **Dipendenze esterne rimosse.** `spatie/laravel-translation-loader` e
  `laravel-lang/common` sono stati eliminati. I metadati delle locale e il
  dataset di traduzioni ora sono inclusi nel pacchetto.
- **Driver di archiviazione aggiunti.** Scegli `database` (il comportamento
  della versione 1.x) o `file`. Vedi [Driver di archiviazione](/it/guide/storage).
- **Hardening completo della sicurezza.** Sicuro per impostazione predefinita,
  più il ciclo di hardening F1–F9. Vedi [Sicurezza](/it/guide/security).
- **Requisito PHP alzato** a 8.3+.

## Migrazione passo per passo

### 1. Aggiorna il pacchetto

```bash
composer update rivalex/lingua
```

Composer rimuove automaticamente `spatie/laravel-translation-loader`. Se il
tuo `composer.json` include `laravel-lang/common`:

```bash
composer remove laravel-lang/common
```

### 2. Ripubblica e unisci la configurazione

```bash
php artisan vendor:publish --tag=lingua-config --force
```

Poi unisci le nuove chiavi nella configurazione esistente: `gate`,
`storage.driver`, `nav.enabled`, `navigate`, `routes_extra_parameters`,
`layout`, `links.translations`, `ui.sticky_top`, `cache.store`,
`cache.prefix`, `suppress_pro_nudge`, `pro_upgrade_url`,
`extensions.enabled`. Vedi [Configurazione](/it/guide/configuration).

### 3. Imposta il driver di archiviazione

```env
LINGUA_STORAGE_DRIVER=database
```

```bash
php artisan config:clear
```

`database` è identico al comportamento della versione 1.x.

### 4. Migrazioni

Le migrazioni sono ora suddivise in **tre** file. Se hai già eseguito le
migrazioni sotto la versione 1.x, **non è necessaria alcuna nuova migrazione**
— le tabelle esistono già. Verifica solo se ci sono divergenze nello schema se
hai precedentemente pubblicato e personalizzato la migrazione combinata.

### 5. Translation loader personalizzati

```php
// Prima
use Spatie\TranslationLoader\TranslationLoaders\TranslationLoader;

// Dopo
use Rivalex\Lingua\Contracts\TranslationLoader;
```

La firma è invariata:
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### 6. Modello Translation personalizzato

```php
// Prima
class Translation extends \Spatie\TranslationLoader\LanguageLine {}

// Dopo
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $table = 'language_lines';

    public static function getTranslationsForGroup(string $locale, string $group): array
    {
        // …
    }
}
```

### 7. Type-hint

```php
// Prima
use Spatie\TranslationLoader\TranslationLoaderManager;

// Dopo
use Rivalex\Lingua\TranslationManager\LinguaManager;
```

### 8. Autori di pacchetti (Testbench)

Rimuovi il provider Spatie da `getPackageProviders()`:

```php
// Rimuovi questa riga
Spatie\TranslationLoader\TranslationServiceProvider::class,
```

## Riferimento breaking change

| Modifica | Dettaglio |
|---|---|
| Tipo di ritorno `Lingua::info()` <Badge type="warning" text="Breaking" /> | Ora restituisce `?LocaleInfo`; ritorna `null` per le locale sconosciute (prima lanciava). Aggiungi la guardia `if ($info === null)`. I nomi dei campi differiscono dal vecchio `LaravelLang\LocaleData`. |
| `addLanguage()` / `removeLanguage()` <Badge type="warning" text="Breaking" /> | Non chiamano più `lang:add` / `lang:rm`. Solo nativo DB — nessuna scrittura su file. |
| Middleware predefinito <Badge type="warning" text="Breaking" /> | `['web', 'auth']` (era `['web']`). |
| Valore predefinito di `navigate` <Badge type="warning" text="Breaking" /> | `false` (era `true`). |
| Requisito PHP <Badge type="warning" text="Breaking" /> | 8.3+ (era 8.2+). |
| `Language::scopeActive()` <Badge type="warning" text="Breaking" /> | Rinominato `scopeOrdered()` (il delegato è mantenuto per compatibilità). |
| `Translation::forgetTranslation()` <Badge type="warning" text="Breaking" /> | Lancia `VendorTranslationProtectedException` per le righe vendor. |
| `Import $errors` <Badge type="warning" text="Breaking" /> | Rinominato `$rowErrors`. |
| `optimize()` <Badge type="warning" text="Breaking" /> | Deprecato — rimuovi tutte le chiamate. |
| Colonne nullable | `language_lines.text` e `languages.regional` sono ora nullable. |
| Migrazioni | Suddivise in 3 file (era 1 combinato). |
| Tag `lingua-assets` | Rimosso — gli asset vengono serviti tramite la route `lingua.assets`. |

## Checklist rapida

- [ ] `composer update rivalex/lingua`
- [ ] Rimuovi `laravel-lang/common` se presente nel tuo `composer.json`
- [ ] Ripubblica la configurazione e unisci le nuove chiavi
- [ ] Imposta `LINGUA_STORAGE_DRIVER=database` ed esegui `php artisan config:clear`
- [ ] Aggiorna eventuali loader/modelli/type-hint personalizzati (Spatie → Lingua)
- [ ] Sostituisci gli utilizzi di `Lingua::info()` con una guardia `null`
- [ ] Rimuovi le chiamate a `optimize()`
- [ ] Rinomina i riferimenti a `Import::$errors` in `$rowErrors`
- [ ] Verifica che middleware/gate corrispondano alla tua policy di accesso

## FAQ

**Le mie traduzioni andranno perse?**
No. Con il driver `database` il comportamento e i dati sono identici alla
versione 1.x. Le righe `language_lines` esistenti rimangono intatte.

**Devo rieseguire le migrazioni?**
No, se erano già state eseguite con la versione 1.x. Le tabelle esistono già;
la suddivisione in 3 file riguarda solo le nuove installazioni.

**Posso ancora usare l'archiviazione basata su file?**
Sì — è il nuovo driver `file`. Passa in qualsiasi momento con
`php artisan lingua:storage file`. Vedi
[Driver di archiviazione](/it/guide/storage).

**Flux è ancora richiesto?**
Sì. Lingua 2.0 richiede `livewire/flux ^2.12`. Flux **non** è stato rimosso.

## Aggiornamento dalla 2.0 alla 2.1

Lingua 2.1 supporta Laravel **12 e 13**. Il supporto di sicurezza per Laravel 11 è terminato il March 12, 2026. Le applicazioni ancora su Laravel 11 restano su Lingua 2.0.6, che Composer continua a selezionare automaticamente; aggiorna Laravel prima di aggiornare Lingua. Non ci sono altri breaking change: non serve alcuna modifica a configurazione, migrazioni o API.
