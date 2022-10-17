'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ramda = require('ramda');
var React = require('react');
var F = require('fluture');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var F__namespace = /*#__PURE__*/_interopNamespace(F);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return generator._invoke = function (innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }(innerFn, self, context), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }
      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (undefined === method) {
      if (context.delegate = null, "throw" === context.method) {
        if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }
      return ContinueSentinel;
    }
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (object) {
    var keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

//  $$show :: String
var $$show = '@@show';

//  seen :: Array Any
var seen = [];

//  entry :: Object -> String -> String
var entry = function entry(o) {
  return function (k) {
    return show(k) + ': ' + show(o[k]);
  };
};

//  sortedKeys :: Object -> Array String
var sortedKeys = function sortedKeys(o) {
  return Object.keys(o).sort();
};

//# show :: Showable a => a -> String
//.
//. Returns a useful string representation of the given value.
//.
//. Dispatches to the value's `@@show` method if present.
//.
//. Where practical, `show (eval ('(' + show (x) + ')')) = show (x)`.
//.
//. ```javascript
//. > show (null)
//. 'null'
//.
//. > show (undefined)
//. 'undefined'
//.
//. > show (true)
//. 'true'
//.
//. > show (new Boolean (false))
//. 'new Boolean (false)'
//.
//. > show (-0)
//. '-0'
//.
//. > show (NaN)
//. 'NaN'
//.
//. > show (new Number (Infinity))
//. 'new Number (Infinity)'
//.
//. > show ('foo\n"bar"\nbaz\n')
//. '"foo\\n\\"bar\\"\\nbaz\\n"'
//.
//. > show (new String (''))
//. 'new String ("")'
//.
//. > show (['foo', 'bar', 'baz'])
//. '["foo", "bar", "baz"]'
//.
//. > show ([[[[[0]]]]])
//. '[[[[[0]]]]]'
//.
//. > show ({x: [1, 2], y: [3, 4], z: [5, 6]})
//. '{"x": [1, 2], "y": [3, 4], "z": [5, 6]}'
//. ```
var show = function show(x) {
  if (seen.indexOf(x) >= 0) return '<Circular>';
  var repr = Object.prototype.toString.call(x);
  switch (repr) {
    case '[object Null]':
      return 'null';
    case '[object Undefined]':
      return 'undefined';
    case '[object Boolean]':
      return _typeof(x) === 'object' ? 'new Boolean (' + show(x.valueOf()) + ')' : x.toString();
    case '[object Number]':
      return _typeof(x) === 'object' ? 'new Number (' + show(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
    case '[object String]':
      return _typeof(x) === 'object' ? 'new String (' + show(x.valueOf()) + ')' : JSON.stringify(x);
    case '[object RegExp]':
      return x.toString();
    case '[object Date]':
      return 'new Date (' + show(isNaN(x.valueOf()) ? NaN : x.toISOString()) + ')';
    case '[object Error]':
      return 'new ' + x.name + ' (' + show(x.message) + ')';
    case '[object Arguments]':
      return 'function () { return arguments; } (' + Array.prototype.map.call(x, show).join(', ') + ')';
    case '[object Array]':
      seen.push(x);
      try {
        return '[' + x.map(show).concat(sortedKeys(x).filter(function (k) {
          return !/^\d+$/.test(k);
        }).map(entry(x))).join(', ') + ']';
      } finally {
        seen.pop();
      }
    case '[object Object]':
      seen.push(x);
      try {
        return $$show in x && (x.constructor == null || x.constructor.prototype !== x) ? x[$$show]() : '{' + sortedKeys(x).map(entry(x)).join(', ') + '}';
      } finally {
        seen.pop();
      }
    case '[object Set]':
      seen.push(x);
      try {
        return 'new Set (' + show(Array.from(x.values())) + ')';
      } finally {
        seen.pop();
      }
    case '[object Map]':
      seen.push(x);
      try {
        return 'new Map (' + show(Array.from(x.entries())) + ')';
      } finally {
        seen.pop();
      }
    default:
      return repr.replace(/^\[(.*)\]$/, '<$1>');
  }
};

var $$type = '@@type';

//  type :: Any -> String
function type(x) {
  return x != null && x.constructor != null && x.constructor.prototype !== x && typeof x.constructor[$$type] === 'string' ? x.constructor[$$type] : Object.prototype.toString.call(x).slice('[object '.length, -']'.length);
}

// Names of prop used to store:
// * name of variant of a sum type
var TAG = '@@tag';
// * array of arguments used to create a value (to speed up `cata`)
var VALUES = '@@values';
// * `@@type` of its returned results
var TYPE = '@@type';
// * `@@type` of variant constructor's returned results
var RET_TYPE = '@@ret_type';
// * names of all variants of a sum type
var TAGS = '@@tags';
var SHOW = '@@show';
function tagged(typeName, fields) {
  var proto = {
    toString: tagged$toString
  };
  proto[SHOW] = tagged$toString;
  // this way we avoid named function
  var typeRep = makeConstructor(fields, proto);
  typeRep.toString = typeRepToString;
  typeRep.prototype = proto;
  typeRep.is = isType(typeName);
  typeRep.from = makeConstructorFromObject(fields, proto);
  typeRep[TYPE] = typeName;
  typeRep[SHOW] = typeRepToString;
  proto.constructor = typeRep;
  return typeRep;
}
function taggedSum(typeName, constructors) {
  var proto = {
    cata: sum$cata,
    toString: sum$toString
  };
  proto[SHOW] = sum$toString;
  var tags = Object.keys(constructors);
  var typeRep = proto.constructor = {
    toString: typeRepToString,
    prototype: proto,
    is: isType(typeName),
    '@@type': typeName,
    '@@tags': tags
  };
  typeRep[SHOW] = typeRepToString;
  tags.forEach(function (tag) {
    var fields = constructors[tag];
    var tagProto = Object.create(proto);
    defProp(tagProto, TAG, tag);
    if (fields.length === 0) {
      typeRep[tag] = makeValue(fields, tagProto, [], 0);
      typeRep[tag].is = sum$isUnit(typeRep[tag]);
      return;
    }
    typeRep[tag] = makeConstructor(fields, tagProto);
    typeRep[tag].is = sum$isVariant(typeRep[tag]);
    typeRep[tag][TAG] = tag;
    typeRep[tag][RET_TYPE] = typeName;
    typeRep[tag].toString = sum$ctrToString;
    typeRep[tag].from = makeConstructorFromObject(fields, tagProto);
  });
  return typeRep;
}
function sum$cata(fs) {
  var tags = this.constructor[TAGS];
  var tag;
  for (var idx = 0; idx < tags.length; idx += 1) {
    tag = tags[idx];
    if (!fs[tag]) {
      throw new TypeError("Constructors given to cata didn't include: " + tag);
    }
  }
  return fs[this[TAG]].apply(fs, this[VALUES]);
}
function sum$ctrToString() {
  return this[RET_TYPE] + '.' + this[TAG];
}
function sum$toString() {
  return this.constructor[TYPE] + '.' + this[TAG] + arrToString(this[VALUES]);
}
function typeRepToString() {
  return this[TYPE];
}
function tagged$toString() {
  return this.constructor[TYPE] + arrToString(this[VALUES]);
}
function sum$isVariant(variant) {
  return function $sum$isVariant(val) {
    return Boolean(val) && variant[TAG] === val[TAG] && variant[RET_TYPE] === type(val);
  };
}
function sum$isUnit(unit) {
  return function $sum$isUnit(val) {
    return unit === val || Boolean(val) && unit[TAG] === val[TAG] && type(unit) === type(val);
  };
}
function isType(typeName) {
  return function $isType(val) {
    return typeName === type(val);
  };
}
function makeValue(fields, proto, values, argumentsLength) {
  if (argumentsLength !== fields.length) {
    throw new TypeError('Expected ' + fields.length + ' arguments, got ' + argumentsLength);
  }
  var obj = Object.create(proto);
  defProp(obj, VALUES, values);
  for (var idx = 0; idx < fields.length; idx += 1) {
    obj[fields[idx]] = values[idx];
  }
  return obj;
}

// adopted version of withValue from  https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
function defProp(obj, prop, val) {
  var desc = defProp.desc || (defProp.desc = {
    enumerable: false,
    writable: false,
    configurable: false,
    value: null
  });
  desc.value = val;
  Object.defineProperty(obj, prop, desc);
}

// optimised version of `arr.map(toString).join(', ')`
function arrToString(arr) {
  if (arr.length === 0) return '';
  var str = '(' + show(arr[0]);
  for (var idx = 1; idx < arr.length; idx += 1) {
    str = str + ', ' + show(arr[idx]);
  }
  return str + ')';
}
function makeConstructor(fields, proto) {
  switch (fields.length) {
    /* eslint-disable max-len */
    case 1:
      return function (a) {
        return makeValue(fields, proto, [a], arguments.length);
      };
    case 2:
      return function (a, b) {
        return makeValue(fields, proto, [a, b], arguments.length);
      };
    case 3:
      return function (a, b, c) {
        return makeValue(fields, proto, [a, b, c], arguments.length);
      };
    case 4:
      return function (a, b, c, d) {
        return makeValue(fields, proto, [a, b, c, d], arguments.length);
      };
    case 5:
      return function (a, b, c, d, e) {
        return makeValue(fields, proto, [a, b, c, d, e], arguments.length);
      };
    case 6:
      return function (a, b, c, d, e, f) {
        return makeValue(fields, proto, [a, b, c, d, e, f], arguments.length);
      };
    case 7:
      return function (a, b, c, d, e, f, g) {
        return makeValue(fields, proto, [a, b, c, d, e, f, g], arguments.length);
      };
    case 8:
      return function (a, b, c, d, e, f, g, h) {
        return makeValue(fields, proto, [a, b, c, d, e, f, g, h], arguments.length);
      };
    case 9:
      return function (a, b, c, d, e, f, g, h, i) {
        return makeValue(fields, proto, [a, b, c, d, e, f, g, h, i], arguments.length);
      };
    case 10:
      return function (a, b, c, d, e, f, g, h, i, j) {
        return makeValue(fields, proto, [a, b, c, d, e, f, g, h, i, j], arguments.length);
      };
    /* eslint-enable max-len */
    default:
      return Object.defineProperty(function () {
        return makeValue(fields, proto, arguments, arguments.length);
      }, 'length', {
        value: fields.length
      });
  }
}
function makeConstructorFromObject(fields, proto) {
  return function (obj) {
    var values = [];
    for (var idx = 0; idx < fields.length; idx += 1) {
      var field = fields[idx];
      if (!Object.prototype.hasOwnProperty.call(obj, field)) {
        throw new TypeError('Missing field: ' + field);
      }
      values.push(obj[field]);
    }
    return makeValue(fields, proto, values, values.length);
  };
}

var Free = taggedSum('Free', {
  Impure: ['x', 'f'],
  Pure: ['x']
});
Free.of = Free.Pure;
var kleisli_comp = function kleisli_comp(f, g) {
  return function (x) {
    return f(x).chain(g);
  };
};
Free.prototype.fold = function () {
  return this.x.fold.apply(this.x, arguments);
};
Free.prototype.map = function (f) {
  return this.cata({
    Impure: function Impure(x, g) {
      return Free.Impure(x, function (y) {
        return g(y).map(f);
      });
    },
    Pure: function Pure(x) {
      return Free.Pure(f(x));
    }
  });
};
Free.prototype.ap = function (a) {
  return this.cata({
    Impure: function Impure(x, g) {
      return Free.Impure(x, function (y) {
        return g(y).ap(a);
      });
    },
    Pure: function Pure(f) {
      return a.map(f);
    }
  });
};
Free.prototype.chain = function (f) {
  return this.cata({
    Impure: function Impure(x, g) {
      return Free.Impure(x, kleisli_comp(g, f));
    },
    Pure: function Pure(x) {
      return f(x);
    }
  });
};
var liftF = function liftF(command) {
  return Free.Impure(command, Free.Pure);
};
Free.prototype.foldMap = function (interpreter, of) {
  return this.cata({
    Pure: function Pure(a) {
      return of(a);
    },
    Impure: function Impure(intruction_of_arg, next) {
      return ramda.chain(function (result) {
        return next(result).foldMap(interpreter, of);
      })(interpreter(intruction_of_arg));
    }
  });
};

var Maybe = taggedSum('Maybe', {
  Nothing: [],
  Just: ['value']
});
Maybe.of = Maybe.Just;
Maybe.prototype['fantasy-land/of'] = Maybe.Just;
var maybe$map = function maybe$map(f) {
  var _this = this;
  return this.cata({
    Nothing: function Nothing() {
      return _this;
    },
    Just: function Just(value) {
      return Maybe.Just(f(value));
    }
  });
};
var maybe$chain = function maybe$chain(f) {
  var _this2 = this;
  return this.cata({
    Nothing: function Nothing() {
      return _this2;
    },
    Just: function Just(value) {
      return f(value);
    }
  });
};
Maybe.prototype['map'] = maybe$map;
Maybe.prototype['fantasy-land/map'] = maybe$map;
Maybe.prototype['chain'] = maybe$chain;
Maybe.prototype['fantasy-land/chain'] = maybe$chain;
Maybe.prototype.reduce = function (fn, x) {
  return this.cata({
    Nothing: function Nothing() {
      return x;
    },
    Just: function Just(v) {
      return fn(x, v);
    }
  });
};
Maybe.prototype.fromMaybe = function (defaultValue) {
  return this.cata({
    Nothing: function Nothing() {
      return defaultValue;
    },
    Just: ramda.identity
  });
};
Maybe.prototype.isJust = function () {
  return this.cata({
    Nothing: function Nothing() {
      return false;
    },
    Just: function Just() {
      return true;
    }
  });
};

var next = function next(regen) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return function (data) {
    var gen = regen.apply(void 0, args);
    return gen.next(data), gen;
  };
};
var immutagen = function immutagen(regen) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return function loop(regen) {
      return function (gen, data) {
        var _gen$next = gen.next(data),
          value = _gen$next.value,
          done = _gen$next.done;
        if (done) return {
          value: value,
          next: null,
          mutable: gen
        };
        var replay = false;
        var recur = loop(next(regen, data));
        var mutable = function mutable() {
          return replay ? regen(data) : replay = gen;
        };
        var result = {
          value: value,
          next: function next(value) {
            return recur(mutable(), value);
          }
        };
        return Object.defineProperty(result, 'mutable', {
          get: mutable
        });
      };
    }(next.apply(void 0, [regen].concat(args)))(regen.apply(void 0, args));
  };
};

