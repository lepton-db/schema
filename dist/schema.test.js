"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var index_1 = require("./index");
exports.tests = [
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
    floatFieldNotNullTest,
    floatFieldPositiveTest,
    floatFieldNotZeroTest,
    floatFieldRangeTest,
    floatFieldMustTest,
    floatFieldMustMutateTest,
    floatFieldChainableConstraintsTest,
    booleanFieldCreationTest,
    booleanFieldTypeTest,
    booleanFieldNotNullTest,
    booleanFieldMustTest,
    booleanFieldMustMutateTest,
    booleanFieldChainableConstraintsTest,
    fieldUndefinedConstraintReturnTest,
    schemaFromTest,
];
function stringFieldCreationTest() {
    var description = "string fields can be created\n  and posess the expected properties";
    try {
        var field = index_1.string('catchphrase');
        assert_1.strict(field.name == 'catchphrase');
        assert_1.strict(Array.isArray(field.constraints));
        assert_1.strict(typeof field.test == 'function');
    }
    catch (e) {
        return e;
    }
}
function stringFieldTypeTest() {
    var description = "string fields will not\n  accept non-string values";
    try {
        var field = index_1.string('sentence');
        assert_1.strict.equal(field.test(5), false);
        assert_1.strict.equal(field.test({ type: 'string' }), false);
        assert_1.strict.equal(field.test(), true);
        assert_1.strict.equal(field.test(null), true);
        assert_1.strict.equal(field.test(''), true);
    }
    catch (e) {
        return e;
    }
}
function stringFieldNotNullTest() {
    var description = "a notNull constraint can be\n  applied to string fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.string('catchphrase');
        assert_1.strict.equal(field.test(), true);
        field.notNull();
        assert_1.strict.equal(field.test(), false);
    }
    catch (e) {
        return e;
    }
}
function stringFieldMinLengthTest() {
    var description = "a minLength constraint can be\n  applied to string fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.string('uuid');
        assert_1.strict.equal(field.test(), true);
        field.minLength(4);
        assert_1.strict.equal(field.test(), false);
    }
    catch (e) {
        return e;
    }
}
function stringFieldMaxLengthTest() {
    var description = "a maxLength constraint can be\n  applied to string fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.string('greeting');
        assert_1.strict.equal(field.test('howdy partner'), true);
        field.maxLength(5);
        assert_1.strict.equal(field.test('howdy partner'), false);
    }
    catch (e) {
        return e;
    }
}
function stringFieldAlphabeticalTest() {
    var description = "an alphabetical constraint can be\n  applied to string fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.string('droid');
        assert_1.strict.equal(field.test('c3po'), true);
        field.alphabetical();
        assert_1.strict.equal(field.test('c3po'), false);
    }
    catch (e) {
        return e;
    }
}
function stringFieldNumericTest() {
    var description = "a numeric constraint can be\n  applied to string fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.string('droid');
        assert_1.strict.equal(field.test('r2d2'), true);
        field.numeric();
        assert_1.strict.equal(field.test('r2d2'), false);
    }
    catch (e) {
        return e;
    }
}
function stringFieldMustTest() {
    var description = "an arbitrary constraint function\n  can be applied to string fields that accepts an arg, and\n  can be checked with field.test()";
    try {
        var field = index_1.string('password');
        assert_1.strict.equal(field.test('try_and_break_this'), true);
        // Custom constraint
        var include = function (arg) { return function (name, val) {
            if (!val.includes(arg))
                return new Error(name + " must contain \"" + arg + "\"");
            return val;
        }; };
        field.must(include)('!');
        assert_1.strict.equal(field.test('try_and_break_this'), false);
    }
    catch (e) {
        return e;
    }
}
function stringFieldMustMutateTest() {
    var description = "String fields can apply\n  must() to transform the input value.";
    // This will transform the input value
    var obscure = function (arg) { return function (name, val) { return val.split('').map(function (c) { return '*'; }).join(''); }; };
    var beObscured = function (arg) { return function (name, val) {
        for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
            var char = val_1[_i];
            if (char != arg)
                return new Error(name + " must be obscured with \"" + arg + "\"");
        }
        return val;
    }; };
    try {
        var field = index_1.string('password');
        assert_1.strict.equal(field.test('hello'), true);
        field.must(obscure)();
        field.must(beObscured)('*');
        assert_1.strict.equal(field.test('hello'), true);
    }
    catch (e) {
        return e;
    }
}
function stringFieldChainableConstraintsTest() {
    var description = "all constraints available to string\n  fields are chainable";
    try {
        assert_1.strict.doesNotThrow(function () {
            index_1.string('mission')
                .notNull()
                .minLength(8)
                .maxLength(32)
                .alphabetical()
                .must(function (x) { return x; });
        });
    }
    catch (e) {
        return e;
    }
}
function integerFieldCreationTest() {
    var description = "integer fields can be created\n  and posess the expected properties";
    try {
        var field = index_1.integer('salary');
        assert_1.strict(field.name == 'salary');
        assert_1.strict(Array.isArray(field.constraints));
        assert_1.strict(typeof field.must == 'function');
    }
    catch (e) {
        return e;
    }
}
function integerFieldTypeTest() {
    var description = "integer fields won't\n  accept non-integer non-empty values";
    try {
        var field = index_1.integer('dollars');
        assert_1.strict.equal(field.test(), true);
        assert_1.strict.equal(field.test(null), true);
        assert_1.strict.equal(field.test(0), true);
        assert_1.strict.equal(field.test(1), true);
        assert_1.strict.equal(field.test(-1), true);
        assert_1.strict.equal(field.test('true'), false);
        assert_1.strict.equal(field.test(.5), false);
        assert_1.strict.equal(field.test([]), false);
        assert_1.strict.equal(field.test({}), false);
    }
    catch (e) {
        return e;
    }
}
function integerFieldNotNullTest() {
    var description = "a notNull constraint can be\n  applied to integer fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.integer('salary');
        assert_1.strict.equal(field.test(), true);
        field.notNull();
        assert_1.strict.equal(field.test(), false);
    }
    catch (e) {
        return e;
    }
}
function integerFieldPositiveTest() {
    var description = "a positive constraint can be\n  applied to integer fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.integer('debt');
        assert_1.strict.equal(field.test(-5), true);
        field.positive();
        assert_1.strict.equal(field.test(-5), false);
    }
    catch (e) {
        return e;
    }
}
function integerFieldNotZeroTest() {
    var description = "a notZero constraint can be\n  applied to integer fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.integer('debt');
        assert_1.strict.equal(field.test(0), true);
        field.notZero();
        assert_1.strict.equal(field.test(0), false);
    }
    catch (e) {
        return e;
    }
}
function integerFieldRangeTest() {
    var description = "a range constraint can be\n  applied to integer fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.integer('month');
        assert_1.strict.equal(field.test(0), true);
        field.range([1, 2]);
        assert_1.strict.equal(field.test(0), false);
    }
    catch (e) {
        return e;
    }
}
function integerFieldMustTest() {
    var description = "an arbitrary constraint function\n  can be applied to integer fields that accepts an arg, and\n  can be checked with field.test()";
    try {
        var field = index_1.integer('repetitions');
        assert_1.strict.equal(field.test(7), true);
        // Custom constraint
        var divideBy = function (arg) { return function (name, val) {
            if (val % arg != 0)
                return new Error(name + " must be divisible by " + arg);
            return val;
        }; };
        field.must(divideBy)(4);
        assert_1.strict.equal(field.test(7), false);
    }
    catch (e) {
        return e;
    }
}
function integerFieldMustMutateTest() {
    var description = "Integer fields can apply\n  must() to transform the input value.";
    // This will transform the input value
    var magnitude = function (arg) { return function (name, val) { return Math.abs(val); }; };
    try {
        var field = index_1.integer('distance');
        field.must(magnitude)();
        field.positive();
        assert_1.strict.equal(field.test(-5), true);
    }
    catch (e) {
        return e;
    }
}
function integerFieldChainableConstraintsTest() {
    var description = "all constraints available to integer\n  fields are chainable";
    try {
        assert_1.strict.doesNotThrow(function () {
            index_1.integer('goal')
                .notNull()
                .positive()
                .notZero()
                .must(function (x) { return x; });
        });
    }
    catch (e) {
        return e;
    }
}
function floatFieldCreationTest() {
    var description = "float fields can be created\n  and posess the expected properties";
    try {
        var field = index_1.float('shippingCost');
        assert_1.strict(field.name == 'shippingCost');
        assert_1.strict(Array.isArray(field.constraints));
        assert_1.strict(typeof field.test == 'function');
    }
    catch (e) {
        return e;
    }
}
function floatFieldTypeTest() {
    var description = "float fields won't\n  accept non-number non-void values";
    try {
        var field = index_1.float('dollars');
        assert_1.strict.equal(field.test(Math.PI), true);
        assert_1.strict.equal(field.test(), true);
        assert_1.strict.equal(field.test(null), true);
        assert_1.strict.equal(field.test(0), true);
        assert_1.strict.equal(field.test(1), true);
        assert_1.strict.equal(field.test(-1), true);
        assert_1.strict.equal(field.test('true'), false);
        assert_1.strict.equal(field.test(.5), true);
        assert_1.strict.equal(field.test([]), false);
        assert_1.strict.equal(field.test({}), false);
    }
    catch (e) {
        return e;
    }
}
function floatFieldNotNullTest() {
    var description = "a notNull constraint can be\n  applied to float fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.float('salary');
        assert_1.strict.equal(field.test(), true);
        field.notNull();
        assert_1.strict.equal(field.test(), false);
    }
    catch (e) {
        return e;
    }
}
function floatFieldPositiveTest() {
    var description = "a positive constraint can be\n  applied to float fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.float('debt');
        assert_1.strict.equal(field.test(-5), true);
        field.positive();
        assert_1.strict.equal(field.test(-5), false);
    }
    catch (e) {
        return e;
    }
}
function floatFieldNotZeroTest() {
    var description = "a notZero constraint can be\n  applied to float fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.float('debt');
        assert_1.strict.equal(field.test(0), true);
        field.notZero();
        assert_1.strict.equal(field.test(0), false);
    }
    catch (e) {
        return e;
    }
}
function floatFieldRangeTest() {
    var description = "a range constraint can be\n  applied to float fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.float('month');
        assert_1.strict.equal(field.test(0), true);
        field.range([1, 2]);
        assert_1.strict.equal(field.test(0), false);
    }
    catch (e) {
        return e;
    }
}
function floatFieldMustTest() {
    var description = "an arbitrary constraint function\n  can be applied to float fields that accepts an arg, and\n  can be checked with field.test()";
    try {
        var field = index_1.float('repetitions');
        assert_1.strict.equal(field.test(7), true);
        // Custom constraint
        var divideBy = function (arg) { return function (name, val) {
            if (val % arg != 0)
                return new Error(name + " must be divisible by " + arg);
            return val;
        }; };
        field.must(divideBy)(4);
        assert_1.strict.equal(field.test(7), false);
    }
    catch (e) {
        return e;
    }
}
function floatFieldMustMutateTest() {
    var description = "Float fields can apply\n  must() to transform the input value.";
    // This will transform the input value
    var magnitude = function (arg) { return function (name, val) { return Math.abs(val); }; };
    try {
        var field = index_1.float('distance');
        field.must(magnitude)();
        field.positive();
        assert_1.strict.equal(field.test(-5), true);
    }
    catch (e) {
        return e;
    }
}
function floatFieldChainableConstraintsTest() {
    var description = "all constraints available to float \n  fields are chainable";
    try {
        assert_1.strict.doesNotThrow(function () {
            index_1.float('goal')
                .notNull()
                .positive()
                .notZero()
                .must(function (x) { return x; });
        });
    }
    catch (e) {
        return e;
    }
}
function booleanFieldCreationTest() {
    var description = "boolean fields can be created\n  and posess the expected properties";
    try {
        var field = index_1.boolean('freeShipping');
        assert_1.strict(field.name == 'freeShipping');
        assert_1.strict(Array.isArray(field.constraints));
        assert_1.strict(typeof field.test == 'function');
    }
    catch (e) {
        return e;
    }
}
function booleanFieldTypeTest() {
    var description = "boolean fields won't\n  accept non-boolean non-empty values";
    try {
        var field = index_1.boolean('single');
        assert_1.strict.equal(field.test(), true);
        assert_1.strict.equal(field.test(null), true);
        assert_1.strict.equal(field.test(true), true);
        assert_1.strict.equal(field.test(false), true);
        assert_1.strict.equal(field.test('true'), false);
        assert_1.strict.equal(field.test(5), false);
        assert_1.strict.equal(field.test([]), false);
        assert_1.strict.equal(field.test({}), false);
    }
    catch (e) {
        return e;
    }
}
function booleanFieldNotNullTest() {
    var description = "a notNull constraint can be\n  applied to boolean fields, which can be checked with\n  field.test()";
    try {
        var field = index_1.boolean('oldEnough');
        assert_1.strict.equal(field.test(), true);
        field.notNull();
        assert_1.strict.equal(field.test(), false);
    }
    catch (e) {
        return e;
    }
}
function booleanFieldMustTest() {
    var description = "an arbitrary constraint function\n  can be applied to boolean fields that accepts an arg, and\n  can be checked with field.test()";
    try {
        var field = index_1.boolean('lucky');
        assert_1.strict.equal(field.test(true), true);
        var beTrueAnd = function (arg) { return function (name, val) {
            if (!(arg && val))
                return new Error(name + " and " + arg + " are not both true");
            return val;
        }; };
        field.must(beTrueAnd)(false);
        assert_1.strict.equal(field.test(true), false);
    }
    catch (e) {
        return e;
    }
}
function booleanFieldMustMutateTest() {
    var description = "Boolean fields can apply\n  must() to transform the input value.";
    // This will transform the input value
    var become = function (arg) { return function (name, val) { return arg; }; };
    var beFalse = function (arg) { return function (name, val) {
        return (false == val) ? val : new Error(name + " must be false");
    }; };
    try {
        var field = index_1.boolean('confirmed');
        field.must(become)(false);
        field.must(beFalse)();
        assert_1.strict.equal(field.test(true), true);
    }
    catch (e) {
        return e;
    }
}
function booleanFieldChainableConstraintsTest() {
    var description = "all constraints available to boolean\n  fields are chainable";
    try {
        var andFalse_1 = function (arg) { return function (name, val) {
            if (!(val && false))
                return new Error(name + " and false must both be true");
            return val;
        }; };
        var beTrueAnd_1 = function (arg) { return function (name, val) {
            if (!(arg && val))
                return new Error(name + " and " + arg + " are not both true");
            return val;
        }; };
        assert_1.strict.doesNotThrow(function () {
            index_1.boolean('success')
                .notNull()
                .must(andFalse_1)()
                .must(beTrueAnd_1)(true);
        });
    }
    catch (e) {
        return e;
    }
}
function fieldUndefinedConstraintReturnTest() {
    var description = "Constraints that return\n  undefined will not transform the input.";
    // This will NOT transform the input value
    var chill = function (arg) { return function (name, val) {
        return;
    }; };
    var stillBe = function (arg) { return function (name, val) {
        return val == arg ? val : new Error(name + " must be " + val);
    }; };
    try {
        var field = index_1.string('thoughts');
        field.must(chill)();
        field.must(stillBe)('awake');
        assert_1.strict.equal(field.test('awake'), true);
    }
    catch (e) {
        return e;
    }
}
function schemaFromTest() {
    var description = "Objects can be created \n  under the enforcement of schema.apply()";
    try {
        var be = function (arg) { return function (name, val) {
            if (val !== arg)
                return new Error(name + " must be \"" + arg + "\"");
        }; };
        var cowboySchema = index_1.schema(index_1.string('birthplace'), index_1.string('catchphrase').notNull(), index_1.string('firstname').minLength(1).must(be)('Juan Carlos'), index_1.string('lastname').maxLength(12).notNull(), index_1.integer('age').notNull().positive().notZero(), index_1.integer('kills').positive().notZero());
        var input = {
            birthplace: 'Rio Grande',
            catchphrase: 'It\'s high noon',
            firstname: 'Juan Carlos',
            lastname: 'Riviera',
            age: 46,
            kills: 4,
        };
        var _a = cowboySchema.validate(input), output = _a[0], errors = _a[1];
        assert_1.strict.deepEqual(input, output);
        assert_1.strict.equal(errors.length, 0);
        var badInput = {
            catchphrase: 'Get along lil doggy',
            firstname: 'Rattlesnake Bill',
            lastname: 'Turner',
            age: 37,
            kills: 0,
        };
        var _b = cowboySchema.validate(badInput), badOutput = _b[0], badErrors = _b[1];
        assert_1.strict.equal(badOutput['birthplace'], null);
        assert_1.strict.equal(badErrors.length, 2);
        assert_1.strict.equal(badErrors[0].message, 'firstname must be "Juan Carlos"');
        assert_1.strict.equal(badErrors[1].message, 'kills must not be 0');
    }
    catch (e) {
        return e;
    }
}
//# sourceMappingURL=schema.test.js.map