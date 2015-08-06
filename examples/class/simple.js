var toJson = require('../../index');
var assert = require('chai').assert;

function MyClass() {
  this.a = 1;
  this.A = 2;
}
MyClass.prototype.toJSON = function () {
  return toJson(this);
};
MyClass.prototype.toJson = function (context) {
  var _this = this;
  context._getEnumeratorObject = function () {
    var _this = this;
    return function (cb) {
      _this.json = {};
      for (var key in _this.data) {
        if (!{}.hasOwnProperty.call(_this.data, key))
          continue;

        if (key.toUpperCase() != key)
          continue;

        cb(_this.data[key], key, _this._getJsonKey(key));
      }
      return _this.json;
    }
  };

  return context.apply(true);
};

var json = toJson(new MyClass());

assert.deepEqual(
  json,
  { A: 2 },
  'incorrect json output'
);
