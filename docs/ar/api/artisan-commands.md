# أوامر Artisan

تشحن Lingua بستة أوامر Artisan لإدارة اللغات والترجمات من الطرفية.

## إدارة اللغات

### `lingua:add {locale}`

يثبّت لغة جديدة — يُنزِّل الملفات، ينشئ سجل قاعدة البيانات، يزامن الترجمات.

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**ما يفعله:**
1. يجلب بيانات اللغة من `laravel-lang/locales`
2. يشغِّل `lang:add {locale}` لتثبيت ملفات اللغة
3. ينشئ سجل `Language` في قاعدة البيانات
4. يشغِّل `lingua:sync-to-database` لاستيراد النصوص الجديدة

**الناتج:**
```
Adding language: it...
Installing language files via Laravel Lang...
Creating language record in database...
Syncing translations to database...
Language 'it' added successfully.
```

::: tip
بعد إضافة لغة، زر `/lingua/translations/it` لمعرفة النصوص التي لا تزال تحتاج إلى ترجمة.
:::

---

### `lingua:remove {locale}`

يزيل لغة — يحذف الملفات، ينظف قاعدة البيانات، يُعيد ترتيب اللغات المتبقية.

```bash
php artisan lingua:remove fr
```

**ما يفعله:**
1. يتحقق من أن اللغة ليست الافتراضية (يتوقف بخطأ إذا كانت كذلك)
2. يشغِّل `lang:rm {locale} --force` لإزالة ملفات اللغة
3. يزيل جميع قيم `{locale}` من `language_lines.text`
4. يحذف سجل `Language`
5. يُعيد ترتيب قيم الفرز للغات المتبقية
6. يشغِّل `lingua:sync-to-database`

::: warning حماية اللغة الافتراضية
لا يمكنك إزالة اللغة الافتراضية. عيِّن لغة أخرى كافتراضية أولًا:
```bash
php artisan lingua:add fr       # add the new default
# then via the UI: set French as default
php artisan lingua:remove en    # now safe to remove English
```
:::

---

### `lingua:update-lang`

يُحدِّث جميع ملفات اللغة المثبتة عبر Laravel Lang، ثم يُعيد المزامنة مع قاعدة البيانات.

```bash
php artisan lingua:update-lang
```

شغِّله بعد:
- ترقية Laravel (رسائل التحقق الجديدة، إلخ)
- تثبيت حزمة جديدة تشحن بترجمات
- تحديث حزم `laravel-lang/*`

---

## مزامنة الترجمات

### `lingua:sync-to-database`

يستورد جميع ملفات ترجمة PHP/JSON المحلية إلى جدول `language_lines`.

```bash
php artisan lingua:sync-to-database
```

**ما يُستورد:**
- `lang/{locale}/*.php` — ملفات PHP
- `lang/{locale}.json` — ملفات JSON
- `lang/vendor/{package}/{locale}/*.php` — ملفات حزم الطرف الثالث

يستخدم `updateOrCreate` مع تطابق `group + key`، لذا تُحافظ التعديلات الموجودة من الواجهة.

**حالات الاستخدام النموذجية:**
```bash
# After a fresh clone — populate the DB from committed lang files
php artisan lingua:sync-to-database

# After lang:update — import new strings
php artisan lingua:sync-to-database

# In a deployment script
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

### `lingua:sync-to-local`

يُصدِّر جميع ترجمات قاعدة البيانات مرة أخرى إلى ملفات PHP/JSON المحلية.

```bash
php artisan lingua:sync-to-local
```

**ما يُصدَّر:**
- ترجمات قاعدة البيانات → `lang/{locale}/{group}.php`
- مجموعة JSON (`single`) → `lang/{locale}.json`
- ترجمات الحزم الخارجية → `lang/vendor/{vendor}/{locale}/{group}.php`

**حالات الاستخدام النموذجية:**
```bash
# Before committing — export DB state to files for version control
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"

# Before deploying to a server that reads from files
php artisan lingua:sync-to-local
```

---

### `lingua:install`

معالج الإعداد التفاعلي لأول مرة. يُشغَّل مرة واحدة بعد `composer require`.

```bash
php artisan lingua:install
```

غير مُعَدّ لإعادة التشغيل بعد الإعداد الأولي. إذا كنت بحاجة إلى إعادة نشر أصول فردية، استخدم وسوم `vendor:publish` بدلًا من ذلك.

---

## مرجع سريع للأوامر

<div class="command-table">

| الأمر | الوصف |
|---|---|
| `lingua:add {locale}` | تثبيت لغة (ملفات + قاعدة البيانات + مزامنة) |
| `lingua:remove {locale}` | إزالة لغة (ملفات + قاعدة البيانات + مزامنة) |
| `lingua:update-lang` | تحديث ملفات اللغة عبر Laravel Lang + مزامنة |
| `lingua:sync-to-database` | استيراد الملفات المحلية → قاعدة البيانات |
| `lingua:sync-to-local` | تصدير قاعدة البيانات → الملفات المحلية |
| `lingua:install` | معالج الإعداد التفاعلي لأول مرة |

</div>

---

## نصائح

::: tip أتمتة المزامنة في CI/CD
أضف المزامنة إلى خط النشر للحفاظ على تزامن قاعدة البيانات مع مستودعك:

```yaml
# GitHub Actions deploy step (example)
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::

::: tip إضافة لغات متعددة دفعة واحدة
لا يوجد أمر إضافة جماعية، لكن يمكنك تسلسل الاستدعاءات في حلقة shell:

```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::

::: tip التحقق مما سيُزامَن
قبل تشغيل `lingua:sync-to-database`، يمكنك معاينة عدد الملفات واللغات التي ستُعالَج بفحص `lang/`:

```bash
ls lang/
# en  fr  it  vendor
```
:::
