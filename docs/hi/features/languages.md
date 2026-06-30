# भाषाएं

Languages पेज (`/lingua/languages`) सभी इंस्टॉल किए हुए locales के लिए आपका नियंत्रण केंद्र है।

## Toolbar

पेज के ऊपर एक दो-पंक्ति toolbar है:

**पंक्ति 1 — Search और नई भाषा:**
- भाषा नाम या locale code से search करें
- **+ Add Language** बटन नई भाषा जोड़ता है

**पंक्ति 2 — Sync controls:**
- **Sync to Database** — `lang/` files से DB में import करता है
- **Sync to Local** — DB से `lang/` files में export करता है

::: tip File driver में sync button
`file` driver में "Sync to Database" बटन छुपा होता है — sync keवल `database` driver में meaningful है।
:::

## भाषा जोड़ना

**UI के माध्यम से:**

1. **+ Add Language** पर क्लिक करें
2. `x-lingua::select` component में locale search करें (129+ locales उपलब्ध)
3. **Add** पर क्लिक करें

Lingua बंडल dataset से उस locale की translations seed करता है — **कोई GitHub download नहीं**।

**Artisan के माध्यम से:**

```bash
php artisan lingua:add fr
php artisan lingua:add it es de pt_BR
```

## भाषा हटाना

किसी language row के delete बटन पर क्लिक करें। Lingua:
- `languages` table से record हटाता है
- **database driver में:** उस locale की सभी translation values `language_lines.text` JSON से remove करता है
- **file driver में:** `lang/{locale}/` directory के files साफ करता है

::: danger Default locale नहीं हटा सकते
Default locale को हटाने से पहले दूसरी भाषा को default सेट करें।
:::

## Default भाषा बदलना

किसी language row पर **Set as Default** पर क्लिक करें। Default locale वह है जिसके लिए translation delete करने पर पूरा `language_lines` record हटता है।

## भाषाएं Reorder करना

Drag-and-drop से language rows reorder करें। Language selector में display order इसी से निर्धारित होता है।

## आँकड़े

हर language row दिखाता है:
- **Total strings** — कितनी translation keys मौजूद हैं
- **Translated** — कितनी में इस locale के लिए non-empty value है
- **Coverage %** — Translated / Total

ये accessors `TranslationRepository` के माध्यम से route होते हैं (दोनों drivers में काम करते हैं)।

## Bundled Dataset से Update करना

यदि आपने Lingua update किया है और नई Laravel translation keys चाहिए:

```bash
php artisan lingua:update-lang fr
```

यह बंडल dataset से नई strings merge करता है बिना existing translations को overwrite किए।
