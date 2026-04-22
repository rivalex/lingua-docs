# الإعدادات

تتيح لك صفحة الإعدادات تهيئة سلوك واجهة Lingua من المتصفح — دون الحاجة إلى تعديل ملفات الإعداد أو إعادة النشر.

انتقل إلى `/lingua/settings` أو أضف رابطاً من لوحة الإدارة:

```blade
<a href="{{ route('lingua.settings') }}">إعدادات Lingua</a>
```

<Screenshot src="/screenshots/settings-page.png" alt="صفحة إعدادات Lingua" caption="صفحة الإعدادات مع عناصر التحكم في وضع المحدد وأيقونات الأعلام." />

## كيف تعمل الإعدادات

تُخزَّن الإعدادات في جدول قاعدة البيانات `lingua_settings` كأزواج مفتاح/قيمة مكتوبة. عند كل طلب، يقرأ Lingua أولاً من قاعدة البيانات، ثم يعود إلى `config/lingua.php`، ثم إلى القيم الافتراضية المضمّنة في الكود.

**سلسلة الأولوية:**
1. جدول DB `lingua_settings` (الأعلى — يُضبط عبر هذه الواجهة)
2. `config/lingua.php` (إعدادك المنشور)
3. قيم الحزمة الافتراضية (الأدنى)

يمكنك الاحتفاظ بـ `config/lingua.php` كخط أساس وتجاوز إعدادات معينة لكل بيئة عبر الواجهة دون لمس الملفات.

## وضع المحدد

يتحكم في كيفية عرض مكوّن `<livewire:lingua::language-selector />` للمستخدمين النهائيين.

| الوضع | الوصف |
|---|---|
| `sidebar` | يُعرض كقسم تنقل مجمّع (الافتراضي) |
| `modal` | يُعرض كزر يفتح نافذة اختيار لغة كاملة |
| `dropdown` | يُعرض كزر قائمة منسدلة مضغوطة |
| `headless` | لا عرض مدمج — أنت تُنفّذ الواجهة بنفسك |

::: tip وضع Headless
عند الضبط على `headless`، لا يُعرض المحدد المدمج أي شيء. استخدم `<livewire:lingua::headless-language-selector />` بدلاً منه لبناء محوّل مخصص بالكامل. راجع [محدد Headless](./language-selector#وضع-headless) للوثائق الكاملة.
:::

## إظهار أيقونات الأعلام

تفعيل أو إلغاء تفعيل عرض أيقونات أعلام الدول بجانب أسماء اللغات في المحدد. عند التعطيل، يُعرض اسم اللغة فقط.

تُطابق أيقونات الأعلام رمز `regional` الخاص باللغة (مثلاً `en_US` → 🇺🇸). إن لم يكن ثمة رمز إقليمي، يتراجع العلم بسلاسة.

## الوصول البرمجي

يمكنك قراءة الإعدادات وكتابتها في PHP باستخدام نموذج `LinguaSetting`:

```php
use Rivalex\Lingua\Models\LinguaSetting;

// القراءة مع fallback config()
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

$showFlags = LinguaSetting::get(
    LinguaSetting::KEY_SHOW_FLAGS,
    config('lingua.selector.show_flags', true)
);

// الكتابة
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_SHOW_FLAGS, false);
```

الثوابت المتاحة:

| الثابت | المفتاح | النوع |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |

::: warning الترحيل مطلوب
يُنشئ جدول `lingua_settings` الترحيلُ `create_lingua_settings_table`. إن كنت قد رقّيت من الإصدار 1.0.x، شغّل `php artisan migrate` لإنشائه.
:::
