# 供应商翻译

供应商翻译是属于第三方扩展包的翻译字符串——Laravel 自身的验证消息、分页标签、密码重置字符串，以及其他附带 `lang/` 目录的扩展包的翻译。

## 如何识别

在数据库中，供应商翻译行的 `is_vendor = true`，`vendor` 列存储了供应商名称（例如 `laravel`）。

在翻译 UI 中，供应商行以不同样式显示，并在操作区域显示锁定图标，表示无法删除。

```sql
-- 所有 Laravel 核心供应商翻译
SELECT * FROM language_lines WHERE is_vendor = true AND vendor = 'laravel';
```

## 允许的操作

| 操作 | 是否允许 | 说明 |
|---|---|---|
| **覆盖值** | 是 | 可以为供应商键提供自定义翻译值 |
| **添加语言区域** | 是 | 可以为供应商键添加新语言区域的翻译 |
| **删除行** | **否** | `VendorTranslationProtectedException` |
| **导入覆盖** | 否（跳过） | 导入时供应商行被标记为跳过 |

## 覆盖供应商翻译

覆盖供应商翻译是完全支持的用例：

```php
// 在翻译 UI 中内联编辑
// 或通过 Facade 以编程方式设置
use Rivalex\Lingua\Facades\Lingua;

Lingua::setTranslation('validation.required', '此字段不能为空。', 'zh');
```

覆盖值存储在同一行的 `text` JSON 列中，在运行时优先于文件中的供应商默认值。

## 查询供应商翻译

```php
use Rivalex\Lingua\Models\Translation;
use Rivalex\Lingua\Facades\Lingua;

// 通过 Eloquent 查询
$vendorRows = Translation::where('is_vendor', true)
    ->where('vendor', 'laravel')
    ->get();

// 通过 Facade
$vendorTranslations = Lingua::getVendorTranslations('laravel', 'en');
```

## 保护机制

`VendorTranslationProtectedException` 由以下操作触发：

```php
// 1. Translation 模型上的 forgetTranslation() 方法
$translation->forgetTranslation(); // 供应商行 → 抛出异常

// 2. 导入服务中的 ImportCommitService
// 导入文件中包含供应商键时，该行被跳过并记录警告
```

该保护机制确保您不会意外删除 Laravel 核心翻译字符串，同时仍然允许您覆盖它们的值。

## 重新同步供应商翻译

如果供应商包发布了新翻译文件：

```bash
# 将 lang/ 中的文件（包括供应商文件）同步到数据库
php artisan lingua:sync-to-database

# 或更新特定语言
php artisan lingua:update-lang fr
```

`lingua:sync-to-database` 会检测 `lang/vendor/` 子目录中的文件，并将其标记为 `is_vendor = true` 导入。

## 内置供应商数据集

Lingua 2.0 随包附带了 Laravel v13.14.0 的翻译数据集（26 个语言区域，5902 个字符串）。这些字符串通过 `lingua:add {locale}` 命令填充到数据库，**无需**从 GitHub 下载 `laravel-lang` 包。

```bash
# 添加法语时，自动从内置数据集填充 Laravel 核心翻译
php artisan lingua:add fr
```
