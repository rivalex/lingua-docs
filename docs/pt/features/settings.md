# Configurações

A página de Configurações (`/lingua/settings`) expõe as opções mais comuns em
uma interface visual, sem precisar editar arquivos PHP diretamente. Ela compartilha
o [menu de navegação](#menu-de-navegacao) com as outras páginas do Lingua.

<Screenshot src="/screenshots/settings-page.png" alt="Página de Configurações do Lingua" caption="A página de configurações com controles de modo seletor, bandeiras e navegação." />

## Cadeia de prioridade

As configurações são lidas na seguinte ordem (maior prioridade primeiro):

1. **Banco de dados** — via model `LinguaSetting` (alterações feitas na UI de Configurações)
2. **Variáveis de ambiente** — `.env` (ex: `LINGUA_STORAGE_DRIVER`)
3. **Arquivo de configuração** — `config/lingua.php` (fallback padrão)

Você pode manter `config/lingua.php` como base e sobrescrever configurações
específicas via UI — sem redeployar.

## Modo do seletor

Controla como o componente `<livewire:lingua::language-selector />` é renderizado
para usuários finais:

| Modo | Descrição |
|---|---|
| `sidebar` | Seção de navegação agrupada (padrão) |
| `dropdown` | Botão dropdown compacto |
| `modal` | Botão que abre um overlay de seleção |
| `headless` | Sem markup integrado — use `<livewire:lingua::headless-language-selector />` |

## Exibir ícones de bandeira

Ative ou desative a exibição de ícones de bandeiras de países ao lado dos nomes
de idiomas no seletor.

## Menu de navegação <Badge type="tip" text="Novidade na versão 2.0" />

O toggle de **Navegação compartilhada** controla se o componente `x-lingua::nav`
é exibido em todas as cinco páginas do Lingua. Quando ativo (padrão), você vê
uma barra de navegação horizontal com links para Languages, Translations,
Statistics, Transfer e Settings — com a página atual destacada.

```php
// Também configurável via arquivo
// config/lingua.php
'nav' => ['enabled' => true],
```

## Driver de armazenamento (somente leitura)

O driver ativo (`database` ou `file`) é exibido como informação, mas **não pode
ser alterado pela UI** — é controlado por `LINGUA_STORAGE_DRIVER` ou
`config/lingua.php`. Para alternar, use:

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```

Veja [Drivers de armazenamento](/pt/guide/storage).

## Model LinguaSetting

Configurações da UI são armazenadas em `lingua_settings` via `LinguaSetting`:

```php
use Rivalex\Lingua\Models\LinguaSetting;

// Ler com fallback
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

// Escrever
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'dropdown');

// Constantes disponíveis
LinguaSetting::KEY_SELECTOR_MODE      // modo do widget seletor
LinguaSetting::KEY_SELECTOR_SHOW_FLAGS // mostrar bandeiras
LinguaSetting::KEY_NAV_ENABLED         // menu de navegação compartilhado
```

| Constante | Chave DB | Tipo |
|---|---|---|
| `KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `KEY_SELECTOR_SHOW_FLAGS` | `selector.show_flags` | `bool` |
| `KEY_NAV_ENABLED` | `nav.enabled` | `bool` |
