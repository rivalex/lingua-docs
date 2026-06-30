# Transfer — आयात / निर्यात

Transfer पेज (`/lingua/transfer`) translations को अपने एप्लिकेशन के बाहर import और export करने देता है। Translation agencies, spreadsheet bulk-edit, या CI pipelines के लिए उपयोगी।

## समर्थित Formats

| Format | Export | Import | आवश्यकता |
|---|---|---|---|
| CSV | हाँ | हाँ | कोई नहीं (built-in) |
| JSON | हाँ | हाँ | कोई नहीं (built-in) |
| XLSX | हाँ | हाँ | `openspout/openspout` |
| ODS | हाँ | हाँ | `openspout/openspout` |

XLSX/ODS के लिए वैकल्पिक dependency install करें:

```bash
composer require openspout/openspout
```

## Export

### Export Layouts

| Layout | विवरण |
|---|---|
| **Bilingual** | Source locale + target locale — दो columns। Translation agencies के लिए आदर्श। |
| **Multi-locale** | सभी installed locales एक साथ — एक spreadsheet में पूरा dataset। |
| **JSON-native** | Laravel के native JSON format में — locale per file। |

### Export करने के चरण

1. `/lingua/transfer` पर जाएं
2. **Export** tab select करें
3. Format, layout, और scope (all groups, specific group, specific locales) choose करें
4. **Export** पर click करें — file download होगी

### Artisan के माध्यम से Export

```bash
php artisan lingua:sync-to-local
```

DB → `lang/` files export (JSON/PHP format)।

## Import

Import **दो-चरण प्रक्रिया** है जो data loss से बचाती है:

### चरण 1: Dry-run Preview (Diff)

File upload करने पर Lingua पहले **diff preview** दिखाता है:

| Column | विवरण |
|---|---|
| Key | Translation key |
| Group | Translation group |
| Locale | Target locale |
| Current | Database में मौजूद value |
| Incoming | File में मिली value |
| Status | `new`, `changed`, `unchanged`, `conflict` |

कुछ भी write नहीं होता इस stage पर।

### चरण 2: Import Apply करना

Diff review करने के बाद **Apply Import** पर click करें। Lingua:
- New translations create करता है
- Changed values update करता है
- Unchanged rows skip करता है
- Vendor-namespaced translations को protect करता है

### Import Rules

- **Type precedence**: यदि existing record में `html` या `markdown` type है, import उसे `text` में downgrade नहीं करता
- **Vendor guard**: Vendor namespace translations (`*` prefix) import से protect हैं
- **Wildcard rejection**: `*` locale वाले imports reject होते हैं

## Formula Injection Protection

CSV export में, `=`, `+`, `-`, `@` से शुरू होने वाले values automatically escape होते हैं ताकि spreadsheet software में formula injection न हो। देखें [Security](/hi/guide/security)।
