# इंस्टॉलेशन

Lingua एक इंटरएक्टिव इंस्टॉलर विज़ार्ड के साथ आता है जो एक कमांड में सब कुछ संभाल लेता है। यदि आप अधिक नियंत्रण चाहते हैं तो नीचे मैनुअल चरण भी दिए गए हैं।

## चरण 1 — Composer से इंस्टॉल करें

```bash
composer require rivalex/lingua
```

## चरण 2 — इंस्टॉलर चलाएँ

```bash
php artisan lingua:install
```

विज़ार्ड निम्नलिखित कार्य करेगा:

1. कॉन्फ़िगरेशन फ़ाइल को `config/lingua.php` पर प्रकाशित करेगा
2. डेटाबेस migration प्रकाशित करेगा
3. पूछेगा कि migration स्वचालित रूप से चलाई जाएं या नहीं
4. डेटाबेस को आपकी डिफ़ॉल्ट भाषा (डिफ़ॉल्ट रूप से अंग्रेज़ी) और Laravel Lang से उसके सभी अनुवादों के साथ seed करेगा
5. वैकल्पिक रूप से GitHub पर repo को star करेगा ⭐

जब यह पूरा हो जाए, आप देखेंगे:

```
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua package installed successfully!
```

## चरण 3 — UI एक्सेस करें

अपना एप्लिकेशन खोलें और निम्नलिखित URL पर जाएँ:

| पेज | URL | Route नाम |
|---|---|---|
| Languages | `your-app.test/lingua/languages` | `lingua.languages` |
| Translations | `your-app.test/lingua/translations` | `lingua.translations` |

बस इतना काफ़ी है। Lingua चल रहा है।

---

## मैनुअल इंस्टॉलेशन

यदि आप प्रत्येक चरण अलग-अलग प्रकाशित और चलाना पसंद करते हैं:

```bash
# 1. Config प्रकाशित करें
php artisan vendor:publish --tag="lingua-config"

# 2. Migration प्रकाशित करें
php artisan vendor:publish --tag="lingua-migrations"

# 3. Migration चलाएँ
php artisan migrate

# 4. डिफ़ॉल्ट भाषा + अनुवाद seed करें
php artisan db:seed --class="Rivalex\Lingua\Database\Seeders\LinguaSeeder"
```

---

## प्रबंधन UI की सुरक्षा

डिफ़ॉल्ट रूप से Lingua routes केवल `web` middleware का उपयोग करते हैं — कोई authentication guard स्वचालित रूप से लागू नहीं होता। **प्रोडक्शन पर जाने से पहले आपको अपना middleware जोड़ना चाहिए।**

### Config के माध्यम से

```php
// config/lingua.php
'middleware' => ['web', 'auth'],
```

### Role/permission guards के साथ (उदाहरण: Spatie Permission)

```php
'middleware' => ['web', 'auth', 'role:admin'],
// या
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

::: tip
Laravel के router द्वारा स्वीकृत कोई भी middleware array में जोड़ा जा सकता है। परिवर्तन तुरंत प्रभावी होते हैं — cache clear करने की ज़रूरत नहीं।
:::

---

## इंस्टॉलेशन के बाद की चेकलिस्ट

- [ ] `config/lingua.php` में authentication middleware जोड़ें
- [ ] अपने layout में language selector कंपोनेंट जोड़ें (देखें [Language Selector](/hi/features/language-selector))
- [ ] अपने `<html>` टैग पर `dir` और `lang` सेट करें (देखें [RTL/LTR Support](/hi/features/rtl-support))
- [ ] `php artisan lingua:add {locale}` से अतिरिक्त भाषाएँ जोड़ें
- [ ] यदि आप HTML/Markdown अनुवाद का उपयोग करते हैं तो `config/lingua.php` में editor toolbar कॉन्फ़िगर करें
