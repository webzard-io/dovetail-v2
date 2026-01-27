# 插件、Provider 与其他模块

## 插件系统 (plugins/)

插件是 `k8s-api-provider` 的扩展机制，在数据从 K8s API 到达 UI 组件之前进行处理。两个插件按顺序组成数据管线：

```
K8s API 响应 → relation-plugin → model-plugin → UI 组件
```

通过 `plugins/index.ts` 导出为 `ProviderPlugins` 数组。

### model-plugin（模型转换插件）

**文件**: `plugins/model-plugin.ts`

将 K8s API 返回的原始 `Unstructured` 对象转换为对应的 Model 类实例。

**核心逻辑**:
- 维护 `Kind → ModelClass` 的映射表
- `processItem(item)`: 根据 `item.kind` 创建对应的 Model 实例并调用 `init()`
- `processData(list)`: 批量处理列表
- `restoreItem(model)`: 调用 `model.restore()` 还原为原始 YAML
- `setModelMap(map)`: 允许上层应用注册自定义 Model

**已注册的 Kind 映射**:
```
Deployment → DeploymentModel
DaemonSet → DaemonSetModel
StatefulSet → StatefulSetModel
CronJob → CronJobModel
Job → JobModel
Pod → PodModel
Event → EventModel
Ingress → IngressModel
NetworkPolicy → NetworkPolicyModel
Service → ServiceModel
Node → NodeModel
StorageClass → StorageClassModel
PersistentVolume → PersistentVolumeModel
PersistentVolumeClaim → PersistentVolumeClaimModel
ReplicaSet → ReplicaSetModel
ControllerRevision → ControllerRevisionModel
IngressClass → IngressClassModel
```

### relation-plugin（关系发现插件）

**文件**: `plugins/relation-plugin.ts`

发现 K8s 资源之间的关系，并将关系元数据附加到数据项上。

**关系类型**:
```typescript
type Relation = {
  type: 'creates' | 'uses' | 'applies' | 'owner' | 'selects';
  resource: string;     // 目标资源名
  kind: string;         // 目标 Kind
  selector?: LabelSelector;
}
```

**处理逻辑**:
- `processPodSelector(item)`: 从工作负载的 spec.selector 提取 label selector，生成 selects 关系
- 支持的工作负载类型：Deployment、StatefulSet、DaemonSet、Job、CronJob、ReplicaSet、Service

### 插件类型定义

**文件**: `plugins/type.ts`

定义插件的 TypeScript 类型接口。

---

## Router Provider (providers/)

**文件**: `providers/router-provider/index.tsx`

为 Refine 框架提供 React Router v5 的路由绑定。

**实现的方法**:
| 方法 | 说明 |
|------|------|
| `go()` | 路由跳转，支持 query/hash 参数，keepQuery/keepHash 选项 |
| `back()` | 返回上一页 |
| `parse()` | 解析当前路由，提取 resource、action（list/show/create/edit）、id、query 参数 |
| `Link` | 封装 React Router 的 `<Link>` 组件 |

**特殊处理**:
- 对 `to` 参数进行自定义编码
- 分页相关的 query 参数自动转为数字类型

---

## Context (contexts/)

| 文件 | Context | 类型 | 用途 |
|------|---------|------|------|
| `configs.ts` | ConfigsContext | `Record<string, ResourceConfig>` | 资源配置（按 name 索引） |
| `constants.ts` | ConstantsContext | `{ schemaUrlPrefix: string }` | 全局常量 |
| `global-store.ts` | GlobalStoreContext | `Record<string, IGlobalStore>` | K8s API 操作入口 |
| `component.ts` | ComponentContext | 自定义组件覆盖 | 允许替换内部 Table/Tabs 组件 |

---

## 类型定义 (types/)

### resource.ts

核心类型文件，定义了：

**枚举**:
- `RESOURCE_GROUP`: WORKLOAD, STORAGE, NETWORK, CLUSTER, SERVICE, SERVICE_AND_NETWORK, CONFIG, NODE_MANAGEMENT, PROJECT
- `FormContainerType`: PAGE, MODAL
- `FormType`: YAML, FORM
- `FormMode`: FORM, YAML

