# RTL / LTR 支持

Lingua 为每种已安装的语言存储文本方向（`ltr` 或 `rtl`），并通过 `Lingua::getDirection()` 提供访问。在 Blade 布局中做一次性修改即可支持 RTL 语言。

## 支持的 RTL 语言（示例）

| 语言 | 代码 | 方向 |
|---|---|---|
| 阿拉伯语 | `ar` | `rtl` |
| 希伯来语 | `he` | `rtl` |
| 波斯语（法尔西语） | `fa` | `rtl` |
| 乌尔都语 | `ur` | `rtl` |
| 迪维希语 | `dv` | `rtl` |
| 信德语 | `sd` | `rtl` |

`LocaleRegistry` 中注册的 129+ 个语言区域均包含正确的方向元数据。

## Blade 布局设置

在主 Blade 布局中将 `dir` 和 `lang` 属性设置在 `<html>` 标签上：

```blade
<html
    lang="{{ app()->getLocale() }}"
    dir="{{ Lingua::getDirection() }}"
>
```

`Lingua::getDirection()` 返回当前活动语言区域的 `'ltr'` 或 `'rtl'`。当无法确定方向时（语言区域未安装）默认返回 `'ltr'`。

## Tailwind CSS RTL 变体

Tailwind CSS v3+ 通过 `rtl:` 变体原生支持 RTL 布局。在 `<html dir="rtl">` 时 `rtl:` 前缀的工具类会自动生效：

```html
<div class="ml-4 rtl:mr-4 rtl:ml-0">
    <!-- LTR: 左边距 | RTL: 右边距 -->
</div>

<div class="text-left rtl:text-right">
    <!-- 文本对齐随方向自动翻转 -->
</div>

<div class="flex-row rtl:flex-row-reverse">
    <!-- 弹性布局方向随方向自动翻转 -->
</div>
```

在 `tailwind.config.js` 中确认已启用 RTL 支持（Tailwind v3 默认启用）：

```js
// tailwind.config.js
module.exports = {
    // RTL 支持内置，无需额外配置
};
```

## CSS 逻辑属性

现代 CSS 逻辑属性会根据文档方向自动调整，无需 `rtl:` 变体：

```css
/* 物理属性（需要 rtl: 变体） */
margin-left: 1rem;
padding-right: 1rem;
text-align: left;

/* 逻辑属性（自动感知方向） */
margin-inline-start: 1rem;
padding-inline-end: 1rem;
text-align: start;
```

Tailwind 的逻辑属性工具类（`ms-`、`me-`、`ps-`、`pe-` 等）默认可用：

```html
<div class="ms-4 pe-2">
    <!-- ms- = margin-inline-start (LTR: 左, RTL: 右) -->
    <!-- pe- = padding-inline-end (LTR: 右, RTL: 左) -->
</div>
```

## 检查方向

```php
use Rivalex\Lingua\Facades\Lingua;

// 当前活动语言区域的方向
$direction = Lingua::getDirection();       // 'ltr' 或 'rtl'

// 特定语言区域的方向
$info = Lingua::info('ar');
if ($info !== null) {
    $info->direction;  // 'rtl'
}

// 检查是否为 RTL
$isRtl = Lingua::getDirection() === 'rtl';
```

## 动态方向切换

当用户切换语言区域时，页面会完整重新加载（不使用 SPA 导航），因此 `<html dir="...">` 属性会在新请求中由 Blade 布局自动更新，无需 JavaScript 干预。
