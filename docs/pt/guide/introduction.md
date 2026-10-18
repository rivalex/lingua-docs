<figure style="margin: 30px auto 30px !important; max-width: 640px;">
  <img src="../../public/logoLinguaHorizontal-light.svg" class="logo-light" alt="Lingua">
  <img src="../../public/logoLinguaHorizontal-dark.svg" class="logo-dark" alt="Lingua">
</figure>



# O que é o Lingua?

O Lingua é um **pacote Laravel** para gerenciamento multilíngue. Ele pode armazenar
todas as traduções no banco de dados e inclui uma bela interface de gerenciamento
reativa construída sobre [Livewire 4](https://livewire.laravel.com) e
[Flux 2](https://fluxui.dev) — ou, se preferir, continue trabalhando com arquivos
`lang/` simples usando a mesma interface.

::: tip Novidade na versão 2.0
A versão 2.0 remove completamente as dependências externas `spatie/laravel-translation-loader` e
`laravel-lang/common`, adiciona um sistema de
[driver de armazenamento](/pt/guide/storage) plugável (banco de dados **ou** arquivo), um
fluxo de trabalho de [Transfer](/pt/guide/quick-start) para import/export, e uma
[passagem abrangente de segurança reforçada](/pt/guide/security). É seguro por padrão.
:::

## O problema que ele resolve

As traduções padrão do Laravel ficam em arquivos PHP e JSON dentro de `lang/`.
Isso funciona bem para projetos pequenos, mas gera atritos conforme a aplicação cresce:

- **Atualizar uma tradução exige um deploy** — mesmo para corrigir um simples
  erro de digitação.
- **Membros não técnicos da equipe não conseguem editar traduções** — editores
  precisam de Git e code review.
- **Acompanhar a completude das traduções é manual** — é preciso comparar
  arquivos para encontrar lacunas.
- **Suportar muitos locales bagunça o código** — dezenas de arquivos
  espalhados por diretórios.

Com o **driver de banco de dados** padrão, o Lingua armazena todas as traduções em
uma única coluna JSON por registro e fornece uma interface Livewire onde qualquer
usuário autorizado pode gerenciar idiomas e strings em tempo real.

## Como funciona em linhas gerais

```
┌─────────────────────────────────────────────────────────┐
│                   Laravel Application                     │
│                                                           │
│  lang/en/messages.php  ──┐                                │
│  lang/fr/messages.php    │  lingua:sync-to-database       │
│  lang/en.json            ├──────────────────────────────►│
│  lang/vendor/…           │                                │
│                         ─┘   language_lines (DB)          │
│                              ┌──────────────────────┐     │
│  LinguaManager (DB driver) ◄ │ group │ key │ text   │     │
│  app()->setLocale()          │ auth  │ … │ {"en":…} │     │
│                              └──────────────────────┘     │
│  __('auth.failed')  ─────────────────────────────────────►│
│  (DB takes precedence over files)                         │
└─────────────────────────────────────────────────────────┘
```

Em tempo de execução, o `LinguaManager` do Lingua estende o próprio
`Illuminate\Translation\FileLoader` do Laravel e é registrado como o carregador
de traduções. No **modo banco de dados**, ele mescla as traduções baseadas em
arquivo e em banco de dados com `array_replace_recursive` — **as entradas do banco
de dados sempre têm precedência** — para que você possa sobrescrever qualquer
string sem tocar nos arquivos fonte. No **modo arquivo**, ele se comporta como o
carregador padrão do Laravel, apoiado pela mesma interface.

## Conceitos principais

| Conceito | Descrição |
|---|---|
| **Driver de armazenamento** | `database` (padrão) ou `file` — veja [Drivers de Armazenamento](/pt/guide/storage) |
| **Language** | Um locale instalado com metadados (nome, nome nativo, direção, ordem de exibição, flag padrão) |
| **Translation** | Um registro em `language_lines` com `group`, `key`, `type` e uma coluna JSON `text` com todos os valores de locale |
| **Tipo de tradução** | `text`, `html` ou `markdown` — determina qual editor é exibido na interface (somente driver banco de dados) |
| **Vendor translation** | Uma tradução que pertence a um pacote de terceiros; protegida contra exclusão acidental |
| **Locale padrão** | O idioma principal; excluir uma tradução do locale padrão remove o registro inteiro |
| **Sync** | Importar arquivos locais → BD (`sync-to-database`) ou exportar BD → arquivos (`sync-to-local`) |

## Requisitos

| Dependência | Versão |
|---|---|
| PHP | **8.3+** |
| Laravel | **12 \| 13** |
| Livewire | **4.1+** |
| Livewire Flux | **2.12+** |

::: tip Sem carregadores de tradução externos
O Lingua 2.0 **não** possui dependência de runtime com Spatie ou laravel-lang. Os
metadados de localidade (129+ locales) e o conjunto de dados de tradução empacotado
(26 locales × 7 grupos, 5902 strings, alinhado ao Laravel v13.14.0) estão incluídos
dentro do pacote — sem downloads do GitHub no momento da instalação.
:::

## Próximo passo

Acesse o [Guia de Instalação](/pt/guide/installation) para configurar o Lingua
em menos de cinco minutos, ou leia o [Guia de Atualização](/pt/guide/upgrade) se
você está vindo da versão 1.x.
