# Démarrage rapide

Ce guide vous accompagne d'une installation fraîche de Lingua jusqu'à une application entièrement multilingue en quelques minutes.

## 1. Installer et initialiser

```bash
composer require rivalex/lingua
php artisan lingua:install
```

L'anglais est maintenant votre langue par défaut, et toutes les chaînes de traduction Laravel/packages ont été importées dans la base de données.

## 2. Ajouter votre deuxième langue

```bash
php artisan lingua:add fr
```

Cette commande :
- Télécharge les fichiers de traduction en français via Laravel Lang
- Crée un enregistrement `Language` dans la base de données
- Synchronise toutes les nouvelles chaînes dans `language_lines`

Répétez l'opération pour autant de locales que nécessaire :

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. Ajouter le sélecteur de langue à votre layout

Ouvrez votre layout Blade principal (ex. `resources/views/layouts/app.blade.php`) et :

**a) Définissez `lang` et `dir` sur la balise `<html>` :**

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

**b) Intégrez le sélecteur de langue à l'endroit qui convient à votre design :**

```blade
{{-- En groupe de barre latérale (par défaut) --}}
<livewire:lingua::language-selector />

{{-- En liste déroulante dans une barre de navigation --}}
<livewire:lingua::language-selector mode="dropdown" />
```

## 4. Utiliser les traductions dans votre application

Lingua est transparent - utilisez les helpers standard de Laravel comme vous le faites toujours :

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

Le `LinguaManager` personnalisé fusionne automatiquement les traductions en base de données par-dessus celles basées sur des fichiers. Aucune modification de code n'est nécessaire.

## 5. Traduire via l'interface

Visitez `/lingua/translations` pour voir toutes les chaînes de traduction. Pour chaque langue :

1. Utilisez le sélecteur de locale (en haut à droite) pour sélectionner la langue cible
2. Cliquez sur n'importe quelle ligne pour éditer la valeur en ligne
3. Utilisez **Afficher uniquement les manquants** pour vous concentrer sur les chaînes non traduites
4. Pour les types HTML ou Markdown, l'éditeur de texte enrichi s'active automatiquement

<Screenshot src="/screenshots/translations-page.png" alt="Page de gestion des traductions Lingua" caption="La page des traductions avec le sélecteur de locale, le filtre de groupe et l'éditeur en ligne." />

## 6. Synchroniser vers les fichiers (optionnel)

Si vous avez besoin de fichiers de traduction sur le disque (pour le contrôle de version, CI/CD ou d'autres outils) :

```bash
php artisan lingua:sync-to-local
```

Cette commande exporte chaque traduction de la base de données vers `lang/` dans le bon format PHP/JSON.

---

## Patterns courants

### Traduire une nouvelle clé par programmation

```php
use Rivalex\Lingua\Facades\Lingua;

// Créer la traduction dans la base de données pour la locale par défaut
// (normalement fait via l'interface, mais scriptable aussi)
Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

// Ensuite, ajouter les traductions pour d'autres locales :
Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
Lingua::setTranslation('welcome_subject', 'Benvenuto nella nostra piattaforma!', 'it');
```

### Vérifier la complétude des traductions

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]
```

### Changer de locale par programmation

```php
// Dans un contrôleur, un middleware ou un service
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```

::: tip
Le composant `LanguageSelector` gère automatiquement le changement de locale pour les utilisateurs finaux. L'approche manuelle ci-dessus est utile dans les commandes console ou les jobs.
:::

### Exporter uniquement des groupes spécifiques

Si vous souhaitez exporter uniquement un sous-ensemble de traductions vers des fichiers, synchronisez d'abord vers le stockage local, puis supprimez les groupes dont vous n'avez pas besoin de `lang/` - la base de données est toujours la source de vérité au moment de l'exécution.
