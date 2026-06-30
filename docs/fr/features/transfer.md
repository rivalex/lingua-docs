# Transfert (Import / Export)

<Badge type="tip" text="Nouveau dans la 2.0" /> La page **Transfert**
(`/lingua/transfer`) permet d'importer et d'exporter des traductions dans plusieurs
formats. C'est le moyen le plus rapide de déplacer des traductions vers une agence
de traduction, un tableur ou un autre projet.

## Formats pris en charge

| Format | Export | Import | Requis |
|---|:---:|:---:|---|
| CSV | ✅ | ✅ | Rien |
| JSON | ✅ | ✅ | Rien |
| XLSX | ✅ | ✅ | `openspout/openspout` |
| ODS | ✅ | ✅ | `openspout/openspout` |

CSV et JSON fonctionnent immédiatement. Pour XLSX et ODS, installez le package optionnel :

```bash
composer require openspout/openspout
```

## Dispositions d'export

Trois dispositions sont disponibles selon les besoins du destinataire :

### Bilingue

Une colonne source (locale par défaut) et une colonne cible (locale choisie). Idéal
pour envoyer à un traducteur — il voit l'original et remplit la colonne cible.

```
group    | key        | en              | fr
---------|------------|-----------------|-------------------
auth     | failed     | These creds...  | Ces identifiants...
```

### Multi-locale

Toutes les locales installées dans des colonnes séparées. Utile pour une vue d'ensemble
ou la gestion en interne.

```
group    | key     | en    | fr       | it      | es
---------|---------|-------|----------|---------|------
messages | hello   | Hello | Bonjour  | Ciao    | Hola
```

### JSON natif

La structure JSON brute de Laravel. Compatible avec les outils qui lisent directement
les fichiers `lang/*.json`.

```json
{
  "Hello": "Bonjour",
  "Welcome": "Bienvenue"
}
```

## Étendues d'export

Choisissez ce qui est exporté :

| Étendue | Description |
|---|---|
| Toutes les locales | Toutes les langues installées |
| Locale spécifique | Une seule langue cible |
| Groupe spécifique | Un seul groupe (p. ex. `validation`) |
| Clés manquantes | Seulement les chaînes sans traduction dans la cible |

## Processus d'import en deux étapes

L'import utilise un workflow en deux étapes pour éviter les écrasements accidentels :

### Étape 1 — Dry-run (aperçu)

Importez un fichier pour voir la différence avant toute modification. Le diff affiché
montre :

- **Nouvelles clés** — n'existent pas encore en DB
- **Mises à jour** — valeur existante → nouvelle valeur
- **Ignorées** — clés vendor protégées ou sans changement
- **Erreurs** — lignes malformées

```
✓ 23 mises à jour
+ 5  nouvelles clés
○ 2  ignorées (vendor)
✗ 1  erreur (ligne 47 : colonne manquante)
```

### Étape 2 — Valider

Après révision du diff, cliquez sur **Appliquer l'import** pour écrire les changements.
L'opération est transactionnelle — si une erreur se produit, tout est annulé.

::: tip Priorité de type
Lors de l'import, le type existant d'une traduction est préservé. Si la clé est nouvelle,
elle est créée avec le type `text` par défaut.
:::

::: warning Protection vendor
Les traductions vendor (`is_vendor = true`) sont **ignorées** lors de l'import. Elles
ne peuvent pas être écrasées via le Transfert — c'est une protection intentionnelle.
Voir [Traductions vendor](/fr/features/vendor-translations).
:::

## Commande de téléchargement

L'export déclenche un téléchargement direct dans le navigateur. Le nom du fichier
suit la convention :

```
lingua-export-{locale}-{timestamp}.{extension}
```

Exemple : `lingua-export-fr-2026-06-30.csv`

## Via la façade

L'export et l'import peuvent aussi être déclenchés par programmation :

```php
use Rivalex\Lingua\Services\ExportService;
use Rivalex\Lingua\Services\ImportDiffService;
use Rivalex\Lingua\Services\ImportCommitService;

// Export
$service = app(ExportService::class);
$file = $service->export(locale: 'fr', format: 'csv', layout: 'bilingual');

// Import (dry-run)
$diff = app(ImportDiffService::class)->diff($uploadedFile, 'fr');

// Import (commit)
app(ImportCommitService::class)->commit($diff);
```
