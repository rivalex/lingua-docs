import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Lingua',
  description: 'The complete multilingual management system for Laravel',
  base: '/lingua-docs/',
  ignoreDeadLinks: true,

  vite: {
    build: {
      rollupOptions: {
        external: [/\/screenshots\//],
      },
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/lingua-docs/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:site_name', content: 'Lingua' }],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: 'The complete multilingual management system for Laravel',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
          { text: 'Features', link: '/features/languages', activeMatch: '/features/' },
          { text: 'API Reference', link: '/api/facade', activeMatch: '/api/' },
          {
            text: '1.x',
            items: [
              { text: 'Changelog', link: 'https://github.com/rivalex/lingua/blob/main/CHANGELOG.md' },
              { text: 'Contributing', link: 'https://github.com/rivalex/lingua/blob/main/.github/CONTRIBUTING.md' },
            ],
          },
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'What is Lingua?', link: '/guide/introduction' },
                { text: 'Installation', link: '/guide/installation' },
                { text: 'Configuration', link: '/guide/configuration' },
                { text: 'Quick Start', link: '/guide/quick-start' },
              ],
            },
            {
              text: 'Architecture',
              items: [
                { text: 'How It Works', link: '/guide/architecture' },
                { text: 'Translation Storage', link: '/guide/storage' },
                { text: 'Publishing Assets', link: '/guide/publishing' },
              ],
            },
          ],
          '/features/': [
            {
              text: 'UI Features',
              items: [
                { text: 'Language Management', link: '/features/languages' },
                { text: 'Translation Management', link: '/features/translations' },
                { text: 'Language Selector', link: '/features/language-selector' },
              ],
            },
            {
              text: 'Advanced',
              items: [
                { text: 'RTL / LTR Support', link: '/features/rtl-support' },
                { text: 'Vendor Translations', link: '/features/vendor-translations' },
                { text: 'Bi-directional Sync', link: '/features/sync' },
                { text: 'Rich Text Editor', link: '/features/rich-text' },
              ],
            },
          ],
          '/api/': [
            {
              text: 'API Reference',
              items: [
                { text: 'Lingua Facade', link: '/api/facade' },
                { text: 'Artisan Commands', link: '/api/artisan-commands' },
                { text: 'Blade Components', link: '/api/blade-components' },
                { text: 'Events', link: '/api/events' },
              ],
            },
          ],
        },
        editLink: {
          pattern: 'https://github.com/rivalex/lingua-docs/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2026 Alessandro Rivolta',
        },
      },
    },

    zh: {
      label: '中文',
      lang: 'zh-CN',
      description: 'Laravel 完整的多语言管理系统',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guide/introduction', activeMatch: '/zh/guide/' },
          { text: '功能', link: '/zh/features/languages', activeMatch: '/zh/features/' },
          { text: 'API 参考', link: '/zh/api/facade', activeMatch: '/zh/api/' },
          {
            text: '1.x',
            items: [
              { text: '更新日志', link: 'https://github.com/rivalex/lingua/blob/main/CHANGELOG.md' },
              { text: '贡献', link: 'https://github.com/rivalex/lingua/blob/main/.github/CONTRIBUTING.md' },
            ],
          },
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '开始使用',
              items: [
                { text: '什么是 Lingua？', link: '/zh/guide/introduction' },
                { text: '安装', link: '/zh/guide/installation' },
                { text: '配置', link: '/zh/guide/configuration' },
                { text: '快速开始', link: '/zh/guide/quick-start' },
              ],
            },
            {
              text: '架构',
              items: [
                { text: '工作原理', link: '/zh/guide/architecture' },
                { text: '翻译存储', link: '/zh/guide/storage' },
                { text: '发布资源', link: '/zh/guide/publishing' },
              ],
            },
          ],
          '/zh/features/': [
            {
              text: 'UI 功能',
              items: [
                { text: '语言管理', link: '/zh/features/languages' },
                { text: '翻译管理', link: '/zh/features/translations' },
                { text: '语言选择器', link: '/zh/features/language-selector' },
              ],
            },
            {
              text: '高级',
              items: [
                { text: 'RTL / LTR 支持', link: '/zh/features/rtl-support' },
                { text: '第三方翻译', link: '/zh/features/vendor-translations' },
                { text: '双向同步', link: '/zh/features/sync' },
                { text: '富文本编辑器', link: '/zh/features/rich-text' },
              ],
            },
          ],
          '/zh/api/': [
            {
              text: 'API 参考',
              items: [
                { text: 'Lingua Facade', link: '/zh/api/facade' },
                { text: 'Artisan 命令', link: '/zh/api/artisan-commands' },
                { text: 'Blade 组件', link: '/zh/api/blade-components' },
                { text: '事件', link: '/zh/api/events' },
              ],
            },
          ],
        },
        editLink: {
          pattern: 'https://github.com/rivalex/lingua-docs/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页',
        },
        footer: {
          message: '基于 MIT 许可证发布。',
          copyright: 'Copyright © 2026 Alessandro Rivolta',
        },
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
        outline: {
          label: '页面导航',
        },
        lastUpdated: {
          text: '最后更新于',
        },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
      },
    },

    hi: {
      label: 'हिन्दी',
      lang: 'hi',
      description: 'Laravel के लिए संपूर्ण बहुभाषी प्रबंधन प्रणाली',
      themeConfig: {
        nav: [
          { text: 'गाइड', link: '/hi/guide/introduction', activeMatch: '/hi/guide/' },
          { text: 'विशेषताएं', link: '/hi/features/languages', activeMatch: '/hi/features/' },
          { text: 'API संदर्भ', link: '/hi/api/facade', activeMatch: '/hi/api/' },
          {
            text: '1.x',
            items: [
              { text: 'परिवर्तन लॉग', link: 'https://github.com/rivalex/lingua/blob/main/CHANGELOG.md' },
              { text: 'योगदान', link: 'https://github.com/rivalex/lingua/blob/main/.github/CONTRIBUTING.md' },
            ],
          },
        ],
        sidebar: {
          '/hi/guide/': [
            {
              text: 'शुरू करें',
              items: [
                { text: 'Lingua क्या है?', link: '/hi/guide/introduction' },
                { text: 'स्थापना', link: '/hi/guide/installation' },
                { text: 'कॉन्फ़िगरेशन', link: '/hi/guide/configuration' },
                { text: 'त्वरित प्रारंभ', link: '/hi/guide/quick-start' },
              ],
            },
            {
              text: 'आर्किटेक्चर',
              items: [
                { text: 'यह कैसे काम करता है', link: '/hi/guide/architecture' },
                { text: 'अनुवाद भंडारण', link: '/hi/guide/storage' },
                { text: 'असेट प्रकाशित करें', link: '/hi/guide/publishing' },
              ],
            },
          ],
          '/hi/features/': [
            {
              text: 'UI विशेषताएं',
              items: [
                { text: 'भाषा प्रबंधन', link: '/hi/features/languages' },
                { text: 'अनुवाद प्रबंधन', link: '/hi/features/translations' },
                { text: 'भाषा चयनकर्ता', link: '/hi/features/language-selector' },
              ],
            },
            {
              text: 'उन्नत',
              items: [
                { text: 'RTL / LTR समर्थन', link: '/hi/features/rtl-support' },
                { text: 'विक्रेता अनुवाद', link: '/hi/features/vendor-translations' },
                { text: 'द्विदिशीय सिंक', link: '/hi/features/sync' },
                { text: 'रिच टेक्स्ट एडिटर', link: '/hi/features/rich-text' },
              ],
            },
          ],
          '/hi/api/': [
            {
              text: 'API संदर्भ',
              items: [
                { text: 'Lingua Facade', link: '/hi/api/facade' },
                { text: 'Artisan कमांड', link: '/hi/api/artisan-commands' },
                { text: 'Blade कंपोनेंट', link: '/hi/api/blade-components' },
                { text: 'इवेंट', link: '/hi/api/events' },
              ],
            },
          ],
        },
        editLink: {
          pattern: 'https://github.com/rivalex/lingua-docs/edit/main/docs/:path',
          text: 'GitHub पर इस पृष्ठ को संपादित करें',
        },
        footer: {
          message: 'MIT लाइसेंस के तहत जारी।',
          copyright: 'Copyright © 2026 Alessandro Rivolta',
        },
        docFooter: {
          prev: 'पिछला पृष्ठ',
          next: 'अगला पृष्ठ',
        },
        outline: {
          label: 'इस पृष्ठ पर',
        },
        lastUpdated: {
          text: 'अंतिम अपडेट',
        },
        returnToTopLabel: 'शीर्ष पर वापस जाएं',
        sidebarMenuLabel: 'मेनू',
        darkModeSwitchLabel: 'थीम',
        lightModeSwitchTitle: 'लाइट मोड पर स्विच करें',
        darkModeSwitchTitle: 'डार्क मोड पर स्विच करें',
      },
    },

    es: {
      label: 'Español',
      lang: 'es',
      description: 'El sistema completo de gestión multilingüe para Laravel',
      themeConfig: {
        nav: [
          { text: 'Guía', link: '/es/guide/introduction', activeMatch: '/es/guide/' },
          { text: 'Características', link: '/es/features/languages', activeMatch: '/es/features/' },
          { text: 'Referencia API', link: '/es/api/facade', activeMatch: '/es/api/' },
          {
            text: '1.x',
            items: [
              { text: 'Registro de cambios', link: 'https://github.com/rivalex/lingua/blob/main/CHANGELOG.md' },
              { text: 'Contribuir', link: 'https://github.com/rivalex/lingua/blob/main/.github/CONTRIBUTING.md' },
            ],
          },
        ],
        sidebar: {
          '/es/guide/': [
            {
              text: 'Primeros pasos',
              items: [
                { text: '¿Qué es Lingua?', link: '/es/guide/introduction' },
                { text: 'Instalación', link: '/es/guide/installation' },
                { text: 'Configuración', link: '/es/guide/configuration' },
                { text: 'Inicio rápido', link: '/es/guide/quick-start' },
              ],
            },
            {
              text: 'Arquitectura',
              items: [
                { text: 'Cómo funciona', link: '/es/guide/architecture' },
                { text: 'Almacenamiento', link: '/es/guide/storage' },
                { text: 'Publicar assets', link: '/es/guide/publishing' },
              ],
            },
          ],
          '/es/features/': [
            {
              text: 'Funciones UI',
              items: [
                { text: 'Gestión de idiomas', link: '/es/features/languages' },
                { text: 'Gestión de traducciones', link: '/es/features/translations' },
                { text: 'Selector de idioma', link: '/es/features/language-selector' },
              ],
            },
            {
              text: 'Avanzado',
              items: [
                { text: 'Soporte RTL / LTR', link: '/es/features/rtl-support' },
                { text: 'Traducciones de proveedor', link: '/es/features/vendor-translations' },
                { text: 'Sincronización bidireccional', link: '/es/features/sync' },
                { text: 'Editor de texto enriquecido', link: '/es/features/rich-text' },
              ],
            },
          ],
          '/es/api/': [
            {
              text: 'Referencia API',
              items: [
                { text: 'Facade Lingua', link: '/es/api/facade' },
                { text: 'Comandos Artisan', link: '/es/api/artisan-commands' },
                { text: 'Componentes Blade', link: '/es/api/blade-components' },
                { text: 'Eventos', link: '/es/api/events' },
              ],
            },
          ],
        },
        editLink: {
          pattern: 'https://github.com/rivalex/lingua-docs/edit/main/docs/:path',
          text: 'Editar esta página en GitHub',
        },
        footer: {
          message: 'Publicado bajo la licencia MIT.',
          copyright: 'Copyright © 2026 Alessandro Rivolta',
        },
        docFooter: {
          prev: 'Página anterior',
          next: 'Página siguiente',
        },
        outline: {
          label: 'En esta página',
        },
        lastUpdated: {
          text: 'Última actualización',
        },
        returnToTopLabel: 'Volver arriba',
        sidebarMenuLabel: 'Menú',
        darkModeSwitchLabel: 'Tema',
        lightModeSwitchTitle: 'Cambiar a modo claro',
        darkModeSwitchTitle: 'Cambiar a modo oscuro',
      },
    },

    ar: {
      label: 'العربية',
      lang: 'ar',
      dir: 'rtl',
      description: 'نظام إدارة متعدد اللغات الكامل لـ Laravel',
      themeConfig: {
        nav: [
          { text: 'الدليل', link: '/ar/guide/introduction', activeMatch: '/ar/guide/' },
          { text: 'المميزات', link: '/ar/features/languages', activeMatch: '/ar/features/' },
          { text: 'مرجع API', link: '/ar/api/facade', activeMatch: '/ar/api/' },
          {
            text: '1.x',
            items: [
              { text: 'سجل التغييرات', link: 'https://github.com/rivalex/lingua/blob/main/CHANGELOG.md' },
              { text: 'المساهمة', link: 'https://github.com/rivalex/lingua/blob/main/.github/CONTRIBUTING.md' },
            ],
          },
        ],
        sidebar: {
          '/ar/guide/': [
            {
              text: 'البدء',
              items: [
                { text: 'ما هو Lingua؟', link: '/ar/guide/introduction' },
                { text: 'التثبيت', link: '/ar/guide/installation' },
                { text: 'الإعداد', link: '/ar/guide/configuration' },
                { text: 'البداية السريعة', link: '/ar/guide/quick-start' },
              ],
            },
            {
              text: 'البنية',
              items: [
                { text: 'كيف يعمل', link: '/ar/guide/architecture' },
                { text: 'تخزين الترجمات', link: '/ar/guide/storage' },
                { text: 'نشر الموارد', link: '/ar/guide/publishing' },
              ],
            },
          ],
          '/ar/features/': [
            {
              text: 'ميزات الواجهة',
              items: [
                { text: 'إدارة اللغات', link: '/ar/features/languages' },
                { text: 'إدارة الترجمات', link: '/ar/features/translations' },
                { text: 'محدد اللغة', link: '/ar/features/language-selector' },
              ],
            },
            {
              text: 'متقدم',
              items: [
                { text: 'دعم RTL / LTR', link: '/ar/features/rtl-support' },
                { text: 'ترجمات المورد', link: '/ar/features/vendor-translations' },
                { text: 'المزامنة ثنائية الاتجاه', link: '/ar/features/sync' },
                { text: 'محرر النص المنسق', link: '/ar/features/rich-text' },
              ],
            },
          ],
          '/ar/api/': [
            {
              text: 'مرجع API',
              items: [
                { text: 'واجهة Lingua', link: '/ar/api/facade' },
                { text: 'أوامر Artisan', link: '/ar/api/artisan-commands' },
                { text: 'مكونات Blade', link: '/ar/api/blade-components' },
                { text: 'الأحداث', link: '/ar/api/events' },
              ],
            },
          ],
        },
        editLink: {
          pattern: 'https://github.com/rivalex/lingua-docs/edit/main/docs/:path',
          text: 'تعديل هذه الصفحة على GitHub',
        },
        footer: {
          message: 'مُصدَر بموجب رخصة MIT.',
          copyright: 'Copyright © 2026 Alessandro Rivolta',
        },
        docFooter: {
          prev: 'الصفحة السابقة',
          next: 'الصفحة التالية',
        },
        outline: {
          label: 'في هذه الصفحة',
        },
        lastUpdated: {
          text: 'آخر تحديث',
        },
        returnToTopLabel: 'العودة إلى الأعلى',
        sidebarMenuLabel: 'القائمة',
        darkModeSwitchLabel: 'المظهر',
        lightModeSwitchTitle: 'التبديل إلى الوضع الفاتح',
        darkModeSwitchTitle: 'التبديل إلى الوضع الداكن',
      },
    },

    fr: {
      label: 'Français',
      lang: 'fr',
      description: 'Le système complet de gestion multilingue pour Laravel',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/fr/guide/introduction', activeMatch: '/fr/guide/' },
          { text: 'Fonctionnalités', link: '/fr/features/languages', activeMatch: '/fr/features/' },
          { text: 'Référence API', link: '/fr/api/facade', activeMatch: '/fr/api/' },
          {
            text: '1.x',
            items: [
              { text: 'Journal des modifications', link: 'https://github.com/rivalex/lingua/blob/main/CHANGELOG.md' },
              { text: 'Contribuer', link: 'https://github.com/rivalex/lingua/blob/main/.github/CONTRIBUTING.md' },
            ],
          },
        ],
        sidebar: {
          '/fr/guide/': [
            {
              text: 'Démarrage',
              items: [
                { text: "Qu'est-ce que Lingua ?", link: '/fr/guide/introduction' },
                { text: 'Installation', link: '/fr/guide/installation' },
                { text: 'Configuration', link: '/fr/guide/configuration' },
                { text: 'Démarrage rapide', link: '/fr/guide/quick-start' },
              ],
            },
            {
              text: 'Architecture',
              items: [
                { text: 'Comment ça marche', link: '/fr/guide/architecture' },
                { text: 'Stockage des traductions', link: '/fr/guide/storage' },
                { text: 'Publication des assets', link: '/fr/guide/publishing' },
              ],
            },
          ],
          '/fr/features/': [
            {
              text: 'Fonctions UI',
              items: [
                { text: 'Gestion des langues', link: '/fr/features/languages' },
                { text: 'Gestion des traductions', link: '/fr/features/translations' },
                { text: 'Sélecteur de langue', link: '/fr/features/language-selector' },
              ],
            },
            {
              text: 'Avancé',
              items: [
                { text: 'Support RTL / LTR', link: '/fr/features/rtl-support' },
                { text: 'Traductions fournisseur', link: '/fr/features/vendor-translations' },
                { text: 'Sync bidirectionnel', link: '/fr/features/sync' },
                { text: 'Éditeur de texte riche', link: '/fr/features/rich-text' },
              ],
            },
          ],
          '/fr/api/': [
            {
              text: 'Référence API',
              items: [
                { text: 'Facade Lingua', link: '/fr/api/facade' },
                { text: 'Commandes Artisan', link: '/fr/api/artisan-commands' },
                { text: 'Composants Blade', link: '/fr/api/blade-components' },
                { text: 'Événements', link: '/fr/api/events' },
              ],
            },
          ],
        },
        editLink: {
          pattern: 'https://github.com/rivalex/lingua-docs/edit/main/docs/:path',
          text: 'Modifier cette page sur GitHub',
        },
        footer: {
          message: 'Publié sous la licence MIT.',
          copyright: 'Copyright © 2026 Alessandro Rivolta',
        },
        docFooter: {
          prev: 'Page précédente',
          next: 'Page suivante',
        },
        outline: {
          label: 'Sur cette page',
        },
        lastUpdated: {
          text: 'Dernière mise à jour',
        },
        returnToTopLabel: 'Retour en haut',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Thème',
        lightModeSwitchTitle: 'Passer en mode clair',
        darkModeSwitchTitle: 'Passer en mode sombre',
      },
    },

    pt: {
      label: 'Português',
      lang: 'pt',
      description: 'O sistema completo de gerenciamento multilíngue para Laravel',
      themeConfig: {
        nav: [
          { text: 'Guia', link: '/pt/guide/introduction', activeMatch: '/pt/guide/' },
          { text: 'Recursos', link: '/pt/features/languages', activeMatch: '/pt/features/' },
          { text: 'Referência API', link: '/pt/api/facade', activeMatch: '/pt/api/' },
          {
            text: '1.x',
            items: [
              { text: 'Registro de alterações', link: 'https://github.com/rivalex/lingua/blob/main/CHANGELOG.md' },
              { text: 'Contribuir', link: 'https://github.com/rivalex/lingua/blob/main/.github/CONTRIBUTING.md' },
            ],
          },
        ],
        sidebar: {
          '/pt/guide/': [
            {
              text: 'Introdução',
              items: [
                { text: 'O que é Lingua?', link: '/pt/guide/introduction' },
                { text: 'Instalação', link: '/pt/guide/installation' },
                { text: 'Configuração', link: '/pt/guide/configuration' },
                { text: 'Início rápido', link: '/pt/guide/quick-start' },
              ],
            },
            {
              text: 'Arquitetura',
              items: [
                { text: 'Como funciona', link: '/pt/guide/architecture' },
                { text: 'Armazenamento', link: '/pt/guide/storage' },
                { text: 'Publicar assets', link: '/pt/guide/publishing' },
              ],
            },
          ],
          '/pt/features/': [
            {
              text: 'Funções UI',
              items: [
                { text: 'Gerenciar idiomas', link: '/pt/features/languages' },
                { text: 'Gerenciar traduções', link: '/pt/features/translations' },
                { text: 'Seletor de idioma', link: '/pt/features/language-selector' },
              ],
            },
            {
              text: 'Avançado',
              items: [
                { text: 'Suporte RTL / LTR', link: '/pt/features/rtl-support' },
                { text: 'Traduções de fornecedor', link: '/pt/features/vendor-translations' },
                { text: 'Sincronização bidirecional', link: '/pt/features/sync' },
                { text: 'Editor de texto rico', link: '/pt/features/rich-text' },
              ],
            },
          ],
          '/pt/api/': [
            {
              text: 'Referência API',
              items: [
                { text: 'Facade Lingua', link: '/pt/api/facade' },
                { text: 'Comandos Artisan', link: '/pt/api/artisan-commands' },
                { text: 'Componentes Blade', link: '/pt/api/blade-components' },
                { text: 'Eventos', link: '/pt/api/events' },
              ],
            },
          ],
        },
        editLink: {
          pattern: 'https://github.com/rivalex/lingua-docs/edit/main/docs/:path',
          text: 'Editar esta página no GitHub',
        },
        footer: {
          message: 'Lançado sob a licença MIT.',
          copyright: 'Copyright © 2026 Alessandro Rivolta',
        },
        docFooter: {
          prev: 'Página anterior',
          next: 'Próxima página',
        },
        outline: {
          label: 'Nesta página',
        },
        lastUpdated: {
          text: 'Última atualização',
        },
        returnToTopLabel: 'Voltar ao topo',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Tema',
        lightModeSwitchTitle: 'Mudar para modo claro',
        darkModeSwitchTitle: 'Mudar para modo escuro',
      },
    },

    ru: {
      label: 'Русский',
      lang: 'ru',
      description: 'Полная система управления многоязычностью для Laravel',
      themeConfig: {
        nav: [
          { text: 'Руководство', link: '/ru/guide/introduction', activeMatch: '/ru/guide/' },
          { text: 'Возможности', link: '/ru/features/languages', activeMatch: '/ru/features/' },
          { text: 'Справочник API', link: '/ru/api/facade', activeMatch: '/ru/api/' },
          {
            text: '1.x',
            items: [
              { text: 'История изменений', link: 'https://github.com/rivalex/lingua/blob/main/CHANGELOG.md' },
              { text: 'Участие в разработке', link: 'https://github.com/rivalex/lingua/blob/main/.github/CONTRIBUTING.md' },
            ],
          },
        ],
        sidebar: {
          '/ru/guide/': [
            {
              text: 'Начало работы',
              items: [
                { text: 'Что такое Lingua?', link: '/ru/guide/introduction' },
                { text: 'Установка', link: '/ru/guide/installation' },
                { text: 'Конфигурация', link: '/ru/guide/configuration' },
                { text: 'Быстрый старт', link: '/ru/guide/quick-start' },
              ],
            },
            {
              text: 'Архитектура',
              items: [
                { text: 'Как это работает', link: '/ru/guide/architecture' },
                { text: 'Хранилище переводов', link: '/ru/guide/storage' },
                { text: 'Публикация ресурсов', link: '/ru/guide/publishing' },
              ],
            },
          ],
          '/ru/features/': [
            {
              text: 'Возможности UI',
              items: [
                { text: 'Управление языками', link: '/ru/features/languages' },
                { text: 'Управление переводами', link: '/ru/features/translations' },
                { text: 'Выбор языка', link: '/ru/features/language-selector' },
              ],
            },
            {
              text: 'Расширенные',
              items: [
                { text: 'Поддержка RTL / LTR', link: '/ru/features/rtl-support' },
                { text: 'Переводы вендоров', link: '/ru/features/vendor-translations' },
                { text: 'Двунаправленная синхронизация', link: '/ru/features/sync' },
                { text: 'Редактор форматированного текста', link: '/ru/features/rich-text' },
              ],
            },
          ],
          '/ru/api/': [
            {
              text: 'Справочник API',
              items: [
                { text: 'Фасад Lingua', link: '/ru/api/facade' },
                { text: 'Команды Artisan', link: '/ru/api/artisan-commands' },
                { text: 'Компоненты Blade', link: '/ru/api/blade-components' },
                { text: 'События', link: '/ru/api/events' },
              ],
            },
          ],
        },
        editLink: {
          pattern: 'https://github.com/rivalex/lingua-docs/edit/main/docs/:path',
          text: 'Редактировать на GitHub',
        },
        footer: {
          message: 'Выпущено под лицензией MIT.',
          copyright: 'Copyright © 2026 Alessandro Rivolta',
        },
        docFooter: {
          prev: 'Предыдущая страница',
          next: 'Следующая страница',
        },
        outline: {
          label: 'На этой странице',
        },
        lastUpdated: {
          text: 'Последнее обновление',
        },
        returnToTopLabel: 'Вернуться наверх',
        sidebarMenuLabel: 'Меню',
        darkModeSwitchLabel: 'Тема',
        lightModeSwitchTitle: 'Переключить на светлую тему',
        darkModeSwitchTitle: 'Переключить на тёмную тему',
      },
    },

    it: {
      label: 'Italiano',
      lang: 'it',
      description: 'Il sistema completo di gestione multilingua per Laravel',
      themeConfig: {
        nav: [
          { text: 'Guida', link: '/it/guide/introduction', activeMatch: '/it/guide/' },
          { text: 'Funzionalità', link: '/it/features/languages', activeMatch: '/it/features/' },
          { text: 'Riferimento API', link: '/it/api/facade', activeMatch: '/it/api/' },
          {
            text: '1.x',
            items: [
              { text: 'Changelog', link: 'https://github.com/rivalex/lingua/blob/main/CHANGELOG.md' },
              { text: 'Contribuire', link: 'https://github.com/rivalex/lingua/blob/main/.github/CONTRIBUTING.md' },
            ],
          },
        ],
        sidebar: {
          '/it/guide/': [
            {
              text: 'Per iniziare',
              items: [
                { text: 'Cos\'è Lingua?', link: '/it/guide/introduction' },
                { text: 'Installazione', link: '/it/guide/installation' },
                { text: 'Configurazione', link: '/it/guide/configuration' },
                { text: 'Avvio rapido', link: '/it/guide/quick-start' },
              ],
            },
            {
              text: 'Architettura',
              items: [
                { text: 'Come funziona', link: '/it/guide/architecture' },
                { text: 'Archiviazione traduzioni', link: '/it/guide/storage' },
                { text: 'Pubblicazione asset', link: '/it/guide/publishing' },
              ],
            },
          ],
          '/it/features/': [
            {
              text: 'Funzionalità UI',
              items: [
                { text: 'Gestione lingue', link: '/it/features/languages' },
                { text: 'Gestione traduzioni', link: '/it/features/translations' },
                { text: 'Selettore lingua', link: '/it/features/language-selector' },
              ],
            },
            {
              text: 'Avanzato',
              items: [
                { text: 'Supporto RTL / LTR', link: '/it/features/rtl-support' },
                { text: 'Traduzioni vendor', link: '/it/features/vendor-translations' },
                { text: 'Sincronizzazione bidirezionale', link: '/it/features/sync' },
                { text: 'Editor testo ricco', link: '/it/features/rich-text' },
              ],
            },
          ],
          '/it/api/': [
            {
              text: 'Riferimento API',
              items: [
                { text: 'Facade Lingua', link: '/it/api/facade' },
                { text: 'Comandi Artisan', link: '/it/api/artisan-commands' },
                { text: 'Componenti Blade', link: '/it/api/blade-components' },
                { text: 'Eventi', link: '/it/api/events' },
              ],
            },
          ],
        },
        editLink: {
          pattern: 'https://github.com/rivalex/lingua-docs/edit/main/docs/:path',
          text: 'Modifica questa pagina su GitHub',
        },
        footer: {
          message: 'Rilasciato sotto licenza MIT.',
          copyright: 'Copyright © 2026 Alessandro Rivolta',
        },
        docFooter: {
          prev: 'Pagina precedente',
          next: 'Pagina successiva',
        },
        outline: {
          label: 'In questa pagina',
        },
        lastUpdated: {
          text: 'Ultimo aggiornamento',
        },
        returnToTopLabel: 'Torna in cima',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Tema',
        lightModeSwitchTitle: 'Passa alla modalità chiara',
        darkModeSwitchTitle: 'Passa alla modalità scura',
      },
    },
  },

  themeConfig: {
    logo: { light: '/logoLingua-light.svg', dark: '/logoLingua-dark.svg' },
    siteTitle: 'LINGUA',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/rivalex/lingua' },
    ],

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
})
