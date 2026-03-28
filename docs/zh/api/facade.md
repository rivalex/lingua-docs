# Lingua Facade

`Lingua` Facade 提供从应用中任何位置对完整 Lingua 服务的静态访问。

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## 语言环境辅助方法

### `getLocale()`

返回当前应用语言环境代码。

```php
Lingua::getLocale(); // 'en'
```

等同于 `app()->getLocale()`。

---

### `getDefaultLocale()`

返回数据库中标记为默认的语言的语言环境代码。

```php
Lingua::getDefaultLocale(); // 'en'
```

如果未设置默认值，回退到 `config('lingua.default_locale', 'en')`。

---

### `isDefaultLocale(?string $locale = null): bool`

如果给定语言环境（或 `null` 时的当前语言环境）是系统默认值，则返回 `true`。

```php
Lingua::isDefaultLocale();       // true  (当前语言环境是默认值)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (未知语言环境，不抛出异常)
```

---

### `hasLocale(string $locale): bool`

如果给定代码或区域值存在 `Language` 记录，则返回 `true`。

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (通过区域值匹配)
Lingua::hasLocale('xx');     // false
```

---

### `setDefaultLocale(string $locale): void`

将给定语言环境标记为系统默认值。如果未安装该语言环境，抛出 `ModelNotFoundException`。

```php
Lingua::setDefaultLocale('fr');
```

---

### `getLocaleName(?string $locale = null): string`

返回语言环境的英文显示名称。如果找不到，返回 `''`。

```php
Lingua::getLocaleName();       // 'English'  (当前语言环境)
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
Lingua::getLocaleName('zz');   // ''
```

---

### `getLocaleNative(?string $locale = null): string`

返回语言环境的本地名称。如果找不到，返回 `''`。

```php
Lingua::getLocaleNative();       // 'English'
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

---

### `getDirection(?string $locale = null): string`

返回给定语言环境的 `'ltr'` 或 `'rtl'`。如果找不到语言环境，默认返回 `'ltr'`。

```php
Lingua::getDirection();        // 'ltr'  (当前语言环境)
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (安全回退)
```

---

### `info(mixed $locale, bool $withCountry = false, bool $withCurrency = false): LocaleData`

返回来自 `laravel-lang/locales` 的 `LocaleData` 对象，包含详细的语言环境信息。

```php
$info = Lingua::info('fr');
$info->code;          // 'fr'
$info->native;        // 'Français'
$info->direction;     // Direction enum

$info = Lingua::info('en-US', withCountry: true, withCurrency: true);
$info->native;        // 'English (United States)'
```

---

## 语言查询

### `languages(): Collection`

返回所有已安装 `Language` 模型的集合。

```php
$languages = Lingua::languages();
foreach ($languages as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

返回给定语言环境代码的 `Language` 模型，如果未找到则返回 `null`。

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

---

### `getDefault(): ?Language`

返回标记为默认的 `Language` 模型。

```php
$default = Lingua::getDefault();
$default?->code;       // 'en'
$default?->is_default; // true
```

---

### `getFallback(): ?Language`

返回 `app()->getFallbackLocale()` 对应的 `Language` 模型。

```php
$fallback = Lingua::getFallback();
```

---

### `languagesWithStatistics(): Collection`

返回所有 `Language` 模型，并附带翻译统计数据。

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Missing: {$lang->missing_strings} / {$lang->total_strings}";
}
```

每个模型获得四个只读属性：

| 属性 | 类型 | 描述 |
|---|---|---|
| `total_strings` | `int` | `language_lines` 中的总行数 |
| `translated_strings` | `int` | 该语言环境有值的行数 |
| `missing_strings` | `int` | `total - translated` |
| `completion_percentage` | `float` | `translated / total * 100` |

---

## 语言环境可用性检查

### `available(): array`

