assert = require('chai').assert

suite('coverage', () ->
  toJson = null

  confirm = (title, input, expected) ->
    test(title, () ->
      context = new toJson(input)
      output = context.apply()

      assert.deepEqual(output, expected, 'incorrect json output')
    )

  confirmOverrideParent = (title, input, expected, parent, sticky) ->
    test(title, () ->
      context = new toJson(input)
      context.adjustContext(parent, sticky)

      output = context.apply()

      assert.deepEqual(output, expected, 'incorrect json output')
    )

  confirmOverrideChild = (title, input, expected, child, sticky) ->
    test(title, () ->
      context = new toJson(input)
      context.adjustChildContexts(child, sticky)

      output = context.apply()

      assert.deepEqual(output, expected, 'incorrect json output')
    )

  confirmPathTree = (title, input, expected, expectedTree) ->
    test(title, () ->
      context = new toJson.WithPathTree(input)
      context.adjustChildContexts(
        {
          _exclude: () ->
            (typeof @dataKey == 'number' and @dataKey % 2 == 1) or (typeof @dataKey == 'string' and @dataKey.toUpperCase() == @dataKey)
        },
        true
      )

      output = context.apply()

      assert.deepEqual(output, expected, 'incorrect json output')
      assert.deepEqual(context.pathTree, expectedTree, 'incorrect pathTree output')
    )

  confirmPathMap = (title, input, expected, expectedMap) ->
    test(title, () ->
      context = new toJson.WithPathMap(input)
      context.adjustChildContexts(
        {
          _exclude: () ->
            (typeof @dataKey == 'number' and @dataKey % 2 == 1) or (typeof @dataKey == 'string' and @dataKey.toUpperCase() == @dataKey)
        },
        true
      )

      output = context.apply()

      assert.deepEqual(output, expected, 'incorrect json output')
      assert.deepEqual(context.pathMap, expectedMap, 'incorrect pathMap output')
    )

  confirmDataMap = (title, input, expected, expectedMap) ->
    test(title, () ->
      context = new toJson.WithDataMap(input)
      context.adjustChildContexts(
        {
          _exclude: () ->
            (typeof @dataKey == 'number' and @dataKey % 2 == 1) or (typeof @dataKey == 'string' and @dataKey.toUpperCase() == @dataKey)
        },
        true
      )

      output = context.apply()

      assert.deepEqual(output, expected, 'incorrect json output')
      assert.deepEqual(context.dataMap, expectedMap, 'incorrect dataMap output')
    )

  confirmDataTree = (title, input, expected, expectedTree) ->
    test(title, () ->
      context = new toJson.WithDataTree(input)
      context.adjustChildContexts(
        {
          _exclude: () ->
            (typeof @dataKey == 'number' and @dataKey % 2 == 1) or (typeof @dataKey == 'string' and @dataKey.toUpperCase() == @dataKey)
        },
        true
      )

      output = context.apply()

      assert.deepEqual(output, expected, 'incorrect json output')
      assert.deepEqual(context.dataTree, expectedTree, 'incorrect dataTree output')
    )

  setup(() ->
    toJson = require('../dist/to-json.coffee')
  )

  suite('vanilla', () ->
    suite('simple values', () ->
      confirm('undefined',
        undefined,
        undefined
      )
      confirm('null',
        null,
        null
      )
      confirm('boolean (true)',
        true,
        true
      )
      confirm('boolean (false)',
        false,
        false
      )
      confirm('number (integer)',
        1234,
        1234
      )
      confirm('number (real)',
        12.34,
        12.34
      )
      confirm('string',
        'abcd',
        'abcd'
      )
    )


    suite('arrays', () ->
      confirm('empty array',
        [],
        []
      )
      confirm('simple array',
        [3,2,1],
        [3,2,1]
      )
    )

    suite('objects', () ->
      confirm('empty object',
        {},
        {},
        {}
      )
      confirm('simple object',
        { a:1, b:2 },
        { a:1, b:2 }
      )
      confirm('nested object',
        { a: { b: {} } },
        { a: { b: {} } }
      )
    )
  )

  suite('misc data', () ->
    confirm(
      'undefined members',
      { a: undefined },
      {}
    )
  )

  suite('special types', () ->
    date = new Date()

    confirm(
      'toJSON',
      date,
      date.toJSON(),
      {}
    )

    confirm(
      'toJson',
      {
        toJson: (context) ->
          'custom value'
      },
      'custom value',
      {}
    )
  )

  suite('direct call', () ->
    test('direct call', () ->
      json = toJson([1,2,3])
      assert.deepEqual(
        json,
        [1,2,3],
        'incorrect json output'
      )
    )
  )

  suite('options', () ->
    confirmOverrideParent(
      'rename',
      { a: 1, b: 2},
      { A: 1, B: 2},
      {
        _getJsonKey: (dataKey) ->
          dataKey.toUpperCase()
      }
    )

    confirmOverrideChild(
      'exclude',
      [0,1,2,3,4,5],
      [0,2,4],
      {
        _exclude: () ->
          @dataKey % 2 == 1
      }
    )

    confirmOverrideChild(
      'excludeData',
      ['a','A','c'],
      ['a','c'],
      {
        _excludeData: () ->
          @data.toUpperCase() == @data
      }
    )

    confirmOverrideChild(
      'excludeJson',
      ['a','A','c'],
      ['a','c'],
      {
        _excludeJson: () ->
          @data.toUpperCase() == @data
      }
    )

    confirmOverrideParent(
      'paths',
      {
        'a': {
          'b': 'a'
          'c': ['x','y','z']
        }
      },
      {
        "a": {
          "b": ["a/b", "a/b"]
          "c": [
            ["a/c/0", "a/c/0"]
            ["a/c/1", "a/c/2"]
          ]
        }
      },
      {
        _exclude: () ->
          @dataKey == 1

        _toJson: () ->
          if typeof @data == 'string'
            @json = [@jsonPath().join('/'), @dataPath().join('/')]
          else
            @_callSuper('_toJson')
          return
      },
      true
    )
  )

  suite('path tree', () ->
    confirmPathTree('path tree',
      {
        'A': [1,2,3,4],
        'a': [5,6,7,8]
      },
      {
        'a': [5,7]
      },
      {
        "a": {
          "children": {
            "0": {
              "id": 0
            }
            "1": {
              "id": 2
            }
          }
          "id": "a"
        }
      }
    )
  )

  suite('path map', () ->
    confirmPathMap('path map',
      {
        'A': [1,2,3,4],
        'a': [5,6,7,8]
      },
      {
        'a': [5,7]
      },
      {
        "a": "a"
        "a/0": "a/0"
        "a/1": "a/2"
      }
    )
  )

  suite('data map', () ->
    confirmDataMap('data map',
      {
        'A': [1,2,3,4],
        'a': [5,6,7,8]
      },
      {
        'a': [5,7]
      },
      {
        "a": {
          "convertedData": [
            5
            6
            7
            8
          ]
          "data": [
            5
            6
            7
            8
          ]
          "dataPath": "a"
          "json": [
            5
            7
          ]
        }
        "a/0": {
          "convertedData": 5
          "data": 5
          "dataPath": "a/0"
          "json": 5
        }
        "a/1": {
          "convertedData": 7
          "data": 7
          "dataPath": "a/2"
          "json": 7
        }
      }
    )
  )

  suite('data tree', () ->
    confirmDataTree('data tree',
      {
        'A': [1,2,3,4],
        'a': [5,6,7,8]
      },
      {
        'a': [5,7]
      },
      {
        "a": {
          "children": {
            "0": {
              "convertedData": 5
              "data": 5
              "id": 0
              "json": 5
            }
            "1": {
              "convertedData": 7
              "data": 7
              "id": 2
              "json": 7
            }
          }
          "convertedData": [
            5
            6
            7
            8
          ]
          "data": [
            5
            6
            7
            8
          ]
          "id": "a"
          "json": [
            5
            7
          ]
        }
      }
    )
  )

)
