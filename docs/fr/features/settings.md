# Paramètres

La page Paramètres vous permet de configurer le comportement UI de Lingua depuis le navigateur — sans modification de fichiers de configuration ni redéploiement.

Naviguez vers `/lingua/settings` ou faites un lien depuis votre panneau d'administration :

```blade
<a href="{{ route('lingua.settings') }}">Paramètres Lingua</a>
```

<Screenshot src="/screenshots/settings-page.png" alt="Page Paramètres Lingua" caption="La page des paramètres avec les contrôles de mode sélecteur et d'icônes de drapeaux." />

## Comment fonctionnent les paramètres

Les paramètres sont stockés dans la table de base de données `lingua_settings` sous forme de paires clé/valeur typées. À chaque requête, Lingua lit d'abord depuis la base de données, puis se replie sur `config/lingua.php`, puis sur les valeurs par défaut codées en dur.

**Chaîne de priorité :**
1. Table DB `lingua_settings` (priorité maximale — définie via cette UI)
2. `config/lingua.php` (votre config publiée)
3. Valeurs par défaut du package (priorité minimale)

Vous pouvez garder votre `config/lingua.php` comme base et surcharger des paramètres spécifiques par environnement via l'UI sans toucher aux fichiers.

## Mode sélecteur

Contrôle comment le composant `<livewire:lingua::language-selector />` se rend pour vos utilisateurs finaux.

| Mode | Description |
|---|---|
| `sidebar` | S'affiche comme une section de navigation groupée (défaut) |
| `modal` | S'affiche comme un bouton qui ouvre un modal complet de sélection de langue |
| `dropdown` | S'affiche comme un bouton dropdown compact |
| `headless` | Aucun rendu intégré — vous implémentez l'UI vous-même |

::: tip Mode headless
Lorsqu'il est défini sur `headless`, le sélecteur intégré ne rend rien. Utilisez plutôt `<livewire:lingua::headless-language-selector />` pour construire un sélecteur entièrement personnalisé. Voir [Sélecteur Headless](./language-selector#mode-headless) pour la documentation complète.
:::

## Afficher les icônes de drapeaux

Activez ou désactivez l'affichage des icônes de drapeaux nationaux à côté des noms de langues dans le sélecteur. Lorsqu'il est désactivé, seul le nom de la langue est affiché.

Les icônes de drapeaux sont associées au code `regional` de la langue (ex. `en_US` → 🇺🇸). Si aucun code régional n'est défini, le drapeau se replie gracieusement.

## Accès programmatique

Vous pouvez lire et écrire des paramètres en PHP en utilisant le modèle `LinguaSetting` :

```php
use Rivalex\Lingua\Models\LinguaSetting;

// Lecture avec fallback config()
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

$showFlags = LinguaSetting::get(
    LinguaSetting::KEY_SHOW_FLAGS,
    config('lingua.selector.show_flags', true)
);

// Écriture
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'modal');
LinguaSetting::set(LinguaSetting::KEY_SHOW_FLAGS, false);
```

Constantes disponibles :

| Constante | Clé | Type |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |

::: warning Migration requise
La table `lingua_settings` est créée par la migration `create_lingua_settings_table`. Si vous avez mis à niveau depuis la version 1.0.x, exécutez `php artisan migrate` pour la créer.
:::
