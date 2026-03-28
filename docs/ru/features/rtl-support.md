# Поддержка RTL / LTR

Lingua хранит направление текста (`ltr` или `rtl`) для каждого установленного языка и предоставляет его через `Lingua::getDirection()`. Настройка корректной поддержки RTL требует небольшого разового изменения в вашем Blade-layout.

## Поддерживаемые RTL-языки (примеры)

| Локаль | Язык | Направление |
|---|---|---|
| `ar` | Арабский | `rtl` |
| `he` | Иврит | `rtl` |
| `fa` | Персидский (фарси) | `rtl` |
| `ur` | Урду | `rtl` |
| `ps` | Пашто | `rtl` |
| `ug` | Уйгурский | `rtl` |

Все остальные локали (включая европейские, азиатские и большинство языков с латинским письмом) возвращают `ltr`.

## Настройка Blade-layout

Добавьте атрибуты `lang` и `dir` к тегу `<html>` в вашем основном layout-файле:

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` автоматически использует текущую локаль приложения, поэтому он следует каждому переключению локали без дополнительного кода.

::: tip Зачем нужны и `lang`, и `dir`?
- `lang` сообщает браузеру и программам чтения с экрана, какой язык использовать для произношения, переносов и проверки орфографии.
- `dir` сообщает браузеру, CSS и движкам компоновки направление текстового потока. Оба атрибута необходимы для полного соответствия требованиям доступности (WCAG 2.1 AA).
:::

## Явная локаль

Передайте явную локаль, когда вам нужно направление вне контекста текущего запроса:

```blade
{{-- Например, в шаблоне письма для конкретного языка --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
// В PHP-контексте
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

При наличии `dir` на `<html>`, встроенный вариант `rtl:` в Tailwind работает автоматически — плагины и настройки не нужны:

```html
<!-- Зеркалирование выравнивания текста -->
<p class="text-left rtl:text-right">Content</p>

<!-- Зеркалирование отступов -->
<div class="pl-4 rtl:pr-4 rtl:pl-0">Sidebar item</div>

<!-- Зеркалирование расположения иконки -->
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Label</span>
</div>

<!-- Зеркалирование границы -->
<div class="border-l-4 rtl:border-r-4 rtl:border-l-0 border-blue-500">
    Highlighted content
</div>
```

## Логические CSS-свойства (рекомендуется)

Для новых layout-ов или компонентов предпочитайте **логические CSS-свойства** вместо направленных. Браузер автоматически обрабатывает переключение LTR/RTL:

```css
/* ❌ Направленные — требуют RTL-переопределений */
.card {
    padding-left: 1rem;
    border-left: 2px solid blue;
    margin-right: auto;
}

/* ✅ Логические — работают в обоих направлениях автоматически */
.card {
    padding-inline-start: 1rem;   /* left в LTR, right в RTL */
    border-inline-start: 2px solid blue;
    margin-inline-end: auto;
}
```

Ключевые соответствия логических свойств:

| Направленное | Логический эквивалент |
|---|---|
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |
| `left: 0` | `inset-inline-start: 0` |
| `text-align: left` | `text-align: start` |
| `float: left` | `float: inline-start` |

## Проверка направления в Blade

```blade
@if (Lingua::getDirection() === 'rtl')
    {{-- Разметка специально для RTL --}}
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

## Проверка направления в PHP

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // текущая локаль
$direction = Lingua::getDirection('ar');   // явная локаль

if ($direction === 'rtl') {
    // Логика для RTL
}
```

## Шрифты

Многие RTL-языки требуют специальных шрифтов. Арабский и иврит в особенности плохо отображаются с большинством латинских веб-шрифтов. Рассмотрите условную загрузку подходящего шрифта:

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans Arabic', sans-serif; }
    </style>
@endif
```

## Безопасный fallback

`Lingua::getDirection()` всегда возвращает `'ltr'` как запасной вариант, если локаль не найдена в базе данных — исключений не бросается. Метод безопасен для вызова в любой момент жизненного цикла запроса, в том числе до заполнения таблицы языков.
