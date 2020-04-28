"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getType = getType;
exports.isStringDiff = isStringDiff;
exports.isNullish = isNullish;

function getType(item) {
  if (Array.isArray(item)) {
    return 'array';
  }

  if (item === null) {
    return 'null';
  }

  var type = typeof item;

  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'object':
    case 'undefined':
      return type;

    default:
      throw new Error("Unsupported type passed to differ: ".concat(type));
  }
}

function isStringDiff(thing) {
  return thing && thing.type === 'string';
}

function isNullish(thing) {
  return thing === null || typeof thing === 'undefined';
}