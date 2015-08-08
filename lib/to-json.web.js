;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.toJson = factory();
  }
}(this, function () {
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
    var ref;
    if (this[name] !== this.constructor.prototype[name]) {
      return this.constructor.prototype[name];
    } else {
      return (ref = this.constructor.__super__) != null ? ref[name] : void 0;
    }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvLWpzb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsNkZBQUE7RUFBQTs7OztBQUFBO0VBQ0EsZ0JBQUEsS0FBQSxFQUFBLE9BQUE7SUFBQSxJQUFBLENBQUEsT0FBQTtJQUNBLElBQUEsSUFBQSxZQUFBLE1BQUE7TUFFQSxJQUFBLGVBQUE7UUFDQSxJQUFBLENBQUEsT0FBQSxHQUFBLE9BQUEsQ0FBQTtRQUNBLElBQUEsQ0FBQSxPQUFBLEdBQUEsT0FBQSxDQUFBO1FBQ0EsSUFBQSxDQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEsY0FIQTtPQUZBO0tBQUEsTUFBQTtBQVFBLGFBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLEVBUkE7O0VBREE7O21CQVdBLGlCQUFBLEdBQUE7O21CQUdBLEtBQUEsR0FBQSxTQUFBLG1CQUFBO0lBRUEsSUFBQSxJQUFBLENBQUEsUUFBQSxDQUFBLENBQUE7QUFDQSxhQUFBLE9BREE7O0lBSUEsSUFBQSxDQUFBLFlBQUEsQ0FBQTtJQUdBLElBQUEsSUFBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBO0FBQ0EsYUFBQSxPQURBOztJQUlBLElBQUEsQ0FBQSxPQUFBLENBQUEsbUJBQUE7SUFHQSxJQUFBLElBQUEsQ0FBQSxZQUFBLENBQUEsQ0FBQTtBQUNBLGFBQUEsT0FEQTs7QUFJQSxXQUFBLElBQUEsQ0FBQTtFQXBCQTs7bUJBdUJBLE9BQUEsR0FBQSxTQUFBLG1CQUFBO0FBQ0EsUUFBQTtJQUFBLElBQUEsQ0FBQSxtQkFBQSxJQUFBLDJEQUFBLElBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsS0FBQSxVQUFBO01BQ0EsSUFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBLEVBREE7S0FBQSxNQUVBLElBQUEsQ0FBQSxtQkFBQSxJQUFBLDZEQUFBLElBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsS0FBQSxVQUFBO01BQ0EsSUFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsQ0FBQSxFQURBO0tBQUEsTUFBQTtNQUdBLElBQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBLGNBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLFlBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLEVBSEE7O0VBSEE7O21CQVVBLG1CQUFBLEdBQUEsU0FBQTtBQUNBLFdBQUEsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBLEVBQUE7QUFDQSxZQUFBO1FBQUEsS0FBQSxDQUFBLElBQUEsR0FBQTtBQUNBO0FBQUEsYUFBQSwyREFBQTs7VUFDQSxFQUFBLENBQUEsT0FBQSxFQUFBLFFBQUEsRUFBQSxLQUFBLENBQUEsYUFBQSxDQUFBLFFBQUEsQ0FBQTtBQURBO0FBRUEsZUFBQSxLQUFBLENBQUE7TUFKQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7RUFEQTs7bUJBUUEsb0JBQUEsR0FBQSxTQUFBO0FBQ0EsV0FBQSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUEsRUFBQTtBQUNBLFlBQUE7UUFBQSxLQUFBLENBQUEsSUFBQSxHQUFBO0FBQ0E7QUFBQSxhQUFBLFVBQUE7OztVQUNBLEVBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsQ0FBQSxXQUFBLENBQUEsR0FBQSxDQUFBO0FBREE7QUFFQSxlQUFBLEtBQUEsQ0FBQTtNQUpBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtFQURBOzttQkFRQSxtQkFBQSxHQUFBLFNBQUE7QUFDQSxXQUFBLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtRQUNBLEtBQUEsQ0FBQSxJQUFBLEdBQUEsS0FBQSxDQUFBO0FBQ0EsZUFBQSxLQUFBLENBQUE7TUFGQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7RUFEQTs7bUJBTUEsY0FBQSxHQUFBLFNBQUE7SUFDQSxJQUFBLEtBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQTtBQUNBLGFBQUEsSUFBQSxDQUFBLG1CQUFBLENBQUEsRUFEQTtLQUFBLE1BRUEsSUFBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsUUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsSUFBQTtBQUNBLGFBQUEsSUFBQSxDQUFBLG9CQUFBLENBQUEsRUFEQTtLQUFBLE1BQUE7QUFHQSxhQUFBLElBQUEsQ0FBQSxtQkFBQSxDQUFBLEVBSEE7O0VBSEE7O21CQWNBLFlBQUEsR0FBQSxTQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxZQUFBLEdBQUEsSUFBQSxDQUFBLG1CQUFBLENBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxHQUFBLFlBQUEsQ0FBQSxLQUFBLENBQUE7SUFFQSxJQUFBLElBQUEsS0FBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxLQURBOztBQUdBLFdBQUE7RUFSQTs7bUJBWUEsbUJBQUEsR0FBQSxTQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtBQUNBLFdBQUEsSUFBQSxJQUFBLENBQUEsaUJBQUEsQ0FDQSxJQURBLEVBRUE7TUFDQSxPQUFBLEVBQUEsT0FEQTtNQUVBLE9BQUEsRUFBQSxPQUZBO01BR0EsYUFBQSxFQUFBLElBSEE7S0FGQTtFQURBOzttQkFZQSxhQUFBLEdBQUEsU0FBQSxTQUFBLEVBQUEsTUFBQTtBQUNBLFFBQUE7QUFBQSxTQUFBLGdCQUFBOzs7TUFDQSxJQUFBLENBQUEsR0FBQSxDQUFBLEdBQUE7QUFEQTtJQUdBLElBQUEsTUFBQTtNQUNBLElBQUEsQ0FBQSxtQkFBQSxDQUFBLFNBQUEsRUFBQSxNQUFBLEVBREE7O0FBRUEsV0FBQTtFQU5BOzttQkFXQSxtQkFBQSxHQUFBLFNBQUEsU0FBQSxFQUFBLE1BQUE7QUFDQSxRQUFBO0lBQUEsSUFBQSxDQUFBLGlCQUFBOzs7Ozs7Ozs7T0FBQSxJQUFBLENBQUE7QUFDQSxTQUFBLGdCQUFBOzs7TUFDQSxJQUFBLENBQUEsaUJBQUEsQ0FBQSxTQUFBLENBQUEsR0FBQSxDQUFBLEdBQUE7QUFEQTtJQUVBLElBQUEsTUFBQTtNQUNBLElBQUEsQ0FBQSxpQkFBQSxDQUFBLFNBQUEsQ0FBQSxpQkFBQSxHQUFBLElBQUEsQ0FBQSxrQkFEQTs7QUFFQSxXQUFBO0VBTkE7O21CQVNBLE1BQUEsR0FBQSxTQUFBLElBQUE7QUFDQSxRQUFBO0lBQUEsSUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsSUFBQSxDQUFBLFdBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBO0FBQ0EsYUFBQSxJQUFBLENBQUEsV0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBLEVBREE7S0FBQSxNQUFBO0FBR0EsNkRBQUEsQ0FBQSxJQUFBLFdBSEE7O0VBREE7O21CQU1BLFVBQUEsR0FBQSxTQUFBO0FBQ0EsUUFBQTtJQURBLHFCQUFBO1dBQ0EsSUFBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsSUFBQSxFQUFBLElBQUE7RUFEQTs7bUJBSUEsV0FBQSxHQUFBLFNBQUEsT0FBQTtXQUNBO0VBREE7O21CQUlBLGFBQUEsR0FBQSxTQUFBLFNBQUE7V0FDQSxJQUFBLENBQUEsSUFBQSxDQUFBO0VBREE7O21CQUlBLFFBQUEsR0FBQSxTQUFBO1dBQ0E7RUFEQTs7bUJBSUEsWUFBQSxHQUFBLFNBQUEsR0FBQTs7bUJBSUEsWUFBQSxHQUFBLFNBQUE7V0FDQTtFQURBOzttQkFJQSxZQUFBLEdBQUEsU0FBQTtXQUNBO0VBREE7O21CQUlBLFFBQUEsR0FBQSxTQUFBO0FBQ0EsUUFBQTtJQUFBLElBQUEsR0FBQTtJQUNBLElBQUEsR0FBQTtBQUNBLFdBQUEsWUFBQTtNQUNBLElBQUEsb0JBQUE7UUFDQSxJQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLEVBREE7O01BRUEsSUFBQSxHQUFBLElBQUEsQ0FBQTtJQUhBO0FBSUEsV0FBQTtFQVBBOzttQkFVQSxRQUFBLEdBQUEsU0FBQTtBQUNBLFFBQUE7SUFBQSxJQUFBLEdBQUE7SUFDQSxJQUFBLEdBQUE7QUFDQSxXQUFBLFlBQUE7TUFDQSxJQUFBLG9CQUFBO1FBQ0EsSUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxFQURBOztNQUVBLElBQUEsR0FBQSxJQUFBLENBQUE7SUFIQTtBQUlBLFdBQUE7RUFQQTs7Ozs7O0FBU0E7OztFQUNBLDJCQUFBLElBQUEsRUFBQSxPQUFBO0FBQ0EsUUFBQTtJQUFBLG1EQUFBLElBQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxDQUFBLE9BQUEsdUZBQUE7RUFIQTs7OEJBS0EsaUJBQUEsR0FBQTs7OEJBRUEsWUFBQSxHQUFBLFNBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0FBQ0EsUUFBQTtJQUFBLFlBQUEsR0FBQSxvREFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUE7SUFFQSxJQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsTUFBQTtNQUNBLElBQUEsQ0FBQSxPQUFBLENBQUEsWUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsWUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsRUFEQTs7QUFHQSxXQUFBO0VBTkE7Ozs7R0FSQTs7QUFnQkEsTUFBQSxDQUFBLFdBQUEsR0FBQTs7QUFFQSxPQUFBLEdBQUEsU0FBQSxHQUFBO0FBQ0EsTUFBQTtBQUFBLE9BQUEsVUFBQTs7QUFDQSxXQUFBO0FBREE7QUFFQSxTQUFBO0FBSEE7O0FBS0E7OztFQUNBLDRCQUFBLElBQUEsRUFBQSxPQUFBO0lBQ0Esb0RBQUEsSUFBQSxFQUFBLE9BQUE7SUFFQSxJQUFBLENBQUEsUUFBQSxHQUFBO0VBSEE7OytCQUtBLGlCQUFBLEdBQUE7OytCQUVBLFlBQUEsR0FBQSxTQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxZQUFBLEdBQUEscURBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxLQUFBLE1BQUE7TUFDQSxJQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQSxRQUFBLENBQUE7UUFDQSxJQUFBLENBQUEsUUFBQSxDQUFBLFlBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQTtVQUNBLEVBQUEsRUFBQSxZQUFBLENBQUEsT0FEQTtVQUVBLFFBQUEsRUFBQSxZQUFBLENBQUEsUUFGQTtVQURBO09BQUEsTUFBQTtRQU1BLElBQUEsQ0FBQSxRQUFBLENBQUEsWUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBO1VBQ0EsRUFBQSxFQUFBLFlBQUEsQ0FBQSxPQURBO1VBTkE7T0FEQTs7RUFIQTs7OztHQVJBOztBQXdCQSxNQUFBLENBQUEsWUFBQSxHQUFBOztBQUVBOzs7RUFDQSwyQkFBQSxJQUFBLEVBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxtREFBQSxJQUFBLEVBQUEsT0FBQTtJQUVBLElBQUEsQ0FBQSxPQUFBLHVGQUFBO0VBSEE7OzhCQUtBLGlCQUFBLEdBQUE7OzhCQUVBLFlBQUEsR0FBQSxTQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxZQUFBLEdBQUEsb0RBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxLQUFBLE1BQUE7TUFDQSxJQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBO1FBQ0EsUUFBQSxFQUFBLFlBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBREE7UUFFQSxJQUFBLEVBQUEsSUFGQTtRQUdBLGFBQUEsRUFBQSxZQUFBLENBQUEsSUFIQTtRQUlBLElBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FKQTtRQURBOztBQVFBLFdBQUE7RUFYQTs7OztHQVJBOztBQXFCQSxNQUFBLENBQUEsV0FBQSxHQUFBOztBQUNBOzs7RUFDQSw0QkFBQSxJQUFBLEVBQUEsT0FBQTtJQUNBLG9EQUFBLElBQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxDQUFBLFFBQUEsR0FBQTtFQUhBOzsrQkFLQSxpQkFBQSxHQUFBOzsrQkFFQSxZQUFBLEdBQUEsU0FBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUE7QUFDQSxRQUFBO0lBQUEsWUFBQSxHQUFBLHFEQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtJQUVBLElBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLFFBQUEsQ0FBQSxZQUFBLENBQUEsT0FBQSxDQUFBLEdBQUE7UUFDQSxFQUFBLEVBQUEsWUFBQSxDQUFBLE9BREE7UUFFQSxJQUFBLEVBQUEsSUFGQTtRQUdBLGFBQUEsRUFBQSxZQUFBLENBQUEsSUFIQTtRQUlBLElBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FKQTs7TUFPQSxJQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQSxRQUFBLENBQUE7UUFDQSxJQUFBLENBQUEsUUFBQSxDQUFBLFlBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxRQUFBLEdBQUEsWUFBQSxDQUFBLFNBREE7T0FSQTs7QUFXQSxXQUFBO0VBZEE7Ozs7R0FSQTs7QUF3QkEsTUFBQSxDQUFBLFlBQUEsR0FBQSIsImZpbGUiOiJ0by1qc29uLndlYi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFRvSnNvblxyXG4gIGNvbnN0cnVjdG9yOiAoQGRhdGEsIG9wdGlvbnMpIC0+XHJcbiAgICBpZiBAIGluc3RhbmNlb2YgVG9Kc29uXHJcbiAgICAgICMgQ2FsbGVkIGFzIGNvbnN0cnVjdG9yXHJcbiAgICAgIGlmIG9wdGlvbnM/XHJcbiAgICAgICAgQGRhdGFLZXkgPSBvcHRpb25zLmRhdGFLZXlcclxuICAgICAgICBAanNvbktleSA9IG9wdGlvbnMuanNvbktleVxyXG4gICAgICAgIEBwYXJlbnRDb250ZXh0ID0gb3B0aW9ucy5wYXJlbnRDb250ZXh0XHJcbiAgICBlbHNlXHJcbiAgICAgICMgQ2FsbGVkIGFzIGZ1bmN0aW9uXHJcbiAgICAgIHJldHVybiAobmV3IFRvSnNvbihAZGF0YSwgb3B0aW9ucykpLmFwcGx5KClcclxuXHJcbiAgY2hpbGRDb250ZXh0Q2xhc3M6IEBcclxuXHJcbiAgIyBDb252ZXJ0cyBAZGF0YSBpbnRvIGpzb24gd2hpbHN0IGFwcGx5aW5nIGZpbHRlcnMgYW5kIGNvbnZlcnNpb25zXHJcbiAgYXBwbHk6IChleGNsdWRlQ3VzdG9tVG9Kc29uKSAtPlxyXG4gICAgIyBleGNsdWRlIGJlZm9yZSBkb2luZyBhbnl0aGluZz9cclxuICAgIGlmIEBfZXhjbHVkZSgpXHJcbiAgICAgIHJldHVybiB1bmRlZmluZWRcclxuXHJcbiAgICAjIGNvbnZlcnQgdGhlIGluY29taW5nIGRhdGEgKGNvbnRleHQuZGF0YSlcclxuICAgIEBfY29udmVydERhdGEoKVxyXG5cclxuICAgICMgZXhjbHVkZSBiYXNlZCBvbiB0aGUgY29udmVydGVkIGRhdGFcclxuICAgIGlmIEBfZXhjbHVkZURhdGEoKVxyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcblxyXG4gICAgIyBjb252ZXJ0IHRoZSBpbmNvbWluZyBkYXRhIChjb250ZXh0LmRhdGEpIGludG8gb3V0Z29pbmcgZGF0YSAoY29udGV4dC5qc29uKVxyXG4gICAgQF90b0pzb24oZXhjbHVkZUN1c3RvbVRvSnNvbilcclxuXHJcbiAgICAjIGV4Y2x1ZGUgYmFzZWQgb24gb3V0Z29pbmcgZGF0YT9cclxuICAgIGlmIEBfZXhjbHVkZUpzb24oKVxyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcblxyXG4gICAgIyByZXR1cm4gdGhlIG91dGdvaW5nIGRhdGEgKGNvbnRleHQuanNvbilcclxuICAgIHJldHVybiBAanNvblxyXG5cclxuICAjIENvbnZlcnRzIEBkYXRhIGludG8ganNvblxyXG4gIF90b0pzb246IChleGNsdWRlQ3VzdG9tVG9Kc29uKSAtPlxyXG4gICAgaWYgbm90IGV4Y2x1ZGVDdXN0b21Ub0pzb24gYW5kIEBkYXRhPy50b0pzb24/IGFuZCB0eXBlb2YgQGRhdGEudG9Kc29uID09ICdmdW5jdGlvbidcclxuICAgICAgQGpzb24gPSBAZGF0YS50b0pzb24oQClcclxuICAgIGVsc2UgaWYgbm90IGV4Y2x1ZGVDdXN0b21Ub0pzb24gYW5kIEBkYXRhPy50b0pTT04/IGFuZCB0eXBlb2YgQGRhdGEudG9KU09OID09ICdmdW5jdGlvbidcclxuICAgICAgQGpzb24gPSBAZGF0YS50b0pTT04oKVxyXG4gICAgZWxzZVxyXG4gICAgICBAanNvbiA9IEBfZ2V0RW51bWVyYXRvcigpKEBfdG9Kc29uTmFtZWQuYmluZChAKSlcclxuICAgIHJldHVyblxyXG5cclxuICAjIFJldHVybnMgYW4gZW51bWVyYXRvciB3aGljaCBpdGVyYXRlcyBvdmVyIEBkYXRhIGFzIGFuIGFycmF5LCByZXR1cm5pbmcgdGhlIHJlc3VsdGluZyBqc29uXHJcbiAgX2dldEVudW1lcmF0b3JBcnJheTogKCkgLT5cclxuICAgIHJldHVybiAoY2IpID0+XHJcbiAgICAgIEBqc29uID0gW11cclxuICAgICAgZm9yIGVsZW1lbnQsIGllbGVtZW50IGluIEBkYXRhXHJcbiAgICAgICAgY2IoZWxlbWVudCwgaWVsZW1lbnQsIEBfZ2V0SnNvbkluZGV4KGllbGVtZW50KSlcclxuICAgICAgcmV0dXJuIEBqc29uXHJcblxyXG4gICMgUmV0dXJucyBhbiBlbnVtZXJhdG9yIHdoaWNoIGl0ZXJhdGVzIG92ZXIgQGRhdGEgYXMgYW4gb2JqZWN0LCByZXR1cm5pbmcgdGhlIHJlc3VsdGluZyBqc29uXHJcbiAgX2dldEVudW1lcmF0b3JPYmplY3Q6ICgpIC0+XHJcbiAgICByZXR1cm4gKGNiKSA9PlxyXG4gICAgICBAanNvbiA9IHt9XHJcbiAgICAgIGZvciBvd24ga2V5LCB2YWwgb2YgQGRhdGFcclxuICAgICAgICBjYih2YWwsIGtleSwgQF9nZXRKc29uS2V5KGtleSkpXHJcbiAgICAgIHJldHVybiBAanNvblxyXG5cclxuICAjIFJldHVybnMgYW4gZW51bWVyYXRvciB3aGljaCBzaW1wbHkgcmV0dXJucyBAZGF0YVxyXG4gIF9nZXRFbnVtZXJhdG9yVmFsdWU6ICgpIC0+XHJcbiAgICByZXR1cm4gKCkgPT5cclxuICAgICAgQGpzb24gPSBAZGF0YVxyXG4gICAgICByZXR1cm4gQGpzb25cclxuXHJcbiAgIyBSZXR1cm5zIGFuIGVudW1lcmF0b3Igd2hpY2ggZW51bWVyYXRlcyBvdmVyIGRhdGEsIHJldHVybmluZyB0aGUgcmVzdWx0aW5nIGpzb25cclxuICBfZ2V0RW51bWVyYXRvcjogKCkgLT5cclxuICAgIGlmIEFycmF5LmlzQXJyYXkoQGRhdGEpXHJcbiAgICAgIHJldHVybiBAX2dldEVudW1lcmF0b3JBcnJheSgpXHJcbiAgICBlbHNlIGlmIHR5cGVvZiBAZGF0YSA9PSAnb2JqZWN0JyBhbmQgQGRhdGEgIT0gbnVsbFxyXG4gICAgICByZXR1cm4gQF9nZXRFbnVtZXJhdG9yT2JqZWN0KClcclxuICAgIGVsc2VcclxuICAgICAgcmV0dXJuIEBfZ2V0RW51bWVyYXRvclZhbHVlKClcclxuXHJcbiAgIyNcclxuICAjIFN0YW5kYXJkIGNhbGxiYWNrIHVzZWQgaW4gZW51bWVyYXRvcnMuXHJcbiAgIyBAcGFyYW0gZGF0YSAtIGRhdGEgdG8gYmUgY29udmVydGVkXHJcbiAgIyBAcGFyYW0gZGF0YUtleSB7c3RyaW5nfGludH0gLSBrZXkvaW5kZXggaW50byB0aGUgcGFyZW50IHNvdXJjZSBkYXRhIGFzIGRldGVybWluZWQgYnkgdGhlIGVudW1lcmF0b3JcclxuICAjIEBwYXJhbSBqc29uS2V5IHtzdHJpbmd8aW50fSAtIGtleS9pbmRleCBpbnRvIHRoZSBqc29uIHRhcmdldCBkYXRhIGFzIGRldGVybWluZWQgYnkgdGhlIGVudW1lcmF0b3JcclxuICAjIEByZXR1cm4ge3RvSnNvbn0gY2hpbGQgY29udGV4dFxyXG4gIF90b0pzb25OYW1lZDogKGRhdGEsIGRhdGFLZXksIGpzb25LZXkpIC0+XHJcbiAgICBjaGlsZENvbnRleHQgPSBAX2NyZWF0ZUNoaWxkQ29udGV4dChkYXRhLCBkYXRhS2V5LCBqc29uS2V5KVxyXG5cclxuICAgIGpzb24gPSBjaGlsZENvbnRleHQuYXBwbHkoKVxyXG5cclxuICAgIGlmIGpzb24gIT0gdW5kZWZpbmVkXHJcbiAgICAgIEBqc29uW2pzb25LZXldID0ganNvblxyXG5cclxuICAgIHJldHVybiBjaGlsZENvbnRleHRcclxuXHJcbiAgIyByZXR1cm5zIGEgbmV3IGNvbnRleHQgZm9yIHVzZSB3aXRoIGNoaWxkIGRhdGFcclxuICAjIGFyZ3VtZW50cyBhcmUgdGhlIHNhbWUgYXMgdGhvc2UgZ2l2ZW4gdG8gQF90b0pzb25OYW1lZFxyXG4gIF9jcmVhdGVDaGlsZENvbnRleHQ6IChkYXRhLCBkYXRhS2V5LCBqc29uS2V5KSAtPlxyXG4gICAgcmV0dXJuIG5ldyBAY2hpbGRDb250ZXh0Q2xhc3MoXHJcbiAgICAgIGRhdGEsXHJcbiAgICAgIHtcclxuICAgICAgICBkYXRhS2V5OiBkYXRhS2V5XHJcbiAgICAgICAganNvbktleToganNvbktleVxyXG4gICAgICAgIHBhcmVudENvbnRleHQ6IEBcclxuICAgICAgfVxyXG4gICAgKVxyXG5cclxuICAjIFV0aWxpdHkgZnVuY3Rpb24gZm9yIG92ZXJyaWRpbmcgY2hpbGQgY29udGV4dCBtZXRob2RzXHJcbiAgIyBVc2VmdWwgZm9yIGFwcGx5aW5nIHZhcmlvdXMgZmlsdGVycyBldGMgZm9yIHRoZSBjdXJyZW50IGNvbnRleHRcclxuICBhZGp1c3RDb250ZXh0OiAob3ZlcnJpZGVzLCBzdGlja3kpIC0+XHJcbiAgICBmb3Igb3duIGtleSwgdmFsdWUgb2Ygb3ZlcnJpZGVzXHJcbiAgICAgIEBba2V5XSA9IHZhbHVlXHJcblxyXG4gICAgaWYgc3RpY2t5XHJcbiAgICAgIEBhZGp1c3RDaGlsZENvbnRleHRzKG92ZXJyaWRlcywgc3RpY2t5KVxyXG4gICAgcmV0dXJuIEBcclxuXHJcbiAgIyBVdGlsaXR5IGZ1bmN0aW9uIGZvciBvdmVycmlkaW5nIGNoaWxkIGNvbnRleHQgbWV0aG9kc1xyXG4gICMgVXNlZnVsIGZvciBhcHBseWluZyB2YXJpb3VzIGZpbHRlcnMgZXRjIGZvciBvbmx5IHRoZSBpbW1lZGlhdGUgY2hpbGQgY2xhc3Nlc1xyXG4gICMgQHBhcmFtIHtCb29sZWFufSBzdGlja3kgLSBJZiBUcnVlLCBhbGwgZnV0dXJlIGdlbmVyYXRpb25zIHdpbGwgYmUgb3ZlcnJpZGRlblxyXG4gIGFkanVzdENoaWxkQ29udGV4dHM6IChvdmVycmlkZXMsIHN0aWNreSkgLT5cclxuICAgIEBjaGlsZENvbnRleHRDbGFzcyA9IGNsYXNzIGV4dGVuZHMgQGNoaWxkQ29udGV4dENsYXNzXHJcbiAgICBmb3Igb3duIGtleSwgdmFsdWUgb2Ygb3ZlcnJpZGVzXHJcbiAgICAgIEBjaGlsZENvbnRleHRDbGFzcy5wcm90b3R5cGVba2V5XSA9IHZhbHVlXHJcbiAgICBpZiBzdGlja3lcclxuICAgICAgQGNoaWxkQ29udGV4dENsYXNzLnByb3RvdHlwZS5jaGlsZENvbnRleHRDbGFzcyA9IEBjaGlsZENvbnRleHRDbGFzc1xyXG4gICAgcmV0dXJuIEBcclxuXHJcbiAgIyB1dGlsaXR5IGZ1bmN0aW9uIGZvciBjaGFpbmluZyBzdXBlciBtZXRob2RzXHJcbiAgX3N1cGVyOiAobmFtZSkgLT5cclxuICAgIGlmIEBbbmFtZV0gIT0gQGNvbnN0cnVjdG9yLnByb3RvdHlwZVtuYW1lXVxyXG4gICAgICByZXR1cm4gQGNvbnN0cnVjdG9yLnByb3RvdHlwZVtuYW1lXVxyXG4gICAgZWxzZVxyXG4gICAgICByZXR1cm4gQGNvbnN0cnVjdG9yLl9fc3VwZXJfXz9bbmFtZV1cclxuXHJcbiAgX2NhbGxTdXBlcjogKG5hbWUsIGFyZ3MuLi4pIC0+XHJcbiAgICBAX3N1cGVyKG5hbWUpLmFwcGx5KEAsIGFyZ3MpXHJcblxyXG4gICMgUmV0dXJucyB0aGUga2V5IHRvIHVzZSBmb3IgdGhlIGpzb24gb3V0cHV0XHJcbiAgX2dldEpzb25LZXk6IChkYXRhS2V5KSAtPlxyXG4gICAgZGF0YUtleVxyXG5cclxuICAjIFJldHVybnMgdGhlIGtleSB0byB1c2UgZm9yIHRoZSBqc29uIG91dHB1dFxyXG4gIF9nZXRKc29uSW5kZXg6IChkYXRhSW5kZXgpIC0+XHJcbiAgICBAanNvbi5sZW5ndGhcclxuXHJcbiAgIyBleGNsdWRlIGJlZm9yZSBkb2luZyBhbnl0aGluZz9cclxuICBfZXhjbHVkZTogKCkgLT5cclxuICAgIGZhbHNlXHJcblxyXG4gICMgY29udmVydCB0aGUgaW5jb21pbmcgZGF0YVxyXG4gIF9jb252ZXJ0RGF0YTogKCkgLT5cclxuICAgIHJldHVyblxyXG5cclxuICAjIGV4Y2x1ZGUgYmFzZWQgb24gdGhlIGNvbnZlcnRlZCBkYXRhXHJcbiAgX2V4Y2x1ZGVEYXRhOiAoKSAtPlxyXG4gICAgZmFsc2VcclxuXHJcbiAgIyBleGNsdWRlIGJhc2VkIG9uIG91dGdvaW5nIGRhdGE/XHJcbiAgX2V4Y2x1ZGVKc29uOiAoKSAtPlxyXG4gICAgZmFsc2VcclxuXHJcbiAgIyByZXR1cm4gZGF0YSBwYXRoIGZvciB0aGlzIGNvbnRleHRcclxuICBkYXRhUGF0aDogKCkgLT5cclxuICAgIHBhdGggPSBbXVxyXG4gICAgbm9kZSA9IEBcclxuICAgIHdoaWxlIG5vZGU/XHJcbiAgICAgIGlmIG5vZGUuZGF0YUtleT9cclxuICAgICAgICBwYXRoLnVuc2hpZnQobm9kZS5kYXRhS2V5KVxyXG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRDb250ZXh0XHJcbiAgICByZXR1cm4gcGF0aFxyXG5cclxuICAjIHJldHVybiBqc29uIHBhdGggZm9yIHRoaXMgY29udGV4dFxyXG4gIGpzb25QYXRoOiAoKSAtPlxyXG4gICAgcGF0aCA9IFtdXHJcbiAgICBub2RlID0gQFxyXG4gICAgd2hpbGUgbm9kZT9cclxuICAgICAgaWYgbm9kZS5qc29uS2V5P1xyXG4gICAgICAgIHBhdGgudW5zaGlmdChub2RlLmpzb25LZXkpXHJcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudENvbnRleHRcclxuICAgIHJldHVybiBwYXRoXHJcblxyXG5jbGFzcyBUb0pzb25XaXRoUGF0aE1hcCBleHRlbmRzIFRvSnNvblxyXG4gIGNvbnN0cnVjdG9yOiAoZGF0YSwgb3B0aW9ucykgLT5cclxuICAgIHN1cGVyKGRhdGEsIG9wdGlvbnMpXHJcblxyXG4gICAgQHBhdGhNYXAgPSBAcGFyZW50Q29udGV4dD8ucGF0aE1hcCA/IHt9XHJcblxyXG4gIGNoaWxkQ29udGV4dENsYXNzOiBAXHJcblxyXG4gIF90b0pzb25OYW1lZDogKGRhdGEsIGRhdGFLZXksIGpzb25LZXkpIC0+XHJcbiAgICBjaGlsZENvbnRleHQgPSBzdXBlcihkYXRhLCBkYXRhS2V5LCBqc29uS2V5KVxyXG5cclxuICAgIGlmIEBqc29uW2pzb25LZXldICE9IHVuZGVmaW5lZFxyXG4gICAgICBAcGF0aE1hcFtjaGlsZENvbnRleHQuanNvblBhdGgoKS5qb2luKCcvJyldID0gY2hpbGRDb250ZXh0LmRhdGFQYXRoKCkuam9pbignLycpXHJcblxyXG4gICAgcmV0dXJuIGNoaWxkQ29udGV4dFxyXG5cclxuVG9Kc29uLldpdGhQYXRoTWFwID0gVG9Kc29uV2l0aFBhdGhNYXBcclxuXHJcbmlzRW1wdHkgPSAob2JqKSAtPlxyXG4gIGZvciBvd24ga2V5IG9mIG9ialxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgcmV0dXJuIHRydWVcclxuXHJcbmNsYXNzIFRvSnNvbldpdGhQYXRoVHJlZSBleHRlbmRzIFRvSnNvblxyXG4gIGNvbnN0cnVjdG9yOiAoZGF0YSwgb3B0aW9ucykgLT5cclxuICAgIHN1cGVyKGRhdGEsIG9wdGlvbnMpXHJcblxyXG4gICAgQHBhdGhUcmVlID0ge31cclxuXHJcbiAgY2hpbGRDb250ZXh0Q2xhc3M6IEBcclxuXHJcbiAgX3RvSnNvbk5hbWVkOiAoZGF0YSwgZGF0YUtleSwganNvbktleSkgLT5cclxuICAgIGNoaWxkQ29udGV4dCA9IHN1cGVyKGRhdGEsIGRhdGFLZXksIGpzb25LZXkpXHJcblxyXG4gICAgaWYgQGpzb25banNvbktleV0gIT0gdW5kZWZpbmVkXHJcbiAgICAgIGlmIG5vdCBpc0VtcHR5KGNoaWxkQ29udGV4dC5wYXRoVHJlZSlcclxuICAgICAgICBAcGF0aFRyZWVbY2hpbGRDb250ZXh0Lmpzb25LZXldID0ge1xyXG4gICAgICAgICAgaWQ6IGNoaWxkQ29udGV4dC5kYXRhS2V5LFxyXG4gICAgICAgICAgY2hpbGRyZW46IGNoaWxkQ29udGV4dC5wYXRoVHJlZVxyXG4gICAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBwYXRoVHJlZVtjaGlsZENvbnRleHQuanNvbktleV0gPSB7XHJcbiAgICAgICAgICBpZDogY2hpbGRDb250ZXh0LmRhdGFLZXlcclxuICAgICAgICB9XHJcblxyXG4gICAgcmV0dXJuXHJcblxyXG5Ub0pzb24uV2l0aFBhdGhUcmVlID0gVG9Kc29uV2l0aFBhdGhUcmVlXHJcblxyXG5jbGFzcyBUb0pzb25XaXRoRGF0YU1hcCBleHRlbmRzIFRvSnNvblxyXG4gIGNvbnN0cnVjdG9yOiAoZGF0YSwgb3B0aW9ucykgLT5cclxuICAgIHN1cGVyKGRhdGEsIG9wdGlvbnMpXHJcblxyXG4gICAgQGRhdGFNYXAgPSBAcGFyZW50Q29udGV4dD8uZGF0YU1hcCA/IHt9XHJcblxyXG4gIGNoaWxkQ29udGV4dENsYXNzOiBAXHJcblxyXG4gIF90b0pzb25OYW1lZDogKGRhdGEsIGRhdGFLZXksIGpzb25LZXkpIC0+XHJcbiAgICBjaGlsZENvbnRleHQgPSBzdXBlcihkYXRhLCBkYXRhS2V5LCBqc29uS2V5KVxyXG5cclxuICAgIGlmIEBqc29uW2pzb25LZXldICE9IHVuZGVmaW5lZFxyXG4gICAgICBAZGF0YU1hcFtjaGlsZENvbnRleHQuanNvblBhdGgoKS5qb2luKCcvJyldID0ge1xyXG4gICAgICAgIGRhdGFQYXRoOiBjaGlsZENvbnRleHQuZGF0YVBhdGgoKS5qb2luKCcvJylcclxuICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgY29udmVydGVkRGF0YTogY2hpbGRDb250ZXh0LmRhdGFcclxuICAgICAgICBqc29uOiBAanNvbltqc29uS2V5XVxyXG4gICAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkQ29udGV4dFxyXG5cclxuVG9Kc29uLldpdGhEYXRhTWFwID0gVG9Kc29uV2l0aERhdGFNYXBcclxuY2xhc3MgVG9Kc29uV2l0aERhdGFUcmVlIGV4dGVuZHMgVG9Kc29uXHJcbiAgY29uc3RydWN0b3I6IChkYXRhLCBvcHRpb25zKSAtPlxyXG4gICAgc3VwZXIoZGF0YSwgb3B0aW9ucylcclxuXHJcbiAgICBAZGF0YVRyZWUgPSB7fVxyXG5cclxuICBjaGlsZENvbnRleHRDbGFzczogQFxyXG5cclxuICBfdG9Kc29uTmFtZWQ6IChkYXRhLCBkYXRhS2V5LCBqc29uS2V5KSAtPlxyXG4gICAgY2hpbGRDb250ZXh0ID0gc3VwZXIoZGF0YSwgZGF0YUtleSwganNvbktleSlcclxuXHJcbiAgICBpZiBAanNvbltqc29uS2V5XSAhPSB1bmRlZmluZWRcclxuICAgICAgQGRhdGFUcmVlW2NoaWxkQ29udGV4dC5qc29uS2V5XSA9IHtcclxuICAgICAgICBpZDogY2hpbGRDb250ZXh0LmRhdGFLZXlcclxuICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgY29udmVydGVkRGF0YTogY2hpbGRDb250ZXh0LmRhdGFcclxuICAgICAgICBqc29uOiBAanNvbltqc29uS2V5XVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiBub3QgaXNFbXB0eShjaGlsZENvbnRleHQuZGF0YVRyZWUpXHJcbiAgICAgICAgQGRhdGFUcmVlW2NoaWxkQ29udGV4dC5qc29uS2V5XS5jaGlsZHJlbiA9IGNoaWxkQ29udGV4dC5kYXRhVHJlZVxyXG5cclxuICAgIHJldHVybiBjaGlsZENvbnRleHRcclxuXHJcblRvSnNvbi5XaXRoRGF0YVRyZWUgPSBUb0pzb25XaXRoRGF0YVRyZWVcclxuIl19