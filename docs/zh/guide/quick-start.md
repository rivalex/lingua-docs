# 快速开始

本指南将带您从全新安装的 Lingua 快速构建一个完整的多语言应用。

## 1. 安装并初始化

```bash
composer require rivalex/lingua
php artisan lingua:install
```

现在英语是您的默认语言，所有 Laravel/扩展包翻译字符串已导入数据库。

## 2. 添加第二种语言

```bash
php artisan lingua:add fr
```

此命令将：
- 通过 Laravel Lang 下载法语翻译文件
- 在数据库中创建 `Language` 记录
- 将所有新下载的字符串同步到 `language_lines`

可根据需要重复添加更多语言环境：

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. 将语言选择器添加到布局中

打开您的主 Blade 布局文件（例如 `resources/views/layouts/app.blade.php`）并：

**a) 在 `<html>` 标签上设置 `lang` 和 `dir` 属性：**

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

**b) 在适合您设计的位置嵌入语言切换器：**

```blade
{{-- 作为侧边栏分组（默认）--}}
<livewire:lingua::language-selector />

{{-- 作为导航栏中的下拉菜单 --}}
<livewire:lingua::language-selector mode="dropdown" />
```

## 4. 在应用中使用翻译

Lingua 对您的代码完全透明——像以往一样使用标准 Laravel 辅助函数：

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

自定义的 `LinguaManager` 会自动将数据库翻译合并到基于文件的翻译之上，无需修改任何代码。

## 5. 通过界面进行翻译

访问 `/lingua/translations` 查看所有翻译字符串。针对每种语言：

1. 使用语言环境切换器（右上角）选择目标语言
2. 点击任意行以内联编辑值
3. 使用**仅显示缺失**专注于未翻译的字符串
4. 对于 HTML 或 Markdown 类型，富文本编辑器会自动激活

<Screenshot src="/screenshots/translations-page.png" alt="Lingua 翻译管理页面" caption="翻译页面，包含语言环境切换器、分组过滤器和内联编辑器。" />

## 6. 同步回文件（可选）

如果您需要在磁盘上保留翻译文件（用于版本控制、CI/CD 或其他工具）：

```bash
php artisan lingua:sync-to-local
```

这会将所有数据库翻译以正确的 PHP/JSON 格式导出到 `lang/` 目录。

---

## 常见使用模式

### 以编程方式翻译新键

```php
use Rivalex\Lingua\Facades\Lingua;

// 在数据库中为默认语言环境创建翻译
// （通常通过界面完成，但也可以通过脚本实现）
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

// 稍后，为其他语言环境添加翻译：
Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
Lingua::setTranslation('welcome_subject', 'Benvenuto nella nostra piattaforma!', 'it');
```

### 检查翻译完成度

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]
```

### 以编程方式切换语言环境

```php
// 在控制器、中间件或服务中
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```

::: tip
`LanguageSelector` 组件会自动为终端用户处理语言环境切换。上述手动方式在控制台命令或队列任务中非常有用。
:::

### 仅导出特定分组

如果只想将部分翻译导出到文件，先同步到本地，然后从 `lang/` 中删除不需要的分组——数据库在运行时始终是事实的来源。
