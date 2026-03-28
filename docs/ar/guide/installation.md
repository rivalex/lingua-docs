# التثبيت

تأتي Lingua مع معالج تثبيت تفاعلي يتولى كل شيء في أمر واحد. الخطوات اليدوية موثقة أيضًا أدناه إذا كنت تفضل مزيدًا من التحكم.

## الخطوة 1 - التثبيت عبر Composer

```bash
composer require rivalex/lingua
```

## الخطوة 2 - تشغيل المثبِّت

```bash
php artisan lingua:install
```

سيقوم المعالج بـ:

1. نشر ملف الإعدادات إلى `config/lingua.php`
2. نشر هجرات قاعدة البيانات
3. السؤال عن تشغيل الهجرات تلقائيًا
4. بذر قاعدة البيانات بلغتك الافتراضية (الإنجليزية افتراضيًا) وجميع ترجماتها من Laravel Lang
5. خيار لتمييز المستودع بنجمة على GitHub ⭐

عند الانتهاء ستظهر:

```
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua package installed successfully!
```

## الخطوة 3 - الوصول إلى الواجهة

افتح تطبيقك وزر:

| الصفحة | الرابط | اسم المسار |
|---|---|---|
| اللغات | `your-app.test/lingua/languages` | `lingua.languages` |
| الترجمات | `your-app.test/lingua/translations` | `lingua.translations` |

هذا كل شيء. Lingua تعمل الآن.

---

## التثبيت اليدوي

إذا كنت تفضل نشر وتشغيل كل خطوة بشكل منفصل:

```bash
# 1. Publish config
php artisan vendor:publish --tag="lingua-config"

# 2. Publish migrations
php artisan vendor:publish --tag="lingua-migrations"

# 3. Run migrations
php artisan migrate

# 4. Seed default language + translations
php artisan db:seed --class="Rivalex\Lingua\Database\Seeders\LinguaSeeder"
```

---

## حماية واجهة الإدارة

بشكل افتراضي تستخدم مسارات Lingua وسيط `web` فقط - لا يُطبَّق حارس مصادقة تلقائيًا. **يجب عليك إضافة وسيطك الخاص** قبل النشر للإنتاج.

### عبر الإعدادات

```php
// config/lingua.php
'middleware' => ['web', 'auth'],
```

### مع حراس الأدوار/الصلاحيات (مثل Spatie Permission)

```php
'middleware' => ['web', 'auth', 'role:admin'],
// أو
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

::: tip
أي وسيط يقبله موجّه Laravel يمكن إضافته إلى المصفوفة. التغييرات تسري فورًا - لا حاجة لمسح الذاكرة المؤقتة.
:::

---

## قائمة التحقق بعد التثبيت

- [ ] أضف وسيط المصادقة إلى `config/lingua.php`
- [ ] أضف مكون اختيار اللغة إلى تخطيطك (انظر [محدد اللغة](/ar/features/language-selector))
- [ ] اضبط `dir` و`lang` على وسم `<html>` (انظر [دعم RTL/LTR](/ar/features/rtl-support))
- [ ] أضف لغات إضافية عبر `php artisan lingua:add {locale}`
- [ ] اضبط شريط أدوات المحرر في `config/lingua.php` إذا كنت تستخدم ترجمات HTML/Markdown
