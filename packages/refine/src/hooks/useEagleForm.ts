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
import { Unstructured } from 'k8s-api-provider';
import React, { useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type YamlEditorHandle, type YamlEditorProps } from 'src/components/YamlEditor';
import useK8sYamlEditor from 'src/hooks/useK8sYamlEditor';
import { useSchema } from 'src/hooks/useSchema';
import { pruneBeforeEdit } from 'src/utils/k8s';
import { generateYamlBySchema } from 'src/utils/yaml';
import { useForm as useFormSF } from 'sunflower-antd';
import { useGlobalStore } from './useGlobalStore';

type EditorProps = Omit<YamlEditorProps, 'schema'> & {
  ref: React.RefObject<YamlEditorHandle>;
  schema: JSONSchema7 | null;
};

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
    isSkipSchema?: boolean;
  };
  initialValuesForCreate?: Record<string, unknown>;
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
  editorProps: EditorProps;
  schema: JSONSchema7 | null;
  isLoadingSchema: boolean;
  loadSchemaError: Error | null;
  fetchSchema: () => void;
  enableEditor: boolean;
  errorResponseBody?: Record<string, unknown> | null;
  switchEditor: () => void;
  onFinish: (
    values?: TVariables
  ) => Promise<CreateResponse<TResponse> | UpdateResponse<TResponse> | void>;
};

const useEagleForm = <
  TQueryFnData extends Unstructured = Unstructured & { id: string },
  TError extends HttpError = HttpError,
  TVariables extends { [prop: string]: unknown } = { [prop: string]: unknown },
  TData extends Unstructured = TQueryFnData,
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
  initialValuesForCreate,
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
  const { globalStore } = useGlobalStore();
  const kit = useUIKit();
  const {
    schema,
    loading: isLoadingSchema,
    error: loadSchemaError,
    fetchSchema,
  } = useSchema({
    skip: editorOptions?.isSkipSchema,
  });
  const [formAnt] = kit.form.useForm();
  const formSF = useFormSF({
    form: formAnt,
  });
  const { form } = formSF;
  const { fold } = useK8sYamlEditor();

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

  const initialValues = useMemo(() => {
    const initialValues = queryResult?.data?.data
      ? globalStore?.restoreItem(queryResult.data.data)
      : initialValuesForCreate;

    if (initialValues) {
      pruneBeforeEdit(initialValues);
    }
    return initialValues;
  }, [queryResult, globalStore, initialValuesForCreate]);

  // Init the editor after the resource value is fetched
  React.useEffect(() => {
    form.resetFields();

    if (editor.current) {
      const editorValue = yaml.dump(initialValues);
      const editorInstance = editor.current.getEditorInstance();

      editor.current.setEditorValue(editorValue);
      editor.current.setValue(editorValue);
      if (queryResult?.data?.data && editorInstance) {
        fold(editorInstance);
      }
    }
  }, [initialValues, queryResult?.data?.data, id, form, fold]);

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

  const saveButtonProps = useMemo(() => ({
    loading: formLoading,
    onClick: () => {
      form.submit();
    },
  }), [formLoading, form]);

  const editorProps: EditorProps = useMemo(() => ({
    ref: editor,
    defaultValue:
      schema && editorOptions?.isGenerateAnnotations
        ? generateYamlBySchema(initialValues || {}, schema)
        : yaml.dump(initialValues),
    schema: schema,
    id: useResourceResult.resource?.name || '',
    errorMsgs: editorErrors,
    onValidate(yamlValid: boolean, schemaValid: boolean) {
      setIsYamlValid(yamlValid);
      setIsSchemaValid(schemaValid);

      if (yamlValid && schemaValid) {
        setEditorErrors([]);
      }
    },
  }), [editorErrors, editorOptions, initialValues, schema, useResourceResult.resource?.name]);

  return {
    form: formSF.form,
    formProps: {
      ...formSF.formProps,
      onFinish: values => {
        const errors = [
          !isYamlValid ? t('dovetail.yaml_format_wrong') : '',
          !isSchemaValid ? t('dovetail.yaml_value_wrong') : '',
        ].filter(error => !!error);

        if (errors.length) {
          setEditorErrors(errors);
          return;
        }

        const finalValues = editor.current
          ? (yaml.load(editor.current?.getEditorValue() || '') as TVariables)
          : values;

        return onFinish(finalValues as TVariables);
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
    schema,
    isLoadingSchema,
    loadSchemaError,
    fetchSchema,
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
