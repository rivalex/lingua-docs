# 传输（导入/导出）

传输页面（`/lingua/transfer`）提供批量翻译导入和导出功能。适用于将翻译交给专业翻译机构、在电子表格中批量编辑，或在不同系统之间迁移翻译数据。

## 支持的格式

| 格式 | 导出 | 导入 | 依赖 |
|---|---|---|---|
| CSV | 是 | 是 | 内置（无需额外包） |
| JSON | 是 | 是 | 内置（无需额外包） |
| XLSX | 是 | 是 | `openspout/openspout` |
| ODS | 是 | 是 | `openspout/openspout` |

::: tip 安装 XLSX/ODS 支持
```bash
composer require openspout/openspout
```
安装后，XLSX 和 ODS 格式会自动启用，无需额外配置。
:::

## 导出

### 导出布局

支持三种导出布局：

| 布局 | 描述 | 适用场景 |
|---|---|---|
| **双语** | 每行包含源语言和目标语言各一列 | 翻译机构、对照翻译 |
| **多语言** | 每行包含所有语言区域的列 | 内部团队、全量备份 |
| **JSON 原生** | 保留 Laravel JSON 格式结构 | 开发者、系统集成 |

### 导出范围

可以选择导出：

- **全部语言区域**——所有已安装语言的翻译
- **特定语言区域**——只导出选定的一个或多个语言
- **特定分组**——只导出选定的翻译分组（如 `auth`、`validation`）

### 执行导出

1. 访问 `/lingua/transfer`
2. 在**导出**标签页中选择格式、布局和范围
3. 点击**导出**——文件会立即下载

导出的文件由 `TransferExportController` 通过流式下载响应提供，不会写入磁盘。

## 导入

导入采用**两步流程**，在提交任何更改之前先预览差异。

### 第一步：干运行（差异预览）

上传文件后，`ImportDiffService` 会分析文件内容并生成差异报告：

- **新增**——文件中有但数据库中没有的键
- **更新**——值与数据库中不同的键
- **跳过**——与数据库中相同或无效的行
- **错误**——格式错误的行或供应商保护冲突

差异报告在提交前展示给用户确认。

### 第二步：提交

确认差异后，点击**提交导入**，`ImportCommitService` 会：

1. 在单个数据库事务中应用所有变更
2. 跳过供应商保护的行（不会覆盖）
3. 遵循类型优先规则（`html` > `markdown` > `text`）
4. 提交完成后精确清除受影响的缓存键

::: warning 供应商行保护
导入无法覆盖 `is_vendor = true` 的行。如果文件中包含供应商翻译键，这些行会在差异报告中标记为跳过并说明原因。
:::

## 文件格式说明

### CSV 格式

双语 CSV 示例：

```
group,key,en,fr
auth,failed,These credentials do not match our records.,Ces identifiants ne correspondent pas.
validation,required,The :attribute field is required.,Le champ :attribute est requis.
```

多语言 CSV 示例：

```
group,key,en,fr,de,it
auth,failed,These credentials...,Ces identifiants...,Diese Anmeldedaten...,Queste credenziali...
```

### JSON 格式

JSON 原生格式保留 Laravel 的嵌套数组结构：

```json
{
  "en": {
    "auth": {
      "failed": "These credentials do not match our records."
    }
  },
  "fr": {
    "auth": {
      "failed": "Ces identifiants ne correspondent pas."
    }
  }
}
```

## 行映射逻辑

导入服务使用 `RowMapper` 将文件行映射到数据库记录：

- **双语文件**（恰好有一列非元数据、非源语言列）：当语言代码字符串匹配失败时（例如列名为 `it - Italian` 而不是 `it`），自动使用该列
- **多语言文件**（有两列或更多目标语言列）：要求语言代码字符串精确或宽松匹配
- **未知语言**：跳过该列并在差异报告中记录警告

## 相关组件

| 组件 | 说明 |
|---|---|
| `TransferExportController` | 处理导出下载 |
| `Rivalex\Lingua\Livewire\Transfer` | 传输页面 Livewire 组件 |
| `Rivalex\Lingua\Services\ExportService` | 导出逻辑 |
| `Rivalex\Lingua\Services\ImportDiffService` | 干运行差异计算 |
| `Rivalex\Lingua\Services\ImportCommitService` | 事务性导入提交 |
| `Rivalex\Lingua\Transfer\FormatRegistry` | 格式注册表（8 种格式实现） |
