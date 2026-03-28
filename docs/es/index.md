---
layout: home

hero:
  name: "LINGUA"
  text: "Traducciones gestionadas desde la base de datos para Laravel"
  tagline: Instala idiomas, gestiona traducciones y cambia de idioma - todo a través de una hermosa interfaz Livewire, sin necesidad de despliegues.
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
  - icon: 🗄️
    title: Traducciones en base de datos
    details: Todas las traducciones viven en la base de datos y son editables al instante - sin necesidad de desplegar archivos. Spatie's laravel-translation-loader se encarga de la capa de carga.

  - icon: ⚡
    title: Livewire + Flux UI
    details: Interfaz de gestión reactiva y en tiempo real construida con Livewire 4 y Flux 2. Cada acción - agregar idioma, editar traducción, sincronizar - ocurre sin recargar la página.

  - icon: 🔄
    title: Sincronización bidireccional
    details: Importa tus archivos PHP/JSON existentes en la base de datos con un comando, o exporta todo de vuelta a archivos para control de versiones y despliegues.

  - icon: 🌐
    title: Más de 70 idiomas
    details: Instala cualquier idioma del ecosistema Laravel Lang con un solo comando Artisan. Los archivos de idioma, registros en la base de datos y traducciones se configuran automáticamente.

  - icon: ✍️
    title: Soporte de texto enriquecido
    details: Cada traducción puede ser texto plano, HTML o Markdown. El editor correcto se activa automáticamente según el tipo de traducción.

  - icon: ↔️
    title: Soporte RTL / LTR
    details: Los idiomas árabes, hebreo, persa y otros idiomas RTL están completamente soportados. Lingua almacena y expone la dirección del texto para cada idioma.

  - icon: 📦
    title: Traducciones de proveedores
    details: Gestiona las traducciones de paquetes (mensajes de validación, paginación, etc.) junto con tus propias cadenas, con protección integrada contra eliminaciones accidentales.

  - icon: 📊
    title: Seguimiento de progreso
    details: Cada idioma muestra un porcentaje de completitud y el número de traducciones faltantes, para que siempre sepas qué necesita traducirse.

  - icon: 🧪
    title: Completamente testado
    details: Más de 150 tests Pest que cubren todos los comandos Artisan, componentes Livewire, componentes Blade, helpers y la API completa del facade.
---
