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
│       LinguaManager         │  Custom TranslationLoaderManager
│  1. DB loader (Spatie)      │  DB always wins on overlap
│  2. File loader (fallback)  │
└───┬─────────────────────────┘
    │
    ▼
Translated string returned
```

## تحميل الترجمات

يمتد `LinguaManager` من `TranslationLoaderManager` الخاص بـ Spatie. في وقت التشغيل يدمج مصدرين:

1. **محمّل الملفات** - يقرأ من `lang/` كما يفعل Laravel العادي
2. **محمّل قاعدة البيانات** (محمّل `Db` من Spatie) - يقرأ من `language_lines`

عندما يوجد نفس المفتاح في المصدرين، **تفوز قيمة قاعدة البيانات**. هذا يتيح لك تجاوز أي ترجمة من حزمة خارجية أو مستندة إلى ملف دون لمس ملفات المصدر.

إذا لم يكن جدول `language_lines` موجودًا بعد (مثلًا قبل تشغيل الهجرات)، يتراجع `LinguaManager` بأمان إلى وضع الملفات فقط.

## الوسيط

`LinguaMiddleware` يُضاف تلقائيًا إلى مجموعة وسيط `web` عند الإقلاع عبر `LinguaServiceProvider`. يعمل على كل طلب ويب:

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

`LinguaServiceProvider` يقوم بثلاثة أشياء عند الإقلاع:

1. **تسجيل مكونات Blade المجهولة** تحت البادئة `lingua::`
2. **تسجيل مكونات Livewire** تحت مساحة الاسم `lingua::`
3. **استبدال منفردات `translator` و`translation.loader`** في حاوية IoC بالتطبيقات المخصصة لـ Lingua

لأن مزوِّد الخدمة يستبدل ربط المترجم الأساسي، من المهم أن يُقلِع *بعد* `TranslationServiceProvider` الخاص بـ Laravel. ترتيب التحميل التلقائي لـ Composer يتولى هذا تلقائيًا.

## مخطط قاعدة البيانات

يُستخدم جدولان:

### `languages`

| العمود | النوع | ملاحظات |
|---|---|---|
| `id` | bigint (تزايد تلقائي) | المفتاح الأساسي |
| `code` | string | رمز ISO 639-1 (`en`, `fr`, `pt_BR`) |
| `regional` | string, nullable | الرمز الإقليمي الكامل (`en_US`, `pt_BR`) |
| `type` | string | `'regional'` أو `'standard'` |
| `name` | string | اسم العرض بالإنجليزية (`French`) |
| `native` | string | الاسم الأصلي (`Français`) |
| `direction` | string | `'ltr'` أو `'rtl'` |
| `is_default` | boolean | صف واحد فقط يجب أن يكون `true` |
| `sort` | integer | ترتيب العرض (يُعيَّن تلقائيًا) |

### `language_lines` (Spatie)

| العمود | النوع | ملاحظات |
|---|---|---|
| `id` | bigint (تزايد تلقائي) | المفتاح الأساسي |
| `group` | string | مجموعة الترجمة (`auth`, `validation`, `single`) |
| `key` | string | مفتاح الترجمة (`failed`, `required`) |
| `text` | json | `{"en": "…", "fr": "…", "it": "…"}` |
| `type` | string | `'text'` أو `'html'` أو `'markdown'` |
| `is_vendor` | boolean | `true` لنصوص حزم الطرف الثالث |
| `vendor` | string, nullable | اسم الحزمة (مثل `spatie`, `laravel`) |

عمود JSON لـ `text` يخزّن **جميع اللغات في صف واحد**. هذا التصميم يعني:
- إضافة لغة جديدة لا تغيّر المخطط أبدًا
- استعلام واحد يجلب جميع قيم اللغات لمفتاح ما
- اللغات الناقصة ليس لها مفتاح في كائن JSON ببساطة

## الباذر

`LinguaSeeder` يُستدعى مرة واحدة أثناء `lingua:install`. يقوم بـ:

1. قراءة `config('lingua.default_locale')` (الافتراضي `config('app.locale')`)
2. جلب بيانات اللغة من `laravel-lang/locales`
3. إنشاء سجل `Language` مع `is_default = true`
4. استدعاء `lingua:add {locale}` لتثبيت ملفات اللغة
5. استدعاء `lingua:sync-to-database` لاستيراد جميع النصوص

## النماذج

| النموذج | الجدول | يمتد من |
|---|---|---|
| `Language` | `languages` | `Illuminate\Database\Eloquent\Model` |
| `Translation` | `language_lines` | `LanguageLine` من Spatie |

يرث `Translation` طرق `setTranslation()` و`forgetTranslation()` من Spatie ويضيف نطاقات ومناهج مزامنة ومساعدات إحصاءات خاصة بـ Lingua.
