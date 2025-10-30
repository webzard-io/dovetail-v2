import { Form } from '@cloudtower/eagle';
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
import { get, uniq } from 'lodash-es';
import React, { useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RefineFormValidator } from 'src/components/Form/type';
import { type YamlEditorHandle, type YamlEditorProps } from 'src/components/YamlEditor';
import useK8sYamlEditor from 'src/hooks/useK8sYamlEditor';
import { useSchema } from 'src/hooks/useSchema';
import { FormType } from 'src/types/resource';
import { pruneBeforeEdit } from 'src/utils/k8s';
import { generateYamlBySchema } from 'src/utils/yaml';
import { useForm as useFormSF } from 'sunflower-antd';
import { useGlobalStore } from '../../hooks/useGlobalStore';

type EditorProps = YamlEditorProps & {
  ref: React.RefObject<YamlEditorHandle>;
};

export type YamlFormRule = {
  path: string[];
  validators?: RefineFormValidator[];
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
  initialValuesForEdit?: Record<string, unknown>;
  transformInitValues?: (values: Record<string, unknown>) => Record<string, unknown>;
  transformApplyValues?: (values: Unstructured) => Unstructured;
  rules?: YamlFormRule[];
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
  formProps: Omit<FormProps, 'onFinish'> & {
    onFinish: (
      values?: TVariables
    ) =>
      | Promise<CreateResponse<TResponse> | UpdateResponse<TResponse> | void>
      | undefined;
  };
  saveButtonProps: ButtonProps & {
    onClick: () => void;
  };
  editorProps: EditorProps;
  schemas: JSONSchema7[] | null;
  isLoadingSchema: boolean;
  loadSchemaError: Error | null;
  fetchSchema: () => void;
  errorResponseBody?: Record<string, unknown> | null;
};

const useYamlForm = <
  TQueryFnData extends Unstructured = Unstructured & { id: string },
  TError extends HttpError = HttpError,
  TVariables extends { [prop: string]: unknown } = { [prop: string]: unknown },
  TData extends Unstructured = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
