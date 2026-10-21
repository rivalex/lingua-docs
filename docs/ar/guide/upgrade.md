# الترقية من 1.x إلى 2.0

Lingua 2.0 إصدار رئيسي. يأخذك هذا الدليل عبر الهجرة
خطوةً بخطوة، ويُدرج كل تغيير متعارض، ويُجيب على الأسئلة
الأكثر شيوعاً.

## لماذا هذا إصدار رئيسي

- **إزالة الاعتماديات الخارجية.** `spatie/laravel-translation-loader`
  و`laravel-lang/common` أُزيلا. بيانات اللغات الوصفية ومجموعة الترجمات
  تشحن الآن داخل الحزمة.
- **إضافة محركات التخزين.** اختر `database` (سلوك 1.x) أو
  `file`. انظر [محركات التخزين](/ar/guide/storage).
- **تصليب شامل للأمان.** آمن افتراضياً، بالإضافة إلى مرحلة التصليب F1–F9.
  انظر [الأمان](/ar/guide/security).
- **رُفع الحد الأدنى لـ PHP** إلى 8.3+.

## الهجرة خطوة بخطوة

### 1. تحديث الحزمة

```bash
composer update rivalex/lingua
```

يُزيل Composer تلقائياً `spatie/laravel-translation-loader`. إذا كان
`composer.json` الخاص بك يُدرج `laravel-lang/common`:

```bash
composer remove laravel-lang/common
```

### 2. إعادة نشر الإعداد ودمجه

```bash
php artisan vendor:publish --tag=lingua-config --force
```

ثم ادمج المفاتيح الجديدة في إعدادك الحالي: `gate`،
`storage.driver`، `nav.enabled`، `navigate`، `routes_extra_parameters`،
`layout`، `links.translations`، `ui.sticky_top`، `cache.store`،
`cache.prefix`، `suppress_pro_nudge`، `pro_upgrade_url`،
`extensions.enabled`. انظر [الإعداد](/ar/guide/configuration).

### 3. ضبط محرك التخزين

```env
LINGUA_STORAGE_DRIVER=database
```

```bash
php artisan config:clear
```

`database` مطابق لسلوك 1.x.

### 4. الهجرات

الهجرات مقسَّمة الآن إلى **ثلاثة** ملفات. إذا رقَّيت من 1.x
مع هجرات مُشغَّلة بالفعل، **لا تحتاج إلى هجرة جديدة** — جداولك
موجودة بالفعل. تحقق فقط من تباين المخطط إذا كنت قد نشرت
وخصَّصت الهجرة المدمجة سابقاً.

### 5. محمّلات الترجمة المخصصة

```php
// قبل
use Spatie\TranslationLoader\TranslationLoaders\TranslationLoader;

// بعد
use Rivalex\Lingua\Contracts\TranslationLoader;
```

التوقيع لم يتغير:
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### 6. نموذج Translation المخصص

```php
// قبل
class Translation extends \Spatie\TranslationLoader\LanguageLine {}

// بعد
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $table = 'language_lines';

    public static function getTranslationsForGroup(string $locale, string $group): array
    {
        // …
    }
}
```

### 7. تلميحات النوع

```php
// قبل
use Spatie\TranslationLoader\TranslationLoaderManager;

// بعد
use Rivalex\Lingua\TranslationManager\LinguaManager;
```

### 8. مؤلفو الحزم (Testbench)

احذف مزوِّد Spatie من `getPackageProviders()`:

```php
// احذف هذا السطر
Spatie\TranslationLoader\TranslationServiceProvider::class,
```

## مرجع التغييرات المتعارضة

