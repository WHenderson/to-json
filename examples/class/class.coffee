toJson = require('../../index')
assert = require('chai').assert

class MyUpperClass
  constructor: (@a, @b) ->

  toJSON: () ->
    toJson(@)

  toJsonContext: (context) ->
    context ?= new toJson(@)
    context._getJsonKey = (dataKey) ->
      dataKey = @_callSuper('_getJsonKey', dataKey)
      return dataKey.toUpperCase()

    return context

class MyDoubleClass
  constructor: (@a, @b) ->

  toJSON: () ->
    toJson(@)

  toJsonContext: (context) ->
    context._getJsonKey = (dataKey) ->
      dataKey = @_callSuper('_getJsonKey', dataKey)
      return dataKey + dataKey

    return context


data = new MyUpperClass(
  new MyDoubleClass(1,2),
  new MyUpperClass(3,4)
)

json = data.toJSON()

assert.deepEqual(
  json,
  {
    A: {
      aa: 1
      bb: 2
    },
    B: {
      A: 3
      B: 4
    }
  },
  'incorrect json output'
)
