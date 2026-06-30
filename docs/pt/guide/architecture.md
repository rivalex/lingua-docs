# Como Funciona

Entender os internos do Lingua facilita sua configuração, depuração e extensão.

## Ciclo de vida da requisição

```
Browser request
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware       │  Lê 'locale' da sessão
│  app()->setLocale($locale)  │  Usa o padrão do BD como fallback
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│        Your Controller      │
│  __('auth.failed')          │  Helper padrão do Laravel
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  estende Illuminate FileLoader
│  Traduções BD mescladas     │  BD sempre vence em sobreposição
│  sobre traduções em arquivo │  (modo arquivo = FileLoader padrão)
└───┬─────────────────────────┘
    │
    ▼
String traduzida retornada
```

## Carregamento de traduções

O `LinguaManager` estende o próprio `Illuminate\Translation\FileLoader` do
Laravel — **não** há dependência da Spatie. Ele é registrado decorando o binding
do carregador do framework:

```php
$app->extend('translation.loader', function ($original, $app) {
    return new LinguaManager($app, $original);
});
```

No **modo banco de dados**, para cada `(locale, group)` ele carrega as traduções
baseadas em arquivo via o carregador original, depois mescla os valores do banco de
dados por cima usando `array_replace_recursive`. **O valor do banco de dados sempre
vence** em sobreposição, então você pode sobrescrever qualquer string de vendor ou
de arquivo sem tocar nos arquivos fonte.

Se a tabela `language_lines` ainda não existir (por exemplo, antes das migrations
serem executadas), uma `QueryException` é capturada e o `LinguaManager` faz
fallback gracioso para o modo somente-arquivo.

No **modo arquivo**, o `LinguaManager` se comporta como o `FileLoader` padrão —
nenhuma consulta ao banco de dados é feita. Veja [Drivers de Armazenamento](/pt/guide/storage).

## Middleware

O `LinguaMiddleware` é automaticamente adicionado ao grupo de middleware `web` na
inicialização via `LinguaServiceProvider`. Ele é executado em cada requisição web:

```php
// Lógica simplificada
$locale = session()->get(config('lingua.session_variable'))
    ?? Language::default()?->code
    ?? config('app.locale');

app()->setLocale($locale);
app()->setFallbackLocale($defaultLocale);
session()->put(config('lingua.session_variable'), $locale);
```

## Service provider

O `LinguaServiceProvider` faz o seguinte na inicialização:

1. **Registra componentes Blade anônimos** sob o prefixo `lingua::`
2. **Registra componentes Livewire** sob o namespace `lingua::`
3. **Decora o binding `translation.loader`** via `$app->extend(...)`,
   envolvendo o carregador do Laravel com `LinguaManager`

Como o provider *decora* em vez de *substituir* o carregador principal, ele
compõe de forma limpa com o `TranslationServiceProvider` do Laravel. A ordem de
autoload do Composer cuida automaticamente da ordem de inicialização.

## Schema do banco de dados

Três tabelas são utilizadas (o driver `file` omite `language_lines`):

### `languages`

| Coluna | Tipo | Observações |
|---|---|---|
| `id` | bigint | Chave primária |
| `code` | string | Código ISO 639-1 (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Código regional completo (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` ou `'standard'` |
| `name` | string | Nome de exibição em inglês (`French`) |
| `native` | string | Nome nativo (`Français`) |
| `direction` | string | `'ltr'` ou `'rtl'` |
| `is_default` | boolean | Apenas um registro deve ser `true` |
| `sort` | integer | Ordem de exibição (atribuída automaticamente) |

### `language_lines`

| Coluna | Tipo | Observações |
|---|---|---|
| `id` | bigint | Chave primária |
| `group` | string | Grupo de tradução (`auth`, `validation`, `single`) |
| `key` | string | Chave de tradução (`failed`, `required`) |
| `text` | json, **nullable** | `{"en": "…", "fr": "…"}` |
| `type` | string | `'text'`, `'html'` ou `'markdown'` |
| `is_vendor` | boolean | `true` para strings de pacotes de terceiros |
| `vendor` | string, nullable | Nome do vendor (ex: `laravel`) |

A coluna JSON `text` armazena **todos os locales em uma única linha**:

- Adicionar um novo locale nunca altera o schema
- Uma única query busca todos os valores de locale para uma chave
- Locales ausentes simplesmente não têm chave no objeto JSON

### `lingua_settings`

Tabela chave/valor que sustenta a UI de Configurações (ex: o toggle de
navegação compartilhada).

## Conjunto de dados empacotado

O Lingua 2.0 inclui todos os dados de localidade dentro do pacote:

- **`LocaleRegistry`** (`Rivalex\Lingua\Locales\LocaleRegistry`) — metadados
  para 129+ locales. `Lingua::info($locale)` retorna um objeto de valor readonly
  `LocaleInfo` (`->name`, `->native`, `->direction`, `->regional`, `->code`,
  `->type`), ou `null` para locales desconhecidos.
- **Traduções empacotadas** — 26 locales × 7 grupos, 5902 strings, alinhado
  ao Laravel **v13.14.0**. Um `NotificationProjector` deriva strings de
  notificação. `lingua:add` popula a partir deste conjunto de dados sem
  chamadas de rede.

## Arquitetura de cache

No modo banco de dados, o Lingua armazena em cache as traduções **cirurgicamente**
por `(locale, group)`:

- As chaves são como `lingua.trans.{locale}.{group}`
- Em um save/delete de `Translation`, apenas `Cache::forget('lingua.trans.{locale}.{group}')`
  para as chaves afetadas é executado — **não** há `cache:clear` global em
  nenhum caminho de sincronização
- Store e prefixo são configuráveis via `cache.store` / `cache.prefix`

## Models

| Model | Tabela | Estende |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `Illuminate\Database\Eloquent\Model` |

`Translation` fornece `getTranslationsForGroup()`, helpers de sincronização,
helpers de estatísticas e `forgetTranslation()` — que lança
`VendorTranslationProtectedException` para linhas de vendor. O scope de query
`scopeOrdered()` substitui o antigo `scopeActive()` (um delegado é mantido para
compatibilidade retroativa).
