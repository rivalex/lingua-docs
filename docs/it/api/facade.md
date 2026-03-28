# Facade Lingua

Il facade `Lingua` fornisce accesso statico all'intero servizio Lingua da qualsiasi parte della tua applicazione.

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## Helper per le locale

### `getLocale()`

Restituisce il codice della locale corrente dell'applicazione.

```php
Lingua::getLocale(); // 'en'
```

Equivale a `app()->getLocale()`.

---

### `getDefaultLocale()`

Restituisce il codice della locale della lingua contrassegnata come predefinita nel database.

```php
Lingua::getDefaultLocale(); // 'en'
```

Fa il fallback a `config('lingua.default_locale', 'en')` se non è impostata alcuna predefinita.

---

### `isDefaultLocale(?string $locale = null): bool`

Restituisce `true` se la locale specificata (o la locale corrente quando `null`) è la predefinita di sistema.

```php
Lingua::isDefaultLocale();       // true  (la locale corrente è predefinita)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (locale sconosciuta, nessuna eccezione)
```

---

### `hasLocale(string $locale): bool`

Restituisce `true` se esiste un record `Language` per il codice o valore regionale specificato.

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (abbinato per regionale)
Lingua::hasLocale('xx');     // false
```

---

### `setDefaultLocale(string $locale): void`

Contrassegna la locale specificata come predefinita di sistema. Genera `ModelNotFoundException` se la locale non è installata.

```php
Lingua::setDefaultLocale('fr');
```

---

### `getLocaleName(?string $locale = null): string`

Restituisce il nome di visualizzazione in inglese della locale. Restituisce `''` se non trovata.

```php
Lingua::getLocaleName();       // 'English'  (locale corrente)
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
Lingua::getLocaleName('zz');   // ''
```

---

### `getLocaleNative(?string $locale = null): string`

Restituisce il nome nativo della locale. Restituisce `''` se non trovata.

```php
Lingua::getLocaleNative();       // 'English'
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

---

### `getDirection(?string $locale = null): string`

Restituisce `'ltr'` o `'rtl'` per la locale specificata. Il valore predefinito è `'ltr'` se la locale non viene trovata.

```php
Lingua::getDirection();        // 'ltr'  (locale corrente)
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (fallback sicuro)
```

---

### `info(mixed $locale, bool $withCountry = false, bool $withCurrency = false): LocaleData`

Restituisce un oggetto `LocaleData` da `laravel-lang/locales` con informazioni dettagliate sulla locale.

```php
$info = Lingua::info('fr');
$info->code;          // 'fr'
$info->native;        // 'Français'
$info->direction;     // Direction enum

$info = Lingua::info('en-US', withCountry: true, withCurrency: true);
$info->native;        // 'English (United States)'
```

---

## Query sulle lingue

### `languages(): Collection`

Restituisce una collection di tutti i modelli `Language` installati.

```php
$languages = Lingua::languages();
foreach ($languages as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

Restituisce il modello `Language` per il codice locale specificato, o `null` se non trovato.

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

---

### `getDefault(): ?Language`

Restituisce il modello `Language` contrassegnato come predefinito.

```php
$default = Lingua::getDefault();
$default?->code;       // 'en'
$default?->is_default; // true
```

---

### `getFallback(): ?Language`

Restituisce il modello `Language` per `app()->getFallbackLocale()`.

```php
$fallback = Lingua::getFallback();
```

---

### `languagesWithStatistics(): Collection`

Restituisce tutti i modelli `Language` arricchiti con le statistiche delle traduzioni.

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Mancanti: {$lang->missing_strings} / {$lang->total_strings}";
}
```

Ogni modello ottiene quattro attributi di sola lettura:

| Attributo | Tipo | Descrizione |
|---|---|---|
| `total_strings` | `int` | Totale righe in `language_lines` |
| `translated_strings` | `int` | Righe con un valore per questa locale |
| `missing_strings` | `int` | `totale - tradotte` |
| `completion_percentage` | `float` | `tradotte / totale * 100` |

---

## Verifica disponibilità locale

### `available(): array`

