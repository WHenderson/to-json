var toJson = require('../../index');
var assert = require('chai').assert;

// create converter
var context = new toJson({
  a: 1,
  b: 2
});

// modify context to rename child nodes
context.adjustContext({
  _getJsonKey: function (dataKey) {
    return dataKey.toUpperCase();
  }
});

// convert data
var json = context.apply();

assert.deepEqual(
  json,
  {
    A: 1,
    B: 2
  },
  'incorrect json output'
);
