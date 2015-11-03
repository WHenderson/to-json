;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.toJson = factory();
  }
}(this, function() {
var ToJson, ToJsonWithDataMap, ToJsonWithDataTree, ToJsonWithPathMap, ToJsonWithPathTree, isEmpty,
  hasProp = {}.hasOwnProperty,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  slice = [].slice;

ToJson = (function() {
  function ToJson(data1, options) {
    this.data = data1;
    if (this instanceof ToJson) {
      if (options != null) {
        this.dataKey = options.dataKey;
        this.jsonKey = options.jsonKey;
        this.parentContext = options.parentContext;
      }
    } else {
      return (new ToJson(this.data, options)).apply();
    }
  }

  ToJson.prototype.childContextClass = ToJson;

  ToJson.prototype.apply = function(excludeCustomToJson) {
    if (this._exclude()) {
      return void 0;
    }
    this._convertData();
    if (this._excludeData()) {
      return void 0;
    }
    this._toJson(excludeCustomToJson);
    if (this._excludeJson()) {
      return void 0;
    }
    return this.json;
  };

  ToJson.prototype._toJson = function(excludeCustomToJson) {
    var ref, ref1;
    if (!excludeCustomToJson && (((ref = this.data) != null ? ref.toJson : void 0) != null) && typeof this.data.toJson === 'function') {
      this.json = this.data.toJson(this);
    } else if (!excludeCustomToJson && (((ref1 = this.data) != null ? ref1.toJSON : void 0) != null) && typeof this.data.toJSON === 'function') {
      this.json = this.data.toJSON();
    } else {
      this.json = this._getEnumerator()(this._toJsonNamed.bind(this));
    }
  };

  ToJson.prototype._getEnumeratorArray = function() {
    return (function(_this) {
      return function(cb) {
        var element, i, ielement, len, ref;
        _this.json = [];
        ref = _this.data;
        for (ielement = i = 0, len = ref.length; i < len; ielement = ++i) {
          element = ref[ielement];
          cb(element, ielement, _this._getJsonIndex(ielement));
        }
        return _this.json;
      };
    })(this);
  };

  ToJson.prototype._getEnumeratorObject = function() {
    return (function(_this) {
      return function(cb) {
        var key, ref, val;
        _this.json = {};
        ref = _this.data;
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          val = ref[key];
          cb(val, key, _this._getJsonKey(key));
        }
        return _this.json;
      };
    })(this);
  };

  ToJson.prototype._getEnumeratorValue = function() {
    return (function(_this) {
      return function() {
        _this.json = _this.data;
        return _this.json;
      };
    })(this);
  };

  ToJson.prototype._getEnumerator = function() {
    if (Array.isArray(this.data)) {
      return this._getEnumeratorArray();
    } else if (typeof this.data === 'object' && this.data !== null) {
      return this._getEnumeratorObject();
    } else {
      return this._getEnumeratorValue();
    }
  };

  ToJson.prototype._toJsonNamed = function(data, dataKey, jsonKey) {
    var childContext, json;
    childContext = this._createChildContext(data, dataKey, jsonKey);
    json = childContext.apply();
    if (json !== void 0) {
      this.json[jsonKey] = json;
    }
    return childContext;
  };

  ToJson.prototype._createChildContext = function(data, dataKey, jsonKey) {
    return new this.childContextClass(data, {
      dataKey: dataKey,
      jsonKey: jsonKey,
      parentContext: this
    });
  };

  ToJson.prototype.adjustContext = function(overrides, sticky) {
    var key, value;
    for (key in overrides) {
      if (!hasProp.call(overrides, key)) continue;
      value = overrides[key];
      this[key] = value;
    }
    if (sticky) {
      this.adjustChildContexts(overrides, sticky);
    }
    return this;
  };

  ToJson.prototype.adjustChildContexts = function(overrides, sticky) {
    var key, value;
    this.childContextClass = (function(superClass) {
      extend(_Class, superClass);

      function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
      }

      return _Class;

    })(this.childContextClass);
    for (key in overrides) {
      if (!hasProp.call(overrides, key)) continue;
      value = overrides[key];
      this.childContextClass.prototype[key] = value;
    }
    if (sticky) {
      this.childContextClass.prototype.childContextClass = this.childContextClass;
    }
    return this;
  };

  ToJson.prototype._super = function(name) {
    var cls, current;
    current = this[name];
    cls = this.constructor;
    while ((cls != null) && cls.prototype[name] === current) {
      cls = cls.__super__.constructor;
    }
    return cls.prototype[name];
  };

  ToJson.prototype._callSuper = function() {
    var args, name;
    name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this._super(name).apply(this, args);
  };

  ToJson.prototype._getJsonKey = function(dataKey) {
    return dataKey;
  };

  ToJson.prototype._getJsonIndex = function(dataIndex) {
    return this.json.length;
  };

  ToJson.prototype._exclude = function() {
    return false;
  };

  ToJson.prototype._convertData = function() {};

  ToJson.prototype._excludeData = function() {
    return false;
  };

  ToJson.prototype._excludeJson = function() {
    return false;
  };

  ToJson.prototype.dataPath = function() {
    var node, path;
    path = [];
    node = this;
    while (node != null) {
      if (node.dataKey != null) {
        path.unshift(node.dataKey);
      }
      node = node.parentContext;
    }
    return path;
  };

  ToJson.prototype.jsonPath = function() {
    var node, path;
    path = [];
    node = this;
    while (node != null) {
      if (node.jsonKey != null) {
        path.unshift(node.jsonKey);
      }
      node = node.parentContext;
    }
    return path;
  };

  return ToJson;

})();

ToJsonWithPathMap = (function(superClass) {
  extend(ToJsonWithPathMap, superClass);

  function ToJsonWithPathMap(data, options) {
    var ref, ref1;
    ToJsonWithPathMap.__super__.constructor.call(this, data, options);
    this.pathMap = (ref = (ref1 = this.parentContext) != null ? ref1.pathMap : void 0) != null ? ref : {};
  }

  ToJsonWithPathMap.prototype.childContextClass = ToJsonWithPathMap;

  ToJsonWithPathMap.prototype._toJsonNamed = function(data, dataKey, jsonKey) {
    var childContext;
    childContext = ToJsonWithPathMap.__super__._toJsonNamed.call(this, data, dataKey, jsonKey);
    if (this.json[jsonKey] !== void 0) {
      this.pathMap[childContext.jsonPath().join('/')] = childContext.dataPath().join('/');
    }
    return childContext;
  };

  return ToJsonWithPathMap;

})(ToJson);

