# Editor de Texto Rico

O Lingua incorpora o [TipTap 3](https://tiptap.dev) como um editor de texto rico opcional para tipos de tradução HTML e Markdown. O editor correto é ativado automaticamente com base na coluna `type` da tradução.

## Tipos de tradução

| Tipo | Editor | Descrição |
|---|---|---|
| `text` | `<textarea>` simples | Padrão para todas as traduções padrão |
| `html` | TipTap WYSIWYG | Para conteúdo que deve renderizar com formatação HTML |
| `markdown` | TipTap Markdown | Para conteúdo criado na sintaxe Markdown |

## Configurando a barra de ferramentas

A barra de ferramentas do editor é controlada globalmente via `config/lingua.php`:

```php
'editor' => [
    'headings'      => false,  // botões de título H1-H3
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'bullet'        => true,   // lista não ordenada
    'ordered'       => true,   // lista ordenada
    'clear'         => true,   // limpar formatação
],
```

Habilite apenas as opções que seu conteúdo realmente precisa. Manter a barra de ferramentas mínima reduz a carga cognitiva dos tradutores.

<Screenshot src="/screenshots/editor-toolbar.png" alt="Barra de ferramentas do editor" caption="A barra de ferramentas do editor HTML com as opções padrão ativas." />

## Alterando o tipo de uma tradução

No modal de Edição (ícone de lápis, apenas locale padrão), selecione o tipo desejado no dropdown **Type**. O editor é atualizado imediatamente na linha sem recarregar a página.

::: tip Detecção automática
Quando você executa `lingua:sync-to-database` pela primeira vez, o Lingua detecta automaticamente o tipo com base no conteúdo. Você pode sobrescrevê-lo manualmente a qualquer momento - o valor armazenado não é alterado quando você muda o tipo, apenas o comportamento do editor.
:::

## Trabalhando com traduções HTML

Traduções HTML são armazenadas como HTML bruto na coluna JSON `text`:

```json
{"en": "<p>Welcome to <strong>Lingua</strong> - the translation manager for Laravel.</p>"}
```

Para renderizá-las em Blade sem duplo escape:

```blade
{{-- Sempre use {!! !!} para tipos de tradução HTML --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
Use `{!! !!}` apenas para strings de tradução gerenciadas por usuários autorizados em um painel administrativo controlado. Nunca renderize input de usuário não confiável como HTML bruto.
:::

## Trabalhando com traduções Markdown

Traduções Markdown armazenam Markdown bruto:

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**.\n\n- Feature one\n- Feature two"}
```

Para renderizar Markdown em Blade, use um parser Markdown. O Laravel inclui `Str::markdown()`:

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

Ou use um pacote dedicado como [league/commonmark](https://commonmark.thephpleague.com).

## O componente `x-lingua::editor`

O editor é exposto como um componente Blade que você pode reutilizar fora da interface de gerenciamento do Lingua:

```blade
{{-- Modo texto --}}
<x-lingua::editor
    wire:model="myField"
    type="text"
    placeholder="Enter text…"
/>

{{-- Modo HTML --}}
<x-lingua::editor
    wire:model="myField"
    type="html"
    label="Body content"
    :required="true"
/>

{{-- Modo Markdown --}}
<x-lingua::editor
    wire:model="myField"
    type="markdown"
    placeholder="Write in Markdown…"
/>
```

### Props

| Prop | Tipo | Descrição |
|---|---|---|
| `wire:model` | string | Propriedade Livewire para vincular |
| `type` | string | `'text'`, `'html'` ou `'markdown'` |
| `label` | string | Rótulo opcional acima do editor |
| `placeholder` | string | Texto de placeholder |
| `required` | bool | Exibe um badge de obrigatório quando `true` |

::: tip
O componente `x-lingua::editor` é um ótimo ponto de partida para qualquer formulário Livewire que precise de um campo de texto rico. Publique a view do componente para personalizar a barra de ferramentas ou o estilo.
:::
