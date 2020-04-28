"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldDiffProvider = FieldDiffProvider;
exports.useFieldDiff = useFieldDiff;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var FieldDiffContext = React.createContext({
  get field() {
    throw new Error('No field provider given');
  },

  title: ''
});

function FieldDiffProvider(props) {
  var field = props.field,
      children = props.children;
  var value = React.useMemo(() => {
    var title = field.title || field.type.title || field.name;
    return {
      field,
      title
    };
  }, [field]);
  return /*#__PURE__*/React.createElement(FieldDiffContext.Provider, {
    value: value
  }, children);
}

function useFieldDiff() {
  return React.useContext(FieldDiffContext);
}