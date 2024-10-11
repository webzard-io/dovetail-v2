export enum StorageUnit {
  Pi = 'Pi',
  PiB = 'PiB',
  Ti = 'Ti',
  TiB = 'TiB',
  Gi = 'Gi',
  GiB = 'GiB',
  Mi = 'Mi',
  MiB = 'MiB',
  Ki = 'Ki',
  KiB = 'KiB'
}
const UNIT_FACTORS: Record<string, number> = {
  Pi: 1024 ** 5,
  PiB: 1024 ** 5,
  Ti: 1024 ** 4,
  TiB: 1024 ** 4,
  Gi: 1024 ** 3,
  GiB: 1024 ** 3,
  Mi: 1024 ** 2,
  MiB: 1024 ** 2,
  Ki: 1024,
  KiB: 1024,
  B: 1,
};

export function transformStorageUnit(value: string, toUnit: StorageUnit = StorageUnit.Gi) {
  const num = parseFloat(value);
  const unit = Object.values(StorageUnit).find(u => value.includes(u)) || StorageUnit.Ki;

  return num / UNIT_FACTORS[unit] * UNIT_FACTORS[toUnit];
}
