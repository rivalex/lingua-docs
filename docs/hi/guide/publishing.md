# Assets प्रकाशित करना

Lingua कई publishable assets प्रदान करता है। अधिकांश मामलों में, `lingua:install` स्वचालित रूप से सही assets publish करता है। यह पेज manual publishing के लिए reference है।

## उपलब्ध Tags

### `lingua-config`

```bash
php artisan vendor:publish --tag="lingua-config"
```

`config/lingua.php` में publish करता है। सभी Lingua settings इस file में हैं।

::: tip
`lingua:install` wizard use करने पर यह automatically publish होता है।
:::

### `lingua-migrations`

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

Database migrations `database/migrations/` में publish करता है।

**Driver-aware publishing:** `lingua:install` wizard selected driver के अनुसार selectively publish करता है:
- **database driver**: `languages`, `language_lines`, `lingua_settings` migrations
- **file driver**: केवल `languages`, `lingua_settings` migrations (`language_lines` skip होता है)

Manual publishing पर सभी migrations publish होती हैं।

### `lingua-translations`

```bash
php artisan vendor:publish --tag="lingua-translations"
```

Lingua की UI translations (nav labels, button text, आदि) `lang/vendor/lingua/` में publish करता है। इन्हें customize करने के लिए publish करें।

::: tip
यह optional है। Lingua बिना published translations के भी काम करता है — बंडल translations package के अंदर से serve होती हैं।
:::

### `lingua-views`

```bash
php artisan vendor:publish --tag="lingua-views"
```

Blade views `resources/views/vendor/lingua/` में publish करता है। UI को heavily customize करने के लिए।

::: warning
Views publish करने के बाद, Lingua updates पर आपको manually view changes merge करने होंगे।
:::

## हटाया गया: `lingua-assets` {#removed-lingua-assets}

::: danger 2.0 में हटाया गया
`lingua-assets` vendor publish tag Lingua 2.0 में **हटाया गया** है। यदि आपके deploy scripts में `--tag=lingua-assets` है, तो उस line को हटाएं।

Lingua 2.0 CSS/JS assets Laravel के built-in asset handling के माध्यम से serve करता है — manual asset publishing की आवश्यकता नहीं।
:::

## सभी Tags एक साथ Publish करना

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

सभी publishable assets publish करता है। Production में individual tags prefer करें ताकि unwanted overrides से बचें।
