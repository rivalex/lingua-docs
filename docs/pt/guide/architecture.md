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
└──────────────┬──────────────┘
               │
    ▼
┌─────────────────────────────┐
│        Your Controller      │
│  __('auth.failed')          │  Helper padrão do Laravel
└──────────────┬──────────────┘
               │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  Custom TranslationLoaderManager
│  1. DB loader (Spatie)      │  BD sempre vence em sobreposição
│  2. File loader (fallback)  │
└──────────────┬──────────────┘
               │
    ▼
Translated string returned
```

## Carregamento de traduções

O `LinguaManager` estende o `TranslationLoaderManager` da Spatie. Em tempo de execução, ele mescla duas fontes:

1. **File loader** — lê de `lang/` como o Laravel padrão faz
2. **Database loader** (loader `Db` da Spatie) — lê de `language_lines`

Quando a mesma chave existe em ambas as fontes, **o valor do banco de dados vence**. Isso permite sobrescrever qualquer tradução de vendor ou baseada em arquivo sem tocar nos arquivos fonte.

Se a tabela `language_lines` ainda não existir (por exemplo, antes de as migrations serem executadas), o `LinguaManager` faz fallback gracioso para o modo somente-arquivo.

## Middleware

O `LinguaMiddleware` é automaticamente adicionado ao grupo de middleware `web` na inicialização via `LinguaServiceProvider`. Ele é executado em cada requisição web:

```php
// Simplified logic
$locale = session()->get(config('lingua.session_variable'))
    ?? Language::default()?->code
    ?? config('app.locale');

app()->setLocale($locale);
app()->setFallbackLocale($defaultLocale);
session()->put(config('lingua.session_variable'), $locale);
```

## Service provider

O `LinguaServiceProvider` faz três coisas na inicialização:

1. **Registra componentes Blade anônimos** sob o prefixo `lingua::`
2. **Registra componentes Livewire** sob o namespace `lingua::`
3. **Substitui os singletons `translator` e `translation.loader`** no container IoC pelas implementações personalizadas do Lingua

Como o service provider substitui o binding do translator principal, é importante que ele inicialize *após* o `TranslationServiceProvider` do Laravel. A ordem de autoload do Composer cuida disso automaticamente.

## Schema do banco de dados

Duas tabelas são utilizadas:

### `languages`

| Coluna | Tipo | Observações |
|---|---|---|
| `id` | bigint (auto-increment) | Chave primária |
| `code` | string | Código ISO 639-1 (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | Código regional completo (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` ou `'standard'` |
| `name` | string | Nome de exibição em inglês (`French`) |
| `native` | string | Nome nativo (`Français`) |
| `direction` | string | `'ltr'` ou `'rtl'` |
| `is_default` | boolean | Apenas um registro deve ser `true` |
| `sort` | integer | Ordem de exibição (atribuída automaticamente) |

### `language_lines` (Spatie)

| Coluna | Tipo | Observações |
|---|---|---|
| `id` | bigint (auto-increment) | Chave primária |
| `group` | string | Grupo de tradução (`auth`, `validation`, `single`) |
| `key` | string | Chave de tradução (`failed`, `required`) |
| `text` | json | `{"en": "…", "fr": "…", "it": "…"}` |
| `type` | string | `'text'`, `'html'` ou `'markdown'` |
| `is_vendor` | boolean | `true` para strings de pacotes de terceiros |
| `vendor` | string, nullable | Nome do vendor (ex: `spatie`, `laravel`) |

A coluna JSON `text` armazena **todos os locales em uma única linha**. Este design significa que:
- Adicionar um novo locale nunca altera o schema
- Uma única query busca todos os valores de locale para uma chave
- Locales ausentes simplesmente não têm chave no objeto JSON

## Seeder

O `LinguaSeeder` é chamado uma vez durante `lingua:install`. Ele:

1. Lê `config('lingua.default_locale')` (padrão para `config('app.locale')`)
2. Busca metadados do locale em `laravel-lang/locales`
3. Cria um registro `Language` com `is_default = true`
4. Chama `lingua:add {locale}` para instalar os arquivos de idioma
5. Chama `lingua:sync-to-database` para importar todas as strings

## Models

| Model | Tabela | Estende |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `LanguageLine` da Spatie |

`Translation` herda os métodos `setTranslation()` e `forgetTranslation()` da Spatie e adiciona scopes específicos do Lingua, métodos de sync e helpers de estatísticas.
