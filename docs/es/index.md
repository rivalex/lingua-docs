---
layout: home

hero:
  name: "LINGUA"
  text: "Traducciones orientadas a base de datos para Laravel"
  tagline: Sin dependencias externas. Dos drivers de almacenamiento. Importación/exportación completa. Seguridad reforzada. Diseñado para PHP 8.3+ y Laravel 11–13.
  image:
    light: /logoLinguaVertical-light.svg
    dark: /logoLinguaVertical-dark.svg
    alt: Lingua UI
  actions:
    - theme: brand
      text: Comenzar
      link: /es/guide/introduction
    - theme: alt
      text: Ver en GitHub
      link: https://github.com/rivalex/lingua

features:
  - icon: 🔒
    title: Sin dependencias externas
    details: Lingua incluye su propio cargador de traducciones, registro de locales y conjunto de datos integrado. Sin Spatie, sin laravel-lang — nada que mantener sincronizado.

  - icon: 🗄️
    title: Dos drivers de almacenamiento
    details: Ejecuta traducciones desde la base de datos (edición en vivo en la UI, sin despliegues) o desde archivos (con control de versiones, compatible con CI). Cambia con un solo comando.

  - icon: 📤
    title: Importación / Exportación
    details: "Mueve traducciones entre formatos: CSV, JSON, XLSX, ODS. Bilingüe, multi-locale o json-nativo. Vista previa en seco antes de confirmar."

  - icon: 🛡️
    title: Seguridad reforzada
    details: "Refuerzo F1–F9: sanitizador XSS, protección contra path traversal, prohibición de inyección SQL, protección de vendor, puerta de autenticación, no-divulgación de excepciones, y más."

  - icon: ⚡
    title: UI reactiva
    details: Cinco páginas Livewire — Idiomas, Traducciones, Estadísticas, Configuración y Transferencia. Cada acción es en vivo, sin necesidad de despliegue para corregir errores tipográficos.

  - icon: 🌐
    title: Más de 129 locales incluidos
    details: "Instala cualquier locale desde el registro integrado. Sin descarga de internet. Incluidos: 26 locales, 5902 cadenas, alineados con Laravel 13.14."

  - icon: ↔️
    title: RTL / LTR listo
    details: El árabe, el hebreo, el persa y otros idiomas RTL son totalmente compatibles. Los metadatos de dirección se almacenan y exponen para cada idioma.

  - icon: 📊
    title: Cobertura de traducciones
    details: Estadísticas de finalización por idioma — total de cadenas, recuento de traducidas y claves faltantes por grupo. Siempre sabrás qué necesita traducción.

  - icon: 🧪
    title: 783 pruebas
    details: PHP 8.3+ · Laravel 11–13 · Livewire 4.1+ · Flux 2.12+. El conjunto cubre comandos, componentes, drivers, importación/exportación y la API completa de la facade.
---
