type Labels = Record<string, string>;
type LabelsArray = { key: string; value: string }[];

export function toLabelStrings(labels: Labels = {}): string[] {
  return Object.keys(labels).map((key) => `${key}/${labels[key]}`);
}

export function toLabelsArray(labels: Labels = {}): LabelsArray {
  return Object.keys(labels).map((key) => ({
    key,
    value: labels[key],
  }));
}

export function toLabelsRecord(labels: LabelsArray): Labels {
  return labels.reduce<Record<string, string>>((prev, cur) => {
    prev[cur.key] = cur.value;
    return prev;
  }, {});
}
