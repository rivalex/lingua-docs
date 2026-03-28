# Livewire Events

Lingua के Livewire components named events के माध्यम से communicate करते हैं। आप इन events को अपने Livewire components, Alpine.js code, या JavaScript में सुन सकते हैं।

## Livewire में सुनना

```php
use Livewire\Attributes\On;

class MyComponent extends Component
{
    #[On('language_added')]
    public function handleLanguageAdded(): void
    {
        // नई भाषा जोड़ने पर कुछ refresh करें
    }
}
```

## Alpine.js / JavaScript में सुनना

```js
window.addEventListener('language_added', (event) => {
    console.log('A new language was added!', event.detail);
});

// या Livewire के event system के माध्यम से:
Livewire.on('language_added', () => {
    // ...
});
```

---

## Language events

| Event | कब dispatch होता है |
|---|---|
| `language_added` | नई भाषा सफलतापूर्वक जोड़ी गई |
| `language_added_fail` | भाषा जोड़ना failed |
| `refreshLanguages` | कोई भी language change जिसके लिए language list को re-render करना हो |
| `language_default_set` | Default भाषा बदली गई |
| `language_default_fail` | Default भाषा सेट करना failed |
| `languages_sorted` | Drag-and-drop के माध्यम से भाषाएँ reorder की गईं |
| `languages_sorted_fail` | Language reordering failed |
| `lang_updated` | `lingua:update-lang` सफलतापूर्वक completed |
| `lang_updated_fail` | `lingua:update-lang` failed |
| `synced_database` | Sync-to-database सफलतापूर्वक completed |
| `synced_database_fail` | Sync-to-database failed |
| `synced_local` | Sync-to-local सफलतापूर्वक completed |
| `synced_local_fail` | Sync-to-local failed |

---

## Translation events

| Event | कब dispatch होता है |
|---|---|
| `translation_deleted` | Translation record पूरी तरह delete किया गया |
| `translation_delete_fail` | Translation delete करना failed |
| `translation_locale_deleted` | Translation से किसी single locale की value remove की गई |
| `translation_locale_delete_fail` | Locale value remove करना failed |
| `vendor_translation_protected` | Vendor translation delete करने का प्रयास किया गया |
| `refreshTranslationsTableDefaults` | Translations table को अपना default-locale column reload करना चाहिए |
| `refreshTranslationRow.{id}` | एक specific translation row को refresh करना चाहिए (translation ID द्वारा parameterised) |
| `updateTranslationModal.{id}` | Translation के लिए update modal को refresh करना चाहिए |

---

## UI refresh events

| Event | कब dispatch होता है |
|---|---|
| `refreshLanguageRows` | सभी language rows को re-render करना चाहिए (उदाहरण: default change के बाद) |

---

## उदाहरण: भाषा जोड़ने पर toast दिखाएँ

Alpine.js और एक toast library का उपयोग करके:

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Language added!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

## उदाहरण: Locale change के बाद redirect करें

यदि आप language selector के locale switch करने के बाद (वर्तमान पेज के बजाय) किसी अलग URL पर redirect करना चाहते हैं:

```php
// LanguageSelector publish करें और changeLocale() override करें:
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true); // home पर redirect करें
}
```
