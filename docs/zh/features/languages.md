# 语言管理

语言页面（`/lingua/languages`）是管理所有已安装语言环境的控制中心。

<Screenshot src="/screenshots/languages-page.png" alt="Lingua 语言管理页面" caption="语言页面 — 显示已安装的语言环境及其完成度统计。" />

## 添加语言

### 通过界面

点击**添加语言**，从 70+ 个可用语言环境中选择一个，然后确认。Lingua 将：

1. 从 Laravel Lang 下载语言文件
2. 在数据库中创建 `Language` 记录
3. 将所有新字符串同步到 `language_lines`
4. 刷新表格显示新语言环境

<Screenshot src="/screenshots/language-add-modal.png" alt="添加语言模态框" caption="添加语言模态框，带有可搜索的语言环境选择器。" width="640px" :center="true"/>

### 通过命令行

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

### 以编程方式

```php
use Rivalex\Lingua\Facades\Lingua;

// 安装语言文件（lang:add 的封装）
Lingua::addLanguage('fr');

// 然后创建数据库记录 + 同步（Artisan 命令完整流程）
// → 使用 lingua:add 获得完整的协调流程
```

::: tip
使用 `Lingua::notInstalled()` 获取可用但尚未安装的语言环境列表：

```php
$available = Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```
:::

## 删除语言

点击任意非默认语言行上的垃圾桶图标。确认模态框会防止意外删除——您必须输入语言名称来确认。

在后台，删除操作将：
1. 通过 `lang:rm {locale} --force` 删除语言文件
2. 从 `language_lines.text` JSON 列中移除所有 `{locale}` 条目
3. 删除 `Language` 记录
4. 重新排序剩余语言的排序值

::: warning
**默认语言不能被删除**。请先将另一种语言设置为默认语言。
:::

```bash
# 通过命令行
php artisan lingua:remove fr
```

## 设置默认语言

点击任意语言行上的星形图标（⭐）。同一时间只能有一种语言为默认语言。更改操作包含在数据库事务中，以防止出现没有语言被标记为默认的情况。

```php
// 以编程方式
Lingua::setDefaultLocale('fr');

// 或通过模型
$french = Language::where('code', 'fr')->first();
Language::setDefault($french);
```

::: warning 更换默认语言
如果您设置了新的默认语言，请确保该语言环境的翻译至少已部分完成。默认语言在界面编辑器中用作备用参考（左列显示默认值作为参考）。
:::

## 重新排序语言

拖放语言行以控制其在整个应用中的显示顺序——包括语言选择器小部件、翻译语言环境切换器，以及任何使用 `Lingua::languages()` 的地方。

排序顺序存储在 `sort` 整数列中，每次拖放后按顺序重新分配。

## 查看完成度统计

每个语言行显示：

| 指标 | 描述 |
|---|---|
| **完成度 %** | `已翻译 / 总数 * 100`，保留两位小数 |
| **缺失** | 该语言环境没有值的字符串数量 |

这些数据通过针对 `language_lines` 表的数据库子查询在查询时计算，因此始终是最新的。

```php
// 获取特定语言环境的统计数据
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// 或在一次查询中获取所有语言及其统计数据
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

## 同步控制

语言页面工具栏提供三个同步按钮：

| 按钮 | 操作 |
|---|---|
| **同步到数据库** | 将本地 `lang/` 文件导入 `language_lines` |
| **同步到本地** | 将所有数据库翻译导出回 `lang/` 文件 |
| **通过 Laravel Lang 更新** | 运行 `lang:update` 从上游拉取最新字符串，然后同步到数据库 |

所有三个操作都**异步运行**（Livewire `#[Async]` 属性），因此在长时间运行的同步过程中界面保持响应。
