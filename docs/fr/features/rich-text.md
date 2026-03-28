# Éditeur de texte enrichi

Lingua intègre [TipTap 3](https://tiptap.dev) comme éditeur de texte enrichi optionnel pour les types de traduction HTML et Markdown. L'éditeur approprié s'active automatiquement selon la colonne `type` de la traduction.

## Types de traduction

| Type | Éditeur | Description |
|---|---|---|
| `text` | `<textarea>` simple | Par défaut pour toutes les traductions standard |
| `html` | TipTap WYSIWYG | Pour le contenu devant être rendu avec mise en forme HTML |
| `markdown` | TipTap Markdown | Pour le contenu rédigé en syntaxe Markdown |

## Configurer la barre d'outils

La barre d'outils de l'éditeur est contrôlée globalement via `config/lingua.php` :

```php
'editor' => [
    'headings'      => false,  // Boutons de titres H1-H3
    'bold'          => true,
    'italic'        => true,
    'underline'     => true,
    'strikethrough' => false,
    'bullet'        => true,   // Liste non ordonnée
    'ordered'       => true,   // Liste ordonnée
    'clear'         => true,   // Effacer la mise en forme
],
```

N'activez que les options dont votre contenu a réellement besoin. Garder la barre d'outils minimale réduit la charge cognitive pour les traducteurs.

<Screenshot src="/screenshots/editor-toolbar.png" alt="Barre d'outils de l'éditeur" caption="La barre d'outils de l'éditeur HTML avec les options par défaut actives." />

## Changer le type d'une traduction

Dans la modale de modification (icône crayon, locale par défaut uniquement), sélectionnez le type souhaité dans le menu déroulant **Type**. L'éditeur se met à jour immédiatement sur la ligne sans rechargement de page.

::: tip Détection automatique
Lors de la première exécution de `lingua:sync-to-database`, Lingua détecte automatiquement le type selon le contenu. Vous pouvez le remplacer manuellement à tout moment — la valeur stockée n'est pas modifiée quand vous changez le type, seul le comportement de l'éditeur change.
:::

## Travailler avec les traductions HTML

Les traductions HTML sont stockées sous forme de HTML brut dans la colonne JSON `text` :

```json
{"en": "<p>Welcome to <strong>Lingua</strong> — the translation manager for Laravel.</p>"}
```

Pour les rendre dans Blade sans double-échappement :

```blade
{{-- Utilisez toujours {!! !!} pour les types de traduction HTML --}}
{!! __('marketing.hero_body') !!}
```

::: warning XSS
Utilisez `{!! !!}` uniquement pour les chaînes de traduction gérées par des utilisateurs autorisés dans un panneau d'administration contrôlé. Ne rendez jamais d'entrée utilisateur non fiable sous forme de HTML brut.
:::

## Travailler avec les traductions Markdown

Les traductions Markdown stockent du Markdown brut :

```json
{"en": "## Welcome!\n\nThank you for choosing **Lingua**.\n\n- Feature one\n- Feature two"}
```

Pour rendre du Markdown dans Blade, utilisez un analyseur Markdown. Laravel est livré avec `Str::markdown()` :

```blade
{!! Str::markdown(__('emails.welcome_body')) !!}
```

Ou utilisez un package dédié comme [league/commonmark](https://commonmark.thephpleague.com).

## Le composant `x-lingua::editor`

L'éditeur est exposé comme composant Blade réutilisable en dehors de l'interface de gestion Lingua :

```blade
{{-- Mode texte --}}
<x-lingua::editor
    wire:model="myField"
    type="text"
    placeholder="Saisir du texte…"
/>

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
| `label` | string | Libellé optionnel au-dessus de l'éditeur |
| `placeholder` | string | Texte d'espace réservé |
| `required` | bool | Affiche un badge obligatoire quand `true` |

::: tip
Le composant `x-lingua::editor` est un excellent point de départ pour tout formulaire Livewire nécessitant un champ de texte enrichi. Publiez la vue du composant pour personnaliser la barre d'outils ou le style.
:::
