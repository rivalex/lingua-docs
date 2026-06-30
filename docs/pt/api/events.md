# Eventos Livewire

Os componentes Livewire do Lingua se comunicam via eventos nomeados. Você pode
escutar esses eventos nos seus próprios componentes Livewire, código Alpine.js
ou JavaScript vanilla.

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
// Via evento de janela
window.addEventListener('language_added', (event) => {
    console.log('Novo idioma adicionado!', event.detail);
});

// Via sistema de eventos do Livewire
Livewire.on('language_added', () => {
    // …
});
```

---

## Eventos de idioma

| Evento | Disparado quando |
|---|---|
| `language_added` | Novo idioma adicionado com sucesso |
| `language_added_fail` | Adição de idioma falhou |
| `refreshLanguages` | Qualquer alteração de idioma que requeira re-renderização da lista |
| `language_default_set` | O idioma padrão foi alterado |
| `language_default_fail` | Definição do idioma padrão falhou |
| `languages_sorted` | Idiomas reordenados via drag-and-drop |
| `languages_sorted_fail` | Reordenação falhou |
| `lang_updated` | `lingua:update-lang` concluído com sucesso |
| `lang_updated_fail` | `lingua:update-lang` falhou |
| `synced_database` | Sync para o banco de dados concluído com sucesso |
| `synced_database_fail` | Sync para o banco de dados falhou |
| `synced_local` | Sync para local concluído com sucesso |
| `synced_local_fail` | Sync para local falhou |

---

## Eventos de sincronização no BD

Os eventos de sync DB são disparados **sincronamente** — o listener é executado
antes do retorno da action Livewire, para que você possa tratar o resultado
imediatamente.

---

## Eventos de tradução

| Evento | Disparado quando |
|---|---|
| `translation_deleted` | Registro de tradução completamente excluído |
| `translation_delete_fail` | Exclusão de tradução falhou |
| `translation_locale_deleted` | Valor de um único locale removido |
| `translation_locale_delete_fail` | Remoção de valor de locale falhou |
| `vendor_translation_protected` | Tentativa de excluir tradução de vendor <Badge type="tip" text="Novidade na versão 2.0" /> |
| `refreshTranslationsTableDefaults` | Tabela de traduções deve recarregar coluna do locale padrão |
| `refreshTranslationRow.{id}` | Linha específica deve ser atualizada (parametrizada por ID) |
| `updateTranslationModal.{id}` | Modal de atualização de uma tradução deve ser atualizado |

---

## Eventos de configurações

| Evento | Disparado quando |
|---|---|
| `setting_saved` | Uma configuração foi salva com sucesso |
| `setting_save_fail` | Salvar configuração falhou |

---

## Eventos de Transfer <Badge type="tip" text="Novidade na versão 2.0" />

| Evento | Disparado quando |
|---|---|
| `export_ready` | Arquivo de export pronto para download |
| `import_diff_ready` | Diff do dry-run calculado e pronto para exibição |
| `import_committed` | Import confirmado com sucesso |
| `import_commit_fail` | Confirmação de import falhou |

---

## Eventos de atualização da UI

| Evento | Disparado quando |
|---|---|
| `refreshLanguageRows` | Linhas de idioma devem ser re-renderizadas (ex: após alteração de padrão) |

---

## Exemplos

### Toast quando um idioma é adicionado

```blade
<div
    x-data="{ show: false, message: '' }"
    x-on:language_added.window="message = 'Idioma adicionado!'; show = true; setTimeout(() => show = false, 3000)"
>
    <div x-show="show" class="toast">{{ message }}</div>
</div>
```

### Reagir à proteção de vendor

```js
window.addEventListener('vendor_translation_protected', () => {
    alert('Esta tradução é protegida e não pode ser excluída.');
});
```

### Personalizar redirecionamento pós-troca de locale

Se quiser redirecionar para uma URL diferente após a troca de locale (em vez
da página atual), publique o componente `LanguageSelector` e sobrescreva
`changeLocale()`:

```php
public function changeLocale($locale): void
{
    if (! Lingua::hasLocale($locale)) return;
    Session::put(config('lingua.session_variable'), $locale);
    app()->setLocale($locale);
    $this->redirect(route('home'), navigate: true);
}
```
