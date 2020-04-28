"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveDiffComponent = resolveDiffComponent;

var _components = require("./components");

function resolveDiffComponent(type) {
  var itType = type;

  while (itType) {
    var resolved = itType.diffComponent || _components.defaultComponents[itType.name];

    if (resolved) {
      return resolved;
    }

    itType = itType.type;
  }

  return _components.defaultComponents[type.jsonType] || undefined;
}