# المزامنة ثنائية الاتجاه

يمكن لـ Lingua استيراد الترجمات من الملفات المحلية إلى قاعدة البيانات
وتصديرها مرة أخرى — مما يمنحك أفضل ما في الأمرين: تشغيل مدعوم بقاعدة
البيانات والتحكم في الإصدار المستند إلى الملفات.

```
lang/en/*.php        ──┐
lang/en.json           │  lingua:sync-to-database ──►  language_lines (DB)
lang/fr/*.php          │
lang/fr.json           │  ◄── lingua:sync-to-local
lang/vendor/…          │
                      ─┘
```

---

## مزامنة إلى قاعدة البيانات

يستورد جميع ملفات الترجمة من `lang/` إلى `language_lines`.

```bash
php artisan lingua:sync-to-database
```

### ما يُستورد

- `lang/{locale}/*.php` — ملفات PHP القياسية
- `lang/{locale}.json` — ملفات JSON
- `lang/vendor/{package}/{locale}/*.php` — ترجمات المورّد

### سلوك Upsert

تستخدم Lingua `updateOrCreate` مع تطابق `group` + `key`:

- **المفاتيح الجديدة** تُدرج
- **المفاتيح الموجودة** يُدمَج JSON لـ `text` — قيم اللغات المُعدَّلة في
  الواجهة **تُحافظ عليها**
- **اكتشاف النوع** يحدد `text` / `html` / `markdown` تلقائياً

| قاعدة الاكتشاف | النوع |
|---|---|
| النص يحتوي على وسوم HTML (`<…>`) | `html` |
| النص يُحلَّل كـ Markdown | `markdown` |
| خلاف ذلك | `text` |

### عبر الـ Facade

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::syncToDatabase();
```

---

## مزامنة إلى الملفات المحلية

يُصدِّر جميع الترجمات من `language_lines` إلى ملفات PHP وJSON في `lang/`.

```bash
php artisan lingua:sync-to-local
```

### ما يُصدَّر

- الترجمات غير المورّد → `lang/{locale}/{group}.php`
- مجموعة `single` (JSON) → `lang/{locale}.json`
- ترجمات المورّد → `lang/vendor/{vendor}/{locale}/{group}.php`

### حالات الاستخدام

- **التحكم في الإصدار** — تتبع تغييرات الترجمة عبر Git
- **خطوط النشر** — صدِّر قبل النشر إذا كانت الأدوات الأدنى تتوقع ملفات
- **النسخ الاحتياطي** — لقطة في نقطة زمنية محددة

```php
Lingua::syncToLocal();
```

---

## الإلغاء الدقيق للتخزين المؤقت <Badge type="tip" text="جديد في 2.0" />

**لا يوجد `cache:clear` عام في أي مسار مزامنة.** عند كتابة ترجمة أو
مزامنتها:

1. يُحدَّد المفتاح `lingua.trans.{locale}.{group}` المتأثر
2. يُنسى فقط ذلك المفتاح من التخزين المؤقت
3. المجموعات الأخرى تبقى مخزَّنة مؤقتاً — لا وقت توقف

---

## تحديث اللغات

يُحدِّث الترجمات المدمجة من مجموعة البيانات الداخلية لـ Lingua.

```bash
php artisan lingua:update-lang
```

::: tip
في 2.0، لا يتطلب هذا تنزيل `laravel-lang` — البيانات مدمجة داخل
الحزمة. الأمر يتحقق من الإصدار ويُحدِّث مجموعات `auth`، `validation`،
إلخ بدون لمس ترجماتك المخصصة.
:::

---

## سير عمل المزامنة الآلية

### عند النشر

```bash
# In deploy script or CI/CD
php artisan lingua:sync-to-database
php artisan optimize:clear
```

### عبر المجدول

```php
// routes/console.php
Schedule::command('lingua:sync-to-database')->hourly();
```

---

## نصائح وتحذيرات

::: tip قاعدة البيانات مصدر الحقيقة
تعامل مع قاعدة البيانات كمصدر أساسي. زامن إلى الملفات فقط
عند الحاجة للتحكم بالإصدار أو النشر. تجنب تعديل الملفات المحلية مباشرةً
بينما قاعدة البيانات قيد الاستخدام — المزامنة التالية ستستبدل تعديلاتك
للمفاتيح الموجودة.
:::

::: warning وضع الملفات
في محرك `file`، الترجمات تُقرأ مباشرةً من `lang/` ولا يوجد جدول
`language_lines`. استخدم أوامر Artisan الملائمة بدلاً من `sync-to-database`.
:::

::: tip رحلة كاملة ذهاباً وإياباً
1. `lingua:sync-to-local` — صدِّر كل شيء
2. عدِّل الملفات على القرص
3. `lingua:sync-to-database` — أعِد الاستيراد
:::
