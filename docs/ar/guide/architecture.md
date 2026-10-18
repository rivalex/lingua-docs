# كيف تعمل

فهم الآليات الداخلية لـ Lingua يُسهِّل الإعداد والتصحيح والتوسعة.

## دورة حياة الطلب

```
Browser request
    │
    ▼
┌─────────────────────────────┐
│      LinguaMiddleware       │  Reads 'locale' from session
│  app()->setLocale($locale)  │  Falls back to DB default
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│        Your Controller      │
│  __('auth.failed')          │  Standard Laravel helper
└───┬─────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│       LinguaManager         │  extends Illuminate FileLoader
│  DB translations merged over │  DB always wins on overlap
│  file translations (DB mode) │  (file mode = plain FileLoader)
└───┬─────────────────────────┘
    │
    ▼
Translated string returned
```

## تحميل الترجمات

`LinguaManager` يمتد من
`Illuminate\Translation\FileLoader` الخاص بـ Laravel — لا **توجد** اعتمادية على Spatie.
يُسجَّل بتزيين ربط محمّل الإطار:

```php
$app->extend('translation.loader', function ($original, $app) {
    return new LinguaManager($app, $original);
});
```

في **وضع قاعدة البيانات**، لكل `(locale, group)` يُحمِّل الترجمات
المستندة إلى الملفات عبر المحمّل الأصلي، ثم يدمج قيم قاعدة البيانات
فوقها باستخدام `array_replace_recursive`. **قيمة قاعدة البيانات تفوز دائماً** عند
التعارض، لذا يمكنك تجاوز أي سلسلة من مورّد أو ملف دون لمس
ملفات المصدر.

إذا لم يكن جدول `language_lines` موجوداً بعد (مثلاً قبل تشغيل الهجرات)،
يُلتقط `QueryException` ويتراجع `LinguaManager` بأمان
إلى وضع الملفات فقط.

في **وضع الملفات**، يتصرف `LinguaManager` كـ `FileLoader` القياسي —
لا استعلامات إلى قاعدة البيانات. انظر [محركات التخزين](/ar/guide/storage).

## الوسيط

`LinguaMiddleware` يُلحق تلقائياً بمجموعة وسيط `web`
عند الإقلاع عبر `LinguaServiceProvider`. يعمل على كل طلب ويب:

```php
// Simplified logic
$locale = session()->get(config('lingua.session_variable'))
    ?? Language::default()?->code
    ?? config('app.locale');

app()->setLocale($locale);
app()->setFallbackLocale($defaultLocale);
session()->put(config('lingua.session_variable'), $locale);
```

## مزوِّد الخدمة

`LinguaServiceProvider` يقوم بما يلي عند الإقلاع:

1. **تسجيل مكونات Blade المجهولة** تحت البادئة `lingua::`
2. **تسجيل مكونات Livewire** تحت مساحة الاسم `lingua::`
3. **تزيين ربط `translation.loader`** عبر `$app->extend(...)`،
   بتغليف محمّل Laravel بـ `LinguaManager`

لأن مزوِّد الخدمة *يُزيِّن* بدلاً من *يستبدل* المحمّل الأساسي،
يتكامل بنظافة مع `TranslationServiceProvider` الخاص بـ Laravel. ترتيب
التحميل التلقائي في Composer يتولى ترتيب الإقلاع تلقائياً.

## مخطط قاعدة البيانات

ثلاثة جداول تُستخدم (محرك `file` يتخطى `language_lines`):

### `languages`

| العمود | النوع | ملاحظات |
|---|---|---|
| `id` | bigint | المفتاح الأساسي |
| `code` | string | رمز ISO 639-1 (`en`، `fr`، `pt_BR`) |
| `regional` | string، قابل للـ null | الرمز الإقليمي الكامل (`en_US`، `pt_BR`) |
| `type` | string | `'regional'` أو `'standard'` |
| `name` | string | اسم العرض بالإنجليزية (`French`) |
| `native` | string | الاسم الأصلي (`Français`) |
| `direction` | string | `'ltr'` أو `'rtl'` |
| `is_default` | boolean | صف واحد فقط يجب أن يكون `true` |
| `sort` | integer | ترتيب العرض (يُعيَّن تلقائياً) |

