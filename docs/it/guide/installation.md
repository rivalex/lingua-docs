# Installazione

Lingua include una procedura guidata di installazione interattiva che gestisce
tutto in un unico comando. I passaggi manuali sono documentati di seguito se
preferisci un maggiore controllo.

## Passo 1 — Installa tramite Composer

```bash
composer require rivalex/lingua
```

Questo è l'unico pacchetto necessario. Lingua 2.0 include i propri dati di
locale e il dataset di traduzioni, quindi non occorre richiedere altro.

::: tip Stai aggiornando dalla versione 1.x?
Composer rimuove automaticamente la vecchia dipendenza
`spatie/laravel-translation-loader`. Se il tuo `composer.json` include ancora
`laravel-lang/common`, rimuovila: `composer remove laravel-lang/common`.
Consulta la [guida all'aggiornamento](/it/guide/upgrade) completa.
:::

## Passo 2 — Esegui il programma di installazione

```bash
php artisan lingua:install
```

La procedura guidata è interattiva. Tramite
[Laravel Prompts](https://laravel.com/docs/prompts), ti chiede di scegliere
un **driver di archiviazione** con un selettore a frecce:

| Driver | Sceglilo quando… |
|---|---|
| **`database`** *(consigliato)* | Vuoi il set completo di funzionalità: tipi HTML/Markdown, statistiche, import/export, protezione vendor e cache chirurgica. |
| **`file`** | Mantieni le traduzioni nel controllo versione o esegui in un ambiente read-only/CI e preferisci i normali file `lang/`. |

La procedura guidata poi:

1. Pubblica il file di configurazione in `config/lingua.php`
2. Pubblica le migrazioni **driver-aware** (il driver `file` salta la
   migrazione `language_lines`)
3. Chiede se eseguire le migrazioni automaticamente
4. Popola il database con la lingua predefinita e le sue traduzioni dal
   dataset integrato — **nessun download da GitHub**
5. Opzionalmente aggiunge una stella al repository su GitHub ⭐

Al termine vedrai:

```
✓ Driver selected          →  database
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua installed successfully!
```

## Passo 3 — Accedi all'interfaccia

Apri la tua applicazione e visita:

| Pagina | URL | Nome della route |
|---|---|---|
| Lingue | `your-app.test/lingua/languages` | `lingua.languages` |
| Traduzioni | `your-app.test/lingua/translations` | `lingua.translations` |
| Statistiche | `your-app.test/lingua/statistics` | `lingua.statistics` |
| Transfer | `your-app.test/lingua/transfer` | `lingua.transfer` |
| Impostazioni | `your-app.test/lingua/settings` | `lingua.settings` |

Tutto qui. Lingua è operativo.

---

## Installazione manuale

Se preferisci pubblicare ed eseguire ogni passo singolarmente:

```bash
# 1. Pubblica la configurazione
php artisan vendor:publish --tag="lingua-config"

# 2. Pubblica le migrazioni (driver-aware)
php artisan vendor:publish --tag="lingua-migrations"

# 3. Esegui le migrazioni
php artisan migrate

# 4. Aggiungi la lingua predefinita e popola le sue traduzioni
php artisan lingua:add en
```

Consulta [Pubblicazione degli asset](/it/guide/publishing) per l'elenco
completo dei tag.

---

## Proteggere l'interfaccia di gestione

<Badge type="tip" text="Novità in 2.0" /> Lingua 2.0 è **sicuro per
impostazione predefinita**. Le route di gestione vengono consegnate con il
middleware `['web', 'auth']` applicato automaticamente — i visitatori anonimi
non possono accedere all'interfaccia.

### Limitare l'accesso con un gate

Per l'accesso basato sui ruoli, definisci un gate di autorizzazione e punta
Lingua su di esso con la variabile d'ambiente `LINGUA_GATE`. Lingua aggiunge
`can:{gate}` alle sue route admin:

```env
LINGUA_GATE=manage-translations
```

```php
// app/Providers/AppServiceProvider.php — boot()
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $user) => $user->hasRole('admin'));
```

Puoi anche modificare direttamente l'array middleware:

```php
// config/lingua.php
'middleware' => ['web', 'auth', 'role:admin'],
```

::: tip
Qualsiasi middleware accettato dal router di Laravel può essere aggiunto
all'array. Le modifiche hanno effetto immediato — non è necessario svuotare
la cache.
:::

Consulta il [riferimento sulla sicurezza](/it/guide/security) per la
panoramica completa dell'hardening.

---

## Checklist post-installazione

- [ ] Conferma che il driver di archiviazione in `config/lingua.php` corrisponda
      al tuo deployment (`database` o `file`)
- [ ] Imposta opzionalmente `LINGUA_GATE` per l'accesso basato sui ruoli
- [ ] Aggiungi il componente selettore di lingua al tuo layout (vedi
      [Selettore di lingua](/it/features/language-selector))
- [ ] Imposta `dir` e `lang` sul tag `<html>` (vedi
      [Supporto RTL/LTR](/it/features/rtl-support))
- [ ] Aggiungi lingue aggiuntive tramite `php artisan lingua:add {locale}`
- [ ] Configura la barra degli strumenti dell'editor in `config/lingua.php`
      se usi traduzioni HTML/Markdown (driver database)
