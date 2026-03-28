# Componenti Blade

Lingua registra diversi componenti Blade anonimi con il prefisso `lingua::`. Vengono usati internamente dalle viste Livewire e possono essere riutilizzati anche nei tuoi template.

## `<x-lingua::editor>`

Un componente editor polimorfico che renderizza un `<textarea>`, un editor HTML TipTap o un editor Markdown TipTap in base alla prop `type`.

```blade
{{-- Testo semplice --}}
<x-lingua::editor
    wire:model="value"
    type="text"
    placeholder="Inserisci testo…"
/>

{{-- HTML --}}
<x-lingua::editor
    wire:model="value"
    type="html"
    label="Contenuto del corpo"
    :required="true"
/>

{{-- Markdown --}}
<x-lingua::editor
    wire:model="value"
    type="markdown"
    placeholder="Scrivi in Markdown…"
/>
```

### Props

| Prop | Tipo | Default | Descrizione |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'` o `'markdown'` |
| `label` | string | `''` | Etichetta opzionale sopra il campo |
| `placeholder` | string | `''` | Testo segnaposto |
| `required` | bool | `false` | Mostra un badge richiesto |
| `wire:model` | - | - | Collegamento al modello Livewire |

---

## `<x-lingua::clipboard>`

Un wrapper che aggiunge un pulsante copia-negli-appunti attorno al contenuto del suo slot.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

Cliccando il componente si copia `text-to-copy` negli appunti e viene brevemente mostrato un segno di spunta.

### Props

| Prop | Tipo | Descrizione |
|---|---|---|
| `text-to-copy` | string | Il testo da copiare negli appunti |
| `show-tooltip` | bool | Mostra un tooltip al passaggio del mouse (default: `false`) |

---

## `<x-lingua::language-flag>`

Renderizza un'icona bandiera e il nome della lingua per una data locale.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

### Props

| Prop | Tipo | Descrizione |
|---|---|---|
| `name` | string | Nome della lingua in inglese |
| `code` | string | Codice locale per la ricerca della bandiera |
| `description` | string | Nome nativo della lingua (sottotitolo) |

Usa `outhebox/blade-flags` per gli SVG delle bandiere. Se non è disponibile alcuna bandiera per il codice, fa il fallback in modo sicuro al testo del codice.

---

## `<x-lingua::message>`

Un componente di messaggio transitorio che appare per una breve durata dopo un evento Livewire.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

### Props

| Prop | Tipo | Default | Descrizione |
|---|---|---|---|
| `on` | string | - | Nome dell'evento Livewire da ascoltare |
| `delay` | int | `1500` | Durata in millisecondi prima di nascondersi |

---

## `<x-lingua::autocomplete>`

Un componente di input di testo con autocompletamento usato nel form di creazione delle traduzioni.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="es. marketing"
/>
```

### Props

| Prop | Tipo | Descrizione |
|---|---|---|
| `wire:model` | - | Collegamento al modello Livewire |
| `suggestions` | array | Array di suggerimenti per l'autocompletamento |
| `placeholder` | string | Segnaposto dell'input |

---

## `<x-lingua::menu-group>`

Un componente gruppo di navigazione per i menu della sidebar.

```blade
<x-lingua::menu-group heading="Languages">
    {{-- slot degli elementi del menu --}}
</x-lingua::menu-group>
```

### Props

| Prop | Tipo | Descrizione |
|---|---|---|
| `heading` | string | Testo dell'intestazione del gruppo |

---

## Personalizzare i componenti

Pubblica tutte le viste dei componenti per sovrascriverle:

```bash
php artisan vendor:publish --tag="lingua-views"
```

Le viste pubblicate si trovano in `resources/views/vendor/lingua/components/`. Laravel usa automaticamente la tua versione pubblicata.
