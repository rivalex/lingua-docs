# Impostazioni

La pagina Impostazioni (`/lingua/settings`) controlla la configurazione
runtime senza toccare i file. Le modifiche vengono salvate nella tabella
`lingua_settings` e applicate immediatamente senza riavviare nessun worker.

<Screenshot src="/screenshots/settings-page.png" alt="Pagina Impostazioni di Lingua" caption="Pagina Impostazioni — organizzata in card per categoria con toggle switch e selettori." />

## Come funzionano le impostazioni

Le impostazioni di Lingua hanno una **gerarchia a due livelli**:

1. **`config/lingua.php`** — impostazioni predefinite, lette all'avvio
   dell'applicazione
2. **`lingua_settings`** (DB) — override runtime; le righe presenti in questo
   store sovrascrivono i valori config

`LinguaSetting::get($key, $default)` risolve automaticamente la gerarchia.
I valori config non vengono mai modificati tramite l'interfaccia Impostazioni;
modificano solo il database.

::: tip
Le impostazioni runtime (DB) si azzerano se si cancella la tabella
`lingua_settings`. Per rendere un'impostazione permanente e indipendente dal
DB, modificala in `config/lingua.php`.
:::

## Menu di navigazione <Badge type="tip" text="Novità in 2.0" />

Lingua aggiunge un menu di navigazione condiviso in cima a ogni sua pagina
admin. La pagina corrente è evidenziata automaticamente.

Il toggle **Abilita menu di navigazione** nella sezione Routing e navigazione
controlla se il menu è visibile. Può anche essere impostato in config:

```php
// config/lingua.php
'nav' => ['enabled' => true],
```

Chiave nel DB: `LinguaSetting::KEY_NAV_ENABLED` (`'nav_enabled'`).

## Modalità del selettore di lingua

Controlla come appare il componente `<livewire:lingua::language-selector>`
nelle pagine rivolte agli utenti.

| Modalità | Comportamento |
|---|---|
| `sidebar` | Lista verticale per sidebar di navigazione |
| `dropdown` | Pulsante compatto con menu dropdown |
| `modal` | Pulsante che apre un overlay a schermo intero |
| `headless` | Nessuno stile, solo attributi `data-lingua-*` per CSS personalizzato |

Vedi [Selettore di lingua](/it/features/language-selector) per la
documentazione completa.

```php
// config/lingua.php
'selector' => ['mode' => 'dropdown'],
```

## Aspetto <Badge type="tip" text="Novità" />

Il CSS di Lingua usa una variante `dark:` basata su classe, quindi
normalmente segue l'ancestor `<html class="dark">` della tua app host. Se
l'app host non ha un toggle dark mode (o il suo stato non corrisponde alla
reale preferenza del sistema operativo), lo stile di Lingua può apparire
non stilizzato.

Il toggle **Forza modalità scura** fa sì che Lingua mostri sempre il
proprio tema scuro, indipendentemente dall'app host o dal sistema
operativo — utile quando integri Lingua in un'app host priva di supporto
dark mode, o durante lo sviluppo locale su un sistema in modalità chiara.

Il default equivalente in config:

```php
// config/lingua.php
'dark_mode' => ['force' => false],
```

Chiave nel DB: `LinguaSetting::KEY_DARK_MODE_FORCE` (`'dark_mode_force'`).

## Routing e navigazione

| Impostazione | Chiave config | Chiave DB | Descrizione |
|---|---|---|---|
| Driver di archiviazione | `storage.driver` | `storage_driver` | `database` o `file`. Cambia tramite `lingua:storage` o questo toggle |
| Naviga alla home dopo cambio lingua | `navigate` | `navigate` | Quando disabilitato, ricarica la pagina corrente |
| Abilita menu di navigazione | `nav.enabled` | `nav_enabled` | Mostra/nasconde il menu condiviso sulle pagine admin |

## Accesso programmatico

```php
use Rivalex\Lingua\Models\LinguaSetting;

// Lettura con fallback config()
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

$navEnabled = LinguaSetting::get(
    LinguaSetting::KEY_NAV_ENABLED,
    config('lingua.nav.enabled', true)
);

// Scrittura
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_NAV_ENABLED, false);
```

Costanti disponibili:

| Costante | Chiave | Tipo |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |
| `LinguaSetting::KEY_NAV_ENABLED` | `nav_enabled` | `bool` |
| `LinguaSetting::KEY_DARK_MODE_FORCE` | `dark_mode_force` | `bool` |

## Sicurezza e accesso

| Impostazione | Chiave config | Note |
|---|---|---|
| Gate di autorizzazione | `gate` | Impostato tramite env `LINGUA_GATE`; non modificabile dall'interfaccia |
| Stack middleware | `middleware` | Modificabile solo in config |

Vedi [Sicurezza](/it/guide/security#autenticazione) per i dettagli completi.

## Impostazioni avanzate

| Impostazione | Chiave config | Default |
|---|---|---|
| Prefisso route | `route_prefix` | `lingua` |
| Parametri extra route | `routes_extra_parameters` | `[]` |
| URL layout | `layout` | `null` (layout di Lingua) |
| URL colonna traduzioni | `links.translations` | `null` |
| Top sticky | `ui.sticky_top` | `true` |
| Store cache | `cache.store` | `null` (default app) |
| Prefisso cache | `cache.prefix` | `lingua` |

Vedi [Configurazione](/it/guide/configuration) per la documentazione completa
di tutte le chiavi.
