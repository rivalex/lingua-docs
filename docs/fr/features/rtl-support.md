# Support RTL / LTR

Lingua stocke la direction du texte (`ltr` ou `rtl`) pour chaque langue installée et
l'expose via `Lingua::getDirection()`. La mise en place du support RTL approprié
nécessite une petite modification unique dans votre layout Blade.

## Langues RTL supportées (exemples)

| Locale | Langue | Direction |
|---|---|---|
| `ar` | Arabe | `rtl` |
| `he` | Hébreu | `rtl` |
| `fa` | Persan (Farsi) | `rtl` |
| `ur` | Ourdou | `rtl` |
| `ps` | Pachto | `rtl` |
| `ug` | Ouïghour | `rtl` |

Toutes les autres locales retournent `ltr`.

## Configuration de votre layout Blade

Ajoutez les attributs `lang` et `dir` à la balise `<html>` dans votre fichier de layout
principal :

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` utilise automatiquement la locale courante de l'application —
suit chaque changement de locale sans code supplémentaire.

::: tip Pourquoi `lang` et `dir` ?
- `lang` indique au navigateur et aux lecteurs d'écran quelle langue utiliser.
- `dir` indique la direction du flux de texte. Les deux sont nécessaires pour la conformité WCAG 2.1 AA.
:::

## Locale explicite

```blade
{{-- Ex. dans un template d'e-mail par langue --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

Avec `dir` défini sur `<html>`, le variant `rtl:` de Tailwind fonctionne automatiquement :

```html
<p class="text-left rtl:text-right">Contenu</p>

<div class="pl-4 rtl:pr-4 rtl:pl-0">Élément de barre latérale</div>

<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Libellé</span>
</div>
```

## Propriétés CSS logiques (recommandé)

Pour les nouveaux layouts, préférez les **propriétés CSS logiques** — le navigateur gère
l'inversion LTR/RTL automatiquement :

```css
/* ❌ Directionnel - nécessite des remplacements RTL */
.card { padding-left: 1rem; border-left: 2px solid blue; }

/* ✅ Logique - fonctionne dans les deux directions automatiquement */
.card { padding-inline-start: 1rem; border-inline-start: 2px solid blue; }
```

| Directionnel | Équivalent logique |
|---|---|
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `margin-left` | `margin-inline-start` |
| `border-left` | `border-inline-start` |
| `left: 0` | `inset-inline-start: 0` |
| `text-align: left` | `text-align: start` |

## Vérifier la direction dans Blade

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

## Retour de valeur sûr

`Lingua::getDirection()` retourne toujours `'ltr'` si la locale n'est pas trouvée —
il ne lève jamais d'exception.
