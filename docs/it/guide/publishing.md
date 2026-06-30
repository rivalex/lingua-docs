# Pubblicazione degli asset

Lingua include diversi gruppi pubblicabili così puoi sovrascrivere solo le
parti di cui hai bisogno.

## Pubblica tutto in una volta

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## Tag disponibili

### `lingua-config`

Pubblica il file di configurazione.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Output:** `config/lingua.php`

Usalo per personalizzare route, middleware, driver di archiviazione, modalità
del selettore, toolbar dell'editor, cache o qualsiasi altra opzione. Vedi
[Configurazione](/it/guide/configuration).

---

### `lingua-migrations`

Pubblica le migrazioni del database.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

<Badge type="tip" text="Novità in 2.0" /> Le migrazioni sono ora
**driver-aware** e suddivise in tre file separati:

| Migrazione | Pubblicata per |
|---|---|
| `create_language_lines_table` | Solo driver database |
| `create_languages_table` | Entrambi i driver |
| `create_lingua_settings_table` | Entrambi i driver |

Il driver `file` salta `create_language_lines_table`. La procedura guidata
`lingua:install` pubblica il set corretto per il driver scelto, quindi questo
tag è necessario solo se vuoi personalizzare lo schema prima di eseguire le
migrazioni.

::: warning
La procedura guidata `lingua:install` pubblica ed esegue le migrazioni
automaticamente. Pubblica manualmente solo se devi personalizzare lo schema
prima.
:::

---

### `lingua-translations`

Pubblica le stringhe di traduzione dell'interfaccia del pacchetto (9 locale UI).

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Output:** `lang/vendor/lingua/{locale}/lingua.php`

Sovrascrivi qualsiasi etichetta, intestazione, pulsante o messaggio usato
nell'interfaccia di Lingua per tradurre l'interfaccia o adattare il testo
allo stile del tuo progetto.

```
lang/
└── vendor/
    └── lingua/
        ├── en/lingua.php
        ├── fr/lingua.php
        └── it/lingua.php
```

---

### `lingua-views`

Pubblica tutte le viste Blade e Livewire.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Output:** `resources/views/vendor/lingua/`

Usalo per personalizzare layout, modali o il selettore di lingua. Laravel usa
automaticamente le tue viste pubblicate al posto di quelle predefinite del
pacchetto.

::: tip
Pubblica solo le viste che intendi modificare. Le viste non pubblicate vengono
servite direttamente dal pacchetto e ricevono automaticamente gli aggiornamenti
upstream.
:::

---

### `lingua-assets` (rimosso) <Badge type="warning" text="Rimosso in 2.0" />

Il tag di pubblicazione `lingua-assets` **non esiste più**. In 2.0, i CSS/JS
compilati di Lingua vengono serviti internamente tramite la route
`lingua.assets` (dietro una jail realpath — vedi
[Sicurezza](/it/guide/security#sicurezza-degli-asset)). Non c'è nulla da
pubblicare o copiare in `public/`, e nulla da ripubblicare dopo un
aggiornamento.

---

## Aggiornamento dopo gli upgrade

Dopo aver aggiornato Lingua tramite Composer, ripubblica le traduzioni UI se
non le hai personalizzate e unisci le nuove chiavi di configurazione:

```bash
# Ripubblica le traduzioni UI (sovrascrive)
php artisan vendor:publish --tag="lingua-translations" --force

# Ripubblica la configurazione per prendere le nuove chiavi, poi unisci manualmente
php artisan vendor:publish --tag="lingua-config" --force
```

Il flag `--force` sovrascrive i file esistenti. Omettilo per `lingua-views`
e `lingua-config` per preservare le tue personalizzazioni locali, e unisci
le nuove chiavi a mano. Vedi la [guida all'aggiornamento](/it/guide/upgrade)
per la checklist completa dalla versione 1.x alla 2.0.
