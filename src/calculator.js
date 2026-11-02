#!/usr/bin/env node
/**
 * Node.js CLI calculator.
 *
 * Supported operations:
 *   add       (+)  Addition
 *   subtract  (-)  Subtraction
 *   multiply  (*)  Multiplication
 *   divide    (/)  Division (division by zero is an error)
 *   modulo    (%)  Remainder (modulo by zero is an error)
 *   power     (**) Exponentiation (result must be finite and real)
 *   sqrt      (√)  Square root (negative input is an error)
 *
 * Usage: node src/calculator.js <operation> <number1> <number2>
 *   node src/calculator.js add 2 3        # 5
 *   node src/calculator.js subtract 5 2   # 3
 *   node src/calculator.js multiply 4 3   # 12
 *   node src/calculator.js divide 10 2    # 5
 *   node src/calculator.js modulo 10 3    # 1
 *   node src/calculator.js power 2 3      # 8
 *   node src/calculator.js sqrt 9         # 3 (one operand)
 */

// Addition
function add(a, b) {
  return a + b;
}

// Subtraction
function subtract(a, b) {
  return a - b;
}

// Multiplication
function multiply(a, b) {
  return a * b;
}

// Division
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed.');
  }
  return a / b;
}

function validateOperands(...operands) {
  if (!operands.every(Number.isFinite)) {
    throw new Error('Operands must be finite numbers.');
  }
}

// Modulo (JavaScript remainder, with the sign of the dividend)
function modulo(a, b) {
  validateOperands(a, b);
  if (b === 0) {
    throw new Error('Modulo by zero is not allowed.');
  }
  return a % b;
}

// Exponentiation
function power(a, b) {
  validateOperands(a, b);
  const result = a ** b;
  if (!Number.isFinite(result)) {
    throw new Error('Exponentiation must produce a finite real number.');
  }
  return result;
}

// Square root
function sqrt(a) {
  validateOperands(a);
  if (a < 0) {
    throw new Error('Square root of a negative number is not allowed.');
  }
  return Math.sqrt(a);
}

const operations = { add, subtract, multiply, divide, modulo, power, sqrt };

function usage() {
  return 'Usage: node calculator.js <add|subtract|multiply|divide|modulo|power> <number1> <number2>\n' +
    '       node calculator.js sqrt <number>';
}

function main(args) {
  const [op, rawA, rawB] = args;

  if (!Object.hasOwn(operations, op) || args.length !== (op === 'sqrt' ? 2 : 3)) {
    console.error(usage());
    return 1;
  }

  const a = Number(rawA);
  const b = op === 'sqrt' ? undefined : Number(rawB);
  if (rawA.trim() === '' || !Number.isFinite(a) ||
      (op !== 'sqrt' && (rawB.trim() === '' || !Number.isFinite(b)))) {
    console.error(op === 'sqrt'
      ? 'Error: operand must be a valid finite number.'
      : 'Error: both operands must be valid numbers.');
    return 1;
  }

  try {
    console.log(operations[op](a, b));
    return 0;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { add, subtract, multiply, divide, modulo, power, sqrt };
