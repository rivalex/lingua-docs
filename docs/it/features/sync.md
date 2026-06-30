# Sincronizzazione bidirezionale

Lingua può importare le traduzioni dai file `lang/` nel database e
riesportarle — offrendo il meglio di entrambi i mondi: **runtime database** e
**controllo versione basato su file**.

## Il dataset integrato <Badge type="tip" text="Novità in 2.0" />

Lingua 2.0 include tutti i dati delle locale nel pacchetto — nessuna
dipendenza da `laravel-lang` o download da internet:

- **`LocaleRegistry`** — metadati per 129+ locale (nome, nome nativo,
  direzione, codice regionale)
- **Traduzioni integrate** — 26 locale × 7 gruppi, 5902 stringhe, allineate
  a Laravel **v13.14.0**
- `lingua:add` popola istantaneamente dal dataset; `lingua:update-lang`
  ri-popola le locale già installate

```
Dataset integrato (26 locale × 7 gruppi)
    │
    ▼
lingua:add {locale}   ──►  language_lines (DB)  oppure  lang/{locale}/ (file)
lingua:update-lang    ──►  aggiorna le stringhe installate
                           (nessuna chiamata di rete)
```

## Le due direzioni di sincronizzazione

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database  ──►  language_lines (DB)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄──  lingua:sync-to-local
                      ─┘
```

## Sincronizza nel database

Importa tutti i file di traduzione da `lang/` nella tabella `language_lines`.

```bash
php artisan lingua:sync-to-database
```

### Cosa viene importato

- `lang/{locale}/*.php` — file di traduzione PHP standard
- `lang/{locale}.json` — file di traduzione JSON
- `lang/vendor/{package}/{locale}/*.php` — traduzioni dei pacchetti vendor

### Comportamento di upsert

Lingua usa `updateOrCreate` abbinando su `group + key`:

- Le **nuove chiavi** vengono inserite
- Le **chiavi esistenti** hanno il loro JSON `text` unito — i valori delle
  locale che hai modificato nell'interfaccia vengono **preservati**
- Il **rilevamento del tipo** viene eseguito sul valore per determinare il
  tipo `text` / `html` / `markdown`

### Rilevamento automatico del tipo

| Regola | Tipo assegnato |
|---|---|
| La stringa contiene tag HTML (`<…>`) | `html` |
| La stringa viene analizzata come Markdown (titoli, elenchi, ecc.) | `markdown` |
| Nessuno dei due | `text` |

### Invalidazione chirurgica della cache

Dopo ogni sincronizzazione, `Cache::forget('lingua.trans.{locale}.{gruppo}')`
viene chiamato solo per le coppie `(locale, gruppo)` interessate — nessun
`cache:clear` globale.

### Tramite il facade

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
```

---

## Sincronizza in locale

Esporta tutte le traduzioni da `language_lines` nei file PHP e JSON di
`lang/`.

```bash
php artisan lingua:sync-to-local
```

### Cosa viene esportato

- Tutte le traduzioni non-vendor → `lang/{locale}/{group}.php`
- Chiavi del gruppo JSON (`single`) → `lang/{locale}.json`
- Traduzioni vendor → `lang/vendor/{vendor}/{locale}/{group}.php`

::: warning Consapevolezza del driver
In modalità di archiviazione `file` questo comando è un **no-op senza
`--force`** — la modalità file scrive già su disco, quindi non è necessaria
nessuna esportazione separata.
:::

### Casi d'uso

- **Controllo versione** — esegui il commit dei file esportati per tracciare
  le modifiche alle traduzioni nel tempo
- **Pipeline di deployment** — esporta prima del deployment se gli strumenti
  downstream si aspettano traduzioni basate su file
- **Backup** — snapshot in un determinato momento di tutte le traduzioni

### Tramite il facade

```php
Lingua::syncToLocal();
```

---

## Aggiornamento <Badge type="tip" text="Modificato in 2.0" />

Ri-popola le locale installate dal **dataset integrato** (nessun download da
internet) e poi unisce dall'eventuale `lang/` locale.

```bash
php artisan lingua:update-lang
```

Esegui questo dopo:

- Aver aggiornato Lingua (nuovo allineamento del dataset integrato)
- Aver installato un nuovo pacchetto che include le proprie traduzioni

::: tip Nessuna dipendenza da laravel-lang
In 2.0 questo comando **non** chiama più `lang:update` da
`laravel-lang/common`. Il dataset integrato serve come fonte di verità locale.
:::

---

## Flussi di lavoro di sincronizzazione automatizzata

### Al deployment (driver database)

```bash
# Nel tuo script di deploy o pipeline CI/CD
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize:clear
```

### Tramite lo scheduler

Se il tuo team di traduzione modifica i file direttamente, pianifica una
sincronizzazione periodica:

```php
// routes/console.php
Schedule::command('lingua:sync-to-database')->hourly();
```

### Ciclo completo

Un modo sicuro per riorganizzare le traduzioni:

1. `lingua:sync-to-local` — esporta tutto
2. Modifica i file su disco
3. `lingua:sync-to-database` — reimporta

---

## Consigli e avvertenze

::: tip Mantieni il DB come fonte di verità
Tratta il database come la fonte primaria. Sincronizza in locale solo quando
hai bisogno dei file. Evita di modificare i file locali direttamente mentre
il DB è in uso — la prossima sincronizzazione nel database unirà i valori
file ma i valori DB preesistenti hanno la precedenza.
:::

::: warning File locale e DB non sincronizzati
Se aggiungi nuovi file PHP di locale senza eseguire `lingua:sync-to-database`,
le nuove chiavi saranno disponibili solo tramite il file loader. Esegui la
sincronizzazione per importarle correttamente nel DB.
:::
