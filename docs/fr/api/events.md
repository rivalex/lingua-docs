# Événements Livewire

Les composants Livewire de Lingua communiquent via des événements nommés. Vous pouvez écouter ces événements dans vos propres composants Livewire, code Alpine.js ou JavaScript.

## Écouter dans Livewire

```php
use Livewire\Attributes\On;

class MyComponent extends Component
{
    #[On('language_added')]
    public function handleLanguageAdded(): void
    {
        // Rafraîchir quelque chose quand une nouvelle langue est ajoutée
    }
}
```

## Écouter dans Alpine.js / JavaScript

```js
window.addEventListener('language_added', (event) => {
    console.log('Une nouvelle langue a été ajoutée !', event.detail);
});

// Ou via le système d'événements de Livewire :
Livewire.on('language_added', () => {
    // ...
});
```

---

## Événements de langue

| Événement | Déclenché quand |
|---|---|
| `language_added` | Une nouvelle langue a été ajoutée avec succès |
| `language_added_fail` | L'ajout d'une langue a échoué |
| `refreshLanguages` | Tout changement de langue nécessitant le re-rendu de la liste des langues |
| `language_default_set` | La langue par défaut a été modifiée |
| `language_default_fail` | La définition de la langue par défaut a échoué |
| `languages_sorted` | Les langues ont été réordonnées par glisser-déposer |
| `languages_sorted_fail` | Le réordonnancement des langues a échoué |
| `lang_updated` | `lingua:update-lang` s'est terminé avec succès |
| `lang_updated_fail` | `lingua:update-lang` a échoué |
| `synced_database` | La synchronisation vers la base de données s'est terminée avec succès |
| `synced_database_fail` | La synchronisation vers la base de données a échoué |
| `synced_local` | La synchronisation vers le stockage local s'est terminée avec succès |
| `synced_local_fail` | La synchronisation vers le stockage local a échoué |

---

## Événements de traduction

| Événement | Déclenché quand |
|---|---|
| `translation_deleted` | Un enregistrement de traduction a été entièrement supprimé |
| `translation_delete_fail` | La suppression d'une traduction a échoué |
| `translation_locale_deleted` | La valeur d'une seule locale a été retirée d'une traduction |
| `translation_locale_delete_fail` | La suppression d'une valeur de locale a échoué |
| `vendor_translation_protected` | Une tentative de suppression d'une traduction de package a été effectuée |
| `refreshTranslationsTableDefaults` | La table des traductions doit recharger sa colonne de locale par défaut |
| `refreshTranslationRow.{id}` | Une ligne de traduction spécifique doit être rafraîchie (paramétré par l'ID de traduction) |
| `updateTranslationModal.{id}` | La modale de mise à jour pour une traduction doit être rafraîchie |

---

## Événements de rafraîchissement de l'interface

| Événement | Déclenché quand |
|---|---|
| `refreshLanguageRows` | Toutes les lignes de langue doivent être re-rendues (ex. après un changement de langue par défaut) |

---

## Exemple : Afficher une notification quand une langue est ajoutée

Avec Alpine.js et une bibliothèque de notifications :

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Langue ajoutée !'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

## Exemple : Rediriger après un changement de locale

Si vous souhaitez rediriger vers une URL différente après que le sélecteur de langue change de locale (au lieu de la page courante) :

```php
// Publier LanguageSelector et remplacer changeLocale() :
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true); // rediriger vers l'accueil
}
```
