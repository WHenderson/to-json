var toJson = require('../../index');
var assert = require('chai').assert;

// create converter
var context = new toJson([0,1,2,3]);

// modify child contexts to exclude odd json outputs
context.adjustChildContexts({
  _excludeJson: function () {
    return this.json % 2 == 1;
  }
});

// convert data
var json = context.apply();

assert.deepEqual(
  json,
  [0,2],
  'incorrect json output'
);
