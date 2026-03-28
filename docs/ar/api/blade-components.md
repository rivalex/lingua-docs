# مكونات Blade

تُسجِّل Lingua عدة مكونات Blade مجهولة تحت البادئة `lingua::`. تُستخدم هذه داخليًا في عروض Livewire ويمكن إعادة استخدامها في قوالبك الخاصة.

## `<x-lingua::editor>`

مكون محرر متعدد الأشكال يُعرض كـ `<textarea>` أو محرر HTML بـ TipTap أو محرر Markdown بـ TipTap بناءً على خاصية `type`.

```blade
{{-- Plain text --}}
<x-lingua::editor
    wire:model="value"
    type="text"
    placeholder="Enter text…"
/>

{{-- HTML --}}
<x-lingua::editor
    wire:model="value"
    type="html"
    label="Body content"
    :required="true"
/>

{{-- Markdown --}}
<x-lingua::editor
    wire:model="value"
    type="markdown"
    placeholder="Write in Markdown…"
/>
```

### الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
|---|---|---|---|
| `type` | string | `'text'` | `'text'` أو `'html'` أو `'markdown'` |
| `label` | string | `''` | تسمية اختيارية فوق الحقل |
| `placeholder` | string | `''` | نص العنصر النائب |
| `required` | bool | `false` | يعرض شارة مطلوب |
| `wire:model` | - | - | ربط نموذج Livewire |

---

## `<x-lingua::clipboard>`

غلاف يضيف زر نسخ إلى الحافظة حول محتوى slot.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

النقر على المكون ينسخ `text-to-copy` إلى الحافظة ويعرض علامة صح لفترة وجيزة.

### الخصائص

| الخاصية | النوع | الوصف |
|---|---|---|
| `text-to-copy` | string | النص المراد نسخه إلى الحافظة |
| `show-tooltip` | bool | عرض تلميح عند التمرير (الافتراضي: `false`) |

---

## `<x-lingua::language-flag>`

يُعرض أيقونة علم واسم اللغة للغة معطاة.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

### الخصائص

| الخاصية | النوع | الوصف |
|---|---|---|
| `name` | string | اسم اللغة بالإنجليزية |
| `code` | string | رمز اللغة للبحث عن العلم |
| `description` | string | الاسم الأصلي للغة (عنوان فرعي) |

يستخدم `outhebox/blade-flags` لصور SVG للأعلام. إذا لم يكن علم متاحًا للرمز، يتراجع بأمان إلى عرض نص الرمز.

---

## `<x-lingua::message>`

مكون رسالة مؤقتة يظهر لفترة قصيرة بعد حدث Livewire.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

### الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
|---|---|---|---|
| `on` | string | - | اسم حدث Livewire للاستماع إليه |
| `delay` | int | `1500` | المدة بالميلي ثانية قبل الإخفاء |

---

## `<x-lingua::autocomplete>`

مكون حقل إدخال بإكمال تلقائي يُستخدم في نموذج إنشاء الترجمة.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="e.g. marketing"
/>
```

### الخصائص

| الخاصية | النوع | الوصف |
|---|---|---|
| `wire:model` | - | ربط نموذج Livewire |
| `suggestions` | array | مصفوفة اقتراحات الإكمال التلقائي |
| `placeholder` | string | عنصر نائب لحقل الإدخال |

---

## `<x-lingua::menu-group>`

مكون مجموعة تنقل للقوائم الجانبية.

```blade
<x-lingua::menu-group heading="Languages">
    {{-- menu items slot --}}
</x-lingua::menu-group>
```

### الخصائص

| الخاصية | النوع | الوصف |
|---|---|---|
| `heading` | string | نص عنوان المجموعة |

---

## تخصيص المكونات

انشر جميع عروض المكونات لتجاوزها:

```bash
php artisan vendor:publish --tag="lingua-views"
```

العروض المنشورة في `resources/views/vendor/lingua/components/`. يستخدم Laravel إصدارك المنشور تلقائيًا.
