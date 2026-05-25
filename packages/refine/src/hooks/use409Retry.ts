import { Unstructured } from 'k8s-api-provider';
import { cloneDeep, omit } from 'lodash-es';
import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from './useGlobalStore';

export type Retry409MetaOptions = {
  /** 编辑表单打开时捕获的初始版本；通常由本 hook 自动捕获，外部一般不需要手动传入。 */
  initialResource?: Unstructured;
  /** provider 判断无法安全重试时抛出的本地化错误文案。 */
  conflictMessage?: string;
};

type MutationMetaWith409Retry = Record<string, unknown> & {
  /** 传给 k8s-api-provider 的 409 恢复内部参数。 */
  resourceVersionConflictRetry?: Retry409MetaOptions;
};

type Use409RetryOptions = {
  /** 当前表单动作；只有 edit 动作会启用 409 重试，create 会自动移除重试 meta。 */
  action?: string;
  /** 当前表单使用的数据源名称，用于找到对应 GlobalStore 并还原 raw YAML。 */
  dataProviderName?: string;
  /** 当前编辑资源的 id；部分调用链 action 不稳定时，用 id 作为 edit 场景的兜底判断。 */
  id?: unknown;
  /** 调用方原本要传给 refine useFormCore 的 mutationMeta，本 hook 会保留其它字段并覆盖内部 409 重试参数。 */
  mutationMeta?: MutationMetaWith409Retry;
};

type Use409RetryResult = {
  /** queryResult 拿到资源后调用，用来捕获打开编辑表单时的初始版本。 */
  captureInitialResource: (resource?: Unstructured) => void;
  /** 已合并 409 重试参数的 mutationMeta，应直接传给 refine useFormCore。 */
  mutationMeta: Record<string, unknown>;
};

/**
 * 为 D2 编辑表单接入 Kubernetes PUT 409 自动恢复能力。
 *
 * 背景：Kubernetes PUT 保存要求用户保存版本里的 `metadata.resourceVersion`
 * 与服务端版本一致。如果用户编辑期间只有 status、managedFields 等运行时字段发生变化，
 * D2 可以把打开表单时的初始版本交给 k8s-api-provider，由 provider 拉取服务端版本、
 * 判断是否安全，并在安全时替换用户保存版本的 resourceVersion 后重试一次。
 *
 * 用法：FORM/YAML 表单在创建 refine useFormCore 前调用本 hook，把返回的 `mutationMeta`
 * 传给 useFormCore；queryResult 首次拿到资源后调用 `captureInitialResource(data)`。
 * D2 只负责捕获初始版本和传递本地化错误文案，比较、拉取服务端版本和重试都内聚在 provider。
 *
 * @param options - 409 重试接入配置。
 * @param options.action - 当前表单动作；只有 edit 动作会启用 409 重试。
 * @param options.dataProviderName - 当前表单使用的数据源名称，用于选择对应 GlobalStore。
 * @param options.id - 当前编辑资源的 id，用作 edit 场景的兜底判断。
 * @param options.mutationMeta - 调用方原本的 mutationMeta，本 hook 会保留其它字段并覆盖内部 409 重试参数。
 * @returns 用于捕获初始版本的方法，以及应传给 useFormCore 的 mutationMeta。
 */
export function use409Retry({
  action,
  dataProviderName,
  id,
  mutationMeta,
}: Use409RetryOptions): Use409RetryResult {
  const { t } = useTranslation();
  const globalStore = useGlobalStore(dataProviderName);
  const initialResourceRef = useRef<Unstructured>();
  const isEditAction = action === 'edit' || !!id;

  const captureInitialResource = useCallback((resource?: Unstructured) => {
    // 初始版本必须是打开编辑表单后第一次拿到的服务端原始资源；后续 live/query 刷新不能覆盖它。
    if (!isEditAction || initialResourceRef.current || !resource) {
      return;
    }

    const rawResource = globalStore?.restoreItem?.(resource);

    if (!rawResource) {
      return;
    }

    initialResourceRef.current = cloneDeep(rawResource);
  }, [globalStore, isEditAction]);

  const retryMutationMeta = useMemo(() => {
    const restMutationMeta = omit(mutationMeta, 'resourceVersionConflictRetry');

    if (!isEditAction) {
      return restMutationMeta;
    }

    return {
      ...restMutationMeta,
      resourceVersionConflictRetry: {
        // refine 的 mutationMeta 在 hook 创建时就会固定；用 getter 让 provider 在保存瞬间读取最新的初始版本。
        get initialResource() {
          return initialResourceRef.current;
        },
        conflictMessage: t('dovetail.resource_version_conflict'),
      },
    };
  }, [isEditAction, mutationMeta, t]);

  return {
    captureInitialResource,
    mutationMeta: retryMutationMeta,
  };
}
