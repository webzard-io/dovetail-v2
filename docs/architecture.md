# 架构与数据流

## 项目定位

Dovetail-v2 是一个 **Kubernetes 资源管理面板的 UI 库**，基于 [Refine](https://refine.dev/) 框架构建。它不是一个独立应用，而是以 npm 包的形式发布（`@dovetail-v2/refine`），供上层应用集成。

主入口 `src/index.ts` 导出所有公共模块；`src/shell.ts` 单独导出终端相关组件。

构建产物为双入口库：
- `dist/refine.js` (ESM) / `dist/refine.cjs` (CJS) — 主入口
- `dist/shell.js` / `dist/shell.cjs` — Shell 入口

## 核心数据流

```
上层应用
  │
  │  传入 ResourceConfig[] + GlobalStore
  ▼
Dovetail.tsx（核心包装组件）
  │
  │  注入 Context Providers → 初始化 Refine
  ▼
Refine Core
  │  dataProvider  ← k8s-api-provider（API 调用）
  │  liveProvider  ← k8s-api-provider（WebSocket Watch）
  │  routerProvider ← 自定义 Router Provider
  ▼
ProviderPlugins（数据处理管线）
  │  1. relation-plugin → 发现资源间关系
  │  2. model-plugin   → 原始 YAML → Model 实例
  ▼
UI 层
  ├── ResourceCRUD（自动生成 CRUD 页面）
  │     ├── ResourceList → ListPage → InternalBaseTable
  │     ├── ResourceShow → PageShow → ShowContent
  │     └── ResourceForm → RefineFormContainer
  │
  └── 自定义页面（isCustom: true 的资源）
        └── 上层应用自行注册路由和组件
```

## Dovetail.tsx 核心包装组件

这是整个库的核心入口组件，负责：
1. 包装 Refine 框架并注入数据/路由/通知 Provider
2. 建立 Context Provider 层级
3. 渲染自动生成的 CRUD 页面（ResourceCRUD）
4. 渲染上层应用传入的自定义子组件

**Props**:

| Prop | 类型 | 说明 |
|------|------|------|
| `resourcesConfig` | `ResourceConfig[]` | K8s 资源配置数组 |
| `schemaUrlPrefix` | `string` | OpenAPI Schema URL 前缀 |
| `Layout` | `React.FC` | 可选的布局组件 |
| `history` | `History` | React Router history 实例 |
| `globalStoreMap` | `Record<string, IGlobalStore>` | K8s API 连接实例 |
| `urlPrefix` | `string` | 路由前缀（默认 `''`） |
| `accessControlProvider` | Refine 类型 | 权限控制 |
| `antdGetPopupContainer` | `Function` | Ant Design 弹出层容器 |

## Context Provider 层级（外 → 内）

```
Router
  └── KitStoreProvider（Eagle UI 状态）
      └── ConfigsContext.Provider（资源配置 keyBy name）
          └── ConstantsContext.Provider（schemaUrlPrefix 等常量）
              └── ConfigProvider（Eagle/Antd 配置）
                  └── GlobalStoreContext.Provider（K8s API GlobalStore 实例）
                      └── Refine（核心框架）
                          └── {children}
```

**各 Context 职责**：
- **ConfigsContext** (`contexts/configs.ts`): `Record<string, ResourceConfig>`，按 name 索引的资源配置
- **ConstantsContext** (`contexts/constants.ts`): 存放 `schemaUrlPrefix` 等全局常量
- **GlobalStoreContext** (`contexts/global-store.ts`): `Record<string, IGlobalStore<WatchEvent>>`，K8s API 操作入口
- **ComponentContext** (`contexts/component.ts`): 可选，允许覆盖内部表格/Tab 组件

## ResourceConfig 配置驱动

每个 K8s 资源通过 `ResourceConfig`（`types/resource.ts`）声明式配置其 UI 行为：

```typescript
type ResourceConfig<Model> = {
  // === K8s API 映射 ===
  name: string;           // 复数资源名（如 'deployments'）
  kind: string;           // K8s Kind（如 'Deployment'）
  basePath: string;       // API 基础路径（如 '/apis/apps/v1'）
  apiVersion: string;     // API 版本（如 'apps/v1'）

  // === UI 控制 ===
  isCustom?: boolean;     // true: 不自动生成页面，由上层应用自行注册路由
  columns?: () => Column[];       // 列表页表格列定义
  showConfig?: () => ShowConfig;  // 详情页配置
  formConfig?: FormConfig;        // 表单配置（YAML/FORM 模式）
  initValue?: Record<string, unknown>; // 创建时的初始 YAML 值
  Dropdown?: React.FC<{record: Model}>; // 行操作下拉菜单

  // === 功能开关 ===
  hideEdit?: boolean;     // 隐藏编辑
  hideCreate?: boolean;   // 隐藏创建
  noShow?: boolean;       // 禁用详情页
  nonNsResource?: boolean; // 非命名空间资源
  hideListToolBar?: boolean; // 隐藏列表工具栏

  // === 其他 ===
  parent?: string;        // 资源分组（WORKLOAD/NETWORK/STORAGE 等）
  formatter?: (v: Model) => Model; // 数据格式化
  displayName?: string;   // 显示名称
};
```

### 两种页面模式

1. **配置型**（`isCustom` 为 false 或未设置）：Dovetail 根据 `columns`/`showConfig`/`formConfig` 自动生成 List、Show、Create/Edit 页面
2. **自定义型**（`isCustom: true`）：Dovetail 不生成任何页面，上层应用需要自行在 `<Dovetail>` 的 children 中注册 `<Route>` 和对应组件

### 表单配置

表单支持两种类型：

**FORM 模式**（结构化表单）：
```typescript
{
  formType: FormType.FORM,
  fields: ({ record, action, step }) => [...],  // 动态字段定义
  steps: [{ title: '基本信息' }, ...],          // 多步骤表单
  isDisabledChangeMode: boolean,                 // 禁止切换到 YAML
  transformInitValues: (v) => v,                 // 初始值转换
  transformApplyValues: (v) => v,                // 提交值转换
  formContainerType: FormContainerType.MODAL,    // MODAL 或 PAGE
}
```

**YAML 模式**：
```typescript
{
  formType: FormType.YAML,
  transformInitValues: (v) => v,
  transformApplyValues: (v) => v,
}
```

## GlobalStore 与 K8s API

`GlobalStore` 来自 `k8s-api-provider` 包，是与 K8s API 交互的核心：

```typescript
const globalStore = new GlobalStore({
  apiUrl: '/api/sks-proxy/api/v1/clusters/{clusterName}/proxy',
  watchWsApiUrl: 'api/sks-ws/...',
  prefix: 'default',
  plugins: ProviderPlugins,
}, ProviderPlugins);
```

- **dataProvider**: Refine 的数据层，封装了 K8s CRUD 操作（getList、getOne、create、update、delete）
- **liveProvider**: 基于 WebSocket 的实时 Watch，实现资源变更自动刷新
- **plugins**: 数据处理管线——原始 K8s 响应经过 relation-plugin 和 model-plugin 后变为带关系和类型的 Model 实例

## 通知系统

Dovetail 自定义了 Refine 的 `NotificationProvider`：
- 使用 Eagle 的 `useMessage()` 展示消息
- **过滤规则**：`getList`、`getOne`、`getMany` 操作的消息不展示（避免轮询产生大量通知）
- 消息持续时间：4.5 秒

## 技术栈约束

| 技术 | 版本 | 备注 |
|------|------|------|
| React | 16.12.0 | 通过 resolutions 锁定 |
| React Router | v5 | `<Route>` / `<Router>` 模式 |
| Ant Design | 4.5.0 | 非 v5 |
| Refine | 4.47.2 | 数据管理框架 |
| CloudTower Eagle | 0.34.24 | UI 组件库 |
| TypeScript | 5.0.0 | 严格模式 |
| Vite | 4.5.2 | 构建工具 |
| Linaria | 4.5.4 | CSS-in-JS（零运行时） |
