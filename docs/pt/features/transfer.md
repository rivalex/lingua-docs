# Import / Export <Badge type="tip" text="Novidade na versão 2.0" />

A página Transfer (`/lingua/transfer`) move traduções para dentro e fora do Lingua
em massa. Exporte uma planilha para tradutores, receba-a preenchida, visualize as
alterações e confirme — tudo sem sair da interface de administração.

<Screenshot src="/screenshots/transfer-page.png" alt="Página Transfer do Lingua" caption="A página Transfer — painéis de export e import lado a lado." />

## Formatos suportados

| Formato | Disponibilidade | Observações |
|---|---|---|
| **CSV** | Integrado | Bilíngue ou multi-locale |
| **JSON** | Integrado | Bilíngue, multi-locale ou json-native (flat `key: value`) |
| **XLSX** | Opcional | Requer `openspout/openspout` |
| **ODS** | Opcional | Requer `openspout/openspout` |

CSV e JSON funcionam sem instalação adicional. Para habilitar os formatos de
planilha, instale o OpenSpout:

```bash
composer require openspout/openspout
```

Quando o OpenSpout está ausente, o Lingua detecta isso e as opções XLSX/ODS ficam
indisponíveis; CSV e JSON permanecem totalmente funcionais.

## Export

<Screenshot src="/screenshots/transfer-export.png" alt="Painel de export do Transfer" caption="Escolhendo um formato, escopo e locales antes de baixar." />

Escolha um **formato**, um **escopo** e os **locales** a incluir, depois baixe o
arquivo via a rota `lingua.transfer.export` (tratada por
`TransferExportController::download`).

### Escopos de export

| Escopo | Colunas produzidas | Melhor para |
|---|---|---|
| `bilingual` | Locale de origem + um locale alvo | Enviar um único idioma para um tradutor |
| `multi-locale` | Cada locale instalado como sua própria coluna | Um snapshot completo ou revisão em massa |
| `json-native` | Pares `key: value` flat | Arquivos de locale baseados em JSON |

### Fluxo de trabalho típico

1. Exporte o escopo e formato que precisa.
2. Edite o arquivo externamente (app de planilha, ferramenta de tradução ou manualmente).
3. Re-importe e revise o diff do dry-run.
4. Confirme.

## Import

A importação é um processo deliberado **em dois passos** para que nada mude até
você ter visto exatamente o que vai acontecer.

### Passo 1 — Prévia dry-run

O `ImportDiffService` analisa o arquivo enviado e produz um diff **sem escrever
nada**. Ele reporta quatro contagens:

| Resultado | Significado |
|---|---|
| **Create** | O valor de chave/locale ainda não existe e será adicionado |
| **Update** | O valor existente é diferente e será sobrescrito |
| **Skip** | O valor é idêntico, ou a linha está protegida/sem correspondência |
| **Error** | A linha não pôde ser analisada ou mapeada |

<Screenshot src="/screenshots/transfer-import-diff.png" alt="Diff do dry-run de import" caption="A prévia do dry-run mostra contagens de criação / atualização / pulo / erro antes de confirmar." />

### Passo 2 — Confirmar

O `ImportCommitService` aplica o diff:

- No modo **database** o commit é executado dentro de uma transação — é tudo ou nada.
- No modo **file** as linhas são escritas sequencialmente nos arquivos `lang/`.

## Salvaguardas

### Proteção de vendor

Linhas pertencentes a vendor não podem ser sobrescritas através de import,
espelhando a [proteção de exclusão](/pt/features/vendor-translations#mecanismo-de-protecao)
em outros lugares no Lingua. Essas linhas são reportadas em **Skip**.

### Correspondência de cabeçalho de coluna

Imports bilíngues correspondem colunas a locales de forma inteligente. Quando o
cabeçalho não corresponde exatamente ao código do locale (por exemplo, um locale
`it_IT` contra uma coluna `it - Italian`), um fallback de coluna única resolve:
se exatamente uma coluna não-meta, não-fonte estiver presente, ela é usada
incondicionalmente. Dois ou mais candidatos ambíguos são deixados sem correspondência
e reportados em vez de adivinhados.

### Proteção contra injeção de fórmula

Qualquer célula cujo valor começa com `=`, `+`, `-`, `@`, um tab ou um retorno
de carro é prefixada com uma aspas simples (`'`) no export. Isso neutraliza
[injeção de fórmula CSV/planilha](/pt/guide/security) para que um valor malicioso
não possa ser executado quando o arquivo é aberto no Excel, Sheets ou LibreOffice.

## Notas sobre driver e dependências

- Dry-run e commit funcionam em **ambos** os drivers de armazenamento.
- XLSX e ODS requerem `openspout/openspout`; sem ele, use CSV ou JSON.
- Veja [Drivers de armazenamento](/pt/guide/storage) para as compensações entre
  banco de dados e arquivo.

## Componentes e rotas

| Parte | Referência |
|---|---|
| Componente de página | Componente Livewire `Transfer` (`/lingua/transfer`) |
| Componente de export | Componente Livewire `Export` |
| Componente de import | Componente Livewire `Import` |
| Rota de download | `lingua.transfer.export` → `TransferExportController::download` |
| Serviços | `ExportService`, `ImportDiffService`, `ImportCommitService` |
