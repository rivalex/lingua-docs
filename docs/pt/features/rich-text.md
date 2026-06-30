# Editor de Texto Rico

O Lingua incorpora o [TipTap](https://tiptap.dev) como editor de texto rico
opcional para traduções HTML e Markdown. O editor correto é ativado
automaticamente com base na coluna `type` da tradução.

::: warning Somente driver banco de dados
Tipos `html` e `markdown` estão disponíveis apenas no **driver de armazenamento
database**. No modo `file`, todas as traduções são texto simples e o editor rico
não é ativado. Veja [Drivers de Armazenamento](/pt/guide/storage).
:::

## Tipos de tradução

| Tipo | Editor | Descrição |
|---|---|---|
| `text` | `<textarea>` simples | Padrão para todas as strings |
| `html` | TipTap WYSIWYG | Conteúdo com formatação HTML |
| `markdown` | TipTap Markdown | Conteúdo na sintaxe Markdown |

## Configurando a barra de ferramentas

Habilite ou desabilite botões individualmente em `config/lingua.php`:

```php
'editor' => [
    'headings'      => false,  // H1–H6
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'subscript'     => true,
    'superscript'   => true,
    'blockquote'    => false,
    'code-line'     => false,  // código inline
    'code-block'    => false,  // bloco de código
    'bullet'        => true,   // lista não ordenada
    'ordered'       => true,   // lista ordenada
    'clear'         => true,   // limpar formatação
    'code-mode'     => false,  // toggle de código bruto
],
```

<Screenshot src="/screenshots/editor-toolbar.png" alt="Barra de ferramentas do editor" caption="A barra de ferramentas do editor HTML com as opções padrão ativas." />

## Alterando o tipo de uma tradução

No modal de Edição (ícone de lápis, apenas locale padrão), selecione o tipo
desejado no dropdown **Type**. O editor atualiza imediatamente — o valor
armazenado não é alterado quando você muda o tipo, apenas o comportamento
do editor.

::: tip Detecção automática
Ao executar `lingua:sync-to-database`, o Lingua detecta automaticamente o tipo
com base no conteúdo. Você pode sobrescrevê-lo manualmente a qualquer momento.
:::

## Trabalhando com traduções HTML

```json
{"en": "<p>Bem-vindo à <strong>Lingua</strong>.</p>"}
```

Para renderizar em Blade sem duplo escape:

```blade
{!! __('marketing.hero_body') !!}
```

::: warning XSS
Use `{!! !!}` apenas para strings gerenciadas por usuários autorizados em painel
administrativo controlado. Veja [Segurança — Proteção XSS](/pt/guide/security#protecao-xss).
O `HtmlSanitizer` é executado ao salvar via UI, então conteúdo salvo pelo Lingua
é seguro para renderização com `{!! !!}`.
:::

## Trabalhando com traduções Markdown

```json
{"en": "## Bem-vindo!\n\nObrigado por escolher **Lingua**."}
```

Para renderizar em Blade, use `Str::markdown()`:

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

Ou `league/commonmark` para parsing completo.

## O componente `x-lingua::editor`

O editor pode ser reutilizado fora das páginas de gerenciamento:

```blade
{{-- Texto simples --}}
<x-lingua::editor wire:model="value" type="text" placeholder="Insira o texto…" />

{{-- HTML --}}
<x-lingua::editor wire:model="value" type="html" label="Corpo" :required="true" />

{{-- Markdown --}}
<x-lingua::editor wire:model="value" type="markdown" placeholder="Escreva em Markdown…" />
```

### Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'` ou `'markdown'` |
| `label` | string | `''` | Rótulo opcional acima do campo |
| `placeholder` | string | `''` | Texto de placeholder |
| `required` | bool | `false` | Exibe badge de obrigatório |
| `wire:model` | — | — | Binding de model Livewire |

Publique as views para personalizar a barra de ferramentas ou o estilo:

```bash
php artisan vendor:publish --tag="lingua-views"
```
