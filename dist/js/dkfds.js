(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DKFDS = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * array-foreach
 *   Array#forEach ponyfill for older browsers
 *   (Ponyfill: A polyfill that doesn't overwrite the native method)
 * 
 * https://github.com/twada/array-foreach
 *
 * Copyright (c) 2015-2016 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/array-foreach/blob/master/MIT-LICENSE
 */
'use strict';

module.exports = function forEach(ary, callback, thisArg) {
    if (ary.forEach) {
        ary.forEach(callback, thisArg);
        return;
    }
    for (var i = 0; i < ary.length; i += 1) {
        callback.call(thisArg, ary[i], i, ary);
    }
};

},{}],2:[function(require,module,exports){
"use strict";

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in window.self) {

	// Full polyfill for browsers with no classList support
	// Including IE < Edge missing SVGElement.classList
	if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

		(function (view) {

			"use strict";

			if (!('Element' in view)) return;

			var classListProp = "classList",
			    protoProp = "prototype",
			    elemCtrProto = view.Element[protoProp],
			    objCtr = Object,
			    strTrim = String[protoProp].trim || function () {
				return this.replace(/^\s+|\s+$/g, "");
			},
			    arrIndexOf = Array[protoProp].indexOf || function (item) {
				var i = 0,
				    len = this.length;
				for (; i < len; i++) {
					if (i in this && this[i] === item) {
						return i;
					}
				}
				return -1;
			}
			// Vendors: please allow content code to instantiate DOMExceptions
			,
			    DOMEx = function DOMEx(type, message) {
				this.name = type;
				this.code = DOMException[type];
				this.message = message;
			},
			    checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
				if (token === "") {
					throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
				}
				if (/\s/.test(token)) {
					throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
				}
				return arrIndexOf.call(classList, token);
			},
			    ClassList = function ClassList(elem) {
				var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
				    classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
				    i = 0,
				    len = classes.length;
				for (; i < len; i++) {
					this.push(classes[i]);
				}
				this._updateClassName = function () {
					elem.setAttribute("class", this.toString());
				};
			},
			    classListProto = ClassList[protoProp] = [],
			    classListGetter = function classListGetter() {
				return new ClassList(this);
			};
			// Most DOMException implementations don't allow calling DOMException's toString()
			// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[protoProp] = Error[protoProp];
			classListProto.item = function (i) {
				return this[i] || null;
			};
			classListProto.contains = function (token) {
				token += "";
				return checkTokenAndGetIndex(this, token) !== -1;
			};
			classListProto.add = function () {
				var tokens = arguments,
				    i = 0,
				    l = tokens.length,
				    token,
				    updated = false;
				do {
					token = tokens[i] + "";
					if (checkTokenAndGetIndex(this, token) === -1) {
						this.push(token);
						updated = true;
					}
				} while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.remove = function () {
				var tokens = arguments,
				    i = 0,
				    l = tokens.length,
				    token,
				    updated = false,
				    index;
				do {
					token = tokens[i] + "";
					index = checkTokenAndGetIndex(this, token);
					while (index !== -1) {
						this.splice(index, 1);
						updated = true;
						index = checkTokenAndGetIndex(this, token);
					}
				} while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.toggle = function (token, force) {
				token += "";

				var result = this.contains(token),
				    method = result ? force !== true && "remove" : force !== false && "add";

				if (method) {
					this[method](token);
				}

				if (force === true || force === false) {
					return force;
				} else {
					return !result;
				}
			};
			classListProto.toString = function () {
				return this.join(" ");
			};

			if (objCtr.defineProperty) {
				var classListPropDesc = {
					get: classListGetter,
					enumerable: true,
					configurable: true
				};
				try {
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				} catch (ex) {
					// IE 8 doesn't support enumerable:true
					// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
					// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
					if (ex.number === undefined || ex.number === -0x7FF5EC54) {
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					}
				}
			} else if (objCtr[protoProp].__defineGetter__) {
				elemCtrProto.__defineGetter__(classListProp, classListGetter);
			}
		})(window.self);
	}

	// There is full or partial native classList support, so just check if we need
	// to normalize the add/remove and toggle APIs.

	(function () {
		"use strict";

		var testElement = document.createElement("_");

		testElement.classList.add("c1", "c2");

		// Polyfill for IE 10/11 and Firefox <26, where classList.add and
		// classList.remove exist but support only one argument at a time.
		if (!testElement.classList.contains("c2")) {
			var createMethod = function createMethod(method) {
				var original = DOMTokenList.prototype[method];

				DOMTokenList.prototype[method] = function (token) {
					var i,
					    len = arguments.length;

					for (i = 0; i < len; i++) {
						token = arguments[i];
						original.call(this, token);
					}
				};
			};
			createMethod('add');
			createMethod('remove');
		}

		testElement.classList.toggle("c3", false);

		// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
		// support the second argument.
		if (testElement.classList.contains("c3")) {
			var _toggle = DOMTokenList.prototype.toggle;

			DOMTokenList.prototype.toggle = function (token, force) {
				if (1 in arguments && !this.contains(token) === !force) {
					return force;
				} else {
					return _toggle.call(this, token);
				}
			};
		}

		testElement = null;
	})();
}

},{}],3:[function(require,module,exports){
'use strict';

require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":10,"../../modules/es6.array.from":57,"../../modules/es6.string.iterator":59}],4:[function(require,module,exports){
'use strict';

require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":10,"../../modules/es6.object.assign":58}],5:[function(require,module,exports){
'use strict';

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],6:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":26}],7:[function(require,module,exports){
'use strict';

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":48,"./_to-iobject":50,"./_to-length":51}],8:[function(require,module,exports){
'use strict';

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? cof(O)
  // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":9,"./_wks":55}],9:[function(require,module,exports){
"use strict";

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],10:[function(require,module,exports){
'use strict';

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],11:[function(require,module,exports){
'use strict';

var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

},{"./_object-dp":35,"./_property-desc":42}],12:[function(require,module,exports){
'use strict';

// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":5}],13:[function(require,module,exports){
"use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],14:[function(require,module,exports){
'use strict';

// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_fails":18}],15:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":19,"./_is-object":26}],16:[function(require,module,exports){
'use strict';

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],17:[function(require,module,exports){
'use strict';

var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":10,"./_ctx":12,"./_global":19,"./_hide":21,"./_redefine":43}],18:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],19:[function(require,module,exports){
'use strict';

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
// eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],20:[function(require,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],21:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":14,"./_object-dp":35,"./_property-desc":42}],22:[function(require,module,exports){
'use strict';

var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":19}],23:[function(require,module,exports){
'use strict';

module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_descriptors":14,"./_dom-create":15,"./_fails":18}],24:[function(require,module,exports){
'use strict';

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":9}],25:[function(require,module,exports){
'use strict';

// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":31,"./_wks":55}],26:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

},{}],27:[function(require,module,exports){
'use strict';

// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":6}],28:[function(require,module,exports){
'use strict';

var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () {
  return this;
});

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":21,"./_object-create":34,"./_property-desc":42,"./_set-to-string-tag":44,"./_wks":55}],29:[function(require,module,exports){
'use strict';

var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function returnThis() {
  return this;
};

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":17,"./_hide":21,"./_iter-create":28,"./_iterators":31,"./_library":32,"./_object-gpo":38,"./_redefine":43,"./_set-to-string-tag":44,"./_wks":55}],30:[function(require,module,exports){
'use strict';

var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () {
      return { done: safe = true };
    };
    arr[ITERATOR] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

},{"./_wks":55}],31:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],32:[function(require,module,exports){
"use strict";

module.exports = false;

},{}],33:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)

var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    }
  }return T;
} : $assign;

},{"./_fails":18,"./_iobject":24,"./_object-gops":37,"./_object-keys":40,"./_object-pie":41,"./_to-object":52}],34:[function(require,module,exports){
'use strict';

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function Empty() {/* empty */};
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) {
    delete _createDict[PROTOTYPE][enumBugKeys[i]];
  }return _createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":6,"./_dom-create":15,"./_enum-bug-keys":16,"./_html":22,"./_object-dps":36,"./_shared-key":45}],35:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_ie8-dom-define":23,"./_to-primitive":53}],36:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) {
    dP.f(O, P = keys[i++], Properties[P]);
  }return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_object-dp":35,"./_object-keys":40}],37:[function(require,module,exports){
"use strict";

exports.f = Object.getOwnPropertySymbols;

},{}],38:[function(require,module,exports){
'use strict';

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};

},{"./_has":20,"./_shared-key":45,"./_to-object":52}],39:[function(require,module,exports){
'use strict';

var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) {
    if (key != IE_PROTO) has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};

},{"./_array-includes":7,"./_has":20,"./_shared-key":45,"./_to-iobject":50}],40:[function(require,module,exports){
'use strict';

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":16,"./_object-keys-internal":39}],41:[function(require,module,exports){
"use strict";

exports.f = {}.propertyIsEnumerable;

},{}],42:[function(require,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],43:[function(require,module,exports){
'use strict';

var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":10,"./_global":19,"./_has":20,"./_hide":21,"./_uid":54}],44:[function(require,module,exports){
'use strict';

var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":20,"./_object-dp":35,"./_wks":55}],45:[function(require,module,exports){
'use strict';

var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":46,"./_uid":54}],46:[function(require,module,exports){
'use strict';

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":10,"./_global":19,"./_library":32}],47:[function(require,module,exports){
'use strict';

var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":13,"./_to-integer":49}],48:[function(require,module,exports){
'use strict';

var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":49}],49:[function(require,module,exports){
"use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],50:[function(require,module,exports){
'use strict';

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":13,"./_iobject":24}],51:[function(require,module,exports){
'use strict';

// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":49}],52:[function(require,module,exports){
'use strict';

// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":13}],53:[function(require,module,exports){
'use strict';

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":26}],54:[function(require,module,exports){
'use strict';

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],55:[function(require,module,exports){
'use strict';

var store = require('./_shared')('wks');
var uid = require('./_uid');
var _Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":19,"./_shared":46,"./_uid":54}],56:[function(require,module,exports){
'use strict';

var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":8,"./_core":10,"./_iterators":31,"./_wks":55}],57:[function(require,module,exports){
'use strict';

var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) {
  Array.from(iter);
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":11,"./_ctx":12,"./_export":17,"./_is-array-iter":25,"./_iter-call":27,"./_iter-detect":30,"./_to-length":51,"./_to-object":52,"./core.get-iterator-method":56}],58:[function(require,module,exports){
'use strict';

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":17,"./_object-assign":33}],59:[function(require,module,exports){
'use strict';

var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":29,"./_string-at":47}],60:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition();else if (typeof define == 'function' && _typeof(define.amd) == 'object') define(definition);else this[name] = definition();
}('domready', function () {

  var fns = [],
      _listener,
      doc = document,
      hack = doc.documentElement.doScroll,
      domContentLoaded = 'DOMContentLoaded',
      loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);

  if (!loaded) doc.addEventListener(domContentLoaded, _listener = function listener() {
    doc.removeEventListener(domContentLoaded, _listener);
    loaded = 1;
    while (_listener = fns.shift()) {
      _listener();
    }
  });

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn);
  };
});

},{}],61:[function(require,module,exports){
'use strict';

// element-closest | CC0-1.0 | github.com/jonathantneal/closest

(function (ElementProto) {
	if (typeof ElementProto.matches !== 'function') {
		ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
			var element = this;
			var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
			var index = 0;

			while (elements[index] && elements[index] !== element) {
				++index;
			}

			return Boolean(elements[index]);
		};
	}

	if (typeof ElementProto.closest !== 'function') {
		ElementProto.closest = function closest(selector) {
			var element = this;

			while (element && element.nodeType === 1) {
				if (element.matches(selector)) {
					return element;
				}

				element = element.parentNode;
			}

			return null;
		};
	}
})(window.Element.prototype);

},{}],62:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],63:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var assign = require('object-assign');
var delegate = require('../delegate');
var delegateAll = require('../delegateAll');

var DELEGATE_PATTERN = /^(.+):delegate\((.+)\)$/;
var SPACE = ' ';

var getListeners = function getListeners(type, handler) {
  var match = type.match(DELEGATE_PATTERN);
  var selector;
  if (match) {
    type = match[1];
    selector = match[2];
  }

  var options;
  if ((typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object') {
    options = {
      capture: popKey(handler, 'capture'),
      passive: popKey(handler, 'passive')
    };
  }

  var listener = {
    selector: selector,
    delegate: (typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object' ? delegateAll(handler) : selector ? delegate(selector, handler) : handler,
    options: options
  };

  if (type.indexOf(SPACE) > -1) {
    return type.split(SPACE).map(function (_type) {
      return assign({ type: _type }, listener);
    });
  } else {
    listener.type = type;
    return [listener];
  }
};

var popKey = function popKey(obj, key) {
  var value = obj[key];
  delete obj[key];
  return value;
};

module.exports = function behavior(events, props) {
  var listeners = Object.keys(events).reduce(function (memo, type) {
    var listeners = getListeners(type, events[type]);
    return memo.concat(listeners);
  }, []);

  return assign({
    add: function addBehavior(element) {
      listeners.forEach(function (listener) {
        element.addEventListener(listener.type, listener.delegate, listener.options);
      });
    },
    remove: function removeBehavior(element) {
      listeners.forEach(function (listener) {
        element.removeEventListener(listener.type, listener.delegate, listener.options);
      });
    }
  }, props);
};

},{"../delegate":66,"../delegateAll":65,"object-assign":62}],64:[function(require,module,exports){
"use strict";

module.exports = function compose(functions) {
  return function (e) {
    return functions.some(function (fn) {
      return fn.call(this, e) === false;
    }, this);
  };
};

},{}],65:[function(require,module,exports){
'use strict';

var delegate = require('../delegate');
var compose = require('../compose');

var SPLAT = '*';

module.exports = function delegateAll(selectors) {
  var keys = Object.keys(selectors);

  // XXX optimization: if there is only one handler and it applies to
  // all elements (the "*" CSS selector), then just return that
  // handler
  if (keys.length === 1 && keys[0] === SPLAT) {
    return selectors[SPLAT];
  }

  var delegates = keys.reduce(function (memo, selector) {
    memo.push(delegate(selector, selectors[selector]));
    return memo;
  }, []);
  return compose(delegates);
};

},{"../compose":64,"../delegate":66}],66:[function(require,module,exports){
'use strict';

// polyfill Element.prototype.closest
require('element-closest');

module.exports = function delegate(selector, fn) {
  return function delegation(event) {
    var target = event.target.closest(selector);
    if (target) {
      return fn.call(target, event);
    }
  };
};

},{"element-closest":61}],67:[function(require,module,exports){
"use strict";

module.exports = function once(listener, options) {
  var wrapped = function wrappedOnce(e) {
    e.currentTarget.removeEventListener(e.type, wrapped, options);
    return listener.call(this, e);
  };
  return wrapped;
};

},{}],68:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var toggle = require('../utils/toggle');
var isElementInViewport = require('../utils/is-in-viewport');
var BUTTON = '.accordion-button[aria-controls]';
var EXPANDED = 'aria-expanded';
var MULTISELECTABLE = 'aria-multiselectable';

var Accordion = function () {
  function Accordion(accordion) {
    _classCallCheck(this, Accordion);

    this.accordion = accordion;
    this.buttons = accordion.querySelectorAll(BUTTON);
    this.eventClose = new Event('fds.accordion.close');
    this.eventOpen = new Event('fds.accordion.open');
    this.init();
  }

  _createClass(Accordion, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var _loop = function _loop() {
        var currentButton = _this.buttons[i];

        var expanded = currentButton.getAttribute(EXPANDED) === 'true';
        _this.toggleButton(currentButton, expanded);

        var that = _this;
        currentButton.addEventListener('click', function (event) {
          that.eventOnClick(event, this);
        });
      };

      for (var i = 0; i < this.buttons.length; i++) {
        _loop();
      }
    }
  }, {
    key: 'eventOnClick',
    value: function eventOnClick(event, button) {
      event.preventDefault();
      this.toggleButton(button);
      if (button.getAttribute(EXPANDED) === 'true') {
        // We were just expanded, but if another accordion was also just
        // collapsed, we may no longer be in the viewport. This ensures
        // that we are still visible, so the user isn't confused.
        if (!isElementInViewport(button)) button.scrollIntoView();
      }
    }

    /**
     * Toggle a button's "pressed" state, optionally providing a target
     * state.
     *
     * @param {HTMLButtonElement} button
     * @param {boolean?} expanded If no state is provided, the current
     * state will be toggled (from false to true, and vice-versa).
     * @return {boolean} the resulting state
     */

  }, {
    key: 'toggleButton',
    value: function toggleButton(button, expanded) {
      if (!this.accordion) {
        throw new Error(BUTTON + ' is missing outer ACCORDION');
      }

      expanded = toggle(button, expanded);

      if (expanded) {
        button.dispatchEvent(this.eventOpen);
      } else {
        button.dispatchEvent(this.eventClose);
      }

      // XXX multiselectable is opt-in, to preserve legacy behavior
      var multiselectable = this.accordion.getAttribute(MULTISELECTABLE) === 'true';

      if (expanded && !multiselectable) {
        for (var i = 0; i < this.buttons.length; i++) {
          var currentButtton = this.buttons[i];
          if (currentButtton !== button) {
            toggle(currentButtton, false);
            currentButtton.dispatchEvent(this.eventClose);
          }
        }
      }
    }
    /**
     * @param {HTMLButtonElement} button
     * @return {boolean} true
     */

  }, {
    key: 'showButton',
    value: function showButton(button) {
      toggleButton(button, true);
    }

    /**
     * @param {HTMLButtonElement} button
     * @return {boolean} false
     */

  }, {
    key: 'hideButton',
    value: function hideButton(button) {
      toggleButton(button, false);
    }
  }]);

  return Accordion;
}();

module.exports = Accordion;

},{"../utils/is-in-viewport":86,"../utils/toggle":88}],69:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheckboxToggleContent = function () {
    function CheckboxToggleContent(el) {
        _classCallCheck(this, CheckboxToggleContent);

        this.jsToggleTrigger = '.js-checkbox-toggle-content';
        this.jsToggleTarget = 'data-js-target';
        this.eventClose = new Event('fds.collapse.close');
        this.eventOpen = new Event('fds.collapse.open');
        this.targetEl = null;
        this.checkboxEl = null;

        this.init(el);
    }

    _createClass(CheckboxToggleContent, [{
        key: 'init',
        value: function init(el) {
            this.checkboxEl = el;
            var that = this;
            this.checkboxEl.addEventListener('change', function (event) {
                that.toggle(that.checkboxEl);
            });
            this.toggle(this.checkboxEl);
        }
    }, {
        key: 'toggle',
        value: function toggle(triggerEl) {
            var targetAttr = triggerEl.getAttribute(this.jsToggleTarget);
            if (targetAttr !== null && targetAttr !== undefined) {
                var targetEl = document.querySelector(targetAttr);
                if (targetEl !== null && targetEl !== undefined) {
                    if (triggerEl.checked) {
                        this.open(triggerEl, targetEl);
                    } else {
                        this.close(triggerEl, targetEl);
                    }
                }
            }
        }
    }, {
        key: 'open',
        value: function open(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'true');
                targetEl.classList.remove('collapsed');
                targetEl.setAttribute('aria-hidden', 'false');
                triggerEl.dispatchEvent(this.eventOpen);
            }
        }
    }, {
        key: 'close',
        value: function close(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'false');
                targetEl.classList.add('collapsed');
                targetEl.setAttribute('aria-hidden', 'true');
                triggerEl.dispatchEvent(this.eventClose);
            }
        }
    }]);

    return CheckboxToggleContent;
}();

module.exports = CheckboxToggleContent;

},{}],70:[function(require,module,exports){
/**
 * Collapse/expand.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collapse = function () {
  function Collapse(element) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'toggle';

    _classCallCheck(this, Collapse);

    this.jsCollapseTarget = 'data-js-target';
    this.triggerEl = element;
    this.targetEl;
    this.animateInProgress = false;
    var that = this;
    this.eventClose = new Event('fds.collapse.close');
    this.eventOpen = new Event('fds.collapse.open');
    this.triggerEl.addEventListener('click', function () {
      that.toggle();
    });
  }

  _createClass(Collapse, [{
    key: 'toggleCollapse',
    value: function toggleCollapse(forceClose) {
      var targetAttr = this.triggerEl.getAttribute(this.jsCollapseTarget);
      if (targetAttr !== null && targetAttr !== undefined) {
        this.targetEl = document.querySelector(targetAttr);
        if (this.targetEl !== null && this.targetEl !== undefined) {
          //change state
          if (this.triggerEl.getAttribute('aria-expanded') === 'true' || this.triggerEl.getAttribute('aria-expanded') === undefined || forceClose) {
            //close
            this.animateCollapse();
          } else {
            //open
            this.animateExpand();
          }
        }
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.triggerEl !== null && this.triggerEl !== undefined) {
        this.toggleCollapse();
      }
    }
  }, {
    key: 'animateCollapse',
    value: function animateCollapse() {
      if (!this.animateInProgress) {
        this.animateInProgress = true;

        this.targetEl.style.height = this.targetEl.clientHeight + 'px';
        this.targetEl.classList.add('collapse-transition-collapse');
        var that = this;
        setTimeout(function () {
          that.targetEl.removeAttribute('style');
        }, 5);
        setTimeout(function () {
          that.targetEl.classList.add('collapsed');
          that.targetEl.classList.remove('collapse-transition-collapse');

          that.triggerEl.setAttribute('aria-expanded', 'false');
          that.targetEl.setAttribute('aria-hidden', 'true');
          that.animateInProgress = false;
          that.triggerEl.dispatchEvent(that.eventClose);
        }, 200);
      }
    }
  }, {
    key: 'animateExpand',
    value: function animateExpand() {
      if (!this.animateInProgress) {
        this.animateInProgress = true;
        this.targetEl.classList.remove('collapsed');
        var expandedHeight = this.targetEl.clientHeight;
        this.targetEl.style.height = '0px';
        this.targetEl.classList.add('collapse-transition-expand');
        var that = this;
        setTimeout(function () {
          that.targetEl.style.height = expandedHeight + 'px';
        }, 5);

        setTimeout(function () {
          that.targetEl.classList.remove('collapse-transition-expand');
          that.targetEl.removeAttribute('style');

          that.targetEl.setAttribute('aria-hidden', 'false');
          that.triggerEl.setAttribute('aria-expanded', 'true');
          that.animateInProgress = false;
          that.triggerEl.dispatchEvent(that.eventOpen);
        }, 200);
      }
    }
  }]);

  return Collapse;
}();

module.exports = Collapse;

},{}],71:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var closest = require('../utils/closest');

var Dropdown = function () {
  function Dropdown(el) {
    _classCallCheck(this, Dropdown);

    this.jsDropdownTrigger = '.js-dropdown';
    this.jsDropdownTarget = 'data-js-target';
    this.eventClose = new Event('fds.dropdown.close');
    this.eventOpen = new Event('fds.dropdown.open');

    //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
    this.navResponsiveBreakpoint = 992; //same as $nav-responsive-breakpoint from the scss.
    this.tringuideBreakpoint = 768; //same as $nav-responsive-breakpoint from the scss.
    this.jsResponsiveCollapseModifier = '.js-dropdown--responsive-collapse';
    this.responsiveCollapseEnabled = false;
    this.responsiveListCollapseEnabled = false;

    this.triggerEl = null;
    this.targetEl = null;

    this.init(el);

    if (this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
      var that = this;

      if (this.triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive')) {
        this.responsiveListCollapseEnabled = true;
      }

      //Clicked outside dropdown -> close it
      document.getElementsByTagName('body')[0].addEventListener('click', function (event) {
        that.outsideClose(event);
      });

      //Clicked on dropdown open button --> toggle it
      this.triggerEl.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation(); //prevents ouside click listener from triggering.
        that.toggleDropdown();
      });

      // set aria-hidden correctly for screenreaders (Tringuide responsive)
      if (this.responsiveListCollapseEnabled) {
        var element = this.triggerEl;
        if (window.IntersectionObserver) {
          // trigger event when button changes visibility
          var observer = new IntersectionObserver(function (entries) {
            // button is visible
            if (entries[0].intersectionRatio) {
              if (element.getAttribute('aria-expanded') === 'false') {
                that.targetEl.setAttribute('aria-hidden', true);
              }
            } else {
              // button is not visible
              if (that.targetEl.getAttribute('aria-hidden') === 'true') {
                that.targetEl.setAttribute('aria-hidden', false);
              }
            }
          }, {
            root: document.body
          });
          observer.observe(element);
        } else {
          // IE: IntersectionObserver is not supported, so we listen for window resize and grid breakpoint instead
          if (that.doResponsiveStepguideCollapse()) {
            // small screen
            if (element.getAttribute('aria-expanded') === 'false') {
              that.targetEl.setAttribute('aria-hidden', true);
            } else {
              that.targetEl.setAttribute('aria-hidden', false);
            }
          } else {
            // Large screen
            that.targetEl.setAttribute('aria-hidden', false);
          }
          window.addEventListener('resize', function () {
            if (that.doResponsiveStepguideCollapse()) {
              if (element.getAttribute('aria-expanded') === 'false') {
                that.targetEl.setAttribute('aria-hidden', true);
              } else {
                that.targetEl.setAttribute('aria-hidden', false);
              }
            } else {
              that.targetEl.setAttribute('aria-hidden', false);
            }
          });
        }
      }

      document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27) {
          that.closeAll();
        }
      };
    }
  }

  _createClass(Dropdown, [{
    key: 'init',
    value: function init(el) {
      this.triggerEl = el;
      if (this.triggerEl !== null && this.triggerEl !== undefined) {
        var targetAttr = this.triggerEl.getAttribute(this.jsDropdownTarget);
        if (targetAttr !== null && targetAttr !== undefined) {
          var targetEl = document.getElementById(targetAttr.replace('#', ''));
          if (targetEl !== null && targetEl !== undefined) {
            this.targetEl = targetEl;
          }
        }
      }

      if (this.triggerEl.classList.contains('js-dropdown--responsive-collapse')) {
        this.responsiveCollapseEnabled = true;
      }

      if (this.triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive')) {
        this.responsiveListCollapseEnabled = true;
      }
    }
  }, {
    key: 'closeAll',
    value: function closeAll() {
      var body = document.querySelector('body');

      var overflowMenuEl = document.getElementsByClassName('overflow-menu');
      var triggerEl = null;
      var targetEl = null;
      for (var oi = 0; oi < overflowMenuEl.length; oi++) {
        var currentOverflowMenuEL = overflowMenuEl[oi];
        for (var a = 0; a < currentOverflowMenuEL.childNodes.length; a++) {
          if (currentOverflowMenuEL.childNodes[a].tagName !== undefined) {
            if (currentOverflowMenuEL.childNodes[a].classList.contains('js-dropdown')) {
              triggerEl = currentOverflowMenuEL.childNodes[a];
            } else if (currentOverflowMenuEL.childNodes[a].classList.contains('overflow-menu-inner')) {
              targetEl = currentOverflowMenuEL.childNodes[a];
            }
          }
        }
        if (targetEl !== null && triggerEl !== null) {
          if (body.classList.contains('mobile_nav-active')) {
            if (!currentOverflowMenuEL.closest('.navbar')) {

              if (triggerEl.getAttribute('aria-expanded') === true) {
                triggerEl.dispatchEvent(this.eventClose);
              }
              triggerEl.setAttribute('aria-expanded', 'false');
              targetEl.classList.add('collapsed');
              targetEl.setAttribute('aria-hidden', 'true');
            }
          } else {
            if (triggerEl.getAttribute('aria-expanded') === true) {
              triggerEl.dispatchEvent(this.eventClose);
            }
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');
            targetEl.setAttribute('aria-hidden', 'true');
          }
        }
      }
    }
  }, {
    key: 'toggleDropdown',
    value: function toggleDropdown(forceClose) {
      if (this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
        //change state

        this.targetEl.style.left = null;
        this.targetEl.style.right = null;

        var rect = this.triggerEl.getBoundingClientRect();
        if (this.triggerEl.getAttribute('aria-expanded') === 'true' || forceClose) {
          //close
          this.triggerEl.setAttribute('aria-expanded', 'false');
          this.targetEl.classList.add('collapsed');
          this.targetEl.setAttribute('aria-hidden', 'true');
          this.triggerEl.dispatchEvent(this.eventClose);
        } else {
          this.closeAll();
          //open
          this.triggerEl.setAttribute('aria-expanded', 'true');
          this.targetEl.classList.remove('collapsed');
          this.targetEl.setAttribute('aria-hidden', 'false');
          this.triggerEl.dispatchEvent(this.eventOpen);
          var offset = this.offset(this.targetEl);

          if (offset.left < 0) {
            this.targetEl.style.left = '0px';
            this.targetEl.style.right = 'auto';
          }
          var right = offset.left + this.targetEl.offsetWidth;
          if (right > window.innerWidth) {
            this.targetEl.style.left = 'auto';
            this.targetEl.style.right = '0px';
          }

          var offsetAgain = this.offset(this.targetEl);

          if (offsetAgain.left < 0) {

            this.targetEl.style.left = '0px';
            this.targetEl.style.right = 'auto';
          }
          right = offsetAgain.left + this.targetEl.offsetWidth;
          if (right > window.innerWidth) {

            this.targetEl.style.left = 'auto';
            this.targetEl.style.right = '0px';
          }
        }
      }
    }
  }, {
    key: 'offset',
    value: function offset(el) {
      var rect = el.getBoundingClientRect(),
          scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    }
  }, {
    key: 'outsideClose',
    value: function outsideClose(event) {
      if (!this.doResponsiveCollapse()) {
        //closes dropdown when clicked outside.
        var dropdownElm = closest(event.target, this.targetEl.id);
        if ((dropdownElm === null || dropdownElm === undefined) && event.target !== this.triggerEl) {
          //clicked outside trigger, force close
          this.toggleDropdown(true);
        }
      }
    }
  }, {
    key: 'doResponsiveCollapse',
    value: function doResponsiveCollapse() {
      //returns true if responsive collapse is enabled and we are on a small screen.
      if ((this.responsiveCollapseEnabled || this.responsiveListCollapseEnabled) && window.innerWidth <= this.navResponsiveBreakpoint) {
        return true;
      }
      return false;
    }
  }, {
    key: 'doResponsiveStepguideCollapse',
    value: function doResponsiveStepguideCollapse() {
      //returns true if responsive collapse is enabled and we are on a small screen.
      if (this.responsiveListCollapseEnabled && window.innerWidth <= this.tringuideBreakpoint) {
        return true;
      }
      return false;
    }
  }]);

  return Dropdown;
}();

module.exports = Dropdown;

},{"../utils/closest":85}],72:[function(require,module,exports){
'use strict';

module.exports = {
  navigation: require('./navigation'),
  skipnav: require('./skipnav'),
  regexmask: require('./regex-input-mask')
};

},{"./navigation":73,"./regex-input-mask":75,"./skipnav":76}],73:[function(require,module,exports){
'use strict';

var _CLICK;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var behavior = require('../utils/behavior');
var forEach = require('array-foreach');
var select = require('../utils/select');
var accordion = require('./accordion');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;

var NAV = '.nav';
var NAV_LINKS = NAV + ' a';
var OPENERS = '.js-menu-open';
var CLOSE_BUTTON = '.js-menu-close';
var OVERLAY = '.overlay';
var CLOSERS = CLOSE_BUTTON + ', .overlay';
var TOGGLES = [NAV, OVERLAY].join(', ');

var ACTIVE_CLASS = 'mobile_nav-active';
var VISIBLE_CLASS = 'is-visible';

var isActive = function isActive() {
  return document.body.classList.contains(ACTIVE_CLASS);
};

var _focusTrap = function _focusTrap(trapContainer) {
  // Find all focusable children
  var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  var focusableElements = trapContainer.querySelectorAll(focusableElementsString);
  var firstTabStop = focusableElements[0];
  var lastTabStop = focusableElements[focusableElements.length - 1];

  function trapTabKey(e) {
    // Check for TAB key press
    if (e.keyCode === 9) {

      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }

        // TAB
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    // ESCAPE
    if (e.keyCode === 27) {
      toggleNav.call(this, false);
    }
  }

  // Focus first child
  firstTabStop.focus();

  return {
    enable: function enable() {
      // Listen for and trap the keyboard
      trapContainer.addEventListener('keydown', trapTabKey);
    },
    release: function release() {
      trapContainer.removeEventListener('keydown', trapTabKey);
    }
  };
};

var focusTrap = void 0;

var toggleNav = function toggleNav(active) {
  var body = document.body;
  if (typeof active !== 'boolean') {
    active = !isActive();
  }
  body.classList.toggle(ACTIVE_CLASS, active);

  forEach(select(TOGGLES), function (el) {
    el.classList.toggle(VISIBLE_CLASS, active);
  });

  if (active) {
    focusTrap.enable();
  } else {
    focusTrap.release();
  }

  var closeButton = body.querySelector(CLOSE_BUTTON);
  var menuButton = body.querySelector(OPENERS);

  if (active && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (!active && document.activeElement === closeButton && menuButton) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }

  return active;
};

var resize = function resize() {
  var closer = document.body.querySelector(CLOSE_BUTTON);

  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // The mobile nav is active, but the close box isn't visible, which
    // means the user's viewport has been resized so that it is no longer
    // in mobile mode. Let's make the page state consistent by
    // deactivating the mobile nav.
    toggleNav.call(closer, false);
  }
};

var navigation = behavior(_defineProperty({}, CLICK, (_CLICK = {}, _defineProperty(_CLICK, OPENERS, toggleNav), _defineProperty(_CLICK, CLOSERS, toggleNav), _defineProperty(_CLICK, NAV_LINKS, function () {
  // A navigation link has been clicked! We want to collapse any
  // hierarchical navigation UI it's a part of, so that the user
  // can focus on whatever they've just selected.

  // Some navigation links are inside accordions; when they're
  // clicked, we want to collapse those accordions.
  var acc = this.closest(accordion.ACCORDION);
  if (acc) {
    accordion.getButtons(acc).forEach(function (btn) {
      return accordion.hide(btn);
    });
  }

  // If the mobile navigation menu is active, we want to hide it.
  if (isActive()) {
    toggleNav.call(this, false);
  }
}), _CLICK)), {
  init: function init() {
    var trapContainer = document.querySelector(NAV);

    if (trapContainer) {
      focusTrap = _focusTrap(trapContainer);
    }

    resize();
    window.addEventListener('resize', resize, false);
  },
  teardown: function teardown() {
    window.removeEventListener('resize', resize, false);
  }
});

/**
 * TODO for 2.0, remove this statement and export `navigation` directly:
 *
 * module.exports = behavior({...});
 */
var assign = require('object-assign');
module.exports = assign(function (el) {
  return navigation.on(el);
}, navigation);

},{"../config":79,"../events":81,"../utils/behavior":84,"../utils/select":87,"./accordion":68,"array-foreach":1,"object-assign":62}],74:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RadioToggleGroup = function () {
    function RadioToggleGroup(el) {
        _classCallCheck(this, RadioToggleGroup);

        this.jsToggleTrigger = '.js-radio-toggle-group';
        this.jsToggleTarget = 'data-js-target';
        this.eventClose = new Event('fds.collapse.close');
        this.eventOpen = new Event('fds.collapse.open');
        this.radioEls = null;
        this.targetEl = null;

        this.init(el);
    }

    _createClass(RadioToggleGroup, [{
        key: 'init',
        value: function init(el) {
            this.radioGroup = el;
            this.radioEls = this.radioGroup.querySelectorAll('input[type="radio"]');
            var that = this;

            for (var i = 0; i < this.radioEls.length; i++) {
                var radio = this.radioEls[i];
                radio.addEventListener('change', function () {
                    for (var a = 0; a < that.radioEls.length; a++) {
                        that.toggle(that.radioEls[a]);
                    }
                });

                this.toggle(radio); //Initial value;
            }
        }
    }, {
        key: 'toggle',
        value: function toggle(triggerEl) {
            var targetAttr = triggerEl.getAttribute(this.jsToggleTarget);
            if (targetAttr !== null && targetAttr !== undefined) {
                var targetEl = document.querySelector(targetAttr);
                if (targetEl !== null && targetEl !== undefined) {
                    if (triggerEl.checked) {
                        this.open(triggerEl, targetEl);
                    } else {
                        this.close(triggerEl, targetEl);
                    }
                }
            }
        }
    }, {
        key: 'open',
        value: function open(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'true');
                targetEl.classList.remove('collapsed');
                targetEl.setAttribute('aria-hidden', 'false');
                triggerEl.dispatchEvent(this.eventOpen);
            }
        }
    }, {
        key: 'close',
        value: function close(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'false');
                targetEl.classList.add('collapsed');
                targetEl.setAttribute('aria-hidden', 'true');
                triggerEl.dispatchEvent(this.eventClose);
            }
        }
    }]);

    return RadioToggleGroup;
}();

module.exports = RadioToggleGroup;

},{}],75:[function(require,module,exports){
/*
* Prevents the user from inputting based on a regex.
* Does not work the same way af <input pattern="">, this pattern is only used for validation, not to prevent input.
* Usecase: number input for date-component.
* Example - number only: <input type="text" data-input-regex="^\d*$">
*/
'use strict';

var behavior = require('../utils/behavior');

var modifierState = {
  shift: false,
  alt: false,
  ctrl: false,
  command: false
};

function inputRegexMask(event) {
  if (modifierState.ctrl || modifierState.command) {
    return;
  }
  var newChar = null;
  if (typeof event.key !== 'undefined') {
    if (event.key.length === 1) {
      newChar = event.key;
    }
  } else {
    if (!event.charCode) {
      newChar = String.fromCharCode(event.keyCode);
    } else {
      newChar = String.fromCharCode(event.charCode);
    }
  }

  var regexStr = this.getAttribute('data-input-regex');

  if (event.type !== undefined && event.type === 'paste') {
    console.log('paste');
  } else {
    var element = null;
    if (event.target !== undefined) {
      element = event.target;
    }
    if (newChar !== null && element !== null) {
      if (newChar.length > 0) {
        var newValue = this.value;
        if (element.type === 'number') {
          newValue = this.value; //Note input[type=number] does not have .selectionStart/End (Chrome).
        } else {
          newValue = this.value.slice(0, element.selectionStart) + this.value.slice(element.selectionEnd) + newChar; //removes the numbers selected by the user, then adds new char.
        }

        var r = new RegExp(regexStr);
        if (r.exec(newValue) === null) {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            event.returnValue = false;
          }
        }
      }
    }
  }
}

module.exports = behavior({
  'keypress paste': {
    'input[data-input-regex]:focus': inputRegexMask
  }
});

},{"../utils/behavior":84}],76:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var behavior = require('../utils/behavior');
var once = require('receptor/once');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;
var LINK = '.' + PREFIX + 'skipnav[href^="#"]';

var setTabindex = function setTabindex(event) {
  // NB: we know because of the selector we're delegating to below that the
  // href already begins with '#'
  var id = this.getAttribute('href').slice(1);
  var target = document.getElementById(id);
  if (target) {
    target.setAttribute('tabindex', 0);
    target.addEventListener('blur', once(function (event) {
      target.setAttribute('tabindex', -1);
    }));
  } else {
    // throw an error?
  }
};

module.exports = behavior(_defineProperty({}, CLICK, _defineProperty({}, LINK, setTabindex)));

},{"../config":79,"../events":81,"../utils/behavior":84,"receptor/once":67}],77:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var select = require('../utils/select');

var ResponsiveTable = function () {
  function ResponsiveTable(table) {
    _classCallCheck(this, ResponsiveTable);

    this.insertHeaderAsAttributes(table);
  }

  // Add data attributes needed for responsive mode.


  _createClass(ResponsiveTable, [{
    key: 'insertHeaderAsAttributes',
    value: function insertHeaderAsAttributes(tableEl) {
      if (!tableEl) return;

      var header = tableEl.getElementsByTagName('thead');
      if (header.length !== 0) {
        var headerCellEls = header[0].getElementsByTagName('th');
        if (headerCellEls.length == 0) {
          headerCellEls = header[0].getElementsByTagName('td');
        }

        if (headerCellEls.length) {
          var bodyRowEls = select('tbody tr', tableEl);
          Array.from(bodyRowEls).forEach(function (rowEl) {
            var cellEls = rowEl.children;
            if (cellEls.length === headerCellEls.length) {
              Array.from(headerCellEls).forEach(function (headerCellEl, i) {
                // Grab header cell text and use it body cell data title.
                cellEls[i].setAttribute('data-title', headerCellEl.textContent);
              });
            }
          });
        }
      }
    }
  }]);

  return ResponsiveTable;
}();

module.exports = ResponsiveTable;

},{"../utils/select":87}],78:[function(require,module,exports){
'use strict';

var domready = require('domready');
var select = require('../utils/select');
//Import tippy.js (https://atomiks.github.io/tippyjs/)
var tippy = require('../../vendor/tippyjs/tippy.js');

var initTippy = function initTippy() {
    //init tooltip on elements with the .js-tooltip class
    tippy('.js-tooltip', {
        duration: 0,
        arrow: true
    });
};

domready(function () {
    initTippy();
});

},{"../../vendor/tippyjs/tippy.js":89,"../utils/select":87,"domready":60}],79:[function(require,module,exports){
'use strict';

module.exports = {
  prefix: ''
};

},{}],80:[function(require,module,exports){
'use strict';

var domready = require('domready');
var Collapse = require('./components/collapse');
var RadioToggleGroup = require('./components/radio-toggle-content');
var CheckboxToggleContent = require('./components/checkbox-toggle-content');
var Dropdown = require('./components/dropdown');
var Accordion = require('./components/accordion');
var ResponsiveTable = require('./components/table');
var tooltip = require('./components/tooltip');

/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

var dkfds = require('./config');

var components = require('./components');
dkfds.components = components;

domready(function () {
  var target = document.body;
  for (var name in components) {
    var behavior = components[name];
    behavior.on(target);
  }
  var jsSelectorAccordion = document.getElementsByClassName('accordion');
  for (var c = 0; c < jsSelectorAccordion.length; c++) {
    new Accordion(jsSelectorAccordion[c]);
  }
  var jsSelectorAccordionBordered = document.querySelectorAll('.accordion-bordered:not(.accordion)');
  for (var _c = 0; _c < jsSelectorAccordionBordered.length; _c++) {
    new Accordion(jsSelectorAccordionBordered[_c]);
  }

  var jsSelectorTable = document.querySelectorAll('table:not(.dataTable)');
  for (var _c2 = 0; _c2 < jsSelectorTable.length; _c2++) {
    new ResponsiveTable(jsSelectorTable[_c2]);
  }

  var jsSelectorCollapse = document.getElementsByClassName('js-collapse');
  for (var _c3 = 0; _c3 < jsSelectorCollapse.length; _c3++) {
    new Collapse(jsSelectorCollapse[_c3]);
  }

  var jsSelectorRadioCollapse = document.getElementsByClassName('js-radio-toggle-group');
  for (var _c4 = 0; _c4 < jsSelectorRadioCollapse.length; _c4++) {
    new RadioToggleGroup(jsSelectorRadioCollapse[_c4]);
  }

  var jsSelectorCheckboxCollapse = document.getElementsByClassName('js-checkbox-toggle-content');
  for (var _c5 = 0; _c5 < jsSelectorCheckboxCollapse.length; _c5++) {
    new CheckboxToggleContent(jsSelectorCheckboxCollapse[_c5]);
  }
  var jsSelectorDropdown = document.getElementsByClassName('js-dropdown');
  for (var _c6 = 0; _c6 < jsSelectorDropdown.length; _c6++) {
    new Dropdown(jsSelectorDropdown[_c6]);
  }
});

module.exports = { Collapse: Collapse, RadioToggleGroup: RadioToggleGroup, CheckboxToggleContent: CheckboxToggleContent, Dropdown: Dropdown, ResponsiveTable: ResponsiveTable, Accordion: Accordion };

},{"./components":72,"./components/accordion":68,"./components/checkbox-toggle-content":69,"./components/collapse":70,"./components/dropdown":71,"./components/radio-toggle-content":74,"./components/table":77,"./components/tooltip":78,"./config":79,"./polyfills":83,"domready":60}],81:[function(require,module,exports){
'use strict';

module.exports = {
  // This used to be conditionally dependent on whether the
  // browser supported touch events; if it did, `CLICK` was set to
  // `touchstart`.  However, this had downsides:
  //
  // * It pre-empted mobile browsers' default behavior of detecting
  //   whether a touch turned into a scroll, thereby preventing
  //   users from using some of our components as scroll surfaces.
  //
  // * Some devices, such as the Microsoft Surface Pro, support *both*
  //   touch and clicks. This meant the conditional effectively dropped
  //   support for the user's mouse, frustrating users who preferred
  //   it on those systems.
  CLICK: 'click'
};

},{}],82:[function(require,module,exports){
'use strict';

var elproto = window.HTMLElement.prototype;
var HIDDEN = 'hidden';

if (!(HIDDEN in elproto)) {
  Object.defineProperty(elproto, HIDDEN, {
    get: function get() {
      return this.hasAttribute(HIDDEN);
    },
    set: function set(value) {
      if (value) {
        this.setAttribute(HIDDEN, '');
      } else {
        this.removeAttribute(HIDDEN);
      }
    }
  });
}

},{}],83:[function(require,module,exports){
'use strict';
// polyfills HTMLElement.prototype.classList and DOMTokenList

require('classlist-polyfill');
// polyfills HTMLElement.prototype.hidden
require('./element-hidden');

require('core-js/fn/object/assign');
require('core-js/fn/array/from');

},{"./element-hidden":82,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],84:[function(require,module,exports){
'use strict';

var assign = require('object-assign');
var forEach = require('array-foreach');
var Behavior = require('receptor/behavior');

var sequence = function sequence() {
  var seq = [].slice.call(arguments);
  return function (target) {
    var _this = this;

    if (!target) {
      target = document.body;
    }
    forEach(seq, function (method) {
      if (typeof _this[method] === 'function') {
        _this[method].call(_this, target);
      }
    });
  };
};

/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = function (events, props) {
  return Behavior(events, assign({
    on: sequence('init', 'add'),
    off: sequence('teardown', 'remove')
  }, props));
};

},{"array-foreach":1,"object-assign":62,"receptor/behavior":63}],85:[function(require,module,exports){
'use strict';

/**
 * @name closest
 * @desc get nearest parent element matching selector.
 * @param {HTMLElement} el - The HTML element where the search starts.
 * @param {string} selector - Selector to be found.
 * @return {HTMLElement} - Nearest parent element matching selector.
 */

module.exports = function closest(el, selector) {
  var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

  while (el) {
    if (matchesSelector.call(el, selector)) {
      break;
    }
    el = el.parentElement;
  }
  return el;
};

},{}],86:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;

  var rect = el.getBoundingClientRect();

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}

module.exports = isElementInViewport;

},{}],87:[function(require,module,exports){
'use strict';

/**
 * @name isElement
 * @desc returns whether or not the given argument is a DOM element.
 * @param {any} value
 * @return {boolean}
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isElement = function isElement(value) {
  return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.nodeType === 1;
};

/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {Document|HTMLElement?} context - The context to traverse the DOM
 *   in. If not provided, it defaults to the document.
 * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
 */
module.exports = function select(selector, context) {

  if (typeof selector !== 'string') {
    return [];
  }

  if (!context || !isElement(context)) {
    context = window.document;
  }

  var selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
};

},{}],88:[function(require,module,exports){
'use strict';

var EXPANDED = 'aria-expanded';
var CONTROLS = 'aria-controls';
var HIDDEN = 'aria-hidden';

module.exports = function (button, expanded) {

  if (typeof expanded !== 'boolean') {
    expanded = button.getAttribute(EXPANDED) === 'false';
  }
  button.setAttribute(EXPANDED, expanded);

  var id = button.getAttribute(CONTROLS);
  var controls = document.getElementById(id);
  if (!controls) {
    throw new Error('No toggle target found with id: "' + id + '"');
  }

  controls.setAttribute(HIDDEN, !expanded);
  return expanded;
};

},{}],89:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
* Tippy.js v2.5.3
* (c) 2017-2018 atomiks
* MIT
*/
(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.tippy = factory();
})(undefined, function () {
  'use strict';

  var version = "2.5.3";

  var isBrowser = typeof window !== 'undefined';

  var isIE = isBrowser && /MSIE |Trident\//.test(navigator.userAgent);

  var browser = {};

  if (isBrowser) {
    browser.supported = 'requestAnimationFrame' in window;
    browser.supportsTouch = 'ontouchstart' in window;
    browser.usingTouch = false;
    browser.dynamicInputDetection = true;
    browser.iOS = /iPhone|iPad|iPod/.test(navigator.platform) && !window.MSStream;
    browser.onUserInputChange = function () {};
  }

  /**
   * Selector constants used for grabbing elements
   */
  var selectors = {
    POPPER: '.tippy-popper',
    TOOLTIP: '.tippy-tooltip',
    CONTENT: '.tippy-content',
    BACKDROP: '.tippy-backdrop',
    ARROW: '.tippy-arrow',
    ROUND_ARROW: '.tippy-roundarrow',
    REFERENCE: '[data-tippy]'
  };

  var defaults = {
    placement: 'top',
    livePlacement: true,
    trigger: 'mouseenter focus',
    animation: 'shift-away',
    html: false,
    animateFill: true,
    arrow: false,
    delay: 0,
    duration: [350, 300],
    interactive: false,
    interactiveBorder: 2,
    theme: 'dark',
    size: 'regular',
    distance: 10,
    offset: 0,
    hideOnClick: true,
    multiple: false,
    followCursor: false,
    inertia: false,
    updateDuration: 350,
    sticky: false,
    appendTo: function appendTo() {
      return document.body;
    },
    zIndex: 9999,
    touchHold: false,
    performance: false,
    dynamicTitle: false,
    flip: true,
    flipBehavior: 'flip',
    arrowType: 'sharp',
    arrowTransform: '',
    maxWidth: '',
    target: null,
    allowTitleHTML: true,
    popperOptions: {},
    createPopperInstanceOnInit: false,
    onShow: function onShow() {},
    onShown: function onShown() {},
    onHide: function onHide() {},
    onHidden: function onHidden() {}
  };

  /**
   * The keys of the defaults object for reducing down into a new object
   * Used in `getIndividualOptions()`
   */
  var defaultsKeys = browser.supported && Object.keys(defaults);

  /**
   * Determines if a value is an object literal
   * @param {*} value
   * @return {Boolean}
   */
  function isObjectLiteral(value) {
    return {}.toString.call(value) === '[object Object]';
  }

  /**
   * Ponyfill for Array.from
   * @param {*} value
   * @return {Array}
   */
  function toArray(value) {
    return [].slice.call(value);
  }

  /**
   * Returns an array of elements based on the selector input
   * @param {String|Element|Element[]|NodeList|Object} selector
   * @return {Element[]}
   */
  function getArrayOfElements(selector) {
    if (selector instanceof Element || isObjectLiteral(selector)) {
      return [selector];
    }

    if (selector instanceof NodeList) {
      return toArray(selector);
    }

    if (Array.isArray(selector)) {
      return selector;
    }

    try {
      return toArray(document.querySelectorAll(selector));
    } catch (_) {
      return [];
    }
  }

  /**
   * Polyfills needed props/methods for a virtual reference object
   * NOTE: in v3.0 this will be pure
   * @param {Object} reference
   */
  function polyfillVirtualReferenceProps(reference) {
    reference.refObj = true;
    reference.attributes = reference.attributes || {};
    reference.setAttribute = function (key, val) {
      reference.attributes[key] = val;
    };
    reference.getAttribute = function (key) {
      return reference.attributes[key];
    };
    reference.removeAttribute = function (key) {
      delete reference.attributes[key];
    };
    reference.hasAttribute = function (key) {
      return key in reference.attributes;
    };
    reference.addEventListener = function () {};
    reference.removeEventListener = function () {};
    reference.classList = {
      classNames: {},
      add: function add(key) {
        return reference.classList.classNames[key] = true;
      },
      remove: function remove(key) {
        delete reference.classList.classNames[key];
        return true;
      },
      contains: function contains(key) {
        return key in reference.classList.classNames;
      }
    };
  }

  /**
   * Returns the supported prefixed property - only `webkit` is needed, `moz`, `ms` and `o` are obsolete
   * @param {String} property
   * @return {String} - browser supported prefixed property
   */
  function prefix(property) {
    var prefixes = ['', 'webkit'];
    var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (var i = 0; i < prefixes.length; i++) {
      var _prefix = prefixes[i];
      var prefixedProp = _prefix ? _prefix + upperProp : property;
      if (typeof document.body.style[prefixedProp] !== 'undefined') {
        return prefixedProp;
      }
    }

    return null;
  }

  /**
   * Creates a div element
   * @return {Element}
   */
  function div() {
    return document.createElement('div');
  }

  /**
   * Creates a popper element then returns it
   * @param {Number} id - the popper id
   * @param {String} title - the tooltip's `title` attribute
   * @param {Object} options - individual options
   * @return {Element} - the popper element
   */
  function createPopperElement(id, title, options) {
    var popper = div();
    popper.setAttribute('class', 'tippy-popper');
    popper.setAttribute('role', 'tooltip');
    popper.setAttribute('id', 'tippy-' + id);
    popper.style.zIndex = options.zIndex;
    popper.style.maxWidth = options.maxWidth;

    var tooltip = div();
    tooltip.setAttribute('class', 'tippy-tooltip');
    tooltip.setAttribute('data-size', options.size);
    tooltip.setAttribute('data-animation', options.animation);
    tooltip.setAttribute('data-state', 'hidden');
    options.theme.split(' ').forEach(function (t) {
      tooltip.classList.add(t + '-theme');
    });

    var content = div();
    content.setAttribute('class', 'tippy-content');

    if (options.arrow) {
      var arrow = div();
      arrow.style[prefix('transform')] = options.arrowTransform;

      if (options.arrowType === 'round') {
        arrow.classList.add('tippy-roundarrow');
        arrow.innerHTML = '<svg viewBox="0 0 24 8" xmlns="http://www.w3.org/2000/svg"><path d="M3 8s2.021-.015 5.253-4.218C9.584 2.051 10.797 1.007 12 1c1.203-.007 2.416 1.035 3.761 2.782C19.012 8.005 21 8 21 8H3z"/></svg>';
      } else {
        arrow.classList.add('tippy-arrow');
      }

      tooltip.appendChild(arrow);
    }

    if (options.animateFill) {
      // Create animateFill circle element for animation
      tooltip.setAttribute('data-animatefill', '');
      var backdrop = div();
      backdrop.classList.add('tippy-backdrop');
      backdrop.setAttribute('data-state', 'hidden');
      tooltip.appendChild(backdrop);
    }

    if (options.inertia) {
      // Change transition timing function cubic bezier
      tooltip.setAttribute('data-inertia', '');
    }

    if (options.interactive) {
      tooltip.setAttribute('data-interactive', '');
    }

    var html = options.html;
    if (html) {
      var templateId = void 0;

      if (html instanceof Element) {
        content.appendChild(html);
        templateId = '#' + (html.id || 'tippy-html-template');
      } else {
        // trick linters: https://github.com/atomiks/tippyjs/issues/197
        content[true && 'innerHTML'] = document.querySelector(html)[true && 'innerHTML'];
        templateId = html;
      }

      popper.setAttribute('data-html', '');
      tooltip.setAttribute('data-template-id', templateId);

      if (options.interactive) {
        popper.setAttribute('tabindex', '-1');
      }
    } else {
      content[options.allowTitleHTML ? 'innerHTML' : 'textContent'] = title;
    }

    tooltip.appendChild(content);
    popper.appendChild(tooltip);

    return popper;
  }

  /**
   * Creates a trigger by adding the necessary event listeners to the reference element
   * @param {String} eventType - the custom event specified in the `trigger` setting
   * @param {Element} reference
   * @param {Object} handlers - the handlers for each event
   * @param {Object} options
   * @return {Array} - array of listener objects
   */
  function createTrigger(eventType, reference, handlers, options) {
    var onTrigger = handlers.onTrigger,
        onMouseLeave = handlers.onMouseLeave,
        onBlur = handlers.onBlur,
        onDelegateShow = handlers.onDelegateShow,
        onDelegateHide = handlers.onDelegateHide;

    var listeners = [];

    if (eventType === 'manual') return listeners;

    var on = function on(eventType, handler) {
      reference.addEventListener(eventType, handler);
      listeners.push({ event: eventType, handler: handler });
    };

    if (!options.target) {
      on(eventType, onTrigger);

      if (browser.supportsTouch && options.touchHold) {
        on('touchstart', onTrigger);
        on('touchend', onMouseLeave);
      }
      if (eventType === 'mouseenter') {
        on('mouseleave', onMouseLeave);
      }
      if (eventType === 'focus') {
        on(isIE ? 'focusout' : 'blur', onBlur);
      }
    } else {
      if (browser.supportsTouch && options.touchHold) {
        on('touchstart', onDelegateShow);
        on('touchend', onDelegateHide);
      }
      if (eventType === 'mouseenter') {
        on('mouseover', onDelegateShow);
        on('mouseout', onDelegateHide);
      }
      if (eventType === 'focus') {
        on('focusin', onDelegateShow);
        on('focusout', onDelegateHide);
      }
      if (eventType === 'click') {
        on('click', onDelegateShow);
      }
    }

    return listeners;
  }

  var classCallCheck = function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
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

  /**
   * Returns an object of settings to override global settings
   * @param {Element} reference
   * @param {Object} instanceOptions
   * @return {Object} - individual options
   */
  function getIndividualOptions(reference, instanceOptions) {
    var options = defaultsKeys.reduce(function (acc, key) {
      var val = reference.getAttribute('data-tippy-' + key.toLowerCase()) || instanceOptions[key];

      // Convert strings to booleans
      if (val === 'false') val = false;
      if (val === 'true') val = true;

      // Convert number strings to true numbers
      if (isFinite(val) && !isNaN(parseFloat(val))) {
        val = parseFloat(val);
      }

      // Convert array strings to actual arrays
      if (key !== 'target' && typeof val === 'string' && val.trim().charAt(0) === '[') {
        val = JSON.parse(val);
      }

      acc[key] = val;

      return acc;
    }, {});

    return _extends({}, instanceOptions, options);
  }

  /**
   * Evaluates/modifies the options object for appropriate behavior
   * @param {Element|Object} reference
   * @param {Object} options
   * @return {Object} modified/evaluated options
   */
  function evaluateOptions(reference, options) {
    // animateFill is disabled if an arrow is true
    if (options.arrow) {
      options.animateFill = false;
    }

    if (options.appendTo && typeof options.appendTo === 'function') {
      options.appendTo = options.appendTo();
    }

    if (typeof options.html === 'function') {
      options.html = options.html(reference);
    }

    return options;
  }

  /**
   * Returns inner elements of the popper element
   * @param {Element} popper
   * @return {Object}
   */
  function getInnerElements(popper) {
    var select = function select(s) {
      return popper.querySelector(s);
    };
    return {
      tooltip: select(selectors.TOOLTIP),
      backdrop: select(selectors.BACKDROP),
      content: select(selectors.CONTENT),
      arrow: select(selectors.ARROW) || select(selectors.ROUND_ARROW)
    };
  }

  /**
   * Removes the title from an element, setting `data-original-title`
   * appropriately
   * @param {Element} el
   */
  function removeTitle(el) {
    var title = el.getAttribute('title');
    // Only set `data-original-title` attr if there is a title
    if (title) {
      el.setAttribute('data-original-title', title);
    }
    el.removeAttribute('title');
  }

  /**!
   * @fileOverview Kickass library to create and place poppers near their reference elements.
   * @version 1.14.3
   * @license
   * Copyright (c) 2016 Federico Zivolo and contributors
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */
  var isBrowser$1 = typeof window !== 'undefined' && typeof document !== 'undefined';

  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
  var timeoutDuration = 0;
  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser$1 && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      timeoutDuration = 1;
      break;
    }
  }

  function microtaskDebounce(fn) {
    var called = false;
    return function () {
      if (called) {
        return;
      }
      called = true;
      window.Promise.resolve().then(function () {
        called = false;
        fn();
      });
    };
  }

  function taskDebounce(fn) {
    var scheduled = false;
    return function () {
      if (!scheduled) {
        scheduled = true;
        setTimeout(function () {
          scheduled = false;
          fn();
        }, timeoutDuration);
      }
    };
  }

  var supportsMicroTasks = isBrowser$1 && window.Promise;

  /**
  * Create a debounced version of a method, that's asynchronously deferred
  * but called in the minimum time possible.
  *
  * @method
  * @memberof Popper.Utils
  * @argument {Function} fn
  * @returns {Function}
  */
  var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

  /**
   * Check if the given variable is a function
   * @method
   * @memberof Popper.Utils
   * @argument {Any} functionToCheck - variable to check
   * @returns {Boolean} answer to: is a function?
   */
  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  /**
   * Get CSS computed property of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Eement} element
   * @argument {String} property
   */
  function getStyleComputedProperty(element, property) {
    if (element.nodeType !== 1) {
      return [];
    }
    // NOTE: 1 DOM access here
    var css = getComputedStyle(element, null);
    return property ? css[property] : css;
  }

  /**
   * Returns the parentNode or the host of the element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} parent
   */
  function getParentNode(element) {
    if (element.nodeName === 'HTML') {
      return element;
    }
    return element.parentNode || element.host;
  }

  /**
   * Returns the scrolling parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} scroll parent
   */
  function getScrollParent(element) {
    // Return body, `getScroll` will take care to get the correct `scrollTop` from it
    if (!element) {
      return document.body;
    }

    switch (element.nodeName) {
      case 'HTML':
      case 'BODY':
        return element.ownerDocument.body;
      case '#document':
        return element.body;
    }

    // Firefox want us to check `-x` and `-y` variations as well

    var _getStyleComputedProp = getStyleComputedProperty(element),
        overflow = _getStyleComputedProp.overflow,
        overflowX = _getStyleComputedProp.overflowX,
        overflowY = _getStyleComputedProp.overflowY;

    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      return element;
    }

    return getScrollParent(getParentNode(element));
  }

  var isIE11 = isBrowser$1 && !!(window.MSInputMethodContext && document.documentMode);
  var isIE10 = isBrowser$1 && /MSIE 10/.test(navigator.userAgent);

  /**
   * Determines if the browser is Internet Explorer
   * @method
   * @memberof Popper.Utils
   * @param {Number} version to check
   * @returns {Boolean} isIE
   */
  function isIE$1(version) {
    if (version === 11) {
      return isIE11;
    }
    if (version === 10) {
      return isIE10;
    }
    return isIE11 || isIE10;
  }

  /**
   * Returns the offset parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} offset parent
   */
  function getOffsetParent(element) {
    if (!element) {
      return document.documentElement;
    }

    var noOffsetParent = isIE$1(10) ? document.body : null;

    // NOTE: 1 DOM access here
    var offsetParent = element.offsetParent;
    // Skip hidden elements which don't have an offsetParent
    while (offsetParent === noOffsetParent && element.nextElementSibling) {
      offsetParent = (element = element.nextElementSibling).offsetParent;
    }

    var nodeName = offsetParent && offsetParent.nodeName;

    if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
      return element ? element.ownerDocument.documentElement : document.documentElement;
    }

    // .offsetParent will return the closest TD or TABLE in case
    // no offsetParent is present, I hate this job...
    if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
      return getOffsetParent(offsetParent);
    }

    return offsetParent;
  }

  function isOffsetContainer(element) {
    var nodeName = element.nodeName;

    if (nodeName === 'BODY') {
      return false;
    }
    return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
  }

  /**
   * Finds the root node (document, shadowDOM root) of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} node
   * @returns {Element} root node
   */
  function getRoot(node) {
    if (node.parentNode !== null) {
      return getRoot(node.parentNode);
    }

    return node;
  }

  /**
   * Finds the offset parent common to the two provided nodes
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element1
   * @argument {Element} element2
   * @returns {Element} common offset parent
   */
  function findCommonOffsetParent(element1, element2) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
      return document.documentElement;
    }

    // Here we make sure to give as "start" the element that comes first in the DOM
    var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
    var start = order ? element1 : element2;
    var end = order ? element2 : element1;

    // Get common ancestor container
    var range = document.createRange();
    range.setStart(start, 0);
    range.setEnd(end, 0);
    var commonAncestorContainer = range.commonAncestorContainer;

    // Both nodes are inside #document

    if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
      if (isOffsetContainer(commonAncestorContainer)) {
        return commonAncestorContainer;
      }

      return getOffsetParent(commonAncestorContainer);
    }

    // one of the nodes is inside shadowDOM, find which one
    var element1root = getRoot(element1);
    if (element1root.host) {
      return findCommonOffsetParent(element1root.host, element2);
    } else {
      return findCommonOffsetParent(element1, getRoot(element2).host);
    }
  }

  /**
   * Gets the scroll value of the given element in the given side (top and left)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {String} side `top` or `left`
   * @returns {number} amount of scrolled pixels
   */
  function getScroll(element) {
    var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

    var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    var nodeName = element.nodeName;

    if (nodeName === 'BODY' || nodeName === 'HTML') {
      var html = element.ownerDocument.documentElement;
      var scrollingElement = element.ownerDocument.scrollingElement || html;
      return scrollingElement[upperSide];
    }

    return element[upperSide];
  }

  /*
   * Sum or subtract the element scroll values (left and top) from a given rect object
   * @method
   * @memberof Popper.Utils
   * @param {Object} rect - Rect object you want to change
   * @param {HTMLElement} element - The element from the function reads the scroll values
   * @param {Boolean} subtract - set to true if you want to subtract the scroll values
   * @return {Object} rect - The modifier rect object
   */
  function includeScroll(rect, element) {
    var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var scrollTop = getScroll(element, 'top');
    var scrollLeft = getScroll(element, 'left');
    var modifier = subtract ? -1 : 1;
    rect.top += scrollTop * modifier;
    rect.bottom += scrollTop * modifier;
    rect.left += scrollLeft * modifier;
    rect.right += scrollLeft * modifier;
    return rect;
  }

  /*
   * Helper to detect borders of a given element
   * @method
   * @memberof Popper.Utils
   * @param {CSSStyleDeclaration} styles
   * Result of `getStyleComputedProperty` on the given element
   * @param {String} axis - `x` or `y`
   * @return {number} borders - The borders size of the given axis
   */

  function getBordersSize(styles, axis) {
    var sideA = axis === 'x' ? 'Left' : 'Top';
    var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

    return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
  }

  function getSize(axis, body, html, computedStyle) {
    return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE$1(10) ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
  }

  function getWindowSizes() {
    var body = document.body;
    var html = document.documentElement;
    var computedStyle = isIE$1(10) && getComputedStyle(html);

    return {
      height: getSize('Height', body, html, computedStyle),
      width: getSize('Width', body, html, computedStyle)
    };
  }

  var classCallCheck$1 = function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass$1 = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defineProperty$1 = function defineProperty(obj, key, value) {
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
  };

  var _extends$1 = Object.assign || function (target) {
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

  /**
   * Given element offsets, generate an output similar to getBoundingClientRect
   * @method
   * @memberof Popper.Utils
   * @argument {Object} offsets
   * @returns {Object} ClientRect like output
   */
  function getClientRect(offsets) {
    return _extends$1({}, offsets, {
      right: offsets.left + offsets.width,
      bottom: offsets.top + offsets.height
    });
  }

  /**
   * Get bounding client rect of given element
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} element
   * @return {Object} client rect
   */
  function getBoundingClientRect(element) {
    var rect = {};

    // IE10 10 FIX: Please, don't ask, the element isn't
    // considered in DOM in some circumstances...
    // This isn't reproducible in IE10 compatibility mode of IE11
    try {
      if (isIE$1(10)) {
        rect = element.getBoundingClientRect();
        var scrollTop = getScroll(element, 'top');
        var scrollLeft = getScroll(element, 'left');
        rect.top += scrollTop;
        rect.left += scrollLeft;
        rect.bottom += scrollTop;
        rect.right += scrollLeft;
      } else {
        rect = element.getBoundingClientRect();
      }
    } catch (e) {}

    var result = {
      left: rect.left,
      top: rect.top,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };

    // subtract scrollbar size from sizes
    var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
    var width = sizes.width || element.clientWidth || result.right - result.left;
    var height = sizes.height || element.clientHeight || result.bottom - result.top;

    var horizScrollbar = element.offsetWidth - width;
    var vertScrollbar = element.offsetHeight - height;

    // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
    // we make this check conditional for performance reasons
    if (horizScrollbar || vertScrollbar) {
      var styles = getStyleComputedProperty(element);
      horizScrollbar -= getBordersSize(styles, 'x');
      vertScrollbar -= getBordersSize(styles, 'y');

      result.width -= horizScrollbar;
      result.height -= vertScrollbar;
    }

    return getClientRect(result);
  }

  function getOffsetRectRelativeToArbitraryNode(children, parent) {
    var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var isIE10 = isIE$1(10);
    var isHTML = parent.nodeName === 'HTML';
    var childrenRect = getBoundingClientRect(children);
    var parentRect = getBoundingClientRect(parent);
    var scrollParent = getScrollParent(children);

    var styles = getStyleComputedProperty(parent);
    var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
    var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

    // In cases where the parent is fixed, we must ignore negative scroll in offset calc
    if (fixedPosition && parent.nodeName === 'HTML') {
      parentRect.top = Math.max(parentRect.top, 0);
      parentRect.left = Math.max(parentRect.left, 0);
    }
    var offsets = getClientRect({
      top: childrenRect.top - parentRect.top - borderTopWidth,
      left: childrenRect.left - parentRect.left - borderLeftWidth,
      width: childrenRect.width,
      height: childrenRect.height
    });
    offsets.marginTop = 0;
    offsets.marginLeft = 0;

    // Subtract margins of documentElement in case it's being used as parent
    // we do this only on HTML because it's the only element that behaves
    // differently when margins are applied to it. The margins are included in
    // the box of the documentElement, in the other cases not.
    if (!isIE10 && isHTML) {
      var marginTop = parseFloat(styles.marginTop, 10);
      var marginLeft = parseFloat(styles.marginLeft, 10);

      offsets.top -= borderTopWidth - marginTop;
      offsets.bottom -= borderTopWidth - marginTop;
      offsets.left -= borderLeftWidth - marginLeft;
      offsets.right -= borderLeftWidth - marginLeft;

      // Attach marginTop and marginLeft because in some circumstances we may need them
      offsets.marginTop = marginTop;
      offsets.marginLeft = marginLeft;
    }

    if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
      offsets = includeScroll(offsets, parent);
    }

    return offsets;
  }

  function getViewportOffsetRectRelativeToArtbitraryNode(element) {
    var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var html = element.ownerDocument.documentElement;
    var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
    var width = Math.max(html.clientWidth, window.innerWidth || 0);
    var height = Math.max(html.clientHeight, window.innerHeight || 0);

    var scrollTop = !excludeScroll ? getScroll(html) : 0;
    var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

    var offset = {
      top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
      left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
      width: width,
      height: height
    };

    return getClientRect(offset);
  }

  /**
   * Check if the given element is fixed or is inside a fixed parent
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {Element} customContainer
   * @returns {Boolean} answer to "isFixed?"
   */
  function isFixed(element) {
    var nodeName = element.nodeName;
    if (nodeName === 'BODY' || nodeName === 'HTML') {
      return false;
    }
    if (getStyleComputedProperty(element, 'position') === 'fixed') {
      return true;
    }
    return isFixed(getParentNode(element));
  }

  /**
   * Finds the first parent of an element that has a transformed property defined
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} first transformed parent or documentElement
   */

  function getFixedPositionOffsetParent(element) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element || !element.parentElement || isIE$1()) {
      return document.documentElement;
    }
    var el = element.parentElement;
    while (el && getStyleComputedProperty(el, 'transform') === 'none') {
      el = el.parentElement;
    }
    return el || document.documentElement;
  }

  /**
   * Computed the boundaries limits and return them
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} popper
   * @param {HTMLElement} reference
   * @param {number} padding
   * @param {HTMLElement} boundariesElement - Element used to define the boundaries
   * @param {Boolean} fixedPosition - Is in fixed position mode
   * @returns {Object} Coordinates of the boundaries
   */
  function getBoundaries(popper, reference, padding, boundariesElement) {
    var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    // NOTE: 1 DOM access here

    var boundaries = { top: 0, left: 0 };
    var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);

    // Handle viewport case
    if (boundariesElement === 'viewport') {
      boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
    } else {
      // Handle other cases based on DOM element used as boundaries
      var boundariesNode = void 0;
      if (boundariesElement === 'scrollParent') {
        boundariesNode = getScrollParent(getParentNode(reference));
        if (boundariesNode.nodeName === 'BODY') {
          boundariesNode = popper.ownerDocument.documentElement;
        }
      } else if (boundariesElement === 'window') {
        boundariesNode = popper.ownerDocument.documentElement;
      } else {
        boundariesNode = boundariesElement;
      }

      var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

      // In case of HTML, we need a different computation
      if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
        var _getWindowSizes = getWindowSizes(),
            height = _getWindowSizes.height,
            width = _getWindowSizes.width;

        boundaries.top += offsets.top - offsets.marginTop;
        boundaries.bottom = height + offsets.top;
        boundaries.left += offsets.left - offsets.marginLeft;
        boundaries.right = width + offsets.left;
      } else {
        // for all the other DOM elements, this one is good
        boundaries = offsets;
      }
    }

    // Add paddings
    boundaries.left += padding;
    boundaries.top += padding;
    boundaries.right -= padding;
    boundaries.bottom -= padding;

    return boundaries;
  }

  function getArea(_ref) {
    var width = _ref.width,
        height = _ref.height;

    return width * height;
  }

  /**
   * Utility used to transform the `auto` placement to the placement with more
   * available space.
   * @method
   * @memberof Popper.Utils
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
    var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    if (placement.indexOf('auto') === -1) {
      return placement;
    }

    var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

    var rects = {
      top: {
        width: boundaries.width,
        height: refRect.top - boundaries.top
      },
      right: {
        width: boundaries.right - refRect.right,
        height: boundaries.height
      },
      bottom: {
        width: boundaries.width,
        height: boundaries.bottom - refRect.bottom
      },
      left: {
        width: refRect.left - boundaries.left,
        height: boundaries.height
      }
    };

    var sortedAreas = Object.keys(rects).map(function (key) {
      return _extends$1({
        key: key
      }, rects[key], {
        area: getArea(rects[key])
      });
    }).sort(function (a, b) {
      return b.area - a.area;
    });

    var filteredAreas = sortedAreas.filter(function (_ref2) {
      var width = _ref2.width,
          height = _ref2.height;
      return width >= popper.clientWidth && height >= popper.clientHeight;
    });

    var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

    var variation = placement.split('-')[1];

    return computedPlacement + (variation ? '-' + variation : '');
  }

  /**
   * Get offsets to the reference element
   * @method
   * @memberof Popper.Utils
   * @param {Object} state
   * @param {Element} popper - the popper element
   * @param {Element} reference - the reference element (the popper will be relative to this)
   * @param {Element} fixedPosition - is in fixed position mode
   * @returns {Object} An object containing the offsets which will be applied to the popper
   */
  function getReferenceOffsets(state, popper, reference) {
    var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
    return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
  }

  /**
   * Get the outer sizes of the given element (offset size + margins)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Object} object containing width and height properties
   */
  function getOuterSizes(element) {
    var styles = getComputedStyle(element);
    var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    var result = {
      width: element.offsetWidth + y,
      height: element.offsetHeight + x
    };
    return result;
  }

  /**
   * Get the opposite placement of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement
   * @returns {String} flipped placement
   */
  function getOppositePlacement(placement) {
    var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash[matched];
    });
  }

  /**
   * Get offsets to the popper
   * @method
   * @memberof Popper.Utils
   * @param {Object} position - CSS position the Popper will get applied
   * @param {HTMLElement} popper - the popper element
   * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
   * @param {String} placement - one of the valid placement options
   * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
   */
  function getPopperOffsets(popper, referenceOffsets, placement) {
    placement = placement.split('-')[0];

    // Get popper node sizes
    var popperRect = getOuterSizes(popper);

    // Add position, width and height to our offsets object
    var popperOffsets = {
      width: popperRect.width,
      height: popperRect.height
    };

    // depending by the popper placement we have to compute its offsets slightly differently
    var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    var mainSide = isHoriz ? 'top' : 'left';
    var secondarySide = isHoriz ? 'left' : 'top';
    var measurement = isHoriz ? 'height' : 'width';
    var secondaryMeasurement = !isHoriz ? 'height' : 'width';

    popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
    if (placement === secondarySide) {
      popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
    } else {
      popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
    }

    return popperOffsets;
  }

  /**
   * Mimics the `find` method of Array
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function find(arr, check) {
    // use native find if supported
    if (Array.prototype.find) {
      return arr.find(check);
    }

    // use `filter` to obtain the same behavior of `find`
    return arr.filter(check)[0];
  }

  /**
   * Return the index of the matching object
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function findIndex(arr, prop, value) {
    // use native findIndex if supported
    if (Array.prototype.findIndex) {
      return arr.findIndex(function (cur) {
        return cur[prop] === value;
      });
    }

    // use `find` + `indexOf` if `findIndex` isn't supported
    var match = find(arr, function (obj) {
      return obj[prop] === value;
    });
    return arr.indexOf(match);
  }

  /**
   * Loop trough the list of modifiers and run them in order,
   * each of them will then edit the data object.
   * @method
   * @memberof Popper.Utils
   * @param {dataObject} data
   * @param {Array} modifiers
   * @param {String} ends - Optional modifier name used as stopper
   * @returns {dataObject}
   */
  function runModifiers(modifiers, data, ends) {
    var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

    modifiersToRun.forEach(function (modifier) {
      if (modifier['function']) {
        // eslint-disable-line dot-notation
        console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
      }
      var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
      if (modifier.enabled && isFunction(fn)) {
        // Add properties to offsets to make them a complete clientRect object
        // we do this before each modifier to make sure the previous one doesn't
        // mess with these values
        data.offsets.popper = getClientRect(data.offsets.popper);
        data.offsets.reference = getClientRect(data.offsets.reference);

        data = fn(data, modifier);
      }
    });

    return data;
  }

  /**
   * Updates the position of the popper, computing the new offsets and applying
   * the new style.<br />
   * Prefer `scheduleUpdate` over `update` because of performance reasons.
   * @method
   * @memberof Popper
   */
  function update() {
    // if popper is destroyed, don't perform any further update
    if (this.state.isDestroyed) {
      return;
    }

    var data = {
      instance: this,
      styles: {},
      arrowStyles: {},
      attributes: {},
      flipped: false,
      offsets: {}
    };

    // compute reference element offsets
    data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

    // store the computed placement inside `originalPlacement`
    data.originalPlacement = data.placement;

    data.positionFixed = this.options.positionFixed;

    // compute the popper offsets
    data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

    data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

    // run the modifiers
    data = runModifiers(this.modifiers, data);

    // the first `update` will call `onCreate` callback
    // the other ones will call `onUpdate` callback
    if (!this.state.isCreated) {
      this.state.isCreated = true;
      this.options.onCreate(data);
    } else {
      this.options.onUpdate(data);
    }
  }

  /**
   * Helper used to know if the given modifier is enabled.
   * @method
   * @memberof Popper.Utils
   * @returns {Boolean}
   */
  function isModifierEnabled(modifiers, modifierName) {
    return modifiers.some(function (_ref) {
      var name = _ref.name,
          enabled = _ref.enabled;
      return enabled && name === modifierName;
    });
  }

  /**
   * Get the prefixed supported property name
   * @method
   * @memberof Popper.Utils
   * @argument {String} property (camelCase)
   * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
   */
  function getSupportedPropertyName(property) {
    var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
    var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (var i = 0; i < prefixes.length; i++) {
      var prefix = prefixes[i];
      var toCheck = prefix ? '' + prefix + upperProp : property;
      if (typeof document.body.style[toCheck] !== 'undefined') {
        return toCheck;
      }
    }
    return null;
  }

  /**
   * Destroy the popper
   * @method
   * @memberof Popper
   */
  function destroy() {
    this.state.isDestroyed = true;

    // touch DOM only if `applyStyle` modifier is enabled
    if (isModifierEnabled(this.modifiers, 'applyStyle')) {
      this.popper.removeAttribute('x-placement');
      this.popper.style.position = '';
      this.popper.style.top = '';
      this.popper.style.left = '';
      this.popper.style.right = '';
      this.popper.style.bottom = '';
      this.popper.style.willChange = '';
      this.popper.style[getSupportedPropertyName('transform')] = '';
    }

    this.disableEventListeners();

    // remove the popper if user explicity asked for the deletion on destroy
    // do not use `remove` because IE11 doesn't support it
    if (this.options.removeOnDestroy) {
      this.popper.parentNode.removeChild(this.popper);
    }
    return this;
  }

  /**
   * Get the window associated with the element
   * @argument {Element} element
   * @returns {Window}
   */
  function getWindow(element) {
    var ownerDocument = element.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView : window;
  }

  function attachToScrollParents(scrollParent, event, callback, scrollParents) {
    var isBody = scrollParent.nodeName === 'BODY';
    var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
    target.addEventListener(event, callback, { passive: true });

    if (!isBody) {
      attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
    }
    scrollParents.push(target);
  }

  /**
   * Setup needed event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function setupEventListeners(reference, options, state, updateBound) {
    // Resize event listener on window
    state.updateBound = updateBound;
    getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

    // Scroll event listener on scroll parents
    var scrollElement = getScrollParent(reference);
    attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
    state.scrollElement = scrollElement;
    state.eventsEnabled = true;

    return state;
  }

  /**
   * It will add resize/scroll events and start recalculating
   * position of the popper element when they are triggered.
   * @method
   * @memberof Popper
   */
  function enableEventListeners() {
    if (!this.state.eventsEnabled) {
      this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
    }
  }

  /**
   * Remove event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function removeEventListeners(reference, state) {
    // Remove resize event listener on window
    getWindow(reference).removeEventListener('resize', state.updateBound);

    // Remove scroll event listener on scroll parents
    state.scrollParents.forEach(function (target) {
      target.removeEventListener('scroll', state.updateBound);
    });

    // Reset state
    state.updateBound = null;
    state.scrollParents = [];
    state.scrollElement = null;
    state.eventsEnabled = false;
    return state;
  }

  /**
   * It will remove resize/scroll events and won't recalculate popper position
   * when they are triggered. It also won't trigger onUpdate callback anymore,
   * unless you call `update` method manually.
   * @method
   * @memberof Popper
   */
  function disableEventListeners() {
    if (this.state.eventsEnabled) {
      cancelAnimationFrame(this.scheduleUpdate);
      this.state = removeEventListeners(this.reference, this.state);
    }
  }

  /**
   * Tells if a given input is a number
   * @method
   * @memberof Popper.Utils
   * @param {*} input to check
   * @return {Boolean}
   */
  function isNumeric(n) {
    return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * Set the style to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the style to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setStyles(element, styles) {
    Object.keys(styles).forEach(function (prop) {
      var unit = '';
      // add unit if the value is numeric and is one of the following
      if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
        unit = 'px';
      }
      element.style[prop] = styles[prop] + unit;
    });
  }

  /**
   * Set the attributes to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the attributes to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(function (prop) {
      var value = attributes[prop];
      if (value !== false) {
        element.setAttribute(prop, attributes[prop]);
      } else {
        element.removeAttribute(prop);
      }
    });
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} data.styles - List of style properties - values to apply to popper element
   * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The same data object
   */
  function applyStyle(data) {
    // any property present in `data.styles` will be applied to the popper,
    // in this way we can make the 3rd party modifiers add custom styles to it
    // Be aware, modifiers could override the properties defined in the previous
    // lines of this modifier!
    setStyles(data.instance.popper, data.styles);

    // any property present in `data.attributes` will be applied to the popper,
    // they will be set as HTML attributes of the element
    setAttributes(data.instance.popper, data.attributes);

    // if arrowElement is defined and arrowStyles has some properties
    if (data.arrowElement && Object.keys(data.arrowStyles).length) {
      setStyles(data.arrowElement, data.arrowStyles);
    }

    return data;
  }

  /**
   * Set the x-placement attribute before everything else because it could be used
   * to add margins to the popper margins needs to be calculated to get the
   * correct popper offsets.
   * @method
   * @memberof Popper.modifiers
   * @param {HTMLElement} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper
   * @param {Object} options - Popper.js options
   */
  function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
    // compute reference element offsets
    var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

    popper.setAttribute('x-placement', placement);

    // Apply `position` to popper before anything else because
    // without the position applied we can't guarantee correct computations
    setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

    return options;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeStyle(data, options) {
    var x = options.x,
        y = options.y;
    var popper = data.offsets.popper;

    // Remove this legacy support in Popper.js v2

    var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
      return modifier.name === 'applyStyle';
    }).gpuAcceleration;
    if (legacyGpuAccelerationOption !== undefined) {
      console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
    }
    var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

    var offsetParent = getOffsetParent(data.instance.popper);
    var offsetParentRect = getBoundingClientRect(offsetParent);

    // Styles
    var styles = {
      position: popper.position
    };

    // Avoid blurry text by using full pixel integers.
    // For pixel-perfect positioning, top/bottom prefers rounded
    // values, while left/right prefers floored values.
    var offsets = {
      left: Math.floor(popper.left),
      top: Math.round(popper.top),
      bottom: Math.round(popper.bottom),
      right: Math.floor(popper.right)
    };

    var sideA = x === 'bottom' ? 'top' : 'bottom';
    var sideB = y === 'right' ? 'left' : 'right';

    // if gpuAcceleration is set to `true` and transform is supported,
    //  we use `translate3d` to apply the position to the popper we
    // automatically use the supported prefixed version if needed
    var prefixedProperty = getSupportedPropertyName('transform');

    // now, let's make a step back and look at this code closely (wtf?)
    // If the content of the popper grows once it's been positioned, it
    // may happen that the popper gets misplaced because of the new content
    // overflowing its reference element
    // To avoid this problem, we provide two options (x and y), which allow
    // the consumer to define the offset origin.
    // If we position a popper on top of a reference element, we can set
    // `x` to `top` to make the popper grow towards its top instead of
    // its bottom.
    var left = void 0,
        top = void 0;
    if (sideA === 'bottom') {
      top = -offsetParentRect.height + offsets.bottom;
    } else {
      top = offsets.top;
    }
    if (sideB === 'right') {
      left = -offsetParentRect.width + offsets.right;
    } else {
      left = offsets.left;
    }
    if (gpuAcceleration && prefixedProperty) {
      styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
      styles[sideA] = 0;
      styles[sideB] = 0;
      styles.willChange = 'transform';
    } else {
      // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
      var invertTop = sideA === 'bottom' ? -1 : 1;
      var invertLeft = sideB === 'right' ? -1 : 1;
      styles[sideA] = top * invertTop;
      styles[sideB] = left * invertLeft;
      styles.willChange = sideA + ', ' + sideB;
    }

    // Attributes
    var attributes = {
      'x-placement': data.placement
    };

    // Update `data` attributes, styles and arrowStyles
    data.attributes = _extends$1({}, attributes, data.attributes);
    data.styles = _extends$1({}, styles, data.styles);
    data.arrowStyles = _extends$1({}, data.offsets.arrow, data.arrowStyles);

    return data;
  }

  /**
   * Helper used to know if the given modifier depends from another one.<br />
   * It checks if the needed modifier is listed and enabled.
   * @method
   * @memberof Popper.Utils
   * @param {Array} modifiers - list of modifiers
   * @param {String} requestingName - name of requesting modifier
   * @param {String} requestedName - name of requested modifier
   * @returns {Boolean}
   */
  function isModifierRequired(modifiers, requestingName, requestedName) {
    var requesting = find(modifiers, function (_ref) {
      var name = _ref.name;
      return name === requestingName;
    });

    var isRequired = !!requesting && modifiers.some(function (modifier) {
      return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
    });

    if (!isRequired) {
      var _requesting = '`' + requestingName + '`';
      var requested = '`' + requestedName + '`';
      console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
    }
    return isRequired;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function arrow(data, options) {
    var _data$offsets$arrow;

    // arrow depends on keepTogether in order to work
    if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
      return data;
    }

    var arrowElement = options.element;

    // if arrowElement is a string, suppose it's a CSS selector
    if (typeof arrowElement === 'string') {
      arrowElement = data.instance.popper.querySelector(arrowElement);

      // if arrowElement is not found, don't run the modifier
      if (!arrowElement) {
        return data;
      }
    } else {
      // if the arrowElement isn't a query selector we must check that the
      // provided DOM node is child of its popper node
      if (!data.instance.popper.contains(arrowElement)) {
        console.warn('WARNING: `arrow.element` must be child of its popper element!');
        return data;
      }
    }

    var placement = data.placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var isVertical = ['left', 'right'].indexOf(placement) !== -1;

    var len = isVertical ? 'height' : 'width';
    var sideCapitalized = isVertical ? 'Top' : 'Left';
    var side = sideCapitalized.toLowerCase();
    var altSide = isVertical ? 'left' : 'top';
    var opSide = isVertical ? 'bottom' : 'right';
    var arrowElementSize = getOuterSizes(arrowElement)[len];

    //
    // extends keepTogether behavior making sure the popper and its
    // reference have enough pixels in conjuction
    //

    // top/left side
    if (reference[opSide] - arrowElementSize < popper[side]) {
      data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
    }
    // bottom/right side
    if (reference[side] + arrowElementSize > popper[opSide]) {
      data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
    }
    data.offsets.popper = getClientRect(data.offsets.popper);

    // compute center of the popper
    var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

    // Compute the sideValue using the updated popper offsets
    // take popper margin in account because we don't have this info available
    var css = getStyleComputedProperty(data.instance.popper);
    var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
    var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
    var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

    // prevent arrowElement from being placed not contiguously to its popper
    sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

    data.arrowElement = arrowElement;
    data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty$1(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty$1(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

    return data;
  }

  /**
   * Get the opposite placement variation of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement variation
   * @returns {String} flipped placement variation
   */
  function getOppositeVariation(variation) {
    if (variation === 'end') {
      return 'start';
    } else if (variation === 'start') {
      return 'end';
    }
    return variation;
  }

  /**
   * List of accepted placements to use as values of the `placement` option.<br />
   * Valid placements are:
   * - `auto`
   * - `top`
   * - `right`
   * - `bottom`
   * - `left`
   *
   * Each placement can have a variation from this list:
   * - `-start`
   * - `-end`
   *
   * Variations are interpreted easily if you think of them as the left to right
   * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
   * is right.<br />
   * Vertically (`left` and `right`), `start` is top and `end` is bottom.
   *
   * Some valid examples are:
   * - `top-end` (on top of reference, right aligned)
   * - `right-start` (on right of reference, top aligned)
   * - `bottom` (on bottom, centered)
   * - `auto-right` (on the side with more space available, alignment depends by placement)
   *
   * @static
   * @type {Array}
   * @enum {String}
   * @readonly
   * @method placements
   * @memberof Popper
   */
  var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

  // Get rid of `auto` `auto-start` and `auto-end`
  var validPlacements = placements.slice(3);

  /**
   * Given an initial placement, returns all the subsequent placements
   * clockwise (or counter-clockwise).
   *
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement - A valid placement (it accepts variations)
   * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
   * @returns {Array} placements including their variations
   */
  function clockwise(placement) {
    var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var index = validPlacements.indexOf(placement);
    var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
    return counter ? arr.reverse() : arr;
  }

  var BEHAVIORS = {
    FLIP: 'flip',
    CLOCKWISE: 'clockwise',
    COUNTERCLOCKWISE: 'counterclockwise'
  };

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function flip(data, options) {
    // if `inner` modifier is enabled, we can't use the `flip` modifier
    if (isModifierEnabled(data.instance.modifiers, 'inner')) {
      return data;
    }

    if (data.flipped && data.placement === data.originalPlacement) {
      // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
      return data;
    }

    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

    var placement = data.placement.split('-')[0];
    var placementOpposite = getOppositePlacement(placement);
    var variation = data.placement.split('-')[1] || '';

    var flipOrder = [];

    switch (options.behavior) {
      case BEHAVIORS.FLIP:
        flipOrder = [placement, placementOpposite];
        break;
      case BEHAVIORS.CLOCKWISE:
        flipOrder = clockwise(placement);
        break;
      case BEHAVIORS.COUNTERCLOCKWISE:
        flipOrder = clockwise(placement, true);
        break;
      default:
        flipOrder = options.behavior;
    }

    flipOrder.forEach(function (step, index) {
      if (placement !== step || flipOrder.length === index + 1) {
        return data;
      }

      placement = data.placement.split('-')[0];
      placementOpposite = getOppositePlacement(placement);

      var popperOffsets = data.offsets.popper;
      var refOffsets = data.offsets.reference;

      // using floor because the reference offsets may contain decimals we are not going to consider here
      var floor = Math.floor;
      var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

      var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
      var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
      var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
      var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

      var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

      // flip the variation if required
      var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
      var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

      if (overlapsRef || overflowsBoundaries || flippedVariation) {
        // this boolean to detect any flip loop
        data.flipped = true;

        if (overlapsRef || overflowsBoundaries) {
          placement = flipOrder[index + 1];
        }

        if (flippedVariation) {
          variation = getOppositeVariation(variation);
        }

        data.placement = placement + (variation ? '-' + variation : '');

        // this object contains `position`, we want to preserve it along with
        // any additional property we may add in the future
        data.offsets.popper = _extends$1({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

        data = runModifiers(data.instance.modifiers, data, 'flip');
      }
    });
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function keepTogether(data) {
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var placement = data.placement.split('-')[0];
    var floor = Math.floor;
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var side = isVertical ? 'right' : 'bottom';
    var opSide = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    if (popper[side] < floor(reference[opSide])) {
      data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
    }
    if (popper[opSide] > floor(reference[side])) {
      data.offsets.popper[opSide] = floor(reference[side]);
    }

    return data;
  }

  /**
   * Converts a string containing value + unit into a px value number
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} str - Value + unit string
   * @argument {String} measurement - `height` or `width`
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @returns {Number|String}
   * Value in pixels, or original string if no values were extracted
   */
  function toValue(str, measurement, popperOffsets, referenceOffsets) {
    // separate value from unit
    var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
    var value = +split[1];
    var unit = split[2];

    // If it's not a number it's an operator, I guess
    if (!value) {
      return str;
    }

    if (unit.indexOf('%') === 0) {
      var element = void 0;
      switch (unit) {
        case '%p':
          element = popperOffsets;
          break;
        case '%':
        case '%r':
        default:
          element = referenceOffsets;
      }

      var rect = getClientRect(element);
      return rect[measurement] / 100 * value;
    } else if (unit === 'vh' || unit === 'vw') {
      // if is a vh or vw, we calculate the size based on the viewport
      var size = void 0;
      if (unit === 'vh') {
        size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      } else {
        size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      }
      return size / 100 * value;
    } else {
      // if is an explicit pixel unit, we get rid of the unit and keep the value
      // if is an implicit unit, it's px, and we return just the value
      return value;
    }
  }

  /**
   * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} offset
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @argument {String} basePlacement
   * @returns {Array} a two cells array with x and y offsets in numbers
   */
  function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
    var offsets = [0, 0];

    // Use height if placement is left or right and index is 0 otherwise use width
    // in this way the first offset will use an axis and the second one
    // will use the other one
    var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

    // Split the offset string to obtain a list of values and operands
    // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
    var fragments = offset.split(/(\+|\-)/).map(function (frag) {
      return frag.trim();
    });

    // Detect if the offset string contains a pair of values or a single one
    // they could be separated by comma or space
    var divider = fragments.indexOf(find(fragments, function (frag) {
      return frag.search(/,|\s/) !== -1;
    }));

    if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
      console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
    }

    // If divider is found, we divide the list of values and operands to divide
    // them by ofset X and Y.
    var splitRegex = /\s*,\s*|\s+/;
    var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

    // Convert the values with units to absolute pixels to allow our computations
    ops = ops.map(function (op, index) {
      // Most of the units rely on the orientation of the popper
      var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
      var mergeWithPrevious = false;
      return op
      // This aggregates any `+` or `-` sign that aren't considered operators
      // e.g.: 10 + +5 => [10, +, +5]
      .reduce(function (a, b) {
        if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
          a[a.length - 1] = b;
          mergeWithPrevious = true;
          return a;
        } else if (mergeWithPrevious) {
          a[a.length - 1] += b;
          mergeWithPrevious = false;
          return a;
        } else {
          return a.concat(b);
        }
      }, [])
      // Here we convert the string values into number values (in px)
      .map(function (str) {
        return toValue(str, measurement, popperOffsets, referenceOffsets);
      });
    });

    // Loop trough the offsets arrays and execute the operations
    ops.forEach(function (op, index) {
      op.forEach(function (frag, index2) {
        if (isNumeric(frag)) {
          offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
        }
      });
    });
    return offsets;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @argument {Number|String} options.offset=0
   * The offset value as described in the modifier description
   * @returns {Object} The data object, properly modified
   */
  function offset(data, _ref) {
    var offset = _ref.offset;
    var placement = data.placement,
        _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var basePlacement = placement.split('-')[0];

    var offsets = void 0;
    if (isNumeric(+offset)) {
      offsets = [+offset, 0];
    } else {
      offsets = parseOffset(offset, popper, reference, basePlacement);
    }

    if (basePlacement === 'left') {
      popper.top += offsets[0];
      popper.left -= offsets[1];
    } else if (basePlacement === 'right') {
      popper.top += offsets[0];
      popper.left += offsets[1];
    } else if (basePlacement === 'top') {
      popper.left += offsets[0];
      popper.top -= offsets[1];
    } else if (basePlacement === 'bottom') {
      popper.left += offsets[0];
      popper.top += offsets[1];
    }

    data.popper = popper;
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function preventOverflow(data, options) {
    var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

    // If offsetParent is the reference element, we really want to
    // go one step up and use the next offsetParent as reference to
    // avoid to make this modifier completely useless and look like broken
    if (data.instance.reference === boundariesElement) {
      boundariesElement = getOffsetParent(boundariesElement);
    }

    // NOTE: DOM access here
    // resets the popper's position so that the document size can be calculated excluding
    // the size of the popper element itself
    var transformProp = getSupportedPropertyName('transform');
    var popperStyles = data.instance.popper.style; // assignment to help minification
    var top = popperStyles.top,
        left = popperStyles.left,
        transform = popperStyles[transformProp];

    popperStyles.top = '';
    popperStyles.left = '';
    popperStyles[transformProp] = '';

    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

    // NOTE: DOM access here
    // restores the original style properties after the offsets have been computed
    popperStyles.top = top;
    popperStyles.left = left;
    popperStyles[transformProp] = transform;

    options.boundaries = boundaries;

    var order = options.priority;
    var popper = data.offsets.popper;

    var check = {
      primary: function primary(placement) {
        var value = popper[placement];
        if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
          value = Math.max(popper[placement], boundaries[placement]);
        }
        return defineProperty$1({}, placement, value);
      },
      secondary: function secondary(placement) {
        var mainSide = placement === 'right' ? 'left' : 'top';
        var value = popper[mainSide];
        if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
          value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
        }
        return defineProperty$1({}, mainSide, value);
      }
    };

    order.forEach(function (placement) {
      var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
      popper = _extends$1({}, popper, check[side](placement));
    });

    data.offsets.popper = popper;

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function shift(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var shiftvariation = placement.split('-')[1];

    // if shift shiftvariation is specified, run the modifier
    if (shiftvariation) {
      var _data$offsets = data.offsets,
          reference = _data$offsets.reference,
          popper = _data$offsets.popper;

      var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
      var side = isVertical ? 'left' : 'top';
      var measurement = isVertical ? 'width' : 'height';

      var shiftOffsets = {
        start: defineProperty$1({}, side, reference[side]),
        end: defineProperty$1({}, side, reference[side] + reference[measurement] - popper[measurement])
      };

      data.offsets.popper = _extends$1({}, popper, shiftOffsets[shiftvariation]);
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function hide(data) {
    if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
      return data;
    }

    var refRect = data.offsets.reference;
    var bound = find(data.instance.modifiers, function (modifier) {
      return modifier.name === 'preventOverflow';
    }).boundaries;

    if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === true) {
        return data;
      }

      data.hide = true;
      data.attributes['x-out-of-boundaries'] = '';
    } else {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === false) {
        return data;
      }

      data.hide = false;
      data.attributes['x-out-of-boundaries'] = false;
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function inner(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

    var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

    popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

    data.placement = getOppositePlacement(placement);
    data.offsets.popper = getClientRect(popper);

    return data;
  }

  /**
   * Modifier function, each modifier can have a function of this type assigned
   * to its `fn` property.<br />
   * These functions will be called on each update, this means that you must
   * make sure they are performant enough to avoid performance bottlenecks.
   *
   * @function ModifierFn
   * @argument {dataObject} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {dataObject} The data object, properly modified
   */

  /**
   * Modifiers are plugins used to alter the behavior of your poppers.<br />
   * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
   * needed by the library.
   *
   * Usually you don't want to override the `order`, `fn` and `onLoad` props.
   * All the other properties are configurations that could be tweaked.
   * @namespace modifiers
   */
  var modifiers = {
    /**
     * Modifier used to shift the popper on the start or end of its reference
     * element.<br />
     * It will read the variation of the `placement` property.<br />
     * It can be one either `-end` or `-start`.
     * @memberof modifiers
     * @inner
     */
    shift: {
      /** @prop {number} order=100 - Index used to define the order of execution */
      order: 100,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: shift
    },

    /**
     * The `offset` modifier can shift your popper on both its axis.
     *
     * It accepts the following units:
     * - `px` or unitless, interpreted as pixels
     * - `%` or `%r`, percentage relative to the length of the reference element
     * - `%p`, percentage relative to the length of the popper element
     * - `vw`, CSS viewport width unit
     * - `vh`, CSS viewport height unit
     *
     * For length is intended the main axis relative to the placement of the popper.<br />
     * This means that if the placement is `top` or `bottom`, the length will be the
     * `width`. In case of `left` or `right`, it will be the height.
     *
     * You can provide a single value (as `Number` or `String`), or a pair of values
     * as `String` divided by a comma or one (or more) white spaces.<br />
     * The latter is a deprecated method because it leads to confusion and will be
     * removed in v2.<br />
     * Additionally, it accepts additions and subtractions between different units.
     * Note that multiplications and divisions aren't supported.
     *
     * Valid examples are:
     * ```
     * 10
     * '10%'
     * '10, 10'
     * '10%, 10'
     * '10 + 10%'
     * '10 - 5vh + 3%'
     * '-10px + 5vh, 5px - 6%'
     * ```
     * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
     * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
     * > More on this [reading this issue](https://github.com/FezVrasta/popper.js/issues/373)
     *
     * @memberof modifiers
     * @inner
     */
    offset: {
      /** @prop {number} order=200 - Index used to define the order of execution */
      order: 200,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: offset,
      /** @prop {Number|String} offset=0
       * The offset value as described in the modifier description
       */
      offset: 0
    },

    /**
     * Modifier used to prevent the popper from being positioned outside the boundary.
     *
     * An scenario exists where the reference itself is not within the boundaries.<br />
     * We can say it has "escaped the boundaries" — or just "escaped".<br />
     * In this case we need to decide whether the popper should either:
     *
     * - detach from the reference and remain "trapped" in the boundaries, or
     * - if it should ignore the boundary and "escape with its reference"
     *
     * When `escapeWithReference` is set to`true` and reference is completely
     * outside its boundaries, the popper will overflow (or completely leave)
     * the boundaries in order to remain attached to the edge of the reference.
     *
     * @memberof modifiers
     * @inner
     */
    preventOverflow: {
      /** @prop {number} order=300 - Index used to define the order of execution */
      order: 300,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: preventOverflow,
      /**
       * @prop {Array} [priority=['left','right','top','bottom']]
       * Popper will try to prevent overflow following these priorities by default,
       * then, it could overflow on the left and on top of the `boundariesElement`
       */
      priority: ['left', 'right', 'top', 'bottom'],
      /**
       * @prop {number} padding=5
       * Amount of pixel used to define a minimum distance between the boundaries
       * and the popper this makes sure the popper has always a little padding
       * between the edges of its container
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='scrollParent'
       * Boundaries used by the modifier, can be `scrollParent`, `window`,
       * `viewport` or any DOM element.
       */
      boundariesElement: 'scrollParent'
    },

    /**
     * Modifier used to make sure the reference and its popper stay near eachothers
     * without leaving any gap between the two. Expecially useful when the arrow is
     * enabled and you want to assure it to point to its reference element.
     * It cares only about the first axis, you can still have poppers with margin
     * between the popper and its reference element.
     * @memberof modifiers
     * @inner
     */
    keepTogether: {
      /** @prop {number} order=400 - Index used to define the order of execution */
      order: 400,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: keepTogether
    },

    /**
     * This modifier is used to move the `arrowElement` of the popper to make
     * sure it is positioned between the reference element and its popper element.
     * It will read the outer size of the `arrowElement` node to detect how many
     * pixels of conjuction are needed.
     *
     * It has no effect if no `arrowElement` is provided.
     * @memberof modifiers
     * @inner
     */
    arrow: {
      /** @prop {number} order=500 - Index used to define the order of execution */
      order: 500,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: arrow,
      /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
      element: '[x-arrow]'
    },

    /**
     * Modifier used to flip the popper's placement when it starts to overlap its
     * reference element.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     *
     * **NOTE:** this modifier will interrupt the current update cycle and will
     * restart it if it detects the need to flip the placement.
     * @memberof modifiers
     * @inner
     */
    flip: {
      /** @prop {number} order=600 - Index used to define the order of execution */
      order: 600,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: flip,
      /**
       * @prop {String|Array} behavior='flip'
       * The behavior used to change the popper's placement. It can be one of
       * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
       * placements (with optional variations).
       */
      behavior: 'flip',
      /**
       * @prop {number} padding=5
       * The popper will flip if it hits the edges of the `boundariesElement`
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='viewport'
       * The element which will define the boundaries of the popper position,
       * the popper will never be placed outside of the defined boundaries
       * (except if keepTogether is enabled)
       */
      boundariesElement: 'viewport'
    },

    /**
     * Modifier used to make the popper flow toward the inner of the reference element.
     * By default, when this modifier is disabled, the popper will be placed outside
     * the reference element.
     * @memberof modifiers
     * @inner
     */
    inner: {
      /** @prop {number} order=700 - Index used to define the order of execution */
      order: 700,
      /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
      enabled: false,
      /** @prop {ModifierFn} */
      fn: inner
    },

    /**
     * Modifier used to hide the popper when its reference element is outside of the
     * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
     * be used to hide with a CSS selector the popper when its reference is
     * out of boundaries.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     * @memberof modifiers
     * @inner
     */
    hide: {
      /** @prop {number} order=800 - Index used to define the order of execution */
      order: 800,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: hide
    },

    /**
     * Computes the style that will be applied to the popper element to gets
     * properly positioned.
     *
     * Note that this modifier will not touch the DOM, it just prepares the styles
     * so that `applyStyle` modifier can apply it. This separation is useful
     * in case you need to replace `applyStyle` with a custom implementation.
     *
     * This modifier has `850` as `order` value to maintain backward compatibility
     * with previous versions of Popper.js. Expect the modifiers ordering method
     * to change in future major versions of the library.
     *
     * @memberof modifiers
     * @inner
     */
    computeStyle: {
      /** @prop {number} order=850 - Index used to define the order of execution */
      order: 850,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: computeStyle,
      /**
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3d transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties.
       */
      gpuAcceleration: true,
      /**
       * @prop {string} [x='bottom']
       * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
       * Change this if your popper should grow in a direction different from `bottom`
       */
      x: 'bottom',
      /**
       * @prop {string} [x='left']
       * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
       * Change this if your popper should grow in a direction different from `right`
       */
      y: 'right'
    },

    /**
     * Applies the computed styles to the popper element.
     *
     * All the DOM manipulations are limited to this modifier. This is useful in case
     * you want to integrate Popper.js inside a framework or view library and you
     * want to delegate all the DOM manipulations to it.
     *
     * Note that if you disable this modifier, you must make sure the popper element
     * has its position set to `absolute` before Popper.js can do its work!
     *
     * Just disable this modifier and define you own to achieve the desired effect.
     *
     * @memberof modifiers
     * @inner
     */
    applyStyle: {
      /** @prop {number} order=900 - Index used to define the order of execution */
      order: 900,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: applyStyle,
      /** @prop {Function} */
      onLoad: applyStyleOnLoad,
      /**
       * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3d transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties.
       */
      gpuAcceleration: undefined
    }
  };

  /**
   * The `dataObject` is an object containing all the informations used by Popper.js
   * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
   * @name dataObject
   * @property {Object} data.instance The Popper.js instance
   * @property {String} data.placement Placement applied to popper
   * @property {String} data.originalPlacement Placement originally defined on init
   * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
   * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
   * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
   * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow, it expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.boundaries Offsets of the popper boundaries
   * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
   * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
   */

  /**
   * Default options provided to Popper.js constructor.<br />
   * These can be overriden using the `options` argument of Popper.js.<br />
   * To override an option, simply pass as 3rd argument an object with the same
   * structure of this object, example:
   * ```
   * new Popper(ref, pop, {
   *   modifiers: {
   *     preventOverflow: { enabled: false }
   *   }
   * })
   * ```
   * @type {Object}
   * @static
   * @memberof Popper
   */
  var Defaults = {
    /**
     * Popper's placement
     * @prop {Popper.placements} placement='bottom'
     */
    placement: 'bottom',

    /**
     * Set this to true if you want popper to position it self in 'fixed' mode
     * @prop {Boolean} positionFixed=false
     */
    positionFixed: false,

    /**
     * Whether events (resize, scroll) are initially enabled
     * @prop {Boolean} eventsEnabled=true
     */
    eventsEnabled: true,

    /**
     * Set to true if you want to automatically remove the popper when
     * you call the `destroy` method.
     * @prop {Boolean} removeOnDestroy=false
     */
    removeOnDestroy: false,

    /**
     * Callback called when the popper is created.<br />
     * By default, is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onCreate}
     */
    onCreate: function onCreate() {},

    /**
     * Callback called when the popper is updated, this callback is not called
     * on the initialization/creation of the popper, but only on subsequent
     * updates.<br />
     * By default, is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onUpdate}
     */
    onUpdate: function onUpdate() {},

    /**
     * List of modifiers used to modify the offsets before they are applied to the popper.
     * They provide most of the functionalities of Popper.js
     * @prop {modifiers}
     */
    modifiers: modifiers
  };

  /**
   * @callback onCreate
   * @param {dataObject} data
   */

  /**
   * @callback onUpdate
   * @param {dataObject} data
   */

  // Utils
  // Methods
  var Popper = function () {
    /**
     * Create a new Popper.js instance
     * @class Popper
     * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
     * @param {HTMLElement} popper - The HTML element used as popper.
     * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
     * @return {Object} instance - The generated Popper.js instance
     */
    function Popper(reference, popper) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      classCallCheck$1(this, Popper);

      this.scheduleUpdate = function () {
        return requestAnimationFrame(_this.update);
      };

      // make update() debounced, so that it only runs at most once-per-tick
      this.update = debounce(this.update.bind(this));

      // with {} we create a new object with the options inside it
      this.options = _extends$1({}, Popper.Defaults, options);

      // init state
      this.state = {
        isDestroyed: false,
        isCreated: false,
        scrollParents: []
      };

      // get reference and popper elements (allow jQuery wrappers)
      this.reference = reference && reference.jquery ? reference[0] : reference;
      this.popper = popper && popper.jquery ? popper[0] : popper;

      // Deep merge modifiers options
      this.options.modifiers = {};
      Object.keys(_extends$1({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
        _this.options.modifiers[name] = _extends$1({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
      });

      // Refactoring modifiers' list (Object => Array)
      this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
        return _extends$1({
          name: name
        }, _this.options.modifiers[name]);
      })
      // sort the modifiers by order
      .sort(function (a, b) {
        return a.order - b.order;
      });

      // modifiers have the ability to execute arbitrary code when Popper.js get inited
      // such code is executed in the same order of its modifier
      // they could add new properties to their options configuration
      // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
      this.modifiers.forEach(function (modifierOptions) {
        if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
          modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
        }
      });

      // fire the first update to position the popper in the right place
      this.update();

      var eventsEnabled = this.options.eventsEnabled;
      if (eventsEnabled) {
        // setup event listeners, they will take care of update the position in specific situations
        this.enableEventListeners();
      }

      this.state.eventsEnabled = eventsEnabled;
    }

    // We can't use class properties because they don't get listed in the
    // class prototype and break stuff like Sinon stubs


    createClass$1(Popper, [{
      key: 'update',
      value: function update$$1() {
        return update.call(this);
      }
    }, {
      key: 'destroy',
      value: function destroy$$1() {
        return destroy.call(this);
      }
    }, {
      key: 'enableEventListeners',
      value: function enableEventListeners$$1() {
        return enableEventListeners.call(this);
      }
    }, {
      key: 'disableEventListeners',
      value: function disableEventListeners$$1() {
        return disableEventListeners.call(this);
      }

      /**
       * Schedule an update, it will run on the next UI update available
       * @method scheduleUpdate
       * @memberof Popper
       */

      /**
       * Collection of utilities useful when writing custom modifiers.
       * Starting from version 1.7, this method is available only if you
       * include `popper-utils.js` before `popper.js`.
       *
       * **DEPRECATION**: This way to access PopperUtils is deprecated
       * and will be removed in v2! Use the PopperUtils module directly instead.
       * Due to the high instability of the methods contained in Utils, we can't
       * guarantee them to follow semver. Use them at your own risk!
       * @static
       * @private
       * @type {Object}
       * @deprecated since version 1.8
       * @member Utils
       * @memberof Popper
       */

    }]);
    return Popper;
  }();

  /**
   * The `referenceObject` is an object that provides an interface compatible with Popper.js
   * and lets you use it as replacement of a real DOM node.<br />
   * You can use this method to position a popper relatively to a set of coordinates
   * in case you don't have a DOM node to use as reference.
   *
   * ```
   * new Popper(referenceObject, popperNode);
   * ```
   *
   * NB: This feature isn't supported in Internet Explorer 10
   * @name referenceObject
   * @property {Function} data.getBoundingClientRect
   * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
   * @property {number} data.clientWidth
   * An ES6 getter that will return the width of the virtual reference element.
   * @property {number} data.clientHeight
   * An ES6 getter that will return the height of the virtual reference element.
   */

  Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
  Popper.placements = placements;
  Popper.Defaults = Defaults;

  /**
   * Triggers document reflow.
   * Use void because some minifiers or engines think simply accessing the property
   * is unnecessary.
   * @param {Element} popper
   */
  function reflow(popper) {
    void popper.offsetHeight;
  }

  /**
   * Wrapper util for popper position updating.
   * Updates the popper's position and invokes the callback on update.
   * Hackish workaround until Popper 2.0's update() becomes sync.
   * @param {Popper} popperInstance
   * @param {Function} callback: to run once popper's position was updated
   * @param {Boolean} updateAlreadyCalled: was scheduleUpdate() already called?
   */
  function updatePopperPosition(popperInstance, callback, updateAlreadyCalled) {
    var popper = popperInstance.popper,
        options = popperInstance.options;

    var onCreate = options.onCreate;
    var onUpdate = options.onUpdate;

    options.onCreate = options.onUpdate = function () {
      reflow(popper), callback && callback(), onUpdate();
      options.onCreate = onCreate;
      options.onUpdate = onUpdate;
    };

    if (!updateAlreadyCalled) {
      popperInstance.scheduleUpdate();
    }
  }

  /**
   * Returns the core placement ('top', 'bottom', 'left', 'right') of a popper
   * @param {Element} popper
   * @return {String}
   */
  function getPopperPlacement(popper) {
    return popper.getAttribute('x-placement').replace(/-.+/, '');
  }

  /**
   * Determines if the mouse's cursor is outside the interactive border
   * @param {MouseEvent} event
   * @param {Element} popper
   * @param {Object} options
   * @return {Boolean}
   */
  function cursorIsOutsideInteractiveBorder(event, popper, options) {
    if (!popper.getAttribute('x-placement')) return true;

    var x = event.clientX,
        y = event.clientY;
    var interactiveBorder = options.interactiveBorder,
        distance = options.distance;

    var rect = popper.getBoundingClientRect();
    var placement = getPopperPlacement(popper);
    var borderWithDistance = interactiveBorder + distance;

    var exceeds = {
      top: rect.top - y > interactiveBorder,
      bottom: y - rect.bottom > interactiveBorder,
      left: rect.left - x > interactiveBorder,
      right: x - rect.right > interactiveBorder
    };

    switch (placement) {
      case 'top':
        exceeds.top = rect.top - y > borderWithDistance;
        break;
      case 'bottom':
        exceeds.bottom = y - rect.bottom > borderWithDistance;
        break;
      case 'left':
        exceeds.left = rect.left - x > borderWithDistance;
        break;
      case 'right':
        exceeds.right = x - rect.right > borderWithDistance;
        break;
    }

    return exceeds.top || exceeds.bottom || exceeds.left || exceeds.right;
  }

  /**
   * Transforms the `arrowTransform` numbers based on the placement axis
   * @param {String} type 'scale' or 'translate'
   * @param {Number[]} numbers
   * @param {Boolean} isVertical
   * @param {Boolean} isReverse
   * @return {String}
   */
  function transformNumbersBasedOnPlacementAxis(type, numbers, isVertical, isReverse) {
    if (!numbers.length) return '';

    var transforms = {
      scale: function () {
        if (numbers.length === 1) {
          return '' + numbers[0];
        } else {
          return isVertical ? numbers[0] + ', ' + numbers[1] : numbers[1] + ', ' + numbers[0];
        }
      }(),
      translate: function () {
        if (numbers.length === 1) {
          return isReverse ? -numbers[0] + 'px' : numbers[0] + 'px';
        } else {
          if (isVertical) {
            return isReverse ? numbers[0] + 'px, ' + -numbers[1] + 'px' : numbers[0] + 'px, ' + numbers[1] + 'px';
          } else {
            return isReverse ? -numbers[1] + 'px, ' + numbers[0] + 'px' : numbers[1] + 'px, ' + numbers[0] + 'px';
          }
        }
      }()
    };

    return transforms[type];
  }

  /**
   * Transforms the `arrowTransform` x or y axis based on the placement axis
   * @param {String} axis 'X', 'Y', ''
   * @param {Boolean} isVertical
   * @return {String}
   */
  function transformAxis(axis, isVertical) {
    if (!axis) return '';
    var map = {
      X: 'Y',
      Y: 'X'
    };
    return isVertical ? axis : map[axis];
  }

  /**
   * Computes and applies the necessary arrow transform
   * @param {Element} popper
   * @param {Element} arrow
   * @param {String} arrowTransform
   */
  function computeArrowTransform(popper, arrow, arrowTransform) {
    var placement = getPopperPlacement(popper);
    var isVertical = placement === 'top' || placement === 'bottom';
    var isReverse = placement === 'right' || placement === 'bottom';

    var getAxis = function getAxis(re) {
      var match = arrowTransform.match(re);
      return match ? match[1] : '';
    };

    var getNumbers = function getNumbers(re) {
      var match = arrowTransform.match(re);
      return match ? match[1].split(',').map(parseFloat) : [];
    };

    var re = {
      translate: /translateX?Y?\(([^)]+)\)/,
      scale: /scaleX?Y?\(([^)]+)\)/
    };

    var matches = {
      translate: {
        axis: getAxis(/translate([XY])/),
        numbers: getNumbers(re.translate)
      },
      scale: {
        axis: getAxis(/scale([XY])/),
        numbers: getNumbers(re.scale)
      }
    };

    var computedTransform = arrowTransform.replace(re.translate, 'translate' + transformAxis(matches.translate.axis, isVertical) + '(' + transformNumbersBasedOnPlacementAxis('translate', matches.translate.numbers, isVertical, isReverse) + ')').replace(re.scale, 'scale' + transformAxis(matches.scale.axis, isVertical) + '(' + transformNumbersBasedOnPlacementAxis('scale', matches.scale.numbers, isVertical, isReverse) + ')');

    arrow.style[prefix('transform')] = computedTransform;
  }

  /**
   * Returns the distance taking into account the default distance due to
   * the transform: translate setting in CSS
   * @param {Number} distance
   * @return {String}
   */
  function getOffsetDistanceInPx(distance) {
    return -(distance - defaults.distance) + 'px';
  }

  /**
   * Waits until next repaint to execute a fn
   * @param {Function} fn
   */
  function defer(fn) {
    requestAnimationFrame(function () {
      setTimeout(fn, 1);
    });
  }

  var matches = {};

  if (isBrowser) {
    var e = Element.prototype;
    matches = e.matches || e.matchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector || function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s);
      var i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {} // eslint-disable-line no-empty
      return i > -1;
    };
  }

  var matches$1 = matches;

  /**
   * Ponyfill to get the closest parent element
   * @param {Element} element - child of parent to be returned
   * @param {String} parentSelector - selector to match the parent if found
   * @return {Element}
   */
  function closest(element, parentSelector) {
    var fn = Element.prototype.closest || function (selector) {
      var el = this;
      while (el) {
        if (matches$1.call(el, selector)) {
          return el;
        }
        el = el.parentElement;
      }
    };

    return fn.call(element, parentSelector);
  }

  /**
   * Returns the value taking into account the value being either a number or array
   * @param {Number|Array} value
   * @param {Number} index
   * @return {Number}
   */
  function getValue(value, index) {
    return Array.isArray(value) ? value[index] : value;
  }

  /**
   * Sets the visibility state of an element for transition to begin
   * @param {Element[]} els - array of elements
   * @param {String} type - 'visible' or 'hidden'
   */
  function setVisibilityState(els, type) {
    els.forEach(function (el) {
      if (!el) return;
      el.setAttribute('data-state', type);
    });
  }

  /**
   * Sets the transition property to each element
   * @param {Element[]} els - Array of elements
   * @param {String} value
   */
  function applyTransitionDuration(els, value) {
    els.filter(Boolean).forEach(function (el) {
      el.style[prefix('transitionDuration')] = value + 'ms';
    });
  }

  /**
   * Focuses an element while preventing a scroll jump if it's not entirely within the viewport
   * @param {Element} el
   */
  function focus(el) {
    var x = window.scrollX || window.pageXOffset;
    var y = window.scrollY || window.pageYOffset;
    el.focus();
    scroll(x, y);
  }

  var key = {};
  var store = function store(data) {
    return function (k) {
      return k === key && data;
    };
  };

  var Tippy = function () {
    function Tippy(config) {
      classCallCheck(this, Tippy);

      for (var _key in config) {
        this[_key] = config[_key];
      }

      this.state = {
        destroyed: false,
        visible: false,
        enabled: true
      };

      this._ = store({
        mutationObservers: []
      });
    }

    /**
     * Enables the tooltip to allow it to show or hide
     * @memberof Tippy
     * @public
     */

    createClass(Tippy, [{
      key: 'enable',
      value: function enable() {
        this.state.enabled = true;
      }

      /**
       * Disables the tooltip from showing or hiding, but does not destroy it
       * @memberof Tippy
       * @public
       */

    }, {
      key: 'disable',
      value: function disable() {
        this.state.enabled = false;
      }

      /**
       * Shows the tooltip
       * @param {Number} duration in milliseconds
       * @memberof Tippy
       * @public
       */

    }, {
      key: 'show',
      value: function show(duration) {
        var _this = this;

        if (this.state.destroyed || !this.state.enabled) return;

        var popper = this.popper,
            reference = this.reference,
            options = this.options;

        var _getInnerElements = getInnerElements(popper),
            tooltip = _getInnerElements.tooltip,
            backdrop = _getInnerElements.backdrop,
            content = _getInnerElements.content;

        // If the `dynamicTitle` option is true, the instance is allowed
        // to be created with an empty title. Make sure that the tooltip
        // content is not empty before showing it


        if (options.dynamicTitle && !reference.getAttribute('data-original-title')) {
          return;
        }

        // Do not show tooltip if reference contains 'disabled' attribute. FF fix for #221
        if (reference.hasAttribute('disabled')) return;

        // Destroy tooltip if the reference element is no longer on the DOM
        if (!reference.refObj && !document.documentElement.contains(reference)) {
          this.destroy();
          return;
        }

        options.onShow.call(popper, this);

        duration = getValue(duration !== undefined ? duration : options.duration, 0);

        // Prevent a transition when popper changes position
        applyTransitionDuration([popper, tooltip, backdrop], 0);

        popper.style.visibility = 'visible';
        this.state.visible = true;

        _mount.call(this, function () {
          if (!_this.state.visible) return;

          if (!_hasFollowCursorBehavior.call(_this)) {
            // FIX: Arrow will sometimes not be positioned correctly. Force another update.
            _this.popperInstance.scheduleUpdate();
          }

          // Set initial position near the cursor
          if (_hasFollowCursorBehavior.call(_this)) {
            _this.popperInstance.disableEventListeners();
            var delay = getValue(options.delay, 0);
            var lastTriggerEvent = _this._(key).lastTriggerEvent;
            if (lastTriggerEvent) {
              _this._(key).followCursorListener(delay && _this._(key).lastMouseMoveEvent ? _this._(key).lastMouseMoveEvent : lastTriggerEvent);
            }
          }

          // Re-apply transition durations
          applyTransitionDuration([tooltip, backdrop, backdrop ? content : null], duration);

          if (backdrop) {
            getComputedStyle(backdrop)[prefix('transform')];
          }

          if (options.interactive) {
            reference.classList.add('tippy-active');
          }

          if (options.sticky) {
            _makeSticky.call(_this);
          }

          setVisibilityState([tooltip, backdrop], 'visible');

          _onTransitionEnd.call(_this, duration, function () {
            if (!options.updateDuration) {
              tooltip.classList.add('tippy-notransition');
            }

            if (options.interactive) {
              focus(popper);
            }

            reference.setAttribute('aria-describedby', 'tippy-' + _this.id);

            options.onShown.call(popper, _this);
          });
        });
      }

      /**
       * Hides the tooltip
       * @param {Number} duration in milliseconds
       * @memberof Tippy
       * @public
       */

    }, {
      key: 'hide',
      value: function hide(duration) {
        var _this2 = this;

        if (this.state.destroyed || !this.state.enabled) return;

        var popper = this.popper,
            reference = this.reference,
            options = this.options;

        var _getInnerElements2 = getInnerElements(popper),
            tooltip = _getInnerElements2.tooltip,
            backdrop = _getInnerElements2.backdrop,
            content = _getInnerElements2.content;

        options.onHide.call(popper, this);

        duration = getValue(duration !== undefined ? duration : options.duration, 1);

        if (!options.updateDuration) {
          tooltip.classList.remove('tippy-notransition');
        }

        if (options.interactive) {
          reference.classList.remove('tippy-active');
        }

        popper.style.visibility = 'hidden';
        this.state.visible = false;

        applyTransitionDuration([tooltip, backdrop, backdrop ? content : null], duration);

        setVisibilityState([tooltip, backdrop], 'hidden');

        if (options.interactive && options.trigger.indexOf('click') > -1) {
          focus(reference);
        }

        /*
        * This call is deferred because sometimes when the tooltip is still transitioning in but hide()
        * is called before it finishes, the CSS transition won't reverse quickly enough, meaning
        * the CSS transition will finish 1-2 frames later, and onHidden() will run since the JS set it
        * more quickly. It should actually be onShown(). Seems to be something Chrome does, not Safari
        */
        defer(function () {
          _onTransitionEnd.call(_this2, duration, function () {
            if (_this2.state.visible || !options.appendTo.contains(popper)) return;

            if (!_this2._(key).isPreparingToShow) {
              document.removeEventListener('mousemove', _this2._(key).followCursorListener);
              _this2._(key).lastMouseMoveEvent = null;
            }

            if (_this2.popperInstance) {
              _this2.popperInstance.disableEventListeners();
            }

            reference.removeAttribute('aria-describedby');

            options.appendTo.removeChild(popper);

            options.onHidden.call(popper, _this2);
          });
        });
      }

      /**
       * Destroys the tooltip instance
       * @param {Boolean} destroyTargetInstances - relevant only when destroying delegates
       * @memberof Tippy
       * @public
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        var _this3 = this;

        var destroyTargetInstances = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (this.state.destroyed) return;

        // Ensure the popper is hidden
        if (this.state.visible) {
          this.hide(0);
        }

        this.listeners.forEach(function (listener) {
          _this3.reference.removeEventListener(listener.event, listener.handler);
        });

        // Restore title
        if (this.title) {
          this.reference.setAttribute('title', this.title);
        }

        delete this.reference._tippy;

        var attributes = ['data-original-title', 'data-tippy', 'data-tippy-delegate'];
        attributes.forEach(function (attr) {
          _this3.reference.removeAttribute(attr);
        });

        if (this.options.target && destroyTargetInstances) {
          toArray(this.reference.querySelectorAll(this.options.target)).forEach(function (child) {
            return child._tippy && child._tippy.destroy();
          });
        }

        if (this.popperInstance) {
          this.popperInstance.destroy();
        }

        this._(key).mutationObservers.forEach(function (observer) {
          observer.disconnect();
        });

        this.state.destroyed = true;
      }
    }]);
    return Tippy;
  }();

  /**
   * ------------------------------------------------------------------------
   * Private methods
   * ------------------------------------------------------------------------
   * Standalone functions to be called with the instance's `this` context to make
   * them truly private and not accessible on the prototype
   */

  /**
   * Determines if the tooltip instance has followCursor behavior
   * @return {Boolean}
   * @memberof Tippy
   * @private
   */
  function _hasFollowCursorBehavior() {
    var lastTriggerEvent = this._(key).lastTriggerEvent;
    return this.options.followCursor && !browser.usingTouch && lastTriggerEvent && lastTriggerEvent.type !== 'focus';
  }

  /**
   * Creates the Tippy instance for the child target of the delegate container
   * @param {Event} event
   * @memberof Tippy
   * @private
   */
  function _createDelegateChildTippy(event) {
    var targetEl = closest(event.target, this.options.target);
    if (targetEl && !targetEl._tippy) {
      var title = targetEl.getAttribute('title') || this.title;
      if (title) {
        targetEl.setAttribute('title', title);
        tippy$1(targetEl, _extends({}, this.options, { target: null }));
        _enter.call(targetEl._tippy, event);
      }
    }
  }

  /**
   * Method used by event listeners to invoke the show method, taking into account delays and
   * the `wait` option
   * @param {Event} event
   * @memberof Tippy
   * @private
   */
  function _enter(event) {
    var _this4 = this;

    var options = this.options;

    _clearDelayTimeouts.call(this);

    if (this.state.visible) return;

    // Is a delegate, create Tippy instance for the child target
    if (options.target) {
      _createDelegateChildTippy.call(this, event);
      return;
    }

    this._(key).isPreparingToShow = true;

    if (options.wait) {
      options.wait.call(this.popper, this.show.bind(this), event);
      return;
    }

    // If the tooltip has a delay, we need to be listening to the mousemove as soon as the trigger
    // event is fired so that it's in the correct position upon mount.
    if (_hasFollowCursorBehavior.call(this)) {
      if (!this._(key).followCursorListener) {
        _setFollowCursorListener.call(this);
      }

      var _getInnerElements3 = getInnerElements(this.popper),
          arrow = _getInnerElements3.arrow;

      if (arrow) arrow.style.margin = '0';
      document.addEventListener('mousemove', this._(key).followCursorListener);
    }

    var delay = getValue(options.delay, 0);

    if (delay) {
      this._(key).showTimeout = setTimeout(function () {
        _this4.show();
      }, delay);
    } else {
      this.show();
    }
  }

  /**
   * Method used by event listeners to invoke the hide method, taking into account delays
   * @memberof Tippy
   * @private
   */
  function _leave() {
    var _this5 = this;

    _clearDelayTimeouts.call(this);

    if (!this.state.visible) return;

    this._(key).isPreparingToShow = false;

    var delay = getValue(this.options.delay, 1);

    if (delay) {
      this._(key).hideTimeout = setTimeout(function () {
        if (_this5.state.visible) {
          _this5.hide();
        }
      }, delay);
    } else {
      this.hide();
    }
  }

  /**
   * Returns relevant listeners for the instance
   * @return {Object} of listeners
   * @memberof Tippy
   * @private
   */
  function _getEventListeners() {
    var _this6 = this;

    var onTrigger = function onTrigger(event) {
      if (!_this6.state.enabled) return;

      var shouldStopEvent = browser.supportsTouch && browser.usingTouch && ['mouseenter', 'mouseover', 'focus'].indexOf(event.type) > -1;

      if (shouldStopEvent && _this6.options.touchHold) return;

      _this6._(key).lastTriggerEvent = event;

      // Toggle show/hide when clicking click-triggered tooltips
      if (event.type === 'click' && _this6.options.hideOnClick !== 'persistent' && _this6.state.visible) {
        _leave.call(_this6);
      } else {
        _enter.call(_this6, event);
      }
    };

    var onMouseLeave = function onMouseLeave(event) {
      if (['mouseleave', 'mouseout'].indexOf(event.type) > -1 && browser.supportsTouch && browser.usingTouch && _this6.options.touchHold) return;

      if (_this6.options.interactive) {
        var hide = _leave.bind(_this6);

        var onMouseMove = function onMouseMove(event) {
          var referenceCursorIsOver = closest(event.target, selectors.REFERENCE);
          var cursorIsOverPopper = closest(event.target, selectors.POPPER) === _this6.popper;
          var cursorIsOverReference = referenceCursorIsOver === _this6.reference;

          if (cursorIsOverPopper || cursorIsOverReference) return;

          if (cursorIsOutsideInteractiveBorder(event, _this6.popper, _this6.options)) {
            document.body.removeEventListener('mouseleave', hide);
            document.removeEventListener('mousemove', onMouseMove);

            _leave.call(_this6, onMouseMove);
          }
        };

        document.body.addEventListener('mouseleave', hide);
        document.addEventListener('mousemove', onMouseMove);
        return;
      }

      _leave.call(_this6);
    };

    var onBlur = function onBlur(event) {
      if (event.target !== _this6.reference || browser.usingTouch) return;

      if (_this6.options.interactive) {
        if (!event.relatedTarget) return;
        if (closest(event.relatedTarget, selectors.POPPER)) return;
      }

      _leave.call(_this6);
    };

    var onDelegateShow = function onDelegateShow(event) {
      if (closest(event.target, _this6.options.target)) {
        _enter.call(_this6, event);
      }
    };

    var onDelegateHide = function onDelegateHide(event) {
      if (closest(event.target, _this6.options.target)) {
        _leave.call(_this6);
      }
    };

    return {
      onTrigger: onTrigger,
      onMouseLeave: onMouseLeave,
      onBlur: onBlur,
      onDelegateShow: onDelegateShow,
      onDelegateHide: onDelegateHide
    };
  }

  /**
   * Creates and returns a new popper instance
   * @return {Popper}
   * @memberof Tippy
   * @private
   */
  function _createPopperInstance() {
    var _this7 = this;

    var popper = this.popper,
        reference = this.reference,
        options = this.options;

    var _getInnerElements4 = getInnerElements(popper),
        tooltip = _getInnerElements4.tooltip;

    var popperOptions = options.popperOptions;

    var arrowSelector = options.arrowType === 'round' ? selectors.ROUND_ARROW : selectors.ARROW;
    var arrow = tooltip.querySelector(arrowSelector);

    var config = _extends({
      placement: options.placement
    }, popperOptions || {}, {
      modifiers: _extends({}, popperOptions ? popperOptions.modifiers : {}, {
        arrow: _extends({
          element: arrowSelector
        }, popperOptions && popperOptions.modifiers ? popperOptions.modifiers.arrow : {}),
        flip: _extends({
          enabled: options.flip,
          padding: options.distance + 5 /* 5px from viewport boundary */
          , behavior: options.flipBehavior
        }, popperOptions && popperOptions.modifiers ? popperOptions.modifiers.flip : {}),
        offset: _extends({
          offset: options.offset
        }, popperOptions && popperOptions.modifiers ? popperOptions.modifiers.offset : {})
      }),
      onCreate: function onCreate() {
        tooltip.style[getPopperPlacement(popper)] = getOffsetDistanceInPx(options.distance);

        if (arrow && options.arrowTransform) {
          computeArrowTransform(popper, arrow, options.arrowTransform);
        }
      },
      onUpdate: function onUpdate() {
        var styles = tooltip.style;
        styles.top = '';
        styles.bottom = '';
        styles.left = '';
        styles.right = '';
        styles[getPopperPlacement(popper)] = getOffsetDistanceInPx(options.distance);

        if (arrow && options.arrowTransform) {
          computeArrowTransform(popper, arrow, options.arrowTransform);
        }
      }
    });

    _addMutationObserver.call(this, {
      target: popper,
      callback: function callback() {
        _this7.popperInstance.update();
      },
      options: {
        childList: true,
        subtree: true,
        characterData: true
      }
    });

    return new Popper(reference, popper, config);
  }

  /**
   * Appends the popper element to the DOM, updating or creating the popper instance
   * @param {Function} callback
   * @memberof Tippy
   * @private
   */
  function _mount(callback) {
    var options = this.options;

    if (!this.popperInstance) {
      this.popperInstance = _createPopperInstance.call(this);
      if (!options.livePlacement) {
        this.popperInstance.disableEventListeners();
      }
    } else {
      this.popperInstance.scheduleUpdate();
      if (options.livePlacement && !_hasFollowCursorBehavior.call(this)) {
        this.popperInstance.enableEventListeners();
      }
    }

    // If the instance previously had followCursor behavior, it will be positioned incorrectly
    // if triggered by `focus` afterwards - update the reference back to the real DOM element
    if (!_hasFollowCursorBehavior.call(this)) {
      var _getInnerElements5 = getInnerElements(this.popper),
          arrow = _getInnerElements5.arrow;

      if (arrow) arrow.style.margin = '';
      this.popperInstance.reference = this.reference;
    }

    updatePopperPosition(this.popperInstance, callback, true);

    if (!options.appendTo.contains(this.popper)) {
      options.appendTo.appendChild(this.popper);
    }
  }

  /**
   * Clears the show and hide delay timeouts
   * @memberof Tippy
   * @private
   */
  function _clearDelayTimeouts() {
    var _ref = this._(key),
        showTimeout = _ref.showTimeout,
        hideTimeout = _ref.hideTimeout;

    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
  }

  /**
   * Sets the mousemove event listener function for `followCursor` option
   * @memberof Tippy
   * @private
   */
  function _setFollowCursorListener() {
    var _this8 = this;

    this._(key).followCursorListener = function (event) {
      var _$lastMouseMoveEvent = _this8._(key).lastMouseMoveEvent = event,
          clientX = _$lastMouseMoveEvent.clientX,
          clientY = _$lastMouseMoveEvent.clientY;

      if (!_this8.popperInstance) return;

      _this8.popperInstance.reference = {
        getBoundingClientRect: function getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            top: clientY,
            left: clientX,
            right: clientX,
            bottom: clientY
          };
        },
        clientWidth: 0,
        clientHeight: 0
      };

      _this8.popperInstance.scheduleUpdate();
    };
  }

  /**
   * Updates the popper's position on each animation frame
   * @memberof Tippy
   * @private
   */
  function _makeSticky() {
    var _this9 = this;

    var applyTransitionDuration$$1 = function applyTransitionDuration$$1() {
      _this9.popper.style[prefix('transitionDuration')] = _this9.options.updateDuration + 'ms';
    };

    var removeTransitionDuration = function removeTransitionDuration() {
      _this9.popper.style[prefix('transitionDuration')] = '';
    };

    var updatePosition = function updatePosition() {
      if (_this9.popperInstance) {
        _this9.popperInstance.update();
      }

      applyTransitionDuration$$1();

      if (_this9.state.visible) {
        requestAnimationFrame(updatePosition);
      } else {
        removeTransitionDuration();
      }
    };

    updatePosition();
  }

  /**
   * Adds a mutation observer to an element and stores it in the instance
   * @param {Object}
   * @memberof Tippy
   * @private
   */
  function _addMutationObserver(_ref2) {
    var target = _ref2.target,
        callback = _ref2.callback,
        options = _ref2.options;

    if (!window.MutationObserver) return;

    var observer = new MutationObserver(callback);
    observer.observe(target, options);

    this._(key).mutationObservers.push(observer);
  }

  /**
   * Fires the callback functions once the CSS transition ends for `show` and `hide` methods
   * @param {Number} duration
   * @param {Function} callback - callback function to fire once transition completes
   * @memberof Tippy
   * @private
   */
  function _onTransitionEnd(duration, callback) {
    // Make callback synchronous if duration is 0
    if (!duration) {
      return callback();
    }

    var _getInnerElements6 = getInnerElements(this.popper),
        tooltip = _getInnerElements6.tooltip;

    var toggleListeners = function toggleListeners(action, listener) {
      if (!listener) return;
      tooltip[action + 'EventListener']('ontransitionend' in window ? 'transitionend' : 'webkitTransitionEnd', listener);
    };

    var listener = function listener(e) {
      if (e.target === tooltip) {
        toggleListeners('remove', listener);
        callback();
      }
    };

    toggleListeners('remove', this._(key).transitionendListener);
    toggleListeners('add', listener);

    this._(key).transitionendListener = listener;
  }

  var idCounter = 1;

  /**
   * Creates tooltips for each reference element
   * @param {Element[]} els
   * @param {Object} config
   * @return {Tippy[]} Array of Tippy instances
   */
  function createTooltips(els, config) {
    return els.reduce(function (acc, reference) {
      var id = idCounter;

      var options = evaluateOptions(reference, config.performance ? config : getIndividualOptions(reference, config));

      var title = reference.getAttribute('title');

      // Don't create an instance when:
      // * the `title` attribute is falsy (null or empty string), and
      // * it's not a delegate for tooltips, and
      // * there is no html template specified, and
      // * `dynamicTitle` option is false
      if (!title && !options.target && !options.html && !options.dynamicTitle) {
        return acc;
      }

      // Delegates should be highlighted as different
      reference.setAttribute(options.target ? 'data-tippy-delegate' : 'data-tippy', '');

      removeTitle(reference);

      var popper = createPopperElement(id, title, options);

      var tippy = new Tippy({
        id: id,
        reference: reference,
        popper: popper,
        options: options,
        title: title,
        popperInstance: null
      });

      if (options.createPopperInstanceOnInit) {
        tippy.popperInstance = _createPopperInstance.call(tippy);
        tippy.popperInstance.disableEventListeners();
      }

      var listeners = _getEventListeners.call(tippy);
      tippy.listeners = options.trigger.trim().split(' ').reduce(function (acc, eventType) {
        return acc.concat(createTrigger(eventType, reference, listeners, options));
      }, []);

      // Update tooltip content whenever the title attribute on the reference changes
      if (options.dynamicTitle) {
        _addMutationObserver.call(tippy, {
          target: reference,
          callback: function callback() {
            var _getInnerElements = getInnerElements(popper),
                content = _getInnerElements.content;

            var title = reference.getAttribute('title');
            if (title) {
              content[options.allowTitleHTML ? 'innerHTML' : 'textContent'] = tippy.title = title;
              removeTitle(reference);
            }
          },

          options: {
            attributes: true
          }
        });
      }

      // Shortcuts
      reference._tippy = tippy;
      popper._tippy = tippy;
      popper._reference = reference;

      acc.push(tippy);

      idCounter++;

      return acc;
    }, []);
  }

  /**
   * Hides all poppers
   * @param {Tippy} excludeTippy - tippy to exclude if needed
   */
  function hideAllPoppers(excludeTippy) {
    var poppers = toArray(document.querySelectorAll(selectors.POPPER));

    poppers.forEach(function (popper) {
      var tippy = popper._tippy;
      if (!tippy) return;

      var options = tippy.options;

      if ((options.hideOnClick === true || options.trigger.indexOf('focus') > -1) && (!excludeTippy || popper !== excludeTippy.popper)) {
        tippy.hide();
      }
    });
  }

  /**
   * Adds the needed event listeners
   */
  function bindEventListeners() {
    var onDocumentTouch = function onDocumentTouch() {
      if (browser.usingTouch) return;

      browser.usingTouch = true;

      if (browser.iOS) {
        document.body.classList.add('tippy-touch');
      }

      if (browser.dynamicInputDetection && window.performance) {
        document.addEventListener('mousemove', onDocumentMouseMove);
      }

      browser.onUserInputChange('touch');
    };

    var onDocumentMouseMove = function () {
      var time = void 0;

      return function () {
        var now = performance.now();

        // Chrome 60+ is 1 mousemove per animation frame, use 20ms time difference
        if (now - time < 20) {
          browser.usingTouch = false;
          document.removeEventListener('mousemove', onDocumentMouseMove);
          if (!browser.iOS) {
            document.body.classList.remove('tippy-touch');
          }
          browser.onUserInputChange('mouse');
        }

        time = now;
      };
    }();

    var onDocumentClick = function onDocumentClick(event) {
      // Simulated events dispatched on the document
      if (!(event.target instanceof Element)) {
        return hideAllPoppers();
      }

      var reference = closest(event.target, selectors.REFERENCE);
      var popper = closest(event.target, selectors.POPPER);

      if (popper && popper._tippy && popper._tippy.options.interactive) {
        return;
      }

      if (reference && reference._tippy) {
        var options = reference._tippy.options;

        var isClickTrigger = options.trigger.indexOf('click') > -1;
        var isMultiple = options.multiple;

        // Hide all poppers except the one belonging to the element that was clicked
        if (!isMultiple && browser.usingTouch || !isMultiple && isClickTrigger) {
          return hideAllPoppers(reference._tippy);
        }

        if (options.hideOnClick !== true || isClickTrigger) {
          return;
        }
      }

      hideAllPoppers();
    };

    var onWindowBlur = function onWindowBlur() {
      var _document = document,
          el = _document.activeElement;

      if (el && el.blur && matches$1.call(el, selectors.REFERENCE)) {
        el.blur();
      }
    };

    var onWindowResize = function onWindowResize() {
      toArray(document.querySelectorAll(selectors.POPPER)).forEach(function (popper) {
        var tippyInstance = popper._tippy;
        if (tippyInstance && !tippyInstance.options.livePlacement) {
          tippyInstance.popperInstance.scheduleUpdate();
        }
      });
    };

    document.addEventListener('click', onDocumentClick);
    document.addEventListener('touchstart', onDocumentTouch);
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('resize', onWindowResize);

    if (!browser.supportsTouch && (navigator.maxTouchPoints || navigator.msMaxTouchPoints)) {
      document.addEventListener('pointerdown', onDocumentTouch);
    }
  }

  var eventListenersBound = false;

  /**
   * Exported module
   * @param {String|Element|Element[]|NodeList|Object} selector
   * @param {Object} options
   * @param {Boolean} one - create one tooltip
   * @return {Object}
   */
  function tippy$1(selector, options, one) {
    if (browser.supported && !eventListenersBound) {
      bindEventListeners();
      eventListenersBound = true;
    }

    if (isObjectLiteral(selector)) {
      polyfillVirtualReferenceProps(selector);
    }

    options = _extends({}, defaults, options);

    var references = getArrayOfElements(selector);
    var firstReference = references[0];

    return {
      selector: selector,
      options: options,
      tooltips: browser.supported ? createTooltips(one && firstReference ? [firstReference] : references, options) : [],
      destroyAll: function destroyAll() {
        this.tooltips.forEach(function (tooltip) {
          return tooltip.destroy();
        });
        this.tooltips = [];
      }
    };
  }

  tippy$1.version = version;
  tippy$1.browser = browser;
  tippy$1.defaults = defaults;
  tippy$1.one = function (selector, options) {
    return tippy$1(selector, options, true).tooltips[0];
  };
  tippy$1.disableAnimations = function () {
    defaults.updateDuration = defaults.duration = 0;
    defaults.animateFill = false;
  };

  return tippy$1;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[80])(80)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9kb21yZWFkeS9yZWFkeS5qcyIsIm5vZGVfbW9kdWxlcy9lbGVtZW50LWNsb3Nlc3QvZWxlbWVudC1jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvYmVoYXZpb3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvY29tcG9zZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9kZWxlZ2F0ZUFsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9kZWxlZ2F0ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9vbmNlL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jb2xsYXBzZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9uYXZpZ2F0aW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmFkaW8tdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9yZWdleC1pbnB1dC1tYXNrLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvc2tpcG5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYmxlLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9lbGVtZW50LWhpZGRlbi5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvaW5kZXguanMiLCJzcmMvanMvdXRpbHMvYmVoYXZpb3IuanMiLCJzcmMvanMvdXRpbHMvY2xvc2VzdC5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9zZWxlY3QuanMiLCJzcmMvanMvdXRpbHMvdG9nZ2xlLmpzIiwic3JjL3ZlbmRvci90aXBweWpzL3RpcHB5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFNBQVMsT0FBVCxDQUFrQixHQUFsQixFQUF1QixRQUF2QixFQUFpQyxPQUFqQyxFQUEwQztBQUN2RCxRQUFJLElBQUksT0FBUixFQUFpQjtBQUNiLFlBQUksT0FBSixDQUFZLFFBQVosRUFBc0IsT0FBdEI7QUFDQTtBQUNIO0FBQ0QsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLElBQUksTUFBeEIsRUFBZ0MsS0FBRyxDQUFuQyxFQUFzQztBQUNsQyxpQkFBUyxJQUFULENBQWMsT0FBZCxFQUF1QixJQUFJLENBQUosQ0FBdkIsRUFBK0IsQ0FBL0IsRUFBa0MsR0FBbEM7QUFDSDtBQUNKLENBUkQ7Ozs7O0FDYkE7Ozs7Ozs7OztBQVNBOztBQUVBOztBQUVBLElBQUksY0FBYyxPQUFPLElBQXpCLEVBQStCOztBQUUvQjtBQUNBO0FBQ0EsS0FBSSxFQUFFLGVBQWUsU0FBUyxhQUFULENBQXVCLEdBQXZCLENBQWpCLEtBQ0EsU0FBUyxlQUFULElBQTRCLEVBQUUsZUFBZSxTQUFTLGVBQVQsQ0FBeUIsNEJBQXpCLEVBQXNELEdBQXRELENBQWpCLENBRGhDLEVBQzhHOztBQUU3RyxhQUFVLElBQVYsRUFBZ0I7O0FBRWpCOztBQUVBLE9BQUksRUFBRSxhQUFhLElBQWYsQ0FBSixFQUEwQjs7QUFFMUIsT0FDRyxnQkFBZ0IsV0FEbkI7QUFBQSxPQUVHLFlBQVksV0FGZjtBQUFBLE9BR0csZUFBZSxLQUFLLE9BQUwsQ0FBYSxTQUFiLENBSGxCO0FBQUEsT0FJRyxTQUFTLE1BSlo7QUFBQSxPQUtH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aEMsYUFBSyxRQUFMLENBQWMsT0FBZCxDQUFzQixVQUFVLE9BQVYsRUFBbUI7QUFDdkMsaUJBQU8sUUFBUSxPQUFSLEVBQVA7QUFDRCxTQUZEO0FBR0EsYUFBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0Q7QUFUSSxLQUFQO0FBV0Q7O0FBRUQsVUFBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsVUFBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsVUFBUSxRQUFSLEdBQW1CLFFBQW5CO0FBQ0EsVUFBUSxHQUFSLEdBQWMsVUFBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCO0FBQ3pDLFdBQU8sUUFBUSxRQUFSLEVBQWtCLE9BQWxCLEVBQTJCLElBQTNCLEVBQWlDLFFBQWpDLENBQTBDLENBQTFDLENBQVA7QUFDRCxHQUZEO0FBR0EsVUFBUSxpQkFBUixHQUE0QixZQUFZO0FBQ3RDLGFBQVMsY0FBVCxHQUEwQixTQUFTLFFBQVQsR0FBb0IsQ0FBOUM7QUFDQSxhQUFTLFdBQVQsR0FBdUIsS0FBdkI7QUFDRCxHQUhEOztBQUtBLFNBQU8sT0FBUDtBQUVDLENBN3BJQSxDQUFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBhcnJheS1mb3JlYWNoXG4gKiAgIEFycmF5I2ZvckVhY2ggcG9ueWZpbGwgZm9yIG9sZGVyIGJyb3dzZXJzXG4gKiAgIChQb255ZmlsbDogQSBwb2x5ZmlsbCB0aGF0IGRvZXNuJ3Qgb3ZlcndyaXRlIHRoZSBuYXRpdmUgbWV0aG9kKVxuICogXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNS0yMDE2IFRha3V0byBXYWRhXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoL2Jsb2IvbWFzdGVyL01JVC1MSUNFTlNFXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoIChhcnksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgaWYgKGFyeS5mb3JFYWNoKSB7XG4gICAgICAgIGFyeS5mb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBhcnlbaV0sIGksIGFyeSk7XG4gICAgfVxufTtcbiIsIi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDEuMS4yMDE3MDQyN1xuICpcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cbiAqIExpY2Vuc2U6IERlZGljYXRlZCB0byB0aGUgcHVibGljIGRvbWFpbi5cbiAqICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cblxuLypnbG9iYWwgc2VsZiwgZG9jdW1lbnQsIERPTUV4Y2VwdGlvbiAqL1xuXG4vKiEgQHNvdXJjZSBodHRwOi8vcHVybC5lbGlncmV5LmNvbS9naXRodWIvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL2NsYXNzTGlzdC5qcyAqL1xuXG5pZiAoXCJkb2N1bWVudFwiIGluIHdpbmRvdy5zZWxmKSB7XG5cbi8vIEZ1bGwgcG9seWZpbGwgZm9yIGJyb3dzZXJzIHdpdGggbm8gY2xhc3NMaXN0IHN1cHBvcnRcbi8vIEluY2x1ZGluZyBJRSA8IEVkZ2UgbWlzc2luZyBTVkdFbGVtZW50LmNsYXNzTGlzdFxuaWYgKCEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSkgXG5cdHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIikpKSB7XG5cbihmdW5jdGlvbiAodmlldykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaWYgKCEoJ0VsZW1lbnQnIGluIHZpZXcpKSByZXR1cm47XG5cbnZhclxuXHQgIGNsYXNzTGlzdFByb3AgPSBcImNsYXNzTGlzdFwiXG5cdCwgcHJvdG9Qcm9wID0gXCJwcm90b3R5cGVcIlxuXHQsIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdXG5cdCwgb2JqQ3RyID0gT2JqZWN0XG5cdCwgc3RyVHJpbSA9IFN0cmluZ1twcm90b1Byb3BdLnRyaW0gfHwgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuXHR9XG5cdCwgYXJySW5kZXhPZiA9IEFycmF5W3Byb3RvUHJvcF0uaW5kZXhPZiB8fCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdHZhclxuXHRcdFx0ICBpID0gMFxuXHRcdFx0LCBsZW4gPSB0aGlzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fVxuXHQvLyBWZW5kb3JzOiBwbGVhc2UgYWxsb3cgY29udGVudCBjb2RlIHRvIGluc3RhbnRpYXRlIERPTUV4Y2VwdGlvbnNcblx0LCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG5cdFx0dGhpcy5uYW1lID0gdHlwZTtcblx0XHR0aGlzLmNvZGUgPSBET01FeGNlcHRpb25bdHlwZV07XG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fVxuXHQsIGNoZWNrVG9rZW5BbmRHZXRJbmRleCA9IGZ1bmN0aW9uIChjbGFzc0xpc3QsIHRva2VuKSB7XG5cdFx0aWYgKHRva2VuID09PSBcIlwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJTWU5UQVhfRVJSXCJcblx0XHRcdFx0LCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAoL1xccy8udGVzdCh0b2tlbikpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXG5cdFx0XHRcdCwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGFyckluZGV4T2YuY2FsbChjbGFzc0xpc3QsIHRva2VuKTtcblx0fVxuXHQsIENsYXNzTGlzdCA9IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHRyaW1tZWRDbGFzc2VzID0gc3RyVHJpbS5jYWxsKGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIilcblx0XHRcdCwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXG5cdFx0XHQsIGkgPSAwXG5cdFx0XHQsIGxlbiA9IGNsYXNzZXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdHRoaXMucHVzaChjbGFzc2VzW2ldKTtcblx0XHR9XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xuXHRcdH07XG5cdH1cblx0LCBjbGFzc0xpc3RQcm90byA9IENsYXNzTGlzdFtwcm90b1Byb3BdID0gW11cblx0LCBjbGFzc0xpc3RHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5ldyBDbGFzc0xpc3QodGhpcyk7XG5cdH1cbjtcbi8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcbi8vIG9uIG5vbi1ET01FeGNlcHRpb25zLiBFcnJvcidzIHRvU3RyaW5nKCkgaXMgc3VmZmljaWVudCBoZXJlLlxuRE9NRXhbcHJvdG9Qcm9wXSA9IEVycm9yW3Byb3RvUHJvcF07XG5jbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcblx0cmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcbn07XG5jbGFzc0xpc3RQcm90by5jb250YWlucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuXHR0b2tlbiArPSBcIlwiO1xuXHRyZXR1cm4gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSAhPT0gLTE7XG59O1xuY2xhc3NMaXN0UHJvdG8uYWRkID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpZiAoY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMucHVzaCh0b2tlbik7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0XHQsIGluZGV4XG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0d2hpbGUgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0dGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JjZSkge1xuXHR0b2tlbiArPSBcIlwiO1xuXG5cdHZhclxuXHRcdCAgcmVzdWx0ID0gdGhpcy5jb250YWlucyh0b2tlbilcblx0XHQsIG1ldGhvZCA9IHJlc3VsdCA/XG5cdFx0XHRmb3JjZSAhPT0gdHJ1ZSAmJiBcInJlbW92ZVwiXG5cdFx0OlxuXHRcdFx0Zm9yY2UgIT09IGZhbHNlICYmIFwiYWRkXCJcblx0O1xuXG5cdGlmIChtZXRob2QpIHtcblx0XHR0aGlzW21ldGhvZF0odG9rZW4pO1xuXHR9XG5cblx0aWYgKGZvcmNlID09PSB0cnVlIHx8IGZvcmNlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBmb3JjZTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gIXJlc3VsdDtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5qb2luKFwiIFwiKTtcbn07XG5cbmlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcblx0dmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xuXHRcdCAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcblx0XHQsIGVudW1lcmFibGU6IHRydWVcblx0XHQsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHR9O1xuXHR0cnkge1xuXHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0fSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXG5cdFx0Ly8gYWRkaW5nIHVuZGVmaW5lZCB0byBmaWdodCB0aGlzIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9pc3N1ZXMvMzZcblx0XHQvLyBtb2Rlcm5pZSBJRTgtTVNXNyBtYWNoaW5lIGhhcyBJRTggOC4wLjYwMDEuMTg3MDIgYW5kIGlzIGFmZmVjdGVkXG5cdFx0aWYgKGV4Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IGV4Lm51bWJlciA9PT0gLTB4N0ZGNUVDNTQpIHtcblx0XHRcdGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcblx0XHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0XHR9XG5cdH1cbn0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xuXHRlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xufVxuXG59KHdpbmRvdy5zZWxmKSk7XG5cbn1cblxuLy8gVGhlcmUgaXMgZnVsbCBvciBwYXJ0aWFsIG5hdGl2ZSBjbGFzc0xpc3Qgc3VwcG9ydCwgc28ganVzdCBjaGVjayBpZiB3ZSBuZWVkXG4vLyB0byBub3JtYWxpemUgdGhlIGFkZC9yZW1vdmUgYW5kIHRvZ2dsZSBBUElzLlxuXG4oZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYzFcIiwgXCJjMlwiKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAvMTEgYW5kIEZpcmVmb3ggPDI2LCB3aGVyZSBjbGFzc0xpc3QuYWRkIGFuZFxuXHQvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cblx0aWYgKCF0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjMlwiKSkge1xuXHRcdHZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXTtcblxuXHRcdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odG9rZW4pIHtcblx0XHRcdFx0dmFyIGksIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0dG9rZW4gPSBhcmd1bWVudHNbaV07XG5cdFx0XHRcdFx0b3JpZ2luYWwuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0XHRjcmVhdGVNZXRob2QoJ2FkZCcpO1xuXHRcdGNyZWF0ZU1ldGhvZCgncmVtb3ZlJyk7XG5cdH1cblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYzNcIiwgZmFsc2UpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMCBhbmQgRmlyZWZveCA8MjQsIHdoZXJlIGNsYXNzTGlzdC50b2dnbGUgZG9lcyBub3Rcblx0Ly8gc3VwcG9ydCB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuXHRpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzNcIikpIHtcblx0XHR2YXIgX3RvZ2dsZSA9IERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlO1xuXG5cdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbih0b2tlbiwgZm9yY2UpIHtcblx0XHRcdGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xuXHRcdFx0XHRyZXR1cm4gZm9yY2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH1cblxuXHR0ZXN0RWxlbWVudCA9IG51bGw7XG59KCkpO1xuXG59XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkFycmF5LmZyb207XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuYXNzaWduO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi41LjcnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciAkYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICB2YXIgQSA9IHt9O1xuICB2YXIgQiA9IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIFMgPSBTeW1ib2woKTtcbiAgdmFyIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgd2hpbGUgKGFMZW4gPiBpbmRleCkge1xuICAgIHZhciBTID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIGlmIChpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKSBUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciAkdG9TdHJpbmcgPSBGdW5jdGlvbltUT19TVFJJTkddO1xudmFyIFRQTCA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbCwgc2FmZSkge1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYgKE9ba2V5XSA9PT0gdmFsKSByZXR1cm47XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmICghc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH0gZWxzZSBpZiAoT1trZXldKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2Uge1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDE4IERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sO1xudmFyIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7IGFzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCIvKiFcbiAgKiBkb21yZWFkeSAoYykgRHVzdGluIERpYXogMjAxNCAtIExpY2Vuc2UgTUlUXG4gICovXG4hZnVuY3Rpb24gKG5hbWUsIGRlZmluaXRpb24pIHtcblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSB0aGlzW25hbWVdID0gZGVmaW5pdGlvbigpXG5cbn0oJ2RvbXJlYWR5JywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciBmbnMgPSBbXSwgbGlzdGVuZXJcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCBoYWNrID0gZG9jLmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbFxuICAgICwgZG9tQ29udGVudExvYWRlZCA9ICdET01Db250ZW50TG9hZGVkJ1xuICAgICwgbG9hZGVkID0gKGhhY2sgPyAvXmxvYWRlZHxeYy8gOiAvXmxvYWRlZHxeaXxeYy8pLnRlc3QoZG9jLnJlYWR5U3RhdGUpXG5cblxuICBpZiAoIWxvYWRlZClcbiAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIpXG4gICAgbG9hZGVkID0gMVxuICAgIHdoaWxlIChsaXN0ZW5lciA9IGZucy5zaGlmdCgpKSBsaXN0ZW5lcigpXG4gIH0pXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgIGxvYWRlZCA/IHNldFRpbWVvdXQoZm4sIDApIDogZm5zLnB1c2goZm4pXG4gIH1cblxufSk7XG4iLCIvLyBlbGVtZW50LWNsb3Nlc3QgfCBDQzAtMS4wIHwgZ2l0aHViLmNvbS9qb25hdGhhbnRuZWFsL2Nsb3Nlc3RcblxuKGZ1bmN0aW9uIChFbGVtZW50UHJvdG8pIHtcblx0aWYgKHR5cGVvZiBFbGVtZW50UHJvdG8ubWF0Y2hlcyAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdEVsZW1lbnRQcm90by5tYXRjaGVzID0gRWxlbWVudFByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnRQcm90by5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudFByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBmdW5jdGlvbiBtYXRjaGVzKHNlbGVjdG9yKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHRoaXM7XG5cdFx0XHR2YXIgZWxlbWVudHMgPSAoZWxlbWVudC5kb2N1bWVudCB8fCBlbGVtZW50Lm93bmVyRG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHRcdFx0dmFyIGluZGV4ID0gMDtcblxuXHRcdFx0d2hpbGUgKGVsZW1lbnRzW2luZGV4XSAmJiBlbGVtZW50c1tpbmRleF0gIT09IGVsZW1lbnQpIHtcblx0XHRcdFx0KytpbmRleDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIEJvb2xlYW4oZWxlbWVudHNbaW5kZXhdKTtcblx0XHR9O1xuXHR9XG5cblx0aWYgKHR5cGVvZiBFbGVtZW50UHJvdG8uY2xvc2VzdCAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdEVsZW1lbnRQcm90by5jbG9zZXN0ID0gZnVuY3Rpb24gY2xvc2VzdChzZWxlY3Rvcikge1xuXHRcdFx0dmFyIGVsZW1lbnQgPSB0aGlzO1xuXG5cdFx0XHR3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSAxKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9O1xuXHR9XG59KSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUpO1xuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbmNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi4vZGVsZWdhdGUnKTtcbmNvbnN0IGRlbGVnYXRlQWxsID0gcmVxdWlyZSgnLi4vZGVsZWdhdGVBbGwnKTtcblxuY29uc3QgREVMRUdBVEVfUEFUVEVSTiA9IC9eKC4rKTpkZWxlZ2F0ZVxcKCguKylcXCkkLztcbmNvbnN0IFNQQUNFID0gJyAnO1xuXG5jb25zdCBnZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlLCBoYW5kbGVyKSB7XG4gIHZhciBtYXRjaCA9IHR5cGUubWF0Y2goREVMRUdBVEVfUEFUVEVSTik7XG4gIHZhciBzZWxlY3RvcjtcbiAgaWYgKG1hdGNoKSB7XG4gICAgdHlwZSA9IG1hdGNoWzFdO1xuICAgIHNlbGVjdG9yID0gbWF0Y2hbMl07XG4gIH1cblxuICB2YXIgb3B0aW9ucztcbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBjYXB0dXJlOiBwb3BLZXkoaGFuZGxlciwgJ2NhcHR1cmUnKSxcbiAgICAgIHBhc3NpdmU6IHBvcEtleShoYW5kbGVyLCAncGFzc2l2ZScpXG4gICAgfTtcbiAgfVxuXG4gIHZhciBsaXN0ZW5lciA9IHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgZGVsZWdhdGU6ICh0eXBlb2YgaGFuZGxlciA9PT0gJ29iamVjdCcpXG4gICAgICA/IGRlbGVnYXRlQWxsKGhhbmRsZXIpXG4gICAgICA6IHNlbGVjdG9yXG4gICAgICAgID8gZGVsZWdhdGUoc2VsZWN0b3IsIGhhbmRsZXIpXG4gICAgICAgIDogaGFuZGxlcixcbiAgICBvcHRpb25zOiBvcHRpb25zXG4gIH07XG5cbiAgaWYgKHR5cGUuaW5kZXhPZihTUEFDRSkgPiAtMSkge1xuICAgIHJldHVybiB0eXBlLnNwbGl0KFNQQUNFKS5tYXAoZnVuY3Rpb24oX3R5cGUpIHtcbiAgICAgIHJldHVybiBhc3NpZ24oe3R5cGU6IF90eXBlfSwgbGlzdGVuZXIpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxpc3RlbmVyLnR5cGUgPSB0eXBlO1xuICAgIHJldHVybiBbbGlzdGVuZXJdO1xuICB9XG59O1xuXG52YXIgcG9wS2V5ID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gIGRlbGV0ZSBvYmpba2V5XTtcbiAgcmV0dXJuIHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiZWhhdmlvcihldmVudHMsIHByb3BzKSB7XG4gIGNvbnN0IGxpc3RlbmVycyA9IE9iamVjdC5rZXlzKGV2ZW50cylcbiAgICAucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSBnZXRMaXN0ZW5lcnModHlwZSwgZXZlbnRzW3R5cGVdKTtcbiAgICAgIHJldHVybiBtZW1vLmNvbmNhdChsaXN0ZW5lcnMpO1xuICAgIH0sIFtdKTtcblxuICByZXR1cm4gYXNzaWduKHtcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZEJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmVCZWhhdmlvcihlbGVtZW50KSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgbGlzdGVuZXIudHlwZSxcbiAgICAgICAgICBsaXN0ZW5lci5kZWxlZ2F0ZSxcbiAgICAgICAgICBsaXN0ZW5lci5vcHRpb25zXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHByb3BzKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBvc2UoZnVuY3Rpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlKSA9PT0gZmFsc2U7XG4gICAgfSwgdGhpcyk7XG4gIH07XG59O1xuIiwiY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZScpO1xuY29uc3QgY29tcG9zZSA9IHJlcXVpcmUoJy4uL2NvbXBvc2UnKTtcblxuY29uc3QgU1BMQVQgPSAnKic7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVsZWdhdGVBbGwoc2VsZWN0b3JzKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhzZWxlY3RvcnMpXG5cbiAgLy8gWFhYIG9wdGltaXphdGlvbjogaWYgdGhlcmUgaXMgb25seSBvbmUgaGFuZGxlciBhbmQgaXQgYXBwbGllcyB0b1xuICAvLyBhbGwgZWxlbWVudHMgKHRoZSBcIipcIiBDU1Mgc2VsZWN0b3IpLCB0aGVuIGp1c3QgcmV0dXJuIHRoYXRcbiAgLy8gaGFuZGxlclxuICBpZiAoa2V5cy5sZW5ndGggPT09IDEgJiYga2V5c1swXSA9PT0gU1BMQVQpIHtcbiAgICByZXR1cm4gc2VsZWN0b3JzW1NQTEFUXTtcbiAgfVxuXG4gIGNvbnN0IGRlbGVnYXRlcyA9IGtleXMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHNlbGVjdG9yKSB7XG4gICAgbWVtby5wdXNoKGRlbGVnYXRlKHNlbGVjdG9yLCBzZWxlY3RvcnNbc2VsZWN0b3JdKSk7XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIFtdKTtcbiAgcmV0dXJuIGNvbXBvc2UoZGVsZWdhdGVzKTtcbn07XG4iLCIvLyBwb2x5ZmlsbCBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0XG5yZXF1aXJlKCdlbGVtZW50LWNsb3Nlc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZShzZWxlY3RvciwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlbGVnYXRpb24oZXZlbnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc2VsZWN0b3IpO1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRhcmdldCwgZXZlbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb25jZShsaXN0ZW5lciwgb3B0aW9ucykge1xuICB2YXIgd3JhcHBlZCA9IGZ1bmN0aW9uIHdyYXBwZWRPbmNlKGUpIHtcbiAgICBlLmN1cnJlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLnR5cGUsIHdyYXBwZWQsIG9wdGlvbnMpO1xuICAgIHJldHVybiBsaXN0ZW5lci5jYWxsKHRoaXMsIGUpO1xuICB9O1xuICByZXR1cm4gd3JhcHBlZDtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHRvZ2dsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3RvZ2dsZScpO1xuY29uc3QgaXNFbGVtZW50SW5WaWV3cG9ydCA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzLWluLXZpZXdwb3J0Jyk7XG5jb25zdCBCVVRUT04gPSBgLmFjY29yZGlvbi1idXR0b25bYXJpYS1jb250cm9sc11gO1xuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XG5jb25zdCBNVUxUSVNFTEVDVEFCTEUgPSAnYXJpYS1tdWx0aXNlbGVjdGFibGUnO1xuXG5jbGFzcyBBY2NvcmRpb257XG4gIGNvbnN0cnVjdG9yIChhY2NvcmRpb24pe1xuICAgIHRoaXMuYWNjb3JkaW9uID0gYWNjb3JkaW9uO1xuICAgIHRoaXMuYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XG4gICAgdGhpcy5ldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuYWNjb3JkaW9uLmNsb3NlJyk7XG4gICAgdGhpcy5ldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24ub3BlbicpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCAoKXtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9uc1tpXTtcblxuICAgICAgbGV0IGV4cGFuZGVkID0gY3VycmVudEJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAndHJ1ZSc7XG4gICAgICB0aGlzLnRvZ2dsZUJ1dHRvbihjdXJyZW50QnV0dG9uLCBleHBhbmRlZCk7XG5cbiAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgY3VycmVudEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgdGhhdC5ldmVudE9uQ2xpY2soZXZlbnQsIHRoaXMpO1xuICAgICAgfSk7XG5cbiAgICB9XG4gIH1cblxuXG4gIGV2ZW50T25DbGljayAoZXZlbnQsIGJ1dHRvbil7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnRvZ2dsZUJ1dHRvbihidXR0b24pO1xuICAgIGlmIChidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnKSB7XG4gICAgICAvLyBXZSB3ZXJlIGp1c3QgZXhwYW5kZWQsIGJ1dCBpZiBhbm90aGVyIGFjY29yZGlvbiB3YXMgYWxzbyBqdXN0XG4gICAgICAvLyBjb2xsYXBzZWQsIHdlIG1heSBubyBsb25nZXIgYmUgaW4gdGhlIHZpZXdwb3J0LiBUaGlzIGVuc3VyZXNcbiAgICAgIC8vIHRoYXQgd2UgYXJlIHN0aWxsIHZpc2libGUsIHNvIHRoZSB1c2VyIGlzbid0IGNvbmZ1c2VkLlxuICAgICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KGJ1dHRvbikpIGJ1dHRvbi5zY3JvbGxJbnRvVmlldygpO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBhIGJ1dHRvbidzIFwicHJlc3NlZFwiIHN0YXRlLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIHRhcmdldFxuICAgKiBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxuICAgKiBzdGF0ZSB3aWxsIGJlIHRvZ2dsZWQgKGZyb20gZmFsc2UgdG8gdHJ1ZSwgYW5kIHZpY2UtdmVyc2EpLlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0aGUgcmVzdWx0aW5nIHN0YXRlXG4gICAqL1xuICB0b2dnbGVCdXR0b24gKGJ1dHRvbiwgZXhwYW5kZWQpIHtcbiAgICBpZiAoIXRoaXMuYWNjb3JkaW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoQlVUVE9OKycgaXMgbWlzc2luZyBvdXRlciBBQ0NPUkRJT04nKTtcbiAgICB9XG5cbiAgICBleHBhbmRlZCA9IHRvZ2dsZShidXR0b24sIGV4cGFuZGVkKTtcblxuICAgIGlmKGV4cGFuZGVkKXtcbiAgICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRPcGVuKTtcbiAgICB9IGVsc2V7XG4gICAgICBidXR0b24uZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50Q2xvc2UpO1xuICAgIH1cblxuICAgIC8vIFhYWCBtdWx0aXNlbGVjdGFibGUgaXMgb3B0LWluLCB0byBwcmVzZXJ2ZSBsZWdhY3kgYmVoYXZpb3JcbiAgICBjb25zdCBtdWx0aXNlbGVjdGFibGUgPSB0aGlzLmFjY29yZGlvbi5nZXRBdHRyaWJ1dGUoTVVMVElTRUxFQ1RBQkxFKSA9PT0gJ3RydWUnO1xuXG4gICAgaWYgKGV4cGFuZGVkICYmICFtdWx0aXNlbGVjdGFibGUpIHtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGN1cnJlbnRCdXR0dG9uID0gdGhpcy5idXR0b25zW2ldO1xuICAgICAgICBpZiAoY3VycmVudEJ1dHR0b24gIT09IGJ1dHRvbikge1xuICAgICAgICAgIHRvZ2dsZShjdXJyZW50QnV0dHRvbiwgZmFsc2UpO1xuICAgICAgICAgIGN1cnJlbnRCdXR0dG9uLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudENsb3NlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWVcbiAgICovXG4gIHNob3dCdXR0b24gKGJ1dHRvbil7XG4gICAgdG9nZ2xlQnV0dG9uKGJ1dHRvbiwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IGZhbHNlXG4gICAqL1xuICBoaWRlQnV0dG9uIChidXR0b24pIHtcbiAgICB0b2dnbGVCdXR0b24oYnV0dG9uLCBmYWxzZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBY2NvcmRpb247XG4iLCIndXNlIHN0cmljdCc7XG5jbGFzcyBDaGVja2JveFRvZ2dsZUNvbnRlbnR7XG4gICAgY29uc3RydWN0b3IoZWwpe1xuICAgICAgICB0aGlzLmpzVG9nZ2xlVHJpZ2dlciA9ICcuanMtY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnO1xuICAgICAgICB0aGlzLmpzVG9nZ2xlVGFyZ2V0ID0gJ2RhdGEtanMtdGFyZ2V0JztcbiAgICAgICAgdGhpcy5ldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2UuY2xvc2UnKTtcbiAgICAgICAgdGhpcy5ldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5jb2xsYXBzZS5vcGVuJyk7XG4gICAgICAgIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xuICAgICAgICB0aGlzLmNoZWNrYm94RWwgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuaW5pdChlbCk7XG4gICAgfVxuXG4gICAgaW5pdChlbCl7XG4gICAgICAgIHRoaXMuY2hlY2tib3hFbCA9IGVsO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2hlY2tib3hFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIHRoYXQudG9nZ2xlKHRoYXQuY2hlY2tib3hFbCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRvZ2dsZSh0aGlzLmNoZWNrYm94RWwpO1xuICAgIH1cblxuICAgIHRvZ2dsZSh0cmlnZ2VyRWwpe1xuICAgICAgICB2YXIgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUodGhpcy5qc1RvZ2dsZVRhcmdldClcbiAgICAgICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdmFyIHRhcmdldEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXRBdHRyKTtcbiAgICAgICAgICAgIGlmKHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5jaGVja2VkKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuKHRyaWdnZXJFbCwgdGFyZ2V0RWwpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKHRyaWdnZXJFbCwgdGFyZ2V0RWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCl7XG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50T3Blbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCl7XG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50Q2xvc2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENoZWNrYm94VG9nZ2xlQ29udGVudDtcbiIsIi8qKlxuICogQ29sbGFwc2UvZXhwYW5kLlxuICovXG5cbid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBDb2xsYXBzZSB7XG4gIGNvbnN0cnVjdG9yIChlbGVtZW50LCBhY3Rpb24gPSAndG9nZ2xlJyl7XG4gICAgdGhpcy5qc0NvbGxhcHNlVGFyZ2V0ID0gJ2RhdGEtanMtdGFyZ2V0JztcbiAgICB0aGlzLnRyaWdnZXJFbCA9IGVsZW1lbnQ7XG4gICAgdGhpcy50YXJnZXRFbDtcbiAgICB0aGlzLmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJyk7XG4gICAgdGhpcy5ldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5jb2xsYXBzZS5vcGVuJyk7XG4gICAgdGhpcy50cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKXtcbiAgICAgIHRoYXQudG9nZ2xlKCk7XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVDb2xsYXBzZSAoZm9yY2VDbG9zZSkge1xuICAgIGxldCB0YXJnZXRBdHRyID0gdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNDb2xsYXBzZVRhcmdldCk7XG4gICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xuICAgICAgdGhpcy50YXJnZXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0QXR0cik7XG4gICAgICBpZih0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIC8vY2hhbmdlIHN0YXRlXG4gICAgICAgIGlmKHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgfHwgdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09IHVuZGVmaW5lZCB8fCBmb3JjZUNsb3NlICl7XG4gICAgICAgICAgLy9jbG9zZVxuICAgICAgICAgIHRoaXMuYW5pbWF0ZUNvbGxhcHNlKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIC8vb3BlblxuICAgICAgICAgIHRoaXMuYW5pbWF0ZUV4cGFuZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlICgpe1xuICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgdGhpcy50b2dnbGVDb2xsYXBzZSgpO1xuICAgIH1cbiAgfVxuXG5cbiAgYW5pbWF0ZUNvbGxhcHNlICgpIHtcbiAgICBpZighdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyl7XG4gICAgICB0aGlzLmFuaW1hdGVJblByb2dyZXNzID0gdHJ1ZTtcblxuICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSB0aGlzLnRhcmdldEVsLmNsaWVudEhlaWdodCsgJ3B4JztcbiAgICAgIHRoaXMudGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2UtdHJhbnNpdGlvbi1jb2xsYXBzZScpO1xuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcbiAgICAgICAgdGhhdC50YXJnZXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICB9LCA1KTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2UtdHJhbnNpdGlvbi1jb2xsYXBzZScpO1xuXG4gICAgICAgIHRoYXQudHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICB0aGF0LmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHRoYXQudHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhhdC5ldmVudENsb3NlKTtcbiAgICAgIH0sIDIwMCk7XG4gICAgfVxuICB9XG5cbiAgYW5pbWF0ZUV4cGFuZCAoKSB7XG4gICAgaWYoIXRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3Mpe1xuICAgICAgdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xuICAgICAgbGV0IGV4cGFuZGVkSGVpZ2h0ID0gdGhpcy50YXJnZXRFbC5jbGllbnRIZWlnaHQ7XG4gICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmhlaWdodCA9ICcwcHgnO1xuICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZS10cmFuc2l0aW9uLWV4cGFuZCcpO1xuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcbiAgICAgICAgdGhhdC50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSBleHBhbmRlZEhlaWdodCsgJ3B4JztcbiAgICAgIH0sIDUpO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpe1xuICAgICAgICB0aGF0LnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlLXRyYW5zaXRpb24tZXhwYW5kJyk7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuXG4gICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICB0aGF0LnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0aGF0LmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHRoYXQudHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhhdC5ldmVudE9wZW4pO1xuICAgICAgfSwgMjAwKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsYXBzZTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGNsb3Nlc3QgPSByZXF1aXJlKCcuLi91dGlscy9jbG9zZXN0Jyk7XG5cbmNsYXNzIERyb3Bkb3duIHtcbiAgY29uc3RydWN0b3IgKGVsKXtcbiAgICB0aGlzLmpzRHJvcGRvd25UcmlnZ2VyID0gJy5qcy1kcm9wZG93bic7XG4gICAgdGhpcy5qc0Ryb3Bkb3duVGFyZ2V0ID0gJ2RhdGEtanMtdGFyZ2V0JztcbiAgICB0aGlzLmV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xuICAgIHRoaXMuZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24ub3BlbicpO1xuXG4gICAgLy9vcHRpb246IG1ha2UgZHJvcGRvd24gYmVoYXZlIGFzIHRoZSBjb2xsYXBzZSBjb21wb25lbnQgd2hlbiBvbiBzbWFsbCBzY3JlZW5zICh1c2VkIGJ5IHN1Ym1lbnVzIGluIHRoZSBoZWFkZXIgYW5kIHN0ZXAtZHJvcGRvd24pLlxuICAgIHRoaXMubmF2UmVzcG9uc2l2ZUJyZWFrcG9pbnQgPSA5OTI7IC8vc2FtZSBhcyAkbmF2LXJlc3BvbnNpdmUtYnJlYWtwb2ludCBmcm9tIHRoZSBzY3NzLlxuICAgIHRoaXMudHJpbmd1aWRlQnJlYWtwb2ludCA9IDc2ODsgLy9zYW1lIGFzICRuYXYtcmVzcG9uc2l2ZS1icmVha3BvaW50IGZyb20gdGhlIHNjc3MuXG4gICAgdGhpcy5qc1Jlc3BvbnNpdmVDb2xsYXBzZU1vZGlmaWVyID0gJy5qcy1kcm9wZG93bi0tcmVzcG9uc2l2ZS1jb2xsYXBzZSc7XG4gICAgdGhpcy5yZXNwb25zaXZlQ29sbGFwc2VFbmFibGVkID0gZmFsc2U7XG4gICAgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IGZhbHNlO1xuXG5cbiAgICB0aGlzLnRyaWdnZXJFbCA9IG51bGw7XG4gICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG5cbiAgICB0aGlzLmluaXQoZWwpO1xuXG4gICAgaWYodGhpcy50cmlnZ2VyRWwgIT09IG51bGwgJiYgdGhpcy50cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XG5cblxuICAgICAgaWYodGhpcy50cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSl7XG4gICAgICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvL0NsaWNrZWQgb3V0c2lkZSBkcm9wZG93biAtPiBjbG9zZSBpdFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KXtcbiAgICAgICAgdGhhdC5vdXRzaWRlQ2xvc2UoZXZlbnQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vQ2xpY2tlZCBvbiBkcm9wZG93biBvcGVuIGJ1dHRvbiAtLT4gdG9nZ2xlIGl0XG4gICAgICB0aGlzLnRyaWdnZXJFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOy8vcHJldmVudHMgb3VzaWRlIGNsaWNrIGxpc3RlbmVyIGZyb20gdHJpZ2dlcmluZy5cbiAgICAgICAgdGhhdC50b2dnbGVEcm9wZG93bigpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIHNldCBhcmlhLWhpZGRlbiBjb3JyZWN0bHkgZm9yIHNjcmVlbnJlYWRlcnMgKFRyaW5ndWlkZSByZXNwb25zaXZlKVxuICAgICAgaWYodGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMudHJpZ2dlckVsO1xuICAgICAgICBpZiAod2luZG93LkludGVyc2VjdGlvbk9ic2VydmVyKSB7XG4gICAgICAgICAgLy8gdHJpZ2dlciBldmVudCB3aGVuIGJ1dHRvbiBjaGFuZ2VzIHZpc2liaWxpdHlcbiAgICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKGVudHJpZXMpIHtcbiAgICAgICAgICAgIC8vIGJ1dHRvbiBpcyB2aXNpYmxlXG4gICAgICAgICAgICBpZiAoZW50cmllc1swXS5pbnRlcnNlY3Rpb25SYXRpbykge1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBidXR0b24gaXMgbm90IHZpc2libGVcbiAgICAgICAgICAgICAgaWYgKHRoYXQudGFyZ2V0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICByb290OiBkb2N1bWVudC5ib2R5XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJRTogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgaXMgbm90IHN1cHBvcnRlZCwgc28gd2UgbGlzdGVuIGZvciB3aW5kb3cgcmVzaXplIGFuZCBncmlkIGJyZWFrcG9pbnQgaW5zdGVhZFxuICAgICAgICAgIGlmICh0aGF0LmRvUmVzcG9uc2l2ZVN0ZXBndWlkZUNvbGxhcHNlKCkpIHtcbiAgICAgICAgICAgIC8vIHNtYWxsIHNjcmVlblxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2V7XG4gICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTGFyZ2Ugc2NyZWVuXG4gICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhhdC5kb1Jlc3BvbnNpdmVTdGVwZ3VpZGVDb2xsYXBzZSgpKSB7XG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgICAgICAgIH0gZWxzZXtcbiAgICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIGV2dCA9IGV2dCB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMjcpIHtcbiAgICAgICAgICB0aGF0LmNsb3NlQWxsKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9XG5cblxuICBpbml0IChlbCl7XG4gICAgdGhpcy50cmlnZ2VyRWwgPSBlbDtcbiAgICBpZih0aGlzLnRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0aGlzLnRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIGxldCB0YXJnZXRBdHRyID0gdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNEcm9wZG93blRhcmdldCk7XG4gICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIGxldCB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XG4gICAgICAgIGlmKHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgIHRoaXMudGFyZ2V0RWwgPSB0YXJnZXRFbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKHRoaXMudHJpZ2dlckVsLmNsYXNzTGlzdC5jb250YWlucygnanMtZHJvcGRvd24tLXJlc3BvbnNpdmUtY29sbGFwc2UnKSl7XG4gICAgICB0aGlzLnJlc3BvbnNpdmVDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmKHRoaXMudHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykpe1xuICAgICAgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gIH1cblxuICBjbG9zZUFsbCAoKXtcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuXG4gICAgbGV0IG92ZXJmbG93TWVudUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudScpO1xuICAgIGxldCB0cmlnZ2VyRWwgPSBudWxsO1xuICAgIGxldCB0YXJnZXRFbCA9IG51bGw7XG4gICAgZm9yIChsZXQgb2kgPSAwOyBvaSA8IG92ZXJmbG93TWVudUVsLmxlbmd0aDsgb2krKykge1xuICAgICAgbGV0IGN1cnJlbnRPdmVyZmxvd01lbnVFTCA9IG92ZXJmbG93TWVudUVsWyBvaSBdO1xuICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlcy5sZW5ndGg7IGErKykge1xuICAgICAgICBpZiAoY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXNbIGEgXS50YWdOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAoY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXNbIGEgXS5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLWRyb3Bkb3duJykpIHtcbiAgICAgICAgICAgIHRyaWdnZXJFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzWyBhIF07XG4gICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlc1sgYSBdLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS1pbm5lcicpKSB7XG4gICAgICAgICAgICB0YXJnZXRFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzWyBhIF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGFyZ2V0RWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChib2R5LmNsYXNzTGlzdC5jb250YWlucygnbW9iaWxlX25hdi1hY3RpdmUnKSkge1xuICAgICAgICAgIGlmICghY3VycmVudE92ZXJmbG93TWVudUVMLmNsb3Nlc3QoJy5uYXZiYXInKSkge1xuXG4gICAgICAgICAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09IHRydWUpe1xuICAgICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50Q2xvc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYodHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSB0cnVlKXtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlRHJvcGRvd24gKGZvcmNlQ2xvc2UpIHtcbiAgICBpZih0aGlzLnRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0aGlzLnRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudGFyZ2V0RWwgIT09IG51bGwgJiYgdGhpcy50YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIC8vY2hhbmdlIHN0YXRlXG5cbiAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUubGVmdCA9IG51bGw7XG4gICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gbnVsbDtcblxuICAgICAgdmFyIHJlY3QgPSB0aGlzLnRyaWdnZXJFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGlmKHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgfHwgZm9yY2VDbG9zZSl7XG4gICAgICAgIC8vY2xvc2VcbiAgICAgICAgdGhpcy50cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRoaXMudGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgIHRoaXMudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgIHRoaXMudHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudENsb3NlKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLmNsb3NlQWxsKCk7XG4gICAgICAgIC8vb3BlblxuICAgICAgICB0aGlzLnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xuICAgICAgICB0aGlzLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50T3Blbik7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLm9mZnNldCh0aGlzLnRhcmdldEVsKVxuXG4gICAgICAgIGlmKG9mZnNldC5sZWZ0IDwgMCl7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmlnaHQgPSBvZmZzZXQubGVmdCArIHRoaXMudGFyZ2V0RWwub2Zmc2V0V2lkdGg7XG4gICAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xuICAgICAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcbiAgICAgICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb2Zmc2V0QWdhaW4gPSB0aGlzLm9mZnNldCh0aGlzLnRhcmdldEVsKTtcblxuICAgICAgICBpZihvZmZzZXRBZ2Fpbi5sZWZ0IDwgMCl7XG5cbiAgICAgICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgICAgICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xuICAgICAgICB9XG4gICAgICAgIHJpZ2h0ID0gb2Zmc2V0QWdhaW4ubGVmdCArIHRoaXMudGFyZ2V0RWwub2Zmc2V0V2lkdGg7XG4gICAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xuXG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xuICAgICAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG4gIH1cblxuICBvZmZzZXQgKGVsKSB7XG4gICAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXG4gICAgICBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICByZXR1cm4geyB0b3A6IHJlY3QudG9wICsgc2Nyb2xsVG9wLCBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGxMZWZ0IH1cbiAgfVxuXG5cbiAgb3V0c2lkZUNsb3NlIChldmVudCl7XG4gICAgaWYoIXRoaXMuZG9SZXNwb25zaXZlQ29sbGFwc2UoKSl7XG4gICAgICAvL2Nsb3NlcyBkcm9wZG93biB3aGVuIGNsaWNrZWQgb3V0c2lkZS5cbiAgICAgIGxldCBkcm9wZG93bkVsbSA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCB0aGlzLnRhcmdldEVsLmlkKTtcbiAgICAgIGlmKChkcm9wZG93bkVsbSA9PT0gbnVsbCB8fCBkcm9wZG93bkVsbSA9PT0gdW5kZWZpbmVkKSAmJiAoZXZlbnQudGFyZ2V0ICE9PSB0aGlzLnRyaWdnZXJFbCkpe1xuICAgICAgICAvL2NsaWNrZWQgb3V0c2lkZSB0cmlnZ2VyLCBmb3JjZSBjbG9zZVxuICAgICAgICB0aGlzLnRvZ2dsZURyb3Bkb3duKHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRvUmVzcG9uc2l2ZUNvbGxhcHNlICgpe1xuICAgIC8vcmV0dXJucyB0cnVlIGlmIHJlc3BvbnNpdmUgY29sbGFwc2UgaXMgZW5hYmxlZCBhbmQgd2UgYXJlIG9uIGEgc21hbGwgc2NyZWVuLlxuICAgIGlmKCh0aGlzLnJlc3BvbnNpdmVDb2xsYXBzZUVuYWJsZWQgfHwgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCkgJiYgd2luZG93LmlubmVyV2lkdGggPD0gdGhpcy5uYXZSZXNwb25zaXZlQnJlYWtwb2ludCl7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGRvUmVzcG9uc2l2ZVN0ZXBndWlkZUNvbGxhcHNlICgpe1xuICAgIC8vcmV0dXJucyB0cnVlIGlmIHJlc3BvbnNpdmUgY29sbGFwc2UgaXMgZW5hYmxlZCBhbmQgd2UgYXJlIG9uIGEgc21hbGwgc2NyZWVuLlxuICAgIGlmKCh0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkKSAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSB0aGlzLnRyaW5ndWlkZUJyZWFrcG9pbnQpe1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERyb3Bkb3duO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgbmF2aWdhdGlvbjogcmVxdWlyZSgnLi9uYXZpZ2F0aW9uJyksXHJcbiAgc2tpcG5hdjogICAgcmVxdWlyZSgnLi9za2lwbmF2JyksXHJcbiAgcmVnZXhtYXNrOiAgcmVxdWlyZSgnLi9yZWdleC1pbnB1dC1tYXNrJylcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XHJcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG5jb25zdCBhY2NvcmRpb24gPSByZXF1aXJlKCcuL2FjY29yZGlvbicpO1xyXG5cclxuY29uc3QgQ0xJQ0sgPSByZXF1aXJlKCcuLi9ldmVudHMnKS5DTElDSztcclxuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xyXG5cclxuY29uc3QgTkFWID0gYC5uYXZgO1xyXG5jb25zdCBOQVZfTElOS1MgPSBgJHtOQVZ9IGFgO1xyXG5jb25zdCBPUEVORVJTID0gYC5qcy1tZW51LW9wZW5gO1xyXG5jb25zdCBDTE9TRV9CVVRUT04gPSBgLmpzLW1lbnUtY2xvc2VgO1xyXG5jb25zdCBPVkVSTEFZID0gYC5vdmVybGF5YDtcclxuY29uc3QgQ0xPU0VSUyA9IGAke0NMT1NFX0JVVFRPTn0sIC5vdmVybGF5YDtcclxuY29uc3QgVE9HR0xFUyA9IFsgTkFWLCBPVkVSTEFZIF0uam9pbignLCAnKTtcclxuXHJcbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdtb2JpbGVfbmF2LWFjdGl2ZSc7XHJcbmNvbnN0IFZJU0lCTEVfQ0xBU1MgPSAnaXMtdmlzaWJsZSc7XHJcblxyXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XHJcblxyXG5jb25zdCBfZm9jdXNUcmFwID0gKHRyYXBDb250YWluZXIpID0+IHtcclxuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cclxuICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSc7XHJcbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSB0cmFwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcpO1xyXG4gIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XHJcbiAgY29uc3QgbGFzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1sgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMSBdO1xyXG5cclxuICBmdW5jdGlvbiB0cmFwVGFiS2V5IChlKSB7XHJcbiAgICAvLyBDaGVjayBmb3IgVEFCIGtleSBwcmVzc1xyXG4gICAgaWYgKGUua2V5Q29kZSA9PT0gOSkge1xyXG5cclxuICAgICAgLy8gU0hJRlQgKyBUQUJcclxuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRBQlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRVNDQVBFXHJcbiAgICBpZiAoZS5rZXlDb2RlID09PSAyNykge1xyXG4gICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBGb2N1cyBmaXJzdCBjaGlsZFxyXG4gIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZW5hYmxlICgpIHtcclxuICAgICAgLy8gTGlzdGVuIGZvciBhbmQgdHJhcCB0aGUga2V5Ym9hcmRcclxuICAgICAgdHJhcENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbGVhc2UgKCkge1xyXG4gICAgICB0cmFwQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmxldCBmb2N1c1RyYXA7XHJcblxyXG5jb25zdCB0b2dnbGVOYXYgPSBmdW5jdGlvbiAoYWN0aXZlKSB7XHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgaWYgKHR5cGVvZiBhY3RpdmUgIT09ICdib29sZWFuJykge1xyXG4gICAgYWN0aXZlID0gIWlzQWN0aXZlKCk7XHJcbiAgfVxyXG4gIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZShBQ1RJVkVfQ0xBU1MsIGFjdGl2ZSk7XHJcblxyXG4gIGZvckVhY2goc2VsZWN0KFRPR0dMRVMpLCBlbCA9PiB7XHJcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKFZJU0lCTEVfQ0xBU1MsIGFjdGl2ZSk7XHJcbiAgfSk7XHJcblxyXG4gIGlmIChhY3RpdmUpIHtcclxuICAgIGZvY3VzVHJhcC5lbmFibGUoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZm9jdXNUcmFwLnJlbGVhc2UoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNsb3NlQnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcbiAgY29uc3QgbWVudUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihPUEVORVJTKTtcclxuXHJcbiAgaWYgKGFjdGl2ZSAmJiBjbG9zZUJ1dHRvbikge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgYWN0aXZhdGVkLCBzbyBmb2N1cyBvbiB0aGUgY2xvc2UgYnV0dG9uLFxyXG4gICAgLy8gd2hpY2ggaXMganVzdCBiZWZvcmUgYWxsIHRoZSBuYXYgZWxlbWVudHMgaW4gdGhlIHRhYiBvcmRlci5cclxuICAgIGNsb3NlQnV0dG9uLmZvY3VzKCk7XHJcbiAgfSBlbHNlIGlmICghYWN0aXZlICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGNsb3NlQnV0dG9uICYmXHJcbiAgICAgICAgICAgICBtZW51QnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBkZWFjdGl2YXRlZCwgYW5kIGZvY3VzIHdhcyBvbiB0aGUgY2xvc2VcclxuICAgIC8vIGJ1dHRvbiwgd2hpY2ggaXMgbm8gbG9uZ2VyIHZpc2libGUuIFdlIGRvbid0IHdhbnQgdGhlIGZvY3VzIHRvXHJcbiAgICAvLyBkaXNhcHBlYXIgaW50byB0aGUgdm9pZCwgc28gZm9jdXMgb24gdGhlIG1lbnUgYnV0dG9uIGlmIGl0J3NcclxuICAgIC8vIHZpc2libGUgKHRoaXMgbWF5IGhhdmUgYmVlbiB3aGF0IHRoZSB1c2VyIHdhcyBqdXN0IGZvY3VzZWQgb24sXHJcbiAgICAvLyBpZiB0aGV5IHRyaWdnZXJlZCB0aGUgbW9iaWxlIG5hdiBieSBtaXN0YWtlKS5cclxuICAgIG1lbnVCdXR0b24uZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhY3RpdmU7XHJcbn07XHJcblxyXG5jb25zdCByZXNpemUgPSAoKSA9PiB7XHJcbiAgY29uc3QgY2xvc2VyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcblxyXG4gIGlmIChpc0FjdGl2ZSgpICYmIGNsb3NlciAmJiBjbG9zZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggPT09IDApIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYnV0IHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSwgd2hpY2hcclxuICAgIC8vIG1lYW5zIHRoZSB1c2VyJ3Mgdmlld3BvcnQgaGFzIGJlZW4gcmVzaXplZCBzbyB0aGF0IGl0IGlzIG5vIGxvbmdlclxyXG4gICAgLy8gaW4gbW9iaWxlIG1vZGUuIExldCdzIG1ha2UgdGhlIHBhZ2Ugc3RhdGUgY29uc2lzdGVudCBieVxyXG4gICAgLy8gZGVhY3RpdmF0aW5nIHRoZSBtb2JpbGUgbmF2LlxyXG4gICAgdG9nZ2xlTmF2LmNhbGwoY2xvc2VyLCBmYWxzZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgbmF2aWdhdGlvbiA9IGJlaGF2aW9yKHtcclxuICBbIENMSUNLIF06IHtcclxuICAgIFsgT1BFTkVSUyBdOiB0b2dnbGVOYXYsXHJcbiAgICBbIENMT1NFUlMgXTogdG9nZ2xlTmF2LFxyXG4gICAgWyBOQVZfTElOS1MgXTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBBIG5hdmlnYXRpb24gbGluayBoYXMgYmVlbiBjbGlja2VkISBXZSB3YW50IHRvIGNvbGxhcHNlIGFueVxyXG4gICAgICAvLyBoaWVyYXJjaGljYWwgbmF2aWdhdGlvbiBVSSBpdCdzIGEgcGFydCBvZiwgc28gdGhhdCB0aGUgdXNlclxyXG4gICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxyXG5cclxuICAgICAgLy8gU29tZSBuYXZpZ2F0aW9uIGxpbmtzIGFyZSBpbnNpZGUgYWNjb3JkaW9uczsgd2hlbiB0aGV5J3JlXHJcbiAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgYWNjb3JkaW9ucy5cclxuICAgICAgY29uc3QgYWNjID0gdGhpcy5jbG9zZXN0KGFjY29yZGlvbi5BQ0NPUkRJT04pO1xyXG4gICAgICBpZiAoYWNjKSB7XHJcbiAgICAgICAgYWNjb3JkaW9uLmdldEJ1dHRvbnMoYWNjKS5mb3JFYWNoKGJ0biA9PiBhY2NvcmRpb24uaGlkZShidG4pKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXHJcbiAgICAgIGlmIChpc0FjdGl2ZSgpKSB7XHJcbiAgICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0sIHtcclxuICBpbml0ICgpIHtcclxuICAgIGNvbnN0IHRyYXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKE5BVik7XHJcblxyXG4gICAgaWYgKHRyYXBDb250YWluZXIpIHtcclxuICAgICAgZm9jdXNUcmFwID0gX2ZvY3VzVHJhcCh0cmFwQ29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemUoKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcclxuICB9LFxyXG4gIHRlYXJkb3duICgpIHtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcclxuICB9LFxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBUT0RPIGZvciAyLjAsIHJlbW92ZSB0aGlzIHN0YXRlbWVudCBhbmQgZXhwb3J0IGBuYXZpZ2F0aW9uYCBkaXJlY3RseTpcclxuICpcclxuICogbW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcih7Li4ufSk7XHJcbiAqL1xyXG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gYXNzaWduKFxyXG4gIGVsID0+IG5hdmlnYXRpb24ub24oZWwpLFxyXG4gIG5hdmlnYXRpb25cclxuKTsiLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIFJhZGlvVG9nZ2xlR3JvdXB7XG4gICAgY29uc3RydWN0b3IoZWwpe1xuICAgICAgICB0aGlzLmpzVG9nZ2xlVHJpZ2dlciA9ICcuanMtcmFkaW8tdG9nZ2xlLWdyb3VwJztcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRhcmdldCA9ICdkYXRhLWpzLXRhcmdldCc7XG4gICAgICAgIHRoaXMuZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJyk7XG4gICAgICAgIHRoaXMuZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2Uub3BlbicpO1xuICAgICAgICB0aGlzLnJhZGlvRWxzID0gbnVsbDtcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5pbml0KGVsKTtcbiAgICB9XG5cbiAgICBpbml0IChlbCl7XG4gICAgICAgIHRoaXMucmFkaW9Hcm91cCA9IGVsO1xuICAgICAgICB0aGlzLnJhZGlvRWxzID0gdGhpcy5yYWRpb0dyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucmFkaW9FbHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHZhciByYWRpbyA9IHRoaXMucmFkaW9FbHNbIGkgXTtcbiAgICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIGZvcihsZXQgYSA9IDA7IGEgPCB0aGF0LnJhZGlvRWxzLmxlbmd0aDsgYSsrICl7XG4gICAgICAgICAgICAgIHRoYXQudG9nZ2xlKHRoYXQucmFkaW9FbHNbIGEgXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnRvZ2dsZShyYWRpbyk7IC8vSW5pdGlhbCB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZSAodHJpZ2dlckVsKXtcbiAgICAgICAgdmFyIHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNUb2dnbGVUYXJnZXQpO1xuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldEF0dHIpO1xuICAgICAgICAgICAgaWYodGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgaWYodHJpZ2dlckVsLmNoZWNrZWQpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRPcGVuKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsKXtcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmFkaW9Ub2dnbGVHcm91cDtcbiIsIi8qXHJcbiogUHJldmVudHMgdGhlIHVzZXIgZnJvbSBpbnB1dHRpbmcgYmFzZWQgb24gYSByZWdleC5cclxuKiBEb2VzIG5vdCB3b3JrIHRoZSBzYW1lIHdheSBhZiA8aW5wdXQgcGF0dGVybj1cIlwiPiwgdGhpcyBwYXR0ZXJuIGlzIG9ubHkgdXNlZCBmb3IgdmFsaWRhdGlvbiwgbm90IHRvIHByZXZlbnQgaW5wdXQuXHJcbiogVXNlY2FzZTogbnVtYmVyIGlucHV0IGZvciBkYXRlLWNvbXBvbmVudC5cclxuKiBFeGFtcGxlIC0gbnVtYmVyIG9ubHk6IDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtaW5wdXQtcmVnZXg9XCJeXFxkKiRcIj5cclxuKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XHJcblxyXG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xyXG4gIHNoaWZ0OiBmYWxzZSxcclxuICBhbHQ6IGZhbHNlLFxyXG4gIGN0cmw6IGZhbHNlLFxyXG4gIGNvbW1hbmQ6IGZhbHNlXHJcbn07XHJcblxyXG5mdW5jdGlvbiBpbnB1dFJlZ2V4TWFzayAoZXZlbnQpIHtcclxuICBpZihtb2RpZmllclN0YXRlLmN0cmwgfHwgbW9kaWZpZXJTdGF0ZS5jb21tYW5kKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBuZXdDaGFyID0gbnVsbDtcclxuICBpZih0eXBlb2YgZXZlbnQua2V5ICE9PSAndW5kZWZpbmVkJyl7XHJcbiAgICBpZihldmVudC5rZXkubGVuZ3RoID09PSAxKXtcclxuICAgICAgbmV3Q2hhciA9IGV2ZW50LmtleTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYoIWV2ZW50LmNoYXJDb2RlKXtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQua2V5Q29kZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5jaGFyQ29kZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgcmVnZXhTdHIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pbnB1dC1yZWdleCcpO1xyXG5cclxuICBpZihldmVudC50eXBlICE9PSB1bmRlZmluZWQgJiYgZXZlbnQudHlwZSA9PT0gJ3Bhc3RlJyl7XHJcbiAgICBjb25zb2xlLmxvZygncGFzdGUnKTtcclxuICB9IGVsc2V7XHJcbiAgICB2YXIgZWxlbWVudCA9IG51bGw7XHJcbiAgICBpZihldmVudC50YXJnZXQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBpZihuZXdDaGFyICE9PSBudWxsICYmIGVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgaWYobmV3Q2hhci5sZW5ndGggPiAwKXtcclxuICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGlmKGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcicpe1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlOy8vTm90ZSBpbnB1dFt0eXBlPW51bWJlcl0gZG9lcyBub3QgaGF2ZSAuc2VsZWN0aW9uU3RhcnQvRW5kIChDaHJvbWUpLlxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQpICsgdGhpcy52YWx1ZS5zbGljZShlbGVtZW50LnNlbGVjdGlvbkVuZCkgKyBuZXdDaGFyOyAvL3JlbW92ZXMgdGhlIG51bWJlcnMgc2VsZWN0ZWQgYnkgdGhlIHVzZXIsIHRoZW4gYWRkcyBuZXcgY2hhci5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByID0gbmV3IFJlZ0V4cChyZWdleFN0cik7XHJcbiAgICAgICAgaWYoci5leGVjKG5ld1ZhbHVlKSA9PT0gbnVsbCl7XHJcbiAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHtcclxuICAna2V5cHJlc3MgcGFzdGUnOiB7XHJcbiAgICAnaW5wdXRbZGF0YS1pbnB1dC1yZWdleF06Zm9jdXMnOiBpbnB1dFJlZ2V4TWFzayxcclxuICB9XHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XG5jb25zdCBvbmNlID0gcmVxdWlyZSgncmVjZXB0b3Ivb25jZScpO1xuXG5jb25zdCBDTElDSyA9IHJlcXVpcmUoJy4uL2V2ZW50cycpLkNMSUNLO1xuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xuY29uc3QgTElOSyA9IGAuJHtQUkVGSVh9c2tpcG5hdltocmVmXj1cIiNcIl1gO1xuXG5jb25zdCBzZXRUYWJpbmRleCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAvLyBOQjogd2Uga25vdyBiZWNhdXNlIG9mIHRoZSBzZWxlY3RvciB3ZSdyZSBkZWxlZ2F0aW5nIHRvIGJlbG93IHRoYXQgdGhlXG4gIC8vIGhyZWYgYWxyZWFkeSBiZWdpbnMgd2l0aCAnIydcbiAgY29uc3QgaWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnaHJlZicpLnNsaWNlKDEpO1xuICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gIGlmICh0YXJnZXQpIHtcbiAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgb25jZShldmVudCA9PiB7XG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgICB9KSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gdGhyb3cgYW4gZXJyb3I/XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioe1xuICBbIENMSUNLIF06IHtcbiAgICBbIExJTksgXTogc2V0VGFiaW5kZXgsXG4gIH0sXG59KTtcbiIsImNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xuXG5jbGFzcyBSZXNwb25zaXZlVGFibGUge1xuICAgIGNvbnN0cnVjdG9yICh0YWJsZSkge1xuICAgICAgICB0aGlzLmluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIGRhdGEgYXR0cmlidXRlcyBuZWVkZWQgZm9yIHJlc3BvbnNpdmUgbW9kZS5cbiAgICBpbnNlcnRIZWFkZXJBc0F0dHJpYnV0ZXMgKHRhYmxlRWwpe1xuICAgICAgICBpZiAoIXRhYmxlRWwpIHJldHVybjtcblxuICAgICAgICBsZXQgaGVhZGVyID0gIHRhYmxlRWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoZWFkJyk7XG4gICAgICAgIGlmKGhlYWRlci5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICBsZXQgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclsgMCBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aCcpO1xuICAgICAgICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWyAwIF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RkJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBib2R5Um93RWxzID0gc2VsZWN0KCd0Ym9keSB0cicsIHRhYmxlRWwpO1xuICAgICAgICAgICAgQXJyYXkuZnJvbShib2R5Um93RWxzKS5mb3JFYWNoKHJvd0VsID0+IHtcbiAgICAgICAgICAgICAgbGV0IGNlbGxFbHMgPSByb3dFbC5jaGlsZHJlbjtcbiAgICAgICAgICAgICAgaWYgKGNlbGxFbHMubGVuZ3RoID09PSBoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oaGVhZGVyQ2VsbEVscykuZm9yRWFjaCgoaGVhZGVyQ2VsbEVsLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyBHcmFiIGhlYWRlciBjZWxsIHRleHQgYW5kIHVzZSBpdCBib2R5IGNlbGwgZGF0YSB0aXRsZS5cbiAgICAgICAgICAgICAgICAgIGNlbGxFbHNbIGkgXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnLCBoZWFkZXJDZWxsRWwudGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2l2ZVRhYmxlO1xuIiwiXHJcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcbi8vSW1wb3J0IHRpcHB5LmpzIChodHRwczovL2F0b21pa3MuZ2l0aHViLmlvL3RpcHB5anMvKVxyXG5jb25zdCB0aXBweSA9IHJlcXVpcmUoJy4uLy4uL3ZlbmRvci90aXBweWpzL3RpcHB5LmpzJyk7XHJcblxyXG52YXIgaW5pdFRpcHB5ID0gZnVuY3Rpb24gKCl7XHJcbiAgICAvL2luaXQgdG9vbHRpcCBvbiBlbGVtZW50cyB3aXRoIHRoZSAuanMtdG9vbHRpcCBjbGFzc1xyXG4gICAgdGlwcHkoJy5qcy10b29sdGlwJywgeyBcclxuICAgICAgICBkdXJhdGlvbjogMCxcclxuICAgICAgICBhcnJvdzogdHJ1ZVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5kb21yZWFkeSgoKSA9PiB7XHJcbiAgICBpbml0VGlwcHkoKTtcclxufSk7XHJcblxyXG5cclxuXHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHByZWZpeDogJycsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcbmNvbnN0IENvbGxhcHNlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2NvbGxhcHNlJyk7XG5jb25zdCBSYWRpb1RvZ2dsZUdyb3VwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50Jyk7XG5jb25zdCBDaGVja2JveFRvZ2dsZUNvbnRlbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcbmNvbnN0IERyb3Bkb3duID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Ryb3Bkb3duJyk7XG5jb25zdCBBY2NvcmRpb24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYWNjb3JkaW9uJyk7XG5jb25zdCBSZXNwb25zaXZlVGFibGUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFibGUnKTtcbmNvbnN0IHRvb2x0aXAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdG9vbHRpcCcpO1xuXG4vKipcbiAqIFRoZSAncG9seWZpbGxzJyBkZWZpbmUga2V5IEVDTUFTY3JpcHQgNSBtZXRob2RzIHRoYXQgbWF5IGJlIG1pc3NpbmcgZnJvbVxuICogb2xkZXIgYnJvd3NlcnMsIHNvIG11c3QgYmUgbG9hZGVkIGZpcnN0LlxuICovXG5yZXF1aXJlKCcuL3BvbHlmaWxscycpO1xuXG5jb25zdCBka2ZkcyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG5cbmNvbnN0IGNvbXBvbmVudHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMnKTtcbmRrZmRzLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xuXG5kb21yZWFkeSgoKSA9PiB7XG4gIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmJvZHk7XG4gIGZvciAobGV0IG5hbWUgaW4gY29tcG9uZW50cykge1xuICAgIGNvbnN0IGJlaGF2aW9yID0gY29tcG9uZW50c1sgbmFtZSBdO1xuICAgIGJlaGF2aW9yLm9uKHRhcmdldCk7XG4gIH1cbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FjY29yZGlvbicpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbi5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uWyBjIF0pO1xuICB9XG4gIGNvbnN0IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYm9yZGVyZWQ6bm90KC5hY2NvcmRpb24pJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWQubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkWyBjIF0pO1xuICB9XG5cbiAgY29uc3QganNTZWxlY3RvclRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGFibGU6bm90KC5kYXRhVGFibGUpJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibGUubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBSZXNwb25zaXZlVGFibGUoanNTZWxlY3RvclRhYmxlWyBjIF0pO1xuICB9XG5cbiAgY29uc3QganNTZWxlY3RvckNvbGxhcHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtY29sbGFwc2UnKTtcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JDb2xsYXBzZS5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IENvbGxhcHNlKGpzU2VsZWN0b3JDb2xsYXBzZVsgYyBdKTtcbiAgfVxuXG4gIGNvbnN0IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtcmFkaW8tdG9nZ2xlLWdyb3VwJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZS5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IFJhZGlvVG9nZ2xlR3JvdXAoanNTZWxlY3RvclJhZGlvQ29sbGFwc2VbIGMgXSk7XG4gIH1cblxuICBjb25zdCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50Jyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZS5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IENoZWNrYm94VG9nZ2xlQ29udGVudChqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZVsgYyBdKTtcbiAgfVxuICBjb25zdCBqc1NlbGVjdG9yRHJvcGRvd24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1kcm9wZG93bicpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckRyb3Bkb3duLmxlbmd0aDsgYysrKXtcbiAgICBuZXcgRHJvcGRvd24oanNTZWxlY3RvckRyb3Bkb3duWyBjIF0pO1xuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHsgQ29sbGFwc2UsIFJhZGlvVG9nZ2xlR3JvdXAsIENoZWNrYm94VG9nZ2xlQ29udGVudCwgRHJvcGRvd24sIFJlc3BvbnNpdmVUYWJsZSwgQWNjb3JkaW9uIH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAvLyBUaGlzIHVzZWQgdG8gYmUgY29uZGl0aW9uYWxseSBkZXBlbmRlbnQgb24gd2hldGhlciB0aGVcclxuICAvLyBicm93c2VyIHN1cHBvcnRlZCB0b3VjaCBldmVudHM7IGlmIGl0IGRpZCwgYENMSUNLYCB3YXMgc2V0IHRvXHJcbiAgLy8gYHRvdWNoc3RhcnRgLiAgSG93ZXZlciwgdGhpcyBoYWQgZG93bnNpZGVzOlxyXG4gIC8vXHJcbiAgLy8gKiBJdCBwcmUtZW1wdGVkIG1vYmlsZSBicm93c2VycycgZGVmYXVsdCBiZWhhdmlvciBvZiBkZXRlY3RpbmdcclxuICAvLyAgIHdoZXRoZXIgYSB0b3VjaCB0dXJuZWQgaW50byBhIHNjcm9sbCwgdGhlcmVieSBwcmV2ZW50aW5nXHJcbiAgLy8gICB1c2VycyBmcm9tIHVzaW5nIHNvbWUgb2Ygb3VyIGNvbXBvbmVudHMgYXMgc2Nyb2xsIHN1cmZhY2VzLlxyXG4gIC8vXHJcbiAgLy8gKiBTb21lIGRldmljZXMsIHN1Y2ggYXMgdGhlIE1pY3Jvc29mdCBTdXJmYWNlIFBybywgc3VwcG9ydCAqYm90aCpcclxuICAvLyAgIHRvdWNoIGFuZCBjbGlja3MuIFRoaXMgbWVhbnQgdGhlIGNvbmRpdGlvbmFsIGVmZmVjdGl2ZWx5IGRyb3BwZWRcclxuICAvLyAgIHN1cHBvcnQgZm9yIHRoZSB1c2VyJ3MgbW91c2UsIGZydXN0cmF0aW5nIHVzZXJzIHdobyBwcmVmZXJyZWRcclxuICAvLyAgIGl0IG9uIHRob3NlIHN5c3RlbXMuXHJcbiAgQ0xJQ0s6ICdjbGljaycsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgZWxwcm90byA9IHdpbmRvdy5IVE1MRWxlbWVudC5wcm90b3R5cGU7XHJcbmNvbnN0IEhJRERFTiA9ICdoaWRkZW4nO1xyXG5cclxuaWYgKCEoSElEREVOIGluIGVscHJvdG8pKSB7XHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVscHJvdG8sIEhJRERFTiwge1xyXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShISURERU4pO1xyXG4gICAgfSxcclxuICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKEhJRERFTiwgJycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSk7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vLyBwb2x5ZmlsbHMgSFRNTEVsZW1lbnQucHJvdG90eXBlLmNsYXNzTGlzdCBhbmQgRE9NVG9rZW5MaXN0XHJcbnJlcXVpcmUoJ2NsYXNzbGlzdC1wb2x5ZmlsbCcpO1xyXG4vLyBwb2x5ZmlsbHMgSFRNTEVsZW1lbnQucHJvdG90eXBlLmhpZGRlblxyXG5yZXF1aXJlKCcuL2VsZW1lbnQtaGlkZGVuJyk7XHJcblxyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24nKTtcclxucmVxdWlyZSgnY29yZS1qcy9mbi9hcnJheS9mcm9tJyk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XHJcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XHJcbmNvbnN0IEJlaGF2aW9yID0gcmVxdWlyZSgncmVjZXB0b3IvYmVoYXZpb3InKTtcclxuXHJcbmNvbnN0IHNlcXVlbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gIGNvbnN0IHNlcSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcclxuICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgaWYgKCF0YXJnZXQpIHtcclxuICAgICAgdGFyZ2V0ID0gZG9jdW1lbnQuYm9keTtcclxuICAgIH1cclxuICAgIGZvckVhY2goc2VxLCBtZXRob2QgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXNbIG1ldGhvZCBdID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGhpc1sgbWV0aG9kIF0uY2FsbCh0aGlzLCB0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIGJlaGF2aW9yXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBldmVudHNcclxuICogQHBhcmFtIHtvYmplY3Q/fSBwcm9wc1xyXG4gKiBAcmV0dXJuIHtyZWNlcHRvci5iZWhhdmlvcn1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKGV2ZW50cywgcHJvcHMpID0+IHtcclxuICByZXR1cm4gQmVoYXZpb3IoZXZlbnRzLCBhc3NpZ24oe1xyXG4gICAgb246ICAgc2VxdWVuY2UoJ2luaXQnLCAnYWRkJyksXHJcbiAgICBvZmY6ICBzZXF1ZW5jZSgndGVhcmRvd24nLCAncmVtb3ZlJyksXHJcbiAgfSwgcHJvcHMpKTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIGNsb3Nlc3RcclxuICogQGRlc2MgZ2V0IG5lYXJlc3QgcGFyZW50IGVsZW1lbnQgbWF0Y2hpbmcgc2VsZWN0b3IuXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIEhUTUwgZWxlbWVudCB3aGVyZSB0aGUgc2VhcmNoIHN0YXJ0cy5cclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gU2VsZWN0b3IgdG8gYmUgZm91bmQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAtIE5lYXJlc3QgcGFyZW50IGVsZW1lbnQgbWF0Y2hpbmcgc2VsZWN0b3IuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsb3Nlc3QgKGVsLCBzZWxlY3Rvcikge1xyXG4gIHZhciBtYXRjaGVzU2VsZWN0b3IgPSBlbC5tYXRjaGVzIHx8IGVsLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBlbC5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZWwubXNNYXRjaGVzU2VsZWN0b3I7XHJcblxyXG4gIHdoaWxlIChlbCkge1xyXG4gICAgICBpZiAobWF0Y2hlc1NlbGVjdG9yLmNhbGwoZWwsIHNlbGVjdG9yKSkge1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xyXG4gIH1cclxuICByZXR1cm4gZWw7XHJcbn07XHJcbiIsIi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTU3NDMzXHJcbmZ1bmN0aW9uIGlzRWxlbWVudEluVmlld3BvcnQgKGVsLCB3aW49d2luZG93LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2NFbD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgcmVjdC50b3AgPj0gMCAmJlxyXG4gICAgcmVjdC5sZWZ0ID49IDAgJiZcclxuICAgIHJlY3QuYm90dG9tIDw9ICh3aW4uaW5uZXJIZWlnaHQgfHwgZG9jRWwuY2xpZW50SGVpZ2h0KSAmJlxyXG4gICAgcmVjdC5yaWdodCA8PSAod2luLmlubmVyV2lkdGggfHwgZG9jRWwuY2xpZW50V2lkdGgpXHJcbiAgKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc0VsZW1lbnRJblZpZXdwb3J0O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQG5hbWUgaXNFbGVtZW50XHJcbiAqIEBkZXNjIHJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgRE9NIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgaXNFbGVtZW50ID0gdmFsdWUgPT4ge1xyXG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLm5vZGVUeXBlID09PSAxO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlbGVjdFxyXG4gKiBAZGVzYyBzZWxlY3RzIGVsZW1lbnRzIGZyb20gdGhlIERPTSBieSBjbGFzcyBzZWxlY3RvciBvciBJRCBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gVGhlIHNlbGVjdG9yIHRvIHRyYXZlcnNlIHRoZSBET00gd2l0aC5cclxuICogQHBhcmFtIHtEb2N1bWVudHxIVE1MRWxlbWVudD99IGNvbnRleHQgLSBUaGUgY29udGV4dCB0byB0cmF2ZXJzZSB0aGUgRE9NXHJcbiAqICAgaW4uIElmIG5vdCBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gdGhlIGRvY3VtZW50LlxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudFtdfSAtIEFuIGFycmF5IG9mIERPTSBub2RlcyBvciBhbiBlbXB0eSBhcnJheS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2VsZWN0IChzZWxlY3RvciwgY29udGV4dCkge1xyXG5cclxuICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFjb250ZXh0IHx8ICFpc0VsZW1lbnQoY29udGV4dCkpIHtcclxuICAgIGNvbnRleHQgPSB3aW5kb3cuZG9jdW1lbnQ7XHJcbiAgfVxyXG5cclxuICBjb25zdCBzZWxlY3Rpb24gPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChzZWxlY3Rpb24pO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xyXG5jb25zdCBDT05UUk9MUyA9ICdhcmlhLWNvbnRyb2xzJztcclxuY29uc3QgSElEREVOID0gJ2FyaWEtaGlkZGVuJztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKGJ1dHRvbiwgZXhwYW5kZWQpID0+IHtcclxuXHJcbiAgaWYgKHR5cGVvZiBleHBhbmRlZCAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICBleHBhbmRlZCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAnZmFsc2UnO1xyXG4gIH1cclxuICBidXR0b24uc2V0QXR0cmlidXRlKEVYUEFOREVELCBleHBhbmRlZCk7XHJcblxyXG4gIGNvbnN0IGlkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShDT05UUk9MUyk7XHJcbiAgY29uc3QgY29udHJvbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgaWYgKCFjb250cm9scykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAnTm8gdG9nZ2xlIHRhcmdldCBmb3VuZCB3aXRoIGlkOiBcIicgKyBpZCArICdcIidcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb250cm9scy5zZXRBdHRyaWJ1dGUoSElEREVOLCAhZXhwYW5kZWQpO1xyXG4gIHJldHVybiBleHBhbmRlZDtcclxufTtcclxuIiwiLyohXHJcbiogVGlwcHkuanMgdjIuNS4zXHJcbiogKGMpIDIwMTctMjAxOCBhdG9taWtzXHJcbiogTUlUXHJcbiovXHJcbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XHJcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxyXG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XHJcblx0KGdsb2JhbC50aXBweSA9IGZhY3RvcnkoKSk7XHJcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHZlcnNpb24gPSBcIjIuNS4zXCI7XHJcblxyXG52YXIgaXNCcm93c2VyID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XHJcblxyXG52YXIgaXNJRSA9IGlzQnJvd3NlciAmJiAvTVNJRSB8VHJpZGVudFxcLy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcbnZhciBicm93c2VyID0ge307XHJcblxyXG5pZiAoaXNCcm93c2VyKSB7XHJcbiAgYnJvd3Nlci5zdXBwb3J0ZWQgPSAncmVxdWVzdEFuaW1hdGlvbkZyYW1lJyBpbiB3aW5kb3c7XHJcbiAgYnJvd3Nlci5zdXBwb3J0c1RvdWNoID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93O1xyXG4gIGJyb3dzZXIudXNpbmdUb3VjaCA9IGZhbHNlO1xyXG4gIGJyb3dzZXIuZHluYW1pY0lucHV0RGV0ZWN0aW9uID0gdHJ1ZTtcclxuICBicm93c2VyLmlPUyA9IC9pUGhvbmV8aVBhZHxpUG9kLy50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSkgJiYgIXdpbmRvdy5NU1N0cmVhbTtcclxuICBicm93c2VyLm9uVXNlcklucHV0Q2hhbmdlID0gZnVuY3Rpb24gKCkge307XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZWxlY3RvciBjb25zdGFudHMgdXNlZCBmb3IgZ3JhYmJpbmcgZWxlbWVudHNcclxuICovXHJcbnZhciBzZWxlY3RvcnMgPSB7XHJcbiAgUE9QUEVSOiAnLnRpcHB5LXBvcHBlcicsXHJcbiAgVE9PTFRJUDogJy50aXBweS10b29sdGlwJyxcclxuICBDT05URU5UOiAnLnRpcHB5LWNvbnRlbnQnLFxyXG4gIEJBQ0tEUk9QOiAnLnRpcHB5LWJhY2tkcm9wJyxcclxuICBBUlJPVzogJy50aXBweS1hcnJvdycsXHJcbiAgUk9VTkRfQVJST1c6ICcudGlwcHktcm91bmRhcnJvdycsXHJcbiAgUkVGRVJFTkNFOiAnW2RhdGEtdGlwcHldJ1xyXG59O1xyXG5cclxudmFyIGRlZmF1bHRzID0ge1xyXG4gIHBsYWNlbWVudDogJ3RvcCcsXHJcbiAgbGl2ZVBsYWNlbWVudDogdHJ1ZSxcclxuICB0cmlnZ2VyOiAnbW91c2VlbnRlciBmb2N1cycsXHJcbiAgYW5pbWF0aW9uOiAnc2hpZnQtYXdheScsXHJcbiAgaHRtbDogZmFsc2UsXHJcbiAgYW5pbWF0ZUZpbGw6IHRydWUsXHJcbiAgYXJyb3c6IGZhbHNlLFxyXG4gIGRlbGF5OiAwLFxyXG4gIGR1cmF0aW9uOiBbMzUwLCAzMDBdLFxyXG4gIGludGVyYWN0aXZlOiBmYWxzZSxcclxuICBpbnRlcmFjdGl2ZUJvcmRlcjogMixcclxuICB0aGVtZTogJ2RhcmsnLFxyXG4gIHNpemU6ICdyZWd1bGFyJyxcclxuICBkaXN0YW5jZTogMTAsXHJcbiAgb2Zmc2V0OiAwLFxyXG4gIGhpZGVPbkNsaWNrOiB0cnVlLFxyXG4gIG11bHRpcGxlOiBmYWxzZSxcclxuICBmb2xsb3dDdXJzb3I6IGZhbHNlLFxyXG4gIGluZXJ0aWE6IGZhbHNlLFxyXG4gIHVwZGF0ZUR1cmF0aW9uOiAzNTAsXHJcbiAgc3RpY2t5OiBmYWxzZSxcclxuICBhcHBlbmRUbzogZnVuY3Rpb24gYXBwZW5kVG8oKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuYm9keTtcclxuICB9LFxyXG4gIHpJbmRleDogOTk5OSxcclxuICB0b3VjaEhvbGQ6IGZhbHNlLFxyXG4gIHBlcmZvcm1hbmNlOiBmYWxzZSxcclxuICBkeW5hbWljVGl0bGU6IGZhbHNlLFxyXG4gIGZsaXA6IHRydWUsXHJcbiAgZmxpcEJlaGF2aW9yOiAnZmxpcCcsXHJcbiAgYXJyb3dUeXBlOiAnc2hhcnAnLFxyXG4gIGFycm93VHJhbnNmb3JtOiAnJyxcclxuICBtYXhXaWR0aDogJycsXHJcbiAgdGFyZ2V0OiBudWxsLFxyXG4gIGFsbG93VGl0bGVIVE1MOiB0cnVlLFxyXG4gIHBvcHBlck9wdGlvbnM6IHt9LFxyXG4gIGNyZWF0ZVBvcHBlckluc3RhbmNlT25Jbml0OiBmYWxzZSxcclxuICBvblNob3c6IGZ1bmN0aW9uIG9uU2hvdygpIHt9LFxyXG4gIG9uU2hvd246IGZ1bmN0aW9uIG9uU2hvd24oKSB7fSxcclxuICBvbkhpZGU6IGZ1bmN0aW9uIG9uSGlkZSgpIHt9LFxyXG4gIG9uSGlkZGVuOiBmdW5jdGlvbiBvbkhpZGRlbigpIHt9XHJcbn07XHJcblxyXG4vKipcclxuICogVGhlIGtleXMgb2YgdGhlIGRlZmF1bHRzIG9iamVjdCBmb3IgcmVkdWNpbmcgZG93biBpbnRvIGEgbmV3IG9iamVjdFxyXG4gKiBVc2VkIGluIGBnZXRJbmRpdmlkdWFsT3B0aW9ucygpYFxyXG4gKi9cclxudmFyIGRlZmF1bHRzS2V5cyA9IGJyb3dzZXIuc3VwcG9ydGVkICYmIE9iamVjdC5rZXlzKGRlZmF1bHRzKTtcclxuXHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYW4gb2JqZWN0IGxpdGVyYWxcclxuICogQHBhcmFtIHsqfSB2YWx1ZVxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNPYmplY3RMaXRlcmFsKHZhbHVlKSB7XHJcbiAgcmV0dXJuIHt9LnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJztcclxufVxyXG5cclxuLyoqXHJcbiAqIFBvbnlmaWxsIGZvciBBcnJheS5mcm9tXHJcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcclxuICogQHJldHVybiB7QXJyYXl9XHJcbiAqL1xyXG5mdW5jdGlvbiB0b0FycmF5KHZhbHVlKSB7XHJcbiAgcmV0dXJuIFtdLnNsaWNlLmNhbGwodmFsdWUpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhbiBhcnJheSBvZiBlbGVtZW50cyBiYXNlZCBvbiB0aGUgc2VsZWN0b3IgaW5wdXRcclxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxFbGVtZW50W118Tm9kZUxpc3R8T2JqZWN0fSBzZWxlY3RvclxyXG4gKiBAcmV0dXJuIHtFbGVtZW50W119XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBcnJheU9mRWxlbWVudHMoc2VsZWN0b3IpIHtcclxuICBpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBFbGVtZW50IHx8IGlzT2JqZWN0TGl0ZXJhbChzZWxlY3RvcikpIHtcclxuICAgIHJldHVybiBbc2VsZWN0b3JdO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgIHJldHVybiB0b0FycmF5KHNlbGVjdG9yKTtcclxuICB9XHJcblxyXG4gIGlmIChBcnJheS5pc0FycmF5KHNlbGVjdG9yKSkge1xyXG4gICAgcmV0dXJuIHNlbGVjdG9yO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiB0b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcclxuICB9IGNhdGNoIChfKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUG9seWZpbGxzIG5lZWRlZCBwcm9wcy9tZXRob2RzIGZvciBhIHZpcnR1YWwgcmVmZXJlbmNlIG9iamVjdFxyXG4gKiBOT1RFOiBpbiB2My4wIHRoaXMgd2lsbCBiZSBwdXJlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWZlcmVuY2VcclxuICovXHJcbmZ1bmN0aW9uIHBvbHlmaWxsVmlydHVhbFJlZmVyZW5jZVByb3BzKHJlZmVyZW5jZSkge1xyXG4gIHJlZmVyZW5jZS5yZWZPYmogPSB0cnVlO1xyXG4gIHJlZmVyZW5jZS5hdHRyaWJ1dGVzID0gcmVmZXJlbmNlLmF0dHJpYnV0ZXMgfHwge307XHJcbiAgcmVmZXJlbmNlLnNldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xyXG4gICAgcmVmZXJlbmNlLmF0dHJpYnV0ZXNba2V5XSA9IHZhbDtcclxuICB9O1xyXG4gIHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICByZXR1cm4gcmVmZXJlbmNlLmF0dHJpYnV0ZXNba2V5XTtcclxuICB9O1xyXG4gIHJlZmVyZW5jZS5yZW1vdmVBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICBkZWxldGUgcmVmZXJlbmNlLmF0dHJpYnV0ZXNba2V5XTtcclxuICB9O1xyXG4gIHJlZmVyZW5jZS5oYXNBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICByZXR1cm4ga2V5IGluIHJlZmVyZW5jZS5hdHRyaWJ1dGVzO1xyXG4gIH07XHJcbiAgcmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7fTtcclxuICByZWZlcmVuY2UucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHt9O1xyXG4gIHJlZmVyZW5jZS5jbGFzc0xpc3QgPSB7XHJcbiAgICBjbGFzc05hbWVzOiB7fSxcclxuICAgIGFkZDogZnVuY3Rpb24gYWRkKGtleSkge1xyXG4gICAgICByZXR1cm4gcmVmZXJlbmNlLmNsYXNzTGlzdC5jbGFzc05hbWVzW2tleV0gPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKGtleSkge1xyXG4gICAgICBkZWxldGUgcmVmZXJlbmNlLmNsYXNzTGlzdC5jbGFzc05hbWVzW2tleV07XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbiBjb250YWlucyhrZXkpIHtcclxuICAgICAgcmV0dXJuIGtleSBpbiByZWZlcmVuY2UuY2xhc3NMaXN0LmNsYXNzTmFtZXM7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHN1cHBvcnRlZCBwcmVmaXhlZCBwcm9wZXJ0eSAtIG9ubHkgYHdlYmtpdGAgaXMgbmVlZGVkLCBgbW96YCwgYG1zYCBhbmQgYG9gIGFyZSBvYnNvbGV0ZVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlcclxuICogQHJldHVybiB7U3RyaW5nfSAtIGJyb3dzZXIgc3VwcG9ydGVkIHByZWZpeGVkIHByb3BlcnR5XHJcbiAqL1xyXG5mdW5jdGlvbiBwcmVmaXgocHJvcGVydHkpIHtcclxuICB2YXIgcHJlZml4ZXMgPSBbJycsICd3ZWJraXQnXTtcclxuICB2YXIgdXBwZXJQcm9wID0gcHJvcGVydHkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eS5zbGljZSgxKTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIF9wcmVmaXggPSBwcmVmaXhlc1tpXTtcclxuICAgIHZhciBwcmVmaXhlZFByb3AgPSBfcHJlZml4ID8gX3ByZWZpeCArIHVwcGVyUHJvcCA6IHByb3BlcnR5O1xyXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudC5ib2R5LnN0eWxlW3ByZWZpeGVkUHJvcF0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybiBwcmVmaXhlZFByb3A7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBkaXYgZWxlbWVudFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuZnVuY3Rpb24gZGl2KCkge1xyXG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBwb3BwZXIgZWxlbWVudCB0aGVuIHJldHVybnMgaXRcclxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIC0gdGhlIHBvcHBlciBpZFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdGl0bGUgLSB0aGUgdG9vbHRpcCdzIGB0aXRsZWAgYXR0cmlidXRlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gaW5kaXZpZHVhbCBvcHRpb25zXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9IC0gdGhlIHBvcHBlciBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVQb3BwZXJFbGVtZW50KGlkLCB0aXRsZSwgb3B0aW9ucykge1xyXG4gIHZhciBwb3BwZXIgPSBkaXYoKTtcclxuICBwb3BwZXIuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0aXBweS1wb3BwZXInKTtcclxuICBwb3BwZXIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcclxuICBwb3BwZXIuc2V0QXR0cmlidXRlKCdpZCcsICd0aXBweS0nICsgaWQpO1xyXG4gIHBvcHBlci5zdHlsZS56SW5kZXggPSBvcHRpb25zLnpJbmRleDtcclxuICBwb3BwZXIuc3R5bGUubWF4V2lkdGggPSBvcHRpb25zLm1heFdpZHRoO1xyXG5cclxuICB2YXIgdG9vbHRpcCA9IGRpdigpO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0aXBweS10b29sdGlwJyk7XHJcbiAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZScsIG9wdGlvbnMuc2l6ZSk7XHJcbiAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYW5pbWF0aW9uJywgb3B0aW9ucy5hbmltYXRpb24pO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXRlJywgJ2hpZGRlbicpO1xyXG4gIG9wdGlvbnMudGhlbWUuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcbiAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQodCArICctdGhlbWUnKTtcclxuICB9KTtcclxuXHJcbiAgdmFyIGNvbnRlbnQgPSBkaXYoKTtcclxuICBjb250ZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGlwcHktY29udGVudCcpO1xyXG5cclxuICBpZiAob3B0aW9ucy5hcnJvdykge1xyXG4gICAgdmFyIGFycm93ID0gZGl2KCk7XHJcbiAgICBhcnJvdy5zdHlsZVtwcmVmaXgoJ3RyYW5zZm9ybScpXSA9IG9wdGlvbnMuYXJyb3dUcmFuc2Zvcm07XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuYXJyb3dUeXBlID09PSAncm91bmQnKSB7XHJcbiAgICAgIGFycm93LmNsYXNzTGlzdC5hZGQoJ3RpcHB5LXJvdW5kYXJyb3cnKTtcclxuICAgICAgYXJyb3cuaW5uZXJIVE1MID0gJzxzdmcgdmlld0JveD1cIjAgMCAyNCA4XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJNMyA4czIuMDIxLS4wMTUgNS4yNTMtNC4yMThDOS41ODQgMi4wNTEgMTAuNzk3IDEuMDA3IDEyIDFjMS4yMDMtLjAwNyAyLjQxNiAxLjAzNSAzLjc2MSAyLjc4MkMxOS4wMTIgOC4wMDUgMjEgOCAyMSA4SDN6XCIvPjwvc3ZnPic7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhcnJvdy5jbGFzc0xpc3QuYWRkKCd0aXBweS1hcnJvdycpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvb2x0aXAuYXBwZW5kQ2hpbGQoYXJyb3cpO1xyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMuYW5pbWF0ZUZpbGwpIHtcclxuICAgIC8vIENyZWF0ZSBhbmltYXRlRmlsbCBjaXJjbGUgZWxlbWVudCBmb3IgYW5pbWF0aW9uXHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS1hbmltYXRlZmlsbCcsICcnKTtcclxuICAgIHZhciBiYWNrZHJvcCA9IGRpdigpO1xyXG4gICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgndGlwcHktYmFja2Ryb3AnKTtcclxuICAgIGJhY2tkcm9wLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsICdoaWRkZW4nKTtcclxuICAgIHRvb2x0aXAuYXBwZW5kQ2hpbGQoYmFja2Ryb3ApO1xyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMuaW5lcnRpYSkge1xyXG4gICAgLy8gQ2hhbmdlIHRyYW5zaXRpb24gdGltaW5nIGZ1bmN0aW9uIGN1YmljIGJlemllclxyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5lcnRpYScsICcnKTtcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS1pbnRlcmFjdGl2ZScsICcnKTtcclxuICB9XHJcblxyXG4gIHZhciBodG1sID0gb3B0aW9ucy5odG1sO1xyXG4gIGlmIChodG1sKSB7XHJcbiAgICB2YXIgdGVtcGxhdGVJZCA9IHZvaWQgMDtcclxuXHJcbiAgICBpZiAoaHRtbCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcclxuICAgICAgY29udGVudC5hcHBlbmRDaGlsZChodG1sKTtcclxuICAgICAgdGVtcGxhdGVJZCA9ICcjJyArIChodG1sLmlkIHx8ICd0aXBweS1odG1sLXRlbXBsYXRlJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyB0cmljayBsaW50ZXJzOiBodHRwczovL2dpdGh1Yi5jb20vYXRvbWlrcy90aXBweWpzL2lzc3Vlcy8xOTdcclxuICAgICAgY29udGVudFt0cnVlICYmICdpbm5lckhUTUwnXSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaHRtbClbdHJ1ZSAmJiAnaW5uZXJIVE1MJ107XHJcbiAgICAgIHRlbXBsYXRlSWQgPSBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIHBvcHBlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtaHRtbCcsICcnKTtcclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlLWlkJywgdGVtcGxhdGVJZCk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgcG9wcGVyLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgY29udGVudFtvcHRpb25zLmFsbG93VGl0bGVIVE1MID8gJ2lubmVySFRNTCcgOiAndGV4dENvbnRlbnQnXSA9IHRpdGxlO1xyXG4gIH1cclxuXHJcbiAgdG9vbHRpcC5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuICBwb3BwZXIuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XHJcblxyXG4gIHJldHVybiBwb3BwZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgdHJpZ2dlciBieSBhZGRpbmcgdGhlIG5lY2Vzc2FyeSBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIHJlZmVyZW5jZSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGUgLSB0aGUgY3VzdG9tIGV2ZW50IHNwZWNpZmllZCBpbiB0aGUgYHRyaWdnZXJgIHNldHRpbmdcclxuICogQHBhcmFtIHtFbGVtZW50fSByZWZlcmVuY2VcclxuICogQHBhcmFtIHtPYmplY3R9IGhhbmRsZXJzIC0gdGhlIGhhbmRsZXJzIGZvciBlYWNoIGV2ZW50XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqIEByZXR1cm4ge0FycmF5fSAtIGFycmF5IG9mIGxpc3RlbmVyIG9iamVjdHNcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVRyaWdnZXIoZXZlbnRUeXBlLCByZWZlcmVuY2UsIGhhbmRsZXJzLCBvcHRpb25zKSB7XHJcbiAgdmFyIG9uVHJpZ2dlciA9IGhhbmRsZXJzLm9uVHJpZ2dlcixcclxuICAgICAgb25Nb3VzZUxlYXZlID0gaGFuZGxlcnMub25Nb3VzZUxlYXZlLFxyXG4gICAgICBvbkJsdXIgPSBoYW5kbGVycy5vbkJsdXIsXHJcbiAgICAgIG9uRGVsZWdhdGVTaG93ID0gaGFuZGxlcnMub25EZWxlZ2F0ZVNob3csXHJcbiAgICAgIG9uRGVsZWdhdGVIaWRlID0gaGFuZGxlcnMub25EZWxlZ2F0ZUhpZGU7XHJcblxyXG4gIHZhciBsaXN0ZW5lcnMgPSBbXTtcclxuXHJcbiAgaWYgKGV2ZW50VHlwZSA9PT0gJ21hbnVhbCcpIHJldHVybiBsaXN0ZW5lcnM7XHJcblxyXG4gIHZhciBvbiA9IGZ1bmN0aW9uIG9uKGV2ZW50VHlwZSwgaGFuZGxlcikge1xyXG4gICAgcmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyKTtcclxuICAgIGxpc3RlbmVycy5wdXNoKHsgZXZlbnQ6IGV2ZW50VHlwZSwgaGFuZGxlcjogaGFuZGxlciB9KTtcclxuICB9O1xyXG5cclxuICBpZiAoIW9wdGlvbnMudGFyZ2V0KSB7XHJcbiAgICBvbihldmVudFR5cGUsIG9uVHJpZ2dlcik7XHJcblxyXG4gICAgaWYgKGJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiBvcHRpb25zLnRvdWNoSG9sZCkge1xyXG4gICAgICBvbigndG91Y2hzdGFydCcsIG9uVHJpZ2dlcik7XHJcbiAgICAgIG9uKCd0b3VjaGVuZCcsIG9uTW91c2VMZWF2ZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnRUeXBlID09PSAnbW91c2VlbnRlcicpIHtcclxuICAgICAgb24oJ21vdXNlbGVhdmUnLCBvbk1vdXNlTGVhdmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gJ2ZvY3VzJykge1xyXG4gICAgICBvbihpc0lFID8gJ2ZvY3Vzb3V0JyA6ICdibHVyJywgb25CbHVyKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiBvcHRpb25zLnRvdWNoSG9sZCkge1xyXG4gICAgICBvbigndG91Y2hzdGFydCcsIG9uRGVsZWdhdGVTaG93KTtcclxuICAgICAgb24oJ3RvdWNoZW5kJywgb25EZWxlZ2F0ZUhpZGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gJ21vdXNlZW50ZXInKSB7XHJcbiAgICAgIG9uKCdtb3VzZW92ZXInLCBvbkRlbGVnYXRlU2hvdyk7XHJcbiAgICAgIG9uKCdtb3VzZW91dCcsIG9uRGVsZWdhdGVIaWRlKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudFR5cGUgPT09ICdmb2N1cycpIHtcclxuICAgICAgb24oJ2ZvY3VzaW4nLCBvbkRlbGVnYXRlU2hvdyk7XHJcbiAgICAgIG9uKCdmb2N1c291dCcsIG9uRGVsZWdhdGVIaWRlKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudFR5cGUgPT09ICdjbGljaycpIHtcclxuICAgICAgb24oJ2NsaWNrJywgb25EZWxlZ2F0ZVNob3cpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGxpc3RlbmVycztcclxufVxyXG5cclxudmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xyXG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbnZhciBjcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcclxuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xyXG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XHJcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XHJcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xyXG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XHJcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XHJcbiAgfTtcclxufSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XHJcblxyXG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xyXG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0YXJnZXQ7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhbiBvYmplY3Qgb2Ygc2V0dGluZ3MgdG8gb3ZlcnJpZGUgZ2xvYmFsIHNldHRpbmdzXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcmVmZXJlbmNlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZU9wdGlvbnNcclxuICogQHJldHVybiB7T2JqZWN0fSAtIGluZGl2aWR1YWwgb3B0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5kaXZpZHVhbE9wdGlvbnMocmVmZXJlbmNlLCBpbnN0YW5jZU9wdGlvbnMpIHtcclxuICB2YXIgb3B0aW9ucyA9IGRlZmF1bHRzS2V5cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XHJcbiAgICB2YXIgdmFsID0gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXBweS0nICsga2V5LnRvTG93ZXJDYXNlKCkpIHx8IGluc3RhbmNlT3B0aW9uc1trZXldO1xyXG5cclxuICAgIC8vIENvbnZlcnQgc3RyaW5ncyB0byBib29sZWFuc1xyXG4gICAgaWYgKHZhbCA9PT0gJ2ZhbHNlJykgdmFsID0gZmFsc2U7XHJcbiAgICBpZiAodmFsID09PSAndHJ1ZScpIHZhbCA9IHRydWU7XHJcblxyXG4gICAgLy8gQ29udmVydCBudW1iZXIgc3RyaW5ncyB0byB0cnVlIG51bWJlcnNcclxuICAgIGlmIChpc0Zpbml0ZSh2YWwpICYmICFpc05hTihwYXJzZUZsb2F0KHZhbCkpKSB7XHJcbiAgICAgIHZhbCA9IHBhcnNlRmxvYXQodmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb252ZXJ0IGFycmF5IHN0cmluZ3MgdG8gYWN0dWFsIGFycmF5c1xyXG4gICAgaWYgKGtleSAhPT0gJ3RhcmdldCcgJiYgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsLnRyaW0oKS5jaGFyQXQoMCkgPT09ICdbJykge1xyXG4gICAgICB2YWwgPSBKU09OLnBhcnNlKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWNjW2tleV0gPSB2YWw7XHJcblxyXG4gICAgcmV0dXJuIGFjYztcclxuICB9LCB7fSk7XHJcblxyXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgaW5zdGFuY2VPcHRpb25zLCBvcHRpb25zKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEV2YWx1YXRlcy9tb2RpZmllcyB0aGUgb3B0aW9ucyBvYmplY3QgZm9yIGFwcHJvcHJpYXRlIGJlaGF2aW9yXHJcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IHJlZmVyZW5jZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIHtPYmplY3R9IG1vZGlmaWVkL2V2YWx1YXRlZCBvcHRpb25zXHJcbiAqL1xyXG5mdW5jdGlvbiBldmFsdWF0ZU9wdGlvbnMocmVmZXJlbmNlLCBvcHRpb25zKSB7XHJcbiAgLy8gYW5pbWF0ZUZpbGwgaXMgZGlzYWJsZWQgaWYgYW4gYXJyb3cgaXMgdHJ1ZVxyXG4gIGlmIChvcHRpb25zLmFycm93KSB7XHJcbiAgICBvcHRpb25zLmFuaW1hdGVGaWxsID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAob3B0aW9ucy5hcHBlbmRUbyAmJiB0eXBlb2Ygb3B0aW9ucy5hcHBlbmRUbyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgb3B0aW9ucy5hcHBlbmRUbyA9IG9wdGlvbnMuYXBwZW5kVG8oKTtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5odG1sID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBvcHRpb25zLmh0bWwgPSBvcHRpb25zLmh0bWwocmVmZXJlbmNlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvcHRpb25zO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBpbm5lciBlbGVtZW50cyBvZiB0aGUgcG9wcGVyIGVsZW1lbnRcclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpIHtcclxuICB2YXIgc2VsZWN0ID0gZnVuY3Rpb24gc2VsZWN0KHMpIHtcclxuICAgIHJldHVybiBwb3BwZXIucXVlcnlTZWxlY3RvcihzKTtcclxuICB9O1xyXG4gIHJldHVybiB7XHJcbiAgICB0b29sdGlwOiBzZWxlY3Qoc2VsZWN0b3JzLlRPT0xUSVApLFxyXG4gICAgYmFja2Ryb3A6IHNlbGVjdChzZWxlY3RvcnMuQkFDS0RST1ApLFxyXG4gICAgY29udGVudDogc2VsZWN0KHNlbGVjdG9ycy5DT05URU5UKSxcclxuICAgIGFycm93OiBzZWxlY3Qoc2VsZWN0b3JzLkFSUk9XKSB8fCBzZWxlY3Qoc2VsZWN0b3JzLlJPVU5EX0FSUk9XKVxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmVzIHRoZSB0aXRsZSBmcm9tIGFuIGVsZW1lbnQsIHNldHRpbmcgYGRhdGEtb3JpZ2luYWwtdGl0bGVgXHJcbiAqIGFwcHJvcHJpYXRlbHlcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxyXG4gKi9cclxuZnVuY3Rpb24gcmVtb3ZlVGl0bGUoZWwpIHtcclxuICB2YXIgdGl0bGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ3RpdGxlJyk7XHJcbiAgLy8gT25seSBzZXQgYGRhdGEtb3JpZ2luYWwtdGl0bGVgIGF0dHIgaWYgdGhlcmUgaXMgYSB0aXRsZVxyXG4gIGlmICh0aXRsZSkge1xyXG4gICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgdGl0bGUpO1xyXG4gIH1cclxuICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ3RpdGxlJyk7XHJcbn1cclxuXHJcbi8qKiFcclxuICogQGZpbGVPdmVydmlldyBLaWNrYXNzIGxpYnJhcnkgdG8gY3JlYXRlIGFuZCBwbGFjZSBwb3BwZXJzIG5lYXIgdGhlaXIgcmVmZXJlbmNlIGVsZW1lbnRzLlxyXG4gKiBAdmVyc2lvbiAxLjE0LjNcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IChjKSAyMDE2IEZlZGVyaWNvIFppdm9sbyBhbmQgY29udHJpYnV0b3JzXHJcbiAqXHJcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcbiAqXHJcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxyXG4gKiBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG4gKlxyXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxyXG4gKiBTT0ZUV0FSRS5cclxuICovXHJcbnZhciBpc0Jyb3dzZXIkMSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCc7XHJcblxyXG52YXIgbG9uZ2VyVGltZW91dEJyb3dzZXJzID0gWydFZGdlJywgJ1RyaWRlbnQnLCAnRmlyZWZveCddO1xyXG52YXIgdGltZW91dER1cmF0aW9uID0gMDtcclxuZm9yICh2YXIgaSA9IDA7IGkgPCBsb25nZXJUaW1lb3V0QnJvd3NlcnMubGVuZ3RoOyBpICs9IDEpIHtcclxuICBpZiAoaXNCcm93c2VyJDEgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKGxvbmdlclRpbWVvdXRCcm93c2Vyc1tpXSkgPj0gMCkge1xyXG4gICAgdGltZW91dER1cmF0aW9uID0gMTtcclxuICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWljcm90YXNrRGVib3VuY2UoZm4pIHtcclxuICB2YXIgY2FsbGVkID0gZmFsc2U7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChjYWxsZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY2FsbGVkID0gdHJ1ZTtcclxuICAgIHdpbmRvdy5Qcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgY2FsbGVkID0gZmFsc2U7XHJcbiAgICAgIGZuKCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiB0YXNrRGVib3VuY2UoZm4pIHtcclxuICB2YXIgc2NoZWR1bGVkID0gZmFsc2U7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghc2NoZWR1bGVkKSB7XHJcbiAgICAgIHNjaGVkdWxlZCA9IHRydWU7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNjaGVkdWxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGZuKCk7XHJcbiAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxudmFyIHN1cHBvcnRzTWljcm9UYXNrcyA9IGlzQnJvd3NlciQxICYmIHdpbmRvdy5Qcm9taXNlO1xyXG5cclxuLyoqXHJcbiogQ3JlYXRlIGEgZGVib3VuY2VkIHZlcnNpb24gb2YgYSBtZXRob2QsIHRoYXQncyBhc3luY2hyb25vdXNseSBkZWZlcnJlZFxyXG4qIGJ1dCBjYWxsZWQgaW4gdGhlIG1pbmltdW0gdGltZSBwb3NzaWJsZS5cclxuKlxyXG4qIEBtZXRob2RcclxuKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiogQGFyZ3VtZW50IHtGdW5jdGlvbn0gZm5cclxuKiBAcmV0dXJucyB7RnVuY3Rpb259XHJcbiovXHJcbnZhciBkZWJvdW5jZSA9IHN1cHBvcnRzTWljcm9UYXNrcyA/IG1pY3JvdGFza0RlYm91bmNlIDogdGFza0RlYm91bmNlO1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhIGZ1bmN0aW9uXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0FueX0gZnVuY3Rpb25Ub0NoZWNrIC0gdmFyaWFibGUgdG8gY2hlY2tcclxuICogQHJldHVybnMge0Jvb2xlYW59IGFuc3dlciB0bzogaXMgYSBmdW5jdGlvbj9cclxuICovXHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZnVuY3Rpb25Ub0NoZWNrKSB7XHJcbiAgdmFyIGdldFR5cGUgPSB7fTtcclxuICByZXR1cm4gZnVuY3Rpb25Ub0NoZWNrICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbChmdW5jdGlvblRvQ2hlY2spID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IENTUyBjb21wdXRlZCBwcm9wZXJ0eSBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFZW1lbnR9IGVsZW1lbnRcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHByb3BlcnR5XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCwgcHJvcGVydHkpIHtcclxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuICAvLyBOT1RFOiAxIERPTSBhY2Nlc3MgaGVyZVxyXG4gIHZhciBjc3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpO1xyXG4gIHJldHVybiBwcm9wZXJ0eSA/IGNzc1twcm9wZXJ0eV0gOiBjc3M7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBwYXJlbnROb2RlIG9yIHRoZSBob3N0IG9mIHRoZSBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybnMge0VsZW1lbnR9IHBhcmVudFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UGFyZW50Tm9kZShlbGVtZW50KSB7XHJcbiAgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdIVE1MJykge1xyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgfVxyXG4gIHJldHVybiBlbGVtZW50LnBhcmVudE5vZGUgfHwgZWxlbWVudC5ob3N0O1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgc2Nyb2xsaW5nIHBhcmVudCBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtFbGVtZW50fSBzY3JvbGwgcGFyZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTY3JvbGxQYXJlbnQoZWxlbWVudCkge1xyXG4gIC8vIFJldHVybiBib2R5LCBgZ2V0U2Nyb2xsYCB3aWxsIHRha2UgY2FyZSB0byBnZXQgdGhlIGNvcnJlY3QgYHNjcm9sbFRvcGAgZnJvbSBpdFxyXG4gIGlmICghZWxlbWVudCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmJvZHk7XHJcbiAgfVxyXG5cclxuICBzd2l0Y2ggKGVsZW1lbnQubm9kZU5hbWUpIHtcclxuICAgIGNhc2UgJ0hUTUwnOlxyXG4gICAgY2FzZSAnQk9EWSc6XHJcbiAgICAgIHJldHVybiBlbGVtZW50Lm93bmVyRG9jdW1lbnQuYm9keTtcclxuICAgIGNhc2UgJyNkb2N1bWVudCc6XHJcbiAgICAgIHJldHVybiBlbGVtZW50LmJvZHk7XHJcbiAgfVxyXG5cclxuICAvLyBGaXJlZm94IHdhbnQgdXMgdG8gY2hlY2sgYC14YCBhbmQgYC15YCB2YXJpYXRpb25zIGFzIHdlbGxcclxuXHJcbiAgdmFyIF9nZXRTdHlsZUNvbXB1dGVkUHJvcCA9IGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShlbGVtZW50KSxcclxuICAgICAgb3ZlcmZsb3cgPSBfZ2V0U3R5bGVDb21wdXRlZFByb3Aub3ZlcmZsb3csXHJcbiAgICAgIG92ZXJmbG93WCA9IF9nZXRTdHlsZUNvbXB1dGVkUHJvcC5vdmVyZmxvd1gsXHJcbiAgICAgIG92ZXJmbG93WSA9IF9nZXRTdHlsZUNvbXB1dGVkUHJvcC5vdmVyZmxvd1k7XHJcblxyXG4gIGlmICgvKGF1dG98c2Nyb2xsfG92ZXJsYXkpLy50ZXN0KG92ZXJmbG93ICsgb3ZlcmZsb3dZICsgb3ZlcmZsb3dYKSkge1xyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ2V0U2Nyb2xsUGFyZW50KGdldFBhcmVudE5vZGUoZWxlbWVudCkpO1xyXG59XHJcblxyXG52YXIgaXNJRTExID0gaXNCcm93c2VyJDEgJiYgISEod2luZG93Lk1TSW5wdXRNZXRob2RDb250ZXh0ICYmIGRvY3VtZW50LmRvY3VtZW50TW9kZSk7XHJcbnZhciBpc0lFMTAgPSBpc0Jyb3dzZXIkMSAmJiAvTVNJRSAxMC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSBicm93c2VyIGlzIEludGVybmV0IEV4cGxvcmVyXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge051bWJlcn0gdmVyc2lvbiB0byBjaGVja1xyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gaXNJRVxyXG4gKi9cclxuZnVuY3Rpb24gaXNJRSQxKHZlcnNpb24pIHtcclxuICBpZiAodmVyc2lvbiA9PT0gMTEpIHtcclxuICAgIHJldHVybiBpc0lFMTE7XHJcbiAgfVxyXG4gIGlmICh2ZXJzaW9uID09PSAxMCkge1xyXG4gICAgcmV0dXJuIGlzSUUxMDtcclxuICB9XHJcbiAgcmV0dXJuIGlzSUUxMSB8fCBpc0lFMTA7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBvZmZzZXQgcGFyZW50IG9mIHRoZSBnaXZlbiBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybnMge0VsZW1lbnR9IG9mZnNldCBwYXJlbnRcclxuICovXHJcbmZ1bmN0aW9uIGdldE9mZnNldFBhcmVudChlbGVtZW50KSB7XHJcbiAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgdmFyIG5vT2Zmc2V0UGFyZW50ID0gaXNJRSQxKDEwKSA/IGRvY3VtZW50LmJvZHkgOiBudWxsO1xyXG5cclxuICAvLyBOT1RFOiAxIERPTSBhY2Nlc3MgaGVyZVxyXG4gIHZhciBvZmZzZXRQYXJlbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcclxuICAvLyBTa2lwIGhpZGRlbiBlbGVtZW50cyB3aGljaCBkb24ndCBoYXZlIGFuIG9mZnNldFBhcmVudFxyXG4gIHdoaWxlIChvZmZzZXRQYXJlbnQgPT09IG5vT2Zmc2V0UGFyZW50ICYmIGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKSB7XHJcbiAgICBvZmZzZXRQYXJlbnQgPSAoZWxlbWVudCA9IGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKS5vZmZzZXRQYXJlbnQ7XHJcbiAgfVxyXG5cclxuICB2YXIgbm9kZU5hbWUgPSBvZmZzZXRQYXJlbnQgJiYgb2Zmc2V0UGFyZW50Lm5vZGVOYW1lO1xyXG5cclxuICBpZiAoIW5vZGVOYW1lIHx8IG5vZGVOYW1lID09PSAnQk9EWScgfHwgbm9kZU5hbWUgPT09ICdIVE1MJykge1xyXG4gICAgcmV0dXJuIGVsZW1lbnQgPyBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgLy8gLm9mZnNldFBhcmVudCB3aWxsIHJldHVybiB0aGUgY2xvc2VzdCBURCBvciBUQUJMRSBpbiBjYXNlXHJcbiAgLy8gbm8gb2Zmc2V0UGFyZW50IGlzIHByZXNlbnQsIEkgaGF0ZSB0aGlzIGpvYi4uLlxyXG4gIGlmIChbJ1REJywgJ1RBQkxFJ10uaW5kZXhPZihvZmZzZXRQYXJlbnQubm9kZU5hbWUpICE9PSAtMSAmJiBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkob2Zmc2V0UGFyZW50LCAncG9zaXRpb24nKSA9PT0gJ3N0YXRpYycpIHtcclxuICAgIHJldHVybiBnZXRPZmZzZXRQYXJlbnQob2Zmc2V0UGFyZW50KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvZmZzZXRQYXJlbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzT2Zmc2V0Q29udGFpbmVyKGVsZW1lbnQpIHtcclxuICB2YXIgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lO1xyXG5cclxuICBpZiAobm9kZU5hbWUgPT09ICdCT0RZJykge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gbm9kZU5hbWUgPT09ICdIVE1MJyB8fCBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZCkgPT09IGVsZW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaW5kcyB0aGUgcm9vdCBub2RlIChkb2N1bWVudCwgc2hhZG93RE9NIHJvb3QpIG9mIHRoZSBnaXZlbiBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IG5vZGVcclxuICogQHJldHVybnMge0VsZW1lbnR9IHJvb3Qgbm9kZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Um9vdChub2RlKSB7XHJcbiAgaWYgKG5vZGUucGFyZW50Tm9kZSAhPT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIGdldFJvb3Qobm9kZS5wYXJlbnROb2RlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBub2RlO1xyXG59XHJcblxyXG4vKipcclxuICogRmluZHMgdGhlIG9mZnNldCBwYXJlbnQgY29tbW9uIHRvIHRoZSB0d28gcHJvdmlkZWQgbm9kZXNcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudDFcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50MlxyXG4gKiBAcmV0dXJucyB7RWxlbWVudH0gY29tbW9uIG9mZnNldCBwYXJlbnRcclxuICovXHJcbmZ1bmN0aW9uIGZpbmRDb21tb25PZmZzZXRQYXJlbnQoZWxlbWVudDEsIGVsZW1lbnQyKSB7XHJcbiAgLy8gVGhpcyBjaGVjayBpcyBuZWVkZWQgdG8gYXZvaWQgZXJyb3JzIGluIGNhc2Ugb25lIG9mIHRoZSBlbGVtZW50cyBpc24ndCBkZWZpbmVkIGZvciBhbnkgcmVhc29uXHJcbiAgaWYgKCFlbGVtZW50MSB8fCAhZWxlbWVudDEubm9kZVR5cGUgfHwgIWVsZW1lbnQyIHx8ICFlbGVtZW50Mi5ub2RlVHlwZSkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICB9XHJcblxyXG4gIC8vIEhlcmUgd2UgbWFrZSBzdXJlIHRvIGdpdmUgYXMgXCJzdGFydFwiIHRoZSBlbGVtZW50IHRoYXQgY29tZXMgZmlyc3QgaW4gdGhlIERPTVxyXG4gIHZhciBvcmRlciA9IGVsZW1lbnQxLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGVsZW1lbnQyKSAmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fRk9MTE9XSU5HO1xyXG4gIHZhciBzdGFydCA9IG9yZGVyID8gZWxlbWVudDEgOiBlbGVtZW50MjtcclxuICB2YXIgZW5kID0gb3JkZXIgPyBlbGVtZW50MiA6IGVsZW1lbnQxO1xyXG5cclxuICAvLyBHZXQgY29tbW9uIGFuY2VzdG9yIGNvbnRhaW5lclxyXG4gIHZhciByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XHJcbiAgcmFuZ2Uuc2V0U3RhcnQoc3RhcnQsIDApO1xyXG4gIHJhbmdlLnNldEVuZChlbmQsIDApO1xyXG4gIHZhciBjb21tb25BbmNlc3RvckNvbnRhaW5lciA9IHJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xyXG5cclxuICAvLyBCb3RoIG5vZGVzIGFyZSBpbnNpZGUgI2RvY3VtZW50XHJcblxyXG4gIGlmIChlbGVtZW50MSAhPT0gY29tbW9uQW5jZXN0b3JDb250YWluZXIgJiYgZWxlbWVudDIgIT09IGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyIHx8IHN0YXJ0LmNvbnRhaW5zKGVuZCkpIHtcclxuICAgIGlmIChpc09mZnNldENvbnRhaW5lcihjb21tb25BbmNlc3RvckNvbnRhaW5lcikpIHtcclxuICAgICAgcmV0dXJuIGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBnZXRPZmZzZXRQYXJlbnQoY29tbW9uQW5jZXN0b3JDb250YWluZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gb25lIG9mIHRoZSBub2RlcyBpcyBpbnNpZGUgc2hhZG93RE9NLCBmaW5kIHdoaWNoIG9uZVxyXG4gIHZhciBlbGVtZW50MXJvb3QgPSBnZXRSb290KGVsZW1lbnQxKTtcclxuICBpZiAoZWxlbWVudDFyb290Lmhvc3QpIHtcclxuICAgIHJldHVybiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KGVsZW1lbnQxcm9vdC5ob3N0LCBlbGVtZW50Mik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KGVsZW1lbnQxLCBnZXRSb290KGVsZW1lbnQyKS5ob3N0KTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBzY3JvbGwgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQgaW4gdGhlIGdpdmVuIHNpZGUgKHRvcCBhbmQgbGVmdClcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gc2lkZSBgdG9wYCBvciBgbGVmdGBcclxuICogQHJldHVybnMge251bWJlcn0gYW1vdW50IG9mIHNjcm9sbGVkIHBpeGVsc1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0U2Nyb2xsKGVsZW1lbnQpIHtcclxuICB2YXIgc2lkZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJ3RvcCc7XHJcblxyXG4gIHZhciB1cHBlclNpZGUgPSBzaWRlID09PSAndG9wJyA/ICdzY3JvbGxUb3AnIDogJ3Njcm9sbExlZnQnO1xyXG4gIHZhciBub2RlTmFtZSA9IGVsZW1lbnQubm9kZU5hbWU7XHJcblxyXG4gIGlmIChub2RlTmFtZSA9PT0gJ0JPRFknIHx8IG5vZGVOYW1lID09PSAnSFRNTCcpIHtcclxuICAgIHZhciBodG1sID0gZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgIHZhciBzY3JvbGxpbmdFbGVtZW50ID0gZWxlbWVudC5vd25lckRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQgfHwgaHRtbDtcclxuICAgIHJldHVybiBzY3JvbGxpbmdFbGVtZW50W3VwcGVyU2lkZV07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZWxlbWVudFt1cHBlclNpZGVdO1xyXG59XHJcblxyXG4vKlxyXG4gKiBTdW0gb3Igc3VidHJhY3QgdGhlIGVsZW1lbnQgc2Nyb2xsIHZhbHVlcyAobGVmdCBhbmQgdG9wKSBmcm9tIGEgZ2l2ZW4gcmVjdCBvYmplY3RcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWN0IC0gUmVjdCBvYmplY3QgeW91IHdhbnQgdG8gY2hhbmdlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgZWxlbWVudCBmcm9tIHRoZSBmdW5jdGlvbiByZWFkcyB0aGUgc2Nyb2xsIHZhbHVlc1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHN1YnRyYWN0IC0gc2V0IHRvIHRydWUgaWYgeW91IHdhbnQgdG8gc3VidHJhY3QgdGhlIHNjcm9sbCB2YWx1ZXNcclxuICogQHJldHVybiB7T2JqZWN0fSByZWN0IC0gVGhlIG1vZGlmaWVyIHJlY3Qgb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBpbmNsdWRlU2Nyb2xsKHJlY3QsIGVsZW1lbnQpIHtcclxuICB2YXIgc3VidHJhY3QgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IGZhbHNlO1xyXG5cclxuICB2YXIgc2Nyb2xsVG9wID0gZ2V0U2Nyb2xsKGVsZW1lbnQsICd0b3AnKTtcclxuICB2YXIgc2Nyb2xsTGVmdCA9IGdldFNjcm9sbChlbGVtZW50LCAnbGVmdCcpO1xyXG4gIHZhciBtb2RpZmllciA9IHN1YnRyYWN0ID8gLTEgOiAxO1xyXG4gIHJlY3QudG9wICs9IHNjcm9sbFRvcCAqIG1vZGlmaWVyO1xyXG4gIHJlY3QuYm90dG9tICs9IHNjcm9sbFRvcCAqIG1vZGlmaWVyO1xyXG4gIHJlY3QubGVmdCArPSBzY3JvbGxMZWZ0ICogbW9kaWZpZXI7XHJcbiAgcmVjdC5yaWdodCArPSBzY3JvbGxMZWZ0ICogbW9kaWZpZXI7XHJcbiAgcmV0dXJuIHJlY3Q7XHJcbn1cclxuXHJcbi8qXHJcbiAqIEhlbHBlciB0byBkZXRlY3QgYm9yZGVycyBvZiBhIGdpdmVuIGVsZW1lbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7Q1NTU3R5bGVEZWNsYXJhdGlvbn0gc3R5bGVzXHJcbiAqIFJlc3VsdCBvZiBgZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5YCBvbiB0aGUgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gYXhpcyAtIGB4YCBvciBgeWBcclxuICogQHJldHVybiB7bnVtYmVyfSBib3JkZXJzIC0gVGhlIGJvcmRlcnMgc2l6ZSBvZiB0aGUgZ2l2ZW4gYXhpc1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGdldEJvcmRlcnNTaXplKHN0eWxlcywgYXhpcykge1xyXG4gIHZhciBzaWRlQSA9IGF4aXMgPT09ICd4JyA/ICdMZWZ0JyA6ICdUb3AnO1xyXG4gIHZhciBzaWRlQiA9IHNpZGVBID09PSAnTGVmdCcgPyAnUmlnaHQnIDogJ0JvdHRvbSc7XHJcblxyXG4gIHJldHVybiBwYXJzZUZsb2F0KHN0eWxlc1snYm9yZGVyJyArIHNpZGVBICsgJ1dpZHRoJ10sIDEwKSArIHBhcnNlRmxvYXQoc3R5bGVzWydib3JkZXInICsgc2lkZUIgKyAnV2lkdGgnXSwgMTApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTaXplKGF4aXMsIGJvZHksIGh0bWwsIGNvbXB1dGVkU3R5bGUpIHtcclxuICByZXR1cm4gTWF0aC5tYXgoYm9keVsnb2Zmc2V0JyArIGF4aXNdLCBib2R5WydzY3JvbGwnICsgYXhpc10sIGh0bWxbJ2NsaWVudCcgKyBheGlzXSwgaHRtbFsnb2Zmc2V0JyArIGF4aXNdLCBodG1sWydzY3JvbGwnICsgYXhpc10sIGlzSUUkMSgxMCkgPyBodG1sWydvZmZzZXQnICsgYXhpc10gKyBjb21wdXRlZFN0eWxlWydtYXJnaW4nICsgKGF4aXMgPT09ICdIZWlnaHQnID8gJ1RvcCcgOiAnTGVmdCcpXSArIGNvbXB1dGVkU3R5bGVbJ21hcmdpbicgKyAoYXhpcyA9PT0gJ0hlaWdodCcgPyAnQm90dG9tJyA6ICdSaWdodCcpXSA6IDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRXaW5kb3dTaXplcygpIHtcclxuICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgdmFyIGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgdmFyIGNvbXB1dGVkU3R5bGUgPSBpc0lFJDEoMTApICYmIGdldENvbXB1dGVkU3R5bGUoaHRtbCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBoZWlnaHQ6IGdldFNpemUoJ0hlaWdodCcsIGJvZHksIGh0bWwsIGNvbXB1dGVkU3R5bGUpLFxyXG4gICAgd2lkdGg6IGdldFNpemUoJ1dpZHRoJywgYm9keSwgaHRtbCwgY29tcHV0ZWRTdHlsZSlcclxuICB9O1xyXG59XHJcblxyXG52YXIgY2xhc3NDYWxsQ2hlY2skMSA9IGZ1bmN0aW9uIGNsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xyXG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbnZhciBjcmVhdGVDbGFzcyQxID0gZnVuY3Rpb24gKCkge1xyXG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xyXG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XHJcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcclxuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcclxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcclxuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XHJcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcclxuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcclxuICB9O1xyXG59KCk7XHJcblxyXG52YXIgZGVmaW5lUHJvcGVydHkkMSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xyXG4gIGlmIChrZXkgaW4gb2JqKSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcclxuICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvYmo7XHJcbn07XHJcblxyXG52YXIgX2V4dGVuZHMkMSA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xyXG5cclxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcclxuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGFyZ2V0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdpdmVuIGVsZW1lbnQgb2Zmc2V0cywgZ2VuZXJhdGUgYW4gb3V0cHV0IHNpbWlsYXIgdG8gZ2V0Qm91bmRpbmdDbGllbnRSZWN0XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb2Zmc2V0c1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBDbGllbnRSZWN0IGxpa2Ugb3V0cHV0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRDbGllbnRSZWN0KG9mZnNldHMpIHtcclxuICByZXR1cm4gX2V4dGVuZHMkMSh7fSwgb2Zmc2V0cywge1xyXG4gICAgcmlnaHQ6IG9mZnNldHMubGVmdCArIG9mZnNldHMud2lkdGgsXHJcbiAgICBib3R0b206IG9mZnNldHMudG9wICsgb2Zmc2V0cy5oZWlnaHRcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBib3VuZGluZyBjbGllbnQgcmVjdCBvZiBnaXZlbiBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm4ge09iamVjdH0gY2xpZW50IHJlY3RcclxuICovXHJcbmZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KSB7XHJcbiAgdmFyIHJlY3QgPSB7fTtcclxuXHJcbiAgLy8gSUUxMCAxMCBGSVg6IFBsZWFzZSwgZG9uJ3QgYXNrLCB0aGUgZWxlbWVudCBpc24ndFxyXG4gIC8vIGNvbnNpZGVyZWQgaW4gRE9NIGluIHNvbWUgY2lyY3Vtc3RhbmNlcy4uLlxyXG4gIC8vIFRoaXMgaXNuJ3QgcmVwcm9kdWNpYmxlIGluIElFMTAgY29tcGF0aWJpbGl0eSBtb2RlIG9mIElFMTFcclxuICB0cnkge1xyXG4gICAgaWYgKGlzSUUkMSgxMCkpIHtcclxuICAgICAgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIHZhciBzY3JvbGxUb3AgPSBnZXRTY3JvbGwoZWxlbWVudCwgJ3RvcCcpO1xyXG4gICAgICB2YXIgc2Nyb2xsTGVmdCA9IGdldFNjcm9sbChlbGVtZW50LCAnbGVmdCcpO1xyXG4gICAgICByZWN0LnRvcCArPSBzY3JvbGxUb3A7XHJcbiAgICAgIHJlY3QubGVmdCArPSBzY3JvbGxMZWZ0O1xyXG4gICAgICByZWN0LmJvdHRvbSArPSBzY3JvbGxUb3A7XHJcbiAgICAgIHJlY3QucmlnaHQgKz0gc2Nyb2xsTGVmdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHt9XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBsZWZ0OiByZWN0LmxlZnQsXHJcbiAgICB0b3A6IHJlY3QudG9wLFxyXG4gICAgd2lkdGg6IHJlY3QucmlnaHQgLSByZWN0LmxlZnQsXHJcbiAgICBoZWlnaHQ6IHJlY3QuYm90dG9tIC0gcmVjdC50b3BcclxuICB9O1xyXG5cclxuICAvLyBzdWJ0cmFjdCBzY3JvbGxiYXIgc2l6ZSBmcm9tIHNpemVzXHJcbiAgdmFyIHNpemVzID0gZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0hUTUwnID8gZ2V0V2luZG93U2l6ZXMoKSA6IHt9O1xyXG4gIHZhciB3aWR0aCA9IHNpemVzLndpZHRoIHx8IGVsZW1lbnQuY2xpZW50V2lkdGggfHwgcmVzdWx0LnJpZ2h0IC0gcmVzdWx0LmxlZnQ7XHJcbiAgdmFyIGhlaWdodCA9IHNpemVzLmhlaWdodCB8fCBlbGVtZW50LmNsaWVudEhlaWdodCB8fCByZXN1bHQuYm90dG9tIC0gcmVzdWx0LnRvcDtcclxuXHJcbiAgdmFyIGhvcml6U2Nyb2xsYmFyID0gZWxlbWVudC5vZmZzZXRXaWR0aCAtIHdpZHRoO1xyXG4gIHZhciB2ZXJ0U2Nyb2xsYmFyID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSBoZWlnaHQ7XHJcblxyXG4gIC8vIGlmIGFuIGh5cG90aGV0aWNhbCBzY3JvbGxiYXIgaXMgZGV0ZWN0ZWQsIHdlIG11c3QgYmUgc3VyZSBpdCdzIG5vdCBhIGBib3JkZXJgXHJcbiAgLy8gd2UgbWFrZSB0aGlzIGNoZWNrIGNvbmRpdGlvbmFsIGZvciBwZXJmb3JtYW5jZSByZWFzb25zXHJcbiAgaWYgKGhvcml6U2Nyb2xsYmFyIHx8IHZlcnRTY3JvbGxiYXIpIHtcclxuICAgIHZhciBzdHlsZXMgPSBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCk7XHJcbiAgICBob3JpelNjcm9sbGJhciAtPSBnZXRCb3JkZXJzU2l6ZShzdHlsZXMsICd4Jyk7XHJcbiAgICB2ZXJ0U2Nyb2xsYmFyIC09IGdldEJvcmRlcnNTaXplKHN0eWxlcywgJ3knKTtcclxuXHJcbiAgICByZXN1bHQud2lkdGggLT0gaG9yaXpTY3JvbGxiYXI7XHJcbiAgICByZXN1bHQuaGVpZ2h0IC09IHZlcnRTY3JvbGxiYXI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ2V0Q2xpZW50UmVjdChyZXN1bHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRPZmZzZXRSZWN0UmVsYXRpdmVUb0FyYml0cmFyeU5vZGUoY2hpbGRyZW4sIHBhcmVudCkge1xyXG4gIHZhciBmaXhlZFBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmYWxzZTtcclxuXHJcbiAgdmFyIGlzSUUxMCA9IGlzSUUkMSgxMCk7XHJcbiAgdmFyIGlzSFRNTCA9IHBhcmVudC5ub2RlTmFtZSA9PT0gJ0hUTUwnO1xyXG4gIHZhciBjaGlsZHJlblJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoY2hpbGRyZW4pO1xyXG4gIHZhciBwYXJlbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KHBhcmVudCk7XHJcbiAgdmFyIHNjcm9sbFBhcmVudCA9IGdldFNjcm9sbFBhcmVudChjaGlsZHJlbik7XHJcblxyXG4gIHZhciBzdHlsZXMgPSBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkocGFyZW50KTtcclxuICB2YXIgYm9yZGVyVG9wV2lkdGggPSBwYXJzZUZsb2F0KHN0eWxlcy5ib3JkZXJUb3BXaWR0aCwgMTApO1xyXG4gIHZhciBib3JkZXJMZWZ0V2lkdGggPSBwYXJzZUZsb2F0KHN0eWxlcy5ib3JkZXJMZWZ0V2lkdGgsIDEwKTtcclxuXHJcbiAgLy8gSW4gY2FzZXMgd2hlcmUgdGhlIHBhcmVudCBpcyBmaXhlZCwgd2UgbXVzdCBpZ25vcmUgbmVnYXRpdmUgc2Nyb2xsIGluIG9mZnNldCBjYWxjXHJcbiAgaWYgKGZpeGVkUG9zaXRpb24gJiYgcGFyZW50Lm5vZGVOYW1lID09PSAnSFRNTCcpIHtcclxuICAgIHBhcmVudFJlY3QudG9wID0gTWF0aC5tYXgocGFyZW50UmVjdC50b3AsIDApO1xyXG4gICAgcGFyZW50UmVjdC5sZWZ0ID0gTWF0aC5tYXgocGFyZW50UmVjdC5sZWZ0LCAwKTtcclxuICB9XHJcbiAgdmFyIG9mZnNldHMgPSBnZXRDbGllbnRSZWN0KHtcclxuICAgIHRvcDogY2hpbGRyZW5SZWN0LnRvcCAtIHBhcmVudFJlY3QudG9wIC0gYm9yZGVyVG9wV2lkdGgsXHJcbiAgICBsZWZ0OiBjaGlsZHJlblJlY3QubGVmdCAtIHBhcmVudFJlY3QubGVmdCAtIGJvcmRlckxlZnRXaWR0aCxcclxuICAgIHdpZHRoOiBjaGlsZHJlblJlY3Qud2lkdGgsXHJcbiAgICBoZWlnaHQ6IGNoaWxkcmVuUmVjdC5oZWlnaHRcclxuICB9KTtcclxuICBvZmZzZXRzLm1hcmdpblRvcCA9IDA7XHJcbiAgb2Zmc2V0cy5tYXJnaW5MZWZ0ID0gMDtcclxuXHJcbiAgLy8gU3VidHJhY3QgbWFyZ2lucyBvZiBkb2N1bWVudEVsZW1lbnQgaW4gY2FzZSBpdCdzIGJlaW5nIHVzZWQgYXMgcGFyZW50XHJcbiAgLy8gd2UgZG8gdGhpcyBvbmx5IG9uIEhUTUwgYmVjYXVzZSBpdCdzIHRoZSBvbmx5IGVsZW1lbnQgdGhhdCBiZWhhdmVzXHJcbiAgLy8gZGlmZmVyZW50bHkgd2hlbiBtYXJnaW5zIGFyZSBhcHBsaWVkIHRvIGl0LiBUaGUgbWFyZ2lucyBhcmUgaW5jbHVkZWQgaW5cclxuICAvLyB0aGUgYm94IG9mIHRoZSBkb2N1bWVudEVsZW1lbnQsIGluIHRoZSBvdGhlciBjYXNlcyBub3QuXHJcbiAgaWYgKCFpc0lFMTAgJiYgaXNIVE1MKSB7XHJcbiAgICB2YXIgbWFyZ2luVG9wID0gcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luVG9wLCAxMCk7XHJcbiAgICB2YXIgbWFyZ2luTGVmdCA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpbkxlZnQsIDEwKTtcclxuXHJcbiAgICBvZmZzZXRzLnRvcCAtPSBib3JkZXJUb3BXaWR0aCAtIG1hcmdpblRvcDtcclxuICAgIG9mZnNldHMuYm90dG9tIC09IGJvcmRlclRvcFdpZHRoIC0gbWFyZ2luVG9wO1xyXG4gICAgb2Zmc2V0cy5sZWZ0IC09IGJvcmRlckxlZnRXaWR0aCAtIG1hcmdpbkxlZnQ7XHJcbiAgICBvZmZzZXRzLnJpZ2h0IC09IGJvcmRlckxlZnRXaWR0aCAtIG1hcmdpbkxlZnQ7XHJcblxyXG4gICAgLy8gQXR0YWNoIG1hcmdpblRvcCBhbmQgbWFyZ2luTGVmdCBiZWNhdXNlIGluIHNvbWUgY2lyY3Vtc3RhbmNlcyB3ZSBtYXkgbmVlZCB0aGVtXHJcbiAgICBvZmZzZXRzLm1hcmdpblRvcCA9IG1hcmdpblRvcDtcclxuICAgIG9mZnNldHMubWFyZ2luTGVmdCA9IG1hcmdpbkxlZnQ7XHJcbiAgfVxyXG5cclxuICBpZiAoaXNJRTEwICYmICFmaXhlZFBvc2l0aW9uID8gcGFyZW50LmNvbnRhaW5zKHNjcm9sbFBhcmVudCkgOiBwYXJlbnQgPT09IHNjcm9sbFBhcmVudCAmJiBzY3JvbGxQYXJlbnQubm9kZU5hbWUgIT09ICdCT0RZJykge1xyXG4gICAgb2Zmc2V0cyA9IGluY2x1ZGVTY3JvbGwob2Zmc2V0cywgcGFyZW50KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvZmZzZXRzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWaWV3cG9ydE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJ0Yml0cmFyeU5vZGUoZWxlbWVudCkge1xyXG4gIHZhciBleGNsdWRlU2Nyb2xsID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcclxuXHJcbiAgdmFyIGh0bWwgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIHZhciByZWxhdGl2ZU9mZnNldCA9IGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJiaXRyYXJ5Tm9kZShlbGVtZW50LCBodG1sKTtcclxuICB2YXIgd2lkdGggPSBNYXRoLm1heChodG1sLmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcclxuICB2YXIgaGVpZ2h0ID0gTWF0aC5tYXgoaHRtbC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKTtcclxuXHJcbiAgdmFyIHNjcm9sbFRvcCA9ICFleGNsdWRlU2Nyb2xsID8gZ2V0U2Nyb2xsKGh0bWwpIDogMDtcclxuICB2YXIgc2Nyb2xsTGVmdCA9ICFleGNsdWRlU2Nyb2xsID8gZ2V0U2Nyb2xsKGh0bWwsICdsZWZ0JykgOiAwO1xyXG5cclxuICB2YXIgb2Zmc2V0ID0ge1xyXG4gICAgdG9wOiBzY3JvbGxUb3AgLSByZWxhdGl2ZU9mZnNldC50b3AgKyByZWxhdGl2ZU9mZnNldC5tYXJnaW5Ub3AsXHJcbiAgICBsZWZ0OiBzY3JvbGxMZWZ0IC0gcmVsYXRpdmVPZmZzZXQubGVmdCArIHJlbGF0aXZlT2Zmc2V0Lm1hcmdpbkxlZnQsXHJcbiAgICB3aWR0aDogd2lkdGgsXHJcbiAgICBoZWlnaHQ6IGhlaWdodFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBnZXRDbGllbnRSZWN0KG9mZnNldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBmaXhlZCBvciBpcyBpbnNpZGUgYSBmaXhlZCBwYXJlbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGN1c3RvbUNvbnRhaW5lclxyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gYW5zd2VyIHRvIFwiaXNGaXhlZD9cIlxyXG4gKi9cclxuZnVuY3Rpb24gaXNGaXhlZChlbGVtZW50KSB7XHJcbiAgdmFyIG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZTtcclxuICBpZiAobm9kZU5hbWUgPT09ICdCT0RZJyB8fCBub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIGlmIChnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCwgJ3Bvc2l0aW9uJykgPT09ICdmaXhlZCcpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gaXNGaXhlZChnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZpbmRzIHRoZSBmaXJzdCBwYXJlbnQgb2YgYW4gZWxlbWVudCB0aGF0IGhhcyBhIHRyYW5zZm9ybWVkIHByb3BlcnR5IGRlZmluZWRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7RWxlbWVudH0gZmlyc3QgdHJhbnNmb3JtZWQgcGFyZW50IG9yIGRvY3VtZW50RWxlbWVudFxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGdldEZpeGVkUG9zaXRpb25PZmZzZXRQYXJlbnQoZWxlbWVudCkge1xyXG4gIC8vIFRoaXMgY2hlY2sgaXMgbmVlZGVkIHRvIGF2b2lkIGVycm9ycyBpbiBjYXNlIG9uZSBvZiB0aGUgZWxlbWVudHMgaXNuJ3QgZGVmaW5lZCBmb3IgYW55IHJlYXNvblxyXG4gIGlmICghZWxlbWVudCB8fCAhZWxlbWVudC5wYXJlbnRFbGVtZW50IHx8IGlzSUUkMSgpKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIH1cclxuICB2YXIgZWwgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgd2hpbGUgKGVsICYmIGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShlbCwgJ3RyYW5zZm9ybScpID09PSAnbm9uZScpIHtcclxuICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcclxuICB9XHJcbiAgcmV0dXJuIGVsIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbXB1dGVkIHRoZSBib3VuZGFyaWVzIGxpbWl0cyBhbmQgcmV0dXJuIHRoZW1cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHBlclxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByZWZlcmVuY2VcclxuICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmdcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gYm91bmRhcmllc0VsZW1lbnQgLSBFbGVtZW50IHVzZWQgdG8gZGVmaW5lIHRoZSBib3VuZGFyaWVzXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZml4ZWRQb3NpdGlvbiAtIElzIGluIGZpeGVkIHBvc2l0aW9uIG1vZGVcclxuICogQHJldHVybnMge09iamVjdH0gQ29vcmRpbmF0ZXMgb2YgdGhlIGJvdW5kYXJpZXNcclxuICovXHJcbmZ1bmN0aW9uIGdldEJvdW5kYXJpZXMocG9wcGVyLCByZWZlcmVuY2UsIHBhZGRpbmcsIGJvdW5kYXJpZXNFbGVtZW50KSB7XHJcbiAgdmFyIGZpeGVkUG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IGZhbHNlO1xyXG5cclxuICAvLyBOT1RFOiAxIERPTSBhY2Nlc3MgaGVyZVxyXG5cclxuICB2YXIgYm91bmRhcmllcyA9IHsgdG9wOiAwLCBsZWZ0OiAwIH07XHJcbiAgdmFyIG9mZnNldFBhcmVudCA9IGZpeGVkUG9zaXRpb24gPyBnZXRGaXhlZFBvc2l0aW9uT2Zmc2V0UGFyZW50KHBvcHBlcikgOiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KHBvcHBlciwgcmVmZXJlbmNlKTtcclxuXHJcbiAgLy8gSGFuZGxlIHZpZXdwb3J0IGNhc2VcclxuICBpZiAoYm91bmRhcmllc0VsZW1lbnQgPT09ICd2aWV3cG9ydCcpIHtcclxuICAgIGJvdW5kYXJpZXMgPSBnZXRWaWV3cG9ydE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJ0Yml0cmFyeU5vZGUob2Zmc2V0UGFyZW50LCBmaXhlZFBvc2l0aW9uKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gSGFuZGxlIG90aGVyIGNhc2VzIGJhc2VkIG9uIERPTSBlbGVtZW50IHVzZWQgYXMgYm91bmRhcmllc1xyXG4gICAgdmFyIGJvdW5kYXJpZXNOb2RlID0gdm9pZCAwO1xyXG4gICAgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAnc2Nyb2xsUGFyZW50Jykge1xyXG4gICAgICBib3VuZGFyaWVzTm9kZSA9IGdldFNjcm9sbFBhcmVudChnZXRQYXJlbnROb2RlKHJlZmVyZW5jZSkpO1xyXG4gICAgICBpZiAoYm91bmRhcmllc05vZGUubm9kZU5hbWUgPT09ICdCT0RZJykge1xyXG4gICAgICAgIGJvdW5kYXJpZXNOb2RlID0gcG9wcGVyLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAnd2luZG93Jykge1xyXG4gICAgICBib3VuZGFyaWVzTm9kZSA9IHBvcHBlci5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJvdW5kYXJpZXNOb2RlID0gYm91bmRhcmllc0VsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG9mZnNldHMgPSBnZXRPZmZzZXRSZWN0UmVsYXRpdmVUb0FyYml0cmFyeU5vZGUoYm91bmRhcmllc05vZGUsIG9mZnNldFBhcmVudCwgZml4ZWRQb3NpdGlvbik7XHJcblxyXG4gICAgLy8gSW4gY2FzZSBvZiBIVE1MLCB3ZSBuZWVkIGEgZGlmZmVyZW50IGNvbXB1dGF0aW9uXHJcbiAgICBpZiAoYm91bmRhcmllc05vZGUubm9kZU5hbWUgPT09ICdIVE1MJyAmJiAhaXNGaXhlZChvZmZzZXRQYXJlbnQpKSB7XHJcbiAgICAgIHZhciBfZ2V0V2luZG93U2l6ZXMgPSBnZXRXaW5kb3dTaXplcygpLFxyXG4gICAgICAgICAgaGVpZ2h0ID0gX2dldFdpbmRvd1NpemVzLmhlaWdodCxcclxuICAgICAgICAgIHdpZHRoID0gX2dldFdpbmRvd1NpemVzLndpZHRoO1xyXG5cclxuICAgICAgYm91bmRhcmllcy50b3AgKz0gb2Zmc2V0cy50b3AgLSBvZmZzZXRzLm1hcmdpblRvcDtcclxuICAgICAgYm91bmRhcmllcy5ib3R0b20gPSBoZWlnaHQgKyBvZmZzZXRzLnRvcDtcclxuICAgICAgYm91bmRhcmllcy5sZWZ0ICs9IG9mZnNldHMubGVmdCAtIG9mZnNldHMubWFyZ2luTGVmdDtcclxuICAgICAgYm91bmRhcmllcy5yaWdodCA9IHdpZHRoICsgb2Zmc2V0cy5sZWZ0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gZm9yIGFsbCB0aGUgb3RoZXIgRE9NIGVsZW1lbnRzLCB0aGlzIG9uZSBpcyBnb29kXHJcbiAgICAgIGJvdW5kYXJpZXMgPSBvZmZzZXRzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHBhZGRpbmdzXHJcbiAgYm91bmRhcmllcy5sZWZ0ICs9IHBhZGRpbmc7XHJcbiAgYm91bmRhcmllcy50b3AgKz0gcGFkZGluZztcclxuICBib3VuZGFyaWVzLnJpZ2h0IC09IHBhZGRpbmc7XHJcbiAgYm91bmRhcmllcy5ib3R0b20gLT0gcGFkZGluZztcclxuXHJcbiAgcmV0dXJuIGJvdW5kYXJpZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFyZWEoX3JlZikge1xyXG4gIHZhciB3aWR0aCA9IF9yZWYud2lkdGgsXHJcbiAgICAgIGhlaWdodCA9IF9yZWYuaGVpZ2h0O1xyXG5cclxuICByZXR1cm4gd2lkdGggKiBoZWlnaHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVdGlsaXR5IHVzZWQgdG8gdHJhbnNmb3JtIHRoZSBgYXV0b2AgcGxhY2VtZW50IHRvIHRoZSBwbGFjZW1lbnQgd2l0aCBtb3JlXHJcbiAqIGF2YWlsYWJsZSBzcGFjZS5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcHV0ZUF1dG9QbGFjZW1lbnQocGxhY2VtZW50LCByZWZSZWN0LCBwb3BwZXIsIHJlZmVyZW5jZSwgYm91bmRhcmllc0VsZW1lbnQpIHtcclxuICB2YXIgcGFkZGluZyA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDogMDtcclxuXHJcbiAgaWYgKHBsYWNlbWVudC5pbmRleE9mKCdhdXRvJykgPT09IC0xKSB7XHJcbiAgICByZXR1cm4gcGxhY2VtZW50O1xyXG4gIH1cclxuXHJcbiAgdmFyIGJvdW5kYXJpZXMgPSBnZXRCb3VuZGFyaWVzKHBvcHBlciwgcmVmZXJlbmNlLCBwYWRkaW5nLCBib3VuZGFyaWVzRWxlbWVudCk7XHJcblxyXG4gIHZhciByZWN0cyA9IHtcclxuICAgIHRvcDoge1xyXG4gICAgICB3aWR0aDogYm91bmRhcmllcy53aWR0aCxcclxuICAgICAgaGVpZ2h0OiByZWZSZWN0LnRvcCAtIGJvdW5kYXJpZXMudG9wXHJcbiAgICB9LFxyXG4gICAgcmlnaHQ6IHtcclxuICAgICAgd2lkdGg6IGJvdW5kYXJpZXMucmlnaHQgLSByZWZSZWN0LnJpZ2h0LFxyXG4gICAgICBoZWlnaHQ6IGJvdW5kYXJpZXMuaGVpZ2h0XHJcbiAgICB9LFxyXG4gICAgYm90dG9tOiB7XHJcbiAgICAgIHdpZHRoOiBib3VuZGFyaWVzLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IGJvdW5kYXJpZXMuYm90dG9tIC0gcmVmUmVjdC5ib3R0b21cclxuICAgIH0sXHJcbiAgICBsZWZ0OiB7XHJcbiAgICAgIHdpZHRoOiByZWZSZWN0LmxlZnQgLSBib3VuZGFyaWVzLmxlZnQsXHJcbiAgICAgIGhlaWdodDogYm91bmRhcmllcy5oZWlnaHRcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgc29ydGVkQXJlYXMgPSBPYmplY3Qua2V5cyhyZWN0cykubWFwKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgIHJldHVybiBfZXh0ZW5kcyQxKHtcclxuICAgICAga2V5OiBrZXlcclxuICAgIH0sIHJlY3RzW2tleV0sIHtcclxuICAgICAgYXJlYTogZ2V0QXJlYShyZWN0c1trZXldKVxyXG4gICAgfSk7XHJcbiAgfSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgcmV0dXJuIGIuYXJlYSAtIGEuYXJlYTtcclxuICB9KTtcclxuXHJcbiAgdmFyIGZpbHRlcmVkQXJlYXMgPSBzb3J0ZWRBcmVhcy5maWx0ZXIoZnVuY3Rpb24gKF9yZWYyKSB7XHJcbiAgICB2YXIgd2lkdGggPSBfcmVmMi53aWR0aCxcclxuICAgICAgICBoZWlnaHQgPSBfcmVmMi5oZWlnaHQ7XHJcbiAgICByZXR1cm4gd2lkdGggPj0gcG9wcGVyLmNsaWVudFdpZHRoICYmIGhlaWdodCA+PSBwb3BwZXIuY2xpZW50SGVpZ2h0O1xyXG4gIH0pO1xyXG5cclxuICB2YXIgY29tcHV0ZWRQbGFjZW1lbnQgPSBmaWx0ZXJlZEFyZWFzLmxlbmd0aCA+IDAgPyBmaWx0ZXJlZEFyZWFzWzBdLmtleSA6IHNvcnRlZEFyZWFzWzBdLmtleTtcclxuXHJcbiAgdmFyIHZhcmlhdGlvbiA9IHBsYWNlbWVudC5zcGxpdCgnLScpWzFdO1xyXG5cclxuICByZXR1cm4gY29tcHV0ZWRQbGFjZW1lbnQgKyAodmFyaWF0aW9uID8gJy0nICsgdmFyaWF0aW9uIDogJycpO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IG9mZnNldHMgdG8gdGhlIHJlZmVyZW5jZSBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXIgLSB0aGUgcG9wcGVyIGVsZW1lbnRcclxuICogQHBhcmFtIHtFbGVtZW50fSByZWZlcmVuY2UgLSB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgKHRoZSBwb3BwZXIgd2lsbCBiZSByZWxhdGl2ZSB0byB0aGlzKVxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGZpeGVkUG9zaXRpb24gLSBpcyBpbiBmaXhlZCBwb3NpdGlvbiBtb2RlXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBvZmZzZXRzIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSZWZlcmVuY2VPZmZzZXRzKHN0YXRlLCBwb3BwZXIsIHJlZmVyZW5jZSkge1xyXG4gIHZhciBmaXhlZFBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBudWxsO1xyXG5cclxuICB2YXIgY29tbW9uT2Zmc2V0UGFyZW50ID0gZml4ZWRQb3NpdGlvbiA/IGdldEZpeGVkUG9zaXRpb25PZmZzZXRQYXJlbnQocG9wcGVyKSA6IGZpbmRDb21tb25PZmZzZXRQYXJlbnQocG9wcGVyLCByZWZlcmVuY2UpO1xyXG4gIHJldHVybiBnZXRPZmZzZXRSZWN0UmVsYXRpdmVUb0FyYml0cmFyeU5vZGUocmVmZXJlbmNlLCBjb21tb25PZmZzZXRQYXJlbnQsIGZpeGVkUG9zaXRpb24pO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBvdXRlciBzaXplcyBvZiB0aGUgZ2l2ZW4gZWxlbWVudCAob2Zmc2V0IHNpemUgKyBtYXJnaW5zKVxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IG9iamVjdCBjb250YWluaW5nIHdpZHRoIGFuZCBoZWlnaHQgcHJvcGVydGllc1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0T3V0ZXJTaXplcyhlbGVtZW50KSB7XHJcbiAgdmFyIHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XHJcbiAgdmFyIHggPSBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5Ub3ApICsgcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luQm90dG9tKTtcclxuICB2YXIgeSA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luUmlnaHQpO1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICB3aWR0aDogZWxlbWVudC5vZmZzZXRXaWR0aCArIHksXHJcbiAgICBoZWlnaHQ6IGVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgeFxyXG4gIH07XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgb3Bwb3NpdGUgcGxhY2VtZW50IG9mIHRoZSBnaXZlbiBvbmVcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwbGFjZW1lbnRcclxuICogQHJldHVybnMge1N0cmluZ30gZmxpcHBlZCBwbGFjZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCkge1xyXG4gIHZhciBoYXNoID0geyBsZWZ0OiAncmlnaHQnLCByaWdodDogJ2xlZnQnLCBib3R0b206ICd0b3AnLCB0b3A6ICdib3R0b20nIH07XHJcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9sZWZ0fHJpZ2h0fGJvdHRvbXx0b3AvZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcclxuICAgIHJldHVybiBoYXNoW21hdGNoZWRdO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IG9mZnNldHMgdG8gdGhlIHBvcHBlclxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtPYmplY3R9IHBvc2l0aW9uIC0gQ1NTIHBvc2l0aW9uIHRoZSBQb3BwZXIgd2lsbCBnZXQgYXBwbGllZFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3BwZXIgLSB0aGUgcG9wcGVyIGVsZW1lbnRcclxuICogQHBhcmFtIHtPYmplY3R9IHJlZmVyZW5jZU9mZnNldHMgLSB0aGUgcmVmZXJlbmNlIG9mZnNldHMgKHRoZSBwb3BwZXIgd2lsbCBiZSByZWxhdGl2ZSB0byB0aGlzKVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGxhY2VtZW50IC0gb25lIG9mIHRoZSB2YWxpZCBwbGFjZW1lbnQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBwb3BwZXJPZmZzZXRzIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9mZnNldHMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIGdldFBvcHBlck9mZnNldHMocG9wcGVyLCByZWZlcmVuY2VPZmZzZXRzLCBwbGFjZW1lbnQpIHtcclxuICBwbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuXHJcbiAgLy8gR2V0IHBvcHBlciBub2RlIHNpemVzXHJcbiAgdmFyIHBvcHBlclJlY3QgPSBnZXRPdXRlclNpemVzKHBvcHBlcik7XHJcblxyXG4gIC8vIEFkZCBwb3NpdGlvbiwgd2lkdGggYW5kIGhlaWdodCB0byBvdXIgb2Zmc2V0cyBvYmplY3RcclxuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IHtcclxuICAgIHdpZHRoOiBwb3BwZXJSZWN0LndpZHRoLFxyXG4gICAgaGVpZ2h0OiBwb3BwZXJSZWN0LmhlaWdodFxyXG4gIH07XHJcblxyXG4gIC8vIGRlcGVuZGluZyBieSB0aGUgcG9wcGVyIHBsYWNlbWVudCB3ZSBoYXZlIHRvIGNvbXB1dGUgaXRzIG9mZnNldHMgc2xpZ2h0bHkgZGlmZmVyZW50bHlcclxuICB2YXIgaXNIb3JpeiA9IFsncmlnaHQnLCAnbGVmdCddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTE7XHJcbiAgdmFyIG1haW5TaWRlID0gaXNIb3JpeiA/ICd0b3AnIDogJ2xlZnQnO1xyXG4gIHZhciBzZWNvbmRhcnlTaWRlID0gaXNIb3JpeiA/ICdsZWZ0JyA6ICd0b3AnO1xyXG4gIHZhciBtZWFzdXJlbWVudCA9IGlzSG9yaXogPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XHJcbiAgdmFyIHNlY29uZGFyeU1lYXN1cmVtZW50ID0gIWlzSG9yaXogPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XHJcblxyXG4gIHBvcHBlck9mZnNldHNbbWFpblNpZGVdID0gcmVmZXJlbmNlT2Zmc2V0c1ttYWluU2lkZV0gKyByZWZlcmVuY2VPZmZzZXRzW21lYXN1cmVtZW50XSAvIDIgLSBwb3BwZXJSZWN0W21lYXN1cmVtZW50XSAvIDI7XHJcbiAgaWYgKHBsYWNlbWVudCA9PT0gc2Vjb25kYXJ5U2lkZSkge1xyXG4gICAgcG9wcGVyT2Zmc2V0c1tzZWNvbmRhcnlTaWRlXSA9IHJlZmVyZW5jZU9mZnNldHNbc2Vjb25kYXJ5U2lkZV0gLSBwb3BwZXJSZWN0W3NlY29uZGFyeU1lYXN1cmVtZW50XTtcclxuICB9IGVsc2Uge1xyXG4gICAgcG9wcGVyT2Zmc2V0c1tzZWNvbmRhcnlTaWRlXSA9IHJlZmVyZW5jZU9mZnNldHNbZ2V0T3Bwb3NpdGVQbGFjZW1lbnQoc2Vjb25kYXJ5U2lkZSldO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHBvcHBlck9mZnNldHM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNaW1pY3MgdGhlIGBmaW5kYCBtZXRob2Qgb2YgQXJyYXlcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7QXJyYXl9IGFyclxyXG4gKiBAYXJndW1lbnQgcHJvcFxyXG4gKiBAYXJndW1lbnQgdmFsdWVcclxuICogQHJldHVybnMgaW5kZXggb3IgLTFcclxuICovXHJcbmZ1bmN0aW9uIGZpbmQoYXJyLCBjaGVjaykge1xyXG4gIC8vIHVzZSBuYXRpdmUgZmluZCBpZiBzdXBwb3J0ZWRcclxuICBpZiAoQXJyYXkucHJvdG90eXBlLmZpbmQpIHtcclxuICAgIHJldHVybiBhcnIuZmluZChjaGVjayk7XHJcbiAgfVxyXG5cclxuICAvLyB1c2UgYGZpbHRlcmAgdG8gb2J0YWluIHRoZSBzYW1lIGJlaGF2aW9yIG9mIGBmaW5kYFxyXG4gIHJldHVybiBhcnIuZmlsdGVyKGNoZWNrKVswXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgaW5kZXggb2YgdGhlIG1hdGNoaW5nIG9iamVjdFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtBcnJheX0gYXJyXHJcbiAqIEBhcmd1bWVudCBwcm9wXHJcbiAqIEBhcmd1bWVudCB2YWx1ZVxyXG4gKiBAcmV0dXJucyBpbmRleCBvciAtMVxyXG4gKi9cclxuZnVuY3Rpb24gZmluZEluZGV4KGFyciwgcHJvcCwgdmFsdWUpIHtcclxuICAvLyB1c2UgbmF0aXZlIGZpbmRJbmRleCBpZiBzdXBwb3J0ZWRcclxuICBpZiAoQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleCkge1xyXG4gICAgcmV0dXJuIGFyci5maW5kSW5kZXgoZnVuY3Rpb24gKGN1cikge1xyXG4gICAgICByZXR1cm4gY3VyW3Byb3BdID09PSB2YWx1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gdXNlIGBmaW5kYCArIGBpbmRleE9mYCBpZiBgZmluZEluZGV4YCBpc24ndCBzdXBwb3J0ZWRcclxuICB2YXIgbWF0Y2ggPSBmaW5kKGFyciwgZnVuY3Rpb24gKG9iaikge1xyXG4gICAgcmV0dXJuIG9ialtwcm9wXSA9PT0gdmFsdWU7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGFyci5pbmRleE9mKG1hdGNoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIExvb3AgdHJvdWdoIHRoZSBsaXN0IG9mIG1vZGlmaWVycyBhbmQgcnVuIHRoZW0gaW4gb3JkZXIsXHJcbiAqIGVhY2ggb2YgdGhlbSB3aWxsIHRoZW4gZWRpdCB0aGUgZGF0YSBvYmplY3QuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge2RhdGFPYmplY3R9IGRhdGFcclxuICogQHBhcmFtIHtBcnJheX0gbW9kaWZpZXJzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBlbmRzIC0gT3B0aW9uYWwgbW9kaWZpZXIgbmFtZSB1c2VkIGFzIHN0b3BwZXJcclxuICogQHJldHVybnMge2RhdGFPYmplY3R9XHJcbiAqL1xyXG5mdW5jdGlvbiBydW5Nb2RpZmllcnMobW9kaWZpZXJzLCBkYXRhLCBlbmRzKSB7XHJcbiAgdmFyIG1vZGlmaWVyc1RvUnVuID0gZW5kcyA9PT0gdW5kZWZpbmVkID8gbW9kaWZpZXJzIDogbW9kaWZpZXJzLnNsaWNlKDAsIGZpbmRJbmRleChtb2RpZmllcnMsICduYW1lJywgZW5kcykpO1xyXG5cclxuICBtb2RpZmllcnNUb1J1bi5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xyXG4gICAgaWYgKG1vZGlmaWVyWydmdW5jdGlvbiddKSB7XHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZG90LW5vdGF0aW9uXHJcbiAgICAgIGNvbnNvbGUud2FybignYG1vZGlmaWVyLmZ1bmN0aW9uYCBpcyBkZXByZWNhdGVkLCB1c2UgYG1vZGlmaWVyLmZuYCEnKTtcclxuICAgIH1cclxuICAgIHZhciBmbiA9IG1vZGlmaWVyWydmdW5jdGlvbiddIHx8IG1vZGlmaWVyLmZuOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxyXG4gICAgaWYgKG1vZGlmaWVyLmVuYWJsZWQgJiYgaXNGdW5jdGlvbihmbikpIHtcclxuICAgICAgLy8gQWRkIHByb3BlcnRpZXMgdG8gb2Zmc2V0cyB0byBtYWtlIHRoZW0gYSBjb21wbGV0ZSBjbGllbnRSZWN0IG9iamVjdFxyXG4gICAgICAvLyB3ZSBkbyB0aGlzIGJlZm9yZSBlYWNoIG1vZGlmaWVyIHRvIG1ha2Ugc3VyZSB0aGUgcHJldmlvdXMgb25lIGRvZXNuJ3RcclxuICAgICAgLy8gbWVzcyB3aXRoIHRoZXNlIHZhbHVlc1xyXG4gICAgICBkYXRhLm9mZnNldHMucG9wcGVyID0gZ2V0Q2xpZW50UmVjdChkYXRhLm9mZnNldHMucG9wcGVyKTtcclxuICAgICAgZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSA9IGdldENsaWVudFJlY3QoZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSk7XHJcblxyXG4gICAgICBkYXRhID0gZm4oZGF0YSwgbW9kaWZpZXIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwb3BwZXIsIGNvbXB1dGluZyB0aGUgbmV3IG9mZnNldHMgYW5kIGFwcGx5aW5nXHJcbiAqIHRoZSBuZXcgc3R5bGUuPGJyIC8+XHJcbiAqIFByZWZlciBgc2NoZWR1bGVVcGRhdGVgIG92ZXIgYHVwZGF0ZWAgYmVjYXVzZSBvZiBwZXJmb3JtYW5jZSByZWFzb25zLlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAvLyBpZiBwb3BwZXIgaXMgZGVzdHJveWVkLCBkb24ndCBwZXJmb3JtIGFueSBmdXJ0aGVyIHVwZGF0ZVxyXG4gIGlmICh0aGlzLnN0YXRlLmlzRGVzdHJveWVkKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB2YXIgZGF0YSA9IHtcclxuICAgIGluc3RhbmNlOiB0aGlzLFxyXG4gICAgc3R5bGVzOiB7fSxcclxuICAgIGFycm93U3R5bGVzOiB7fSxcclxuICAgIGF0dHJpYnV0ZXM6IHt9LFxyXG4gICAgZmxpcHBlZDogZmFsc2UsXHJcbiAgICBvZmZzZXRzOiB7fVxyXG4gIH07XHJcblxyXG4gIC8vIGNvbXB1dGUgcmVmZXJlbmNlIGVsZW1lbnQgb2Zmc2V0c1xyXG4gIGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UgPSBnZXRSZWZlcmVuY2VPZmZzZXRzKHRoaXMuc3RhdGUsIHRoaXMucG9wcGVyLCB0aGlzLnJlZmVyZW5jZSwgdGhpcy5vcHRpb25zLnBvc2l0aW9uRml4ZWQpO1xyXG5cclxuICAvLyBjb21wdXRlIGF1dG8gcGxhY2VtZW50LCBzdG9yZSBwbGFjZW1lbnQgaW5zaWRlIHRoZSBkYXRhIG9iamVjdCxcclxuICAvLyBtb2RpZmllcnMgd2lsbCBiZSBhYmxlIHRvIGVkaXQgYHBsYWNlbWVudGAgaWYgbmVlZGVkXHJcbiAgLy8gYW5kIHJlZmVyIHRvIG9yaWdpbmFsUGxhY2VtZW50IHRvIGtub3cgdGhlIG9yaWdpbmFsIHZhbHVlXHJcbiAgZGF0YS5wbGFjZW1lbnQgPSBjb21wdXRlQXV0b1BsYWNlbWVudCh0aGlzLm9wdGlvbnMucGxhY2VtZW50LCBkYXRhLm9mZnNldHMucmVmZXJlbmNlLCB0aGlzLnBvcHBlciwgdGhpcy5yZWZlcmVuY2UsIHRoaXMub3B0aW9ucy5tb2RpZmllcnMuZmxpcC5ib3VuZGFyaWVzRWxlbWVudCwgdGhpcy5vcHRpb25zLm1vZGlmaWVycy5mbGlwLnBhZGRpbmcpO1xyXG5cclxuICAvLyBzdG9yZSB0aGUgY29tcHV0ZWQgcGxhY2VtZW50IGluc2lkZSBgb3JpZ2luYWxQbGFjZW1lbnRgXHJcbiAgZGF0YS5vcmlnaW5hbFBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50O1xyXG5cclxuICBkYXRhLnBvc2l0aW9uRml4ZWQgPSB0aGlzLm9wdGlvbnMucG9zaXRpb25GaXhlZDtcclxuXHJcbiAgLy8gY29tcHV0ZSB0aGUgcG9wcGVyIG9mZnNldHNcclxuICBkYXRhLm9mZnNldHMucG9wcGVyID0gZ2V0UG9wcGVyT2Zmc2V0cyh0aGlzLnBvcHBlciwgZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSwgZGF0YS5wbGFjZW1lbnQpO1xyXG5cclxuICBkYXRhLm9mZnNldHMucG9wcGVyLnBvc2l0aW9uID0gdGhpcy5vcHRpb25zLnBvc2l0aW9uRml4ZWQgPyAnZml4ZWQnIDogJ2Fic29sdXRlJztcclxuXHJcbiAgLy8gcnVuIHRoZSBtb2RpZmllcnNcclxuICBkYXRhID0gcnVuTW9kaWZpZXJzKHRoaXMubW9kaWZpZXJzLCBkYXRhKTtcclxuXHJcbiAgLy8gdGhlIGZpcnN0IGB1cGRhdGVgIHdpbGwgY2FsbCBgb25DcmVhdGVgIGNhbGxiYWNrXHJcbiAgLy8gdGhlIG90aGVyIG9uZXMgd2lsbCBjYWxsIGBvblVwZGF0ZWAgY2FsbGJhY2tcclxuICBpZiAoIXRoaXMuc3RhdGUuaXNDcmVhdGVkKSB7XHJcbiAgICB0aGlzLnN0YXRlLmlzQ3JlYXRlZCA9IHRydWU7XHJcbiAgICB0aGlzLm9wdGlvbnMub25DcmVhdGUoZGF0YSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMub3B0aW9ucy5vblVwZGF0ZShkYXRhKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIZWxwZXIgdXNlZCB0byBrbm93IGlmIHRoZSBnaXZlbiBtb2RpZmllciBpcyBlbmFibGVkLlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc01vZGlmaWVyRW5hYmxlZChtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSkge1xyXG4gIHJldHVybiBtb2RpZmllcnMuc29tZShmdW5jdGlvbiAoX3JlZikge1xyXG4gICAgdmFyIG5hbWUgPSBfcmVmLm5hbWUsXHJcbiAgICAgICAgZW5hYmxlZCA9IF9yZWYuZW5hYmxlZDtcclxuICAgIHJldHVybiBlbmFibGVkICYmIG5hbWUgPT09IG1vZGlmaWVyTmFtZTtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgcHJlZml4ZWQgc3VwcG9ydGVkIHByb3BlcnR5IG5hbWVcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwcm9wZXJ0eSAoY2FtZWxDYXNlKVxyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBwcmVmaXhlZCBwcm9wZXJ0eSAoY2FtZWxDYXNlIG9yIFBhc2NhbENhc2UsIGRlcGVuZGluZyBvbiB0aGUgdmVuZG9yIHByZWZpeClcclxuICovXHJcbmZ1bmN0aW9uIGdldFN1cHBvcnRlZFByb3BlcnR5TmFtZShwcm9wZXJ0eSkge1xyXG4gIHZhciBwcmVmaXhlcyA9IFtmYWxzZSwgJ21zJywgJ1dlYmtpdCcsICdNb3onLCAnTyddO1xyXG4gIHZhciB1cHBlclByb3AgPSBwcm9wZXJ0eS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnNsaWNlKDEpO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgcHJlZml4ID0gcHJlZml4ZXNbaV07XHJcbiAgICB2YXIgdG9DaGVjayA9IHByZWZpeCA/ICcnICsgcHJlZml4ICsgdXBwZXJQcm9wIDogcHJvcGVydHk7XHJcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50LmJvZHkuc3R5bGVbdG9DaGVja10gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybiB0b0NoZWNrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlc3Ryb3kgdGhlIHBvcHBlclxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgdGhpcy5zdGF0ZS5pc0Rlc3Ryb3llZCA9IHRydWU7XHJcblxyXG4gIC8vIHRvdWNoIERPTSBvbmx5IGlmIGBhcHBseVN0eWxlYCBtb2RpZmllciBpcyBlbmFibGVkXHJcbiAgaWYgKGlzTW9kaWZpZXJFbmFibGVkKHRoaXMubW9kaWZpZXJzLCAnYXBwbHlTdHlsZScpKSB7XHJcbiAgICB0aGlzLnBvcHBlci5yZW1vdmVBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50Jyk7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZS5wb3NpdGlvbiA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUudG9wID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZS5sZWZ0ID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZS5yaWdodCA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUuYm90dG9tID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZS53aWxsQ2hhbmdlID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZVtnZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUoJ3RyYW5zZm9ybScpXSA9ICcnO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5kaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHJcbiAgLy8gcmVtb3ZlIHRoZSBwb3BwZXIgaWYgdXNlciBleHBsaWNpdHkgYXNrZWQgZm9yIHRoZSBkZWxldGlvbiBvbiBkZXN0cm95XHJcbiAgLy8gZG8gbm90IHVzZSBgcmVtb3ZlYCBiZWNhdXNlIElFMTEgZG9lc24ndCBzdXBwb3J0IGl0XHJcbiAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdmVPbkRlc3Ryb3kpIHtcclxuICAgIHRoaXMucG9wcGVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5wb3BwZXIpO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgd2luZG93IGFzc29jaWF0ZWQgd2l0aCB0aGUgZWxlbWVudFxyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybnMge1dpbmRvd31cclxuICovXHJcbmZ1bmN0aW9uIGdldFdpbmRvdyhlbGVtZW50KSB7XHJcbiAgdmFyIG93bmVyRG9jdW1lbnQgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQ7XHJcbiAgcmV0dXJuIG93bmVyRG9jdW1lbnQgPyBvd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IDogd2luZG93O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhdHRhY2hUb1Njcm9sbFBhcmVudHMoc2Nyb2xsUGFyZW50LCBldmVudCwgY2FsbGJhY2ssIHNjcm9sbFBhcmVudHMpIHtcclxuICB2YXIgaXNCb2R5ID0gc2Nyb2xsUGFyZW50Lm5vZGVOYW1lID09PSAnQk9EWSc7XHJcbiAgdmFyIHRhcmdldCA9IGlzQm9keSA/IHNjcm9sbFBhcmVudC5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IDogc2Nyb2xsUGFyZW50O1xyXG4gIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaywgeyBwYXNzaXZlOiB0cnVlIH0pO1xyXG5cclxuICBpZiAoIWlzQm9keSkge1xyXG4gICAgYXR0YWNoVG9TY3JvbGxQYXJlbnRzKGdldFNjcm9sbFBhcmVudCh0YXJnZXQucGFyZW50Tm9kZSksIGV2ZW50LCBjYWxsYmFjaywgc2Nyb2xsUGFyZW50cyk7XHJcbiAgfVxyXG4gIHNjcm9sbFBhcmVudHMucHVzaCh0YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0dXAgbmVlZGVkIGV2ZW50IGxpc3RlbmVycyB1c2VkIHRvIHVwZGF0ZSB0aGUgcG9wcGVyIHBvc2l0aW9uXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gc2V0dXBFdmVudExpc3RlbmVycyhyZWZlcmVuY2UsIG9wdGlvbnMsIHN0YXRlLCB1cGRhdGVCb3VuZCkge1xyXG4gIC8vIFJlc2l6ZSBldmVudCBsaXN0ZW5lciBvbiB3aW5kb3dcclxuICBzdGF0ZS51cGRhdGVCb3VuZCA9IHVwZGF0ZUJvdW5kO1xyXG4gIGdldFdpbmRvdyhyZWZlcmVuY2UpLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHN0YXRlLnVwZGF0ZUJvdW5kLCB7IHBhc3NpdmU6IHRydWUgfSk7XHJcblxyXG4gIC8vIFNjcm9sbCBldmVudCBsaXN0ZW5lciBvbiBzY3JvbGwgcGFyZW50c1xyXG4gIHZhciBzY3JvbGxFbGVtZW50ID0gZ2V0U2Nyb2xsUGFyZW50KHJlZmVyZW5jZSk7XHJcbiAgYXR0YWNoVG9TY3JvbGxQYXJlbnRzKHNjcm9sbEVsZW1lbnQsICdzY3JvbGwnLCBzdGF0ZS51cGRhdGVCb3VuZCwgc3RhdGUuc2Nyb2xsUGFyZW50cyk7XHJcbiAgc3RhdGUuc2Nyb2xsRWxlbWVudCA9IHNjcm9sbEVsZW1lbnQ7XHJcbiAgc3RhdGUuZXZlbnRzRW5hYmxlZCA9IHRydWU7XHJcblxyXG4gIHJldHVybiBzdGF0ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEl0IHdpbGwgYWRkIHJlc2l6ZS9zY3JvbGwgZXZlbnRzIGFuZCBzdGFydCByZWNhbGN1bGF0aW5nXHJcbiAqIHBvc2l0aW9uIG9mIHRoZSBwb3BwZXIgZWxlbWVudCB3aGVuIHRoZXkgYXJlIHRyaWdnZXJlZC5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBlbmFibGVFdmVudExpc3RlbmVycygpIHtcclxuICBpZiAoIXRoaXMuc3RhdGUuZXZlbnRzRW5hYmxlZCkge1xyXG4gICAgdGhpcy5zdGF0ZSA9IHNldHVwRXZlbnRMaXN0ZW5lcnModGhpcy5yZWZlcmVuY2UsIHRoaXMub3B0aW9ucywgdGhpcy5zdGF0ZSwgdGhpcy5zY2hlZHVsZVVwZGF0ZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyB1c2VkIHRvIHVwZGF0ZSB0aGUgcG9wcGVyIHBvc2l0aW9uXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMocmVmZXJlbmNlLCBzdGF0ZSkge1xyXG4gIC8vIFJlbW92ZSByZXNpemUgZXZlbnQgbGlzdGVuZXIgb24gd2luZG93XHJcbiAgZ2V0V2luZG93KHJlZmVyZW5jZSkucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgc3RhdGUudXBkYXRlQm91bmQpO1xyXG5cclxuICAvLyBSZW1vdmUgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyIG9uIHNjcm9sbCBwYXJlbnRzXHJcbiAgc3RhdGUuc2Nyb2xsUGFyZW50cy5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzdGF0ZS51cGRhdGVCb3VuZCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIFJlc2V0IHN0YXRlXHJcbiAgc3RhdGUudXBkYXRlQm91bmQgPSBudWxsO1xyXG4gIHN0YXRlLnNjcm9sbFBhcmVudHMgPSBbXTtcclxuICBzdGF0ZS5zY3JvbGxFbGVtZW50ID0gbnVsbDtcclxuICBzdGF0ZS5ldmVudHNFbmFibGVkID0gZmFsc2U7XHJcbiAgcmV0dXJuIHN0YXRlO1xyXG59XHJcblxyXG4vKipcclxuICogSXQgd2lsbCByZW1vdmUgcmVzaXplL3Njcm9sbCBldmVudHMgYW5kIHdvbid0IHJlY2FsY3VsYXRlIHBvcHBlciBwb3NpdGlvblxyXG4gKiB3aGVuIHRoZXkgYXJlIHRyaWdnZXJlZC4gSXQgYWxzbyB3b24ndCB0cmlnZ2VyIG9uVXBkYXRlIGNhbGxiYWNrIGFueW1vcmUsXHJcbiAqIHVubGVzcyB5b3UgY2FsbCBgdXBkYXRlYCBtZXRob2QgbWFudWFsbHkuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlclxyXG4gKi9cclxuZnVuY3Rpb24gZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCkge1xyXG4gIGlmICh0aGlzLnN0YXRlLmV2ZW50c0VuYWJsZWQpIHtcclxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuc2NoZWR1bGVVcGRhdGUpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRoaXMucmVmZXJlbmNlLCB0aGlzLnN0YXRlKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUZWxscyBpZiBhIGdpdmVuIGlucHV0IGlzIGEgbnVtYmVyXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0geyp9IGlucHV0IHRvIGNoZWNrXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc051bWVyaWMobikge1xyXG4gIHJldHVybiBuICE9PSAnJyAmJiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHN0eWxlIHRvIHRoZSBnaXZlbiBwb3BwZXJcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudCAtIEVsZW1lbnQgdG8gYXBwbHkgdGhlIHN0eWxlIHRvXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBzdHlsZXNcclxuICogT2JqZWN0IHdpdGggYSBsaXN0IG9mIHByb3BlcnRpZXMgYW5kIHZhbHVlcyB3aGljaCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIHNldFN0eWxlcyhlbGVtZW50LCBzdHlsZXMpIHtcclxuICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcclxuICAgIHZhciB1bml0ID0gJyc7XHJcbiAgICAvLyBhZGQgdW5pdCBpZiB0aGUgdmFsdWUgaXMgbnVtZXJpYyBhbmQgaXMgb25lIG9mIHRoZSBmb2xsb3dpbmdcclxuICAgIGlmIChbJ3dpZHRoJywgJ2hlaWdodCcsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXS5pbmRleE9mKHByb3ApICE9PSAtMSAmJiBpc051bWVyaWMoc3R5bGVzW3Byb3BdKSkge1xyXG4gICAgICB1bml0ID0gJ3B4JztcclxuICAgIH1cclxuICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSBzdHlsZXNbcHJvcF0gKyB1bml0O1xyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IHRoZSBhdHRyaWJ1dGVzIHRvIHRoZSBnaXZlbiBwb3BwZXJcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudCAtIEVsZW1lbnQgdG8gYXBwbHkgdGhlIGF0dHJpYnV0ZXMgdG9cclxuICogQGFyZ3VtZW50IHtPYmplY3R9IHN0eWxlc1xyXG4gKiBPYmplY3Qgd2l0aCBhIGxpc3Qgb2YgcHJvcGVydGllcyBhbmQgdmFsdWVzIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gc2V0QXR0cmlidXRlcyhlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XHJcbiAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xyXG4gICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1twcm9wXTtcclxuICAgIGlmICh2YWx1ZSAhPT0gZmFsc2UpIHtcclxuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEuc3R5bGVzIC0gTGlzdCBvZiBzdHlsZSBwcm9wZXJ0aWVzIC0gdmFsdWVzIHRvIGFwcGx5IHRvIHBvcHBlciBlbGVtZW50XHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhLmF0dHJpYnV0ZXMgLSBMaXN0IG9mIGF0dHJpYnV0ZSBwcm9wZXJ0aWVzIC0gdmFsdWVzIHRvIGFwcGx5IHRvIHBvcHBlciBlbGVtZW50XHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIHNhbWUgZGF0YSBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGFwcGx5U3R5bGUoZGF0YSkge1xyXG4gIC8vIGFueSBwcm9wZXJ0eSBwcmVzZW50IGluIGBkYXRhLnN0eWxlc2Agd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIsXHJcbiAgLy8gaW4gdGhpcyB3YXkgd2UgY2FuIG1ha2UgdGhlIDNyZCBwYXJ0eSBtb2RpZmllcnMgYWRkIGN1c3RvbSBzdHlsZXMgdG8gaXRcclxuICAvLyBCZSBhd2FyZSwgbW9kaWZpZXJzIGNvdWxkIG92ZXJyaWRlIHRoZSBwcm9wZXJ0aWVzIGRlZmluZWQgaW4gdGhlIHByZXZpb3VzXHJcbiAgLy8gbGluZXMgb2YgdGhpcyBtb2RpZmllciFcclxuICBzZXRTdHlsZXMoZGF0YS5pbnN0YW5jZS5wb3BwZXIsIGRhdGEuc3R5bGVzKTtcclxuXHJcbiAgLy8gYW55IHByb3BlcnR5IHByZXNlbnQgaW4gYGRhdGEuYXR0cmlidXRlc2Agd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIsXHJcbiAgLy8gdGhleSB3aWxsIGJlIHNldCBhcyBIVE1MIGF0dHJpYnV0ZXMgb2YgdGhlIGVsZW1lbnRcclxuICBzZXRBdHRyaWJ1dGVzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLmF0dHJpYnV0ZXMpO1xyXG5cclxuICAvLyBpZiBhcnJvd0VsZW1lbnQgaXMgZGVmaW5lZCBhbmQgYXJyb3dTdHlsZXMgaGFzIHNvbWUgcHJvcGVydGllc1xyXG4gIGlmIChkYXRhLmFycm93RWxlbWVudCAmJiBPYmplY3Qua2V5cyhkYXRhLmFycm93U3R5bGVzKS5sZW5ndGgpIHtcclxuICAgIHNldFN0eWxlcyhkYXRhLmFycm93RWxlbWVudCwgZGF0YS5hcnJvd1N0eWxlcyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCB0aGUgeC1wbGFjZW1lbnQgYXR0cmlidXRlIGJlZm9yZSBldmVyeXRoaW5nIGVsc2UgYmVjYXVzZSBpdCBjb3VsZCBiZSB1c2VkXHJcbiAqIHRvIGFkZCBtYXJnaW5zIHRvIHRoZSBwb3BwZXIgbWFyZ2lucyBuZWVkcyB0byBiZSBjYWxjdWxhdGVkIHRvIGdldCB0aGVcclxuICogY29ycmVjdCBwb3BwZXIgb2Zmc2V0cy5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLm1vZGlmaWVyc1xyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByZWZlcmVuY2UgLSBUaGUgcmVmZXJlbmNlIGVsZW1lbnQgdXNlZCB0byBwb3NpdGlvbiB0aGUgcG9wcGVyXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHBlciAtIFRoZSBIVE1MIGVsZW1lbnQgdXNlZCBhcyBwb3BwZXJcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBQb3BwZXIuanMgb3B0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gYXBwbHlTdHlsZU9uTG9hZChyZWZlcmVuY2UsIHBvcHBlciwgb3B0aW9ucywgbW9kaWZpZXJPcHRpb25zLCBzdGF0ZSkge1xyXG4gIC8vIGNvbXB1dGUgcmVmZXJlbmNlIGVsZW1lbnQgb2Zmc2V0c1xyXG4gIHZhciByZWZlcmVuY2VPZmZzZXRzID0gZ2V0UmVmZXJlbmNlT2Zmc2V0cyhzdGF0ZSwgcG9wcGVyLCByZWZlcmVuY2UsIG9wdGlvbnMucG9zaXRpb25GaXhlZCk7XHJcblxyXG4gIC8vIGNvbXB1dGUgYXV0byBwbGFjZW1lbnQsIHN0b3JlIHBsYWNlbWVudCBpbnNpZGUgdGhlIGRhdGEgb2JqZWN0LFxyXG4gIC8vIG1vZGlmaWVycyB3aWxsIGJlIGFibGUgdG8gZWRpdCBgcGxhY2VtZW50YCBpZiBuZWVkZWRcclxuICAvLyBhbmQgcmVmZXIgdG8gb3JpZ2luYWxQbGFjZW1lbnQgdG8ga25vdyB0aGUgb3JpZ2luYWwgdmFsdWVcclxuICB2YXIgcGxhY2VtZW50ID0gY29tcHV0ZUF1dG9QbGFjZW1lbnQob3B0aW9ucy5wbGFjZW1lbnQsIHJlZmVyZW5jZU9mZnNldHMsIHBvcHBlciwgcmVmZXJlbmNlLCBvcHRpb25zLm1vZGlmaWVycy5mbGlwLmJvdW5kYXJpZXNFbGVtZW50LCBvcHRpb25zLm1vZGlmaWVycy5mbGlwLnBhZGRpbmcpO1xyXG5cclxuICBwb3BwZXIuc2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcsIHBsYWNlbWVudCk7XHJcblxyXG4gIC8vIEFwcGx5IGBwb3NpdGlvbmAgdG8gcG9wcGVyIGJlZm9yZSBhbnl0aGluZyBlbHNlIGJlY2F1c2VcclxuICAvLyB3aXRob3V0IHRoZSBwb3NpdGlvbiBhcHBsaWVkIHdlIGNhbid0IGd1YXJhbnRlZSBjb3JyZWN0IGNvbXB1dGF0aW9uc1xyXG4gIHNldFN0eWxlcyhwb3BwZXIsIHsgcG9zaXRpb246IG9wdGlvbnMucG9zaXRpb25GaXhlZCA/ICdmaXhlZCcgOiAnYWJzb2x1dGUnIH0pO1xyXG5cclxuICByZXR1cm4gb3B0aW9ucztcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBjb21wdXRlU3R5bGUoZGF0YSwgb3B0aW9ucykge1xyXG4gIHZhciB4ID0gb3B0aW9ucy54LFxyXG4gICAgICB5ID0gb3B0aW9ucy55O1xyXG4gIHZhciBwb3BwZXIgPSBkYXRhLm9mZnNldHMucG9wcGVyO1xyXG5cclxuICAvLyBSZW1vdmUgdGhpcyBsZWdhY3kgc3VwcG9ydCBpbiBQb3BwZXIuanMgdjJcclxuXHJcbiAgdmFyIGxlZ2FjeUdwdUFjY2VsZXJhdGlvbk9wdGlvbiA9IGZpbmQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsIGZ1bmN0aW9uIChtb2RpZmllcikge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVyLm5hbWUgPT09ICdhcHBseVN0eWxlJztcclxuICB9KS5ncHVBY2NlbGVyYXRpb247XHJcbiAgaWYgKGxlZ2FjeUdwdUFjY2VsZXJhdGlvbk9wdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjb25zb2xlLndhcm4oJ1dBUk5JTkc6IGBncHVBY2NlbGVyYXRpb25gIG9wdGlvbiBtb3ZlZCB0byBgY29tcHV0ZVN0eWxlYCBtb2RpZmllciBhbmQgd2lsbCBub3QgYmUgc3VwcG9ydGVkIGluIGZ1dHVyZSB2ZXJzaW9ucyBvZiBQb3BwZXIuanMhJyk7XHJcbiAgfVxyXG4gIHZhciBncHVBY2NlbGVyYXRpb24gPSBsZWdhY3lHcHVBY2NlbGVyYXRpb25PcHRpb24gIT09IHVuZGVmaW5lZCA/IGxlZ2FjeUdwdUFjY2VsZXJhdGlvbk9wdGlvbiA6IG9wdGlvbnMuZ3B1QWNjZWxlcmF0aW9uO1xyXG5cclxuICB2YXIgb2Zmc2V0UGFyZW50ID0gZ2V0T2Zmc2V0UGFyZW50KGRhdGEuaW5zdGFuY2UucG9wcGVyKTtcclxuICB2YXIgb2Zmc2V0UGFyZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChvZmZzZXRQYXJlbnQpO1xyXG5cclxuICAvLyBTdHlsZXNcclxuICB2YXIgc3R5bGVzID0ge1xyXG4gICAgcG9zaXRpb246IHBvcHBlci5wb3NpdGlvblxyXG4gIH07XHJcblxyXG4gIC8vIEF2b2lkIGJsdXJyeSB0ZXh0IGJ5IHVzaW5nIGZ1bGwgcGl4ZWwgaW50ZWdlcnMuXHJcbiAgLy8gRm9yIHBpeGVsLXBlcmZlY3QgcG9zaXRpb25pbmcsIHRvcC9ib3R0b20gcHJlZmVycyByb3VuZGVkXHJcbiAgLy8gdmFsdWVzLCB3aGlsZSBsZWZ0L3JpZ2h0IHByZWZlcnMgZmxvb3JlZCB2YWx1ZXMuXHJcbiAgdmFyIG9mZnNldHMgPSB7XHJcbiAgICBsZWZ0OiBNYXRoLmZsb29yKHBvcHBlci5sZWZ0KSxcclxuICAgIHRvcDogTWF0aC5yb3VuZChwb3BwZXIudG9wKSxcclxuICAgIGJvdHRvbTogTWF0aC5yb3VuZChwb3BwZXIuYm90dG9tKSxcclxuICAgIHJpZ2h0OiBNYXRoLmZsb29yKHBvcHBlci5yaWdodClcclxuICB9O1xyXG5cclxuICB2YXIgc2lkZUEgPSB4ID09PSAnYm90dG9tJyA/ICd0b3AnIDogJ2JvdHRvbSc7XHJcbiAgdmFyIHNpZGVCID0geSA9PT0gJ3JpZ2h0JyA/ICdsZWZ0JyA6ICdyaWdodCc7XHJcblxyXG4gIC8vIGlmIGdwdUFjY2VsZXJhdGlvbiBpcyBzZXQgdG8gYHRydWVgIGFuZCB0cmFuc2Zvcm0gaXMgc3VwcG9ydGVkLFxyXG4gIC8vICB3ZSB1c2UgYHRyYW5zbGF0ZTNkYCB0byBhcHBseSB0aGUgcG9zaXRpb24gdG8gdGhlIHBvcHBlciB3ZVxyXG4gIC8vIGF1dG9tYXRpY2FsbHkgdXNlIHRoZSBzdXBwb3J0ZWQgcHJlZml4ZWQgdmVyc2lvbiBpZiBuZWVkZWRcclxuICB2YXIgcHJlZml4ZWRQcm9wZXJ0eSA9IGdldFN1cHBvcnRlZFByb3BlcnR5TmFtZSgndHJhbnNmb3JtJyk7XHJcblxyXG4gIC8vIG5vdywgbGV0J3MgbWFrZSBhIHN0ZXAgYmFjayBhbmQgbG9vayBhdCB0aGlzIGNvZGUgY2xvc2VseSAod3RmPylcclxuICAvLyBJZiB0aGUgY29udGVudCBvZiB0aGUgcG9wcGVyIGdyb3dzIG9uY2UgaXQncyBiZWVuIHBvc2l0aW9uZWQsIGl0XHJcbiAgLy8gbWF5IGhhcHBlbiB0aGF0IHRoZSBwb3BwZXIgZ2V0cyBtaXNwbGFjZWQgYmVjYXVzZSBvZiB0aGUgbmV3IGNvbnRlbnRcclxuICAvLyBvdmVyZmxvd2luZyBpdHMgcmVmZXJlbmNlIGVsZW1lbnRcclxuICAvLyBUbyBhdm9pZCB0aGlzIHByb2JsZW0sIHdlIHByb3ZpZGUgdHdvIG9wdGlvbnMgKHggYW5kIHkpLCB3aGljaCBhbGxvd1xyXG4gIC8vIHRoZSBjb25zdW1lciB0byBkZWZpbmUgdGhlIG9mZnNldCBvcmlnaW4uXHJcbiAgLy8gSWYgd2UgcG9zaXRpb24gYSBwb3BwZXIgb24gdG9wIG9mIGEgcmVmZXJlbmNlIGVsZW1lbnQsIHdlIGNhbiBzZXRcclxuICAvLyBgeGAgdG8gYHRvcGAgdG8gbWFrZSB0aGUgcG9wcGVyIGdyb3cgdG93YXJkcyBpdHMgdG9wIGluc3RlYWQgb2ZcclxuICAvLyBpdHMgYm90dG9tLlxyXG4gIHZhciBsZWZ0ID0gdm9pZCAwLFxyXG4gICAgICB0b3AgPSB2b2lkIDA7XHJcbiAgaWYgKHNpZGVBID09PSAnYm90dG9tJykge1xyXG4gICAgdG9wID0gLW9mZnNldFBhcmVudFJlY3QuaGVpZ2h0ICsgb2Zmc2V0cy5ib3R0b207XHJcbiAgfSBlbHNlIHtcclxuICAgIHRvcCA9IG9mZnNldHMudG9wO1xyXG4gIH1cclxuICBpZiAoc2lkZUIgPT09ICdyaWdodCcpIHtcclxuICAgIGxlZnQgPSAtb2Zmc2V0UGFyZW50UmVjdC53aWR0aCArIG9mZnNldHMucmlnaHQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIGxlZnQgPSBvZmZzZXRzLmxlZnQ7XHJcbiAgfVxyXG4gIGlmIChncHVBY2NlbGVyYXRpb24gJiYgcHJlZml4ZWRQcm9wZXJ0eSkge1xyXG4gICAgc3R5bGVzW3ByZWZpeGVkUHJvcGVydHldID0gJ3RyYW5zbGF0ZTNkKCcgKyBsZWZ0ICsgJ3B4LCAnICsgdG9wICsgJ3B4LCAwKSc7XHJcbiAgICBzdHlsZXNbc2lkZUFdID0gMDtcclxuICAgIHN0eWxlc1tzaWRlQl0gPSAwO1xyXG4gICAgc3R5bGVzLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gb3Rod2VyaXNlLCB3ZSB1c2UgdGhlIHN0YW5kYXJkIGB0b3BgLCBgbGVmdGAsIGBib3R0b21gIGFuZCBgcmlnaHRgIHByb3BlcnRpZXNcclxuICAgIHZhciBpbnZlcnRUb3AgPSBzaWRlQSA9PT0gJ2JvdHRvbScgPyAtMSA6IDE7XHJcbiAgICB2YXIgaW52ZXJ0TGVmdCA9IHNpZGVCID09PSAncmlnaHQnID8gLTEgOiAxO1xyXG4gICAgc3R5bGVzW3NpZGVBXSA9IHRvcCAqIGludmVydFRvcDtcclxuICAgIHN0eWxlc1tzaWRlQl0gPSBsZWZ0ICogaW52ZXJ0TGVmdDtcclxuICAgIHN0eWxlcy53aWxsQ2hhbmdlID0gc2lkZUEgKyAnLCAnICsgc2lkZUI7XHJcbiAgfVxyXG5cclxuICAvLyBBdHRyaWJ1dGVzXHJcbiAgdmFyIGF0dHJpYnV0ZXMgPSB7XHJcbiAgICAneC1wbGFjZW1lbnQnOiBkYXRhLnBsYWNlbWVudFxyXG4gIH07XHJcblxyXG4gIC8vIFVwZGF0ZSBgZGF0YWAgYXR0cmlidXRlcywgc3R5bGVzIGFuZCBhcnJvd1N0eWxlc1xyXG4gIGRhdGEuYXR0cmlidXRlcyA9IF9leHRlbmRzJDEoe30sIGF0dHJpYnV0ZXMsIGRhdGEuYXR0cmlidXRlcyk7XHJcbiAgZGF0YS5zdHlsZXMgPSBfZXh0ZW5kcyQxKHt9LCBzdHlsZXMsIGRhdGEuc3R5bGVzKTtcclxuICBkYXRhLmFycm93U3R5bGVzID0gX2V4dGVuZHMkMSh7fSwgZGF0YS5vZmZzZXRzLmFycm93LCBkYXRhLmFycm93U3R5bGVzKTtcclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIZWxwZXIgdXNlZCB0byBrbm93IGlmIHRoZSBnaXZlbiBtb2RpZmllciBkZXBlbmRzIGZyb20gYW5vdGhlciBvbmUuPGJyIC8+XHJcbiAqIEl0IGNoZWNrcyBpZiB0aGUgbmVlZGVkIG1vZGlmaWVyIGlzIGxpc3RlZCBhbmQgZW5hYmxlZC5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7QXJyYXl9IG1vZGlmaWVycyAtIGxpc3Qgb2YgbW9kaWZpZXJzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0aW5nTmFtZSAtIG5hbWUgb2YgcmVxdWVzdGluZyBtb2RpZmllclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdGVkTmFtZSAtIG5hbWUgb2YgcmVxdWVzdGVkIG1vZGlmaWVyXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNNb2RpZmllclJlcXVpcmVkKG1vZGlmaWVycywgcmVxdWVzdGluZ05hbWUsIHJlcXVlc3RlZE5hbWUpIHtcclxuICB2YXIgcmVxdWVzdGluZyA9IGZpbmQobW9kaWZpZXJzLCBmdW5jdGlvbiAoX3JlZikge1xyXG4gICAgdmFyIG5hbWUgPSBfcmVmLm5hbWU7XHJcbiAgICByZXR1cm4gbmFtZSA9PT0gcmVxdWVzdGluZ05hbWU7XHJcbiAgfSk7XHJcblxyXG4gIHZhciBpc1JlcXVpcmVkID0gISFyZXF1ZXN0aW5nICYmIG1vZGlmaWVycy5zb21lKGZ1bmN0aW9uIChtb2RpZmllcikge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVyLm5hbWUgPT09IHJlcXVlc3RlZE5hbWUgJiYgbW9kaWZpZXIuZW5hYmxlZCAmJiBtb2RpZmllci5vcmRlciA8IHJlcXVlc3Rpbmcub3JkZXI7XHJcbiAgfSk7XHJcblxyXG4gIGlmICghaXNSZXF1aXJlZCkge1xyXG4gICAgdmFyIF9yZXF1ZXN0aW5nID0gJ2AnICsgcmVxdWVzdGluZ05hbWUgKyAnYCc7XHJcbiAgICB2YXIgcmVxdWVzdGVkID0gJ2AnICsgcmVxdWVzdGVkTmFtZSArICdgJztcclxuICAgIGNvbnNvbGUud2FybihyZXF1ZXN0ZWQgKyAnIG1vZGlmaWVyIGlzIHJlcXVpcmVkIGJ5ICcgKyBfcmVxdWVzdGluZyArICcgbW9kaWZpZXIgaW4gb3JkZXIgdG8gd29yaywgYmUgc3VyZSB0byBpbmNsdWRlIGl0IGJlZm9yZSAnICsgX3JlcXVlc3RpbmcgKyAnIScpO1xyXG4gIH1cclxuICByZXR1cm4gaXNSZXF1aXJlZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gYXJyb3coZGF0YSwgb3B0aW9ucykge1xyXG4gIHZhciBfZGF0YSRvZmZzZXRzJGFycm93O1xyXG5cclxuICAvLyBhcnJvdyBkZXBlbmRzIG9uIGtlZXBUb2dldGhlciBpbiBvcmRlciB0byB3b3JrXHJcbiAgaWYgKCFpc01vZGlmaWVyUmVxdWlyZWQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsICdhcnJvdycsICdrZWVwVG9nZXRoZXInKSkge1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICB2YXIgYXJyb3dFbGVtZW50ID0gb3B0aW9ucy5lbGVtZW50O1xyXG5cclxuICAvLyBpZiBhcnJvd0VsZW1lbnQgaXMgYSBzdHJpbmcsIHN1cHBvc2UgaXQncyBhIENTUyBzZWxlY3RvclxyXG4gIGlmICh0eXBlb2YgYXJyb3dFbGVtZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgYXJyb3dFbGVtZW50ID0gZGF0YS5pbnN0YW5jZS5wb3BwZXIucXVlcnlTZWxlY3RvcihhcnJvd0VsZW1lbnQpO1xyXG5cclxuICAgIC8vIGlmIGFycm93RWxlbWVudCBpcyBub3QgZm91bmQsIGRvbid0IHJ1biB0aGUgbW9kaWZpZXJcclxuICAgIGlmICghYXJyb3dFbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBpZiB0aGUgYXJyb3dFbGVtZW50IGlzbid0IGEgcXVlcnkgc2VsZWN0b3Igd2UgbXVzdCBjaGVjayB0aGF0IHRoZVxyXG4gICAgLy8gcHJvdmlkZWQgRE9NIG5vZGUgaXMgY2hpbGQgb2YgaXRzIHBvcHBlciBub2RlXHJcbiAgICBpZiAoIWRhdGEuaW5zdGFuY2UucG9wcGVyLmNvbnRhaW5zKGFycm93RWxlbWVudCkpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBgYXJyb3cuZWxlbWVudGAgbXVzdCBiZSBjaGlsZCBvZiBpdHMgcG9wcGVyIGVsZW1lbnQhJyk7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcbiAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXHJcbiAgICAgIHBvcHBlciA9IF9kYXRhJG9mZnNldHMucG9wcGVyLFxyXG4gICAgICByZWZlcmVuY2UgPSBfZGF0YSRvZmZzZXRzLnJlZmVyZW5jZTtcclxuXHJcbiAgdmFyIGlzVmVydGljYWwgPSBbJ2xlZnQnLCAncmlnaHQnXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xO1xyXG5cclxuICB2YXIgbGVuID0gaXNWZXJ0aWNhbCA/ICdoZWlnaHQnIDogJ3dpZHRoJztcclxuICB2YXIgc2lkZUNhcGl0YWxpemVkID0gaXNWZXJ0aWNhbCA/ICdUb3AnIDogJ0xlZnQnO1xyXG4gIHZhciBzaWRlID0gc2lkZUNhcGl0YWxpemVkLnRvTG93ZXJDYXNlKCk7XHJcbiAgdmFyIGFsdFNpZGUgPSBpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCc7XHJcbiAgdmFyIG9wU2lkZSA9IGlzVmVydGljYWwgPyAnYm90dG9tJyA6ICdyaWdodCc7XHJcbiAgdmFyIGFycm93RWxlbWVudFNpemUgPSBnZXRPdXRlclNpemVzKGFycm93RWxlbWVudClbbGVuXTtcclxuXHJcbiAgLy9cclxuICAvLyBleHRlbmRzIGtlZXBUb2dldGhlciBiZWhhdmlvciBtYWtpbmcgc3VyZSB0aGUgcG9wcGVyIGFuZCBpdHNcclxuICAvLyByZWZlcmVuY2UgaGF2ZSBlbm91Z2ggcGl4ZWxzIGluIGNvbmp1Y3Rpb25cclxuICAvL1xyXG5cclxuICAvLyB0b3AvbGVmdCBzaWRlXHJcbiAgaWYgKHJlZmVyZW5jZVtvcFNpZGVdIC0gYXJyb3dFbGVtZW50U2l6ZSA8IHBvcHBlcltzaWRlXSkge1xyXG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltzaWRlXSAtPSBwb3BwZXJbc2lkZV0gLSAocmVmZXJlbmNlW29wU2lkZV0gLSBhcnJvd0VsZW1lbnRTaXplKTtcclxuICB9XHJcbiAgLy8gYm90dG9tL3JpZ2h0IHNpZGVcclxuICBpZiAocmVmZXJlbmNlW3NpZGVdICsgYXJyb3dFbGVtZW50U2l6ZSA+IHBvcHBlcltvcFNpZGVdKSB7XHJcbiAgICBkYXRhLm9mZnNldHMucG9wcGVyW3NpZGVdICs9IHJlZmVyZW5jZVtzaWRlXSArIGFycm93RWxlbWVudFNpemUgLSBwb3BwZXJbb3BTaWRlXTtcclxuICB9XHJcbiAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IGdldENsaWVudFJlY3QoZGF0YS5vZmZzZXRzLnBvcHBlcik7XHJcblxyXG4gIC8vIGNvbXB1dGUgY2VudGVyIG9mIHRoZSBwb3BwZXJcclxuICB2YXIgY2VudGVyID0gcmVmZXJlbmNlW3NpZGVdICsgcmVmZXJlbmNlW2xlbl0gLyAyIC0gYXJyb3dFbGVtZW50U2l6ZSAvIDI7XHJcblxyXG4gIC8vIENvbXB1dGUgdGhlIHNpZGVWYWx1ZSB1c2luZyB0aGUgdXBkYXRlZCBwb3BwZXIgb2Zmc2V0c1xyXG4gIC8vIHRha2UgcG9wcGVyIG1hcmdpbiBpbiBhY2NvdW50IGJlY2F1c2Ugd2UgZG9uJ3QgaGF2ZSB0aGlzIGluZm8gYXZhaWxhYmxlXHJcbiAgdmFyIGNzcyA9IGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShkYXRhLmluc3RhbmNlLnBvcHBlcik7XHJcbiAgdmFyIHBvcHBlck1hcmdpblNpZGUgPSBwYXJzZUZsb2F0KGNzc1snbWFyZ2luJyArIHNpZGVDYXBpdGFsaXplZF0sIDEwKTtcclxuICB2YXIgcG9wcGVyQm9yZGVyU2lkZSA9IHBhcnNlRmxvYXQoY3NzWydib3JkZXInICsgc2lkZUNhcGl0YWxpemVkICsgJ1dpZHRoJ10sIDEwKTtcclxuICB2YXIgc2lkZVZhbHVlID0gY2VudGVyIC0gZGF0YS5vZmZzZXRzLnBvcHBlcltzaWRlXSAtIHBvcHBlck1hcmdpblNpZGUgLSBwb3BwZXJCb3JkZXJTaWRlO1xyXG5cclxuICAvLyBwcmV2ZW50IGFycm93RWxlbWVudCBmcm9tIGJlaW5nIHBsYWNlZCBub3QgY29udGlndW91c2x5IHRvIGl0cyBwb3BwZXJcclxuICBzaWRlVmFsdWUgPSBNYXRoLm1heChNYXRoLm1pbihwb3BwZXJbbGVuXSAtIGFycm93RWxlbWVudFNpemUsIHNpZGVWYWx1ZSksIDApO1xyXG5cclxuICBkYXRhLmFycm93RWxlbWVudCA9IGFycm93RWxlbWVudDtcclxuICBkYXRhLm9mZnNldHMuYXJyb3cgPSAoX2RhdGEkb2Zmc2V0cyRhcnJvdyA9IHt9LCBkZWZpbmVQcm9wZXJ0eSQxKF9kYXRhJG9mZnNldHMkYXJyb3csIHNpZGUsIE1hdGgucm91bmQoc2lkZVZhbHVlKSksIGRlZmluZVByb3BlcnR5JDEoX2RhdGEkb2Zmc2V0cyRhcnJvdywgYWx0U2lkZSwgJycpLCBfZGF0YSRvZmZzZXRzJGFycm93KTtcclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIG9wcG9zaXRlIHBsYWNlbWVudCB2YXJpYXRpb24gb2YgdGhlIGdpdmVuIG9uZVxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHBsYWNlbWVudCB2YXJpYXRpb25cclxuICogQHJldHVybnMge1N0cmluZ30gZmxpcHBlZCBwbGFjZW1lbnQgdmFyaWF0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPcHBvc2l0ZVZhcmlhdGlvbih2YXJpYXRpb24pIHtcclxuICBpZiAodmFyaWF0aW9uID09PSAnZW5kJykge1xyXG4gICAgcmV0dXJuICdzdGFydCc7XHJcbiAgfSBlbHNlIGlmICh2YXJpYXRpb24gPT09ICdzdGFydCcpIHtcclxuICAgIHJldHVybiAnZW5kJztcclxuICB9XHJcbiAgcmV0dXJuIHZhcmlhdGlvbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIExpc3Qgb2YgYWNjZXB0ZWQgcGxhY2VtZW50cyB0byB1c2UgYXMgdmFsdWVzIG9mIHRoZSBgcGxhY2VtZW50YCBvcHRpb24uPGJyIC8+XHJcbiAqIFZhbGlkIHBsYWNlbWVudHMgYXJlOlxyXG4gKiAtIGBhdXRvYFxyXG4gKiAtIGB0b3BgXHJcbiAqIC0gYHJpZ2h0YFxyXG4gKiAtIGBib3R0b21gXHJcbiAqIC0gYGxlZnRgXHJcbiAqXHJcbiAqIEVhY2ggcGxhY2VtZW50IGNhbiBoYXZlIGEgdmFyaWF0aW9uIGZyb20gdGhpcyBsaXN0OlxyXG4gKiAtIGAtc3RhcnRgXHJcbiAqIC0gYC1lbmRgXHJcbiAqXHJcbiAqIFZhcmlhdGlvbnMgYXJlIGludGVycHJldGVkIGVhc2lseSBpZiB5b3UgdGhpbmsgb2YgdGhlbSBhcyB0aGUgbGVmdCB0byByaWdodFxyXG4gKiB3cml0dGVuIGxhbmd1YWdlcy4gSG9yaXpvbnRhbGx5IChgdG9wYCBhbmQgYGJvdHRvbWApLCBgc3RhcnRgIGlzIGxlZnQgYW5kIGBlbmRgXHJcbiAqIGlzIHJpZ2h0LjxiciAvPlxyXG4gKiBWZXJ0aWNhbGx5IChgbGVmdGAgYW5kIGByaWdodGApLCBgc3RhcnRgIGlzIHRvcCBhbmQgYGVuZGAgaXMgYm90dG9tLlxyXG4gKlxyXG4gKiBTb21lIHZhbGlkIGV4YW1wbGVzIGFyZTpcclxuICogLSBgdG9wLWVuZGAgKG9uIHRvcCBvZiByZWZlcmVuY2UsIHJpZ2h0IGFsaWduZWQpXHJcbiAqIC0gYHJpZ2h0LXN0YXJ0YCAob24gcmlnaHQgb2YgcmVmZXJlbmNlLCB0b3AgYWxpZ25lZClcclxuICogLSBgYm90dG9tYCAob24gYm90dG9tLCBjZW50ZXJlZClcclxuICogLSBgYXV0by1yaWdodGAgKG9uIHRoZSBzaWRlIHdpdGggbW9yZSBzcGFjZSBhdmFpbGFibGUsIGFsaWdubWVudCBkZXBlbmRzIGJ5IHBsYWNlbWVudClcclxuICpcclxuICogQHN0YXRpY1xyXG4gKiBAdHlwZSB7QXJyYXl9XHJcbiAqIEBlbnVtIHtTdHJpbmd9XHJcbiAqIEByZWFkb25seVxyXG4gKiBAbWV0aG9kIHBsYWNlbWVudHNcclxuICogQG1lbWJlcm9mIFBvcHBlclxyXG4gKi9cclxudmFyIHBsYWNlbWVudHMgPSBbJ2F1dG8tc3RhcnQnLCAnYXV0bycsICdhdXRvLWVuZCcsICd0b3Atc3RhcnQnLCAndG9wJywgJ3RvcC1lbmQnLCAncmlnaHQtc3RhcnQnLCAncmlnaHQnLCAncmlnaHQtZW5kJywgJ2JvdHRvbS1lbmQnLCAnYm90dG9tJywgJ2JvdHRvbS1zdGFydCcsICdsZWZ0LWVuZCcsICdsZWZ0JywgJ2xlZnQtc3RhcnQnXTtcclxuXHJcbi8vIEdldCByaWQgb2YgYGF1dG9gIGBhdXRvLXN0YXJ0YCBhbmQgYGF1dG8tZW5kYFxyXG52YXIgdmFsaWRQbGFjZW1lbnRzID0gcGxhY2VtZW50cy5zbGljZSgzKTtcclxuXHJcbi8qKlxyXG4gKiBHaXZlbiBhbiBpbml0aWFsIHBsYWNlbWVudCwgcmV0dXJucyBhbGwgdGhlIHN1YnNlcXVlbnQgcGxhY2VtZW50c1xyXG4gKiBjbG9ja3dpc2UgKG9yIGNvdW50ZXItY2xvY2t3aXNlKS5cclxuICpcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwbGFjZW1lbnQgLSBBIHZhbGlkIHBsYWNlbWVudCAoaXQgYWNjZXB0cyB2YXJpYXRpb25zKVxyXG4gKiBAYXJndW1lbnQge0Jvb2xlYW59IGNvdW50ZXIgLSBTZXQgdG8gdHJ1ZSB0byB3YWxrIHRoZSBwbGFjZW1lbnRzIGNvdW50ZXJjbG9ja3dpc2VcclxuICogQHJldHVybnMge0FycmF5fSBwbGFjZW1lbnRzIGluY2x1ZGluZyB0aGVpciB2YXJpYXRpb25zXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9ja3dpc2UocGxhY2VtZW50KSB7XHJcbiAgdmFyIGNvdW50ZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xyXG5cclxuICB2YXIgaW5kZXggPSB2YWxpZFBsYWNlbWVudHMuaW5kZXhPZihwbGFjZW1lbnQpO1xyXG4gIHZhciBhcnIgPSB2YWxpZFBsYWNlbWVudHMuc2xpY2UoaW5kZXggKyAxKS5jb25jYXQodmFsaWRQbGFjZW1lbnRzLnNsaWNlKDAsIGluZGV4KSk7XHJcbiAgcmV0dXJuIGNvdW50ZXIgPyBhcnIucmV2ZXJzZSgpIDogYXJyO1xyXG59XHJcblxyXG52YXIgQkVIQVZJT1JTID0ge1xyXG4gIEZMSVA6ICdmbGlwJyxcclxuICBDTE9DS1dJU0U6ICdjbG9ja3dpc2UnLFxyXG4gIENPVU5URVJDTE9DS1dJU0U6ICdjb3VudGVyY2xvY2t3aXNlJ1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gZmxpcChkYXRhLCBvcHRpb25zKSB7XHJcbiAgLy8gaWYgYGlubmVyYCBtb2RpZmllciBpcyBlbmFibGVkLCB3ZSBjYW4ndCB1c2UgdGhlIGBmbGlwYCBtb2RpZmllclxyXG4gIGlmIChpc01vZGlmaWVyRW5hYmxlZChkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgJ2lubmVyJykpIHtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgaWYgKGRhdGEuZmxpcHBlZCAmJiBkYXRhLnBsYWNlbWVudCA9PT0gZGF0YS5vcmlnaW5hbFBsYWNlbWVudCkge1xyXG4gICAgLy8gc2VlbXMgbGlrZSBmbGlwIGlzIHRyeWluZyB0byBsb29wLCBwcm9iYWJseSB0aGVyZSdzIG5vdCBlbm91Z2ggc3BhY2Ugb24gYW55IG9mIHRoZSBmbGlwcGFibGUgc2lkZXNcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgdmFyIGJvdW5kYXJpZXMgPSBnZXRCb3VuZGFyaWVzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLmluc3RhbmNlLnJlZmVyZW5jZSwgb3B0aW9ucy5wYWRkaW5nLCBvcHRpb25zLmJvdW5kYXJpZXNFbGVtZW50LCBkYXRhLnBvc2l0aW9uRml4ZWQpO1xyXG5cclxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuICB2YXIgcGxhY2VtZW50T3Bwb3NpdGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpO1xyXG4gIHZhciB2YXJpYXRpb24gPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzFdIHx8ICcnO1xyXG5cclxuICB2YXIgZmxpcE9yZGVyID0gW107XHJcblxyXG4gIHN3aXRjaCAob3B0aW9ucy5iZWhhdmlvcikge1xyXG4gICAgY2FzZSBCRUhBVklPUlMuRkxJUDpcclxuICAgICAgZmxpcE9yZGVyID0gW3BsYWNlbWVudCwgcGxhY2VtZW50T3Bwb3NpdGVdO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgQkVIQVZJT1JTLkNMT0NLV0lTRTpcclxuICAgICAgZmxpcE9yZGVyID0gY2xvY2t3aXNlKHBsYWNlbWVudCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBCRUhBVklPUlMuQ09VTlRFUkNMT0NLV0lTRTpcclxuICAgICAgZmxpcE9yZGVyID0gY2xvY2t3aXNlKHBsYWNlbWVudCwgdHJ1ZSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgZmxpcE9yZGVyID0gb3B0aW9ucy5iZWhhdmlvcjtcclxuICB9XHJcblxyXG4gIGZsaXBPcmRlci5mb3JFYWNoKGZ1bmN0aW9uIChzdGVwLCBpbmRleCkge1xyXG4gICAgaWYgKHBsYWNlbWVudCAhPT0gc3RlcCB8fCBmbGlwT3JkZXIubGVuZ3RoID09PSBpbmRleCArIDEpIHtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuICAgIHBsYWNlbWVudE9wcG9zaXRlID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcclxuXHJcbiAgICB2YXIgcG9wcGVyT2Zmc2V0cyA9IGRhdGEub2Zmc2V0cy5wb3BwZXI7XHJcbiAgICB2YXIgcmVmT2Zmc2V0cyA9IGRhdGEub2Zmc2V0cy5yZWZlcmVuY2U7XHJcblxyXG4gICAgLy8gdXNpbmcgZmxvb3IgYmVjYXVzZSB0aGUgcmVmZXJlbmNlIG9mZnNldHMgbWF5IGNvbnRhaW4gZGVjaW1hbHMgd2UgYXJlIG5vdCBnb2luZyB0byBjb25zaWRlciBoZXJlXHJcbiAgICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xyXG4gICAgdmFyIG92ZXJsYXBzUmVmID0gcGxhY2VtZW50ID09PSAnbGVmdCcgJiYgZmxvb3IocG9wcGVyT2Zmc2V0cy5yaWdodCkgPiBmbG9vcihyZWZPZmZzZXRzLmxlZnQpIHx8IHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyAmJiBmbG9vcihwb3BwZXJPZmZzZXRzLmxlZnQpIDwgZmxvb3IocmVmT2Zmc2V0cy5yaWdodCkgfHwgcGxhY2VtZW50ID09PSAndG9wJyAmJiBmbG9vcihwb3BwZXJPZmZzZXRzLmJvdHRvbSkgPiBmbG9vcihyZWZPZmZzZXRzLnRvcCkgfHwgcGxhY2VtZW50ID09PSAnYm90dG9tJyAmJiBmbG9vcihwb3BwZXJPZmZzZXRzLnRvcCkgPCBmbG9vcihyZWZPZmZzZXRzLmJvdHRvbSk7XHJcblxyXG4gICAgdmFyIG92ZXJmbG93c0xlZnQgPSBmbG9vcihwb3BwZXJPZmZzZXRzLmxlZnQpIDwgZmxvb3IoYm91bmRhcmllcy5sZWZ0KTtcclxuICAgIHZhciBvdmVyZmxvd3NSaWdodCA9IGZsb29yKHBvcHBlck9mZnNldHMucmlnaHQpID4gZmxvb3IoYm91bmRhcmllcy5yaWdodCk7XHJcbiAgICB2YXIgb3ZlcmZsb3dzVG9wID0gZmxvb3IocG9wcGVyT2Zmc2V0cy50b3ApIDwgZmxvb3IoYm91bmRhcmllcy50b3ApO1xyXG4gICAgdmFyIG92ZXJmbG93c0JvdHRvbSA9IGZsb29yKHBvcHBlck9mZnNldHMuYm90dG9tKSA+IGZsb29yKGJvdW5kYXJpZXMuYm90dG9tKTtcclxuXHJcbiAgICB2YXIgb3ZlcmZsb3dzQm91bmRhcmllcyA9IHBsYWNlbWVudCA9PT0gJ2xlZnQnICYmIG92ZXJmbG93c0xlZnQgfHwgcGxhY2VtZW50ID09PSAncmlnaHQnICYmIG92ZXJmbG93c1JpZ2h0IHx8IHBsYWNlbWVudCA9PT0gJ3RvcCcgJiYgb3ZlcmZsb3dzVG9wIHx8IHBsYWNlbWVudCA9PT0gJ2JvdHRvbScgJiYgb3ZlcmZsb3dzQm90dG9tO1xyXG5cclxuICAgIC8vIGZsaXAgdGhlIHZhcmlhdGlvbiBpZiByZXF1aXJlZFxyXG4gICAgdmFyIGlzVmVydGljYWwgPSBbJ3RvcCcsICdib3R0b20nXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xO1xyXG4gICAgdmFyIGZsaXBwZWRWYXJpYXRpb24gPSAhIW9wdGlvbnMuZmxpcFZhcmlhdGlvbnMgJiYgKGlzVmVydGljYWwgJiYgdmFyaWF0aW9uID09PSAnc3RhcnQnICYmIG92ZXJmbG93c0xlZnQgfHwgaXNWZXJ0aWNhbCAmJiB2YXJpYXRpb24gPT09ICdlbmQnICYmIG92ZXJmbG93c1JpZ2h0IHx8ICFpc1ZlcnRpY2FsICYmIHZhcmlhdGlvbiA9PT0gJ3N0YXJ0JyAmJiBvdmVyZmxvd3NUb3AgfHwgIWlzVmVydGljYWwgJiYgdmFyaWF0aW9uID09PSAnZW5kJyAmJiBvdmVyZmxvd3NCb3R0b20pO1xyXG5cclxuICAgIGlmIChvdmVybGFwc1JlZiB8fCBvdmVyZmxvd3NCb3VuZGFyaWVzIHx8IGZsaXBwZWRWYXJpYXRpb24pIHtcclxuICAgICAgLy8gdGhpcyBib29sZWFuIHRvIGRldGVjdCBhbnkgZmxpcCBsb29wXHJcbiAgICAgIGRhdGEuZmxpcHBlZCA9IHRydWU7XHJcblxyXG4gICAgICBpZiAob3ZlcmxhcHNSZWYgfHwgb3ZlcmZsb3dzQm91bmRhcmllcykge1xyXG4gICAgICAgIHBsYWNlbWVudCA9IGZsaXBPcmRlcltpbmRleCArIDFdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZmxpcHBlZFZhcmlhdGlvbikge1xyXG4gICAgICAgIHZhcmlhdGlvbiA9IGdldE9wcG9zaXRlVmFyaWF0aW9uKHZhcmlhdGlvbik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGEucGxhY2VtZW50ID0gcGxhY2VtZW50ICsgKHZhcmlhdGlvbiA/ICctJyArIHZhcmlhdGlvbiA6ICcnKTtcclxuXHJcbiAgICAgIC8vIHRoaXMgb2JqZWN0IGNvbnRhaW5zIGBwb3NpdGlvbmAsIHdlIHdhbnQgdG8gcHJlc2VydmUgaXQgYWxvbmcgd2l0aFxyXG4gICAgICAvLyBhbnkgYWRkaXRpb25hbCBwcm9wZXJ0eSB3ZSBtYXkgYWRkIGluIHRoZSBmdXR1cmVcclxuICAgICAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IF9leHRlbmRzJDEoe30sIGRhdGEub2Zmc2V0cy5wb3BwZXIsIGdldFBvcHBlck9mZnNldHMoZGF0YS5pbnN0YW5jZS5wb3BwZXIsIGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UsIGRhdGEucGxhY2VtZW50KSk7XHJcblxyXG4gICAgICBkYXRhID0gcnVuTW9kaWZpZXJzKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCBkYXRhLCAnZmxpcCcpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBrZWVwVG9nZXRoZXIoZGF0YSkge1xyXG4gIHZhciBfZGF0YSRvZmZzZXRzID0gZGF0YS5vZmZzZXRzLFxyXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcclxuICAgICAgcmVmZXJlbmNlID0gX2RhdGEkb2Zmc2V0cy5yZWZlcmVuY2U7XHJcblxyXG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xyXG4gIHZhciBmbG9vciA9IE1hdGguZmxvb3I7XHJcbiAgdmFyIGlzVmVydGljYWwgPSBbJ3RvcCcsICdib3R0b20nXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xO1xyXG4gIHZhciBzaWRlID0gaXNWZXJ0aWNhbCA/ICdyaWdodCcgOiAnYm90dG9tJztcclxuICB2YXIgb3BTaWRlID0gaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnO1xyXG4gIHZhciBtZWFzdXJlbWVudCA9IGlzVmVydGljYWwgPyAnd2lkdGgnIDogJ2hlaWdodCc7XHJcblxyXG4gIGlmIChwb3BwZXJbc2lkZV0gPCBmbG9vcihyZWZlcmVuY2Vbb3BTaWRlXSkpIHtcclxuICAgIGRhdGEub2Zmc2V0cy5wb3BwZXJbb3BTaWRlXSA9IGZsb29yKHJlZmVyZW5jZVtvcFNpZGVdKSAtIHBvcHBlclttZWFzdXJlbWVudF07XHJcbiAgfVxyXG4gIGlmIChwb3BwZXJbb3BTaWRlXSA+IGZsb29yKHJlZmVyZW5jZVtzaWRlXSkpIHtcclxuICAgIGRhdGEub2Zmc2V0cy5wb3BwZXJbb3BTaWRlXSA9IGZsb29yKHJlZmVyZW5jZVtzaWRlXSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIGEgc3RyaW5nIGNvbnRhaW5pbmcgdmFsdWUgKyB1bml0IGludG8gYSBweCB2YWx1ZSBudW1iZXJcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiB7bW9kaWZpZXJzfm9mZnNldH1cclxuICogQHByaXZhdGVcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHN0ciAtIFZhbHVlICsgdW5pdCBzdHJpbmdcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IG1lYXN1cmVtZW50IC0gYGhlaWdodGAgb3IgYHdpZHRoYFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gcG9wcGVyT2Zmc2V0c1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gcmVmZXJlbmNlT2Zmc2V0c1xyXG4gKiBAcmV0dXJucyB7TnVtYmVyfFN0cmluZ31cclxuICogVmFsdWUgaW4gcGl4ZWxzLCBvciBvcmlnaW5hbCBzdHJpbmcgaWYgbm8gdmFsdWVzIHdlcmUgZXh0cmFjdGVkXHJcbiAqL1xyXG5mdW5jdGlvbiB0b1ZhbHVlKHN0ciwgbWVhc3VyZW1lbnQsIHBvcHBlck9mZnNldHMsIHJlZmVyZW5jZU9mZnNldHMpIHtcclxuICAvLyBzZXBhcmF0ZSB2YWx1ZSBmcm9tIHVuaXRcclxuICB2YXIgc3BsaXQgPSBzdHIubWF0Y2goLygoPzpcXC18XFwrKT9cXGQqXFwuP1xcZCopKC4qKS8pO1xyXG4gIHZhciB2YWx1ZSA9ICtzcGxpdFsxXTtcclxuICB2YXIgdW5pdCA9IHNwbGl0WzJdO1xyXG5cclxuICAvLyBJZiBpdCdzIG5vdCBhIG51bWJlciBpdCdzIGFuIG9wZXJhdG9yLCBJIGd1ZXNzXHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHN0cjtcclxuICB9XHJcblxyXG4gIGlmICh1bml0LmluZGV4T2YoJyUnKSA9PT0gMCkge1xyXG4gICAgdmFyIGVsZW1lbnQgPSB2b2lkIDA7XHJcbiAgICBzd2l0Y2ggKHVuaXQpIHtcclxuICAgICAgY2FzZSAnJXAnOlxyXG4gICAgICAgIGVsZW1lbnQgPSBwb3BwZXJPZmZzZXRzO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICclJzpcclxuICAgICAgY2FzZSAnJXInOlxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGVsZW1lbnQgPSByZWZlcmVuY2VPZmZzZXRzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciByZWN0ID0gZ2V0Q2xpZW50UmVjdChlbGVtZW50KTtcclxuICAgIHJldHVybiByZWN0W21lYXN1cmVtZW50XSAvIDEwMCAqIHZhbHVlO1xyXG4gIH0gZWxzZSBpZiAodW5pdCA9PT0gJ3ZoJyB8fCB1bml0ID09PSAndncnKSB7XHJcbiAgICAvLyBpZiBpcyBhIHZoIG9yIHZ3LCB3ZSBjYWxjdWxhdGUgdGhlIHNpemUgYmFzZWQgb24gdGhlIHZpZXdwb3J0XHJcbiAgICB2YXIgc2l6ZSA9IHZvaWQgMDtcclxuICAgIGlmICh1bml0ID09PSAndmgnKSB7XHJcbiAgICAgIHNpemUgPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzaXplID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzaXplIC8gMTAwICogdmFsdWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGlmIGlzIGFuIGV4cGxpY2l0IHBpeGVsIHVuaXQsIHdlIGdldCByaWQgb2YgdGhlIHVuaXQgYW5kIGtlZXAgdGhlIHZhbHVlXHJcbiAgICAvLyBpZiBpcyBhbiBpbXBsaWNpdCB1bml0LCBpdCdzIHB4LCBhbmQgd2UgcmV0dXJuIGp1c3QgdGhlIHZhbHVlXHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUGFyc2UgYW4gYG9mZnNldGAgc3RyaW5nIHRvIGV4dHJhcG9sYXRlIGB4YCBhbmQgYHlgIG51bWVyaWMgb2Zmc2V0cy5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiB7bW9kaWZpZXJzfm9mZnNldH1cclxuICogQHByaXZhdGVcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IG9mZnNldFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gcG9wcGVyT2Zmc2V0c1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gcmVmZXJlbmNlT2Zmc2V0c1xyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gYmFzZVBsYWNlbWVudFxyXG4gKiBAcmV0dXJucyB7QXJyYXl9IGEgdHdvIGNlbGxzIGFycmF5IHdpdGggeCBhbmQgeSBvZmZzZXRzIGluIG51bWJlcnNcclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlT2Zmc2V0KG9mZnNldCwgcG9wcGVyT2Zmc2V0cywgcmVmZXJlbmNlT2Zmc2V0cywgYmFzZVBsYWNlbWVudCkge1xyXG4gIHZhciBvZmZzZXRzID0gWzAsIDBdO1xyXG5cclxuICAvLyBVc2UgaGVpZ2h0IGlmIHBsYWNlbWVudCBpcyBsZWZ0IG9yIHJpZ2h0IGFuZCBpbmRleCBpcyAwIG90aGVyd2lzZSB1c2Ugd2lkdGhcclxuICAvLyBpbiB0aGlzIHdheSB0aGUgZmlyc3Qgb2Zmc2V0IHdpbGwgdXNlIGFuIGF4aXMgYW5kIHRoZSBzZWNvbmQgb25lXHJcbiAgLy8gd2lsbCB1c2UgdGhlIG90aGVyIG9uZVxyXG4gIHZhciB1c2VIZWlnaHQgPSBbJ3JpZ2h0JywgJ2xlZnQnXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcclxuXHJcbiAgLy8gU3BsaXQgdGhlIG9mZnNldCBzdHJpbmcgdG8gb2J0YWluIGEgbGlzdCBvZiB2YWx1ZXMgYW5kIG9wZXJhbmRzXHJcbiAgLy8gVGhlIHJlZ2V4IGFkZHJlc3NlcyB2YWx1ZXMgd2l0aCB0aGUgcGx1cyBvciBtaW51cyBzaWduIGluIGZyb250ICgrMTAsIC0yMCwgZXRjKVxyXG4gIHZhciBmcmFnbWVudHMgPSBvZmZzZXQuc3BsaXQoLyhcXCt8XFwtKS8pLm1hcChmdW5jdGlvbiAoZnJhZykge1xyXG4gICAgcmV0dXJuIGZyYWcudHJpbSgpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBEZXRlY3QgaWYgdGhlIG9mZnNldCBzdHJpbmcgY29udGFpbnMgYSBwYWlyIG9mIHZhbHVlcyBvciBhIHNpbmdsZSBvbmVcclxuICAvLyB0aGV5IGNvdWxkIGJlIHNlcGFyYXRlZCBieSBjb21tYSBvciBzcGFjZVxyXG4gIHZhciBkaXZpZGVyID0gZnJhZ21lbnRzLmluZGV4T2YoZmluZChmcmFnbWVudHMsIGZ1bmN0aW9uIChmcmFnKSB7XHJcbiAgICByZXR1cm4gZnJhZy5zZWFyY2goLyx8XFxzLykgIT09IC0xO1xyXG4gIH0pKTtcclxuXHJcbiAgaWYgKGZyYWdtZW50c1tkaXZpZGVyXSAmJiBmcmFnbWVudHNbZGl2aWRlcl0uaW5kZXhPZignLCcpID09PSAtMSkge1xyXG4gICAgY29uc29sZS53YXJuKCdPZmZzZXRzIHNlcGFyYXRlZCBieSB3aGl0ZSBzcGFjZShzKSBhcmUgZGVwcmVjYXRlZCwgdXNlIGEgY29tbWEgKCwpIGluc3RlYWQuJyk7XHJcbiAgfVxyXG5cclxuICAvLyBJZiBkaXZpZGVyIGlzIGZvdW5kLCB3ZSBkaXZpZGUgdGhlIGxpc3Qgb2YgdmFsdWVzIGFuZCBvcGVyYW5kcyB0byBkaXZpZGVcclxuICAvLyB0aGVtIGJ5IG9mc2V0IFggYW5kIFkuXHJcbiAgdmFyIHNwbGl0UmVnZXggPSAvXFxzKixcXHMqfFxccysvO1xyXG4gIHZhciBvcHMgPSBkaXZpZGVyICE9PSAtMSA/IFtmcmFnbWVudHMuc2xpY2UoMCwgZGl2aWRlcikuY29uY2F0KFtmcmFnbWVudHNbZGl2aWRlcl0uc3BsaXQoc3BsaXRSZWdleClbMF1dKSwgW2ZyYWdtZW50c1tkaXZpZGVyXS5zcGxpdChzcGxpdFJlZ2V4KVsxXV0uY29uY2F0KGZyYWdtZW50cy5zbGljZShkaXZpZGVyICsgMSkpXSA6IFtmcmFnbWVudHNdO1xyXG5cclxuICAvLyBDb252ZXJ0IHRoZSB2YWx1ZXMgd2l0aCB1bml0cyB0byBhYnNvbHV0ZSBwaXhlbHMgdG8gYWxsb3cgb3VyIGNvbXB1dGF0aW9uc1xyXG4gIG9wcyA9IG9wcy5tYXAoZnVuY3Rpb24gKG9wLCBpbmRleCkge1xyXG4gICAgLy8gTW9zdCBvZiB0aGUgdW5pdHMgcmVseSBvbiB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHBvcHBlclxyXG4gICAgdmFyIG1lYXN1cmVtZW50ID0gKGluZGV4ID09PSAxID8gIXVzZUhlaWdodCA6IHVzZUhlaWdodCkgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XHJcbiAgICB2YXIgbWVyZ2VXaXRoUHJldmlvdXMgPSBmYWxzZTtcclxuICAgIHJldHVybiBvcFxyXG4gICAgLy8gVGhpcyBhZ2dyZWdhdGVzIGFueSBgK2Agb3IgYC1gIHNpZ24gdGhhdCBhcmVuJ3QgY29uc2lkZXJlZCBvcGVyYXRvcnNcclxuICAgIC8vIGUuZy46IDEwICsgKzUgPT4gWzEwLCArLCArNV1cclxuICAgIC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgaWYgKGFbYS5sZW5ndGggLSAxXSA9PT0gJycgJiYgWycrJywgJy0nXS5pbmRleE9mKGIpICE9PSAtMSkge1xyXG4gICAgICAgIGFbYS5sZW5ndGggLSAxXSA9IGI7XHJcbiAgICAgICAgbWVyZ2VXaXRoUHJldmlvdXMgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgICB9IGVsc2UgaWYgKG1lcmdlV2l0aFByZXZpb3VzKSB7XHJcbiAgICAgICAgYVthLmxlbmd0aCAtIDFdICs9IGI7XHJcbiAgICAgICAgbWVyZ2VXaXRoUHJldmlvdXMgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gYTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYS5jb25jYXQoYik7XHJcbiAgICAgIH1cclxuICAgIH0sIFtdKVxyXG4gICAgLy8gSGVyZSB3ZSBjb252ZXJ0IHRoZSBzdHJpbmcgdmFsdWVzIGludG8gbnVtYmVyIHZhbHVlcyAoaW4gcHgpXHJcbiAgICAubWFwKGZ1bmN0aW9uIChzdHIpIHtcclxuICAgICAgcmV0dXJuIHRvVmFsdWUoc3RyLCBtZWFzdXJlbWVudCwgcG9wcGVyT2Zmc2V0cywgcmVmZXJlbmNlT2Zmc2V0cyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgLy8gTG9vcCB0cm91Z2ggdGhlIG9mZnNldHMgYXJyYXlzIGFuZCBleGVjdXRlIHRoZSBvcGVyYXRpb25zXHJcbiAgb3BzLmZvckVhY2goZnVuY3Rpb24gKG9wLCBpbmRleCkge1xyXG4gICAgb3AuZm9yRWFjaChmdW5jdGlvbiAoZnJhZywgaW5kZXgyKSB7XHJcbiAgICAgIGlmIChpc051bWVyaWMoZnJhZykpIHtcclxuICAgICAgICBvZmZzZXRzW2luZGV4XSArPSBmcmFnICogKG9wW2luZGV4MiAtIDFdID09PSAnLScgPyAtMSA6IDEpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4gb2Zmc2V0cztcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQGFyZ3VtZW50IHtOdW1iZXJ8U3RyaW5nfSBvcHRpb25zLm9mZnNldD0wXHJcbiAqIFRoZSBvZmZzZXQgdmFsdWUgYXMgZGVzY3JpYmVkIGluIHRoZSBtb2RpZmllciBkZXNjcmlwdGlvblxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBvZmZzZXQoZGF0YSwgX3JlZikge1xyXG4gIHZhciBvZmZzZXQgPSBfcmVmLm9mZnNldDtcclxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQsXHJcbiAgICAgIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXHJcbiAgICAgIHBvcHBlciA9IF9kYXRhJG9mZnNldHMucG9wcGVyLFxyXG4gICAgICByZWZlcmVuY2UgPSBfZGF0YSRvZmZzZXRzLnJlZmVyZW5jZTtcclxuXHJcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuXHJcbiAgdmFyIG9mZnNldHMgPSB2b2lkIDA7XHJcbiAgaWYgKGlzTnVtZXJpYygrb2Zmc2V0KSkge1xyXG4gICAgb2Zmc2V0cyA9IFsrb2Zmc2V0LCAwXTtcclxuICB9IGVsc2Uge1xyXG4gICAgb2Zmc2V0cyA9IHBhcnNlT2Zmc2V0KG9mZnNldCwgcG9wcGVyLCByZWZlcmVuY2UsIGJhc2VQbGFjZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGJhc2VQbGFjZW1lbnQgPT09ICdsZWZ0Jykge1xyXG4gICAgcG9wcGVyLnRvcCArPSBvZmZzZXRzWzBdO1xyXG4gICAgcG9wcGVyLmxlZnQgLT0gb2Zmc2V0c1sxXTtcclxuICB9IGVsc2UgaWYgKGJhc2VQbGFjZW1lbnQgPT09ICdyaWdodCcpIHtcclxuICAgIHBvcHBlci50b3AgKz0gb2Zmc2V0c1swXTtcclxuICAgIHBvcHBlci5sZWZ0ICs9IG9mZnNldHNbMV07XHJcbiAgfSBlbHNlIGlmIChiYXNlUGxhY2VtZW50ID09PSAndG9wJykge1xyXG4gICAgcG9wcGVyLmxlZnQgKz0gb2Zmc2V0c1swXTtcclxuICAgIHBvcHBlci50b3AgLT0gb2Zmc2V0c1sxXTtcclxuICB9IGVsc2UgaWYgKGJhc2VQbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XHJcbiAgICBwb3BwZXIubGVmdCArPSBvZmZzZXRzWzBdO1xyXG4gICAgcG9wcGVyLnRvcCArPSBvZmZzZXRzWzFdO1xyXG4gIH1cclxuXHJcbiAgZGF0YS5wb3BwZXIgPSBwb3BwZXI7XHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gcHJldmVudE92ZXJmbG93KGRhdGEsIG9wdGlvbnMpIHtcclxuICB2YXIgYm91bmRhcmllc0VsZW1lbnQgPSBvcHRpb25zLmJvdW5kYXJpZXNFbGVtZW50IHx8IGdldE9mZnNldFBhcmVudChkYXRhLmluc3RhbmNlLnBvcHBlcik7XHJcblxyXG4gIC8vIElmIG9mZnNldFBhcmVudCBpcyB0aGUgcmVmZXJlbmNlIGVsZW1lbnQsIHdlIHJlYWxseSB3YW50IHRvXHJcbiAgLy8gZ28gb25lIHN0ZXAgdXAgYW5kIHVzZSB0aGUgbmV4dCBvZmZzZXRQYXJlbnQgYXMgcmVmZXJlbmNlIHRvXHJcbiAgLy8gYXZvaWQgdG8gbWFrZSB0aGlzIG1vZGlmaWVyIGNvbXBsZXRlbHkgdXNlbGVzcyBhbmQgbG9vayBsaWtlIGJyb2tlblxyXG4gIGlmIChkYXRhLmluc3RhbmNlLnJlZmVyZW5jZSA9PT0gYm91bmRhcmllc0VsZW1lbnQpIHtcclxuICAgIGJvdW5kYXJpZXNFbGVtZW50ID0gZ2V0T2Zmc2V0UGFyZW50KGJvdW5kYXJpZXNFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIC8vIE5PVEU6IERPTSBhY2Nlc3MgaGVyZVxyXG4gIC8vIHJlc2V0cyB0aGUgcG9wcGVyJ3MgcG9zaXRpb24gc28gdGhhdCB0aGUgZG9jdW1lbnQgc2l6ZSBjYW4gYmUgY2FsY3VsYXRlZCBleGNsdWRpbmdcclxuICAvLyB0aGUgc2l6ZSBvZiB0aGUgcG9wcGVyIGVsZW1lbnQgaXRzZWxmXHJcbiAgdmFyIHRyYW5zZm9ybVByb3AgPSBnZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUoJ3RyYW5zZm9ybScpO1xyXG4gIHZhciBwb3BwZXJTdHlsZXMgPSBkYXRhLmluc3RhbmNlLnBvcHBlci5zdHlsZTsgLy8gYXNzaWdubWVudCB0byBoZWxwIG1pbmlmaWNhdGlvblxyXG4gIHZhciB0b3AgPSBwb3BwZXJTdHlsZXMudG9wLFxyXG4gICAgICBsZWZ0ID0gcG9wcGVyU3R5bGVzLmxlZnQsXHJcbiAgICAgIHRyYW5zZm9ybSA9IHBvcHBlclN0eWxlc1t0cmFuc2Zvcm1Qcm9wXTtcclxuXHJcbiAgcG9wcGVyU3R5bGVzLnRvcCA9ICcnO1xyXG4gIHBvcHBlclN0eWxlcy5sZWZ0ID0gJyc7XHJcbiAgcG9wcGVyU3R5bGVzW3RyYW5zZm9ybVByb3BdID0gJyc7XHJcblxyXG4gIHZhciBib3VuZGFyaWVzID0gZ2V0Qm91bmRhcmllcyhkYXRhLmluc3RhbmNlLnBvcHBlciwgZGF0YS5pbnN0YW5jZS5yZWZlcmVuY2UsIG9wdGlvbnMucGFkZGluZywgYm91bmRhcmllc0VsZW1lbnQsIGRhdGEucG9zaXRpb25GaXhlZCk7XHJcblxyXG4gIC8vIE5PVEU6IERPTSBhY2Nlc3MgaGVyZVxyXG4gIC8vIHJlc3RvcmVzIHRoZSBvcmlnaW5hbCBzdHlsZSBwcm9wZXJ0aWVzIGFmdGVyIHRoZSBvZmZzZXRzIGhhdmUgYmVlbiBjb21wdXRlZFxyXG4gIHBvcHBlclN0eWxlcy50b3AgPSB0b3A7XHJcbiAgcG9wcGVyU3R5bGVzLmxlZnQgPSBsZWZ0O1xyXG4gIHBvcHBlclN0eWxlc1t0cmFuc2Zvcm1Qcm9wXSA9IHRyYW5zZm9ybTtcclxuXHJcbiAgb3B0aW9ucy5ib3VuZGFyaWVzID0gYm91bmRhcmllcztcclxuXHJcbiAgdmFyIG9yZGVyID0gb3B0aW9ucy5wcmlvcml0eTtcclxuICB2YXIgcG9wcGVyID0gZGF0YS5vZmZzZXRzLnBvcHBlcjtcclxuXHJcbiAgdmFyIGNoZWNrID0ge1xyXG4gICAgcHJpbWFyeTogZnVuY3Rpb24gcHJpbWFyeShwbGFjZW1lbnQpIHtcclxuICAgICAgdmFyIHZhbHVlID0gcG9wcGVyW3BsYWNlbWVudF07XHJcbiAgICAgIGlmIChwb3BwZXJbcGxhY2VtZW50XSA8IGJvdW5kYXJpZXNbcGxhY2VtZW50XSAmJiAhb3B0aW9ucy5lc2NhcGVXaXRoUmVmZXJlbmNlKSB7XHJcbiAgICAgICAgdmFsdWUgPSBNYXRoLm1heChwb3BwZXJbcGxhY2VtZW50XSwgYm91bmRhcmllc1twbGFjZW1lbnRdKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkkMSh7fSwgcGxhY2VtZW50LCB2YWx1ZSk7XHJcbiAgICB9LFxyXG4gICAgc2Vjb25kYXJ5OiBmdW5jdGlvbiBzZWNvbmRhcnkocGxhY2VtZW50KSB7XHJcbiAgICAgIHZhciBtYWluU2lkZSA9IHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyA/ICdsZWZ0JyA6ICd0b3AnO1xyXG4gICAgICB2YXIgdmFsdWUgPSBwb3BwZXJbbWFpblNpZGVdO1xyXG4gICAgICBpZiAocG9wcGVyW3BsYWNlbWVudF0gPiBib3VuZGFyaWVzW3BsYWNlbWVudF0gJiYgIW9wdGlvbnMuZXNjYXBlV2l0aFJlZmVyZW5jZSkge1xyXG4gICAgICAgIHZhbHVlID0gTWF0aC5taW4ocG9wcGVyW21haW5TaWRlXSwgYm91bmRhcmllc1twbGFjZW1lbnRdIC0gKHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyA/IHBvcHBlci53aWR0aCA6IHBvcHBlci5oZWlnaHQpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkkMSh7fSwgbWFpblNpZGUsIHZhbHVlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBvcmRlci5mb3JFYWNoKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcclxuICAgIHZhciBzaWRlID0gWydsZWZ0JywgJ3RvcCddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTEgPyAncHJpbWFyeScgOiAnc2Vjb25kYXJ5JztcclxuICAgIHBvcHBlciA9IF9leHRlbmRzJDEoe30sIHBvcHBlciwgY2hlY2tbc2lkZV0ocGxhY2VtZW50KSk7XHJcbiAgfSk7XHJcblxyXG4gIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBwb3BwZXI7XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIHNoaWZ0KGRhdGEpIHtcclxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQ7XHJcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuICB2YXIgc2hpZnR2YXJpYXRpb24gPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXTtcclxuXHJcbiAgLy8gaWYgc2hpZnQgc2hpZnR2YXJpYXRpb24gaXMgc3BlY2lmaWVkLCBydW4gdGhlIG1vZGlmaWVyXHJcbiAgaWYgKHNoaWZ0dmFyaWF0aW9uKSB7XHJcbiAgICB2YXIgX2RhdGEkb2Zmc2V0cyA9IGRhdGEub2Zmc2V0cyxcclxuICAgICAgICByZWZlcmVuY2UgPSBfZGF0YSRvZmZzZXRzLnJlZmVyZW5jZSxcclxuICAgICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcjtcclxuXHJcbiAgICB2YXIgaXNWZXJ0aWNhbCA9IFsnYm90dG9tJywgJ3RvcCddLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgIT09IC0xO1xyXG4gICAgdmFyIHNpZGUgPSBpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCc7XHJcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBpc1ZlcnRpY2FsID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xyXG5cclxuICAgIHZhciBzaGlmdE9mZnNldHMgPSB7XHJcbiAgICAgIHN0YXJ0OiBkZWZpbmVQcm9wZXJ0eSQxKHt9LCBzaWRlLCByZWZlcmVuY2Vbc2lkZV0pLFxyXG4gICAgICBlbmQ6IGRlZmluZVByb3BlcnR5JDEoe30sIHNpZGUsIHJlZmVyZW5jZVtzaWRlXSArIHJlZmVyZW5jZVttZWFzdXJlbWVudF0gLSBwb3BwZXJbbWVhc3VyZW1lbnRdKVxyXG4gICAgfTtcclxuXHJcbiAgICBkYXRhLm9mZnNldHMucG9wcGVyID0gX2V4dGVuZHMkMSh7fSwgcG9wcGVyLCBzaGlmdE9mZnNldHNbc2hpZnR2YXJpYXRpb25dKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBoaWRlKGRhdGEpIHtcclxuICBpZiAoIWlzTW9kaWZpZXJSZXF1aXJlZChkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgJ2hpZGUnLCAncHJldmVudE92ZXJmbG93JykpIHtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgdmFyIHJlZlJlY3QgPSBkYXRhLm9mZnNldHMucmVmZXJlbmNlO1xyXG4gIHZhciBib3VuZCA9IGZpbmQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsIGZ1bmN0aW9uIChtb2RpZmllcikge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVyLm5hbWUgPT09ICdwcmV2ZW50T3ZlcmZsb3cnO1xyXG4gIH0pLmJvdW5kYXJpZXM7XHJcblxyXG4gIGlmIChyZWZSZWN0LmJvdHRvbSA8IGJvdW5kLnRvcCB8fCByZWZSZWN0LmxlZnQgPiBib3VuZC5yaWdodCB8fCByZWZSZWN0LnRvcCA+IGJvdW5kLmJvdHRvbSB8fCByZWZSZWN0LnJpZ2h0IDwgYm91bmQubGVmdCkge1xyXG4gICAgLy8gQXZvaWQgdW5uZWNlc3NhcnkgRE9NIGFjY2VzcyBpZiB2aXNpYmlsaXR5IGhhc24ndCBjaGFuZ2VkXHJcbiAgICBpZiAoZGF0YS5oaWRlID09PSB0cnVlKSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuaGlkZSA9IHRydWU7XHJcbiAgICBkYXRhLmF0dHJpYnV0ZXNbJ3gtb3V0LW9mLWJvdW5kYXJpZXMnXSA9ICcnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBET00gYWNjZXNzIGlmIHZpc2liaWxpdHkgaGFzbid0IGNoYW5nZWRcclxuICAgIGlmIChkYXRhLmhpZGUgPT09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuaGlkZSA9IGZhbHNlO1xyXG4gICAgZGF0YS5hdHRyaWJ1dGVzWyd4LW91dC1vZi1ib3VuZGFyaWVzJ10gPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIGlubmVyKGRhdGEpIHtcclxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQ7XHJcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuICB2YXIgX2RhdGEkb2Zmc2V0cyA9IGRhdGEub2Zmc2V0cyxcclxuICAgICAgcG9wcGVyID0gX2RhdGEkb2Zmc2V0cy5wb3BwZXIsXHJcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xyXG5cclxuICB2YXIgaXNIb3JpeiA9IFsnbGVmdCcsICdyaWdodCddLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgIT09IC0xO1xyXG5cclxuICB2YXIgc3VidHJhY3RMZW5ndGggPSBbJ3RvcCcsICdsZWZ0J10uaW5kZXhPZihiYXNlUGxhY2VtZW50KSA9PT0gLTE7XHJcblxyXG4gIHBvcHBlcltpc0hvcml6ID8gJ2xlZnQnIDogJ3RvcCddID0gcmVmZXJlbmNlW2Jhc2VQbGFjZW1lbnRdIC0gKHN1YnRyYWN0TGVuZ3RoID8gcG9wcGVyW2lzSG9yaXogPyAnd2lkdGgnIDogJ2hlaWdodCddIDogMCk7XHJcblxyXG4gIGRhdGEucGxhY2VtZW50ID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcclxuICBkYXRhLm9mZnNldHMucG9wcGVyID0gZ2V0Q2xpZW50UmVjdChwb3BwZXIpO1xyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIE1vZGlmaWVyIGZ1bmN0aW9uLCBlYWNoIG1vZGlmaWVyIGNhbiBoYXZlIGEgZnVuY3Rpb24gb2YgdGhpcyB0eXBlIGFzc2lnbmVkXHJcbiAqIHRvIGl0cyBgZm5gIHByb3BlcnR5LjxiciAvPlxyXG4gKiBUaGVzZSBmdW5jdGlvbnMgd2lsbCBiZSBjYWxsZWQgb24gZWFjaCB1cGRhdGUsIHRoaXMgbWVhbnMgdGhhdCB5b3UgbXVzdFxyXG4gKiBtYWtlIHN1cmUgdGhleSBhcmUgcGVyZm9ybWFudCBlbm91Z2ggdG8gYXZvaWQgcGVyZm9ybWFuY2UgYm90dGxlbmVja3MuXHJcbiAqXHJcbiAqIEBmdW5jdGlvbiBNb2RpZmllckZuXHJcbiAqIEBhcmd1bWVudCB7ZGF0YU9iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge2RhdGFPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcblxyXG4vKipcclxuICogTW9kaWZpZXJzIGFyZSBwbHVnaW5zIHVzZWQgdG8gYWx0ZXIgdGhlIGJlaGF2aW9yIG9mIHlvdXIgcG9wcGVycy48YnIgLz5cclxuICogUG9wcGVyLmpzIHVzZXMgYSBzZXQgb2YgOSBtb2RpZmllcnMgdG8gcHJvdmlkZSBhbGwgdGhlIGJhc2ljIGZ1bmN0aW9uYWxpdGllc1xyXG4gKiBuZWVkZWQgYnkgdGhlIGxpYnJhcnkuXHJcbiAqXHJcbiAqIFVzdWFsbHkgeW91IGRvbid0IHdhbnQgdG8gb3ZlcnJpZGUgdGhlIGBvcmRlcmAsIGBmbmAgYW5kIGBvbkxvYWRgIHByb3BzLlxyXG4gKiBBbGwgdGhlIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvbmZpZ3VyYXRpb25zIHRoYXQgY291bGQgYmUgdHdlYWtlZC5cclxuICogQG5hbWVzcGFjZSBtb2RpZmllcnNcclxuICovXHJcbnZhciBtb2RpZmllcnMgPSB7XHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBzaGlmdCB0aGUgcG9wcGVyIG9uIHRoZSBzdGFydCBvciBlbmQgb2YgaXRzIHJlZmVyZW5jZVxyXG4gICAqIGVsZW1lbnQuPGJyIC8+XHJcbiAgICogSXQgd2lsbCByZWFkIHRoZSB2YXJpYXRpb24gb2YgdGhlIGBwbGFjZW1lbnRgIHByb3BlcnR5LjxiciAvPlxyXG4gICAqIEl0IGNhbiBiZSBvbmUgZWl0aGVyIGAtZW5kYCBvciBgLXN0YXJ0YC5cclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgc2hpZnQ6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj0xMDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogMTAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBzaGlmdFxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBgb2Zmc2V0YCBtb2RpZmllciBjYW4gc2hpZnQgeW91ciBwb3BwZXIgb24gYm90aCBpdHMgYXhpcy5cclxuICAgKlxyXG4gICAqIEl0IGFjY2VwdHMgdGhlIGZvbGxvd2luZyB1bml0czpcclxuICAgKiAtIGBweGAgb3IgdW5pdGxlc3MsIGludGVycHJldGVkIGFzIHBpeGVsc1xyXG4gICAqIC0gYCVgIG9yIGAlcmAsIHBlcmNlbnRhZ2UgcmVsYXRpdmUgdG8gdGhlIGxlbmd0aCBvZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnRcclxuICAgKiAtIGAlcGAsIHBlcmNlbnRhZ2UgcmVsYXRpdmUgdG8gdGhlIGxlbmd0aCBvZiB0aGUgcG9wcGVyIGVsZW1lbnRcclxuICAgKiAtIGB2d2AsIENTUyB2aWV3cG9ydCB3aWR0aCB1bml0XHJcbiAgICogLSBgdmhgLCBDU1Mgdmlld3BvcnQgaGVpZ2h0IHVuaXRcclxuICAgKlxyXG4gICAqIEZvciBsZW5ndGggaXMgaW50ZW5kZWQgdGhlIG1haW4gYXhpcyByZWxhdGl2ZSB0byB0aGUgcGxhY2VtZW50IG9mIHRoZSBwb3BwZXIuPGJyIC8+XHJcbiAgICogVGhpcyBtZWFucyB0aGF0IGlmIHRoZSBwbGFjZW1lbnQgaXMgYHRvcGAgb3IgYGJvdHRvbWAsIHRoZSBsZW5ndGggd2lsbCBiZSB0aGVcclxuICAgKiBgd2lkdGhgLiBJbiBjYXNlIG9mIGBsZWZ0YCBvciBgcmlnaHRgLCBpdCB3aWxsIGJlIHRoZSBoZWlnaHQuXHJcbiAgICpcclxuICAgKiBZb3UgY2FuIHByb3ZpZGUgYSBzaW5nbGUgdmFsdWUgKGFzIGBOdW1iZXJgIG9yIGBTdHJpbmdgKSwgb3IgYSBwYWlyIG9mIHZhbHVlc1xyXG4gICAqIGFzIGBTdHJpbmdgIGRpdmlkZWQgYnkgYSBjb21tYSBvciBvbmUgKG9yIG1vcmUpIHdoaXRlIHNwYWNlcy48YnIgLz5cclxuICAgKiBUaGUgbGF0dGVyIGlzIGEgZGVwcmVjYXRlZCBtZXRob2QgYmVjYXVzZSBpdCBsZWFkcyB0byBjb25mdXNpb24gYW5kIHdpbGwgYmVcclxuICAgKiByZW1vdmVkIGluIHYyLjxiciAvPlxyXG4gICAqIEFkZGl0aW9uYWxseSwgaXQgYWNjZXB0cyBhZGRpdGlvbnMgYW5kIHN1YnRyYWN0aW9ucyBiZXR3ZWVuIGRpZmZlcmVudCB1bml0cy5cclxuICAgKiBOb3RlIHRoYXQgbXVsdGlwbGljYXRpb25zIGFuZCBkaXZpc2lvbnMgYXJlbid0IHN1cHBvcnRlZC5cclxuICAgKlxyXG4gICAqIFZhbGlkIGV4YW1wbGVzIGFyZTpcclxuICAgKiBgYGBcclxuICAgKiAxMFxyXG4gICAqICcxMCUnXHJcbiAgICogJzEwLCAxMCdcclxuICAgKiAnMTAlLCAxMCdcclxuICAgKiAnMTAgKyAxMCUnXHJcbiAgICogJzEwIC0gNXZoICsgMyUnXHJcbiAgICogJy0xMHB4ICsgNXZoLCA1cHggLSA2JSdcclxuICAgKiBgYGBcclxuICAgKiA+ICoqTkIqKjogSWYgeW91IGRlc2lyZSB0byBhcHBseSBvZmZzZXRzIHRvIHlvdXIgcG9wcGVycyBpbiBhIHdheSB0aGF0IG1heSBtYWtlIHRoZW0gb3ZlcmxhcFxyXG4gICAqID4gd2l0aCB0aGVpciByZWZlcmVuY2UgZWxlbWVudCwgdW5mb3J0dW5hdGVseSwgeW91IHdpbGwgaGF2ZSB0byBkaXNhYmxlIHRoZSBgZmxpcGAgbW9kaWZpZXIuXHJcbiAgICogPiBNb3JlIG9uIHRoaXMgW3JlYWRpbmcgdGhpcyBpc3N1ZV0oaHR0cHM6Ly9naXRodWIuY29tL0ZlelZyYXN0YS9wb3BwZXIuanMvaXNzdWVzLzM3MylcclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBvZmZzZXQ6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj0yMDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogMjAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBvZmZzZXQsXHJcbiAgICAvKiogQHByb3Age051bWJlcnxTdHJpbmd9IG9mZnNldD0wXHJcbiAgICAgKiBUaGUgb2Zmc2V0IHZhbHVlIGFzIGRlc2NyaWJlZCBpbiB0aGUgbW9kaWZpZXIgZGVzY3JpcHRpb25cclxuICAgICAqL1xyXG4gICAgb2Zmc2V0OiAwXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBwcmV2ZW50IHRoZSBwb3BwZXIgZnJvbSBiZWluZyBwb3NpdGlvbmVkIG91dHNpZGUgdGhlIGJvdW5kYXJ5LlxyXG4gICAqXHJcbiAgICogQW4gc2NlbmFyaW8gZXhpc3RzIHdoZXJlIHRoZSByZWZlcmVuY2UgaXRzZWxmIGlzIG5vdCB3aXRoaW4gdGhlIGJvdW5kYXJpZXMuPGJyIC8+XHJcbiAgICogV2UgY2FuIHNheSBpdCBoYXMgXCJlc2NhcGVkIHRoZSBib3VuZGFyaWVzXCIg4oCUIG9yIGp1c3QgXCJlc2NhcGVkXCIuPGJyIC8+XHJcbiAgICogSW4gdGhpcyBjYXNlIHdlIG5lZWQgdG8gZGVjaWRlIHdoZXRoZXIgdGhlIHBvcHBlciBzaG91bGQgZWl0aGVyOlxyXG4gICAqXHJcbiAgICogLSBkZXRhY2ggZnJvbSB0aGUgcmVmZXJlbmNlIGFuZCByZW1haW4gXCJ0cmFwcGVkXCIgaW4gdGhlIGJvdW5kYXJpZXMsIG9yXHJcbiAgICogLSBpZiBpdCBzaG91bGQgaWdub3JlIHRoZSBib3VuZGFyeSBhbmQgXCJlc2NhcGUgd2l0aCBpdHMgcmVmZXJlbmNlXCJcclxuICAgKlxyXG4gICAqIFdoZW4gYGVzY2FwZVdpdGhSZWZlcmVuY2VgIGlzIHNldCB0b2B0cnVlYCBhbmQgcmVmZXJlbmNlIGlzIGNvbXBsZXRlbHlcclxuICAgKiBvdXRzaWRlIGl0cyBib3VuZGFyaWVzLCB0aGUgcG9wcGVyIHdpbGwgb3ZlcmZsb3cgKG9yIGNvbXBsZXRlbHkgbGVhdmUpXHJcbiAgICogdGhlIGJvdW5kYXJpZXMgaW4gb3JkZXIgdG8gcmVtYWluIGF0dGFjaGVkIHRvIHRoZSBlZGdlIG9mIHRoZSByZWZlcmVuY2UuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgcHJldmVudE92ZXJmbG93OiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9MzAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDMwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogcHJldmVudE92ZXJmbG93LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7QXJyYXl9IFtwcmlvcml0eT1bJ2xlZnQnLCdyaWdodCcsJ3RvcCcsJ2JvdHRvbSddXVxyXG4gICAgICogUG9wcGVyIHdpbGwgdHJ5IHRvIHByZXZlbnQgb3ZlcmZsb3cgZm9sbG93aW5nIHRoZXNlIHByaW9yaXRpZXMgYnkgZGVmYXVsdCxcclxuICAgICAqIHRoZW4sIGl0IGNvdWxkIG92ZXJmbG93IG9uIHRoZSBsZWZ0IGFuZCBvbiB0b3Agb2YgdGhlIGBib3VuZGFyaWVzRWxlbWVudGBcclxuICAgICAqL1xyXG4gICAgcHJpb3JpdHk6IFsnbGVmdCcsICdyaWdodCcsICd0b3AnLCAnYm90dG9tJ10sXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtudW1iZXJ9IHBhZGRpbmc9NVxyXG4gICAgICogQW1vdW50IG9mIHBpeGVsIHVzZWQgdG8gZGVmaW5lIGEgbWluaW11bSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBib3VuZGFyaWVzXHJcbiAgICAgKiBhbmQgdGhlIHBvcHBlciB0aGlzIG1ha2VzIHN1cmUgdGhlIHBvcHBlciBoYXMgYWx3YXlzIGEgbGl0dGxlIHBhZGRpbmdcclxuICAgICAqIGJldHdlZW4gdGhlIGVkZ2VzIG9mIGl0cyBjb250YWluZXJcclxuICAgICAqL1xyXG4gICAgcGFkZGluZzogNSxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age1N0cmluZ3xIVE1MRWxlbWVudH0gYm91bmRhcmllc0VsZW1lbnQ9J3Njcm9sbFBhcmVudCdcclxuICAgICAqIEJvdW5kYXJpZXMgdXNlZCBieSB0aGUgbW9kaWZpZXIsIGNhbiBiZSBgc2Nyb2xsUGFyZW50YCwgYHdpbmRvd2AsXHJcbiAgICAgKiBgdmlld3BvcnRgIG9yIGFueSBET00gZWxlbWVudC5cclxuICAgICAqL1xyXG4gICAgYm91bmRhcmllc0VsZW1lbnQ6ICdzY3JvbGxQYXJlbnQnXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBtYWtlIHN1cmUgdGhlIHJlZmVyZW5jZSBhbmQgaXRzIHBvcHBlciBzdGF5IG5lYXIgZWFjaG90aGVyc1xyXG4gICAqIHdpdGhvdXQgbGVhdmluZyBhbnkgZ2FwIGJldHdlZW4gdGhlIHR3by4gRXhwZWNpYWxseSB1c2VmdWwgd2hlbiB0aGUgYXJyb3cgaXNcclxuICAgKiBlbmFibGVkIGFuZCB5b3Ugd2FudCB0byBhc3N1cmUgaXQgdG8gcG9pbnQgdG8gaXRzIHJlZmVyZW5jZSBlbGVtZW50LlxyXG4gICAqIEl0IGNhcmVzIG9ubHkgYWJvdXQgdGhlIGZpcnN0IGF4aXMsIHlvdSBjYW4gc3RpbGwgaGF2ZSBwb3BwZXJzIHdpdGggbWFyZ2luXHJcbiAgICogYmV0d2VlbiB0aGUgcG9wcGVyIGFuZCBpdHMgcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGtlZXBUb2dldGhlcjoge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTQwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA0MDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGtlZXBUb2dldGhlclxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFRoaXMgbW9kaWZpZXIgaXMgdXNlZCB0byBtb3ZlIHRoZSBgYXJyb3dFbGVtZW50YCBvZiB0aGUgcG9wcGVyIHRvIG1ha2VcclxuICAgKiBzdXJlIGl0IGlzIHBvc2l0aW9uZWQgYmV0d2VlbiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgYW5kIGl0cyBwb3BwZXIgZWxlbWVudC5cclxuICAgKiBJdCB3aWxsIHJlYWQgdGhlIG91dGVyIHNpemUgb2YgdGhlIGBhcnJvd0VsZW1lbnRgIG5vZGUgdG8gZGV0ZWN0IGhvdyBtYW55XHJcbiAgICogcGl4ZWxzIG9mIGNvbmp1Y3Rpb24gYXJlIG5lZWRlZC5cclxuICAgKlxyXG4gICAqIEl0IGhhcyBubyBlZmZlY3QgaWYgbm8gYGFycm93RWxlbWVudGAgaXMgcHJvdmlkZWQuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGFycm93OiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9NTAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDUwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogYXJyb3csXHJcbiAgICAvKiogQHByb3Age1N0cmluZ3xIVE1MRWxlbWVudH0gZWxlbWVudD0nW3gtYXJyb3ddJyAtIFNlbGVjdG9yIG9yIG5vZGUgdXNlZCBhcyBhcnJvdyAqL1xyXG4gICAgZWxlbWVudDogJ1t4LWFycm93XSdcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBNb2RpZmllciB1c2VkIHRvIGZsaXAgdGhlIHBvcHBlcidzIHBsYWNlbWVudCB3aGVuIGl0IHN0YXJ0cyB0byBvdmVybGFwIGl0c1xyXG4gICAqIHJlZmVyZW5jZSBlbGVtZW50LlxyXG4gICAqXHJcbiAgICogUmVxdWlyZXMgdGhlIGBwcmV2ZW50T3ZlcmZsb3dgIG1vZGlmaWVyIGJlZm9yZSBpdCBpbiBvcmRlciB0byB3b3JrLlxyXG4gICAqXHJcbiAgICogKipOT1RFOioqIHRoaXMgbW9kaWZpZXIgd2lsbCBpbnRlcnJ1cHQgdGhlIGN1cnJlbnQgdXBkYXRlIGN5Y2xlIGFuZCB3aWxsXHJcbiAgICogcmVzdGFydCBpdCBpZiBpdCBkZXRlY3RzIHRoZSBuZWVkIHRvIGZsaXAgdGhlIHBsYWNlbWVudC5cclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgZmxpcDoge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTYwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA2MDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGZsaXAsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtTdHJpbmd8QXJyYXl9IGJlaGF2aW9yPSdmbGlwJ1xyXG4gICAgICogVGhlIGJlaGF2aW9yIHVzZWQgdG8gY2hhbmdlIHRoZSBwb3BwZXIncyBwbGFjZW1lbnQuIEl0IGNhbiBiZSBvbmUgb2ZcclxuICAgICAqIGBmbGlwYCwgYGNsb2Nrd2lzZWAsIGBjb3VudGVyY2xvY2t3aXNlYCBvciBhbiBhcnJheSB3aXRoIGEgbGlzdCBvZiB2YWxpZFxyXG4gICAgICogcGxhY2VtZW50cyAod2l0aCBvcHRpb25hbCB2YXJpYXRpb25zKS5cclxuICAgICAqL1xyXG4gICAgYmVoYXZpb3I6ICdmbGlwJyxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age251bWJlcn0gcGFkZGluZz01XHJcbiAgICAgKiBUaGUgcG9wcGVyIHdpbGwgZmxpcCBpZiBpdCBoaXRzIHRoZSBlZGdlcyBvZiB0aGUgYGJvdW5kYXJpZXNFbGVtZW50YFxyXG4gICAgICovXHJcbiAgICBwYWRkaW5nOiA1LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7U3RyaW5nfEhUTUxFbGVtZW50fSBib3VuZGFyaWVzRWxlbWVudD0ndmlld3BvcnQnXHJcbiAgICAgKiBUaGUgZWxlbWVudCB3aGljaCB3aWxsIGRlZmluZSB0aGUgYm91bmRhcmllcyBvZiB0aGUgcG9wcGVyIHBvc2l0aW9uLFxyXG4gICAgICogdGhlIHBvcHBlciB3aWxsIG5ldmVyIGJlIHBsYWNlZCBvdXRzaWRlIG9mIHRoZSBkZWZpbmVkIGJvdW5kYXJpZXNcclxuICAgICAqIChleGNlcHQgaWYga2VlcFRvZ2V0aGVyIGlzIGVuYWJsZWQpXHJcbiAgICAgKi9cclxuICAgIGJvdW5kYXJpZXNFbGVtZW50OiAndmlld3BvcnQnXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBtYWtlIHRoZSBwb3BwZXIgZmxvdyB0b3dhcmQgdGhlIGlubmVyIG9mIHRoZSByZWZlcmVuY2UgZWxlbWVudC5cclxuICAgKiBCeSBkZWZhdWx0LCB3aGVuIHRoaXMgbW9kaWZpZXIgaXMgZGlzYWJsZWQsIHRoZSBwb3BwZXIgd2lsbCBiZSBwbGFjZWQgb3V0c2lkZVxyXG4gICAqIHRoZSByZWZlcmVuY2UgZWxlbWVudC5cclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgaW5uZXI6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj03MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogNzAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPWZhbHNlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IGZhbHNlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGlubmVyXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBoaWRlIHRoZSBwb3BwZXIgd2hlbiBpdHMgcmVmZXJlbmNlIGVsZW1lbnQgaXMgb3V0c2lkZSBvZiB0aGVcclxuICAgKiBwb3BwZXIgYm91bmRhcmllcy4gSXQgd2lsbCBzZXQgYSBgeC1vdXQtb2YtYm91bmRhcmllc2AgYXR0cmlidXRlIHdoaWNoIGNhblxyXG4gICAqIGJlIHVzZWQgdG8gaGlkZSB3aXRoIGEgQ1NTIHNlbGVjdG9yIHRoZSBwb3BwZXIgd2hlbiBpdHMgcmVmZXJlbmNlIGlzXHJcbiAgICogb3V0IG9mIGJvdW5kYXJpZXMuXHJcbiAgICpcclxuICAgKiBSZXF1aXJlcyB0aGUgYHByZXZlbnRPdmVyZmxvd2AgbW9kaWZpZXIgYmVmb3JlIGl0IGluIG9yZGVyIHRvIHdvcmsuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGhpZGU6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj04MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogODAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBoaWRlXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ29tcHV0ZXMgdGhlIHN0eWxlIHRoYXQgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIgZWxlbWVudCB0byBnZXRzXHJcbiAgICogcHJvcGVybHkgcG9zaXRpb25lZC5cclxuICAgKlxyXG4gICAqIE5vdGUgdGhhdCB0aGlzIG1vZGlmaWVyIHdpbGwgbm90IHRvdWNoIHRoZSBET00sIGl0IGp1c3QgcHJlcGFyZXMgdGhlIHN0eWxlc1xyXG4gICAqIHNvIHRoYXQgYGFwcGx5U3R5bGVgIG1vZGlmaWVyIGNhbiBhcHBseSBpdC4gVGhpcyBzZXBhcmF0aW9uIGlzIHVzZWZ1bFxyXG4gICAqIGluIGNhc2UgeW91IG5lZWQgdG8gcmVwbGFjZSBgYXBwbHlTdHlsZWAgd2l0aCBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvbi5cclxuICAgKlxyXG4gICAqIFRoaXMgbW9kaWZpZXIgaGFzIGA4NTBgIGFzIGBvcmRlcmAgdmFsdWUgdG8gbWFpbnRhaW4gYmFja3dhcmQgY29tcGF0aWJpbGl0eVxyXG4gICAqIHdpdGggcHJldmlvdXMgdmVyc2lvbnMgb2YgUG9wcGVyLmpzLiBFeHBlY3QgdGhlIG1vZGlmaWVycyBvcmRlcmluZyBtZXRob2RcclxuICAgKiB0byBjaGFuZ2UgaW4gZnV0dXJlIG1ham9yIHZlcnNpb25zIG9mIHRoZSBsaWJyYXJ5LlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGNvbXB1dGVTdHlsZToge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTg1MCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA4NTAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGNvbXB1dGVTdHlsZSxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age0Jvb2xlYW59IGdwdUFjY2VsZXJhdGlvbj10cnVlXHJcbiAgICAgKiBJZiB0cnVlLCBpdCB1c2VzIHRoZSBDU1MgM2QgdHJhbnNmb3JtYXRpb24gdG8gcG9zaXRpb24gdGhlIHBvcHBlci5cclxuICAgICAqIE90aGVyd2lzZSwgaXQgd2lsbCB1c2UgdGhlIGB0b3BgIGFuZCBgbGVmdGAgcHJvcGVydGllcy5cclxuICAgICAqL1xyXG4gICAgZ3B1QWNjZWxlcmF0aW9uOiB0cnVlLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7c3RyaW5nfSBbeD0nYm90dG9tJ11cclxuICAgICAqIFdoZXJlIHRvIGFuY2hvciB0aGUgWCBheGlzIChgYm90dG9tYCBvciBgdG9wYCkuIEFLQSBYIG9mZnNldCBvcmlnaW4uXHJcbiAgICAgKiBDaGFuZ2UgdGhpcyBpZiB5b3VyIHBvcHBlciBzaG91bGQgZ3JvdyBpbiBhIGRpcmVjdGlvbiBkaWZmZXJlbnQgZnJvbSBgYm90dG9tYFxyXG4gICAgICovXHJcbiAgICB4OiAnYm90dG9tJyxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age3N0cmluZ30gW3g9J2xlZnQnXVxyXG4gICAgICogV2hlcmUgdG8gYW5jaG9yIHRoZSBZIGF4aXMgKGBsZWZ0YCBvciBgcmlnaHRgKS4gQUtBIFkgb2Zmc2V0IG9yaWdpbi5cclxuICAgICAqIENoYW5nZSB0aGlzIGlmIHlvdXIgcG9wcGVyIHNob3VsZCBncm93IGluIGEgZGlyZWN0aW9uIGRpZmZlcmVudCBmcm9tIGByaWdodGBcclxuICAgICAqL1xyXG4gICAgeTogJ3JpZ2h0J1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEFwcGxpZXMgdGhlIGNvbXB1dGVkIHN0eWxlcyB0byB0aGUgcG9wcGVyIGVsZW1lbnQuXHJcbiAgICpcclxuICAgKiBBbGwgdGhlIERPTSBtYW5pcHVsYXRpb25zIGFyZSBsaW1pdGVkIHRvIHRoaXMgbW9kaWZpZXIuIFRoaXMgaXMgdXNlZnVsIGluIGNhc2VcclxuICAgKiB5b3Ugd2FudCB0byBpbnRlZ3JhdGUgUG9wcGVyLmpzIGluc2lkZSBhIGZyYW1ld29yayBvciB2aWV3IGxpYnJhcnkgYW5kIHlvdVxyXG4gICAqIHdhbnQgdG8gZGVsZWdhdGUgYWxsIHRoZSBET00gbWFuaXB1bGF0aW9ucyB0byBpdC5cclxuICAgKlxyXG4gICAqIE5vdGUgdGhhdCBpZiB5b3UgZGlzYWJsZSB0aGlzIG1vZGlmaWVyLCB5b3UgbXVzdCBtYWtlIHN1cmUgdGhlIHBvcHBlciBlbGVtZW50XHJcbiAgICogaGFzIGl0cyBwb3NpdGlvbiBzZXQgdG8gYGFic29sdXRlYCBiZWZvcmUgUG9wcGVyLmpzIGNhbiBkbyBpdHMgd29yayFcclxuICAgKlxyXG4gICAqIEp1c3QgZGlzYWJsZSB0aGlzIG1vZGlmaWVyIGFuZCBkZWZpbmUgeW91IG93biB0byBhY2hpZXZlIHRoZSBkZXNpcmVkIGVmZmVjdC5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBhcHBseVN0eWxlOiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9OTAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDkwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogYXBwbHlTdHlsZSxcclxuICAgIC8qKiBAcHJvcCB7RnVuY3Rpb259ICovXHJcbiAgICBvbkxvYWQ6IGFwcGx5U3R5bGVPbkxvYWQsXHJcbiAgICAvKipcclxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMS4xMC4wLCB0aGUgcHJvcGVydHkgbW92ZWQgdG8gYGNvbXB1dGVTdHlsZWAgbW9kaWZpZXJcclxuICAgICAqIEBwcm9wIHtCb29sZWFufSBncHVBY2NlbGVyYXRpb249dHJ1ZVxyXG4gICAgICogSWYgdHJ1ZSwgaXQgdXNlcyB0aGUgQ1NTIDNkIHRyYW5zZm9ybWF0aW9uIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXIuXHJcbiAgICAgKiBPdGhlcndpc2UsIGl0IHdpbGwgdXNlIHRoZSBgdG9wYCBhbmQgYGxlZnRgIHByb3BlcnRpZXMuXHJcbiAgICAgKi9cclxuICAgIGdwdUFjY2VsZXJhdGlvbjogdW5kZWZpbmVkXHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBgZGF0YU9iamVjdGAgaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBpbmZvcm1hdGlvbnMgdXNlZCBieSBQb3BwZXIuanNcclxuICogdGhpcyBvYmplY3QgZ2V0IHBhc3NlZCB0byBtb2RpZmllcnMgYW5kIHRvIHRoZSBgb25DcmVhdGVgIGFuZCBgb25VcGRhdGVgIGNhbGxiYWNrcy5cclxuICogQG5hbWUgZGF0YU9iamVjdFxyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5pbnN0YW5jZSBUaGUgUG9wcGVyLmpzIGluc3RhbmNlXHJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBkYXRhLnBsYWNlbWVudCBQbGFjZW1lbnQgYXBwbGllZCB0byBwb3BwZXJcclxuICogQHByb3BlcnR5IHtTdHJpbmd9IGRhdGEub3JpZ2luYWxQbGFjZW1lbnQgUGxhY2VtZW50IG9yaWdpbmFsbHkgZGVmaW5lZCBvbiBpbml0XHJcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGF0YS5mbGlwcGVkIFRydWUgaWYgcG9wcGVyIGhhcyBiZWVuIGZsaXBwZWQgYnkgZmxpcCBtb2RpZmllclxyXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IGRhdGEuaGlkZSBUcnVlIGlmIHRoZSByZWZlcmVuY2UgZWxlbWVudCBpcyBvdXQgb2YgYm91bmRhcmllcywgdXNlZnVsIHRvIGtub3cgd2hlbiB0byBoaWRlIHRoZSBwb3BwZXIuXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGRhdGEuYXJyb3dFbGVtZW50IE5vZGUgdXNlZCBhcyBhcnJvdyBieSBhcnJvdyBtb2RpZmllclxyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5zdHlsZXMgQW55IENTUyBwcm9wZXJ0eSBkZWZpbmVkIGhlcmUgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIsIGl0IGV4cGVjdHMgdGhlIEphdmFTY3JpcHQgbm9tZW5jbGF0dXJlIChlZy4gYG1hcmdpbkJvdHRvbWApXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLmFycm93U3R5bGVzIEFueSBDU1MgcHJvcGVydHkgZGVmaW5lZCBoZXJlIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyIGFycm93LCBpdCBleHBlY3RzIHRoZSBKYXZhU2NyaXB0IG5vbWVuY2xhdHVyZSAoZWcuIGBtYXJnaW5Cb3R0b21gKVxyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5ib3VuZGFyaWVzIE9mZnNldHMgb2YgdGhlIHBvcHBlciBib3VuZGFyaWVzXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLm9mZnNldHMgVGhlIG1lYXN1cmVtZW50cyBvZiBwb3BwZXIsIHJlZmVyZW5jZSBhbmQgYXJyb3cgZWxlbWVudHMuXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLm9mZnNldHMucG9wcGVyIGB0b3BgLCBgbGVmdGAsIGB3aWR0aGAsIGBoZWlnaHRgIHZhbHVlc1xyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSBgdG9wYCwgYGxlZnRgLCBgd2lkdGhgLCBgaGVpZ2h0YCB2YWx1ZXNcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEub2Zmc2V0cy5hcnJvd10gYHRvcGAgYW5kIGBsZWZ0YCBvZmZzZXRzLCBvbmx5IG9uZSBvZiB0aGVtIHdpbGwgYmUgZGlmZmVyZW50IGZyb20gMFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBEZWZhdWx0IG9wdGlvbnMgcHJvdmlkZWQgdG8gUG9wcGVyLmpzIGNvbnN0cnVjdG9yLjxiciAvPlxyXG4gKiBUaGVzZSBjYW4gYmUgb3ZlcnJpZGVuIHVzaW5nIHRoZSBgb3B0aW9uc2AgYXJndW1lbnQgb2YgUG9wcGVyLmpzLjxiciAvPlxyXG4gKiBUbyBvdmVycmlkZSBhbiBvcHRpb24sIHNpbXBseSBwYXNzIGFzIDNyZCBhcmd1bWVudCBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZVxyXG4gKiBzdHJ1Y3R1cmUgb2YgdGhpcyBvYmplY3QsIGV4YW1wbGU6XHJcbiAqIGBgYFxyXG4gKiBuZXcgUG9wcGVyKHJlZiwgcG9wLCB7XHJcbiAqICAgbW9kaWZpZXJzOiB7XHJcbiAqICAgICBwcmV2ZW50T3ZlcmZsb3c6IHsgZW5hYmxlZDogZmFsc2UgfVxyXG4gKiAgIH1cclxuICogfSlcclxuICogYGBgXHJcbiAqIEB0eXBlIHtPYmplY3R9XHJcbiAqIEBzdGF0aWNcclxuICogQG1lbWJlcm9mIFBvcHBlclxyXG4gKi9cclxudmFyIERlZmF1bHRzID0ge1xyXG4gIC8qKlxyXG4gICAqIFBvcHBlcidzIHBsYWNlbWVudFxyXG4gICAqIEBwcm9wIHtQb3BwZXIucGxhY2VtZW50c30gcGxhY2VtZW50PSdib3R0b20nXHJcbiAgICovXHJcbiAgcGxhY2VtZW50OiAnYm90dG9tJyxcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoaXMgdG8gdHJ1ZSBpZiB5b3Ugd2FudCBwb3BwZXIgdG8gcG9zaXRpb24gaXQgc2VsZiBpbiAnZml4ZWQnIG1vZGVcclxuICAgKiBAcHJvcCB7Qm9vbGVhbn0gcG9zaXRpb25GaXhlZD1mYWxzZVxyXG4gICAqL1xyXG4gIHBvc2l0aW9uRml4ZWQ6IGZhbHNlLFxyXG5cclxuICAvKipcclxuICAgKiBXaGV0aGVyIGV2ZW50cyAocmVzaXplLCBzY3JvbGwpIGFyZSBpbml0aWFsbHkgZW5hYmxlZFxyXG4gICAqIEBwcm9wIHtCb29sZWFufSBldmVudHNFbmFibGVkPXRydWVcclxuICAgKi9cclxuICBldmVudHNFbmFibGVkOiB0cnVlLFxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdG8gdHJ1ZSBpZiB5b3Ugd2FudCB0byBhdXRvbWF0aWNhbGx5IHJlbW92ZSB0aGUgcG9wcGVyIHdoZW5cclxuICAgKiB5b3UgY2FsbCB0aGUgYGRlc3Ryb3lgIG1ldGhvZC5cclxuICAgKiBAcHJvcCB7Qm9vbGVhbn0gcmVtb3ZlT25EZXN0cm95PWZhbHNlXHJcbiAgICovXHJcbiAgcmVtb3ZlT25EZXN0cm95OiBmYWxzZSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHBvcHBlciBpcyBjcmVhdGVkLjxiciAvPlxyXG4gICAqIEJ5IGRlZmF1bHQsIGlzIHNldCB0byBuby1vcC48YnIgLz5cclxuICAgKiBBY2Nlc3MgUG9wcGVyLmpzIGluc3RhbmNlIHdpdGggYGRhdGEuaW5zdGFuY2VgLlxyXG4gICAqIEBwcm9wIHtvbkNyZWF0ZX1cclxuICAgKi9cclxuICBvbkNyZWF0ZTogZnVuY3Rpb24gb25DcmVhdGUoKSB7fSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHBvcHBlciBpcyB1cGRhdGVkLCB0aGlzIGNhbGxiYWNrIGlzIG5vdCBjYWxsZWRcclxuICAgKiBvbiB0aGUgaW5pdGlhbGl6YXRpb24vY3JlYXRpb24gb2YgdGhlIHBvcHBlciwgYnV0IG9ubHkgb24gc3Vic2VxdWVudFxyXG4gICAqIHVwZGF0ZXMuPGJyIC8+XHJcbiAgICogQnkgZGVmYXVsdCwgaXMgc2V0IHRvIG5vLW9wLjxiciAvPlxyXG4gICAqIEFjY2VzcyBQb3BwZXIuanMgaW5zdGFuY2Ugd2l0aCBgZGF0YS5pbnN0YW5jZWAuXHJcbiAgICogQHByb3Age29uVXBkYXRlfVxyXG4gICAqL1xyXG4gIG9uVXBkYXRlOiBmdW5jdGlvbiBvblVwZGF0ZSgpIHt9LFxyXG5cclxuICAvKipcclxuICAgKiBMaXN0IG9mIG1vZGlmaWVycyB1c2VkIHRvIG1vZGlmeSB0aGUgb2Zmc2V0cyBiZWZvcmUgdGhleSBhcmUgYXBwbGllZCB0byB0aGUgcG9wcGVyLlxyXG4gICAqIFRoZXkgcHJvdmlkZSBtb3N0IG9mIHRoZSBmdW5jdGlvbmFsaXRpZXMgb2YgUG9wcGVyLmpzXHJcbiAgICogQHByb3Age21vZGlmaWVyc31cclxuICAgKi9cclxuICBtb2RpZmllcnM6IG1vZGlmaWVyc1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBjYWxsYmFjayBvbkNyZWF0ZVxyXG4gKiBAcGFyYW0ge2RhdGFPYmplY3R9IGRhdGFcclxuICovXHJcblxyXG4vKipcclxuICogQGNhbGxiYWNrIG9uVXBkYXRlXHJcbiAqIEBwYXJhbSB7ZGF0YU9iamVjdH0gZGF0YVxyXG4gKi9cclxuXHJcbi8vIFV0aWxzXHJcbi8vIE1ldGhvZHNcclxudmFyIFBvcHBlciA9IGZ1bmN0aW9uICgpIHtcclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgUG9wcGVyLmpzIGluc3RhbmNlXHJcbiAgICogQGNsYXNzIFBvcHBlclxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8cmVmZXJlbmNlT2JqZWN0fSByZWZlcmVuY2UgLSBUaGUgcmVmZXJlbmNlIGVsZW1lbnQgdXNlZCB0byBwb3NpdGlvbiB0aGUgcG9wcGVyXHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcG9wcGVyIC0gVGhlIEhUTUwgZWxlbWVudCB1c2VkIGFzIHBvcHBlci5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFlvdXIgY3VzdG9tIG9wdGlvbnMgdG8gb3ZlcnJpZGUgdGhlIG9uZXMgZGVmaW5lZCBpbiBbRGVmYXVsdHNdKCNkZWZhdWx0cylcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGluc3RhbmNlIC0gVGhlIGdlbmVyYXRlZCBQb3BwZXIuanMgaW5zdGFuY2VcclxuICAgKi9cclxuICBmdW5jdGlvbiBQb3BwZXIocmVmZXJlbmNlLCBwb3BwZXIpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xyXG4gICAgY2xhc3NDYWxsQ2hlY2skMSh0aGlzLCBQb3BwZXIpO1xyXG5cclxuICAgIHRoaXMuc2NoZWR1bGVVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoX3RoaXMudXBkYXRlKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gbWFrZSB1cGRhdGUoKSBkZWJvdW5jZWQsIHNvIHRoYXQgaXQgb25seSBydW5zIGF0IG1vc3Qgb25jZS1wZXItdGlja1xyXG4gICAgdGhpcy51cGRhdGUgPSBkZWJvdW5jZSh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAvLyB3aXRoIHt9IHdlIGNyZWF0ZSBhIG5ldyBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBpbnNpZGUgaXRcclxuICAgIHRoaXMub3B0aW9ucyA9IF9leHRlbmRzJDEoe30sIFBvcHBlci5EZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgLy8gaW5pdCBzdGF0ZVxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgaXNEZXN0cm95ZWQ6IGZhbHNlLFxyXG4gICAgICBpc0NyZWF0ZWQ6IGZhbHNlLFxyXG4gICAgICBzY3JvbGxQYXJlbnRzOiBbXVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBnZXQgcmVmZXJlbmNlIGFuZCBwb3BwZXIgZWxlbWVudHMgKGFsbG93IGpRdWVyeSB3cmFwcGVycylcclxuICAgIHRoaXMucmVmZXJlbmNlID0gcmVmZXJlbmNlICYmIHJlZmVyZW5jZS5qcXVlcnkgPyByZWZlcmVuY2VbMF0gOiByZWZlcmVuY2U7XHJcbiAgICB0aGlzLnBvcHBlciA9IHBvcHBlciAmJiBwb3BwZXIuanF1ZXJ5ID8gcG9wcGVyWzBdIDogcG9wcGVyO1xyXG5cclxuICAgIC8vIERlZXAgbWVyZ2UgbW9kaWZpZXJzIG9wdGlvbnNcclxuICAgIHRoaXMub3B0aW9ucy5tb2RpZmllcnMgPSB7fTtcclxuICAgIE9iamVjdC5rZXlzKF9leHRlbmRzJDEoe30sIFBvcHBlci5EZWZhdWx0cy5tb2RpZmllcnMsIG9wdGlvbnMubW9kaWZpZXJzKSkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICBfdGhpcy5vcHRpb25zLm1vZGlmaWVyc1tuYW1lXSA9IF9leHRlbmRzJDEoe30sIFBvcHBlci5EZWZhdWx0cy5tb2RpZmllcnNbbmFtZV0gfHwge30sIG9wdGlvbnMubW9kaWZpZXJzID8gb3B0aW9ucy5tb2RpZmllcnNbbmFtZV0gOiB7fSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBSZWZhY3RvcmluZyBtb2RpZmllcnMnIGxpc3QgKE9iamVjdCA9PiBBcnJheSlcclxuICAgIHRoaXMubW9kaWZpZXJzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLm1vZGlmaWVycykubWFwKGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgIHJldHVybiBfZXh0ZW5kcyQxKHtcclxuICAgICAgICBuYW1lOiBuYW1lXHJcbiAgICAgIH0sIF90aGlzLm9wdGlvbnMubW9kaWZpZXJzW25hbWVdKTtcclxuICAgIH0pXHJcbiAgICAvLyBzb3J0IHRoZSBtb2RpZmllcnMgYnkgb3JkZXJcclxuICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHJldHVybiBhLm9yZGVyIC0gYi5vcmRlcjtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIG1vZGlmaWVycyBoYXZlIHRoZSBhYmlsaXR5IHRvIGV4ZWN1dGUgYXJiaXRyYXJ5IGNvZGUgd2hlbiBQb3BwZXIuanMgZ2V0IGluaXRlZFxyXG4gICAgLy8gc3VjaCBjb2RlIGlzIGV4ZWN1dGVkIGluIHRoZSBzYW1lIG9yZGVyIG9mIGl0cyBtb2RpZmllclxyXG4gICAgLy8gdGhleSBjb3VsZCBhZGQgbmV3IHByb3BlcnRpZXMgdG8gdGhlaXIgb3B0aW9ucyBjb25maWd1cmF0aW9uXHJcbiAgICAvLyBCRSBBV0FSRTogZG9uJ3QgYWRkIG9wdGlvbnMgdG8gYG9wdGlvbnMubW9kaWZpZXJzLm5hbWVgIGJ1dCB0byBgbW9kaWZpZXJPcHRpb25zYCFcclxuICAgIHRoaXMubW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyT3B0aW9ucykge1xyXG4gICAgICBpZiAobW9kaWZpZXJPcHRpb25zLmVuYWJsZWQgJiYgaXNGdW5jdGlvbihtb2RpZmllck9wdGlvbnMub25Mb2FkKSkge1xyXG4gICAgICAgIG1vZGlmaWVyT3B0aW9ucy5vbkxvYWQoX3RoaXMucmVmZXJlbmNlLCBfdGhpcy5wb3BwZXIsIF90aGlzLm9wdGlvbnMsIG1vZGlmaWVyT3B0aW9ucywgX3RoaXMuc3RhdGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBmaXJlIHRoZSBmaXJzdCB1cGRhdGUgdG8gcG9zaXRpb24gdGhlIHBvcHBlciBpbiB0aGUgcmlnaHQgcGxhY2VcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgdmFyIGV2ZW50c0VuYWJsZWQgPSB0aGlzLm9wdGlvbnMuZXZlbnRzRW5hYmxlZDtcclxuICAgIGlmIChldmVudHNFbmFibGVkKSB7XHJcbiAgICAgIC8vIHNldHVwIGV2ZW50IGxpc3RlbmVycywgdGhleSB3aWxsIHRha2UgY2FyZSBvZiB1cGRhdGUgdGhlIHBvc2l0aW9uIGluIHNwZWNpZmljIHNpdHVhdGlvbnNcclxuICAgICAgdGhpcy5lbmFibGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RhdGUuZXZlbnRzRW5hYmxlZCA9IGV2ZW50c0VuYWJsZWQ7XHJcbiAgfVxyXG5cclxuICAvLyBXZSBjYW4ndCB1c2UgY2xhc3MgcHJvcGVydGllcyBiZWNhdXNlIHRoZXkgZG9uJ3QgZ2V0IGxpc3RlZCBpbiB0aGVcclxuICAvLyBjbGFzcyBwcm90b3R5cGUgYW5kIGJyZWFrIHN0dWZmIGxpa2UgU2lub24gc3R1YnNcclxuXHJcblxyXG4gIGNyZWF0ZUNsYXNzJDEoUG9wcGVyLCBbe1xyXG4gICAga2V5OiAndXBkYXRlJyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUkJDEoKSB7XHJcbiAgICAgIHJldHVybiB1cGRhdGUuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuICB9LCB7XHJcbiAgICBrZXk6ICdkZXN0cm95JyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95JCQxKCkge1xyXG4gICAgICByZXR1cm4gZGVzdHJveS5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG4gIH0sIHtcclxuICAgIGtleTogJ2VuYWJsZUV2ZW50TGlzdGVuZXJzJyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmFibGVFdmVudExpc3RlbmVycyQkMSgpIHtcclxuICAgICAgcmV0dXJuIGVuYWJsZUV2ZW50TGlzdGVuZXJzLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcbiAgfSwge1xyXG4gICAga2V5OiAnZGlzYWJsZUV2ZW50TGlzdGVuZXJzJyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlRXZlbnRMaXN0ZW5lcnMkJDEoKSB7XHJcbiAgICAgIHJldHVybiBkaXNhYmxlRXZlbnRMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNjaGVkdWxlIGFuIHVwZGF0ZSwgaXQgd2lsbCBydW4gb24gdGhlIG5leHQgVUkgdXBkYXRlIGF2YWlsYWJsZVxyXG4gICAgICogQG1ldGhvZCBzY2hlZHVsZVVwZGF0ZVxyXG4gICAgICogQG1lbWJlcm9mIFBvcHBlclxyXG4gICAgICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb2xsZWN0aW9uIG9mIHV0aWxpdGllcyB1c2VmdWwgd2hlbiB3cml0aW5nIGN1c3RvbSBtb2RpZmllcnMuXHJcbiAgICAgKiBTdGFydGluZyBmcm9tIHZlcnNpb24gMS43LCB0aGlzIG1ldGhvZCBpcyBhdmFpbGFibGUgb25seSBpZiB5b3VcclxuICAgICAqIGluY2x1ZGUgYHBvcHBlci11dGlscy5qc2AgYmVmb3JlIGBwb3BwZXIuanNgLlxyXG4gICAgICpcclxuICAgICAqICoqREVQUkVDQVRJT04qKjogVGhpcyB3YXkgdG8gYWNjZXNzIFBvcHBlclV0aWxzIGlzIGRlcHJlY2F0ZWRcclxuICAgICAqIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdjIhIFVzZSB0aGUgUG9wcGVyVXRpbHMgbW9kdWxlIGRpcmVjdGx5IGluc3RlYWQuXHJcbiAgICAgKiBEdWUgdG8gdGhlIGhpZ2ggaW5zdGFiaWxpdHkgb2YgdGhlIG1ldGhvZHMgY29udGFpbmVkIGluIFV0aWxzLCB3ZSBjYW4ndFxyXG4gICAgICogZ3VhcmFudGVlIHRoZW0gdG8gZm9sbG93IHNlbXZlci4gVXNlIHRoZW0gYXQgeW91ciBvd24gcmlzayFcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAxLjhcclxuICAgICAqIEBtZW1iZXIgVXRpbHNcclxuICAgICAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICAgICAqL1xyXG5cclxuICB9XSk7XHJcbiAgcmV0dXJuIFBvcHBlcjtcclxufSgpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBgcmVmZXJlbmNlT2JqZWN0YCBpcyBhbiBvYmplY3QgdGhhdCBwcm92aWRlcyBhbiBpbnRlcmZhY2UgY29tcGF0aWJsZSB3aXRoIFBvcHBlci5qc1xyXG4gKiBhbmQgbGV0cyB5b3UgdXNlIGl0IGFzIHJlcGxhY2VtZW50IG9mIGEgcmVhbCBET00gbm9kZS48YnIgLz5cclxuICogWW91IGNhbiB1c2UgdGhpcyBtZXRob2QgdG8gcG9zaXRpb24gYSBwb3BwZXIgcmVsYXRpdmVseSB0byBhIHNldCBvZiBjb29yZGluYXRlc1xyXG4gKiBpbiBjYXNlIHlvdSBkb24ndCBoYXZlIGEgRE9NIG5vZGUgdG8gdXNlIGFzIHJlZmVyZW5jZS5cclxuICpcclxuICogYGBgXHJcbiAqIG5ldyBQb3BwZXIocmVmZXJlbmNlT2JqZWN0LCBwb3BwZXJOb2RlKTtcclxuICogYGBgXHJcbiAqXHJcbiAqIE5COiBUaGlzIGZlYXR1cmUgaXNuJ3Qgc3VwcG9ydGVkIGluIEludGVybmV0IEV4cGxvcmVyIDEwXHJcbiAqIEBuYW1lIHJlZmVyZW5jZU9iamVjdFxyXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBkYXRhLmdldEJvdW5kaW5nQ2xpZW50UmVjdFxyXG4gKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHNldCBvZiBjb29yZGluYXRlcyBjb21wYXRpYmxlIHdpdGggdGhlIG5hdGl2ZSBgZ2V0Qm91bmRpbmdDbGllbnRSZWN0YCBtZXRob2QuXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkYXRhLmNsaWVudFdpZHRoXHJcbiAqIEFuIEVTNiBnZXR0ZXIgdGhhdCB3aWxsIHJldHVybiB0aGUgd2lkdGggb2YgdGhlIHZpcnR1YWwgcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkYXRhLmNsaWVudEhlaWdodFxyXG4gKiBBbiBFUzYgZ2V0dGVyIHRoYXQgd2lsbCByZXR1cm4gdGhlIGhlaWdodCBvZiB0aGUgdmlydHVhbCByZWZlcmVuY2UgZWxlbWVudC5cclxuICovXHJcblxyXG5Qb3BwZXIuVXRpbHMgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBnbG9iYWwpLlBvcHBlclV0aWxzO1xyXG5Qb3BwZXIucGxhY2VtZW50cyA9IHBsYWNlbWVudHM7XHJcblBvcHBlci5EZWZhdWx0cyA9IERlZmF1bHRzO1xyXG5cclxuLyoqXHJcbiAqIFRyaWdnZXJzIGRvY3VtZW50IHJlZmxvdy5cclxuICogVXNlIHZvaWQgYmVjYXVzZSBzb21lIG1pbmlmaWVycyBvciBlbmdpbmVzIHRoaW5rIHNpbXBseSBhY2Nlc3NpbmcgdGhlIHByb3BlcnR5XHJcbiAqIGlzIHVubmVjZXNzYXJ5LlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxyXG4gKi9cclxuZnVuY3Rpb24gcmVmbG93KHBvcHBlcikge1xyXG4gIHZvaWQgcG9wcGVyLm9mZnNldEhlaWdodDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFdyYXBwZXIgdXRpbCBmb3IgcG9wcGVyIHBvc2l0aW9uIHVwZGF0aW5nLlxyXG4gKiBVcGRhdGVzIHRoZSBwb3BwZXIncyBwb3NpdGlvbiBhbmQgaW52b2tlcyB0aGUgY2FsbGJhY2sgb24gdXBkYXRlLlxyXG4gKiBIYWNraXNoIHdvcmthcm91bmQgdW50aWwgUG9wcGVyIDIuMCdzIHVwZGF0ZSgpIGJlY29tZXMgc3luYy5cclxuICogQHBhcmFtIHtQb3BwZXJ9IHBvcHBlckluc3RhbmNlXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrOiB0byBydW4gb25jZSBwb3BwZXIncyBwb3NpdGlvbiB3YXMgdXBkYXRlZFxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVwZGF0ZUFscmVhZHlDYWxsZWQ6IHdhcyBzY2hlZHVsZVVwZGF0ZSgpIGFscmVhZHkgY2FsbGVkP1xyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlUG9wcGVyUG9zaXRpb24ocG9wcGVySW5zdGFuY2UsIGNhbGxiYWNrLCB1cGRhdGVBbHJlYWR5Q2FsbGVkKSB7XHJcbiAgdmFyIHBvcHBlciA9IHBvcHBlckluc3RhbmNlLnBvcHBlcixcclxuICAgICAgb3B0aW9ucyA9IHBvcHBlckluc3RhbmNlLm9wdGlvbnM7XHJcblxyXG4gIHZhciBvbkNyZWF0ZSA9IG9wdGlvbnMub25DcmVhdGU7XHJcbiAgdmFyIG9uVXBkYXRlID0gb3B0aW9ucy5vblVwZGF0ZTtcclxuXHJcbiAgb3B0aW9ucy5vbkNyZWF0ZSA9IG9wdGlvbnMub25VcGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZWZsb3cocG9wcGVyKSwgY2FsbGJhY2sgJiYgY2FsbGJhY2soKSwgb25VcGRhdGUoKTtcclxuICAgIG9wdGlvbnMub25DcmVhdGUgPSBvbkNyZWF0ZTtcclxuICAgIG9wdGlvbnMub25VcGRhdGUgPSBvblVwZGF0ZTtcclxuICB9O1xyXG5cclxuICBpZiAoIXVwZGF0ZUFscmVhZHlDYWxsZWQpIHtcclxuICAgIHBvcHBlckluc3RhbmNlLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgY29yZSBwbGFjZW1lbnQgKCd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnKSBvZiBhIHBvcHBlclxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRQb3BwZXJQbGFjZW1lbnQocG9wcGVyKSB7XHJcbiAgcmV0dXJuIHBvcHBlci5nZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50JykucmVwbGFjZSgvLS4rLywgJycpO1xyXG59XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyBpZiB0aGUgbW91c2UncyBjdXJzb3IgaXMgb3V0c2lkZSB0aGUgaW50ZXJhY3RpdmUgYm9yZGVyXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnRcclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGN1cnNvcklzT3V0c2lkZUludGVyYWN0aXZlQm9yZGVyKGV2ZW50LCBwb3BwZXIsIG9wdGlvbnMpIHtcclxuICBpZiAoIXBvcHBlci5nZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50JykpIHJldHVybiB0cnVlO1xyXG5cclxuICB2YXIgeCA9IGV2ZW50LmNsaWVudFgsXHJcbiAgICAgIHkgPSBldmVudC5jbGllbnRZO1xyXG4gIHZhciBpbnRlcmFjdGl2ZUJvcmRlciA9IG9wdGlvbnMuaW50ZXJhY3RpdmVCb3JkZXIsXHJcbiAgICAgIGRpc3RhbmNlID0gb3B0aW9ucy5kaXN0YW5jZTtcclxuXHJcblxyXG4gIHZhciByZWN0ID0gcG9wcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIHZhciBwbGFjZW1lbnQgPSBnZXRQb3BwZXJQbGFjZW1lbnQocG9wcGVyKTtcclxuICB2YXIgYm9yZGVyV2l0aERpc3RhbmNlID0gaW50ZXJhY3RpdmVCb3JkZXIgKyBkaXN0YW5jZTtcclxuXHJcbiAgdmFyIGV4Y2VlZHMgPSB7XHJcbiAgICB0b3A6IHJlY3QudG9wIC0geSA+IGludGVyYWN0aXZlQm9yZGVyLFxyXG4gICAgYm90dG9tOiB5IC0gcmVjdC5ib3R0b20gPiBpbnRlcmFjdGl2ZUJvcmRlcixcclxuICAgIGxlZnQ6IHJlY3QubGVmdCAtIHggPiBpbnRlcmFjdGl2ZUJvcmRlcixcclxuICAgIHJpZ2h0OiB4IC0gcmVjdC5yaWdodCA+IGludGVyYWN0aXZlQm9yZGVyXHJcbiAgfTtcclxuXHJcbiAgc3dpdGNoIChwbGFjZW1lbnQpIHtcclxuICAgIGNhc2UgJ3RvcCc6XHJcbiAgICAgIGV4Y2VlZHMudG9wID0gcmVjdC50b3AgLSB5ID4gYm9yZGVyV2l0aERpc3RhbmNlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ2JvdHRvbSc6XHJcbiAgICAgIGV4Y2VlZHMuYm90dG9tID0geSAtIHJlY3QuYm90dG9tID4gYm9yZGVyV2l0aERpc3RhbmNlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ2xlZnQnOlxyXG4gICAgICBleGNlZWRzLmxlZnQgPSByZWN0LmxlZnQgLSB4ID4gYm9yZGVyV2l0aERpc3RhbmNlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ3JpZ2h0JzpcclxuICAgICAgZXhjZWVkcy5yaWdodCA9IHggLSByZWN0LnJpZ2h0ID4gYm9yZGVyV2l0aERpc3RhbmNlO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcblxyXG4gIHJldHVybiBleGNlZWRzLnRvcCB8fCBleGNlZWRzLmJvdHRvbSB8fCBleGNlZWRzLmxlZnQgfHwgZXhjZWVkcy5yaWdodDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRyYW5zZm9ybXMgdGhlIGBhcnJvd1RyYW5zZm9ybWAgbnVtYmVycyBiYXNlZCBvbiB0aGUgcGxhY2VtZW50IGF4aXNcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgJ3NjYWxlJyBvciAndHJhbnNsYXRlJ1xyXG4gKiBAcGFyYW0ge051bWJlcltdfSBudW1iZXJzXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNWZXJ0aWNhbFxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzUmV2ZXJzZVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiB0cmFuc2Zvcm1OdW1iZXJzQmFzZWRPblBsYWNlbWVudEF4aXModHlwZSwgbnVtYmVycywgaXNWZXJ0aWNhbCwgaXNSZXZlcnNlKSB7XHJcbiAgaWYgKCFudW1iZXJzLmxlbmd0aCkgcmV0dXJuICcnO1xyXG5cclxuICB2YXIgdHJhbnNmb3JtcyA9IHtcclxuICAgIHNjYWxlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChudW1iZXJzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiAnJyArIG51bWJlcnNbMF07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGlzVmVydGljYWwgPyBudW1iZXJzWzBdICsgJywgJyArIG51bWJlcnNbMV0gOiBudW1iZXJzWzFdICsgJywgJyArIG51bWJlcnNbMF07XHJcbiAgICAgIH1cclxuICAgIH0oKSxcclxuICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAobnVtYmVycy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gaXNSZXZlcnNlID8gLW51bWJlcnNbMF0gKyAncHgnIDogbnVtYmVyc1swXSArICdweCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGlzVmVydGljYWwpIHtcclxuICAgICAgICAgIHJldHVybiBpc1JldmVyc2UgPyBudW1iZXJzWzBdICsgJ3B4LCAnICsgLW51bWJlcnNbMV0gKyAncHgnIDogbnVtYmVyc1swXSArICdweCwgJyArIG51bWJlcnNbMV0gKyAncHgnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gaXNSZXZlcnNlID8gLW51bWJlcnNbMV0gKyAncHgsICcgKyBudW1iZXJzWzBdICsgJ3B4JyA6IG51bWJlcnNbMV0gKyAncHgsICcgKyBudW1iZXJzWzBdICsgJ3B4JztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0oKVxyXG4gIH07XHJcblxyXG4gIHJldHVybiB0cmFuc2Zvcm1zW3R5cGVdO1xyXG59XHJcblxyXG4vKipcclxuICogVHJhbnNmb3JtcyB0aGUgYGFycm93VHJhbnNmb3JtYCB4IG9yIHkgYXhpcyBiYXNlZCBvbiB0aGUgcGxhY2VtZW50IGF4aXNcclxuICogQHBhcmFtIHtTdHJpbmd9IGF4aXMgJ1gnLCAnWScsICcnXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNWZXJ0aWNhbFxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiB0cmFuc2Zvcm1BeGlzKGF4aXMsIGlzVmVydGljYWwpIHtcclxuICBpZiAoIWF4aXMpIHJldHVybiAnJztcclxuICB2YXIgbWFwID0ge1xyXG4gICAgWDogJ1knLFxyXG4gICAgWTogJ1gnXHJcbiAgfTtcclxuICByZXR1cm4gaXNWZXJ0aWNhbCA/IGF4aXMgOiBtYXBbYXhpc107XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlcyBhbmQgYXBwbGllcyB0aGUgbmVjZXNzYXJ5IGFycm93IHRyYW5zZm9ybVxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFycm93XHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcnJvd1RyYW5zZm9ybVxyXG4gKi9cclxuZnVuY3Rpb24gY29tcHV0ZUFycm93VHJhbnNmb3JtKHBvcHBlciwgYXJyb3csIGFycm93VHJhbnNmb3JtKSB7XHJcbiAgdmFyIHBsYWNlbWVudCA9IGdldFBvcHBlclBsYWNlbWVudChwb3BwZXIpO1xyXG4gIHZhciBpc1ZlcnRpY2FsID0gcGxhY2VtZW50ID09PSAndG9wJyB8fCBwbGFjZW1lbnQgPT09ICdib3R0b20nO1xyXG4gIHZhciBpc1JldmVyc2UgPSBwbGFjZW1lbnQgPT09ICdyaWdodCcgfHwgcGxhY2VtZW50ID09PSAnYm90dG9tJztcclxuXHJcbiAgdmFyIGdldEF4aXMgPSBmdW5jdGlvbiBnZXRBeGlzKHJlKSB7XHJcbiAgICB2YXIgbWF0Y2ggPSBhcnJvd1RyYW5zZm9ybS5tYXRjaChyZSk7XHJcbiAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnO1xyXG4gIH07XHJcblxyXG4gIHZhciBnZXROdW1iZXJzID0gZnVuY3Rpb24gZ2V0TnVtYmVycyhyZSkge1xyXG4gICAgdmFyIG1hdGNoID0gYXJyb3dUcmFuc2Zvcm0ubWF0Y2gocmUpO1xyXG4gICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0uc3BsaXQoJywnKS5tYXAocGFyc2VGbG9hdCkgOiBbXTtcclxuICB9O1xyXG5cclxuICB2YXIgcmUgPSB7XHJcbiAgICB0cmFuc2xhdGU6IC90cmFuc2xhdGVYP1k/XFwoKFteKV0rKVxcKS8sXHJcbiAgICBzY2FsZTogL3NjYWxlWD9ZP1xcKChbXildKylcXCkvXHJcbiAgfTtcclxuXHJcbiAgdmFyIG1hdGNoZXMgPSB7XHJcbiAgICB0cmFuc2xhdGU6IHtcclxuICAgICAgYXhpczogZ2V0QXhpcygvdHJhbnNsYXRlKFtYWV0pLyksXHJcbiAgICAgIG51bWJlcnM6IGdldE51bWJlcnMocmUudHJhbnNsYXRlKVxyXG4gICAgfSxcclxuICAgIHNjYWxlOiB7XHJcbiAgICAgIGF4aXM6IGdldEF4aXMoL3NjYWxlKFtYWV0pLyksXHJcbiAgICAgIG51bWJlcnM6IGdldE51bWJlcnMocmUuc2NhbGUpXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIGNvbXB1dGVkVHJhbnNmb3JtID0gYXJyb3dUcmFuc2Zvcm0ucmVwbGFjZShyZS50cmFuc2xhdGUsICd0cmFuc2xhdGUnICsgdHJhbnNmb3JtQXhpcyhtYXRjaGVzLnRyYW5zbGF0ZS5heGlzLCBpc1ZlcnRpY2FsKSArICcoJyArIHRyYW5zZm9ybU51bWJlcnNCYXNlZE9uUGxhY2VtZW50QXhpcygndHJhbnNsYXRlJywgbWF0Y2hlcy50cmFuc2xhdGUubnVtYmVycywgaXNWZXJ0aWNhbCwgaXNSZXZlcnNlKSArICcpJykucmVwbGFjZShyZS5zY2FsZSwgJ3NjYWxlJyArIHRyYW5zZm9ybUF4aXMobWF0Y2hlcy5zY2FsZS5heGlzLCBpc1ZlcnRpY2FsKSArICcoJyArIHRyYW5zZm9ybU51bWJlcnNCYXNlZE9uUGxhY2VtZW50QXhpcygnc2NhbGUnLCBtYXRjaGVzLnNjYWxlLm51bWJlcnMsIGlzVmVydGljYWwsIGlzUmV2ZXJzZSkgKyAnKScpO1xyXG5cclxuICBhcnJvdy5zdHlsZVtwcmVmaXgoJ3RyYW5zZm9ybScpXSA9IGNvbXB1dGVkVHJhbnNmb3JtO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgZGlzdGFuY2UgdGFraW5nIGludG8gYWNjb3VudCB0aGUgZGVmYXVsdCBkaXN0YW5jZSBkdWUgdG9cclxuICogdGhlIHRyYW5zZm9ybTogdHJhbnNsYXRlIHNldHRpbmcgaW4gQ1NTXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPZmZzZXREaXN0YW5jZUluUHgoZGlzdGFuY2UpIHtcclxuICByZXR1cm4gLShkaXN0YW5jZSAtIGRlZmF1bHRzLmRpc3RhbmNlKSArICdweCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXYWl0cyB1bnRpbCBuZXh0IHJlcGFpbnQgdG8gZXhlY3V0ZSBhIGZuXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWZlcihmbikge1xyXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICBzZXRUaW1lb3V0KGZuLCAxKTtcclxuICB9KTtcclxufVxyXG5cclxudmFyIG1hdGNoZXMgPSB7fTtcclxuXHJcbmlmIChpc0Jyb3dzZXIpIHtcclxuICB2YXIgZSA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG4gIG1hdGNoZXMgPSBlLm1hdGNoZXMgfHwgZS5tYXRjaGVzU2VsZWN0b3IgfHwgZS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgZS5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZS5tc01hdGNoZXNTZWxlY3RvciB8fCBmdW5jdGlvbiAocykge1xyXG4gICAgdmFyIG1hdGNoZXMgPSAodGhpcy5kb2N1bWVudCB8fCB0aGlzLm93bmVyRG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwocyk7XHJcbiAgICB2YXIgaSA9IG1hdGNoZXMubGVuZ3RoO1xyXG4gICAgd2hpbGUgKC0taSA+PSAwICYmIG1hdGNoZXMuaXRlbShpKSAhPT0gdGhpcykge30gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lbXB0eVxyXG4gICAgcmV0dXJuIGkgPiAtMTtcclxuICB9O1xyXG59XHJcblxyXG52YXIgbWF0Y2hlcyQxID0gbWF0Y2hlcztcclxuXHJcbi8qKlxyXG4gKiBQb255ZmlsbCB0byBnZXQgdGhlIGNsb3Nlc3QgcGFyZW50IGVsZW1lbnRcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0gY2hpbGQgb2YgcGFyZW50IHRvIGJlIHJldHVybmVkXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXJlbnRTZWxlY3RvciAtIHNlbGVjdG9yIHRvIG1hdGNoIHRoZSBwYXJlbnQgaWYgZm91bmRcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbmZ1bmN0aW9uIGNsb3Nlc3QoZWxlbWVudCwgcGFyZW50U2VsZWN0b3IpIHtcclxuICB2YXIgZm4gPSBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0IHx8IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgdmFyIGVsID0gdGhpcztcclxuICAgIHdoaWxlIChlbCkge1xyXG4gICAgICBpZiAobWF0Y2hlcyQxLmNhbGwoZWwsIHNlbGVjdG9yKSkge1xyXG4gICAgICAgIHJldHVybiBlbDtcclxuICAgICAgfVxyXG4gICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGZuLmNhbGwoZWxlbWVudCwgcGFyZW50U2VsZWN0b3IpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgdmFsdWUgdGFraW5nIGludG8gYWNjb3VudCB0aGUgdmFsdWUgYmVpbmcgZWl0aGVyIGEgbnVtYmVyIG9yIGFycmF5XHJcbiAqIEBwYXJhbSB7TnVtYmVyfEFycmF5fSB2YWx1ZVxyXG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcclxuICogQHJldHVybiB7TnVtYmVyfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0VmFsdWUodmFsdWUsIGluZGV4KSB7XHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWVbaW5kZXhdIDogdmFsdWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSB2aXNpYmlsaXR5IHN0YXRlIG9mIGFuIGVsZW1lbnQgZm9yIHRyYW5zaXRpb24gdG8gYmVnaW5cclxuICogQHBhcmFtIHtFbGVtZW50W119IGVscyAtIGFycmF5IG9mIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gJ3Zpc2libGUnIG9yICdoaWRkZW4nXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRWaXNpYmlsaXR5U3RhdGUoZWxzLCB0eXBlKSB7XHJcbiAgZWxzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICBpZiAoIWVsKSByZXR1cm47XHJcbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdGUnLCB0eXBlKTtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldHMgdGhlIHRyYW5zaXRpb24gcHJvcGVydHkgdG8gZWFjaCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbHMgLSBBcnJheSBvZiBlbGVtZW50c1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcclxuICovXHJcbmZ1bmN0aW9uIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uKGVscywgdmFsdWUpIHtcclxuICBlbHMuZmlsdGVyKEJvb2xlYW4pLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICBlbC5zdHlsZVtwcmVmaXgoJ3RyYW5zaXRpb25EdXJhdGlvbicpXSA9IHZhbHVlICsgJ21zJztcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZvY3VzZXMgYW4gZWxlbWVudCB3aGlsZSBwcmV2ZW50aW5nIGEgc2Nyb2xsIGp1bXAgaWYgaXQncyBub3QgZW50aXJlbHkgd2l0aGluIHRoZSB2aWV3cG9ydFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXHJcbiAqL1xyXG5mdW5jdGlvbiBmb2N1cyhlbCkge1xyXG4gIHZhciB4ID0gd2luZG93LnNjcm9sbFggfHwgd2luZG93LnBhZ2VYT2Zmc2V0O1xyXG4gIHZhciB5ID0gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG4gIGVsLmZvY3VzKCk7XHJcbiAgc2Nyb2xsKHgsIHkpO1xyXG59XHJcblxyXG52YXIga2V5ID0ge307XHJcbnZhciBzdG9yZSA9IGZ1bmN0aW9uIHN0b3JlKGRhdGEpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGspIHtcclxuICAgIHJldHVybiBrID09PSBrZXkgJiYgZGF0YTtcclxuICB9O1xyXG59O1xyXG5cclxudmFyIFRpcHB5ID0gZnVuY3Rpb24gKCkge1xyXG4gIGZ1bmN0aW9uIFRpcHB5KGNvbmZpZykge1xyXG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgVGlwcHkpO1xyXG5cclxuICAgIGZvciAodmFyIF9rZXkgaW4gY29uZmlnKSB7XHJcbiAgICAgIHRoaXNbX2tleV0gPSBjb25maWdbX2tleV07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgZGVzdHJveWVkOiBmYWxzZSxcclxuICAgICAgdmlzaWJsZTogZmFsc2UsXHJcbiAgICAgIGVuYWJsZWQ6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fID0gc3RvcmUoe1xyXG4gICAgICBtdXRhdGlvbk9ic2VydmVyczogW11cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5hYmxlcyB0aGUgdG9vbHRpcCB0byBhbGxvdyBpdCB0byBzaG93IG9yIGhpZGVcclxuICAgKiBAbWVtYmVyb2YgVGlwcHlcclxuICAgKiBAcHVibGljXHJcbiAgICovXHJcblxyXG5cclxuICBjcmVhdGVDbGFzcyhUaXBweSwgW3tcclxuICAgIGtleTogJ2VuYWJsZScsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5hYmxlKCkge1xyXG4gICAgICB0aGlzLnN0YXRlLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzYWJsZXMgdGhlIHRvb2x0aXAgZnJvbSBzaG93aW5nIG9yIGhpZGluZywgYnV0IGRvZXMgbm90IGRlc3Ryb3kgaXRcclxuICAgICAqIEBtZW1iZXJvZiBUaXBweVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcblxyXG4gIH0sIHtcclxuICAgIGtleTogJ2Rpc2FibGUnLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XHJcbiAgICAgIHRoaXMuc3RhdGUuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvd3MgdGhlIHRvb2x0aXBcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHNcclxuICAgICAqIEBtZW1iZXJvZiBUaXBweVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcblxyXG4gIH0sIHtcclxuICAgIGtleTogJ3Nob3cnLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNob3coZHVyYXRpb24pIHtcclxuICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgIGlmICh0aGlzLnN0YXRlLmRlc3Ryb3llZCB8fCAhdGhpcy5zdGF0ZS5lbmFibGVkKSByZXR1cm47XHJcblxyXG4gICAgICB2YXIgcG9wcGVyID0gdGhpcy5wb3BwZXIsXHJcbiAgICAgICAgICByZWZlcmVuY2UgPSB0aGlzLnJlZmVyZW5jZSxcclxuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgICB2YXIgX2dldElubmVyRWxlbWVudHMgPSBnZXRJbm5lckVsZW1lbnRzKHBvcHBlciksXHJcbiAgICAgICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHMudG9vbHRpcCxcclxuICAgICAgICAgIGJhY2tkcm9wID0gX2dldElubmVyRWxlbWVudHMuYmFja2Ryb3AsXHJcbiAgICAgICAgICBjb250ZW50ID0gX2dldElubmVyRWxlbWVudHMuY29udGVudDtcclxuXHJcbiAgICAgIC8vIElmIHRoZSBgZHluYW1pY1RpdGxlYCBvcHRpb24gaXMgdHJ1ZSwgdGhlIGluc3RhbmNlIGlzIGFsbG93ZWRcclxuICAgICAgLy8gdG8gYmUgY3JlYXRlZCB3aXRoIGFuIGVtcHR5IHRpdGxlLiBNYWtlIHN1cmUgdGhhdCB0aGUgdG9vbHRpcFxyXG4gICAgICAvLyBjb250ZW50IGlzIG5vdCBlbXB0eSBiZWZvcmUgc2hvd2luZyBpdFxyXG5cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmR5bmFtaWNUaXRsZSAmJiAhcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSgnZGF0YS1vcmlnaW5hbC10aXRsZScpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBEbyBub3Qgc2hvdyB0b29sdGlwIGlmIHJlZmVyZW5jZSBjb250YWlucyAnZGlzYWJsZWQnIGF0dHJpYnV0ZS4gRkYgZml4IGZvciAjMjIxXHJcbiAgICAgIGlmIChyZWZlcmVuY2UuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSByZXR1cm47XHJcblxyXG4gICAgICAvLyBEZXN0cm95IHRvb2x0aXAgaWYgdGhlIHJlZmVyZW5jZSBlbGVtZW50IGlzIG5vIGxvbmdlciBvbiB0aGUgRE9NXHJcbiAgICAgIGlmICghcmVmZXJlbmNlLnJlZk9iaiAmJiAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbnRhaW5zKHJlZmVyZW5jZSkpIHtcclxuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9wdGlvbnMub25TaG93LmNhbGwocG9wcGVyLCB0aGlzKTtcclxuXHJcbiAgICAgIGR1cmF0aW9uID0gZ2V0VmFsdWUoZHVyYXRpb24gIT09IHVuZGVmaW5lZCA/IGR1cmF0aW9uIDogb3B0aW9ucy5kdXJhdGlvbiwgMCk7XHJcblxyXG4gICAgICAvLyBQcmV2ZW50IGEgdHJhbnNpdGlvbiB3aGVuIHBvcHBlciBjaGFuZ2VzIHBvc2l0aW9uXHJcbiAgICAgIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uKFtwb3BwZXIsIHRvb2x0aXAsIGJhY2tkcm9wXSwgMCk7XHJcblxyXG4gICAgICBwb3BwZXIuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICAgICAgdGhpcy5zdGF0ZS52aXNpYmxlID0gdHJ1ZTtcclxuXHJcbiAgICAgIF9tb3VudC5jYWxsKHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIV90aGlzLnN0YXRlLnZpc2libGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKCFfaGFzRm9sbG93Q3Vyc29yQmVoYXZpb3IuY2FsbChfdGhpcykpIHtcclxuICAgICAgICAgIC8vIEZJWDogQXJyb3cgd2lsbCBzb21ldGltZXMgbm90IGJlIHBvc2l0aW9uZWQgY29ycmVjdGx5LiBGb3JjZSBhbm90aGVyIHVwZGF0ZS5cclxuICAgICAgICAgIF90aGlzLnBvcHBlckluc3RhbmNlLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTZXQgaW5pdGlhbCBwb3NpdGlvbiBuZWFyIHRoZSBjdXJzb3JcclxuICAgICAgICBpZiAoX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwoX3RoaXMpKSB7XHJcbiAgICAgICAgICBfdGhpcy5wb3BwZXJJbnN0YW5jZS5kaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgIHZhciBkZWxheSA9IGdldFZhbHVlKG9wdGlvbnMuZGVsYXksIDApO1xyXG4gICAgICAgICAgdmFyIGxhc3RUcmlnZ2VyRXZlbnQgPSBfdGhpcy5fKGtleSkubGFzdFRyaWdnZXJFdmVudDtcclxuICAgICAgICAgIGlmIChsYXN0VHJpZ2dlckV2ZW50KSB7XHJcbiAgICAgICAgICAgIF90aGlzLl8oa2V5KS5mb2xsb3dDdXJzb3JMaXN0ZW5lcihkZWxheSAmJiBfdGhpcy5fKGtleSkubGFzdE1vdXNlTW92ZUV2ZW50ID8gX3RoaXMuXyhrZXkpLmxhc3RNb3VzZU1vdmVFdmVudCA6IGxhc3RUcmlnZ2VyRXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmUtYXBwbHkgdHJhbnNpdGlvbiBkdXJhdGlvbnNcclxuICAgICAgICBhcHBseVRyYW5zaXRpb25EdXJhdGlvbihbdG9vbHRpcCwgYmFja2Ryb3AsIGJhY2tkcm9wID8gY29udGVudCA6IG51bGxdLCBkdXJhdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChiYWNrZHJvcCkge1xyXG4gICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShiYWNrZHJvcClbcHJlZml4KCd0cmFuc2Zvcm0nKV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgICAgICAgcmVmZXJlbmNlLmNsYXNzTGlzdC5hZGQoJ3RpcHB5LWFjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuc3RpY2t5KSB7XHJcbiAgICAgICAgICBfbWFrZVN0aWNreS5jYWxsKF90aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFZpc2liaWxpdHlTdGF0ZShbdG9vbHRpcCwgYmFja2Ryb3BdLCAndmlzaWJsZScpO1xyXG5cclxuICAgICAgICBfb25UcmFuc2l0aW9uRW5kLmNhbGwoX3RoaXMsIGR1cmF0aW9uLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoIW9wdGlvbnMudXBkYXRlRHVyYXRpb24pIHtcclxuICAgICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKCd0aXBweS1ub3RyYW5zaXRpb24nKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgICAgICAgICBmb2N1cyhwb3BwZXIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJlZmVyZW5jZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCAndGlwcHktJyArIF90aGlzLmlkKTtcclxuXHJcbiAgICAgICAgICBvcHRpb25zLm9uU2hvd24uY2FsbChwb3BwZXIsIF90aGlzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIaWRlcyB0aGUgdG9vbHRpcFxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kc1xyXG4gICAgICogQG1lbWJlcm9mIFRpcHB5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKi9cclxuXHJcbiAgfSwge1xyXG4gICAga2V5OiAnaGlkZScsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGlkZShkdXJhdGlvbikge1xyXG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcclxuXHJcbiAgICAgIGlmICh0aGlzLnN0YXRlLmRlc3Ryb3llZCB8fCAhdGhpcy5zdGF0ZS5lbmFibGVkKSByZXR1cm47XHJcblxyXG4gICAgICB2YXIgcG9wcGVyID0gdGhpcy5wb3BwZXIsXHJcbiAgICAgICAgICByZWZlcmVuY2UgPSB0aGlzLnJlZmVyZW5jZSxcclxuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgICB2YXIgX2dldElubmVyRWxlbWVudHMyID0gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpLFxyXG4gICAgICAgICAgdG9vbHRpcCA9IF9nZXRJbm5lckVsZW1lbnRzMi50b29sdGlwLFxyXG4gICAgICAgICAgYmFja2Ryb3AgPSBfZ2V0SW5uZXJFbGVtZW50czIuYmFja2Ryb3AsXHJcbiAgICAgICAgICBjb250ZW50ID0gX2dldElubmVyRWxlbWVudHMyLmNvbnRlbnQ7XHJcblxyXG4gICAgICBvcHRpb25zLm9uSGlkZS5jYWxsKHBvcHBlciwgdGhpcyk7XHJcblxyXG4gICAgICBkdXJhdGlvbiA9IGdldFZhbHVlKGR1cmF0aW9uICE9PSB1bmRlZmluZWQgPyBkdXJhdGlvbiA6IG9wdGlvbnMuZHVyYXRpb24sIDEpO1xyXG5cclxuICAgICAgaWYgKCFvcHRpb25zLnVwZGF0ZUR1cmF0aW9uKSB7XHJcbiAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKCd0aXBweS1ub3RyYW5zaXRpb24nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgICByZWZlcmVuY2UuY2xhc3NMaXN0LnJlbW92ZSgndGlwcHktYWN0aXZlJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBvcHBlci5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICAgIHRoaXMuc3RhdGUudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oW3Rvb2x0aXAsIGJhY2tkcm9wLCBiYWNrZHJvcCA/IGNvbnRlbnQgOiBudWxsXSwgZHVyYXRpb24pO1xyXG5cclxuICAgICAgc2V0VmlzaWJpbGl0eVN0YXRlKFt0b29sdGlwLCBiYWNrZHJvcF0sICdoaWRkZW4nKTtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmludGVyYWN0aXZlICYmIG9wdGlvbnMudHJpZ2dlci5pbmRleE9mKCdjbGljaycpID4gLTEpIHtcclxuICAgICAgICBmb2N1cyhyZWZlcmVuY2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKlxyXG4gICAgICAqIFRoaXMgY2FsbCBpcyBkZWZlcnJlZCBiZWNhdXNlIHNvbWV0aW1lcyB3aGVuIHRoZSB0b29sdGlwIGlzIHN0aWxsIHRyYW5zaXRpb25pbmcgaW4gYnV0IGhpZGUoKVxyXG4gICAgICAqIGlzIGNhbGxlZCBiZWZvcmUgaXQgZmluaXNoZXMsIHRoZSBDU1MgdHJhbnNpdGlvbiB3b24ndCByZXZlcnNlIHF1aWNrbHkgZW5vdWdoLCBtZWFuaW5nXHJcbiAgICAgICogdGhlIENTUyB0cmFuc2l0aW9uIHdpbGwgZmluaXNoIDEtMiBmcmFtZXMgbGF0ZXIsIGFuZCBvbkhpZGRlbigpIHdpbGwgcnVuIHNpbmNlIHRoZSBKUyBzZXQgaXRcclxuICAgICAgKiBtb3JlIHF1aWNrbHkuIEl0IHNob3VsZCBhY3R1YWxseSBiZSBvblNob3duKCkuIFNlZW1zIHRvIGJlIHNvbWV0aGluZyBDaHJvbWUgZG9lcywgbm90IFNhZmFyaVxyXG4gICAgICAqL1xyXG4gICAgICBkZWZlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX29uVHJhbnNpdGlvbkVuZC5jYWxsKF90aGlzMiwgZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmIChfdGhpczIuc3RhdGUudmlzaWJsZSB8fCAhb3B0aW9ucy5hcHBlbmRUby5jb250YWlucyhwb3BwZXIpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgaWYgKCFfdGhpczIuXyhrZXkpLmlzUHJlcGFyaW5nVG9TaG93KSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF90aGlzMi5fKGtleSkuZm9sbG93Q3Vyc29yTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICBfdGhpczIuXyhrZXkpLmxhc3RNb3VzZU1vdmVFdmVudCA9IG51bGw7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKF90aGlzMi5wb3BwZXJJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBfdGhpczIucG9wcGVySW5zdGFuY2UuZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmVmZXJlbmNlLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG5cclxuICAgICAgICAgIG9wdGlvbnMuYXBwZW5kVG8ucmVtb3ZlQ2hpbGQocG9wcGVyKTtcclxuXHJcbiAgICAgICAgICBvcHRpb25zLm9uSGlkZGVuLmNhbGwocG9wcGVyLCBfdGhpczIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERlc3Ryb3lzIHRoZSB0b29sdGlwIGluc3RhbmNlXHJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRlc3Ryb3lUYXJnZXRJbnN0YW5jZXMgLSByZWxldmFudCBvbmx5IHdoZW4gZGVzdHJveWluZyBkZWxlZ2F0ZXNcclxuICAgICAqIEBtZW1iZXJvZiBUaXBweVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcblxyXG4gIH0sIHtcclxuICAgIGtleTogJ2Rlc3Ryb3knLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xyXG5cclxuICAgICAgdmFyIGRlc3Ryb3lUYXJnZXRJbnN0YW5jZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XHJcblxyXG4gICAgICBpZiAodGhpcy5zdGF0ZS5kZXN0cm95ZWQpIHJldHVybjtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgcG9wcGVyIGlzIGhpZGRlblxyXG4gICAgICBpZiAodGhpcy5zdGF0ZS52aXNpYmxlKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlKDApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xyXG4gICAgICAgIF90aGlzMy5yZWZlcmVuY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lci5ldmVudCwgbGlzdGVuZXIuaGFuZGxlcik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gUmVzdG9yZSB0aXRsZVxyXG4gICAgICBpZiAodGhpcy50aXRsZSkge1xyXG4gICAgICAgIHRoaXMucmVmZXJlbmNlLnNldEF0dHJpYnV0ZSgndGl0bGUnLCB0aGlzLnRpdGxlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGVsZXRlIHRoaXMucmVmZXJlbmNlLl90aXBweTtcclxuXHJcbiAgICAgIHZhciBhdHRyaWJ1dGVzID0gWydkYXRhLW9yaWdpbmFsLXRpdGxlJywgJ2RhdGEtdGlwcHknLCAnZGF0YS10aXBweS1kZWxlZ2F0ZSddO1xyXG4gICAgICBhdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcclxuICAgICAgICBfdGhpczMucmVmZXJlbmNlLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRhcmdldCAmJiBkZXN0cm95VGFyZ2V0SW5zdGFuY2VzKSB7XHJcbiAgICAgICAgdG9BcnJheSh0aGlzLnJlZmVyZW5jZS5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy50YXJnZXQpKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gICAgICAgICAgcmV0dXJuIGNoaWxkLl90aXBweSAmJiBjaGlsZC5fdGlwcHkuZGVzdHJveSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5wb3BwZXJJbnN0YW5jZSkge1xyXG4gICAgICAgIHRoaXMucG9wcGVySW5zdGFuY2UuZGVzdHJveSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl8oa2V5KS5tdXRhdGlvbk9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChvYnNlcnZlcikge1xyXG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnN0YXRlLmRlc3Ryb3llZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfV0pO1xyXG4gIHJldHVybiBUaXBweTtcclxufSgpO1xyXG5cclxuLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBQcml2YXRlIG1ldGhvZHNcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIFN0YW5kYWxvbmUgZnVuY3Rpb25zIHRvIGJlIGNhbGxlZCB3aXRoIHRoZSBpbnN0YW5jZSdzIGB0aGlzYCBjb250ZXh0IHRvIG1ha2VcclxuICogdGhlbSB0cnVseSBwcml2YXRlIGFuZCBub3QgYWNjZXNzaWJsZSBvbiB0aGUgcHJvdG90eXBlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIERldGVybWluZXMgaWYgdGhlIHRvb2x0aXAgaW5zdGFuY2UgaGFzIGZvbGxvd0N1cnNvciBiZWhhdmlvclxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9oYXNGb2xsb3dDdXJzb3JCZWhhdmlvcigpIHtcclxuICB2YXIgbGFzdFRyaWdnZXJFdmVudCA9IHRoaXMuXyhrZXkpLmxhc3RUcmlnZ2VyRXZlbnQ7XHJcbiAgcmV0dXJuIHRoaXMub3B0aW9ucy5mb2xsb3dDdXJzb3IgJiYgIWJyb3dzZXIudXNpbmdUb3VjaCAmJiBsYXN0VHJpZ2dlckV2ZW50ICYmIGxhc3RUcmlnZ2VyRXZlbnQudHlwZSAhPT0gJ2ZvY3VzJztcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgdGhlIFRpcHB5IGluc3RhbmNlIGZvciB0aGUgY2hpbGQgdGFyZ2V0IG9mIHRoZSBkZWxlZ2F0ZSBjb250YWluZXJcclxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfY3JlYXRlRGVsZWdhdGVDaGlsZFRpcHB5KGV2ZW50KSB7XHJcbiAgdmFyIHRhcmdldEVsID0gY2xvc2VzdChldmVudC50YXJnZXQsIHRoaXMub3B0aW9ucy50YXJnZXQpO1xyXG4gIGlmICh0YXJnZXRFbCAmJiAhdGFyZ2V0RWwuX3RpcHB5KSB7XHJcbiAgICB2YXIgdGl0bGUgPSB0YXJnZXRFbC5nZXRBdHRyaWJ1dGUoJ3RpdGxlJykgfHwgdGhpcy50aXRsZTtcclxuICAgIGlmICh0aXRsZSkge1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgdGl0bGUpO1xyXG4gICAgICB0aXBweSQxKHRhcmdldEVsLCBfZXh0ZW5kcyh7fSwgdGhpcy5vcHRpb25zLCB7IHRhcmdldDogbnVsbCB9KSk7XHJcbiAgICAgIF9lbnRlci5jYWxsKHRhcmdldEVsLl90aXBweSwgZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1ldGhvZCB1c2VkIGJ5IGV2ZW50IGxpc3RlbmVycyB0byBpbnZva2UgdGhlIHNob3cgbWV0aG9kLCB0YWtpbmcgaW50byBhY2NvdW50IGRlbGF5cyBhbmRcclxuICogdGhlIGB3YWl0YCBvcHRpb25cclxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfZW50ZXIoZXZlbnQpIHtcclxuICB2YXIgX3RoaXM0ID0gdGhpcztcclxuXHJcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG5cclxuICBfY2xlYXJEZWxheVRpbWVvdXRzLmNhbGwodGhpcyk7XHJcblxyXG4gIGlmICh0aGlzLnN0YXRlLnZpc2libGUpIHJldHVybjtcclxuXHJcbiAgLy8gSXMgYSBkZWxlZ2F0ZSwgY3JlYXRlIFRpcHB5IGluc3RhbmNlIGZvciB0aGUgY2hpbGQgdGFyZ2V0XHJcbiAgaWYgKG9wdGlvbnMudGFyZ2V0KSB7XHJcbiAgICBfY3JlYXRlRGVsZWdhdGVDaGlsZFRpcHB5LmNhbGwodGhpcywgZXZlbnQpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5fKGtleSkuaXNQcmVwYXJpbmdUb1Nob3cgPSB0cnVlO1xyXG5cclxuICBpZiAob3B0aW9ucy53YWl0KSB7XHJcbiAgICBvcHRpb25zLndhaXQuY2FsbCh0aGlzLnBvcHBlciwgdGhpcy5zaG93LmJpbmQodGhpcyksIGV2ZW50KTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIElmIHRoZSB0b29sdGlwIGhhcyBhIGRlbGF5LCB3ZSBuZWVkIHRvIGJlIGxpc3RlbmluZyB0byB0aGUgbW91c2Vtb3ZlIGFzIHNvb24gYXMgdGhlIHRyaWdnZXJcclxuICAvLyBldmVudCBpcyBmaXJlZCBzbyB0aGF0IGl0J3MgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb24gdXBvbiBtb3VudC5cclxuICBpZiAoX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwodGhpcykpIHtcclxuICAgIGlmICghdGhpcy5fKGtleSkuZm9sbG93Q3Vyc29yTGlzdGVuZXIpIHtcclxuICAgICAgX3NldEZvbGxvd0N1cnNvckxpc3RlbmVyLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzMyA9IGdldElubmVyRWxlbWVudHModGhpcy5wb3BwZXIpLFxyXG4gICAgICAgIGFycm93ID0gX2dldElubmVyRWxlbWVudHMzLmFycm93O1xyXG5cclxuICAgIGlmIChhcnJvdykgYXJyb3cuc3R5bGUubWFyZ2luID0gJzAnO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fKGtleSkuZm9sbG93Q3Vyc29yTGlzdGVuZXIpO1xyXG4gIH1cclxuXHJcbiAgdmFyIGRlbGF5ID0gZ2V0VmFsdWUob3B0aW9ucy5kZWxheSwgMCk7XHJcblxyXG4gIGlmIChkZWxheSkge1xyXG4gICAgdGhpcy5fKGtleSkuc2hvd1RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgX3RoaXM0LnNob3coKTtcclxuICAgIH0sIGRlbGF5KTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5zaG93KCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogTWV0aG9kIHVzZWQgYnkgZXZlbnQgbGlzdGVuZXJzIHRvIGludm9rZSB0aGUgaGlkZSBtZXRob2QsIHRha2luZyBpbnRvIGFjY291bnQgZGVsYXlzXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2xlYXZlKCkge1xyXG4gIHZhciBfdGhpczUgPSB0aGlzO1xyXG5cclxuICBfY2xlYXJEZWxheVRpbWVvdXRzLmNhbGwodGhpcyk7XHJcblxyXG4gIGlmICghdGhpcy5zdGF0ZS52aXNpYmxlKSByZXR1cm47XHJcblxyXG4gIHRoaXMuXyhrZXkpLmlzUHJlcGFyaW5nVG9TaG93ID0gZmFsc2U7XHJcblxyXG4gIHZhciBkZWxheSA9IGdldFZhbHVlKHRoaXMub3B0aW9ucy5kZWxheSwgMSk7XHJcblxyXG4gIGlmIChkZWxheSkge1xyXG4gICAgdGhpcy5fKGtleSkuaGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKF90aGlzNS5zdGF0ZS52aXNpYmxlKSB7XHJcbiAgICAgICAgX3RoaXM1LmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgZGVsYXkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLmhpZGUoKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHJlbGV2YW50IGxpc3RlbmVycyBmb3IgdGhlIGluc3RhbmNlXHJcbiAqIEByZXR1cm4ge09iamVjdH0gb2YgbGlzdGVuZXJzXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2dldEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gIHZhciBfdGhpczYgPSB0aGlzO1xyXG5cclxuICB2YXIgb25UcmlnZ2VyID0gZnVuY3Rpb24gb25UcmlnZ2VyKGV2ZW50KSB7XHJcbiAgICBpZiAoIV90aGlzNi5zdGF0ZS5lbmFibGVkKSByZXR1cm47XHJcblxyXG4gICAgdmFyIHNob3VsZFN0b3BFdmVudCA9IGJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiBicm93c2VyLnVzaW5nVG91Y2ggJiYgWydtb3VzZWVudGVyJywgJ21vdXNlb3ZlcicsICdmb2N1cyddLmluZGV4T2YoZXZlbnQudHlwZSkgPiAtMTtcclxuXHJcbiAgICBpZiAoc2hvdWxkU3RvcEV2ZW50ICYmIF90aGlzNi5vcHRpb25zLnRvdWNoSG9sZCkgcmV0dXJuO1xyXG5cclxuICAgIF90aGlzNi5fKGtleSkubGFzdFRyaWdnZXJFdmVudCA9IGV2ZW50O1xyXG5cclxuICAgIC8vIFRvZ2dsZSBzaG93L2hpZGUgd2hlbiBjbGlja2luZyBjbGljay10cmlnZ2VyZWQgdG9vbHRpcHNcclxuICAgIGlmIChldmVudC50eXBlID09PSAnY2xpY2snICYmIF90aGlzNi5vcHRpb25zLmhpZGVPbkNsaWNrICE9PSAncGVyc2lzdGVudCcgJiYgX3RoaXM2LnN0YXRlLnZpc2libGUpIHtcclxuICAgICAgX2xlYXZlLmNhbGwoX3RoaXM2KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIF9lbnRlci5jYWxsKF90aGlzNiwgZXZlbnQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBvbk1vdXNlTGVhdmUgPSBmdW5jdGlvbiBvbk1vdXNlTGVhdmUoZXZlbnQpIHtcclxuICAgIGlmIChbJ21vdXNlbGVhdmUnLCAnbW91c2VvdXQnXS5pbmRleE9mKGV2ZW50LnR5cGUpID4gLTEgJiYgYnJvd3Nlci5zdXBwb3J0c1RvdWNoICYmIGJyb3dzZXIudXNpbmdUb3VjaCAmJiBfdGhpczYub3B0aW9ucy50b3VjaEhvbGQpIHJldHVybjtcclxuXHJcbiAgICBpZiAoX3RoaXM2Lm9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgdmFyIGhpZGUgPSBfbGVhdmUuYmluZChfdGhpczYpO1xyXG5cclxuICAgICAgdmFyIG9uTW91c2VNb3ZlID0gZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcclxuICAgICAgICB2YXIgcmVmZXJlbmNlQ3Vyc29ySXNPdmVyID0gY2xvc2VzdChldmVudC50YXJnZXQsIHNlbGVjdG9ycy5SRUZFUkVOQ0UpO1xyXG4gICAgICAgIHZhciBjdXJzb3JJc092ZXJQb3BwZXIgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3JzLlBPUFBFUikgPT09IF90aGlzNi5wb3BwZXI7XHJcbiAgICAgICAgdmFyIGN1cnNvcklzT3ZlclJlZmVyZW5jZSA9IHJlZmVyZW5jZUN1cnNvcklzT3ZlciA9PT0gX3RoaXM2LnJlZmVyZW5jZTtcclxuXHJcbiAgICAgICAgaWYgKGN1cnNvcklzT3ZlclBvcHBlciB8fCBjdXJzb3JJc092ZXJSZWZlcmVuY2UpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKGN1cnNvcklzT3V0c2lkZUludGVyYWN0aXZlQm9yZGVyKGV2ZW50LCBfdGhpczYucG9wcGVyLCBfdGhpczYub3B0aW9ucykpIHtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGhpZGUpO1xyXG4gICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xyXG5cclxuICAgICAgICAgIF9sZWF2ZS5jYWxsKF90aGlzNiwgb25Nb3VzZU1vdmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGhpZGUpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBfbGVhdmUuY2FsbChfdGhpczYpO1xyXG4gIH07XHJcblxyXG4gIHZhciBvbkJsdXIgPSBmdW5jdGlvbiBvbkJsdXIoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC50YXJnZXQgIT09IF90aGlzNi5yZWZlcmVuY2UgfHwgYnJvd3Nlci51c2luZ1RvdWNoKSByZXR1cm47XHJcblxyXG4gICAgaWYgKF90aGlzNi5vcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgIGlmICghZXZlbnQucmVsYXRlZFRhcmdldCkgcmV0dXJuO1xyXG4gICAgICBpZiAoY2xvc2VzdChldmVudC5yZWxhdGVkVGFyZ2V0LCBzZWxlY3RvcnMuUE9QUEVSKSkgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIF9sZWF2ZS5jYWxsKF90aGlzNik7XHJcbiAgfTtcclxuXHJcbiAgdmFyIG9uRGVsZWdhdGVTaG93ID0gZnVuY3Rpb24gb25EZWxlZ2F0ZVNob3coZXZlbnQpIHtcclxuICAgIGlmIChjbG9zZXN0KGV2ZW50LnRhcmdldCwgX3RoaXM2Lm9wdGlvbnMudGFyZ2V0KSkge1xyXG4gICAgICBfZW50ZXIuY2FsbChfdGhpczYsIGV2ZW50KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgb25EZWxlZ2F0ZUhpZGUgPSBmdW5jdGlvbiBvbkRlbGVnYXRlSGlkZShldmVudCkge1xyXG4gICAgaWYgKGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBfdGhpczYub3B0aW9ucy50YXJnZXQpKSB7XHJcbiAgICAgIF9sZWF2ZS5jYWxsKF90aGlzNik7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG9uVHJpZ2dlcjogb25UcmlnZ2VyLFxyXG4gICAgb25Nb3VzZUxlYXZlOiBvbk1vdXNlTGVhdmUsXHJcbiAgICBvbkJsdXI6IG9uQmx1cixcclxuICAgIG9uRGVsZWdhdGVTaG93OiBvbkRlbGVnYXRlU2hvdyxcclxuICAgIG9uRGVsZWdhdGVIaWRlOiBvbkRlbGVnYXRlSGlkZVxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgbmV3IHBvcHBlciBpbnN0YW5jZVxyXG4gKiBAcmV0dXJuIHtQb3BwZXJ9XHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2NyZWF0ZVBvcHBlckluc3RhbmNlKCkge1xyXG4gIHZhciBfdGhpczcgPSB0aGlzO1xyXG5cclxuICB2YXIgcG9wcGVyID0gdGhpcy5wb3BwZXIsXHJcbiAgICAgIHJlZmVyZW5jZSA9IHRoaXMucmVmZXJlbmNlLFxyXG4gICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICB2YXIgX2dldElubmVyRWxlbWVudHM0ID0gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpLFxyXG4gICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHM0LnRvb2x0aXA7XHJcblxyXG4gIHZhciBwb3BwZXJPcHRpb25zID0gb3B0aW9ucy5wb3BwZXJPcHRpb25zO1xyXG5cclxuICB2YXIgYXJyb3dTZWxlY3RvciA9IG9wdGlvbnMuYXJyb3dUeXBlID09PSAncm91bmQnID8gc2VsZWN0b3JzLlJPVU5EX0FSUk9XIDogc2VsZWN0b3JzLkFSUk9XO1xyXG4gIHZhciBhcnJvdyA9IHRvb2x0aXAucXVlcnlTZWxlY3RvcihhcnJvd1NlbGVjdG9yKTtcclxuXHJcbiAgdmFyIGNvbmZpZyA9IF9leHRlbmRzKHtcclxuICAgIHBsYWNlbWVudDogb3B0aW9ucy5wbGFjZW1lbnRcclxuICB9LCBwb3BwZXJPcHRpb25zIHx8IHt9LCB7XHJcbiAgICBtb2RpZmllcnM6IF9leHRlbmRzKHt9LCBwb3BwZXJPcHRpb25zID8gcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgOiB7fSwge1xyXG4gICAgICBhcnJvdzogX2V4dGVuZHMoe1xyXG4gICAgICAgIGVsZW1lbnQ6IGFycm93U2VsZWN0b3JcclxuICAgICAgfSwgcG9wcGVyT3B0aW9ucyAmJiBwb3BwZXJPcHRpb25zLm1vZGlmaWVycyA/IHBvcHBlck9wdGlvbnMubW9kaWZpZXJzLmFycm93IDoge30pLFxyXG4gICAgICBmbGlwOiBfZXh0ZW5kcyh7XHJcbiAgICAgICAgZW5hYmxlZDogb3B0aW9ucy5mbGlwLFxyXG4gICAgICAgIHBhZGRpbmc6IG9wdGlvbnMuZGlzdGFuY2UgKyA1IC8qIDVweCBmcm9tIHZpZXdwb3J0IGJvdW5kYXJ5ICovXHJcbiAgICAgICAgLCBiZWhhdmlvcjogb3B0aW9ucy5mbGlwQmVoYXZpb3JcclxuICAgICAgfSwgcG9wcGVyT3B0aW9ucyAmJiBwb3BwZXJPcHRpb25zLm1vZGlmaWVycyA/IHBvcHBlck9wdGlvbnMubW9kaWZpZXJzLmZsaXAgOiB7fSksXHJcbiAgICAgIG9mZnNldDogX2V4dGVuZHMoe1xyXG4gICAgICAgIG9mZnNldDogb3B0aW9ucy5vZmZzZXRcclxuICAgICAgfSwgcG9wcGVyT3B0aW9ucyAmJiBwb3BwZXJPcHRpb25zLm1vZGlmaWVycyA/IHBvcHBlck9wdGlvbnMubW9kaWZpZXJzLm9mZnNldCA6IHt9KVxyXG4gICAgfSksXHJcbiAgICBvbkNyZWF0ZTogZnVuY3Rpb24gb25DcmVhdGUoKSB7XHJcbiAgICAgIHRvb2x0aXAuc3R5bGVbZ2V0UG9wcGVyUGxhY2VtZW50KHBvcHBlcildID0gZ2V0T2Zmc2V0RGlzdGFuY2VJblB4KG9wdGlvbnMuZGlzdGFuY2UpO1xyXG5cclxuICAgICAgaWYgKGFycm93ICYmIG9wdGlvbnMuYXJyb3dUcmFuc2Zvcm0pIHtcclxuICAgICAgICBjb21wdXRlQXJyb3dUcmFuc2Zvcm0ocG9wcGVyLCBhcnJvdywgb3B0aW9ucy5hcnJvd1RyYW5zZm9ybSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvblVwZGF0ZTogZnVuY3Rpb24gb25VcGRhdGUoKSB7XHJcbiAgICAgIHZhciBzdHlsZXMgPSB0b29sdGlwLnN0eWxlO1xyXG4gICAgICBzdHlsZXMudG9wID0gJyc7XHJcbiAgICAgIHN0eWxlcy5ib3R0b20gPSAnJztcclxuICAgICAgc3R5bGVzLmxlZnQgPSAnJztcclxuICAgICAgc3R5bGVzLnJpZ2h0ID0gJyc7XHJcbiAgICAgIHN0eWxlc1tnZXRQb3BwZXJQbGFjZW1lbnQocG9wcGVyKV0gPSBnZXRPZmZzZXREaXN0YW5jZUluUHgob3B0aW9ucy5kaXN0YW5jZSk7XHJcblxyXG4gICAgICBpZiAoYXJyb3cgJiYgb3B0aW9ucy5hcnJvd1RyYW5zZm9ybSkge1xyXG4gICAgICAgIGNvbXB1dGVBcnJvd1RyYW5zZm9ybShwb3BwZXIsIGFycm93LCBvcHRpb25zLmFycm93VHJhbnNmb3JtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBfYWRkTXV0YXRpb25PYnNlcnZlci5jYWxsKHRoaXMsIHtcclxuICAgIHRhcmdldDogcG9wcGVyLFxyXG4gICAgY2FsbGJhY2s6IGZ1bmN0aW9uIGNhbGxiYWNrKCkge1xyXG4gICAgICBfdGhpczcucG9wcGVySW5zdGFuY2UudXBkYXRlKCk7XHJcbiAgICB9LFxyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgICAgIHN1YnRyZWU6IHRydWUsXHJcbiAgICAgIGNoYXJhY3RlckRhdGE6IHRydWVcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIG5ldyBQb3BwZXIocmVmZXJlbmNlLCBwb3BwZXIsIGNvbmZpZyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBcHBlbmRzIHRoZSBwb3BwZXIgZWxlbWVudCB0byB0aGUgRE9NLCB1cGRhdGluZyBvciBjcmVhdGluZyB0aGUgcG9wcGVyIGluc3RhbmNlXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX21vdW50KGNhbGxiYWNrKSB7XHJcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG5cclxuICBpZiAoIXRoaXMucG9wcGVySW5zdGFuY2UpIHtcclxuICAgIHRoaXMucG9wcGVySW5zdGFuY2UgPSBfY3JlYXRlUG9wcGVySW5zdGFuY2UuY2FsbCh0aGlzKTtcclxuICAgIGlmICghb3B0aW9ucy5saXZlUGxhY2VtZW50KSB7XHJcbiAgICAgIHRoaXMucG9wcGVySW5zdGFuY2UuZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMucG9wcGVySW5zdGFuY2Uuc2NoZWR1bGVVcGRhdGUoKTtcclxuICAgIGlmIChvcHRpb25zLmxpdmVQbGFjZW1lbnQgJiYgIV9oYXNGb2xsb3dDdXJzb3JCZWhhdmlvci5jYWxsKHRoaXMpKSB7XHJcbiAgICAgIHRoaXMucG9wcGVySW5zdGFuY2UuZW5hYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIElmIHRoZSBpbnN0YW5jZSBwcmV2aW91c2x5IGhhZCBmb2xsb3dDdXJzb3IgYmVoYXZpb3IsIGl0IHdpbGwgYmUgcG9zaXRpb25lZCBpbmNvcnJlY3RseVxyXG4gIC8vIGlmIHRyaWdnZXJlZCBieSBgZm9jdXNgIGFmdGVyd2FyZHMgLSB1cGRhdGUgdGhlIHJlZmVyZW5jZSBiYWNrIHRvIHRoZSByZWFsIERPTSBlbGVtZW50XHJcbiAgaWYgKCFfaGFzRm9sbG93Q3Vyc29yQmVoYXZpb3IuY2FsbCh0aGlzKSkge1xyXG4gICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzNSA9IGdldElubmVyRWxlbWVudHModGhpcy5wb3BwZXIpLFxyXG4gICAgICAgIGFycm93ID0gX2dldElubmVyRWxlbWVudHM1LmFycm93O1xyXG5cclxuICAgIGlmIChhcnJvdykgYXJyb3cuc3R5bGUubWFyZ2luID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlckluc3RhbmNlLnJlZmVyZW5jZSA9IHRoaXMucmVmZXJlbmNlO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUG9wcGVyUG9zaXRpb24odGhpcy5wb3BwZXJJbnN0YW5jZSwgY2FsbGJhY2ssIHRydWUpO1xyXG5cclxuICBpZiAoIW9wdGlvbnMuYXBwZW5kVG8uY29udGFpbnModGhpcy5wb3BwZXIpKSB7XHJcbiAgICBvcHRpb25zLmFwcGVuZFRvLmFwcGVuZENoaWxkKHRoaXMucG9wcGVyKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGVhcnMgdGhlIHNob3cgYW5kIGhpZGUgZGVsYXkgdGltZW91dHNcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfY2xlYXJEZWxheVRpbWVvdXRzKCkge1xyXG4gIHZhciBfcmVmID0gdGhpcy5fKGtleSksXHJcbiAgICAgIHNob3dUaW1lb3V0ID0gX3JlZi5zaG93VGltZW91dCxcclxuICAgICAgaGlkZVRpbWVvdXQgPSBfcmVmLmhpZGVUaW1lb3V0O1xyXG5cclxuICBjbGVhclRpbWVvdXQoc2hvd1RpbWVvdXQpO1xyXG4gIGNsZWFyVGltZW91dChoaWRlVGltZW91dCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSBtb3VzZW1vdmUgZXZlbnQgbGlzdGVuZXIgZnVuY3Rpb24gZm9yIGBmb2xsb3dDdXJzb3JgIG9wdGlvblxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9zZXRGb2xsb3dDdXJzb3JMaXN0ZW5lcigpIHtcclxuICB2YXIgX3RoaXM4ID0gdGhpcztcclxuXHJcbiAgdGhpcy5fKGtleSkuZm9sbG93Q3Vyc29yTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciBfJGxhc3RNb3VzZU1vdmVFdmVudCA9IF90aGlzOC5fKGtleSkubGFzdE1vdXNlTW92ZUV2ZW50ID0gZXZlbnQsXHJcbiAgICAgICAgY2xpZW50WCA9IF8kbGFzdE1vdXNlTW92ZUV2ZW50LmNsaWVudFgsXHJcbiAgICAgICAgY2xpZW50WSA9IF8kbGFzdE1vdXNlTW92ZUV2ZW50LmNsaWVudFk7XHJcblxyXG4gICAgaWYgKCFfdGhpczgucG9wcGVySW5zdGFuY2UpIHJldHVybjtcclxuXHJcbiAgICBfdGhpczgucG9wcGVySW5zdGFuY2UucmVmZXJlbmNlID0ge1xyXG4gICAgICBnZXRCb3VuZGluZ0NsaWVudFJlY3Q6IGZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICBoZWlnaHQ6IDAsXHJcbiAgICAgICAgICB0b3A6IGNsaWVudFksXHJcbiAgICAgICAgICBsZWZ0OiBjbGllbnRYLFxyXG4gICAgICAgICAgcmlnaHQ6IGNsaWVudFgsXHJcbiAgICAgICAgICBib3R0b206IGNsaWVudFlcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgICBjbGllbnRXaWR0aDogMCxcclxuICAgICAgY2xpZW50SGVpZ2h0OiAwXHJcbiAgICB9O1xyXG5cclxuICAgIF90aGlzOC5wb3BwZXJJbnN0YW5jZS5zY2hlZHVsZVVwZGF0ZSgpO1xyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGVzIHRoZSBwb3BwZXIncyBwb3NpdGlvbiBvbiBlYWNoIGFuaW1hdGlvbiBmcmFtZVxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9tYWtlU3RpY2t5KCkge1xyXG4gIHZhciBfdGhpczkgPSB0aGlzO1xyXG5cclxuICB2YXIgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24kJDEgPSBmdW5jdGlvbiBhcHBseVRyYW5zaXRpb25EdXJhdGlvbiQkMSgpIHtcclxuICAgIF90aGlzOS5wb3BwZXIuc3R5bGVbcHJlZml4KCd0cmFuc2l0aW9uRHVyYXRpb24nKV0gPSBfdGhpczkub3B0aW9ucy51cGRhdGVEdXJhdGlvbiArICdtcyc7XHJcbiAgfTtcclxuXHJcbiAgdmFyIHJlbW92ZVRyYW5zaXRpb25EdXJhdGlvbiA9IGZ1bmN0aW9uIHJlbW92ZVRyYW5zaXRpb25EdXJhdGlvbigpIHtcclxuICAgIF90aGlzOS5wb3BwZXIuc3R5bGVbcHJlZml4KCd0cmFuc2l0aW9uRHVyYXRpb24nKV0gPSAnJztcclxuICB9O1xyXG5cclxuICB2YXIgdXBkYXRlUG9zaXRpb24gPSBmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbigpIHtcclxuICAgIGlmIChfdGhpczkucG9wcGVySW5zdGFuY2UpIHtcclxuICAgICAgX3RoaXM5LnBvcHBlckluc3RhbmNlLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uJCQxKCk7XHJcblxyXG4gICAgaWYgKF90aGlzOS5zdGF0ZS52aXNpYmxlKSB7XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVQb3NpdGlvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZW1vdmVUcmFuc2l0aW9uRHVyYXRpb24oKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB1cGRhdGVQb3NpdGlvbigpO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkcyBhIG11dGF0aW9uIG9ic2VydmVyIHRvIGFuIGVsZW1lbnQgYW5kIHN0b3JlcyBpdCBpbiB0aGUgaW5zdGFuY2VcclxuICogQHBhcmFtIHtPYmplY3R9XHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2FkZE11dGF0aW9uT2JzZXJ2ZXIoX3JlZjIpIHtcclxuICB2YXIgdGFyZ2V0ID0gX3JlZjIudGFyZ2V0LFxyXG4gICAgICBjYWxsYmFjayA9IF9yZWYyLmNhbGxiYWNrLFxyXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucztcclxuXHJcbiAgaWYgKCF3aW5kb3cuTXV0YXRpb25PYnNlcnZlcikgcmV0dXJuO1xyXG5cclxuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XHJcbiAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXQsIG9wdGlvbnMpO1xyXG5cclxuICB0aGlzLl8oa2V5KS5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZpcmVzIHRoZSBjYWxsYmFjayBmdW5jdGlvbnMgb25jZSB0aGUgQ1NTIHRyYW5zaXRpb24gZW5kcyBmb3IgYHNob3dgIGFuZCBgaGlkZWAgbWV0aG9kc1xyXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvbiB0byBmaXJlIG9uY2UgdHJhbnNpdGlvbiBjb21wbGV0ZXNcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfb25UcmFuc2l0aW9uRW5kKGR1cmF0aW9uLCBjYWxsYmFjaykge1xyXG4gIC8vIE1ha2UgY2FsbGJhY2sgc3luY2hyb25vdXMgaWYgZHVyYXRpb24gaXMgMFxyXG4gIGlmICghZHVyYXRpb24pIHtcclxuICAgIHJldHVybiBjYWxsYmFjaygpO1xyXG4gIH1cclxuXHJcbiAgdmFyIF9nZXRJbm5lckVsZW1lbnRzNiA9IGdldElubmVyRWxlbWVudHModGhpcy5wb3BwZXIpLFxyXG4gICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHM2LnRvb2x0aXA7XHJcblxyXG4gIHZhciB0b2dnbGVMaXN0ZW5lcnMgPSBmdW5jdGlvbiB0b2dnbGVMaXN0ZW5lcnMoYWN0aW9uLCBsaXN0ZW5lcikge1xyXG4gICAgaWYgKCFsaXN0ZW5lcikgcmV0dXJuO1xyXG4gICAgdG9vbHRpcFthY3Rpb24gKyAnRXZlbnRMaXN0ZW5lciddKCdvbnRyYW5zaXRpb25lbmQnIGluIHdpbmRvdyA/ICd0cmFuc2l0aW9uZW5kJyA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJywgbGlzdGVuZXIpO1xyXG4gIH07XHJcblxyXG4gIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uIGxpc3RlbmVyKGUpIHtcclxuICAgIGlmIChlLnRhcmdldCA9PT0gdG9vbHRpcCkge1xyXG4gICAgICB0b2dnbGVMaXN0ZW5lcnMoJ3JlbW92ZScsIGxpc3RlbmVyKTtcclxuICAgICAgY2FsbGJhY2soKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB0b2dnbGVMaXN0ZW5lcnMoJ3JlbW92ZScsIHRoaXMuXyhrZXkpLnRyYW5zaXRpb25lbmRMaXN0ZW5lcik7XHJcbiAgdG9nZ2xlTGlzdGVuZXJzKCdhZGQnLCBsaXN0ZW5lcik7XHJcblxyXG4gIHRoaXMuXyhrZXkpLnRyYW5zaXRpb25lbmRMaXN0ZW5lciA9IGxpc3RlbmVyO1xyXG59XHJcblxyXG52YXIgaWRDb3VudGVyID0gMTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIHRvb2x0aXBzIGZvciBlYWNoIHJlZmVyZW5jZSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbHNcclxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gKiBAcmV0dXJuIHtUaXBweVtdfSBBcnJheSBvZiBUaXBweSBpbnN0YW5jZXNcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXBzKGVscywgY29uZmlnKSB7XHJcbiAgcmV0dXJuIGVscy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcmVmZXJlbmNlKSB7XHJcbiAgICB2YXIgaWQgPSBpZENvdW50ZXI7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSBldmFsdWF0ZU9wdGlvbnMocmVmZXJlbmNlLCBjb25maWcucGVyZm9ybWFuY2UgPyBjb25maWcgOiBnZXRJbmRpdmlkdWFsT3B0aW9ucyhyZWZlcmVuY2UsIGNvbmZpZykpO1xyXG5cclxuICAgIHZhciB0aXRsZSA9IHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoJ3RpdGxlJyk7XHJcblxyXG4gICAgLy8gRG9uJ3QgY3JlYXRlIGFuIGluc3RhbmNlIHdoZW46XHJcbiAgICAvLyAqIHRoZSBgdGl0bGVgIGF0dHJpYnV0ZSBpcyBmYWxzeSAobnVsbCBvciBlbXB0eSBzdHJpbmcpLCBhbmRcclxuICAgIC8vICogaXQncyBub3QgYSBkZWxlZ2F0ZSBmb3IgdG9vbHRpcHMsIGFuZFxyXG4gICAgLy8gKiB0aGVyZSBpcyBubyBodG1sIHRlbXBsYXRlIHNwZWNpZmllZCwgYW5kXHJcbiAgICAvLyAqIGBkeW5hbWljVGl0bGVgIG9wdGlvbiBpcyBmYWxzZVxyXG4gICAgaWYgKCF0aXRsZSAmJiAhb3B0aW9ucy50YXJnZXQgJiYgIW9wdGlvbnMuaHRtbCAmJiAhb3B0aW9ucy5keW5hbWljVGl0bGUpIHtcclxuICAgICAgcmV0dXJuIGFjYztcclxuICAgIH1cclxuXHJcbiAgICAvLyBEZWxlZ2F0ZXMgc2hvdWxkIGJlIGhpZ2hsaWdodGVkIGFzIGRpZmZlcmVudFxyXG4gICAgcmVmZXJlbmNlLnNldEF0dHJpYnV0ZShvcHRpb25zLnRhcmdldCA/ICdkYXRhLXRpcHB5LWRlbGVnYXRlJyA6ICdkYXRhLXRpcHB5JywgJycpO1xyXG5cclxuICAgIHJlbW92ZVRpdGxlKHJlZmVyZW5jZSk7XHJcblxyXG4gICAgdmFyIHBvcHBlciA9IGNyZWF0ZVBvcHBlckVsZW1lbnQoaWQsIHRpdGxlLCBvcHRpb25zKTtcclxuXHJcbiAgICB2YXIgdGlwcHkgPSBuZXcgVGlwcHkoe1xyXG4gICAgICBpZDogaWQsXHJcbiAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLFxyXG4gICAgICBwb3BwZXI6IHBvcHBlcixcclxuICAgICAgb3B0aW9uczogb3B0aW9ucyxcclxuICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICBwb3BwZXJJbnN0YW5jZTogbnVsbFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuY3JlYXRlUG9wcGVySW5zdGFuY2VPbkluaXQpIHtcclxuICAgICAgdGlwcHkucG9wcGVySW5zdGFuY2UgPSBfY3JlYXRlUG9wcGVySW5zdGFuY2UuY2FsbCh0aXBweSk7XHJcbiAgICAgIHRpcHB5LnBvcHBlckluc3RhbmNlLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaXN0ZW5lcnMgPSBfZ2V0RXZlbnRMaXN0ZW5lcnMuY2FsbCh0aXBweSk7XHJcbiAgICB0aXBweS5saXN0ZW5lcnMgPSBvcHRpb25zLnRyaWdnZXIudHJpbSgpLnNwbGl0KCcgJykucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGV2ZW50VHlwZSkge1xyXG4gICAgICByZXR1cm4gYWNjLmNvbmNhdChjcmVhdGVUcmlnZ2VyKGV2ZW50VHlwZSwgcmVmZXJlbmNlLCBsaXN0ZW5lcnMsIG9wdGlvbnMpKTtcclxuICAgIH0sIFtdKTtcclxuXHJcbiAgICAvLyBVcGRhdGUgdG9vbHRpcCBjb250ZW50IHdoZW5ldmVyIHRoZSB0aXRsZSBhdHRyaWJ1dGUgb24gdGhlIHJlZmVyZW5jZSBjaGFuZ2VzXHJcbiAgICBpZiAob3B0aW9ucy5keW5hbWljVGl0bGUpIHtcclxuICAgICAgX2FkZE11dGF0aW9uT2JzZXJ2ZXIuY2FsbCh0aXBweSwge1xyXG4gICAgICAgIHRhcmdldDogcmVmZXJlbmNlLFxyXG4gICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiBjYWxsYmFjaygpIHtcclxuICAgICAgICAgIHZhciBfZ2V0SW5uZXJFbGVtZW50cyA9IGdldElubmVyRWxlbWVudHMocG9wcGVyKSxcclxuICAgICAgICAgICAgICBjb250ZW50ID0gX2dldElubmVyRWxlbWVudHMuY29udGVudDtcclxuXHJcbiAgICAgICAgICB2YXIgdGl0bGUgPSByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCd0aXRsZScpO1xyXG4gICAgICAgICAgaWYgKHRpdGxlKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnRbb3B0aW9ucy5hbGxvd1RpdGxlSFRNTCA/ICdpbm5lckhUTUwnIDogJ3RleHRDb250ZW50J10gPSB0aXBweS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICByZW1vdmVUaXRsZShyZWZlcmVuY2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNob3J0Y3V0c1xyXG4gICAgcmVmZXJlbmNlLl90aXBweSA9IHRpcHB5O1xyXG4gICAgcG9wcGVyLl90aXBweSA9IHRpcHB5O1xyXG4gICAgcG9wcGVyLl9yZWZlcmVuY2UgPSByZWZlcmVuY2U7XHJcblxyXG4gICAgYWNjLnB1c2godGlwcHkpO1xyXG5cclxuICAgIGlkQ291bnRlcisrO1xyXG5cclxuICAgIHJldHVybiBhY2M7XHJcbiAgfSwgW10pO1xyXG59XHJcblxyXG4vKipcclxuICogSGlkZXMgYWxsIHBvcHBlcnNcclxuICogQHBhcmFtIHtUaXBweX0gZXhjbHVkZVRpcHB5IC0gdGlwcHkgdG8gZXhjbHVkZSBpZiBuZWVkZWRcclxuICovXHJcbmZ1bmN0aW9uIGhpZGVBbGxQb3BwZXJzKGV4Y2x1ZGVUaXBweSkge1xyXG4gIHZhciBwb3BwZXJzID0gdG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5QT1BQRVIpKTtcclxuXHJcbiAgcG9wcGVycy5mb3JFYWNoKGZ1bmN0aW9uIChwb3BwZXIpIHtcclxuICAgIHZhciB0aXBweSA9IHBvcHBlci5fdGlwcHk7XHJcbiAgICBpZiAoIXRpcHB5KSByZXR1cm47XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSB0aXBweS5vcHRpb25zO1xyXG5cclxuXHJcbiAgICBpZiAoKG9wdGlvbnMuaGlkZU9uQ2xpY2sgPT09IHRydWUgfHwgb3B0aW9ucy50cmlnZ2VyLmluZGV4T2YoJ2ZvY3VzJykgPiAtMSkgJiYgKCFleGNsdWRlVGlwcHkgfHwgcG9wcGVyICE9PSBleGNsdWRlVGlwcHkucG9wcGVyKSkge1xyXG4gICAgICB0aXBweS5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGRzIHRoZSBuZWVkZWQgZXZlbnQgbGlzdGVuZXJzXHJcbiAqL1xyXG5mdW5jdGlvbiBiaW5kRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgdmFyIG9uRG9jdW1lbnRUb3VjaCA9IGZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaCgpIHtcclxuICAgIGlmIChicm93c2VyLnVzaW5nVG91Y2gpIHJldHVybjtcclxuXHJcbiAgICBicm93c2VyLnVzaW5nVG91Y2ggPSB0cnVlO1xyXG5cclxuICAgIGlmIChicm93c2VyLmlPUykge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RpcHB5LXRvdWNoJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGJyb3dzZXIuZHluYW1pY0lucHV0RGV0ZWN0aW9uICYmIHdpbmRvdy5wZXJmb3JtYW5jZSkge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbkRvY3VtZW50TW91c2VNb3ZlKTtcclxuICAgIH1cclxuXHJcbiAgICBicm93c2VyLm9uVXNlcklucHV0Q2hhbmdlKCd0b3VjaCcpO1xyXG4gIH07XHJcblxyXG4gIHZhciBvbkRvY3VtZW50TW91c2VNb3ZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHRpbWUgPSB2b2lkIDA7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgLy8gQ2hyb21lIDYwKyBpcyAxIG1vdXNlbW92ZSBwZXIgYW5pbWF0aW9uIGZyYW1lLCB1c2UgMjBtcyB0aW1lIGRpZmZlcmVuY2VcclxuICAgICAgaWYgKG5vdyAtIHRpbWUgPCAyMCkge1xyXG4gICAgICAgIGJyb3dzZXIudXNpbmdUb3VjaCA9IGZhbHNlO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uRG9jdW1lbnRNb3VzZU1vdmUpO1xyXG4gICAgICAgIGlmICghYnJvd3Nlci5pT1MpIHtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgndGlwcHktdG91Y2gnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJvd3Nlci5vblVzZXJJbnB1dENoYW5nZSgnbW91c2UnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGltZSA9IG5vdztcclxuICAgIH07XHJcbiAgfSgpO1xyXG5cclxuICB2YXIgb25Eb2N1bWVudENsaWNrID0gZnVuY3Rpb24gb25Eb2N1bWVudENsaWNrKGV2ZW50KSB7XHJcbiAgICAvLyBTaW11bGF0ZWQgZXZlbnRzIGRpc3BhdGNoZWQgb24gdGhlIGRvY3VtZW50XHJcbiAgICBpZiAoIShldmVudC50YXJnZXQgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xyXG4gICAgICByZXR1cm4gaGlkZUFsbFBvcHBlcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVmZXJlbmNlID0gY2xvc2VzdChldmVudC50YXJnZXQsIHNlbGVjdG9ycy5SRUZFUkVOQ0UpO1xyXG4gICAgdmFyIHBvcHBlciA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBzZWxlY3RvcnMuUE9QUEVSKTtcclxuXHJcbiAgICBpZiAocG9wcGVyICYmIHBvcHBlci5fdGlwcHkgJiYgcG9wcGVyLl90aXBweS5vcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVmZXJlbmNlICYmIHJlZmVyZW5jZS5fdGlwcHkpIHtcclxuICAgICAgdmFyIG9wdGlvbnMgPSByZWZlcmVuY2UuX3RpcHB5Lm9wdGlvbnM7XHJcblxyXG4gICAgICB2YXIgaXNDbGlja1RyaWdnZXIgPSBvcHRpb25zLnRyaWdnZXIuaW5kZXhPZignY2xpY2snKSA+IC0xO1xyXG4gICAgICB2YXIgaXNNdWx0aXBsZSA9IG9wdGlvbnMubXVsdGlwbGU7XHJcblxyXG4gICAgICAvLyBIaWRlIGFsbCBwb3BwZXJzIGV4Y2VwdCB0aGUgb25lIGJlbG9uZ2luZyB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBjbGlja2VkXHJcbiAgICAgIGlmICghaXNNdWx0aXBsZSAmJiBicm93c2VyLnVzaW5nVG91Y2ggfHwgIWlzTXVsdGlwbGUgJiYgaXNDbGlja1RyaWdnZXIpIHtcclxuICAgICAgICByZXR1cm4gaGlkZUFsbFBvcHBlcnMocmVmZXJlbmNlLl90aXBweSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmhpZGVPbkNsaWNrICE9PSB0cnVlIHx8IGlzQ2xpY2tUcmlnZ2VyKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZUFsbFBvcHBlcnMoKTtcclxuICB9O1xyXG5cclxuICB2YXIgb25XaW5kb3dCbHVyID0gZnVuY3Rpb24gb25XaW5kb3dCbHVyKCkge1xyXG4gICAgdmFyIF9kb2N1bWVudCA9IGRvY3VtZW50LFxyXG4gICAgICAgIGVsID0gX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcblxyXG4gICAgaWYgKGVsICYmIGVsLmJsdXIgJiYgbWF0Y2hlcyQxLmNhbGwoZWwsIHNlbGVjdG9ycy5SRUZFUkVOQ0UpKSB7XHJcbiAgICAgIGVsLmJsdXIoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgb25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcclxuICAgIHRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMuUE9QUEVSKSkuZm9yRWFjaChmdW5jdGlvbiAocG9wcGVyKSB7XHJcbiAgICAgIHZhciB0aXBweUluc3RhbmNlID0gcG9wcGVyLl90aXBweTtcclxuICAgICAgaWYgKHRpcHB5SW5zdGFuY2UgJiYgIXRpcHB5SW5zdGFuY2Uub3B0aW9ucy5saXZlUGxhY2VtZW50KSB7XHJcbiAgICAgICAgdGlwcHlJbnN0YW5jZS5wb3BwZXJJbnN0YW5jZS5zY2hlZHVsZVVwZGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uRG9jdW1lbnRDbGljayk7XHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uRG9jdW1lbnRUb3VjaCk7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbldpbmRvd0JsdXIpO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XHJcblxyXG4gIGlmICghYnJvd3Nlci5zdXBwb3J0c1RvdWNoICYmIChuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgfHwgbmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMpKSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIG9uRG9jdW1lbnRUb3VjaCk7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgZXZlbnRMaXN0ZW5lcnNCb3VuZCA9IGZhbHNlO1xyXG5cclxuLyoqXHJcbiAqIEV4cG9ydGVkIG1vZHVsZVxyXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fEVsZW1lbnRbXXxOb2RlTGlzdHxPYmplY3R9IHNlbGVjdG9yXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25lIC0gY3JlYXRlIG9uZSB0b29sdGlwXHJcbiAqIEByZXR1cm4ge09iamVjdH1cclxuICovXHJcbmZ1bmN0aW9uIHRpcHB5JDEoc2VsZWN0b3IsIG9wdGlvbnMsIG9uZSkge1xyXG4gIGlmIChicm93c2VyLnN1cHBvcnRlZCAmJiAhZXZlbnRMaXN0ZW5lcnNCb3VuZCkge1xyXG4gICAgYmluZEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICBldmVudExpc3RlbmVyc0JvdW5kID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGlmIChpc09iamVjdExpdGVyYWwoc2VsZWN0b3IpKSB7XHJcbiAgICBwb2x5ZmlsbFZpcnR1YWxSZWZlcmVuY2VQcm9wcyhzZWxlY3Rvcik7XHJcbiAgfVxyXG5cclxuICBvcHRpb25zID0gX2V4dGVuZHMoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgdmFyIHJlZmVyZW5jZXMgPSBnZXRBcnJheU9mRWxlbWVudHMoc2VsZWN0b3IpO1xyXG4gIHZhciBmaXJzdFJlZmVyZW5jZSA9IHJlZmVyZW5jZXNbMF07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXHJcbiAgICBvcHRpb25zOiBvcHRpb25zLFxyXG4gICAgdG9vbHRpcHM6IGJyb3dzZXIuc3VwcG9ydGVkID8gY3JlYXRlVG9vbHRpcHMob25lICYmIGZpcnN0UmVmZXJlbmNlID8gW2ZpcnN0UmVmZXJlbmNlXSA6IHJlZmVyZW5jZXMsIG9wdGlvbnMpIDogW10sXHJcbiAgICBkZXN0cm95QWxsOiBmdW5jdGlvbiBkZXN0cm95QWxsKCkge1xyXG4gICAgICB0aGlzLnRvb2x0aXBzLmZvckVhY2goZnVuY3Rpb24gKHRvb2x0aXApIHtcclxuICAgICAgICByZXR1cm4gdG9vbHRpcC5kZXN0cm95KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLnRvb2x0aXBzID0gW107XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxudGlwcHkkMS52ZXJzaW9uID0gdmVyc2lvbjtcclxudGlwcHkkMS5icm93c2VyID0gYnJvd3NlcjtcclxudGlwcHkkMS5kZWZhdWx0cyA9IGRlZmF1bHRzO1xyXG50aXBweSQxLm9uZSA9IGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0aW9ucykge1xyXG4gIHJldHVybiB0aXBweSQxKHNlbGVjdG9yLCBvcHRpb25zLCB0cnVlKS50b29sdGlwc1swXTtcclxufTtcclxudGlwcHkkMS5kaXNhYmxlQW5pbWF0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICBkZWZhdWx0cy51cGRhdGVEdXJhdGlvbiA9IGRlZmF1bHRzLmR1cmF0aW9uID0gMDtcclxuICBkZWZhdWx0cy5hbmltYXRlRmlsbCA9IGZhbHNlO1xyXG59O1xyXG5cclxucmV0dXJuIHRpcHB5JDE7XHJcblxyXG59KSkpO1xyXG4iXX0=
