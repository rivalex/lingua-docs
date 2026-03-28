# الإعدادات

بعد التثبيت، `config/lingua.php` هو المصدر الوحيد للحقيقة لجميع إعدادات Lingua.

```php
// config/lingua.php

return [

    /*
    |--------------------------------------------------------------------------
    | Language Files Directory
    |--------------------------------------------------------------------------
    | The path where local PHP/JSON translation files are stored.
    | Used by lingua:sync-to-database and lingua:sync-to-local.
    */
    'lang_dir' => lang_path(),

    /*
    |--------------------------------------------------------------------------
    | Default Locale
    |--------------------------------------------------------------------------
    | The fallback locale code used during installation and when the database
    | has no default language configured.
    */
    'default_locale' => config('app.locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Fallback Locale
    |--------------------------------------------------------------------------
    | When a translation is missing in the active locale, Laravel will try
    | this locale next.
    */
    'fallback_locale' => config('app.fallback_locale', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Route Middleware
    |--------------------------------------------------------------------------
    | Middleware applied to all Lingua management routes.
    | Add 'auth' (and role/permission guards) before going to production.
    */
    'middleware' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Route Prefix
    |--------------------------------------------------------------------------
    | URL prefix for Lingua's management pages.
    | Default: /lingua/languages and /lingua/translations
    */
    'routes_prefix' => 'lingua',

    /*
    |--------------------------------------------------------------------------
    | Session Variable
    |--------------------------------------------------------------------------
    | The session key used to persist the user's active locale across requests.
    */
    'session_variable' => 'locale',

    /*
    |--------------------------------------------------------------------------
    | Language Selector
    |--------------------------------------------------------------------------
    | Controls the default behaviour of the <livewire:lingua::language-selector>
    | component. Both options can be overridden per-instance via props.
    */
    'selector' => [
        'mode'       => 'sidebar',   // 'sidebar' | 'modal' | 'dropdown'
        'show_flags' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Rich-text Editor Toolbar
    |--------------------------------------------------------------------------
    | Defines which formatting options are available in the TipTap editor
    | for HTML and Markdown translation types.
    */
    'editor' => [
        'headings'      => false,
        'bold'          => true,
        'italic'        => true,
        'underline'     => true,
        'strikethrough' => false,
        'bullet'        => true,
        'ordered'       => true,
        'clear'         => true,
    ],

];
```

---

## مرجع الخيارات

### `lang_dir`

**القيمة الافتراضية:** `lang_path()` (تُحلَّل إلى `{project_root}/lang/`)

المجلد الذي تقرأ منه Lingua عند مزامنة الملفات إلى قاعدة البيانات والكتابة إليه عند التصدير مرة أخرى إلى الملفات. غيِّر هذا إذا كانت ملفات ترجمتك في موقع غير قياسي.

### `default_locale`

**القيمة الافتراضية:** `config('app.locale', 'en')`

يُستخدم كقيمة احتياطية أثناء التثبيت وعندما يكون جدول `languages` فارغًا. بعد التثبيت، الافتراضي الموثوق هو الصف في جدول `languages` الذي `is_default = true`.

### `fallback_locale`

**القيمة الافتراضية:** `config('app.fallback_locale', 'en')`

السلوك الاحتياطي القياسي لـ Laravel — عند فقدان مفتاح في اللغة النشطة، تُجرَّب هذه اللغة تاليًا.

### `middleware`

**القيمة الافتراضية:** `['web']`

::: danger متطلب للإنتاج
أضف دائمًا على الأقل `'auth'` قبل النشر. بدونه، يمكن لأي شخص يعرف الرابط تعديل ترجماتك.
:::

```php
// الإعداد النموذجي للإنتاج
'middleware' => ['web', 'auth'],

// مع Spatie Laravel Permission
'middleware' => ['web', 'auth', 'role:admin'],

// مع سياسة Gate مخصصة
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

### `routes_prefix`

**القيمة الافتراضية:** `'lingua'`

يغير بادئة الرابط لجميع صفحات إدارة Lingua:

```php
'routes_prefix' => 'admin/translations',
// → /admin/translations/languages
// → /admin/translations/translations
```

### `session_variable`

**القيمة الافتراضية:** `'locale'`

مفتاح الجلسة حيث تخزّن Lingua اللغة المختارة من قِبَل المستخدم. غيِّره إذا كان يتعارض مع حزمة أخرى.

### `selector.mode`

**القيمة الافتراضية:** `'sidebar'`

يتحكم في وضع العرض الافتراضي لمكون `<livewire:lingua::language-selector>`:

| القيمة | الوصف |
|---|---|
| `sidebar` | يُعرض كعنصر تنقل مجمَّع في الشريط الجانبي |
| `dropdown` | يُعرض كزر قائمة منسدلة مضغوطة |
| `modal` | يُعرض كزر يفتح نافذة منبثقة لاختيار اللغة |

### `selector.show_flags`

**القيمة الافتراضية:** `true`

هل تُعرض أيقونات أعلام البلدان بجانب أسماء اللغات في المحدد. يتطلب حزمة `outhebox/blade-flags` (مثبتة تلقائيًا كاعتمادية).

### `editor`

يتحكم في شريط أدوات TipTap لأنواع ترجمات HTML وMarkdown. كل خيار يرتبط بامتداد TipTap:

| المفتاح | الوصف |
|---|---|
| `headings` | أزرار العناوين H1–H3 |
| `bold` | **غامق** |
| `italic` | *مائل* |
| `underline` | تسطير |
| `strikethrough` | ~~يتوسطه خط~~ |
| `bullet` | قائمة غير مرتبة |
| `ordered` | قائمة مرتبة |
| `clear` | زر مسح التنسيق |

::: tip
شريط أدوات المحرر عالمي — جميع حقول ترجمات HTML/Markdown تشترك في نفس الإعداد. إذا كنت بحاجة إلى تحكم لكل حقل على حدة، انشر العروض وخصِّص مكون المحرر مباشرة.
:::
