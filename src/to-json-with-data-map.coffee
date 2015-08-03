class ToJsonWithDataMap extends ToJson
  constructor: (data, options) ->
    super(data, options)

    @dataMap = @parentContext?.dataMap ? {}

  childContextClass: @

  _toJsonNamed: (data, dataKey, jsonKey) ->
    childContext = super(data, dataKey, jsonKey)

    if @json[jsonKey] != undefined
      @dataMap[childContext.jsonPath().join('/')] = {
        dataPath: childContext.dataPath().join('/')
        data: data
        convertedData: childContext.data
        json: @json[jsonKey]
      }

    return childContext

ToJson.WithDataMap = ToJsonWithDataMap