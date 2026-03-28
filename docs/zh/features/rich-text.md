# 富文本编辑器

Lingua 内嵌了 [TipTap 3](https://tiptap.dev) 作为 HTML 和 Markdown 翻译类型的可选富文本编辑器。正确的编辑器会根据翻译的 `type` 列自动激活。

## 翻译类型

| 类型 | 编辑器 | 描述 |
|---|---|---|
| `text` | 纯 `<textarea>` | 所有标准翻译的默认选择 |
| `html` | TipTap 所见即所得 | 应以 HTML 格式渲染的内容 |
| `markdown` | TipTap Markdown | 以 Markdown 语法编写的内容 |

## 配置工具栏

编辑器工具栏通过 `config/lingua.php` 全局控制：

```php
'editor' => [
    'headings'      => false,  // H1-H3 标题按钮
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'bullet'        => true,   // 无序列表
    'ordered'       => true,   // 有序列表
    'clear'         => true,   // 清除格式
],
```

只启用您内容实际需要的选项。保持工具栏简洁可以减少翻译人员的认知负担。

<Screenshot src="/lingua-docs/screenshots/editor-toolbar.png" alt="编辑器工具栏" caption="默认选项激活的 HTML 编辑器工具栏。" />

## 更改翻译的类型

在编辑模态框中（铅笔图标，仅限默认语言环境），从**类型**下拉菜单中选择所需类型。编辑器会在不重载页面的情况下立即在该行上更新。

::: tip 自动检测
首次运行 `lingua:sync-to-database` 时，Lingua 会根据内容自动检测类型。您可以随时手动覆盖它——更改类型时存储的值不会改变，只有编辑器行为会变化。
:::

## 使用 HTML 翻译

HTML 翻译以原始 HTML 形式存储在 `text` JSON 列中：

```json
{"en": "<p>Welcome to <strong>Lingua</strong> — the translation manager for Laravel.</p>"}
```

在 Blade 中渲染时避免双重转义：

```blade
{{-- HTML 翻译类型始终使用 {!! !!} --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS 安全
只对由授权用户在受控后台管理面板中管理的翻译字符串使用 `{!! !!}`。切勿将不受信任的用户输入渲染为原始 HTML。
:::

## 使用 Markdown 翻译

Markdown 翻译存储原始 Markdown：

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**.\n\n- Feature one\n- Feature two"}
```

要在 Blade 中渲染 Markdown，使用 Markdown 解析器。Laravel 内置 `Str::markdown()`：

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

或使用专用扩展包，如 [league/commonmark](https://commonmark.thephpleague.com)。

## `x-lingua::editor` 组件

编辑器作为 Blade 组件暴露，可在 Lingua 管理界面之外复用：

```blade
{{-- 文本模式 --}}
<x-lingua::editor
    wire:model="myField"
    type="text"
    placeholder="Enter text…"
/>

{{-- HTML 模式 --}}
<x-lingua::editor
    wire:model="myField"
    type="html"
    label="Body content"
    :required="true"
/>

{{-- Markdown 模式 --}}
<x-lingua::editor
    wire:model="myField"
    type="markdown"
    placeholder="Write in Markdown…"
/>
```

### 属性

| 属性 | 类型 | 描述 |
|---|---|---|
| `wire:model` | string | 绑定的 Livewire 属性 |
| `type` | string | `'text'`、`'html'` 或 `'markdown'` |
| `label` | string | 编辑器上方的可选标签 |
| `placeholder` | string | 占位符文本 |
| `required` | bool | 为 `true` 时显示必填标记 |

::: tip
`x-lingua::editor` 组件是任何需要富文本字段的 Livewire 表单的绝佳起点。发布组件视图以自定义工具栏或样式。
:::
