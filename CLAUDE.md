# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Dovetail-v2 是一个 Kubernetes 管理面板，基于 Refine 框架构建，以 npm 库形式发布（`@dovetail-v2/refine`）。项目通过声明式 `ResourceConfig` 配置来管理 K8s 资源（Pod、Deployment、DaemonSet、Service 等），支持自动和自定义两种页面生成模式。

## 常用命令

```bash
# 安装依赖（使用 yarn，CI 中使用 --frozen-lockfile）
yarn install

# 开发模式（需要配置 API_HOST、REACT_APP_DEV_TOKEN 等环境变量用于代理）
yarn dev                          # 根目录 turbo 并行启动
cd packages/refine && yarn dev    # 直接启动 refine 包

# 构建（vite build + tsc 生成类型声明）
yarn build                        # 根目录 turbo 构建
cd packages/refine && yarn build  # 直接构建 refine 包

# Lint
yarn lint                                    # 根目录 lint 所有 ts/tsx
cd packages/refine && yarn lint              # 仅 lint refine/src

# 单元测试（Jest）
cd packages/refine && yarn unit-test         # 运行全部单元测试
cd packages/refine && npx jest path/to/file  # 运行单个测试文件
cd packages/refine && npx jest --testNamePattern="pattern"  # 按名称匹配

# E2E 测试（Playwright，仅 Chromium）
cd packages/refine && yarn playwright-test

# 全部测试
cd packages/refine && yarn test
```

## CI 流程

PR 合入 main 时运行：Lint → Jest → Vite Build（Node 20，Ubuntu）。发布通过 git tag（`v*`）触发 npm publish。

## 架构

### Monorepo 结构

Yarn Workspaces monorepo，核心代码在 `packages/refine/`。Turbo 用于编排构建任务。产物为双入口库：`src/index.ts`（主入口）和 `src/shell.ts`（终端相关）。

### 核心数据流

```
App.tsx（定义 ResourceConfig[] + GlobalStore）
  → Dovetail.tsx（Refine 包装器，注入 Context Providers）
    → Refine Core（dataProvider / liveProvider 来自 k8s-api-provider）
      → ResourceCRUD（非 isCustom 的资源自动生成 CRUD 页面）
      → 自定义路由（isCustom 的资源在 App.tsx 中手动声明 Route）
```

### ResourceConfig 驱动

每个 K8s 资源通过 `ResourceConfig`（`src/types/resource.ts`）声明配置：
- `name`/`kind`/`basePath`/`apiVersion`：K8s API 映射
- `isCustom: true`：标记该资源使用自定义页面组件（需在 App.tsx 中手动注册 Route），否则由 `ResourceCRUD` 自动生成
- `formConfig`：表单类型（FORM 或 YAML）、字段定义、值转换函数
- `columns`/`showConfig`：列表和详情页配置
- `initValue`：创建资源的初始值

### Context Providers 层级

`Dovetail.tsx` 中注入的 Context（外 → 内）：
1. `ConfigsContext` — 所有资源配置（keyBy name）
2. `ConstantsContext` — schemaUrlPrefix 等常量
3. `GlobalStoreContext` — K8s API 连接（GlobalStore 实例，负责 API 调用和 Watch）
4. `ConfigProvider`（Eagle）— Ant Design 4/5 弹出容器配置
5. `KitStoreProvider`（Eagle）— UI 组件状态

### Model 层（src/models/）

每个 K8s 资源类型对应一个 Model 类，继承链：`ResourceModel` → `WorkloadBaseModel` → `WorkloadModel` → 具体 Model。Model 负责从原始 K8s YAML 数据中提取展示字段（status、conditions、age 等）。

### Plugin 系统（src/plugins/）

`k8s-api-provider` 的插件机制：
- `model-plugin`：将 K8s API 原始数据转换为对应的 Model 实例
- `relation-plugin`：定义资源间关系（如 Deployment → ReplicaSet → Pod）

### 页面结构（src/pages/）

两种模式：
1. **配置型**：通过 `ResourceConfig` 中的 `columns`/`showConfig`/`formConfig` 自动生成（如 StatefulSet、Ingress、Job 等），配置函数接收 `i18n` 参数
2. **自定义型**（`isCustom: true`）：手动编写 List/Show/Form 组件（如 Pod、Deployment、DaemonSet、CronJob、Node）

### 样式方案

- Linaria（CSS-in-JS，零运行时，编译为 SCSS）
- SCSS 全局变量来自 `@cloudtower/eagle/dist/variables.scss`（通过 vite 自动注入）
- UI 组件基于 Ant Design 4.5.0 + CloudTower Eagle

## 关键技术约束

- **React 16.12.0**：通过 `resolutions` 锁定，不可升级（无 Hooks 以外的新 API）
- **React Router v5**：使用 `<Route>` + `<Router>` 模式，非 v6
- **Ant Design 4.5.0**：非 v5，API 有差异
- **路径别名**：`src/*` 映射到 `./src/*`（tsconfig + vite resolve alias）
- **ESLint 规则**：import 按字母序排列、单引号、分号必须、未使用变量用 `_` 前缀

## 国际化（i18n）

双语支持：`en-US` 和 `zh-CN`。翻译文件在 `src/locales/{lang}/dovetail.json`。使用 `i18next` + `react-i18next`，key 格式为 `dovetail.xxx`。`scripts/` 目录下有 i18n key 使用检查和中英文 key 对比脚本。

## 开发环境配置

Vite dev server 代理配置在 `vite.config.ts`：
- `/api` → `API_HOST` 环境变量（默认 `http://192.168.31.62`）
- `/exec-proxy` → Pod exec WebSocket 代理
- 需要设置 `REACT_APP_DEV_TOKEN` 和 `REACT_APP_DEV_COOKIE` 环境变量用于认证
