var toJson = require('../../index');
var assert = require('chai').assert;

// create converter
var context = new toJson([0,1,2,3]);

// modify child contexts to exclude odd indexes
context.adjustChildContexts({
  _exclude: function () {
    return typeof (this.dataKey == 'number') && (this.dataKey % 2 == 1);
  }
});

// convert data
var json = context.apply();

assert.deepEqual(
  json,
  [0,2],
  'incorrect json output'
);
