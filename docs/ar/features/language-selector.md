# محدد اللغة

مكون `<livewire:lingua::language-selector>` هو محوِّل لغة قابل للتضمين
لمستخدميك النهائيين — منفصل تماماً عن واجهة إدارة المشرف.

## الاستخدام الأساسي

```blade
<livewire:lingua::language-selector />
```

أضفه في أي مكان في تخطيطات Blade. يُعرض باستخدام الوضع المكوَّن في
`config/lingua.php` (`sidebar` افتراضياً).

## أوضاع العرض

### وضع الشريط الجانبي (الافتراضي)

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

يُعرض كقسم تنقل مجمَّع — مثالي للأشرطة الجانبية المبنية بـ Flux.

### وضع القائمة المنسدلة

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

يُعرض كزر قائمة منسدلة مضغوطة — مثالي للترويسات وأشرطة التنقل.

### وضع النافذة المنبثقة

```blade
<livewire:lingua::language-selector mode="modal" />
```

يُعرض كزر يفتح نافذة منتقي اللغة الكاملة.

## مرجع الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'` أو `'dropdown'` أو `'modal'` أو `'headless'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | عرض أيقونات أعلام البلدان |

```blade
{{-- Override per-instance --}}
<livewire:lingua::language-selector mode="dropdown" :show-flags="false" />
```

## كيف يعمل تبديل اللغة

<Badge type="tip" text="تغيّر في 2.0" /> عندما ينقر المستخدم على لغة:

1. يتحقق من وجود اللغة في جدول `languages`
2. يخزّن رمز اللغة في الجلسة تحت `config('lingua.session_variable')`
3. يستدعي `app()->setLocale($locale)`
4. يُعيد تحميل **الصفحة الحالية** (وليس الصفحة الرئيسية) — محمية من
   إعادة التوجيه المفتوحة عبر `Request::getRequestUri()` + حارس مسار محلي

في الطلب التالي، يقرأ `LinguaMiddleware` الجلسة ويطبق اللغة.

## مكوّن x-lingua::select (الواجهة الداخلية)

<Badge type="tip" text="جديد في 2.0" /> تستخدم صفحات الإدارة مكوّن
`x-lingua::select` المبني على **Popover API الأصلي**:

```blade
<x-lingua::select
    :options="$languages"
    wire:model="locale"
    placeholder="اختر لغة…"
/>
```

المكوّن يستخدم `popover="manual"` + `showPopover()` / `hidePopover()` —
يُزيل الحاجة إلى teleport أو حيل `z-index` ويحل مشكلة انقطاع
`transform`+`overflow` في حوارات Flux.

::: tip دعم المتصفح
Popover API مدعوم في جميع المتصفحات الحديثة (Chrome 114+، Firefox 125+،
Safari 17+). المتصفحات القديمة تتراجع بأمان إلى القائمة المنسدلة القياسية.
:::

## أيقونات الأعلام

الأعلام تُطابَق بـ `regional` للغة (مثل `en_US` → 🇺🇸). إذا لم يكن هناك
رمز إقليمي، يتراجع المكوّن بأمان إلى عرض رمز اللغة المكوَّن من حرفين.

تعطيل الأعلام عالمياً:

```php
// config/lingua.php
'selector' => ['show_flags' => false],
```

---

## وضع Headless

يُنتج محدد headless صفر من CSS وصفر من ترميز الإطار — HTML دلالي
خالص مع سمات `data-lingua-*`.

```blade
<livewire:lingua::headless-language-selector />
```

### الفتحات المُسمَّاة

**فتحة `$item`** — تحل محل ترميز `<button>` الافتراضي لكل لغة:

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        {{ $language->native }} ({{ $language->code }})
    </x-slot>
</livewire:lingua::headless-language-selector>
```

**فتحة `$current`** — تحل محل عرض اللغة المحددة حالياً فقط:

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

| السمة | العنصر |
|---|---|
| `data-lingua-selector` | `<nav>` الجذر |
| `data-lingua-list` | `<ul>` قائمة اللغات |
| `data-lingua-item` | كل `<li>` لغة |
| `data-lingua-active` | `<li>` اللغة النشطة |
| `data-lingua-button` | `<button>` داخل كل `<li>` |
| `data-lingua-native` | `<span>` الاسم المحلي |
| `data-lingua-code` | `<span>` رمز ISO |

### مثال Tailwind

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        <span class="px-3 py-1 rounded-full text-sm hover:bg-gray-100 transition-colors cursor-pointer">
            {{ $language->native }}
        </span>
    </x-slot>
    <x-slot:current="language">
        <span class="px-3 py-1 rounded-full text-sm bg-red-100 font-semibold text-red-700">
            {{ $language->native }}
        </span>
    </x-slot>
</livewire:lingua::headless-language-selector>
```

### مثال Alpine.js للقائمة المنسدلة

```blade
<div x-data="{ open: false }">
    <button @click="open = !open">{{ app()->getLocale() }}</button>

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
