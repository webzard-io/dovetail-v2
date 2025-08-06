function isUtf8(buffer: ArrayBuffer) {
  try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    decoder.decode(buffer);
    return true;
  } catch (e) {
    return false;
  }
}

export function readFileAsBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const arrayBuffer = reader.result;

      if (arrayBuffer instanceof ArrayBuffer) {
        if (isUtf8(arrayBuffer)) {
          resolve(await file.text());
        } else {
          const base64String = btoa(
            String.fromCharCode(...new Uint8Array(arrayBuffer))
          );
          resolve(base64String);
        }

        return;
      }

      reject(new Error('Failed to read file'));
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file); // 用二进制读取
  });
}
