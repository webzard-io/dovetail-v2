# Model 层

所有 Model 位于 `packages/refine/src/models/`。Model 层负责将 K8s API 返回的原始 YAML 数据转换为带有业务逻辑（状态计算、关系发现、展示字段）的类实例。

## 继承体系

```
ResourceModel<T>                     ← 所有 K8s 资源的基类
│
├── WorkloadBaseModel                ← 工作负载基类（提供 imageNames）
│   ├── PodModel                     ← Pod（资源用量、状态、IP、重启次数）
│   ├── JobModel                     ← Job（完成度、持续时间、状态）
│   ├── CronJobModel                 ← CronJob（暂停/恢复、调度状态）
│   └── WorkloadModel                ← 控制器工作负载基类（副本数、服务发现）
│       ├── DeploymentModel          ← Deployment（版本、暂停、ReplicaSet 管理）
│       ├── StatefulSetModel         ← StatefulSet（ControllerRevision 管理）
│       └── DaemonSetModel           ← DaemonSet（节点调度副本数）
│
├── ServiceModel                     ← Service（端口映射、类型判断、DNS 记录）
├── IngressModel                     ← Ingress（规则展开、完整 URL 拼接）
├── IngressClassModel                ← IngressClass（默认类判断）
├── NodeModel                        ← Node（角色、IP）
├── ReplicaSetModel                  ← ReplicaSet（Pod 列表、重启次数）
├── ControllerRevisionModel          ← ControllerRevision（版本号）
├── EventModel                       ← Event（ID 处理）
├── NetworkPolicyModel               ← NetworkPolicy
├── PersistentVolumeModel            ← PV（状态、CSI、关联 PVC）
├── PersistentVolumeClaimModel       ← PVC（状态、关联 PV、存储大小）
├── StorageClassModel                ← StorageClass（默认类、回收策略、关联 PV）
└── PodMetricsModel                  ← Pod 指标（CPU/内存使用量）
```

## ResourceModel（基类）

**文件**: `resource-model.ts`

所有 Model 的根基类。采用 Proxy 模式，将 K8s 原始 YAML 的所有属性透传为实例属性。

**核心字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 唯一标识 |
| `metadata` | `ObjectMeta` | K8s 元数据 |
| `apiVersion` | `string` | API 版本 |
| `kind` | `string` | 资源类型 |
| `_rawYaml` | `T` | 原始 K8s YAML 对象 |
| `_globalStore` | `GlobalStore` | K8s API 入口（non-enumerable） |

**核心方法**:
| 方法 | 说明 |
|------|------|
| `name` | getter → `metadata.name` |
| `namespace` | getter → `metadata.namespace`（默认 'default'） |
| `labels` | getter → `metadata.labels` |
| `annotations` | getter → `metadata.annotations` |
| `restore()` | 返回原始 YAML 对象 |
| `updateLabel(labels)` | 返回更新了 labels 的新 YAML |
| `updateAnnotation(annotations)` | 返回更新了 annotations 的新 YAML |
| `init()` | 异步初始化钩子（子类重写以获取关联数据） |

## WorkloadBaseModel

**文件**: `workload-base-model.ts`

工作负载公共基类，提取容器镜像信息。

**新增 getter**:
- `imageNames: string[]` — 从 `spec.template.spec.containers` 提取缩短后的镜像名（CronJob 从 `spec.jobTemplate` 路径提取）

## WorkloadModel

**文件**: `workload-model.ts`

控制器级工作负载基类（Deployment / StatefulSet / DaemonSet）。

**新增字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `restarts` | `number` | 所有 Pod 的总重启次数 |
| `services` | `ServiceModel[]` | 关联的 Service 列表 |
| `ingresses` | `IngressModel[]` | 关联的 Ingress 列表 |

**新增方法**:
| 方法 | 说明 |
|------|------|
| `init()` | 异步获取 restarts、services、ingresses |
| `replicas` | getter → `spec.replicas` |
| `readyReplicas` | getter → `status.readyReplicas` |
| `appKey` | getter → `${kind}-${name}-${namespace}` |
| `redeploy()` | 返回更新了重启时间戳注解的新 YAML |
| `scale(value)` | 返回更新了 `spec.replicas` 的新 YAML |

**关系发现逻辑**:
1. 通过 `_globalStore.get('pods', { selector })` 获取匹配 selector 的 Pod 列表，汇总 restarts
2. 通过 `_globalStore.get('services')` 获取所有 Service，用 `matchSelector()` 匹配
3. 通过 Service 反查 Ingress

## 各资源 Model 详解

### PodModel

**文件**: `pod-model.ts`

| 字段/方法 | 说明 |
|-----------|------|
| `request` | `ResourceQuantity` — CPU/内存请求量（所有容器求和） |
| `limit` | `ResourceQuantity` — CPU/内存限制量 |
| `restarts` | 所有容器的总重启次数 |
| `readyDisplay` | `"就绪容器数/总容器数"` |
| `stateDisplay` | `ResourceState`：TERMINATING（有 deletionTimestamp）/ RUNNING / PENDING / FAILED 等 |
| `ips` | Pod IP 数组（含 CNI 多网卡 IP） |
| `hasDnsConfig` | 是否配置了 DNS |
| `getBelongToDeployment()` | 通过 ownerReference 链追溯到所属 Deployment |

**ResourceQuantity 类型**:
```typescript
{ cpu: { si: string, value: number }, memory: { si: string, value: number } }
```

### DeploymentModel

