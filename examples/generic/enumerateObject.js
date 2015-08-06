var toJson = require('../../index');
var assert = require('chai').assert;

// Example class
function MyObject() {
  this.a = 1;
  this.b = 2;
}
MyObject.prototype.c = 3;

// create converter
var context = new toJson(new MyObject());

// modify context to iterate over all members, including prototype members
context.adjustContext({
  _getEnumeratorObject: function () {
    var _this = this;
    return function (cb) {
      _this.json = {};
      for (var key in _this.data) {
        cb(_this.data[key], key, _this._getJsonKey(key));
      }
      return _this.json;
    }
  }
});

// convert data
var json = context.apply();

assert.deepEqual(
  json,
  { a: 1, b: 2, c: 3 },
  'incorrect json output'
);

