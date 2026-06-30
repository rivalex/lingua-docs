# Driver di archiviazione

<Badge type="tip" text="Novità in 2.0" /> Lingua 2.0 introduce un sistema di
**driver di archiviazione** a plugin. Scegli dove risiedono le traduzioni: nel
**database** (il default ricco di funzionalità) o nei normali **file `lang/`**.

```php
// config/lingua.php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

## Scegliere un driver

| Funzionalità | `database` | `file` |
|---|:---:|:---:|
| Store di supporto | Tabella `language_lines` | `lang/` PHP + JSON |
| Tipi HTML / Markdown | ✅ | ❌ (appiattiti a testo semplice) |
| Statistiche di traduzione | ✅ | ✅ (calcolate dai file) |
| Import / export (Transfer) | ✅ | ✅ |
| Protezione vendor | ✅ | ✅ |
| Cache chirurgica per (locale, gruppo) | ✅ | n/a |
| Pulsanti di sincronizzazione nell'UI | ✅ | nascosti |
| Modifica traduzioni nell'UI | ✅ | ✅ |

::: tip Regola empirica
Usa **database** per l'esperienza più ricca e gli override a runtime. Usa
**file** quando le traduzioni devono rimanere nel controllo versione o il
filesystem è la fonte di verità.
:::

## Driver database

Il default, identico al comportamento della versione 1.x.

- Traduzioni archiviate nella tabella `language_lines`, tutte le locale in
  un'unica colonna JSON `text` per riga
- Supporta i tipi `text`, `html` e `markdown`, ognuno con il proprio editor
- Cache chirurgica: `Cache::forget('lingua.trans.{locale}.{gruppo}')` ad
  ogni scrittura — nessun flush globale
- Statistiche complete, import/export e protezione vendor
- Gli override a runtime vincono sui file `lang/` tramite
  `array_replace_recursive`

## Driver file

Legge e scrive direttamente i file PHP e JSON in `lang/`. Non esiste
**alcuna** tabella `language_lines`.

::: danger Perdita di tipo in modalità file
Il driver `file` archivia solo stringhe semplici. I **tipi HTML e Markdown
vengono appiattiti a testo semplice** — l'editor per tipo e i metadati del
tipo non sono disponibili. Se fai affidamento sulle traduzioni HTML/Markdown,
usa il driver database.
:::

- Nessuna query al database; si comporta come il `FileLoader` standard di
  Laravel
- I pulsanti di sincronizzazione sono **nascosti** nell'UI (i file *sono* lo
  store)
- `lingua:sync-to-local` è un **no-op senza `--force`** (il DB da cui
  esporterebbe non è lo store attivo)
- Le modifiche nell'UI vengono scritte direttamente sui file tramite
  `AtomicFileWriter` (rinomina atomica + `opcache_invalidate` — vedi
  [Sicurezza](/it/guide/security#sicurezza-modalità-file))

::: warning Avvertenza deployment
Su piattaforme che ricostruiscono `lang/` dal repository ad ogni deployment
(es. Forge, Envoyer, immagini container), le modifiche UI effettuate in
modalità file potrebbero essere **sovrascritte** al prossimo deployment.
Esegui il commit delle modifiche nel tuo repo, oppure usa il driver database.
:::

## Cambiare driver

Usa il comando `lingua:storage` per cambiare in qualsiasi momento. **Sincronizza
prima di cambiare** così nulla viene perso.

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```

| Flag | Effetto |
|---|---|
| `--force` | Salta le conferme |
| `--write-env` | Aggiorna `LINGUA_STORAGE_DRIVER` in `.env` |
| `--no-migrate` | Salta il passaggio di verifica migrazione |

### Database → file

Lingua **esporta** prima il database in `lang/`, avvisando di eventuali
stringhe HTML/Markdown che perderanno il tipo, poi cambia il driver attivo.

### File → database

Lingua **sincronizza** `lang/` nel database e verifica che la migrazione
`language_lines` sia stata eseguita, poi cambia.

## Installazione con scelta del driver

Il programma di installazione interattivo chiede quale driver usare e pubblica
le migrazioni **driver-aware** — il driver `file` salta completamente la
migrazione `language_lines`:

```bash
php artisan lingua:install
```

Vedi [Installazione](/it/guide/installation).

## Disinstallazione

`lingua:uninstall` rimuove Lingua in modo sicuro:

```bash
php artisan lingua:uninstall
```

**Esporta prima il database in `lang/`**, poi elimina le tre tabelle Lingua
(`language_lines`, `languages`, `lingua_settings`). La directory `lang/`
viene preservata.

| Flag | Effetto |
|---|---|
| `--force` | Salta le conferme |
| `--keep-config` | Lascia `config/lingua.php` al suo posto |
| `--keep-published` | Lascia le viste/migrazioni pubblicate al loro posto |

## Query dirette (driver database)

```php
use Rivalex\Lingua\Models\Translation;

// Tutte le traduzioni con un valore in francese
Translation::whereNotNull('text->fr')->get();

// Solo le traduzioni francesi mancanti
Translation::whereNull('text->fr')->get();

// Una chiave specifica
Translation::where('group', 'validation')->where('key', 'required')->first();
```

Vedi [Traduzioni vendor](/it/features/vendor-translations) per come le
stringhe dei pacchetti sono protette in entrambi i driver.
