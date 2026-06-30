# Sincronização Bidirecional

O Lingua sincroniza traduções entre o banco de dados e os arquivos `lang/` nos
dois sentidos — banco de dados para edição ao vivo, arquivos para controle de
versão ou CI/CD.

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (DB)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄── lingua:sync-to-local
                      ─┘
```

## Comandos de sincronização

### `lingua:sync-to-database`

Importa todos os arquivos `lang/` locais para a tabela `language_lines`.

```bash
php artisan lingua:sync-to-database
```

Equivalente UI: botão **Sync from files** na página de Idiomas.

**O que é importado:**
- `lang/{locale}/*.php` — arquivos PHP padrão
- `lang/{locale}.json` — arquivos JSON
- `lang/vendor/{package}/{locale}/*.php` — traduções de pacotes de vendor

**Comportamento de upsert:** usa `updateOrCreate` com correspondência em
`group + key`, então edições existentes feitas na interface são **preservadas**.
A detecção de tipo é executada no valor (`text` / `html` / `markdown`).

**Cache:** invalida apenas as chaves afetadas (`lingua.trans.{locale}.{group}`)
— sem flush global.

### `lingua:sync-to-local`

Exporta todas as traduções do banco de dados de volta para `lang/`.

```bash
php artisan lingua:sync-to-local
```

Equivalente UI: botão **Sync to files** na página de Idiomas.

**O que é exportado:**
- Todas as traduções não-vendor → `lang/{locale}/{group}.php`
- Grupo JSON (`single`) → `lang/{locale}.json`
- Traduções de vendor → `lang/vendor/{vendor}/{locale}/{group}.php`

Usa `AtomicFileWriter` — cada arquivo é escrito em um temp e renomeado
atomicamente, então requisições concorrentes nunca leem um arquivo parcial.
Chama `opcache_invalidate()` após cada escrita.

::: tip Modo arquivo
No driver de armazenamento `file`, o botão Sync to files fica bloqueado na UI
— o modo arquivo já escreve em disco. Só executa com `--force` pela CLI.
:::

### `lingua:update-lang` <Badge type="tip" text="Novidade na versão 2.0" />

Re-popula os locales instalados a partir do **conjunto de dados empacotado** e
depois mescla os arquivos `lang/` locais por cima.

```bash
php artisan lingua:update-lang
```

Equivalente UI: botão **Update** na página de Idiomas.

Execute após instalar uma nova versão do Lingua para receber strings de tradução
atualizadas.

## O conjunto de dados empacotado <Badge type="tip" text="Novidade na versão 2.0" />

O Lingua 2.0 inclui um conjunto de dados de tradução interno — **sem dependência
de `laravel-lang/common` ou downloads do GitHub**.

| Detalhe | Valor |
|---|---|
| Locales | 26 |
| Grupos | 7 (auth, passwords, pagination, validation, single + notificações) |
| Total de strings | 5902 |
| Alinhado com | Laravel v13.14.0 |

Quando você executa `lingua:add {locale}`, strings são populadas **instantaneamente**
a partir deste conjunto. Nenhuma chamada de rede é feita.

## Invalidação de cache cirúrgica

Toda operação de sincronização invalida apenas as chaves de cache afetadas:

```
Cache::forget("lingua.trans.{$locale}.{$group}")
```

Edições em `auth.en` não invalidam `validation.fr` nem qualquer outro par não
relacionado. Em aplicações de alto tráfego, isso previne ondas de cache frio
após uma sincronização.

## Fluxos de trabalho típicos

### Edição ao vivo + versionamento

```bash
# 1. Editar strings na UI do Lingua
# 2. Exportar após revisão
php artisan lingua:sync-to-local
git add lang/ && git commit -m "chore: sync translations"
```

### Import de planilha de agência

```
1. Export via página Transfer → CSV/XLSX bilíngue
2. Agência preenche valores
3. Import via página Transfer → prévia dry-run → confirmar
4. php artisan lingua:sync-to-local  # opcional, se quiser arquivos em disco
```

### Atualizar conjunto de dados após upgrade do Lingua

```bash
composer update rivalex/lingua
php artisan lingua:update-lang
```

## Integridade dos dados

- **Banco de dados vence sobre arquivos** em runtime (via `array_replace_recursive` no `LinguaManager`)
- **Sync-to-database vence** para chaves importadas dos arquivos
- **Valores editados na UI** são preservados entre sincronizações via `updateOrCreate`

Veja [Como Funciona](/pt/guide/architecture#carregamento-de-traducoes) para a
mecânica completa de mesclagem em runtime.
