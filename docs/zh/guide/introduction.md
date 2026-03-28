<figure style="margin: 30px auto 30px !important; max-width: 640px;">
  <img src="../../public/logoLinguaHorizontal-light.svg" class="logo-light" alt="Language selector in sidebar mode">
  <img src="../../public/logoLinguaHorizontal-dark.svg" class="logo-dark" alt="Language selector in sidebar mode">
</figure>

# 什么是 Lingua？

Lingua 是一个 **Laravel 扩展包**，它将默认的基于文件的翻译系统替换为完全由数据库驱动的系统，并配备了基于 [Livewire 4](https://livewire.laravel.com) 和 [Flux 2](https://fluxui.dev) 构建的精美响应式管理界面。

## 它解决的问题

标准 Laravel 翻译文件存储在 `lang/` 目录下的 PHP 和 JSON 文件中。这对小型项目运作良好，但随着应用规模增长会产生摩擦：

- **更新翻译需要部署** — 即使只是修复一个简单的错别字。
- **非技术团队成员无法编辑翻译** — 编辑人员需要了解 Git 和代码审查流程。
- **手动追踪翻译完整性** — 必须对比文件差异才能发现缺漏。
- **支持多语言会使代码库变得杂乱** — 数十个文件散落在各个目录中。

Lingua 将每条翻译存储在数据库中，每行使用单个 JSON 列，并提供 Livewire 界面，让任何授权用户都能实时管理语言和字符串。

## 工作原理概览

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

在运行时，Lingua 将自定义的 `LinguaManager` 注册为 Laravel 翻译加载器。它合并基于文件和数据库的翻译——**数据库条目始终优先**——因此您可以覆盖任何字符串而无需修改源文件。

## 核心概念

| 概念 | 描述 |
|---|---|
| **语言（Language）** | 已安装的语言环境，包含元数据（名称、本地名称、方向、排序顺序、默认标志） |
| **翻译（Translation）** | `language_lines` 中的一行，包含 `group`、`key`、`type` 以及存储所有语言环境值的 JSON `text` 列 |
| **翻译类型** | `text`、`html` 或 `markdown`——决定在界面中显示哪种编辑器 |
| **扩展包翻译** | 属于第三方扩展包的翻译；受保护，防止意外删除 |
| **默认语言环境** | 主要语言；删除默认语言环境的翻译会移除整条记录 |
| **同步（Sync）** | 将本地文件导入数据库（`sync-to-database`）或将数据库导出到文件（`sync-to-local`）的过程 |

## 系统要求

| 依赖项 | 版本 |
|---|----------|
| PHP | **8.2+** |
| Laravel | **11 \| 12 \| 13** |
| Livewire | **4.0+** |
| Livewire Flux | **2.0+** |

## 下一步

前往[安装指南](/zh/guide/installation)，在五分钟内完成 Lingua 的安装配置。
