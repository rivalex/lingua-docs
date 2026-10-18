# Atualizando da versão 1.x para 2.0

O Lingua 2.0 é uma versão principal. Este guia apresenta a migração passo a passo,
lista cada breaking change e responde as perguntas mais comuns.

## Por que esta é uma versão principal

- **Dependências externas removidas.** `spatie/laravel-translation-loader`
  e `laravel-lang/common` foram removidos. Os metadados de localidade e o
  conjunto de dados de tradução agora estão incluídos no pacote.
- **Drivers de armazenamento adicionados.** Escolha `database` (o comportamento
  da versão 1.x) ou `file`. Veja [Drivers de Armazenamento](/pt/guide/storage).
- **Reforço abrangente de segurança.** Seguro por padrão, além da passagem de
  reforço F1–F9. Veja [Segurança](/pt/guide/security).
- **Versão mínima do PHP elevada** para 8.3+.

## Migração passo a passo

### 1. Atualizar o pacote

```bash
composer update rivalex/lingua
```

O Composer remove automaticamente `spatie/laravel-translation-loader`. Se o seu
`composer.json` lista `laravel-lang/common`:

```bash
composer remove laravel-lang/common
```

### 2. Re-publicar e mesclar a configuração

```bash
php artisan vendor:publish --tag=lingua-config --force
```

Depois mescle as novas chaves na sua configuração existente: `gate`,
`storage.driver`, `nav.enabled`, `navigate`, `routes_extra_parameters`,
`layout`, `links.translations`, `ui.sticky_top`, `cache.store`,
`cache.prefix`, `suppress_pro_nudge`, `pro_upgrade_url`,
`extensions.enabled`. Veja [Configuração](/pt/guide/configuration).

### 3. Definir o driver de armazenamento

```env
LINGUA_STORAGE_DRIVER=database
```

```bash
php artisan config:clear
```

`database` é idêntico ao comportamento da versão 1.x.

### 4. Migrations

As migrations agora estão divididas em **três** arquivos. Se você atualizou da
versão 1.x com as migrations já executadas, **nenhuma nova migration é necessária**
— suas tabelas já existem. Verifique divergências de schema apenas se você
publicou e personalizou anteriormente a migration combinada.

### 5. Carregadores de tradução personalizados

```php
// Antes
use Spatie\TranslationLoader\TranslationLoaders\TranslationLoader;

// Depois
use Rivalex\Lingua\Contracts\TranslationLoader;
```

A assinatura é inalterada:
`loadTranslations(string $locale, string $group, ?string $namespace = null): array`.

### 6. Model Translation personalizado

```php
// Antes
class Translation extends \Spatie\TranslationLoader\LanguageLine {}

// Depois
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $table = 'language_lines';

    public static function getTranslationsForGroup(string $locale, string $group): array
    {
        // …
    }
}
```

### 7. Type-hints

```php
// Antes
use Spatie\TranslationLoader\TranslationLoaderManager;

// Depois
use Rivalex\Lingua\TranslationManager\LinguaManager;
```

### 8. Autores de pacotes (Testbench)

Remova o provider Spatie de `getPackageProviders()`:

```php
// Remova esta linha
Spatie\TranslationLoader\TranslationServiceProvider::class,
```

## Referência de breaking changes

| Alteração | Detalhe |
|---|---|
| Tipo de retorno de `Lingua::info()` <Badge type="warning" text="Breaking" /> | Agora retorna `?LocaleInfo`; retorna `null` para locales desconhecidos (antes lançava exceção). Proteja com `if ($info === null)`. Os nomes dos campos diferem do antigo `LaravelLang\LocaleData`. |
| `addLanguage()` / `removeLanguage()` <Badge type="warning" text="Breaking" /> | Não chamam mais `lang:add` / `lang:rm`. Apenas nativo do BD — sem gravações em arquivo. |
| Padrão de Middleware <Badge type="warning" text="Breaking" /> | `['web', 'auth']` (era `['web']`). |
| Padrão de `navigate` <Badge type="warning" text="Breaking" /> | `false` (era `true`). |
| Versão mínima do PHP <Badge type="warning" text="Breaking" /> | 8.3+ (era 8.2+). |
| `Language::scopeActive()` <Badge type="warning" text="Breaking" /> | Renomeado para `scopeOrdered()` (delegado mantido para compatibilidade). |
| `Translation::forgetTranslation()` <Badge type="warning" text="Breaking" /> | Lança `VendorTranslationProtectedException` para linhas de vendor. |
| `Import $errors` <Badge type="warning" text="Breaking" /> | Renomeado para `$rowErrors`. |
| `optimize()` <Badge type="warning" text="Breaking" /> | Depreciado — remova todas as chamadas. |
| Colunas nullable | `language_lines.text` e `languages.regional` agora são nullable. |
| Migrations | Divididas em 3 arquivos (era 1 combinado). |
| Tag `lingua-assets` | Removida — assets servidos via rota `lingua.assets`. |

## Checklist rápida

- [ ] `composer update rivalex/lingua`
- [ ] Remover `laravel-lang/common` se presente no seu `composer.json`
- [ ] Re-publicar configuração e mesclar novas chaves
- [ ] Definir `LINGUA_STORAGE_DRIVER=database` e executar `php artisan config:clear`
- [ ] Atualizar quaisquer carregadores / models / type-hints personalizados (Spatie → Lingua)
- [ ] Substituir usos de `Lingua::info()` com guarda de `null`
- [ ] Remover chamadas a `optimize()`
- [ ] Renomear referências a `Import::$errors` para `$rowErrors`
- [ ] Confirmar que middleware/gate correspondem à sua política de acesso

## FAQ

**Minhas traduções serão perdidas?**
Não. Com o driver `database` o comportamento e os dados são idênticos à versão
1.x. Seus registros `language_lines` existentes não são alterados.

**Preciso re-executar as migrations?**
Não, se elas já foram executadas na versão 1.x. As tabelas já existem; a divisão
em 3 arquivos afeta apenas instalações novas.

**Ainda posso usar armazenamento baseado em arquivo?**
Sim — esse é o novo driver `file`. Alterne a qualquer momento com
`php artisan lingua:storage file`. Veja
[Drivers de Armazenamento](/pt/guide/storage).

**O Flux ainda é necessário?**
Sim. O Lingua 2.0 requer `livewire/flux ^2.12`. O Flux **não** foi removido.

## Atualizando da versão 2.0 para a 2.1

O Lingua 2.1 oferece suporte ao Laravel **12 e 13**. O Laravel 11 deixou de receber suporte de segurança em March 12, 2026. Aplicações que ainda usam Laravel 11 permanecem no Lingua 2.0.6, versão que o Composer continua selecionando automaticamente; atualize o Laravel antes de atualizar o Lingua. Não há outros breaking changes: nenhuma alteração de config, migration ou API é necessária.
