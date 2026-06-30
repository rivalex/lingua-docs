# सुरक्षा

Lingua 2.0 एक व्यापक **F1–F9 हार्डनिंग पास** के साथ शिप करता है। यह पेज प्रत्येक fix को दस्तावेज़ीकृत करता है और एक deployment checklist प्रदान करता है।

## हार्डनिंग सारांश

| ID | श्रेणी | विवरण |
|---|---|---|
| **F1** | XSS संरक्षण | HTML/Markdown प्रकार के translation values ब्राउज़र में render होने से पहले DOMPurify से sanitize होते हैं |
| **F2** | पाथ ट्रैवर्सल | `lang_dir` के बाहर `../` jump को `PathGuard` reject करता है |
| **F3** | SQL इंजेक्शन बैन | JSON SQL functions (`JSON_KEYS`, `OPENJSON`, आदि) सभी queries से banned हैं |
| **F4** | वेंडर प्रोटेक्शन | Vendor-namespaced translations delete नहीं हो सकते — `VendorTranslationProtectedException` throw होता है |
| **F5** | ऑथ गेट | `LINGUA_GATE` env var के माध्यम से custom authorization gate support |
| **F6** | Exception Non-Disclosure | Production में internal exception messages UI में expose नहीं होते |
| **F7** | Open-Redirect Guard | Locale switch केवल same-origin paths पर redirect करता है |
| **F8** | Asset Security | Assets public directory के बाहर serve नहीं होते |
| **F9** | Formula Injection | CSV export में `=`, `+`, `-`, `@` से शुरू होने वाले values escape होते हैं |

---

## प्रमाणीकरण {#authentication}

प्रबंधन रूट (`/lingua/*`) डिफ़ॉल्ट रूप से `['web', 'auth']` Middleware द्वारा सुरक्षित हैं। अनधिकृत requests 401/403 return करती हैं — कोई redirect leak नहीं।

### रोल-आधारित पहुंच

रोल-आधारित access के लिए `LINGUA_GATE` define करें:

```env
LINGUA_GATE=manage-translations
```

```php
// app/Providers/AppServiceProvider.php
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn ($user) => $user->hasRole('admin'));
```

Lingua सभी admin routes में `can:manage-translations` Middleware जोड़ता है। 

---

## XSS संरक्षण (F1)

`html` या `markdown` type के translations display होने से पहले स्वचालित रूप से sanitize होते हैं। Lingua DOMPurify का उपयोग करता है — `<script>` tags और inline event handlers strip हो जाते हैं।

::: warning
यदि आप `{!! $translation !!}` syntax से raw HTML output करते हैं, तो Blade का `{{ }}` auto-escaping bypass हो जाता है। केवल trusted sources के लिए `{!! !!}` उपयोग करें।
:::

---

## पाथ ट्रैवर्सल (F2)

`file` driver मोड में, Lingua `lang_dir` के बाहर paths resolve करने से इनकार करता है। यह `../../../etc/passwd` जैसे requests को block करता है।

`PathGuard` हर file write और read operation पर run होता है:

```php
// यह exception throw करेगा:
// TranslationFileException: Path traversal detected
$path = $langDir . '/../../../etc/passwd';
```

---

## Open-Redirect Protection {#open-redirect-protection}

जब कोई user locale switch करता है, Lingua redirect destination को validate करता है:

- **केवल same-origin paths** allow हैं (scheme + host मेल खाना चाहिए)
- **External URLs** reject होते हैं — यहाँ तक कि यदि `Referer` header में हों
- **Empty या malformed paths** `/` पर fallback होते हैं

`ManagesLocale` trait `getRequestUri()` उपयोग करता है और यह सुनिश्चित करता है कि redirect path local है।

---

## File-Mode Security (F2 + Opcache)

`file` driver उपयोग करते समय:

- सभी writes `AtomicFileWriter` से होते हैं जो temp file + rename pattern उपयोग करता है
- हर write के बाद `opcache_invalidate($path, true)` call होता है ताकि stale bytecode serve न हो
- `lang_dir` के बाहर कोई write नहीं होता (`PathGuard` द्वारा enforce)

---

## Formula Injection (F9)

CSV export में, `=`, `+`, `-`, `@` से शुरू होने वाले translation values prefix के साथ escape होते हैं ताकि Microsoft Excel / Google Sheets में formula injection न हो:

```
=HYPERLINK("http://evil.com")  →  '=HYPERLINK("http://evil.com")
```

---

## सुरक्षा Checklist

Production में deploy करने से पहले:

- [ ] `LINGUA_GATE` set करें या `config/lingua.php` में `middleware` customize करें
- [ ] `APP_DEBUG=false` verify करें (exception non-disclosure के लिए)
- [ ] `app.url` सही domain पर point करता है (open-redirect guard के लिए)
- [ ] यदि `file` driver है, तो `lang_dir` web-accessible नहीं है
- [ ] `lingua_settings` टेबल migrate हुई है (`php artisan migrate`)
- [ ] अपने authorization layer को test करें — `/lingua/languages` anonymously accessible नहीं होना चाहिए

---

## Vulnerability Reporting

यदि आपको कोई security vulnerability मिले, तो GitHub पर public issue न खोलें। इसके बजाय, `security@rivalex.com` पर email करें या GitHub Security Advisories के माध्यम से report करें।
