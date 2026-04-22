# Estatísticas de tradução

A página de Estatísticas fornece uma visão geral em tempo real da cobertura das suas traduções em todos os idiomas instalados.

```blade
<a href="{{ route('lingua.statistics') }}">Estatísticas de tradução</a>
```

<Screenshot src="/screenshots/statistics-page.png" alt="Página de Estatísticas de tradução" caption="A página de estatísticas mostrando cobertura por idioma, detalhamento por grupo e chaves ausentes." />

## Visão geral

A página exibe três contadores resumidos no topo:

- **Total de chaves** — número total de strings de tradução no banco de dados
- **Total de grupos** — número de grupos de tradução distintos
- **Idiomas instalados** — número de idiomas registrados no sistema

Você pode ativar **Incluir traduções de fornecedor** para incluir ou excluir traduções de pacotes de todas as estatísticas.

## Cobertura por idioma

<Screenshot src="/screenshots/statistics-coverage.png" alt="Seção de cobertura por idioma" caption="Cada linha de idioma mostra uma barra de progresso, percentual e contagem de chaves ausentes." />

Para cada idioma instalado você pode ver:

| Coluna | Descrição |
|---|---|
| Idioma | Nome e bandeira do idioma |
| Cobertura | Barra de progresso com percentual de conclusão |
| Traduzidas | Número de chaves que têm um valor para esta locale |
| Ausentes | Número de chaves sem valor — clique para expandir o painel de chaves ausentes |

O **idioma padrão** é destacado com um badge. Como a locale padrão define o conjunto de chaves de referência, ela sempre exibe 100% de cobertura.

## Detalhamento de chaves ausentes

Clique no **badge da contagem ausente** em qualquer linha de idioma para expandir o painel de chaves ausentes inline.

<Screenshot src="/screenshots/statistics-missing.png" alt="Painel de chaves ausentes expandido" caption="O painel de chaves ausentes exibe grupo, chave e um link direto para o editor de traduções." />

Cada linha no painel exibe:

- **Grupo** — o grupo de tradução (ex. `validation`, `auth`)
- **Chave** — a chave de tradução (ex. `required`, `failed`)
- **Traduzir →** link — abre a página de Traduções pré-filtrada para aquela locale

Clique na mesma linha de idioma novamente para recolher o painel.

## Detalhamento por grupo

<Screenshot src="/screenshots/statistics-breakdown.png" alt="Tabela de detalhamento por grupo" caption="A tabela de detalhamento mostra a contagem de chaves traduzidas por locale para cada grupo." />

A tabela de detalhamento lista cada grupo de tradução com o número de chaves traduzidas por idioma instalado. Use-a para identificar quais grupos estão totalmente traduzidos e quais precisam de atenção.

## Toggle de traduções de fornecedor

Por padrão, traduções de fornecedor (de pacotes como `laravel/framework`) são excluídas das estatísticas. Ative **Incluir traduções de fornecedor** para incluí-las.

::: info
Traduções de fornecedor são frequentemente mantidas pelo autor do pacote. Incluí-las nas suas estatísticas pode reduzir sua cobertura aparente se você não adicionou sobrescritas específicas por locale.
:::

::: tip Trabalhando com eficiência
Ordene pela contagem ausente para priorizar seu esforço de tradução. Os idiomas com mais chaves ausentes no topo da sua lista precisam de mais atenção.
:::
