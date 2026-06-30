# 富文本编辑器

Lingua 内嵌了 [TipTap 3](https://tiptap.dev) 作为 HTML 和 Markdown 翻译类型的可选富文本编辑器。正确的编辑器会根据翻译的 `type` 列自动激活。

::: tip 仅数据库驱动
富文本翻译类型（`html` 和 `markdown`）仅在数据库驱动模式下可用。文件驱动模式下所有翻译均为纯 `text` 类型。
:::

## 翻译类型

| 类型 | 编辑器 | 存储格式 | 渲染方式 |
|---|---|---|---|
| `text` | 纯文本输入框 | 原始字符串 | <code v-pre>{{ __('key') }}</code> |
| `html` | TipTap 富文本编辑器 | HTML 字符串 | `{!! __('key') !!}` |
| `markdown` | TipTap Markdown 编辑器 + 预览 | Markdown 字符串 | 通过 Markdown 解析器渲染 |

## 工具栏配置

在 `config/lingua.php` 中配置编辑器工具栏的可用按钮：

```php
'editor' => [
    'headings'      => false,
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'subscript'     => true,
    'superscript'   => true,
    'blockquote'    => false,
    'code-line'     => false,
    'code-block'    => false,
    'bullet'        => true,
    'ordered'       => true,
    'clear'         => true,
    'code-mode'     => false,
],
```

将选项设置为 `false` 可在工具栏中隐藏对应按钮，并禁止该格式的使用。

## 更改翻译类型

在翻译列表中，点击翻译行的类型标识（`text`/`html`/`md`）可以更改该翻译的类型：

1. 点击类型标识打开类型选择器
2. 选择新类型
3. 确认更改

::: warning 更改类型不转换内容
从 `text` 改为 `html` 不会自动将文本内容转换为 HTML。请在更改类型后检查并更新内容。
:::

## 渲染 HTML 翻译

HTML 类型的翻译在 Blade 模板中必须使用非转义输出：

```blade
{{-- 错误：会将 HTML 标签显示为文本 --}}
{{ __('emails.welcome_body') }}

{{-- 正确：渲染 HTML --}}
{!! __('emails.welcome_body') !!}
```

::: danger XSS 安全提示
只有当翻译内容由受信任的管理员编辑时，才使用 `{!! !!}` 输出。如果允许用户输入作为翻译内容，必须先对 HTML 进行清理（Lingua 使用 HTMLPurifier 或白名单属性过滤来保护 `html` 类型翻译）。
:::

## 渲染 Markdown 翻译

Markdown 翻译需要在应用中安装 Markdown 解析器（例如 `league/commonmark`）并手动渲染：

```php
use League\CommonMark\CommonMarkConverter;

$converter = new CommonMarkConverter();
$html = $converter->convert(__('articles.intro'))->getContent();
```

或者在 Blade 中：

```blade
@php
    $converter = new \League\CommonMark\CommonMarkConverter();
@endphp

{!! $converter->convert(__('articles.intro'))->getContent() !!}
```

## `x-lingua::editor` 组件

`x-lingua::editor` 是一个独立的 Blade 组件，可在 Lingua 管理 UI 之外的自定义表单中使用 TipTap 编辑器：

```blade
<x-lingua::editor
    name="content"
    :value="$model->content"
    type="html"
    :toolbar="config('lingua.editor')"
/>
```

| Prop | 类型 | 说明 |
|---|---|---|
| `name` | `string` | 表单字段名称 |
| `value` | `string` | 初始内容 |
| `type` | `string` | `'html'` 或 `'markdown'` |
| `toolbar` | `array` | 工具栏配置（参见上方） |
