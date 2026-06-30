# Instalação

O Lingua inclui um assistente de instalação interativo que cuida de tudo em um
único comando. As etapas manuais também estão documentadas abaixo caso você prefira
mais controle.

## Passo 1 — Instalar via Composer

```bash
composer require rivalex/lingua
```

Esse é o único pacote necessário. O Lingua 2.0 inclui seus próprios dados de
localidade e conjunto de dados de tradução, portanto não há mais nada a instalar.

::: tip Atualizando da versão 1.x?
O Composer remove automaticamente a dependência antiga `spatie/laravel-translation-loader`.
Se o seu `composer.json` ainda listar `laravel-lang/common`, remova-o:
`composer remove laravel-lang/common`.
Veja o [Guia de Atualização](/pt/guide/upgrade) completo.
:::

## Passo 2 — Executar o instalador

```bash
php artisan lingua:install
```

O assistente é interativo. Usando
[Laravel Prompts](https://laravel.com/docs/prompts), ele pede que você escolha
um **driver de armazenamento** com um seletor por setas:

| Driver | Quando escolher… |
|---|---|
| **`database`** *(recomendado)* | Você quer o conjunto completo de funcionalidades: tipos HTML/Markdown, estatísticas, import/export, proteção de vendor e cache cirúrgico. |
| **`file`** | Você mantém traduções no controle de versão ou executa em um ambiente read-only/CI e prefere arquivos `lang/` simples. |

O assistente então:

1. Publica o arquivo de configuração em `config/lingua.php`
2. Publica as migrations **cientes do driver** (o driver `file` pula a
   migration `language_lines`)
3. Pergunta se deve executar as migrations automaticamente
4. Alimenta o banco de dados com seu idioma padrão e suas traduções do
   conjunto de dados empacotado — **sem downloads do GitHub**
5. Opcionalmente dá uma estrela no repositório no GitHub ⭐

Ao concluir, você verá:

```
✓ Driver selected          →  database
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua installed successfully!
```

## Passo 3 — Acessar a interface

Abra sua aplicação e acesse:

| Página | URL | Nome da rota |
|---|---|---|
| Idiomas | `your-app.test/lingua/languages` | `lingua.languages` |
| Traduções | `your-app.test/lingua/translations` | `lingua.translations` |
| Estatísticas | `your-app.test/lingua/statistics` | `lingua.statistics` |
| Transfer | `your-app.test/lingua/transfer` | `lingua.transfer` |
| Configurações | `your-app.test/lingua/settings` | `lingua.settings` |

Pronto. O Lingua está funcionando.

---

## Instalação manual

Se preferir publicar e executar cada etapa individualmente:

```bash
# 1. Publicar config
php artisan vendor:publish --tag="lingua-config"

# 2. Publicar migrations (cientes do driver)
php artisan vendor:publish --tag="lingua-migrations"

# 3. Executar migrations
php artisan migrate

# 4. Adicionar seu idioma padrão e popular suas traduções
php artisan lingua:add en
```

Veja [Publicando Assets](/pt/guide/publishing) para a lista completa de tags.

---

## Protegendo a interface de gerenciamento

<Badge type="tip" text="Novidade na versão 2.0" /> O Lingua 2.0 é **seguro por
padrão**. As rotas de gerenciamento são entregues com o middleware `['web', 'auth']`
aplicado automaticamente — visitantes anônimos não conseguem acessar a interface.

### Restringindo o acesso com um gate

Para acesso baseado em roles, defina um gate de autorização e aponte o Lingua para
ele com a variável de ambiente `LINGUA_GATE`. O Lingua adiciona `can:{gate}` às
suas rotas de administração:

```env
LINGUA_GATE=manage-translations
```

```php
// app/Providers/AppServiceProvider.php — boot()
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $user) => $user->hasRole('admin'));
```

Você também pode editar o array de middleware diretamente:

```php
// config/lingua.php
'middleware' => ['web', 'auth', 'role:admin'],
```

::: tip
Qualquer middleware aceito pelo roteador do Laravel pode ser adicionado ao array.
As alterações têm efeito imediato — não é necessário limpar o cache.
:::

Veja a [Referência de Segurança](/pt/guide/security) para a visão geral completa
de reforço.

---

## Checklist pós-instalação

- [ ] Confirmar que o driver de armazenamento em `config/lingua.php` corresponde
      ao seu deploy (`database` ou `file`)
- [ ] Opcionalmente configurar `LINGUA_GATE` para acesso baseado em roles
- [ ] Adicionar o componente de seleção de idioma ao seu layout (veja
      [Seletor de Idioma](/pt/features/language-selector))
- [ ] Definir `dir` e `lang` na sua tag `<html>` (veja
      [Suporte RTL/LTR](/pt/features/rtl-support))
- [ ] Adicionar idiomas adicionais via `php artisan lingua:add {locale}`
- [ ] Configurar a barra de ferramentas do editor em `config/lingua.php` caso
      use traduções HTML/Markdown (driver banco de dados)
