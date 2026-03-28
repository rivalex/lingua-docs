# 语言选择器

`<livewire:lingua::language-selector>` 组件是一个可嵌入的语言切换器，供终端用户使用——与后台管理界面完全分离。

## 基本用法

```blade
<livewire:lingua::language-selector />
```

将其添加到您的任意 Blade 布局中。它使用 `config/lingua.php` 中配置的模式渲染（默认为 `sidebar`）。

## 显示模式

### 侧边栏模式（默认）

渲染为分组导航区块——非常适合基于 Flux 构建的应用侧边栏。

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/lingua-docs/screenshots/selector-sidebar.png" alt="侧边栏模式的语言选择器" caption="侧边栏模式 — 将所有已安装语言显示为导航项。" width="320px" :center="true"/>

### 下拉菜单模式

渲染为紧凑的下拉按钮——非常适合页头和导航栏。

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/lingua-docs/screenshots/selector-dropdown.png" alt="下拉菜单模式的语言选择器" caption="下拉菜单模式 — 显示带有国旗图标的当前语言。" width="320px" :center="true"/>

### 模态框模式

渲染为打开完整语言选择模态框的按钮——非常适合落地页或引导流程中的突出语言切换。

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/lingua-docs/screenshots/selector-modal.png" alt="模态框模式的语言选择器" caption="模态框模式 — 全屏语言选择覆盖层。"/>

## 属性参考

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`、`'dropdown'` 或 `'modal'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | 显示国旗图标 |

```blade
{{-- 按实例覆盖模式 --}}
<livewire:lingua::language-selector mode="dropdown" :show-flags="false" />
```

## 语言切换工作原理

当用户点击某种语言时，组件调用 `changeLocale($locale)`：

1. 验证该语言环境在 `languages` 表中存在（静默忽略未知语言环境）
2. 将语言环境代码存储在 `config('lingua.session_variable')` 对应的 Session 中
3. 为当前请求调用 `app()->setLocale($locale)`
4. 重定向到当前 URL（触发完整页面重载，使新语言环境在所有地方生效）

在下一次请求中，`LinguaMiddleware` 会在您的控制器运行之前读取 Session 并应用语言环境。

## 国旗图标

国旗图标由 [`outhebox/blade-flags`](https://github.com/MohmmedAshraf/blade-flags) 扩展包提供支持，该包作为 Lingua 的依赖项自动安装。

国旗通过语言的 `regional` 代码匹配（例如 `en_US` → 🇺🇸，`fr_FR` → 🇫🇷）。如果没有设置区域代码，国旗组件会优雅地降级为显示两字母代码。

全局禁用国旗：

```php
// config/lingua.php
'selector' => ['show_flags' => false],
```

或按实例禁用：

```blade
<livewire:lingua::language-selector :show-flags="false" />
```

## 自定义选择器视图

发布视图以覆盖标记：

```bash
php artisan vendor:publish --tag="lingua-views"
```

选择器模板位于：

```
resources/views/vendor/lingua/livewire/
├── language-selector.blade.php
└── selector/
    ├── sidebar.blade.php
    ├── dropdown.blade.php
    └── modal.blade.php
```

::: tip 与您的导航集成
如果您使用 Flux 的侧边栏或导航栏组件，`sidebar` 模式可以自然嵌入 Flux 的 `<flux:navlist>` 或 `<flux:sidebar>` 中。发布视图并调整标记以匹配您的导航结构。
:::

## 语言变更后刷新选择器

选择器监听 `refreshLanguages` Livewire 事件。如果您从管理界面（或以编程方式）添加或删除语言，选择器会自动重新渲染，无需页面重载。

```js
// 从任何 Livewire 组件或 Alpine.js 代码中触发：
this.$dispatch('refreshLanguages')
```
