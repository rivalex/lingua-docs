# Sécurité

Lingua 2.0 a subi un passage de renforcement complet et est **sécurisé par défaut**.
Cette page documente les protections en place et les actions que vous devez prendre
pour garder votre déploiement sûr.

::: tip Sécurisé par défaut
L'interface de gestion est livrée derrière le middleware `['web', 'auth']`, les ressources
sont servies depuis un espace confiné realpath, et les saisies de traduction sont
assainies. Vous optez *pour* un accès plus large, pas *en dehors* de la protection.
:::

## Passage de renforcement v2.0 (F1–F9)

| ID | Nom | Ce contre quoi ça protège | Comment | Fichier |
|---|---|---|---|---|
| F1 | Garde anti-DoS de cache | Croissance de cache illimitée due à des chaînes de locale arbitraires | Validation regex de locale avant `rememberForever` | `src/Database/DatabaseRepository.php` |
| F2 | Interdiction d'injection SQL | Injection via des fonctions SQL JSON | Fonctions SQL JSON supprimées ; toute l'agrégation effectuée en PHP | `src/Database/DatabaseRepository.php` |
| F3 | Traversée de chemin | Sortie du répertoire de traductions | `PathGuard::assertSafeSegment()` | `src/Support/PathGuard.php`, `src/Locales/BundledTranslationSource.php` |
| F4 | Pollution de locale / injection de nom de fichier | Écriture vers des locales non installées ; noms de fichiers de téléchargement malveillants | Abandon 422 sur une locale cible non installée ; `Content-Disposition` assaini | `src/Livewire/Import.php`, `src/Http/Controllers/TransferExportController.php` |
| F5 | Protection vendor | Suppression de chaînes vendor protégées | `VendorTranslationProtectedException` levée sur `forgetTranslation()` pour les lignes vendor | `src/Exceptions/VendorTranslationProtectedException.php`, les deux dépôts |
| F6 | Rejet de clé wildcard | Assignation de masse via des clés wildcard | Rejette `*` / `\0` dans l'identité d'import | `src/Transfer/RowMapper.php` |
| F7 | Limite ReDoS | Retour arrière catastrophique sur la détection de type | Regex de type plus stricte (`\[[^\]]+\]`) ; ignore la regex pour les chaînes > 10000 caractères | `src/Livewire/Translation/Row.php` |
| F8 | Non-divulgation des exceptions | Fuite d'informations internes vers l'UI | Erreur localisée générique vers l'UI ; détail vers `Log::error` | `src/Livewire/Import.php` |
| F9 | Portail d'authentification | Accès non autorisé aux routes d'administration | Middleware `can:{gate}` ajouté quand `LINGUA_GATE` est défini | `routes/web.php`, `config/lingua.php` |

## Protection XSS

Les traductions HTML sont assainies par `HtmlSanitizer`
(`src/Support/HtmlSanitizer.php`) avant le stockage et le rendu :

- Analyse basée sur le DOM avec une **liste blanche d'attributs par balise**
- Validation des URI — seuls les schémas `http`, `https` et `mailto` sont autorisés
- Suppression des caractères de contrôle (contrecarre des astuces comme `java\tscript:`)

Le XSS stocké est limité au type `html` uniquement ; les traductions `text` sont
toujours échappées.

## Authentification

Les routes de gestion utilisent par défaut `['web', 'auth']`. Pour un accès basé
sur les rôles, définissez un portail d'autorisation :

```env
LINGUA_GATE=manage-translations
```

```php
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

Lingua ajoute `can:manage-translations` à ses routes d'administration. Vous pouvez
également modifier directement le tableau `middleware` (voir
[Configuration](/fr/guide/configuration#security-access)).

## Protection contre les redirections ouvertes

Quand un utilisateur change de locale, Lingua recharge la **page actuelle**. La
cible est dérivée de `ManagesLocale::getRequestUri()` et validée contre une
**garde regex de chemin local**, donc un attaquant ne peut pas introduire une
URL absolue dans la redirection.

## Sécurité des ressources

Les CSS/JS compilés de Lingua sont servis par la route `lingua.assets`, qui
résout le fichier demandé à travers un **espace confiné realpath** — les requêtes
se résolvant en dehors du répertoire de ressources du package sont rejetées. La route
de ressources se trouve **en dehors** du groupe de routes authentifiées pour que les
styles se chargent sur les écrans de connexion.

## Sécurité du mode fichier

Dans le [pilote de stockage `file`](/fr/guide/storage), les modifications de l'UI
sont écrites par `AtomicFileWriter` (`src/Support/AtomicFileWriter.php`) :

- Écrit dans un fichier temporaire puis le **renomme atomiquement** à sa place,
  ainsi une requête concurrente ne lit jamais un fichier à moitié écrit
- Appelle `opcache_invalidate($path, true)` après le renommage pour que le nouveau
  bytecode soit récupéré dans la même requête

## Garde anti-injection de formule

Les cellules de feuilles de calcul exportées et importées commençant par `=`, `+`, `-`,
`@`, une tabulation ou un retour chariot sont préfixées d'un guillemet simple (`'`) pour
neutraliser l'injection de formule CSV/tableur.

## Correctifs antérieurs (v1.1.x)

La série 1.1.x a livré des correctifs supplémentaires qui sont repris dans la 2.0 :

- **3 CRITIQUES** — traversée de chemin de la route de ressources (espace confiné realpath),
  injection SQL via locale-en-JSON, contournement d'authentification (middleware `auth` par défaut)
- **2 ÉLEVÉS** — redirection ouverte sur le changement de locale, XSS stocké limité au type `html`
- **5 MOYENS** — injection d'argument Artisan (basculé vers la forme tableau), TypeError `Language` null,
  limitation de `$perPage` (≤ 100), et validation d'entrée associée
- **4 FAIBLES** — divers correctifs de renforcement et de divulgation

## Liste de contrôle de sécurité

- [ ] Gardez le middleware `['web', 'auth']` par défaut (ou plus strict)
- [ ] Définissez `LINGUA_GATE` pour un accès basé sur les rôles dans les applications multi-utilisateurs
- [ ] Utilisez le type `html` uniquement pour du contenu de confiance ; préférez `text`
      ailleurs
- [ ] En mode fichier, assurez-vous que les déploiements n'exposent pas les chemins d'écriture
      `lang/` à des utilisateurs non fiables
- [ ] Gardez Lingua à jour pour recevoir les correctifs de sécurité

## Signaler des vulnérabilités

Veuillez signaler les problèmes de sécurité en privé à
[security@rivalex.com](mailto:security@rivalex.com). N'ouvrez pas d'issues GitHub
publiques pour les vulnérabilités.
