# 存储驱动

Lingua 2.0 支持两种可插拔的存储驱动，用于保存翻译数据。在安装时选择一种，或随时通过一条命令切换。

## 驱动对比

| 功能 | `database` | `file` |
|---|---|---|
| 存储位置 | MySQL / Postgres / SQLite `language_lines` 表 | `lang/` PHP 和 JSON 文件 |
| 翻译类型 | `text`、`html`、`markdown` | 纯 `text` |
| UI 内联编辑 | 是 | 是（写入文件） |
| 统计页面 | 是（SQL 聚合） | 是（文件遍历） |
| 导入/导出 | 是 | 否（计划中） |
| 供应商保护 | 是（`is_vendor` 标志） | 是（路径前缀检查） |
| 精确缓存 | 是（按 locale+group） | 否（无数据库缓存层） |
| 版本控制 | 否（数据在数据库中） | 是（`lang/` 文件可提交） |
| CI 只读运行 | 否（需要数据库写入） | 是 |
| `lingua:sync-to-database` | 是（从 `lang/` 导入） | 否（无操作） |
| `lingua:sync-to-local` | 是（导出到 `lang/`） | 否（文件就是权威来源） |

## 选择驱动

### 什么时候用 `database`

- 需要实时 UI 编辑（无部署）
- 需要 HTML / Markdown 翻译类型
- 需要翻译统计和覆盖率报告
- 需要导入/导出（传输页面）
- 非技术团队成员也会更新翻译

### 什么时候用 `file`

- 翻译由开发者管理并通过 Git 提交
- 在 CI 流水线中只读运行
- 更偏向基础设施即代码的方式
- 从基于文件的工作流迁移到 Lingua UI，但暂不迁移到数据库

## 设置驱动

### 安装时

在 `lingua:install` 交互提示中选择驱动。

### 安装后切换

```bash
php artisan lingua:storage database
# 或
php artisan lingua:storage file
```

`lingua:storage` 命令：

1. 将 `LINGUA_STORAGE_DRIVER` 写入 `.env`
2. 发布任何缺失的迁移（`database` 驱动需要 `language_lines` 表）
3. 提示运行迁移（如有需要）
4. 清除翻译缓存

::: warning 切换驱动前先备份
从 `database` 切换到 `file` 时，现有的 `language_lines` 数据**不会**自动迁移到磁盘。先运行 `php artisan lingua:sync-to-local`，再切换驱动。
:::

## 文件驱动详解

文件驱动通过 `AtomicFileWriter` 类直接读写 `lang/` 目录：

- **读取**：使用与 Laravel 的标准 `FileLoader` 相同的路径解析逻辑
- **写入**：先写入 `.tmp` 文件，再原子性地重命名，并在之后调用 `opcache_invalidate($path, true)`，以便同一次请求中的 `include` 能读到新文件

```
lang/
  en/
    auth.php          ← PHP 数组格式
    validation.php
  en.json             ← JSON 格式
  fr/
    auth.php
  fr.json
```

::: tip 文件驱动没有 `language_lines` 表
文件驱动发布时不会生成 `language_lines` 迁移。设置、语言元数据和 `lingua_settings` 仍然存储在数据库中。
:::

## 数据库驱动详解

数据库驱动的完整功能说明参见[架构指南](/zh/guide/architecture)。主要特点：

- 翻译存储在 `language_lines` 表中，每个键一行，JSON `text` 列存储所有语言区域值
- `LinguaManager` 通过 `array_replace_recursive` 将数据库翻译合并到文件翻译之上——数据库值始终优先
- 写入时按 `(locale, group)` 精确清除缓存——**不**进行全局 `cache:clear`
- `is_vendor = true` 的行受 `VendorTranslationProtectedException` 保护

## 卸载 Lingua

如果要完全移除 Lingua：

```bash
php artisan lingua:uninstall
```

该命令会：

1. 停止翻译路由（可选）
2. 提示是否回滚迁移（`languages`、`language_lines`、`lingua_settings`）
3. 提示是否移除已发布的配置和视图
4. 提示是否从 `composer.json` 中移除包

::: danger 不可逆操作
回滚迁移会**永久删除**所有翻译、语言和设置数据。请确保已运行 `lingua:sync-to-local` 备份翻译到文件，或者在卸载前导出数据（通过传输页面）。
:::
