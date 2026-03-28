# Traduções de Vendor

Traduções de vendor são strings que pertencem a pacotes de terceiros — as mensagens de validação do próprio Laravel, rótulos de paginação, strings de redefinição de senha e traduções de qualquer outro pacote que inclua seu próprio diretório `lang/`.

## Como são identificadas

Durante `lingua:sync-to-database`, o Lingua verifica a estrutura do diretório `lang/vendor/`. Qualquer arquivo de tradução encontrado lá é importado com:

- `is_vendor = true`
- `vendor` = o nome do pacote (derivado do nome do diretório, ex: `spatie`, `laravel`, `filament`)

Exemplos de linhas no banco de dados após a sincronização:

```
group      | key          | is_vendor | vendor   | text
-----------|--------------|-----------|----------|-----------------------------
validation | required     | false     | null     | {"en":"The :attribute…"}
passwords  | reset        | true      | laravel  | {"en":"Your password…"}
auth       | failed       | true      | laravel  | {"en":"These credentials…"}
```

::: tip
Os arquivos `lang/en/*.php` do próprio Laravel (auth, validation, pagination, passwords) são tratados como **traduções de vendor** porque vêm do framework, não do código da sua aplicação.
:::

## O que você pode fazer com traduções de vendor

| Ação | Permitido? | Observações |
|---|---|---|
| **Editar valor** | ✅ Sim | Sobrescreva qualquer string de vendor com seu próprio texto |
| **Alterar tipo** | ✅ Sim | Alterne entre text / html / markdown |
| **Editar group ou key** | ❌ Não | Os campos group e key são bloqueados no modal de Edição |
| **Excluir** | ❌ Não | Protegido por `VendorTranslationProtectedException` |

## Sobrescrevendo uma string de vendor

O caso de uso mais comum é sobrescrever as mensagens de validação do Laravel para corresponder ao tom da sua aplicação:

1. Abra `/lingua/translations`
2. Encontre a string (ex: `validation.required`)
3. Clique no ícone de edição para abrir o modal de Atualização
4. Altere o valor para qualquer locale
5. Salve — a sobrescrita tem efeito imediato na próxima requisição

```php
// Ou programaticamente via facade:
use Rivalex\Lingua\Facades\Lingua;

Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'Please fill in the :attribute field.',
    locale: 'en'
);
```

## Consultando traduções de vendor

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Models\Translation;

// Todas as traduções de vendor
$all = Translation::where('is_vendor', true)->get();

// Todas as traduções de vendor de um pacote específico
$laravel = Lingua::getVendorTranslations('laravel');

// Todas as traduções de vendor de um pacote com valores em francês
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');

// Filtrar por group e key manualmente
$required = Translation::where('is_vendor', true)
    ->where('vendor', 'laravel')
    ->where('group', 'validation')
    ->where('key', 'required')
    ->first();
```

## Mecanismo de proteção

Tentar excluir uma tradução de vendor (da interface ou via `Lingua::forgetTranslation()`) lança uma `VendorTranslationProtectedException`:

```php
use Rivalex\Lingua\Facades\Lingua;
use Rivalex\Lingua\Exceptions\VendorTranslationProtectedException;

try {
    Lingua::forgetTranslation('required', 'en'); // key pertence a uma tradução de vendor
} catch (VendorTranslationProtectedException $e) {
    // Tratar graciosamente
}
```

Na interface Livewire, tentativas de exclusão disparam um evento `vendor_translation_protected` e fecham o modal sem excluir nada. O evento pode ser escutado nos seus próprios componentes Livewire ou código Alpine.js:

```js
// Listener de evento Alpine.js / Livewire
window.addEventListener('vendor_translation_protected', () => {
    alert('This translation is protected and cannot be deleted.');
});
```

## Ressincronizando traduções de vendor

Se um pacote do qual você depende adicionar novas chaves de tradução em uma atualização de versão, ressincronize para importá-las:

```bash
# Buscar os mais recentes do laravel-lang e sincronizar para o BD
php artisan lingua:update-lang

# Ou ressincronizar manualmente a partir dos seus arquivos lang/ existentes
php artisan lingua:sync-to-database
```

O Lingua usa `updateOrCreate` ao sincronizar, portanto sobrescritas existentes (valores editados) são preservadas.

## Desabilitando importações de traduções de vendor

Se não quiser traduções de vendor no banco de dados, sincronize apenas após remover o diretório `lang/vendor/`. O Lingua só importa o que encontra em disco.
