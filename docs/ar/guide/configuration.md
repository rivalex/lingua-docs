# الإعداد

بعد التثبيت، `config/lingua.php` هو المصدر الوحيد للحقيقة لجميع
إعدادات Lingua. تُوثِّق هذه الصفحة كل مفتاح، مجمَّعاً حسب الاهتمام.
المفاتيح المُعلَّمة <Badge type="tip" text="جديد في 2.0" /> لم تكن موجودة في 1.x.

## إعدادات اللغة

```php
// config/lingua.php

'lang_dir'         => lang_path(),
'base_translations_path' => null, // ★ جديد في 2.0
'default_locale'   => config('app.locale', 'en'),
'fallback_locale'  => config('app.fallback_locale', 'en'),
'session_variable' => 'locale',
```

### `lang_dir`

**الافتراضي:** `lang_path()` — يُحلَّل إلى `{project_root}/lang/`.

المجلد الذي تقرأ منه Lingua عند مزامنة الملفات إلى قاعدة البيانات والكتابة
إليه عند التصدير مرة أخرى إلى الملفات.

### `base_translations_path` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `null`

تجاوز اختياري للمسار الذي تقرأ منه Lingua مجموعة الترجمات **المدمجة**.
اتركه `null` لاستخدام مجموعة البيانات الشاحنة داخل الحزمة.

### `default_locale`

**الافتراضي:** `config('app.locale', 'en')`

يُستخدم كقيمة احتياطية أثناء التثبيت وعندما يكون جدول `languages`
فارغاً. بعد التثبيت، الافتراضي الموثوق هو الصف في
جدول `languages` مع `is_default = true`.

### `fallback_locale`

**الافتراضي:** `config('app.fallback_locale', 'en')`

السلوك الاحتياطي القياسي لـ Laravel — عندما يغيب مفتاح في اللغة النشطة،
تُجرَّب هذه اللغة تاليًا.

### `session_variable`

**الافتراضي:** `'locale'`

مفتاح الجلسة حيث تخزّن Lingua اللغة المختارة من قِبَل المستخدم.

---

## الأمان والوصول

```php
'middleware' => ['web', 'auth'],
'gate'       => env('LINGUA_GATE', null), // ★ جديد في 2.0
```

### `middleware`

**الافتراضي:** `['web', 'auth']` <Badge type="warning" text="تغيّر في 2.0" />

::: tip آمن افتراضياً
في 2.0 الافتراضي هو `['web', 'auth']` — واجهة الإدارة **غير**
متاحة للعموم افتراضياً. كان `['web']` في 1.x.
:::

```php
// مع Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// مع سياسة Gate مخصصة
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `gate` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `env('LINGUA_GATE', null)`

عند الضبط، تُلحق Lingua `can:{gate}` بجميع مسارات الإدارة. حدِّد البوابة
في مزوِّد خدمة:

```env
LINGUA_GATE=manage-translations
```

```php
Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

