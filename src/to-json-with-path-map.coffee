class ToJsonWithPathMap extends ToJson
  constructor: (data, options) ->
    super(data, options)

    @pathMap = @parentContext?.pathMap ? {}

  childContextClass: @

  _toJsonNamed: (data, dataKey, jsonKey) ->
    childContext = super(data, dataKey, jsonKey)

    if @json[jsonKey] != undefined
      @pathMap[childContext.jsonPath().join('/')] = childContext.dataPath().join('/')

    return childContext

ToJson.WithPathMap = ToJsonWithPathMap
