# Vendor Translations

Vendor translations वे strings हैं जो third-party packages से आती हैं — Laravel के अपने validation messages, pagination labels, password reset strings, और किसी भी package के translations जो अपनी `lang/` directory के साथ आते हैं।

## कैसे पहचाना जाता है

Lingua vendor translations को `group` column में `*` namespace prefix से पहचानता है:

```
group = "*"                    → Lingua का खुद का namespace
group = "vendor.spatie.*"      → Spatie package
group = "vendor.filament.*"    → Filament package
```

Database driver और file driver दोनों में यह distinction maintain होती है।

## क्या कर सकते हैं

**Override करें:**

Translations पेज पर vendor translation key पर click करके value change करें। Override DB में save होता है और file को छुए बिना active रहता है।

**Query करें:**

```php
use Rivalex\Lingua\Facades\Lingua;

// एक specific vendor translation पढ़ें
$value = Lingua::getVendorTranslation('en', 'validation', 'required');

// सभी vendor translations list करें
$all = Lingua::getVendorTranslationsForGroup('en', 'validation');
```

## Protection Mechanism

Vendor translations को **accidentally delete** करने से बचाया जाता है। Delete attempt पर `VendorTranslationProtectedException` throw होता है — UI यह error gracefully दिखाता है।

यह दोनों storage drivers में enforce होता है:
- **Database:** `DatabaseRepository::delete()` में check
- **File:** `FileRepository::delete()` में check

## Re-syncing

यदि आपने vendor package update किया है और नई vendor strings चाहिए:

```bash
php artisan lingua:sync-to-database
```

यह existing vendor overrides को preserve करते हुए नई keys add करता है।

## दोनों Drivers में Vendor Support

**Database driver:** Vendor strings `language_lines` में `*` namespace prefix के साथ store होती हैं। Cache `CacheKey::forVendorGroup()` के माध्यम से bust होती है।

**File driver:** Vendor strings `lang/vendor/{package}/` directories में रहती हैं। Same protection और override mechanics apply होती हैं।
