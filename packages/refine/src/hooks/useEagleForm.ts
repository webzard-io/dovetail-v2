import React from "react";
import { FormInstance, FormProps } from "antd/lib/form";
import { useUIKit } from '@cloudtower/eagle';
import { useForm as useFormSF } from "sunflower-antd";
import { ButtonProps } from "antd/lib/button";

import {
  HttpError,
  BaseRecord,
  useForm as useFormCore,
  UseFormReturnType as UseFormReturnTypeCore,
  useWarnAboutChange,
  UseFormProps as UseFormPropsCore,
  CreateResponse,
  UpdateResponse,
  pickNotDeprecated,
} from "@refinedev/core";

export type UseFormProps<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
> = UseFormPropsCore<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
> & {
  submitOnEnter?: boolean;
  /**
   * Shows notification when unsaved changes exist
   */
  warnWhenUnsavedChanges?: boolean;
};

export type UseFormReturnType<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
> = UseFormReturnTypeCore<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
> & {
  form: FormInstance;
  formProps: FormProps;
  saveButtonProps: ButtonProps & {
    onClick: () => void;
  };
  onFinish: (
    values?: TVariables,
  ) => Promise<CreateResponse<TResponse> | UpdateResponse<TResponse> | void>;
};

const useEagleForm = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables extends  { [prop: string]: unknown } = { [prop: string]: unknown },
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
>({
  action,
  resource,
  onMutationSuccess: onMutationSuccessProp,
  onMutationError,
  submitOnEnter = false,
  warnWhenUnsavedChanges: warnWhenUnsavedChangesProp,
  redirect,
  successNotification,
  errorNotification,
  meta,
  metaData,
  queryMeta,
  mutationMeta,
  liveMode,
  liveParams,
  mutationMode,
  dataProviderName,
  onLiveEvent,
  invalidates,
  undoableTimeout,
  queryOptions,
  createMutationOptions,
  updateMutationOptions,
  id: idFromProps,
  overtimeOptions,
}: UseFormProps<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
> = {}): UseFormReturnType<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
> => {
  const kit = useUIKit();
  const [formAnt] = kit.form.useForm();
  const formSF = useFormSF({
    form: formAnt,
  });
  const { form } = formSF;

  const useFormCoreResult = useFormCore<
    TQueryFnData,
    TError,
    TVariables,
    TData,
    TResponse,
    TResponseError
  >({
    onMutationSuccess: onMutationSuccessProp
      ? onMutationSuccessProp
      : undefined,
    onMutationError,
    redirect,
    action,
    resource,
    successNotification,
    errorNotification,
    meta: pickNotDeprecated(meta, metaData),
    metaData: pickNotDeprecated(meta, metaData),
    queryMeta,
    mutationMeta,
    liveMode,
    liveParams,
    mutationMode,
    dataProviderName,
    onLiveEvent,
    invalidates,
    undoableTimeout,
    queryOptions,
    createMutationOptions,
    updateMutationOptions,
    id: idFromProps,
    overtimeOptions,
  });

  const { formLoading, onFinish, queryResult, id } = useFormCoreResult;

  const {
    warnWhenUnsavedChanges: warnWhenUnsavedChangesRefine,
    setWarnWhen,
  } = useWarnAboutChange();
  const warnWhenUnsavedChanges =
    warnWhenUnsavedChangesProp ?? warnWhenUnsavedChangesRefine;

  React.useEffect(() => {
    form.resetFields();
  }, [queryResult?.data?.data, id]);

  const onKeyUp = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (submitOnEnter && event.key === "Enter") {
      form.submit();
    }
  };

  const onValuesChange = (changeValues: object) => {
    if (changeValues && warnWhenUnsavedChanges) {
      setWarnWhen(true);
    }
    return changeValues;
  };

  const saveButtonProps = {
    disabled: formLoading,
    onClick: () => {
      form.submit();
    },
  };

  return {
    form: formSF.form,
    formProps: {
      ...formSF.formProps,
      onFinish: (values: TVariables) =>
        onFinish(values).catch((error) => error),
      onKeyUp,
      onValuesChange,
      initialValues: queryResult?.data?.data,
    },
    saveButtonProps,
    ...useFormCoreResult,
    onFinish: async (values?: TVariables) => {
      return await onFinish(values ?? formSF.form.getFieldsValue(true));
    },
  };
};

export default useEagleForm;