var rec2 = function rec2(res) {
  return !res.next ? res.value : ramda.chain(function (x) {
    return rec2(res.next(x));
  })(res.value);
};
var go = function go(generator) {
  return rec2(immutagen(generator)());
};

var Emitter = tagged('Emitter', ['emitter']);
Emitter.prototype.map = function (fn) {
  var _this = this;
  return Emitter(function (k) {
    return _this.emitter(ramda.compose(k, fn));
  });
};
Emitter.prototype.subscribe = function (fn) {
  return this.emitter(fn);
};

var FutureInt = tagged('Future', ['computation']);
var Future = ramda.compose(FutureInt, F__namespace.Future);
var resolve = function resolve(value) {
  return Future(function (reject, resolve) {
    resolve(value);
    return function () {};
  });
};
var reject = function reject(value) {
  return Future(function (reject, resolve) {
    reject(value);
    return function () {};
  });
};
Future.of = resolve;
Future.resolve = resolve;
Future.reject = reject;
Future.encaseP = function (f) {
  return function (x) {
    return FutureInt(F__namespace.encaseP(f)(x));
  };
};
Future.encase = function (f) {
  return function (x) {
    return FutureInt(F__namespace.encase(f)(x));
  };
};
Future.attemptP = ramda.compose(FutureInt, F__namespace.attemptP);
Future.attempt = ramda.compose(FutureInt, F__namespace.attempt);
Future.after = function (ms) {
  return function (value) {
    return FutureInt(F__namespace.after(ms)(value));
  };
};
FutureInt.prototype.map = function (fn) {
  return FutureInt(this.computation['fantasy-land/map'](fn));
};
FutureInt.prototype.chain = function (fn) {
  return FutureInt(this.computation['fantasy-land/chain'](function (x) {
    return fn(x).computation;
  }));
};
FutureInt.prototype.fork = function (reject, resolve) {
  return F__namespace.fork(reject)(resolve)(this.computation);
};
FutureInt.prototype.coalesce = function (reject, resolve) {
  return FutureInt(F__namespace.coalesce(reject)(resolve)(this.computation));
};

