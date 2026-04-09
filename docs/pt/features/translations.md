# Gerenciamento de Traduções

A página de Traduções (`/lingua/translations/{locale?}`) permite que você navegue, filtre e edite cada string de tradução.

<Screenshot src="/screenshots/translations-page.png" alt="Página de traduções do Lingua" caption="Página de traduções - com seletor de locale, filtro de grupo e editor inline." />

## Navegando pelas traduções

### Seletor de locale

As abas de locale no topo da página permitem alternar entre os idiomas instalados. A URL é atualizada para `/lingua/translations/{locale}` para que cada visualização seja marcável e compartilhável.

A coluna do **locale padrão** é sempre exibida à esquerda como referência - você edita o locale selecionado à direita.

### Filtragem

| Filtro | Descrição |
|---|---|
| **Pesquisar** | Pesquisa pelo nome do grupo, chave e todos os valores de locale |
| **Grupo** | Filtra para um grupo específico (ex: `auth`, `validation`, `single`) |
| **Tipo** | Filtra por `text`, `html` ou `markdown` |
| **Mostrar apenas ausentes** | Exibe apenas strings sem valor no locale selecionado |

<Screenshot src="/screenshots/translations-filters.png" alt="Filtros de tradução" caption="Filtrando para exibir apenas traduções em francês ausentes no grupo de validação." />

### Paginação

Os resultados são paginados com uma contagem por página configurável (25 / 50 / 100). A página atual e a configuração por página são persistidas na query string da URL.

## Editando traduções

### Edição inline

Clique diretamente na célula de tradução para começar a editar. As alterações são salvas ao sair do foco (quando você clica em outro lugar ou pressiona Tab).

- Traduções de **texto simples** usam um `<textarea>` simples
- Traduções **HTML** abrem o editor de texto rico TipTap
- Traduções **Markdown** abrem o editor Markdown do TipTap

<Screenshot src="/screenshots/translation-editor-html.png" alt="Editor de tradução HTML" caption="O editor HTML TipTap para traduções de texto rico." width="512px" :center="true"/>

### Sincronizar a partir do padrão

Cada linha de tradução tem um botão **Sync from default** (↺). Clicar nele copia o valor do locale padrão para o locale atual - útil como ponto de partida quando você precisa apenas de pequenas alterações de texto.

### Modal de edição

Para o locale padrão, clique no ícone de lápis para abrir o modal de Edição, onde você pode alterar o tipo de tradução (text / html / markdown) e o valor.

::: tip Alterando tipos de tradução
Se você alterar uma tradução de `text` para `html`, o editor inline na linha mudará imediatamente para TipTap. O valor armazenado não é alterado - apenas o editor muda.
:::

## Criando traduções

Clique em **New Translation** para criar uma entrada personalizada. Preencha:

- **Group** - equivalente ao nome do arquivo (ex: `marketing`, `emails`)
- **Key** - a chave dentro do grupo (ex: `hero_title`)
- **Type** - `text`, `html` ou `markdown`
- **Value** - a tradução para o locale padrão

```
group: marketing
key:   hero_title
type:  text
value: Build faster, together.
```

A nova chave fica disponível imediatamente via `__('marketing.hero_title')`.

::: tip Após salvar
O campo **Group** é preservado após a criação para que você possa adicionar mais chaves ao mesmo grupo sem precisar selecioná-lo novamente. Apenas os campos **Key** e **Value** são redefinidos. Espaços iniciais, finais e internos redundantes em Group e Key são normalizados automaticamente antes de salvar.
:::

::: warning Traduções de vendor
Você não pode criar traduções diretamente em um grupo de vendor (ex: `validation`, `auth`). Esses grupos pertencem ao Laravel ou outros pacotes e são sincronizados automaticamente. Se quiser sobrescrever uma string de vendor, edite-a diretamente na página de traduções.
:::

## Excluindo traduções

### Excluir para um locale específico

Em qualquer locale não-padrão, o botão de exclusão remove apenas o valor daquele locale da coluna JSON. A chave de tradução continua existindo; ela apenas faz fallback para o locale padrão.

### Excluir completamente

Na visualização do locale padrão, o botão de exclusão remove a linha inteira de `language_lines`. Use isso para limpar chaves que não são mais usadas no seu codebase.

::: danger Proteção de traduções de vendor
Traduções de vendor não podem ser excluídas. Tentar fazê-lo exibe um aviso e dispara um evento `vendor_translation_protected`. Você só pode **editar** os valores de traduções de vendor.
:::

## Copiar chave para a área de transferência

Cada linha tem um ícone de área de transferência que copia a referência completa `group.key` (ex: `auth.failed`) para a área de transferência - útil ao referenciar chaves em Blade ou PHP.

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| `Tab` | Salvar campo atual e ir para o próximo |
| `Shift + Tab` | Salvar campo atual e ir para o anterior |
| `Escape` | Descartar alterações e fechar o editor |
