// https://github.com/refinedev/refine/blob/master/packages/react-hook-form/src/useForm/index.ts
import {
  BaseRecord,
  HttpError,
  useForm as useFormCore,
  useWarnAboutChange,
  UseFormProps as UseFormCoreProps,
  UseFormReturnType as UseFormReturnTypeCore,
  useTranslate,
  useRefineContext,
  flattenObjectKeys,
} from '@refinedev/core';
import get from 'lodash/get';
import has from 'lodash/has';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DefaultValues } from 'react-hook-form';

import {
  useForm as useHookForm,
  UseFormProps as UseHookFormProps,
  UseFormReturn,
  FieldValues,
  UseFormHandleSubmit,
  Path,
} from 'react-hook-form';

export type UseFormReturnType<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables extends FieldValues = FieldValues,
  TContext extends object = object,
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError
> = UseFormReturn<TVariables, TContext> & {
  transformedInitValues: TVariables | undefined;
  refineCore: UseFormReturnTypeCore<
    TQueryFnData,
    TError,
    TVariables,
    TData,
    TResponse,
    TResponseError
  >;
  saveButtonProps: {
    disabled: boolean;
    onClick: (e: React.BaseSyntheticEvent) => void;
  };
  beforeSubmitErrors: string[];
};

export type UseFormProps<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables extends FieldValues = FieldValues,
  TContext extends object = object,
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError
> = {
  /**
   * Configuration object for the core of the [useForm](/docs/api-reference/core/hooks/useForm/)
   * @type [`UseFormCoreProps<TQueryFnData, TError, TVariables, TData, TResponse, TResponseError>`](/docs/api-reference/core/hooks/useForm/#properties)
   */
  refineCoreProps?: UseFormCoreProps<
    TQueryFnData,
    TError,
    TVariables,
    TData,
    TResponse,
    TResponseError
  >;
  /**
   * When you have unsaved changes and try to leave the current page, **refine** shows a confirmation modal box.
   * @default `false*`
   */
  warnWhenUnsavedChanges?: boolean;
  /**
   * Disables server-side validation
   * @default false
   * @see {@link https://refine.dev/docs/advanced-tutorials/forms/server-side-form-validation/}
   */
  disableServerSideValidation?: boolean;
  transformApplyValues?: (values: TVariables) => TVariables;
  transformInitValues?: (values: Record<string, unknown>) => DefaultValues<TVariables>;
  beforeSubmit?: (
    values: TVariables,
    setErrors: (errors: string[]) => void
  ) => Promise<TVariables>;
  onBeforeSubmitError?: (errors: string[]) => void;
} & UseHookFormProps<TVariables, TContext>;

export const useForm = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables extends FieldValues = FieldValues,
  TContext extends object = object,
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError
>({
  refineCoreProps,
  warnWhenUnsavedChanges: warnWhenUnsavedChangesProp,
  disableServerSideValidation: disableServerSideValidationProp = false,
  transformApplyValues,
  transformInitValues,
  beforeSubmit,
  onBeforeSubmitError,
  ...rest
}: UseFormProps<
  TQueryFnData,
  TError,
  TVariables,
  TContext,
  TData,
  TResponse,
  TResponseError
> = {}): UseFormReturnType<
  TQueryFnData,
  TError,
  TVariables,
  TContext,
  TData,
  TResponse,
  TResponseError
