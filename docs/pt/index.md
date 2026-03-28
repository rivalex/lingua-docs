---
layout: home

hero:
  name: "LINGUA"
  text: "Traduções gerenciadas pelo banco de dados para Laravel"
  tagline: Instale idiomas, gerencie traduções e troque de idioma - tudo por meio de uma bela interface Livewire, sem necessidade de deploys.
  image:
    light: /logoLinguaVertical-light.svg
    dark: /logoLinguaVertical-dark.svg
    alt: Lingua UI
  actions:
    - theme: brand
      text: Começar
      link: /pt/guide/introduction
    - theme: alt
      text: Ver no GitHub
      link: https://github.com/rivalex/lingua

features:
  - icon: 🗄️
    title: Traduções no banco de dados
    details: Todas as traduções ficam no banco de dados e são editáveis instantaneamente - sem necessidade de fazer deploy de arquivos. O laravel-translation-loader da Spatie cuida da camada de carregamento.

  - icon: ⚡
    title: Livewire + Flux UI
    details: Interface de gerenciamento reativa e em tempo real construída com Livewire 4 e Flux 2. Cada ação - adicionar idioma, editar tradução, sincronizar - ocorre sem recarregar a página.

  - icon: 🔄
    title: Sincronização bidirecional
    details: Importe seus arquivos PHP/JSON existentes para o banco de dados com um único comando, ou exporte tudo de volta para arquivos para controle de versão e deploys.

  - icon: 🌐
    title: Mais de 70 idiomas
    details: Instale qualquer locale do ecossistema Laravel Lang com um único comando Artisan. Arquivos de idioma, registros no banco de dados e traduções são configurados automaticamente.

  - icon: ✍️
    title: Suporte a texto rico
    details: Cada tradução pode ser texto simples, HTML ou Markdown. O editor correto é ativado automaticamente com base no tipo da tradução.

  - icon: ↔️
    title: Suporte a RTL / LTR
    details: Árabe, hebraico, persa e outros idiomas RTL são totalmente suportados. O Lingua armazena e expõe a direção do texto para cada idioma.

  - icon: 📦
    title: Traduções de pacotes
    details: Gerencie traduções de pacotes (mensagens de validação, paginação, etc.) junto com suas próprias strings, com proteção integrada contra exclusões acidentais.

  - icon: 📊
    title: Acompanhamento de progresso
    details: Cada idioma exibe um percentual de conclusão e a contagem de traduções ausentes, para que você sempre saiba o que precisa ser traduzido.

  - icon: 🧪
    title: Totalmente testado
    details: Mais de 150 testes Pest cobrindo todos os comandos Artisan, componentes Livewire, componentes Blade, helpers e a API completa do facade.
---
