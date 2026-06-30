# نشر الأصول

يوفر Lingua مجموعة من الوسوم القابلة للنشر لتخصيص ملفات الإعداد
والهجرات وملفات الترجمة والعروض.

## وسوم النشر المتاحة

| الوسم | الوصف |
|---|---|
| `lingua-config` | ملف الإعداد الرئيسي (`config/lingua.php`) |
| `lingua-migrations` | ملفات الهجرة الواعية بالمحرك |
| `lingua-translations` | ملفات ترجمة واجهة Lingua نفسها |
| `lingua-views` | عروض Blade القابلة للتجاوز |

::: tip وسم `lingua-assets` مُزال في 2.0
في الإصدارات السابقة، كان وسم `lingua-assets` يُنشر ملفات CSS/JS إلى
`public/vendor/lingua`. **أُزيل هذا الوسم في 2.0** — الأصول تُقدَّم
الآن عبر مسار مُضمَّن في الحزمة بدون حاجة للنشر.
:::

---

## lingua-config

```bash
php artisan vendor:publish --tag="lingua-config"
```

يُنشر إلى: `config/lingua.php`

يحتوي هذا الملف على جميع إعدادات Lingua. راجع صفحة
[الإعداد](/ar/guide/configuration) لتوثيق كل مفتاح.

لإعادة النشر مع التجاوز:

```bash
php artisan vendor:publish --tag="lingua-config" --force
```

---

## lingua-migrations

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

يُنشر إلى: `database/migrations/`

في Lingua 2.0، الهجرات **واعية بالمحرك**:

- اختيار `database` في `lingua:install` ينشر **3 ملفات هجرة**:
  1. `create_languages_table.php`
  2. `create_language_lines_table.php`
  3. `create_lingua_settings_table.php`

- اختيار `file` في `lingua:install` ينشر **2 ملف هجرة**:
  1. `create_languages_table.php`
  2. `create_lingua_settings_table.php`

::: tip لا تُعدِّل الهجرات مباشرةً
لتخصيص المخطط (مثل إضافة فهارس إضافية)، أنشئ هجرة منفصلة
تُعدِّل الجداول. تجنب تعديل الملفات المنشورة مباشرةً لتسهيل
الترقية.
:::

---

## lingua-translations

```bash
php artisan vendor:publish --tag="lingua-translations"
```

يُنشر إلى: `lang/vendor/lingua/`

هذه ملفات ترجمة واجهة Lingua **نفسها** (أسماء القوائم، رسائل الأخطاء،
حوارات التأكيد). إذا أردت تخصيص نصوص الواجهة أو إضافة لغة غير مدعومة،
انشر هذا الوسم وعدِّله.

اللغات المدعومة في واجهة Lingua: `ar`، `de`، `en`، `es`، `fr`، `hi`، `it`، `pt`، `ru`، `zh`.

```
lang/vendor/lingua/
├── ar/lingua.php
├── en/lingua.php
├── fr/lingua.php
└── …
```

---

## lingua-views

```bash
php artisan vendor:publish --tag="lingua-views"
```

يُنشر إلى: `resources/views/vendor/lingua/`

ينشر جميع قوالب Blade لصفحات إدارة Lingua والمكوّنات.

::: warning تجاوز العروض
عند تخصيص العروض المنشورة، تتحمل مسؤولية دمج التغييرات
عند ترقية Lingua. استخدم هذا الوسم بتحفُّظ — حاول التخصيص بـ
CSS مخصص أو عبر خيارات الإعداد أولاً.
:::

---

## النشر عبر معالج التثبيت

يتولى معالج `lingua:install` نشر الوسوم الضرورية تلقائياً. الأمر
اليدوي مفيد لـ:

- إعادة نشر ملف إعداد بعد ترقية
- نشر عروض للتخصيص
- تخصيص واجهة Lingua للغة غير مدعومة

```bash
# Re-publish all tags after upgrade
php artisan vendor:publish --tag="lingua-config" --force
php artisan vendor:publish --tag="lingua-translations" --force
```