taggedSum('RequestMethod', {
  Get: [],
  Post: ['content'],
  Put: ['content'],
  Delete: []
});

var Pair = tagged('Pair', ['fst', 'snd']);
Pair.prototype.map = function (fn) {
  return Pair(this.fst, fn(this.snd));
};
Pair.prototype.lmap = function (fn) {
  return Pair(fn(this.fst), this.snd);
};
Pair.prototype.bimap = function (lfn, rfn) {
  return Pair(lfn(this.fst), rfn(this.snd));
};
Pair.prototype.chain = function (fn) {
  var p2 = fn(this.snd);
  return Pair(ramda.concat(this.fst, p2.fst), p2.snd);
};
Pair.prototype.pipe = function (fn) {
  return fn(this);
};

var Either = taggedSum('Either', {
  Left: ['reason'],
  Right: ['result']
});
Either.of = Either.Right;
Either.prototype['fantasy-land/of'] = Either.Right;
var either$map = function either$map(f) {
  var _this = this;
  return this.cata({
    Left: function Left() {
      return _this;
    },
    Right: function Right(value) {
      return Either.Right(f(value));
    }
  });
};
var either$chain = function either$chain(f) {
  var _this2 = this;
  return this.cata({
    Left: function Left() {
      return _this2;
    },
    Right: function Right(value) {
      return f(value);
    }
  });
};
Either.prototype['map'] = either$map;
Either.prototype['fantasy-land/map'] = either$map;
Either.prototype['chain'] = either$chain;
Either.prototype['fantasy-land/chain'] = either$chain;
Either.prototype.fromEither = function (defaultValue) {
  return this.cata({
    Left: function Left() {
      return defaultValue;
    },
    Right: ramda.identity
  });
};

var Arrow = tagged('Arrow', ['runWith']);
Arrow.prototype.map = function (fn) {
  var _this = this;
  return Arrow(function (x) {
    return fn(_this.runWith(x));
  });
};
Arrow.prototype.rmap = function (fn) {
  var _this2 = this;
  return Arrow(function (x) {
    return fn(_this2.runWith(x));
  });
};
Arrow.prototype.compose = function (m) {
  var _this3 = this;
  return Arrow(function (x) {
    return m.runWith(_this3.runWith(x));
  });
};
Arrow.prototype.contramap = function (fn) {
  var _this4 = this;
  return Arrow(function (x) {
    return _this4.runWith(fn(x));
  });
};
Arrow.prototype.dimap = function (l, r) {
  var _this5 = this;
  return Arrow(function (x) {
    return r(_this5.runWith(l(x)));
  });
};
Arrow.prototype.left = function () {
  var _this6 = this;
  return Arrow(function (x) {
    return x.cata({
      Left: function Left(a) {
        return Either.Left(_this6.runWith(a));
      },
      Right: function Right(c) {
        return Either.Right(c);
      }
    });
  });
};
Arrow.prototype.right = function () {
  var _this7 = this;
  return Arrow(function (x) {
    return x.map(_this7.runWith);
  });
};
Arrow.prototype.first = function () {
  var _this8 = this;
  return Arrow(function (x) {
    return Pair(_this8.runWith(x.fst), x.snd);
  });
};
Arrow.prototype.second = function () {
  var _this9 = this;
  return Arrow(function (x) {
    return x.map(_this9.runWith);
  });
};
Arrow.prototype.tap = function (fn) {
  fn(this.runWith);
  return this;
};

