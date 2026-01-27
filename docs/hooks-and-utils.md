# Hooks 与工具函数

## Hooks

所有 Hooks 位于 `packages/refine/src/hooks/`，通过 `hooks/index.ts` 导出。

### 数据层 Hooks

#### useGlobalStore(prefix?)
获取 K8s API GlobalStore 实例。
```typescript
const store = useGlobalStore('default');
// store.get('pods', { namespace, selector })
```

#### useSchema(options?)
获取当前资源的 OpenAPI JSON Schema。
- **参数**: `{ skip?: boolean }`
- **返回**: `{ schema, loading, error, fetchSchema }`
- 使用 `ConstantsContext` 中的 `schemaUrlPrefix` 拼接请求地址
- 内部使用 `K8sOpenAPI` 类缓存 Schema

#### useApiGroupSchema()
批量获取多个 API Group 的 Schema。
- **返回**: `{ schemas[], schemasMap, loading, error, fetchSchema }`

### 表格相关 Hooks

#### useEagleTable(options)
核心表格 Hook，整合 Refine 的 `useTable` 与 Eagle 表格组件。
- **功能**: 分页、排序、行选择、列渲染默认值
- **返回**: `{ tableProps, selectedKeys, ...useTableResult }`
- 内部处理列的 `display` 属性来控制列显示/隐藏

#### useTableData(data, options)
客户端表格数据管理（非 Refine 集成场景）。
- **功能**: 客户端分页、排序
- **返回**: 分页后的数据、当前页、页码/排序变更处理函数

#### useRefineFilters(options?)
组合命名空间和关键字过滤器为 Refine 兼容格式。
- **参数**: `{ disableNamespace?, disableKeyword? }`
- **返回**: `{ permanent: CrudFilters[] }`

#### useNamespaceRefineFilter()
仅命名空间过滤器。
- **返回**: `{ permanent: CrudFilters[] }`

### 表单相关 Hooks

#### useOpenForm(options)
打开表单弹窗或导航到表单页面。
- 根据 `formConfig.formContainerType` 决定是打开 Modal 还是跳转页面
- **参数**: `{ config, onSuccess?, customOptions? }`
- **返回**: `openForm(action, record?)` 函数

#### useSubmitForm(options)
表单提交管理。
- 解析 API 错误响应，提取字段级错误信息
- **返回**: `{ submitting, errorMsgs, reset, onSubmit }`

#### usePathMap(config)
表单数据路径映射工具。
- 用于 K8s YAML 结构与表单字段之间的双向转换
- **返回**: `{ transformInitValues, transformApplyValues }`

#### useEdit()
简单的编辑导航 Hook。
- **返回**: `edit(id)` 函数

### 弹窗 Hooks

#### useDeleteModal(options)
删除确认弹窗（含自动错误处理）。
- 删除失败时显示 reject dialog + 错误详情
- **返回**: 弹窗控制函数

#### useDeleteManyModal(options)
批量删除确认弹窗。

#### useDeleteModalOnly(options)
原始删除确认弹窗（无错误处理逻辑）。

#### useFailedModal()
失败信息展示弹窗。

### 其他 Hooks

#### useDownloadYAML(options)
下载资源的 YAML 文件。
- **参数**: `{ resource, item }`

#### useK8sYamlEditor()
Monaco 编辑器 K8s YAML 折叠工具。
- 自动折叠 `annotations`、`managedFields`、`status` 区域
- **返回**: `fold(editor)` 函数

---

## 工具函数

所有工具位于 `packages/refine/src/utils/`，通过 `utils/index.ts` 导出。

### Schema 处理

#### schema.ts
| 函数 | 说明 |
|------|------|
| `generateValueFromSchema(schema)` | 根据 JSON Schema 生成默认值 |
| `generateSchemaTypeValue(schema)` | 生成 Schema 类型值 |
| `resolveRef(schema, defs)` | 解析 `$ref` 引用，删除 metadata/status/description/x- 字段 |

#### schema-store.ts
Schema 缓存单例：`fetchSchemas()`、`fetchSchema()` 方法。

#### openapi.ts
`K8sOpenAPI` 类：按资源路径获取 OpenAPI Schema，缓存结果。
- `findSchema(kind, version)` — 按 Kind 和版本查找 Schema

