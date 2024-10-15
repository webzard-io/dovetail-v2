export function validateLabelKey(key: string): { isValid: boolean; errorMessage?: string } {
  const labelPrefixRegex = /(^[a-zA-Z0-9]$)|(^[a-zA-Z0-9][a-zA-Z0-9\.]*[a-zA-Z0-9]$)/;
  const labelNameRegex = /(^[a-zA-Z0-9]$)|(^[a-zA-Z0-9][a-zA-Z0-9\.\-]*[a-zA-Z0-9]$)/;
  
  let prefix, name;
  const splitResult = key.split('/');
  if (splitResult.length === 1) {
    name = splitResult[0];
  } else {
    prefix = splitResult[0];
    name = splitResult[1];
  }

  if (prefix === '') {
    return { isValid: false, errorMessage: 'EMPTY_PREFIX' };
  }

  if (prefix && !labelPrefixRegex.test(prefix)) {
    return { isValid: false, errorMessage: 'INVALID_PREFIX' };
  }
  if (!labelNameRegex.test(name)) {
    return { isValid: false, errorMessage: 'INVALID_NAME' };
  }

  if (prefix && prefix.length > 253) {
    return { isValid: false, errorMessage: 'MAX_253' };
  }

  if (name && name.length > 63) {
    return { isValid: false, errorMessage: 'MAX_63' };
  }

  return { isValid: true };
}

export function validateLabelValue(value: string): { isValid: boolean; errorMessage?: string } {
  const labelValueRegex = /(^[a-zA-Z0-9]$)|(^[a-zA-Z0-9][a-zA-Z0-9\.\-]*[a-zA-Z0-9]$)/;
  if (value === '') {
    return { isValid: true };
  }
  
  if (value.length > 63) {
    return { isValid: false, errorMessage: 'MAX_63' };
  }

  if (!labelValueRegex.test(value)) {
    return { isValid: false, errorMessage: 'INVALID_VALUE' };
  }

  return { isValid: true };
}
