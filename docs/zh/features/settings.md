# 设置

设置页面让您从浏览器配置 Lingua 的 UI 行为 — 无需编辑配置文件或重新部署。

导航到 `/lingua/settings` 或从您的管理面板链接：

```blade
<a href="{{ route('lingua.settings') }}">Lingua 设置</a>
```

<Screenshot src="/screenshots/settings-page.png" alt="Lingua 设置页面" caption="设置页面包含选择器模式和国旗图标控件。" />

## 设置如何工作

设置以类型化的键/值对形式存储在 `lingua_settings` 数据库表中。在每次请求时，Lingua 首先从数据库读取，然后回退到 `config/lingua.php`，最后回退到硬编码的默认值。

**优先级链：**
1. `lingua_settings` DB 表（最高优先级 — 通过此 UI 设置）
2. `config/lingua.php`（您发布的配置）
3. 包默认值（最低优先级）

这意味着您可以将 `config/lingua.php` 作为基准，通过 UI 按环境覆盖特定设置，无需修改文件。

## 选择器模式

控制 `<livewire:lingua::language-selector />` 组件如何为您的最终用户渲染。

| 模式 | 说明 |
|---|---|
| `sidebar` | 渲染为分组导航部分（默认） |
| `modal` | 渲染为打开完整语言选择器弹窗的按钮 |
| `dropdown` | 渲染为紧凑的下拉按钮 |
| `headless` | 无内置渲染 — 您自己实现 UI |

::: tip Headless 模式
当设置为 `headless` 时，内置选择器不渲染任何内容。改用 `<livewire:lingua::headless-language-selector />` 构建完全自定义的切换器。完整文档请参见 [Headless 选择器](./language-selector#headless-模式)。
:::

## 显示国旗图标

切换是否在选择器中的语言名称旁显示国旗图标。禁用时仅显示语言名称。

国旗图标与语言的 `regional` 代码匹配（例如 `en_US` → 🇺🇸）。如果未设置区域代码，国旗将优雅地回退。

## 程序化访问

您可以在 PHP 中使用 `LinguaSetting` 模型读写设置：

```php
use Rivalex\Lingua\Models\LinguaSetting;

// 带 config() 回退的读取
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

$showFlags = LinguaSetting::get(
    LinguaSetting::KEY_SHOW_FLAGS,
    config('lingua.selector.show_flags', true)
);

// 写入
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_SHOW_FLAGS, false);
```

可用常量：

| 常量 | 键 | 类型 |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |

::: warning 需要迁移
`lingua_settings` 表由 `create_lingua_settings_table` 迁移创建。如果您从 1.0.x 升级，请运行 `php artisan migrate` 来创建它。
:::
