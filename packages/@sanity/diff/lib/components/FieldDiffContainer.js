"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldDiffContainer = FieldDiffContainer;

var _undoIcon = _interopRequireDefault(require("part:@sanity/base/undo-icon"));

var React = _interopRequireWildcard(require("react"));

var _fieldDiffProvider = require("./fieldDiffProvider");

var _FieldDiffContainer = _interopRequireDefault(require("./FieldDiffContainer.css"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FieldDiffContainer(props) {
  var _useFieldDiff = (0, _fieldDiffProvider.useFieldDiff)(),
      title = _useFieldDiff.title;

  return /*#__PURE__*/React.createElement("section", {
    className: _FieldDiffContainer.default.root
  }, /*#__PURE__*/React.createElement("header", {
    className: _FieldDiffContainer.default.header
  }, /*#__PURE__*/React.createElement("h4", {
    className: _FieldDiffContainer.default.title
  }, title), /*#__PURE__*/React.createElement(_undoIcon.default, null)), /*#__PURE__*/React.createElement("div", {
    className: _FieldDiffContainer.default.content
  }, props.children));
}