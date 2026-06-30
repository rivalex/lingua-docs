# أوامر Artisan

يشحن Lingua بـ **8 أوامر** Artisan لإدارة اللغات والترجمات والمحركات.

## مرجع سريع

| الأمر | الوصف |
|---|---|
| `lingua:install` | معالج الإعداد التفاعلي (مرة واحدة) |
| `lingua:storage {driver}` | تبديل محرك التخزين (`database`/`file`) |
| `lingua:add {locale}` | تثبيت لغة (بيانات + قاعدة بيانات + بذر) |
| `lingua:remove {locale}` | إزالة لغة (بيانات + قاعدة بيانات) |
| `lingua:update-lang` | تحديث الترجمات المدمجة |
| `lingua:sync-to-database` | استيراد ملفات `lang/` → قاعدة البيانات |
| `lingua:sync-to-local` | تصدير قاعدة البيانات → ملفات `lang/` |
| `lingua:uninstall` | إزالة Lingua بشكل آمن |

---

## `lingua:install`

```bash
php artisan lingua:install
```

معالج الإعداد التفاعلي لمرة واحدة بعد `composer require`. يقوم بـ:

1. عرض محدد محرك التخزين بمفاتيح الأسهم
2. نشر الإعداد والهجرات **الواعية بالمحرك**
3. تشغيل الهجرات (اختياري)
4. بذر اللغة الافتراضية وترجماتها من المجموعة المدمجة
5. خيار تمييز بنجمة على GitHub

---

## `lingua:storage {driver}`

```bash
php artisan lingua:storage database
php artisan lingua:storage file
```

يبدِّل محرك التخزين النشط. يُحدِّث `.env` ويُرشدك عبر
خطوات الهجرة/المزامنة. غير مدمِّر في كلا الاتجاهين.

---

## `lingua:add {locale}`

```bash
php artisan lingua:add fr
php artisan lingua:add pt_BR ar zh
```

يثبّت لغة جديدة:

1. يبحث عن اللغة في سجل Lingua المدمج (129+ لغة)
2. ينشئ سجل `Language` في قاعدة البيانات
3. يبذر ترجماتها من مجموعة البيانات المدمجة — **بدون تنزيلات**
4. يُحدِّث ترتيب الفرز

**لا يستدعي `lang:add` بعد الآن.** أصيل لقاعدة البيانات — لا كتابة إلى ملفات `lang/`.

---

## `lingua:remove {locale}`

```bash
php artisan lingua:remove fr
```

يزيل لغة بشكل كامل:

1. يتحقق من أن اللغة ليست الافتراضية
2. يزيل جميع قيم `{locale}` من `language_lines.text`
3. يحذف سجل `Language`
4. يُعيد ترتيب الفرز

::: warning حماية اللغة الافتراضية
لا يمكن إزالة اللغة الافتراضية. عيِّن لغة أخرى كافتراضية أولاً.
:::

---

## `lingua:update-lang`

```bash
php artisan lingua:update-lang
```

يُحدِّث **الترجمات المدمجة فقط** (مجموعات `auth`، `validation`، إلخ)
من مجموعة البيانات الداخلية لـ Lingua. لا يلمس ترجماتك المخصصة.

شغِّله بعد:
- ترقية Laravel (رسائل تحقق جديدة)
- إضافة حزمة تشحن بترجمات

---

## `lingua:sync-to-database`

```bash
php artisan lingua:sync-to-database
```

يستورد جميع ملفات `lang/` إلى `language_lines` باستخدام `updateOrCreate`.
التعديلات الموجودة في الواجهة تُحافظ عليها.

```bash
# After a fresh clone
php artisan migrate && php artisan lingua:sync-to-database

# In CI/CD deploy script
php artisan lingua:sync-to-database
```

---

## `lingua:sync-to-local`

```bash
php artisan lingua:sync-to-local
```

يُصدِّر جميع ترجمات قاعدة البيانات إلى ملفات PHP/JSON في `lang/`.

```bash
# Before committing
php artisan lingua:sync-to-local && git add lang/ && git commit -m "sync translations"
```

---

## `lingua:uninstall`

```bash
php artisan lingua:uninstall
```

يرشدك عبر الإزالة الآمنة خطوةً بخطوة. لا ينفِّذ أي إجراء
مدمِّر بدون تأكيدك الصريح.

---

## نصائح

::: tip إضافة لغات متعددة
```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::

::: tip أتمتة في CI/CD
```yaml
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::
