# Livewire 事件

Lingua 的 Livewire 组件通过命名事件进行通信。您可以在自己的 Livewire 组件、Alpine.js 代码或 JavaScript 中监听这些事件。

## 在 Livewire 中监听

```php
use Livewire\Attributes\On;

class MyComponent extends Component
{
    #[On('language_added')]
    public function handleLanguageAdded(): void
    {
        // 当新语言添加时刷新某些内容
    }
}
```

## 在 Alpine.js / JavaScript 中监听

```js
window.addEventListener('language_added', (event) => {
    console.log('A new language was added!', event.detail);
});

// 或通过 Livewire 的事件系统：
Livewire.on('language_added', () => {
    // ...
});
```

---

## 语言事件

| 事件 | 触发时机 |
|---|---|
| `language_added` | 新语言成功添加时 |
| `language_added_fail` | 添加语言失败时 |
| `refreshLanguages` | 任何需要重新渲染语言列表的语言变更 |
| `language_default_set` | 默认语言被更改时 |
| `language_default_fail` | 设置默认语言失败时 |
| `languages_sorted` | 通过拖放重新排序语言时 |
| `languages_sorted_fail` | 语言重新排序失败时 |
| `lang_updated` | `lingua:update-lang` 成功完成时 |
| `lang_updated_fail` | `lingua:update-lang` 失败时 |
| `synced_database` | 同步到数据库成功完成时 |
| `synced_database_fail` | 同步到数据库失败时 |
| `synced_local` | 同步到本地成功完成时 |
| `synced_local_fail` | 同步到本地失败时 |

---

## 翻译事件

| 事件 | 触发时机 |
|---|---|
| `translation_deleted` | 翻译记录被完全删除时 |
| `translation_delete_fail` | 删除翻译失败时 |
| `translation_locale_deleted` | 单个语言环境的值从翻译中移除时 |
| `translation_locale_delete_fail` | 移除语言环境值失败时 |
| `vendor_translation_protected` | 尝试删除扩展包翻译时 |
| `refreshTranslationsTableDefaults` | 翻译表应重新加载其默认语言环境列时 |
| `refreshTranslationRow.{id}` | 特定翻译行应刷新时（通过翻译 ID 参数化） |
| `updateTranslationModal.{id}` | 翻译的更新模态框应刷新时 |

---

## 界面刷新事件

| 事件 | 触发时机 |
|---|---|
| `refreshLanguageRows` | 所有语言行应重新渲染时（例如默认语言变更后） |

---

## 示例：添加语言时显示 Toast 通知

使用 Alpine.js 和 Toast 库：

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Language added!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

## 示例：语言切换后重定向

如果您希望语言选择器切换语言环境后重定向到不同的 URL（而非当前页面）：

```php
// 发布 LanguageSelector 并覆盖 changeLocale()：
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true); // 重定向到首页
}
```
