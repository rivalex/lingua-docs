# Componentes Blade

O Lingua registra vários componentes Blade anônimos sob o prefixo `lingua::`. Eles são usados internamente pelas views Livewire e também podem ser reutilizados nos seus próprios templates.

## `<x-lingua::editor>`

Um componente de editor polimórfico que renderiza um `<textarea>`, editor HTML TipTap ou editor Markdown TipTap com base na prop `type`.

```blade
{{-- Texto simples --}}
<x-lingua::editor
    wire:model="value"
    type="text"
    placeholder="Enter text…"
/>

{{-- HTML --}}
<x-lingua::editor
    wire:model="value"
    type="html"
    label="Body content"
    :required="true"
/>

{{-- Markdown --}}
<x-lingua::editor
    wire:model="value"
    type="markdown"
    placeholder="Write in Markdown…"
/>
```

### Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'` ou `'markdown'` |
| `label` | string | `''` | Rótulo opcional acima do campo |
| `placeholder` | string | `''` | Texto de placeholder |
| `required` | bool | `false` | Exibe um badge de obrigatório |
| `wire:model` | — | — | Binding de model Livewire |

---

## `<x-lingua::clipboard>`

Um wrapper que adiciona um botão de copiar para área de transferência ao redor do seu conteúdo slot.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

Clicar no componente copia `text-to-copy` para a área de transferência e exibe brevemente um checkmark.

### Props

| Prop | Tipo | Descrição |
|---|---|---|
| `text-to-copy` | string | O texto a copiar para a área de transferência |
| `show-tooltip` | bool | Exibir um tooltip ao passar o mouse (padrão: `false`) |

---

## `<x-lingua::language-flag>`

Renderiza um ícone de bandeira e nome do idioma para um locale fornecido.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

### Props

| Prop | Tipo | Descrição |
|---|---|---|
| `name` | string | Nome do idioma em inglês |
| `code` | string | Código do locale para busca da bandeira |
| `description` | string | Nome nativo do idioma (subtítulo) |

Usa `outhebox/blade-flags` para os SVGs de bandeiras. Se nenhuma bandeira estiver disponível para o código, faz fallback gracioso para o texto do código.

---

## `<x-lingua::message>`

Um componente de mensagem transitória que aparece por um breve período após um evento Livewire.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

### Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `on` | string | — | Nome do evento Livewire para escutar |
| `delay` | int | `1500` | Duração em milissegundos antes de ocultar |

---

## `<x-lingua::autocomplete>`

Um componente de input de texto com autocomplete usado no formulário de criação de traduções.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="e.g. marketing"
/>
```

### Props

| Prop | Tipo | Descrição |
|---|---|---|
| `wire:model` | — | Binding de model Livewire |
| `suggestions` | array | Array de sugestões de autocomplete |
| `placeholder` | string | Placeholder do input |

---

## `<x-lingua::menu-group>`

Um componente de grupo de navegação para menus de sidebar.

```blade
<x-lingua::menu-group heading="Languages">
    {{-- itens do menu slot --}}
</x-lingua::menu-group>
```

### Props

| Prop | Tipo | Descrição |
|---|---|---|
| `heading` | string | Texto do título do grupo |

---

## Personalizando componentes

Publique todas as views de componentes para sobrescrevê-las:

```bash
php artisan vendor:publish --tag="lingua-views"
```

As views publicadas ficam em `resources/views/vendor/lingua/components/`. O Laravel usa sua versão publicada automaticamente.
