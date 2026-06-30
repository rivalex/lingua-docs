# Gerenciamento de Traduções

A página de Traduções (`/lingua/translations/{locale?}`) permite que você navegue,
filtre e edite cada string de tradução. Ela compartilha o
[menu de navegação](/pt/features/settings#menu-de-navegacao) com as outras páginas
do Lingua.

<Screenshot src="/screenshots/translations-page.png" alt="Página de traduções do Lingua" caption="Página de traduções — com seletor de locale, barra de filtros e editor inline." />

## Navegando pelas traduções

### Seletor de locale

As abas de locale no topo permitem alternar entre os idiomas instalados. A URL é
atualizada para `/lingua/translations/{locale}` para que cada visualização seja
marcável e compartilhável.

A coluna do **locale padrão** é sempre exibida à esquerda como referência — você
edita o locale selecionado à direita.

::: tip <Badge type="tip" text="Alterado" /> A troca mantém seu lugar
Alterar o locale agora recarrega a **página atual** em vez de redirecionar para
o início. O mesmo se aplica ao widget [seletor de idioma](/pt/features/language-selector#como-a-troca-de-locale-funciona)
em toda a sua aplicação.
:::

### Filtragem

A barra de filtros é uma única linha flex que se reorganiza responsivamente:

| Filtro | Descrição |
|---|---|
| **Pesquisar** | Pesquisa pelo nome do grupo, chave e todos os valores de locale |
| **Grupo** | Filtra para um grupo específico (ex: `auth`, `validation`, `single`) |
| **Tipo** | Filtra por `text`, `html` ou `markdown` |
| **Mostrar apenas ausentes** | Exibe apenas strings sem valor no locale selecionado |
| **Incluir vendor** | Alterna se linhas pertencentes a vendor aparecem na lista |

<Screenshot src="/screenshots/translations-filters.png" alt="Filtros de tradução" caption="Filtrando para exibir apenas traduções em francês ausentes no grupo de validação." />

### Paginação

Os resultados são paginados com uma contagem por página configurável (25 / 50 / 100).
A página atual e a configuração por página são persistidas na query string da URL.

## Editando traduções

### Edição inline

Clique diretamente na célula de tradução para começar a editar. As alterações são
salvas ao perder o foco (quando você clica em outro lugar ou pressiona Tab).

- Traduções de **texto simples** usam um `<textarea>` simples
- Traduções **HTML** abrem o [editor de texto rico TipTap](/pt/features/rich-text)
- Traduções **Markdown** abrem o editor Markdown do TipTap

<Screenshot src="/screenshots/translation-editor-html.png" alt="Editor de tradução HTML" caption="O editor HTML TipTap para traduções de texto rico." width="512px" :center="true"/>

### Sincronizar a partir do padrão

Cada linha tem um botão **Sync from default** (↺). Clicar nele copia o valor
do locale padrão para o locale atual — um ponto de partida útil quando você
precisa apenas de pequenas alterações de texto.

### Modal de edição

Para strings longas, conteúdo HTML ou Markdown, clique no ícone de lápis para
abrir o modal de Edição. No locale padrão você também pode alterar o **tipo**
de tradução (text / html / markdown) aqui. Alterar o tipo troca o editor
imediatamente — o valor armazenado é mantido intacto.

## Criando traduções

Clique em **New Translation** e preencha:

- **Group** — o equivalente ao nome do arquivo (ex: `marketing`, `emails`)
- **Key** — a chave dentro do grupo (ex: `hero_title`)
- **Type** — `text`, `html` ou `markdown`
- **Value** — a tradução para o locale padrão

```
group: marketing
key:   hero_title
type:  text
value: Build faster, together.
```

A nova chave fica disponível imediatamente via `__('marketing.hero_title')`.

::: tip Após salvar
O campo **Group** é preservado após a criação para que você possa adicionar
várias chaves ao mesmo grupo sem precisar selecioná-lo novamente. Apenas **Key**
e **Value** são redefinidos. Espaços iniciais, finais e internos redundantes em
Group e Key são normalizados automaticamente antes de salvar.
:::

::: warning Grupos de vendor
Você não pode criar novas chaves diretamente dentro de um grupo pertencente a
vendor. Esses grupos são gerenciados pelo Laravel ou outros pacotes. Para alterar
uma string de vendor, **edite-a** no lugar — veja
[Traduções de vendor](/pt/features/vendor-translations).
:::

## Excluindo traduções

### Excluir para um locale específico

Em um locale não-padrão, o botão de exclusão remove apenas o valor daquele locale.
A chave continua existindo e faz fallback para o locale padrão.

### Excluir completamente

Na visualização do locale padrão, o botão de exclusão remove a linha inteira. Use
isso para limpar chaves que não são mais referenciadas no seu codebase.

::: danger Proteção de traduções de vendor
Linhas de vendor **não podem ser excluídas** em nenhum dos drivers de armazenamento.
Uma tentativa lança `VendorTranslationProtectedException` no nível do repositório;
na UI ela aparece como um aviso e despacha um evento `vendor_translation_protected`
sem excluir nada. Você ainda pode **editar** valores de vendor. Veja
[Traduções de vendor](/pt/features/vendor-translations#mecanismo-de-protecao).
:::

## Copiar chave para a área de transferência

Cada linha tem um ícone de área de transferência que copia a referência completa
`group.key` (ex: `auth.failed`) — útil ao referenciar chaves em Blade ou PHP.

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| `Tab` | Salvar campo atual e ir para o próximo |
| `Shift + Tab` | Salvar campo atual e ir para o anterior |
| `Escape` | Descartar alterações e fechar o editor |
