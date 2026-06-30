# Démarrage rapide

Ce guide vous emmène d'une installation fraîche de Lingua à une application
entièrement multilingue en quelques minutes.

## 1. Installer et initialiser

```bash
composer require rivalex/lingua
php artisan lingua:install
```

Choisissez le pilote **database** lorsque demandé (recommandé). L'anglais devient
votre langue par défaut, et les chaînes de traduction groupées sont importées
dans la base de données — sans téléchargement GitHub.

::: tip Sécurisé par défaut
Les routes de gestion sont protégées par `['web', 'auth']` automatiquement.
Définissez `LINGUA_GATE` pour un accès basé sur les rôles — voir
[Installation](/fr/guide/installation#proteger-l-interface-de-gestion).
:::

## 2. Ajouter votre deuxième langue

```bash
php artisan lingua:add fr
```

Cette commande est **native à la DB** : elle initialise les chaînes françaises depuis le
jeu de données groupé et crée un enregistrement `Language`. Elle **ne télécharge pas** de
fichiers et n'écrit pas dans `lang/`.

Répétez pour autant de locales que vous en avez besoin :

```bash
php artisan lingua:add it es de pt_BR ar
```

## 3. Ajouter le sélecteur de langue à votre layout

Ouvrez votre layout Blade principal (p. ex.
`resources/views/layouts/app.blade.php`) :

**a) Définissez `lang` et `dir` sur la balise `<html>` :**

```blade
<html lang="{{ app()->getLocale() }}" dir="{{ Lingua::getDirection() }}">
```

**b) Intégrez le sélecteur de langue où cela correspond à votre design :**

```blade
{{-- En tant que groupe de barre latérale (par défaut) --}}
<livewire:lingua::language-selector />

{{-- En tant que dropdown dans une barre de navigation --}}
<livewire:lingua::language-selector mode="dropdown" />
```

::: tip Le changement de locale recharge la page actuelle
Quand un utilisateur change de locale, Lingua recharge la **page sur laquelle il se trouve**
(pas la page d'accueil), protégé contre les redirections ouvertes. Voir
[Sécurité](/fr/guide/security#open-redirect-protection).
:::

## 4. Utiliser les traductions dans votre application

Lingua est transparent — utilisez les helpers Laravel standard comme vous le faites toujours :

```blade
{{ __('messages.welcome') }}
@lang('auth.failed')
```

```php
trans('validation.required')
__('pagination.next')
```

En mode base de données, `LinguaManager` fusionne automatiquement les traductions de la base de
données par-dessus celles basées sur les fichiers. Aucun changement de code n'est nécessaire.

## 5. Traduire via l'interface

Visitez `/lingua/translations` pour voir toutes les chaînes de traduction. Pour chaque langue :

1. Utilisez le sélecteur de locale (en haut à droite) pour sélectionner la langue cible
2. Cliquez sur n'importe quelle ligne pour modifier la valeur en ligne
3. Utilisez **Afficher seulement les manquantes** pour vous concentrer sur les chaînes non traduites
4. Pour les types HTML ou Markdown, l'éditeur de texte riche s'active automatiquement

<Screenshot src="/screenshots/translations-page.png" alt="Page de gestion des traductions Lingua" caption="La page des traductions avec le sélecteur de locale, le filtre de groupe et l'éditeur en ligne." />

## 6. Import / export avec la page Transfert

Besoin de modifier des traductions en masse dans un tableur, ou de transmettre un fichier à
une agence de traduction ? Visitez `/lingua/transfer` :

- **Exportez** en CSV, JSON, XLSX ou ODS — bilingue, multi-locale ou
  disposition JSON-native
- **Importez** avec une **prévisualisation diff** en mode dry-run avant toute écriture

XLSX/ODS requièrent le package optionnel `openspout/openspout` ; CSV et JSON
fonctionnent immédiatement.

## 7. Synchroniser vers les fichiers (optionnel)

Si vous avez besoin de fichiers de traduction sur disque (pour le contrôle de version ou CI/CD) :

```bash
php artisan lingua:sync-to-local
```

Cela exporte chaque traduction DB vers `lang/` dans le format PHP/JSON correct.

---

## Patterns courants

### Traduire une nouvelle clé par programmation

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

Translation::create([
    'group' => 'emails',
    'key'   => 'welcome_subject',
    'type'  => 'text',
    'text'  => ['en' => 'Welcome to our platform!'],
]);

Lingua::setTranslation('welcome_subject', 'Bienvenue sur notre plateforme !', 'fr');
```

### Inspecter une locale

```php
use Rivalex\Lingua\Facades\Lingua;

$info = Lingua::info('fr');

if ($info !== null) {
    $info->name;      // "French"
    $info->native;    // "Français"
    $info->direction; // "ltr"
}
```

::: warning Modifié dans la 2.0
`Lingua::info()` retourne maintenant `?LocaleInfo` et donne `null` pour les locales
inconnues au lieu de lever une exception. Vérifiez toujours avec `if ($info !== null)`.
:::

### Changer de locale par programmation

```php
app()->setLocale('fr');
session()->put(config('lingua.session_variable'), 'fr');
```
