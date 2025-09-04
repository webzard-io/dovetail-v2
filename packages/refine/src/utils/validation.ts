import { i18n as I18n } from 'i18next';

const Rfc1123NameRegExp = /(^[a-z0-9]$)|(^[a-z0-9][a-z0-9-]*[a-z0-9]$)/;
const Rfc1035NameRegExp = /(^[a-z]$)|(^[a-z][a-z0-9\-]*[a-z0-9]$)/;

export function validateDnsSubdomain(subdomain: string): {
  isValid: boolean;
  errorMessage?: string;
} {
  const regex = /(^[a-zA-Z0-9]$)|(^[a-zA-Z0-9][a-zA-Z0-9\.\-\_]*[a-zA-Z0-9]$)/;

  if (!regex.test(subdomain)) {
    return { isValid: false };
  }

  if (subdomain && subdomain.length > 63) {
    return { isValid: false };
  }

  return { isValid: true };
}

interface ValidateResourceNameOptions {
  v: string;
  allNames: string[];
  i18n: I18n;
  emptyText?: string;
  duplicatedText?: string;
  formatErrorText: string;
  regex: RegExp;
}

export function validateResourceName({
  v,
  allNames,
  i18n,
  emptyText,
  duplicatedText,
  formatErrorText,
  regex,
}: ValidateResourceNameOptions) {
  if (!v) {
    return {
      isValid: false,
      errorMessage: emptyText || i18n.t('dovetail.required_field', {
        label: i18n.t('dovetail.name'),
      }),
    };
  }

  if (v.length > 63) {
    return {
      isValid: false,
      errorMessage: i18n.t('dovetail.length_limit', {
        label: i18n.t('dovetail.name'),
        minLength: 1,
        maxLength: 63,
      }),
    };
  }

  if (!v.match(regex)) {
    return {
      isValid: false,
      errorMessage: formatErrorText,
    };
  }

  if (allNames.includes(v)) {
    return {
      isValid: false,
      errorMessage: duplicatedText || i18n.t('dovetail.name_duplicated', {
        name: v,
      }),
    };
  }
  return {
    isValid: true,
  };
}

export function validateRfc1123Name({
  v,
  allNames,
  i18n,
  emptyText,
  duplicatedText,
}: Omit<ValidateResourceNameOptions, 'regex' | 'formatErrorText'>) {
  return validateResourceName({
    v,
    allNames,
    i18n,
    emptyText,
    duplicatedText,
    regex: Rfc1123NameRegExp,
    formatErrorText: i18n.t('dovetail.rf1123_name_format_error'),
  });
}

export function ValidateRfc1035Name({
  v,
  allNames,
  i18n,
  emptyText,
  duplicatedText,
}: Omit<ValidateResourceNameOptions, 'regex' | 'formatErrorText'>) {
  return validateResourceName({
    v,
    allNames,
    i18n,
    emptyText,
    duplicatedText,
    regex: Rfc1035NameRegExp,
    formatErrorText: i18n.t('dovetail.rf1035_name_format_error'),
  });
}

export function validateLabelKey(key: string): {
  isValid: boolean;
  errorMessage?: string;
} {
  const labelRegex = /(^[a-zA-Z0-9]$)|(^[a-zA-Z0-9][a-zA-Z0-9\.\-\_]*[a-zA-Z0-9]$)/;

  let prefix, name;
  const splitResult = key.split('/');
  if (splitResult.length === 1) {
    name = splitResult[0];
  } else {
    prefix = splitResult[0];
    name = splitResult[1];
  }

  if (prefix === '') {
    return { isValid: false };
  }
  if (prefix && !labelRegex.test(prefix)) {
    return { isValid: false };
  }
  if (prefix && prefix.length > 253) {
    return { isValid: false };
  }

  return validateDnsSubdomain(name);
}

export function validateLabelValue(
  value: string,
  isOptional?: boolean
): {
  isValid: boolean;
  errorMessage?: string;
} {
  const labelValueRegex = /(^[a-zA-Z0-9]$)|(^[a-zA-Z0-9][a-zA-Z0-9\.\-\_]*[a-zA-Z0-9]$)/;

  if (isOptional && value === '') {
    return { isValid: true };
  } else if (value === '') {
    return { isValid: false };
  }

  if (value.length > 63) {
    return { isValid: false };
  }

  if (!labelValueRegex.test(value)) {
    return { isValid: false };
  }

  return { isValid: true };
}

export function validatePort(port: string | number, isOptional: boolean, i18n: I18n): {
  isValid: boolean;
  errorMessage?: string;
} {

  if (port === '' && !isOptional) {
    return {
      isValid: false, errorMessage: i18n.t('dovetail.required_field', {
        label: i18n.t('dovetail.port'),
      })
    };
  }

  const portNumber = Number(port);

  if (portNumber < 1 || portNumber > 65535) {
    return { isValid: false, errorMessage: i18n.t('dovetail.input_correct_port') };
  }

  return { isValid: true };
}

export function validateNodePort(nodePort: number | null, allNodePorts: number[], i18n: I18n): {
  isValid: boolean;
  errorMessage?: string;
} {
  if (nodePort === null) {
    return { isValid: true };
  }

  const portNumber = Number(nodePort);

  if (portNumber < 30000 || portNumber > 32767) {
    return { isValid: false, errorMessage: i18n.t('dovetail.input_correct_port') };
  }

  if (allNodePorts.includes(portNumber)) {
    return { isValid: false, errorMessage: i18n.t('dovetail.node_port_duplicated') };
  }

  return { isValid: true };
}
