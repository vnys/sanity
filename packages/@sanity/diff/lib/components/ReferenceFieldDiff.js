"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReferenceFieldDiff = void 0;

var React = _interopRequireWildcard(require("react"));

var _schema = _interopRequireDefault(require("part:@sanity/base/schema?"));

var _preview = _interopRequireDefault(require("part:@sanity/base/preview?"));

var _FieldDiffContainer = require("./FieldDiffContainer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function getReferencedType(type) {
  if (!type.to) {
    return type.type ? getReferencedType(type.type) : undefined;
  }

  var target = Array.isArray(type.to) ? type.to[0] : type.to;
  return _schema.default.get(target.name);
}

var ReferenceFieldDiff = (_ref) => {
  var schemaType = _ref.schemaType,
      fromValue = _ref.fromValue,
      toValue = _ref.toValue;
  var type = getReferencedType(schemaType);
  var prev = fromValue && fromValue._ref;
  var next = toValue && toValue._ref;
  return /*#__PURE__*/React.createElement(_FieldDiffContainer.FieldDiffContainer, null, prev && /*#__PURE__*/React.createElement(_preview.default, {
    type: type,
    value: fromValue,
    layout: "default"
  }), prev && /*#__PURE__*/React.createElement("div", null, "\u21E9"), next && /*#__PURE__*/React.createElement(_preview.default, {
    type: type,
    value: toValue,
    layout: "default"
  }));
};

exports.ReferenceFieldDiff = ReferenceFieldDiff;