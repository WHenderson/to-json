var toJson = require('../../index');
var assert = require('chai').assert;

// create converter
var context = new toJson([0,1,2,3]);

// modify child contexts to double each data (input) value
context.adjustChildContexts({
  _convertData: function () {
    this.data = this.data*2;
  }
});

// convert data
var json = context.apply();

assert.deepEqual(
  json,
  [0,2,4,6],
  'incorrect json output'
);
