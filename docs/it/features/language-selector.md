# Selettore di lingua

Il componente `<livewire:lingua::language-selector>` è un selettore di locale incorporabile per i tuoi utenti finali - completamente separato dall'interfaccia di gestione admin.

## Utilizzo di base

```blade
<livewire:lingua::language-selector />
```

Aggiungilo ovunque nei tuoi layout Blade. Si renderizza usando la modalità configurata in `config/lingua.php` (`sidebar` di default).

## Modalità di visualizzazione

### Modalità sidebar (default)

Si renderizza come una sezione di navigazione raggruppata - ideale per le sidebar delle applicazioni costruite con Flux.

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/screenshots/selector-sidebar.png" alt="Selettore di lingua in modalità sidebar" caption="Modalità sidebar - mostra tutte le lingue installate come elementi di navigazione." width="320px" :center="true"/>

### Modalità dropdown

Si renderizza come un pulsante dropdown compatto - ideale per intestazioni e barre di navigazione.

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/screenshots/selector-dropdown.png" alt="Selettore di lingua in modalità dropdown" caption="Modalità dropdown - mostra la lingua corrente con un'icona bandiera." width="320px" :center="true"/>

### Modalità modal

Si renderizza come un pulsante che apre una modale completa per la selezione della lingua - ideale per un cambio di locale prominente nelle landing page o nei flussi di onboarding.

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/screenshots/selector-modal.png" alt="Selettore di lingua in modalità modal" caption="Modalità modal - overlay a schermo intero per la selezione della lingua."/>

## Riferimento props

| Prop | Tipo | Default | Descrizione |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'` o `'modal'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | Mostra le icone delle bandiere dei paesi |

```blade
{{-- Sovrascrivere la modalità per istanza --}}
<livewire:lingua::language-selector mode="dropdown" :show-flags="false" />
```

## Come funziona il cambio di locale

Quando un utente clicca su una lingua, il componente chiama `changeLocale($locale)`:

1. Valida che la locale esista nella tabella `languages` (ignora silenziosamente le locale sconosciute)
2. Memorizza il codice della locale in sessione sotto `config('lingua.session_variable')`
3. Chiama `app()->setLocale($locale)` per la richiesta corrente
4. Reindirizza all'URL corrente (attiva un ricaricamento completo della pagina così la nuova locale ha effetto ovunque)

Alla richiesta successiva, `LinguaMiddleware` legge la sessione e applica la locale prima dell'esecuzione dei tuoi controller.

## Icone bandiera

