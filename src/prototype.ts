
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
  must(fn: (arg) => any) {
    return (arg=true) => {
      this.constraints.push(fn(arg))
      return this;
    }
  }
}

class String extends Field {
  constructor(name) {
    super(name);
    // ...
  }
}