---
layout: home

hero:
  name: "LINGUA"
  text: "Laravel 数据库驱动的翻译管理"
  tagline: 安装语言、管理翻译、切换语言环境 — 全部通过精美的 Livewire 界面完成，无需重新部署。
  image:
    light: logoLinguaVertical-light.svg
    dark: logoLinguaVertical-dark.svg
    alt: Lingua UI
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/introduction
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/rivalex/lingua

features:
  - icon: 🗄️
    title: 数据库驱动的翻译
    details: 所有翻译存储在数据库中，可即时编辑——无需文件部署。Spatie 的 laravel-translation-loader 负责加载层。

  - icon: ⚡
    title: Livewire + Flux UI
    details: 基于 Livewire 4 和 Flux 2 构建的响应式实时管理界面。每个操作——添加语言、编辑翻译、同步——都无需页面刷新。

  - icon: 🔄
    title: 双向同步
    details: 通过一条命令将现有 PHP/JSON 语言文件导入数据库，或将所有内容导出回文件以便版本控制和部署。

  - icon: 🌐
    title: 70+ 种语言
    details: 通过单条 Artisan 命令从 Laravel Lang 生态系统安装任意语言环境。语言文件、数据库记录和翻译会自动配置完成。

  - icon: ✍️
    title: 富文本支持
    details: 每条翻译可以是纯文本、HTML 或 Markdown。正确的编辑器会根据翻译类型自动激活。

  - icon: ↔️
    title: RTL / LTR 支持
    details: 完全支持阿拉伯语、希伯来语、波斯语及其他 RTL 语言。Lingua 为每种语言存储并提供文本方向信息。

  - icon: 📦
    title: 扩展包翻译
    details: 与您自己的字符串一起管理扩展包翻译（验证消息、分页等），内置防止意外删除的保护机制。

  - icon: 📊
    title: 进度追踪
    details: 每种语言显示完成百分比和缺失翻译数量，让您随时掌握需要翻译的内容。

  - icon: 🧪
    title: 完整测试覆盖
    details: 150+ 个 Pest 测试，覆盖所有 Artisan 命令、Livewire 组件、Blade 组件、辅助函数以及完整的 Facade API。
---
