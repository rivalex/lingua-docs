# الأحداث

تتواصل مكونات Livewire في Lingua عبر أحداث مُسمَّاة. يمكنك الاستماع
إليها في مكونات Livewire الخاصة بك أو كود Alpine.js أو JavaScript.

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
    console.log('New language added!', event.detail);
});

// Or via Livewire's event system:
Livewire.on('language_added', () => { /* … */ });
```

---

## أحداث اللغات

| الحدث | يُطلَق عندما |
|---|---|
| `language_added` | أُضيفت لغة جديدة بنجاح |
| `language_added_fail` | فشل إضافة لغة |
| `refreshLanguages` | أي تغيير في اللغة يتطلب إعادة عرض قائمة اللغات |
| `language_default_set` | تغيّرت اللغة الافتراضية |
| `language_default_fail` | فشل تعيين اللغة الافتراضية |
| `languages_sorted` | أُعيد ترتيب اللغات بالسحب والإفلات |
| `languages_sorted_fail` | فشل إعادة الترتيب |
| `lang_updated` | اكتمل `lingua:update-lang` |
| `lang_updated_fail` | فشل `lingua:update-lang` |

---

## أحداث مزامنة قاعدة البيانات

| الحدث | يُطلَق عندما |
|---|---|
| `synced_database` | اكتملت المزامنة إلى قاعدة البيانات |
| `synced_database_fail` | فشلت المزامنة إلى قاعدة البيانات |
| `synced_local` | اكتملت المزامنة إلى الملفات المحلية |
| `synced_local_fail` | فشلت المزامنة إلى الملفات المحلية |

---

## أحداث الترجمات

| الحدث | يُطلَق عندما |
|---|---|
| `translation_deleted` | حُذف سجل ترجمة بالكامل |
| `translation_delete_fail` | فشل حذف ترجمة |
| `translation_locale_deleted` | أُزيلت قيمة لغة واحدة |
| `translation_locale_delete_fail` | فشل إزالة قيمة لغة |
| `vendor_translation_protected` | جُرِّبت محاولة حذف ترجمة مورّد |
| `refreshTranslationsTableDefaults` | يجب إعادة تحميل العمود الافتراضي |
| `refreshTranslationRow.{id}` | يجب تحديث صف ترجمة محدد |
| `updateTranslationModal.{id}` | يجب تحديث نافذة تعديل ترجمة |

---

## أحداث الإعدادات

| الحدث | يُطلَق عندما |
|---|---|
| `settings_updated` | حُفظ إعداد من صفحة الإعدادات |

---

## أحداث النقل <Badge type="tip" text="جديد في 2.0" />

| الحدث | يُطلَق عندما |
|---|---|
| `export_ready` | اكتمل تصدير الملف وجاهز للتنزيل |
| `import_diff_ready` | اكتمل حساب فرق الاستيراد الجاف |
| `import_committed` | اكتمل الاستيراد وحُفظت البيانات |
| `import_failed` | فشل الاستيراد (تفاصيل في `event.detail`) |

---

## أحداث تحديث الواجهة

| الحدث | يُطلَق عندما |
|---|---|
| `refreshLanguageRows` | يجب إعادة عرض جميع صفوف اللغات |

---

## أمثلة

### إشعار عند إضافة لغة

```blade
<div
    x-data="{ show: false }"
    x-on:language_added.window="show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">تمت إضافة اللغة!</div>
</div>
```

### معالجة ترجمة المورّد المحمية

```js
window.addEventListener('vendor_translation_protected', () => {
    alert('هذه الترجمة محمية ولا يمكن حذفها.');
});
```

### إعادة توجيه مخصصة بعد تبديل اللغة

```php
// Publish LanguageSelector and override changeLocale():
public function changeLocale(string $locale): void
{
    if (! Lingua::hasLocale($locale)) return;

    session()->put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true);
}
```
