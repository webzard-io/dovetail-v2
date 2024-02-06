import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getCommonErrors, ErrorResponseBody } from 'src/utils/error';

interface UseSubmitFormOptions {
  formRef: React.MutableRefObject<{
    submit: () => (Promise<unknown> | undefined);
  } | null>;
  onSubmitSuccess?: () => void;
}

export function useSubmitForm(options: UseSubmitFormOptions) {
  const { formRef, onSubmitSuccess } = options;
  const { i18n } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

  const reset = useCallback(() => {
    setSubmitting(false);
    setErrorMsgs([]);
  }, []);
  const onSubmit = useCallback(async () => {
    try {
      setSubmitting(true);

      await formRef.current?.submit();
      onSubmitSuccess?.();
      reset();
    } catch (error: unknown) {
      if (error instanceof Object) {
        if ('response' in error && error.response instanceof Response) {
          const response = error.response;
          const body: ErrorResponseBody = await response.json();

          setErrorMsgs(getCommonErrors(body, i18n));
        } else if ('message' in error && typeof error.message === 'string') {
          setErrorMsgs([error.message]);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }, [formRef, i18n, reset, onSubmitSuccess]);

  return {
    submitting,
    errorMsgs,
    reset,
    onSubmit,
  };
}