var First = tagged('First', ['maybe']);
First.empty = function () {
  return First(Maybe.Nothing);
};
First.prototype.concat = function (other) {
  var _this = this;
  return this.maybe.cata({
    Just: function Just(x) {
      return First(_this.maybe);
    },
    Nothing: function Nothing() {
      return other;
    }
  });
};
First.prototype.empty = First.empty;

var Forget = tagged('Forget', ['typeRep', 'runWith']);
Forget.prototype.rmap = function (fn) {
  return Forget(this.typeRep, this.runWith);
};
Forget.prototype.dimap = function (l, r) {
  var _this = this;
  return Forget(this.typeRep, function (x) {
    return _this.runWith(l(x));
  });
};
Forget.prototype.first = function () {
  var _this2 = this;
  return Forget(this.typeRep, function (x) {
    return _this2.runWith(x.fst);
  });
};
Forget.prototype.right = function () {
  var _this3 = this;
  var empty = this.typeRep.empty();
  return Forget(this.typeRep, function (x) {
    return x.cata({
      Left: function Left(z) {
        return empty;
      },
      Right: function Right(z) {
        return _this3.runWith(z);
      }
    });
  });
};
Forget.prototype.tap = function (fn) {
  fn(this.runWith);
  return this;
};

var Id = function Id(x) {
  var _ref;
  return _ref = {
    map: function map(f) {
      return Id(f(x));
    },
    chain: function chain(f) {
      return f(x);
    },
    tap: function tap(f) {
      f(x);
      return Id(x);
    }
  }, _defineProperty(_ref, 'fantasy-land/map', function fantasyLandMap(f) {
    return Id(f(x));
  }), _defineProperty(_ref, 'fantasy-land/ap', function fantasyLandAp(f) {
    return 6;
  }), _defineProperty(_ref, 'fantasy-land/chain', function fantasyLandChain(f) {
    return f(x);
  }), _defineProperty(_ref, "extract", function extract() {
    return x;
  }), _defineProperty(_ref, "concat", function concat(o) {
    return Id(x.concat(o.extract()));
  }), _ref;
};
Id.of = function (x) {
  return Id(x);
};

var uncons = function uncons(str) {
  var _splitAt = ramda.splitAt(1)(str),
    _splitAt2 = _slicedToArray(_splitAt, 2),
    head = _splitAt2[0],
    tail = _splitAt2[1];
  return Array.isArray(str) ? head.length === 0 ? Maybe.Nothing : Maybe.Just({
    head: head[0],
    tail: tail
  }) : head === '' ? Maybe.Nothing : Maybe.Just({
    head: head,
    tail: tail
  });
};
var head = function head(arr) {
  return arr.length > 0 ? Maybe.Just(arr[0]) : Maybe.Nothing;
};
var find = function find(pred) {
  return function (xs) {
    for (var i = 0; i < xs.length; i++) {
      if (pred(xs[i])) {
        return Maybe.Just(xs[i]);
      }
    }
    return Maybe.Nothing;
  };
};
var Unit = tagged('Unit', []);
var unit = Unit();

//foldMapOf :: forall s t a b r. Fold r s t a b -> (a -> r) -> s -> r
//foldMapOf = under Forget

var foldMapOf = ramda.curry(function (p, m, s) {
  return p(m)(s);
});

//preview p = unwrap <<< foldMapOf p (First <<< Just)
ramda.curry(function (p, d) {
  return foldMapOf(p, Forget(First, function (a) {
    return First(Maybe.Just(a));
  }), d).maybe;
});

//10^6 * 1t
//1t = 1Mg

var foldMap = ramda.curry(function (typeRep, f, a) {
  return ramda.reduce(function (p, c) {
    return p.concat(f(c));
  }, typeRep.empty(), a);
});

//folded :: forall g a b t r. Monoid r => Foldable g => Fold r (g a) b a t
ramda.curry(function (typeRep, a, d) {
  return Forget(typeRep, foldMap(typeRep, a)).runWith(d);
});
ramda.curry(function (p, d) {
  return p(Forget(Id, ramda.identity))(d);
});
var over = ramda.curry(function (l, f, d) {
  return l(Arrow(f))(d);
});
ramda.curry(function (l, b, d) {
  return over(l, ramda.always(b), d);
});

var RoutePrinter = tagged('RoutePrinter', ['printer']);
RoutePrinter.prototype.append = function (other) {
  return RoutePrinter(ramda.compose(other.printer, this.printer));
};
RoutePrinter.empty = RoutePrinter(ramda.identity);
RoutePrinter.put = function (str) {
  return RoutePrinter(ramda.evolve({
    segments: ramda.append(str)
  }));
};
RoutePrinter.param = function (k) {
  return function (v) {
    return RoutePrinter(ramda.evolve({
      params: ramda.append(Pair(k, v))
    }));
  };
};
var printSegments = function printSegments(segments) {
  return ramda.equals(segments, ['']) ? '/' : segments.map(encodeURIComponent).join('/');
};
RoutePrinter.run = function (a) {
  return Id({
    segments: [],
    params: []
  }).map(a.printer).map(function (_ref) {
    var segments = _ref.segments,
      params = _ref.params;
    return printSegments(segments) + (params.length > 0 ? "?".concat(params.map(function (_ref2) {
      var fst = _ref2.fst,
        snd = _ref2.snd;
      return "".concat(encodeURIComponent(fst), "=").concat(encodeURIComponent(snd));
    }).join('&')) : '');
  }).extract();
};

