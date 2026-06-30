# Поддержка RTL / LTR

Lingua хранит направление текста (`ltr` или `rtl`) для каждого установленного языка
и предоставляет его через `Lingua::getDirection()`.

## Поддерживаемые RTL-языки (примеры)

| Локаль | Язык | Направление |
|---|---|---|
| `ar` | Арабский | `rtl` |
| `he` | Иврит | `rtl` |
| `fa` | Персидский (фарси) | `rtl` |
| `ur` | Урду | `rtl` |
| `ps` | Пашто | `rtl` |
| `ug` | Уйгурский | `rtl` |

Все остальные локали возвращают `ltr`.

## Настройка Blade-layout

Добавьте атрибуты `lang` и `dir` к тегу `<html>`:

```blade
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    …
</head>
```

`Lingua::getDirection()` автоматически использует текущую локаль приложения.

::: tip Зачем нужны и `lang`, и `dir`?
- `lang` сообщает браузеру и скринридерам язык для произношения и переносов
- `dir` управляет направлением текстового потока в CSS и движке компоновки
Оба необходимы для соответствия WCAG 2.1 AA.
:::

## Явная локаль

```blade
{{-- В шаблоне письма для конкретного языка --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

Встроенный вариант `rtl:` работает автоматически при наличии `dir` на `<html>`:

```html
<p class="text-left rtl:text-right">Content</p>
<div class="pl-4 rtl:pr-4 rtl:pl-0">Sidebar item</div>
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>…</svg>
    <span>Label</span>
</div>
```

## Логические CSS-свойства (рекомендуется)

Для новых layout-ов предпочитайте **логические CSS-свойства** — браузер обрабатывает LTR/RTL автоматически:

```css
/* Направленные — требуют RTL-переопределений */
.card { padding-left: 1rem; border-left: 2px solid blue; }

/* Логические — работают в обоих направлениях */
.card {
    padding-inline-start: 1rem;
    border-inline-start: 2px solid blue;
}
```

| Направленное | Логический эквивалент |
|---|---|
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `margin-left` | `margin-inline-start` |
| `border-left` | `border-inline-start` |
| `left: 0` | `inset-inline-start: 0` |
| `text-align: left` | `text-align: start` |
| `float: left` | `float: inline-start` |

## Проверка направления в Blade и PHP

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // текущая локаль
$direction = Lingua::getDirection('ar');   // явная локаль

if ($direction === 'rtl') {
    // Логика для RTL
}
```

## Шрифты

Многие RTL-языки требуют специальных шрифтов. Рассмотрите условную загрузку:

```blade
@if (Lingua::getDirection() === 'rtl')
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Noto Sans Arabic', sans-serif; }</style>
@endif
```

## Безопасный fallback

`Lingua::getDirection()` всегда возвращает `'ltr'` при отсутствии локали в базе данных — исключений не бросается. Безопасен для вызова на любом этапе жизненного цикла запроса.
