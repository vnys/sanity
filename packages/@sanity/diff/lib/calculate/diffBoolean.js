"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffBoolean = diffBoolean;

function diffBoolean(fromValue, toValue) {
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return {
    type: 'boolean',
    isChanged: fromValue !== toValue,
    fromValue: fromValue,
    toValue: toValue,
    path
  };
}