var RouteError = taggedSum('RouteError', {
  Expected: ['a', 'b'],
  ExpectedEndOfPath: ['a'],
  MissingParam: ['a'],
  EndOfPath: []
});
var RouteResult = taggedSum('RouteResult', {
  Fail: ['routeError'],
  Success: ['routeState', 'a']
});
RouteResult.prototype.map = function (fn) {
  var _this = this;
  return this.cata({
    Fail: function Fail() {
      return _this;
    },
    Success: function Success(state, a) {
      return RouteResult.Success(state, fn(a));
    }
  });
};
var RouteParser = taggedSum('RouteParser', {
  Alt: ['a'],
  Chomp: ['c'],
  Prefix: ['a', 'b']
});
RouteParser.of = function (v) {
  return RouteParser.Chomp(function (state) {
    return RouteResult.Success(state, v);
  });
};
RouteParser.prototype.map = function (fn) {
  return this.cata({
    Alt: function Alt(ps) {
      return RouteParser.Alt(ps.map(function (p) {
        return p.map(fn);
      }));
    },
    Chomp: function Chomp(g) {
      return RouteParser.Chomp(function (state) {
        return g(state).map(fn);
      });
    },
    Prefix: function Prefix(str, parser) {
      return RouteParser.Prefix(str, parser.map(fn));
    }
  });
};
RouteParser.prototype.ap = function (x) {
  var _this2 = this;
  return RouteParser.Chomp(function (state) {
    return runRouteParser(state, _this2).cata({
      Fail: function Fail(e) {
        return RouteResult.Fail(e);
      },
      Success: function Success(state2, f) {
        return runRouteParser(state2, x).map(f);
      }
    });
  });
};
var RouteDuplex = tagged('RouteDuplex', ['enc', 'dec']);
RouteDuplex.prototype.pipe = function (fn) {
  return fn(this);
};
RouteDuplex.record = RouteDuplex(function (a) {
  return RoutePrinter.empty;
}, RouteParser.of({}));
RouteDuplex.prop = function (key) {
  return function (p1) {
    return function (p2) {
      return RouteDuplex(function (a) {
        return p2.enc(a).append(p1.enc(a[key]));
      }, p2.dec.map(function (o) {
        return function (v) {
          return ramda.assoc(key, v, o);
        };
      }).ap(p1.dec));
    };
  };
};
tagged('Product', ['a', 'b']);
var NoArguments = tagged('NoArguments', []);
var indexOf = function indexOf(p, str) {
  var idx = str.indexOf(p);
  return idx >= 0 ? Maybe.Just(idx) : Maybe.Nothing;
};
var take = function take(idx, str) {
  return str.substr(0, idx);
};
var drop = function drop(idx, str) {
  return str.substr(idx);
};
var splitAt = function splitAt(p, str) {
  return indexOf(p, str).cata({
    Just: function Just(idx) {
      return Pair(take(idx, str), drop(idx + p.length, str));
    },
    Nothing: function Nothing() {
      return Pair(str, '');
    }
  });
};
var splitNonEmpty = function splitNonEmpty(p, str) {
  return str === '' ? [] : str.split(p);
};
var splitSegments = function splitSegments(path) {
  var segments = splitNonEmpty('/', path);
  return ramda.equals(segments, ['', '']) ? [''] : segments.map(decodeURIComponent);
};
var splitParams = function splitParams(str) {
  return splitNonEmpty('&', str).map(splitKeyValue);
};
var splitKeyValue = function splitKeyValue(str) {
  return splitAt('=', str).bimap(decodeURIComponent, decodeURIComponent);
};
var splitPath = function splitPath(str) {
  return splitAt('?', str).bimap(splitSegments, splitParams);
};
var toRouteState = function toRouteState(pair) {
  return {
    segments: pair.fst.fst,
    params: pair.fst.snd,
    hash: pair.snd
  };
};
var parsePath = function parsePath(s) {
  return splitAt('#', s).lmap(splitPath).pipe(toRouteState);
};
var chompPrefix = function chompPrefix(pre, state) {
  return head(state.segments).cata({
    Just: function Just(pre2) {
      return pre2 === pre ? RouteResult.Success(ramda.evolve({
        segments: function segments(_ref) {
          var _ref2 = _toArray(_ref);
            _ref2[0];
            var tail = _ref2.slice(1);
          return tail;
        }
      })(state), 'unit') : RouteResult.Fail(RouteError.Expected(pre, pre2));
    },
    Nothing: function Nothing() {
      return '';
    }
  });
};
var goAlt = function goAlt(state) {
  return function (prev, current) {
    return RouteResult.Fail.is(prev) ? runRouteParser(state, current) : prev;
  };
};
var runRouteParser = function runRouteParser(state, p) {
  return p.cata({
    Alt: function Alt(xs) {
      return ramda.reduce(goAlt(state), RouteResult.Fail(RouteError.EndOfPath), xs);
    },
    Chomp: function Chomp(f) {
      return f(state);
    },
    Prefix: function Prefix(pre, p2) {
      return chompPrefix(pre, state).cata({
        Fail: function Fail(x) {
          return RouteResult.Fail(x);
        },
        Success: function Success(state2) {
          return runRouteParser(state2, p2);
        }
      });
    }
  });
};
var Parser = {
  take: RouteParser.Chomp(function (state) {
    return uncons(state.segments).cata({
      Just: function Just(_ref3) {
        var head = _ref3.head,
          tail = _ref3.tail;
        return RouteResult.Success(_objectSpread2(_objectSpread2({}, state), {}, {
          segments: tail
        }), head);
      },
      Nothing: function Nothing() {
        return RouteResult.Fail(RouteError.EndOfPath);
      }
    });
  }),
  prefix: function prefix(str, p) {
    return RouteParser.Prefix(str, p);
  },
  run: function run(p, str) {
    return runRouteParser(parsePath(str), p).cata({
      Fail: function Fail(err) {
        return Either.Left(err);
      },
      Success: function Success(_, res) {
        return Either.Right(res);
      }
    });
  },
  as: function as(print, decode, p) {
    return RouteParser.Chomp(function (state) {
      return runRouteParser(state, p).cata({
        Fail: function Fail(err) {
          return RouteResult.Fail(err);
        },
        Success: function Success(state2, a) {
          return decode(a).cata({
            Left: function Left(err) {
              return RouteResult.Fail(RouteError.Expected(err, print(a)));
            },
            Right: function Right(b) {
              return RouteResult.Success(state2, b);
            }
          });
        }
      });
    });
  },
  param: function param(key) {
    return RouteParser.Chomp(function (state) {
      return find(function (_ref4) {
        var fst = _ref4.fst;
          _ref4.snd;
        return fst === key;
      })(state.params).map(function (x) {
        return x.snd;
      }).cata({
        Just: function Just(a) {
          return RouteResult.Success(state, a);
        },
        Nothing: function Nothing() {
          return RouteResult.Fail(RouteError.MissingParam(key));
        }
      });
    });
  },
  optional: function optional(p) {
    return RouteParser.Chomp(function (state) {
      return runRouteParser(state, p).cata({
        Fail: function Fail() {
          return RouteResult.Success(state, Maybe.Nothing);
        },
        Success: function Success(state2, a) {
          return RouteResult.Success(state2, Maybe.Just(a));
        }
      });
    });
  },
  end: RouteParser.Chomp(function (state) {
    return state.segments.length === 0 ? RouteResult.Success(state, {}) : RouteResult.Fail(RouteError.EndOfPath);
  })
};
RouteDuplex.param = function (p) {
  return RouteDuplex(RoutePrinter.param(p), Parser.param(p));
};
RouteDuplex.params = function (def) {
  return Id(def).map(ramda.toPairs).map(function (xs) {
    return ramda.reduce(function (p, _ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        value = _ref6[1];
      return RouteDuplex.prop(key)(value(RouteDuplex.param(key)))(p);
    }, RouteDuplex.record, xs);
  }).extract();
};

