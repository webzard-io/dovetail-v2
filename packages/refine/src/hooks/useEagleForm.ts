import { useUIKit } from '@cloudtower/eagle';
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
  useResource,
} from '@refinedev/core';
import { ButtonProps } from 'antd/lib/button';
import { FormInstance, FormProps } from 'antd/lib/form';
import yaml from 'js-yaml';
import { JSONSchema7 } from 'json-schema';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type YamlEditorHandle } from 'src/components/YamlEditor';
import { useSchema } from 'src/hooks/useSchema';
import { pruneBeforeEdit } from 'src/utils/k8s';
import { generateYamlBySchema } from 'src/utils/yaml';
import { useForm as useFormSF } from 'sunflower-antd';

export type UseFormProps<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables extends object = object,
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
  editorOptions?: {
    isGenerateAnnotations?: boolean;
  };
};

export type UseFormReturnType<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables extends object = object,
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
  editorProps: {
    ref: React.RefObject<YamlEditorHandle>;
    defaultValue: string;
    schema: JSONSchema7 | null;
    id: string;
  };
  enableEditor: boolean;
  errorResponseBody?: Record<string, unknown> | null;
  switchEditor: () => void;
  onFinish: (
    values?: TVariables
  ) => Promise<CreateResponse<TResponse> | UpdateResponse<TResponse> | void>;
};

const useEagleForm = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables extends { [prop: string]: unknown } = { [prop: string]: unknown },
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
  editorOptions,
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
  const editor = useRef<YamlEditorHandle>(null);
  const { t } = useTranslation();
  const [enableEditor, setEnableEditor] = useState(false);
  const [isYamlValid, setIsYamlValid] = useState(true);
  const [isSchemaValid, setIsSchemaValid] = useState(true);
  const [editorErrors, setEditorErrors] = useState<string[]>([]);
  const [errorResponseBody, setErrorResponseBody] = useState<Record<
    string,
    unknown
  > | null>(null);
  const useResourceResult = useResource();
  const kit = useUIKit();
  const schema = useSchema();
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
    onMutationSuccess: onMutationSuccessProp ? onMutationSuccessProp : undefined,
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

  const { warnWhenUnsavedChanges: warnWhenUnsavedChangesRefine, setWarnWhen } =
    useWarnAboutChange();
  const warnWhenUnsavedChanges =
    warnWhenUnsavedChangesProp ?? warnWhenUnsavedChangesRefine;

  React.useEffect(() => {
    form.resetFields();

    if (editor.current) {
      const editorValue = yaml.dump(form.getFieldsValue(true));

      editor.current.setEditorValue(editorValue);
      editor.current.setValue(editorValue);
      // editor.current.foldSymbol('annotations:');
      // editor.current.foldSymbol('managedFields:');
      // editor.current.foldSymbol('status:');
      // editor.current.foldSymbol('kubectl.kubernetes.io/last-applied-configuration:');
    }
  }, [queryResult?.data?.data, id, form]);

  React.useEffect(() => {
    const response = useFormCoreResult.mutationResult.error?.response;

    if (response && !response?.bodyUsed) {
      response.json?.().then((body: Record<string, unknown>) => {
        setErrorResponseBody(body);
      });
    }
  }, [useFormCoreResult.mutationResult]);

  const onKeyUp = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (submitOnEnter && event.key === 'Enter') {
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

  const editorProps = {
    ref: editor,
    defaultValue:
      schema && editorOptions?.isGenerateAnnotations
        ? generateYamlBySchema(form?.getFieldsValue(true) || {}, schema)
        : yaml.dump(form.getFieldsValue(true)),
    schema,
    id: useResourceResult.resource?.name || '',
    errorMsgs: editorErrors,
    onValidate(yamlValid: boolean, schemaValid: boolean) {
      setIsYamlValid(yamlValid);
      setIsSchemaValid(schemaValid);

      if (yamlValid && schemaValid) {
        setEditorErrors([]);
      }
    },
  };

  const initialValues = queryResult?.data?.data
    ? {
        ...queryResult?.data?.data,
      }
    : undefined;

  if (initialValues) {
    pruneBeforeEdit(initialValues);
  }

  return {
    form: formSF.form,
    formProps: {
      ...formSF.formProps,
      onFinish: values => {
        const errors = [
          !isYamlValid && t('dovetail.yaml_format_wrong'),
          !isSchemaValid && t('dovetail.yaml_value_wrong'),
        ].filter(error => !!error);

        if (errors.length) {
          setEditorErrors(errors);
          return;
        }

        const finalValues = editor.current
          ? (yaml.load(editor.current?.getEditorValue() || '') as TVariables)
          : values;

        return onFinish(finalValues as TVariables).catch(error => error);
      },
      onKeyUp,
      onValuesChange,
      initialValues,
    },
    saveButtonProps,
    ...useFormCoreResult,
    editorProps,
    enableEditor,
    errorResponseBody,
    switchEditor() {
      if (enableEditor && editor.current?.getEditorValue()) {
        const value = yaml.load(editor.current?.getEditorValue()) as Record<
          string,
          unknown
        >;

        form?.setFieldsValue(value);
      }

      setEnableEditor(!enableEditor);
    },
    onFinish: async (values?: TVariables) => {
      const finalValues = enableEditor
        ? yaml.load(editor.current?.getEditorValue() || '')
        : values ?? formSF.form.getFieldsValue(true);

      return await onFinish(finalValues);
    },
  };
};

export default useEagleForm;
