# Comandos Artisan

O Lingua inclui seis comandos Artisan para gerenciamento de idiomas e traduções pelo terminal.

## Gerenciamento de idiomas

### `lingua:add {locale}`

Instala um novo idioma - baixa arquivos, cria o registro no BD, sincroniza traduções.

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**O que ele faz:**
1. Busca metadados do locale em `laravel-lang/locales`
2. Executa `lang:add {locale}` para instalar arquivos de idioma
3. Cria um registro `Language` no banco de dados
4. Executa `lingua:sync-to-database` para importar as novas strings

**Saída:**
```
Adding language: it...
Installing language files via Laravel Lang...
Creating language record in database...
Syncing translations to database...
Language 'it' added successfully.
```

::: tip
Após adicionar um idioma, acesse `/lingua/translations/it` para ver quais strings ainda precisam de tradução.
:::

---

### `lingua:remove {locale}`

Remove um idioma - exclui arquivos, limpa o banco de dados, reordena os idiomas restantes.

```bash
php artisan lingua:remove fr
```

**O que ele faz:**
1. Verifica se o idioma não é o padrão (aborta com erro se for)
2. Executa `lang:rm {locale} --force` para remover os arquivos de idioma
3. Remove todos os valores `{locale}` de `language_lines.text`
4. Exclui o registro `Language`
5. Reordena os valores de sort dos idiomas restantes
6. Executa `lingua:sync-to-database`

::: warning Proteção do idioma padrão
Você não pode remover o idioma padrão. Defina outro idioma como padrão primeiro:
```bash
php artisan lingua:add fr       # adicionar o novo padrão
# então pela interface: definir francês como padrão
php artisan lingua:remove en    # agora seguro remover inglês
```
:::

---

### `lingua:update-lang`

Atualiza todos os arquivos de idioma instalados via Laravel Lang e depois ressincroniza para o banco de dados.

```bash
php artisan lingua:update-lang
```

Execute após:
- Atualizar o Laravel (novas mensagens de validação, etc.)
- Instalar um novo pacote que inclui traduções
- Atualizar pacotes `laravel-lang/*`

---

## Sincronização de traduções

### `lingua:sync-to-database`

Importa todos os arquivos de tradução PHP/JSON locais para a tabela `language_lines`.

```bash
php artisan lingua:sync-to-database
```

**O que é importado:**
- `lang/{locale}/*.php` - arquivos PHP
- `lang/{locale}.json` - arquivos JSON
- `lang/vendor/{package}/{locale}/*.php` - arquivos de pacotes de vendor

Usa `updateOrCreate` com correspondência em `group + key`, portanto edições existentes da interface são preservadas.

**Casos de uso típicos:**
```bash
# Após um clone novo - popular o BD a partir dos arquivos lang commitados
php artisan lingua:sync-to-database

# Após lang:update - importar novas strings
php artisan lingua:sync-to-database

# Em um script de deployment
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

### `lingua:sync-to-local`

Exporta todas as traduções do banco de dados de volta para arquivos PHP/JSON locais.

```bash
php artisan lingua:sync-to-local
```

**O que é exportado:**
- Traduções do BD → `lang/{locale}/{group}.php`
- Grupo JSON (`single`) → `lang/{locale}.json`
- Traduções de vendor → `lang/vendor/{vendor}/{locale}/{group}.php`

**Casos de uso típicos:**
```bash
# Antes de fazer commit - exportar estado do BD para arquivos para controle de versão
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"

# Antes de fazer deploy para um servidor que lê a partir de arquivos
php artisan lingua:sync-to-local
```

---

### `lingua:install`

O assistente interativo de configuração inicial. Execute uma vez após `composer require`.

```bash
php artisan lingua:install
```

Não é destinado a ser re-executado após a configuração inicial. Se precisar re-publicar assets individuais, use as tags `vendor:publish` em vez disso.

---

## Referência rápida de comandos

<div class="command-table">

| Comando | Descrição |
|---|---|
| `lingua:add {locale}` | Instalar um idioma (arquivos + BD + sync) |
| `lingua:remove {locale}` | Remover um idioma (arquivos + BD + sync) |
| `lingua:update-lang` | Atualizar arquivos lang via Laravel Lang + sync |
| `lingua:sync-to-database` | Importar arquivos locais → banco de dados |
| `lingua:sync-to-local` | Exportar banco de dados → arquivos locais |
| `lingua:install` | Assistente interativo de configuração inicial |

</div>

---

## Dicas

::: tip Automatizando sync no CI/CD
Adicione sync ao seu pipeline de deployment para manter o banco de dados sincronizado com seu repositório:

```yaml
# Passo de deploy no GitHub Actions (exemplo)
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::

::: tip Adicionando vários idiomas de uma vez
Não há comando de adição em lote, mas você pode encadear chamadas em um loop de shell:

```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::

::: tip Verificando o que será sincronizado
Antes de executar `lingua:sync-to-database`, você pode visualizar o número de arquivos e locales que serão processados verificando `lang/`:

```bash
ls lang/
# en  fr  it  vendor
```
:::
