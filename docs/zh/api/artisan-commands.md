# Artisan 命令

Lingua 提供六个 Artisan 命令，用于通过终端管理语言和翻译。

## 语言管理

### `lingua:add {locale}`

安装一种新语言--下载文件、创建数据库记录、同步翻译。

```bash
php artisan lingua:add it
php artisan lingua:add pt_BR
php artisan lingua:add ar
```

**执行内容：**
1. 从 `laravel-lang/locales` 获取语言环境元数据
2. 运行 `lang:add {locale}` 安装语言文件
3. 在数据库中创建 `Language` 记录
4. 运行 `lingua:sync-to-database` 导入新字符串

**输出：**
```
Adding language: it...
Installing language files via Laravel Lang...
Creating language record in database...
Syncing translations to database...
Language 'it' added successfully.
```

::: tip
添加语言后，访问 `/lingua/translations/it` 查看哪些字符串仍需翻译。
:::

---

### `lingua:remove {locale}`

移除一种语言--删除文件、清理数据库、重新排序剩余语言。

```bash
php artisan lingua:remove fr
```

**执行内容：**
1. 检查该语言是否为默认语言（如果是则中止并报错）
2. 运行 `lang:rm {locale} --force` 移除语言文件
3. 从 `language_lines.text` 中移除所有 `{locale}` 值
4. 删除 `Language` 记录
5. 重新排序剩余语言的排序值
6. 运行 `lingua:sync-to-database`

::: warning 默认语言保护
您不能移除默认语言。请先将另一种语言设置为默认语言：
```bash
php artisan lingua:add fr       # 添加新的默认语言
# 然后通过界面：将法语设置为默认语言
php artisan lingua:remove en    # 现在可以安全地移除英语
```
:::

---

### `lingua:update-lang`

通过 Laravel Lang 更新所有已安装的语言文件，然后重新同步到数据库。

```bash
php artisan lingua:update-lang
```

在以下情况后运行：
- 升级 Laravel（新的验证消息等）
- 安装附带翻译的新扩展包
- 更新 `laravel-lang/*` 扩展包

---

## 翻译同步

### `lingua:sync-to-database`

将所有本地 PHP/JSON 翻译文件导入 `language_lines` 表。

```bash
php artisan lingua:sync-to-database
```

**导入内容：**
- `lang/{locale}/*.php` - PHP 文件
- `lang/{locale}.json` - JSON 文件
- `lang/vendor/{package}/{locale}/*.php` - 扩展包文件

使用 `updateOrCreate` 基于 `group + key` 匹配，因此通过界面进行的现有编辑会被保留。

**典型使用场景：**
```bash
# 在新克隆后 - 从提交的语言文件填充数据库
php artisan lingua:sync-to-database

# 在 lang:update 后 - 导入新字符串
php artisan lingua:sync-to-database

# 在部署脚本中
php artisan migrate
php artisan lingua:sync-to-database
php artisan optimize
```

---

### `lingua:sync-to-local`

将所有数据库翻译导出回本地 PHP/JSON 文件。

```bash
php artisan lingua:sync-to-local
```

**导出内容：**
- 数据库翻译 → `lang/{locale}/{group}.php`
- JSON 分组（`single`） → `lang/{locale}.json`
- 扩展包翻译 → `lang/vendor/{vendor}/{locale}/{group}.php`

**典型使用场景：**
```bash
# 在提交前 - 将数据库状态导出到文件以便版本控制
php artisan lingua:sync-to-local
git add lang/
git commit -m "chore: sync translations"

# 在部署到从文件读取的服务器之前
php artisan lingua:sync-to-local
```

---

### `lingua:install`

交互式首次安装向导。在 `composer require` 后运行一次。

```bash
php artisan lingua:install
```

不建议在初始安装后重新运行。如果您需要重新发布单个资源，请改用 `vendor:publish` 标签。

---

## 命令快速参考

<div class="command-table">

| 命令 | 描述 |
|---|---|
| `lingua:add {locale}` | 安装语言（文件 + 数据库 + 同步） |
| `lingua:remove {locale}` | 移除语言（文件 + 数据库 + 同步） |
| `lingua:update-lang` | 通过 Laravel Lang 更新语言文件 + 同步 |
| `lingua:sync-to-database` | 将本地文件导入数据库 |
| `lingua:sync-to-local` | 将数据库导出到本地文件 |
| `lingua:install` | 交互式首次安装向导 |

</div>

---

## 技巧

::: tip 在 CI/CD 中自动化同步
将同步添加到部署流水线，使数据库与仓库保持同步：

```yaml
# GitHub Actions 部署步骤（示例）
- name: Sync translations
  run: php artisan lingua:sync-to-database
```
:::

::: tip 一次添加多种语言
没有批量添加命令，但您可以通过 Shell 循环链式调用：

```bash
for locale in fr it de es pt_BR; do
  php artisan lingua:add $locale
done
```
:::

::: tip 检查将同步的内容
在运行 `lingua:sync-to-database` 之前，您可以通过查看 `lang/` 来预览将处理的文件数量和语言环境：

```bash
ls lang/
# en  fr  it  vendor
```
:::
