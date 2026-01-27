# 组件索引

所有组件位于 `packages/refine/src/components/`，通过 `components/index.ts` 统一导出。

## 组件关系总览

```
ResourceCRUD（路由调度）
  ├── list/  → ListPage → Table → InternalBaseTable
  ├── show/  → PageShow → ShowContent → ShowContentView
  └── create/ → RefineFormContainer
                  ├── RefineFormContent（FORM 模式）
                  └── YamlForm（YAML 模式）
                        └── YamlEditorComponent → MonacoYamlEditor

FormModal（模态表单入口）
  └── RefineFormContainer
        ├── RefineFormContent
        └── YamlFormContainer → YamlForm

PodShellModal（终端模态框）
  └── PodShell → Shell（xterm.js）

PodLog（日志查看器）
  └── @patternfly/react-log-viewer
```

## 组件分类

### 表单系统 (Form/)

表单系统是本项目最复杂的子系统，支持 YAML 和结构化表单两种模式的切换。

| 文件 | 职责 |
|------|------|
| `FormModal.tsx` | 模态框表单容器，支持多步骤向导、模式切换确认 |
| `RefineFormContainer.tsx` | 表单逻辑编排器，根据 `isYamlMode` 切换渲染 YamlForm 或 RefineFormContent |
| `RefineFormContent.tsx` | 结构化表单渲染，根据 `formConfig.fields()` 动态生成表单字段 |
| `YamlForm.tsx` | YAML 表单，集成 MonacoYamlEditor + JSON Schema 校验 |
| `YamlFormContainer.tsx` | YamlForm 的额外容器封装 |
| `RefineFormPage.tsx` | 页面级表单容器（非模态） |
| `useRefineForm.ts` | 核心 Hook，管理 react-hook-form 状态和 Refine 集成 |
| `useYamlForm.ts` | YAML 表单 Hook，Schema 加载与校验 |
| `useFieldsConfig.ts` | 字段配置解析 |
| `type.ts` | 类型定义：`RefineFormField`、`RefineFormSection`、`RefineFormValidator` |

**表单字段类型 `RefineFormField`**：
```typescript
{
  key: string;              // 字段唯一标识
  path: string[];           // 数据路径（如 ['metadata', 'name']）
  label: string;            // 标签文本
  render?: () => ReactNode; // 自定义渲染
  validators?: RefineFormValidator[]; // 校验函数数组
  condition?: (record, action) => boolean; // 条件显示
  disabledWhenEdit?: boolean; // 编辑时禁用
  type?: string;            // 字段类型
}
```

### 表单辅助组件

| 组件 | 职责 |
|------|------|
| `FormLayout/` | 通用表单布局（标题 + 分割线 + 内容 + 保存按钮） |
| `FormErrorAlert/` | 表单错误信息展示 |
| `FormWidgets/` | 表单控件集合 |
| `FormWidgets/NameInputWidget` | 资源名称输入框（含校验） |
| `FormWidgets/NamespaceSelectWidget` | 命名空间选择器 |
| `FormWidgets/KeyValueListWidget` | 键值对列表编辑器 |
| `FormWidgets/MetadataForm` | Labels/Annotations 编辑表单 |
| `EditMetadataForm/` | 编辑 Label/Annotation/Taint 的专用表单 |
| `KeyValueTableForm/` | 表格式键值对表单 |
| `PortsConfigForm/` | Service 端口配置表单 |
| `MatchLabelSelector/` | K8s Label Selector 编辑器 |

### 表格系统

| 组件 | 职责 |
|------|------|
| `InternalBaseTable/` | 底层表格，封装 Eagle Table，处理分页/排序/选择/空状态/错误状态 |
| `Table/` | 高层表格，封装 ResourceTable，提供空状态和错误展示 |
| `ResourceTable/` | Refine 集成表格，连接 `useTable` + `useEagleTable` Hook |
| `ListPage/` | 列表页布局容器，包含 TableToolBar + 命名空间过滤 + 表格 |
| `TableToolbar/` | 表格工具栏（标题/描述 + 操作按钮区域） |

