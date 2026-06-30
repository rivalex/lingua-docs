# Composants Blade

Lingua enregistre plusieurs composants Blade anonymes sous le préfixe `lingua::`.
Ils sont utilisés en interne par les vues Livewire et peuvent être réutilisés dans
vos propres templates.

---

## `<x-lingua::nav>` <Badge type="tip" text="Nouveau dans la 2.0" />

La barre de navigation partagée qui apparaît sur les cinq pages de Lingua. Active
l'onglet courant automatiquement.

```blade
<x-lingua::nav :current="'languages'" />
```

Activé/désactivé via `config('lingua.nav.enabled')` ou le toggle dans les Paramètres.

### Props

| Prop | Type | Description |
|---|---|---|
| `current` | string | Identifiant de la page active (`'languages'`, `'translations'`, etc.) |

---

## `<x-lingua::select>` <Badge type="tip" text="Nouveau dans la 2.0" />

Sélecteur de locale en ligne utilisant l'API Popover native (`popover="manual"`).
Évite le piège `transform`+`overflow` des dialogs Flux.

```blade
<x-lingua::select
    :languages="$languages"
    :current="app()->getLocale()"
    wire:model="locale"
/>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `languages` | Collection | Collection de modèles `Language` |
| `current` | string | Code de la locale active |
| `wire:model` | - | Propriété Livewire à lier |

---

## `<x-lingua::stat>` <Badge type="tip" text="Nouveau dans la 2.0" />

Carte de statistique KPI pour la page Statistiques.

```blade
<x-lingua::stat
    label="Traductions"
    :value="$total"
    :secondary="$missing . ' manquantes'"
/>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `label` | string | Libellé de la carte |
| `value` | int\|string | Valeur principale |
| `secondary` | string | Texte secondaire optionnel |

---

## `<x-lingua::card>` <Badge type="tip" text="Nouveau dans la 2.0" />

Conteneur de carte avec titre et slot de contenu.

```blade
<x-lingua::card title="Langues installées">
    {{-- contenu --}}
</x-lingua::card>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `title` | string | Titre de la carte |

---

## `<x-lingua::branding>` <Badge type="tip" text="Nouveau dans la 2.0" />

Logo et branding Lingua pour les pages de gestion.

```blade
<x-lingua::branding />
```

Aucune prop — rendu statique du logo SVG Lingua.

---

## `<x-lingua::validation-errors>` <Badge type="tip" text="Nouveau dans la 2.0" />

Affiche les erreurs de validation Livewire de manière cohérente.

```blade
<x-lingua::validation-errors :errors="$errors" />
```

### Props

| Prop | Type | Description |
|---|---|---|
| `errors` | MessageBag | Sac d'erreurs de validation |

---

## `<x-lingua::editor>`

Éditeur polymorphe — `<textarea>`, TipTap HTML ou TipTap Markdown selon `type`.

```blade
<x-lingua::editor wire:model="value" type="html" label="Contenu" :required="true" />
```

### Props

| Prop | Type | Par défaut | Description |
|---|---|---|---|
| `type` | string | `'text'` | `'text'`, `'html'` ou `'markdown'` |
| `label` | string | `''` | Libellé optionnel |
| `placeholder` | string | `''` | Texte d'espace réservé |
| `required` | bool | `false` | Badge obligatoire |

Voir [Texte riche](/fr/features/rich-text) pour la documentation complète.

---

## `<x-lingua::clipboard>`

Wrapper ajoutant un bouton de copie dans le presse-papiers.

```blade
<x-lingua::clipboard text-to-copy="auth.failed">
    <span>auth.failed</span>
</x-lingua::clipboard>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `text-to-copy` | string | Texte à copier |
| `show-tooltip` | bool | Afficher une infobulle (par défaut : `false`) |

---

## `<x-lingua::language-flag>`

Drapeau et nom de langue pour une locale donnée.

```blade
<x-lingua::language-flag
    :name="$language->name"
    :code="$language->code"
    :description="$language->native"
/>
```

---

## `<x-lingua::message>`

Message transitoire qui s'affiche après un événement Livewire.

```blade
<x-lingua::message on="translation_saved" :delay="2000">
    <flux:icon icon="check-circle" class="text-green-500"/>
</x-lingua::message>
```

### Props

| Prop | Type | Par défaut | Description |
|---|---|---|---|
| `on` | string | - | Nom de l'événement Livewire |
| `delay` | int | `1500` | Durée en ms avant disparition |

---

## `<x-lingua::autocomplete>`

Saisie avec autocomplétion pour le formulaire de création de traduction.

```blade
<x-lingua::autocomplete
    wire:model="group"
    :suggestions="$availableGroups"
    placeholder="ex. marketing"
/>
```

---

## Personnaliser les composants

```bash
php artisan vendor:publish --tag="lingua-views"
```

Vues publiées dans `resources/views/vendor/lingua/components/`.
