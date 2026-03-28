# 工作原理

了解 Lingua 的内部机制有助于更好地配置、调试和扩展它。

## 请求生命周期

```
Browser request
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware       │  从 session 中读取 'locale'
│  app()->setLocale($locale)  │  回退到数据库默认值
└──────────────┬──────────────┘
               │
    ▼
┌─────────────────────────────┐
│        Your Controller      │
│  __('auth.failed')          │  标准 Laravel 辅助函数
└──────────────┬──────────────┘
               │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  自定义 TranslationLoaderManager
│  1. DB loader (Spatie)      │  数据库在重叠时优先
│  2. File loader (fallback)  │
└──────────────┬──────────────┘
               │
    ▼
Translated string returned
```

## 翻译加载

`LinguaManager` 继承自 Spatie 的 `TranslationLoaderManager`。在运行时，它合并两个来源：

1. **文件加载器** — 像普通 Laravel 一样从 `lang/` 读取
2. **数据库加载器**（Spatie 的 `Db` 加载器）— 从 `language_lines` 读取

当两个来源中存在相同的键时，**数据库中的值优先**。这允许您覆盖任何扩展包或基于文件的翻译，而无需修改源文件。

如果 `language_lines` 表尚不存在（例如在运行迁移之前），`LinguaManager` 会优雅地降级为仅文件模式。

## 中间件

`LinguaMiddleware` 在启动时通过 `LinguaServiceProvider` 自动附加到 `web` 中间件组。它在每个 Web 请求上运行：

```php
// 简化逻辑
$locale = session()->get(config('lingua.session_variable'))
    ?? Language::default()?->code
    ?? config('app.locale');

app()->setLocale($locale);
app()->setFallbackLocale($defaultLocale);
session()->put(config('lingua.session_variable'), $locale);
```

## 服务提供者

`LinguaServiceProvider` 在启动时执行三件事：

1. **在 `lingua::` 前缀下注册 Blade 匿名组件**
2. **在 `lingua::` 命名空间下注册 Livewire 组件**
3. **将 IoC 容器中的 `translator` 和 `translation.loader` 单例替换**为 Lingua 的自定义实现

由于服务提供者替换了核心翻译器绑定，因此它必须在 Laravel 的 `TranslationServiceProvider` *之后*启动。Composer 的自动加载顺序会自动处理这一点。

## 数据库结构

使用两张数据表：

### `languages`

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | bigint（自增） | 主键 |
| `code` | string | ISO 639-1 代码（`en`、`fr`、`pt_BR`） |
| `regional` | string，可为空 | 完整区域代码（`en_US`、`pt_BR`） |
| `type` | string | `'regional'` 或 `'standard'` |
| `name` | string | 英文显示名称（`French`） |
| `native` | string | 本地名称（`Français`） |
| `direction` | string | `'ltr'` 或 `'rtl'` |
| `is_default` | boolean | 只有一行应为 `true` |
| `sort` | integer | 显示顺序（自动分配） |

### `language_lines`（Spatie）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | bigint（自增） | 主键 |
| `group` | string | 翻译分组（`auth`、`validation`、`single`） |
| `key` | string | 翻译键（`failed`、`required`） |
| `text` | json | `{"en": "…", "fr": "…", "it": "…"}` |
| `type` | string | `'text'`、`'html'` 或 `'markdown'` |
| `is_vendor` | boolean | 第三方扩展包字符串为 `true` |
| `vendor` | string，可为空 | 扩展包名称（如 `spatie`、`laravel`） |

JSON `text` 列在**单行中存储所有语言环境**。这种设计意味着：
- 添加新语言环境不会改变数据库结构
- 单次查询即可获取一个键的所有语言环境值
- 缺失的语言环境只是在 JSON 对象中没有对应的键

## 数据填充器

`LinguaSeeder` 在 `lingua:install` 期间被调用一次。它：

1. 读取 `config('lingua.default_locale')`（默认为 `config('app.locale')`）
2. 从 `laravel-lang/locales` 获取语言环境元数据
3. 创建一个 `is_default = true` 的 `Language` 记录
4. 调用 `lingua:add {locale}` 安装语言文件
5. 调用 `lingua:sync-to-database` 导入所有字符串

## 模型

| 模型 | 数据表 | 继承自 |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | Spatie 的 `LanguageLine` |

`Translation` 继承了 Spatie 的 `setTranslation()` 和 `forgetTranslation()` 方法，并添加了 Lingua 专有的作用域、同步方法和统计辅助函数。