ToJson.WithPathMap = ToJsonWithPathMap;

isEmpty = function(obj) {
  var key;
  for (key in obj) {
    if (!hasProp.call(obj, key)) continue;
    return false;
  }
  return true;
};

ToJsonWithPathTree = (function(superClass) {
  extend(ToJsonWithPathTree, superClass);

  function ToJsonWithPathTree(data, options) {
    ToJsonWithPathTree.__super__.constructor.call(this, data, options);
    this.pathTree = {};
  }

  ToJsonWithPathTree.prototype.childContextClass = ToJsonWithPathTree;

  ToJsonWithPathTree.prototype._toJsonNamed = function(data, dataKey, jsonKey) {
    var childContext;
    childContext = ToJsonWithPathTree.__super__._toJsonNamed.call(this, data, dataKey, jsonKey);
    if (this.json[jsonKey] !== void 0) {
      if (!isEmpty(childContext.pathTree)) {
        this.pathTree[childContext.jsonKey] = {
          id: childContext.dataKey,
          children: childContext.pathTree
        };
      } else {
        this.pathTree[childContext.jsonKey] = {
          id: childContext.dataKey
        };
      }
    }
  };

  return ToJsonWithPathTree;

})(ToJson);

ToJson.WithPathTree = ToJsonWithPathTree;

ToJsonWithDataMap = (function(superClass) {
  extend(ToJsonWithDataMap, superClass);

  function ToJsonWithDataMap(data, options) {
    var ref, ref1;
    ToJsonWithDataMap.__super__.constructor.call(this, data, options);
    this.dataMap = (ref = (ref1 = this.parentContext) != null ? ref1.dataMap : void 0) != null ? ref : {};
  }

  ToJsonWithDataMap.prototype.childContextClass = ToJsonWithDataMap;

  ToJsonWithDataMap.prototype._toJsonNamed = function(data, dataKey, jsonKey) {
    var childContext;
    childContext = ToJsonWithDataMap.__super__._toJsonNamed.call(this, data, dataKey, jsonKey);
    if (this.json[jsonKey] !== void 0) {
      this.dataMap[childContext.jsonPath().join('/')] = {
        dataPath: childContext.dataPath().join('/'),
        data: data,
        convertedData: childContext.data,
        json: this.json[jsonKey]
      };
    }
    return childContext;
  };

  return ToJsonWithDataMap;

})(ToJson);

ToJson.WithDataMap = ToJsonWithDataMap;

ToJsonWithDataTree = (function(superClass) {
  extend(ToJsonWithDataTree, superClass);

  function ToJsonWithDataTree(data, options) {
    ToJsonWithDataTree.__super__.constructor.call(this, data, options);
    this.dataTree = {};
  }

  ToJsonWithDataTree.prototype.childContextClass = ToJsonWithDataTree;

  ToJsonWithDataTree.prototype._toJsonNamed = function(data, dataKey, jsonKey) {
    var childContext;
    childContext = ToJsonWithDataTree.__super__._toJsonNamed.call(this, data, dataKey, jsonKey);
    if (this.json[jsonKey] !== void 0) {
      this.dataTree[childContext.jsonKey] = {
        id: childContext.dataKey,
        data: data,
        convertedData: childContext.data,
        json: this.json[jsonKey]
      };
      if (!isEmpty(childContext.dataTree)) {
        this.dataTree[childContext.jsonKey].children = childContext.dataTree;
      }
    }
    return childContext;
  };

  return ToJsonWithDataTree;

})(ToJson);

ToJson.WithDataTree = ToJsonWithDataTree;

