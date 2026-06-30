# Artisan 命令

Lingua 提供 8 个 Artisan 命令，用于通过终端管理语言和翻译。

## `lingua:install`

交互式安装向导。选择存储驱动，发布配置和迁移，运行迁移，并填充默认语言。

```bash
php artisan lingua:install
```

**选项：**

| 选项 | 说明 |
|---|---|
| `--driver=database` | 跳过交互提示，直接使用指定驱动 |
| `--no-seed` | 跳过翻译数据填充（仅创建数据库结构） |

---

## `lingua:storage`

切换存储驱动（`database` 或 `file`）。更新 `.env`，发布缺失的迁移，并清除缓存。

```bash
php artisan lingua:storage database
php artisan lingua:storage file
```

::: warning 切换前先导出
从 `database` 切换到 `file` 时，先运行 `lingua:sync-to-local` 将翻译导出到文件，否则数据库中的翻译不会自动迁移。
:::

---

## `lingua:add`

安装一个或多个语言区域，并从内置数据集填充翻译。

```bash
php artisan lingua:add fr
php artisan lingua:add fr de it es pt_BR
```

**行为：**

- 在 `languages` 表中创建语言记录
- 从内置数据集（26 个语言区域，5902 个字符串）填充翻译
- 设置正确的元数据（名称、本地名称、方向）
- **不**从网络下载文件
- **不**写入 `lang/` 目录（数据库驱动）

---

## `lingua:remove`

卸载语言区域，并从所有翻译行的 `text` JSON 列中移除该语言区域的值。

```bash
php artisan lingua:remove fr
```

::: danger 不可逆操作
此操作会永久删除该语言区域的所有翻译数据。在移除之前，通过传输页面导出翻译进行备份。
:::

---

## `lingua:update-lang`

用内置数据集中的最新翻译更新指定语言区域——仅填充**缺失**的键，不覆盖已有翻译。

```bash
php artisan lingua:update-lang fr
```

适用场景：升级 Lingua 后，新增的翻译键需要填充到现有语言区域中。

---

## `lingua:sync-to-database`

将 `lang/` 目录中的所有 PHP 和 JSON 翻译文件导入数据库。

```bash
php artisan lingua:sync-to-database

# 只同步特定语言区域
php artisan lingua:sync-to-database --locale=fr

# 干运行（预览变更，不实际写入）
php artisan lingua:sync-to-database --dry-run
```

仅适用于**数据库驱动**模式。

---

## `lingua:sync-to-local`

将数据库中的所有翻译导出为 PHP 和 JSON 文件到 `lang/` 目录。

```bash
php artisan lingua:sync-to-local

# 只导出特定语言区域
php artisan lingua:sync-to-local --locale=fr
```

仅适用于**数据库驱动**模式。使用 `AtomicFileWriter` 进行原子性写入（`opcache_invalidate` 保护）。

---

## `lingua:uninstall`

安全地移除 Lingua——可选地回滚迁移、移除已发布的文件、移除 Composer 依赖。

```bash
php artisan lingua:uninstall
```

该命令是交互式的：会在执行每个破坏性操作之前请求确认。

::: danger 不可逆操作
回滚迁移会永久删除所有翻译、语言和设置数据。卸载前请先备份数据。
:::
