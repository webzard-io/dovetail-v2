import { i18n as I18n } from 'i18next';

type Cause = {
  code?: string;
  reason?: string;
  message: string;
  field?: string;
};

type ErrorResponse = {
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
  errorResponse: ErrorResponse | undefined,
  text: string,
  i18n: I18n
) {
  return !errorResponse ? i18n.t('sks.network_error') : text;
}

export function getCommonErrors(response: ErrorResponse, i18n: I18n) {
  if (
    !(
      response?.message ||
      response?.code ||
      response?.reason ||
      response?.details ||
      response?.graphQLErrors
    )
  ) {
    return [];
  }

  const causes: Cause[] = response.details?.causes || response.graphQLErrors || [];

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
      [`error.${response.code}`, `error.${response.reason}`, response.message || ''],
      { fallbackLng: '' }
    ),
  ];
}
