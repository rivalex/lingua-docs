# Sélecteur de langue

Le **sélecteur de langue** est un composant Livewire qui permet aux utilisateurs de
changer la locale active. Il s'intègre dans votre layout Blade et déclenche le rechargement
de la page actuelle dans la nouvelle langue.

## Modes d'affichage

Le composant supporte quatre modes configurables dans `config/lingua.php` ou via la prop `mode` :

```blade
{{-- Mode par défaut depuis la configuration --}}
<livewire:lingua::language-selector />

{{-- Mode explicite --}}
<livewire:lingua::language-selector mode="sidebar" />
<livewire:lingua::language-selector mode="dropdown" />
<livewire:lingua::language-selector mode="modal" />
<livewire:lingua::language-selector mode="headless" />
```

### Sidebar

Affiche les langues sous forme de groupe de barre de navigation avec drapeaux et noms
natifs. Idéal pour les sidebars d'administration.

### Dropdown

Un bouton compact qui affiche un menu déroulant. Adapté aux barres de navigation horizontales.

### Modal

Un bouton qui ouvre une modal avec la grille des locales disponibles. Recommandé pour un
grand nombre de langues.

### Headless <Badge type="tip" text="Nouveau dans la 2.0" />

Aucun markup intégré. Contrôlez entièrement le rendu via le slot. Utilisez
`<livewire:lingua::headless-language-selector />` pour le support complet des slots :

```blade
<livewire:lingua::headless-language-selector>
    <x-slot:item="language">
        <span class="px-3 py-1 rounded-full text-sm hover:bg-gray-100">
            {{ $language->native }}
        </span>
    </x-slot>
    <x-slot:current="language">
        <span class="px-3 py-1 rounded-full text-sm bg-blue-100 font-semibold">
            {{ $language->native }}
        </span>
    </x-slot>
</livewire:lingua::headless-language-selector>
```

## Composant Blade `x-lingua::select` <Badge type="tip" text="Nouveau dans la 2.0" />

Un composant Blade discret pour les sélections en ligne utilisant l'API Popover native.

```blade
<x-lingua::select
    :languages="$languages"
    :current="app()->getLocale()"
    wire:model="locale"
/>
```

### API Popover native

Le `x-lingua::select` utilise l'attribut HTML `popover="manual"` avec
`showPopover()` / `hidePopover()` pour afficher la liste déroulante. Cela évite le
piège `transform`+`overflow` des dialogs Flux et fonctionne dans tous les contextes
d'empilement CSS.

## Protection contre les redirections ouvertes

Quand un utilisateur change de locale, Lingua recharge la **page sur laquelle il se trouve**
(pas la page d'accueil). L'URI de la requête est lu côté serveur via `getRequestUri()` et
validé — seuls les chemins locaux (commençant par `/`) sont acceptés. Les URLs absolues
et les schémas externes sont rejetés.

Voir [Sécurité](/fr/guide/security#open-redirect-protection).

## Référence des props

| Prop | Type | Par défaut | Description |
|---|---|---|---|
| `mode` | `string` | `config('lingua.selector.mode')` | `'sidebar'`, `'dropdown'`, `'modal'` ou `'headless'` |
| `show-flags` | `bool` | `config('lingua.selector.show_flags')` | Afficher les icônes de drapeaux |

## Affichage des drapeaux

Activez/désactivez les drapeaux avec `show_flags` dans la config :

```php
// config/lingua.php
'selector' => [
    'show_flags' => true,  // par défaut
],
```

Ou via une prop Blade :

```blade
<livewire:lingua::language-selector :show-flags="false" />
```

## Fonctionnement du changement de locale

1. Valide que la locale existe dans la table `languages`
2. Stocke le code de locale en session sous `config('lingua.session_variable')`
3. Appelle `app()->setLocale($locale)` pour la requête courante
4. Redirige vers l'URL courante (rechargement complet de page, chemin local validé)

À la requête suivante, `LinguaMiddleware` lit la session et applique la locale.

## Configuration

```php
// config/lingua.php
'selector' => [
    'mode'       => 'sidebar',
    'show_flags' => true,
],
```

Voir [Configuration](/fr/guide/configuration#interface) pour la référence complète.
