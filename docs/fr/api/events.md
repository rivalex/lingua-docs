# Événements

Les composants Livewire de Lingua communiquent via des événements nommés. Écoutez-les
dans vos propres composants Livewire, code Alpine.js ou JavaScript.

## Écouter dans Livewire

```php
use Livewire\Attributes\On;

class MyComponent extends Component
{
    #[On('language_added')]
    public function handleLanguageAdded(): void
    {
        // Rafraîchir quand une nouvelle langue est ajoutée
    }
}
```

## Écouter dans Alpine.js / JavaScript

```js
window.addEventListener('language_added', (event) => {
    console.log('Nouvelle langue ajoutée !', event.detail);
});

// Via le système d'événements de Livewire :
Livewire.on('language_added', () => { /* … */ });
```

---

## Événements de langue

| Événement | Déclenché quand |
|---|---|
| `language_added` | Langue ajoutée avec succès |
| `language_added_fail` | Échec d'ajout de langue |
| `refreshLanguages` | Changement nécessitant le re-rendu de la liste |
| `language_default_set` | Langue par défaut modifiée |
| `language_default_fail` | Échec de définition de langue par défaut |
| `languages_sorted` | Langues réordonnées par glisser-déposer |
| `languages_sorted_fail` | Échec du réordonnancement |
| `lang_updated` | `lingua:update-lang` terminé avec succès |
| `lang_updated_fail` | `lingua:update-lang` a échoué |

---

## Événements de synchronisation DB

| Événement | Déclenché quand |
|---|---|
| `synced_database` | `sync-to-database` terminé avec succès |
| `synced_database_fail` | `sync-to-database` a échoué |
| `synced_local` | `sync-to-local` terminé avec succès |
| `synced_local_fail` | `sync-to-local` a échoué |

---

## Événements de traduction

| Événement | Déclenché quand |
|---|---|
| `translation_deleted` | Enregistrement de traduction entièrement supprimé |
| `translation_delete_fail` | Suppression de traduction échouée |
| `translation_locale_deleted` | Valeur d'une locale retirée d'une traduction |
| `translation_locale_delete_fail` | Suppression de valeur de locale échouée |
| `vendor_translation_protected` | Tentative de suppression d'une traduction vendor |
| `refreshTranslationsTableDefaults` | La table doit recharger la colonne locale par défaut |
| `refreshTranslationRow.{id}` | Une ligne spécifique doit être rafraîchie (paramétré) |
| `updateTranslationModal.{id}` | La modal de mise à jour doit être rafraîchie |

---

## Événements de paramètres <Badge type="tip" text="Nouveau dans la 2.0" />

| Événement | Déclenché quand |
|---|---|
| `settings_saved` | Un paramètre est mis à jour depuis la page Paramètres |
| `settings_save_fail` | Échec de sauvegarde de paramètre |

---

## Événements de transfert <Badge type="tip" text="Nouveau dans la 2.0" />

| Événement | Déclenché quand |
|---|---|
| `export_started` | Export démarré |
| `export_completed` | Fichier d'export prêt au téléchargement |
| `export_failed` | Export échoué |
| `import_diff_ready` | Diff dry-run calculé, prêt à l'affichage |
| `import_committed` | Import transactionnel appliqué avec succès |
| `import_failed` | Import échoué (rollback effectué) |

---

## Événements de rafraîchissement de l'interface

| Événement | Déclenché quand |
|---|---|
| `refreshLanguageRows` | Lignes de langue nécessitant un re-rendu |

---

## Exemples

### Notification quand une langue est ajoutée

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Langue ajoutée !'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

### Réagir à la protection vendor

```js
window.addEventListener('vendor_translation_protected', () => {
    alert('Cette traduction est protégée et ne peut pas être supprimée.');
});
```

### Rediriger après un import

```php
#[On('import_committed')]
public function onImportDone(): void
{
    $this->redirect(route('lingua.translations'), navigate: true);
}
```
