"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wrapping classes with functions prevents people from inheriting from them
 */
function schema() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new (Schema.bind.apply(Schema, __spreadArrays([void 0], args)))();
}
exports.schema = schema;
function string(name) {
    return new String(name);
}
exports.string = string;
function integer(name) {
    return new Integer(name);
}
exports.integer = integer;
function float(name) {
    return new Float(name);
}
exports.float = float;
function boolean(name) {
    return new Boolean(name);
}
exports.boolean = boolean;
var notNull = function () { return function (name, val) {
    if (val == null)
        return new Error(name + " must not be null");
    return val;
}; };
var Field = /** @class */ (function () {
    function Field(name) {
        this.name = name;
        this.constraints = [];
        this.notNull = this.must(notNull);
    }
    // Apply custom field constraints
    Field.prototype.must = function (fn) {
        var _this = this;
        return function (arg) {
            _this.constraints.push(fn(arg));
            return _this;
        };
    };
    // Determine if a value fulfills field's constraints
    Field.prototype.test = function (val) {
        // Run the input value through each of the constraints
        for (var _i = 0, _a = this.constraints; _i < _a.length; _i++) {
            var constraint = _a[_i];
            var temp = constraint(this.name, val);
            // Error objects indicate Test Failure
            if (temp instanceof Error)
                return false;
            // Don't re-assign val if constraint returned undefined
            if (temp !== undefined)
                val = temp;
        }
        // Run the first constraint (type check) once more
        var typeConstraint = this.constraints[0];
        if (typeConstraint(this.name, val) instanceof Error)
            return false;
        return true;
    };
    // Run a value through all field constraints
    Field.prototype.validate = function (val) {
        var _this = this;
        var errors = [];
        // Run the input value through each of the constraints
        this.constraints.forEach(function (constraint) {
            var temp = constraint(_this.name, val);
            // Error objects indicate Test Failure
            if (temp instanceof Error)
                return errors.push(temp);
            // Don't re-assign val if constraint returned undefined
            if (temp !== undefined)
                val = temp;
        });
        // Run the first constraint (type check) once more
        var typeConstraint = this.constraints[0];
        var typeValidation = typeConstraint(this.name, val);
        if (typeValidation instanceof Error)
            errors.push(typeValidation);
        return [val, errors];
    };
    return Field;
}());
var beStringFieldType = function () { return function (name, val) {
    if (val === void 0) { val = null; }
    if (val !== null && typeof val != 'string')
        return new Error(name + " must be a string. Received " + typeof val);
    return val;
}; };
var minLength = function (arg) { return function (name, val) {
    if (!val || val.length < arg)
        return new Error(name + " has a min length of " + arg);
    return val;
}; };
var maxLength = function (arg) { return function (name, val) {
    if (!val || val.length > arg)
        return new Error(name + " has a max length of " + arg);
    return val;
}; };
var alphabetical = function (arg) { return function (name, val) {
    if (false == /^[a-zA-Z]+$/.test(val))
        return new Error(name + " must only use alphabetical characters");
    return val;
}; };
var numeric = function () { return function (name, val) {
    if (false == /^\d+$/.test(val))
        return new Error(name + " must only use numeric characters");
    return val;
}; };
// https://www.regular-expressions.info/email.html
var email = function () { return function (name, val) {
    var pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/;
    if (false == pattern.test(val))
        return new Error(name + " must be an email address");
    return val;
}; };
var String = /** @class */ (function (_super) {
    __extends(String, _super);
    function String(name) {
        var _this = _super.call(this, name) || this;
        _this.must(beStringFieldType)();
        _this.minLength = _this.must(minLength);
        _this.maxLength = _this.must(maxLength);
        _this.alphabetical = _this.must(alphabetical);
        _this.numeric = _this.must(numeric);
        return _this;
    }
    return String;
}(Field));
var beIntegerFieldType = function () { return function (name, val) {
    if (val === void 0) { val = null; }
    if (val !== null && !Number.isInteger(val))
        return new Error(name + " must be an integer. Received " + typeof val);
    return val;
}; };
var positive = function () { return function (name, val) {
    if (val < 0)
        return new Error(name + " must not be negative");
    return val;
}; };
var notZero = function () { return function (name, val) {
    if (val == 0)
        return new Error(name + " must not be 0");
    return val;
}; };
var range = function (arg) { return function (name, val) {
    var min = arg[0], max = arg[1];
    if (val < min || val > max)
        return new Error(name + " must be between " + min + " and " + max);
}; };
var Integer = /** @class */ (function (_super) {
    __extends(Integer, _super);
    function Integer(name) {
        var _this = _super.call(this, name) || this;
        _this.must(beIntegerFieldType)();
        _this.positive = _this.must(positive);
        _this.notZero = _this.must(notZero);
        _this.range = _this.must(range);
        return _this;
    }
    return Integer;
}(Field));
var beFloatFieldType = function () { return function (name, val) {
    if (val === void 0) { val = null; }
    if (val !== null && typeof val !== 'number')
        return new Error(name + " must be a float. Received " + typeof val);
    return val;
}; };
var Float = /** @class */ (function (_super) {
    __extends(Float, _super);
    function Float(name) {
        var _this = _super.call(this, name) || this;
        _this.must(beFloatFieldType)();
        _this.positive = _this.must(positive);
        _this.notZero = _this.must(notZero);
        _this.range = _this.must(range);
        return _this;
    }
    return Float;
}(Field));
var beBooleanFieldType = function () { return function (name, val) {
    if (val === void 0) { val = null; }
    if (val !== null && typeof val != 'boolean')
        return new Error(name + " must be a boolean. Received " + typeof val);
    return val;
}; };
var Boolean = /** @class */ (function (_super) {
    __extends(Boolean, _super);
    function Boolean(name) {
        var _this = _super.call(this, name) || this;
        _this.must(beBooleanFieldType)();
        return _this;
    }
    return Boolean;
}(Field));
var Schema = /** @class */ (function () {
    function Schema() {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        this.fields = {};
        for (var _a = 0, fields_1 = fields; _a < fields_1.length; _a++) {
            var field = fields_1[_a];
            var name_1 = field.name, constraints = field.constraints, test = field.test, validate = field.validate;
            this.fields[name_1] = { name: name_1, constraints: constraints, test: test, validate: validate };
        }
    }
    Schema.prototype.validate = function (obj) {
        if (obj === void 0) { obj = {}; }
        var resultObj = {};
        var resultErrors = [];
        for (var _i = 0, _a = Object.keys(this.fields); _i < _a.length; _i++) {
            var key = _a[_i];
            var _b = this.fields[key].validate(obj[key]), val = _b[0], errors = _b[1];
            resultObj[key] = val;
            errors.forEach(function (e) { return resultErrors.push(e); });
        }
        return [resultObj, resultErrors];
    };
    return Schema;
}());
exports.Schema = Schema;
//# sourceMappingURL=schema.js.map