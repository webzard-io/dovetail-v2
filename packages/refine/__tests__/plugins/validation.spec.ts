import { validateLabelKey, validateLabelValue } from '../../src/utils/validation';

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
    const validArray = ['', 'a', 'a-._b'];
    const invalidArray = ['-', '.', '_', '$#@(&', genStr(64)];
    expect(
      validArray.every(str => {
        return validateLabelValue(str).isValid;
      })
    ).toBe(true);
    expect(
      invalidArray.every(str => {
        return !validateLabelValue(str).isValid;
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
