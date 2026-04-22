# محدد اللغة

مكون `<livewire:lingua::language-selector>` هو محوِّل لغة قابل للتضمين لمستخدميك النهائيين - منفصل تمامًا عن واجهة إدارة المشرف.

## الاستخدام الأساسي

```blade
<livewire:lingua::language-selector />
```

أضفه في أي مكان في تخطيطات Blade. يُعرض باستخدام الوضع المكوَّن في `config/lingua.php` (`sidebar` افتراضيًا).

## أوضاع العرض

### وضع الشريط الجانبي (الافتراضي)

يُعرض كقسم تنقل مجمَّع - مثالي للأشرطة الجانبية للتطبيقات المبنية بـ Flux.

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/screenshots/selector-sidebar.png" alt="محدد اللغة في وضع الشريط الجانبي" caption="وضع الشريط الجانبي - يعرض جميع اللغات المثبتة كعناصر تنقل." width="320px" :center="true"/>

### وضع القائمة المنسدلة

يُعرض كزر قائمة منسدلة مضغوطة - مثالي للترويسات وأشرطة التنقل.

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/screenshots/selector-dropdown.png" alt="محدد اللغة في وضع القائمة المنسدلة" caption="وضع القائمة المنسدلة - يعرض اللغة الحالية مع أيقونة العلم." width="320px" :center="true"/>

### وضع النافذة المنبثقة

يُعرض كزر يفتح نافذة منبثقة كاملة لاختيار اللغة - مثالي للتبديل البارز في صفحات الهبوط أو تدفقات الإعداد.

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/screenshots/selector-modal.png" alt="محدد اللغة في وضع النافذة المنبثقة" caption="وضع النافذة المنبثقة - طبقة منتقي اللغة بملء الشاشة."/>

## مرجع الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'` أو `'dropdown'` أو `'modal'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | عرض أيقونات أعلام البلدان |

```blade
{{-- Override mode per-instance --}}
<livewire:lingua::language-selector mode="dropdown" :show-flags="false" />
```

## كيف يعمل تبديل اللغة

عندما ينقر المستخدم على لغة، يستدعي المكون `changeLocale($locale)`:

1. يتحقق من وجود اللغة في جدول `languages` (يتجاهل بصمت اللغات غير المعروفة)
2. يخزّن رمز اللغة في الجلسة تحت `config('lingua.session_variable')`
3. يستدعي `app()->setLocale($locale)` للطلب الحالي
4. يُعيد التوجيه إلى الرابط الحالي (يُشغِّل إعادة تحميل كاملة للصفحة حتى تسري اللغة الجديدة في كل مكان)

في الطلب التالي، يقرأ `LinguaMiddleware` الجلسة ويطبق اللغة قبل تشغيل وحدات التحكم.

## أيقونات الأعلام

