# Archiviazione delle traduzioni

Capire come vengono archiviate le traduzioni ti aiuta a interrogarle, importarle ed esportarle correttamente.

## La tabella `language_lines`

Ogni riga in `language_lines` rappresenta una **stringa** traducibile - non una locale. Tutti i valori delle locale sono memorizzati insieme in un'unica colonna JSON `text`:

```
group      | key        | type | text
-----------|------------|------|---------------------------------------------------
validation | required   | text | {"en":"The :attribute field is required.","fr":"Le champ :attribute est obligatoire."}
auth       | failed     | text | {"en":"These credentials do not match.","it":"Le credenziali non corrispondono."}
single     | Welcome    | text | {"en":"Welcome","fr":"Bienvenue","de":"Willkommen"}
emails     | subject    | html | {"en":"<b>Welcome</b> to our platform!"}
```

### Vantaggi di questo design

- **Una riga per stringa** - nessuna riga per-locale da gestire
- **Aggiungere una locale è non distruttivo** - basta aggiungere una nuova chiave all'oggetto JSON
- **Le traduzioni mancanti sono esplicite** - se `fr` è assente dal JSON, la stringa non è ancora tradotta
- **Query singola** - una `SELECT` recupera tutti i valori per ogni locale di una chiave

### Interrogazione diretta

Puoi interrogare `language_lines` usando la sintassi standard Eloquent per colonne JSON:

```php
use Rivalex\Lingua\Models\Translation;

// Tutte le traduzioni con un valore in francese
Translation::whereNotNull('text->fr')->get();

// Solo le traduzioni francesi mancanti
Translation::whereNull('text->fr')->get();

// Trova una chiave specifica
Translation::where('key', 'required')->where('group', 'validation')->first();

// Tutte le stringhe in un gruppo
Translation::where('group', 'auth')->get();
```

## Tipi di traduzione

Ogni riga di traduzione ha un `type` che determina l'editor usato nell'interfaccia:

| Tipo | Caso d'uso | Rilevamento automatico durante la sincronizzazione |
|---|---|---|
| `text` | Etichette semplici, messaggi, testo dei pulsanti | Default |
| `html` | Contenuto ricco con tag HTML | La stringa contiene elementi HTML |
| `markdown` | Contenuto formattato in Markdown | La stringa viene analizzata come Markdown |

Il rilevamento del tipo viene eseguito durante `lingua:sync-to-database`. Puoi cambiare il tipo in qualsiasi momento tramite la modale di modifica nell'interfaccia.

### Esempio: traduzione HTML

```php
Translation::create([
    'group' => 'marketing',
    'key'   => 'hero_subtitle',
    'type'  => 'html',
    'text'  => ['en' => '<strong>Build faster</strong> with fewer tools.'],
]);
```

### Esempio: traduzione Markdown

```php
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_body',
    'type'  => 'markdown',
    'text'  => ['en' => "# Welcome!\n\nThank you for signing up.\n\n**Your account is now active.**"],
]);
```

## Chiavi di traduzione

Lingua usa la stessa convenzione `group.key` in due parti delle traduzioni standard di Laravel:

| Formato | Esempio | Chiamata `trans()` |
|---|---|---|
| Chiave file PHP | `auth.failed` | `__('auth.failed')` |
| Chiave JSON / singola | `Welcome` | `__('Welcome')` |
| Chiave vendor | `spatie::messages.error` | tramite namespace vendor |

::: tip group vs. key
La colonna `group` corrisponde al nome del file (`auth` = `lang/en/auth.php`) e la `key` corrisponde alla chiave dell'array all'interno di quel file. Per i file JSON, il gruppo è `'single'`.
:::

## Traduzioni vendor

Le traduzioni vendor sono contrassegnate con `is_vendor = true` e portano una stringa `vendor` (es. `'spatie'`, `'laravel'`). Vengono sincronizzate dalle directory `lang/vendor/{vendor}/{locale}/`.

- Possono essere **modificate** nell'interfaccia (per sovrascrivere il testo del vendor)
- **Non possono essere eliminate** - il tentativo di farlo genera l'evento `vendor_translation_protected`
- I campi `group` e `key` sono **bloccati** nella modale di aggiornamento

Vedi [Traduzioni Vendor](/it/features/vendor-translations) per tutti i dettagli.
