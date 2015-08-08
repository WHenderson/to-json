var toJson = require('../../index');
var assert = require('chai').assert;

// Create a context which produces a path-map
var context = new toJson.WithPathMap([
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
var pathMap = context.pathMap;

// Check the output
assert.deepEqual(
  json,
  [ { a: 1 }, { c: 3 } ],
  'incorrect json output'
);
assert.deepEqual(
  pathMap,
  {
    "0": "0",
    "1": "2",
    "0/a": "0/a",
    "1/c": "2/c"
  },
  'incorrect path map'
);