**文件**: `deployment-model.ts`

| 字段/方法 | 说明 |
|-----------|------|
| `stateDisplay` | STOPPED（replicas=0）/ UPDATING（replicas≠readyReplicas）/ READY |
| `revision` | 当前部署版本号（从 annotation 读取） |
| `isPaused` | 是否暂停 |
| `getReplicaSets(rs[])` | 过滤属于该 Deployment 的 ReplicaSet |
| `getCurrentReplicaSet(rs[])` | 获取当前版本对应的 ReplicaSet |

### DaemonSetModel

**文件**: `daemonset-model.ts`

| 字段/方法 | 说明 |
|-----------|------|
| `stateDisplay` | UPDATING（desiredNumberScheduled≠numberReady）/ READY |
| `replicas` | → `status.desiredNumberScheduled`（非 spec.replicas） |
| `readyReplicas` | → `status.numberReady` |
| `getControllerRevisions()` | 过滤属于该 DaemonSet 的 ControllerRevision |

### StatefulSetModel

**文件**: `statefulset-model.ts`

| 字段/方法 | 说明 |
|-----------|------|
| `stateDisplay` | STOPPED / UPDATING / READY |
| `getControllerRevisions()` | 过滤属于该 StatefulSet 的 ControllerRevision |
| `getRevision()` | 计算最大版本号 |

### JobModel

**文件**: `job-model.ts`

| 字段/方法 | 说明 |
|-----------|------|
| `duration` | 运行时长（秒） |
| `completionsDisplay` | `"已完成/目标"` |
| `podCountDisplay` | `"已成功/总Pod数"` |
| `stateDisplay` | RUNNING / COMPLETED / ABNORMAL / SUSPENDED |

### CronJobModel

**文件**: `cronjob-model.ts`

| 字段/方法 | 说明 |
|-----------|------|
| `stateDisplay` | SUSPENDED / RUNNING |
| `suspend()` | 返回暂停后的 YAML |
| `resume()` | 返回恢复后的 YAML |
| `getJobsCountDisplay(jobs[])` | `"已完成/总Job数"` |

### ServiceModel

**文件**: `service-model.ts`

| 字段/方法 | 说明 |
|-----------|------|
| `ingresses` | 关联的 Ingress 列表 |
| `displayType` | 服务类型（ClusterIP / NodePort / LoadBalancer / ExternalName / **Headless**） |
| `dnsRecord` | `"name.namespace"` |
| `displayPortMapping` | 端口映射数组 `{ servicePort, nodePort, link, targetPort, protocol }` |

> Headless 判断：type 为 ClusterIP 且 clusterIP 为 null 或 'None'

### IngressModel

**文件**: `ingress-model.ts`

| 字段/方法 | 说明 |
|-----------|------|
| `getFlattenedRules(services?)` | 展开所有规则为 `RuleItem[]`（含完整 URL、协议、端口） |

`RuleItem` 结构：`{ serviceName, fullPath, pathType, host, servicePort }`

### NodeModel

**文件**: `node-model.ts`

| 字段/方法 | 说明 |
|-----------|------|
| `role` | Control Plane / Worker |
| `ip` | InternalIP |
| `nodeGroupName` | 节点组名称 |
| `isControlPlane` | 是否为控制面节点 |

### 存储相关 Model

**PersistentVolumeModel** (`persistent-volume.ts`):
- `phase` / `stateDisplay` — PV 状态（Pending / Available / Bound / Released / Failed）
- `csi` — CSI 驱动名
- `pvc` / `pvcNamespace` — 绑定的 PVC 信息
- `storageBytes` — 容量（字节）

**PersistentVolumeClaimModel** (`persistent-volume-claim.ts`):
- `phase` / `stateDisplay` — PVC 状态
- `pv` — 绑定的 PV 名称
- `storageBytes` — 请求容量
- `updateDistributeStorage(size)` — 更新存储大小

**StorageClassModel** (`storage-class.ts`):
- `pvs` — 使用该 StorageClass 的 PV 列表（init 时获取）
- `isDefaultSC` — 是否为默认 StorageClass
- `reclaimPolicy` — 回收策略

### 辅助 Model

- **ReplicaSetModel**: `pods` / `restarts` / `revision` / `ownerDeploymentName`
- **ControllerRevisionModel**: `revision`（版本号）
- **EventModel**: 自定义 `id` getter（优先使用 `metadata.uid`）
- **PodMetricsModel**: `usage: ResourceQuantity`（CPU/内存使用量）
- **IngressClassModel**: `isDefault` / `controller`
- **NetworkPolicyModel**: 无额外字段

## 状态枚举 ResourceState

定义在 `constants/state.ts`，所有 Model 的 `stateDisplay` 返回此枚举值：

```
READY, UPDATING, PENDING, RUNNING, FAILED, TERMINATING,
SUCCEEDED, COMPLETED, ABNORMAL, SUSPENDED, STOPPED,
BOUND, AVAILABLE, RELEASED, LOST, UNKNOWN
```

## 初始化模式

Model 实例创建后会调用 `init()` 方法进行异步初始化（通过 model-plugin 的 `processItem` 触发）：

1. **简单 Model**（Node、Event、PV）: `init()` 为空，仅暴露 K8s 数据
2. **关系 Model**（Deployment、Service）: `init()` 中通过 `_globalStore.get()` 获取关联资源
3. **聚合 Model**（WorkloadModel、Job）: `init()` 中聚合 Pod 数据计算 restarts
