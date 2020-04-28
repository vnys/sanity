"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringFieldDiff = void 0;

var React = _interopRequireWildcard(require("react"));

var _FieldDiffContainer = require("./FieldDiffContainer");

var _StringFieldDiff = _interopRequireDefault(require("./StringFieldDiff.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable react/no-multi-comp */
function StringSegment(_ref) {
  var segment = _ref.segment;

  if (segment.type === 'added') {
    return /*#__PURE__*/React.createElement("span", {
      className: _StringFieldDiff.default.add
    }, segment.text);
  }

  if (segment.type === 'removed') {
    return /*#__PURE__*/React.createElement("span", {
      className: _StringFieldDiff.default.remove
    }, segment.text);
  }

  return /*#__PURE__*/React.createElement("span", null, segment.text);
}

var StringFieldDiff = props => {
  return /*#__PURE__*/React.createElement(_FieldDiffContainer.FieldDiffContainer, null, props.segments.map((segment, idx) => /*#__PURE__*/React.createElement(StringSegment, {
    key: String(idx),
    segment: segment
  })));
};

exports.StringFieldDiff = StringFieldDiff;