---
layout: home

hero:
  name: "LINGUA"
  text: "数据库驱动的 Laravel 翻译管理"
  tagline: 零外部依赖。双存储驱动。完整导入/导出。安全加固。专为 PHP 8.3+ 和 Laravel 11–13 构建。
  image:
    light: /logoLinguaVertical-light.svg
    dark: /logoLinguaVertical-dark.svg
    alt: Lingua UI
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/introduction
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/rivalex/lingua

features:
  - icon: 🔒
    title: 零外部依赖
    details: Lingua 内置翻译加载器、语言注册表和捆绑数据集。无需 Spatie，无需 laravel-lang——无需任何额外同步。

  - icon: 🗄️
    title: 双存储驱动
    details: 从数据库运行翻译（实时 UI 编辑，无需部署），或从文件运行（版本控制，CI 友好）。一条命令即可切换。

  - icon: 📤
    title: 导入 / 导出
    details: "在多种格式间迁移翻译：CSV、JSON、XLSX、ODS。支持双语、多语言或 json-native 布局。提交前可预览差异。"

  - icon: 🛡️
    title: 安全加固
    details: "F1–F9 加固：XSS 过滤、路径遍历防护、SQL 注入封禁、供应商保护、认证门控、异常信息不泄露等。"

  - icon: ⚡
    title: 响应式 UI
    details: 五个 Livewire 页面——语言、翻译、统计、设置和传输。每个操作都是实时的，无需部署即可修复错别字。

  - icon: 🌐
    title: 内置 129+ 语言区域
    details: "从内置注册表安装任意语言区域，无需联网下载。内置：26 个语言区域，5902 个字符串，与 Laravel 13.14 对齐。"

  - icon: ↔️
    title: RTL / LTR 就绪
    details: 完全支持阿拉伯语、希伯来语、波斯语等 RTL 语言。每种语言的方向元数据均已存储并可随时获取。

  - icon: 📊
    title: 翻译覆盖率
    details: 每种语言的完成度统计——总字符串数、已翻译数量和各分组缺失键数。随时掌握翻译进度。

  - icon: 🧪
    title: 783 个测试
    details: PHP 8.3+ · Laravel 11–13 · Livewire 4.1+ · Flux 2.12+。测试套件涵盖命令、组件、驱动程序、导入/导出和完整 Facade API。
---
