# 扩展包翻译

扩展包翻译是属于第三方扩展包的字符串--Laravel 自身的验证消息、分页标签、密码重置字符串，以及其他附带 `lang/` 目录的扩展包的翻译。

## 如何识别

在 `lingua:sync-to-database` 期间，Lingua 扫描 `lang/vendor/` 目录结构。在那里找到的任何翻译文件都会以以下方式导入：

- `is_vendor = true`
- `vendor` = 扩展包名称（从目录名称派生，如 `spatie`、`laravel`、`filament`）

同步后数据库中的示例记录：

```
group      | key          | is_vendor | vendor   | text
-----------|--------------|-----------|----------|-----------------------------
validation | required     | false     | null     | {"en":"The :attribute…"}
passwords  | reset        | true      | laravel  | {"en":"Your password…"}
auth       | failed       | true      | laravel  | {"en":"These credentials…"}
```

::: tip
Laravel 自身的 `lang/en/*.php` 文件（auth、validation、pagination、passwords）被视为**扩展包翻译**，因为它们来自框架，而非您的应用代码。
:::

## 可以对扩展包翻译执行哪些操作

| 操作 | 是否允许？ | 说明 |
|---|---|---|
| **编辑值** | ✅ 是 | 用您自己的措辞覆盖任何扩展包字符串 |
| **更改类型** | ✅ 是 | 在 text / html / markdown 之间切换 |
| **编辑分组或键** | ❌ 否 | 编辑模态框中的分组和键字段被锁定 |
| **删除** | ❌ 否 | 受 `VendorTranslationProtectedException` 保护 |

## 覆盖扩展包字符串

最常见的用例是覆盖 Laravel 的验证消息以匹配您应用的语调：

1. 打开 `/lingua/translations`
2. 找到该字符串（如 `validation.required`）
3. 点击编辑图标打开更新模态框
4. 更改任意语言环境的值
5. 保存--覆盖在下一次请求时立即生效

```php
// 或通过 Facade 以编程方式：
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Please fill in the :attribute field.',
    locale: 'en'
);
```

## 查询扩展包翻译

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// 所有扩展包翻译
$all = Translation::where('is_vendor', true)->get();

// 特定扩展包的所有翻译
$laravel = Lingua::getVendorTranslations('laravel');

// 具有法语值的特定扩展包所有翻译
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');

// 手动按分组和键过滤
$required = Translation::where('is_vendor', true)
    ->where('vendor', 'laravel')
    ->where('group', 'validation')
    ->where('key', 'required')
    ->first();
```

## 保护机制

尝试删除扩展包翻译（通过界面或 `Lingua::forgetTranslation()`）会抛出 `VendorTranslationProtectedException`：

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en'); // 该键属于扩展包翻译
} catch (VendorTranslationProtectedException $e) {
    // 优雅处理
}
```

在 Livewire 界面中，删除尝试会触发 `vendor_translation_protected` 事件，并在不删除任何内容的情况下关闭模态框。您可以在自己的 Livewire 组件或 Alpine.js 代码中监听此事件：

```js
// Alpine.js / Livewire 事件监听器
window.addEventListener('vendor_translation_protected', () => {
    alert('This translation is protected and cannot be deleted.');
});
```

## 重新同步扩展包翻译

如果您依赖的扩展包在版本升级中添加了新的翻译键，重新同步以导入它们：

```bash
# 从 laravel-lang 拉取最新内容并同步到数据库
php artisan lingua:update-lang

# 或手动从现有 lang/ 文件重新同步
php artisan lingua:sync-to-database
```

Lingua 在同步时使用 `updateOrCreate`，因此现有的覆盖（已编辑的值）会被保留。

## 禁用扩展包翻译导入

如果您完全不想在数据库中保存扩展包翻译，请在删除 `lang/vendor/` 目录之后再进行同步。Lingua 只导入磁盘上存在的内容。
