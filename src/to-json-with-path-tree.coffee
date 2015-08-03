isEmpty = (obj) ->
  for own key of obj
    return false
  return true

class ToJsonWithPathTree extends ToJson
  constructor: (data, options) ->
    super(data, options)

    @pathTree = {}

  childContextClass: @

  _toJsonNamed: (data, dataKey, jsonKey) ->
    childContext = super(data, dataKey, jsonKey)

    if @json[jsonKey] != undefined
      if not isEmpty(childContext.pathTree)
        @pathTree[childContext.jsonKey] = {
          id: childContext.dataKey,
          children: childContext.pathTree
        }
      else
        @pathTree[childContext.jsonKey] = {
          id: childContext.dataKey
        }

    return

ToJson.WithPathTree = ToJsonWithPathTree
