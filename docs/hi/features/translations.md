# Translations

Translations पेज (`/lingua/translations`) आपको हर translation string को browse, filter, और edit करने देता है।

## Locale Switcher

पेज के ऊपर दाईं ओर **locale switcher** है जो currently editing locale दिखाता है। यह switcher "Changed" badge दिखाता है यदि आपने कुछ unsaved changes किए हों।

दूसरा locale चुनने पर पेज उस locale के translations दिखाता है।

## Toolbar Controls

| Control | काम |
|---|---|
| Search | Key या value से filter करें |
| Group filter | एक translation group (auth, validation, आदि) पर focus करें |
| Show only missing | Non-translated strings पर focus करें |
| Locale switcher | Active editing locale बदलें |

## Inline Editing

किसी भी translation row पर click करें — एक inline editor open होता है:

- **`text` type** — simple text input
- **`html` type** — rich-text TipTap editor (database driver)
- **`markdown` type** — TipTap markdown mode (database driver)

परिवर्तन save करने के लिए **✓** या `Enter` दबाएं। Cancel करने के लिए `Escape`।

## नई Translation बनाना

Toolbar में **+ New** बटन एक form खोलता है:

- **Group** — translation group (जैसे `messages`, `emails`)
- **Key** — dot-notation key (जैसे `welcome.subject`)
- **Type** — `text`, `html`, या `markdown` (database driver)

बनाने के बाद, row table में appear होती है और तुरंत edit की जा सकती है।

## Translation Delete करना

Row पर hover करने पर delete बटन दिखता है:

- **Default locale की value हटाना** → पूरा `language_lines` record delete होता है (सभी locales की values)
- **Non-default locale की value हटाना** → केवल उस locale की value remove होती है, record रहता है

::: tip Vendor translations
Vendor-namespaced translations (third-party packages से) delete करने पर `VendorTranslationProtectedException` throw होता है। Vendor translations override तो हो सकती हैं, delete नहीं।
:::

## Clipboard

Translation value के बगल में clipboard बटन उस value को clipboard में copy करता है।

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Edit save करें |
| `Escape` | Edit cancel करें |
| `Tab` | अगली row पर जाएं |
| `Shift+Tab` | पिछली row पर जाएं |
