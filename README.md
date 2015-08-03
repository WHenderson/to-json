# to-json

The repository provides a consistent mechanism for mapping javascript to json.
This mechanism allows for complex filtering, data conversion, and two-way mapping between the input and output data.

This project has been created with the specific intention of providing data for web services and json schemas
whilst maintaining enough contextual information that errors in the json data can be mapped back to the originating data easily.

## Installation

### Node
    npm install to-json

### Web
    bower install to-json

## Usage

### node
```js
var toJson = require('to-json');

console.log(toJson([1,2,3]))
```

### web (global)
```html
<html>
    <head>
        <script src="to-json.min.js"></script>
    </head>
    <body>
        <script>
            alert(toJson([1,2,3]));
        </script>
    </body>
</html>
```

### web (amd)
```js
require(['to-json'], function (toJson) {
    alert(toJson([1,2,3]));
})
```

### Simple Usage
Convert data to json using default mappers and direct copies.
When converting data, the toJson and toJSON methods are used wherever they are found.

```js
json = toJson([1,2,3])
```

### Custom naming
Rename input data object keys before they are mapped to the json output.

```js
// Custom usage requires access to the context
var context = new toJson({a: 1, b: 2});

// Customise only the current node to uppercase all keys
// Note: names are determined by the parent item
context._getJsonKey = function (dataKey) {
    return dataKey.toUpperCase();
}

var json = context.apply();
// { A: 1, B: 2 }
```

### Custom filtering
Exclude unwanted data.
to-json supports exclusions at the following stages:

* immediately (_exclude)
* after data conversion (_excludeData)
* after conversion to json (_excludeJson)

```js
// Custom usage requires access to the context
var context = new toJson(['a','b','c','d']);

// Customise all immediate children to exclude odd indexes
context.adjustChildContexts({
  _exclude: function () {
    return typeof (this.dataKey == 'number') && (this.dataKey % 2 == 1);
  }
});

var json = context.apply();
// ['a','c']
```

### Custom data conversion
Convert incoming data before it is converted to json.
```js
// Custom usage requires access to the context
var context = new toJson([0,1,2,3,4]);

// Customise all immediate children to double incoming values
context.adjustChildContexts({
  _convertData: function () {
    this.data = this.data*2;
  }
});

var json = context.apply();
// [0,2,4,6,8]
```

### Custom json conversion
Convert outgoing json data.
```js
// Custom usage requires access to the context
var context = new toJson([0,1,2,3,4]);

// Customise all immediate children to double outgoing values
context.adjustChildContexts({
  _toJson: function () {
    // call super function to do the original conversion
    this._callSuper('_toJson');

    // double each output value
    this.json = this.json*2;
  }
});

var json = context.apply();
// [0,2,4,6,8]
```

### Custom data enumeration
Customise the way incoming data is enumerated.
Enumeration can be customised for:

* Arrays  (_getEnumeratorArray)
* Objects (_getEnumeratorObject)
* Values  (_getEnumeratorValue)
* ..or everything at once (_getEnumerator)

```js
// Example class
function MyObject() {
  this.a = 1;
  this.b = 2;
}
MyObject.prototype.c = 3;

// Custom usage requires access to the context
var context = new toJson(new MyObject());

// Customise object enumerator to include all members, both instance and prototype
context._getEnumeratorObject = function () {
  var _this = this;
  return function (cb) {
    _this.json = {};
    for (var key in _this.data) {
      // Include all members. Do not filter with hasOwnProperty
      cb(_this.data[key], key, _this._getJsonKey(key));
    }
    return _this.json;
  }
}

var json = context.apply();
// { a: 1, b: 2, c: 3 }
```

### Simple json mapping class customisation
Add a method to your class which will automatically be called when mapping instances to json
```js
function MyClass() {
  this.a = 1;
  this.A = 2;
}
MyClass.prototype.toJSON = function () {
  return 'my custom value';
};

var json = toJson(new MyClass());
// 'my custom value'

```

### Advanced json mapping class customisation
Add a method to your class to customise the way in which it maps instances to json
```js
function MyClass() {
  this.a = 1;
  this.A = 2;
}
MyClass.prototype.toJSON = function () {
  return toJson(this);
};
MyClass.prototype.toJson = function (context) {
  var _this = this;
  context._getEnumeratorObject = function () {
    var _this = this;
    return function (cb) {
      _this.json = {};
      for (var key in _this.data) {
        if (!{}.hasOwnProperty.call(_this.data, key))
          continue;

        if (key.toUpperCase() != key)
          continue;

        cb(_this.data[key], key, _this._getJsonKey(key));
      }
      return _this.json;
    }
  };

  return context.apply(true);
};

var json = toJson(new MyClass());
```

### Advanced customisation
It is often desirable to adjust the mapping process at various levels in the process.
to-json mapping overrides can be applied to effect change at the following levels
* Only to the current node
* Only to the current nodes immediate children
* Only to the current nodes decedents
* To the current node and all its decedents
```js
```

