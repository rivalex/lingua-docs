# 安全参考

Lingua 2.0 通过 F1–F9 加固过程实现了默认安全，本文档对每个控制点进行说明。

## 加固摘要（F1–F9）

| ID | 控制点 | 状态 |
|---|---|---|
| F1 | 翻译组/键名 XSS 过滤 | 已启用 |
| F2 | 禁止 JSON SQL 函数 | 已启用 |
| F3 | 路径遍历防护（`PathGuard`） | 已启用 |
| F4 | `targetLocale` 白名单验证 | 已启用 |
| F5 | 供应商行保护 | 已启用 |
| F6 | 通配符覆盖检查 | 已启用 |
| F7 | ReDoS 防护（有界正则） | 已启用 |
| F8 | 异常信息遮蔽（不泄露日志路径） | 已启用 |
| F9 | 授权门控（`LINGUA_GATE`） | 可配置 |

---

## 认证 {#authentication}

默认情况下，所有 Lingua 管理路由均应用 `['web', 'auth']` 中间件，匿名访客无法访问。

```php
// config/lingua.php
'middleware' => ['web', 'auth'],
```

### 通过门控进行细粒度访问控制 {#f9}

设置 `LINGUA_GATE` 环境变量（F9）后，Lingua 会将 `can:{gate}` 中间件附加到所有管理路由：

```env
LINGUA_GATE=manage-translations
```

```php
// app/Providers/AppServiceProvider.php
Gate::define('manage-translations', fn (User $u) => $u->hasRole('admin'));
```

::: warning 1.x 中间件默认值已更改
1.x 中默认中间件为 `['web']`——管理 UI 对匿名用户公开可访问。2.0 中已修复，现为 `['web', 'auth']`。
:::

---

## XSS 防护 {#f1}

在保存翻译之前，`TranslationSanitizer` 会对所有 `text` 类型（非 HTML/Markdown）的翻译值进行清理（F1）：

- 从纯文本值中剥离 HTML 标签
- 阻止嵌入脚本的尝试

对于 `html` 类型的翻译，使用 [HTMLPurifier](http://htmlpurifier.org/)（如果已安装）或白名单属性过滤来清理 HTML 内容。

---

## 禁止 JSON SQL 函数 {#f2}

Lingua 绝不在 SQL 查询中使用 `JSON_KEYS`、`json_object_keys`、`OPENJSON` 等 JSON 提取函数（F2）。所有数据聚合通过 Eloquent 加载记录后在 PHP 中完成。这同时兼顾了安全性和多数据库兼容性（MySQL / Postgres / SQLite）。

---

## 路径遍历防护 {#f3}

`PathGuard` 工具类（F3）会验证所有文件路径参数，确保路径解析后位于预期目录内。这防止了通过构造 `../` 序列逃出 `lang/` 目录的攻击。

```php
PathGuard::assertWithin($path, lang_path());
// 路径超出 lang/ 时抛出 PathTraversalException
```

---

## 开放重定向防护 {#open-redirect-protection}

语言区域切换后的重定向（F4）仅限于本应用内部路径：

- 从 `HTTP_REFERER` 或请求 URI 中提取路径
- 通过 `parse_url` 解析，只保留路径部分
- 以 `/` 开头验证（拒绝 `//evil.com` 等形式）
- 不跟随绝对 URL

```php
// ManagesLocale trait 中的简化逻辑
$uri = request()->server('REQUEST_URI', '/');
$path = parse_url($uri, PHP_URL_PATH) ?? '/';

if (!str_starts_with($path, '/')) {
    $path = '/';
}

return redirect($path);
```

---

## 供应商翻译保护 {#f5}

`language_lines.is_vendor = true` 的行受到 `VendorTranslationProtectedException` 的保护（F5）。以下操作会抛出此异常：

- `Translation::forgetTranslation()`（删除）
- 通过导入覆盖

供应商翻译**可以**被覆盖（这是它们存在的意义），但**不能**被删除。

---

## 通配符覆盖防护 {#f6}

导入服务验证传入的键不包含通配符（F6），以防止通配符键意外覆盖大量行：

```php
if (str_contains($key, '*')) {
    throw new InvalidKeyException("通配符键不允许使用");
}
```

---

## ReDoS 防护 {#f7}

所有内部正则表达式均使用有界量词，避免指数级回溯（F7）。搜索过滤中用户提供的输入会通过 `preg_quote` 处理后再用于正则匹配。

---

## 异常信息遮蔽 {#f8}

异常处理器（F8）确保：

- 内部路径、数据库模式细节、堆栈跟踪**不**暴露给最终用户
- 错误信息对用户友好但不含内部系统信息
- 完整错误详情记录到服务器日志，而非响应体

---

## 电子表格公式注入防护

导出为 CSV 时，值以 `=`、`+`、`-`、`@` 开头的单元格内容会被转义，以防止在 Excel / LibreOffice 等电子表格应用中执行公式。

---

## 文件模式安全

文件驱动的额外安全考量：

- `AtomicFileWriter` 使用原子性重命名（先写 `.tmp`，再 `rename()`），防止并发写入产生中间状态
- `opcache_invalidate($path, true)` 在写入后立即调用，防止 OPcache 提供过期字节码
- 写入目录限制在 `config('lingua.lang_dir')` 下，由 `PathGuard` 强制执行
- 文件权限遵循 PHP 进程的 umask（建议 `0644` 或更严格）

---

## 安全建议

- 在生产环境中设置 `LINGUA_GATE` 以实现基于角色的访问控制
- 对 `lingua.languages`、`lingua.translations` 等路由前缀启用速率限制
- 定期通过传输/导出功能备份翻译数据
- 监控 `language_lines` 表是否有异常的 `is_vendor` 变更（可能是供应商保护绕过尝试）
- 如果使用 HTML 类型翻译，考虑安装 HTMLPurifier 以获得更严格的清理效果
