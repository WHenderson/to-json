class ToJsonWithDataTree extends ToJson
  constructor: (data, options) ->
    super(data, options)

    @dataTree = {}

  childContextClass: @

  _toJsonNamed: (data, dataKey, jsonKey) ->
    childContext = super(data, dataKey, jsonKey)

    if @json[jsonKey] != undefined
      @dataTree[childContext.jsonKey] = {
        id: childContext.dataKey
        data: data
        convertedData: childContext.data
        json: @json[jsonKey]
      }

      if not isEmpty(childContext.dataTree)
        @dataTree[childContext.jsonKey].children = childContext.dataTree

    return childContext

ToJson.WithDataTree = ToJsonWithDataTree
