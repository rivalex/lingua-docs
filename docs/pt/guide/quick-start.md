# Início Rápido

Este guia leva você de uma instalação nova do Lingua a uma aplicação totalmente multilíngue em poucos minutos.

## 1. Instalar e popular

```bash
composer require rivalex/lingua
php artisan lingua:install
```

O inglês agora é seu idioma padrão, e todas as strings de tradução do Laravel/vendor foram importadas para o banco de dados.

## 2. Adicionar seu segundo idioma

```bash
php artisan lingua:add fr
```

Este comando:
- Baixa os arquivos de tradução em francês via Laravel Lang
- Cria um registro `Language` no banco de dados
- Sincroniza todas as strings recém-baixadas em `language_lines`

Repita para quantos locales precisar:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. Adicionar o seletor de idioma ao seu layout

Abra seu layout principal em Blade (ex: `resources/views/layouts/app.blade.php`) e:

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

## 4. Usar traduções na sua aplicação

O Lingua é transparente - use os helpers padrão do Laravel como sempre:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

O `LinguaManager` personalizado mescla automaticamente as traduções do banco de dados sobre as baseadas em arquivos. Nenhuma alteração de código é necessária.

## 5. Traduzir pela interface

Acesse `/lingua/translations` para ver todas as strings de tradução. Para cada idioma:

1. Use o seletor de locale (canto superior direito) para selecionar o idioma alvo
2. Clique em qualquer linha para editar o valor inline
3. Use **Mostrar apenas ausentes** para focar nas strings não traduzidas
4. Para tipos HTML ou Markdown, o editor de texto rico é ativado automaticamente

<Screenshot src="/screenshots/translations-page.png" alt="Página de gerenciamento de traduções do Lingua" caption="A página de traduções com seletor de locale, filtro de grupo e editor inline." />

## 6. Sincronizar de volta para arquivos (opcional)

Se precisar de arquivos de tradução em disco (para controle de versão, CI/CD ou outras ferramentas):

```bash
php artisan lingua:sync-to-local
```

Isso exporta todas as traduções do banco de dados de volta para `lang/` no formato PHP/JSON correto.

---

## Padrões comuns

### Traduzir uma nova chave programaticamente

```php
use Rivalex\Lingua\Facades\Lingua;

// Criar a tradução no banco de dados para o locale padrão
// (normalmente feito pela interface, mas você pode fazer por script também)
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

// Mais tarde, adicionar traduções para outros locales:
Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
Lingua::setTranslation('welcome_subject', 'Benvenuto nella nostra piattaforma!', 'it');
```

### Verificar completude das traduções

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]
```

### Trocar locale programaticamente

```php
// Em um controller, middleware ou service
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```

::: tip
O componente `LanguageSelector` lida com a troca de locale para usuários finais automaticamente. A abordagem manual acima é útil em comandos de console ou jobs.
:::

### Exportar apenas grupos específicos

Se quiser exportar apenas um subconjunto de traduções para arquivos, sincronize para local primeiro e depois exclua os grupos que não precisa de `lang/` - o banco de dados é sempre a fonte de verdade em tempo de execução.
