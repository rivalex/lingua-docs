# Composants Blade

Lingua enregistre plusieurs composants Blade anonymes sous le préfixe `lingua::`. Ils sont utilisés en interne par les vues Livewire et peuvent aussi être réutilisés dans vos propres templates.

## `<x-lingua::editor>`

Un composant éditeur polymorphe qui rend un `<textarea>`, un éditeur HTML TipTap ou un éditeur Markdown TipTap selon la prop `type`.

```blade
{{-- Texte brut --}}
<x-lingua::editor
    wire:model="value"
    type="text"
    placeholder="Saisir du texte…"
/>

{{-- HTML --}}
<x-lingua::editor
    wire:model="value"
    type="html"
    label="Contenu du corps"
    :required="true"
/>

{{-- Markdown --}}
<x-lingua::editor
    wire:model="value"
    type="markdown"
    placeholder="Écrire en Markdown…"
/>
```

### Props

| Prop | Type | Par défaut | Description |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'` ou `'markdown'` |
| `label` | string | `''` | Libellé optionnel au-dessus du champ |
| `placeholder` | string | `''` | Texte d'espace réservé |
| `required` | bool | `false` | Affiche un badge obligatoire |
| `wire:model` | — | — | Liaison au modèle Livewire |

---

## `<x-lingua::clipboard>`

Un wrapper qui ajoute un bouton de copie dans le presse-papiers autour de son contenu slot.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

Un clic sur le composant copie `text-to-copy` dans le presse-papiers et affiche brièvement une coche.

### Props

| Prop | Type | Description |
|---|---|---|
| `text-to-copy` | string | Le texte à copier dans le presse-papiers |
| `show-tooltip` | bool | Afficher une infobulle au survol (par défaut : `false`) |

---

## `<x-lingua::language-flag>`

Rend une icône de drapeau et le nom de langue pour une locale donnée.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `name` | string | Nom de langue en anglais |
| `code` | string | Code de locale pour la recherche du drapeau |
| `description` | string | Nom natif de la langue (sous-titre) |

Utilise `outhebox/blade-flags` pour les SVG de drapeaux. Si aucun drapeau n'est disponible pour le code, retombe gracieusement sur l'affichage du texte du code.

---

## `<x-lingua::message>`

Un composant de message transitoire qui s'affiche pendant une courte durée après un événement Livewire.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

### Props

| Prop | Type | Par défaut | Description |
|---|---|---|---|
| `on` | string | — | Nom de l'événement Livewire à écouter |
| `delay` | int | `1500` | Durée en millisecondes avant la disparition |

---

## `<x-lingua::autocomplete>`

Un composant de saisie avec autocomplétion utilisé dans le formulaire de création de traduction.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="ex. marketing"
/>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `wire:model` | — | Liaison au modèle Livewire |
| `suggestions` | array | Tableau de suggestions d'autocomplétion |
| `placeholder` | string | Espace réservé du champ de saisie |

---

## `<x-lingua::menu-group>`

Un composant de groupe de navigation pour les menus de barre latérale.

```blade
<x-lingua::menu-group heading="Languages">
    {{-- slot éléments de menu --}}
</x-lingua::menu-group>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `heading` | string | Texte du titre du groupe |

---

## Personnaliser les composants

Publiez toutes les vues de composants pour les remplacer :

```bash
php artisan vendor:publish --tag="lingua-views"
```

Les vues publiées se trouvent dans `resources/views/vendor/lingua/components/`. Laravel utilise automatiquement votre version publiée.
