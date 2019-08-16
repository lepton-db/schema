import { strict as assert } from 'assert';
import {
  string,
  integer,
  boolean,
  DataShape
} from './prototype';

export const tests = [
  stringFieldCreationTest,
  stringFieldTypeTest,
  stringFieldNotNullTest,
  stringFieldMinLengthTest,
  stringFieldMaxLengthTest,
  stringFieldAlphabeticalTest,
  stringFieldNumericTest,
  stringFieldMustTest,
  stringFieldChainableConstraintsTest,
  integerFieldCreationTest,
  integerFieldTypeTest,
  integerFieldNotNullTest,
  integerFieldNotNegativeTest,
  integerFieldNotZeroTest,
  integerFieldRangeTest,
  integerFieldMustTest,
  integerFieldChainableConstraintsTest,
  booleanFieldCreationTest,
  booleanFieldTypeTest,
  booleanFieldNotNullTest,
  booleanFieldMustTest,
  booleanFieldChainableConstraintsTest,
  dataShapeTestTest,
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

function integerFieldNotNegativeTest() {
  const description = `a notNegative constraint can be
  applied to integer fields, which can be checked with
  field.test()`;
  try {
    let field = integer('debt');
    assert.equal(field.test(-5), true);
    field.notNegative();
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

function integerFieldChainableConstraintsTest() {
  const description = `all constraints available to integer
  fields are chainable`;
  try {
    assert.doesNotThrow(() => {
      integer('goal')
        .notNull()
        .notNegative()
        .notZero()
        .must(x => x)
    });
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

function dataShapeTestTest() {
  const description = `Objects can be tested
  against a DataShape for validity`;

  try {
    let be = arg => (name, val) => {
      if (val !== arg)
      return new Error(`${name} must be "${arg}"`);
    }

    let cowboy = new DataShape(
      string('birthplace'),
      string('catchphrase').notNull(),
      string('firstname').minLength(1).must(be)('Juan Carlos'),
      string('lastname').maxLength(12).notNull(),
      integer('age').notNull().notNegative().notZero(),
      integer('kills').notNegative().notZero(),
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