راجع [مرجع الأمان](/ar/guide/security#authentication).

---

## التوجيه

```php
'routes_prefix'           => 'lingua',
'routes_extra_parameters' => null,  // ★ جديد في 2.0
'navigate'                => false, // ★ جديد في 2.0 (تغيّر الافتراضي)
'layout'                  => null,  // ★ جديد في 2.0
```

### `routes_prefix`

**الافتراضي:** `'lingua'`

يغير بادئة الرابط لجميع صفحات إدارة Lingua:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
```

### `routes_extra_parameters` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `null`

لاحقة مُعلَّمة اختيارية تُلحق ببادئة المسار — مفيدة للبادئات
المحدَّدة بالمستأجر أو القسم.

### `navigate` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `false` <Badge type="warning" text="تغيّر في 2.0" />

يتحكم في `wire:navigate` على روابط Lingua الداخلية. الافتراضي الآن
`false` (إعادة توجيه بالصفحة كاملة)، مما يتجنب حالات حافة تنقل SPA. انضم
باستخدام `'navigate' => true`.

### `layout` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `null`

وفِّر تخطيط Blade مخصصاً لعروض Lingua. اتركه `null` لاستخدام
التخطيط المدمج في الحزمة.

---

## التنقل

```php
'nav' => [
    'enabled' => true, // ★ جديد في 2.0
],
'links' => [
    'translations' => [          // ★ جديد في 2.0
        'enabled' => true,
        'route'   => 'lingua.translations',
    ],
],
```

### `nav.enabled` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `true`

يتحكم في قائمة التنقل المشتركة `x-lingua::nav` التي تظهر على جميع
صفحات Lingua الخمس. يمكن أيضاً التبديل من واجهة الإعدادات.

### `links.translations` <Badge type="tip" text="جديد في 2.0" />

يتحكم في إدخال "الترجمات" في شريط التنقل المشترك: سواء كان معروضاً
(`enabled`) وأي مسار يشير إليه (`route`).

---

## الواجهة

```php
'ui' => [
    'sticky_top' => 0, // ★ جديد في 2.0
],
'selector' => [
    'mode'       => 'sidebar',  // 'sidebar' | 'modal' | 'dropdown' | 'headless'
    'show_flags' => true,
],
'editor' => [
    'headings' => false, 'bold' => true, 'italic' => true,
    'underline' => true, 'strikethrough' => false,
    'subscript' => true, 'superscript' => true,
    'blockquote' => false, 'code-line' => false, 'code-block' => false,
    'bullet' => true, 'ordered' => true, 'clear' => true, 'code-mode' => false,
],
```

### `ui.sticky_top` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `0`

إزاحة بالبكسل لأشرطة أدوات Lingua اللاصقة. زِدها إذا كان تطبيقك
يحتوي على ترويسة ثابتة حتى لا تنزلق الأشرطة تحتها.

### `selector.mode`

**الافتراضي:** `'sidebar'`

| القيمة | الوصف |
|---|---|
| `sidebar` | عنصر تنقل الشريط الجانبي المجمَّع |
| `dropdown` | زر قائمة منسدلة مضغوطة |
| `modal` | زر يفتح نافذة منتقي اللغة |
| `headless` | لا عرض مدمج — استخدم المكوّن بدون رأس |

### `selector.show_flags`

**الافتراضي:** `true`

هل تُعرض أيقونات أعلام البلدان بجانب أسماء اللغات.

### `editor`

يتحكم في شريط أدوات النص الغني لأنواع ترجمات HTML وMarkdown
(محرك قاعدة البيانات فقط). كل مفتاح يُفعِّل خيار تنسيق واحد:
`headings`، `bold`، `italic`، `underline`، `strikethrough`، `subscript`،
`superscript`، `blockquote`، `code-line`، `code-block`، `bullet`،
`ordered`، `clear`، `code-mode`.

---

## المظهر <Badge type="tip" text="جديد" />

```php
'dark_mode' => [
    'force' => env('LINGUA_FORCE_DARK_MODE', false),
],
```

### `dark_mode.force` <Badge type="tip" text="جديد" />

**الافتراضي:** `env('LINGUA_FORCE_DARK_MODE', false)`

يستخدم تنسيق CSS الخاص بـ Lingua متغيّر `dark:` قائم على فئة CSS
(`&:where(.dark, .dark *)`)، لذا فهو يتبع عادةً عنصر `<html class="dark">`
الأب في تطبيقك — بنفس اتفاقية استراتيجية الفئة الافتراضية في Tailwind.
إذا كان تطبيقك لا يملك مفتاح وضع داكن قائم على الفئة (أو كانت حالته لا
تطابق تفضيل نظام التشغيل/المتصفح الفعلي)، فقد يُعرض تنسيق Lingua الخاص
بدون تنسيق حتى لو بدت بقية الصفحة سليمة.

اضبط `force` على `true` لجعل Lingua تعرض دائماً سمتها الداكنة، بغض
النظر عن تطبيقك أو نظام الألوان في نظام التشغيل. مفيد عند تضمين Lingua
في تطبيق مضيف بلا مفتاح وضع داكن، أو أثناء التطوير محلياً على نظام
وضع فاتح. يمكن أيضاً تبديله مباشرة من
[واجهة الإعدادات](/ar/features/settings#appearance)، والتي لها الأولوية
على هذا الافتراضي في الإعداد.

```ini
LINGUA_FORCE_DARK_MODE=true
```

---

## محرك التخزين <Badge type="tip" text="جديد في 2.0" />

```php
'storage' => [
    'driver' => env('LINGUA_STORAGE_DRIVER', 'database'),
],
```

### `storage.driver`

**الافتراضي:** `env('LINGUA_STORAGE_DRIVER', 'database')`

يحدد مكان الترجمات:

| المحرك | السلوك |
|---|---|
| `database` | سلوك 1.x الكامل: جدول `language_lines`، أنواع HTML/Markdown، إحصائيات، استيراد/تصدير، حارس المورّد، تخزين مؤقت دقيق. |
| `file` | يقرأ/يكتب ملفات `lang/` PHP+JSON مباشرةً؛ بدون جدول `language_lines`؛ الأنواع تُسوَّى إلى نص عادي. |

هذه ميزة رئيسية — راجع [محركات التخزين](/ar/guide/storage) للمقارنة
الكاملة وأمر التبديل `lingua:storage`.

---

## التخزين المؤقت

```php
'cache' => [
    'store'  => env('LINGUA_CACHE_STORE', null),       // ★ جديد في 2.0
    'prefix' => env('LINGUA_CACHE_PREFIX', 'lingua.trans'), // ★ جديد في 2.0
],
```

### `cache.store` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `env('LINGUA_CACHE_STORE', null)`

مخزن التخزين المؤقت الذي تستخدمه Lingua. `null` يستخدم
مخزن تطبيقك الافتراضي.

### `cache.prefix` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `env('LINGUA_CACHE_PREFIX', 'lingua.trans')`

بادئة لمفاتيح التخزين المؤقت. تُخزِّن Lingua الترجمات **بدقة** لكل
`(locale, group)` وتنسى فقط المفتاح المتأثر عند الكتابة — لا
يوجد `cache:clear` عام في أي مسار مزامنة. راجع
[معمارية التخزين المؤقت](/ar/guide/architecture#cache-architecture).

---

## محمّلات الترجمة

```php
'translation_loaders' => [
    // Rivalex\Lingua\Loaders\YourCustomLoader::class,
],
'model'               => Rivalex\Lingua\Models\Translation::class,
'translation_manager' => Rivalex\Lingua\TranslationManager\LinguaManager::class,
```

### `translation_loaders`

سجِّل محمّلات إضافية تنفِّذ
`Rivalex\Lingua\Contracts\TranslationLoader`. التوقيع:
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### `model`

نموذج Eloquent الذي يدعم `language_lines`. تجاوزه لتمديد
`Translation` بمنطقك الخاص.

### `translation_manager`

فئة محمّل الترجمة. الافتراضي
`Rivalex\Lingua\TranslationManager\LinguaManager`، الذي يمتد من
`Illuminate\Translation\FileLoader`.

---

## الإضافات

```php
'extensions' => [
    'enabled' => env('LINGUA_EXTENSIONS_ENABLED', true), // ★ جديد في 2.0
],
'suppress_pro_nudge' => env('LINGUA_SUPPRESS_PRO_NUDGE', false), // ★ جديد في 2.0
'pro_upgrade_url'    => env('LINGUA_PRO_UPGRADE_URL', 'https://lingua.rivalex.dev'), // ★ جديد في 2.0
```

### `extensions.enabled` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `true`

مفتاح رئيسي للإضافات الاختيارية في Lingua.

### `suppress_pro_nudge` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `false`

اضبطه على `true` لإخفاء تلميحات الترقية في الواجهة.

### `pro_upgrade_url` <Badge type="tip" text="جديد في 2.0" />

**الافتراضي:** `https://lingua.rivalex.dev`

الرابط المستخدم بواسطة تلميحات الترقية عند عرضها.
