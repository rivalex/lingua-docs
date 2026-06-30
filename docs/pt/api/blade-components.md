# Componentes Blade

O Lingua registra componentes Blade anônimos sob o prefixo `lingua::`.
Eles são usados internamente pelas views Livewire e podem ser reutilizados
nos seus próprios templates.

## `<x-lingua::nav>` <Badge type="tip" text="Novidade na versão 2.0" />

Menu de navegação compartilhado exibido no topo de cada página do Lingua.
Inclui links para Languages, Translations, Statistics, Transfer e Settings,
com a página atual destacada.

```blade
<x-lingua::nav :current="'languages'" />
```

| Prop | Tipo | Descrição |
|---|---|---|
| `current` | string | Nome da página ativa para highlight |

Controlado pelo toggle `nav.enabled` em Configurações ou `config/lingua.php`.

---

## `<x-lingua::select>` <Badge type="tip" text="Novidade na versão 2.0" />

Dropdown customizado Alpine + Tailwind construído sobre a **Popover API nativa**
(`popover="manual"` com `showPopover()` / `hidePopover()`) e `position: fixed`.

Funciona corretamente mesmo dentro de um modal ou diálogo do Flux (que aplica
`overflow` e `transform` ao container) pois o popover nativo renderiza na camada
superior da viewport — sem teleporte ou hacks de z-index.

Usado internamente pelos seletores dropdown e modal do seletor de idioma.

---

## `<x-lingua::editor>`

Editor polimórfico que renderiza `<textarea>`, TipTap HTML ou TipTap Markdown
com base na prop `type`.

```blade
{{-- Texto simples --}}
<x-lingua::editor wire:model="value" type="text" placeholder="Insira o texto…" />

{{-- HTML --}}
<x-lingua::editor wire:model="value" type="html" label="Corpo" :required="true" />

{{-- Markdown --}}
<x-lingua::editor wire:model="value" type="markdown" placeholder="Escreva em Markdown…" />
```

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'` ou `'markdown'` |
| `label` | string | `''` | Rótulo acima do campo |
| `placeholder` | string | `''` | Texto de placeholder |
| `required` | bool | `false` | Badge de obrigatório |
| `wire:model` | — | — | Binding de model Livewire |

---

## `<x-lingua::stat>`

Card de estatística de uma única métrica.

```blade
<x-lingua::stat label="Total de strings" :value="$totalStrings" />
```

| Prop | Tipo | Descrição |
|---|---|---|
| `label` | string | Rótulo descritivo |
| `value` | int\|string | Valor a exibir |

---

## `<x-lingua::card>`

Container de card com título e slot de conteúdo opcional.

```blade
<x-lingua::card title="Configurações de cache">
    {{-- conteúdo --}}
</x-lingua::card>
```

---

## `<x-lingua::branding>`

Renderiza o logotipo do Lingua (SVG inline, ciente de modo claro/escuro).

```blade
<x-lingua::branding class="w-24" />
```

---

## `<x-lingua::validation-errors>`

Exibe a lista de erros de validação do Livewire.

```blade
<x-lingua::validation-errors />
```

---

## `<x-lingua::clipboard>`

Wrapper que adiciona botão de copiar ao redor do slot.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

| Prop | Tipo | Descrição |
|---|---|---|
| `text-to-copy` | string | Texto a copiar |
| `show-tooltip` | bool | Exibir tooltip ao passar o mouse (padrão: `false`) |

---

## `<x-lingua::language-flag>`

Ícone de bandeira + nome do idioma para um locale.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

| Prop | Tipo | Descrição |
|---|---|---|
| `name` | string | Nome em inglês |
| `code` | string | Código do locale para busca da bandeira |
| `description` | string | Nome nativo (subtítulo) |

Usa `outhebox/blade-flags` para os SVGs. Faz fallback para texto do código quando
a bandeira não está disponível.

---

## `<x-lingua::message>`

Mensagem transitória que aparece por um breve período após um evento Livewire.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `on` | string | — | Evento Livewire para escutar |
| `delay` | int | `1500` | Duração em ms antes de ocultar |

---

## `<x-lingua::autocomplete>`

Input com autocomplete — usado no formulário de criação de traduções.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="ex: marketing"
/>
```

---

## `<x-lingua::menu-group>`

Grupo de navegação para menus de sidebar.

```blade
<x-lingua::menu-group heading="Línguas">
    {{-- itens do menu --}}
</x-lingua::menu-group>
```

---

## Personalizando componentes

Publique as views para sobrescrevê-las:

```bash
php artisan vendor:publish --tag="lingua-views"
```

As views publicadas ficam em `resources/views/vendor/lingua/components/`.
O Laravel usa sua versão publicada automaticamente.