**InternalBaseTable Props（核心）**：
```typescript
{
  tableKey: string;         // 唯一标识
  columns: Column[];        // 列定义
  data: T[];               // 数据源（必须有 id 字段）
  loading?: boolean;
  error?: string;
  currentPage?: number;
  defaultSize?: number;
  total?: number;
  onPageChange: (page) => void;
  onSorterChange: (sorters) => void;
  RowMenu?: React.FC;      // 行操作菜单
  onActive?: (keys) => void;  // 行点击
  onSelect?: (keys) => void;  // 行选择
  customFilterBar?: ReactNode; // 自定义过滤栏
  nonNsResource?: boolean;
}
```

### 详情页系统 (ShowContent/)

| 文件 | 职责 |
|------|------|
| `ShowContent.tsx` | 入口组件，从路由提取 `id` |
| `ShowContentView.tsx` | 主渲染器（最大的组件 ~13KB），处理顶栏/Tab/分组/字段渲染 |
| `fields.tsx` | 字段定义系统——多种展示方式（文本、标签、链接、自定义渲染） |
| `groups.tsx` | 字段分组定义 |
| `tabs.tsx` | Tab 配置定义 |
| `PageShow/` | 详情页容器，处理加载状态和资源不存在的错误 |
| `DrawerShow/` | 抽屉式详情（右侧 50% 宽度的 Drawer） |

**ShowConfig 结构**：
```typescript
{
  tabs?: TabConfig[];      // Tab 页签配置
  groups?: GroupConfig[];  // 字段分组
  fields?: FieldConfig[];  // 扁平字段列表
}
```

### CRUD 路由 (ResourceCRUD/)

| 文件 | 职责 |
|------|------|
| `ResourceCRUD.tsx` | 路由分发器，为非 `isCustom` 的资源自动生成 List/Show/Create/Edit 路由 |
| `list/index.tsx` | 列表页组件 |
| `show/index.tsx` | 详情页组件 |
| `create/index.tsx` | 创建/编辑表单组件 |

### 终端与日志

| 组件 | 职责 |
|------|------|
| `Shell/` | xterm.js WebSocket 终端，支持搜索、复制、重连、WebGL/Canvas 渲染切换 |
| `Shell/ShellToolbar.tsx` | 终端工具栏（自定义操作按钮） |
| `Shell/common.ts` | 终端通用工具函数 |
| `PodShellModal/` | Pod 终端模态框（ImmersiveDialog + 懒加载 PodShell） |
| `PodShellModal/PodShell.tsx` | Pod 终端逻辑（构建 exec WebSocket URL） |
| `PodLog/` | Pod 日志查看器，支持实时/历史日志、容器切换、暂停/自动换行 |

**Shell 暴露的 ref 方法**（`ShellHandler`）：
- `connect()` — 建立 WebSocket
- `send(data, callback)` — 发送数据（支持排队）
- `clear()` — 清屏
- `fit()` — 自适应容器大小
- `searchNext(keyword)` / `searchPrevious(keyword)` — 搜索
- `writeln(data)` — 写入一行
- `setLoading(bool)` / `setError(bool)` — 状态设置

### YAML 编辑器 (YamlEditor/)

| 文件 | 职责 |
|------|------|
| `YamlEditorComponent.tsx` | 主组件，支持折叠/展开、复制、重置、Diff 模式切换 |
| `MonacoYamlEditor.tsx` | Monaco Editor 封装，YAML 语法 + JSON Schema 校验 |
| `MonacoYamlDiffEditor.tsx` | Monaco Diff Editor 封装 |
| `style.ts` | 编辑器样式 |

### 操作按钮

