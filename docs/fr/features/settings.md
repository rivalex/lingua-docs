# Paramètres

La page **Paramètres** (`/lingua/settings`) expose les options de configuration de Lingua
via une interface sans déploiement. Les paramètres sont stockés dans la table
`lingua_settings` et ont la priorité sur `config/lingua.php`.

## Chaîne de priorité

```
Base de données (lingua_settings)
    ↓ si absent
config/lingua.php
    ↓ si absent
Valeurs par défaut du package
```

## Paramètres disponibles

### Langue par défaut

Sélectionnez quelle langue installée est la locale de repli. Modifie le drapeau
`is_default` dans la table `languages`.

### Mode du sélecteur

Change l'apparence du sélecteur de langue (`sidebar`, `dropdown`, `modal`, `headless`).
La valeur est persistée en base de données et remplace `selector.mode` dans
`config/lingua.php`.

Voir [Sélecteur de langue](/fr/features/language-selector) pour la description de chaque mode.

### Afficher les drapeaux

Active ou désactive les icônes de drapeaux à côté des noms de langues dans le sélecteur.

### Menu de navigation <Badge type="tip" text="Nouveau dans la 2.0" />

Toggle le menu de navigation partagé `x-lingua::nav` qui apparaît sur toutes les pages
de Lingua. Quand désactivé, les liens de navigation en haut de chaque page sont masqués.

Vous pouvez aussi contrôler ce paramètre via `config/lingua.php` :

```php
'nav' => ['enabled' => true],
```

La valeur en base de données prend la priorité si présente.

### Forcer le mode sombre <Badge type="tip" text="Nouveau dans la 2.0" />

Le CSS propre de Lingua utilise une variante `dark:` basée sur une classe,
il suit donc normalement l'ascendant `<html class="dark">` de
l'application hôte. Si votre application hôte n'a pas de bascule de mode
sombre (ou si son état ne correspond pas à la préférence OS réelle), le
style de Lingua peut s'afficher sans mise en forme.

Toggle l'affichage forcé du thème sombre de Lingua, indépendamment de
l'application hôte ou de la préférence de couleur du système — pratique
pour intégrer Lingua dans un hôte sans bascule de mode sombre, ou pendant
le développement en local sur un système en mode clair.

Vous pouvez aussi contrôler ce paramètre via `config/lingua.php` :

```php
'dark_mode' => ['force' => false],
```

La valeur en base de données prend la priorité si présente.

### Affichage du pilote de stockage <Badge type="tip" text="Nouveau dans la 2.0" />

La page Paramètres affiche le **pilote de stockage actif** (`database` ou `file`) en
lecture seule. Pour changer de pilote, utilisez la commande :

```bash
php artisan lingua:storage {driver}
```

Voir [Pilotes de stockage](/fr/guide/storage).

## Accès programmatique

```php
use Rivalex\Lingua\Models\LinguaSetting;

// Lire avec fallback
$mode = LinguaSetting::get(
    LinguaSetting::KEY_SELECTOR_MODE,
    config('lingua.selector.mode', 'sidebar')
);

// Écrire
LinguaSetting::set(LinguaSetting::KEY_SELECTOR_MODE, 'dropdown');
LinguaSetting::set(LinguaSetting::KEY_NAV_ENABLED, true);
```

Constantes disponibles :

| Constante | Clé | Type |
|---|---|---|
| `LinguaSetting::KEY_SELECTOR_MODE` | `selector.mode` | `string` |
| `LinguaSetting::KEY_SHOW_FLAGS` | `selector.show_flags` | `bool` |
| `LinguaSetting::KEY_NAV_ENABLED` | `nav.enabled` | `bool` |
| `LinguaSetting::KEY_DARK_MODE_FORCE` | `dark_mode.force` | `bool` |
| `LinguaSetting::KEY_DEFAULT_LOCALE` | `default_locale` | `string` |

## Événements

| Événement | Déclenché quand |
|---|---|
| `SettingsSaved` | Un paramètre est mis à jour depuis l'interface |

Voir [Événements](/fr/api/events#settings-events).
