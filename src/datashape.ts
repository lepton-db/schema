/**
 * DataShapes can be used to define data structures that
 * have logical constraints, in addition to type constraints
 */

/**
 * DataShapes  made up of Fields, which are made up of Constraints
 * See datashape.test.ts for examples of how DataShapes are composed
 */
export class DataShape {
  create: (object) => object | Error;
  fields: object;
  constructor(...fields) {
    this.create = create.bind(this);
    attachFields.bind(this)(...fields);
  }
}
/**
 * Try to create an object that conforms to a `DataShape`
 * Bound as a method to  `DataShape` instances
 */
function create(obj): object | Error {
  let data = {};
  for (const name of Object.keys(obj)) {
    const validation = this.fields[name].test(obj[name]);
    if (validation instanceof Error) return validation;
    data[name] = obj[name];
  }
  return data
}
/**
 * Assemble an array of `Field` objects as an object on `this`.
 * Bound as a construction helper to  `DataShape`
 */
function attachFields(...fields) {
  this.fields = {};
  fields.forEach(f => {
    const { name, test, tests, constraints } = f;
    this.fields[name] = { test, tests, constraints };
  });
}
/**
 * Used as a base class for concrete field types
 * @param name
 */
class Field {
  name;
  tests;
  constraints;
  must;
  notNull;
  defaultTo;
  _default;
  test; 
  constructor(name:string) {
    enforceArgumentType('name', name, 'string');
    this.name = name;
    // functions that prove/disprove constraint compliance
    this.tests = [];
    // records arg values given for each constraint
    this.constraints = {};
    // Custom constraint hook
    this.must = must.bind(this);
    // Generic constraints
    this.notNull = this.must(notNull);
    this.defaultTo = this.must(defaultTo);

    this._default = () => this.constraints.defaultTo || null;
    this.test = (val=this._default()) => this.tests.forEach(c => c(name, val));
  }
}

/**
 * Generic constraints that are available to multiple field types
 */
const notNull = () => (name, val) => {
  if (val == null)
  throw new Error(`${name} must not be null`);
}
const defaultTo = arg => (name, val) => {
  // ...
}

/**
 * Constraints available to string fields
 */

const beStringFieldType = () => (name, val) => {
  if (val != null && typeof val != 'string')
  throw new Error(`${name} must be a string. Received ${typeof val}`);
}
const minLength = arg => (name, val) => {
  if (val.length < arg)
  throw new Error(`${name} has a min length of ${arg}`)
}
const maxLength = arg => (name, val) => {
  if (val.length > arg)
  throw new Error(`${name} has a max length of ${arg}`)
}
const alphabetical = () => (name, val) => {
  if (false == /^[a-zA-Z]+$/.test(val))
  throw new Error(`${name} must only use alphabetical characters`);
}
const numeric = () => (name, val) => {
  if (false == /^\d+$/.test(val))
  throw new Error(`${name} must only use numeric characters`);
}
// https://www.regular-expressions.info/email.html
const email = () => (name, val) => {
  const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/
  if (false == /^\d+$/.test(val))
  throw new Error(`${name} must be an email address`);
}

/**
 * Constraints available to integer fields
 */

const beIntegerFieldType = () => (name, val) => {
  if (val != null && !Number.isInteger(val))
  throw new Error(`${name} must be an integer. Received ${typeof val}`);
}
const notNegative = () => (name, val) => {
  if (val < 0)
  throw new Error(`${name} must not be negative`)
}
const notZero = () => (name, val) => {
  if (val == 0)
  throw new Error(`${name} must not be 0`)
}
const range = (arg) => (name, val) => {
  const [min, max] = arg;
  if (val < min || val > max)
  throw new Error(`${name} must be between ${min} and ${max}`)
}

/**
 * Constraints available to boolean fields
 */

const beBooleanFieldType = () => (name, val) => {
  if (val != null && typeof val != 'boolean')
  throw new Error(`${name} must be a boolean. Received ${typeof val}`);
}
/**
 * The must function attached to every field type
 * which allows custom arbitrary constraints argument
 */
function must(fn) {
  return (arg=true) => {
    this.constraints[fn.name] = arg;
    this.tests.push(fn(arg))
    return this;
  }
}
/**
 * String Field
 */
export function string(name) {
  let f: any = new Field(name);
  f.constraints.type = 'string'
  f.must(beStringFieldType)();

  f.minLength = f.must(minLength);
  f.maxLength = f.must(maxLength);
  f.alphabetical = f.must(alphabetical)
  f.numeric = f.must(numeric)
  return f;
}
/**
 * Integer Field
 */
export function integer(name) {
  let f: any = new Field(name);
  f.constraints.type = 'integer';
  f.must(beIntegerFieldType)()

  f.notNegative = f.must(notNegative);
  f.notZero = f.must(notZero);
  f.range = f.must(range);
  return f;
}
/**
 * Boolean Field
 */
export function boolean(name) {
  let f: any = new Field(name);
  f.constraints.type = 'boolean';
  f.must(beBooleanFieldType)();
  return f;
}
/**
 * Helper Functions
 */
function enforceArgumentType(name, arg, type) {
  if (typeof arg !== type)
  throw new Error(`Argument "${name}" must be of type ${type}. Received type ${typeof arg}`);
}