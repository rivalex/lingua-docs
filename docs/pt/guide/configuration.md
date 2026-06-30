# Configuração

Após a instalação, `config/lingua.php` é a única fonte de verdade para todas as
configurações do Lingua. Esta página documenta cada chave, agrupada por tema.
As chaves marcadas com <Badge type="tip" text="Novidade na versão 2.0" /> não
existiam na versão 1.x.

## Configurações de localidade

```php
// config/lingua.php

'lang_dir'         => lang_path(),
'base_translations_path' => null, // ★ Novidade na versão 2.0
'default_locale'   => config('app.locale', 'en'),
'fallback_locale'  => config('app.fallback_locale', 'en'),
'session_variable' => 'locale',
```

### `lang_dir`

**Padrão:** `lang_path()` — resolve para `{project_root}/lang/`.

O diretório que o Lingua lê ao sincronizar arquivos para o banco de dados e grava
ao exportar de volta para arquivos.

### `base_translations_path` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `null`

Substituição opcional para o caminho de onde o Lingua lê o conjunto de dados de
tradução **empacotado**. Deixe `null` para usar o conjunto de dados incluído no pacote.

### `default_locale`

**Padrão:** `config('app.locale', 'en')`

Usado como fallback durante a instalação e quando a tabela `languages` está vazia.
Após a instalação, o padrão autoritativo é o registro na tabela `languages` com
`is_default = true`.

### `fallback_locale`

**Padrão:** `config('app.fallback_locale', 'en')`

Fallback padrão do Laravel — quando uma chave está ausente no locale ativo,
este locale é tentado em seguida.

### `session_variable`

**Padrão:** `'locale'`

A chave de sessão onde o Lingua armazena o locale escolhido pelo usuário.

---

## Segurança & acesso

```php
'middleware' => ['web', 'auth'],
'gate'       => env('LINGUA_GATE', null), // ★ Novidade na versão 2.0
```

### `middleware`

**Padrão:** `['web', 'auth']` <Badge type="warning" text="Alterado na versão 2.0" />

::: tip Seguro por padrão
Na versão 2.0 o padrão é `['web', 'auth']` — a interface de gerenciamento **não**
é acessível publicamente por padrão. Era `['web']` na versão 1.x.
:::

```php
// Com Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// Com uma Gate policy personalizada
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `gate` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `env('LINGUA_GATE', null)`

Quando definido, o Lingua adiciona `can:{gate}` a todas as rotas de administração.
Defina o gate em um service provider:

```env
LINGUA_GATE=manage-translations
```

```php
Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

