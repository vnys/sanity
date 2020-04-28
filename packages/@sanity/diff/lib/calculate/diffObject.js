"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffObject = diffObject;

var _diffItem = require("./diffItem");

var _getType = require("./getType");

var ignoredFields = ['_id', '_type', '_createdAt', '_updatedAt', '_rev'];

function diffObject(fromValue, toValue) {
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  function getFields() {
    var fields = {};

    if (fromValue === toValue || (0, _getType.isNullish)(fromValue) && (0, _getType.isNullish)(toValue)) {
      return fields;
    }

    var atRoot = path.length === 0;
    var from = fromValue || {};
    var to = toValue || {};
    var cache = {}; // If schema type is passed, extract the field names from it to get the correct order
    //const definedFields = schemaType ? schemaType.fields.map(field => field.name) : []

    var definedFields = []; // Find all the unique field names within from and to

    var allFields = [...definedFields, ...Object.keys(from), ...Object.keys(to)].filter((fieldName, index, siblings) => siblings.indexOf(fieldName) === index); // Create lazy differs for each field within the object

    allFields.forEach(fieldName => {
      if ( // Don't diff _rev, _createdAt etc
      atRoot && ignoredFields.includes(fieldName) || // Don't diff two nullish values (null/undefined)
      (0, _getType.isNullish)(from[fieldName]) && (0, _getType.isNullish)(to[fieldName])) {
        return;
      } // Create lazy getter/differ for each field


      Object.defineProperty(fields, fieldName, {
        configurable: true,
        enumerable: true,

        get() {
          if (fieldName in cache) {
            return cache[fieldName];
          }
          /* const fieldType = schemaType
          ? schemaType.fields.find(field => field.name === fieldName)?.type
          : undefined */


          var fieldDiff = (0, _diffItem.diffItem)(from[fieldName], to[fieldName], path.concat(fieldName) //fieldType
          );
          var diff = fieldDiff && fieldDiff.isChanged ? fieldDiff : undefined;
          cache[fieldName] = diff;

          if (!diff) {
            delete fields[fieldName];
          }

          return cache[fieldName];
        }

      });
    });
    return fields;
  }

  return {
    type: 'object',
    path,
    fromValue,
    toValue,

    // Discouraged: prefer looping over children unless you need to check every field!
    get isChanged() {
      return (0, _getType.isNullish)(fromValue) && (0, _getType.isNullish)(toValue) && fromValue !== toValue || Object.keys(this.fields).some(key => typeof this.fields[key] !== 'undefined' && this.fields[key].isChanged);
    },

    get fields() {
      delete this.fields;
      this.fields = getFields();
      return this.fields;
    }

  };
}