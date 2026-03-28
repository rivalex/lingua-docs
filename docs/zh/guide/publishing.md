# 发布资源

Lingua 提供多个可发布的分组，让您只覆盖需要修改的部分。

## 一次性发布所有内容

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## 按标签单独发布

### `lingua-config`

发布配置文件。

```bash
php artisan vendor:publish --tag="lingua-config"
```

**输出：** `config/lingua.php`

用于自定义路由、中间件、选择器模式、编辑器工具栏或任何其他选项。

---

### `lingua-migrations`

发布数据库迁移文件。

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

**输出：** `database/migrations/YYYY_MM_DD_HHMMSS_create_lingua_table.php`

当您需要修改 `languages` 或 `language_lines` 的数据库结构时使用——例如，添加索引或更改字段类型。发布后，像往常一样运行 `php artisan migrate`。

::: warning
`lingua:install` 向导会自动发布并运行迁移。只有在需要在运行之前自定义数据库结构时，才需要手动发布。
:::

---

### `lingua-translations`

发布扩展包自身的界面翻译字符串。

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**输出：** `lang/vendor/lingua/{locale}/lingua.php`

这会暴露 Lingua 界面中使用的每个标签、标题、按钮和消息。覆盖任意字符串以：
- 将界面翻译成您的应用语言
- 根据项目风格调整措辞（例如将 "Add language" 改为 "Install locale"）

发布的文件遵循标准 Laravel 扩展包翻译目录结构：

```
lang/
└── vendor/
    └── lingua/
        ├── en/
        │   └── lingua.php
        ├── fr/
        │   └── lingua.php
        └── it/
            └── lingua.php
```

---

### `lingua-views`

发布所有 Blade 和 Livewire 视图。

```bash
php artisan vendor:publish --tag="lingua-views"
```

**输出：** `resources/views/vendor/lingua/`

用于自定义布局、模态框或语言选择器组件。Laravel 会自动使用您发布的视图替代扩展包默认视图。

```
resources/views/vendor/lingua/
├── components/
│   ├── autocomplete.blade.php
│   ├── clipboard.blade.php
│   ├── editor.blade.php
│   ├── language-flag.blade.php
│   ├── menu-group.blade.php
│   └── message.blade.php
└── livewire/
    ├── languages.blade.php
    ├── language-selector.blade.php
    ├── translations.blade.php
    └── translation/
        ├── create.blade.php
        ├── delete.blade.php
        ├── row.blade.php
        └── update.blade.php
```

::: tip
只发布您打算修改的视图。未发布的视图直接从扩展包提供，可自动获得上游更新。
:::

---

### `lingua-assets`

将编译后的 CSS 和 JavaScript 发布到 `public/` 目录。

```bash
php artisan vendor:publish --tag="lingua-assets"
```

**输出：** `public/vendor/lingua/`

仅当您直接从 `public/` 提供资源（而非通过 Vite 或 CDN）时才需要。**每次升级 Lingua 后请重新运行**以保持资源同步。

---

## 升级后的更新

通过 Composer 更新 Lingua 后，重新发布已更改的资源：

```bash
# 始终重新发布编译后的资源
php artisan vendor:publish --tag="lingua-assets" --force

# 如果您尚未自定义界面翻译，重新发布
php artisan vendor:publish --tag="lingua-translations" --force
```

`--force` 标志会覆盖现有文件。对于 `lingua-views` 和 `lingua-config`，请省略此标志以保留您的本地自定义。