// applyFirst :: forall a b f. Apply f => f a -> f b -> f a
// applyFirst a b = const <$> a <*> b

RouteDuplex.end = function (p) {
  return RouteDuplex(p.enc, p.dec.map(ramda.always).ap(Parser.end));
};
var print = function print(routeDuplex, o) {
  return RoutePrinter.run(routeDuplex.enc(o));
};
RouteDuplex(RoutePrinter.put, Parser.take);
RouteDuplex(function (a) {
  return RoutePrinter.empty;
}, RouteParser.of(NoArguments()));

var Ref = tagged('Ref', ['value']);
Ref.new = function (value) {
  return Future.attempt(function () {
    return Ref(value);
  });
};
Ref.prototype.read = function () {
  var _this = this;
  return Future.attempt(function () {
    return _this.value;
  });
};
Ref.prototype.write = function (value) {
  var _this2 = this;
  return Future.attempt(function () {
    return _this2.value = value;
  });
};
Ref.prototype.modify1 = function (f) {
  var _this3 = this;
  return Future.attempt(function () {
    var t = f(_this3.value);
    _this3.value = t.state;
    return t.value;
  });
};
Ref.prototype.modify = function (f) {
  var _this4 = this;
  return Future.attempt(function () {
    return _this4.value = f(_this4.value);
  });
};

var _excluded = ["href", "children", "content"],
  _excluded2 = ["component", "output", "slotType", "slotId"];
