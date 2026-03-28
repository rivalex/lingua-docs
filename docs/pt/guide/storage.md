# Armazenamento de Traduções

Entender como as traduções são armazenadas ajuda a consultá-las, importá-las e exportá-las corretamente.

## A tabela `language_lines`

Cada linha em `language_lines` representa uma **string** traduzível - não um locale. Todos os valores de locale são armazenados juntos em uma única coluna JSON `text`:

```
group      | key        | type | text
-----------|------------|------|---------------------------------------------------
validation | required   | text | {"en":"The :attribute field is required.","fr":"Le champ :attribute est obligatoire."}
auth       | failed     | text | {"en":"These credentials do not match.","it":"Le credenziali non corrispondono."}
single     | Welcome    | text | {"en":"Welcome","fr":"Bienvenue","de":"Willkommen"}
emails     | subject    | html | {"en":"<b>Welcome</b> to our platform!"}
```

### Vantagens deste design

- **Uma linha por string** - sem linhas por locale para gerenciar
- **Adicionar um locale é não-destrutivo** - basta adicionar uma nova chave ao objeto JSON
- **Traduções ausentes são explícitas** - se `fr` está ausente do JSON, a string ainda não foi traduzida
- **Query única** - um único `SELECT` busca todos os valores de locale para uma chave

### Consultando diretamente

Você pode consultar `language_lines` usando a sintaxe padrão de coluna JSON do Eloquent:

```php
use Rivalex\Lingua\Models\Translation;

// Todas as traduções que têm um valor em francês
Translation::whereNotNull('text->fr')->get();

// Apenas traduções em francês ausentes
Translation::whereNull('text->fr')->get();

// Encontrar uma chave específica
Translation::where('key', 'required')->where('group', 'validation')->first();

// Todas as strings em um grupo
Translation::where('group', 'auth')->get();
```

## Tipos de tradução

Cada linha de tradução tem um `type` que determina o editor usado na interface:

| Tipo | Caso de uso | Detectado automaticamente ao sincronizar |
|---|---|---|
| `text` | Rótulos simples, mensagens, texto de botões | Padrão |
| `html` | Conteúdo rico com tags HTML | String contém elementos HTML |
| `markdown` | Conteúdo formatado em Markdown | String é analisada como Markdown |

A detecção de tipo é realizada durante `lingua:sync-to-database`. Você pode alterar o tipo a qualquer momento pelo modal de Edição na interface.

### Exemplo: tradução HTML

```php
Translation::create([
    'group' => 'marketing',
    'key'   => 'hero_subtitle',
    'type'  => 'html',
    'text'  => ['en' => '<strong>Build faster</strong> with fewer tools.'],
]);
```

### Exemplo: tradução Markdown

```php
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_body',
    'type'  => 'markdown',
    'text'  => ['en' => "# Welcome!\n\nThank you for signing up.\n\n**Your account is now active.**"],
]);
```

## Chaves de tradução

O Lingua usa a mesma convenção de duas partes `group.key` das traduções padrão do Laravel:

| Formato | Exemplo | Chamada `trans()` |
|---|---|---|
| Chave de arquivo PHP | `auth.failed` | `__('auth.failed')` |
| Chave JSON / single | `Welcome` | `__('Welcome')` |
| Chave de vendor | `spatie::messages.error` | via namespace de vendor |

::: tip group vs. key
A coluna `group` mapeia para o nome do arquivo (`auth` = `lang/en/auth.php`) e a `key` mapeia para a chave do array dentro desse arquivo. Para arquivos JSON, o group é `'single'`.
:::

## Traduções de vendor

As traduções de vendor são marcadas com `is_vendor = true` e carregam uma string `vendor` (ex: `'spatie'`, `'laravel'`). Elas são sincronizadas dos diretórios `lang/vendor/{vendor}/{locale}/`.

- Elas **podem ser editadas** na interface (para sobrescrever o texto do vendor)
- Elas **não podem ser excluídas** - tentar fazê-lo dispara um evento `vendor_translation_protected`
- Os campos `group` e `key` são **bloqueados** no modal de atualização

Veja [Traduções de Vendor](/pt/features/vendor-translations) para detalhes completos.