أيقونات الأعلام مدعومة بحزمة [`outhebox/blade-flags`](https://github.com/MohmmedAshraf/blade-flags)، التي تُثبَّت تلقائيًا كاعتمادية لـ Lingua.

تُطابَق الأعلام بـ`regional` للغة (مثل `en_US` → 🇺🇸، `fr_FR` → 🇫🇷). إذا لم يكن هناك رمز إقليمي محدد، يتراجع مكون العلم بأمان إلى عرض الرمز ذي الحرفين.

تعطيل الأعلام عالميًا:

```php
// config/lingua.php
'selector' => ['show_flags' => false],
```

أو لكل مثيل:

```blade
<livewire:lingua::language-selector :show-flags="false" />
```

## تخصيص عروض المحدد

انشر العروض لتجاوز الترميز:

```bash
php artisan vendor:publish --tag="lingua-views"
```

قوالب المحدد في:

```
resources/views/vendor/lingua/livewire/
├── language-selector.blade.php
└── selector/
    ├── sidebar.blade.php
    ├── dropdown.blade.php
    └── modal.blade.php
```

::: tip التكامل مع تنقلك الخاص
إذا كنت تستخدم مكونات الشريط الجانبي أو شريط التنقل في Flux، يندمج وضع `sidebar` بشكل طبيعي في `<flux:navlist>` أو `<flux:sidebar>`. انشر العرض وعدِّل الترميز ليتناسب مع هيكل تنقلك.
:::

## تحديث المحدد بعد التغييرات

يستمع المحدد إلى حدث `refreshLanguages` من Livewire. إذا أضفت أو أزلت لغة من واجهة الإدارة (أو برمجيًا)، يُعيد المحدد عرض نفسه تلقائيًا دون إعادة تحميل الصفحة.

```js
// Dispatch from any Livewire component or Alpine.js code:
this.$dispatch('refreshLanguages')
```

---

## وضع Headless

يُنتج محدد headless صفر من CSS وصفر من ترميز الإطار — HTML دلالي خالص مع سمات `data-lingua-*` تُنسّقها بالكامل باستخدام CSS الخاص بك أو Tailwind أو أي نهج آخر.

استخدم وضع headless عندما تحتاج إلى منطق تبديل اللغة ولكنك تريد تحكمًا كاملاً في المخرجات المرئية.

### الاستخدام الأساسي

```blade
<livewire:lingua::headless-language-selector />
```

قائمة اللغات موجودة دائمًا في DOM. الرؤية مسؤوليتك — استخدم CSS `display` أو Alpine.js `x-show` أو أي آلية أخرى. لا يوجد زر تشغيل مدمج بحسب التصميم.

فعّل وضع headless بشكل عام عبر ملف الإعداد أو صفحة الإعدادات:

```php
// config/lingua.php
'selector' => ['mode' => 'headless'],
```

### الفتحات المُسمَّاة

#### فتحة `$item`

تحل محل ترميز `<button>` الافتراضي داخل كل `<li>` للغة. تستقبل نسخة نموذج `Language`:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        {{ $language->native }} ({{ $language->code }})
    </x-slot>
</livewire:lingua::headless-language-selector>
```

#### فتحة `$current`

تحل محل عرض اللغة **المحددة حاليًا** فقط. تعود إلى `$item` إن لم تُوفَّر:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:current="language">
        <strong>{{ $language->native }}</strong>
    </x-slot>
    <x-slot:item="language">
        {{ $language->native }}
    </x-slot>
</livewire:lingua::headless-language-selector>
```

### واجهة استهداف CSS

يعرض المكوّن سمات `data-lingua-*` على كل عنصر لاستهداف CSS وJavaScript:

| السمة | العنصر |
|---|---|
| `data-lingua-selector` | عنصر `<nav>` الجذر |
| `data-lingua-list` | قائمة اللغات `<ul>` |
| `data-lingua-item` | كل مدخل `<li>` للغة |
| `data-lingua-active` | `<li>` اللغة النشطة حاليًا |
| `data-lingua-button` | `<button>` داخل كل `<li>` |
| `data-lingua-name` | `<span>` الاسم الإنجليزي للغة |
| `data-lingua-native` | `<span>` الاسم المحلي للغة |
| `data-lingua-code` | `<span>` رمز ISO للغة |

### أمثلة التنسيق

**CSS بسيط:**

```css
[data-lingua-selector] {
    display: flex;
    gap: 0.5rem;
    list-style: none;
}
[data-lingua-item] {
    cursor: pointer;
}
[data-lingua-active] {
    font-weight: bold;
    text-decoration: underline;
}
[data-lingua-button] {
    background: none;
    border: none;
    padding: 0.25rem 0.5rem;
}
```

**Tailwind CSS:**

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        <span class="px-3 py-1 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            {{ $language->native }}
        </span>
    </x-slot>
    <x-slot:current="language">
        <span class="px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900 font-semibold text-red-700 dark:text-red-300">
            {{ $language->native }}
        </span>
    </x-slot>
</livewire:lingua::headless-language-selector>
```

**تبديل الرؤية مع Alpine.js:**

```blade
<div x-data="{ open: false }">
    <button @click="open = !open">
        {{ app()->getLocale() }}
    </button>

    <div x-show="open" @click.outside="open = false">
        <livewire:lingua::headless-language-selector>
            <x-slot:item="language">
                <button class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                    {{ $language->native }}
                </button>
            </x-slot>
        </livewire:lingua::headless-language-selector>
    </div>
</div>
```

### مرجع الخصائص (محدَّث)

| الخاصية | النوع | الافتراضي | الوصف |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`، `'dropdown'`، `'modal'`، أو `'headless'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | إظهار أيقونات الأعلام |

::: tip
عند تمرير `mode="headless"` إلى `<livewire:lingua::language-selector />`، لا يعرض ذلك المكوّن شيئًا. استخدم `<livewire:lingua::headless-language-selector />` مباشرةً للحصول على دعم كامل للفتحات والسمات.
:::
