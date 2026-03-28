# Vendor Translations

Vendor translations वे strings हैं जो तृतीय-पक्ष packages से संबंधित हैं — Laravel के अपने validation messages, pagination labels, password reset strings, और किसी भी अन्य package के translations जो अपनी `lang/` directory के साथ आते हैं।

## उन्हें कैसे पहचाना जाता है

`lingua:sync-to-database` के दौरान, Lingua `lang/vendor/` directory structure को scan करता है। वहाँ मिली कोई भी translation file इन के साथ import होती है:

- `is_vendor = true`
- `vendor` = package का नाम (directory name से derived, उदाहरण: `spatie`, `laravel`, `filament`)

Sync के बाद database rows का उदाहरण:

```
group      | key          | is_vendor | vendor   | text
-----------|--------------|-----------|----------|-----------------------------
validation | required     | false     | null     | {"en":"The :attribute…"}
passwords  | reset        | true      | laravel  | {"en":"Your password…"}
auth       | failed       | true      | laravel  | {"en":"These credentials…"}
```

::: tip
Laravel की अपनी `lang/en/*.php` files (auth, validation, pagination, passwords) को **vendor translations** माना जाता है क्योंकि वे framework से आती हैं, आपके application code से नहीं।
:::

## Vendor translations के साथ आप क्या कर सकते हैं

| कार्य | अनुमति? | नोट्स |
|---|---|---|
| **Value संपादित करें** | ✅ हाँ | किसी भी vendor string को अपनी wording से override करें |
| **Type बदलें** | ✅ हाँ | text / html / markdown के बीच switch करें |
| **Group या key संपादित करें** | ❌ नहीं | Edit modal में Group और key fields locked हैं |
| **हटाएँ** | ❌ नहीं | `VendorTranslationProtectedException` द्वारा सुरक्षित |

## एक vendor string को override करना

सबसे सामान्य उपयोग का मामला Laravel के validation messages को अपने application के tone से match करने के लिए override करना है:

1. `/lingua/translations` खोलें
2. String ढूंढें (उदाहरण: `validation.required`)
3. Update modal खोलने के लिए edit आइकन पर क्लिक करें
4. किसी भी locale के लिए value बदलें
5. Save करें — override अगले request पर तुरंत लागू होता है

```php
// या facade के माध्यम से programmatically:
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Please fill in the :attribute field.',
    locale: 'en'
);
```

## Vendor translations query करना

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// सभी vendor translations
$all = Translation::where('is_vendor', true)->get();

// किसी specific package के सभी vendor translations
$laravel = Lingua::getVendorTranslations('laravel');

// French values के साथ किसी package के सभी vendor translations
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');

// Group और key के अनुसार manually filter करें
$required = Translation::where('is_vendor', true)
    ->where('vendor', 'laravel')
    ->where('group', 'validation')
    ->where('key', 'required')
    ->first();
```

## Protection mechanism

किसी vendor translation को delete करने का प्रयास (UI से या `Lingua::forgetTranslation()` के माध्यम से) `VendorTranslationProtectedException` throw करता है:

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en'); // key एक vendor translation से संबंधित है
} catch (VendorTranslationProtectedException $e) {
    // Gracefully handle करें
}
```

Livewire UI में, deletion attempts एक `vendor_translation_protected` event dispatch करते हैं और बिना कुछ delete किए modal बंद कर देते हैं। Event को अपने Livewire components या Alpine.js code में सुना जा सकता है:

```js
// Alpine.js / Livewire event listener
window.addEventListener('vendor_translation_protected', () => {
    alert('This translation is protected and cannot be deleted.');
});
```

## Vendor translations फिर से sync करना

यदि आप जिस package पर निर्भर हैं वह version bump में नई translation keys जोड़ता है, तो उन्हें import करने के लिए फिर से sync करें:

```bash
# laravel-lang से latest pull करें और DB में sync करें
php artisan lingua:update-lang

# या अपनी मौजूदा lang/ files से manually फिर से sync करें
php artisan lingua:sync-to-database
```

Lingua sync करते समय `updateOrCreate` का उपयोग करता है, इसलिए मौजूदा overrides (संपादित values) preserved रहते हैं।

## Vendor translation imports disable करना

यदि आप डेटाबेस में vendor translations बिल्कुल नहीं चाहते, तो `lang/vendor/` directory हटाने के बाद sync करें। Lingua केवल वही import करता है जो disk पर मिलता है।
