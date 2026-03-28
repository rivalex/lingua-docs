# Facade Lingua

O facade `Lingua` fornece acesso estático ao serviço completo do Lingua de qualquer lugar na sua aplicação.

```php
use Rivalex\Lingua\Facades\Lingua;
```

---

## Helpers de locale

### `getLocale()`

Retorna o código do locale atual da aplicação.

```php
Lingua::getLocale(); // 'en'
```

Espelha `app()->getLocale()`.

---

### `getDefaultLocale()`

Retorna o código do locale do idioma marcado como padrão no banco de dados.

```php
Lingua::getDefaultLocale(); // 'en'
```

Faz fallback para `config('lingua.default_locale', 'en')` se nenhum padrão estiver definido.

---

### `isDefaultLocale(?string $locale = null): bool`

Retorna `true` se o locale fornecido (ou o locale atual quando `null`) for o padrão do sistema.

```php
Lingua::isDefaultLocale();       // true  (locale atual é o padrão)
Lingua::isDefaultLocale('en');   // true
Lingua::isDefaultLocale('fr');   // false
Lingua::isDefaultLocale('xx');   // false (locale desconhecido, sem exceção)
```

---

### `hasLocale(string $locale): bool`

Retorna `true` se um registro `Language` existir para o código ou valor regional fornecido.

```php
Lingua::hasLocale('en');     // true
Lingua::hasLocale('en-US');  // true (correspondido por regional)
Lingua::hasLocale('xx');     // false
```

---

### `setDefaultLocale(string $locale): void`

Marca o locale fornecido como padrão do sistema. Lança `ModelNotFoundException` se o locale não estiver instalado.

```php
Lingua::setDefaultLocale('fr');
```

---

### `getLocaleName(?string $locale = null): string`

Retorna o nome de exibição em inglês do locale. Retorna `''` se não encontrado.

```php
Lingua::getLocaleName();       // 'English'  (locale atual)
Lingua::getLocaleName('fr');   // 'French'
Lingua::getLocaleName('ar');   // 'Arabic'
Lingua::getLocaleName('zz');   // ''
```

---

### `getLocaleNative(?string $locale = null): string`

Retorna o nome nativo do locale. Retorna `''` se não encontrado.

```php
Lingua::getLocaleNative();       // 'English'
Lingua::getLocaleNative('fr');   // 'Français'
Lingua::getLocaleNative('ar');   // 'العربية'
Lingua::getLocaleNative('ja');   // '日本語'
```

---

### `getDirection(?string $locale = null): string`

Retorna `'ltr'` ou `'rtl'` para o locale fornecido. Padrão para `'ltr'` se o locale não for encontrado.

```php
Lingua::getDirection();        // 'ltr'  (locale atual)
Lingua::getDirection('ar');    // 'rtl'
Lingua::getDirection('he');    // 'rtl'
Lingua::getDirection('en');    // 'ltr'
Lingua::getDirection('zz');    // 'ltr'  (fallback seguro)
```

---

### `info(mixed $locale, bool $withCountry = false, bool $withCurrency = false): LocaleData`

Retorna um objeto `LocaleData` do `laravel-lang/locales` com informações detalhadas do locale.

```php
$info = Lingua::info('fr');
$info->code;          // 'fr'
$info->native;        // 'Français'
$info->direction;     // Direction enum

$info = Lingua::info('en-US', withCountry: true, withCurrency: true);
$info->native;        // 'English (United States)'
```

---

## Consultas de idiomas

### `languages(): Collection`

Retorna uma coleção de todos os models `Language` instalados.

```php
$languages = Lingua::languages();
foreach ($languages as $lang) {
    echo "{$lang->code}: {$lang->name}";
}
```

---

### `get(?string $locale = null): ?Language`

Retorna o model `Language` para o código de locale fornecido, ou `null` se não encontrado.

```php
$lang = Lingua::get('fr');
$lang?->name;       // 'French'
$lang?->direction;  // 'ltr'
```

---

### `getDefault(): ?Language`

Retorna o model `Language` marcado como padrão.

```php
$default = Lingua::getDefault();
$default?->code;       // 'en'
$default?->is_default; // true
```

---

### `getFallback(): ?Language`

Retorna o model `Language` para `app()->getFallbackLocale()`.

```php
$fallback = Lingua::getFallback();
```

---

### `languagesWithStatistics(): Collection`

Retorna todos os models `Language` enriquecidos com estatísticas de tradução.

```php
$languages = Lingua::languagesWithStatistics();
foreach ($languages as $lang) {
    echo "{$lang->name}: {$lang->completion_percentage}%";
    echo "Missing: {$lang->missing_strings} / {$lang->total_strings}";
}
```

Cada model ganha quatro atributos somente-leitura:

| Atributo | Tipo | Descrição |
|---|---|---|
| `total_strings` | `int` | Total de linhas em `language_lines` |
| `translated_strings` | `int` | Linhas com um valor para este locale |
| `missing_strings` | `int` | `total - translated` |
| `completion_percentage` | `float` | `translated / total * 100` |

---

## Verificações de disponibilidade de locales

### `available(): array`

Retorna todos os códigos de locale conhecidos pelo `laravel-lang/locales` (instalados + não instalados).

```php
Lingua::available(); // ['af', 'ar', 'az', 'be', 'bg', 'bn', …]
```

---

### `installed(): array`

Retorna os códigos de locale atualmente na tabela `languages`.

```php
Lingua::installed(); // ['en', 'fr', 'it']
```

