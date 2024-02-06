import { i18n as I18n } from 'i18next';

type Cause = {
  code?: string;
  reason?: string;
  message: string;
  field?: string;
};

export type ErrorResponseBody = {
  message?: string;
  code?: number;
  reason?: string;
  details?: {
    causes?: Cause[];
  };
  graphQLErrors?: Cause[];
};

export function isNetworkError(errors?: Cause[]) {
  if (errors?.some(error => error?.code || error?.reason)) {
    return false;
  } else {
    return true;
  }
}

export function getSubmitError(
  errorResponse: ErrorResponseBody | undefined,
  text: string,
  i18n: I18n
) {
  return !errorResponse ? i18n.t('dovetail.network_error') : text;
}

export function getCommonErrors(responseBody: ErrorResponseBody, i18n: I18n) {
  if (
    !(
      responseBody?.message ||
      responseBody?.code ||
      responseBody?.reason ||
      responseBody?.details ||
      responseBody?.graphQLErrors
    )
  ) {
    return [];
  }

  const causes: Cause[] = responseBody.details?.causes || responseBody.graphQLErrors || [];

  if (causes.length) {
    return causes.map(cause => {
      let params = {};
      let message = cause.message;

      try {
        const info = JSON.parse(cause.message);

        params = info.params;
        message = info.message;
      } catch {
        return i18n.t(
          [
            `error.${cause.reason}`,
            `error.${cause.code}`,
            `${message}${cause.field ? `(${cause.field})` : ''}`,
          ],
          {
            ...params,
            fallbackLng: '',
          }
        );
      }

      return i18n.t(
        [
          `error.${cause.reason}`,
          `error.${cause.code}`,
          `${message}${cause.field ? `(${cause.field})` : ''}`,
        ],
        {
          ...params,
          fallbackLng: '',
        }
      );
    });
  }

  return [
    i18n.t(
      [`error.${responseBody.code}`, `error.${responseBody.reason}`, responseBody.message || ''],
      { fallbackLng: '' }
    ),
  ];
}
