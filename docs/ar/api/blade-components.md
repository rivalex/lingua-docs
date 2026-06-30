# مكونات Blade

تُسجِّل Lingua مكونات Blade مجهولة تحت البادئة `lingua::`. تُستخدم
داخلياً في عروض Livewire ويمكن إعادة استخدامها في قوالبك الخاصة.

---

## `<x-lingua::nav>` <Badge type="tip" text="جديد في 2.0" />

قائمة التنقل المشتركة التي تظهر على جميع صفحات Lingua الخمس.

```blade
<x-lingua::nav :current="'languages'" />
```

| الخاصية | النوع | الوصف |
|---|---|---|
| `current` | string | اسم الصفحة الحالية لتمييز الرابط النشط |

يمكن تعطيلها من الإعدادات أو `config/lingua.php`:

```php
'nav' => ['enabled' => false],
```

---

## `<x-lingua::select>` <Badge type="tip" text="جديد في 2.0" />

حقل اختيار مدعوم بـ **Popover API الأصلي** (`popover="manual"`).
يحل مشكلة انقطاع `transform`+`overflow` في حوارات Flux.

```blade
<x-lingua::select
    :options="$languages"
    wire:model="locale"
    placeholder="اختر لغة…"
/>
```

| الخاصية | النوع | الوصف |
|---|---|---|
| `options` | Collection/array | خيارات القائمة |
| `wire:model` | - | ربط Livewire |
| `placeholder` | string | نص عنصر نائب |

---

## `<x-lingua::stat>`

يعرض بطاقة إحصاء مع رقم وتسمية.

```blade
<x-lingua::stat :value="$total" label="إجمالي الترجمات" />
```

---

## `<x-lingua::card>` و `<x-lingua::card.row>`

حاوية بطاقة مع صفوف للإعدادات وصفحات التفصيل.

```blade
<x-lingua::card>
    <x-lingua::card.row label="وضع المحدد">
        sidebar
    </x-lingua::card.row>
</x-lingua::card>
```

---

## `<x-lingua::branding>`

شارة العلامة التجارية وأيقونة Lingua.

```blade
<x-lingua::branding />
```

---

## `<x-lingua::validation-errors>`

يعرض أخطاء تحقق Livewire.

```blade
<x-lingua::validation-errors />
```

---

## `<x-lingua::editor>`

محرر متعدد الأشكال (`text`/`html`/`markdown`). انظر [محرر النص الغني](/ar/features/rich-text).

```blade
<x-lingua::editor wire:model="value" type="html" label="المحتوى" />
```

| الخاصية | النوع | الافتراضي | الوصف |
|---|---|---|---|
| `type` | string | `'text'` | `'text'` أو `'html'` أو `'markdown'` |
| `label` | string | `''` | تسمية اختيارية |
| `placeholder` | string | `''` | عنصر نائب |
| `required` | bool | `false` | شارة مطلوب |

---

## `<x-lingua::clipboard>`

يضيف زر نسخ إلى الحافظة.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

| الخاصية | النوع | الوصف |
|---|---|---|
| `text-to-copy` | string | النص المُنسَخ |
| `show-tooltip` | bool | عرض تلميح عند التمرير |

---

## `<x-lingua::language-flag>`

يعرض أيقونة علم واسم لغة.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

يتراجع بأمان إلى عرض الرمز النصي إذا لم يتوفر علم للرمز.

---

## `<x-lingua::message>`

رسالة مؤقتة تظهر بعد حدث Livewire.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

| الخاصية | النوع | الافتراضي | الوصف |
|---|---|---|---|
| `on` | string | - | اسم حدث Livewire |
| `delay` | int | `1500` | مدة الظهور بالميلي ثانية |

---

## `<x-lingua::autocomplete>`

حقل إدخال بإكمال تلقائي.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="مثل: marketing"
/>
```

---

## `<x-lingua::menu-group>`

مجموعة تنقل للأشرطة الجانبية.

```blade
<x-lingua::menu-group heading="اللغات">
    {{-- menu items --}}
</x-lingua::menu-group>
```

---

## تخصيص المكونات

```bash
php artisan vendor:publish --tag="lingua-views"
```

المكونات المنشورة في `resources/views/vendor/lingua/components/`.
