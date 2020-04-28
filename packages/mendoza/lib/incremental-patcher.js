"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrap = wrap;
exports.unwrap = unwrap;
exports.getType = getType;
exports.rebaseValue = rebaseValue;
exports.applyPatch = applyPatch;

var _internalPatcher = require("./internal-patcher");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function utf8charSize(code) {
  if (code >> 16) {
    return 4;
  } else if (code >> 11) {
    return 3;
  } else if (code >> 7) {
    return 2;
  } else {
    return 1;
  }
}

function utf8stringSize(str) {
  var b = 0;

  for (var i = 0; i < str.length; i++) {
    var code = str.codePointAt(i);
    var size = utf8charSize(code);
    if (size == 4) i++;
    b += size;
  }

  return b;
}

class Model {
  constructor(origin) {
    _defineProperty(this, "origin", void 0);

    this.origin = origin;
  }

  wrap(data) {
    return {
      data,
      origin: this.origin
    };
  }

  wrapWithOrigin(data, origin) {
    return {
      data,
      origin
    };
  }

  asObject(value) {
    if (!value.content) {
      var fields = {};

      for (var _i = 0, _Object$entries = Object.entries(value.data); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            _key = _Object$entries$_i[0],
            val = _Object$entries$_i[1];

        fields[_key] = this.wrapWithOrigin(val, value.origin);
      }

      value.content = {
        type: 'object',
        fields
      };
    }

    return value.content;
  }

  asArray(value) {
    if (!value.content) {
      var elements = value.data.map(item => this.wrapWithOrigin(item, value.origin));
      value.content = {
        type: 'array',
        elements
      };
    }

    return value.content;
  }

  asString(value) {
    if (!value.content) {
      var str = value.data;
      var part = {
        value: str,
        utf8size: utf8stringSize(str),
        uses: [],
        origin: value.origin
      };
      value.content = this.stringFromParts([part]);
    }

    return value.content;
  }

  stringFromParts(parts) {
    var str = {
      type: 'string',
      parts
    };

    var _iterator = _createForOfIteratorHelper(parts),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var part = _step.value;
        part.uses.push(str);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return str;
  }

  objectGetKeys(value) {
    if (value.content) {
      return Object.keys(value.content.fields);
    } else {
      return Object.keys(value.data);
    }
  }

  objectGetField(value, key) {
    var obj = this.asObject(value);
    return obj.fields[key];
  }

  arrayGetElement(value, idx) {
    var arr = this.asArray(value);
    return arr.elements[idx];
  }

  finalize(content) {
    return {
      content,
      origin: this.origin
    };
  }

  copyString(value) {
    if (value) {
      var other = this.asString(value);
      return this.stringFromParts(other.parts.slice());
    } else {
      return {
        type: 'string',
        parts: []
      };
    }
  }

  copyObject(value) {
    var obj = {
      type: 'object',
      fields: {}
    };

    if (value) {
      var other = this.asObject(value);
      Object.assign(obj.fields, other.fields);
    }

    return obj;
  }

  copyArray(value) {
    var elements = value ? this.asArray(value).elements : [];
    return {
      type: 'array',
      elements
    };
  }

  objectSetField(target, key, value) {
    target.fields[key] = value;
  }

  objectDeleteField(target, key) {
    delete target.fields[key];
  }

  arrayAppendValue(target, value) {
    target.elements.push(value);
  }

  arrayAppendSlice(target, source, left, right) {
    var slice = this.asArray(source).elements.slice(left, right);
    target.elements.push(...slice);
  }

