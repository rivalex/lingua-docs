# Facade Lingua

O facade `Lingua` fornece acesso estático ao serviço completo do Lingua de
qualquer lugar na sua aplicação.

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## Helpers de locale

### `getLocale(): string`

Retorna o código do locale atual. Espelha `app()->getLocale()`.

```php
Lingua::getLocale(); // 'en'
```

---

### `getDefaultLocale(): string`

Retorna o código do locale marcado como padrão no banco de dados. Faz fallback
para `config('lingua.default_locale', 'en')`.

```php
Lingua::getDefaultLocale(); // 'en'
```

---

### `isDefaultLocale(?string $locale = null): bool`

Retorna `true` se o locale fornecido (ou locale atual quando `null`) for o padrão.

```php
Lingua::isDefaultLocale();       // true (locale atual é o padrão)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (locale desconhecido, sem exceção)
```

---

### `hasLocale(string $locale): bool`

Retorna `true` se um registro `Language` existir para o código ou valor regional.

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (correspondido por regional)
Lingua::hasLocale('xx');     // false
```

---

### `setDefaultLocale(string $locale): void`

Marca o locale fornecido como padrão. Lança `ModelNotFoundException` se não
estiver instalado.

```php
Lingua::setDefaultLocale('fr');
```

---

### `getLocaleName(?string $locale = null): string`

Nome de exibição em inglês do locale. Retorna `''` se não encontrado.

```php
Lingua::getLocaleName();       // 'English'
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('zz');   // ''
```

---

### `getLocaleNative(?string $locale = null): string`

Nome nativo do locale. Retorna `''` se não encontrado.

```php
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
```

---

### `getDirection(?string $locale = null): string`

Retorna `'ltr'` ou `'rtl'`. Padrão `'ltr'` como fallback seguro.

```php
Lingua::getDirection();        // 'ltr'
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('zz');    // 'ltr' (fallback seguro)
```

---

### `info(string $locale): ?LocaleInfo` <Badge type="warning" text="Alterado na versão 2.0" />

Retorna um objeto `LocaleInfo` readonly com informações do locale, ou `null` para
locales desconhecidos.

```php
$info = Lingua::info('fr');

if ($info !== null) {
    $info->code;      // 'fr'
    $info->name;      // 'French'
    $info->native;    // 'Français'
    $info->direction; // 'ltr'
    $info->regional;  // 'fr_FR'
    $info->type;      // 'regional'
}

Lingua::info('xx'); // null (locale desconhecido)
```

::: warning Breaking change da versão 2.0
`Lingua::info()` agora retorna `?LocaleInfo` (nullable) em vez de `LocaleData`
do antigo `laravel-lang/locales`. Sempre proteja com `if ($info !== null)`.
Os nomes dos campos também diferem do antigo objeto Spatie.
:::

---

## Consultas de idiomas

### `languages(): Collection`

Todos os models `Language` instalados, ordenados por `sort`.

```php
foreach (Lingua::languages() as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

Model `Language` para o locale fornecido, ou `null` se não encontrado.

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

---

### `getDefault(): ?Language`

Model `Language` marcado como padrão.

```php
$default = Lingua::getDefault();
$default?->code; // 'en'
```

---

### `getFallback(): ?Language`

Model `Language` para `app()->getFallbackLocale()`.

---

### `languagesWithStatistics(): Collection`

Todos os models `Language` enriquecidos com atributos de estatística:

| Atributo | Tipo | Descrição |
|---|---|---|
| `total_strings` | `int` | Total de linhas em `language_lines` |
| `translated_strings` | `int` | Linhas com valor para este locale |
| `missing_strings` | `int` | `total - translated` |
| `completion_percentage` | `float` | `translated / total * 100` |

```php
foreach (Lingua::languagesWithStatistics() as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
}
```

---

## Verificações de disponibilidade

### `available(): array`

Todos os códigos de locale conhecidos pelo `LocaleRegistry` interno (129+).

```php
Lingua::available(); // ['af', 'ar', 'az', …]
```

---

### `installed(): array`

Locales atualmente na tabela `languages`.

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

---

### `notInstalled(): array`

Locales disponíveis mas não instalados, ordenados alfabeticamente.

```php
Lingua::notInstalled(); // ['af', 'ar', 'az', …]
```

---

### `isInstalled(?string $locale = null): bool`

```php
Lingua::isInstalled('en');   // true
Lingua::isInstalled('xx');   // false
```

---

### `isAvailable(?string $locale = null): bool`

`true` se o locale é conhecido mas ainda não instalado.

```php
Lingua::isAvailable('de');   // true (disponível, não instalado)
Lingua::isAvailable('en');   // false (já instalado)
```

---

## Leituras de traduções

### `getTranslations(?string $key): array`

Todos os valores de locale para uma chave de tradução.

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants…']
```

---

### `getTranslation(?string $key, ?string $locale = null): string`

String traduzida para uma chave e locale. Retorna `''` se não encontrado.

```php
Lingua::getTranslation('auth.failed', 'fr');
Lingua::getTranslation('auth.failed'); // locale atual
```

---

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

```php
Lingua::getTranslationByGroup('validation');       // todas as strings
Lingua::getTranslationByGroup('validation', 'fr'); // com valor em francês
```

---

### `getLocaleStats(?string $locale = null): array`

```php
$stats = Lingua::getLocaleStats('fr');
// ['total' => 1240, 'translated' => 980, 'missing' => 260, 'percentage' => 79.03]
```

---

## Escritas de traduções

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
```

---

### `forgetTranslation(?string $key, ?string $locale = null): void`

Remove o valor de um locale. Se o locale for o padrão, exclui o registro inteiro.
Lança `VendorTranslationProtectedException` para linhas de vendor.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // remove valor 'fr'
Lingua::forgetTranslation('custom.key', 'en');  // exclui registro inteiro
```

---

## Helpers de vendor

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frenchLaravel = Lingua::getVendorTranslations('laravel', 'fr');
```

---

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

```php
Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'O campo :attribute é obrigatório.',
    locale: 'pt'
);
```

---

## Ciclo de vida de idiomas

### `addLanguage(string $locale): void` <Badge type="warning" text="Alterado na versão 2.0" />

Nativo do BD: cria o registro `Language` e popula strings do conjunto de dados
empacotado. **Não** chama `lang:add` nem faz downloads de arquivos.

```php
Lingua::addLanguage('fr');
```

---

### `removeLanguage(string $locale): void` <Badge type="warning" text="Alterado na versão 2.0" />

Nativo do BD: remove o registro `Language` e todos os valores de tradução para
aquele locale. **Não** remove arquivos de `lang/`.

```php
Lingua::removeLanguage('fr');
```

---

## Sync e manutenção

### `syncToDatabase(): void`

Importa todos os arquivos `lang/` locais para o banco de dados.

---

### `syncToLocal(): void`

Exporta todas as traduções do banco de dados para arquivos `lang/` locais.

---

### `statistics(): array`

Visão geral global de estatísticas de tradução.

```php
$overview = Lingua::statistics();
// ['languages' => 4, 'total' => 1240, 'translated' => 4520, 'missing' => 440]
```

---

### `optimize()` <Badge type="warning" text="Depreciado na versão 2.0" />

Depreciado — remova todas as chamadas. Não há equivalente na versão 2.0.

---

## Helpers de template

```php
// Funções globais disponíveis em qualquer lugar
lingua_direction();      // equivalente a Lingua::getDirection()
lingua_locale();         // equivalente a Lingua::getLocale()
lingua_locale_name();    // equivalente a Lingua::getLocaleName()
```
