# Settings

Settings पेज (`/lingua/settings`) Lingua का UI व्यवहार browser से configure करने देता है — config file संपादन या redeployment की आवश्यकता नहीं।

## Priority Chain

Settings तीन layers से आती हैं (highest priority पहले):

1. **Database** (`lingua_settings` टेबल) — Settings UI से
2. **Config file** (`config/lingua.php`) — `vendor:publish` के बाद
3. **Package defaults** — built-in fallback

## Selector Mode

Language selector का display mode बदलें:

| Mode | विवरण |
|---|---|
| `sidebar` | Grouped sidebar navigation item |
| `dropdown` | Compact dropdown button |
| `modal` | Button जो locale picker modal खोलता है |
| `headless` | कोई built-in rendering नहीं |

## Flags दिखाएं

Language names के बगल में country flag icons toggle करें।

## Navigation Menu <Badge type="tip" text="2.0 में नया" />

**Navigation Menu Enabled** toggle shared `x-lingua::nav` menu को enable/disable करता है जो सभी पाँच Lingua pages पर दिखता है।

यही toggle `config/lingua.php` में `nav.enabled` को correspond करता है।

## Storage Driver (Read-only)

Settings पेज active storage driver (`database` या `file`) दिखाता है — read-only। Driver बदलने के लिए `lingua:storage` command use करें। देखें [Storage Drivers](/hi/guide/storage)।

## Programmatic Access

Settings को PHP में access करें:

```php
use Rivalex\Lingua\Models\LinguaSetting;

// एक setting पढ़ें
$mode = LinguaSetting::get('selector_mode', 'sidebar');

// एक setting set करें
LinguaSetting::set('selector_mode', 'dropdown');

// Facade के माध्यम से
use Rivalex\Lingua\Facades\Lingua;

$mode = Lingua::getSetting('selector_mode');
Lingua::setSetting('selector_mode', 'modal');
```

## Settings Reset

Settings पेज पर **Reset to Defaults** button सभी `lingua_settings` records delete करता है — config file और package defaults फिर से active होते हैं।
