# Livewire Events

Lingua के Livewire components named events के माध्यम से communicate करते हैं। इन events को अपने Livewire components, Alpine.js code, या JavaScript में सुन सकते हैं।

## Livewire में सुनना

```php
use Livewire\Attributes\On;

class MyComponent extends Component
{
    #[On('language_added')]
    public function handleLanguageAdded(): void
    {
        // नई भाषा जोड़ने पर refresh करें
    }
}
```

## Alpine.js / JavaScript में सुनना

```js
window.addEventListener('language_added', (event) => {
    console.log('A new language was added!', event.detail);
});

// Livewire के event system के माध्यम से:
Livewire.on('language_added', () => {
    // ...
});
```

---

## Language Events

| Event | कब dispatch होता है |
|---|---|
| `language_added` | नई भाषा सफलतापूर्वक जोड़ी गई |
| `language_added_fail` | भाषा जोड़ना failed |
| `refreshLanguages` | Language list re-render आवश्यक |
| `language_default_set` | Default भाषा बदली गई |
| `language_default_fail` | Default भाषा सेट करना failed |
| `languages_sorted` | Drag-and-drop से भाषाएं reorder हुईं |
| `languages_sorted_fail` | Language reordering failed |

---

## DB Sync Events

| Event | कब dispatch होता है |
|---|---|
| `lang_updated` | `lingua:update-lang` सफलतापूर्वक completed |
| `lang_updated_fail` | `lingua:update-lang` failed |
| `synced_database` | Sync-to-database सफलतापूर्वक completed |
| `synced_database_fail` | Sync-to-database failed |
| `synced_local` | Sync-to-local सफलतापूर्वक completed |
| `synced_local_fail` | Sync-to-local failed |

---

## Translation Events

| Event | कब dispatch होता है |
|---|---|
| `translation_deleted` | Translation record पूरी तरह delete हुआ |
| `translation_delete_fail` | Translation delete करना failed |
| `translation_locale_deleted` | Translation से single locale की value remove हुई |
| `translation_locale_delete_fail` | Locale value remove करना failed |
| `vendor_translation_protected` | Vendor translation delete करने का प्रयास किया गया |
| `refreshTranslationsTableDefaults` | Translations table को default-locale column reload करना चाहिए |
| `refreshTranslationRow.{id}` | Specific translation row refresh करनी चाहिए (ID parameterised) |
| `updateTranslationModal.{id}` | Translation के लिए update modal refresh करनी चाहिए |

---

## Settings Events

| Event | कब dispatch होता है |
|---|---|
| `settings_saved` | Settings सफलतापूर्वक save हुई |
| `settings_save_fail` | Settings save करना failed |
| `settings_reset` | Settings defaults पर reset हुई |

---

## Transfer Events

| Event | कब dispatch होता है |
|---|---|
| `export_completed` | Export file generate हो गई |
| `export_failed` | Export generation failed |
| `import_diff_ready` | Dry-run diff calculate हो गया, preview ready |
| `import_applied` | Import commit सफलतापूर्वक apply हुआ |
| `import_failed` | Import apply करना failed |

---

## UI Refresh Events

| Event | कब dispatch होता है |
|---|---|
| `refreshLanguageRows` | सभी language rows re-render करनी चाहिए (उदाहरण: default change के बाद) |

---

## उदाहरण: भाषा जोड़ने पर toast दिखाएं

Alpine.js और एक toast library के साथ:

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Language added!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

## उदाहरण: Locale change के बाद redirect करें

```php
// LanguageSelector publish करें और changeLocale() override करें:
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true);
}
```
