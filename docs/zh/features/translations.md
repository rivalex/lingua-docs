# 翻译管理

翻译页面（`/lingua/translations/{locale?}`）让您可以浏览、过滤和编辑每条翻译字符串。

<Screenshot src="/lingua-docs/screenshots/translations-page.png" alt="Lingua 翻译页面" caption="翻译页面 — 包含语言环境切换器、分组过滤器和内联编辑器。" />

## 浏览翻译

### 语言环境切换器

页面顶部的语言环境标签让您可以在已安装的语言之间切换。URL 会更新为 `/lingua/translations/{locale}`，使每个视图都可以被书签收藏和分享。

**默认语言环境**列始终显示在左侧作为参考——您在右侧编辑所选语言环境。

### 过滤

| 过滤器 | 描述 |
|---|---|
| **搜索** | 在分组名称、键和所有语言环境值中搜索 |
| **分组** | 过滤到特定分组（如 `auth`、`validation`、`single`） |
| **类型** | 按 `text`、`html` 或 `markdown` 过滤 |
| **仅显示缺失** | 仅显示所选语言环境中没有值的字符串 |

<Screenshot src="/lingua-docs/screenshots/translations-filters.png" alt="翻译过滤器" caption="过滤显示 validation 分组中仅缺失的法语翻译。" />

### 分页

结果以可配置的每页数量分页（25 / 50 / 100）。当前页码和每页设置会保存在 URL 查询字符串中。

## 编辑翻译

### 内联编辑

直接点击翻译单元格开始编辑。失去焦点时保存更改（点击其他位置或按 Tab 键）。

- **纯文本**翻译使用简单的 `<textarea>`
- **HTML** 翻译打开 TipTap 富文本编辑器
- **Markdown** 翻译打开 TipTap Markdown 编辑器

<Screenshot src="/lingua-docs/screenshots/translation-editor-html.png" alt="HTML 翻译编辑器" caption="用于富文本翻译的 TipTap HTML 编辑器。" width="512px" :center="true"/>

### 从默认值同步

每行翻译都有一个**从默认值同步**按钮（↺）。点击它会将默认语言环境的值复制到当前语言环境——当您只需要做细微措辞调整时非常有用。

### 编辑模态框

对于默认语言环境，点击铅笔图标打开编辑模态框，在那里您可以更改翻译类型（text / html / markdown）以及值。

::: tip 更改翻译类型
如果您将翻译从 `text` 改为 `html`，行上的内联编辑器会立即切换到 TipTap。存储的值不会改变——只有编辑器会变化。
:::

## 创建翻译

点击**新建翻译**创建自定义条目。填写：

- **分组** — 等效的文件名（如 `marketing`、`emails`）
- **键** — 分组内的键（如 `hero_title`）
- **类型** — `text`、`html` 或 `markdown`
- **值** — 默认语言环境的翻译内容

```
group: marketing
key:   hero_title
type:  text
value: Build faster, together.
```

新键立即可通过 `__('marketing.hero_title')` 访问。

::: warning 扩展包翻译
您不能直接在扩展包分组中创建翻译（如 `validation`、`auth`）。这些分组由 Laravel 或其他扩展包拥有，并自动同步。如果您想覆盖扩展包字符串，请直接在翻译页面上编辑它。
:::

## 删除翻译

### 删除特定语言环境的值

在任何非默认语言环境视图中，删除按钮只会从 JSON 列中移除该语言环境的值。翻译键继续存在；它只是回退到默认语言环境。

### 完全删除

在默认语言环境视图中，删除按钮会从 `language_lines` 中移除整行记录。用于清理代码库中不再使用的键。

::: danger 扩展包翻译保护
扩展包翻译不能被删除。尝试删除会显示警告并触发 `vendor_translation_protected` 事件。您只能**编辑**扩展包翻译的值。
:::

## 复制键到剪贴板

每行都有一个剪贴板图标，点击后会将完整的 `group.key` 引用（如 `auth.failed`）复制到剪贴板——在 Blade 或 PHP 中引用键时非常方便。

## 键盘快捷键

| 按键 | 操作 |
|---|---|
| `Tab` | 保存当前字段并移至下一个 |
| `Shift + Tab` | 保存当前字段并移至上一个 |
| `Escape` | 放弃更改并关闭编辑器 |
