# Importer & Exporter 导入导出

表格查询页通用的导入和导出组件，提供统一的上传下载交互体验。

## 基础用法

:::demo
importer-exporter/basic
:::

## Importer 导入组件

用于表格数据的批量导入，提供模板下载和文件上传功能。

### 基础示例

点击导入按钮，打开导入弹窗，可下载模板后上传文件。

```vue
<hx-importer
  :upload-action="'/api/import/upload'"
  :template-url="'/api/import/template'"
  :accept="'.xlsx,.xls'"
  :max-size="10"
  @success="handleImportSuccess"
/>
```

## Exporter 导出组件

用于表格数据的批量导出，支持按页、全部、选中三种导出方式。

### 基础示例

点击导出按钮，选择导出方式后确认导出。

```vue
<hx-exporter
  :export-action="'/api/export'"
  :get-search-params="getSearchParams"
  :total-count="totalCount"
  :current-page="currentPage"
  :page-size="pageSize"
  :selected-rows="selectedRows"
  :max-export-count="10000"
  @success="handleExportSuccess"
/>
```

### 导出方式

- **按页导出**：导出当前页数据
- **全部导出**：导出符合筛选条件的所有数据
- **选中导出**：导出表格中已选中的行数据（需配合 el-table 的 selection）

## API

### Importer Props

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| template-url | 模板下载地址（有值则显示模板下载） | `string` | - |
| template-file-name | 模板文件名（用于下载显示） | `string` | - |
| upload-action | 上传接口地址 | `string` | - |
| upload-params | 上传附带参数 | `Record<string, string \| Blob>` | - |
| accept | 接受文件类型 | `string` | `.xlsx,.xls` |
| max-size | 最大文件大小(MB) | `number` | `10` |
| button-text | 按钮文本 | `string` | `导入` |
| dialog-title | 弹窗标题 | `string` | `导入数据` |

### Importer Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| success | 上传成功回调 | `(response: any) => void` |
| error | 上传失败回调 | `(error: any) => void` |

### Importer Expose

| 方法名 | 说明 |
| --- | --- |
| open | 打开导入弹窗 |
| close | 关闭导入弹窗 |

### Exporter Props

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| export-action | 导出接口地址 | `string` | - |
| max-export-count | 最大导出数量限制 | `number` | `10000` |
| selected-rows | 选中行数据（用于选中导出） | `any[]` | `[]` |
| row-id-field | 选中行 ID 字段名 | `string` | `id` |
| get-search-params | 获取当前检索条件的函数 | `() => Record<string, any>` | - |
| total-count | 当前总数据量 | `number` | `0` |
| current-page | 当前页码 | `number` | `1` |
| page-size | 每页数量 | `number` | `10` |
| button-text | 按钮文本 | `string` | `导出` |
| dialog-title | 弹窗标题 | `string` | `导出数据` |
| extra-params | 导出参数额外补充 | `Record<string, any>` | `{}` |
| file-name-prefix | 导出文件名前缀 | `string` | `export` |

### Exporter Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| success | 导出成功回调 | `() => void` |
| error | 导出失败回调 | `(error: any) => void` |

### Exporter Expose

| 方法名 | 说明 |
| --- | --- |
| open | 打开导出弹窗 |
| close | 关闭导出弹窗 |
