"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("./schema");
var schema_2 = require("./schema");
exports.string = schema_2.string;
exports.integer = schema_2.integer;
exports.float = schema_2.float;
exports.boolean = schema_2.boolean;
function schema() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new (schema_1.Schema.bind.apply(schema_1.Schema, __spreadArrays([void 0], args)))();
}
exports.schema = schema;
//# sourceMappingURL=index.js.map