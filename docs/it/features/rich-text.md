# Editor di testo ricco

Lingua incorpora [TipTap 3](https://tiptap.dev) come editor di testo ricco opzionale per i tipi di traduzione HTML e Markdown. L'editor corretto si attiva automaticamente in base alla colonna `type` della traduzione.

## Tipi di traduzione

| Tipo | Editor | Descrizione |
|---|---|---|
| `text` | `<textarea>` semplice | Default per tutte le traduzioni standard |
| `html` | TipTap WYSIWYG | Per contenuto che deve essere renderizzato con formattazione HTML |
| `markdown` | TipTap Markdown | Per contenuto scritto in sintassi Markdown |

## Configurare la barra degli strumenti

La barra degli strumenti dell'editor è controllata globalmente tramite `config/lingua.php`:

```php
'editor' => [
    'headings'      => false,  // Pulsanti titoli H1-H3
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'bullet'        => true,   // Elenco non ordinato
    'ordered'       => true,   // Elenco ordinato
    'clear'         => true,   // Rimuovi formattazione
],
```

Abilita solo le opzioni di cui il tuo contenuto ha effettivamente bisogno. Mantenere la barra degli strumenti minimale riduce il carico cognitivo per i traduttori.

<Screenshot src="/screenshots/editor-toolbar.png" alt="Barra degli strumenti dell'editor" caption="La barra degli strumenti dell'editor HTML con le opzioni predefinite attive." />

## Cambiare il tipo di una traduzione

Nella modale di modifica (icona a matita, solo locale predefinita), seleziona il tipo desiderato dal menu a tendina **Tipo**. L'editor si aggiorna immediatamente sulla riga senza ricaricare la pagina.

::: tip Rilevamento automatico
Quando esegui per la prima volta `lingua:sync-to-database`, Lingua rileva automaticamente il tipo in base al contenuto. Puoi sovrascriverlo manualmente in qualsiasi momento - il valore memorizzato non cambia quando cambi il tipo, cambia solo il comportamento dell'editor.
:::

## Lavorare con le traduzioni HTML

Le traduzioni HTML vengono memorizzate come HTML grezzo nella colonna JSON `text`:

```json
{"en": "<p>Welcome to <strong>Lingua</strong> - the translation manager for Laravel.</p>"}
```

Per renderizzarle in Blade senza doppia codifica:

```blade
{{-- Usa sempre {!! !!} per i tipi di traduzione HTML --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
Usa `{!! !!}` solo per le stringhe di traduzione gestite da utenti autorizzati in un pannello admin controllato. Non renderizzare mai input utente non attendibile come HTML grezzo.
:::

## Lavorare con le traduzioni Markdown

Le traduzioni Markdown memorizzano Markdown grezzo:

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**.\n\n- Feature one\n- Feature two"}
```

Per renderizzare Markdown in Blade, usa un parser Markdown. Laravel include `Str::markdown()`:

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

Oppure usa un pacchetto dedicato come [league/commonmark](https://commonmark.thephpleague.com).

## Il componente `x-lingua::editor`

L'editor è esposto come componente Blade riutilizzabile al di fuori dell'interfaccia di gestione di Lingua:

```blade
{{-- Modalità text --}}
<x-lingua::editor
    wire:model="myField"
    type="text"
    placeholder="Inserisci testo…"
/>

{{-- Modalità HTML --}}
<x-lingua::editor
    wire:model="myField"
    type="html"
    label="Contenuto del corpo"
    :required="true"
/>

{{-- Modalità Markdown --}}
<x-lingua::editor
    wire:model="myField"
    type="markdown"
    placeholder="Scrivi in Markdown…"
/>
```

### Props

| Prop | Tipo | Descrizione |
|---|---|---|
| `wire:model` | string | Proprietà Livewire a cui collegarsi |
| `type` | string | `'text'`, `'html'` o `'markdown'` |
| `label` | string | Etichetta opzionale sopra l'editor |
| `placeholder` | string | Testo segnaposto |
| `required` | bool | Mostra un badge richiesto quando `true` |

::: tip
Il componente `x-lingua::editor` è un ottimo punto di partenza per qualsiasi form Livewire che necessita di un campo di testo ricco. Pubblica la vista del componente per personalizzare la barra degli strumenti o lo stile.
:::