#### yaml.ts
| 函数 | 说明 |
|------|------|
| `generateYamlBySchema(defaultValues, schema)` | 合并默认值和 Schema 类型值，生成带注释的 YAML |

### K8s 相关

#### k8s.ts
| 函数 | 说明 |
|------|------|
| `getApiVersion(basePath)` | 从 basePath 提取 API 版本 |
| `pruneBeforeEdit(yaml)` | 编辑前删除 id 字段 |

#### match-selector.ts
| 函数 | 说明 |
|------|------|
| `matchSelector(labels, selector)` | 匹配 K8s LabelSelector（支持 matchLabels + matchExpressions） |

matchExpressions 支持的操作符：`In`、`NotIn`、`Exists`、`DoesNotExist`。

#### getResourceNameByKind.ts
| 函数 | 说明 |
|------|------|
| `getResourceNameByKind(kind, configs)` | 根据 Kind 查找对应的资源名称（复数形式） |

### 校验

#### validation.ts
| 函数 | 说明 |
|------|------|
| RFC 1123 name 校验 | 小写字母数字 + 连字符，不超过 63 字符 |
| RFC 1035 name 校验 | 以字母开头，小写字母数字 + 连字符 |
| DNS subdomain 校验 | 不超过 253 字符 |
| Label key/value 校验 | K8s Label 格式 |
| Data key 校验 | ConfigMap/Secret key 格式 |
| Port 校验 | 1-65535 |
| NodePort 校验 | 30000-32767 |

### 字符串处理

#### string.ts
| 函数 | 说明 |
|------|------|
| `shortenedImage(image)` | 截断长镜像名和哈希 |
| `isFirstLetterEnglish(str)` | 首字母是否为英文 |
| `transformResourceKindInSentence(kind)` | 在句子中格式化资源 Kind |

### Label 处理

#### labels.ts
| 函数 | 说明 |
|------|------|
| `toLabelStrings(labels)` | `{ k: v }` → `["k/v", ...]` |
| `toLabelsArray(labels)` | `{ k: v }` → `[{ key, value }, ...]` |
| `toLabelsRecord(arr)` | `[{ key, value }, ...]` → `{ k: v }` |

### 时间

#### time.ts
| 函数 | 说明 |
|------|------|
| `getSecondsDiff(start, end)` | 计算时间差（秒） |
| `elapsedTime(seconds)` | 格式化为人类可读时长 |

### 存储

#### storage.ts
| 函数/类型 | 说明 |
|-----------|------|
| `StorageUnit` 枚举 | Pi, Ti, Gi, Mi, Ki 及 B 变体 |
| `transformStorageUnit(value, from, to)` | 存储单位转换 |

### 对象操作

#### object.ts
| 函数 | 说明 |
|------|------|
| `immutableSet(obj, path, value)` | 不可变深层设值 |

### 文件与下载

#### file.ts
| 函数 | 说明 |
|------|------|
| `readFileAsBase64(file)` | 读取文件为 Base64 或 UTF-8 文本 |

#### download.ts
| 函数 | 说明 |
|------|------|
| `download(content, filename)` | 触发浏览器下载 |

### Shell 工具

#### shell.ts
| 函数 | 说明 |
|------|------|
| `stdin(data)` | 构造 stdin 缓冲区 |
| `addParam(url, key, value)` | 添加 URL 参数 |
| `addParams(url, params)` | 批量添加 URL 参数 |
| Base64 编解码函数 | 标准 + URL-safe 变体 |

### 错误处理

#### error.ts
| 函数 | 说明 |
|------|------|
| `isNetworkError(error)` | 判断是否为网络错误 |
| `getSubmitError(error)` | 获取提交错误信息 |
| `getCommonErrors(response)` | 解析 API 响应提取字段级错误（支持 causes[] 和 graphQLErrors[]） |

### 表单工具

#### form.ts
| 函数 | 说明 |
|------|------|
| `getInitialValues(config)` | 从 ResourceConfig 获取表单初始值 |

### 其他

#### addId.ts
给数组元素添加 id 字段。

#### unit.ts
单位转换工具。
