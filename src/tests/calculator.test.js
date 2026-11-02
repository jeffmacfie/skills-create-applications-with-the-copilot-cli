const { add, subtract, multiply, divide } = require('../calculator');

describe('add', () => {
  test('2 + 3 = 5', () => expect(add(2, 3)).toBe(5));
  test('handles negatives', () => expect(add(-2, -3)).toBe(-5));
  test('handles zero', () => expect(add(0, 7)).toBe(7));
  test('handles decimals', () => expect(add(0.1, 0.2)).toBeCloseTo(0.3));
});

describe('subtract', () => {
  test('10 - 4 = 6', () => expect(subtract(10, 4)).toBe(6));
  test('result can be negative', () => expect(subtract(4, 10)).toBe(-6));
  test('handles negatives', () => expect(subtract(-2, -3)).toBe(1));
  test('handles decimals', () => expect(subtract(1.5, 0.5)).toBe(1));
});

describe('multiply', () => {
  test('45 * 2 = 90', () => expect(multiply(45, 2)).toBe(90));
  test('multiplying by zero gives zero', () => expect(multiply(5, 0)).toBe(0));
  test('negative times negative is positive', () => expect(multiply(-3, -4)).toBe(12));
  test('negative times positive is negative', () => expect(multiply(-3, 4)).toBe(-12));
  test('handles decimals', () => expect(multiply(2.5, 4)).toBe(10));
});

describe('divide', () => {
  test('20 / 5 = 4', () => expect(divide(20, 5)).toBe(4));
  test('non-integer result', () => expect(divide(10, 4)).toBe(2.5));
  test('negative divisor', () => expect(divide(10, -2)).toBe(-5));
  test('zero numerator', () => expect(divide(0, 5)).toBe(0));
  test('division by zero throws', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero is not allowed.');
  });
  test('zero divided by zero throws', () => {
    expect(() => divide(0, 0)).toThrow('Division by zero');
  });
});
