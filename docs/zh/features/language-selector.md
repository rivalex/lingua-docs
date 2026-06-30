# 语言选择器

`<livewire:lingua::language-selector>` 组件是嵌入在用户界面中的语言切换器，供终端用户使用——与后台管理界面完全分离。

## 基本用法

```blade
{{-- 默认模式（使用 config/lingua.php 中的 selector.mode）--}}
<livewire:lingua::language-selector />

{{-- 覆盖模式 --}}
<livewire:lingua::language-selector mode="dropdown" />
<livewire:lingua::language-selector mode="modal" />
<livewire:lingua::language-selector mode="sidebar" />
<livewire:lingua::language-selector mode="headless" />
```

## 模式

| 模式 | 描述 |
|---|---|
| `sidebar` | 将已安装语言渲染为侧边栏分组中的导航链接列表（默认） |
| `dropdown` | 渲染为紧凑的下拉按钮，适合导航栏 |
| `modal` | 渲染为打开弹窗的按钮，弹窗中显示语言网格 |
| `headless` | 不渲染任何内置 UI——通过 Livewire 事件/属性暴露数据 |

全局默认模式通过 `config/lingua.php` 中的 `selector.mode` 设置，也可通过设置页面更改。

## Props

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | 覆盖渲染模式 |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | 显示/隐藏国旗图标 |

## 语言区域切换工作原理

用户选择语言区域后：

1. Livewire 组件向服务器发送 `switchLocale(string $locale)` 请求
2. `ManagesLocale` trait 验证该语言区域已安装
3. 将语言区域写入 Session（`session_variable` 键）
4. 重定向到**当前页面**（使用 `getRequestUri()`），**不**重定向到主页
5. `LinguaMiddleware` 在下一个请求中读取新的 Session 值并调用 `app()->setLocale()`

::: tip 开放重定向防护
重定向 URL 从 `REQUEST_URI` 中提取，并通过 `parse_url` 验证为本地路径（以 `/` 开头），以防止重定向到外部站点。参见[安全参考](/zh/guide/security#open-redirect-protection)。
:::

## `x-lingua::select` 组件

`x-lingua::select` 是一个轻量级的 Blade 匿名组件，内部使用**原生 Popover API**（`popover="manual"`）实现下拉弹出层，用于 `dropdown` 和 `modal` 模式中的语言选择菜单。

使用原生 Popover API 的原因：它能逃脱 Flux Dialog 的 `overflow: hidden` 和 CSS `transform` 裁剪，而无需使用 JavaScript 定位或 `<teleport>`。

```blade
<x-lingua::select :languages="$languages" :current="$currentLocale" />
```

| Prop | 类型 | 说明 |
|---|---|---|
| `languages` | `Collection` | 已安装语言的集合 |
| `current` | `string` | 当前活动语言区域代码 |

## 无头模式

无头模式适用于需要完全自定义 UI 的场景：

```blade
<livewire:lingua::language-selector mode="headless">
    @foreach ($languages as $language)
        <button wire:click="switchLocale('{{ $language->code }}')">
            {{ $language->native }}
        </button>
    @endforeach
</livewire:lingua::language-selector>
```

在无头模式下，组件不渲染任何内置 HTML，但仍然处理语言区域切换逻辑。

## 在布局中使用

在主 Blade 布局中添加语言选择器，并在 `<html>` 标签上设置 `lang` 和 `dir` 属性：

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>...</head>
<body>
    <nav>
        {{-- 导航栏下拉 --}}
        <livewire:lingua::language-selector mode="dropdown" />
    </nav>

    {{-- 或在侧边栏中 --}}
    <aside>
        <livewire:lingua::language-selector mode="sidebar" />
    </aside>

    {{ $slot }}
</body>
</html>
```
