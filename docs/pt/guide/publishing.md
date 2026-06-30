# Publicando Assets

O Lingua inclui vários grupos publicáveis para que você possa sobrescrever apenas
as partes que precisa.

## Publicar tudo de uma vez

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## Tags disponíveis

### `lingua-config`

Publica o arquivo de configuração.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Saída:** `config/lingua.php`

Use isso para personalizar rotas, middleware, o driver de armazenamento, modo do
seletor, barra de ferramentas do editor, cache ou qualquer outra opção. Veja
[Configuração](/pt/guide/configuration).

---

### `lingua-migrations`

Publica as migrations do banco de dados.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

<Badge type="tip" text="Novidade na versão 2.0" /> As migrations agora são
**cientes do driver** e divididas em três arquivos separados:

| Migration | Publicada para |
|---|---|
| `create_language_lines_table` | somente driver banco de dados |
| `create_languages_table` | ambos os drivers |
| `create_lingua_settings_table` | ambos os drivers |

O driver `file` pula `create_language_lines_table`. O assistente `lingua:install`
publica o conjunto correto para o driver que você escolher, então você só precisa
desta tag se quiser personalizar o schema antes de executar as migrations.

::: warning
O assistente `lingua:install` publica e executa as migrations automaticamente.
Publique manualmente apenas se precisar personalizar o schema primeiro.
:::

---

### `lingua-translations`

Publica as strings de tradução da interface do pacote (9 locales de UI).

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Saída:** `lang/vendor/lingua/{locale}/lingua.php`

Sobrescreva qualquer rótulo, título, botão ou mensagem usado na interface do Lingua
para traduzir a interface ou adaptar o vocabulário ao estilo do seu projeto.

```
lang/
└── vendor/
    └── lingua/
        ├── en/lingua.php
        ├── fr/lingua.php
        └── it/lingua.php
```

---

### `lingua-views`

Publica todas as views Blade e Livewire.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Saída:** `resources/views/vendor/lingua/`

Use isso para personalizar layouts, modais ou o seletor de idioma. O Laravel
usa automaticamente suas views publicadas em vez dos padrões do pacote.

::: tip
Publique apenas as views que pretende alterar. As views não publicadas são servidas
diretamente do pacote e recebem atualizações upstream automaticamente.
:::

---

### `lingua-assets` (removida) <Badge type="warning" text="Removida na versão 2.0" />

A tag de publicação `lingua-assets` **não existe mais**. Na versão 2.0, os
CSS/JS compilados do Lingua são servidos internamente pela rota `lingua.assets`
(protegida por cela realpath — veja
[Segurança](/pt/guide/security#seguranca-de-assets)). Não há nada para publicar
ou copiar para `public/`, e nada para re-publicar após uma atualização.

---

## Atualizando após upgrades

Após atualizar o Lingua via Composer, re-publique as traduções de UI se você não
as personalizou, e mescle quaisquer novas chaves de configuração:

```bash
# Re-publicar traduções de UI (sobrescreve)
php artisan vendor:publish --tag="lingua-translations" --force

# Re-publicar config para obter novas chaves, depois mescle manualmente
php artisan vendor:publish --tag="lingua-config" --force
```

A flag `--force` sobrescreve arquivos existentes. Omita-a para `lingua-views`
e `lingua-config` para preservar suas personalizações locais, e mescle novas
chaves manualmente. Veja o [Guia de Atualização](/pt/guide/upgrade) para a
checklist completa 1.x → 2.0.
