# 配置

安装后，`config/lingua.php` 是所有 Lingua 设置的唯一真实来源。本页记录了每个键，按关注点分组。标有 <Badge type="tip" text="2.0 新增" /> 的键在 1.x 中不存在。

## 语言区域设置

```php
// config/lingua.php

'lang_dir'         => lang_path(),
'base_translations_path' => null, // ★ 2.0 新增
'default_locale'   => config('app.locale', 'en'),
'fallback_locale'  => config('app.fallback_locale', 'en'),
'session_variable' => 'locale',
```

### `lang_dir`

**默认值：** `lang_path()`——解析为 `{project_root}/lang/`。

Lingua 在同步文件到数据库时读取的目录，以及导出回文件时写入的目录。

### `base_translations_path` <Badge type="tip" text="2.0 新增" />

**默认值：** `null`

Lingua 读取**内置**翻译数据集的路径的可选覆盖。设置为 `null` 可使用包内附带的数据集。

### `default_locale`

**默认值：** `config('app.locale', 'en')`

在安装期间以及 `languages` 表为空时用作后备。安装后，权威默认值是 `languages` 表中 `is_default = true` 的行。

### `fallback_locale`

**默认值：** `config('app.fallback_locale', 'en')`

标准 Laravel 后备——当活动语言区域中缺少某个键时，接下来会尝试此语言区域。

### `session_variable`

**默认值：** `'locale'`

Lingua 存储用户所选语言区域的 Session 键。

---

## 安全与访问

```php
'middleware' => ['web', 'auth'],
'gate'       => env('LINGUA_GATE', null), // ★ 2.0 新增
```

### `middleware`

**默认值：** `['web', 'auth']` <Badge type="warning" text="2.0 更改" />

::: tip 默认安全
在 2.0 中，默认值为 `['web', 'auth']`——管理 UI 开箱即用**不**可公开访问。在 1.x 中为 `['web']`。
:::

```php
// 使用 Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// 使用自定义 Gate 策略
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `gate` <Badge type="tip" text="2.0 新增" />

**默认值：** `env('LINGUA_GATE', null)`

设置后，Lingua 会将 `can:{gate}` 附加到所有管理路由。在服务提供者中定义门控：

```env
LINGUA_GATE=manage-translations
```

```php
Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

