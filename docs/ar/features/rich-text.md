# محرر النص الغني

تضمِّن Lingua [TipTap 3](https://tiptap.dev) كمحرر نص غني اختياري
لأنواع ترجمات HTML وMarkdown. يتفعَّل المحرر الصحيح تلقائياً بناءً على
عمود `type` الخاص بالترجمة.

::: tip محرك قاعدة البيانات فقط
محرر النص الغني متاح فقط مع محرك `database`. في محرك `file`، جميع
الترجمات تُعامَل كنص عادي.
:::

## أنواع الترجمات

| النوع | المحرر | الوصف |
|---|---|---|
| `text` | `<textarea>` عادية | الافتراضي لجميع الترجمات القياسية |
| `html` | TipTap WYSIWYG | محتوى يُعرض كـ HTML |
| `markdown` | TipTap Markdown | محتوى بصياغة Markdown |

---

## إعداد شريط الأدوات

يُتحكَّم في شريط الأدوات عبر `config/lingua.php`:

```php
'editor' => [
    'headings'      => false,  // H1-H3
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'subscript'     => true,
    'superscript'   => true,
    'blockquote'    => false,
    'code-line'     => false,
    'code-block'    => false,
    'bullet'        => true,   // Unordered list
    'ordered'       => true,   // Ordered list
    'clear'         => true,   // Clear formatting
    'code-mode'     => false,  // Raw HTML toggle
],
```

فعِّل فقط الخيارات التي يحتاجها محتواك. إبقاء شريط الأدوات بسيطاً
يُقلِّل العبء المعرفي على المترجمين.

---

## تغيير نوع الترجمة

في نافذة التعديل (أيقونة القلم، اللغة الافتراضية فقط):

1. انقر أيقونة القلم في العمود الافتراضي
2. غيِّر النوع من القائمة المنسدلة
3. احفظ — يتحدث المحرر فوراً في الصف

::: tip الاكتشاف التلقائي
عند `lingua:sync-to-database`، يكتشف Lingua النوع تلقائياً من المحتوى.
يمكنك تجاوزه يدوياً — القيمة المخزَّنة لا تتغير، فقط سلوك المحرر.
:::

---

## العمل مع ترجمات HTML

تُخزَّن كـ HTML خام في عمود JSON:

```json
{"en": "<p>Welcome to <strong>Lingua</strong>.</p>"}
```

لعرضها في Blade:

```blade
{{-- Always use {!! !!} for HTML translation types --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
استخدم `{!! !!}` فقط لترجمات تُدار من قِبَل مستخدمين مخوَّلين في
لوحة إدارة محكومة. حارس F1 (XSS) يُعقِّم القيم عند الحفظ، لكن ابقَ
يقظاً عند عرض HTML الخام.
:::

---

## العمل مع ترجمات Markdown

تُخزَّن Markdown الخام:

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**.\n\n- Feature one\n- Feature two"}
```

لعرض Markdown في Blade:

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

---

## مكوّن `x-lingua::editor`

المحرر مكشوف كمكوّن Blade قابل لإعادة الاستخدام:

```blade
{{-- Text mode --}}
<x-lingua::editor
    wire:model="myField"
    type="text"
    placeholder="أدخل النص…"
/>

{{-- HTML mode --}}
<x-lingua::editor
    wire:model="myField"
    type="html"
    label="محتوى النص"
    :required="true"
/>

{{-- Markdown mode --}}
<x-lingua::editor
    wire:model="myField"
    type="markdown"
    placeholder="اكتب بـ Markdown…"
/>
```

### الخصائص

| الخاصية | النوع | الوصف |
|---|---|---|
| `wire:model` | string | خاصية Livewire للربط |
| `type` | string | `'text'` أو `'html'` أو `'markdown'` |
| `label` | string | تسمية اختيارية فوق المحرر |
| `placeholder` | string | نص العنصر النائب |
| `required` | bool | يعرض شارة مطلوب عندما يكون `true` |
