
export function string(name) {
  return new String(name);
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

class String extends Field {
  minLength;
  constructor(name) {
    super(name);
    this.must(beStringFieldType)();
    this.minLength = this.must(minLength);
  }
}