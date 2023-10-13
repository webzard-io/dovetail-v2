export function addId<T extends object>(arr: T[], idKey: keyof T) {
  return arr.map(e => {
    return {
      id: e[idKey] as string,
      ...e,
    };
  });
}
