
export function string(name) {
  return new String(name);
}

export function integer(name) {
  return new Integer(name);
}

const notNull = () => (name, val) => {
  if (val == null)
  return new Error(`${name} must not be null`);
  return val;
}

class Field {
  name:string;
  constraints;
  notNull;
  constructor(name) {
    this.name = name;
    this.constraints = [];
    this.notNull = this.must(notNull);
  }
  test(val?): boolean {
    let result = val;
    for (const constraint of this.constraints) {
      result = constraint(this.name, result);
      if (result instanceof Error) return false;
    }
    return true;
  }
  must(fn: (arg?) => any) {
    return (arg?) => {
      this.constraints.push(fn(arg))
      return this;
    }
  }
}

const beStringFieldType = () => (name, val=null) => {
  if (val !== null && typeof val != 'string')
  return new Error(`${name} must be a string. Received ${typeof val}`);
  return val;
}

const minLength = arg => (name, val) => {
  if (!val || val.length < arg)
  return new Error(`${name} has a min length of ${arg}`)
  return val;
}

const maxLength = arg => (name, val) => {
  if (!val || val.length > arg)
  return new Error(`${name} has a max length of ${arg}`)
  return val;
}

const alphabetical = arg => (name, val) => {
  if (false == /^[a-zA-Z]+$/.test(val))
  return new Error(`${name} must only use alphabetical characters`);
  return val;
}

const numeric = () => (name, val) => {
  if (false == /^\d+$/.test(val))
  return new Error(`${name} must only use numeric characters`);
  return val;
}

// https://www.regular-expressions.info/email.html
const email = () => (name, val) => {
  const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/
  if (false == pattern.test(val))
  return new Error(`${name} must be an email address`);
  return val;
}

class String extends Field {
  minLength;
  maxLength;
  alphabetical;
  numeric;
  constructor(name) {
    super(name);
    this.must(beStringFieldType)();
    this.minLength = this.must(minLength);
    this.maxLength = this.must(maxLength);
    this.alphabetical = this.must(alphabetical);
    this.numeric = this.must(numeric);
  }
}

const beIntegerFieldType = () => (name, val=null) => {
  if (val !== null && !Number.isInteger(val))
  return new Error(`${name} must be an integer. Received ${typeof val}`);
  return val;
}

const notNegative = () => (name, val) => {
  if (val < 0)
  return new Error(`${name} must not be negative`)
  return val;
}

const notZero = () => (name, val) => {
  if (val == 0)
  return new Error(`${name} must not be 0`)
  return val;
}

const range = (arg) => (name, val) => {
  const [min, max] = arg;
  if (val < min || val > max)
  return new Error(`${name} must be between ${min} and ${max}`)
}

class Integer extends Field {
  notNegative;
  notZero;
  range;
  constructor(name) {
    super(name);
    this.must(beIntegerFieldType)();
    this.notNegative = this.must(notNegative);
    this.notZero = this.must(notZero);
    this.range = this.must(range);
  }
}