> => {
  const { options } = useRefineContext();
  const disableServerSideValidation =
    options?.disableServerSideValidation || disableServerSideValidationProp;

  const translate = useTranslate();

  const { warnWhenUnsavedChanges: warnWhenUnsavedChangesRefine, setWarnWhen } =
    useWarnAboutChange();
  const warnWhenUnsavedChanges =
    warnWhenUnsavedChangesProp ?? warnWhenUnsavedChangesRefine;

  const useHookFormResult = useHookForm<TVariables, TContext>({
    ...rest,
    defaultValues:
      transformInitValues && typeof rest.defaultValues === 'object'
        ? transformInitValues(rest.defaultValues)
        : rest.defaultValues,
  });
  const [transformedInitValues, setTransformedInitValues] = useState<
    TVariables | undefined
  >(useHookFormResult.getValues());
  const [beforeSubmitErrors, setBeforeSubmitErrors] = useState<string[]>([]);
  const [isBeforeSubmitLoading, setIsBeforeSubmitLoading] = useState(false);

  const {
    watch,
    setValue,
    getValues,
    handleSubmit: handleSubmitReactHookForm,
    setError,
    formState,
  } = useHookFormResult;

  const useFormCoreResult = useFormCore<
    TQueryFnData,
    TError,
    TVariables,
    TData,
    TResponse,
    TResponseError
  >({
    ...refineCoreProps,
    onMutationError: (error, _variables, _context) => {
      if (disableServerSideValidation) {
        refineCoreProps?.onMutationError?.(error, _variables, _context);
        return;
      }

      const errors = error?.errors;

      for (const key in errors) {
        // when the key is not registered in the form, react-hook-form not working
        const isKeyInVariables = Object.keys(flattenObjectKeys(_variables)).includes(key);

        if (!isKeyInVariables) {
          continue;
        }

        const fieldError = errors[key];

        let newError = '';

        if (Array.isArray(fieldError)) {
          newError = fieldError.join(' ');
        }

        if (typeof fieldError === 'string') {
          newError = fieldError;
        }

        if (typeof fieldError === 'boolean' && fieldError) {
          newError = 'Field is not valid.';
        }

        if (typeof fieldError === 'object' && 'key' in fieldError) {
          const translatedMessage = translate(fieldError.key, fieldError.message);

          newError = translatedMessage;
        }

        setError(key as Path<TVariables>, {
          message: newError,
        });
      }

      refineCoreProps?.onMutationError?.(error, _variables, _context);
    },
  });

  const { queryResult, onFinish, formLoading, onFinishAutoSave } = useFormCoreResult;

  useEffect(() => {
    // if form is modified, don't override its value.
    if (formState.isDirty) return;

    const data = queryResult?.data?.data;
    if (!data) return;

    /**
     * get registered fields from react-hook-form
     */
    const transformedData = transformInitValues ? transformInitValues(data) : data;
    const registeredFields = Object.keys(flattenObjectKeys(transformedData));

    /**
     * set values from query result as default values
     */
    registeredFields.forEach(path => {
      const hasValue = has(transformedData, path);
      const dataValue = get(transformedData, path);

      /**
       * set value if the path exists in the query result even if the value is null
       */
      if (hasValue) {
        setValue(path as Path<TVariables>, dataValue, {
          shouldDirty: false,
          shouldValidate: false,
          shouldTouch: false,
        });
      }
    });
    setTransformedInitValues(getValues());
  }, [queryResult?.data, setValue, transformInitValues, formState.isDirty, getValues]);

  useEffect(() => {
    const subscription = watch((values: any, { type }: { type?: any }) => {
      if (type === 'change') {
        onValuesChange(values);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onValuesChange = useCallback(
    (changeValues: TVariables) => {
      if (warnWhenUnsavedChanges) {
        setWarnWhen(true);
      }

      if (refineCoreProps?.autoSave) {
        setWarnWhen(false);

        const onFinishProps = refineCoreProps.autoSave?.onFinish;

        if (onFinishProps) {
          return onFinishAutoSave(onFinishProps(changeValues));
        }

        return onFinishAutoSave(changeValues);
      }

      return changeValues;
    },
    [warnWhenUnsavedChanges, refineCoreProps?.autoSave, setWarnWhen, onFinishAutoSave]
  );
  const handleSubmit: UseFormHandleSubmit<TVariables> = useCallback(
    (onValid, onInvalid) => async e => {
      setWarnWhen(false);
      return handleSubmitReactHookForm(onValid, onInvalid)(e);
    },
    [handleSubmitReactHookForm, setWarnWhen]
  );

  const saveButtonProps = useMemo(() => {
    return {
      disabled: formLoading,
      loading: formLoading || isBeforeSubmitLoading,
      onClick: async (e: React.BaseSyntheticEvent) => {
        // 清空之前的错误
        setBeforeSubmitErrors([]);

        handleSubmit(
          async v => {
            let finalValues = transformApplyValues ? transformApplyValues(v) : v;

            if (beforeSubmit) {
              try {
                setIsBeforeSubmitLoading(true);
                let hasErrors = false;

                const result = await beforeSubmit(finalValues, (errors: string[]) => {
                  if (errors && errors.length > 0) {
                    setBeforeSubmitErrors(errors);
                    onBeforeSubmitError?.(errors);
                    hasErrors = true;
                  }
                });

                // 如果有错误，则不继续提交
                if (hasErrors) {
                  return;
                }

                // 使用 beforeSubmit 返回的值（如果有的话）
                if (result !== undefined) {
                  finalValues = result as TVariables;
                }
              } finally {
                setIsBeforeSubmitLoading(false);
              }
            }

            return onFinish(finalValues);
          },
          () => false
        )(e);
      },
    };
  }, [
    formLoading,
    isBeforeSubmitLoading,
    handleSubmit,
    onFinish,
    transformApplyValues,
    beforeSubmit,
    onBeforeSubmitError,
  ]);

  return {
    ...useHookFormResult,
    transformedInitValues,
    handleSubmit,
    refineCore: useFormCoreResult,
    saveButtonProps,
    beforeSubmitErrors,
  };
};
