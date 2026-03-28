# Blade 组件

Lingua 在 `lingua::` 前缀下注册了几个匿名 Blade 组件。这些组件在 Livewire 视图中内部使用，也可以在您自己的模板中复用。

## `<x-lingua::editor>`

一个多态编辑器组件，根据 `type` 属性渲染 `<textarea>`、TipTap HTML 编辑器或 TipTap Markdown 编辑器。

```blade
{{-- 纯文本 --}}
<x-lingua::editor
    wire:model="value"
    type="text"
    placeholder="Enter text…"
/>

{{-- HTML --}}
<x-lingua::editor
    wire:model="value"
    type="html"
    label="Body content"
    :required="true"
/>

{{-- Markdown --}}
<x-lingua::editor
    wire:model="value"
    type="markdown"
    placeholder="Write in Markdown…"
/>
```

### 属性

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`、`'html'` 或 `'markdown'` |
| `label` | string | `''` | 字段上方的可选标签 |
| `placeholder` | string | `''` | 占位符文本 |
| `required` | bool | `false` | 显示必填标记 |
| `wire:model` | — | — | Livewire 模型绑定 |

---

## `<x-lingua::clipboard>`

一个在其插槽内容周围添加复制到剪贴板按钮的包装器组件。

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

点击组件会将 `text-to-copy` 复制到剪贴板，并短暂显示一个对勾图标。

### 属性

| 属性 | 类型 | 描述 |
|---|---|---|
| `text-to-copy` | string | 要复制到剪贴板的文本 |
| `show-tooltip` | bool | 悬停时显示提示（默认：`false`） |

---

## `<x-lingua::language-flag>`

为给定语言环境渲染国旗图标和语言名称。

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

### 属性

| 属性 | 类型 | 描述 |
|---|---|---|
| `name` | string | 英文语言名称 |
| `code` | string | 用于国旗查找的语言环境代码 |
| `description` | string | 本地语言名称（副标题） |

使用 `outhebox/blade-flags` 获取国旗 SVG。如果代码对应的国旗不可用，会优雅地降级为显示代码文本。

---

## `<x-lingua::message>`

一个短暂消息组件，在 Livewire 事件触发后短暂显示一段时间。

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

### 属性

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `on` | string | — | 要监听的 Livewire 事件名称 |
| `delay` | int | `1500` | 隐藏前的持续时间（毫秒） |

---

## `<x-lingua::autocomplete>`

一个在翻译创建表单中使用的自动补全文本输入组件。

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="e.g. marketing"
/>
```

### 属性

| 属性 | 类型 | 描述 |
|---|---|---|
| `wire:model` | — | Livewire 模型绑定 |
| `suggestions` | array | 自动补全建议数组 |
| `placeholder` | string | 输入占位符 |

---

## `<x-lingua::menu-group>`

一个用于侧边栏菜单的导航分组组件。

```blade
<x-lingua::menu-group heading="Languages">
    {{-- 菜单项插槽 --}}
</x-lingua::menu-group>
```

### 属性

| 属性 | 类型 | 描述 |
|---|---|---|
| `heading` | string | 分组标题文本 |

---

## 自定义组件

发布所有组件视图以覆盖它们：

```bash
php artisan vendor:publish --tag="lingua-views"
```

已发布的视图位于 `resources/views/vendor/lingua/components/`。Laravel 会自动使用您发布的版本。
