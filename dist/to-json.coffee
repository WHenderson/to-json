class ToJson
  constructor: (@data, options) ->
    if @ instanceof ToJson
      # Called as constructor
      if options?
        @dataKey = options.dataKey
        @jsonKey = options.jsonKey
        @parentContext = options.parentContext
    else
      # Called as function
      return (new ToJson(@data, options)).apply()

  childContextClass: @

  # Converts @data into json whilst applying filters and conversions
  apply: (excludeCustomToJson) ->
    # exclude before doing anything?
    if @_exclude()
      return undefined

    # convert the incoming data (context.data)
    @_convertData()

    # exclude based on the converted data
    if @_excludeData()
      return undefined

    # convert the incoming data (context.data) into outgoing data (context.json)
    @_toJson(excludeCustomToJson)

    # exclude based on outgoing data?
    if @_excludeJson()
      return undefined

    # return the outgoing data (context.json)
    return @json

  # Converts @data into json
  _toJson: (excludeCustomToJson) ->
    if not excludeCustomToJson and @data?.toJson? and typeof @data.toJson == 'function'
      @json = @data.toJson(@)
    else if not excludeCustomToJson and @data?.toJSON? and typeof @data.toJSON == 'function'
      @json = @data.toJSON()
    else
      @json = @_getEnumerator()(@_toJsonNamed.bind(@))
    return

  # Returns an enumerator which iterates over @data as an array, returning the resulting json
  _getEnumeratorArray: () ->
    return (cb) =>
      @json = []
      for element, ielement in @data
        cb(element, ielement, @_getJsonIndex(ielement))
      return @json

  # Returns an enumerator which iterates over @data as an object, returning the resulting json
  _getEnumeratorObject: () ->
    return (cb) =>
      @json = {}
      for own key, val of @data
        cb(val, key, @_getJsonKey(key))
      return @json

  # Returns an enumerator which simply returns @data
  _getEnumeratorValue: () ->
    return () =>
      @json = @data
      return @json

  # Returns an enumerator which enumerates over data, returning the resulting json
  _getEnumerator: () ->
    if Array.isArray(@data)
      return @_getEnumeratorArray()
    else if typeof @data == 'object' and @data != null
      return @_getEnumeratorObject()
    else
      return @_getEnumeratorValue()

  ##
  # Standard callback used in enumerators.
  # @param data - data to be converted
  # @param dataKey {string|int} - key/index into the parent source data as determined by the enumerator
  # @param jsonKey {string|int} - key/index into the json target data as determined by the enumerator
  # @return {toJson} child context
  _toJsonNamed: (data, dataKey, jsonKey) ->
    childContext = @_createChildContext(data, dataKey, jsonKey)

    json = childContext.apply()

    if json != undefined
      @json[jsonKey] = json

    return childContext

  # returns a new context for use with child data
  # arguments are the same as those given to @_toJsonNamed
  _createChildContext: (data, dataKey, jsonKey) ->
    return new @childContextClass(
      data,
      {
        dataKey: dataKey
        jsonKey: jsonKey
        parentContext: @
      }
    )

  # Utility function for overriding child context methods
  # Useful for applying various filters etc for the current context
  adjustContext: (overrides, sticky) ->
    for own key, value of overrides
      @[key] = value

    if sticky
      @adjustChildContexts(overrides, sticky)
    return @

  # Utility function for overriding child context methods
  # Useful for applying various filters etc for only the immediate child classes
  # @param {Boolean} sticky - If True, all future generations will be overridden
  adjustChildContexts: (overrides, sticky) ->
    @childContextClass = class extends @childContextClass
    for own key, value of overrides
      @childContextClass.prototype[key] = value
    if sticky
      @childContextClass.prototype.childContextClass = @childContextClass
    return @

  # utility function for chaining super methods
  _super: (name) ->
    current = @[name]
    cls = @constructor
    while cls? and cls.prototype[name] == current
      cls = cls.__super__.constructor
    return cls.prototype[name]

  _callSuper: (name, args...) ->
    @_super(name).apply(@, args)

  # Returns the key to use for the json output
  _getJsonKey: (dataKey) ->
    dataKey

  # Returns the key to use for the json output
  _getJsonIndex: (dataIndex) ->
    @json.length

  # exclude before doing anything?
  _exclude: () ->
    false

  # convert the incoming data
  _convertData: () ->
    return

  # exclude based on the converted data
  _excludeData: () ->
    false

  # exclude based on outgoing data?
  _excludeJson: () ->
    false

  # return data path for this context
  dataPath: () ->
    path = []
    node = @
    while node?
      if node.dataKey?
        path.unshift(node.dataKey)
      node = node.parentContext
    return path

  # return json path for this context
  jsonPath: () ->
    path = []
    node = @
    while node?
      if node.jsonKey?
        path.unshift(node.jsonKey)
      node = node.parentContext
    return path

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

module.exports = ToJson