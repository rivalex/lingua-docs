# Impostazioni

La pagina Impostazioni ti permette di configurare il comportamento UI di Lingua dal browser — nessuna modifica ai file di configurazione o ridistribuzione necessaria.

Naviga a `/lingua/settings` o collega dal tuo pannello di amministrazione:

```blade
<a href="{{ route('lingua.settings') }}">Impostazioni Lingua</a>
```

<Screenshot src="/screenshots/settings-page.png" alt="Pagina Impostazioni Lingua" caption="La pagina delle impostazioni con i controlli per la modalità selettore e le icone bandiera." />

## Come funzionano le impostazioni

Le impostazioni sono memorizzate nella tabella del database `lingua_settings` come coppie chiave/valore tipizzate. Ad ogni richiesta, Lingua legge prima dal database, poi ricade su `config/lingua.php`, poi sui valori predefiniti hardcodati.

**Catena di priorità:**
1. Tabella DB `lingua_settings` (massima priorità — impostata tramite questa UI)
2. `config/lingua.php` (la tua configurazione pubblicata)
3. Valori predefiniti del pacchetto (minima priorità)

Puoi mantenere il tuo `config/lingua.php` come base e sovrascrivere impostazioni specifiche per ambiente tramite l'UI senza toccare i file.

## Modalità selettore

Controlla come il componente `<livewire:lingua::language-selector />` si renderizza per i tuoi utenti finali.

| Modalità | Descrizione |
|---|---|
| `sidebar` | Si renderizza come sezione di navigazione raggruppata (default) |
| `modal` | Si renderizza come pulsante che apre un modal completo per la selezione della lingua |
| `dropdown` | Si renderizza come pulsante dropdown compatto |
| `headless` | Nessun rendering integrato — implementi tu stesso l'UI |

::: tip Modalità headless
Quando impostata su `headless`, il selettore integrato non renderizza nulla. Usa invece `<livewire:lingua::headless-language-selector />` per costruire uno switcher completamente personalizzato. Vedi [Selettore Headless](./language-selector#modalità-headless) per la documentazione completa.
:::

## Mostra icone bandiera

Attiva o disattiva la visualizzazione delle icone di bandiera dei paesi accanto ai nomi delle lingue nel selettore. Quando disabilitato, viene mostrato solo il nome della lingua.

Le icone bandiera sono abbinate al codice `regional` della lingua (es. `en_US` → 🇺🇸). Se non è impostato nessun codice regionale, la bandiera ricade elegantemente.

## Accesso programmatico

Puoi leggere e scrivere impostazioni in PHP usando il modello `LinguaSetting`:

```php
use Rivalex\Lingua\Models\LinguaSetting;

// Lettura con fallback config()
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

$showFlags = LinguaSetting::get(
    LinguaSetting::KEY_SHOW_FLAGS,
    config('lingua.selector.show_flags', true)
);

// Scrittura
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_SHOW_FLAGS, false);
```

Costanti disponibili:

| Costante | Chiave | Tipo |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |

::: warning Migrazione richiesta
La tabella `lingua_settings` è creata dalla migrazione `create_lingua_settings_table`. Se hai aggiornato dalla versione 1.0.x, esegui `php artisan migrate` per crearla.
:::
