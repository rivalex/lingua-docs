# Быстрый старт

Это руководство проведёт вас от свежей установки Lingua до полноценного многоязычного приложения за несколько минут.

## 1. Установка и заполнение данными

```bash
composer require rivalex/lingua
php artisan lingua:install
```

Выберите драйвер **database** при запросе (рекомендуется). Английский становится
языком по умолчанию, и встроенные строки переводов импортируются в базу данных — без загрузок с GitHub.

::: tip Безопасность по умолчанию
Маршруты управления защищены `['web', 'auth']` автоматически.
Установите `LINGUA_GATE` для доступа на основе ролей — см.
[Установка](/ru/guide/installation#protecting-the-management-ui).
:::

## 2. Добавление второго языка

```bash
php artisan lingua:add fr
```

Эта команда **работает нативно через БД**: она заполняет французские строки из встроенного
набора данных и создаёт запись `Language`. Она **не** загружает файлы и не записывает в `lang/`.

Повторите для нужного количества локалей:

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. Добавление переключателя языков в layout

Откройте ваш основной Blade-layout (например,
`resources/views/layouts/app.blade.php`):

**а) Установите `lang` и `dir` на теге `<html>`:**

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

**б) Встройте переключатель языков туда, где это подходит вашему дизайну:**

```blade
{{-- Как группа в сайдбаре (по умолчанию) --}}
<livewire:lingua::language-selector />

{{-- Как выпадающий список в навбаре --}}
<livewire:lingua::language-selector mode="dropdown" />
```

::: tip Переключение локали перезагружает текущую страницу
Когда пользователь переключает локаль, Lingua перезагружает **ту страницу, на которой он находится** (а не главную),
с защитой от открытых редиректов. См.
[Безопасность](/ru/guide/security#open-redirect-protection).
:::

## 4. Использование переводов в приложении

Lingua прозрачна — используйте стандартные хелперы Laravel как обычно:

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

В режиме database `LinguaManager` автоматически накладывает database-переводы поверх
файловых. Изменения в коде не нужны.

## 5. Перевод через UI

Перейдите на `/lingua/translations`, чтобы увидеть все строки переводов. Для каждого языка:

1. Используйте переключатель локалей (вверху справа) для выбора целевого языка
2. Нажмите на любую строку, чтобы редактировать значение прямо в таблице
3. Используйте **Show only missing**, чтобы сосредоточиться на непереведённых строках
4. Для типов HTML или Markdown rich-text редактор активируется автоматически

<Screenshot src="/screenshots/translations-page.png" alt="Страница управления переводами Lingua" caption="Страница переводов с переключателем локалей, фильтром по группе и встроенным редактором." />

## 6. Импорт / Экспорт через страницу Transfer

Нужно массово редактировать переводы в таблице или передать файл переводческому агентству? Перейдите на `/lingua/transfer`:

- **Экспорт** в CSV, JSON, XLSX или ODS — двуязычный, многолокальный или JSON-native формат
- **Импорт** с предварительным просмотром **diff** перед записью

XLSX/ODS требуют опциональный пакет `openspout/openspout`; CSV и JSON работают из коробки.

## 7. Синхронизация обратно в файлы (опционально)

Если вам нужны файлы переводов на диске (для контроля версий или CI/CD):

```bash
php artisan lingua:sync-to-local
```

Это экспортирует все переводы из БД обратно в `lang/` в правильном формате PHP/JSON.

---

## Распространённые сценарии

### Программное создание нового ключа

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
```

### Получение информации о локали

```php
use Rivalex\Lingua\Facades\Lingua;

$info = Lingua::info('fr');

if ($info !== null) {
    $info->name;      // "French"
    $info->native;    // "Français"
    $info->direction; // "ltr"
}
```

::: warning Изменено в 2.0
`Lingua::info()` теперь возвращает `?LocaleInfo` и возвращает `null` для неизвестных
локалей вместо выброса исключения. Всегда проверяйте `if ($info !== null)`.
:::

### Программное переключение локали

```php
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```
