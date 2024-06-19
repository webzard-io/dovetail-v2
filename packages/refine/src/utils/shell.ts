import { Buffer } from 'buffer';

export type QueryParams = {
  [key: string]: string | string[]
}

export const stdin = (characters: string) => {
  return Buffer.from(`\x00${characters}`, 'utf8');
};

export function addParam(url: string, key: string, val: string | string[]): string {
  let out = url + (url.includes('?') ? '&' : '?');

  // val can be a string or an array of strings
  if (!Array.isArray(val)) {
    val = [val];
  }
  out += val.map((v) => {
    if (v === null) {
      return `${encodeURIComponent(key)}`;
    } else {
      return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
    }
  }).join('&');

  return out;
}

export function addParams(url: string, params: QueryParams): string {
  if (params && typeof params === 'object') {
    Object.keys(params).forEach((key) => {
      url = addParam(url, key, params[key]);
    });
  }

  return url;
}

enum Alphabet {
  NORMAL = 'normal',
  URL = 'url'
}

export function base64Encode(str: string, alphabet: Alphabet = Alphabet.NORMAL) {
  let buf;

  if (str === null || typeof str === 'undefined') {
    return str;
  }

  if (typeof Buffer.from === 'function' && Buffer.from !== Uint8Array.from) {
    buf = Buffer.from(str);
  } else {
    buf = new Buffer(str);
  }
  if (alphabet === Alphabet.URL) {
    const m: Record<string, string> = {
      '+': '-',
      '/': '_',
    };

    return buf.toString('base64').replace(/[+/]|=+$/g, (char) => m[char] || '');
  }

  return buf.toString('base64');
}

export function base64DecodeToBuffer(str: string) {
  if (str === null || typeof str === 'undefined') {
    return str;
  }

  if (typeof Buffer.from === 'function' && Buffer.from !== Uint8Array.from) {
    return Buffer.from(str, 'base64');
  } else {
    return new Buffer(str, 'base64');
  }
}

export function base64Decode(str: string) {
  return !str ? str : base64DecodeToBuffer(str.replace(/[-_]/g, (char) => char === '-' ? '+' : '/')).toString();
}
