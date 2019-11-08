/**
 * Wrapping classes with functions prevents people from inheriting from them
 */
export function string(name) {
  return new String(name);
}

export function integer(name) {
  return new Integer(name);
}

export function float(name) {
  return new Float(name);
}

export function boolean(name) {
  return new Boolean(name);
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

  // Apply custom field constraints
  must(fn: (arg?) => any) {
    return (arg?) => {
      this.constraints.push(fn(arg))
      return this;
    }
  }

  // Determine if a value passes all field constraints
  test(val?): boolean {
    // Run the input value through each of the constraints
    for (const constraint of this.constraints) {
      let temp = constraint(this.name, val);

      // Error objects indicate Test Failure
      if (temp instanceof Error) return false;

      // Don't re-assign val if constraint returned undefined
      if (temp !== undefined) val = temp;
    }

    // Run the first constraint (type check) once more
    const [typeConstraint] = this.constraints;
    if (typeConstraint(this.name, val) instanceof Error) return false;

    // Success
    return true;
  }

  from(val?): any {
    // Run the input value through each of the constraints
    for (const constraint of this.constraints) {
      let temp = constraint(this.name, val);

      // Failure
      if (temp instanceof Error) return temp;

      // Don't re-assign val if constraint returned undefined
      if (temp !== undefined) val = temp;
    }

    // Run the first constraint (type check) once more
    const [typeConstraint] = this.constraints;
    let typecheck = typeConstraint(this.name, val);
    if (typecheck instanceof Error) return typecheck;
    
    // Success
    return val;
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

const positive = () => (name, val) => {
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
  positive;
  notZero;
  range;
  constructor(name) {
    super(name);
    this.must(beIntegerFieldType)();
    this.positive = this.must(positive);
    this.notZero = this.must(notZero);
    this.range = this.must(range);
  }
}

const beFloatFieldType = () => (name, val=null) => {
  if (val !== null && typeof val !== 'number')
  return new Error(`${name} must be a float. Received ${typeof val}`);
  return val;
}

class Float extends Field {
  positive;
  notZero;
  range;
  constructor(name) {
    super(name);
    this.must(beFloatFieldType)();
    this.positive = this.must(positive);
    this.notZero = this.must(notZero);
    this.range = this.must(range);
  }
}

const beBooleanFieldType = () => (name, val=null) => {
  if (val !== null && typeof val != 'boolean')
  return new Error(`${name} must be a boolean. Received ${typeof val}`);
  return val;
}

class Boolean extends Field {
  constructor(name) {
    super(name);
    this.must(beBooleanFieldType)();
  }
}

export class Schema {
  fields = {};
  constructor(...fields) {
    for (const field of fields) {
      const { name, constraints, test, from } = field;
      this.fields[name] = { name, constraints, test, from };
    }
  }
  test(obj:object={}):boolean {
    for (const key of Object.keys(this.fields)) {
      if (!this.fields[key].test(obj[key])) {
        return false;
      }
    }
    return true;
  }
  from(input:object={}): object | Error {
    let instance = {};
    for (const key of Object.keys(this.fields)) {
      let field = this.fields[key].from(input[key]);
      if (field instanceof Error) return field;
      instance[key] = field;
    }
    return instance;
  }
}
