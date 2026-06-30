# Estatísticas

A página de Estatísticas (`/lingua/statistics`) dá uma visão rápida de quão
completa é sua cobertura de tradução — em toda a aplicação e por idioma.

<Screenshot src="/screenshots/statistics-page.png" alt="Página de Estatísticas do Lingua" caption="A página de estatísticas com cobertura por idioma, detalhamento por grupo e chaves ausentes." />

## Contadores de visão geral

No topo da página ficam quatro contadores de alto nível:

| Contador | Descrição |
|---|---|
| **Total de idiomas** | Número de locales instalados |
| **Total de strings** | Número de chaves de tradução no locale padrão |
| **Strings traduzidas** | Chaves que têm valor em pelo menos um locale não-padrão |
| **Strings ausentes** | Total de valores ausentes em todos os locales (strings × locales) |

Ative o toggle **Incluir traduções de vendor** para incluir ou excluir strings
de vendor de todos os contadores.

## Cobertura por idioma

<Screenshot src="/screenshots/statistics-coverage.png" alt="Seção de cobertura por idioma" caption="Cada linha de idioma mostra barra de progresso, percentual e contagem de chaves ausentes." />

A tabela principal lista cada idioma instalado com:

| Coluna | Descrição |
|---|---|
| **Idioma** | Nome de exibição + ícone de bandeira |
| **Total** | Número de chaves de referência (sempre o locale padrão) |
| **Traduzidas** | Valores presentes para este locale |
| **Ausentes** | `total - traduzidas` |
| **Conclusão** | Barra de progresso + porcentagem |

O **idioma padrão** é destacado com um badge. Como define o conjunto de chaves
de referência, sempre exibe 100%.

## Drill-down por chaves ausentes

Clique em qualquer linha de idioma para expandir a lista de chaves ausentes para
aquele locale. Cada linha mostra:

- **Grupo** — o agrupador de arquivo (ex: `validation`, `auth`)
- **Chave** — o identificador da string (ex: `required`, `failed`)
- **Valor padrão** — o valor do locale padrão como referência
- **Link Traduzir →** — abre a página de Traduções filtrada para aquele locale

<Screenshot src="/screenshots/statistics-missing.png" alt="Painel de chaves ausentes expandido" caption="O painel de chaves ausentes exibe grupo, chave e link direto para o editor." />

## Breakdown por grupo

Uma segunda tabela mostra a cobertura de tradução agrupada por **grupo de arquivo**
(auth, passwords, pagination, validation, etc.), com o número de chaves traduzidas
por idioma em cada grupo.

Use isso para identificar grupos inteiros não traduzidos ou priorizar grupos de
alta visibilidade como `validation` antes de grupos raramente vistos como `pagination`.

## Toggle de traduções de vendor

Por padrão, traduções de vendor (do próprio Laravel ou de pacotes de terceiros)
são excluídas das estatísticas. Ative **Incluir traduções de vendor** para
incluí-las.

::: info
Traduções de vendor são frequentemente mantidas pelo autor do pacote. Incluí-las
pode reduzir a cobertura aparente se você não adicionou sobrescritas específicas
por locale.
:::

## Acessando estatísticas programaticamente

As estatísticas são calculadas via o [driver de armazenamento](/pt/guide/storage)
ativo e são precisas para ambos os modos `database` e `file`.

```php
use Rivalex\Lingua\Facades\Lingua;

// Por locale
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// Todos os idiomas com estatísticas em uma única passagem
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Ausentes: {$lang->missing_strings} / {$lang->total_strings}";
}
```