Restituisce tutti i codici locale conosciuti a `laravel-lang/locales` (installati + non installati).

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', 'bn', …]
```

---

### `installed(): array`

Restituisce i codici locale attualmente nella tabella `languages`.

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

---

### `notInstalled(): array`

Restituisce i codici locale disponibili ma non installati, ordinati alfabeticamente.

```php
Lingua::notInstalled(); // ['af', 'ar', 'az', …] (tutti tranne 'en', 'fr', 'it')
```

---

### `isInstalled(?string $locale = null): bool`

```php
Lingua::isInstalled('en');   // true
Lingua::isInstalled('xx');   // false
Lingua::isInstalled(null);   // false
```

---

### `isAvailable(?string $locale = null): bool`

Restituisce `true` se la locale è conosciuta da laravel-lang ma **non** ancora installata.

```php
Lingua::isAvailable('de');   // true  (disponibile, non installata)
Lingua::isAvailable('en');   // false (già installata)
Lingua::isAvailable(null);   // false
```

---

## Lettura delle traduzioni

### `translations(): Collection`

Restituisce tutti i modelli `Translation`.

```php
$all = Lingua::translations();
```

---

### `getTranslations(?string $key): array`

Restituisce tutti i valori delle locale per una chiave di traduzione come array associativo.

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants ne correspondent pas.']

Lingua::getTranslations('nonexistent'); // []
```

---

### `getTranslation(?string $key, ?string $locale = null): string`

Restituisce la stringa tradotta per una chiave e locale. Restituisce `''` se non trovata.

```php
Lingua::getTranslation('auth.failed');         // locale corrente
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('auth.failed', 'zz');   // ''
Lingua::getTranslation('nonexistent', 'en');   // ''
```

---

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

Restituisce tutti i modelli `Translation` in un gruppo, opzionalmente filtrati a quelli con un valore per la locale specificata.

```php
// Tutte le stringhe di validation
Lingua::getTranslationByGroup('validation');

// Solo le stringhe di validation con una traduzione francese
Lingua::getTranslationByGroup('validation', 'fr');
```

---

### `getLocaleStats(?string $locale = null): array`

Restituisce le statistiche delle traduzioni per la locale specificata (o la locale corrente quando `null`).

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

Lingua::getLocaleStats('zz');
// ['total' => 1240, 'translated' => 0, 'missing' => 1240, 'percentage' => 0.0]
```

---

## Scrittura delle traduzioni

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

Salva un valore di traduzione. Non fa nulla se la chiave non esiste.

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
Lingua::setTranslation('auth.failed', 'Messaggio aggiornato');  // locale corrente
```

---

### `forgetTranslation(?string $key, ?string $locale = null): void`

Rimuove il valore di una locale da una chiave di traduzione. Se la locale è quella predefinita, l'intero record viene eliminato. Genera `VendorTranslationProtectedException` per le traduzioni vendor.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // rimuove solo il valore 'fr'
Lingua::forgetTranslation('custom.key', 'en');  // elimina l'intero record (locale predefinita)
```

---

## Helper per le traduzioni vendor

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frenchSpatie = Lingua::getVendorTranslations('spatie', 'fr');
```

---

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

Aggiorna un valore di traduzione vendor. Genera `ModelNotFoundException` se il record non esiste.

```php
Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'The :attribute field is mandatory.',
    locale: 'en'
);
```

---

## Ciclo di vita delle lingue

### `addLanguage(string $locale): void`

Installa i file della lingua per la locale specificata tramite `lang:add`.

```php
Lingua::addLanguage('fr');
```

> Questo installa solo i file. Usa `php artisan lingua:add {locale}` per il flusso completo e orchestrato (file + record DB + sincronizzazione).

---

### `removeLanguage(string $locale): void`

Rimuove i file della lingua per la locale specificata tramite `lang:rm --force`.

```php
Lingua::removeLanguage('fr');
```

> Questo rimuove solo i file. Usa `php artisan lingua:remove {locale}` per il flusso completo e orchestrato (file + traduzioni + record DB + riordinamento).

---

## Sincronizzazione e manutenzione

### `syncToDatabase(): void`

Importa tutti i file locali `lang/` nel database.

```php
Lingua::syncToDatabase();
```

---

### `syncToLocal(): void`

Esporta tutte le traduzioni del database nei file locali `lang/`.

```php
Lingua::syncToLocal();
```

---

### `updateLanguages(): void`

Esegue `lang:update` per recuperare le ultime traduzioni da `laravel-lang`.

```php
Lingua::updateLanguages();
```

---

### `optimize(): void`

Svuota la cache dell'applicazione tramite `optimize:clear`.

```php
Lingua::optimize();
```
