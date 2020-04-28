"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocumentDiff = void 0;

var React = _interopRequireWildcard(require("react"));

var _DocumentDiff = _interopRequireDefault(require("./DocumentDiff.css"));

var _FieldDiff = require("./FieldDiff");

var _fieldDiffProvider = require("./fieldDiffProvider");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DocumentDiff = function DocumentDiff(_ref) {
  var schemaType = _ref.schemaType,
      fields = _ref.fields;

  if (!schemaType.fields) {
    console.warn('Invalid schema type passed to document diff, no `fields` present');
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: _DocumentDiff.default.diffCardList
  }, schemaType.fields.map(field => {
    var fieldDiff = fields[field.name];

    if (!fieldDiff) {
      return null;
    }

    return /*#__PURE__*/React.createElement(_fieldDiffProvider.FieldDiffProvider, {
      key: field.name,
      field: field
    }, /*#__PURE__*/React.createElement(_FieldDiff.FieldDiff, _extends({
      schemaType: field.type
    }, fieldDiff)));
  }));
};

exports.DocumentDiff = DocumentDiff;