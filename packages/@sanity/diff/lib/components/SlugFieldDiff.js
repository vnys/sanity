"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlugFieldDiff = void 0;

var React = _interopRequireWildcard(require("react"));

var _StringFieldDiff = require("./StringFieldDiff");

var _getType = require("../calculate/getType");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SlugFieldDiff = (_ref) => {
  var schemaType = _ref.schemaType,
      fields = _ref.fields;
  var current = (0, _getType.isStringDiff)(fields.current) ? fields.current : null;

  if (!current) {
    return null;
  }

  var currentSchema = (schemaType.fields || []).find(field => field.name === 'current');

  if (!currentSchema) {
    return null;
  }

  var stringFieldType = currentSchema.type;
  return /*#__PURE__*/React.createElement(_StringFieldDiff.StringFieldDiff, _extends({
    schemaType: stringFieldType
  }, current));
};

exports.SlugFieldDiff = SlugFieldDiff;