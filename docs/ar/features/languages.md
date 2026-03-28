# إدارة اللغات

صفحة اللغات (`/lingua/languages`) هي مركز التحكم لجميع اللغات المثبتة.

<Screenshot src="/screenshots/languages-page.png" alt="صفحة إدارة اللغات في Lingua" caption="صفحة اللغات — تعرض اللغات المثبتة مع إحصاءات الاكتمال." />

## إضافة لغة

### من الواجهة

انقر على **إضافة لغة**، واختر أيًا من أكثر من 70 لغة متاحة، وأكِّد. ستقوم Lingua بـ:

1. تنزيل ملفات اللغة من Laravel Lang
2. إنشاء سجل `Language` في قاعدة البيانات
3. مزامنة جميع النصوص الجديدة إلى `language_lines`
4. تحديث الجدول باللغة الجديدة

<Screenshot src="/screenshots/language-add-modal.png" alt="نافذة إضافة لغة" caption="نافذة إضافة اللغة مع منتقي اللغة القابل للبحث." width="640px" :center="true"/>

### من سطر الأوامر

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

### برمجيًا

```php
use Rivalex\Lingua\Facades\Lingua;

// Install language files (lang:add wrapper)
Lingua::addLanguage('fr');

// Then create the DB record + sync (what the Artisan command does fully)
// → use lingua:add for the complete, orchestrated flow
```

::: tip
استخدم `Lingua::notInstalled()` للحصول على قائمة اللغات المتاحة وغير المثبتة بعد:

```php
$available = Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```
:::

## إزالة لغة

انقر على أيقونة سلة المهملات في أي صف لغة غير افتراضية. نافذة تأكيد تمنع الحذف غير المقصود — يجب عليك كتابة اسم اللغة للتأكيد.

خلف الكواليس، عملية الحذف تقوم بـ:
1. إزالة ملفات اللغة عبر `lang:rm {locale} --force`
2. إزالة جميع إدخالات `{locale}` من عمود JSON `language_lines.text`
3. حذف سجل `Language`
4. إعادة ترتيب قيم الفرز للغات المتبقية

::: warning
**لا يمكن إزالة اللغة الافتراضية**. عيِّن لغة أخرى كافتراضية أولًا.
:::

```bash
# From the command line
php artisan lingua:remove fr
```

## تعيين اللغة الافتراضية

انقر على أيقونة النجمة (⭐) في أي صف لغة. يمكن أن تكون لغة واحدة فقط افتراضية في كل مرة. التغيير مُغلَّف في معاملة قاعدة بيانات لمنع وجود فترة لا توجد فيها لغة مُعلَّمة كافتراضية.

```php
// Programmatically
Lingua::setDefaultLocale('fr');

// Or via the model
$french = Language::where('code', 'fr')->first();
Language::setDefault($french);
```

::: warning إزالة اللغة الافتراضية
إذا عيّنت لغة افتراضية جديدة، تأكد من اكتمال ترجماتها جزئيًا على الأقل. اللغة الافتراضية تُستخدم كمرجع في محرر الواجهة (العمود الأيسر يعرض القيمة الافتراضية كمرجع).
:::

## إعادة ترتيب اللغات

اسحب وأفلت صفوف اللغة للتحكم في ترتيب عرضها في التطبيق — في أداة محدد اللغة ومحوِّل لغة الترجمات وفي أي مكان تستخدم فيه `Lingua::languages()`.

ترتيب الفرز مخزّن في عمود `sort` العددي ويُعاد تعيينه بشكل تسلسلي بعد كل إفلات.

## عرض إحصاءات الاكتمال

كل صف لغة يعرض:

| المقياس | الوصف |
|---|---|
| **نسبة الاكتمال %** | `مُترجَم / الإجمالي * 100`، مقرَّب لمنزلتين عشريتين |
| **ناقص** | عدد النصوص التي لا تملك قيمة لهذه اللغة |

تُحسَب هذه الأرقام في وقت الاستعلام عبر استعلامات فرعية لقاعدة البيانات ضد جدول `language_lines`، لذا فهي دائمًا محدَّثة.

```php
// Get stats for a specific locale
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

// Or get all languages with stats in one query
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

## أزرار المزامنة

شريط أدوات صفحة اللغات يحتوي على ثلاثة أزرار مزامنة:

| الزر | الإجراء |
|---|---|
| **مزامنة إلى قاعدة البيانات** | يستورد جميع ملفات `lang/` المحلية إلى `language_lines` |
| **مزامنة إلى محلي** | يُصدِّر جميع ترجمات قاعدة البيانات مرة أخرى إلى ملفات `lang/` |
| **تحديث عبر Laravel Lang** | يشغِّل `lang:update` لسحب أحدث النصوص من المصدر، ثم يزامن إلى قاعدة البيانات |

جميع العمليات الثلاث تعمل **بشكل غير متزامن** (خاصية `#[Async]` في Livewire) حتى تبقى الواجهة متجاوبة أثناء المزامنات طويلة الأمد.
