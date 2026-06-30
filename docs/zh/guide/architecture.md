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
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│        Your Controller      │
│  __('auth.failed')          │  标准 Laravel 助手
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  扩展 Illuminate FileLoader
│  DB translations merged over │  DB 在重叠时始终优先
│  file translations (DB mode) │  （文件模式 = 纯 FileLoader）
└───┬─────────────────────────┘
    │
    ▼
Translated string returned
```

## 翻译加载

`LinguaManager` 扩展了 Laravel 自身的 `Illuminate\Translation\FileLoader`——**没有** Spatie 依赖。它通过装饰框架的加载器绑定来注册：

```php
$app->extend('translation.loader', function ($original, $app) {
    return new LinguaManager($app, $original);
});
```

在**数据库模式**下，对于每个 `(locale, group)`，它通过原始加载器加载基于文件的翻译，然后使用 `array_replace_recursive` 在其上合并数据库值。**数据库值始终优先**，因此您可以覆盖任何供应商或文件字符串而无需修改源文件。

如果 `language_lines` 表尚不存在（例如在迁移运行之前），`QueryException` 会被捕获，`LinguaManager` 会优雅地回退到仅文件模式。

在**文件模式**下，`LinguaManager` 的行为与标准 `FileLoader` 相同——不进行任何数据库查询。参见[存储驱动](/zh/guide/storage)。

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

`LinguaServiceProvider` 在启动时执行以下操作：

1. **在 `lingua::` 前缀下注册 Blade 匿名组件**
2. **在 `lingua::` 命名空间下注册 Livewire 组件**
3. **通过 `$app->extend(...)` 装饰 `translation.loader` 绑定**，用 `LinguaManager` 包装 Laravel 的加载器

因为提供者*装饰*而不是*替换*核心加载器，它与 Laravel 的 `TranslationServiceProvider` 完美组合。Composer 的自动加载顺序自动处理启动顺序。

## 数据库架构

使用三张表（`file` 驱动省略 `language_lines`）：

### `languages`

| 列 | 类型 | 说明 |
|---|---|---|
| `id` | bigint | 主键 |
| `code` | string | ISO 639-1 代码（`en`、`fr`、`pt_BR`） |
| `regional` | string，可为空 | 完整区域代码（`en_US`、`pt_BR`） |
| `type` | string | `'regional'` 或 `'standard'` |
| `name` | string | 英文显示名称（`French`） |
| `native` | string | 本地名称（`Français`） |
| `direction` | string | `'ltr'` 或 `'rtl'` |
| `is_default` | boolean | 只有一行应为 `true` |
| `sort` | integer | 显示顺序（自动分配） |

### `language_lines`

| 列 | 类型 | 说明 |
|---|---|---|
| `id` | bigint | 主键 |
| `group` | string | 翻译分组（`auth`、`validation`、`single`） |
| `key` | string | 翻译键（`failed`、`required`） |
| `text` | json，**可为空** | `{"en": "…", "fr": "…"}` |
| `type` | string | `'text'`、`'html'` 或 `'markdown'` |
| `is_vendor` | boolean | 第三方包字符串为 `true` |
| `vendor` | string，可为空 | 供应商名称（例如 `laravel`） |

JSON `text` 列在**单行中存储所有语言区域**：

- 添加新语言区域永远不会改变架构
- 单次查询即可获取一个键的所有语言区域值
- 缺失的语言区域只是在 JSON 对象中没有对应的键

### `lingua_settings`

支持设置 UI 的键/值表（例如共享导航切换）。

## 内置数据集

Lingua 2.0 将所有语言区域数据随包一起发布：

- **`LocaleRegistry`**（`Rivalex\Lingua\Locales\LocaleRegistry`）——129+ 个语言区域的元数据。`Lingua::info($locale)` 返回一个只读的 `LocaleInfo` 值对象（`->name`、`->native`、`->direction`、`->regional`、`->code`、`->type`），对于未知语言区域返回 `null`。
- **内置翻译**——26 个语言区域 × 7 个分组，5902 个字符串，与 Laravel **v13.14.0** 对齐。`NotificationProjector` 推导通知字符串。`lingua:add` 从此数据集填充，无需网络调用。

## 缓存架构

在数据库模式下，Lingua 按 `(locale, group)` **精确**缓存翻译：

- 键格式如 `lingua.trans.{locale}.{group}`
- 在 `Translation` 保存/删除时，只运行受影响键的 `Cache::forget('lingua.trans.{locale}.{group}')`——任何同步路径中都**不**存在全局 `cache:clear`
- 存储和前缀可通过 `cache.store` / `cache.prefix` 配置

## 模型

| 模型 | 表 | 继承自 |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `Illuminate\Database\Eloquent\Model` |

`Translation` 提供 `getTranslationsForGroup()`、同步助手、统计助手和 `forgetTranslation()`——对供应商行会抛出 `VendorTranslationProtectedException`。`scopeOrdered()` 查询作用域替换了旧的 `scopeActive()`（保留委托以向后兼容）。
