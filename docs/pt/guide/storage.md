# Drivers de Armazenamento

<Badge type="tip" text="Novidade na versão 2.0" /> O Lingua 2.0 apresenta um
sistema de **driver de armazenamento** plugável. Você escolhe onde as traduções
ficam: no **banco de dados** (o padrão completo) ou em **arquivos `lang/`** simples.

```php
// config/lingua.php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

## Escolhendo um driver

| Funcionalidade | `database` | `file` |
|---|:---:|:---:|
| Armazenamento | tabela `language_lines` | PHP + JSON em `lang/` |
| Tipos HTML / Markdown | ✅ | ❌ (achatados para texto simples) |
| Estatísticas de tradução | ✅ | ✅ (calculadas a partir dos arquivos) |
| Import / export (Transfer) | ✅ | ✅ |
| Proteção de vendor | ✅ | ✅ |
| Cache cirúrgico por (locale,group) | ✅ | n/a |
| Botões de sync na UI | ✅ | ocultos |
| Editar traduções na UI | ✅ | ✅ |

::: tip Regra geral
Use **database** para a experiência mais rica e substituições em runtime. Use
**file** quando as traduções devem ficar no controle de versão ou o sistema de
arquivos é a fonte de verdade.
:::

## Driver banco de dados

O padrão, idêntico ao comportamento da versão 1.x.

- Traduções armazenadas na tabela `language_lines`, todos os locales em uma
  coluna JSON `text` por linha
- Suporta tipos `text`, `html` e `markdown`, cada um com seu próprio editor
- Cache cirúrgico: `Cache::forget('lingua.trans.{locale}.{group}')` em
  cada escrita — sem flush global
- Estatísticas completas, import/export e proteção de vendor
- Substituições em runtime vencem sobre arquivos `lang/` via `array_replace_recursive`

## Driver arquivo

Lê e escreve arquivos PHP e JSON de `lang/` diretamente. **Não** há tabela
`language_lines`.

::: danger Perda de tipo no modo arquivo
O driver `file` armazena apenas strings simples. Tipos HTML e Markdown são
**achatados para texto simples** — o editor por tipo e os metadados de tipo
não estão disponíveis. Se você depende de traduções HTML/Markdown, use o driver
banco de dados.
:::

- Sem consultas ao banco de dados; comporta-se como o `FileLoader` padrão do Laravel
- Botões de sync são **ocultos** na UI (os arquivos *são* o armazenamento)
- `lingua:sync-to-local` é um **no-op sem `--force`** (o BD de onde exportaria
  não é o armazenamento ativo)
- Edições na UI são gravadas diretamente nos arquivos via `AtomicFileWriter`
  (renomeação atômica + `opcache_invalidate` — veja
  [Segurança](/pt/guide/security#seguranca-no-modo-arquivo))

::: warning Cuidado com deploy
Em plataformas que reconstroem `lang/` do seu repositório a cada deploy
(ex: Forge, Envoyer, imagens de container), edições feitas na UI no modo arquivo
podem ser **sobrescritas** no próximo deploy. Faça commit das alterações de volta
ao seu repositório, ou use o driver banco de dados.
:::

## Alternando drivers

Use o comando `lingua:storage` para alternar a qualquer momento. Ele **sincroniza
antes de alternar** para que nada seja perdido.

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```

| Flag | Efeito |
|---|---|
| `--force` | Pular prompts de confirmação |
| `--write-env` | Atualizar `LINGUA_STORAGE_DRIVER` no `.env` |
| `--no-migrate` | Pular a etapa de garantia de migration |

### Banco de dados → arquivo

O Lingua **exporta** o banco de dados para `lang/` primeiro, avisando sobre
quaisquer strings HTML/Markdown que perderão seu tipo, depois alterna o driver ativo.

### Arquivo → banco de dados

O Lingua **sincroniza** `lang/` para o banco de dados e garante que a migration
`language_lines` foi executada, depois alterna.

## Instalando com escolha de driver

O instalador interativo pergunta qual driver usar e publica migrations **cientes
do driver** — o driver `file` pula completamente a migration `language_lines`:

```bash
php artisan lingua:install
```

Veja [Instalação](/pt/guide/installation).

## Desinstalando

`lingua:uninstall` desmonta o Lingua com segurança:

```bash
php artisan lingua:uninstall
```

Ele **exporta o banco de dados para `lang/` primeiro**, depois descarta as três
tabelas do Lingua (`language_lines`, `languages`, `lingua_settings`). Seu
diretório `lang/` é preservado.

| Flag | Efeito |
|---|---|
| `--force` | Pular prompts de confirmação |
| `--keep-config` | Manter `config/lingua.php` no lugar |
| `--keep-published` | Manter views/migrations publicadas no lugar |

## Consultas diretas (driver banco de dados)

```php
use Rivalex\Lingua\Models\Translation;

// Todas as traduções que têm um valor em francês
Translation::whereNotNull('text->fr')->get();

// Apenas traduções em francês ausentes
Translation::whereNull('text->fr')->get();

// Uma chave específica
Translation::where('group', 'validation')->where('key', 'required')->first();
```

Veja [Traduções de Vendor](/pt/features/vendor-translations) para como strings
de pacotes são protegidas em ambos os drivers.
