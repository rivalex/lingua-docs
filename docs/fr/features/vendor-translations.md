# Traductions vendor

Les traductions vendor sont des chaînes appartenant à des **packages tiers** importées
dans la base de données de Lingua. Elles sont protégées contre la suppression accidentelle
pour éviter de casser les packages qui en dépendent.

## Identification

Une traduction est marquée comme vendor quand :

- Elle provient du répertoire `lang/vendor/` lors d'une synchronisation
- Son groupe est un espace de noms de package (p. ex. `nova`, `jetstream`)
- Elle est créée avec `is_vendor = true` explicitement

Dans la table `language_lines` :

```
group      | key      | is_vendor | vendor   | text
-----------|----------|-----------|----------|-------------------
validation | required | false     | null     | {"en":"The :attr…"}
auth       | failed   | true      | laravel  | {"en":"These cred…"}
```

::: tip
Les propres fichiers Laravel (`auth`, `validation`, `pagination`, `passwords`) sont traités
comme des traductions vendor car ils appartiennent au framework, pas à votre code applicatif.
:::

## Mécanisme de protection

Tenter de supprimer une traduction vendor déclenche une exception :

```php
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

// Dans Translation::forgetTranslation()
if ($this->is_vendor) {
    throw new VendorTranslationProtectedException($this);
}
```

Cette protection s'applique dans tous les chemins :

- **Suppression depuis l'UI** — le bouton corbeille est masqué pour les lignes vendor
- **Import via Transfert** — les lignes vendor sont ignorées avec statut `ignored`
- **`lingua:sync-to-database`** — les valeurs vendor existantes ne sont jamais écrasées
- **Appels façade** — `Lingua::forgetTranslation()` lève l'exception

## Ce que vous pouvez faire avec les traductions vendor

| Action | Autorisée ? | Notes |
|---|---|---|
| **Modifier la valeur** | ✅ Oui | Remplacer n'importe quelle chaîne vendor par votre propre formulation |
| **Changer le type** | ✅ Oui | Basculer entre `text` / `html` / `markdown` |
| **Supprimer** | ❌ Non | Protégé par `VendorTranslationProtectedException` |

## Remplacer une chaîne vendor

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Veuillez renseigner le champ :attribute.',
    locale: 'fr'
);
```

## Accès programmatique

```php
use Rivalex\Lingua\Models\Translation;

// Toutes les traductions vendor
Translation::where('is_vendor', true)->get();

// Vendor spécifique
Translation::where('vendor', 'laravel')->get();

// Vendor d'un groupe précis
$all = Lingua::getVendorTranslations('laravel');
$fr  = Lingua::getVendorTranslations('laravel', 'fr');
```

## Import et protection vendor

Lors d'un import via la page Transfert, les lignes correspondant à des traductions vendor
sont listées dans la section **Ignorées** du diff et ne sont jamais écrites.

Voir [Transfert](/fr/features/transfer).
