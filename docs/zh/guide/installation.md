# 安装

Lingua 附带一个交互式安装向导，通过一条命令即可完成所有配置。如果您希望更精细地控制安装过程，下面也提供了手动安装步骤。

## 第一步 — 通过 Composer 安装

```bash
composer require rivalex/lingua
```

## 第二步 — 运行安装程序

```bash
php artisan lingua:install
```

向导将执行以下操作：

1. 将配置文件发布到 `config/lingua.php`
2. 发布数据库迁移文件
3. 询问是否自动运行迁移
4. 使用默认语言（英语）及其来自 Laravel Lang 的所有翻译对数据库进行初始化
5. 可选择在 GitHub 上为仓库加星 ⭐

完成后您将看到：

```
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua package installed successfully!
```

## 第三步 — 访问管理界面

打开您的应用并访问以下地址：

| 页面 | URL | 路由名称 |
|---|---|---|
| 语言管理 | `your-app.test/lingua/languages` | `lingua.languages` |
| 翻译管理 | `your-app.test/lingua/translations` | `lingua.translations` |

就这样，Lingua 已经在运行了。

---

## 手动安装

如果您希望逐步单独发布和运行每个步骤：

```bash
# 1. 发布配置文件
php artisan vendor:publish --tag="lingua-config"

# 2. 发布迁移文件
php artisan vendor:publish --tag="lingua-migrations"

# 3. 运行迁移
php artisan migrate

# 4. 初始化默认语言和翻译
php artisan db:seed --class="Rivalex\Lingua\Database\Seeders\LinguaSeeder"
```

---

## 保护管理界面

默认情况下，Lingua 路由仅使用 `web` 中间件——不会自动应用任何身份验证守卫。**在生产环境中，您应当添加自己的中间件**。

### 通过配置文件

```php
// config/lingua.php
'middleware' => ['web', 'auth'],
```

### 使用角色/权限守卫（例如 Spatie Permission）

```php
'middleware' => ['web', 'auth', 'role:admin'],
// 或
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

::: tip
Laravel 路由器支持的任何中间件都可以添加到数组中。更改立即生效——无需清除缓存。
:::

---

## 安装后检查清单

- [ ] 在 `config/lingua.php` 中添加身份验证中间件
- [ ] 将语言选择器组件添加到您的布局中（参见[语言选择器](/zh/features/language-selector)）
- [ ] 在 `<html>` 标签上设置 `dir` 和 `lang` 属性（参见 [RTL/LTR 支持](/zh/features/rtl-support)）
- [ ] 通过 `php artisan lingua:add {locale}` 添加更多语言
- [ ] 如果使用 HTML/Markdown 翻译，在 `config/lingua.php` 中配置编辑器工具栏