### `language_lines`

| العمود | النوع | ملاحظات |
|---|---|---|
| `id` | bigint | المفتاح الأساسي |
| `group` | string | مجموعة الترجمة (`auth`، `validation`، `single`) |
| `key` | string | مفتاح الترجمة (`failed`، `required`) |
| `text` | json، **قابل للـ null** | `{"en": "…", "fr": "…"}` |
| `type` | string | `'text'` أو `'html'` أو `'markdown'` |
| `is_vendor` | boolean | `true` لسلاسل حزم الطرف الثالث |
| `vendor` | string، قابل للـ null | اسم المورّد (مثل `laravel`) |

عمود JSON لـ `text` يخزّن **جميع اللغات في صف واحد**:

- إضافة لغة جديدة لا تغيّر المخطط أبداً
- استعلام واحد يجلب جميع قيم اللغات لمفتاح ما
- اللغات الناقصة ليس لها مفتاح في كائن JSON ببساطة

### `lingua_settings`

جدول مفتاح/قيمة يدعم واجهة الإعدادات (مثل مفتاح تبديل شريط التنقل المشترك).

## مجموعة البيانات المدمجة

يشحن Lingua 2.0 جميع بيانات اللغات داخل الحزمة:

- **`LocaleRegistry`** (`Rivalex\Lingua\Locales\LocaleRegistry`) — بيانات وصفية
  لأكثر من 129 لغة. `Lingua::info($locale)` يُرجع كائن قيمة `LocaleInfo`
  للقراءة فقط (`->name`، `->native`، `->direction`،
  `->regional`، `->code`، `->type`)، أو `null` للغات غير المعروفة.
- **الترجمات المدمجة** — 26 لغة × 7 مجموعات، 5902 سلسلة نصية، متوافقة
  مع Laravel **v13.14.0**. `NotificationProjector` يشتق سلاسل الإشعارات.
  `lingua:add` يبذر من هذه المجموعة بدون استدعاءات شبكة.

## معمارية التخزين المؤقت

في وضع قاعدة البيانات، تُخزِّن Lingua الترجمات **بدقة** لكل
`(locale, group)`:

- المفاتيح تبدو كـ `lingua.trans.{locale}.{group}`
- عند حفظ/حذف `Translation`، يعمل فقط `Cache::forget('lingua.trans.{locale}.{group}')`
  للمفاتيح المتأثرة — لا يوجد **أي** `cache:clear` عام في أي
  مسار مزامنة
- المخزن والبادئة قابلان للتهيئة عبر `cache.store` / `cache.prefix`
- التخزين المؤقت تحسين، وقاعدة البيانات هي المصدر الموثوق: إذا كان مخزن التخزين المؤقت غير متاح (مثلاً مهلة Redis)، تعود القراءات وعملية الكتابة الاحتياطية بعد الإخفاق إلى قاعدة البيانات. يُبلَّغ عن الاستثناء، ويتجاوز قاطع دائرة محدد بنطاق الطلب المخزن لبقية الطلب. الإبطال (`forget`) **غير** محمي: الفشل في `forget` يظهر للمستخدم، حتى لا يبقى أي إدخال قديم بعد استعادة المخزن

## النماذج

| النموذج | الجدول | يمتد من |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `Illuminate\Database\Eloquent\Model` |

`Translation` يوفر `getTranslationsForGroup()`، ومساعدات المزامنة،
ومساعدات الإحصائيات، و`forgetTranslation()` — الذي يرمي
`VendorTranslationProtectedException` لصفوف المورّد. نطاق الاستعلام
`scopeOrdered()` يحل محل `scopeActive()` القديم (مفوَّض محتفظ به للتوافق
العكسي).
