# 翻译同步

Lingua 支持在数据库和 `lang/` 文件之间双向同步翻译，让您同时享有数据库驱动的运行时和基于文件的版本控制两者的优势。

## 两个方向

| 方向 | 命令 | 说明 |
|---|---|---|
| 文件 → 数据库 | `lingua:sync-to-database` | 将 `lang/` 目录中的 PHP 和 JSON 文件导入数据库 |
| 数据库 → 文件 | `lingua:sync-to-local` | 将数据库中的翻译导出为 PHP 和 JSON 文件到 `lang/` |

## 内置数据集（无需 laravel-lang）

Lingua 2.0 **不**依赖 `laravel-lang/common`。翻译数据集随包一起发布：

- **26 个语言区域**的完整翻译
- **5902 个字符串**，与 Laravel **v13.14.0** 对齐
- 涵盖 7 个分组：`auth`、`pagination`、`passwords`、`validation`、`http-statuses`、`notifications`（通知标题/正文/操作）

`lingua:add {locale}` 从此内置数据集填充翻译，**无需网络请求**。

## 从文件同步到数据库

```bash
php artisan lingua:sync-to-database
```

使用场景：
- 初次将现有基于文件的翻译迁移到数据库
- 将开发者提交的翻译文件推送到生产数据库
- 在 CI/CD 流水线中更新翻译后同步到数据库

工作原理：

1. 遍历 `config('lingua.lang_dir')` 目录（默认为 `lang/`）
2. 读取所有 `.php` 和 `.json` 文件
3. 对于每个 `(group, key)` 对，如果数据库中不存在则创建，如果存在则更新 `text` JSON 列中对应语言区域的值
4. 检测 `lang/vendor/` 子目录，将对应行标记为 `is_vendor = true`
5. 每次写入后精确清除受影响的 `(locale, group)` 缓存键

```bash
# 同步特定语言区域
php artisan lingua:sync-to-database --locale=fr

# 干运行（显示将要变更的内容，不实际写入）
php artisan lingua:sync-to-database --dry-run
```

## 同步到本地文件

```bash
php artisan lingua:sync-to-local
```

使用场景：
- 备份翻译到版本控制
- 为部署到只读文件系统准备翻译文件
- 在切换到文件驱动之前导出数据库翻译
- 与不支持数据库的翻译机构共享翻译

工作原理：

1. 查询数据库中所有翻译行
2. 按语言区域和分组分组
3. PHP 格式的翻译（`*.php` 文件）以正确的 PHP 数组格式写入
4. JSON 格式的翻译（`*.json` 文件）以 JSON 格式写入
5. 使用 `AtomicFileWriter` 进行原子性写入（先写 `.tmp`，再 `rename()`，然后 `opcache_invalidate()`）

## 更新单个语言

```bash
php artisan lingua:update-lang {locale}
```

这是 `sync-to-database` 的针对单个语言区域的快捷方式，适合只需要更新特定语言翻译的场景。

## 精确缓存失效

Lingua **不**在任何同步路径中执行全局 `cache:clear`。

写入翻译时，只有受影响的 `(locale, group)` 缓存键会被清除：

```
Cache::forget('lingua.trans.fr.auth')
Cache::forget('lingua.trans.fr.validation')
```

其他语言区域和分组的缓存保持不变，最大限度减少缓存 warm-up 开销。

## 文件驱动中的同步

在文件驱动模式下：

- `lingua:sync-to-database` 是**无操作**（文件模式没有 `language_lines` 表）
- `lingua:sync-to-local` 是**无操作**（文件就是权威来源）
- 翻译通过 `AtomicFileWriter` 直接写入 `lang/` 文件

## 在数据库驱动中与版本控制配合使用

推荐工作流：

```bash
# 开发时：通过 UI 编辑翻译
# 发布前：导出到文件并提交
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"

# 部署时：从文件导入到生产数据库
php artisan lingua:sync-to-database
```
