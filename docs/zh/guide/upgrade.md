# 从 1.x 升级到 2.0

Lingua 2.0 是一个主要版本。本指南将逐步引导您完成迁移，列出每个重大变更，并回答最常见的问题。

## 为什么这是主要版本

- **移除了外部依赖。** `spatie/laravel-translation-loader` 和 `laravel-lang/common` 已被移除。语言区域元数据和翻译数据集现在随包一起发布。
- **新增存储驱动。** 选择 `database`（1.x 的行为）或 `file`。参见[存储驱动](/zh/guide/storage)。
- **全面安全加固。** 默认安全，外加 F1–F9 加固。参见[安全](/zh/guide/security)。
- **PHP 最低版本提升**至 8.3+。

## 逐步迁移

### 1. 更新包

```bash
composer update rivalex/lingua
```

Composer 会自动移除 `spatie/laravel-translation-loader`。如果您自己的 `composer.json` 中列出了 `laravel-lang/common`：

```bash
composer remove laravel-lang/common
```

### 2. 重新发布并合并配置

```bash
php artisan vendor:publish --tag=lingua-config --force
```

然后将新键合并到您现有的配置中：`gate`、`storage.driver`、`nav.enabled`、`navigate`、`routes_extra_parameters`、`layout`、`links.translations`、`ui.sticky_top`、`cache.store`、`cache.prefix`、`suppress_pro_nudge`、`pro_upgrade_url`、`extensions.enabled`。参见[配置](/zh/guide/configuration)。

### 3. 设置存储驱动

```env
LINGUA_STORAGE_DRIVER=database
```

```bash
php artisan config:clear
```

`database` 与 1.x 的行为完全相同。

### 4. 迁移文件

迁移现在分为**三个**文件。如果您从 1.x 升级时迁移已运行，**无需新迁移**——您的表已存在。仅当您之前发布并自定义了合并迁移时，才需检查模式差异。

### 5. 自定义翻译加载器

```php
// 之前
use Spatie\TranslationLoader\TranslationLoaders\TranslationLoader;

// 之后
use Rivalex\Lingua\Contracts\TranslationLoader;
```

签名不变：`loadTranslations(string $locale, string $group, ?string $namespace = null): array`。

### 6. 自定义 Translation 模型

```php
// 之前
class Translation extends \Spatie\TranslationLoader\LanguageLine {}

// 之后
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $table = 'language_lines';

    public static function getTranslationsForGroup(string $locale, string $group): array
    {
        // …
    }
}
```

### 7. 类型提示

```php
// 之前
use Spatie\TranslationLoader\TranslationLoaderManager;

// 之后
use Rivalex\Lingua\TranslationManager\LinguaManager;
```

### 8. 包作者（Testbench）

从 `getPackageProviders()` 中移除 Spatie 提供者：

```php
// 移除这一行
Spatie\TranslationLoader\TranslationServiceProvider::class,
```

## 重大变更参考

| 变更 | 详情 |
|---|---|
| `Lingua::info()` 返回类型 <Badge type="warning" text="重大变更" /> | 现在返回 `?LocaleInfo`；对于未知语言区域返回 `null`（之前会抛出异常）。使用 `if ($info === null)` 进行保护。字段名称与旧的 `LaravelLang\LocaleData` 不同。 |
| `addLanguage()` / `removeLanguage()` <Badge type="warning" text="重大变更" /> | 不再调用 `lang:add` / `lang:rm`。仅数据库原生——不写入文件。 |
| 中间件默认值 <Badge type="warning" text="重大变更" /> | `['web', 'auth']`（之前为 `['web']`）。 |
| `navigate` 默认值 <Badge type="warning" text="重大变更" /> | `false`（之前为 `true`）。 |
| PHP 最低版本 <Badge type="warning" text="重大变更" /> | 8.3+（之前为 8.2+）。 |
| `Language::scopeActive()` <Badge type="warning" text="重大变更" /> | 重命名为 `scopeOrdered()`（保留委托以保持兼容性）。 |
| `Translation::forgetTranslation()` <Badge type="warning" text="重大变更" /> | 对供应商行抛出 `VendorTranslationProtectedException`。 |
| `Import $errors` <Badge type="warning" text="重大变更" /> | 重命名为 `$rowErrors`。 |
| `optimize()` <Badge type="warning" text="重大变更" /> | 已弃用——移除所有调用。 |
| 可空列 | `language_lines.text` 和 `languages.regional` 现在可为空。 |
| 迁移 | 分为 3 个文件（之前为 1 个合并文件）。 |
| `lingua-assets` 标签 | 已移除——资产通过 `lingua.assets` 路由提供。 |

## 快速检查清单

- [ ] `composer update rivalex/lingua`
- [ ] 如果 `composer.json` 中存在 `laravel-lang/common`，将其移除
- [ ] 重新发布配置并合并新键
- [ ] 设置 `LINGUA_STORAGE_DRIVER=database` 并运行 `php artisan config:clear`
- [ ] 更新所有自定义加载器/模型/类型提示（Spatie → Lingua）
- [ ] 在 `Lingua::info()` 的使用处添加 `null` 保护
- [ ] 移除 `optimize()` 调用
- [ ] 将 `Import::$errors` 的引用重命名为 `$rowErrors`
- [ ] 确认中间件/门控与您的访问策略匹配

## 常见问题

**我的翻译会丢失吗？**
不会。使用 `database` 驱动时，行为和数据与 1.x 完全相同。您现有的 `language_lines` 行不受影响。

**我需要重新运行迁移吗？**
不需要，如果它们已在 1.x 下运行过的话。表已存在；3 文件拆分只影响全新安装。

**我还能使用基于文件的存储吗？**
可以——这就是新的 `file` 驱动。随时可以通过 `php artisan lingua:storage file` 切换。参见[存储驱动](/zh/guide/storage)。

**Flux 仍然是必需的吗？**
是的。Lingua 2.0 需要 `livewire/flux ^2.12`。Flux **未被**移除。
