
export function string(name) {
  return new String(name);
}

const notNull = () => (name, val) => {
  if (val == null)
  throw new Error(`${name} must not be null`);
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
  test(): boolean {
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