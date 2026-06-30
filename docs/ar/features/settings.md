# الإعدادات

تتيح لك صفحة الإعدادات تهيئة سلوك واجهة Lingua من المتصفح — دون
الحاجة إلى تعديل ملفات الإعداد أو إعادة النشر.

<Screenshot src="/screenshots/settings-page.png" alt="صفحة إعدادات Lingua" caption="صفحة الإعدادات مع عناصر التحكم في وضع المحدد والأعلام وعناصر 2.0." />

## كيف تعمل الإعدادات

تُخزَّن الإعدادات في جدول `lingua_settings` كأزواج مفتاح/قيمة.
عند كل طلب، يقرأ Lingua بهذا الترتيب:

**سلسلة الأولوية:**
1. جدول DB `lingua_settings` — الأعلى أولوية، يُضبط عبر هذه الواجهة
2. `config/lingua.php` — إعدادك المنشور
3. قيم الحزمة الافتراضية — الأدنى أولوية

يمكنك الاحتفاظ بـ `config/lingua.php` كخط أساس وتجاوز إعدادات معينة
لكل بيئة عبر الواجهة دون لمس الملفات.

---

## الإعدادات المتاحة

### وضع المحدد

يتحكم في كيفية عرض `<livewire:lingua::language-selector />`.

| الوضع | الوصف |
|---|---|
| `sidebar` | قسم تنقل مجمَّع (الافتراضي) |
| `modal` | زر يفتح نافذة اختيار لغة |
| `dropdown` | زر قائمة منسدلة مضغوطة |
| `headless` | لا عرض مدمج — أنت تُنفِّذ الواجهة |

### إظهار أيقونات الأعلام

تفعيل أو إلغاء تفعيل عرض أيقونات أعلام الدول بجانب أسماء اللغات.
تُطابَق الأعلام بـ `regional` للغة (`en_US` → 🇺🇸).

### قائمة التنقل المشتركة <Badge type="tip" text="جديد في 2.0" />

تفعيل أو إلغاء مكوّن `x-lingua::nav` الذي يظهر على جميع
صفحات Lingua الخمس. يمكن أيضاً ضبطه في `config/lingua.php`:

```php
'nav' => ['enabled' => true],
```

### محرك التخزين (للعرض فقط)

يعرض المحرك النشط (`database` أو `file`) للإشارة — لا يمكن تغييره
من هنا. لتبديل المحرك استخدم:

```bash
php artisan lingua:storage {driver}
```

---

## الوصول البرمجي

```php
use Rivalex\Lingua\Models\LinguaSetting;

// القراءة مع fallback
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

$showFlags = LinguaSetting::get(
    LinguaSetting::KEY_SHOW_FLAGS,
    config('lingua.selector.show_flags', true)
);

$navEnabled = LinguaSetting::get(
    LinguaSetting::KEY_NAV_ENABLED,
    config('lingua.nav.enabled', true)
);

// الكتابة
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_SHOW_FLAGS, false);
LinguaSetting::set(LinguaSetting::KEY_NAV_ENABLED, false);
```

الثوابت المتاحة:

| الثابت | المفتاح في DB | النوع |
|---|---|---|
| `KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |
| `KEY_NAV_ENABLED` | `nav.enabled` | `bool` |

::: tip
يمكنك إضافة مفاتيح مخصصة باستخدام `LinguaSetting::set('my.key', $value)`
واسترجاعها لاحقاً بـ `LinguaSetting::get('my.key', $default)`.
:::