**核心类型**:
- `ResourceConfig<Model>` — 完整资源配置（详见 [architecture.md](./architecture.md#resourceconfig-配置驱动)）
- `RefineFormConfig<Model>` — 结构化表单配置
- `YamlFormConfig` — YAML 表单配置
- `CommonFormConfig<Model>` — 表单公共配置（值转换、容器类型、错误格式化等）
- `ErrorBody` — K8s API 错误响应体

### globalStore.ts

`IGlobalStore<TWatchEvent>` 接口：
| 方法 | 说明 |
|------|------|
| `get(resource, options)` | 获取资源列表 |
| `subscribe(resource, callback)` | 订阅资源变更 |
| `publish(event)` | 发布事件 |
| `init()` | 初始化 |
| `loadPlugins(plugins)` | 加载插件 |
| `restoreItem(item)` / `restoreData(data)` | 还原为原始数据 |
| `destroy()` | 销毁实例 |
| `cancelQueries(key)` | 取消查询 |

### 声明文件

- `modal.d.ts` — 模态框类型
- `window.d.ts` — Window 扩展类型

---

## 常量 (constants/)

### k8s.ts — K8s 资源初始值

为每种 K8s 资源提供创建时的默认 YAML 模板：

| 常量 | 资源类型 |
|------|---------|
| `DEPLOYMENT_INIT_VALUE` | Deployment |
| `DAEMONSET_INIT_VALUE` | DaemonSet |
| `STATEFULSET_INIT_VALUE` | StatefulSet |
| `CRONJOB_INIT_VALUE` | CronJob |
| `JOB_INIT_VALUE` | Job |
| `POD_INIT_VALUE` | Pod |
| `NODE_INIT_VALUE` | Node |
| `SERVER_INSTANCE_INIT_VALUE` | ServerInstance（自定义 CRD） |
| `SERVICE_*_INIT_VALUE` | Service（5 种类型：ClusterIP/NodePort/LB/ExternalName/Headless） |
| `INGRESS_INIT_VALUE` | Ingress |
| `NETWORK_POLICY_INIT_VALUE` | NetworkPolicy |
| `PV_INIT_VALUE` | PersistentVolume |
| `PVC_INIT_VALUE` | PersistentVolumeClaim |
| `STORAGE_CLASS_INIT_VALUE` | StorageClass |
| `CONFIG_MAP_INIT_VALUE` | ConfigMap |
| `SECRET_*_INIT_VALUE` | Secret（6 种类型：Opaque/TLS/BasicAuth/SSH/DockerConfig/DockerConfigJson） |

还有 `REDEPLOY_TIMESTAMP_KEY` = `'kubectl.kubernetes.io/restartedAt'`。

### state.ts — ResourceState 枚举

```
READY, UPDATING, PENDING, RUNNING, FAILED, TERMINATING,
SUCCEEDED, COMPLETED, ABNORMAL, SUSPENDED, STOPPED,
BOUND, AVAILABLE, RELEASED, LOST, UNKNOWN
```

### auth.ts — AccessControlAuth 枚举

```
Read, Write, Edit, Delete, Create, None
```

---

## 国际化 (locales/)

### 配置

**文件**: `i18n.ts`

```typescript
- 默认语言: 'zh-CN'
- 备用语言: ['en-US', 'zh-CN']
- 命名空间: 'dovetail'
- dayjs 本地化同步切换
```

### 翻译文件结构

```
locales/
  ├── en-US/dovetail.json    # 英文翻译（150+ 条目）
  └── zh-CN/dovetail.json    # 中文翻译（150+ 条目）
```

**Key 格式**: `dovetail.xxx`，如 `dovetail.name`、`dovetail.delete_tip`、`dovetail.create_resource`。

**翻译分类**:
- 通用操作：copy、delete、create、edit、save、cancel
- 资源状态：ready、running、pending、failed、updating
- K8s 概念：namespace、pod、deployment、service、ingress、label、annotation
- 表单：create_resource、edit_resource、save_failed
- 提示：delete_tip、confirm_delete_text
- 端口访问：in_cluster_access、out_cluster_access、port_mapping

---

## 样式 (styles/)

使用 Linaria（CSS-in-JS，零运行时）编写，编译时提取为 CSS。

| 文件 | 内容 |
|------|------|
| `button.ts` | `WarningButtonStyle`（黄色主题）、`CloseButtonStyle`（圆角边框） |
| `modal.ts` | `FullscreenModalStyle`（全屏模态）、`SmallModalStyle`（492px 宽度） |
| `show.ts` | 详情页相关样式 |
| `tag.ts` | 标签相关样式 |

SCSS 全局变量自动注入自 `@cloudtower/eagle/dist/variables.scss`（在 vite.config.ts 中配置）。
