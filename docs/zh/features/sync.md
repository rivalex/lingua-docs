# 双向同步

Lingua 可以将翻译从本地文件导入数据库，也可以将翻译导出回文件——让您同时享有**数据库驱动的运行时**和**基于文件的版本控制**两者的优势。

## 两个方向

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (DB)
lang/it/*.php          │
lang/it.json           │
lang/vendor/…          │  ◄── lingua:sync-to-local
                      ─┘
```

## 同步到数据库

将 `lang/` 目录（及其子目录）中的所有翻译文件导入 `language_lines` 表。

```bash
php artisan lingua:sync-to-database
```

### 导入内容

- `lang/{locale}/*.php` — 标准 PHP 翻译文件
- `lang/{locale}.json` — JSON 翻译文件
- `lang/vendor/{package}/{locale}/*.php` — 扩展包翻译

### 更新插入行为

Lingua 使用 `updateOrCreate` 基于 `group` + `key` 进行匹配。这意味着：
- **新键**会被插入
- **现有键**的 `text` JSON 会被合并——您在界面中编辑的语言环境值**会被保留**
- **类型检测**会根据值确定 `text` / `html` / `markdown`

### 类型自动检测

| 规则 | 分配的类型 |
|---|---|
| 字符串包含 HTML 标签（`<…>`） | `html` |
| 字符串可以解析为 Markdown（标题、列表等） | `markdown` |
| 以上皆不符合 | `text` |

::: tip
类型检测是保守的——只有当内容明确匹配时才分配 `html` 或 `markdown`。纯字符串始终获得 `text` 类型。您可以通过编辑模态框手动更改类型。
:::

### 通过 Facade

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
```

::: warning
Facade 内部调用 `Translation::syncToDatabase()`，这是一个静态调用。在 Artisan 命令和 Livewire 组件中，改用 `app(Translation::class)->syncToDatabase()`，以便 Mockery 在测试中能够拦截它。
:::

---

## 同步到本地

将 `language_lines` 中的所有翻译导出回 `lang/` 目录的 PHP 和 JSON 文件。

```bash
php artisan lingua:sync-to-local
```

### 导出内容

- 所有非扩展包翻译 → `lang/{locale}/{group}.php`
- JSON 分组键（`single`） → `lang/{locale}.json`
- 扩展包翻译 → `lang/vendor/{vendor}/{locale}/{group}.php`

### 使用场景

- **版本控制** — 提交导出的文件以跟踪翻译变化历史
- **部署流水线** — 在部署前导出，适用于依赖基于文件翻译的下游工具
- **备份** — 创建所有翻译的时间点快照
- **其他工具** — 导出用于翻译管理服务或 CSV 导入器

### 通过 Facade

```php
Lingua::syncToLocal();
```

---

## 从 Laravel Lang 更新

从 `laravel-lang` 生态系统拉取最新翻译字符串并同步到数据库。在升级 Laravel 或添加附带翻译的新扩展包后非常有用。

```bash
php artisan lingua:update-lang
```

这会先运行 `lang:update`（来自 `laravel-lang/common`），然后再运行 `lingua:sync-to-database`。

---

## 自动化同步工作流

### 在部署时

在部署后添加一个步骤，使数据库与提交的语言文件保持同步：

```bash
# 在部署脚本或 CI/CD 流水线中
php artisan lingua:sync-to-database
php artisan optimize:clear
```

### 通过计划任务

如果您的翻译团队直接编辑文件（而非通过界面），可以安排定期同步：

```php
// routes/console.php
Schedule::command('lingua:sync-to-database')->hourly();
```

### 安装新扩展包时

当您 `composer require` 一个附带翻译的新扩展包时，运行：

```bash
php artisan lingua:update-lang
```

这会拾取已安装扩展包中的所有新字符串。

---

## 技巧与注意事项

::: tip 以数据库为事实来源
将数据库视为主要来源。只有在需要文件时（版本控制、部署等）才同步到本地。避免在数据库使用期间直接编辑本地文件——如果键已存在，下一次同步到数据库时会覆盖您的编辑。
:::

::: warning 本地文件与数据库不同步
如果您手动添加新的语言环境 PHP 文件而不运行 `lingua:sync-to-database`，新键只能通过文件加载器获取（优先级低于数据库）。运行同步以正确导入它们。
:::

::: tip 完整往返
一种安全重组翻译的方式：
1. `lingua:sync-to-local` — 导出所有内容
2. 在磁盘上编辑文件
3. `lingua:sync-to-database` — 重新导入
:::
