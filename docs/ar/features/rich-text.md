# محرر النص الغني

تضمِّن Lingua [TipTap 3](https://tiptap.dev) كمحرر نص غني اختياري لأنواع ترجمات HTML وMarkdown. يتفعّل المحرر الصحيح تلقائيًا بناءً على عمود `type` الخاص بالترجمة.

## أنواع الترجمات

| النوع | المحرر | الوصف |
|---|---|---|
| `text` | `<textarea>` عادية | الافتراضي لجميع الترجمات القياسية |
| `html` | TipTap WYSIWYG | للمحتوى الذي يجب عرضه بتنسيق HTML |
| `markdown` | TipTap Markdown | للمحتوى المكتوب بصياغة Markdown |

## إعداد شريط الأدوات

يُتحكَّم في شريط أدوات المحرر عالميًا عبر `config/lingua.php`:

```php
'editor' => [
    'headings'      => false,  // H1-H3 heading buttons
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'bullet'        => true,   // Unordered list
    'ordered'       => true,   // Ordered list
    'clear'         => true,   // Clear formatting
],
```

فعِّل فقط الخيارات التي يحتاجها محتواك فعليًا. إبقاء شريط الأدوات بسيطًا يُقلِّل العبء المعرفي على المترجمين.

<Screenshot src="/screenshots/editor-toolbar.png" alt="شريط أدوات المحرر" caption="شريط أدوات محرر HTML مع الخيارات الافتراضية النشطة." />

## تغيير نوع الترجمة

في نافذة التعديل (أيقونة القلم، اللغة الافتراضية فقط)، اختر النوع المطلوب من قائمة **النوع** المنسدلة. يتحدث المحرر فورًا في الصف دون إعادة تحميل الصفحة.

::: tip الاكتشاف التلقائي
عندما تشغِّل `lingua:sync-to-database` لأول مرة، تكتشف Lingua النوع تلقائيًا بناءً على المحتوى. يمكنك تجاوزه يدويًا في أي وقت — القيمة المخزّنة لا تتغير عند تغيير النوع، فقط سلوك المحرر.
:::

## العمل مع ترجمات HTML

ترجمات HTML تُخزَّن كـ HTML خام في عمود JSON لـ `text`:

```json
{"en": "<p>Welcome to <strong>Lingua</strong> — the translation manager for Laravel.</p>"}
```

لعرضها في Blade دون escape مزدوج:

```blade
{{-- Always use {!! !!} for HTML translation types --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
استخدم `{!! !!}` فقط لنصوص الترجمة التي تُدار من قِبَل مستخدمين مخوَّلين في لوحة إدارة محكومة. لا تعرض مدخلات المستخدم غير الموثوقة كـ HTML خام أبدًا.
:::

## العمل مع ترجمات Markdown

ترجمات Markdown تخزّن Markdown الخام:

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**.\n\n- Feature one\n- Feature two"}
```

لعرض Markdown في Blade، استخدم محلل Markdown. يشحن Laravel بـ `Str::markdown()`:

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

أو استخدم حزمة مخصصة مثل [league/commonmark](https://commonmark.thephpleague.com).

## مكون `x-lingua::editor`

يُكشف المحرر كمكون Blade يمكن إعادة استخدامه خارج واجهة إدارة Lingua:

```blade
{{-- Text mode --}}
<x-lingua::editor
    wire:model="myField"
    type="text"
    placeholder="Enter text…"
/>

{{-- HTML mode --}}
<x-lingua::editor
    wire:model="myField"
    type="html"
    label="Body content"
    :required="true"
/>

{{-- Markdown mode --}}
<x-lingua::editor
    wire:model="myField"
    type="markdown"
    placeholder="Write in Markdown…"
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

::: tip
مكون `x-lingua::editor` نقطة بداية رائعة لأي نموذج Livewire يحتاج إلى حقل نص غني. انشر عرض المكون لتخصيص شريط الأدوات أو التصميم.
:::
