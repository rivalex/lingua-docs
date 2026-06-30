# Traduções de Vendor

Traduções de vendor são strings pertencentes ao **Laravel** ou a **pacotes de
terceiros** — como `auth.failed`, `validation.required`, ou strings de qualquer
pacote do Composer que inclua um diretório `lang/`. O Lingua importa e exibe
essas strings mas as **protege contra exclusão acidental**.

## Como são identificadas

Durante `lingua:sync-to-database`, o Lingua verifica a estrutura de `lang/vendor/`.
Qualquer arquivo encontrado lá é importado com `is_vendor = true` e `vendor`
igual ao nome do pacote derivado do nome do diretório.

::: tip
Os arquivos `lang/en/*.php` do próprio Laravel (auth, validation, pagination,
passwords) também são tratados como traduções de vendor — pois vêm do framework,
não do código da sua aplicação.
:::

```
group      | key      | is_vendor | vendor  | text
-----------|----------|-----------|---------|-------------------------
validation | required | false     | null    | {"en":"The :attribute…"}
passwords  | reset    | true      | laravel | {"en":"Your password…"}
auth       | failed   | true      | laravel | {"en":"These credentials…"}
```

## Ações permitidas

| Ação | Permitida? | Observações |
|---|---|---|
| **Visualizar** | ✅ | Visível com o toggle "Incluir vendor" ativo |
| **Editar valor** | ✅ | Sobrescreve o valor para o locale; `is_vendor` permanece |
| **Criar nova chave em grupo vendor** | ❌ | Bloqueado no modal de Edição |
| **Excluir** | ❌ | Lança `VendorTranslationProtectedException` |
| **Importar sobrescrição** | ❌ | Linhas de vendor são ignoradas no commit de import |

## Mecanismo de proteção

A proteção ocorre no nível do repositório — não apenas na UI. O método
`forgetTranslation()` em ambos os repositórios (`DatabaseRepository` e
`FileRepository`) verifica `is_vendor` antes de excluir:

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('auth.failed', 'en');
} catch (VendorTranslationProtectedException $e) {
    // Tratar graciosamente
}
```

Na interface Livewire, tentativas de exclusão despacham um evento
`vendor_translation_protected` e fecham o modal sem excluir nada:

```js
window.addEventListener('vendor_translation_protected', () => {
    alert('Esta tradução é protegida e não pode ser excluída.');
});
```

## Sobrescrevendo uma string de vendor

O caso mais comum é sobrescrever mensagens de validação do Laravel:

```php
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Por favor, preencha o campo :attribute.',
    locale: 'pt'
);
```

Ou pela interface: abra `/lingua/translations`, encontre a string, clique no
ícone de edição e altere o valor. A sobrescrita tem efeito imediato.

## Consultando traduções de vendor

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// Todas as de vendor
$all = Translation::where('is_vendor', true)->get();

// De um vendor específico
$laravel = Lingua::getVendorTranslations('laravel');

// Com valores em francês
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');
```

## Re-sincronizando traduções de vendor

Quando você atualiza um pacote que agrupa strings de tradução, re-sincronize:

```bash
# Popula a partir do conjunto de dados empacotado + lang/ local
php artisan lingua:update-lang

# Ou sincroniza manualmente a partir dos arquivos lang/ existentes
php artisan lingua:sync-to-database
```

O Lingua usa `updateOrCreate` ao sincronizar — sobrescritas existentes (valores
editados na UI) são **preservadas** entre sincronizações.

## Proteção no driver arquivo

No driver `file`, a proteção de vendor rastreia quais arquivos originam de
`lang/vendor/` — qualquer caminho abaixo deste diretório é tratado como vendor.
Tentativas de excluir esses arquivos ou chaves lançam
`VendorTranslationProtectedException` da mesma forma.
