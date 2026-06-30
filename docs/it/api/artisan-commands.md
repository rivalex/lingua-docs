# Comandi Artisan

Lingua include otto comandi Artisan per la gestione delle lingue, delle
traduzioni, del driver di archiviazione e del ciclo di vita dell'installazione.

## Gestione delle lingue

### `lingua:add {locale}`

Installa una nuova lingua — popola dal dataset integrato, crea il record DB,
sincronizza le traduzioni.

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**Cosa fa:**

1. Recupera i metadati della locale dal `LocaleRegistry` integrato
2. Crea un record `Language` nel database
3. Popola le stringhe dal **dataset integrato** (nessun download da internet)
4. Esegue `lingua:sync-to-database` per importare le nuove stringhe

::: tip <Badge type="tip" text="Modificato in 2.0" /> Nessuna dipendenza da laravel-lang
`lingua:add` non chiama più `lang:add` da `laravel-lang/common`. Le locale
vengono popolate istantaneamente dal dataset integrato del pacchetto.
:::

---

### `lingua:remove {locale}`

Rimuove una lingua — elimina i file, pulisce il database, riordina le lingue
rimanenti.

```bash
php artisan lingua:remove fr
```

**Cosa fa:**

1. Verifica che la lingua non sia quella predefinita (interrompe con un errore
   se lo è)
2. Rimuove tutti i valori `{locale}` da `language_lines.text`
3. Elimina il record `Language`
4. Riordina i valori `sort` delle lingue rimanenti

::: warning Protezione della lingua predefinita
Non puoi rimuovere la lingua predefinita. Imposta prima un'altra lingua come
predefinita tramite l'interfaccia, poi rimuovi quella precedente.
:::

---

### `lingua:update-lang`

Ri-popola le locale installate dal dataset integrato (5902 stringhe, 26
locale, allineate a Laravel v13.14.0). Poi unisce dall'eventuale `lang/`
locale.

```bash
php artisan lingua:update-lang
```

Esegui questo dopo aver aggiornato Lingua o installato un nuovo pacchetto
che include le proprie traduzioni.

---

## Sincronizzazione delle traduzioni

### `lingua:sync-to-database`

Importa tutti i file di traduzione PHP/JSON locali nella tabella
`language_lines`.

```bash
php artisan lingua:sync-to-database
```

**Cosa viene importato:**

- `lang/{locale}/*.php` — file PHP
- `lang/{locale}.json` — file JSON
- `lang/vendor/{package}/{locale}/*.php` — file dei pacchetti vendor

Usa `updateOrCreate` abbinando su `group + key`, quindi le modifiche
esistenti dall'interfaccia vengono preservate.

```bash
# Esempi tipici
php artisan lingua:sync-to-database           # dopo un clone fresco
php artisan migrate && php artisan lingua:sync-to-database  # in un deploy
```

---

### `lingua:sync-to-local`

Esporta tutte le traduzioni del database nei file PHP/JSON locali.

```bash
php artisan lingua:sync-to-local
```

**Cosa viene esportato:**

- Traduzioni DB → `lang/{locale}/{group}.php`
- Gruppo JSON (`single`) → `lang/{locale}.json`
- Traduzioni vendor → `lang/vendor/{vendor}/{locale}/{group}.php`

```bash
# Prima del commit — esporta per il controllo versione
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"
```

::: warning Driver file
In modalità di archiviazione `file` questo comando è un no-op senza
`--force` — la modalità file scrive già su disco.
:::

---

## Installazione e configurazione

### `lingua:install`

Procedura guidata interattiva per la prima configurazione. Eseguire una volta
dopo `composer require`.

```bash
php artisan lingua:install
```

Il programma di installazione chiede:

1. **Driver di archiviazione** — `database` o `file`
2. **Pubblica le migrazioni** (driver-aware: `file` salta `language_lines`)
3. **Esegui `php artisan migrate`**
4. **Locale predefinita** (con `lingua:add {locale}`)
5. **Gate di autorizzazione** (facoltativo)

Non è pensata per essere rieseguita dopo la configurazione iniziale. Per
ripubblicare singoli asset usa invece `vendor:publish`.

---

### `lingua:storage {driver}`

<Badge type="tip" text="Novità in 2.0" /> Cambia il driver di archiviazione
attivo. Sincronizza automaticamente prima di cambiare driver così nessuna
traduzione viene persa.

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```

| Opzione | Descrizione |
|---|---|
| `--force` | Salta le conferme |
| `--write-env` | Aggiorna `LINGUA_STORAGE_DRIVER` in `.env` |
| `--no-migrate` | Salta il passaggio di verifica migrazione |

---

### `lingua:uninstall`

<Badge type="tip" text="Novità in 2.0" /> Rimuove Lingua in modo sicuro:
esporta prima il database in `lang/`, poi elimina le tre tabelle Lingua.

```bash
php artisan lingua:uninstall
```

| Opzione | Descrizione |
|---|---|
| `--force` | Salta le conferme |
| `--keep-config` | Lascia `config/lingua.php` al suo posto |
| `--keep-published` | Lascia le viste/migrazioni pubblicate al loro posto |

---

## Riferimento rapido comandi

| Comando | Descrizione |
|---|---|
| `lingua:add {locale}` | Installa una lingua (dataset + DB + sincronizzazione) |
| `lingua:remove {locale}` | Rimuove una lingua (DB + riordinamento) |
| `lingua:update-lang` | Ri-popola le locale installate dal dataset integrato |
| `lingua:sync-to-database` | Importa i file locali → database |
| `lingua:sync-to-local` | Esporta database → file locali |
| `lingua:install` | Procedura guidata interattiva per la prima configurazione |
| `lingua:storage {driver}` | Cambia il driver di archiviazione (database/file) |
| `lingua:uninstall` | Rimuove Lingua in modo sicuro con backup |

---

## Consigli

::: tip Automatizzare la sincronizzazione in CI/CD

```yaml
# Passo di deployment GitHub Actions (esempio)
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::

::: tip Aggiungere più lingue in una volta

```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::
