# 配置

安装完成后，`config/lingua.php` 是所有 Lingua 设置的唯一配置来源。

```php
// config/lingua.php

return [

    /*
    |--------------------------------------------------------------------------
    | Language Files Directory
    |--------------------------------------------------------------------------
    | The path where local PHP/JSON translation files are stored.
    | Used by lingua:sync-to-database and lingua:sync-to-local.
    */
    'lang_dir' => lang_path(),

    /*
    |--------------------------------------------------------------------------
    | Default Locale
    |--------------------------------------------------------------------------
    | The fallback locale code used during installation and when the database
    | has no default language configured.
    */
    'default_locale' => config('app.locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Fallback Locale
    |--------------------------------------------------------------------------
    | When a translation is missing in the active locale, Laravel will try
    | this locale next.
    */
    'fallback_locale' => config('app.fallback_locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Route Middleware
    |--------------------------------------------------------------------------
    | Middleware applied to all Lingua management routes.
    | Add 'auth' (and role/permission guards) before going to production.
    */
    'middleware' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Route Prefix
    |--------------------------------------------------------------------------
    | URL prefix for Lingua's management pages.
    | Default: /lingua/languages and /lingua/translations
    */
    'routes_prefix' => 'lingua',

    /*
    |--------------------------------------------------------------------------
    | Session Variable
    |--------------------------------------------------------------------------
    | The session key used to persist the user's active locale across requests.
    */
    'session_variable' => 'locale',

    /*
    |--------------------------------------------------------------------------
    | Language Selector
    |--------------------------------------------------------------------------
    | Controls the default behaviour of the <livewire:lingua::language-selector>
    | component. Both options can be overridden per-instance via props.
    */
    'selector' => [
        'mode'       => 'sidebar',   // 'sidebar' | 'modal' | 'dropdown'
        'show_flags' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Rich-text Editor Toolbar
    |--------------------------------------------------------------------------
    | Defines which formatting options are available in the TipTap editor
    | for HTML and Markdown translation types.
    */
    'editor' => [
        'headings'      => false,
        'bold'          => true,
        'italic'        => true,
        'underline'     => true,
        'strikethrough' => false,
        'bullet'        => true,
        'ordered'       => true,
        'clear'         => true,
    ],

];
```

---

## 选项参考

### `lang_dir`

**默认值：** `lang_path()`（解析为 `{project_root}/lang/`）

Lingua 在同步文件到数据库时读取、导出时写入的目录。如果您的翻译文件存储在非标准位置，可以修改此配置。

### `default_locale`

**默认值：** `config('app.locale', 'en')`

在安装期间以及 `languages` 表为空时用作备用语言环境。安装完成后，权威默认值是 `languages` 表中 `is_default = true` 的那一行。

### `fallback_locale`

**默认值：** `config('app.fallback_locale', 'en')`

标准 Laravel 备用行为——当活动语言环境中缺少某个键时，接下来会尝试此语言环境。

### `middleware`

**默认值：** `['web']`

::: danger 生产环境要求
在部署前，请务必至少添加 `'auth'`。否则，任何知晓 URL 的人都可以修改您的翻译内容。
:::

```php
// 典型生产环境配置
'middleware' => ['web', 'auth'],

// 使用 Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// 使用自定义 Gate 策略
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `routes_prefix`

**默认值：** `'lingua'`

更改所有 Lingua 管理页面的 URL 前缀：

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
// → /admin/translations/translations
```

### `session_variable`

**默认值：** `'locale'`

Lingua 存储用户选择的语言环境的 Session 键。如果与其他扩展包冲突，可以修改此值。

### `selector.mode`

**默认值：** `'sidebar'`

控制 `<livewire:lingua::language-selector>` 组件的默认渲染模式：

| 值 | 描述 |
|---|---|
| `sidebar` | 渲染为分组侧边栏导航项 |
| `dropdown` | 渲染为紧凑的下拉按钮 |
| `modal` | 渲染为打开语言选择模态框的按钮 |

### `selector.show_flags`

**默认值：** `true`

是否在选择器中的语言名称旁边显示国旗图标。需要 `outhebox/blade-flags` 扩展包（作为依赖项自动安装）。

### `editor`

控制 HTML 和 Markdown 翻译类型的 TipTap 工具栏。每个选项对应一个 TipTap 扩展：

| 键 | 描述 |
|---|---|
| `headings` | H1–H3 标题按钮 |
| `bold` | **粗体** |
| `italic` | *斜体* |
| `underline` | 下划线 |
| `strikethrough` | ~~删除线~~ |
| `bullet` | 无序列表 |
| `ordered` | 有序列表 |
| `clear` | 清除格式按钮 |

::: tip
编辑器工具栏是全局配置——所有 HTML/Markdown 翻译字段共享同一套配置。如果需要对每个字段进行单独控制，请发布视图并直接自定义编辑器组件。
:::