>({
  action: actionFromProps,
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
  initialValuesForEdit,
  transformInitValues,
  transformApplyValues,
  rules,
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
  const [isYamlValid, setIsYamlValid] = useState(true);
  const [isSchemaValid, setIsSchemaValid] = useState(true);
  const [editorErrors, setEditorErrors] = useState<string[]>([]);
  const [rulesErrors, setRulesErrors] = useState<string[]>([]);
  const [errorResponseBody, setErrorResponseBody] = useState<Record<
    string,
    unknown
  > | null>(null);
  const useResourceResult = useResource();
  const globalStore = useGlobalStore();
  const {
    schema,
    loading: isLoadingSchema,
    error: loadSchemaError,
    fetchSchema,
  } = useSchema({
    skip: editorOptions?.isSkipSchema,
    resource,
  });
  const [formAnt] = Form.useForm();
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
    onMutationError: (error, ...restParams) => {
      const response = error.response;

      if (response && !response?.bodyUsed) {
        response.json?.().then((body: Record<string, unknown>) => {
          setErrorResponseBody(body);
        });
      }

      onMutationError?.(error, ...restParams);
    },
    redirect,
    action: actionFromProps,
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

  const { formLoading, onFinish, queryResult } = useFormCoreResult;

  const { warnWhenUnsavedChanges: warnWhenUnsavedChangesRefine, setWarnWhen } =
    useWarnAboutChange();
  const warnWhenUnsavedChanges =
    warnWhenUnsavedChangesProp ?? warnWhenUnsavedChangesRefine;

  const action = useMemo(
    () => actionFromProps || useResourceResult.action,
    [actionFromProps, useResourceResult.action]
  );
  const initialValues = useMemo(() => {
    const initialValues =
      (action === 'edit' && queryResult?.data?.data
        ? (initialValuesForEdit || globalStore?.restoreItem(queryResult.data.data))
        : initialValuesForCreate) || {};

    if (initialValues) {
      pruneBeforeEdit(initialValues);
    }

    return transformInitValues?.(initialValues as Unstructured) || initialValues;
  }, [queryResult, globalStore, initialValuesForCreate, action, initialValuesForEdit, transformInitValues]);
  const finalErrors = useMemo(() => {
    return uniq([...editorErrors, ...rulesErrors]);
  }, [editorErrors, rulesErrors]);
  const schemas = useMemo(() => {
    return schema ? [schema] : [];
  }, [schema]);
  const saveButtonProps = useMemo(
    () => ({
      loading: formLoading,
      onClick: () => {
        form.submit();
      },
    }),
    [formLoading, form]
  );
  const emptySchemas = useMemo(() => {
    return [];
  }, []);
  const editorProps: EditorProps = useMemo(() => {
    return {
      ref: editor,
      defaultValue:
        schema && editorOptions?.isGenerateAnnotations
          ? generateYamlBySchema(initialValues || {}, schema)
          : yaml.dump(initialValues),
      schemas: schemas || emptySchemas,
      id: useResourceResult.resource?.name || '',
      errorMsgs: finalErrors,
      onValidate(yamlValid: boolean, schemaValid: boolean) {
        setIsYamlValid(yamlValid);
        setIsSchemaValid(schemaValid);

        if (yamlValid && schemaValid) {
          setEditorErrors([]);
        }
      },
      onEditorCreate(editorInstance) {
        const editorValue = yaml.dump(initialValues);

        editor.current?.setEditorValue(editorValue);
        editor.current?.setValue(editorValue);
        if (action === 'edit') {
          fold(editorInstance);
        }
      },
    };
  }, [
    schema,
    emptySchemas,
    editorOptions?.isGenerateAnnotations,
    initialValues,
    schemas,
    useResourceResult.resource?.name,
    action,
    finalErrors,
    fold,
  ]);

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
  const validateRules = async (yamlValue: string) => {
    const errorMap: Record<string, string> = {};

    if (rules && isYamlValid && isSchemaValid) {
      const formValue = yaml.load(yamlValue || '');

      for (const rule of rules) {
        const { path, validators } = rule;
        const value = get(formValue, path);

        for (const validator of (validators || [])) {
          const { isValid, errorMsg } = await validator(value, formValue, FormType.YAML);

          if (!isValid) {
            errorMap[path.join('.')] = `${errorMsg}(${path.join('.')})`;
            break;
          }
        }
      }

    }

    setRulesErrors(uniq(Object.values(errorMap)));

    return errorMap;
  };

  return {
    form: formSF.form,
    formProps: {
      ...formSF.formProps,
      onFinish: async (values) => {
        const errors = [
          !isYamlValid ? t('dovetail.yaml_format_wrong') : '',
          !isSchemaValid ? t('dovetail.yaml_value_wrong') : '',
        ].filter(error => !!error);

        if (errors.length) {
          setEditorErrors(errors);
          setRulesErrors([]);
          return;
        }

        const rulesErrors = await validateRules(editor.current?.getEditorValue() || '');

        if (Object.keys(rulesErrors).length) {
          setRulesErrors(Object.values(rulesErrors));
          return;
        }

        try {
          const objectValues = editor.current
            ? (yaml.load(editor.current?.getEditorValue() || '') as Unstructured)
            : values;
          const finalValues =
            transformApplyValues?.(objectValues as Unstructured) || objectValues;

          return onFinish(finalValues as TVariables);
        } catch (error: unknown) {
          if (error instanceof Error) {
            if (
              error.message === 'expected a single document in the stream, but found more'
            ) {
              setEditorErrors([t('dovetail.only_support_one_yaml')]);
              return;
            } else {
              setEditorErrors([error.message]);
            }
          }
        }
      },
      onKeyUp,
      onValuesChange,
      initialValues,
    },
    saveButtonProps,
    ...useFormCoreResult,
    errorResponseBody,
    editorProps,
    schemas: schema ? [schema] : [],
    isLoadingSchema,
    loadSchemaError,
    fetchSchema,
  };
};

export default useYamlForm;
