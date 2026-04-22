# Seletor de Idioma

O componente `<livewire:lingua::language-selector>` é um seletor de locale incorporável para seus usuários finais - completamente separado da interface de gerenciamento administrativo.

## Uso básico

```blade
<livewire:lingua::language-selector />
```

Adicione em qualquer lugar nos seus layouts Blade. Ele renderiza usando o modo configurado em `config/lingua.php` (`sidebar` por padrão).

## Modos de exibição

### Modo sidebar (padrão)

Renderiza como uma seção de navegação agrupada - ideal para sidebars de aplicações construídas com Flux.

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/screenshots/selector-sidebar.png" alt="Seletor de idioma no modo sidebar" caption="Modo sidebar - exibe todos os idiomas instalados como itens de navegação." width="320px" :center="true"/>

### Modo dropdown

Renderiza como um botão dropdown compacto - ideal para cabeçalhos e barras de navegação.

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/screenshots/selector-dropdown.png" alt="Seletor de idioma no modo dropdown" caption="Modo dropdown - exibe o idioma atual com um ícone de bandeira." width="320px" :center="true"/>

### Modo modal

Renderiza como um botão que abre um modal completo de seleção de idioma - ideal para troca de locale em destaque em landing pages ou fluxos de onboarding.

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/screenshots/selector-modal.png" alt="Seletor de idioma no modo modal" caption="Modo modal - overlay de seleção de idioma em tela cheia."/>

## Referência de props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'` ou `'modal'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | Exibir ícones de bandeiras de países |

```blade
{{-- Sobrescrever modo por instância --}}
<livewire:lingua::language-selector mode="dropdown" :show-flags="false" />
```

## Como a troca de locale funciona

Quando um usuário clica em um idioma, o componente chama `changeLocale($locale)`:

1. Valida que o locale existe na tabela `languages` (ignora silenciosamente locales desconhecidos)
2. Armazena o código do locale na sessão sob `config('lingua.session_variable')`
3. Chama `app()->setLocale($locale)` para a requisição atual
4. Redireciona para a URL atual (dispara um reload completo da página para que o novo locale tenha efeito em todo lugar)

Na próxima requisição, o `LinguaMiddleware` lê a sessão e aplica o locale antes que seus controllers sejam executados.

## Ícones de bandeiras

Os ícones de bandeiras são alimentados pelo pacote [`outhebox/blade-flags`](https://github.com/MohmmedAshraf/blade-flags), que é instalado automaticamente como dependência do Lingua.

As bandeiras são correspondidas pelo código `regional` do idioma (ex: `en_US` → 🇺🇸, `fr_FR` → 🇫🇷). Se nenhum código regional estiver definido, o componente de bandeira faz fallback gracioso para a exibição do código de duas letras.

Desabilitar bandeiras globalmente:

```php
// config/lingua.php
'selector' => ['show_flags' => false],
```

Ou por instância:

```blade
<livewire:lingua::language-selector :show-flags="false" />
```

## Personalizando as views do seletor

Publique as views para sobrescrever o markup:

```bash
php artisan vendor:publish --tag="lingua-views"
```

Os templates do seletor estão em:

```
resources/views/vendor/lingua/livewire/
├── language-selector.blade.php
└── selector/
    ├── sidebar.blade.php
    ├── dropdown.blade.php
    └── modal.blade.php
```

::: tip Integrar com sua própria navegação
Se você usa os componentes de sidebar ou navbar do Flux, o modo `sidebar` se encaixa naturalmente no `<flux:navlist>` ou `<flux:sidebar>` do Flux. Publique a view e adapte o markup para corresponder à sua estrutura de navegação.
:::

## Atualizando o seletor após alterações

O seletor ouve o evento Livewire `refreshLanguages`. Se você adicionar ou remover um idioma da interface de gerenciamento (ou programaticamente), o seletor é re-renderizado automaticamente sem recarregar a página.

```js
// Dispare de qualquer componente Livewire ou código Alpine.js:
this.$dispatch('refreshLanguages')
```

---

## Modo headless

O seletor headless não gera CSS nem marcação de framework — HTML semântico puro com atributos `data-lingua-*` que você estiliza completamente com seu próprio CSS, Tailwind ou qualquer outra abordagem.

Use o modo headless quando você precisa da lógica de troca de idioma mas quer controle total sobre a saída visual.

### Uso básico

```blade
<livewire:lingua::headless-language-selector />
```

A lista de idiomas está sempre presente no DOM. A visibilidade é sua responsabilidade — use CSS `display`, Alpine.js `x-show` ou qualquer outro mecanismo. Nenhum botão de acionamento integrado é fornecido por design.

Habilite o modo headless globalmente via config ou a página de Configurações:

```php
// config/lingua.php
'selector' => ['mode' => 'headless'],
```

### Slots nomeados

#### Slot `$item`

Substitui o marcado `<button>` padrão dentro de cada `<li>` de idioma. Recebe a instância do modelo `Language`:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        {{ $language->native }} ({{ $language->code }})
    </x-slot>
</livewire:lingua::headless-language-selector>
```

#### Slot `$current`

Substitui o renderizado do idioma **atualmente selecionado** apenas. Recai sobre `$item` se não fornecido:

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

### API de seleção CSS

O componente expõe atributos `data-lingua-*` em cada elemento para seleção com CSS e JavaScript:

| Atributo | Elemento |
|---|---|
| `data-lingua-selector` | Elemento `<nav>` raiz |
| `data-lingua-list` | A lista `<ul>` de idiomas |
| `data-lingua-item` | Cada entrada `<li>` de idioma |
| `data-lingua-active` | O `<li>` do idioma atualmente ativo |
| `data-lingua-button` | O `<button>` dentro de cada `<li>` |
| `data-lingua-name` | `<span>` do nome em inglês do idioma |
| `data-lingua-native` | `<span>` do nome nativo do idioma |
| `data-lingua-code` | `<span>` do código ISO do idioma |

### Exemplos de estilo

**CSS simples:**

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

**Alternância de visibilidade com Alpine.js:**

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

### Referência de props (atualizada)

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'`, `'modal'`, ou `'headless'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | Exibir ícones de bandeiras |

::: tip
Quando `mode="headless"` é passado para `<livewire:lingua::language-selector />`, esse componente não renderiza nada. Use diretamente `<livewire:lingua::headless-language-selector />` para suporte completo de slots e atributos.
:::
