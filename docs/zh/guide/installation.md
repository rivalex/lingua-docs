# 安装

Lingua 附带一个交互式安装向导，一条命令即可搞定所有事情。如果您希望更精细地控制，下面也记录了手动步骤。

## 第一步——通过 Composer 安装

```bash
composer require rivalex/lingua
```

这是您唯一需要的包。Lingua 2.0 内置了自己的语言区域数据和翻译数据集，无需再安装其他任何东西。

::: tip 从 1.x 升级？
Composer 会自动移除旧的 `spatie/laravel-translation-loader` 依赖。如果您自己的 `composer.json` 中仍然列出了 `laravel-lang/common`，请移除它：`composer remove laravel-lang/common`。
请参阅完整的[升级指南](/zh/guide/upgrade)。
:::

## 第二步——运行安装向导

```bash
php artisan lingua:install
```

该向导是交互式的。它使用 [Laravel Prompts](https://laravel.com/docs/prompts)，通过方向键选择器让您选择**存储驱动**：

| 驱动 | 适用场景 |
|---|---|
| **`database`** *（推荐）* | 您需要完整功能集：HTML/Markdown 类型、统计、导入/导出、供应商保护和精确缓存。 |
| **`file`** | 您将翻译保存在版本控制中，或在只读/CI 环境中运行，更偏向使用普通的 `lang/` 文件。 |

然后向导会：

1. 将配置文件发布到 `config/lingua.php`
2. 发布**驱动感知**迁移（`file` 驱动会跳过 `language_lines` 迁移）
3. 询问是否自动运行迁移
4. 使用内置数据集将默认语言及其翻译填充到数据库——**无需从 GitHub 下载**
5. 可选地在 GitHub 上给仓库加星 ⭐

完成后您将看到：

```
✓ Driver selected          →  database
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua installed successfully!
```

## 第三步——访问 UI

打开您的应用，访问：

| 页面 | URL | 路由名称 |
|---|---|---|
| 语言 | `your-app.test/lingua/languages` | `lingua.languages` |
| 翻译 | `your-app.test/lingua/translations` | `lingua.translations` |
| 统计 | `your-app.test/lingua/statistics` | `lingua.statistics` |
| 传输 | `your-app.test/lingua/transfer` | `lingua.transfer` |
| 设置 | `your-app.test/lingua/settings` | `lingua.settings` |

就这样，Lingua 已在运行。

---

## 手动安装

如果您希望分别发布和运行每个步骤：

```bash
# 1. 发布配置
php artisan vendor:publish --tag="lingua-config"

# 2. 发布迁移（驱动感知）
php artisan vendor:publish --tag="lingua-migrations"

# 3. 运行迁移
php artisan migrate

# 4. 添加默认语言并填充翻译
php artisan lingua:add en
```

请参阅[发布资产](/zh/guide/publishing)了解完整的标签列表。

---

## 保护管理 UI

<Badge type="tip" text="2.0 新增" /> Lingua 2.0 **默认安全**。管理路由自动应用了 `['web', 'auth']` 中间件——匿名访客无法访问 UI。

### 通过门控收紧访问权限

对于基于角色的访问，请定义一个授权门控，并通过 `LINGUA_GATE` 环境变量指向 Lingua。Lingua 会将 `can:{gate}` 附加到其管理路由：

```env
LINGUA_GATE=manage-translations
```

```php
// app/Providers/AppServiceProvider.php — boot()
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $user) => $user->hasRole('admin'));
```

您也可以直接编辑中间件数组：

```php
// config/lingua.php
'middleware' => ['web', 'auth', 'role:admin'],
```

::: tip
Laravel 路由器支持的任何中间件都可以添加到数组中。更改立即生效——无需清除缓存。
:::

请参阅[安全参考](/zh/guide/security)了解完整的加固概览。

---

## 安装后检查清单

- [ ] 确认 `config/lingua.php` 中的存储驱动与您的部署环境匹配（`database` 或 `file`）
- [ ] 可选：设置 `LINGUA_GATE` 以实现基于角色的访问
- [ ] 将语言选择器组件添加到您的布局中（参见[语言选择器](/zh/features/language-selector)）
- [ ] 在 `<html>` 标签上设置 `dir` 和 `lang`（参见 [RTL/LTR 支持](/zh/features/rtl-support)）
- [ ] 通过 `php artisan lingua:add {locale}` 添加更多语言
- [ ] 如果使用 HTML/Markdown 翻译，在 `config/lingua.php` 中配置编辑器工具栏（数据库驱动）
