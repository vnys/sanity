"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffNumber = diffNumber;

function diffNumber(fromValue, toValue) {
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return {
    type: 'number',
    isChanged: fromValue !== toValue,
    fromValue: fromValue,
    toValue: toValue,
    path
  };
}