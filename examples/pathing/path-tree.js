var toJson = require('../../index');
var assert = require('chai').assert;

// Create a context which produces a path-map
var context = new toJson.WithPathTree([
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
var pathTree = context.pathTree;

// Check the output
assert.deepEqual(
  json,
  [ { a: 1 }, { c: 3 } ],
  'incorrect json output'
);
assert.deepEqual(
  pathTree,
  {
    "0": {
      "id": 0,
      "children": {
        "a": {
          "id": "a"
        }
      }
    },
    "1": {
      "id": 2,
      "children": {
        "c": {
          "id": "c"
        }
      }
    }
  },
  'incorrect path map'
);

