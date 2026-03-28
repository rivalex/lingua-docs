# Eventos Livewire

Os componentes Livewire do Lingua se comunicam via eventos nomeados. Você pode escutar esses eventos nos seus próprios componentes Livewire, código Alpine.js ou JavaScript.

## Escutando no Livewire

```php
use Livewire\Attributes\On;

class MyComponent extends Component
{
    #[On('language_added')]
    public function handleLanguageAdded(): void
    {
        // Atualizar algo quando um novo idioma é adicionado
    }
}
```

## Escutando no Alpine.js / JavaScript

```js
window.addEventListener('language_added', (event) => {
    console.log('A new language was added!', event.detail);
});

// Ou via sistema de eventos do Livewire:
Livewire.on('language_added', () => {
    // ...
});
```

---

## Eventos de idioma

| Evento | Disparado quando |
|---|---|
| `language_added` | Um novo idioma foi adicionado com sucesso |
| `language_added_fail` | A adição de um idioma falhou |
| `refreshLanguages` | Qualquer alteração de idioma que requeira que a lista de idiomas seja re-renderizada |
| `language_default_set` | O idioma padrão foi alterado |
| `language_default_fail` | A definição do idioma padrão falhou |
| `languages_sorted` | Os idiomas foram reordenados via arraste e solte |
| `languages_sorted_fail` | A reordenação de idiomas falhou |
| `lang_updated` | `lingua:update-lang` foi concluído com sucesso |
| `lang_updated_fail` | `lingua:update-lang` falhou |
| `synced_database` | A sincronização para o banco de dados foi concluída com sucesso |
| `synced_database_fail` | A sincronização para o banco de dados falhou |
| `synced_local` | A sincronização para local foi concluída com sucesso |
| `synced_local_fail` | A sincronização para local falhou |

---

## Eventos de tradução

| Evento | Disparado quando |
|---|---|
| `translation_deleted` | Um registro de tradução foi completamente excluído |
| `translation_delete_fail` | A exclusão de uma tradução falhou |
| `translation_locale_deleted` | O valor de um único locale foi removido de uma tradução |
| `translation_locale_delete_fail` | A remoção de um valor de locale falhou |
| `vendor_translation_protected` | Uma tentativa foi feita de excluir uma tradução de vendor |
| `refreshTranslationsTableDefaults` | A tabela de traduções deve recarregar sua coluna de locale padrão |
| `refreshTranslationRow.{id}` | Uma linha de tradução específica deve ser atualizada (parametrizada pelo ID da tradução) |
| `updateTranslationModal.{id}` | O modal de atualização para uma tradução deve ser atualizado |

---

## Eventos de atualização da interface

| Evento | Disparado quando |
|---|---|
| `refreshLanguageRows` | Todas as linhas de idioma devem ser re-renderizadas (ex: após uma alteração de padrão) |

---

## Exemplo: Exibir um toast quando um idioma é adicionado

Usando Alpine.js e uma biblioteca de toast:

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Language added!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

## Exemplo: Redirecionar após troca de locale

Se quiser redirecionar para uma URL diferente após o seletor de idioma trocar o locale (em vez da página atual):

```php
// Publicar LanguageSelector e sobrescrever changeLocale():
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true); // redirecionar para home
}
```
