# Installation

Lingua est livré avec un assistant d'installation interactif qui gère tout
pour vous en une seule commande. Les étapes manuelles sont également documentées
ci-dessous si vous préférez plus de contrôle.

## Étape 1 — Installer via Composer

```bash
composer require rivalex/lingua
```

C'est le seul package dont vous avez besoin. Lingua 2.0 embarque ses propres données
de locale et son jeu de données de traductions, il n'y a donc rien d'autre à installer.

::: tip Mise à niveau depuis la 1.x ?
Composer supprime automatiquement l'ancienne dépendance `spatie/laravel-translation-loader`.
Si votre propre `composer.json` liste encore
`laravel-lang/common`, supprimez-la : `composer remove laravel-lang/common`.
Consultez le [guide de mise à niveau](/fr/guide/upgrade) complet.
:::

## Étape 2 — Lancer l'installateur

```bash
php artisan lingua:install
```

L'assistant est interactif. Utilisant
[Laravel Prompts](https://laravel.com/docs/prompts), il vous demande de choisir
un **pilote de stockage** avec un sélecteur à touches directionnelles :

| Pilote | Choisissez-le quand… |
|---|---|
| **`database`** *(recommandé)* | Vous voulez l'ensemble complet des fonctionnalités : types HTML/Markdown, statistiques, import/export, protection vendor et cache chirurgical. |
| **`file`** | Vous gardez les traductions sous contrôle de version ou utilisez un environnement en lecture seule/CI et préférez les fichiers `lang/` classiques. |

L'assistant effectue ensuite :

1. Publie le fichier de configuration dans `config/lingua.php`
2. Publie les migrations **adaptées au pilote** (le pilote `file` ignore la
   migration `language_lines`)
3. Demande s'il faut exécuter les migrations automatiquement
4. Initialise la base de données avec votre langue par défaut et ses traductions depuis
   le jeu de données groupé — **pas de téléchargement GitHub**
5. Optionnellement met une étoile au dépôt sur GitHub ⭐

Lorsqu'il se termine, vous verrez :

```
✓ Driver selected          →  database
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua installed successfully!
```

## Étape 3 — Accéder à l'interface

Ouvrez votre application et visitez :

| Page | URL | Nom de route |
|---|---|---|
| Langues | `your-app.test/lingua/languages` | `lingua.languages` |
| Traductions | `your-app.test/lingua/translations` | `lingua.translations` |
| Statistiques | `your-app.test/lingua/statistics` | `lingua.statistics` |
| Transfert | `your-app.test/lingua/transfer` | `lingua.transfer` |
| Paramètres | `your-app.test/lingua/settings` | `lingua.settings` |

C'est tout. Lingua est opérationnel.

---

## Installation manuelle

Si vous préférez publier et exécuter chaque étape individuellement :

```bash
# 1. Publier la configuration
php artisan vendor:publish --tag="lingua-config"

# 2. Publier les migrations (adaptées au pilote)
php artisan vendor:publish --tag="lingua-migrations"

# 3. Exécuter les migrations
php artisan migrate

# 4. Ajouter votre langue par défaut et initialiser ses traductions
php artisan lingua:add en
```

Consultez [Publier les ressources](/fr/guide/publishing) pour la liste complète des tags.

---

## Protéger l'interface de gestion

<Badge type="tip" text="Nouveau dans la 2.0" /> Lingua 2.0 est **sécurisé par
défaut**. Les routes de gestion sont livrées avec le middleware `['web', 'auth']`
appliqué automatiquement — les visiteurs anonymes ne peuvent pas accéder à l'interface.

### Restreindre l'accès avec un portail

Pour un accès basé sur les rôles, définissez un portail d'autorisation et indiquez-le à
Lingua avec la variable d'environnement `LINGUA_GATE`. Lingua ajoute `can:{gate}`
à ses routes d'administration :

```env
LINGUA_GATE=manage-translations
```

```php
// app/Providers/AppServiceProvider.php — boot()
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $user) => $user->hasRole('admin'));
```

Vous pouvez également modifier le tableau de middleware directement :

```php
// config/lingua.php
'middleware' => ['web', 'auth', 'role:admin'],
```

::: tip
Tout middleware accepté par le routeur de Laravel peut être ajouté au tableau.
Les modifications prennent effet immédiatement — aucun vidage de cache n'est nécessaire.
:::

Consultez la [référence de sécurité](/fr/guide/security) pour l'aperçu complet du renforcement.

---

## Liste de contrôle post-installation

- [ ] Confirmez que le pilote de stockage dans `config/lingua.php` correspond à votre
      déploiement (`database` ou `file`)
- [ ] Définissez optionnellement `LINGUA_GATE` pour un accès basé sur les rôles
- [ ] Ajoutez le composant sélecteur de langue à votre layout (voir
      [Sélecteur de langue](/fr/features/language-selector))
- [ ] Définissez `dir` et `lang` sur votre balise `<html>` (voir
      [Support RTL/LTR](/fr/features/rtl-support))
- [ ] Ajoutez des langues supplémentaires via `php artisan lingua:add {locale}`
- [ ] Configurez la barre d'outils de l'éditeur dans `config/lingua.php` si vous utilisez
      des traductions HTML/Markdown (pilote base de données)
