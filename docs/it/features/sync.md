# Sincronizzazione bidirezionale

Lingua può importare le traduzioni dai file locali nel database e riesportarle - offrendoti il meglio di entrambi i mondi: **runtime basato su database** e **controllo versione basato su file**.

## Le due direzioni

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (DB)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄── lingua:sync-to-local
                      ─┘
```

## Sincronizza nel database

Importa tutti i file di traduzione da `lang/` (e le sue sottodirectory) nella tabella `language_lines`.

```bash
php artisan lingua:sync-to-database
```

### Cosa viene importato

- `lang/{locale}/*.php` - file di traduzione PHP standard
- `lang/{locale}.json` - file di traduzione JSON
- `lang/vendor/{package}/{locale}/*.php` - traduzioni dei pacchetti vendor

### Comportamento di upsert

Lingua usa `updateOrCreate` abbinando su `group` + `key`. Questo significa:
- Le **nuove chiavi** vengono inserite
- Le **chiavi esistenti** hanno il loro JSON `text` unito - i valori delle locale che hai modificato nell'interfaccia vengono **preservati**
- Il **rilevamento del tipo** viene eseguito sul valore per determinare `text` / `html` / `markdown`

### Rilevamento automatico del tipo

| Regola | Tipo assegnato |
|---|---|
| La stringa contiene tag HTML (`<…>`) | `html` |
| La stringa viene analizzata come Markdown (titoli, elenchi, ecc.) | `markdown` |
| Nessuno dei due | `text` |

::: tip
Il rilevamento del tipo è conservativo - assegna `html` o `markdown` solo quando il contenuto corrisponde chiaramente. Le stringhe semplici ricevono sempre `text`. Puoi cambiare il tipo manualmente tramite la modale di modifica.
:::

### Tramite il facade

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
```

::: warning
Il facade chiama `Translation::syncToDatabase()` internamente, che è una chiamata statica. Nei comandi Artisan e nei componenti Livewire, viene usato invece `app(Translation::class)->syncToDatabase()` in modo che Mockery possa intercettarla nei test.
:::

---

## Sincronizza in locale

Esporta tutte le traduzioni da `language_lines` nei file PHP e JSON di `lang/`.

```bash
php artisan lingua:sync-to-local
```

### Cosa viene esportato

- Tutte le traduzioni non-vendor → `lang/{locale}/{group}.php`
- Chiavi del gruppo JSON (`single`) → `lang/{locale}.json`
- Traduzioni vendor → `lang/vendor/{vendor}/{locale}/{group}.php`

### Casi d'uso

- **Controllo versione** - commetti i file esportati per tracciare le modifiche alle traduzioni nel tempo
- **Pipeline di deployment** - esporta prima del deployment se gli strumenti downstream si aspettano traduzioni basate su file
- **Backup** - crea uno snapshot in un determinato momento di tutte le traduzioni
- **Altri strumenti** - esporta per l'uso in un servizio di gestione delle traduzioni o in un importatore CSV

### Tramite il facade

```php
Lingua::syncToLocal();
```

---

## Aggiorna da Laravel Lang

Recupera le ultime stringhe di traduzione dall'ecosistema `laravel-lang` e le sincronizza nel database. Utile dopo aver aggiornato Laravel o aggiunto un nuovo pacchetto che include traduzioni.

```bash
php artisan lingua:update-lang
```

Questo esegue `lang:update` (da `laravel-lang/common`) seguito da `lingua:sync-to-database`.

---

## Flussi di lavoro di sincronizzazione automatizzata

### Al deployment

Aggiungi un passaggio post-deploy per mantenere il database sincronizzato con i file lang che hai committato:

```bash
# Nel tuo script di deploy o nella pipeline CI/CD
php artisan lingua:sync-to-database
php artisan optimize:clear
```

### Tramite lo scheduler

Se il tuo team di traduzione modifica i file direttamente (anziché tramite l'interfaccia), pianifica una sincronizzazione periodica:

```php
// routes/console.php
Schedule::command('lingua:sync-to-database')->hourly();
```

### All'installazione di un pacchetto

Quando esegui `composer require` per un nuovo pacchetto che include traduzioni, esegui:

```bash
php artisan lingua:update-lang
```

Questo recupera le nuove stringhe dal pacchetto installato.

---

## Consigli e avvertenze

::: tip Mantieni il DB come fonte di verità
Tratta il database come la fonte primaria. Sincronizza in locale solo quando hai bisogno dei file (controllo versione, deployment, ecc.). Evita di modificare i file locali direttamente mentre il DB è in uso - la prossima sincronizzazione nel database sovrascriverà le tue modifiche se le chiavi esistono già.
:::

::: warning File locale e DB non sincronizzati
Se aggiungi manualmente nuovi file PHP di locale senza eseguire `lingua:sync-to-database`, le nuove chiavi saranno disponibili solo tramite il file loader (priorità inferiore rispetto al DB). Esegui la sincronizzazione per importarle correttamente.
:::

::: tip Ciclo completo
Un modo sicuro per riorganizzare le traduzioni:
1. `lingua:sync-to-local` - esporta tutto
2. Modifica i file su disco
3. `lingua:sync-to-database` - reimporta
:::
