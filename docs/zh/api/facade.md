# Lingua Facade

`Lingua` Facade 提供从应用中任何位置对完整 Lingua 服务的静态访问。

```php
use Rivalex\Lingua\Facades\Lingua;
```

## 语言区域助手

### `getLocale(): string`

返回当前活动的语言区域代码。

```php
$locale = Lingua::getLocale(); // 'fr'
```

### `getDefaultLocale(): string`

返回默认语言区域代码（`languages` 表中 `is_default = true` 的行）。

```php
$default = Lingua::getDefaultLocale(); // 'en'
```

### `getDirection(string $locale = null): string`

返回当前或指定语言区域的文本方向（`'ltr'` 或 `'rtl'`）。

```php
Lingua::getDirection();       // 'ltr'（当前语言区域）
Lingua::getDirection('ar');   // 'rtl'
```

### `info(string $locale): ?LocaleInfo`

返回语言区域的元数据对象，未知语言区域返回 `null`。

```php
$info = Lingua::info('fr');

if ($info !== null) {
    $info->code;      // 'fr'
    $info->name;      // 'French'
    $info->native;    // 'Français'
    $info->direction; // 'ltr'
    $info->regional;  // 'fr_FR'（如有）
    $info->type;      // 'standard' 或 'regional'
}
```

::: warning 2.0 中的变更
`info()` 对于未知语言区域返回 `null`（1.x 中会抛出异常）。始终检查 `null`。
:::

## 语言管理

### `getLanguages(): Collection`

返回所有已安装语言的集合，按 `sort` 排序。

```php
$languages = Lingua::getLanguages();

foreach ($languages as $language) {
    $language->code;       // 'fr'
    $language->name;       // 'French'
    $language->native;     // 'Français'
    $language->direction;  // 'ltr'
    $language->is_default; // false
}
```

### `addLanguage(string $locale): Language`

安装新语言并从内置数据集填充翻译。

```php
$language = Lingua::addLanguage('fr');
```

### `removeLanguage(string $locale): void`

卸载语言并从所有翻译行中移除该语言区域的值。

```php
Lingua::removeLanguage('fr');
```

### `setDefaultLanguage(string $locale): void`

将指定语言设为默认语言（更新 `languages.is_default`）。

```php
Lingua::setDefaultLanguage('fr');
```

## 可用性检查

### `isInstalled(string $locale): bool`

检查语言区域是否已安装。

```php
if (Lingua::isInstalled('fr')) {
    // 法语已安装
}
```

### `isKnown(string $locale): bool`

检查语言区域是否在内置 `LocaleRegistry` 中已知（无论是否已安装）。

```php
Lingua::isKnown('xyz'); // false
Lingua::isKnown('fr');  // true
```

## 翻译访问

### `getTranslations(string $locale, string $group): array`

获取指定语言区域和分组的所有翻译。

```php
$translations = Lingua::getTranslations('fr', 'auth');
// ['failed' => 'Ces identifiants ne correspondent pas.', ...]
```

### `setTranslation(string $key, string $value, string $locale, string $group = 'single'): void`

设置或更新单条翻译。

```php
Lingua::setTranslation('welcome', 'Bienvenue !', 'fr');
Lingua::setTranslation('failed', 'Identifiants incorrects.', 'fr', 'auth');
```

### `forgetTranslation(string $key, string $group = 'single'): void`

删除整条翻译记录（所有语言区域）。对供应商行会抛出 `VendorTranslationProtectedException`。

```php
Lingua::forgetTranslation('welcome');
Lingua::forgetTranslation('failed', 'auth');
```

## 供应商翻译

### `getVendorTranslations(string $vendor, string $locale): array`

获取指定供应商的所有翻译。

```php
$translations = Lingua::getVendorTranslations('laravel', 'fr');
```

### `isVendorTranslation(string $group, string $key): bool`

检查指定的分组/键是否为供应商翻译。

```php
Lingua::isVendorTranslation('validation', 'required'); // true（Laravel 核心）
Lingua::isVendorTranslation('emails', 'welcome');      // false
```

## 同步

### `syncToDatabase(): void`

触发 `lingua:sync-to-database` 命令的等效操作。

```php
Lingua::syncToDatabase();
```

### `syncToLocal(): void`

触发 `lingua:sync-to-local` 命令的等效操作。

```php
Lingua::syncToLocal();
```

## 已弃用

### `optimize()` <Badge type="warning" text="2.0 已弃用" />

在 1.x 中，`optimize()` 会预热所有翻译缓存。在 2.0 中已**移除**，因为缓存现在按需精确填充，不需要也不鼓励手动预热。

移除所有 `Lingua::optimize()` 调用。