| التغيير | التفاصيل |
|---|---|
| نوع إرجاع `Lingua::info()` <Badge type="warning" text="متعارض" /> | يُرجع الآن `?LocaleInfo`؛ يُعطي `null` للغات غير المعروفة (كان يرمي). احرص على الحراسة بـ `if ($info === null)`. أسماء الحقول تختلف عن `LaravelLang\LocaleData` القديمة. |
| `addLanguage()` / `removeLanguage()` <Badge type="warning" text="متعارض" /> | لا تستدعي `lang:add` / `lang:rm` بعد الآن. أصيلة لقاعدة البيانات فقط — لا كتابة إلى الملفات. |
| افتراضي الوسيط <Badge type="warning" text="متعارض" /> | `['web', 'auth']` (كان `['web']`). |
| افتراضي `navigate` <Badge type="warning" text="متعارض" /> | `false` (كان `true`). |
| الحد الأدنى لـ PHP <Badge type="warning" text="متعارض" /> | 8.3+ (كان 8.2+). |
| `Language::scopeActive()` <Badge type="warning" text="متعارض" /> | أُعيدت تسميته `scopeOrdered()` (المفوَّض محتفظ به للتوافق). |
| `Translation::forgetTranslation()` <Badge type="warning" text="متعارض" /> | يرمي `VendorTranslationProtectedException` لصفوف المورّد. |
| `Import $errors` <Badge type="warning" text="متعارض" /> | أُعيدت تسميته `$rowErrors`. |
| `optimize()` <Badge type="warning" text="متعارض" /> | مُهمَل — احذف جميع الاستدعاءات. |
| الأعمدة القابلة للـ null | `language_lines.text` و`languages.regional` قابلتان للـ null الآن. |
| الهجرات | مقسَّمة إلى 3 ملفات (كانت 1 مدمجة). |
| وسم `lingua-assets` | أُزيل — الأصول تُقدَّم عبر مسار `lingua.assets`. |

## قائمة التحقق السريعة

- [ ] `composer update rivalex/lingua`
- [ ] احذف `laravel-lang/common` إذا كان موجوداً في `composer.json`
- [ ] أعِد نشر الإعداد وادمج المفاتيح الجديدة
- [ ] اضبط `LINGUA_STORAGE_DRIVER=database` وشغِّل `php artisan config:clear`
- [ ] حدِّث أي محمّلات/نماذج/تلميحات نوع مخصصة (Spatie → Lingua)
- [ ] استبدل استخدامات `Lingua::info()` بحارس `null`
- [ ] احذف استدعاءات `optimize()`
- [ ] أعِد تسمية مراجع `Import::$errors` إلى `$rowErrors`
- [ ] أكِّد توافق الوسيط/البوابة مع سياسة وصولك

## الأسئلة الشائعة

**هل ستُفقد ترجماتي؟**
لا. مع محرك `database` السلوك والبيانات مطابقان
لـ 1.x. صفوف `language_lines` الموجودة لديك لا تتأثر.

**هل أحتاج إلى إعادة تشغيل الهجرات؟**
لا، إذا كانت قد شُغِّلت بالفعل تحت 1.x. الجداول موجودة بالفعل؛ التقسيم
إلى 3 ملفات يؤثر على التثبيتات الجديدة فقط.

**هل يمكنني الاستمرار في استخدام التخزين المستند إلى الملفات؟**
نعم — هذا محرك `file` الجديد. بدِّل في أي وقت بـ
`php artisan lingua:storage file`. انظر
[محركات التخزين](/ar/guide/storage).

**هل Flux لا يزال مطلوباً؟**
نعم. يتطلب Lingua 2.0 `livewire/flux ^2.12`. لم يُزَل Flux.

## الترقية من 2.0 إلى 2.1

يدعم Lingua 2.1 الإصدارين **12 و 13** من Laravel. انتهى الدعم الأمني لـ Laravel 11 في March 12, 2026. التطبيقات التي ما زالت على Laravel 11 تبقى على Lingua 2.0.5، وهو الإصدار الذي يواصل Composer اختياره تلقائياً؛ قم بترقية Laravel قبل تحديث Lingua. لا توجد تغييرات كاسرة أخرى: لا يلزم أي تغيير في الإعدادات أو الهجرات أو واجهة البرمجة.