---

### `notInstalled(): array`

Retorna os códigos de locale disponíveis mas não instalados, ordenados alfabeticamente.

```php
Lingua::notInstalled(); // ['af', 'ar', 'az', …] (todos exceto 'en', 'fr', 'it')
```

---

### `isInstalled(?string $locale = null): bool`

```php
Lingua::isInstalled('en');   // true
Lingua::isInstalled('xx');   // false
Lingua::isInstalled(null);   // false
```

---

### `isAvailable(?string $locale = null): bool`

Retorna `true` se o locale é conhecido pelo laravel-lang mas **ainda não** instalado.

```php
Lingua::isAvailable('de');   // true  (disponível, não instalado)
Lingua::isAvailable('en');   // false (já instalado)
Lingua::isAvailable(null);   // false
```

---

## Leituras de traduções

### `translations(): Collection`

Retorna todos os models `Translation`.

```php
$all = Lingua::translations();
```

---

### `getTranslations(?string $key): array`

Retorna todos os valores de locale para uma chave de tradução como um array associativo.

```php
Lingua::getTranslations('auth.failed');
// ['en' => 'These credentials do not match.', 'fr' => 'Ces identifiants ne correspondent pas.']

Lingua::getTranslations('nonexistent'); // []
```

---

### `getTranslation(?string $key, ?string $locale = null): string`

Retorna a string traduzida para uma chave e locale. Retorna `''` se não encontrado.

```php
Lingua::getTranslation('auth.failed');         // locale atual
Lingua::getTranslation('auth.failed', 'fr');   // 'Ces identifiants…'
Lingua::getTranslation('auth.failed', 'zz');   // ''
Lingua::getTranslation('nonexistent', 'en');   // ''
```

---

### `getTranslationByGroup(string $group, ?string $locale = null): Collection`

Retorna todos os models `Translation` em um grupo, opcionalmente filtrados para aqueles com um valor para o locale fornecido.

```php
// Todas as strings de validação
Lingua::getTranslationByGroup('validation');

// Apenas strings de validação que têm uma tradução em francês
Lingua::getTranslationByGroup('validation', 'fr');
```

---

### `getLocaleStats(?string $locale = null): array`

Retorna estatísticas de tradução para o locale fornecido (ou locale atual quando `null`).

```php
$stats = Lingua::getLocaleStats('fr');
// [
//   'total'      => 1240,
//   'translated' => 980,
//   'missing'    => 260,
//   'percentage' => 79.03,
// ]

Lingua::getLocaleStats('zz');
// ['total' => 1240, 'translated' => 0, 'missing' => 1240, 'percentage' => 0.0]
```

---

## Escritas de traduções

### `setTranslation(?string $key, string $value, ?string $locale = null): void`

Salva um valor de tradução. Não faz nada se a chave não existir.

```php
Lingua::setTranslation('auth.failed', 'Les identifiants ne correspondent pas.', 'fr');
Lingua::setTranslation('auth.failed', 'Updated message');  // locale atual
```

---

### `forgetTranslation(?string $key, ?string $locale = null): void`

Remove o valor de um locale de uma chave de tradução. Se o locale for o padrão, o registro inteiro é excluído. Lança `VendorTranslationProtectedException` para traduções de vendor.

```php
Lingua::forgetTranslation('custom.key', 'fr');  // remove apenas o valor 'fr'
Lingua::forgetTranslation('custom.key', 'en');  // exclui o registro inteiro (locale padrão)
```

---

## Helpers de traduções de vendor

### `getVendorTranslations(string $vendor, ?string $locale = null): Collection`

```php
$laravel = Lingua::getVendorTranslations('laravel');
$frenchSpatie = Lingua::getVendorTranslations('spatie', 'fr');
```

---

### `setVendorTranslation(string $vendor, string $group, string $key, string $value, ?string $locale = null): void`

Atualiza um valor de tradução de vendor. Lança `ModelNotFoundException` se o registro não existir.

```php
Lingua::setVendorTranslation(
    vendor: 'laravel',
    group:  'validation',
    key:    'required',
    value:  'The :attribute field is mandatory.',
    locale: 'en'
);
```

---

## Ciclo de vida de idiomas

### `addLanguage(string $locale): void`

Instala arquivos de idioma para o locale fornecido via `lang:add`.

```php
Lingua::addLanguage('fr');
```

> Isso apenas instala arquivos. Use `php artisan lingua:add {locale}` para o fluxo completo e orquestrado (arquivos + registro no BD + sync).

---

### `removeLanguage(string $locale): void`

Remove arquivos de idioma para o locale fornecido via `lang:rm --force`.

```php
Lingua::removeLanguage('fr');
```

> Isso apenas remove arquivos. Use `php artisan lingua:remove {locale}` para o fluxo completo e orquestrado (arquivos + traduções + registro no BD + reordenação).

---

## Sync e manutenção

### `syncToDatabase(): void`

Importa todos os arquivos `lang/` locais para o banco de dados.

```php
Lingua::syncToDatabase();
```

---

### `syncToLocal(): void`

Exporta todas as traduções do banco de dados para arquivos `lang/` locais.

```php
Lingua::syncToLocal();
```

---

### `updateLanguages(): void`

Executa `lang:update` para buscar as traduções mais recentes do `laravel-lang`.

```php
Lingua::updateLanguages();
```

---

### `optimize(): void`

Limpa o cache da aplicação via `optimize:clear`.

```php
Lingua::optimize();
```
