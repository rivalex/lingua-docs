# تخزين الترجمات

فهم كيفية تخزين الترجمات يساعدك على الاستعلام عنها واستيرادها وتصديرها بشكل صحيح.

## جدول `language_lines`

كل صف في `language_lines` يمثل **نصًا** واحدًا قابلًا للترجمة — وليس لغة واحدة. جميع قيم اللغات مخزّنة معًا في عمود JSON واحد لـ `text`:

```
group      | key        | type | text
-----------|------------|------|---------------------------------------------------
validation | required   | text | {"en":"The :attribute field is required.","fr":"Le champ :attribute est obligatoire."}
auth       | failed     | text | {"en":"These credentials do not match.","it":"Le credenziali non corrispondono."}
single     | Welcome    | text | {"en":"Welcome","fr":"Bienvenue","de":"Willkommen"}
emails     | subject    | html | {"en":"<b>Welcome</b> to our platform!"}
```

### فوائد هذا التصميم

- **صف واحد لكل نص** — لا صفوف لكل لغة للإدارة
- **إضافة لغة غير مدمِّرة** — فقط أضف مفتاحًا جديدًا لكائن JSON
- **الترجمات الناقصة صريحة** — إذا غابت `fr` من JSON، النص لم يُترجم بعد
- **استعلام واحد** — `SELECT` واحد يجلب جميع قيم اللغات لمفتاح ما

### الاستعلام المباشر

يمكنك الاستعلام عن `language_lines` باستخدام صياغة عمود JSON القياسية في Eloquent:

```php
use Rivalex\Lingua\Models\Translation;

// All translations that have a French value
Translation::whereNotNull('text->fr')->get();

// Only missing French translations
Translation::whereNull('text->fr')->get();

// Find a specific key
Translation::where('key', 'required')->where('group', 'validation')->first();

// All strings in a group
Translation::where('group', 'auth')->get();
```

## أنواع الترجمات

كل صف ترجمة له `type` يحدد المحرر المستخدم في الواجهة:

| النوع | حالة الاستخدام | يُكشف تلقائيًا عند المزامنة |
|---|---|---|
| `text` | تسميات عادية، رسائل، نص أزرار | الافتراضي |
| `html` | محتوى غني بوسوم HTML | النص يحتوي على عناصر HTML |
| `markdown` | محتوى منسَّق بـ Markdown | النص يُحلَّل كـ Markdown |

يُنجَز اكتشاف النوع أثناء `lingua:sync-to-database`. يمكنك تغيير النوع في أي وقت عبر نافذة التعديل في الواجهة.

### مثال: ترجمة HTML

```php
Translation::create([
    'group' => 'marketing',
    'key'   => 'hero_subtitle',
    'type'  => 'html',
    'text'  => ['en' => '<strong>Build faster</strong> with fewer tools.'],
]);
```

### مثال: ترجمة Markdown

```php
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_body',
    'type'  => 'markdown',
    'text'  => ['en' => "# Welcome!\n\nThank you for signing up.\n\n**Your account is now active.**"],
]);
```

## مفاتيح الترجمة

تستخدم Lingua نفس اتفاقية `group.key` المكونة من جزأين كترجمات Laravel القياسية:

| الصيغة | مثال | استدعاء `trans()` |
|---|---|---|
| مفتاح ملف PHP | `auth.failed` | `__('auth.failed')` |
| مفتاح JSON / فردي | `Welcome` | `__('Welcome')` |
| مفتاح حزمة خارجية | `spatie::messages.error` | عبر مساحة اسم الحزمة |

::: tip group مقابل key
عمود `group` يرتبط باسم الملف (`auth` = `lang/en/auth.php`) وعمود `key` يرتبط بمفتاح المصفوفة داخل ذلك الملف. لملفات JSON، المجموعة هي `'single'`.
:::

## ترجمات الحزم الخارجية

ترجمات الحزم الخارجية مُصنَّفة بـ `is_vendor = true` وتحمل سلسلة `vendor` (مثل `'spatie'`, `'laravel'`). تُزامَن من مجلدات `lang/vendor/{vendor}/{locale}/`.

- **يمكن تعديلها** في الواجهة (لتجاوز صياغة الحزمة)
- **لا يمكن حذفها** — محاولة الحذف تُطلق حدث `vendor_translation_protected`
- حقلا `group` و`key` **مقفلان** في نافذة التعديل

انظر [ترجمات الحزم الخارجية](/ar/features/vendor-translations) للتفاصيل الكاملة.