  stringAppendValue(target, value) {
    var str = this.asString(value);

    var _iterator2 = _createForOfIteratorHelper(str.parts),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var part = _step2.value;
        this.stringAppendPart(target, part);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  stringAppendPart(target, part) {
    target.parts.push(part);
    part.uses.push(target);
  }

  resolveStringPart(str, from, len) {
    if (len === 0) return from;

    for (var i = from; i < str.parts.length; i++) {
      var part = str.parts[i];

      if (len === part.utf8size) {
        // Matches perfect!
        return i + 1;
      }

      if (len < part.utf8size) {
        // It's a part of this chunk. We now need to split it up.
        this.splitString(part, len);
        return i + 1;
      }

      len -= part.utf8size;
    }

    throw new Error('splitting string out of bounds');
  }

  splitString(part, idx) {
    var leftValue;
    var rightValue;
    var leftSize = idx;
    var rightSize = part.utf8size - leftSize; // idx is here in UTF-8 index, not codepoint index.
    // This means we might to adjust for multi-byte characters.

    if (part.utf8size !== part.value.length) {
      var byteCount = 0;

      for (idx = 0; byteCount < leftSize; idx++) {
        var code = part.value.codePointAt(idx);
        var size = utf8charSize(code);
        if (size === 4) idx++; // Surrogate pair.

        byteCount += size;
      }
    }

    leftValue = part.value.slice(0, idx);
    rightValue = part.value.slice(idx);
    var newPart = {
      value: rightValue,
      utf8size: rightSize,
      uses: part.uses.slice(),
      origin: part.origin
    };
    part.value = leftValue;
    part.utf8size = leftSize;

    var _iterator3 = _createForOfIteratorHelper(part.uses),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var use = _step3.value;

        // Insert the new part.
        var _idx = use.parts.indexOf(part);

        if (_idx === -1) throw new Error('bug: mismatch between string parts and use.');
        use.parts.splice(_idx + 1, 0, newPart);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }

  stringAppendSlice(target, source, left, right) {
    var str = this.asString(source);
    var firstPart = this.resolveStringPart(str, 0, left);
    var lastPart = this.resolveStringPart(str, firstPart, right - left);

    for (var i = firstPart; i < lastPart; i++) {
      var part = str.parts[i];
      this.stringAppendPart(target, part);
    }
  }

} // Turns a native JavaScript object into a Value with a given origin.


function wrap(data, origin) {
  return {
    data,
    origin
  };
} // Converts a Value into a native JavaScript type.


function unwrap(value) {
  if (typeof value.data !== 'undefined') return value.data;
  var result;
  var content = value.content;

  switch (content.type) {
    case 'string':
      result = content.parts.map(part => part.value).join('');
      break;

    case 'array':
      result = content.elements.map(val => unwrap(val));
      break;

    case 'object':
      {
        result = {};

        for (var _i2 = 0, _Object$entries2 = Object.entries(content.fields); _i2 < _Object$entries2.length; _i2++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
              _key2 = _Object$entries2$_i[0],
              val = _Object$entries2$_i[1];

          result[_key2] = unwrap(val);
        }
      }
  }

  value.data = result;
  return result;
} // Returns the type of a Value.


function getType(value) {
  if (value.content) return value.content.type;
  if (Array.isArray(value.data)) return 'array';
  if (value.data === null) return 'null';
  return typeof value.data;
} // Updates the `right` value such that it reuses as much as possible from the `left` value.


function rebaseValue(left, right) {
  var leftType = getType(left);
  var rightType = getType(right);
  if (leftType !== rightType) return right;
  var model = new Model(right.origin);

  switch (leftType) {
    case 'object':
      {
        var leftObj = model.asObject(left);
        var rightObj = model.asObject(right);
        var numRebased = 0;

        for (var _i3 = 0, _Object$entries3 = Object.entries(rightObj.fields); _i3 < _Object$entries3.length; _i3++) {
          var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
              _key3 = _Object$entries3$_i[0],
              rightVal = _Object$entries3$_i[1];

          var leftVal = leftObj.fields[_key3];

          if (leftVal) {
            rightObj.fields[_key3] = rebaseValue(leftVal, rightVal);

            if (rightObj.fields[_key3] !== leftVal) {
              numRebased++;
            }
          }
        }

        return numRebased === 0 ? left : right;
      }

    case 'array':
      {
        var leftArr = model.asArray(left);
        var rightArr = model.asArray(right);

        if (leftArr.elements.length !== rightArr.elements.length) {
          break;
        }

        var _numRebased = 0;

        for (var i = 0; i < rightArr.elements.length; i++) {
          rightArr.elements[i] = rebaseValue(leftArr.elements[i], rightArr.elements[i]);

          if (rightArr.elements[i] !== leftArr.elements[i]) {
            _numRebased++;
          }
        }

        return _numRebased === 0 ? left : right;
      }

    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
      {
        if (unwrap(left) === unwrap(right)) return left;
        break;
      }
  }

  return right;
}

function applyPatch(left, patch, origin) {
  var model = new Model(origin);
  var patcher = new _internalPatcher.Patcher(model, left, patch);
  return patcher.process();
}