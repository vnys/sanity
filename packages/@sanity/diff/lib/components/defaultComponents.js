"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultComponents = void 0;

var _DocumentDiff = require("./DocumentDiff");

var _ImageFieldDiff = require("./ImageFieldDiff");

var _ObjectFieldDiff = require("./ObjectFieldDiff");

var _ReferenceFieldDiff = require("./ReferenceFieldDiff");

var _SlugFieldDiff = require("./SlugFieldDiff");

var _StringFieldDiff = require("./StringFieldDiff");

var defaultComponents = {
  document: _DocumentDiff.DocumentDiff,
  string: _StringFieldDiff.StringFieldDiff,
  object: _ObjectFieldDiff.ObjectFieldDiff,
  reference: _ReferenceFieldDiff.ReferenceFieldDiff,
  image: _ImageFieldDiff.ImageFieldDiff,
  slug: _SlugFieldDiff.SlugFieldDiff
};
exports.defaultComponents = defaultComponents;