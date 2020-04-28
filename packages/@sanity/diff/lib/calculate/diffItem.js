"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffItem = diffItem;

var _getType = require("./getType");

var _diffArray = require("./diffArray");

var _diffBoolean = require("./diffBoolean");

var _diffString = require("./diffString");

var _diffNumber = require("./diffNumber");

var _diffTypeChange = require("./diffTypeChange");

var _diffObject = require("./diffObject");

function diffItem(fromValue, toValue) {
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var fromType = (0, _getType.getType)(fromValue);
  var toType = (0, _getType.getType)(toValue); // eg: null/undefined => string

  if ((0, _getType.isNullish)(fromValue) && !(0, _getType.isNullish)(toValue)) {
    return diffWithType(toType, fromValue, toValue, path);
  } // eg: number => null/undefined


  if (!(0, _getType.isNullish)(fromValue) && (0, _getType.isNullish)(toValue)) {
    return diffWithType(fromType, fromValue, toValue, path);
  } // eg: array => array


  if (fromType === toType) {
    return diffWithType(toType, fromValue, toValue, path);
  } // eg: number => string


  return (0, _diffTypeChange.diffTypeChange)(fromValue, toValue, path);
}

function diffWithType(type, fromValue, toValue, path) {
  switch (type) {
    case 'array':
      return (0, _diffArray.diffArray)(fromValue, toValue, path);

    case 'boolean':
      return (0, _diffBoolean.diffBoolean)(fromValue, toValue, path);

    case 'number':
      return (0, _diffNumber.diffNumber)(fromValue, toValue, path);

    case 'string':
      return (0, _diffString.diffString)(fromValue, toValue, path);

    case 'object':
      return (0, _diffObject.diffObject)(fromValue, toValue, path);

    default:
      // eg: null => null / undefined => null
      return undefined;
  }
}