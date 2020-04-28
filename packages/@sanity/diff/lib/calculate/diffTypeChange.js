"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffTypeChange = diffTypeChange;

var _getType = require("./getType");

function diffTypeChange(fromValue, toValue) {
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return {
    type: 'typeChange',
    path,
    fromValue,
    toValue,
    fromType: (0, _getType.getType)(fromValue),
    toType: (0, _getType.getType)(toValue),
    isChanged: fromValue !== toValue
  };
}