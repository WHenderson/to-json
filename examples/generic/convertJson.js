var toJson = require('../../index');
var assert = require('chai').assert;

// create converter
var context = new toJson([0,1,2,3]);

// modify child contexts to double each json (output) value
context.adjustChildContexts({
  _toJson: function () {
    // call super function to do the original conversion
    this._callSuper('_toJson');

    // double each output value
    this.json = this.json*2;
  }
});

// convert data
var json = context.apply();

assert.deepEqual(
  json,
  [0,2,4,6],
  'incorrect json output'
);
