# Dovetail-v2 项目知识索引

本文档为 Dovetail-v2 项目的知识索引入口，帮助新人和 AI 快速理解项目的业务逻辑与代码结构。

> 所有源码位于 `packages/refine/src/`，本项目以 npm 库（`@dovetail-v2/refine`）形式发布，对外提供 Kubernetes 资源管理的 UI 组件、Hooks、Model 及工具函数。

## 目录结构总览

```
packages/refine/src/
├── Dovetail.tsx          # 核心包装组件，集成 Refine + Context Providers
├── index.ts              # 主入口，导出所有公共模块
├── shell.ts              # 终端相关入口（Shell 组件 + 工具函数）
├── i18n.ts               # i18next 初始化配置
├── styles.css            # 全局样式
│
├── components/           # UI 组件（约 70 个子目录）
├── models/               # K8s 资源 Model 类（数据映射 + 业务逻辑）
├── hooks/                # 自定义 React Hooks
├── utils/                # 工具函数
├── plugins/              # k8s-api-provider 插件（Model 转换 + 关系映射）
├── providers/            # Refine Router Provider
├── contexts/             # React Context 定义
├── types/                # TypeScript 类型定义
├── constants/            # 常量（K8s 初始值、状态枚举、权限枚举）
├── locales/              # 国际化翻译（en-US / zh-CN）
└── styles/               # Linaria CSS-in-JS 样式
```

## 文档索引

| 文档 | 内容 |
|------|------|
| [architecture.md](./architecture.md) | 整体架构、核心数据流、Context 层级、配置驱动模式 |
| [components.md](./components.md) | 组件分类索引、核心组件详解、组件关系图 |
| [models.md](./models.md) | Model 继承体系、各资源 Model 的字段与方法、状态映射 |
| [hooks-and-utils.md](./hooks-and-utils.md) | 所有 Hooks 的用途与参数、工具函数分类 |
| [plugins-and-providers.md](./plugins-and-providers.md) | 插件系统、Router Provider、Context、类型定义、常量、i18n |

## 核心概念速查

- **ResourceConfig**: 每个 K8s 资源的声明式配置（API 路径、表单、列表列、详情页），详见 [architecture.md](./architecture.md#resourceconfig-配置驱动)
- **Dovetail 组件**: 最外层包装器，注入所有 Context，详见 [architecture.md](./architecture.md#dovetailtsx-核心包装组件)
- **Model 层**: 将 K8s 原始 YAML 转换为带业务逻辑的类实例，详见 [models.md](./models.md)
- **表单系统**: 支持 YAML / 结构化表单双模式切换，详见 [components.md](./components.md#表单系统-form)
- **Plugin 系统**: model-plugin（类型转换）和 relation-plugin（关系发现），详见 [plugins-and-providers.md](./plugins-and-providers.md)
