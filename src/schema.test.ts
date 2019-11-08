import { strict as assert } from 'assert';
import {
  string,
  integer,
  float,
  boolean,
  schema,
} from './index';

export const tests = [
  stringFieldCreationTest,
  stringFieldTypeTest,
  stringFieldNotNullTest,
  stringFieldMinLengthTest,
  stringFieldMaxLengthTest,
  stringFieldAlphabeticalTest,
  stringFieldNumericTest,
  stringFieldMustTest,
  stringFieldMustMutateTest,
  stringFieldChainableConstraintsTest,
  integerFieldCreationTest,
  integerFieldTypeTest,
  integerFieldNotNullTest,
  integerFieldPositiveTest,
  integerFieldNotZeroTest,
  integerFieldRangeTest,
  integerFieldMustTest,
  integerFieldMustMutateTest,
  integerFieldChainableConstraintsTest,
  floatFieldCreationTest,
  floatFieldTypeTest,
  booleanFieldCreationTest,
  booleanFieldTypeTest,
  booleanFieldNotNullTest,
  booleanFieldMustTest,
  booleanFieldMustMutateTest,
  booleanFieldChainableConstraintsTest,
  fieldUndefinedConstraintReturnTest,
  dataShapeTestTest,
  dataShapeFromTest,
];

function stringFieldCreationTest() {
  const description = `string fields can be created
  and posess the expected properties`;
  try {
    let field = string('catchphrase');
    assert(field.name == 'catchphrase');
    assert(Array.isArray(field.constraints));
    assert(typeof field.test == 'function');
  } catch (e) {
    return e;
  }
}

function stringFieldTypeTest() {
  const description = `string fields will not
  accept non-string values`;
  try {
    let field = string('sentence');
    assert.equal(field.test(5), false);
    assert.equal(field.test({ type: 'string' }), false);
    assert.equal(field.test(), true);
    assert.equal(field.test(null), true);
    assert.equal(field.test(''), true);
  } catch (e) {
    return e;
  }
}

function stringFieldNotNullTest() {
  const description = `a notNull constraint can be
  applied to string fields, which can be checked with
  field.test()`;

  try {
    let field = string('catchphrase');
    assert.equal(field.test(), true);
    field.notNull();
    assert.equal(field.test(), false);
  } catch (e) {
    return e;
  }
}

function stringFieldMinLengthTest() {
  const description = `a minLength constraint can be
  applied to string fields, which can be checked with
  field.test()`;

  try {
    let field = string('uuid');
    assert.equal(field.test(), true);
    field.minLength(4);
    assert.equal(field.test(), false);
  } catch (e) {
    return e;
  }
}

function stringFieldMaxLengthTest() {
  const description = `a maxLength constraint can be
  applied to string fields, which can be checked with
  field.test()`;

  try {
    let field = string('greeting');
    assert.equal(field.test('howdy partner'), true);
    field.maxLength(5);
    assert.equal(field.test('howdy partner'), false);
  } catch (e) {
    return e;
  }
}

function stringFieldAlphabeticalTest() {
  const description = `an alphabetical constraint can be
  applied to string fields, which can be checked with
  field.test()`;
  try {
    let field = string('droid');
    assert.equal(field.test('c3po'), true);
    field.alphabetical();
    assert.equal(field.test('c3po'), false);
  } catch (e) {
    return e;
  }
}

function stringFieldNumericTest() {
  const description = `a numeric constraint can be
  applied to string fields, which can be checked with
  field.test()`;

  try {
    let field = string('droid');
    assert.equal(field.test('r2d2'), true);
    field.numeric();
    assert.equal(field.test('r2d2'), false);
  } catch (e) {
    return e;
  }
}

function stringFieldMustTest() {
  const description = `an arbitrary constraint function
  can be applied to string fields that accepts an arg, and
  can be checked with field.test()`;
  try {
    let field = string('password');
    assert.equal(field.test('try_and_break_this'), true);

    // Custom constraint
    const include = arg => (name, val) => {
      if (!val.includes(arg))
      return new Error(`${name} must contain "${arg}"`);
      return val;
    }

    field.must(include)('!');
    assert.equal(field.test('try_and_break_this'), false);
  } catch (e) {
    return e;
  }
}

function stringFieldMustMutateTest() {
  const description = `String fields can apply
  must() to transform the input value.`

  // This will transform the input value
  let obscure = arg => (name, val) => val.split('').map(c => '*').join('');

  let beObscured = arg => (name, val) => {
    for (let char of val) {
      if (char != arg)
      return new Error(`${name} must be obscured with "${arg}"`)
    }
    return val;
  }
  
  try {
    let field = string('password');
    assert.equal(field.test('hello'), true);
    field.must(obscure)();
    field.must(beObscured)('*');
    assert.equal(field.test('hello'), true);
  } catch (e) {
    return e;
  }
}

function stringFieldChainableConstraintsTest() {
  const description = `all constraints available to string
  fields are chainable`;
  try {
    assert.doesNotThrow(() => {
      string('mission')
        .notNull()
        .minLength(8)
        .maxLength(32)
        .alphabetical()
        .must(x => x)
    });
  } catch (e) {
    return e;
  }
}

