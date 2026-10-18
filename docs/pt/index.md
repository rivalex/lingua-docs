---
layout: home

hero:
  name: "LINGUA"
  text: "Traduções gerenciadas por banco de dados para Laravel"
  tagline: Zero dependências externas. Dois drivers de armazenamento. Import/export completo. Segurança reforçada. Desenvolvido para PHP 8.3+ e Laravel 12–13.
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
  - icon: 🔒
    title: Zero dependências
    details: O Lingua inclui seu próprio carregador de traduções, registro de localidade e conjunto de dados empacotado. Sem Spatie, sem laravel-lang — nada para manter sincronizado.

  - icon: 🗄️
    title: Dois drivers de armazenamento
    details: Execute traduções a partir do banco de dados (edição ao vivo na UI, sem deploys) ou a partir de arquivos (versionado, amigável para CI). Alterne com um único comando.

  - icon: 📤
    title: Import / Export
    details: "Mova traduções entre formatos: CSV, JSON, XLSX, ODS. Bilíngue, multi-localidade ou JSON nativo. Prévia em modo dry-run antes de confirmar."

  - icon: 🛡️
    title: Segurança reforçada
    details: "Reforço F1–F9: sanitizador XSS, proteção contra path traversal, bloqueio de SQL injection, proteção de vendor, gate de autenticação, não-divulgação de exceções e muito mais."

  - icon: ⚡
    title: UI reativa
    details: Cinco páginas Livewire — Languages, Translations, Statistics, Settings e Transfer. Cada ação é em tempo real, sem necessidade de deploy para corrigir um erro de digitação.

  - icon: 🌐
    title: 129+ localidades empacotadas
    details: "Instale qualquer localidade a partir do registro interno. Sem download pela internet. Empacotado: 26 localidades, 5902 strings, alinhado ao Laravel 13.14."

  - icon: ↔️
    title: RTL / LTR pronto
    details: Árabe, hebraico, persa e outros scripts RTL são totalmente suportados. Os metadados de direção são armazenados e expostos para cada idioma.

  - icon: 📊
    title: Cobertura de tradução
    details: Estatísticas de conclusão por idioma — total de strings, contagem traduzida e chaves faltando por grupo. Saiba sempre o que precisa ser traduzido.

  - icon: 🧪
    title: 783 testes
    details: PHP 8.3+ · Laravel 12–13 · Livewire 4.1+ · Flux 2.12+. O conjunto cobre comandos, componentes, drivers, import/export e a API completa do facade.
---
