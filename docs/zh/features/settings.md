# 设置

设置页面（`/lingua/settings`）允许从浏览器中配置 Lingua 的 UI 行为——无需编辑配置文件或重新部署。

## 优先级链

设置值遵循以下优先级顺序（高→低）：

1. **数据库**（`lingua_settings` 表）——通过设置 UI 写入
2. **配置文件**（`config/lingua.php`）——`vendor:publish` 后的应用配置
3. **包默认值**——Lingua 内置的默认值

通过 UI 更改设置会将值写入 `lingua_settings` 表，并覆盖配置文件中的值，但不会修改配置文件本身。

## 语言选择器设置

### 选择器模式

控制 `<livewire:lingua::language-selector>` 的默认渲染模式。

| 选项 | 说明 |
|---|---|
| `sidebar` | 侧边栏导航链接列表（默认） |
| `dropdown` | 紧凑下拉按钮 |
| `modal` | 打开语言网格弹窗的按钮 |
| `headless` | 无内置渲染 |

对应配置键：`lingua.selector.mode`

### 显示国旗图标

切换是否在语言选择器中显示国旗图标。

对应配置键：`lingua.selector.show_flags`

## 导航菜单 <Badge type="tip" text="2.0 新增" />

### 启用共享导航

切换出现在所有五个 Lingua 页面顶部的 `x-lingua::nav` 共享导航组件。

- **启用**（默认）：在所有 Lingua 管理页面显示统一导航菜单
- **禁用**：移除共享导航（适用于已有自定义导航的应用）

对应配置键：`lingua.nav.enabled`

## 路由与导航设置

### 路由前缀

更改所有 Lingua 管理页面的 URL 前缀（默认为 `lingua`）。

对应配置键：`lingua.routes_prefix`

### Wire Navigate

控制 Lingua 内部链接上是否使用 `wire:navigate`（SPA 导航）。

- **禁用**（默认，2.0 中已更改）：使用全页重定向，更稳定
- **启用**：使用 Livewire SPA 导航，更快但可能有边缘情况

对应配置键：`lingua.navigate`

## 外观 {#appearance} <Badge type="tip" text="新增" />

### 强制深色模式

Lingua 自身的样式使用基于 class 的 `dark:` 变体，通常会跟随宿主应用的 `<html class="dark">` 祖先元素。如果宿主应用没有深色模式切换（或其状态与实际的操作系统偏好不一致），Lingua 的样式可能会渲染为无样式状态。

**强制深色模式**开关会让 Lingua 始终渲染其深色主题，无论宿主应用或操作系统的配色方案如何——适用于将 Lingua 嵌入没有深色模式支持的宿主应用，或在浅色模式系统上进行本地开发时。

对应配置键：`lingua.dark_mode.force`

```php
// config/lingua.php
'dark_mode' => [
    'force' => env('LINGUA_FORCE_DARK_MODE', false),
],
```

## 存储驱动（只读显示）

设置页面显示当前活动的存储驱动（`database` 或 `file`），但**不**提供在 UI 中切换驱动的选项。要更改驱动，请使用：

```bash
php artisan lingua:storage {database|file}
```

参见[存储驱动](/zh/guide/storage)。

## 以编程方式访问设置

```php
use Rivalex\Lingua\Models\LinguaSetting;

// 读取设置（优先级链：DB → config → 默认值）
$mode = LinguaSetting::get('selector_mode', config('lingua.selector.mode', 'sidebar'));

// 写入设置
LinguaSetting::set('selector_mode', 'dropdown');

// 移除覆盖（回退到配置文件值）
LinguaSetting::forget('selector_mode');
```

`LinguaSetting::get()` 接受一个可选的第二参数作为默认值，当键在数据库和配置中均未设置时使用。
