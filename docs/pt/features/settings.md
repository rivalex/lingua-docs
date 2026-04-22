# Configurações

A página de Configurações permite que você configure o comportamento da UI do Lingua pelo navegador — sem editar arquivos de configuração ou necessidade de redeploy.

Navegue para `/lingua/settings` ou crie um link do seu painel administrativo:

```blade
<a href="{{ route('lingua.settings') }}">Configurações do Lingua</a>
```

<Screenshot src="/screenshots/settings-page.png" alt="Página de Configurações do Lingua" caption="A página de configurações com os controles de modo seletor e ícones de bandeira." />

## Como funcionam as configurações

As configurações são armazenadas na tabela do banco de dados `lingua_settings` como pares chave/valor tipados. Em cada requisição, o Lingua lê primeiro do banco de dados, depois recai sobre `config/lingua.php`, e então sobre os padrões do código.

**Cadeia de prioridade:**
1. Tabela DB `lingua_settings` (maior prioridade — definida via esta UI)
2. `config/lingua.php` (seu config publicado)
3. Padrões do pacote (menor prioridade)

Você pode manter seu `config/lingua.php` como base e sobrescrever configurações específicas por ambiente via UI sem tocar em arquivos.

## Modo seletor

Controla como o componente `<livewire:lingua::language-selector />` é renderizado para seus usuários finais.

| Modo | Descrição |
|---|---|
| `sidebar` | Renderiza como uma seção de navegação agrupada (padrão) |
| `modal` | Renderiza como um botão que abre um modal completo de seleção de idioma |
| `dropdown` | Renderiza como um botão dropdown compacto |
| `headless` | Sem renderização integrada — você implementa a UI por conta própria |

::: tip Modo headless
Quando definido como `headless`, o seletor integrado não renderiza nada. Use `<livewire:lingua::headless-language-selector />` em vez disso para construir um seletor totalmente personalizado. Veja [Seletor Headless](./language-selector#modo-headless) para a documentação completa.
:::

## Exibir ícones de bandeira

Ative ou desative a exibição de ícones de bandeiras de países ao lado dos nomes de idiomas no seletor. Quando desativado, apenas o nome do idioma é exibido.

Os ícones de bandeira são associados ao código `regional` do idioma (ex. `en_US` → 🇺🇸). Se nenhum código regional estiver definido, a bandeira recai de forma elegante.

## Acesso programático

Você pode ler e escrever configurações em PHP usando o modelo `LinguaSetting`:

```php
use Rivalex\Lingua\Models\LinguaSetting;

// Ler com fallback config()
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

$showFlags = LinguaSetting::get(
    LinguaSetting::KEY_SHOW_FLAGS,
    config('lingua.selector.show_flags', true)
);

// Escrever
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_SHOW_FLAGS, false);
```

Constantes disponíveis:

| Constante | Chave | Tipo |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |

::: warning Migração necessária
A tabela `lingua_settings` é criada pela migração `create_lingua_settings_table`. Se você atualizou da versão 1.0.x, execute `php artisan migrate` para criá-la.
:::
