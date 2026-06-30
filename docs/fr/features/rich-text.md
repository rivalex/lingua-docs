# Éditeur de texte riche

Lingua intègre [TipTap 3](https://tiptap.dev) comme éditeur de texte riche optionnel
pour les types de traduction HTML et Markdown. L'éditeur approprié s'active automatiquement
selon la colonne `type` de la traduction.

::: tip Pilote base de données uniquement
Les types HTML et Markdown — et donc l'éditeur TipTap — sont disponibles uniquement avec
le pilote `database`. En pilote `file`, toutes les traductions sont stockées en texte brut.
:::

## Types de traduction

| Type | Éditeur | Description |
|---|---|---|
| `text` | `<textarea>` simple | Par défaut pour toutes les traductions standard |
| `html` | TipTap WYSIWYG | Pour le contenu rendu avec mise en forme HTML |
| `markdown` | TipTap Markdown | Pour le contenu rédigé en syntaxe Markdown |

## Configurer la barre d'outils

La barre d'outils de l'éditeur est contrôlée via `config/lingua.php` :

```php
'editor' => [
    'headings'      => false,  // Boutons de titres H1-H3
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'subscript'     => true,
    'superscript'   => true,
    'blockquote'    => false,
    'code-line'     => false,
    'code-block'    => false,
    'bullet'        => true,   // Liste non ordonnée
    'ordered'       => true,   // Liste ordonnée
    'clear'         => true,   // Effacer la mise en forme
    'code-mode'     => false,  // Mode édition HTML brute
],
```

## Changer le type d'une traduction

Dans la modal de modification (icône crayon, locale par défaut uniquement), sélectionnez
le type souhaité dans le menu déroulant. L'éditeur se met à jour immédiatement.

## Travailler avec les traductions HTML

Les traductions HTML sont stockées en HTML brut dans la colonne JSON `text` :

```json
{"en": "<p>Welcome to <strong>Lingua</strong>.</p>"}
```

Pour les rendre dans Blade sans double-échappement :

```blade
{{-- Utilisez toujours {!! !!} pour les types HTML --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
Utilisez `{!! !!}` uniquement pour les chaînes gérées par des utilisateurs autorisés.
Ne rendez jamais d'entrée utilisateur non fiable en HTML brut.
:::

## Travailler avec les traductions Markdown

Les traductions Markdown stockent du Markdown brut :

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**."}
```

Pour rendre en Blade, utilisez `Str::markdown()` :

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

## Le composant `x-lingua::editor`

L'éditeur est exposé comme composant Blade réutilisable :

```blade
{{-- Mode HTML --}}
<x-lingua::editor
    wire:model="myField"
    type="html"
    label="Contenu du corps"
    :required="true"
/>

{{-- Mode Markdown --}}
<x-lingua::editor
    wire:model="myField"
    type="markdown"
    placeholder="Écrire en Markdown…"
/>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `wire:model` | string | Propriété Livewire à lier |
| `type` | string | `'text'`, `'html'` ou `'markdown'` |
| `label` | string | Libellé optionnel |
| `placeholder` | string | Texte d'espace réservé |
| `required` | bool | Affiche un badge obligatoire quand `true` |
