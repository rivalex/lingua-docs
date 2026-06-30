# Publier les ressources

Lingua est livré avec plusieurs groupes publiables pour vous permettre de ne
remplacer que les parties dont vous avez besoin.

## Tout publier en une fois

```bash
php artisan vendor:publish --provider="Rivalex\Lingua\LinguaServiceProvider"
```

## Tags disponibles

### `lingua-config`

Publie le fichier de configuration.

```bash
php artisan vendor:publish --tag="lingua-config"
```

**Sortie :** `config/lingua.php`

Utilisez ceci pour personnaliser les routes, le middleware, le pilote de stockage, le mode
du sélecteur, la barre d'outils de l'éditeur, le cache ou toute autre option. Voir
[Configuration](/fr/guide/configuration).

---

### `lingua-migrations`

Publie les migrations de base de données.

```bash
php artisan vendor:publish --tag="lingua-migrations"
```

<Badge type="tip" text="Nouveau dans la 2.0" /> Les migrations sont maintenant **adaptées au pilote**
et divisées en trois fichiers séparés :

| Migration | Publiée pour |
|---|---|
| `create_language_lines_table` | pilote database uniquement |
| `create_languages_table` | les deux pilotes |
| `create_lingua_settings_table` | les deux pilotes |

Le pilote `file` ignore `create_language_lines_table`. L'assistant `lingua:install`
publie le bon ensemble pour le pilote que vous choisissez, vous n'avez donc besoin de
ce tag que si vous souhaitez personnaliser le schéma avant d'exécuter les migrations.

::: warning
L'assistant `lingua:install` publie et exécute les migrations automatiquement.
Ne publiez manuellement que si vous devez personnaliser le schéma en premier.
:::

---

### `lingua-translations`

Publie les chaînes de traduction de l'interface du package (9 locales d'interface).

```bash
php artisan vendor:publish --tag="lingua-translations"
```

**Sortie :** `lang/vendor/lingua/{locale}/lingua.php`

Remplacez n'importe quel libellé, titre, bouton ou message utilisé dans l'interface Lingua
pour traduire l'interface ou adapter le vocabulaire au style de votre projet.

```
lang/
└── vendor/
    └── lingua/
        ├── en/lingua.php
        ├── fr/lingua.php
        └── it/lingua.php
```

---

### `lingua-views`

Publie toutes les vues Blade et Livewire.

```bash
php artisan vendor:publish --tag="lingua-views"
```

**Sortie :** `resources/views/vendor/lingua/`

Utilisez ceci pour personnaliser les layouts, les modales ou le sélecteur de langue. Laravel
utilise automatiquement vos vues publiées à la place des valeurs par défaut du package.

::: tip
Ne publiez que les vues que vous avez l'intention de modifier. Les vues non publiées sont
servies depuis le package et reçoivent automatiquement les mises à jour en amont.
:::

---

### `lingua-assets` (supprimé) <Badge type="warning" text="Supprimé dans la 2.0" />

Le tag de publication `lingua-assets` **n'existe plus**. Dans la 2.0, les CSS/JS compilés
de Lingua sont servis en interne via la route `lingua.assets`
(derrière un espace confiné realpath — voir
[Sécurité](/fr/guide/security#asset-security)). Il n'y a rien à publier ni à copier
dans `public/`, et rien à re-publier après une mise à niveau.

---

## Mise à jour après les mises à niveau

Après avoir mis à jour Lingua via Composer, re-publiez les traductions de l'interface si
vous ne les avez pas personnalisées, et fusionnez les nouvelles clés de configuration :

```bash
# Re-publier les traductions de l'interface (écrase)
php artisan vendor:publish --tag="lingua-translations" --force

# Re-publier la configuration pour récupérer les nouvelles clés, puis fusionner manuellement
php artisan vendor:publish --tag="lingua-config" --force
```

L'option `--force` écrase les fichiers existants. Omettez-la pour `lingua-views`
et `lingua-config` pour préserver vos personnalisations locales, et fusionnez les nouvelles
clés manuellement. Voir le [guide de mise à niveau](/fr/guide/upgrade) pour la liste
complète 1.x → 2.0.
