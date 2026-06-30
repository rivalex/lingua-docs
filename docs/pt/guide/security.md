# Segurança

O Lingua 2.0 passou por uma passagem abrangente de reforço e é **seguro por
padrão**. Esta página documenta as proteções em vigor e as ações que você deve
tomar para manter seu deploy seguro.

::: tip Seguro por padrão
A interface de gerenciamento é entregue com middleware `['web', 'auth']`, os assets
são servidos de uma cela realpath e o input de tradução é sanitizado. Você opta
*por* acesso mais amplo, não por sair dele.
:::

## Passagem de reforço v2.0 (F1–F9)

| ID | Nome | Do que protege | Como | Arquivo |
|---|---|---|---|---|
| F1 | Guarda de DoS de cache | Crescimento ilimitado de cache de strings de locale arbitrárias | Validação de regex de locale antes de `rememberForever` | `src/Database/DatabaseRepository.php` |
| F2 | Bloqueio de SQL injection | Injeção via funções SQL JSON | Funções SQL JSON removidas; toda agregação feita em PHP | `src/Database/DatabaseRepository.php` |
| F3 | Path traversal | Escapar do diretório de traduções | `PathGuard::assertSafeSegment()` | `src/Support/PathGuard.php`, `src/Locales/BundledTranslationSource.php` |
| F4 | Poluição de locale / injeção de nome de arquivo | Escrever em locales não instalados; nomes de arquivo de download maliciosos | Abort 422 em locale alvo não instalado; `Content-Disposition` sanitizado | `src/Livewire/Import.php`, `src/Http/Controllers/TransferExportController.php` |
| F5 | Proteção de vendor | Excluir strings de vendor protegidas | `VendorTranslationProtectedException` lançada em `forgetTranslation()` para linhas de vendor | `src/Exceptions/VendorTranslationProtectedException.php`, ambos repositórios |
| F6 | Rejeição de chave wildcard | Mass-assignment via chaves wildcard | Rejeita `*` / `\0` na identidade de import | `src/Transfer/RowMapper.php` |
| F7 | Limite ReDoS | Backtracking catastrófico na detecção de tipo | Regex de tipo mais restrita (`\[[^\]]+\]`); pular regex para strings > 10000 chars | `src/Livewire/Translation/Row.php` |
| F8 | Não-divulgação de exceção | Vazamento de internos para a UI | Erro localizado genérico para UI; detalhe para `Log::error` | `src/Livewire/Import.php` |
| F9 | Gate de autenticação | Acesso não autorizado a rotas de administração | Middleware `can:{gate}` adicionado quando `LINGUA_GATE` está definido | `routes/web.php`, `config/lingua.php` |

## Proteção XSS

Traduções HTML são sanitizadas por `HtmlSanitizer`
(`src/Support/HtmlSanitizer.php`) antes do armazenamento e renderização:

- Parsing baseado em DOM com uma **lista branca de atributos por tag**
- Validação de URI — apenas esquemas `http`, `https` e `mailto` são permitidos
- Remoção de caracteres de controle (derrota truques como `java\tscript:`)

XSS armazenado tem escopo apenas para o tipo `html`; traduções `text` são
sempre escapadas.

## Autenticação

As rotas de gerenciamento têm padrão `['web', 'auth']`. Para acesso baseado
em roles, defina um gate de autorização:

```env
LINGUA_GATE=manage-translations
```

```php
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

O Lingua adiciona `can:manage-translations` às suas rotas de administração. Você
também pode editar o array `middleware` diretamente (veja
[Configuração](/pt/guide/configuration#seguranca-acesso)).

## Proteção contra open-redirect

Quando um usuário troca de locale, o Lingua recarrega a página **atual**. O
alvo é derivado de `ManagesLocale::getRequestUri()` e validado contra uma
**guarda de regex de caminho local**, então um atacante não pode injetar uma
URL absoluta no redirecionamento.

## Segurança de assets

Os CSS/JS compilados do Lingua são servidos pela rota `lingua.assets`, que
resolve o arquivo solicitado através de uma **cela realpath** — requisições que
resolvem fora do diretório de assets do pacote são rejeitadas. A rota de assets
fica **fora** do grupo de rotas autenticadas para que os estilos carreguem nas
telas de login.

## Segurança no modo arquivo

No [driver de armazenamento `file`](/pt/guide/storage), edições na UI são
escritas por `AtomicFileWriter` (`src/Support/AtomicFileWriter.php`):

- Escreve em um arquivo temporário e depois **renomeia atomicamente** para o lugar,
  para que uma requisição concorrente nunca leia um arquivo parcialmente escrito
- Chama `opcache_invalidate($path, true)` após a renomeação para que o novo
  bytecode seja captado dentro da mesma requisição

## Guarda contra injeção de fórmula

Células de planilha exportadas e importadas que começam com `=`, `+`, `-`,
`@`, tab ou retorno de carro são prefixadas com uma aspas simples (`'`) para
neutralizar injeção de fórmula em CSV/planilha.

## Correções anteriores (v1.1.x)

A linha 1.1.x incluiu correções adicionais que se propagam para a versão 2.0:

- **3 CRÍTICAS** — path traversal na rota de assets (cela realpath), SQL
  injection via locale-em-JSON, bypass de autenticação (middleware `auth` padrão)
- **2 ALTAS** — open-redirect na troca de locale, XSS armazenado com escopo
  para o tipo `html`
- **5 MÉDIAS** — injeção de argumento Artisan (mudado para forma de array), TypeError
  de `Language` nulo, clamp de `$perPage` (≤ 100) e validação de input relacionada
- **4 BAIXAS** — reforço variado e correções de divulgação

## Checklist de segurança

- [ ] Manter o middleware `['web', 'auth']` padrão (ou mais restrito)
- [ ] Definir `LINGUA_GATE` para acesso baseado em roles em aplicações multi-usuário
- [ ] Usar o tipo `html` apenas para conteúdo confiável; preferir `text`
      em outros lugares
- [ ] No modo arquivo, garantir que deploys não exponham caminhos de escrita
      de `lang/` a usuários não confiáveis
- [ ] Manter o Lingua atualizado para receber correções de segurança

## Reportando vulnerabilidades

Por favor, reporte problemas de segurança de forma privada para
[security@rivalex.com](mailto:security@rivalex.com). Não abra issues públicas
no GitHub para vulnerabilidades.
