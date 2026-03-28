# Sélecteur de langue

Le composant `<livewire:lingua::language-selector>` est un sélecteur de locale intégrable pour vos utilisateurs finaux — entièrement séparé de l'interface d'administration.

## Utilisation de base

```blade
<livewire:lingua::language-selector />
```

Ajoutez-le n'importe où dans vos layouts Blade. Il se rend en utilisant le mode configuré dans `config/lingua.php` (`sidebar` par défaut).

## Modes d'affichage

### Mode barre latérale (par défaut)

Se rend comme une section de navigation groupée — idéal pour les barres latérales d'application construites avec Flux.

```blade
<livewire:lingua::language-selector mode="sidebar" />
```

<Screenshot src="/screenshots/selector-sidebar.png" alt="Sélecteur de langue en mode barre latérale" caption="Mode barre latérale — affiche toutes les langues installées comme éléments de navigation." width="320px" :center="true"/>

### Mode liste déroulante

Se rend comme un bouton de liste déroulante compact — idéal pour les en-têtes et barres de navigation.

```blade
<livewire:lingua::language-selector mode="dropdown" />
```

<Screenshot src="/screenshots/selector-dropdown.png" alt="Sélecteur de langue en mode liste déroulante" caption="Mode liste déroulante — affiche la langue courante avec une icône de drapeau." width="320px" :center="true"/>

### Mode modale

Se rend comme un bouton qui ouvre une modale complète de sélection de langue — idéal pour la sélection de locale mise en avant dans les pages d'accueil ou les flux d'intégration.

```blade
<livewire:lingua::language-selector mode="modal" />
```

<Screenshot src="/screenshots/selector-modal.png" alt="Sélecteur de langue en mode modale" caption="Mode modale — superposition plein écran pour le choix de la langue."/>

## Référence des props

| Prop | Type | Par défaut | Description |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'` ou `'modal'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | Afficher les icônes de drapeaux de pays |

```blade
{{-- Remplacer le mode pour une instance --}}
<livewire:lingua::language-selector mode="dropdown" :show-flags="false" />
```

## Fonctionnement du changement de locale

Lorsqu'un utilisateur clique sur une langue, le composant appelle `changeLocale($locale)` :

1. Valide que la locale existe dans la table `languages` (ignore silencieusement les locales inconnues)
2. Stocke le code de locale en session sous `config('lingua.session_variable')`
3. Appelle `app()->setLocale($locale)` pour la requête courante
4. Redirige vers l'URL courante (déclenche un rechargement complet de la page pour que la nouvelle locale prenne effet partout)

À la requête suivante, `LinguaMiddleware` lit la session et applique la locale avant l'exécution de vos contrôleurs.

## Icônes de drapeaux

Les icônes de drapeaux sont fournies par le package [`outhebox/blade-flags`](https://github.com/MohmmedAshraf/blade-flags), installé automatiquement comme dépendance de Lingua.

Les drapeaux sont associés par le code `regional` de la langue (ex. `en_US` → 🇺🇸, `fr_FR` → 🇫🇷). Si aucun code régional n'est défini, le composant de drapeau retombe gracieusement sur l'affichage du code à deux lettres.

Désactiver les drapeaux globalement :

```php
// config/lingua.php
'selector' => ['show_flags' => false],
```

Ou par instance :

```blade
<livewire:lingua::language-selector :show-flags="false" />
```

## Personnaliser les vues du sélecteur

Publiez les vues pour remplacer le balisage :

```bash
php artisan vendor:publish --tag="lingua-views"
```

Les modèles du sélecteur se trouvent dans :

```
resources/views/vendor/lingua/livewire/
├── language-selector.blade.php
└── selector/
    ├── sidebar.blade.php
    ├── dropdown.blade.php
    └── modal.blade.php
```

::: tip Intégration avec votre propre navigation
Si vous utilisez les composants de barre latérale ou de barre de navigation de Flux, le mode `sidebar` s'intègre naturellement dans `<flux:navlist>` ou `<flux:sidebar>` de Flux. Publiez la vue et adaptez le balisage pour correspondre à votre structure de navigation.
:::

## Actualiser le sélecteur après des modifications

Le sélecteur écoute l'événement Livewire `refreshLanguages`. Si vous ajoutez ou supprimez une langue depuis l'interface de gestion (ou par programmation), le sélecteur se re-rend automatiquement sans rechargement de page.

```js
// Déclencher depuis n'importe quel composant Livewire ou code Alpine.js :
this.$dispatch('refreshLanguages')
```
