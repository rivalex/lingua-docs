# Artisan Commands

Lingua 8 Artisan commands प्रदान करता है।

---

## `lingua:install`

इंटरैक्टिव इंस्टॉलेशन विज़ार्ड।

```bash
php artisan lingua:install
```

**क्या करता है:**
1. Arrow-key selector से storage driver (`database` / `file`) चुनाता है
2. Config publish करता है → `config/lingua.php`
3. Driver-aware migrations publish करता है
4. Migrations run करने के लिए पूछता है
5. Default language install और seed करता है
6. वैकल्पिक GitHub star prompt

---

## `lingua:storage` <Badge type="tip" text="2.0 में नया" />

Storage driver switch करता है।

```bash
php artisan lingua:storage
```

**क्या करता है:**
1. Arrow-key selector से नया driver चुनाता है
2. Driver-specific migrations publish और run करता है
3. `.env` में `LINGUA_STORAGE_DRIVER` update का निर्देश देता है

::: warning Data migration
Driver switch से पहले data manually migrate करें। देखें [Storage Drivers](/hi/guide/storage#switching-between-drivers)।
:::

---

## `lingua:add`

एक locale install करता है।

```bash
php artisan lingua:add {locale}
php artisan lingua:add fr
php artisan lingua:add it es de pt_BR
```

Bundled dataset से seed करता है — **कोई internet download नहीं**।

---

## `lingua:remove`

एक locale uninstall करता है।

```bash
php artisan lingua:remove {locale}
php artisan lingua:remove fr
```

Language record और उस locale की सभी translation values remove करता है।

---

## `lingua:update-lang`

Bundled dataset से नई keys merge करता है।

```bash
php artisan lingua:update-lang {locale}
php artisan lingua:update-lang fr
```

Existing translations overwrite नहीं होती — केवल missing keys add होती हैं। Laravel update के बाद नई validation keys पाने के लिए उपयोग करें।

---

## `lingua:sync-to-database`

`lang/` files → DB।

```bash
php artisan lingua:sync-to-database
```

`lang_dir` में सभी PHP और JSON files पढ़ता है, `language_lines` में upsert करता है, और affected cache keys bust करता है।

---

## `lingua:sync-to-local`

DB → `lang/` files।

```bash
php artisan lingua:sync-to-local
```

DB से `lang/{locale}/{group}.php` और `lang/{locale}.json` files generate करता है। Atomic writes, opcache invalidation।

---

## `lingua:uninstall` <Badge type="tip" text="2.0 में नया" />

Lingua को पूरी तरह remove करता है।

```bash
php artisan lingua:uninstall
```

**क्या करता है:**
- `languages`, `language_lines`, `lingua_settings` tables drop करता है
- Published config, migrations, views remove करता है
- `lang/vendor/lingua` clean करता है

::: danger Irreversible
यह command data destroy करता है। पहले backup लें।
:::
