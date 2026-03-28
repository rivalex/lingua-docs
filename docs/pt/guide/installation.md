# Instalação

O Lingua inclui um assistente de instalação interativo que cuida de tudo em um único comando. As etapas manuais também estão documentadas abaixo caso você prefira mais controle.

## Passo 1 - Instalar via Composer

```bash
composer require rivalex/lingua
```

## Passo 2 - Executar o instalador

```bash
php artisan lingua:install
```

O assistente irá:

1. Publicar o arquivo de configuração em `config/lingua.php`
2. Publicar as migrations do banco de dados
3. Perguntar se deseja executar as migrations automaticamente
4. Popular o banco de dados com o idioma padrão (inglês por padrão) e todas as suas traduções do Laravel Lang
5. Opcionalmente, dar uma estrela no repositório do GitHub ⭐

Ao concluir, você verá:

```
✓ Configuration published  →  config/lingua.php
✓ Migrations published     →  database/migrations/
✓ Migrations run
✓ Seeder executed          →  default language + translations installed
Lingua package installed successfully!
```

## Passo 3 - Acessar a interface

Abra sua aplicação e acesse:

| Página | URL | Nome da rota |
|---|---|---|
| Idiomas | `your-app.test/lingua/languages` | `lingua.languages` |
| Traduções | `your-app.test/lingua/translations` | `lingua.translations` |

Pronto. O Lingua está funcionando.

---

## Instalação manual

Se preferir publicar e executar cada etapa individualmente:

```bash
# 1. Publicar config
php artisan vendor:publish --tag="lingua-config"

# 2. Publicar migrations
php artisan vendor:publish --tag="lingua-migrations"

# 3. Executar migrations
php artisan migrate

# 4. Popular idioma padrão + traduções
php artisan db:seed --class="Rivalex\Lingua\Database\Seeders\LinguaSeeder"
```

---

## Protegendo a interface de gerenciamento

Por padrão, as rotas do Lingua utilizam apenas o middleware `web` - nenhum guard de autenticação é aplicado automaticamente. **Você deve adicionar seu próprio middleware** antes de ir para produção.

### Via config

```php
// config/lingua.php
'middleware' => ['web', 'auth'],
```

### Com guards de role/permissão (ex: Spatie Permission)

```php
'middleware' => ['web', 'auth', 'role:admin'],
// ou
'middleware' => ['web', 'auth', 'can:manage-translations'],
```

::: tip
Qualquer middleware aceito pelo roteador do Laravel pode ser adicionado ao array. As alterações têm efeito imediato - não é necessário limpar o cache.
:::

---

## Checklist pós-instalação

- [ ] Adicionar middleware de autenticação em `config/lingua.php`
- [ ] Adicionar o componente de seleção de idioma ao seu layout (veja [Seletor de Idioma](/pt/features/language-selector))
- [ ] Definir `dir` e `lang` na sua tag `<html>` (veja [Suporte RTL/LTR](/pt/features/rtl-support))
- [ ] Adicionar idiomas adicionais via `php artisan lingua:add {locale}`
- [ ] Configurar a barra de ferramentas do editor em `config/lingua.php` caso use traduções HTML/Markdown
