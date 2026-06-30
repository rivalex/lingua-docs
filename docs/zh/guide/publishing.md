# 发布资产

Lingua 使用 Laravel 的标准 `vendor:publish` 机制将文件发布到您的应用中。本页列出了所有可用的发布标签。

## 标签概览

| 标签 | 发布内容 | 必须？ |
|---|---|---|
| `lingua-config` | `config/lingua.php` | 是 |
| `lingua-migrations` | `database/migrations/` | 是（数据库驱动） |
| `lingua-translations` | 内置翻译到 `lang/vendor/lingua/` | 可选 |
| `lingua-views` | Blade 视图到 `resources/views/vendor/lingua/` | 可选 |

::: tip lingua:install 已处理
`lingua:install` 交互向导会自动发布 `lingua-config` 和 `lingua-migrations`。只有在需要覆盖默认行为时才需要手动运行这些命令。
:::

---

## `lingua-config`

```bash
php artisan vendor:publish --tag=lingua-config
```

将 `config/lingua.php` 发布到您的应用配置目录。这是所有 Lingua 设置的主配置文件，必须发布。

要强制覆盖已有的配置文件：

```bash
php artisan vendor:publish --tag=lingua-config --force
```

::: warning 升级时
升级 Lingua 后，建议用 `--force` 重新发布配置，然后将新增的键手动合并到您的自定义配置中。参见[配置参考](/zh/guide/configuration)。
:::

---

## `lingua-migrations`

```bash
php artisan vendor:publish --tag=lingua-migrations
```

将数据库迁移文件发布到 `database/migrations/` 目录。包含三个文件：

1. 创建 `languages` 表
2. 创建 `language_lines` 表（仅数据库驱动）
3. 创建 `lingua_settings` 表

`lingua:install` 和 `lingua:storage` 命令均为**驱动感知**：

- **数据库驱动**：发布全部三个迁移
- **文件驱动**：跳过 `language_lines` 迁移（因为文件模式不使用该表）

发布后运行迁移：

```bash
php artisan migrate
```

---

## `lingua-translations`

```bash
php artisan vendor:publish --tag=lingua-translations
```

将 Lingua 的内置翻译（UI 字符串）发布到 `lang/vendor/lingua/`，供自定义使用。

发布的文件结构如下：

```
lang/vendor/lingua/
  en/
    lingua.php       ← Lingua UI 字符串（英语）
  fr/
    lingua.php       ← 法语翻译
  ...（所有 26 个内置语言区域）
```

这通常是**可选的**。只有当您需要修改 Lingua 管理 UI 中的标签或消息时才需要发布。

---

## `lingua-views`

```bash
php artisan vendor:publish --tag=lingua-views
```

将所有 Blade 视图发布到 `resources/views/vendor/lingua/`，供自定义使用。

::: warning 谨慎使用
发布视图后，Lingua 的视图升级不会自动应用到您的应用。每次升级 Lingua 后，您需要手动将视图变更合并到已发布的文件中。建议仅在必须自定义视图时才发布。
:::

---

## 已移除的标签

### `lingua-assets` <Badge type="warning" text="2.0 已移除" />

在 Lingua 1.x 中，CSS 和 JS 资产通过 `lingua-assets` 标签发布。

**2.0 中已移除。** 资产现在通过 `lingua.assets` 路由（`/lingua/assets/{file}`）按需提供，无需手动发布。

如果您在部署流程中引用了 `--tag=lingua-assets`，请将其移除。
