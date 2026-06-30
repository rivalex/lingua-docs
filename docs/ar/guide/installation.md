# التثبيت

تأتي Lingua مع معالج تثبيت تفاعلي يتولى كل شيء
في أمر واحد. الخطوات اليدوية موثقة أيضاً أدناه إذا كنت
تفضل مزيداً من التحكم.

## الخطوة 1 — التثبيت عبر Composer

```bash
composer require rivalex/lingua
```

هذه الحزمة الوحيدة التي تحتاجها. يُدمج Lingua 2.0 بيانات
اللغات الخاصة به ومجموعة الترجمات، لذا لا يوجد ما يجب طلبه غيره.

::: tip الترقية من 1.x؟
يُزيل Composer تلقائياً اعتمادية `spatie/laravel-translation-loader`
القديمة. إذا كان `composer.json` الخاص بك يُدرج
`laravel-lang/common`، احذفه: `composer remove laravel-lang/common`.
راجع [دليل الترقية](/ar/guide/upgrade) الكامل.
:::

## الخطوة 2 — تشغيل المثبِّت

```bash
php artisan lingua:install
```

المعالج تفاعلي. باستخدام
[Laravel Prompts](https://laravel.com/docs/prompts)، يطلب منك اختيار
**محرك التخزين** بمحدد مفاتيح الأسهم:

| المحرك | اختره عندما… |
|---|---|
| **`database`** *(موصى به)* | تريد المجموعة الكاملة: أنواع HTML/Markdown، الإحصائيات، الاستيراد/التصدير، حارس المورّد، والتخزين المؤقت الدقيق. |
| **`file`** | تحتفظ بالترجمات في التحكم بالإصدار أو تعمل في بيئة للقراءة فقط/CI وتفضل ملفات `lang/` العادية. |

ثم يقوم المعالج بـ:

1. نشر ملف الإعدادات إلى `config/lingua.php`
2. نشر الهجرات **الواعية بالمحرك** (محرك `file` يتخطى
   هجرة `language_lines`)
3. السؤال عن تشغيل الهجرات تلقائياً
4. بذر قاعدة البيانات بلغتك الافتراضية وترجماتها من
   مجموعة البيانات المدمجة — **بدون تنزيلات من GitHub**
5. خيار لتمييز المستودع بنجمة على GitHub ⭐

عند الانتهاء ستظهر:

```
✓ Driver selected          →  database
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua installed successfully!
```

## الخطوة 3 — الوصول إلى الواجهة

افتح تطبيقك وزر:

| الصفحة | الرابط | اسم المسار |
|---|---|---|
| اللغات | `your-app.test/lingua/languages` | `lingua.languages` |
| الترجمات | `your-app.test/lingua/translations` | `lingua.translations` |
| الإحصائيات | `your-app.test/lingua/statistics` | `lingua.statistics` |
| النقل | `your-app.test/lingua/transfer` | `lingua.transfer` |
| الإعدادات | `your-app.test/lingua/settings` | `lingua.settings` |

هذا كل شيء. Lingua تعمل الآن.

---

## التثبيت اليدوي

إذا كنت تفضل نشر وتشغيل كل خطوة بشكل منفصل:

```bash
# 1. Publish config
php artisan vendor:publish --tag="lingua-config"

# 2. Publish migrations (driver-aware)
php artisan vendor:publish --tag="lingua-migrations"

# 3. Run migrations
php artisan migrate

# 4. Add your default language and seed its translations
php artisan lingua:add en
```

انظر [نشر الأصول](/ar/guide/publishing) للقائمة الكاملة للوسوم.

---

## حماية واجهة الإدارة

<Badge type="tip" text="جديد في 2.0" /> Lingua 2.0 **آمن افتراضياً**. مسارات الإدارة
تشحن مع وسيط `['web', 'auth']` مطبَّق تلقائياً — الزوار المجهولون
لا يمكنهم الوصول إلى الواجهة.

### تشديد الوصول ببوابة

للوصول القائم على الأدوار، حدِّد بوابة تفويض وأشر Lingua إليها
بمتغير البيئة `LINGUA_GATE`. تُلحق Lingua `can:{gate}`
بمسارات الإدارة:

```env
LINGUA_GATE=manage-translations
```

```php
// app/Providers/AppServiceProvider.php — boot()
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $user) => $user->hasRole('admin'));
```

يمكنك أيضاً تعديل مصفوفة الوسيط مباشرةً:

```php
// config/lingua.php
'middleware' => ['web', 'auth', 'role:admin'],
```

::: tip
أي وسيط يقبله موجّه Laravel يمكن إضافته إلى المصفوفة.
التغييرات تسري فوراً — لا حاجة لمسح الذاكرة المؤقتة.
:::

راجع [مرجع الأمان](/ar/guide/security) للمراجعة الشاملة للتصليب.

---

## قائمة التحقق بعد التثبيت

- [ ] أكِّد محرك التخزين في `config/lingua.php` يطابق
      نشرك (`database` أو `file`)
- [ ] اضبط `LINGUA_GATE` اختيارياً للوصول القائم على الأدوار
- [ ] أضف مكون محدد اللغة إلى تخطيطك (انظر
      [محدد اللغة](/ar/features/language-selector))
- [ ] اضبط `dir` و`lang` على وسم `<html>` (انظر
      [دعم RTL/LTR](/ar/features/rtl-support))
- [ ] أضف لغات إضافية عبر `php artisan lingua:add {locale}`
- [ ] هيّئ شريط أدوات المحرر في `config/lingua.php` إذا كنت تستخدم
      ترجمات HTML/Markdown (محرك قاعدة البيانات)