Veja a [Referência de Segurança](/pt/guide/security#autenticacao).

---

## Roteamento

```php
'routes_prefix'           => 'lingua',
'routes_extra_parameters' => null,  // ★ Novidade na versão 2.0
'navigate'                => false, // ★ Novidade na versão 2.0 (padrão alterado)
'layout'                  => null,  // ★ Novidade na versão 2.0
```

### `routes_prefix`

**Padrão:** `'lingua'`

Altera o prefixo de URL para todas as páginas de gerenciamento do Lingua:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
```

### `routes_extra_parameters` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `null`

Sufixo parametrizado opcional adicionado ao prefixo da rota — útil para prefixos
com escopo de tenant ou seção.

### `navigate` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `false` <Badge type="warning" text="Alterado na versão 2.0" />

Controla `wire:navigate` nos links internos do Lingua. O padrão agora é `false`
(redirecionamentos de página completa), o que evita casos extremos de navegação SPA.
Ative com `'navigate' => true`.

### `layout` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `null`

Forneça um layout Blade personalizado para as views do Lingua. Deixe `null` para
usar o layout integrado do pacote.

---

## Navegação

```php
'nav' => [
    'enabled' => true, // ★ Novidade na versão 2.0
],
'links' => [
    'translations' => [          // ★ Novidade na versão 2.0
        'enabled' => true,
        'route'   => 'lingua.translations',
    ],
],
```

### `nav.enabled` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `true`

Ativa ou desativa o menu de navegação compartilhado `x-lingua::nav` que aparece
em todas as cinco páginas do Lingua. Também pode ser alternado pela UI de
Configurações.

### `links.translations` <Badge type="tip" text="Novidade na versão 2.0" />

Controla a entrada "Translations" na navegação compartilhada: se é exibida
(`enabled`) e para qual rota aponta (`route`).

---

## UI

```php
'ui' => [
    'sticky_top' => 0, // ★ Novidade na versão 2.0
],
'selector' => [
    'mode'       => 'sidebar',  // 'sidebar' | 'modal' | 'dropdown' | 'headless'
    'show_flags' => true,
],
'editor' => [
    'headings' => false, 'bold' => true, 'italic' => true,
    'underline' => true, 'strikethrough' => false,
    'subscript' => true, 'superscript' => true,
    'blockquote' => false, 'code-line' => false, 'code-block' => false,
    'bullet' => true, 'ordered' => true, 'clear' => true, 'code-mode' => false,
],
```

### `ui.sticky_top` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `0`

Deslocamento em pixels para as barras de ferramentas fixas do Lingua. Aumente
se sua aplicação tem um cabeçalho fixo para que as barras de ferramentas não
deslizem por baixo dele.

### `selector.mode`

**Padrão:** `'sidebar'`

| Valor | Descrição |
|---|---|
| `sidebar` | Item de navegação agrupado na sidebar |
| `dropdown` | Botão dropdown compacto |
| `modal` | Botão que abre um modal de seleção de locale |
| `headless` | Sem renderização integrada — use o componente headless |

### `selector.show_flags`

**Padrão:** `true`

Se deve exibir ícones de bandeiras ao lado dos nomes dos idiomas.

### `editor`

Controla a barra de ferramentas de texto rico para os tipos de tradução HTML e
Markdown (somente driver banco de dados). Cada chave ativa uma opção de formatação:
`headings`, `bold`, `italic`, `underline`, `strikethrough`, `subscript`,
`superscript`, `blockquote`, `code-line`, `code-block`, `bullet`,
`ordered`, `clear`, `code-mode`.

---

## Driver de armazenamento <Badge type="tip" text="Novidade na versão 2.0" />

```php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

### `storage.driver`

**Padrão:** `env('LINGUA_STORAGE_DRIVER', 'database')`

Seleciona onde as traduções ficam armazenadas:

| Driver | Comportamento |
|---|---|
| `database` | O comportamento completo da versão 1.x: tabela `language_lines`, tipos HTML/Markdown, estatísticas, import/export, proteção de vendor, cache cirúrgico. |
| `file` | Lê/escreve arquivos PHP+JSON de `lang/` diretamente; sem tabela `language_lines`; tipos são achatados para texto simples. |

Este é um recurso principal — veja [Drivers de Armazenamento](/pt/guide/storage)
para a comparação completa e o comando `lingua:storage`.

---

## Cache

```php
'cache' => [
    'store'  => env('LINGUA_CACHE_STORE', null),       // ★ Novidade na versão 2.0
    'prefix' => env('LINGUA_CACHE_PREFIX', 'lingua.trans'), // ★ Novidade na versão 2.0
],
```

### `cache.store` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `env('LINGUA_CACHE_STORE', null)`

Qual store de cache o Lingua usa para cache de traduções. `null` usa o store
padrão da sua aplicação.

### `cache.prefix` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `env('LINGUA_CACHE_PREFIX', 'lingua.trans')`

Prefixo para chaves de cache. O Lingua armazena em cache as traduções
**cirurgicamente** por `(locale, group)` e apaga apenas a chave afetada na
escrita — não há `cache:clear` global. Veja
[Arquitetura de Cache](/pt/guide/architecture#arquitetura-de-cache).

---

## Carregadores de tradução

```php
'translation_loaders' => [
    // Rivalex\Lingua\Loaders\YourCustomLoader::class,
],
'model'               => Rivalex\Lingua\Models\Translation::class,
'translation_manager' => Rivalex\Lingua\TranslationManager\LinguaManager::class,
```

### `translation_loaders`

Registre carregadores adicionais implementando
`Rivalex\Lingua\Contracts\TranslationLoader`. A assinatura do contrato é
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### `model`

O model Eloquent que sustenta `language_lines`. Sobrescreva para estender
`Translation` com sua própria lógica.

### `translation_manager`

A classe do carregador de traduções. Padrão para
`Rivalex\Lingua\TranslationManager\LinguaManager`, que estende
`Illuminate\Translation\FileLoader`.

---

## Extensões

```php
'extensions' => [
    'enabled' => env('LINGUA_EXTENSIONS_ENABLED', true), // ★ Novidade na versão 2.0
],
'suppress_pro_nudge' => env('LINGUA_SUPPRESS_PRO_NUDGE', false), // ★ Novidade na versão 2.0
'pro_upgrade_url'    => env('LINGUA_PRO_UPGRADE_URL', 'https://lingua.rivalex.dev'), // ★ Novidade na versão 2.0
```

### `extensions.enabled` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `true`

Chave mestra para extensões opcionais do Lingua.

### `suppress_pro_nudge` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `false`

Defina como `true` para ocultar dicas de atualização na interface.

### `pro_upgrade_url` <Badge type="tip" text="Novidade na versão 2.0" />

**Padrão:** `https://lingua.rivalex.dev`

URL usada pelas dicas de atualização quando exibidas.
