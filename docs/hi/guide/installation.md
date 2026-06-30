# इंस्टॉलेशन

Lingua एक इंटरैक्टिव इंस्टॉलर विज़ार्ड के साथ आता है जो एक कमांड में सब कुछ संभालता है। यदि आप अधिक नियंत्रण चाहते हैं तो मैन्युअल चरण भी नीचे दस्तावेज़ीकृत हैं।

## चरण 1 — Composer के माध्यम से इंस्टॉल करें

```bash
composer require rivalex/lingua
```

बस यही एकमात्र पैकेज है जिसकी आपको आवश्यकता है। Lingua 2.0 अपना स्वयं का लोकेल डेटा और ट्रांसलेशन डेटासेट बंडल करता है, इसलिए कुछ और require करने की आवश्यकता नहीं है।

::: tip 1.x से अपग्रेड कर रहे हैं?
Composer स्वचालित रूप से पुरानी `spatie/laravel-translation-loader` निर्भरता हटाता है। यदि आपके अपने `composer.json` में अभी भी `laravel-lang/common` सूचीबद्ध है, तो इसे हटाएं: `composer remove laravel-lang/common`। पूरा [अपग्रेड गाइड](/hi/guide/upgrade) देखें।
:::

## चरण 2 — इंस्टॉलर चलाएं

```bash
php artisan lingua:install
```

विज़ार्ड इंटरैक्टिव है। [Laravel Prompts](https://laravel.com/docs/prompts) का उपयोग करते हुए, यह आपसे **स्टोरेज ड्राइवर** चुनने के लिए कहता है एक arrow-key सेलेक्टर के साथ:

| ड्राइवर | इसे चुनें जब… |
|---|---|
| **`database`** *(अनुशंसित)* | आप पूर्ण फीचर सेट चाहते हैं: HTML/Markdown प्रकार, आँकड़े, आयात/निर्यात, वेंडर गार्ड, और सर्जिकल कैशिंग। |
| **`file`** | आप अनुवाद संस्करण नियंत्रण में रखते हैं या read-only/CI वातावरण में चलाते हैं और साधारण `lang/` फ़ाइलें पसंद करते हैं। |

विज़ार्ड फिर:

1. कॉन्फ़िगरेशन फ़ाइल को `config/lingua.php` पर प्रकाशित करता है
2. **ड्राइवर-जागरूक** माइग्रेशन प्रकाशित करता है (`file` ड्राइवर `language_lines` माइग्रेशन छोड़ता है)
3. माइग्रेशन स्वचालित रूप से चलाने के लिए पूछता है
4. डेटाबेस को आपकी डिफ़ॉल्ट भाषा और बंडल डेटासेट से उसके अनुवादों के साथ सीड करता है — **कोई GitHub डाउनलोड नहीं**
5. वैकल्पिक रूप से GitHub पर रेपो को स्टार करता है ⭐

जब यह समाप्त होता है तो आप देखेंगे:

```
✓ Driver selected          →  database
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua installed successfully!
```

## चरण 3 — UI तक पहुंचें

अपना एप्लिकेशन खोलें और यहाँ जाएं:

| पेज | URL | रूट का नाम |
|---|---|---|
| Languages | `your-app.test/lingua/languages` | `lingua.languages` |
| Translations | `your-app.test/lingua/translations` | `lingua.translations` |
| Statistics | `your-app.test/lingua/statistics` | `lingua.statistics` |
| Transfer | `your-app.test/lingua/transfer` | `lingua.transfer` |
| Settings | `your-app.test/lingua/settings` | `lingua.settings` |

बस। Lingua चल रहा है।

---

## मैन्युअल इंस्टॉलेशन

यदि आप प्रत्येक चरण को अलग से प्रकाशित और चलाना पसंद करते हैं:

```bash
# 1. कॉन्फ़िग प्रकाशित करें
php artisan vendor:publish --tag="lingua-config"

# 2. माइग्रेशन प्रकाशित करें (ड्राइवर-जागरूक)
php artisan vendor:publish --tag="lingua-migrations"

# 3. माइग्रेशन चलाएं
php artisan migrate

# 4. अपनी डिफ़ॉल्ट भाषा जोड़ें और उसके अनुवाद सीड करें
php artisan lingua:add en
```

पूरी टैग सूची के लिए [Publishing Assets](/hi/guide/publishing) देखें।

---

## प्रबंधन UI की सुरक्षा करना

<Badge type="tip" text="2.0 में नया" /> Lingua 2.0 **डिफ़ॉल्ट रूप से सुरक्षित** है। प्रबंधन रूट स्वचालित रूप से `['web', 'auth']` Middleware के साथ शिप होते हैं — गुमनाम विज़िटर UI तक नहीं पहुँच सकते।

### गेट के साथ पहुंच कसना

रोल-आधारित पहुंच के लिए, एक ऑथराइज़ेशन गेट परिभाषित करें और Lingua को `LINGUA_GATE` एनवायरनमेंट वेरिएबल के साथ उसकी ओर इशारा करें। Lingua अपने एडमिन रूट में `can:{gate}` जोड़ता है:

```env
LINGUA_GATE=manage-translations
```

```php
// app/Providers/AppServiceProvider.php — boot()
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $user) => $user->hasRole('admin'));
```

आप Middleware सरणी को सीधे भी संपादित कर सकते हैं:

```php
// config/lingua.php
'middleware' => ['web', 'auth', 'role:admin'],
```

::: tip
Laravel के राउटर द्वारा स्वीकार किया गया कोई भी Middleware सरणी में जोड़ा जा सकता है। परिवर्तन तुरंत प्रभावी होते हैं — कोई कैश क्लियर आवश्यक नहीं।
:::

पूर्ण हार्डनिंग अवलोकन के लिए [Security reference](/hi/guide/security) देखें।

---

## इंस्टॉलेशन के बाद चेकलिस्ट

- [ ] `config/lingua.php` में स्टोरेज ड्राइवर की पुष्टि करें कि यह आपके डिप्लॉयमेंट से मेल खाता है (`database` या `file`)
- [ ] वैकल्पिक रूप से रोल-आधारित पहुंच के लिए `LINGUA_GATE` सेट करें
- [ ] अपने लेआउट में language selector कंपोनेंट जोड़ें (देखें [Language Selector](/hi/features/language-selector))
- [ ] अपने `<html>` टैग पर `dir` और `lang` सेट करें (देखें [RTL/LTR Support](/hi/features/rtl-support))
- [ ] `php artisan lingua:add {locale}` के माध्यम से अतिरिक्त भाषाएं जोड़ें
- [ ] यदि आप HTML/Markdown अनुवाद उपयोग करते हैं तो `config/lingua.php` में editor toolbar कॉन्फ़िगर करें (database ड्राइवर)
