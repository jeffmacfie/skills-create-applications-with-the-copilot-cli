const { add, subtract, multiply, divide, modulo, power, sqrt } = require('../calculator');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

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

  describe('modulo', () => {
    test('10 % 3 = 1', () => expect(modulo(10, 3)).toBe(1));
    test('negative dividend preserves its sign', () => expect(modulo(-10, 3)).toBe(-1));
    test('negative divisor', () => expect(modulo(10, -3)).toBe(1));
    test('zero dividend', () => expect(modulo(0, 3)).toBe(0));
    test('handles decimals', () => expect(modulo(5.5, 2)).toBe(1.5));
    test.each([0, -0])('zero divisor %s throws', (divisor) => {
      expect(() => modulo(10, divisor)).toThrow('Modulo by zero');
    });
  });

  describe('power', () => {
    test('2 ** 3 = 8', () => expect(power(2, 3)).toBe(8));
    test('zero exponent', () => expect(power(5, 0)).toBe(1));
    test('zero base', () => expect(power(0, 2)).toBe(0));
    test('zero to zero follows JavaScript semantics', () => expect(power(0, 0)).toBe(1));
    test('negative exponent', () => expect(power(2, -2)).toBe(0.25));
    test('negative base', () => expect(power(-2, 3)).toBe(-8));
    test('fractional exponent', () => expect(power(9, 0.5)).toBe(3));
    test.each([[0, -1], [-2, 0.5], [10, 1000]])(
      'invalid or overflowing result for %s ** %s throws', (a, b) => {
        expect(() => power(a, b)).toThrow('finite real number');
      }
    );
  });

  describe('sqrt', () => {
    test('square root of 9 is 3', () => expect(sqrt(9)).toBe(3));
    test('zero', () => expect(sqrt(0)).toBe(0));
    test('decimal', () => expect(sqrt(0.25)).toBe(0.5));
    test('irrational result', () => expect(sqrt(2)).toBeCloseTo(Math.SQRT2));
    test('negative input throws', () => {
      expect(() => sqrt(-1)).toThrow('Square root of a negative number');
    });
  });

  describe('new operation input validation', () => {
    test.each([NaN, Infinity, -Infinity, '2', undefined])(
      'rejects invalid operand %s', (value) => {
        expect(() => modulo(value, 2)).toThrow('finite numbers');
        expect(() => modulo(2, value)).toThrow('finite numbers');
        expect(() => power(value, 2)).toThrow('finite numbers');
        expect(() => power(2, value)).toThrow('finite numbers');
        expect(() => sqrt(value)).toThrow('finite numbers');
      }
    );
  });

  describe('CLI', () => {
    function run(...args) {
      return spawnSync(process.execPath, [path.join(__dirname, '..', 'calculator.js'), ...args], {
        encoding: 'utf8'
      });
    }

    test.each([
      ['add', '2', '3', '5'],
      ['subtract', '10', '4', '6'],
      ['multiply', '45', '2', '90'],
      ['divide', '20', '5', '4'],
      ['modulo', '10', '3', '1'],
      ['power', '2', '3', '8']
    ])('%s prints its result', (op, a, b, expected) => {
      const result = run(op, a, b);
      expect(result.status).toBe(0);
      expect(result.stdout.trim()).toBe(expected);
      expect(result.stderr).toBe('');
    });

    test('sqrt takes one operand', () => {
      const result = run('sqrt', '9');
      expect(result.status).toBe(0);
      expect(result.stdout.trim()).toBe('3');
      expect(result.stderr).toBe('');
    });

    test.each([
      [['divide', '1', '0'], 'Division by zero'],
      [['modulo', '1', '0'], 'Modulo by zero'],
      [['power', '-2', '0.5'], 'finite real number'],
      [['power', '10', '1000'], 'finite real number'],
      [['sqrt', '-1'], 'Square root of a negative number'],
      [['modulo', 'x', '2'], 'valid numbers'],
      [['power', '2', 'Infinity'], 'valid numbers'],
      [['sqrt', 'NaN'], 'valid finite number'],
      [['sqrt', 'Infinity'], 'valid finite number'],
      [['sqrt', ''], 'valid finite number'],
      [['modulo', ' ', '2'], 'valid numbers'],
      [['sqrt'], 'Usage:'],
      [['sqrt', '9', '2'], 'Usage:'],
      [['power', '2'], 'Usage:'],
      [['modulo', '2', '3', '4'], 'Usage:'],
      [['unknown', '2', '3'], 'Usage:'],
      [['toString', '2', '3'], 'Usage:']
    ])('rejects %j with a clear error', (args, message) => {
      const result = run(...args);
      expect(result.status).toBe(1);
      expect(result.stdout).toBe('');
      expect(result.stderr).toContain(message);
    });
  });
  test('zero divided by zero throws', () => {
    expect(() => divide(0, 0)).toThrow('Division by zero');
  });
});
