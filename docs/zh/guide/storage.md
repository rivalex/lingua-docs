# 翻译存储

了解翻译的存储方式有助于您正确地查询、导入和导出翻译内容。

## `language_lines` 表

`language_lines` 中的每一行代表一个可翻译的**字符串**--而不是一个语言环境。所有语言环境的值存储在单个 JSON `text` 列中：

```
group      | key        | type | text
-----------|------------|------|---------------------------------------------------
validation | required   | text | {"en":"The :attribute field is required.","fr":"Le champ :attribute est obligatoire."}
auth       | failed     | text | {"en":"These credentials do not match.","it":"Le credenziali non corrispondono."}
single     | Welcome    | text | {"en":"Welcome","fr":"Bienvenue","de":"Willkommen"}
emails     | subject    | html | {"en":"<b>Welcome</b> to our platform!"}
```

### 这种设计的优势

- **每个字符串一行** - 无需管理每个语言环境的单独行
- **添加语言环境是非破坏性的** - 只需在 JSON 对象中添加新键
- **缺失翻译是显式的** - 如果 `fr` 不在 JSON 中，则该字符串尚未翻译
- **单次查询** - 一条 `SELECT` 语句即可获取一个键的所有语言环境值

### 直接查询

您可以使用标准 Eloquent JSON 列语法查询 `language_lines`：

```php
use Rivalex\Lingua\Models\Translation;

// 所有具有法语值的翻译
Translation::whereNotNull('text->fr')->get();

// 仅缺失的法语翻译
Translation::whereNull('text->fr')->get();

// 查找特定键
Translation::where('key', 'required')->where('group', 'validation')->first();

// 某个分组中的所有字符串
Translation::where('group', 'auth')->get();
```

## 翻译类型

每条翻译记录都有一个 `type`，决定界面中使用的编辑器：

| 类型 | 使用场景 | 同步时自动检测 |
|---|---|---|
| `text` | 纯标签、消息、按钮文本 | 默认 |
| `html` | 包含 HTML 标签的富内容 | 字符串包含 HTML 元素 |
| `markdown` | Markdown 格式的内容 | 字符串可以解析为 Markdown |

类型检测在 `lingua:sync-to-database` 期间执行。您可以随时通过界面中的编辑模态框更改类型。

### 示例：HTML 翻译

```php
Translation::create([
    'group' => 'marketing',
    'key'   => 'hero_subtitle',
    'type'  => 'html',
    'text'  => ['en' => '<strong>Build faster</strong> with fewer tools.'],
]);
```

### 示例：Markdown 翻译

```php
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_body',
    'type'  => 'markdown',
    'text'  => ['en' => "# Welcome!\n\nThank you for signing up.\n\n**Your account is now active.**"],
]);
```

## 翻译键

Lingua 使用与标准 Laravel 翻译相同的 `group.key` 二段式约定：

| 格式 | 示例 | `trans()` 调用 |
|---|---|---|
| PHP 文件键 | `auth.failed` | `__('auth.failed')` |
| JSON / 单键 | `Welcome` | `__('Welcome')` |
| 扩展包键 | `spatie::messages.error` | 通过 vendor 命名空间 |

::: tip group 与 key 的区别
`group` 列对应文件名（`auth` = `lang/en/auth.php`），`key` 对应该文件中的数组键。对于 JSON 文件，group 为 `'single'`。
:::

## 扩展包翻译

扩展包翻译使用 `is_vendor = true` 标记，并携带 `vendor` 字符串（例如 `'spatie'`、`'laravel'`）。它们从 `lang/vendor/{vendor}/{locale}/` 目录同步而来。

- 它们**可以在界面中编辑**（用于覆盖扩展包的原始措辞）
- 它们**不能被删除** - 尝试删除会触发 `vendor_translation_protected` 事件
- **编辑模态框中的** `group` 和 `key` 字段被**锁定**

详情请参阅[扩展包翻译](/zh/features/vendor-translations)。
