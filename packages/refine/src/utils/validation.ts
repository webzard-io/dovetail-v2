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
