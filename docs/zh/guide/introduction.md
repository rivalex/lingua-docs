<figure style="margin: 30px auto 30px !important; max-width: 640px;">
  <img src="../../public/logoLinguaHorizontal-light.svg" class="logo-light" alt="Lingua">
  <img src="../../public/logoLinguaHorizontal-dark.svg" class="logo-dark" alt="Lingua">
</figure>



# 什么是 Lingua？

Lingua 是一个用于多语言管理的 **Laravel 扩展包**。它可以将所有翻译存储在数据库中，并附带一套基于 [Livewire 4](https://livewire.laravel.com) 和 [Flux 2](https://fluxui.dev) 构建的美观响应式管理 UI——或者，如果您愿意，也可以继续使用普通的 `lang/` 文件，同时享用相同的 UI。

::: tip 2.0 新特性
版本 2.0 完全移除了外部依赖 `spatie/laravel-translation-loader` 和 `laravel-lang/common`，增加了可插拔的[存储驱动](/zh/guide/storage)系统（数据库**或**文件），新增了[传输](/zh/guide/quick-start)导入/导出工作流，以及全面的[安全加固](/zh/guide/security)。开箱即用，安全可靠。
:::

## 它解决了什么问题

标准 Laravel 翻译文件存放在 `lang/` 目录下的 PHP 和 JSON 文件中。对于小型项目来说这很好用，但随着应用增长会带来摩擦：

- **更新翻译需要部署**——即使只是修复一个错别字。
- **非技术团队成员无法编辑翻译**——编辑者需要 Git 和代码审查。
- **手动跟踪翻译完整度**——需要对比文件才能发现遗漏。
- **支持多语言会使代码库混乱**——数十个文件散落在各个目录中。

使用默认的**数据库驱动**，Lingua 将每条翻译存储在单行的 JSON 列中，并提供 Livewire UI，任何授权用户都可以实时管理语言和字符串。

## 工作原理概览

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

在运行时，Lingua 的 `LinguaManager` 扩展了 Laravel 自身的 `Illuminate\Translation\FileLoader` 并注册为翻译加载器。在**数据库模式**下，它使用 `array_replace_recursive` 合并基于文件的翻译和数据库翻译——**数据库条目始终优先**——因此您可以覆盖任何字符串而无需修改源文件。在**文件模式**下，它的行为与标准 Laravel 加载器相同，由同一套 UI 支持。

## 核心概念

| 概念 | 描述 |
|---|---|
| **存储驱动** | `database`（默认）或 `file`——参见[存储驱动](/zh/guide/storage) |
| **语言** | 已安装的语言区域，包含元数据（名称、本地名称、方向、排序、默认标志） |
| **翻译** | `language_lines` 中的一行，包含 `group`、`key`、`type` 和存储所有语言区域值的 JSON `text` 列 |
| **翻译类型** | `text`、`html` 或 `markdown`——决定 UI 中显示的编辑器（仅数据库驱动） |
| **供应商翻译** | 属于第三方包的翻译；受保护，防止意外删除 |
| **默认语言区域** | 主要语言；删除默认语言区域的翻译会删除整条记录 |
| **同步** | 导入本地文件→数据库（`sync-to-database`）或导出数据库→文件（`sync-to-local`） |

## 系统要求

| 依赖 | 版本 |
|---|---|
| PHP | **8.3+** |
| Laravel | **11 \| 12 \| 13** |
| Livewire | **4.1+** |
| Livewire Flux | **2.12+** |

::: tip 无外部翻译加载器
Lingua 2.0 在运行时**不**依赖 Spatie 或 laravel-lang。语言区域元数据（129+ 个语言区域）和内置翻译数据集（26 个语言区域 × 7 个分组，5902 个字符串，与 Laravel v13.14.0 对齐）均随包一起发布——安装时无需从 GitHub 下载。
:::

## 下一步

前往[安装指南](/zh/guide/installation)，在五分钟内完成 Lingua 的安装，或者如果您是从 1.x 升级，请阅读[升级指南](/zh/guide/upgrade)。
