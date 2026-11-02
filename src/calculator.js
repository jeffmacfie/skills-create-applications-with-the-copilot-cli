#!/usr/bin/env node
/**
 * Node.js CLI calculator.
 *
 * Supported operations:
 *   add       (+)  Addition
 *   subtract  (-)  Subtraction
 *   multiply  (*)  Multiplication
 *   divide    (/)  Division (division by zero is an error)
 *
 * Usage: node src/calculator.js <operation> <number1> <number2>
 *   node src/calculator.js add 2 3        # 5
 *   node src/calculator.js subtract 5 2   # 3
 *   node src/calculator.js multiply 4 3   # 12
 *   node src/calculator.js divide 10 2    # 5
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

const operations = { add, subtract, multiply, divide };

function usage() {
  return 'Usage: node calculator.js <add|subtract|multiply|divide> <number1> <number2>';
}

function main(args) {
  const [op, rawA, rawB] = args;

  if (args.length !== 3 || !Object.hasOwn(operations, op)) {
    console.error(usage());
    return 1;
  }

  const a = Number(rawA);
  const b = Number(rawB);
  if (rawA.trim() === '' || rawB.trim() === '' || Number.isNaN(a) || Number.isNaN(b)) {
    console.error('Error: both operands must be valid numbers.');
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

module.exports = { add, subtract, multiply, divide };
