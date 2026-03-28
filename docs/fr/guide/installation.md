# Installation

Lingua est livré avec un assistant d'installation interactif qui gère tout en une seule commande. Les étapes manuelles sont également documentées ci-dessous si vous préférez plus de contrôle.

## Étape 1 - Installation via Composer

```bash
composer require rivalex/lingua
```

## Étape 2 - Lancer l'assistant

```bash
php artisan lingua:install
```

L'assistant va :

1. Publier le fichier de configuration vers `config/lingua.php`
2. Publier les migrations de base de données
3. Demander s'il faut exécuter les migrations automatiquement
4. Alimenter la base de données avec votre langue par défaut (anglais par défaut) et toutes ses traductions depuis Laravel Lang
5. Optionnellement mettre une étoile au dépôt sur GitHub ⭐

Une fois terminé, vous verrez :

```
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua package installed successfully!
```

## Étape 3 - Accéder à l'interface

Ouvrez votre application et visitez :

| Page | URL | Nom de route |
|---|---|---|
| Langues | `votre-app.test/lingua/languages` | `lingua.languages` |
| Traductions | `votre-app.test/lingua/translations` | `lingua.translations` |

C'est tout. Lingua est opérationnel.

---

## Installation manuelle

Si vous préférez publier et exécuter chaque étape individuellement :

```bash
# 1. Publier la configuration
php artisan vendor:publish --tag="lingua-config"

# 2. Publier les migrations
php artisan vendor:publish --tag="lingua-migrations"

# 3. Exécuter les migrations
php artisan migrate

# 4. Seeder la langue par défaut + traductions
php artisan db:seed --class="Rivalex\Lingua\Database\Seeders\LinguaSeeder"
```

---

## Protéger l'interface de gestion

Par défaut, les routes Lingua utilisent uniquement le middleware `web` - aucune protection d'authentification n'est appliquée automatiquement. **Vous devez ajouter votre propre middleware** avant la mise en production.

### Via la configuration

```php
// config/lingua.php
'middleware' => ['web', 'auth'],
```

### Avec des guards de rôle/permission (ex. Spatie Permission)

```php
'middleware' => ['web', 'auth', 'role:admin'],
// ou
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

::: tip
Tout middleware accepté par le routeur Laravel peut être ajouté au tableau. Les modifications prennent effet immédiatement - aucun vidage de cache n'est nécessaire.
:::

---

## Liste de vérification post-installation

- [ ] Ajouter un middleware d'authentification dans `config/lingua.php`
- [ ] Ajouter le composant sélecteur de langue à votre layout (voir [Sélecteur de langue](/fr/features/language-selector))
- [ ] Définir `dir` et `lang` sur votre balise `<html>` (voir [Support RTL/LTR](/fr/features/rtl-support))
- [ ] Ajouter des langues supplémentaires via `php artisan lingua:add {locale}`
- [ ] Configurer la barre d'outils de l'éditeur dans `config/lingua.php` si vous utilisez des traductions HTML/Markdown
