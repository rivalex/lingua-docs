# Pubblicazione degli asset

Lingua include diversi gruppi pubblicabili così puoi sovrascrivere solo le parti di cui hai bisogno.

## Pubblica tutto in una volta

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## Tag individuali

### `lingua-config`

Pubblica il file di configurazione.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Output:** `config/lingua.php`

Usalo per personalizzare route, middleware, modalità del selettore, barra degli strumenti dell'editor o qualsiasi altra opzione.

---

### `lingua-migrations`

Pubblica le migrazioni del database.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

**Output:** `database/migrations/YYYY_MM_DD_HHMMSS_create_lingua_table.php`

Usalo se devi modificare lo schema di `languages` o `language_lines` — ad esempio per aggiungere indici o cambiare i tipi di colonna. Dopo la pubblicazione, esegui `php artisan migrate` come al solito.

::: warning
La procedura guidata `lingua:install` pubblica ed esegue le migrazioni automaticamente. Pubblica manualmente solo se devi personalizzare lo schema prima di eseguirle.
:::

---

### `lingua-translations`

Pubblica le stringhe di traduzione dell'interfaccia del pacchetto.

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Output:** `lang/vendor/lingua/{locale}/lingua.php`

Questo espone ogni etichetta, intestazione, pulsante e messaggio usato nell'interfaccia di Lingua. Sovrascrivi qualsiasi stringa per:
- Tradurre l'interfaccia nella lingua della tua applicazione
- Adattare il testo allo stile del tuo progetto (es. "Add language" → "Install locale")

I file pubblicati seguono la struttura standard delle traduzioni vendor di Laravel:

```
lang/
└── vendor/
    └── lingua/
        ├── en/
        │   └── lingua.php
        ├── fr/
        │   └── lingua.php
        └── it/
            └── lingua.php
```

---

### `lingua-views`

Pubblica tutte le viste Blade e Livewire.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Output:** `resources/views/vendor/lingua/`

Usalo per personalizzare layout, modali o il componente del selettore di lingua. Laravel usa automaticamente le tue viste pubblicate al posto di quelle predefinite del pacchetto.

```
resources/views/vendor/lingua/
├── components/
│   ├── autocomplete.blade.php
│   ├── clipboard.blade.php
│   ├── editor.blade.php
│   ├── language-flag.blade.php
│   ├── menu-group.blade.php
│   └── message.blade.php
└── livewire/
    ├── languages.blade.php
    ├── language-selector.blade.php
    ├── translations.blade.php
    └── translation/
        ├── create.blade.php
        ├── delete.blade.php
        ├── row.blade.php
        └── update.blade.php
```

::: tip
Pubblica solo le viste che intendi modificare. Le viste non pubblicate vengono servite direttamente dal pacchetto e ricevono automaticamente gli aggiornamenti upstream.
:::

---

### `lingua-assets`

Pubblica CSS e JavaScript compilati in `public/`.

```bash
php artisan vendor:publish --tag="lingua-assets"
```

**Output:** `public/vendor/lingua/`

Necessario solo se servi gli asset direttamente da `public/` anziché tramite Vite o una CDN. **Riesegui dopo ogni aggiornamento di Lingua** per mantenere gli asset sincronizzati.

---

## Aggiornamento dopo gli upgrade

Dopo aver aggiornato Lingua tramite Composer, ripubblica gli asset modificati:

```bash
# Ripubblica sempre gli asset compilati
php artisan vendor:publish --tag="lingua-assets" --force

# Ripubblica le traduzioni dell'interfaccia se non le hai personalizzate
php artisan vendor:publish --tag="lingua-translations" --force
```

Il flag `--force` sovrascrive i file esistenti. Omettilo per `lingua-views` e `lingua-config` per preservare le tue personalizzazioni locali.
