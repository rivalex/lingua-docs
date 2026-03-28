# Publicando Assets

O Lingua inclui vários grupos publicáveis para que você possa sobrescrever apenas as partes que precisa.

## Publicar tudo de uma vez

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## Tags individuais

### `lingua-config`

Publica o arquivo de configuração.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Saída:** `config/lingua.php`

Use isso para personalizar rotas, middleware, modo do seletor, barra de ferramentas do editor ou qualquer outra opção.

---

### `lingua-migrations`

Publica as migrations do banco de dados.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

**Saída:** `database/migrations/YYYY_MM_DD_HHMMSS_create_lingua_table.php`

Use isso se precisar modificar o schema de `languages` ou `language_lines` - por exemplo, para adicionar índices ou alterar tipos de colunas. Após publicar, execute `php artisan migrate` normalmente.

::: warning
O assistente `lingua:install` publica e executa as migrations automaticamente. Publique manualmente apenas se precisar personalizar o schema antes de executá-las.
:::

---

### `lingua-translations`

Publica as strings de tradução da interface do pacote.

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Saída:** `lang/vendor/lingua/{locale}/lingua.php`

Isso expõe cada rótulo, título, botão e mensagem usados na interface do Lingua. Sobrescreva qualquer string para:
- Traduzir a interface para o idioma da sua aplicação
- Adaptar o vocabulário ao estilo do seu projeto (ex: "Add language" → "Install locale")

Os arquivos publicados seguem a estrutura padrão de traduções de vendor do Laravel:

```
lang/
└── vendor/
    └── lingua/
        ├── en/
        │   └── lingua.php
        ├── fr/
        │   └── lingua.php
        └── it/
            └── lingua.php
```

---

### `lingua-views`

Publica todas as views Blade e Livewire.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Saída:** `resources/views/vendor/lingua/`

Use isso para personalizar layouts, modais ou o componente do seletor de idioma. O Laravel usa automaticamente suas views publicadas em vez dos padrões do pacote.

```
resources/views/vendor/lingua/
├── components/
│   ├── autocomplete.blade.php
│   ├── clipboard.blade.php
│   ├── editor.blade.php
│   ├── language-flag.blade.php
│   ├── menu-group.blade.php
│   └── message.blade.php
└── livewire/
    ├── languages.blade.php
    ├── language-selector.blade.php
    ├── translations.blade.php
    └── translation/
        ├── create.blade.php
        ├── delete.blade.php
        ├── row.blade.php
        └── update.blade.php
```

::: tip
Publique apenas as views que pretende alterar. As views não publicadas são servidas diretamente do pacote e recebem atualizações upstream automaticamente.
:::

---

### `lingua-assets`

Publica CSS e JavaScript compilados em `public/`.

```bash
php artisan vendor:publish --tag="lingua-assets"
```

**Saída:** `public/vendor/lingua/`

Necessário apenas se você servir assets diretamente de `public/` em vez de via Vite ou CDN. **Re-execute após cada atualização do Lingua** para manter os assets sincronizados.

---

## Atualizando após upgrades

Após atualizar o Lingua via Composer, re-publique os assets alterados:

```bash
# Sempre re-publique assets compilados
php artisan vendor:publish --tag="lingua-assets" --force

# Re-publique traduções da interface se não as personalizou
php artisan vendor:publish --tag="lingua-translations" --force
```

A flag `--force` sobrescreve arquivos existentes. Omita-a para `lingua-views` e `lingua-config` para preservar suas personalizações locais.
