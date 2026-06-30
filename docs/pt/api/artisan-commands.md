# Comandos Artisan

O Lingua inclui **oito comandos Artisan** para gerenciamento de idiomas e
traduções pelo terminal. <Badge type="tip" text="Novidade na versão 2.0" />
`lingua:storage` e `lingua:uninstall` foram adicionados na versão 2.0.

## Gerenciamento de idiomas

### `lingua:add {locale}`

Instala um novo idioma — popula strings do conjunto de dados empacotado, cria o
registro no BD. **Nenhum download do GitHub** é feito.

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**O que ele faz:**
1. Resolve metadados do locale via `LocaleRegistry` interno
2. Cria um registro `Language` no banco de dados
3. Popula strings do conjunto de dados empacotado (26 locales × 7 grupos, 5902 strings)
4. Invalida o cache por `(locale, group)` para cada grupo adicionado

```
✓ Language record created: it (Italian / Italiano)
✓ Bundled translations seeded: 187 strings
Language 'it' added successfully.
```

::: tip
Após adicionar, acesse `/lingua/translations/it` para ver quais strings ainda
precisam de tradução manual.
:::

---

### `lingua:remove {locale}`

Remove um idioma — exclui o registro e todos os valores de tradução para aquele
locale, depois reordena os idiomas restantes.

```bash
php artisan lingua:remove fr
```

::: warning Proteção do idioma padrão
Não é possível remover o idioma padrão. Defina outro como padrão primeiro:

```bash
# Definir francês como padrão pela UI de configurações, depois:
php artisan lingua:remove en
```
:::

---

### `lingua:install`

Assistente interativo de configuração inicial com seletor de driver por setas.

```bash
php artisan lingua:install
```

**O que ele faz:**
1. Apresenta um seletor de driver (`database` | `file`) via Laravel Prompts
2. Publica `config/lingua.php`
3. Publica migrations **cientes do driver** (o driver `file` pula `language_lines`)
4. Pergunta se deve executar as migrations automaticamente
5. Popula o idioma padrão e suas traduções do conjunto de dados empacotado

Destinado a ser executado **uma vez** após `composer require`. Use as tags
`vendor:publish` individuais para re-publicar assets depois.

---

## Sincronização de traduções

### `lingua:sync-to-database`

Importa todos os arquivos de tradução PHP/JSON locais para `language_lines`.

```bash
php artisan lingua:sync-to-database
```

**O que é importado:**
- `lang/{locale}/*.php` — arquivos PHP
- `lang/{locale}.json` — arquivos JSON
- `lang/vendor/{package}/{locale}/*.php` — traduções de vendor

Usa `updateOrCreate` com correspondência em `group + key` — edições da UI são
preservadas. Invalida o cache cirurgicamente por `(locale, group)`.

```bash
# Típico em scripts de deploy
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

### `lingua:sync-to-local`

Exporta todas as traduções do banco de dados para arquivos PHP/JSON em `lang/`.

```bash
php artisan lingua:sync-to-local
```

**O que é exportado:**
- Não-vendor → `lang/{locale}/{group}.php`
- Grupo JSON (`single`) → `lang/{locale}.json`
- Vendor → `lang/vendor/{vendor}/{locale}/{group}.php`

Usa `AtomicFileWriter` (renomeação atômica + `opcache_invalidate`).

```bash
# Exportar antes de commit
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"
```

---

### `lingua:update-lang`

Re-popula locales instalados a partir do conjunto de dados empacotado e depois
mescla os arquivos `lang/` locais por cima.

```bash
php artisan lingua:update-lang
```

Execute após atualizar o Lingua via Composer para receber strings de tradução
novas ou atualizadas.

---

## Driver de armazenamento <Badge type="tip" text="Novidade na versão 2.0" />

### `lingua:storage {driver}`

Alterna o driver de armazenamento. **Sincroniza antes de alternar** para que
nada seja perdido.

```bash
php artisan lingua:storage file
php artisan lingua:storage database
```

| Flag | Efeito |
|---|---|
| `--force` | Pular prompts de confirmação |
| `--write-env` | Atualizar `LINGUA_STORAGE_DRIVER` no `.env` |
| `--no-migrate` | Pular a etapa de garantia de migration |

**BD → arquivo:** exporta o banco de dados para `lang/`, avisa sobre quaisquer
strings HTML/Markdown que perderão tipo, depois alterna.

**Arquivo → BD:** sincroniza `lang/` para o banco de dados e garante que a
migration `language_lines` foi executada, depois alterna.

---

## Desinstalação <Badge type="tip" text="Novidade na versão 2.0" />

### `lingua:uninstall`

Desmonta o Lingua com segurança.

```bash
php artisan lingua:uninstall
```

**O que ele faz:**
1. **Exporta o banco de dados para `lang/`** (preserva os dados)
2. Descarta as três tabelas do Lingua (`language_lines`, `languages`, `lingua_settings`)
3. Opcionalmente remove `config/lingua.php` e assets publicados

| Flag | Efeito |
|---|---|
| `--force` | Pular prompts de confirmação |
| `--keep-config` | Manter `config/lingua.php` |
| `--keep-published` | Manter views/migrations publicadas |

::: danger Irreversível
Este comando descarta tabelas do banco de dados. Verifique que o export de `lang/`
foi concluído antes de confirmar.
:::

---

## Referência rápida

| Comando | Descrição |
|---|---|
| `lingua:add {locale}` | Instalar idioma (BD + conjunto de dados empacotado) |
| `lingua:remove {locale}` | Remover idioma (BD + reordenação) |
| `lingua:install` | Assistente de configuração inicial |
| `lingua:sync-to-database` | Importar arquivos locais → banco de dados |
| `lingua:sync-to-local` | Exportar banco de dados → arquivos locais |
| `lingua:update-lang` | Re-popular locales do conjunto de dados empacotado |
| `lingua:storage {driver}` | Alternar driver de armazenamento com sync automático |
| `lingua:uninstall` | Desmontar o Lingua com segurança (exportar + descartar tabelas) |