返回 `laravel-lang/locales` 已知的所有语言环境代码（已安装 + 未安装）。

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', 'bn', …]
```

---

### `installed(): array`

返回当前在 `languages` 表中的语言环境代码。

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

---

### `notInstalled(): array`

返回可用但未安装的语言环境代码，按字母顺序排序。

```php
Lingua::notInstalled(); // ['af', 'ar', 'az', …] (除 'en', 'fr', 'it' 之外的所有)
```

---

### `isInstalled(?string $locale = null): bool`

```php
Lingua::isInstalled('en');   // true
Lingua::isInstalled('xx');   // false
Lingua::isInstalled(null);   // false
```

---

### `isAvailable(?string $locale = null): bool`

如果语言环境被 laravel-lang 知晓但**尚未安装**，返回 `true`。

```php
Lingua::isAvailable('de');   // true  (可用，未安装)
Lingua::isAvailable('en');   // false (已安装)
Lingua::isAvailable(null);   // false
```

---

## 翻译读取

### `translations(): Collection`

返回所有 `Translation` 模型。

```php
$all = Lingua::translations();
```

---

### `getTranslations(?string $key): array`

以关联数组形式返回翻译键的所有语言环境值。

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants ne correspondent pas.']

Lingua::getTranslations('nonexistent'); // []
```

---

### `getTranslation(?string $key, ?string $locale = null): string`

返回键和语言环境对应的翻译字符串。如果未找到，返回 `''`。

```php
Lingua::getTranslation('auth.failed');         // 当前语言环境
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('auth.failed', 'zz');   // ''
Lingua::getTranslation('nonexistent', 'en');   // ''
```

---

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

返回分组中的所有 `Translation` 模型，可选择过滤到给定语言环境有值的记录。

```php
// 所有 validation 字符串
Lingua::getTranslationByGroup('validation');

// 只有有法语翻译的 validation 字符串
Lingua::getTranslationByGroup('validation', 'fr');
```

---

### `getLocaleStats(?string $locale = null): array`

返回给定语言环境（或 `null` 时的当前语言环境）的翻译统计数据。

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

Lingua::getLocaleStats('zz');
// ['total' => 1240, 'translated' => 0, 'missing' => 1240, 'percentage' => 0.0]
```

---

## 翻译写入

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

保存翻译值。如果键不存在，则不执行任何操作。

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
Lingua::setTranslation('auth.failed', 'Updated message');  // 当前语言环境
```

---

### `forgetTranslation(?string $key, ?string $locale = null): void`

从翻译键中移除语言环境的值。如果语言环境是默认值，则删除整条记录。对扩展包翻译抛出 `VendorTranslationProtectedException`。

```php
Lingua::forgetTranslation('custom.key', 'fr');  // 仅移除 'fr' 的值
Lingua::forgetTranslation('custom.key', 'en');  // 删除整条记录（默认语言环境）
```

---

## 扩展包翻译辅助方法

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frenchSpatie = Lingua::getVendorTranslations('spatie', 'fr');
```

---

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

更新扩展包翻译值。如果记录不存在，抛出 `ModelNotFoundException`。

```php
Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'The :attribute field is mandatory.',
    locale: 'en'
);
```

---

## 语言生命周期

### `addLanguage(string $locale): void`

通过 `lang:add` 为给定语言环境安装语言文件。

```php
Lingua::addLanguage('fr');
```

> 这只安装文件。使用 `php artisan lingua:add {locale}` 获得完整的协调流程（文件 + 数据库记录 + 同步）。

---

### `removeLanguage(string $locale): void`

通过 `lang:rm --force` 移除给定语言环境的语言文件。

```php
Lingua::removeLanguage('fr');
```

> 这只移除文件。使用 `php artisan lingua:remove {locale}` 获得完整的协调流程（文件 + 翻译 + 数据库记录 + 重新排序）。

---

## 同步与维护

### `syncToDatabase(): void`

将所有本地 `lang/` 文件导入数据库。

```php
Lingua::syncToDatabase();
```

---

### `syncToLocal(): void`

将所有数据库翻译导出到本地 `lang/` 文件。

```php
Lingua::syncToLocal();
```

---

### `updateLanguages(): void`

运行 `lang:update` 从 `laravel-lang` 获取最新翻译。

```php
Lingua::updateLanguages();
```

---

### `optimize(): void`

通过 `optimize:clear` 清除应用缓存。

```php
Lingua::optimize();
```
