# Comandi Artisan

Lingua include sei comandi Artisan per la gestione delle lingue e delle traduzioni da terminale.

## Gestione delle lingue

### `lingua:add {locale}`

Installa una nuova lingua — scarica i file, crea il record DB, sincronizza le traduzioni.

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**Cosa fa:**
1. Recupera i metadati della locale da `laravel-lang/locales`
2. Esegue `lang:add {locale}` per installare i file della lingua
3. Crea un record `Language` nel database
4. Esegue `lingua:sync-to-database` per importare le nuove stringhe

**Output:**
```
Adding language: it...
Installing language files via Laravel Lang...
Creating language record in database...
Syncing translations to database...
Language 'it' added successfully.
```

::: tip
Dopo aver aggiunto una lingua, visita `/lingua/translations/it` per vedere quali stringhe necessitano ancora di traduzione.
:::

---

### `lingua:remove {locale}`

Rimuove una lingua — elimina i file, pulisce il database, riordina le lingue rimanenti.

```bash
php artisan lingua:remove fr
```

**Cosa fa:**
1. Verifica che la lingua non sia quella predefinita (interrompe con un errore se lo è)
2. Esegue `lang:rm {locale} --force` per rimuovere i file della lingua
3. Rimuove tutti i valori `{locale}` da `language_lines.text`
4. Elimina il record `Language`
5. Riordina i valori di ordinamento delle lingue rimanenti
6. Esegue `lingua:sync-to-database`

::: warning Protezione della lingua predefinita
Non puoi rimuovere la lingua predefinita. Imposta prima un'altra lingua come predefinita:
```bash
php artisan lingua:add fr       # aggiungi la nuova predefinita
# poi tramite l'interfaccia: imposta il francese come predefinito
php artisan lingua:remove en    # ora è sicuro rimuovere l'inglese
```
:::

---

### `lingua:update-lang`

Aggiorna tutti i file della lingua installati tramite Laravel Lang, poi risincronizza nel database.

```bash
php artisan lingua:update-lang
```

Esegui questo dopo:
- Aver aggiornato Laravel (nuovi messaggi di validazione, ecc.)
- Aver installato un nuovo pacchetto che include traduzioni
- Aver aggiornato i pacchetti `laravel-lang/*`

---

## Sincronizzazione delle traduzioni

### `lingua:sync-to-database`

Importa tutti i file di traduzione PHP/JSON locali nella tabella `language_lines`.

```bash
php artisan lingua:sync-to-database
```

**Cosa viene importato:**
- `lang/{locale}/*.php` — file PHP
- `lang/{locale}.json` — file JSON
- `lang/vendor/{package}/{locale}/*.php` — file dei pacchetti vendor

Usa `updateOrCreate` abbinando su `group + key`, quindi le modifiche esistenti dall'interfaccia vengono preservate.

**Casi d'uso tipici:**
```bash
# Dopo un clone fresco — popola il DB dai file lang committati
php artisan lingua:sync-to-database

# Dopo lang:update — importa le nuove stringhe
php artisan lingua:sync-to-database

# In uno script di deployment
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
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

**Casi d'uso tipici:**
```bash
# Prima del commit — esporta lo stato DB nei file per il controllo versione
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"

# Prima del deployment su un server che legge dai file
php artisan lingua:sync-to-local
```

---

### `lingua:install`

La procedura guidata interattiva per la prima configurazione. Eseguire una volta dopo `composer require`.

```bash
php artisan lingua:install
```

Non è pensata per essere rieseguita dopo la configurazione iniziale. Se hai bisogno di ripubblicare singoli asset, usa invece i tag `vendor:publish`.

---

## Riferimento rapido comandi

<div class="command-table">

| Comando | Descrizione |
|---|---|
| `lingua:add {locale}` | Installa una lingua (file + DB + sincronizzazione) |
| `lingua:remove {locale}` | Rimuove una lingua (file + DB + sincronizzazione) |
| `lingua:update-lang` | Aggiorna i file lang tramite Laravel Lang + sincronizzazione |
| `lingua:sync-to-database` | Importa i file locali → database |
| `lingua:sync-to-local` | Esporta database → file locali |
| `lingua:install` | Procedura guidata interattiva per la prima configurazione |

</div>

---

## Consigli

::: tip Automatizzare la sincronizzazione in CI/CD
Aggiungi la sincronizzazione alla tua pipeline di deployment per mantenere il database sincronizzato con il tuo repository:

```yaml
# Passo di deployment GitHub Actions (esempio)
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::

::: tip Aggiungere più lingue in una volta
Non esiste un comando di aggiunta in blocco, ma puoi concatenare le chiamate in un loop shell:

```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::

::: tip Verificare cosa verrà sincronizzato
Prima di eseguire `lingua:sync-to-database`, puoi visualizzare in anteprima il numero di file e locale che verranno elaborati controllando `lang/`:

```bash
ls lang/
# en  fr  it  vendor
```
:::
