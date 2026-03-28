# Publication des assets

Lingua est livré avec plusieurs groupes publiables pour vous permettre de ne remplacer que les parties dont vous avez besoin.

## Tout publier en une fois

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## Tags individuels

### `lingua-config`

Publie le fichier de configuration.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Sortie :** `config/lingua.php`

Utilisez ceci pour personnaliser les routes, le middleware, le mode du sélecteur, la barre d'outils de l'éditeur ou toute autre option.

---

### `lingua-migrations`

Publie les migrations de base de données.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

**Sortie :** `database/migrations/YYYY_MM_DD_HHMMSS_create_lingua_table.php`

Utilisez ceci si vous devez modifier le schéma `languages` ou `language_lines` - par exemple, pour ajouter des index ou changer les types de colonnes. Après la publication, exécutez `php artisan migrate` normalement.

::: warning
L'assistant `lingua:install` publie et exécute les migrations automatiquement. Ne publiez manuellement que si vous devez personnaliser le schéma avant de les exécuter.
:::

---

### `lingua-translations`

Publie les chaînes de traduction de l'interface du package.

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Sortie :** `lang/vendor/lingua/{locale}/lingua.php`

Cela expose chaque libellé, titre, bouton et message utilisé dans l'interface Lingua. Remplacez n'importe quelle chaîne pour :
- Traduire l'interface dans la langue de votre application
- Adapter le vocabulaire au style de votre projet (ex. "Add language" → "Installer une locale")

Les fichiers publiés suivent la structure standard des traductions de packages Laravel :

```
lang/
└── vendor/
    └── lingua/
        ├── en/
        │   └── lingua.php
        ├── fr/
        │   └── lingua.php
        └── it/
            └── lingua.php
```

---

### `lingua-views`

Publie toutes les vues Blade et Livewire.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Sortie :** `resources/views/vendor/lingua/`

Utilisez ceci pour personnaliser les layouts, les modales ou le composant sélecteur de langue. Laravel utilise automatiquement vos vues publiées à la place des valeurs par défaut du package.

```
resources/views/vendor/lingua/
├── components/
│   ├── autocomplete.blade.php
│   ├── clipboard.blade.php
│   ├── editor.blade.php
│   ├── language-flag.blade.php
│   ├── menu-group.blade.php
│   └── message.blade.php
└── livewire/
    ├── languages.blade.php
    ├── language-selector.blade.php
    ├── translations.blade.php
    └── translation/
        ├── create.blade.php
        ├── delete.blade.php
        ├── row.blade.php
        └── update.blade.php
```

::: tip
Ne publiez que les vues que vous avez l'intention de modifier. Les vues non publiées sont servies directement depuis le package et reçoivent automatiquement les mises à jour en amont.
:::

---

### `lingua-assets`

Publie les CSS et JavaScript compilés dans `public/`.

```bash
php artisan vendor:publish --tag="lingua-assets"
```

**Sortie :** `public/vendor/lingua/`

Requis uniquement si vous servez les assets directement depuis `public/` plutôt que via Vite ou un CDN. **Relancez cette commande après chaque mise à jour de Lingua** pour garder les assets synchronisés.

---

## Mise à jour après les mises à niveau

Après avoir mis à jour Lingua via Composer, republiez les assets modifiés :

```bash
# Toujours republier les assets compilés
php artisan vendor:publish --tag="lingua-assets" --force

# Republier les traductions de l'interface si vous ne les avez pas personnalisées
php artisan vendor:publish --tag="lingua-translations" --force
```

L'indicateur `--force` écrase les fichiers existants. Omettez-le pour `lingua-views` et `lingua-config` pour préserver vos personnalisations locales.
