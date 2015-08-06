var toJson = require('../../index');
var assert = require('chai').assert;

// convert data
var json = (new toJson([1,2,3])).apply();

assert.deepEqual(
  json,
  [1,2,3],
  'incorrect json output'
);
