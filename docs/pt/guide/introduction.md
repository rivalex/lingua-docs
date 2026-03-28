<figure style="margin: 30px auto 30px !important; max-width: 640px;">
  <img src="../../public/logoLinguaHorizontal-light.svg" class="logo-light" alt="Language selector in sidebar mode">
  <img src="../../public/logoLinguaHorizontal-dark.svg" class="logo-dark" alt="Language selector in sidebar mode">
</figure>

# O que é o Lingua?

O Lingua é um **pacote Laravel** que substitui o sistema de traduções padrão baseado em arquivos por um sistema totalmente orientado a banco de dados, com uma bela interface de gerenciamento reativa construída sobre [Livewire 4](https://livewire.laravel.com) e [Flux 2](https://fluxui.dev).

## O problema que ele resolve

As traduções padrão do Laravel ficam em arquivos PHP e JSON dentro de `lang/`. Isso funciona bem para projetos pequenos, mas gera atritos conforme a aplicação cresce:

- **Atualizar uma tradução exige um deploy** - mesmo para corrigir um simples erro de digitação.
- **Membros não técnicos da equipe não conseguem editar traduções** - editores precisam de Git e code review.
- **Acompanhar a completude das traduções é manual** - é preciso comparar arquivos para encontrar lacunas.
- **Suportar muitos locales bagunça o código** - dezenas de arquivos espalhados por diretórios.

O Lingua armazena todas as traduções no banco de dados, em uma única coluna JSON por registro, e fornece uma interface Livewire onde qualquer usuário autorizado pode gerenciar idiomas e strings em tempo real.

## Como funciona em linhas gerais

```
┌─────────────────────────────────────────────────────────┐
│                   Laravel Application                   │
│                                                         │
│  lang/en/messages.php  ──┐                              │
│  lang/fr/messages.php    │  lingua:sync-to-database     │
│  lang/en.json            ├─────────────────────────────►│
│  lang/vendor/…           │                              │
│                         ─┘   language_lines (DB)        │
│                              ┌──────────────────────┐   │
│  LinguaMiddleware  ◄──────── │ group │ key │ text   │   │
│  app()->setLocale()          │ auth  │ … │ {"en":…} │   │
│                              └──────────────────────┘   │
│  __('auth.failed')  ───────────────────────────────────►│
│  (DB takes precedence over files)                       │
└─────────────────────────────────────────────────────────┘
```

Em tempo de execução, o Lingua registra um `LinguaManager` personalizado como loader de traduções do Laravel. Ele mescla as traduções em arquivo e em banco de dados - **as entradas do banco de dados sempre têm precedência** - para que você possa sobrescrever qualquer string sem tocar nos arquivos de código.

## Conceitos principais

| Conceito | Descrição |
|---|---|
| **Language** | Um locale instalado com metadados (nome, nome nativo, direção, ordem de exibição, flag padrão) |
| **Translation** | Um registro em `language_lines` com `group`, `key`, `type` e uma coluna JSON `text` com todos os valores de locale |
| **Tipo de tradução** | `text`, `html` ou `markdown` - determina qual editor é exibido na interface |
| **Vendor translation** | Uma tradução que pertence a um pacote de terceiros; protegida contra exclusão acidental |
| **Locale padrão** | O idioma principal; excluir uma tradução do locale padrão remove o registro inteiro |
| **Sync** | O processo de importar arquivos locais → BD (`sync-to-database`) ou exportar BD → arquivos (`sync-to-local`) |

## Requisitos

| Dependência | Versão |
|---|----------|
| PHP | **8.2+** |
| Laravel | **11 \| 12 \| 13** |
| Livewire | **4.0+** |
| Livewire Flux | **2.0+** |

## Próximo passo

Acesse o [Guia de instalação](/pt/guide/installation) para configurar o Lingua em menos de cinco minutos.
