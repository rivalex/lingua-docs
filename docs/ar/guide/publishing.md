# نشر الأصول

تشحن Lingua بعدة مجموعات قابلة للنشر حتى تتمكن من تجاوز الأجزاء التي تحتاجها فقط.

## نشر كل شيء دفعة واحدة

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## الوسوم الفردية

### `lingua-config`

ينشر ملف الإعدادات.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**الناتج:** `config/lingua.php`

استخدم هذا لتخصيص المسارات والوسيط ووضع المحدد وشريط أدوات المحرر أو أي خيار آخر.

---

### `lingua-migrations`

ينشر هجرات قاعدة البيانات.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

**الناتج:** `database/migrations/YYYY_MM_DD_HHMMSS_create_lingua_table.php`

استخدم هذا إذا كنت بحاجة إلى تعديل مخطط `languages` أو `language_lines` - مثلًا لإضافة فهارس أو تغيير أنواع الأعمدة. بعد النشر، شغِّل `php artisan migrate` كالمعتاد.

::: warning
معالج `lingua:install` ينشر ويشغّل الهجرات تلقائيًا. انشر يدويًا فقط إذا كنت بحاجة إلى تخصيص المخطط قبل تشغيلها.
:::

---

### `lingua-translations`

ينشر نصوص ترجمة واجهة الحزمة نفسها.

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**الناتج:** `lang/vendor/lingua/{locale}/lingua.php`

يكشف هذا كل تسمية وعنوان وزر ورسالة مستخدمة في واجهة Lingua. تجاوز أي نص لـ:
- ترجمة الواجهة إلى لغة تطبيقك
- تكييف الصياغة مع أسلوب مشروعك (مثل "Add language" → "Install locale")

الملفات المنشورة تتبع هيكل ترجمة الحزمة القياسي في Laravel:

```
lang/
└── vendor/
    └── lingua/
        ├── en/
        │   └── lingua.php
        ├── fr/
        │   └── lingua.php
        └── it/
            └── lingua.php
```

---

### `lingua-views`

ينشر جميع عروض Blade وLivewire.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**الناتج:** `resources/views/vendor/lingua/`

استخدم هذا لتخصيص التخطيطات والنوافذ المنبثقة أو مكون محدد اللغة. يستخدم Laravel تلقائيًا عروضك المنشورة بدلًا من إعدادات الحزمة الافتراضية.

```
resources/views/vendor/lingua/
├── components/
│   ├── autocomplete.blade.php
│   ├── clipboard.blade.php
│   ├── editor.blade.php
│   ├── language-flag.blade.php
│   ├── menu-group.blade.php
│   └── message.blade.php
└── livewire/
    ├── languages.blade.php
    ├── language-selector.blade.php
    ├── translations.blade.php
    └── translation/
        ├── create.blade.php
        ├── delete.blade.php
        ├── row.blade.php
        └── update.blade.php
```

::: tip
انشر فقط العروض التي تنوي تغييرها. العروض غير المنشورة تُقدَّم مباشرة من الحزمة وتتلقى التحديثات الصادرة تلقائيًا.
:::

---

### `lingua-assets`

ينشر CSS وJavaScript المُجمَّعين إلى `public/`.

```bash
php artisan vendor:publish --tag="lingua-assets"
```

**الناتج:** `public/vendor/lingua/`

مطلوب فقط إذا كنت تقدِّم الأصول مباشرة من `public/` بدلًا من Vite أو CDN. **أعِد التشغيل بعد كل ترقية لـ Lingua** للحفاظ على تزامن الأصول.

---

## التحديث بعد الترقيات

بعد تحديث Lingua عبر Composer، أعِد نشر الأصول المتغيرة:

```bash
# Always re-publish compiled assets
php artisan vendor:publish --tag="lingua-assets" --force

# Re-publish UI translations if you haven't customised them
php artisan vendor:publish --tag="lingua-translations" --force
```

علامة `--force` تستبدل الملفات الموجودة. احذفها لـ `lingua-views` و`lingua-config` للحفاظ على تخصيصاتك المحلية.
