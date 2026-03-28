# Support RTL / LTR

Lingua stocke la direction du texte (`ltr` ou `rtl`) pour chaque langue installée et l'expose via `Lingua::getDirection()`. La mise en place du support RTL approprié nécessite une petite modification unique dans votre layout Blade.

## Langues RTL supportées (exemples)

| Locale | Langue | Direction |
|---|---|---|
| `ar` | Arabe | `rtl` |
| `he` | Hébreu | `rtl` |
| `fa` | Persan (Farsi) | `rtl` |
| `ur` | Ourdou | `rtl` |
| `ps` | Pachto | `rtl` |
| `ug` | Ouïghour | `rtl` |

Toutes les autres locales (y compris les langues européennes, asiatiques et la plupart des langues à alphabet latin) retournent `ltr`.

## Configuration de votre layout Blade

Ajoutez les attributs `lang` et `dir` à la balise `<html>` dans votre fichier de layout principal :

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
<head>
    ...
</head>
```

`Lingua::getDirection()` utilise automatiquement la locale courante de l'application, il suit donc chaque changement de locale sans code supplémentaire.

::: tip Pourquoi `lang` et `dir` ?
- `lang` indique au navigateur et aux lecteurs d'écran quelle langue utiliser pour la prononciation, la césure et la vérification orthographique.
- `dir` indique au navigateur, au CSS et aux moteurs de mise en page la direction du flux de texte. Les deux sont nécessaires pour une conformité totale à l'accessibilité (WCAG 2.1 AA).
:::

## Locale explicite

Passez une locale explicite quand vous avez besoin de la direction en dehors du contexte de la requête courante :

```blade
{{-- Ex. dans un template d'e-mail par langue --}}
<html lang="ar" dir="{{ Lingua::getDirection('ar') }}">
```

```php
// Dans un contexte PHP
$direction = Lingua::getDirection('he'); // 'rtl'
```

## Tailwind CSS

Avec `dir` défini sur `<html>`, le variant intégré `rtl:` de Tailwind fonctionne automatiquement — aucun plugin ni configuration requis :

```html
<!-- Inverser l'alignement du texte -->
<p class="text-left rtl:text-right">Contenu</p>

<!-- Inverser le rembourrage -->
<div class="pl-4 rtl:pr-4 rtl:pl-0">Élément de barre latérale</div>

<!-- Inverser le placement de l'icône -->
<div class="flex flex-row rtl:flex-row-reverse items-center gap-2">
    <svg>...</svg>
    <span>Libellé</span>
</div>

<!-- Inverser la bordure -->
<div class="border-l-4 rtl:border-r-4 rtl:border-l-0 border-blue-500">
    Contenu mis en évidence
</div>
```

## Propriétés CSS logiques (recommandé)

Pour les nouveaux layouts ou composants, préférez les **propriétés CSS logiques** aux propriétés directionnelles. Le navigateur gère automatiquement l'inversion LTR/RTL :

```css
/* ❌ Directionnel — nécessite des remplacements RTL */
.card {
    padding-left: 1rem;
    border-left: 2px solid blue;
    margin-right: auto;
}

/* ✅ Logique — fonctionne dans les deux directions automatiquement */
.card {
    padding-inline-start: 1rem;   /* gauche en LTR, droite en RTL */
    border-inline-start: 2px solid blue;
    margin-inline-end: auto;
}
```

Correspondances des propriétés logiques clés :

| Directionnel | Équivalent logique |
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

## Vérifier la direction dans Blade

```blade
@if (Lingua::getDirection() === 'rtl')
    {{-- Balisage spécifique RTL --}}
    <link rel="stylesheet" href="{{ asset('css/rtl-overrides.css') }}">
@endif
```

## Vérifier la direction en PHP

```php
use Rivalex\Lingua\Facades\Lingua;

$direction = Lingua::getDirection();       // locale courante
$direction = Lingua::getDirection('ar');   // locale explicite

if ($direction === 'rtl') {
    // Logique spécifique RTL
}
```

## Considérations sur les polices

De nombreuses langues RTL nécessitent des polices spécifiques. L'arabe et l'hébreu en particulier s'affichent mal avec la plupart des polices web latines. Envisagez de charger une police appropriée de manière conditionnelle :

```blade
@if (Lingua::getDirection() === 'rtl')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans Arabic', sans-serif; }
    </style>
@endif
```

## Retour de valeur sûr

`Lingua::getDirection()` retourne toujours `'ltr'` comme valeur de repli si la locale n'est pas trouvée dans la base de données — il ne lève jamais d'exception. Il est sûr de l'appeler à n'importe quel moment du cycle de vie de la requête, y compris avant que la table des langues soit peuplée.
