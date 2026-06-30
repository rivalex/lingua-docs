# Livewire 事件

Lingua 的 Livewire 组件在关键操作时发出命名事件。您可以在自己的 Livewire 组件、Alpine.js 代码或 JavaScript 中监听这些事件。

## 在 Livewire 中监听

```php
use Livewire\Component;

class MyComponent extends Component
{
    #[On('lingua:language-added')]
    public function onLanguageAdded(string $locale): void
    {
        // 处理新语言添加事件
    }
}
```

## 在 Alpine.js 中监听

```html
<div x-data x-on:lingua:translation-saved.window="handleSaved($event.detail)">
    ...
</div>

<script>
function handleSaved(detail) {
    console.log('Translation saved:', detail.key, detail.locale);
}
</script>
```

---

## 语言事件

### `lingua:language-added`

语言安装完成后发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `locale` | `string` | 新安装的语言区域代码 |
| `language` | `array` | 语言记录数据 |

### `lingua:language-removed`

语言卸载完成后发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `locale` | `string` | 已卸载的语言区域代码 |

### `lingua:default-language-changed`

默认语言更改后发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `locale` | `string` | 新的默认语言区域代码 |

### `lingua:languages-reordered`

通过拖拽重新排序语言后发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `order` | `array` | 新的语言区域代码排序数组 |

---

## 数据库同步事件

### `lingua:sync-to-database-started`

`lingua:sync-to-database` 命令开始执行时发出。

### `lingua:sync-to-database-completed`

`lingua:sync-to-database` 命令完成时发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `imported` | `int` | 导入的翻译条数 |
| `updated` | `int` | 更新的翻译条数 |
| `skipped` | `int` | 跳过的翻译条数 |

### `lingua:sync-to-local-started`

`lingua:sync-to-local` 命令开始执行时发出。

### `lingua:sync-to-local-completed`

`lingua:sync-to-local` 命令完成时发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `exported` | `int` | 导出的翻译条数 |

---

## 翻译事件

### `lingua:translation-saved`

翻译值更新后发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `key` | `string` | 翻译键 |
| `group` | `string` | 翻译分组 |
| `locale` | `string` | 更新的语言区域代码 |

### `lingua:translation-created`

新翻译记录创建后发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `key` | `string` | 翻译键 |
| `group` | `string` | 翻译分组 |

### `lingua:translation-deleted`

翻译记录删除后发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `key` | `string` | 翻译键 |
| `group` | `string` | 翻译分组 |

### `lingua:translation-type-changed`

翻译类型（`text`/`html`/`markdown`）更改后发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `key` | `string` | 翻译键 |
| `group` | `string` | 翻译分组 |
| `type` | `string` | 新的翻译类型 |

---

## 设置事件

### `lingua:setting-changed`

设置值通过 UI 更新后发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `key` | `string` | 设置键（例如 `'selector_mode'`） |
| `value` | `mixed` | 新的设置值 |

---

## 传输事件 <Badge type="tip" text="2.0 新增" />

### `lingua:export-completed`

导出文件生成完成后发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `format` | `string` | 导出格式（`'csv'`、`'json'`、`'xlsx'`、`'ods'`） |
| `rows` | `int` | 导出的行数 |

### `lingua:import-diff-ready`

干运行差异计算完成、等待用户确认时发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `added` | `int` | 将新增的行数 |
| `updated` | `int` | 将更新的行数 |
| `skipped` | `int` | 将跳过的行数 |
| `errors` | `int` | 错误行数 |

### `lingua:import-committed`

导入事务提交完成后发出。

| 参数 | 类型 | 说明 |
|---|---|---|
| `added` | `int` | 实际新增的行数 |
| `updated` | `int` | 实际更新的行数 |

---

## UI 刷新事件

### `lingua:refresh-languages`

触发语言列表 Livewire 组件重新渲染（通常在语言操作后由内部发出）。

### `lingua:refresh-translations`

触发翻译列表 Livewire 组件重新渲染（通常在批量操作后由内部发出）。

### `lingua:locale-switched`

用户通过语言选择器切换语言区域时发出（重定向发生前）。

| 参数 | 类型 | 说明 |
|---|---|---|
| `locale` | `string` | 新选择的语言区域代码 |
