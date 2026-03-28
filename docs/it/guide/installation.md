# Installazione

Lingua include una procedura guidata di installazione interattiva che gestisce tutto in un unico comando. I passaggi manuali sono documentati di seguito se preferisci un maggiore controllo.

## Passo 1 — Installa tramite Composer

```bash
composer require rivalex/lingua
```

## Passo 2 — Esegui il programma di installazione

```bash
php artisan lingua:install
```

La procedura guidata:

1. Pubblica il file di configurazione in `config/lingua.php`
2. Pubblica le migrazioni del database
3. Chiede se eseguire le migrazioni automaticamente
4. Popola il database con la tua lingua predefinita (inglese di default) e tutte le sue traduzioni da Laravel Lang
5. Opzionalmente aggiunge una stella al repository su GitHub ⭐

Al termine vedrai:

```
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua package installed successfully!
```

## Passo 3 — Accedi all'interfaccia

Apri la tua applicazione e visita:

| Pagina | URL | Nome della route |
|---|---|---|
| Lingue | `your-app.test/lingua/languages` | `lingua.languages` |
| Traduzioni | `your-app.test/lingua/translations` | `lingua.translations` |

Tutto qui. Lingua è operativo.

---

## Installazione manuale

Se preferisci pubblicare ed eseguire ogni passo singolarmente:

```bash
# 1. Pubblica la configurazione
php artisan vendor:publish --tag="lingua-config"

# 2. Pubblica le migrazioni
php artisan vendor:publish --tag="lingua-migrations"

# 3. Esegui le migrazioni
php artisan migrate

# 4. Popola la lingua predefinita + traduzioni
php artisan db:seed --class="Rivalex\Lingua\Database\Seeders\LinguaSeeder"
```

---

## Proteggere l'interfaccia di gestione

Per impostazione predefinita, le route di Lingua usano solo il middleware `web` — nessun guard di autenticazione viene applicato automaticamente. **Dovresti aggiungere il tuo middleware** prima di andare in produzione.

### Tramite la configurazione

```php
// config/lingua.php
'middleware' => ['web', 'auth'],
```

### Con guard di ruolo/permesso (es. Spatie Permission)

```php
'middleware' => ['web', 'auth', 'role:admin'],
// oppure
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

::: tip
Qualsiasi middleware accettato dal router di Laravel può essere aggiunto all'array. Le modifiche hanno effetto immediato — non è necessario svuotare la cache.
:::

---

## Checklist post-installazione

- [ ] Aggiungi il middleware di autenticazione a `config/lingua.php`
- [ ] Aggiungi il componente di selezione lingua al tuo layout (vedi [Selettore di lingua](/it/features/language-selector))
- [ ] Imposta `dir` e `lang` sul tag `<html>` (vedi [Supporto RTL/LTR](/it/features/rtl-support))
- [ ] Aggiungi lingue aggiuntive tramite `php artisan lingua:add {locale}`
- [ ] Configura la barra degli strumenti dell'editor in `config/lingua.php` se usi traduzioni HTML/Markdown
