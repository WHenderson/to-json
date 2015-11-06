(function (){
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
    if (!excludeCustomToJson && (((ref = this.data) != null ? ref.toJsonContext : void 0) != null) && typeof this.data.toJsonContext === 'function') {
      this.data.toJsonContext(this).apply(true);
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

module.exports = ToJson;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvLWpzb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsNkZBQUE7RUFBQTs7OztBQUFBO0VBQ0EsZ0JBQUEsS0FBQSxFQUFBLE9BQUE7SUFBQSxJQUFBLENBQUEsT0FBQTtJQUNBLElBQUEsSUFBQSxZQUFBLE1BQUE7TUFFQSxJQUFBLGVBQUE7UUFDQSxJQUFBLENBQUEsT0FBQSxHQUFBLE9BQUEsQ0FBQTtRQUNBLElBQUEsQ0FBQSxPQUFBLEdBQUEsT0FBQSxDQUFBO1FBQ0EsSUFBQSxDQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEsY0FIQTtPQUZBO0tBQUEsTUFBQTtBQVFBLGFBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLEVBUkE7O0VBREE7O21CQVdBLGlCQUFBLEdBQUE7O21CQUdBLEtBQUEsR0FBQSxTQUFBLG1CQUFBO0lBRUEsSUFBQSxJQUFBLENBQUEsUUFBQSxDQUFBLENBQUE7QUFDQSxhQUFBLE9BREE7O0lBSUEsSUFBQSxDQUFBLFlBQUEsQ0FBQTtJQUdBLElBQUEsSUFBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBO0FBQ0EsYUFBQSxPQURBOztJQUlBLElBQUEsQ0FBQSxPQUFBLENBQUEsbUJBQUE7SUFHQSxJQUFBLElBQUEsQ0FBQSxZQUFBLENBQUEsQ0FBQTtBQUNBLGFBQUEsT0FEQTs7QUFJQSxXQUFBLElBQUEsQ0FBQTtFQXBCQTs7bUJBdUJBLE9BQUEsR0FBQSxTQUFBLG1CQUFBO0FBQ0EsUUFBQTtJQUFBLElBQUEsQ0FBQSxtQkFBQSxJQUFBLGtFQUFBLElBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLGFBQUEsS0FBQSxVQUFBO01BQ0EsSUFBQSxDQUFBLElBQUEsQ0FBQSxhQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsRUFEQTtLQUFBLE1BRUEsSUFBQSxDQUFBLG1CQUFBLElBQUEsNkRBQUEsSUFBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsTUFBQSxLQUFBLFVBQUE7TUFDQSxJQUFBLENBQUEsSUFBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsTUFBQSxDQUFBLEVBREE7S0FBQSxNQUFBO01BR0EsSUFBQSxDQUFBLElBQUEsR0FBQSxJQUFBLENBQUEsY0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsWUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsRUFIQTs7RUFIQTs7bUJBVUEsbUJBQUEsR0FBQSxTQUFBO0FBQ0EsV0FBQSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUEsRUFBQTtBQUNBLFlBQUE7UUFBQSxLQUFBLENBQUEsSUFBQSxHQUFBO0FBQ0E7QUFBQSxhQUFBLDJEQUFBOztVQUNBLEVBQUEsQ0FBQSxPQUFBLEVBQUEsUUFBQSxFQUFBLEtBQUEsQ0FBQSxhQUFBLENBQUEsUUFBQSxDQUFBO0FBREE7QUFFQSxlQUFBLEtBQUEsQ0FBQTtNQUpBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtFQURBOzttQkFRQSxvQkFBQSxHQUFBLFNBQUE7QUFDQSxXQUFBLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQSxFQUFBO0FBQ0EsWUFBQTtRQUFBLEtBQUEsQ0FBQSxJQUFBLEdBQUE7QUFDQTtBQUFBLGFBQUEsVUFBQTs7O1VBQ0EsRUFBQSxDQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxDQUFBLFdBQUEsQ0FBQSxHQUFBLENBQUE7QUFEQTtBQUVBLGVBQUEsS0FBQSxDQUFBO01BSkE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0VBREE7O21CQVFBLG1CQUFBLEdBQUEsU0FBQTtBQUNBLFdBQUEsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO1FBQ0EsS0FBQSxDQUFBLElBQUEsR0FBQSxLQUFBLENBQUE7QUFDQSxlQUFBLEtBQUEsQ0FBQTtNQUZBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtFQURBOzttQkFNQSxjQUFBLEdBQUEsU0FBQTtJQUNBLElBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBO0FBQ0EsYUFBQSxJQUFBLENBQUEsbUJBQUEsQ0FBQSxFQURBO0tBQUEsTUFFQSxJQUFBLE9BQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxRQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxJQUFBO0FBQ0EsYUFBQSxJQUFBLENBQUEsb0JBQUEsQ0FBQSxFQURBO0tBQUEsTUFBQTtBQUdBLGFBQUEsSUFBQSxDQUFBLG1CQUFBLENBQUEsRUFIQTs7RUFIQTs7bUJBY0EsWUFBQSxHQUFBLFNBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0FBQ0EsUUFBQTtJQUFBLFlBQUEsR0FBQSxJQUFBLENBQUEsbUJBQUEsQ0FBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUE7SUFFQSxJQUFBLEdBQUEsWUFBQSxDQUFBLEtBQUEsQ0FBQTtJQUVBLElBQUEsSUFBQSxLQUFBLE1BQUE7TUFDQSxJQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLEtBREE7O0FBR0EsV0FBQTtFQVJBOzttQkFZQSxtQkFBQSxHQUFBLFNBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0FBQ0EsV0FBQSxJQUFBLElBQUEsQ0FBQSxpQkFBQSxDQUNBLElBREEsRUFFQTtNQUNBLE9BQUEsRUFBQSxPQURBO01BRUEsT0FBQSxFQUFBLE9BRkE7TUFHQSxhQUFBLEVBQUEsSUFIQTtLQUZBO0VBREE7O21CQVlBLGFBQUEsR0FBQSxTQUFBLFNBQUEsRUFBQSxNQUFBO0FBQ0EsUUFBQTtBQUFBLFNBQUEsZ0JBQUE7OztNQUNBLElBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQTtBQURBO0lBR0EsSUFBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLG1CQUFBLENBQUEsU0FBQSxFQUFBLE1BQUEsRUFEQTs7QUFFQSxXQUFBO0VBTkE7O21CQVdBLG1CQUFBLEdBQUEsU0FBQSxTQUFBLEVBQUEsTUFBQTtBQUNBLFFBQUE7SUFBQSxJQUFBLENBQUEsaUJBQUE7Ozs7Ozs7OztPQUFBLElBQUEsQ0FBQTtBQUNBLFNBQUEsZ0JBQUE7OztNQUNBLElBQUEsQ0FBQSxpQkFBQSxDQUFBLFNBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQTtBQURBO0lBRUEsSUFBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLGlCQUFBLENBQUEsU0FBQSxDQUFBLGlCQUFBLEdBQUEsSUFBQSxDQUFBLGtCQURBOztBQUVBLFdBQUE7RUFOQTs7bUJBU0EsTUFBQSxHQUFBLFNBQUEsSUFBQTtBQUNBLFFBQUE7SUFBQSxPQUFBLEdBQUEsSUFBQSxDQUFBLElBQUE7SUFDQSxHQUFBLEdBQUEsSUFBQSxDQUFBO0FBQ0EsV0FBQSxhQUFBLElBQUEsR0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxPQUFBO01BQ0EsR0FBQSxHQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUE7SUFEQTtBQUVBLFdBQUEsR0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBO0VBTEE7O21CQU9BLFVBQUEsR0FBQSxTQUFBO0FBQ0EsUUFBQTtJQURBLHFCQUFBO1dBQ0EsSUFBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsSUFBQSxFQUFBLElBQUE7RUFEQTs7bUJBSUEsV0FBQSxHQUFBLFNBQUEsT0FBQTtXQUNBO0VBREE7O21CQUlBLGFBQUEsR0FBQSxTQUFBLFNBQUE7V0FDQSxJQUFBLENBQUEsSUFBQSxDQUFBO0VBREE7O21CQUlBLFFBQUEsR0FBQSxTQUFBO1dBQ0E7RUFEQTs7bUJBSUEsWUFBQSxHQUFBLFNBQUEsR0FBQTs7bUJBSUEsWUFBQSxHQUFBLFNBQUE7V0FDQTtFQURBOzttQkFJQSxZQUFBLEdBQUEsU0FBQTtXQUNBO0VBREE7O21CQUlBLFFBQUEsR0FBQSxTQUFBO0FBQ0EsUUFBQTtJQUFBLElBQUEsR0FBQTtJQUNBLElBQUEsR0FBQTtBQUNBLFdBQUEsWUFBQTtNQUNBLElBQUEsb0JBQUE7UUFDQSxJQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLEVBREE7O01BRUEsSUFBQSxHQUFBLElBQUEsQ0FBQTtJQUhBO0FBSUEsV0FBQTtFQVBBOzttQkFVQSxRQUFBLEdBQUEsU0FBQTtBQUNBLFFBQUE7SUFBQSxJQUFBLEdBQUE7SUFDQSxJQUFBLEdBQUE7QUFDQSxXQUFBLFlBQUE7TUFDQSxJQUFBLG9CQUFBO1FBQ0EsSUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxFQURBOztNQUVBLElBQUEsR0FBQSxJQUFBLENBQUE7SUFIQTtBQUlBLFdBQUE7RUFQQTs7Ozs7O0FBU0E7OztFQUNBLDJCQUFBLElBQUEsRUFBQSxPQUFBO0FBQ0EsUUFBQTtJQUFBLG1EQUFBLElBQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxDQUFBLE9BQUEsdUZBQUE7RUFIQTs7OEJBS0EsaUJBQUEsR0FBQTs7OEJBRUEsWUFBQSxHQUFBLFNBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0FBQ0EsUUFBQTtJQUFBLFlBQUEsR0FBQSxvREFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUE7SUFFQSxJQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsTUFBQTtNQUNBLElBQUEsQ0FBQSxPQUFBLENBQUEsWUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsWUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsRUFEQTs7QUFHQSxXQUFBO0VBTkE7Ozs7R0FSQTs7QUFnQkEsTUFBQSxDQUFBLFdBQUEsR0FBQTs7QUFFQSxPQUFBLEdBQUEsU0FBQSxHQUFBO0FBQ0EsTUFBQTtBQUFBLE9BQUEsVUFBQTs7QUFDQSxXQUFBO0FBREE7QUFFQSxTQUFBO0FBSEE7O0FBS0E7OztFQUNBLDRCQUFBLElBQUEsRUFBQSxPQUFBO0lBQ0Esb0RBQUEsSUFBQSxFQUFBLE9BQUE7SUFFQSxJQUFBLENBQUEsUUFBQSxHQUFBO0VBSEE7OytCQUtBLGlCQUFBLEdBQUE7OytCQUVBLFlBQUEsR0FBQSxTQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxZQUFBLEdBQUEscURBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxLQUFBLE1BQUE7TUFDQSxJQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQSxRQUFBLENBQUE7UUFDQSxJQUFBLENBQUEsUUFBQSxDQUFBLFlBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQTtVQUNBLEVBQUEsRUFBQSxZQUFBLENBQUEsT0FEQTtVQUVBLFFBQUEsRUFBQSxZQUFBLENBQUEsUUFGQTtVQURBO09BQUEsTUFBQTtRQU1BLElBQUEsQ0FBQSxRQUFBLENBQUEsWUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBO1VBQ0EsRUFBQSxFQUFBLFlBQUEsQ0FBQSxPQURBO1VBTkE7T0FEQTs7RUFIQTs7OztHQVJBOztBQXdCQSxNQUFBLENBQUEsWUFBQSxHQUFBOztBQUVBOzs7RUFDQSwyQkFBQSxJQUFBLEVBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxtREFBQSxJQUFBLEVBQUEsT0FBQTtJQUVBLElBQUEsQ0FBQSxPQUFBLHVGQUFBO0VBSEE7OzhCQUtBLGlCQUFBLEdBQUE7OzhCQUVBLFlBQUEsR0FBQSxTQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxZQUFBLEdBQUEsb0RBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxLQUFBLE1BQUE7TUFDQSxJQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBO1FBQ0EsUUFBQSxFQUFBLFlBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBREE7UUFFQSxJQUFBLEVBQUEsSUFGQTtRQUdBLGFBQUEsRUFBQSxZQUFBLENBQUEsSUFIQTtRQUlBLElBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FKQTtRQURBOztBQVFBLFdBQUE7RUFYQTs7OztHQVJBOztBQXFCQSxNQUFBLENBQUEsV0FBQSxHQUFBOztBQUNBOzs7RUFDQSw0QkFBQSxJQUFBLEVBQUEsT0FBQTtJQUNBLG9EQUFBLElBQUEsRUFBQSxPQUFBO0lBRUEsSUFBQSxDQUFBLFFBQUEsR0FBQTtFQUhBOzsrQkFLQSxpQkFBQSxHQUFBOzsrQkFFQSxZQUFBLEdBQUEsU0FBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUE7QUFDQSxRQUFBO0lBQUEsWUFBQSxHQUFBLHFEQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtJQUVBLElBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLFFBQUEsQ0FBQSxZQUFBLENBQUEsT0FBQSxDQUFBLEdBQUE7UUFDQSxFQUFBLEVBQUEsWUFBQSxDQUFBLE9BREE7UUFFQSxJQUFBLEVBQUEsSUFGQTtRQUdBLGFBQUEsRUFBQSxZQUFBLENBQUEsSUFIQTtRQUlBLElBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FKQTs7TUFPQSxJQUFBLENBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQSxRQUFBLENBQUE7UUFDQSxJQUFBLENBQUEsUUFBQSxDQUFBLFlBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxRQUFBLEdBQUEsWUFBQSxDQUFBLFNBREE7T0FSQTs7QUFXQSxXQUFBO0VBZEE7Ozs7R0FSQTs7QUF3QkEsTUFBQSxDQUFBLFlBQUEsR0FBQSIsImZpbGUiOiJ0by1qc29uLm5vZGUuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBUb0pzb25cclxuICBjb25zdHJ1Y3RvcjogKEBkYXRhLCBvcHRpb25zKSAtPlxyXG4gICAgaWYgQCBpbnN0YW5jZW9mIFRvSnNvblxyXG4gICAgICAjIENhbGxlZCBhcyBjb25zdHJ1Y3RvclxyXG4gICAgICBpZiBvcHRpb25zP1xyXG4gICAgICAgIEBkYXRhS2V5ID0gb3B0aW9ucy5kYXRhS2V5XHJcbiAgICAgICAgQGpzb25LZXkgPSBvcHRpb25zLmpzb25LZXlcclxuICAgICAgICBAcGFyZW50Q29udGV4dCA9IG9wdGlvbnMucGFyZW50Q29udGV4dFxyXG4gICAgZWxzZVxyXG4gICAgICAjIENhbGxlZCBhcyBmdW5jdGlvblxyXG4gICAgICByZXR1cm4gKG5ldyBUb0pzb24oQGRhdGEsIG9wdGlvbnMpKS5hcHBseSgpXHJcblxyXG4gIGNoaWxkQ29udGV4dENsYXNzOiBAXHJcblxyXG4gICMgQ29udmVydHMgQGRhdGEgaW50byBqc29uIHdoaWxzdCBhcHBseWluZyBmaWx0ZXJzIGFuZCBjb252ZXJzaW9uc1xyXG4gIGFwcGx5OiAoZXhjbHVkZUN1c3RvbVRvSnNvbikgLT5cclxuICAgICMgZXhjbHVkZSBiZWZvcmUgZG9pbmcgYW55dGhpbmc/XHJcbiAgICBpZiBAX2V4Y2x1ZGUoKVxyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcblxyXG4gICAgIyBjb252ZXJ0IHRoZSBpbmNvbWluZyBkYXRhIChjb250ZXh0LmRhdGEpXHJcbiAgICBAX2NvbnZlcnREYXRhKClcclxuXHJcbiAgICAjIGV4Y2x1ZGUgYmFzZWQgb24gdGhlIGNvbnZlcnRlZCBkYXRhXHJcbiAgICBpZiBAX2V4Y2x1ZGVEYXRhKClcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG5cclxuICAgICMgY29udmVydCB0aGUgaW5jb21pbmcgZGF0YSAoY29udGV4dC5kYXRhKSBpbnRvIG91dGdvaW5nIGRhdGEgKGNvbnRleHQuanNvbilcclxuICAgIEBfdG9Kc29uKGV4Y2x1ZGVDdXN0b21Ub0pzb24pXHJcblxyXG4gICAgIyBleGNsdWRlIGJhc2VkIG9uIG91dGdvaW5nIGRhdGE/XHJcbiAgICBpZiBAX2V4Y2x1ZGVKc29uKClcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG5cclxuICAgICMgcmV0dXJuIHRoZSBvdXRnb2luZyBkYXRhIChjb250ZXh0Lmpzb24pXHJcbiAgICByZXR1cm4gQGpzb25cclxuXHJcbiAgIyBDb252ZXJ0cyBAZGF0YSBpbnRvIGpzb25cclxuICBfdG9Kc29uOiAoZXhjbHVkZUN1c3RvbVRvSnNvbikgLT5cclxuICAgIGlmIG5vdCBleGNsdWRlQ3VzdG9tVG9Kc29uIGFuZCBAZGF0YT8udG9Kc29uQ29udGV4dD8gYW5kIHR5cGVvZiBAZGF0YS50b0pzb25Db250ZXh0ID09ICdmdW5jdGlvbidcclxuICAgICAgQGRhdGEudG9Kc29uQ29udGV4dChAKS5hcHBseSh0cnVlKVxyXG4gICAgZWxzZSBpZiBub3QgZXhjbHVkZUN1c3RvbVRvSnNvbiBhbmQgQGRhdGE/LnRvSlNPTj8gYW5kIHR5cGVvZiBAZGF0YS50b0pTT04gPT0gJ2Z1bmN0aW9uJ1xyXG4gICAgICBAanNvbiA9IEBkYXRhLnRvSlNPTigpXHJcbiAgICBlbHNlXHJcbiAgICAgIEBqc29uID0gQF9nZXRFbnVtZXJhdG9yKCkoQF90b0pzb25OYW1lZC5iaW5kKEApKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gICMgUmV0dXJucyBhbiBlbnVtZXJhdG9yIHdoaWNoIGl0ZXJhdGVzIG92ZXIgQGRhdGEgYXMgYW4gYXJyYXksIHJldHVybmluZyB0aGUgcmVzdWx0aW5nIGpzb25cclxuICBfZ2V0RW51bWVyYXRvckFycmF5OiAoKSAtPlxyXG4gICAgcmV0dXJuIChjYikgPT5cclxuICAgICAgQGpzb24gPSBbXVxyXG4gICAgICBmb3IgZWxlbWVudCwgaWVsZW1lbnQgaW4gQGRhdGFcclxuICAgICAgICBjYihlbGVtZW50LCBpZWxlbWVudCwgQF9nZXRKc29uSW5kZXgoaWVsZW1lbnQpKVxyXG4gICAgICByZXR1cm4gQGpzb25cclxuXHJcbiAgIyBSZXR1cm5zIGFuIGVudW1lcmF0b3Igd2hpY2ggaXRlcmF0ZXMgb3ZlciBAZGF0YSBhcyBhbiBvYmplY3QsIHJldHVybmluZyB0aGUgcmVzdWx0aW5nIGpzb25cclxuICBfZ2V0RW51bWVyYXRvck9iamVjdDogKCkgLT5cclxuICAgIHJldHVybiAoY2IpID0+XHJcbiAgICAgIEBqc29uID0ge31cclxuICAgICAgZm9yIG93biBrZXksIHZhbCBvZiBAZGF0YVxyXG4gICAgICAgIGNiKHZhbCwga2V5LCBAX2dldEpzb25LZXkoa2V5KSlcclxuICAgICAgcmV0dXJuIEBqc29uXHJcblxyXG4gICMgUmV0dXJucyBhbiBlbnVtZXJhdG9yIHdoaWNoIHNpbXBseSByZXR1cm5zIEBkYXRhXHJcbiAgX2dldEVudW1lcmF0b3JWYWx1ZTogKCkgLT5cclxuICAgIHJldHVybiAoKSA9PlxyXG4gICAgICBAanNvbiA9IEBkYXRhXHJcbiAgICAgIHJldHVybiBAanNvblxyXG5cclxuICAjIFJldHVybnMgYW4gZW51bWVyYXRvciB3aGljaCBlbnVtZXJhdGVzIG92ZXIgZGF0YSwgcmV0dXJuaW5nIHRoZSByZXN1bHRpbmcganNvblxyXG4gIF9nZXRFbnVtZXJhdG9yOiAoKSAtPlxyXG4gICAgaWYgQXJyYXkuaXNBcnJheShAZGF0YSlcclxuICAgICAgcmV0dXJuIEBfZ2V0RW51bWVyYXRvckFycmF5KClcclxuICAgIGVsc2UgaWYgdHlwZW9mIEBkYXRhID09ICdvYmplY3QnIGFuZCBAZGF0YSAhPSBudWxsXHJcbiAgICAgIHJldHVybiBAX2dldEVudW1lcmF0b3JPYmplY3QoKVxyXG4gICAgZWxzZVxyXG4gICAgICByZXR1cm4gQF9nZXRFbnVtZXJhdG9yVmFsdWUoKVxyXG5cclxuICAjI1xyXG4gICMgU3RhbmRhcmQgY2FsbGJhY2sgdXNlZCBpbiBlbnVtZXJhdG9ycy5cclxuICAjIEBwYXJhbSBkYXRhIC0gZGF0YSB0byBiZSBjb252ZXJ0ZWRcclxuICAjIEBwYXJhbSBkYXRhS2V5IHtzdHJpbmd8aW50fSAtIGtleS9pbmRleCBpbnRvIHRoZSBwYXJlbnQgc291cmNlIGRhdGEgYXMgZGV0ZXJtaW5lZCBieSB0aGUgZW51bWVyYXRvclxyXG4gICMgQHBhcmFtIGpzb25LZXkge3N0cmluZ3xpbnR9IC0ga2V5L2luZGV4IGludG8gdGhlIGpzb24gdGFyZ2V0IGRhdGEgYXMgZGV0ZXJtaW5lZCBieSB0aGUgZW51bWVyYXRvclxyXG4gICMgQHJldHVybiB7dG9Kc29ufSBjaGlsZCBjb250ZXh0XHJcbiAgX3RvSnNvbk5hbWVkOiAoZGF0YSwgZGF0YUtleSwganNvbktleSkgLT5cclxuICAgIGNoaWxkQ29udGV4dCA9IEBfY3JlYXRlQ2hpbGRDb250ZXh0KGRhdGEsIGRhdGFLZXksIGpzb25LZXkpXHJcblxyXG4gICAganNvbiA9IGNoaWxkQ29udGV4dC5hcHBseSgpXHJcblxyXG4gICAgaWYganNvbiAhPSB1bmRlZmluZWRcclxuICAgICAgQGpzb25banNvbktleV0gPSBqc29uXHJcblxyXG4gICAgcmV0dXJuIGNoaWxkQ29udGV4dFxyXG5cclxuICAjIHJldHVybnMgYSBuZXcgY29udGV4dCBmb3IgdXNlIHdpdGggY2hpbGQgZGF0YVxyXG4gICMgYXJndW1lbnRzIGFyZSB0aGUgc2FtZSBhcyB0aG9zZSBnaXZlbiB0byBAX3RvSnNvbk5hbWVkXHJcbiAgX2NyZWF0ZUNoaWxkQ29udGV4dDogKGRhdGEsIGRhdGFLZXksIGpzb25LZXkpIC0+XHJcbiAgICByZXR1cm4gbmV3IEBjaGlsZENvbnRleHRDbGFzcyhcclxuICAgICAgZGF0YSxcclxuICAgICAge1xyXG4gICAgICAgIGRhdGFLZXk6IGRhdGFLZXlcclxuICAgICAgICBqc29uS2V5OiBqc29uS2V5XHJcbiAgICAgICAgcGFyZW50Q29udGV4dDogQFxyXG4gICAgICB9XHJcbiAgICApXHJcblxyXG4gICMgVXRpbGl0eSBmdW5jdGlvbiBmb3Igb3ZlcnJpZGluZyBjaGlsZCBjb250ZXh0IG1ldGhvZHNcclxuICAjIFVzZWZ1bCBmb3IgYXBwbHlpbmcgdmFyaW91cyBmaWx0ZXJzIGV0YyBmb3IgdGhlIGN1cnJlbnQgY29udGV4dFxyXG4gIGFkanVzdENvbnRleHQ6IChvdmVycmlkZXMsIHN0aWNreSkgLT5cclxuICAgIGZvciBvd24ga2V5LCB2YWx1ZSBvZiBvdmVycmlkZXNcclxuICAgICAgQFtrZXldID0gdmFsdWVcclxuXHJcbiAgICBpZiBzdGlja3lcclxuICAgICAgQGFkanVzdENoaWxkQ29udGV4dHMob3ZlcnJpZGVzLCBzdGlja3kpXHJcbiAgICByZXR1cm4gQFxyXG5cclxuICAjIFV0aWxpdHkgZnVuY3Rpb24gZm9yIG92ZXJyaWRpbmcgY2hpbGQgY29udGV4dCBtZXRob2RzXHJcbiAgIyBVc2VmdWwgZm9yIGFwcGx5aW5nIHZhcmlvdXMgZmlsdGVycyBldGMgZm9yIG9ubHkgdGhlIGltbWVkaWF0ZSBjaGlsZCBjbGFzc2VzXHJcbiAgIyBAcGFyYW0ge0Jvb2xlYW59IHN0aWNreSAtIElmIFRydWUsIGFsbCBmdXR1cmUgZ2VuZXJhdGlvbnMgd2lsbCBiZSBvdmVycmlkZGVuXHJcbiAgYWRqdXN0Q2hpbGRDb250ZXh0czogKG92ZXJyaWRlcywgc3RpY2t5KSAtPlxyXG4gICAgQGNoaWxkQ29udGV4dENsYXNzID0gY2xhc3MgZXh0ZW5kcyBAY2hpbGRDb250ZXh0Q2xhc3NcclxuICAgIGZvciBvd24ga2V5LCB2YWx1ZSBvZiBvdmVycmlkZXNcclxuICAgICAgQGNoaWxkQ29udGV4dENsYXNzLnByb3RvdHlwZVtrZXldID0gdmFsdWVcclxuICAgIGlmIHN0aWNreVxyXG4gICAgICBAY2hpbGRDb250ZXh0Q2xhc3MucHJvdG90eXBlLmNoaWxkQ29udGV4dENsYXNzID0gQGNoaWxkQ29udGV4dENsYXNzXHJcbiAgICByZXR1cm4gQFxyXG5cclxuICAjIHV0aWxpdHkgZnVuY3Rpb24gZm9yIGNoYWluaW5nIHN1cGVyIG1ldGhvZHNcclxuICBfc3VwZXI6IChuYW1lKSAtPlxyXG4gICAgY3VycmVudCA9IEBbbmFtZV1cclxuICAgIGNscyA9IEBjb25zdHJ1Y3RvclxyXG4gICAgd2hpbGUgY2xzPyBhbmQgY2xzLnByb3RvdHlwZVtuYW1lXSA9PSBjdXJyZW50XHJcbiAgICAgIGNscyA9IGNscy5fX3N1cGVyX18uY29uc3RydWN0b3JcclxuICAgIHJldHVybiBjbHMucHJvdG90eXBlW25hbWVdXHJcblxyXG4gIF9jYWxsU3VwZXI6IChuYW1lLCBhcmdzLi4uKSAtPlxyXG4gICAgQF9zdXBlcihuYW1lKS5hcHBseShALCBhcmdzKVxyXG5cclxuICAjIFJldHVybnMgdGhlIGtleSB0byB1c2UgZm9yIHRoZSBqc29uIG91dHB1dFxyXG4gIF9nZXRKc29uS2V5OiAoZGF0YUtleSkgLT5cclxuICAgIGRhdGFLZXlcclxuXHJcbiAgIyBSZXR1cm5zIHRoZSBrZXkgdG8gdXNlIGZvciB0aGUganNvbiBvdXRwdXRcclxuICBfZ2V0SnNvbkluZGV4OiAoZGF0YUluZGV4KSAtPlxyXG4gICAgQGpzb24ubGVuZ3RoXHJcblxyXG4gICMgZXhjbHVkZSBiZWZvcmUgZG9pbmcgYW55dGhpbmc/XHJcbiAgX2V4Y2x1ZGU6ICgpIC0+XHJcbiAgICBmYWxzZVxyXG5cclxuICAjIGNvbnZlcnQgdGhlIGluY29taW5nIGRhdGFcclxuICBfY29udmVydERhdGE6ICgpIC0+XHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyBleGNsdWRlIGJhc2VkIG9uIHRoZSBjb252ZXJ0ZWQgZGF0YVxyXG4gIF9leGNsdWRlRGF0YTogKCkgLT5cclxuICAgIGZhbHNlXHJcblxyXG4gICMgZXhjbHVkZSBiYXNlZCBvbiBvdXRnb2luZyBkYXRhP1xyXG4gIF9leGNsdWRlSnNvbjogKCkgLT5cclxuICAgIGZhbHNlXHJcblxyXG4gICMgcmV0dXJuIGRhdGEgcGF0aCBmb3IgdGhpcyBjb250ZXh0XHJcbiAgZGF0YVBhdGg6ICgpIC0+XHJcbiAgICBwYXRoID0gW11cclxuICAgIG5vZGUgPSBAXHJcbiAgICB3aGlsZSBub2RlP1xyXG4gICAgICBpZiBub2RlLmRhdGFLZXk/XHJcbiAgICAgICAgcGF0aC51bnNoaWZ0KG5vZGUuZGF0YUtleSlcclxuICAgICAgbm9kZSA9IG5vZGUucGFyZW50Q29udGV4dFxyXG4gICAgcmV0dXJuIHBhdGhcclxuXHJcbiAgIyByZXR1cm4ganNvbiBwYXRoIGZvciB0aGlzIGNvbnRleHRcclxuICBqc29uUGF0aDogKCkgLT5cclxuICAgIHBhdGggPSBbXVxyXG4gICAgbm9kZSA9IEBcclxuICAgIHdoaWxlIG5vZGU/XHJcbiAgICAgIGlmIG5vZGUuanNvbktleT9cclxuICAgICAgICBwYXRoLnVuc2hpZnQobm9kZS5qc29uS2V5KVxyXG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRDb250ZXh0XHJcbiAgICByZXR1cm4gcGF0aFxyXG5cclxuY2xhc3MgVG9Kc29uV2l0aFBhdGhNYXAgZXh0ZW5kcyBUb0pzb25cclxuICBjb25zdHJ1Y3RvcjogKGRhdGEsIG9wdGlvbnMpIC0+XHJcbiAgICBzdXBlcihkYXRhLCBvcHRpb25zKVxyXG5cclxuICAgIEBwYXRoTWFwID0gQHBhcmVudENvbnRleHQ/LnBhdGhNYXAgPyB7fVxyXG5cclxuICBjaGlsZENvbnRleHRDbGFzczogQFxyXG5cclxuICBfdG9Kc29uTmFtZWQ6IChkYXRhLCBkYXRhS2V5LCBqc29uS2V5KSAtPlxyXG4gICAgY2hpbGRDb250ZXh0ID0gc3VwZXIoZGF0YSwgZGF0YUtleSwganNvbktleSlcclxuXHJcbiAgICBpZiBAanNvbltqc29uS2V5XSAhPSB1bmRlZmluZWRcclxuICAgICAgQHBhdGhNYXBbY2hpbGRDb250ZXh0Lmpzb25QYXRoKCkuam9pbignLycpXSA9IGNoaWxkQ29udGV4dC5kYXRhUGF0aCgpLmpvaW4oJy8nKVxyXG5cclxuICAgIHJldHVybiBjaGlsZENvbnRleHRcclxuXHJcblRvSnNvbi5XaXRoUGF0aE1hcCA9IFRvSnNvbldpdGhQYXRoTWFwXHJcblxyXG5pc0VtcHR5ID0gKG9iaikgLT5cclxuICBmb3Igb3duIGtleSBvZiBvYmpcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIHJldHVybiB0cnVlXHJcblxyXG5jbGFzcyBUb0pzb25XaXRoUGF0aFRyZWUgZXh0ZW5kcyBUb0pzb25cclxuICBjb25zdHJ1Y3RvcjogKGRhdGEsIG9wdGlvbnMpIC0+XHJcbiAgICBzdXBlcihkYXRhLCBvcHRpb25zKVxyXG5cclxuICAgIEBwYXRoVHJlZSA9IHt9XHJcblxyXG4gIGNoaWxkQ29udGV4dENsYXNzOiBAXHJcblxyXG4gIF90b0pzb25OYW1lZDogKGRhdGEsIGRhdGFLZXksIGpzb25LZXkpIC0+XHJcbiAgICBjaGlsZENvbnRleHQgPSBzdXBlcihkYXRhLCBkYXRhS2V5LCBqc29uS2V5KVxyXG5cclxuICAgIGlmIEBqc29uW2pzb25LZXldICE9IHVuZGVmaW5lZFxyXG4gICAgICBpZiBub3QgaXNFbXB0eShjaGlsZENvbnRleHQucGF0aFRyZWUpXHJcbiAgICAgICAgQHBhdGhUcmVlW2NoaWxkQ29udGV4dC5qc29uS2V5XSA9IHtcclxuICAgICAgICAgIGlkOiBjaGlsZENvbnRleHQuZGF0YUtleSxcclxuICAgICAgICAgIGNoaWxkcmVuOiBjaGlsZENvbnRleHQucGF0aFRyZWVcclxuICAgICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBAcGF0aFRyZWVbY2hpbGRDb250ZXh0Lmpzb25LZXldID0ge1xyXG4gICAgICAgICAgaWQ6IGNoaWxkQ29udGV4dC5kYXRhS2V5XHJcbiAgICAgICAgfVxyXG5cclxuICAgIHJldHVyblxyXG5cclxuVG9Kc29uLldpdGhQYXRoVHJlZSA9IFRvSnNvbldpdGhQYXRoVHJlZVxyXG5cclxuY2xhc3MgVG9Kc29uV2l0aERhdGFNYXAgZXh0ZW5kcyBUb0pzb25cclxuICBjb25zdHJ1Y3RvcjogKGRhdGEsIG9wdGlvbnMpIC0+XHJcbiAgICBzdXBlcihkYXRhLCBvcHRpb25zKVxyXG5cclxuICAgIEBkYXRhTWFwID0gQHBhcmVudENvbnRleHQ/LmRhdGFNYXAgPyB7fVxyXG5cclxuICBjaGlsZENvbnRleHRDbGFzczogQFxyXG5cclxuICBfdG9Kc29uTmFtZWQ6IChkYXRhLCBkYXRhS2V5LCBqc29uS2V5KSAtPlxyXG4gICAgY2hpbGRDb250ZXh0ID0gc3VwZXIoZGF0YSwgZGF0YUtleSwganNvbktleSlcclxuXHJcbiAgICBpZiBAanNvbltqc29uS2V5XSAhPSB1bmRlZmluZWRcclxuICAgICAgQGRhdGFNYXBbY2hpbGRDb250ZXh0Lmpzb25QYXRoKCkuam9pbignLycpXSA9IHtcclxuICAgICAgICBkYXRhUGF0aDogY2hpbGRDb250ZXh0LmRhdGFQYXRoKCkuam9pbignLycpXHJcbiAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgIGNvbnZlcnRlZERhdGE6IGNoaWxkQ29udGV4dC5kYXRhXHJcbiAgICAgICAganNvbjogQGpzb25banNvbktleV1cclxuICAgICAgfVxyXG5cclxuICAgIHJldHVybiBjaGlsZENvbnRleHRcclxuXHJcblRvSnNvbi5XaXRoRGF0YU1hcCA9IFRvSnNvbldpdGhEYXRhTWFwXHJcbmNsYXNzIFRvSnNvbldpdGhEYXRhVHJlZSBleHRlbmRzIFRvSnNvblxyXG4gIGNvbnN0cnVjdG9yOiAoZGF0YSwgb3B0aW9ucykgLT5cclxuICAgIHN1cGVyKGRhdGEsIG9wdGlvbnMpXHJcblxyXG4gICAgQGRhdGFUcmVlID0ge31cclxuXHJcbiAgY2hpbGRDb250ZXh0Q2xhc3M6IEBcclxuXHJcbiAgX3RvSnNvbk5hbWVkOiAoZGF0YSwgZGF0YUtleSwganNvbktleSkgLT5cclxuICAgIGNoaWxkQ29udGV4dCA9IHN1cGVyKGRhdGEsIGRhdGFLZXksIGpzb25LZXkpXHJcblxyXG4gICAgaWYgQGpzb25banNvbktleV0gIT0gdW5kZWZpbmVkXHJcbiAgICAgIEBkYXRhVHJlZVtjaGlsZENvbnRleHQuanNvbktleV0gPSB7XHJcbiAgICAgICAgaWQ6IGNoaWxkQ29udGV4dC5kYXRhS2V5XHJcbiAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgIGNvbnZlcnRlZERhdGE6IGNoaWxkQ29udGV4dC5kYXRhXHJcbiAgICAgICAganNvbjogQGpzb25banNvbktleV1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgbm90IGlzRW1wdHkoY2hpbGRDb250ZXh0LmRhdGFUcmVlKVxyXG4gICAgICAgIEBkYXRhVHJlZVtjaGlsZENvbnRleHQuanNvbktleV0uY2hpbGRyZW4gPSBjaGlsZENvbnRleHQuZGF0YVRyZWVcclxuXHJcbiAgICByZXR1cm4gY2hpbGRDb250ZXh0XHJcblxyXG5Ub0pzb24uV2l0aERhdGFUcmVlID0gVG9Kc29uV2l0aERhdGFUcmVlXHJcbiJdfQ==