# Seletor de Idioma

O componente `<livewire:lingua::language-selector>` é um seletor de locale incorporável para seus usuários finais — completamente separado da interface de gerenciamento administrativo.

## Uso básico

```blade
<livewire:lingua::language-selector />
```

Adicione em qualquer lugar nos seus layouts Blade. Ele renderiza usando o modo configurado em `config/lingua.php` (`sidebar` por padrão).

## Modos de exibição

### Modo sidebar (padrão)

Renderiza como uma seção de navegação agrupada — ideal para sidebars de aplicações construídas com Flux.

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/screenshots/selector-sidebar.png" alt="Seletor de idioma no modo sidebar" caption="Modo sidebar — exibe todos os idiomas instalados como itens de navegação." width="320px" :center="true"/>

### Modo dropdown

Renderiza como um botão dropdown compacto — ideal para cabeçalhos e barras de navegação.

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/screenshots/selector-dropdown.png" alt="Seletor de idioma no modo dropdown" caption="Modo dropdown — exibe o idioma atual com um ícone de bandeira." width="320px" :center="true"/>

### Modo modal

Renderiza como um botão que abre um modal completo de seleção de idioma — ideal para troca de locale em destaque em landing pages ou fluxos de onboarding.

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/screenshots/selector-modal.png" alt="Seletor de idioma no modo modal" caption="Modo modal — overlay de seleção de idioma em tela cheia."/>

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
