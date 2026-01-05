export function shortenedImage(image: string) {
  return (image || '')
    .replace(/^(index\.)?docker.io\/(library\/)?/, '')
    .replace(/^(.*@sha256:)([0-9a-f]{8})[0-9a-f]+$/i, '$1$2…');
}

export function isFirstLetterEnglish(str: string) {
  return /^[a-zA-Z]/.test(str);
}

export function transformResourceKindInSentence(str: string, language: string) {
  return isFirstLetterEnglish(str) ? ` ${language !== 'zh-CN' ? str.toLocaleLowerCase() : str}` : str;
}
