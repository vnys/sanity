"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffArray = diffArray;

var _diffItem = require("./diffItem");

function diffArray(fromValue, toValue) {
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var from = fromValue || [];
  var to = toValue || [];
  var items = [];

  if (from !== to) {
    items = isUniquelyKeyed(from) && isUniquelyKeyed(to) ? diffArrayByKey(from, to, path) : diffArrayByIndex(from, to, path);
  }

  return {
    type: 'array',
    path,
    fromValue,
    toValue,
    items,
    isChanged: items.length > 0
  };
}

function diffArrayByIndex(fromValue, toValue, path) {
  var children = [];
  var length = Math.max(fromValue.length, toValue.length);

  for (var i = 0; i < length; i++) {
    var diff = (0, _diffItem.diffItem)(fromValue[i], toValue[i], path.concat(i));

    if (diff && diff.isChanged) {
      children.push(diff);
    }
  }

  return children;
}

function diffArrayByKey(fromValue, toValue, path) {
  var children = [];
  var keyedA = indexByKey(fromValue);
  var keyedB = indexByKey(toValue); // There's a bunch of hard/semi-hard problems related to using keys
  // Unless we have the exact same order, just use indexes for now

  if (!arraysAreEqual(keyedA.keys, keyedB.keys)) {
    return diffArrayByIndex(fromValue, toValue, path);
  }

  for (var i = 0; i < keyedB.keys.length; i++) {
    var _key = keyedB.keys[i];
    var valueA = keyedA.index[_key];
    var valueB = keyedB.index[_key];
    var diff = (0, _diffItem.diffItem)(valueA, valueB, path.concat({
      _key: _key
    }));

    if (diff && diff.isChanged) {
      children.push(diff);
    }
  }

  return children;
}

function isUniquelyKeyed(arr) {
  var keys = [];

  for (var i = 0; i < arr.length; i++) {
    var _key2 = getKey(arr[i]);

    if (!_key2 || keys.indexOf(_key2) !== -1) {
      return false;
    }

    keys.push(_key2);
  }

  return true;
}

function getKey(obj) {
  return typeof obj === 'object' && obj !== null && obj._key || undefined;
}

function indexByKey(arr) {
  return arr.reduce((acc, item) => {
    acc.keys.push(item._key);
    acc.index[item._key] = item;
    return acc;
  }, {
    keys: [],
    index: {}
  });
}

function arraysAreEqual(fromValue, toValue) {
  return fromValue.length === toValue.length && fromValue.every((item, i) => toValue[i] === item);
}