var HalogenQ = taggedSum('HalogenQ', {
  Initialize: [],
  Action: ['action'],
  Receive: ['input'],
  Query: ['query']
});
var HalogenF = taggedSum('HalogenF', {
  State: ['fn'],
  Lift: ['future'],
  Subscribe: ['esc'],
  Unsubscribe: ['sid'],
  Raise: ['action'],
  Fork: ['action'],
  ChildQuery: ['type', 'id', 'query'],
  GetStore: [],
  GetNavigator: [],
  Navigate: ['route']
});
var ForkId = tagged('ForkId', ['id']);
var SubscriptionId = tagged('SubscriptionId', ['id']);
var modify = function modify(fn) {
  return liftF(HalogenF.State(fn));
};
var put = function put(state) {
  return liftF(HalogenF.State(ramda.always(state)));
};
var get = function get() {
  return liftF(HalogenF.State(ramda.identity));
};
var gets = function gets(selector) {
  return liftF(HalogenF.State(selector));
};
var subscribe = function subscribe(es) {
  return liftF(HalogenF.Subscribe(function () {
    return es;
  }));
};
var unsubscribe = function unsubscribe(sid) {
  return liftF(HalogenF.Unsubscribe(sid));
};
var raise = function raise(action) {
  return liftF(HalogenF.Raise(action));
};
var liftFuture = function liftFuture(future) {
  return liftF(HalogenF.Lift(future));
};
var createSub = Future(function (reject, resolve) {
  var subscribers = [];
  resolve({
    emitter: Emitter(function (k) {
      subscribers.push(k);
      return function () {
        subscribers = subscribers.filter(function (x) {
          return x !== k;
        });
      };
    }),
    listener: function listener(a) {
      subscribers.forEach(function (k) {
        return k(a);
      });
    }
  });
  return function () {};
});
var defaultHaloContext = {
  raise: function raise(action) {
    return console.error('component not embedded in Slot');
  },
  registerChild: function registerChild(x) {
    return console.error('component not embedded in Slot');
  },
  store: 1,
  interpreters: [],
  navigator: {}
};
var HaloContext = /*#__PURE__*/React.createContext(defaultHaloContext);
var H = {
  of: Free.of,
  modify: modify,
  put: put,
  get: get,
  gets: gets,
  subscribe: subscribe,
  unsubscribe: unsubscribe,
  raise: raise,
  fork: function fork(hm) {
    return liftF(HalogenF.Fork(hm));
  },
  liftFuture: liftFuture,
  query: function query(type) {
    return function (id) {
      return function (query) {
        return liftF(HalogenF.ChildQuery(type, id, query));
      };
    };
  },
  getStore: function getStore() {
    return liftF(HalogenF.GetStore);
  },
  getNavigator: function getNavigator() {
    return liftF(HalogenF.GetNavigator);
  },
  navigate: function navigate(route) {
    return liftF(HalogenF.Navigate(route));
  }
};
var useEqualsEffect = function useEqualsEffect(effect, inputs) {
  var prev = React.useRef(null);
  var prevDispose = React.useRef(null);
  if (!ramda.equals(inputs, prev.current)) {
    if (typeof prevDispose.current === 'function') {
      prevDispose.current();
    }
    prevDispose.current = effect();
  }
  prev.current = inputs;
};
var fresh = ramda.curry(function (f, ref) {
  return go( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var st;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return ref.read();
          case 2:
            st = _context.sent;
            return _context.abrupt("return", st.fresh.modify1(function (i) {
              return {
                state: i + 1,
                value: f(i)
              };
            }));
          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
});
var interpret = function interpret(_ref) {
  var setState = _ref.setState,
    dispatch = _ref.dispatch,
    onRaised = _ref.onRaised,
    childrenComponents = _ref.childrenComponents,
    interpreters = _ref.interpreters,
    store = _ref.store,
    navigator = _ref.navigator,
    routeCodec = _ref.routeCodec,
    ref = _ref.ref;
  return function (command) {
    var x = ramda.find(function (i) {
      return i[0].is(command);
    }, interpreters);
    if (x) {
      return x[1](command);
    }
    return command.cata({
      State: function State(fn) {
        return go( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return fresh(ForkId, ref);
                case 2:
                  _context2.sent;
                  return _context2.abrupt("return", Future.attempt(function () {
                    return setState(fn);
                  }));
                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));
      },
      Lift: function Lift(f) {
        return f;
      },
      Subscribe: function Subscribe(es) {
        return go( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
          var sid, emitter, unsubscribe, _yield$ref$read, subscriptions;
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return fresh(SubscriptionId, ref);
                case 2:
                  sid = _context3.sent;
                  emitter = es();
                  _context3.next = 6;
                  return Future.attempt(function () {
                    return emitter.subscribe(dispatch);
                  });
                case 6:
                  unsubscribe = _context3.sent;
                  _context3.next = 9;
                  return ref.read();
                case 9:
                  _yield$ref$read = _context3.sent;
                  subscriptions = _yield$ref$read.subscriptions;
                  _context3.next = 13;
                  return subscriptions.modify(ramda.assoc(sid, unsubscribe));
                case 13:
                  return _context3.abrupt("return", Future.of(sid));
                case 14:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));
      },
      Unsubscribe: function Unsubscribe(sid) {
        return go( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
          var _yield$ref$read2, subscriptions, s;
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return ref.read();
                case 2:
                  _yield$ref$read2 = _context4.sent;
                  subscriptions = _yield$ref$read2.subscriptions;
                  _context4.next = 6;
                  return subscriptions.read();
                case 6:
                  s = _context4.sent;
                  _context4.next = 9;
                  return Future.attempt(function () {
                    return s[sid]();
                  });
                case 9:
                  _context4.next = 11;
                  return subscriptions.modify(ramda.dissoc(sid));
                case 11:
                  return _context4.abrupt("return", Future.of(''));
                case 12:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));
      },
      Raise: function Raise(action) {
        return Future.attempt(function () {
          return onRaised(action);
        });
      },
      Fork: function Fork(m) {
        return Future.attempt(function () {
          return forkM({
            setState: setState,
            dispatch: dispatch,
            onRaised: onRaised,
            childrenComponents: childrenComponents,
            interpreters: interpreters,
            store: store,
            navigator: navigator,
            ref: ref
          })(m);
        });
      },
      ChildQuery: function ChildQuery(type, id, query) {
        return Future.attempt(function () {
          return childrenComponents.current[type][id].current.evalWithContext(HalogenQ.Query(query));
        });
      },
      GetStore: function GetStore() {
        return Future.attempt(function () {
          return store;
        });
      },
      GetNavigator: function GetNavigator() {
        return Future.attempt(function () {
          return navigator;
        });
      },
      Navigate: function Navigate(route) {
        return Future.attempt(function () {
          return navigator.pushState(print(routeCodec, route));
        });
      }
    });
  };
};
var forkM = function forkM(env) {
  return function (m) {
    return m.foldMap(interpret(env), Future.resolve).fork(console.error, ramda.identity);
  };
};
var mkEval = function mkEval(_ref2) {
  var handleAction = _ref2.handleAction,
    initialize = _ref2.initialize,
    receive = _ref2.receive,
    handleQuery = _ref2.handleQuery;
  return function (q) {
    return q.cata({
      Initialize: function Initialize() {
        return initialize ? handleAction(initialize) : Free.of(unit);
      },
      Receive: function Receive(input) {
        return receive && receive(input) ? handleAction(receive(input)) : Free.of(unit);
      },
      Action: handleAction,
      Query: function Query(q) {
        return handleQuery(q);
      }
    });
  };
};
var Link = function Link(_ref3) {
  var href = _ref3.href,
    children = _ref3.children,
    content = _ref3.content,
    rest = _objectWithoutProperties(_ref3, _excluded);
  var _useContext = React.useContext(HaloContext),
    pushState = _useContext.navigator.pushState;
  var handleClick = function handleClick(e) {
    e.preventDefault();
    pushState(href);
  };
  return /*#__PURE__*/React__default["default"].createElement("a", _extends({
    href: href,
    onClick: handleClick
  }, rest), content || children);
};
var initDriverState = function initDriverState() {
  var selfRef = Ref({});
  var fresh = Ref(1);
  var subscriptions = Ref({});
  var forks = Ref({});
  selfRef.value = {
    selfRef: selfRef,
    fresh: fresh,
    subscriptions: subscriptions,
    forks: forks
  };
  return selfRef;
};
var mkComponent = function mkComponent(_ref4) {
  var evalFn = _ref4.evalFn,
    actionType = _ref4.actionType,
    _ref4$initialState = _ref4.initialState,
    initialState = _ref4$initialState === void 0 ? ramda.identity : _ref4$initialState;
  return function (Component) {
    var HaloComponent = function HaloComponent(props) {
      var initialStateInt = React.useMemo(function () {
        return initialState(props);
      }, []);
      var _useState = React.useState(initialStateInt),
        _useState2 = _slicedToArray(_useState, 2);
        _useState2[0];
        var sV = _useState2[1];
      var sRef = React.useRef(initialStateInt);
      var setState = React.useCallback(function (fn) {
        sRef.current = fn(sRef.current);
        sV(sRef.current);
        return sRef.current;
      }, []);
      var _useState3 = React.useState({}),
        _useState4 = _slicedToArray(_useState3, 2);
        _useState4[0];
        var setChildrenComponentsInt = _useState4[1];
      var childrenComponentsRef = React.useRef({});
      var setChildrenComponents = React.useCallback(function (fn) {
        childrenComponentsRef.current = fn(childrenComponentsRef.current);
        setChildrenComponentsInt(childrenComponentsRef.current);
        return childrenComponentsRef.current;
      }, []);
      var _useContext2 = React.useContext(HaloContext),
        onRaised = _useContext2.raise,
        registerChild = _useContext2.registerChild,
        store = _useContext2.store,
        interpreters = _useContext2.interpreters,
        navigator = _useContext2.navigator,
        routeCodec = _useContext2.routeCodec;
      var ref = React.useMemo(function () {
        return initDriverState();
      }, []);
      var evalWithContext = React.useCallback(function (m) {
        return forkM({
          setState: setState,
          dispatch: dispatch,
          onRaised: onRaised,
          store: store,
          interpreters: interpreters,
          navigator: navigator,
          routeCodec: routeCodec,
          ref: ref,
          childrenComponents: childrenComponentsRef
        })(evalFn(m));
      }, []);
      var selfRef = React.useRef({
        evalFn: evalFn,
        evalWithContext: evalWithContext
      });
      React.useEffect(function () {
        registerChild(selfRef);
      }, []);
      var dispatch = React.useCallback(function (action) {
        evalWithContext(HalogenQ.Action(action));
      }, []);
      useEqualsEffect(function () {
        evalWithContext(HalogenQ.Receive(props));
      }, [props]);
      React.useEffect(function () {
        evalWithContext(HalogenQ.Initialize);
      }, []);
      var boundActions = React.useMemo(function () {
        return ramda.pipe(ramda.map(function (t) {
          return [t, function () {
            return dispatch(typeof actionType[t] === 'function' ? actionType[t].apply(actionType, arguments) : actionType[t]);
          }];
        }), ramda.fromPairs)(actionType['@@tags']);
      }, [actionType]);
      var Slot = React.useMemo(function () {
        return function (_ref5) {
          var component = _ref5.component,
            output = _ref5.output,
            slotType = _ref5.slotType,
            slotId = _ref5.slotId,
            rest = _objectWithoutProperties(_ref5, _excluded2);
          return /*#__PURE__*/React__default["default"].createElement(HaloContext.Provider, {
            value: {
              store: store,
              interpreters: interpreters,
              raise: function raise(x) {
                return dispatch(output(x));
              },
              navigator: navigator,
              routeCodec: routeCodec,
              registerChild: function registerChild(c) {
                return setChildrenComponents(ramda.assocPath([slotType, slotId], c));
              }
            }
          }, /*#__PURE__*/React.createElement(component, rest));
        };
      }, []);
      var bound = _objectSpread2(_objectSpread2({
        dispatch: dispatch
      }, boundActions), {}, {
        Slot: Slot
      });
      return /*#__PURE__*/React__default["default"].createElement(Component, _extends({}, bound, sRef.current));
    };
    HaloComponent.evalFn = evalFn;
    HaloComponent.render = Component;
    return HaloComponent;
  };
};
var ConnectAction = taggedSum('ConnectAction', {
  Initialize: [],
  Receive: ['input'],
  Update: ['context'],
  Raise: ['output']
});
var connect = function connect(selector) {
  return function (Component) {
    return mkComponent({
      initialState: function initialState(input) {
        return {
          context: Maybe.Nothing,
          input: input
        };
      },
      actionType: ConnectAction,
      evalFn: mkEval({
        initialize: ConnectAction.Initialize,
        receive: ConnectAction.Receive,
        handleAction: function handleAction(a) {
          return a.cata({
            Initialize: function Initialize() {
              return go( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
                var store;
                return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return H.getStore();
                      case 2:
                        store = _context5.sent;
                        _context5.next = 5;
                        return H.modify(ramda.assoc('context', Maybe.Just(store.getState())));
                      case 5:
                        return _context5.abrupt("return", H.subscribe(store.emitter.map(ConnectAction.Update)));
                      case 6:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));
            },
            Receive: function Receive(input) {
              return H.modify(ramda.assoc('input', input));
            },
            Update: function Update(state) {
              return H.modify(ramda.assoc('context', Maybe.Just(state)));
            },
            Raise: function Raise() {
              return 'd';
            }
          });
        }
      })
    })(function (props) {
      return props.context.cata({
        Nothing: function Nothing() {
          return '';
        },
        Just: function Just(context) {
          return /*#__PURE__*/React__default["default"].createElement(Component, _extends({}, context, props.input));
        }
      });
    });
  };
};
var createStore = function createStore(reducer, initialState) {
  var state = initialState;
  return createSub['map'](function (_ref6) {
    var emitter = _ref6.emitter,
      listener = _ref6.listener;
    return {
      getState: function getState() {
        return state;
      },
      dispatch: function dispatch(action) {
        return Future.attempt(function () {
          state = reducer(action, state);
          listener(state);
        });
      },
      emitter: emitter
    };
  });
};
var createNavigator = createSub.map(function (_ref7) {
  var emitter = _ref7.emitter,
    listener = _ref7.listener;
  var pushState = function pushState(url) {
    listener(url);
    window.history.pushState({}, '', url);
  };
  return {
    emitter: emitter,
    pushState: pushState
  };
});
var createHaloProvider = function createHaloProvider(_ref8) {
  var initialState = _ref8.initialState,
    reducer = _ref8.reducer,
    _ref8$interpreters = _ref8.interpreters,
    interpreters = _ref8$interpreters === void 0 ? [] : _ref8$interpreters,
    routeCodec = _ref8.routeCodec;
  return go( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    var _yield$createNavigato, pushState, emitter;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return createNavigator;
          case 2:
            _yield$createNavigato = _context6.sent;
            pushState = _yield$createNavigato.pushState;
            emitter = _yield$createNavigato.emitter;
            console.log('emitter', emitter);
            return _context6.abrupt("return", createStore(reducer, initialState).map(function (store) {
              return function (_ref9) {
                var children = _ref9.children;
                var data = {
                  store: store,
                  interpreters: interpreters,
                  raise: function raise(action) {},
                  registerChild: function registerChild(x) {},
                  navigator: {
                    pushState: pushState,
                    emitter: emitter
                  },
                  routeCodec: routeCodec
                };
                return /*#__PURE__*/React__default["default"].createElement(HaloContext.Provider, {
                  value: data
                }, children);
              };
            }));
          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
};
var HaloProvider = function HaloProvider(_ref10) {
  var navigator = _ref10.navigator,
    store = _ref10.store,
    _ref10$interpreters = _ref10.interpreters,
    interpreters = _ref10$interpreters === void 0 ? [] : _ref10$interpreters,
    routeCodec = _ref10.routeCodec,
    children = _ref10.children;
  var data = {
    store: store,
    interpreters: interpreters,
    raise: function raise(action) {},
    registerChild: function registerChild(x) {},
    navigator: navigator,
    routeCodec: routeCodec
  };
  return /*#__PURE__*/React__default["default"].createElement(HaloContext.Provider, {
    value: data
  }, children);
};

exports.Emitter = Emitter;
exports.H = H;
exports.HaloContext = HaloContext;
exports.HaloProvider = HaloProvider;
exports.HalogenQ = HalogenQ;
exports.Link = Link;
exports.connect = connect;
exports.createHaloProvider = createHaloProvider;
exports.createNavigator = createNavigator;
exports.createStore = createStore;
exports.createSub = createSub;
exports.mkComponent = mkComponent;
exports.mkEval = mkEval;
exports.tagged = tagged;
exports.taggedSum = taggedSum;
