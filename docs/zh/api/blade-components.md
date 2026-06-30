# Blade 组件

Lingua 在 `lingua::` 前缀下注册了多个匿名 Blade 组件和 Livewire 组件。这些组件在 Lingua 视图中内部使用，也可以在您自己的模板中复用。

## `<x-lingua::nav>` <Badge type="tip" text="2.0 新增" />

出现在所有五个 Lingua 管理页面顶部的共享导航组件。

```blade
<x-lingua::nav :current="'languages'" />
```

| Prop | 类型 | 说明 |
|---|---|---|
| `current` | `string` | 当前活动页面（`'languages'`、`'translations'`、`'statistics'`、`'transfer'`、`'settings'`） |

通过 `config('lingua.nav.enabled')` 或设置页面切换。

---

## `<x-lingua::select>` <Badge type="tip" text="2.0 新增" />

语言区域选择器下拉组件，使用**原生 Popover API**（`popover="manual"`）避免被 CSS `overflow:hidden` 和 `transform` 裁剪。

```blade
<x-lingua::select
    :languages="$languages"
    :current="app()->getLocale()"
/>
```

| Prop | 类型 | 说明 |
|---|---|---|
| `languages` | `Collection` | 已安装语言的集合 |
| `current` | `string` | 当前活动语言区域代码 |

内部使用 `showPopover()` / `hidePopover()` JavaScript API。

---

## `<x-lingua::stat>` <Badge type="tip" text="2.0 新增" />

单个统计数字的展示卡片（用于统计页面的 KPI 区域）。

```blade
<x-lingua::stat
    label="已安装语言"
    :value="$languageCount"
    icon="flag"
/>
```

| Prop | 类型 | 说明 |
|---|---|---|
| `label` | `string` | 统计指标标签 |
| `value` | `int\|string` | 显示的数值 |
| `icon` | `string` | Heroicon 名称（可选） |

---

## `<x-lingua::card>` <Badge type="tip" text="2.0 新增" />

带标题的卡片容器（用于设置页面的各个设置组）。

```blade
<x-lingua::card title="选择器设置">
    {{-- 卡片内容 --}}
</x-lingua::card>
```

| Prop | 类型 | 说明 |
|---|---|---|
| `title` | `string` | 卡片标题 |

---

## `<x-lingua::branding>` <Badge type="tip" text="2.0 新增" />

Lingua 品牌 Logo 组件（亮色/暗色主题自适应）。

```blade
<x-lingua::branding />
<x-lingua::branding variant="horizontal" />
<x-lingua::branding variant="vertical" />
```

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `variant` | `string` | `'horizontal'` | `'horizontal'` 或 `'vertical'` |

---

## `<x-lingua::validation-errors>` <Badge type="tip" text="2.0 新增" />

以标准化格式显示验证错误列表。

```blade
<x-lingua::validation-errors :errors="$errors->all()" />
```

| Prop | 类型 | 说明 |
|---|---|---|
| `errors` | `array` | 错误消息数组 |

---

## `<x-lingua::editor>`

TipTap 3 富文本编辑器组件，用于 `html` 和 `markdown` 翻译类型。

```blade
<x-lingua::editor
    name="content"
    :value="$translation->text"
    type="html"
    :toolbar="config('lingua.editor')"
/>
```

| Prop | 类型 | 说明 |
|---|---|---|
| `name` | `string` | 表单字段名称 |
| `value` | `string` | 初始内容 |
| `type` | `string` | `'html'` 或 `'markdown'` |
| `toolbar` | `array` | 工具栏配置（参见[配置](/zh/guide/configuration#editor)） |

---

## `<x-lingua::clipboard>`

复制到剪贴板按钮，点击后将指定文本复制到剪贴板并短暂显示确认状态。

```blade
<x-lingua::clipboard :text="$translationKey" />
```

| Prop | 类型 | 说明 |
|---|---|---|
| `text` | `string` | 点击时复制的文本 |

---

## `<x-lingua::language-flag>`

显示语言区域的国旗图标（SVG）。

```blade
<x-lingua::language-flag :locale="'fr'" />
<x-lingua::language-flag :locale="'zh'" class="w-5 h-5" />
```

| Prop | 类型 | 说明 |
|---|---|---|
| `locale` | `string` | 语言区域代码（用于查找国旗图标） |

---

## `<x-lingua::message>`

显示操作反馈消息（成功、错误、警告）。

```blade
<x-lingua::message type="success" :message="'翻译已保存'" />
```

| Prop | 类型 | 说明 |
|---|---|---|
| `type` | `string` | `'success'`、`'error'` 或 `'warning'` |
| `message` | `string` | 显示的消息文本 |

---

## `<x-lingua::autocomplete>`

带搜索过滤的语言区域自动完成输入框，用于"添加语言"对话框中选择语言区域。

```blade
<x-lingua::autocomplete
    name="locale"
    :options="$availableLocales"
    placeholder="搜索语言..."
/>
```

| Prop | 类型 | 说明 |
|---|---|---|
| `name` | `string` | 表单字段名称 |
| `options` | `array` | 可选项（`['code' => '...', 'name' => '...']`） |
| `placeholder` | `string` | 输入框占位文本 |

---

## `<x-lingua::menu-group>`

侧边栏模式下用于分组导航链接的容器组件。

```blade
<x-lingua::menu-group title="语言">
    @foreach ($languages as $language)
        <x-lingua::menu-group.item
            :href="route('lingua.translations', ['locale' => $language->code])"
            :active="$currentLocale === $language->code"
        >
            {{ $language->native }}
        </x-lingua::menu-group.item>
    @endforeach
</x-lingua::menu-group>
```
