var toJson = require('../../index');
var assert = require('chai').assert;

// Create a context which produces a path-map
var context = new toJson.WithDataMap([
  { a: 1 },
  { b: 2 },
  { c: 3 },
  { d: 4 }
]);

// Filter out some of the input data
context._getEnumeratorArray = function () {
  var _this = this;
  return function (cb) {
    var i,length = _this.data.length;
    _this.json = [];
    for (i = 0; i < length; i += 2) {
      cb(_this.data[i], i, _this.json.length);
    }
    return _this.json;
  };
};

// convert data
var json = context.apply();
var dataMap = context.dataMap;

// Check the output
assert.deepEqual(
  json,
  [ { a: 1 }, { c: 3 } ],
  'incorrect json output'
);
assert.deepEqual(
  dataMap,
  {
    "0": {
      "dataPath": "0",
      "data": {
        "a": 1
      },
      "convertedData": {
        "a": 1
      },
      "json": {
        "a": 1
      }
    },
    "1": {
      "dataPath": "2",
      "data": {
        "c": 3
      },
      "convertedData": {
        "c": 3
      },
      "json": {
        "c": 3
      }
    },
    "0/a": {
      "dataPath": "0/a",
      "data": 1,
      "convertedData": 1,
      "json": 1
    },
    "1/c": {
      "dataPath": "2/c",
      "data": 3,
      "convertedData": 3,
      "json": 3
    }
  },
  'incorrect path map'
);

