# 快速开始

本指南将带您从全新的 Lingua 安装到完整的多语言应用，只需几分钟。

## 1. 安装并填充数据

```bash
composer require rivalex/lingua
php artisan lingua:install
```

在提示时选择**数据库**驱动（推荐）。英语成为您的默认语言，内置翻译字符串被导入数据库——无需从 GitHub 下载。

::: tip 默认安全
管理路由自动受 `['web', 'auth']` 保护。设置 `LINGUA_GATE` 以实现基于角色的访问——参见[安装](/zh/guide/installation#protecting-the-management-ui)。
:::

## 2. 添加第二种语言

```bash
php artisan lingua:add fr
```

此命令是**数据库原生的**：它从内置数据集填充法语字符串并创建一个 `Language` 记录。它**不**下载文件或写入 `lang/`。

根据需要重复添加更多语言区域：

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. 将语言选择器添加到布局中

打开您的主 Blade 布局（例如 `resources/views/layouts/app.blade.php`）：

**a) 在 `<html>` 标签上设置 `lang` 和 `dir`：**

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

**b) 在适合您设计的地方嵌入语言切换器：**

```blade
{{-- 作为侧边栏分组（默认）--}}
<livewire:lingua::language-selector />

{{-- 在导航栏中作为下拉菜单 --}}
<livewire:lingua::language-selector mode="dropdown" />
```

::: tip 切换语言区域会重新加载当前页面
当用户切换语言区域时，Lingua 会重新加载**他们所在的页面**（不是主页），并防止开放重定向。参见[安全](/zh/guide/security#open-redirect-protection)。
:::

## 4. 在应用中使用翻译

Lingua 是透明的——像往常一样使用标准 Laravel 助手：

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

在数据库模式下，`LinguaManager` 自动将数据库翻译合并到基于文件的翻译之上。无需更改代码。

## 5. 通过 UI 进行翻译

访问 `/lingua/translations` 查看所有翻译字符串。对于每种语言：

1. 使用语言区域切换器（右上角）选择目标语言
2. 点击任意行以内联编辑值
3. 使用**仅显示缺失**专注于未翻译的字符串
4. 对于 HTML 或 Markdown 类型，富文本编辑器会自动激活

<Screenshot src="/screenshots/translations-page.png" alt="Lingua translations management page" caption="带有语言区域切换器、分组过滤器和内联编辑器的翻译页面。" />

## 6. 通过传输页面导入/导出

需要在电子表格中批量编辑翻译，或将文件交给翻译机构？访问 `/lingua/transfer`：

- **导出**为 CSV、JSON、XLSX 或 ODS——双语、多语言或 JSON 原生布局
- **导入**时提供干运行**差异预览**，在写入任何内容之前先确认

XLSX/ODS 需要可选的 `openspout/openspout` 包；CSV 和 JSON 开箱即用。

## 7. 同步回文件（可选）

如果您需要磁盘上的翻译文件（用于版本控制或 CI/CD）：

```bash
php artisan lingua:sync-to-local
```

这会将所有数据库翻译以正确的 PHP/JSON 格式导出回 `lang/`。

---

## 常见模式

### 以编程方式翻译新键

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
```

### 检查语言区域信息

```php
use Rivalex\Lingua\Facades\Lingua;

$info = Lingua::info('fr');

if ($info !== null) {
    $info->name;      // "French"
    $info->native;    // "Français"
    $info->direction; // "ltr"
}
```

::: warning 2.0 中的变更
`Lingua::info()` 现在返回 `?LocaleInfo`，对于未知语言区域返回 `null` 而不是抛出异常。始终使用 `if ($info !== null)` 进行保护。
:::

### 以编程方式切换语言区域

```php
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```
