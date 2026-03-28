# أحداث Livewire

تتواصل مكونات Livewire في Lingua عبر أحداث مُسمَّاة. يمكنك الاستماع إلى هذه الأحداث في مكونات Livewire الخاصة بك أو كود Alpine.js أو JavaScript.

## الاستماع في Livewire

```php
use Livewire\Attributes\On;

class MyComponent extends Component
{
    #[On('language_added')]
    public function handleLanguageAdded(): void
    {
        // Refresh something when a new language is added
    }
}
```

## الاستماع في Alpine.js / JavaScript

```js
window.addEventListener('language_added', (event) => {
    console.log('A new language was added!', event.detail);
});

// Or via Livewire's event system:
Livewire.on('language_added', () => {
    // ...
});
```

---

## أحداث اللغات

| الحدث | يُطلَق عندما |
|---|---|
| `language_added` | أُضيفت لغة جديدة بنجاح |
| `language_added_fail` | فشل إضافة لغة |
| `refreshLanguages` | أي تغيير في اللغة يتطلب إعادة عرض قائمة اللغات |
| `language_default_set` | تم تغيير اللغة الافتراضية |
| `language_default_fail` | فشل تعيين اللغة الافتراضية |
| `languages_sorted` | أُعيد ترتيب اللغات بالسحب والإفلات |
| `languages_sorted_fail` | فشل إعادة ترتيب اللغات |
| `lang_updated` | اكتمل `lingua:update-lang` بنجاح |
| `lang_updated_fail` | فشل `lingua:update-lang` |
| `synced_database` | اكتملت المزامنة إلى قاعدة البيانات بنجاح |
| `synced_database_fail` | فشلت المزامنة إلى قاعدة البيانات |
| `synced_local` | اكتملت المزامنة إلى المحلي بنجاح |
| `synced_local_fail` | فشلت المزامنة إلى المحلي |

---

## أحداث الترجمات

| الحدث | يُطلَق عندما |
|---|---|
| `translation_deleted` | حُذف سجل ترجمة بالكامل |
| `translation_delete_fail` | فشل حذف ترجمة |
| `translation_locale_deleted` | أُزيلت قيمة لغة واحدة من ترجمة |
| `translation_locale_delete_fail` | فشل إزالة قيمة لغة |
| `vendor_translation_protected` | جُرِّبت محاولة لحذف ترجمة حزمة خارجية |
| `refreshTranslationsTableDefaults` | يجب إعادة تحميل العمود الافتراضي في جدول الترجمات |
| `refreshTranslationRow.{id}` | يجب تحديث صف ترجمة محدد (بمعامل رقم الترجمة) |
| `updateTranslationModal.{id}` | يجب تحديث نافذة تعديل ترجمة |

---

## أحداث تحديث الواجهة

| الحدث | يُطلَق عندما |
|---|---|
| `refreshLanguageRows` | يجب إعادة عرض جميع صفوف اللغات (مثلًا بعد تغيير الافتراضي) |

---

## مثال: عرض إشعار عند إضافة لغة

باستخدام Alpine.js ومكتبة إشعارات:

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Language added!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

## مثال: إعادة التوجيه بعد تغيير اللغة

إذا أردت إعادة التوجيه إلى رابط مختلف بعد تبديل محدد اللغة (بدلًا من الصفحة الحالية):

```php
// Publish LanguageSelector and override changeLocale():
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true); // redirect to home
}
```
