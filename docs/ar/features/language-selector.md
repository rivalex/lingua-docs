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
