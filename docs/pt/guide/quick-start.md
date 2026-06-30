# Início Rápido

Este guia leva você de uma instalação nova do Lingua a uma aplicação totalmente
multilíngue em minutos.

## 1. Instalar e popular

```bash
composer require rivalex/lingua
php artisan lingua:install
```

Escolha o driver **database** quando solicitado (recomendado). O inglês se torna
seu idioma padrão e as strings de tradução empacotadas são importadas para o
banco de dados — sem downloads do GitHub.

::: tip Seguro por padrão
As rotas de gerenciamento são protegidas por `['web', 'auth']` automaticamente.
Configure `LINGUA_GATE` para acesso baseado em roles — veja
[Instalação](/pt/guide/installation#protegendo-a-interface-de-gerenciamento).
:::

## 2. Adicionar seu segundo idioma

```bash
php artisan lingua:add fr
```

Este comando é **nativo do BD**: ele popula strings em francês do conjunto de
dados empacotado e cria um registro `Language`. Ele **não** faz downloads de
arquivos nem escreve em `lang/`.

Repita para quantos locales precisar:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. Adicionar o seletor de idioma ao seu layout

Abra seu layout principal em Blade (ex:
`resources/views/layouts/app.blade.php`):

**a) Defina `lang` e `dir` na tag `<html>`:**

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

**b) Incorpore o seletor de idioma onde melhor se encaixar no seu design:**

```blade
{{-- Como um grupo na sidebar (padrão) --}}
<livewire:lingua::language-selector />

{{-- Como dropdown na navbar --}}
<livewire:lingua::language-selector mode="dropdown" />
```

::: tip A troca de locale recarrega a página atual
Quando um usuário troca de locale, o Lingua recarrega a **página em que estão**
(não a página inicial), protegido contra open-redirects. Veja
[Segurança](/pt/guide/security#protecao-contra-open-redirect).
:::

## 4. Usar traduções na sua aplicação

O Lingua é transparente — use os helpers padrão do Laravel como sempre:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

No modo banco de dados, o `LinguaManager` mescla as traduções do banco de dados
sobre as baseadas em arquivo automaticamente. Nenhuma alteração de código necessária.

## 5. Traduzir pela interface

Acesse `/lingua/translations` para ver todas as strings de tradução. Para cada
idioma:

1. Use o seletor de locale (canto superior direito) para selecionar o idioma alvo
2. Clique em qualquer linha para editar o valor inline
3. Use **Mostrar apenas ausentes** para focar nas strings não traduzidas
4. Para tipos HTML ou Markdown, o editor de texto rico é ativado automaticamente

<Screenshot src="/screenshots/translations-page.png" alt="Página de gerenciamento de traduções do Lingua" caption="A página de traduções com seletor de locale, filtro de grupo e editor inline." />

## 6. Import / export com a página Transfer

Precisa editar traduções em massa em uma planilha, ou enviar um arquivo para uma
agência de tradução? Acesse `/lingua/transfer`:

- **Export** para CSV, JSON, XLSX ou ODS — layouts bilíngue, multi-locale ou
  JSON nativo
- **Import** com uma **prévia de diff** em dry-run antes de qualquer escrita

XLSX/ODS requerem o pacote opcional `openspout/openspout`; CSV e JSON funcionam
sem instalação adicional.

## 7. Sincronizar de volta para arquivos (opcional)

Se precisar de arquivos de tradução em disco (para controle de versão ou CI/CD):

```bash
php artisan lingua:sync-to-local
```

Isso exporta todas as traduções do BD de volta para `lang/` no formato PHP/JSON
correto.

---

## Padrões comuns

### Traduzir uma nova chave programaticamente

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
```

### Inspecionar um locale

```php
use Rivalex\Lingua\Facades\Lingua;

$info = Lingua::info('fr');

if ($info !== null) {
    $info->name;      // "French"
    $info->native;    // "Français"
    $info->direction; // "ltr"
}
```

::: warning Alterado na versão 2.0
`Lingua::info()` agora retorna `?LocaleInfo` e retorna `null` para locales
desconhecidos em vez de lançar uma exceção. Sempre proteja com
`if ($info !== null)`.
:::

### Trocar locale programaticamente

```php
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```
