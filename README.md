# to-json

to-json provides a consistent mechanism for mapping complex javascript data to json.
This mechanism allows for complex filtering, data conversion, and two-way mapping between the input and output data.

[![Build Status](https://travis-ci.org/WHenderson/to-json.svg?branch=master)](https://travis-ci.org/WHenderson/to-json)
[![Coverage Status](https://coveralls.io/repos/WHenderson/to-json/badge.svg?branch=master&service=github)](https://coveralls.io/github/WHenderson/to-json?branch=master)

## Installation

### Node
    npm install to-json

### Web
    bower install to-json

## Usage

### node
```js
var toJson = require('to-json');

console.log(toJson([1,2,3]));
```

### web (global)
```html
<html>
    <head>
        <script type="text/javascript" src="to-json.web.min.js"></script>
    </head>
    <body>
        <script>
            console.log(toJson([1,2,3]));
        </script>
    </body>
</html>
```

### web (amd)
```js
require.config({
  paths: {
      "to-json": "to-json.web.min.js"
  }
});
require(['to-json'], function (toJson) {
    console.log(toJson([1,2,3]));
});
```

## Simple Usage
Convert data to json using default mappers and direct copies.
When converting data, the toJson and toJSON methods are used wherever they are found.

```js
var json = toJson([1,2,3]);
```

## IO Mapping Usage
Convert data to json whilst simulataniously producing a mapping object.

### Path Map
Produce a 1:1 map of json path to data path strings.
```js
var context = new toJson.WithPathMap([1,2,3]);
var json = context.apply();
var pathMap = context.pathMap;
```

### Path Tree
Produce a mapping tree of json key/index to data key/index.
```js
var context = new toJson.WithPathTree([1,2,3]);
var json = context.apply();
var pathTree = context.pathTree;
```

### Data Map
Produce a 1:1 map of json paths to input data.
```js
var context = new toJson.WithDataMap([1,2,3]);
var json = context.apply();
var dataMap = context.dataMap;
```

### Data Tree
Produce a mapping tree of json key/index to data key/index of input data.
```js
var context = new toJson.WithDataTree([1,2,3]);
var json = context.apply();
var dataTree = context.dataTree;
```

## Advanced Usage
Customise the mapping process before converting data to json.

```js
var context = new toJson([1,2,3]);

// customise the context

var json = context.apply();
```

### Customisation
It is often desirable to adjust the mapping process at various levels within the process.
Mapping overrides can be applied at the following levels

#### Only to the current context
```js
context._toJson = ...
```
or
```js
context.adjustContext({
  _toJson: ...
});
```

#### Only to the current context and immediate child contexts
```js
context.adjustChildContexts({
  _toJson: ...
});
```

#### Only to the current nodes decedents
```js
context.adjustChildContexts({
  _toJson: ...
}, true);
```

#### To the current node and all its decedents
```js
context.adjustContext({
  _toJson: ...
}, true);
```
## Available customisations
The following customisations can be applied at any of the levels mentioned above.

### Custom naming
By default, json object keys are identical to the keys in the source data.
Change this method to customise the key name used in the json output.

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

### Filtering
Exclude unwanted input data from being returned in the json output.
to-json supports exclusions at each of the following stages:

* immediately (`_exclude`) - Has access to the context, input data, and mapping keys
* after data conversion (`_excludeData`) - Has access to the context, converted input data, and mapping keys
* after conversion to json (`_excludeJson`) - Has access to the context, converted input data, mapping keys and json output

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

### Data conversion
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

### Json conversion
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

### Input data enumeration
Customise the way incoming data is enumerated.
Enumeration can be customised for:

* Arrays  (`_getEnumeratorArray`)
* Objects (`_getEnumeratorObject`)
* Values  (`_getEnumeratorValue`)
* ..or everything at once (`_getEnumerator`)

```js
// Custom usage requires access to the context
var context = new toJson([0,1,2,3,4]);

// Return a callback for iterating over arrays which skips the first element
context._getEnumerator = function () {
  var _this = this;
  return function (cb) {
    var i,length = _this.data.length;
    // Set the output json
    _this.json = [];
    for (i = 1; i < length; ++i) {
      // cb(value, dataKey, jsonKey)
      cb(_this.data[i], i, _this.json.length);
    }
    // Return the resulting json
    return _this.json;
  };
}

var json = context.apply();
// [0,1,2,3]
```

## Classes / Prototypes

When enumerating input data, to-json checks for the presence of toJson(context) and toJSON() functions.
If either is found, the result of those functions is used to provide data to json mappings.

By overriding these methods, classes can customise their data-to-json mapping process in a standardised way

```js
// Example class
function MyObject() {
  this.a = 1;
  this.b = 2;
}
MyObject.prototype.c = 3;

MyObject.prototype.toJSON = function () {
  return toJson(this);
}
MyObject.prototype.toJson = function (context) {
  // customise the context
  ...

  // apply the context
  return context.apply(true);
}
```