function integerFieldCreationTest() {
  const description = `integer fields can be created
  and posess the expected properties`;

  try {
    let field = integer('salary');
    assert(field.name == 'salary');
    assert(Array.isArray(field.constraints));
    assert(typeof field.must == 'function');
  } catch (e) {
    return e;
  }
}

function integerFieldTypeTest() {
  const description = `integer fields won't
  accept non-integer non-empty values`;
  try {
    let field = integer('dollars');
    assert.equal(field.test(), true);
    assert.equal(field.test(null), true);
    assert.equal(field.test(0), true);
    assert.equal(field.test(1), true);
    assert.equal(field.test(-1), true);
    assert.equal(field.test('true'), false);
    assert.equal(field.test(.5), false);
    assert.equal(field.test([]), false);
    assert.equal(field.test({}), false);
  } catch (e) {
    return e;
  }
}

function integerFieldNotNullTest() {
  const description = `a notNull constraint can be
  applied to integer fields, which can be checked with
  field.test()`;

  try {
    let field = integer('salary');
    assert.equal(field.test(), true);
    field.notNull();
    assert.equal(field.test(), false);
  } catch (e) {
    return e;
  }
}

function integerFieldPositiveTest() {
  const description = `a positive constraint can be
  applied to integer fields, which can be checked with
  field.test()`;
  try {
    let field = integer('debt');
    assert.equal(field.test(-5), true);
    field.positive();
    assert.equal(field.test(-5), false);
  } catch (e) {
    return e;
  }
}

function integerFieldNotZeroTest() {
  const description = `a notZero constraint can be
  applied to integer fields, which can be checked with
  field.test()`;
  try {
    let field = integer('debt');
    assert.equal(field.test(0), true);
    field.notZero();
    assert.equal(field.test(0), false);
  } catch (e) {
    return e;
  }
}

function integerFieldRangeTest() {
  const description = `a range constraint can be
  applied to integer fields, which can be checked with
  field.test()`;
  try {
    let field = integer('month');
    assert.equal(field.test(0), true);
    field.range([1, 2]);
    assert.equal(field.test(0), false);
  } catch (e) {
    return e;
  }
}

function integerFieldMustTest() {
  const description = `an arbitrary constraint function
  can be applied to integer fields that accepts an arg, and
  can be checked with field.test()`;
  try {
    let field = integer('repetitions');
    assert.equal(field.test(7), true);

    // Custom constraint
    const divideBy = arg => (name, val) => {
      if (val % arg != 0)
      return new Error(`${name} must be divisible by ${arg}`);
      return val;
    }
    field.must(divideBy)(4);
    assert.equal(field.test(7), false);
  } catch (e) {
    return e;
  }
}

function integerFieldMustMutateTest() {
  const description = `Integer fields can apply
  must() to transform the input value.`

  // This will transform the input value
  let magnitude = arg => (name, val) => Math.abs(val);

  try {
    let field = integer('distance');
    field.must(magnitude)();
    field.positive();
    assert.equal(field.test(-5), true);
  } catch (e) {
    return e;
  }
}

function integerFieldChainableConstraintsTest() {
  const description = `all constraints available to integer
  fields are chainable`;
  try {
    assert.doesNotThrow(() => {
      integer('goal')
        .notNull()
        .positive()
        .notZero()
        .must(x => x)
    });
  } catch (e) {
    return e;
  }
}

function floatFieldCreationTest() {
  const description = `float fields can be created
  and posess the expected properties`;
  try {
    let field = float('shippingCost');
    assert(field.name == 'shippingCost');
    assert(Array.isArray(field.constraints));
    assert(typeof field.test == 'function');
  } catch (e) {
    return e;
  }
}

function floatFieldTypeTest() {
  const description = `float fields won't
  accept non-number non-void values`;
  try {
    let field = float('dollars');
    assert.equal(field.test(Math.PI), true);
    assert.equal(field.test(), true);
    assert.equal(field.test(null), true);
    assert.equal(field.test(0), true);
    assert.equal(field.test(1), true);
    assert.equal(field.test(-1), true);
    assert.equal(field.test('true'), false);
    assert.equal(field.test(.5), true);
    assert.equal(field.test([]), false);
    assert.equal(field.test({}), false);
  } catch (e) {
    return e;
  }
}


function booleanFieldCreationTest() {
  const description = `boolean fields can be created
  and posess the expected properties`;
  try {
    let field = boolean('freeShipping');
    assert(field.name == 'freeShipping');
    assert(Array.isArray(field.constraints));
    assert(typeof field.test == 'function');
  } catch (e) {
    return e;
  }
}

function booleanFieldTypeTest() {
  const description = `boolean fields won't
  accept non-boolean non-empty values`;
  try {
    let field = boolean('single');
    assert.equal(field.test(), true);
    assert.equal(field.test(null), true);
    assert.equal(field.test(true), true);
    assert.equal(field.test(false), true);
    assert.equal(field.test('true'), false);
    assert.equal(field.test(5), false);
    assert.equal(field.test([]), false);
    assert.equal(field.test({}), false);
  } catch (e) {
    return e;
  }
}