Le icone bandiera sono fornite dal pacchetto [`outhebox/blade-flags`](https://github.com/MohmmedAshraf/blade-flags), installato automaticamente come dipendenza di Lingua.

Le bandiere vengono abbinate dal codice `regional` della lingua (es. `en_US` → 🇺🇸, `fr_FR` → 🇫🇷). Se non è impostato alcun codice regionale, il componente bandiera fa il fallback in modo sicuro alla visualizzazione del codice a due lettere.

Disabilita le bandiere globalmente:

```php
// config/lingua.php
'selector' => ['show_flags' => false],
```

O per istanza:

```blade
<livewire:lingua::language-selector :show-flags="false" />
```

## Personalizzare le viste del selettore

Pubblica le viste per sovrascrivere il markup:

```bash
php artisan vendor:publish --tag="lingua-views"
```

I template del selettore si trovano in:

```
resources/views/vendor/lingua/livewire/
├── language-selector.blade.php
└── selector/
    ├── sidebar.blade.php
    ├── dropdown.blade.php
    └── modal.blade.php
```

::: tip Integra con la tua navigazione
Se usi i componenti sidebar o navbar di Flux, la modalità `sidebar` si inserisce naturalmente in `<flux:navlist>` o `<flux:sidebar>` di Flux. Pubblica la vista e adatta il markup per corrispondere alla tua struttura di navigazione.
:::

## Aggiornare il selettore dopo le modifiche

Il selettore ascolta l'evento Livewire `refreshLanguages`. Se aggiungi o rimuovi una lingua dall'interfaccia di gestione (o in modo programmatico), il selettore si ri-renderizza automaticamente senza ricaricare la pagina.

```js
// Invia da qualsiasi componente Livewire o codice Alpine.js:
this.$dispatch('refreshLanguages')
```

---

## Modalità headless

Il selettore headless non produce CSS né markup del framework — solo HTML semantico puro con attributi `data-lingua-*` che puoi stilizzare completamente con il tuo CSS, Tailwind o qualsiasi altro approccio.

Usa la modalità headless quando hai bisogno della logica di cambio lingua ma vuoi il controllo totale sull'output visivo.

### Utilizzo base

```blade
<livewire:lingua::headless-language-selector />
```

La lista delle lingue è sempre presente nel DOM. La visibilità è responsabilità tua — usa CSS `display`, Alpine.js `x-show` o qualsiasi altro meccanismo. Nessun pulsante trigger integrato è fornito per design.

Abilita la modalità headless globalmente tramite config o la pagina Impostazioni:

```php
// config/lingua.php
'selector' => ['mode' => 'headless'],
```

### Slot nominati

#### Slot `$item`

Sostituisce il markup `<button>` predefinito all'interno di ogni `<li>` della lingua. Riceve l'istanza del modello `Language`:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        {{ $language->native }} ({{ $language->code }})
    </x-slot>
</livewire:lingua::headless-language-selector>
```

#### Slot `$current`

Sostituisce il rendering della lingua **attualmente selezionata** soltanto. Ricade su `$item` se non fornito:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:current="language">
        <strong>{{ $language->native }}</strong>
    </x-slot>
    <x-slot:item="language">
        {{ $language->native }}
    </x-slot>
</livewire:lingua::headless-language-selector>
```

### API di targeting CSS

Il componente espone attributi `data-lingua-*` su ogni elemento per il targeting CSS e JavaScript:

| Attributo | Elemento |
|---|---|
| `data-lingua-selector` | Elemento `<nav>` radice |
| `data-lingua-list` | La lista `<ul>` delle lingue |
| `data-lingua-item` | Ogni voce `<li>` della lingua |
| `data-lingua-active` | Il `<li>` della lingua attualmente attiva |
| `data-lingua-button` | Il `<button>` all'interno di ogni `<li>` |
| `data-lingua-name` | `<span>` con il nome in inglese della lingua |
| `data-lingua-native` | `<span>` con il nome nativo della lingua |
| `data-lingua-code` | `<span>` con il codice ISO della lingua |

### Esempi di stile

**CSS semplice:**

```css
[data-lingua-selector] {
    display: flex;
    gap: 0.5rem;
    list-style: none;
}
[data-lingua-item] {
    cursor: pointer;
}
[data-lingua-active] {
    font-weight: bold;
    text-decoration: underline;
}
[data-lingua-button] {
    background: none;
    border: none;
    padding: 0.25rem 0.5rem;
}
```

**Tailwind CSS:**

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        <span class="px-3 py-1 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            {{ $language->native }}
        </span>
    </x-slot>
    <x-slot:current="language">
        <span class="px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900 font-semibold text-red-700 dark:text-red-300">
            {{ $language->native }}
        </span>
    </x-slot>
</livewire:lingua::headless-language-selector>
```

**Toggle di visibilità Alpine.js:**

```blade
<div x-data="{ open: false }">
    <button @click="open = !open">
        {{ app()->getLocale() }}
    </button>

    <div x-show="open" @click.outside="open = false">
        <livewire:lingua::headless-language-selector>
            <x-slot:item="language">
                <button class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                    {{ $language->native }}
                </button>
            </x-slot>
        </livewire:lingua::headless-language-selector>
    </div>
</div>
```

### Riferimento props (aggiornato)

| Prop | Tipo | Default | Descrizione |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'`, `'modal'`, o `'headless'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | Mostra le icone delle bandiere |

::: tip
Quando `mode="headless"` viene passato a `<livewire:lingua::language-selector />`, quel componente non renderizza nulla. Usa direttamente `<livewire:lingua::headless-language-selector />` per il supporto completo di slot e attributi.
:::