请参阅[安全参考](/zh/guide/security#authentication)。

---

## 路由

```php
'routes_prefix'           => 'lingua',
'routes_extra_parameters' => null,  // ★ 2.0 新增
'navigate'                => false, // ★ 2.0 新增（默认值已更改）
'layout'                  => null,  // ★ 2.0 新增
```

### `routes_prefix`

**默认值：** `'lingua'`

更改所有 Lingua 管理页面的 URL 前缀：

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
```

### `routes_extra_parameters` <Badge type="tip" text="2.0 新增" />

**默认值：** `null`

附加到路由前缀的可选参数化后缀——适用于租户或分区范围的前缀。

### `navigate` <Badge type="tip" text="2.0 新增" />

**默认值：** `false` <Badge type="warning" text="2.0 更改" />

控制 Lingua 内部链接上的 `wire:navigate`。默认现在为 `false`（全页重定向），可避免 SPA 导航的边缘情况。通过 `'navigate' => true` 选择启用。

### `layout` <Badge type="tip" text="2.0 新增" />

**默认值：** `null`

为 Lingua 视图提供自定义 Blade 布局。设置为 `null` 使用包内置布局。

---

## 导航

```php
'nav' => [
    'enabled' => true, // ★ 2.0 新增
],
'links' => [
    'translations' => [          // ★ 2.0 新增
        'enabled' => true,
        'route'   => 'lingua.translations',
    ],
],
```

### `nav.enabled` <Badge type="tip" text="2.0 新增" />

**默认值：** `true`

切换出现在所有五个 Lingua 页面上的共享 `x-lingua::nav` 导航菜单。也可以从设置 UI 切换。

### `links.translations` <Badge type="tip" text="2.0 新增" />

控制共享导航中的"翻译"条目：是否显示（`enabled`）以及指向哪个路由（`route`）。

---

## UI

```php
'ui' => [
    'sticky_top' => 0, // ★ 2.0 新增
],
'selector' => [
    'mode'       => 'sidebar',  // 'sidebar' | 'modal' | 'dropdown' | 'headless'
    'show_flags' => true,
],
'editor' => [
    'headings' => false, 'bold' => true, 'italic' => true,
    'underline' => true, 'strikethrough' => false,
    'subscript' => true, 'superscript' => true,
    'blockquote' => false, 'code-line' => false, 'code-block' => false,
    'bullet' => true, 'ordered' => true, 'clear' => true, 'code-mode' => false,
],
```

### `ui.sticky_top` <Badge type="tip" text="2.0 新增" />

**默认值：** `0`

Lingua 粘性工具栏的像素偏移量。如果您的应用有固定头部，请增大此值，以避免工具栏滑入头部下方。

### `selector.mode`

**默认值：** `'sidebar'`

| 值 | 描述 |
|---|---|
| `sidebar` | 分组侧边栏导航项 |
| `dropdown` | 紧凑下拉按钮 |
| `modal` | 打开语言区域选择器弹窗的按钮 |
| `headless` | 无内置渲染——使用无头组件 |

### `selector.show_flags`

**默认值：** `true`

是否在语言名称旁显示国旗图标。

### `editor`

控制 HTML 和 Markdown 翻译类型的富文本工具栏（仅数据库驱动）。每个键切换一个格式选项：`headings`、`bold`、`italic`、`underline`、`strikethrough`、`subscript`、`superscript`、`blockquote`、`code-line`、`code-block`、`bullet`、`ordered`、`clear`、`code-mode`。

---

## 存储驱动 <Badge type="tip" text="2.0 新增" />

```php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

### `storage.driver`

**默认值：** `env('LINGUA_STORAGE_DRIVER', 'database')`

选择翻译存储位置：

| 驱动 | 行为 |
|---|---|
| `database` | 完整的 1.x 行为：`language_lines` 表、HTML/Markdown 类型、统计、导入/导出、供应商保护、精确缓存。 |
| `file` | 直接读写 `lang/` PHP+JSON 文件；无 `language_lines` 表；类型扁平化为纯文本。 |

这是一个主要功能——请参阅[存储驱动](/zh/guide/storage)了解完整对比和 `lingua:storage` 切换命令。

---

## 缓存

```php
'cache' => [
    'store'  => env('LINGUA_CACHE_STORE', null),       // ★ 2.0 新增
    'prefix' => env('LINGUA_CACHE_PREFIX', 'lingua.trans'), // ★ 2.0 新增
],
```

### `cache.store` <Badge type="tip" text="2.0 新增" />

**默认值：** `env('LINGUA_CACHE_STORE', null)`

Lingua 用于翻译缓存的缓存存储。`null` 使用应用的默认存储。

### `cache.prefix` <Badge type="tip" text="2.0 新增" />

**默认值：** `env('LINGUA_CACHE_PREFIX', 'lingua.trans')`

缓存键的前缀。Lingua 按 `(locale, group)` **精确**缓存翻译，写入时只清除受影响键的缓存——任何同步路径中都**不**存在全局 `cache:clear`。请参阅[缓存架构](/zh/guide/architecture#cache-architecture)。

---

## 翻译加载器

```php
'translation_loaders' => [
    // Rivalex\Lingua\Loaders\YourCustomLoader::class,
],
'model'               => Rivalex\Lingua\Models\Translation::class,
'translation_manager' => Rivalex\Lingua\TranslationManager\LinguaManager::class,
```

### `translation_loaders`

注册实现了 `Rivalex\Lingua\Contracts\TranslationLoader` 的额外加载器。契约签名为 `loadTranslations(string $locale, string $group, ?string $namespace = null): array`。

### `model`

支持 `language_lines` 的 Eloquent 模型。覆盖以使用您自己的逻辑扩展 `Translation`。

### `translation_manager`

翻译加载器类。默认为 `Rivalex\Lingua\TranslationManager\LinguaManager`，它扩展了 `Illuminate\Translation\FileLoader`。

---

## 扩展

```php
'extensions' => [
    'enabled' => env('LINGUA_EXTENSIONS_ENABLED', true), // ★ 2.0 新增
],
'suppress_pro_nudge' => env('LINGUA_SUPPRESS_PRO_NUDGE', false), // ★ 2.0 新增
'pro_upgrade_url'    => env('LINGUA_PRO_UPGRADE_URL', 'https://lingua.rivalex.dev'), // ★ 2.0 新增
```

### `extensions.enabled` <Badge type="tip" text="2.0 新增" />

**默认值：** `true`

可选 Lingua 扩展的主开关。

### `suppress_pro_nudge` <Badge type="tip" text="2.0 新增" />

**默认值：** `false`

设置为 `true` 以隐藏 UI 中的升级提示。

### `pro_upgrade_url` <Badge type="tip" text="2.0 新增" />

**默认值：** `https://lingua.rivalex.dev`

显示升级提示时使用的 URL。