function booleanFieldNotNullTest() {
  const description = `a notNull constraint can be
  applied to boolean fields, which can be checked with
  field.test()`;
  try {
    let field = boolean('oldEnough');
    assert.equal(field.test(), true);
    field.notNull();
    assert.equal(field.test(), false);
  } catch (e) {
    return e;
  }
}

function booleanFieldMustTest() {
  const description = `an arbitrary constraint function
  can be applied to boolean fields that accepts an arg, and
  can be checked with field.test()`;
  try {
    let field = boolean('lucky');
    assert.equal(field.test(true), true);

    const beTrueAnd = arg => (name, val) => {
      if (!(arg && val)) 
      return new Error(`${name} and ${arg} are not both true`);
      return val;
    }

    field.must(beTrueAnd)(false);
    assert.equal(field.test(true), false);
  } catch (e) {
    return e;
  }
}

function booleanFieldMustMutateTest() {
  const description = `Boolean fields can apply
  must() to transform the input value.`

  // This will transform the input value
  let become = arg => (name, val) => arg;

  let beFalse = arg => (name, val) => {
    return (false == val) ? val : new Error(`${name} must be false`);
  }

  try {
    let field = boolean('confirmed');
    field.must(become)(false);
    field.must(beFalse)();
    assert.equal(field.test(true), true);
  } catch (e) {
    return e;
  }
}

function booleanFieldChainableConstraintsTest() {
  const description = `all constraints available to boolean
  fields are chainable`;
  try {
    const andFalse = arg => (name, val) => {
      if (!(val && false))
      return new Error(`${name} and false must both be true`);
      return val;
    }
    const beTrueAnd = arg => (name, val) => {
      if (!(arg && val)) 
      return new Error(`${name} and ${arg} are not both true`);
      return val;
    }

    assert.doesNotThrow(() => {
      boolean('success')
        .notNull()
        .must(andFalse)()
        .must(beTrueAnd)(true)
    });
  } catch (e) {
    return e;
  }
}

function fieldUndefinedConstraintReturnTest() {
  const description = `Constraints that return
  undefined will not transform the input.`

  // This will NOT transform the input value
  let chill = arg => (name, val) => {
    return;
  };

  let stillBe = arg => (name, val) => {
    return val == arg ? val : new Error(`${name} must be ${val}`);
  }

  try {
    let field = string('thoughts');
    field.must(chill)();
    field.must(stillBe)('awake');
    assert.equal(field.test('awake'), true);
  } catch (e) {
    return e;
  }
}

function dataShapeTestTest() {
  const description = `Objects can be tested
  against a Schema for validity`;

  try {
    let be = arg => (name, val) => {
      if (val !== arg)
      return new Error(`${name} must be "${arg}"`);
    }

    let cowboy = schema(
      string('birthplace'),
      string('catchphrase').notNull(),
      string('firstname').minLength(1).must(be)('Juan Carlos'),
      string('lastname').maxLength(12).notNull(),
      integer('age').notNull().positive().notZero(),
      integer('kills').positive().notZero(),
    )

    assert.equal(
      cowboy.test({
        birthplace: 'Rio Grande',
        catchphrase: 'It\'s high noon',
        firstname: 'Juan Carlos',
        lastname: 'Riviera',
        age: 46,
        kills: 4,
      }),
      true
    );

    assert.equal(
      cowboy.test({
        catchphrase: 'Get along lil doggy',
        firstname: 'Rattlesnake Bill',
        lastname: 'Turner',
        age: 37,
        kills: 0,
      }),
      false,
    );
  } catch (e) {
    return e;
  }
}

function dataShapeFromTest() {
  const description = `Objects can be created 
  under the enforcement of Schema.from()`;

  try {
    let be = arg => (name, val) => {
      if (val !== arg)
      return new Error(`${name} must be "${arg}"`);
    }

    let cowboy = schema(
      string('birthplace'),
      string('catchphrase').notNull(),
      string('firstname').minLength(1).must(be)('Juan Carlos'),
      string('lastname').maxLength(12).notNull(),
      integer('age').notNull().positive().notZero(),
      integer('kills').positive().notZero(),
    )

    let input = {
      birthplace: 'Rio Grande',
      catchphrase: 'It\'s high noon',
      firstname: 'Juan Carlos',
      lastname: 'Riviera',
      age: 46,
      kills: 4,
    }

    assert.deepEqual(
      cowboy.from(input),
      input,
    );

    let badInput = {
      catchphrase: 'Get along lil doggy',
      firstname: 'Rattlesnake Bill',
      lastname: 'Turner',
      age: 37,
      kills: 0,
    }

    let maybeCowboy = cowboy.from(badInput);
    assert.equal(
      maybeCowboy instanceof Error,
      true,
    );

    assert.equal(
      // @ts-ignore
      maybeCowboy.message,
      'firstname must be "Juan Carlos"',
    );

  } catch (e) {
    return e;
  }
}

