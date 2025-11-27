import { validateLabelKey, validateLabelValue } from '../../src/utils/validation';

const mockI18n = {
  t: (key: string) => key,
} as any;

describe('validation', () => {
  it('validateLabelKey', async () => {
    const validArray = ['a', 'a/b', 'x-io/a'];
    const invalidArray = [
      '',
      '#$#$',
      '#%/#$#',
      '-sdsd',
      'asda-',
      'aa/sd.',
      '-',
      '.',
      '/',
      `${genStr(243)}/${genStr(64)}`,
    ];
    expect(
      validArray.every(str => {
        return validateLabelKey(str).isValid;
      })
    ).toBe(true);
    expect(
      invalidArray.every(str => {
        return !validateLabelKey(str).isValid;
      })
    ).toBe(true);
  });
  it('validateLabelValue', async () => {
    // 空字符串在 isOptional=true 时有效
    const validArrayOptional = ['', 'a', 'a-._b'];
    // 空字符串在 isOptional=false（默认）时无效
    const validArrayRequired = ['a', 'a-._b'];
    const invalidArray = ['-', '.', '_', '$#@(&', genStr(64)];

    // 测试 isOptional = true 的情况
    expect(
      validArrayOptional.every(str => {
        return validateLabelValue(str, mockI18n, true).isValid;
      })
    ).toBe(true);

    // 测试 isOptional = false（默认）的情况
    expect(
      validArrayRequired.every(str => {
        return validateLabelValue(str, mockI18n).isValid;
      })
    ).toBe(true);

    // 空字符串在非可选时应该无效
    expect(validateLabelValue('', mockI18n).isValid).toBe(false);

    expect(
      invalidArray.every(str => {
        return !validateLabelValue(str, mockI18n).isValid;
      })
    ).toBe(true);
  });
});

function genStr(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