| 组件 | 职责 |
|------|------|
| `CreateButton/` | 创建按钮，调用 `useOpenForm()` |
| `EditButton/` | 编辑按钮，调用 `useEdit()` |
| `DeleteButton/` | 删除按钮，打开删除确认弹窗 |
| `DeleteManyButton/` | 批量删除按钮 |

### 下拉操作菜单 (Dropdowns/)

| 组件 | 职责 |
|------|------|
| `K8sDropdown/` | 通用 K8s 资源操作菜单（编辑 YAML、编辑 Label/Annotation、删除等） |
| `WorkloadDropdown/` | 工作负载操作菜单（含重新部署、扩缩容） |
| `PodDropdown/` | Pod 操作菜单（含终端、日志） |
| `CronJobDropdown/` | CronJob 操作菜单（含暂停/恢复） |
| `ReplicasDropdown/` | 扩缩容操作菜单 |

### 下拉菜单项 (DropdownMenuItems/)

| 组件 | 职责 |
|------|------|
| `EditLabelDropdownMenuItem` | 编辑 Label 菜单项 |
| `EditAnnotationDropdownMenuItem` | 编辑 Annotation 菜单项 |
| `EditNodeTaintDropdownMenuItem` | 编辑节点 Taint 菜单项 |

### 数据展示组件

| 组件 | 职责 |
|------|------|
| `ValueDisplay/` | 值展示（处理空值、溢出截断 + Tooltip） |
| `KeyValue/` | 键值对展示（含 KeyValueAnnotation 和 KeyValueSecret 变体） |
| `StateTag/` | 资源状态标签（根据 ResourceState 显示不同颜色/图标） |
| `Tags/` | 标签列表展示 |
| `TextTags/` | 文本标签 |
| `Time/` | 时间展示 |
| `DurationTime/` | 时长展示 |
| `ImageNames/` | 容器镜像名展示 |
| `ResourceLink/` | 资源链接（点击跳转到详情页） |
| `LinkFallback/` | 带 fallback 的链接（资源不存在时显示纯文本） |
| `ReferenceLink/` | 引用资源链接 |
| `ResourceUsageBar/` | 资源使用率进度条 |
| `SectionTitle/` | 分区标题 |
| `Separator/` | 分隔线 |
| `ErrorContent/` | 错误内容展示（支持 List/Card/Widget/Item 类型） |

### K8s 资源专用组件

| 组件 | 职责 |
|------|------|
| `ConditionsTable/` | K8s Conditions 表格展示 |
| `EventsTable/` | K8s Events 表格展示 |
| `WorkloadPodsTable/` | 工作负载下的 Pod 列表表格 |
| `PodContainersTable/` | Pod 容器列表表格 |
| `CronjobJobsTable/` | CronJob 下的 Job 列表表格 |
| `PortsTable/` | Service 端口表格 |
| `IngressRulesTable/` | Ingress 规则表格 |
| `IngressRulesComponent/` | Ingress 规则展示组件 |
| `NetworkPolicyRulesViewer/` | NetworkPolicy 规则展示 |
| `NodeTaintsTable/` | 节点 Taint 表格 |
| `PodSelectorTable/` | Pod Selector 表格 |
| `ServiceComponents/` | Service 相关展示组件（集群内/外访问方式等） |
| `LabelsAndAnnotationsShow/` | Label 和 Annotation 展示 |
| `WorkloadReplicas/` | 工作负载副本数展示 |
| `PVCDistributeStorage/` | PVC 存储分配组件 |
| `ResourceFiledDisplays.tsx` | 通用资源字段展示（age、namespace 等常用字段） |

### 布局与导航

| 组件 | 职责 |
|------|------|
| `Layout/` | 应用主布局（Header + 可折叠侧边栏 + 内容区） |
| `Menu/` | 侧边栏菜单 |
| `Breadcrumb/` | 面包屑导航 |
| `Tabs/` | Tab 页签封装（Eagle Tabs） |
| `NamespacesFilter/` | 命名空间过滤选择器 |
| `ResourceSelect/` | 通用资源选择器（Select 下拉框） |
