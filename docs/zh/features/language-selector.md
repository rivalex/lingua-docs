# 语言选择器

`<livewire:lingua::language-selector>` 组件是一个可嵌入的语言切换器，供终端用户使用--与后台管理界面完全分离。

## 基本用法

```blade
<livewire:lingua::language-selector />
```

将其添加到您的任意 Blade 布局中。它使用 `config/lingua.php` 中配置的模式渲染（默认为 `sidebar`）。

## 显示模式

### 侧边栏模式（默认）

渲染为分组导航区块--非常适合基于 Flux 构建的应用侧边栏。

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/screenshots/selector-sidebar.png" alt="侧边栏模式的语言选择器" caption="侧边栏模式 - 将所有已安装语言显示为导航项。" width="320px" :center="true"/>

### 下拉菜单模式

渲染为紧凑的下拉按钮--非常适合页头和导航栏。

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/screenshots/selector-dropdown.png" alt="下拉菜单模式的语言选择器" caption="下拉菜单模式 - 显示带有国旗图标的当前语言。" width="320px" :center="true"/>

### 模态框模式

渲染为打开完整语言选择模态框的按钮--非常适合落地页或引导流程中的突出语言切换。

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/screenshots/selector-modal.png" alt="模态框模式的语言选择器" caption="模态框模式 - 全屏语言选择覆盖层。"/>

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

---

## Headless 模式

Headless 选择器不生成任何 CSS 或框架标记——纯粹的语义化 HTML，带有 `data-lingua-*` 属性，完全由你自己的 CSS、Tailwind 或任何其他方式来样式化。

当你需要语言切换逻辑但希望完全控制视觉输出时，请使用 headless 模式。

### 基本用法

```blade
<livewire:lingua::headless-language-selector />
```

语言列表始终存在于 DOM 中。可见性由你负责——使用 CSS `display`、Alpine.js `x-show` 或任何其他机制。设计上不提供内置触发按钮。

通过配置文件或设置页面全局启用 headless 模式：

```php
// config/lingua.php
'selector' => ['mode' => 'headless'],
```

### 具名插槽

#### `$item` 插槽

替换每个语言 `<li>` 内部的默认 `<button>` 标记。接收 `Language` 模型实例：

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        {{ $language->native }} ({{ $language->code }})
    </x-slot>
</livewire:lingua::headless-language-selector>
```

#### `$current` 插槽

仅替换**当前选中**语言的渲染。如未提供则回退到 `$item`：

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:current="language">
        <strong>{{ $language->native }}</strong>
    </x-slot>
    <x-slot:item="language">
        {{ $language->native }}
    </x-slot>
</livewire:lingua::headless-language-selector>
```

### CSS 定位 API

组件在每个元素上公开 `data-lingua-*` 属性，用于 CSS 和 JavaScript 定位：

| 属性 | 元素 |
|---|---|
| `data-lingua-selector` | 根 `<nav>` 元素 |
| `data-lingua-list` | `<ul>` 语言列表 |
| `data-lingua-item` | 每个语言 `<li>` 条目 |
| `data-lingua-active` | 当前活动语言的 `<li>` |
| `data-lingua-button` | 每个 `<li>` 内的 `<button>` |
| `data-lingua-name` | 语言英文名称 `<span>` |
| `data-lingua-native` | 语言本地名称 `<span>` |
| `data-lingua-code` | 语言 ISO 代码 `<span>` |

### 样式示例

**纯 CSS：**

```css
[data-lingua-selector] {
    display: flex;
    gap: 0.5rem;
    list-style: none;
}
[data-lingua-item] {
    cursor: pointer;
}
[data-lingua-active] {
    font-weight: bold;
    text-decoration: underline;
}
[data-lingua-button] {
    background: none;
    border: none;
    padding: 0.25rem 0.5rem;
}
```

**Tailwind CSS：**

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        <span class="px-3 py-1 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            {{ $language->native }}
        </span>
    </x-slot>
    <x-slot:current="language">
        <span class="px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900 font-semibold text-red-700 dark:text-red-300">
            {{ $language->native }}
        </span>
    </x-slot>
</livewire:lingua::headless-language-selector>
```

**Alpine.js 可见性切换：**

```blade
<div x-data="{ open: false }">
    <button @click="open = !open">
        {{ app()->getLocale() }}
    </button>

    <div x-show="open" @click.outside="open = false">
        <livewire:lingua::headless-language-selector>
            <x-slot:item="language">
                <button class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                    {{ $language->native }}
                </button>
            </x-slot>
        </livewire:lingua::headless-language-selector>
    </div>
</div>
```

### Props 参考（已更新）

| Prop | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`、`'dropdown'`、`'modal'` 或 `'headless'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | 显示国旗图标 |

::: tip
当 `mode="headless"` 传递给 `<livewire:lingua::language-selector />` 时，该组件不渲染任何内容。请直接使用 `<livewire:lingua::headless-language-selector />` 以获得完整的插槽和属性支持。
:::