return ToJson;
}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvLWpzb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsNkZBQUE7RUFBQTs7OztBQUFBO0VBQ0EsZ0JBQUEsS0FBQSxFQUFBLE9BQUE7SUFBQSxJQUFBLENBQUEsT0FBQTtJQUNBLElBQUEsSUFBQSxZQUFBLE1BQUE7TUFFQSxJQUFBLGVBQUE7UUFDQSxJQUFBLENBQUEsT0FBQSxHQUFBLE9BQUEsQ0FBQTtRQUNBLElBQUEsQ0FBQSxPQUFBLEdBQUEsT0FBQSxDQUFBO1FBQ0EsSUFBQSxDQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEsY0FIQTtPQUZBO0tBQUEsTUFBQTtBQVFBLGFBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLEVBUkE7O0VBREE7O21CQVdBLGlCQUFBLEdBQUE7O21CQUdBLEtBQUEsR0FBQSxTQUFBLG1CQUFBO0lBRUEsSUFBQSxJQUFBLENBQUEsUUFBQSxDQUFBLENBQUE7QUFDQSxhQUFBLE9BREE7O0lBSUEsSUFBQSxDQUFBLFlBQUEsQ0FBQTtJQUdBLElBQUEsSUFBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBO0FBQ0EsYUFBQSxPQURBOztJQUlBLElBQUEsQ0FBQSxPQUFBLENBQUEsbUJBQUE7SUFHQSxJQUFBLElBQUEsQ0FBQSxZQUFBLENBQUEsQ0FBQTtBQUNBLGFBQUEsT0FEQTs7QUFJQSxXQUFBLElBQUEsQ0FBQTtFQXBCQTs7bUJBdUJBLE9BQUEsR0FBQSxTQUFBLG1CQUFBO0FBQ0EsUUFBQTtJQUFBLElBQUEsQ0FBQSxtQkFBQSxJQUFBLDJEQUFBLElBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsS0FBQSxVQUFBO01BQ0EsSUFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBLEVBREE7S0FBQSxNQUVBLElBQUEsQ0FBQSxtQkFBQSxJQUFBLDZEQUFBLElBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsS0FBQSxVQUFBO01BQ0EsSUFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsQ0FBQSxFQURBO0tBQUEsTUFBQTtNQUdBLElBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBLGNBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFlBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLEVBSEE7O0VBSEE7O21CQVVBLG1CQUFBLEdBQUEsU0FBQTtBQUNBLFdBQUEsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBLEVBQUE7QUFDQSxZQUFBO1FBQUEsS0FBQSxDQUFBLElBQUEsR0FBQTtBQUNBO0FBQUEsYUFBQSwyREFBQTs7VUFDQSxFQUFBLENBQUEsT0FBQSxFQUFBLFFBQUEsRUFBQSxLQUFBLENBQUEsYUFBQSxDQUFBLFFBQUEsQ0FBQTtBQURBO0FBRUEsZUFBQSxLQUFBLENBQUE7TUFKQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7RUFEQTs7bUJBUUEsb0JBQUEsR0FBQSxTQUFBO0FBQ0EsV0FBQSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUEsRUFBQTtBQUNBLFlBQUE7UUFBQSxLQUFBLENBQUEsSUFBQSxHQUFBO0FBQ0E7QUFBQSxhQUFBLFVBQUE7OztVQUNBLEVBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsQ0FBQSxXQUFBLENBQUEsR0FBQSxDQUFBO0FBREE7QUFFQSxlQUFBLEtBQUEsQ0FBQTtNQUpBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtFQURBOzttQkFRQSxtQkFBQSxHQUFBLFNBQUE7QUFDQSxXQUFBLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtRQUNBLEtBQUEsQ0FBQSxJQUFBLEdBQUEsS0FBQSxDQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUE7TUFGQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7RUFEQTs7bUJBTUEsY0FBQSxHQUFBLFNBQUE7SUFDQSxJQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQTtBQUNBLGFBQUEsSUFBQSxDQUFBLG1CQUFBLENBQUEsRUFEQTtLQUFBLE1BRUEsSUFBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsUUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsSUFBQTtBQUNBLGFBQUEsSUFBQSxDQUFBLG9CQUFBLENBQUEsRUFEQTtLQUFBLE1BQUE7QUFHQSxhQUFBLElBQUEsQ0FBQSxtQkFBQSxDQUFBLEVBSEE7O0VBSEE7O21CQWNBLFlBQUEsR0FBQSxTQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxZQUFBLEdBQUEsSUFBQSxDQUFBLG1CQUFBLENBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxHQUFBLFlBQUEsQ0FBQSxLQUFBLENBQUE7SUFFQSxJQUFBLElBQUEsS0FBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxLQURBOztBQUdBLFdBQUE7RUFSQTs7bUJBWUEsbUJBQUEsR0FBQSxTQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtBQUNBLFdBQUEsSUFBQSxJQUFBLENBQUEsaUJBQUEsQ0FDQSxJQURBLEVBRUE7TUFDQSxPQUFBLEVBQUEsT0FEQTtNQUVBLE9BQUEsRUFBQSxPQUZBO01BR0EsYUFBQSxFQUFBLElBSEE7S0FGQTtFQURBOzttQkFZQSxhQUFBLEdBQUEsU0FBQSxTQUFBLEVBQUEsTUFBQTtBQUNBLFFBQUE7QUFBQSxTQUFBLGdCQUFBOzs7TUFDQSxJQUFBLENBQUEsR0FBQSxDQUFBLEdBQUE7QUFEQTtJQUdBLElBQUEsTUFBQTtNQUNBLElBQUEsQ0FBQSxtQkFBQSxDQUFBLFNBQUEsRUFBQSxNQUFBLEVBREE7O0FBRUEsV0FBQTtFQU5BOzttQkFXQSxtQkFBQSxHQUFBLFNBQUEsU0FBQSxFQUFBLE1BQUE7QUFDQSxRQUFBO0lBQUEsSUFBQSxDQUFBLGlCQUFBOzs7Ozs7Ozs7T0FBQSxJQUFBLENBQUE7QUFDQSxTQUFBLGdCQUFBOzs7TUFDQSxJQUFBLENBQUEsaUJBQUEsQ0FBQSxTQUFBLENBQUEsR0FBQSxDQUFBLEdBQUE7QUFEQTtJQUVBLElBQUEsTUFBQTtNQUNBLElBQUEsQ0FBQSxpQkFBQSxDQUFBLFNBQUEsQ0FBQSxpQkFBQSxHQUFBLElBQUEsQ0FBQSxrQkFEQTs7QUFFQSxXQUFBO0VBTkE7O21CQVNBLE1BQUEsR0FBQSxTQUFBLElBQUE7QUFDQSxRQUFBO0lBQUEsT0FBQSxHQUFBLElBQUEsQ0FBQSxJQUFBO0lBQ0EsR0FBQSxHQUFBLElBQUEsQ0FBQTtBQUNBLFdBQUEsYUFBQSxJQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsT0FBQTtNQUNBLEdBQUEsR0FBQSxHQUFBLENBQUEsU0FBQSxDQUFBO0lBREE7QUFFQSxXQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQTtFQUxBOzttQkFPQSxVQUFBLEdBQUEsU0FBQTtBQUNBLFFBQUE7SUFEQSxxQkFBQTtXQUNBLElBQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsRUFBQSxJQUFBO0VBREE7O21CQUlBLFdBQUEsR0FBQSxTQUFBLE9BQUE7V0FDQTtFQURBOzttQkFJQSxhQUFBLEdBQUEsU0FBQSxTQUFBO1dBQ0EsSUFBQSxDQUFBLElBQUEsQ0FBQTtFQURBOzttQkFJQSxRQUFBLEdBQUEsU0FBQTtXQUNBO0VBREE7O21CQUlBLFlBQUEsR0FBQSxTQUFBLEdBQUE7O21CQUlBLFlBQUEsR0FBQSxTQUFBO1dBQ0E7RUFEQTs7bUJBSUEsWUFBQSxHQUFBLFNBQUE7V0FDQTtFQURBOzttQkFJQSxRQUFBLEdBQUEsU0FBQTtBQUNBLFFBQUE7SUFBQSxJQUFBLEdBQUE7SUFDQSxJQUFBLEdBQUE7QUFDQSxXQUFBLFlBQUE7TUFDQSxJQUFBLG9CQUFBO1FBQ0EsSUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxFQURBOztNQUVBLElBQUEsR0FBQSxJQUFBLENBQUE7SUFIQTtBQUlBLFdBQUE7RUFQQTs7bUJBVUEsUUFBQSxHQUFBLFNBQUE7QUFDQSxRQUFBO0lBQUEsSUFBQSxHQUFBO0lBQ0EsSUFBQSxHQUFBO0FBQ0EsV0FBQSxZQUFBO01BQ0EsSUFBQSxvQkFBQTtRQUNBLElBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsRUFEQTs7TUFFQSxJQUFBLEdBQUEsSUFBQSxDQUFBO0lBSEE7QUFJQSxXQUFBO0VBUEE7Ozs7OztBQVNBOzs7RUFDQSwyQkFBQSxJQUFBLEVBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxtREFBQSxJQUFBLEVBQUEsT0FBQTtJQUVBLElBQUEsQ0FBQSxPQUFBLHVGQUFBO0VBSEE7OzhCQUtBLGlCQUFBLEdBQUE7OzhCQUVBLFlBQUEsR0FBQSxTQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxZQUFBLEdBQUEsb0RBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxLQUFBLE1BQUE7TUFDQSxJQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLFlBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLEVBREE7O0FBR0EsV0FBQTtFQU5BOzs7O0dBUkE7O0FBZ0JBLE1BQUEsQ0FBQSxXQUFBLEdBQUE7O0FBRUEsT0FBQSxHQUFBLFNBQUEsR0FBQTtBQUNBLE1BQUE7QUFBQSxPQUFBLFVBQUE7O0FBQ0EsV0FBQTtBQURBO0FBRUEsU0FBQTtBQUhBOztBQUtBOzs7RUFDQSw0QkFBQSxJQUFBLEVBQUEsT0FBQTtJQUNBLG9EQUFBLElBQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxDQUFBLFFBQUEsR0FBQTtFQUhBOzsrQkFLQSxpQkFBQSxHQUFBOzsrQkFFQSxZQUFBLEdBQUEsU0FBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUE7QUFDQSxRQUFBO0lBQUEsWUFBQSxHQUFBLHFEQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtJQUVBLElBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLE9BQUEsQ0FBQSxZQUFBLENBQUEsUUFBQSxDQUFBO1FBQ0EsSUFBQSxDQUFBLFFBQUEsQ0FBQSxZQUFBLENBQUEsT0FBQSxDQUFBLEdBQUE7VUFDQSxFQUFBLEVBQUEsWUFBQSxDQUFBLE9BREE7VUFFQSxRQUFBLEVBQUEsWUFBQSxDQUFBLFFBRkE7VUFEQTtPQUFBLE1BQUE7UUFNQSxJQUFBLENBQUEsUUFBQSxDQUFBLFlBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQTtVQUNBLEVBQUEsRUFBQSxZQUFBLENBQUEsT0FEQTtVQU5BO09BREE7O0VBSEE7Ozs7R0FSQTs7QUF3QkEsTUFBQSxDQUFBLFlBQUEsR0FBQTs7QUFFQTs7O0VBQ0EsMkJBQUEsSUFBQSxFQUFBLE9BQUE7QUFDQSxRQUFBO0lBQUEsbURBQUEsSUFBQSxFQUFBLE9BQUE7SUFFQSxJQUFBLENBQUEsT0FBQSx1RkFBQTtFQUhBOzs4QkFLQSxpQkFBQSxHQUFBOzs4QkFFQSxZQUFBLEdBQUEsU0FBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUE7QUFDQSxRQUFBO0lBQUEsWUFBQSxHQUFBLG9EQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtJQUVBLElBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLE9BQUEsQ0FBQSxZQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQTtRQUNBLFFBQUEsRUFBQSxZQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQURBO1FBRUEsSUFBQSxFQUFBLElBRkE7UUFHQSxhQUFBLEVBQUEsWUFBQSxDQUFBLElBSEE7UUFJQSxJQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBSkE7UUFEQTs7QUFRQSxXQUFBO0VBWEE7Ozs7R0FSQTs7QUFxQkEsTUFBQSxDQUFBLFdBQUEsR0FBQTs7QUFDQTs7O0VBQ0EsNEJBQUEsSUFBQSxFQUFBLE9BQUE7SUFDQSxvREFBQSxJQUFBLEVBQUEsT0FBQTtJQUVBLElBQUEsQ0FBQSxRQUFBLEdBQUE7RUFIQTs7K0JBS0EsaUJBQUEsR0FBQTs7K0JBRUEsWUFBQSxHQUFBLFNBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0FBQ0EsUUFBQTtJQUFBLFlBQUEsR0FBQSxxREFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUE7SUFFQSxJQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsTUFBQTtNQUNBLElBQUEsQ0FBQSxRQUFBLENBQUEsWUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBO1FBQ0EsRUFBQSxFQUFBLFlBQUEsQ0FBQSxPQURBO1FBRUEsSUFBQSxFQUFBLElBRkE7UUFHQSxhQUFBLEVBQUEsWUFBQSxDQUFBLElBSEE7UUFJQSxJQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBSkE7O01BT0EsSUFBQSxDQUFBLE9BQUEsQ0FBQSxZQUFBLENBQUEsUUFBQSxDQUFBO1FBQ0EsSUFBQSxDQUFBLFFBQUEsQ0FBQSxZQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsUUFBQSxHQUFBLFlBQUEsQ0FBQSxTQURBO09BUkE7O0FBV0EsV0FBQTtFQWRBOzs7O0dBUkE7O0FBd0JBLE1BQUEsQ0FBQSxZQUFBLEdBQUEiLCJmaWxlIjoidG8tanNvbi51bWQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBUb0pzb25cclxuICBjb25zdHJ1Y3RvcjogKEBkYXRhLCBvcHRpb25zKSAtPlxyXG4gICAgaWYgQCBpbnN0YW5jZW9mIFRvSnNvblxyXG4gICAgICAjIENhbGxlZCBhcyBjb25zdHJ1Y3RvclxyXG4gICAgICBpZiBvcHRpb25zP1xyXG4gICAgICAgIEBkYXRhS2V5ID0gb3B0aW9ucy5kYXRhS2V5XHJcbiAgICAgICAgQGpzb25LZXkgPSBvcHRpb25zLmpzb25LZXlcclxuICAgICAgICBAcGFyZW50Q29udGV4dCA9IG9wdGlvbnMucGFyZW50Q29udGV4dFxyXG4gICAgZWxzZVxyXG4gICAgICAjIENhbGxlZCBhcyBmdW5jdGlvblxyXG4gICAgICByZXR1cm4gKG5ldyBUb0pzb24oQGRhdGEsIG9wdGlvbnMpKS5hcHBseSgpXHJcblxyXG4gIGNoaWxkQ29udGV4dENsYXNzOiBAXHJcblxyXG4gICMgQ29udmVydHMgQGRhdGEgaW50byBqc29uIHdoaWxzdCBhcHBseWluZyBmaWx0ZXJzIGFuZCBjb252ZXJzaW9uc1xyXG4gIGFwcGx5OiAoZXhjbHVkZUN1c3RvbVRvSnNvbikgLT5cclxuICAgICMgZXhjbHVkZSBiZWZvcmUgZG9pbmcgYW55dGhpbmc/XHJcbiAgICBpZiBAX2V4Y2x1ZGUoKVxyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcblxyXG4gICAgIyBjb252ZXJ0IHRoZSBpbmNvbWluZyBkYXRhIChjb250ZXh0LmRhdGEpXHJcbiAgICBAX2NvbnZlcnREYXRhKClcclxuXHJcbiAgICAjIGV4Y2x1ZGUgYmFzZWQgb24gdGhlIGNvbnZlcnRlZCBkYXRhXHJcbiAgICBpZiBAX2V4Y2x1ZGVEYXRhKClcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG5cclxuICAgICMgY29udmVydCB0aGUgaW5jb21pbmcgZGF0YSAoY29udGV4dC5kYXRhKSBpbnRvIG91dGdvaW5nIGRhdGEgKGNvbnRleHQuanNvbilcclxuICAgIEBfdG9Kc29uKGV4Y2x1ZGVDdXN0b21Ub0pzb24pXHJcblxyXG4gICAgIyBleGNsdWRlIGJhc2VkIG9uIG91dGdvaW5nIGRhdGE/XHJcbiAgICBpZiBAX2V4Y2x1ZGVKc29uKClcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG5cclxuICAgICMgcmV0dXJuIHRoZSBvdXRnb2luZyBkYXRhIChjb250ZXh0Lmpzb24pXHJcbiAgICByZXR1cm4gQGpzb25cclxuXHJcbiAgIyBDb252ZXJ0cyBAZGF0YSBpbnRvIGpzb25cclxuICBfdG9Kc29uOiAoZXhjbHVkZUN1c3RvbVRvSnNvbikgLT5cclxuICAgIGlmIG5vdCBleGNsdWRlQ3VzdG9tVG9Kc29uIGFuZCBAZGF0YT8udG9Kc29uPyBhbmQgdHlwZW9mIEBkYXRhLnRvSnNvbiA9PSAnZnVuY3Rpb24nXHJcbiAgICAgIEBqc29uID0gQGRhdGEudG9Kc29uKEApXHJcbiAgICBlbHNlIGlmIG5vdCBleGNsdWRlQ3VzdG9tVG9Kc29uIGFuZCBAZGF0YT8udG9KU09OPyBhbmQgdHlwZW9mIEBkYXRhLnRvSlNPTiA9PSAnZnVuY3Rpb24nXHJcbiAgICAgIEBqc29uID0gQGRhdGEudG9KU09OKClcclxuICAgIGVsc2VcclxuICAgICAgQGpzb24gPSBAX2dldEVudW1lcmF0b3IoKShAX3RvSnNvbk5hbWVkLmJpbmQoQCkpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyBSZXR1cm5zIGFuIGVudW1lcmF0b3Igd2hpY2ggaXRlcmF0ZXMgb3ZlciBAZGF0YSBhcyBhbiBhcnJheSwgcmV0dXJuaW5nIHRoZSByZXN1bHRpbmcganNvblxyXG4gIF9nZXRFbnVtZXJhdG9yQXJyYXk6ICgpIC0+XHJcbiAgICByZXR1cm4gKGNiKSA9PlxyXG4gICAgICBAanNvbiA9IFtdXHJcbiAgICAgIGZvciBlbGVtZW50LCBpZWxlbWVudCBpbiBAZGF0YVxyXG4gICAgICAgIGNiKGVsZW1lbnQsIGllbGVtZW50LCBAX2dldEpzb25JbmRleChpZWxlbWVudCkpXHJcbiAgICAgIHJldHVybiBAanNvblxyXG5cclxuICAjIFJldHVybnMgYW4gZW51bWVyYXRvciB3aGljaCBpdGVyYXRlcyBvdmVyIEBkYXRhIGFzIGFuIG9iamVjdCwgcmV0dXJuaW5nIHRoZSByZXN1bHRpbmcganNvblxyXG4gIF9nZXRFbnVtZXJhdG9yT2JqZWN0OiAoKSAtPlxyXG4gICAgcmV0dXJuIChjYikgPT5cclxuICAgICAgQGpzb24gPSB7fVxyXG4gICAgICBmb3Igb3duIGtleSwgdmFsIG9mIEBkYXRhXHJcbiAgICAgICAgY2IodmFsLCBrZXksIEBfZ2V0SnNvbktleShrZXkpKVxyXG4gICAgICByZXR1cm4gQGpzb25cclxuXHJcbiAgIyBSZXR1cm5zIGFuIGVudW1lcmF0b3Igd2hpY2ggc2ltcGx5IHJldHVybnMgQGRhdGFcclxuICBfZ2V0RW51bWVyYXRvclZhbHVlOiAoKSAtPlxyXG4gICAgcmV0dXJuICgpID0+XHJcbiAgICAgIEBqc29uID0gQGRhdGFcclxuICAgICAgcmV0dXJuIEBqc29uXHJcblxyXG4gICMgUmV0dXJucyBhbiBlbnVtZXJhdG9yIHdoaWNoIGVudW1lcmF0ZXMgb3ZlciBkYXRhLCByZXR1cm5pbmcgdGhlIHJlc3VsdGluZyBqc29uXHJcbiAgX2dldEVudW1lcmF0b3I6ICgpIC0+XHJcbiAgICBpZiBBcnJheS5pc0FycmF5KEBkYXRhKVxyXG4gICAgICByZXR1cm4gQF9nZXRFbnVtZXJhdG9yQXJyYXkoKVxyXG4gICAgZWxzZSBpZiB0eXBlb2YgQGRhdGEgPT0gJ29iamVjdCcgYW5kIEBkYXRhICE9IG51bGxcclxuICAgICAgcmV0dXJuIEBfZ2V0RW51bWVyYXRvck9iamVjdCgpXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVybiBAX2dldEVudW1lcmF0b3JWYWx1ZSgpXHJcblxyXG4gICMjXHJcbiAgIyBTdGFuZGFyZCBjYWxsYmFjayB1c2VkIGluIGVudW1lcmF0b3JzLlxyXG4gICMgQHBhcmFtIGRhdGEgLSBkYXRhIHRvIGJlIGNvbnZlcnRlZFxyXG4gICMgQHBhcmFtIGRhdGFLZXkge3N0cmluZ3xpbnR9IC0ga2V5L2luZGV4IGludG8gdGhlIHBhcmVudCBzb3VyY2UgZGF0YSBhcyBkZXRlcm1pbmVkIGJ5IHRoZSBlbnVtZXJhdG9yXHJcbiAgIyBAcGFyYW0ganNvbktleSB7c3RyaW5nfGludH0gLSBrZXkvaW5kZXggaW50byB0aGUganNvbiB0YXJnZXQgZGF0YSBhcyBkZXRlcm1pbmVkIGJ5IHRoZSBlbnVtZXJhdG9yXHJcbiAgIyBAcmV0dXJuIHt0b0pzb259IGNoaWxkIGNvbnRleHRcclxuICBfdG9Kc29uTmFtZWQ6IChkYXRhLCBkYXRhS2V5LCBqc29uS2V5KSAtPlxyXG4gICAgY2hpbGRDb250ZXh0ID0gQF9jcmVhdGVDaGlsZENvbnRleHQoZGF0YSwgZGF0YUtleSwganNvbktleSlcclxuXHJcbiAgICBqc29uID0gY2hpbGRDb250ZXh0LmFwcGx5KClcclxuXHJcbiAgICBpZiBqc29uICE9IHVuZGVmaW5lZFxyXG4gICAgICBAanNvbltqc29uS2V5XSA9IGpzb25cclxuXHJcbiAgICByZXR1cm4gY2hpbGRDb250ZXh0XHJcblxyXG4gICMgcmV0dXJucyBhIG5ldyBjb250ZXh0IGZvciB1c2Ugd2l0aCBjaGlsZCBkYXRhXHJcbiAgIyBhcmd1bWVudHMgYXJlIHRoZSBzYW1lIGFzIHRob3NlIGdpdmVuIHRvIEBfdG9Kc29uTmFtZWRcclxuICBfY3JlYXRlQ2hpbGRDb250ZXh0OiAoZGF0YSwgZGF0YUtleSwganNvbktleSkgLT5cclxuICAgIHJldHVybiBuZXcgQGNoaWxkQ29udGV4dENsYXNzKFxyXG4gICAgICBkYXRhLFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0YUtleTogZGF0YUtleVxyXG4gICAgICAgIGpzb25LZXk6IGpzb25LZXlcclxuICAgICAgICBwYXJlbnRDb250ZXh0OiBAXHJcbiAgICAgIH1cclxuICAgIClcclxuXHJcbiAgIyBVdGlsaXR5IGZ1bmN0aW9uIGZvciBvdmVycmlkaW5nIGNoaWxkIGNvbnRleHQgbWV0aG9kc1xyXG4gICMgVXNlZnVsIGZvciBhcHBseWluZyB2YXJpb3VzIGZpbHRlcnMgZXRjIGZvciB0aGUgY3VycmVudCBjb250ZXh0XHJcbiAgYWRqdXN0Q29udGV4dDogKG92ZXJyaWRlcywgc3RpY2t5KSAtPlxyXG4gICAgZm9yIG93biBrZXksIHZhbHVlIG9mIG92ZXJyaWRlc1xyXG4gICAgICBAW2tleV0gPSB2YWx1ZVxyXG5cclxuICAgIGlmIHN0aWNreVxyXG4gICAgICBAYWRqdXN0Q2hpbGRDb250ZXh0cyhvdmVycmlkZXMsIHN0aWNreSlcclxuICAgIHJldHVybiBAXHJcblxyXG4gICMgVXRpbGl0eSBmdW5jdGlvbiBmb3Igb3ZlcnJpZGluZyBjaGlsZCBjb250ZXh0IG1ldGhvZHNcclxuICAjIFVzZWZ1bCBmb3IgYXBwbHlpbmcgdmFyaW91cyBmaWx0ZXJzIGV0YyBmb3Igb25seSB0aGUgaW1tZWRpYXRlIGNoaWxkIGNsYXNzZXNcclxuICAjIEBwYXJhbSB7Qm9vbGVhbn0gc3RpY2t5IC0gSWYgVHJ1ZSwgYWxsIGZ1dHVyZSBnZW5lcmF0aW9ucyB3aWxsIGJlIG92ZXJyaWRkZW5cclxuICBhZGp1c3RDaGlsZENvbnRleHRzOiAob3ZlcnJpZGVzLCBzdGlja3kpIC0+XHJcbiAgICBAY2hpbGRDb250ZXh0Q2xhc3MgPSBjbGFzcyBleHRlbmRzIEBjaGlsZENvbnRleHRDbGFzc1xyXG4gICAgZm9yIG93biBrZXksIHZhbHVlIG9mIG92ZXJyaWRlc1xyXG4gICAgICBAY2hpbGRDb250ZXh0Q2xhc3MucHJvdG90eXBlW2tleV0gPSB2YWx1ZVxyXG4gICAgaWYgc3RpY2t5XHJcbiAgICAgIEBjaGlsZENvbnRleHRDbGFzcy5wcm90b3R5cGUuY2hpbGRDb250ZXh0Q2xhc3MgPSBAY2hpbGRDb250ZXh0Q2xhc3NcclxuICAgIHJldHVybiBAXHJcblxyXG4gICMgdXRpbGl0eSBmdW5jdGlvbiBmb3IgY2hhaW5pbmcgc3VwZXIgbWV0aG9kc1xyXG4gIF9zdXBlcjogKG5hbWUpIC0+XHJcbiAgICBjdXJyZW50ID0gQFtuYW1lXVxyXG4gICAgY2xzID0gQGNvbnN0cnVjdG9yXHJcbiAgICB3aGlsZSBjbHM/IGFuZCBjbHMucHJvdG90eXBlW25hbWVdID09IGN1cnJlbnRcclxuICAgICAgY2xzID0gY2xzLl9fc3VwZXJfXy5jb25zdHJ1Y3RvclxyXG4gICAgcmV0dXJuIGNscy5wcm90b3R5cGVbbmFtZV1cclxuXHJcbiAgX2NhbGxTdXBlcjogKG5hbWUsIGFyZ3MuLi4pIC0+XHJcbiAgICBAX3N1cGVyKG5hbWUpLmFwcGx5KEAsIGFyZ3MpXHJcblxyXG4gICMgUmV0dXJucyB0aGUga2V5IHRvIHVzZSBmb3IgdGhlIGpzb24gb3V0cHV0XHJcbiAgX2dldEpzb25LZXk6IChkYXRhS2V5KSAtPlxyXG4gICAgZGF0YUtleVxyXG5cclxuICAjIFJldHVybnMgdGhlIGtleSB0byB1c2UgZm9yIHRoZSBqc29uIG91dHB1dFxyXG4gIF9nZXRKc29uSW5kZXg6IChkYXRhSW5kZXgpIC0+XHJcbiAgICBAanNvbi5sZW5ndGhcclxuXHJcbiAgIyBleGNsdWRlIGJlZm9yZSBkb2luZyBhbnl0aGluZz9cclxuICBfZXhjbHVkZTogKCkgLT5cclxuICAgIGZhbHNlXHJcblxyXG4gICMgY29udmVydCB0aGUgaW5jb21pbmcgZGF0YVxyXG4gIF9jb252ZXJ0RGF0YTogKCkgLT5cclxuICAgIHJldHVyblxyXG5cclxuICAjIGV4Y2x1ZGUgYmFzZWQgb24gdGhlIGNvbnZlcnRlZCBkYXRhXHJcbiAgX2V4Y2x1ZGVEYXRhOiAoKSAtPlxyXG4gICAgZmFsc2VcclxuXHJcbiAgIyBleGNsdWRlIGJhc2VkIG9uIG91dGdvaW5nIGRhdGE/XHJcbiAgX2V4Y2x1ZGVKc29uOiAoKSAtPlxyXG4gICAgZmFsc2VcclxuXHJcbiAgIyByZXR1cm4gZGF0YSBwYXRoIGZvciB0aGlzIGNvbnRleHRcclxuICBkYXRhUGF0aDogKCkgLT5cclxuICAgIHBhdGggPSBbXVxyXG4gICAgbm9kZSA9IEBcclxuICAgIHdoaWxlIG5vZGU/XHJcbiAgICAgIGlmIG5vZGUuZGF0YUtleT9cclxuICAgICAgICBwYXRoLnVuc2hpZnQobm9kZS5kYXRhS2V5KVxyXG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRDb250ZXh0XHJcbiAgICByZXR1cm4gcGF0aFxyXG5cclxuICAjIHJldHVybiBqc29uIHBhdGggZm9yIHRoaXMgY29udGV4dFxyXG4gIGpzb25QYXRoOiAoKSAtPlxyXG4gICAgcGF0aCA9IFtdXHJcbiAgICBub2RlID0gQFxyXG4gICAgd2hpbGUgbm9kZT9cclxuICAgICAgaWYgbm9kZS5qc29uS2V5P1xyXG4gICAgICAgIHBhdGgudW5zaGlmdChub2RlLmpzb25LZXkpXHJcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudENvbnRleHRcclxuICAgIHJldHVybiBwYXRoXHJcblxyXG5jbGFzcyBUb0pzb25XaXRoUGF0aE1hcCBleHRlbmRzIFRvSnNvblxyXG4gIGNvbnN0cnVjdG9yOiAoZGF0YSwgb3B0aW9ucykgLT5cclxuICAgIHN1cGVyKGRhdGEsIG9wdGlvbnMpXHJcblxyXG4gICAgQHBhdGhNYXAgPSBAcGFyZW50Q29udGV4dD8ucGF0aE1hcCA/IHt9XHJcblxyXG4gIGNoaWxkQ29udGV4dENsYXNzOiBAXHJcblxyXG4gIF90b0pzb25OYW1lZDogKGRhdGEsIGRhdGFLZXksIGpzb25LZXkpIC0+XHJcbiAgICBjaGlsZENvbnRleHQgPSBzdXBlcihkYXRhLCBkYXRhS2V5LCBqc29uS2V5KVxyXG5cclxuICAgIGlmIEBqc29uW2pzb25LZXldICE9IHVuZGVmaW5lZFxyXG4gICAgICBAcGF0aE1hcFtjaGlsZENvbnRleHQuanNvblBhdGgoKS5qb2luKCcvJyldID0gY2hpbGRDb250ZXh0LmRhdGFQYXRoKCkuam9pbignLycpXHJcblxyXG4gICAgcmV0dXJuIGNoaWxkQ29udGV4dFxyXG5cclxuVG9Kc29uLldpdGhQYXRoTWFwID0gVG9Kc29uV2l0aFBhdGhNYXBcclxuXHJcbmlzRW1wdHkgPSAob2JqKSAtPlxyXG4gIGZvciBvd24ga2V5IG9mIG9ialxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgcmV0dXJuIHRydWVcclxuXHJcbmNsYXNzIFRvSnNvbldpdGhQYXRoVHJlZSBleHRlbmRzIFRvSnNvblxyXG4gIGNvbnN0cnVjdG9yOiAoZGF0YSwgb3B0aW9ucykgLT5cclxuICAgIHN1cGVyKGRhdGEsIG9wdGlvbnMpXHJcblxyXG4gICAgQHBhdGhUcmVlID0ge31cclxuXHJcbiAgY2hpbGRDb250ZXh0Q2xhc3M6IEBcclxuXHJcbiAgX3RvSnNvbk5hbWVkOiAoZGF0YSwgZGF0YUtleSwganNvbktleSkgLT5cclxuICAgIGNoaWxkQ29udGV4dCA9IHN1cGVyKGRhdGEsIGRhdGFLZXksIGpzb25LZXkpXHJcblxyXG4gICAgaWYgQGpzb25banNvbktleV0gIT0gdW5kZWZpbmVkXHJcbiAgICAgIGlmIG5vdCBpc0VtcHR5KGNoaWxkQ29udGV4dC5wYXRoVHJlZSlcclxuICAgICAgICBAcGF0aFRyZWVbY2hpbGRDb250ZXh0Lmpzb25LZXldID0ge1xyXG4gICAgICAgICAgaWQ6IGNoaWxkQ29udGV4dC5kYXRhS2V5LFxyXG4gICAgICAgICAgY2hpbGRyZW46IGNoaWxkQ29udGV4dC5wYXRoVHJlZVxyXG4gICAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBwYXRoVHJlZVtjaGlsZENvbnRleHQuanNvbktleV0gPSB7XHJcbiAgICAgICAgICBpZDogY2hpbGRDb250ZXh0LmRhdGFLZXlcclxuICAgICAgICB9XHJcblxyXG4gICAgcmV0dXJuXHJcblxyXG5Ub0pzb24uV2l0aFBhdGhUcmVlID0gVG9Kc29uV2l0aFBhdGhUcmVlXHJcblxyXG5jbGFzcyBUb0pzb25XaXRoRGF0YU1hcCBleHRlbmRzIFRvSnNvblxyXG4gIGNvbnN0cnVjdG9yOiAoZGF0YSwgb3B0aW9ucykgLT5cclxuICAgIHN1cGVyKGRhdGEsIG9wdGlvbnMpXHJcblxyXG4gICAgQGRhdGFNYXAgPSBAcGFyZW50Q29udGV4dD8uZGF0YU1hcCA/IHt9XHJcblxyXG4gIGNoaWxkQ29udGV4dENsYXNzOiBAXHJcblxyXG4gIF90b0pzb25OYW1lZDogKGRhdGEsIGRhdGFLZXksIGpzb25LZXkpIC0+XHJcbiAgICBjaGlsZENvbnRleHQgPSBzdXBlcihkYXRhLCBkYXRhS2V5LCBqc29uS2V5KVxyXG5cclxuICAgIGlmIEBqc29uW2pzb25LZXldICE9IHVuZGVmaW5lZFxyXG4gICAgICBAZGF0YU1hcFtjaGlsZENvbnRleHQuanNvblBhdGgoKS5qb2luKCcvJyldID0ge1xyXG4gICAgICAgIGRhdGFQYXRoOiBjaGlsZENvbnRleHQuZGF0YVBhdGgoKS5qb2luKCcvJylcclxuICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgY29udmVydGVkRGF0YTogY2hpbGRDb250ZXh0LmRhdGFcclxuICAgICAgICBqc29uOiBAanNvbltqc29uS2V5XVxyXG4gICAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkQ29udGV4dFxyXG5cclxuVG9Kc29uLldpdGhEYXRhTWFwID0gVG9Kc29uV2l0aERhdGFNYXBcclxuY2xhc3MgVG9Kc29uV2l0aERhdGFUcmVlIGV4dGVuZHMgVG9Kc29uXHJcbiAgY29uc3RydWN0b3I6IChkYXRhLCBvcHRpb25zKSAtPlxyXG4gICAgc3VwZXIoZGF0YSwgb3B0aW9ucylcclxuXHJcbiAgICBAZGF0YVRyZWUgPSB7fVxyXG5cclxuICBjaGlsZENvbnRleHRDbGFzczogQFxyXG5cclxuICBfdG9Kc29uTmFtZWQ6IChkYXRhLCBkYXRhS2V5LCBqc29uS2V5KSAtPlxyXG4gICAgY2hpbGRDb250ZXh0ID0gc3VwZXIoZGF0YSwgZGF0YUtleSwganNvbktleSlcclxuXHJcbiAgICBpZiBAanNvbltqc29uS2V5XSAhPSB1bmRlZmluZWRcclxuICAgICAgQGRhdGFUcmVlW2NoaWxkQ29udGV4dC5qc29uS2V5XSA9IHtcclxuICAgICAgICBpZDogY2hpbGRDb250ZXh0LmRhdGFLZXlcclxuICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgY29udmVydGVkRGF0YTogY2hpbGRDb250ZXh0LmRhdGFcclxuICAgICAgICBqc29uOiBAanNvbltqc29uS2V5XVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiBub3QgaXNFbXB0eShjaGlsZENvbnRleHQuZGF0YVRyZWUpXHJcbiAgICAgICAgQGRhdGFUcmVlW2NoaWxkQ29udGV4dC5qc29uS2V5XS5jaGlsZHJlbiA9IGNoaWxkQ29udGV4dC5kYXRhVHJlZVxyXG5cclxuICAgIHJldHVybiBjaGlsZENvbnRleHRcclxuXHJcblRvSnNvbi5XaXRoRGF0YVRyZWUgPSBUb0pzb25XaXRoRGF0YVRyZWVcclxuIl19