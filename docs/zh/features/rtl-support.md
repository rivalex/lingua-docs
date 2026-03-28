# RTL / LTR 支持

Lingua 为每种已安装的语言存储文本方向（`ltr` 或 `rtl`），并通过 `Lingua::getDirection()` 提供访问。设置正确的 RTL 支持只需对您的 Blade 布局做一次性的小改动。

## 支持的 RTL 语言（示例）

| 语言环境 | 语言 | 方向 |
|---|---|---|
| `ar` | 阿拉伯语 | `rtl` |
| `he` | 希伯来语 | `rtl` |
| `fa` | 波斯语（法尔西语） | `rtl` |
| `ur` | 乌尔都语 | `rtl` |
| `ps` | 普什图语 | `rtl` |
| `ug` | 维吾尔语 | `rtl` |

所有其他语言环境（包括欧洲语言、亚洲语言和大多数拉丁字母语言）返回 `ltr`。

## 设置您的 Blade 布局

在主布局文件的 `<html>` 标签上添加 `lang` 和 `dir` 属性：

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` 自动使用当前应用语言环境，因此无需任何额外代码即可跟随每次语言切换。

::: tip 为什么同时需要 `lang` 和 `dir`？
- `lang` 告知浏览器和屏幕阅读器使用哪种语言进行发音、断字和拼写检查。
- `dir` 告知浏览器、CSS 和布局引擎文本的流向。两者都是完整无障碍访问合规（WCAG 2.1 AA）所必需的。
:::

## 显式语言环境

当您需要在当前请求上下文之外获取方向时，传入显式语言环境：

```blade
{{-- 例如，在按语言划分的电子邮件模板中 --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
// 在 PHP 上下文中
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

当 `<html>` 上设置了 `dir` 后，Tailwind 内置的 `rtl:` 变体可以自动工作--无需插件或额外配置：

```html
<!-- 翻转文字对齐 -->
<p class="text-left rtl:text-right">Content</p>

<!-- 翻转内边距 -->
<div class="pl-4 rtl:pr-4 rtl:pl-0">Sidebar item</div>

<!-- 翻转图标位置 -->
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Label</span>
</div>

<!-- 翻转边框 -->
<div class="border-l-4 rtl:border-r-4 rtl:border-l-0 border-blue-500">
    Highlighted content
</div>
```

## CSS 逻辑属性（推荐）

对于新的布局或组件，优先使用 **CSS 逻辑属性**而非方向性属性。浏览器会自动处理 LTR/RTL 翻转：

```css
/* ❌ 方向性 - 需要 RTL 覆盖 */
.card {
    padding-left: 1rem;
    border-left: 2px solid blue;
    margin-right: auto;
}

/* ✅ 逻辑属性 - 自动适配两种方向 */
.card {
    padding-inline-start: 1rem;   /* LTR 时为 left，RTL 时为 right */
    border-inline-start: 2px solid blue;
    margin-inline-end: auto;
}
```

关键逻辑属性对照表：

| 方向性属性 | 逻辑属性等效 |
|---|---|
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |
| `left: 0` | `inset-inline-start: 0` |
| `text-align: left` | `text-align: start` |
| `float: left` | `float: inline-start` |

## 在 Blade 中检查方向

```blade
@if (Lingua::getDirection() === 'rtl')
    {{-- RTL 专用标记 --}}
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

## 在 PHP 中检查方向

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // 当前语言环境
$direction = Lingua::getDirection('ar');   // 显式语言环境

if ($direction === 'rtl') {
    // RTL 专用逻辑
}
```

## 字体注意事项

许多 RTL 语言需要特定字体。阿拉伯语和希伯来语在大多数拉丁网络字体下渲染效果较差。考虑根据条件加载合适的字体：

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans Arabic', sans-serif; }
    </style>
@endif
```

## 安全回退

`Lingua::getDirection()` 在数据库中找不到语言环境时始终返回 `'ltr'` 作为回退--它不会抛出异常。在请求生命周期的任何时间点调用都是安全的，包括在语言表填充之前。
