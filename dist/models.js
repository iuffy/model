require("source-map-support").install()
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(5);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(2);
	
	__webpack_require__(3);
	
	__webpack_require__(4);
	
	if (global._babelPolyfill) {
	  throw new Error("only one instance of babel-polyfill is allowed");
	}
	global._babelPolyfill = true;
	
	var DEFINE_PROPERTY = "defineProperty";
	function define(O, key, value) {
	  O[key] || Object[DEFINE_PROPERTY](O, key, {
	    writable: true,
	    configurable: true,
	    value: value
	  });
	}
	
	define(String.prototype, "padLeft", "".padStart);
	define(String.prototype, "padRight", "".padEnd);
	
	"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
	  [][key] && define(Array, key, Function.call.bind([][key]));
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("core-js/shim");

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */
	
	!(function(global) {
	  "use strict";
	
	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	
	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }
	
	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};
	
	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);
	
	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);
	
	    return generator;
	  }
	  runtime.wrap = wrap;
	
	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }
	
	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";
	
	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};
	
	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}
	
	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };
	
	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }
	
	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] =
	    GeneratorFunction.displayName = "GeneratorFunction";
	
	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }
	
	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };
	
	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };
	
	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  runtime.awrap = function(arg) {
	    return { __await: arg };
	  };
	
	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return Promise.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }
	
	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration. If the Promise is rejected, however, the
	          // result for this iteration will be rejected with the same
	          // reason. Note that rejections of yielded Promises are not
	          // thrown back into the generator function, as is the case
	          // when an awaited Promise is rejected. This difference in
	          // behavior between yield and await is important, because it
	          // allows the consumer to decide what to do with the yielded
	          // rejection (swallow it and continue, manually .throw it back
	          // into the generator, abandon iteration, whatever). With
	          // await, by contrast, there is no opportunity to examine the
	          // rejection reason outside the generator function, so the
	          // only option is to throw it from the await expression, and
	          // let the generator function handle the exception.
	          result.value = unwrapped;
	          resolve(result);
	        }, reject);
	      }
	    }
	
	    if (typeof process === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }
	
	    var previousPromise;
	
	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }
	
	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }
	
	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }
	
	  defineIteratorMethods(AsyncIterator.prototype);
	  runtime.AsyncIterator = AsyncIterator;
	
	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );
	
	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };
	
	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;
	
	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }
	
	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }
	
	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }
	
	      context.method = method;
	      context.arg = arg;
	
	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }
	
	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;
	
	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }
	
	          context.dispatchException(context.arg);
	
	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }
	
	        state = GenStateExecuting;
	
	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;
	
	          if (record.arg === ContinueSentinel) {
	            continue;
	          }
	
	          return {
	            value: record.arg,
	            done: context.done
	          };
	
	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }
	
	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;
	
	      if (context.method === "throw") {
	        if (delegate.iterator.return) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined;
	          maybeInvokeDelegate(delegate, context);
	
	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }
	
	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }
	
	      return ContinueSentinel;
	    }
	
	    var record = tryCatch(method, delegate.iterator, context.arg);
	
	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }
	
	    var info = record.arg;
	
	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }
	
	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;
	
	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;
	
	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined;
	      }
	
	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }
	
	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }
	
	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);
	
	  Gp[toStringTagSymbol] = "Generator";
	
	  Gp.toString = function() {
	    return "[object Generator]";
	  };
	
	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };
	
	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }
	
	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }
	
	    this.tryEntries.push(entry);
	  }
	
	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }
	
	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }
	
	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();
	
	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }
	
	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };
	
	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }
	
	      if (typeof iterable.next === "function") {
	        return iterable;
	      }
	
	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }
	
	          next.value = undefined;
	          next.done = true;
	
	          return next;
	        };
	
	        return next.next = next;
	      }
	    }
	
	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;
	
	  function doneResult() {
	    return { value: undefined, done: true };
	  }
	
	  Context.prototype = {
	    constructor: Context,
	
	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined;
	      this.done = false;
	      this.delegate = null;
	
	      this.method = "next";
	      this.arg = undefined;
	
	      this.tryEntries.forEach(resetTryEntry);
	
	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },
	
	    stop: function() {
	      this.done = true;
	
	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }
	
	      return this.rval;
	    },
	
	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }
	
	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	
	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined;
	        }
	
	        return !! caught;
	      }
	
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;
	
	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }
	
	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");
	
	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },
	
	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }
	
	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }
	
	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;
	
	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }
	
	      return this.complete(record);
	    },
	
	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }
	
	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	
	      return ContinueSentinel;
	    },
	
	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },
	
	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }
	
	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },
	
	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };
	
	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined;
	      }
	
	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this
	);


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("core-js/fn/regexp/escape");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.configure = exports.errors = undefined;
	
	__webpack_require__(6);
	
	var _models = __webpack_require__(7);
	
	var models = _interopRequireWildcard(_models);
	
	var _db = __webpack_require__(16);
	
	var _db2 = _interopRequireDefault(_db);
	
	var _errors2 = __webpack_require__(11);
	
	var _errors3 = _interopRequireDefault(_errors2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	global.db = _db2.default;
	
	exports.default = models;
	exports.errors = _errors3.default;
	var configure = exports.configure = function () {
	  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(options) {
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            global.hashSalt = options.secret.hash;
	            _context.next = 3;
	            return _db2.default.configure(options.database);
	
	          case 3:
	            return _context.abrupt('return', _context.sent);
	
	          case 4:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined);
	  }));
	
	  return function configure(_x) {
	    return _ref.apply(this, arguments);
	  };
	}();

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */
	
	!(function(global) {
	  "use strict";
	
	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	
	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }
	
	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};
	
	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided, then outerFn.prototype instanceof Generator.
	    var generator = Object.create((outerFn || Generator).prototype);
	    var context = new Context(tryLocsList || []);
	
	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);
	
	    return generator;
	  }
	  runtime.wrap = wrap;
	
	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }
	
	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";
	
	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};
	
	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}
	
	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";
	
	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }
	
	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };
	
	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };
	
	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `value instanceof AwaitArgument` to determine if the yielded value is
	  // meant to be awaited. Some may consider the name of this method too
	  // cutesy, but they are curmudgeons.
	  runtime.awrap = function(arg) {
	    return new AwaitArgument(arg);
	  };
	
	  function AwaitArgument(arg) {
	    this.arg = arg;
	  }
	
	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value instanceof AwaitArgument) {
	          return Promise.resolve(value.arg).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }
	
	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration. If the Promise is rejected, however, the
	          // result for this iteration will be rejected with the same
	          // reason. Note that rejections of yielded Promises are not
	          // thrown back into the generator function, as is the case
	          // when an awaited Promise is rejected. This difference in
	          // behavior between yield and await is important, because it
	          // allows the consumer to decide what to do with the yielded
	          // rejection (swallow it and continue, manually .throw it back
	          // into the generator, abandon iteration, whatever). With
	          // await, by contrast, there is no opportunity to examine the
	          // rejection reason outside the generator function, so the
	          // only option is to throw it from the await expression, and
	          // let the generator function handle the exception.
	          result.value = unwrapped;
	          resolve(result);
	        }, reject);
	      }
	    }
	
	    if (typeof process === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }
	
	    var previousPromise;
	
	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }
	
	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }
	
	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }
	
	  defineIteratorMethods(AsyncIterator.prototype);
	
	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );
	
	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };
	
	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;
	
	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }
	
	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }
	
	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }
	
	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          if (method === "return" ||
	              (method === "throw" && delegate.iterator[method] === undefined)) {
	            // A return or throw (when the delegate iterator has no throw
	            // method) always terminates the yield* loop.
	            context.delegate = null;
	
	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            var returnMethod = delegate.iterator["return"];
	            if (returnMethod) {
	              var record = tryCatch(returnMethod, delegate.iterator, arg);
	              if (record.type === "throw") {
	                // If the return method threw an exception, let that
	                // exception prevail over the original return or throw.
	                method = "throw";
	                arg = record.arg;
	                continue;
	              }
	            }
	
	            if (method === "return") {
	              // Continue with the outer return, now that the delegate
	              // iterator has been terminated.
	              continue;
	            }
	          }
	
	          var record = tryCatch(
	            delegate.iterator[method],
	            delegate.iterator,
	            arg
	          );
	
	          if (record.type === "throw") {
	            context.delegate = null;
	
	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	            continue;
	          }
	
	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;
	
	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }
	
	          context.delegate = null;
	        }
	
	        if (method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = arg;
	
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }
	
	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }
	
	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }
	
	        state = GenStateExecuting;
	
	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;
	
	          var info = {
	            value: record.arg,
	            done: context.done
	          };
	
	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }
	
	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(arg) call above.
	          method = "throw";
	          arg = record.arg;
	        }
	      }
	    };
	  }
	
	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);
	
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };
	
	  Gp[toStringTagSymbol] = "Generator";
	
	  Gp.toString = function() {
	    return "[object Generator]";
	  };
	
	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };
	
	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }
	
	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }
	
	    this.tryEntries.push(entry);
	  }
	
	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }
	
	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }
	
	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();
	
	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }
	
	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };
	
	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }
	
	      if (typeof iterable.next === "function") {
	        return iterable;
	      }
	
	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }
	
	          next.value = undefined;
	          next.done = true;
	
	          return next;
	        };
	
	        return next.next = next;
	      }
	    }
	
	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;
	
	  function doneResult() {
	    return { value: undefined, done: true };
	  }
	
	  Context.prototype = {
	    constructor: Context,
	
	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined;
	      this.done = false;
	      this.delegate = null;
	
	      this.tryEntries.forEach(resetTryEntry);
	
	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },
	
	    stop: function() {
	      this.done = true;
	
	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }
	
	      return this.rval;
	    },
	
	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }
	
	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }
	
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;
	
	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }
	
	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");
	
	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },
	
	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }
	
	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }
	
	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;
	
	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }
	
	      return ContinueSentinel;
	    },
	
	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }
	
	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	    },
	
	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },
	
	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }
	
	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },
	
	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };
	
	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this
	);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _hello = __webpack_require__(8);
	
	Object.keys(_hello).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _hello[key];
	    }
	  });
	});
	
	var _user = __webpack_require__(9);
	
	Object.keys(_user).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _user[key];
	    }
	  });
	});

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Hello = exports.Hello = function () {
	  function Hello() {
	    _classCallCheck(this, Hello);
	  }
	
	  _createClass(Hello, null, [{
	    key: "say",
	    value: function say(hi) {
	      return hi;
	    }
	  }]);

	  return Hello;
	}();

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.User = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(10);
	
	var _errors = __webpack_require__(11);
	
	var _errors2 = _interopRequireDefault(_errors);
	
	var _validator = __webpack_require__(14);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ERRORS = {
	  InvalidIdentification: 401,
	  EmailDuplicated: 400,
	  CreateUserFailed: 400,
	  UpdateUserFailed: 400,
	  InvalidProfile: 400,
	  UserInactive: 400
	};
	
	_errors2.default.register(ERRORS);
	
	var User = exports.User = function () {
	  function User(data) {
	    _classCallCheck(this, User);
	
	    if (data) {
	      if (data.id) this.id = data.id;
	      if (data.email) this.email = data.email;
	      if (data.nickname) this.nickname = data.nickname;
	      if (data.avatar) this.avatar = data.avatar;
	    }
	  }
	
	  _createClass(User, [{
	    key: 'create',
	
	
	    // 第一版简化流程，不验证邮箱所有者，只验证是否重复
	    // 状态保留未验证，但可以正常使用系统
	    // 第二版增加验证邮箱功能，未验证的用户不能使用系统
	    // 注册
	    value: function () {
	      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(password) {
	        var query, result, row;
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                (0, _validator.validate)({ email: this.email, password: password }, (0, _validator.getSchema)(User.SCHEMA, 'email', 'password'));
	                _context.next = 3;
	                return User.checkEmail(this.email);
	
	              case 3:
	                query = '\n      INSERT INTO "user".user (email, password)\n      VALUES ($1, crypt($2, gen_salt(\'bf\', 8)))\n      RETURNING id\n      ;';
	                /* eslint-disable no-undef */
	
	                _context.next = 6;
	                return db.query(query, [this.email, password]);
	
	              case 6:
	                result = _context.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context.next = 9;
	                  break;
	                }
	
	                throw new _errors2.default.CreateUserFailedError();
	
	              case 9:
	                row = result.rows[0];
	                return _context.abrupt('return', new User({
	                  id: row.id,
	                  email: this.email,
	                  status: row.status
	                }));
	
	              case 11:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));
	
	      function create(_x) {
	        return _ref.apply(this, arguments);
	      }
	
	      return create;
	    }()
	  }, {
	    key: 'login',
	    value: function () {
	      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(password) {
	        var data, query, result, row;
	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                data = {
	                  email: this.email,
	                  password: password
	                };
	
	                (0, _validator.validate)(data, (0, _validator.getSchema)(User.SCHEMA, 'email', 'password'));
	                query = '\n      SELECT id, status, avatar, nickname\n      FROM "user".user\n      WHERE\n        email ILIKE $1\n        AND password = crypt($2, password)\n      ;';
	                _context2.next = 5;
	                return db.query(query, [this.email, password]);
	
	              case 5:
	                result = _context2.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context2.next = 8;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidIdentificationError();
	
	              case 8:
	                row = result.rows[0];
	                // if (row.status === User.STATUS.INACTIVE) throw new errors.UserInactiveError()
	
	                return _context2.abrupt('return', new User({
	                  id: row.id,
	                  email: this.email,
	                  nickname: row.nickname,
	                  avatar: row.avatar
	                }));
	
	              case 10:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, this);
	      }));
	
	      function login(_x2) {
	        return _ref2.apply(this, arguments);
	      }
	
	      return login;
	    }()
	  }, {
	    key: 'changePassword',
	    value: function () {
	      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(password, oldPassword) {
	        var ext, data, query, params, result, row;
	        return regeneratorRuntime.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                ext = {
	                  password: _validator.Joi.string().min(6)
	                };
	                data = {
	                  id: this.id,
	                  password: password,
	                  oldPassword: oldPassword
	                };
	
	                (0, _validator.validate)(data, (0, _validator.getSchema)(User.SCHEMA, 'id', 'password', 'oldPassword'), ext);
	                query = '\n      UPDATE "user".user\n      SET password = crypt($3, gen_salt(\'bf\', 8))\n      WHERE\n        id = $1\n        AND password = crypt($2, password)\n      RETURNING id, email, avatar, nickname\n      ;';
	                params = [this.id, oldPassword, password];
	                _context3.next = 7;
	                return db.query(query, params);
	
	              case 7:
	                result = _context3.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context3.next = 10;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidIdentificationError();
	
	              case 10:
	                row = result.rows[0];
	                return _context3.abrupt('return', new User({
	                  id: row.id,
	                  email: row.email,
	                  nickname: row.nickname,
	                  avatar: row.avatar
	                }));
	
	              case 12:
	              case 'end':
	                return _context3.stop();
	            }
	          }
	        }, _callee3, this);
	      }));
	
	      function changePassword(_x3, _x4) {
	        return _ref3.apply(this, arguments);
	      }
	
	      return changePassword;
	    }()
	  }, {
	    key: 'fill',
	    value: function () {
	      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
	        var query, result, row;
	        return regeneratorRuntime.wrap(function _callee4$(_context4) {
	          while (1) {
	            switch (_context4.prev = _context4.next) {
	              case 0:
	                (0, _validator.validate)({ id: this.id }, (0, _validator.getSchema)(User.SCHEMA, 'id'));
	                query = '\n      SELECT email, avatar, nickname\n      FROM "user".user\n      WHERE id = $1\n      ;';
	                _context4.next = 4;
	                return db.query(query, [this.id]);
	
	              case 4:
	                result = _context4.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context4.next = 7;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidIdentificationError();
	
	              case 7:
	                row = result.rows[0];
	                return _context4.abrupt('return', new User({
	                  id: this.id,
	                  email: row.email,
	                  avatar: row.avatar,
	                  nickname: row.nickname
	                }));
	
	              case 9:
	              case 'end':
	                return _context4.stop();
	            }
	          }
	        }, _callee4, this);
	      }));
	
	      function fill() {
	        return _ref4.apply(this, arguments);
	      }
	
	      return fill;
	    }()
	
	    // 修改email需要验证，暂不做
	
	  }, {
	    key: 'update',
	    value: function () {
	      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
	        var user, query, result;
	        return regeneratorRuntime.wrap(function _callee5$(_context5) {
	          while (1) {
	            switch (_context5.prev = _context5.next) {
	              case 0:
	                if (!(Object.keys(this).length <= 1)) {
	                  _context5.next = 2;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidProfileError();
	
	              case 2:
	                (0, _validator.validate)(this, (0, _validator.getSchema)(User.SCHEMA, 'id', 'nickname', 'avatar'));
	                _context5.next = 5;
	                return this.fill();
	
	              case 5:
	                user = _context5.sent;
	
	                this.avatar = this.avatar || user.avatar;
	                this.nickname = this.nickname || user.nickname;
	                query = '\n      UPDATE "user".user\n      SET\n        avatar = $2,\n        nickname = $3\n      WHERE id = $1\n      RETURNING email\n      ;';
	                _context5.next = 11;
	                return db.query(query, [this.id, this.avatar, this.nickname]);
	
	              case 11:
	                result = _context5.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context5.next = 14;
	                  break;
	                }
	
	                throw new _errors2.default.UpdateUserFailedError();
	
	              case 14:
	                this.email = result.rows[0].email;
	                return _context5.abrupt('return', new User(this));
	
	              case 16:
	              case 'end':
	                return _context5.stop();
	            }
	          }
	        }, _callee5, this);
	      }));
	
	      function update() {
	        return _ref5.apply(this, arguments);
	      }
	
	      return update;
	    }()
	  }], [{
	    key: 'checkEmail',
	    value: function () {
	      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(email) {
	        var query, result;
	        return regeneratorRuntime.wrap(function _callee6$(_context6) {
	          while (1) {
	            switch (_context6.prev = _context6.next) {
	              case 0:
	                (0, _validator.validate)({ email: email }, (0, _validator.getSchema)(this.SCHEMA, 'email'));
	                query = '\n      SELECT 1\n      FROM "user".user\n      WHERE email ILIKE $1\n      ;';
	                /* eslint-disable no-undef */
	
	                _context6.next = 4;
	                return db.query(query, [email]);
	
	              case 4:
	                result = _context6.sent;
	
	                if (!(result.rowCount > 0)) {
	                  _context6.next = 7;
	                  break;
	                }
	
	                throw new _errors2.default.EmailDuplicatedError();
	
	              case 7:
	              case 'end':
	                return _context6.stop();
	            }
	          }
	        }, _callee6, this);
	      }));
	
	      function checkEmail(_x5) {
	        return _ref6.apply(this, arguments);
	      }
	
	      return checkEmail;
	    }()
	  }]);
	
	  return User;
	}();
	
	User.SCHEMA = {
	  /* eslint-disable newline-per-chained-call */
	  id: _validator.Joi.number().integer().min(1000000000).required(),
	  email: _validator.Joi.string().email().required(),
	  password: _validator.Joi.string().required(),
	  oldPassword: _validator.Joi.string().required(),
	  nickname: _validator.Joi.string().allow('', null),
	  avatar: _validator.Joi.string().allow('', null)
	};
	User.STATUS = {
	  INACTIVE: 1,
	  ACTIVE: 2,
	  DISABLED: 9
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("date-utils");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _restifyErrors = __webpack_require__(12);
	
	var _restifyErrors2 = _interopRequireDefault(_restifyErrors);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function normalize(name) {
	  /* eslint-disable no-param-reassign */
	  // name = name.charAt(0).toUpperCase() + name.slice(1)
	  if (!name.endsWith('Error')) {
	    return name + 'Error';
	  }
	  return name;
	}
	
	_restifyErrors2.default.localization = __webpack_require__(13);
	
	_restifyErrors2.default.lang = function (error) {
	  if (error.message) return error.message;
	  var name = error.name.slice(0, -5);
	  return _restifyErrors2.default.localization[name];
	};
	
	_restifyErrors2.default.register = function (options) {
	  Object.keys(options).forEach(function (name) {
	    var config = options[name];
	    var errorName = normalize(name);
	    switch (typeof config === 'undefined' ? 'undefined' : _typeof(config)) {
	      case 'number':
	        if (config % 1 === 0) {
	          _restifyErrors2.default.makeConstructor(errorName, {
	            statusCode: config
	          });
	          return;
	        }
	        break;
	      case 'object':
	        _restifyErrors2.default.makeConstructor(errorName, config);
	        return;
	      default:
	    }
	    throw new Error('Invalid error config for ' + errorName);
	  });
	};
	
	exports.default = _restifyErrors2.default;

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("restify-errors");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = {
		"InvalidIdentification": "身份验证失败，请重新登录",
		"EmailDuplicated": "该邮箱地址已被注册",
		"CreateUserFailed": "创建用户失败",
		"UpdateUserFailed": "保存用户信息失败",
		"InvalidProfile": "无效的个人信息",
		"UserInactive": "用户尚未激活"
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Joi = exports.getSchema = exports.validate = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _joi = __webpack_require__(15);
	
	var _joi2 = _interopRequireDefault(_joi);
	
	var _errors = __webpack_require__(11);
	
	var _errors2 = _interopRequireDefault(_errors);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var ERRORS = {
	  ValidationFailed: {
	    statusCode: 400
	  }
	};
	_errors2.default.register(ERRORS);
	
	function validate(data, schema, ext) {
	  if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) === 'object') {
	    /* eslint-disable no-param-reassign */
	    schema = _joi2.default.object(schema);
	  }
	  if (ext) {
	    if (Array.isArray(ext)) {
	      var required = {};
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = ext[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var r = _step.value;
	
	          required[r] = _joi2.default.required();
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      ext = _joi2.default.object(required);
	    } else if ((typeof ext === 'undefined' ? 'undefined' : _typeof(ext)) === 'object') {
	      ext = _joi2.default.object(ext);
	    }
	    schema = schema.concat(ext);
	  }
	  var result = _joi2.default.validate(data, schema);
	  if (result.error) {
	    throw new _errors2.default.ValidationFailedError(result.error.details[0]);
	  }
	  if (result.value && Object.keys(data).length > 0) {
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;
	
	    try {
	      for (var _iterator2 = Object.keys(data)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	        var key = _step2.value;
	
	        if (result.value.hasOwnProperty(key)) {
	          data[key] = result.value[key];
	        }
	      }
	    } catch (err) {
	      _didIteratorError2 = true;
	      _iteratorError2 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion2 && _iterator2.return) {
	          _iterator2.return();
	        }
	      } finally {
	        if (_didIteratorError2) {
	          throw _iteratorError2;
	        }
	      }
	    }
	  }
	  return result.value;
	}
	
	function getSchema(schema) {
	  var schemaKeys = [];
	
	  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    keys[_key - 1] = arguments[_key];
	  }
	
	  var _iteratorNormalCompletion3 = true;
	  var _didIteratorError3 = false;
	  var _iteratorError3 = undefined;
	
	  try {
	    for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	      var key = _step3.value;
	
	      if (Array.isArray(key)) {
	        schemaKeys.push.apply(schemaKeys, _toConsumableArray(key));
	      } else {
	        schemaKeys.push(key);
	      }
	    }
	  } catch (err) {
	    _didIteratorError3 = true;
	    _iteratorError3 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion3 && _iterator3.return) {
	        _iterator3.return();
	      }
	    } finally {
	      if (_didIteratorError3) {
	        throw _iteratorError3;
	      }
	    }
	  }
	
	  var sub = {};
	  var _iteratorNormalCompletion4 = true;
	  var _didIteratorError4 = false;
	  var _iteratorError4 = undefined;
	
	  try {
	    for (var _iterator4 = schemaKeys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	      var _key2 = _step4.value;
	
	      sub[_key2] = schema[_key2];
	    }
	  } catch (err) {
	    _didIteratorError4 = true;
	    _iteratorError4 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion4 && _iterator4.return) {
	        _iterator4.return();
	      }
	    } finally {
	      if (_didIteratorError4) {
	        throw _iteratorError4;
	      }
	    }
	  }
	
	  return sub;
	}
	
	exports.validate = validate;
	exports.getSchema = getSchema;
	exports.Joi = _joi2.default;

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("joi");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var query = function () {
	  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	    var args,
	        connection,
	        database,
	        client,
	        _args = arguments;
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            args = slice.call(_args);
	            connection = null;
	            database = args[0];
	
	            if (!_connections2.default.postgres.hasOwnProperty(database)) {
	              _context.next = 10;
	              break;
	            }
	
	            connection = _connections2.default.postgres[database];
	
	            if (connection) {
	              _context.next = 7;
	              break;
	            }
	
	            throw new Error('Connection[' + database + '] isn\'t existed');
	
	          case 7:
	            args = slice.call(_args, 1);
	            _context.next = 13;
	            break;
	
	          case 10:
	            connection = _connections2.default.postgres.default;
	
	            if (connection) {
	              _context.next = 13;
	              break;
	            }
	
	            throw new Error('Connection.default does not existed');
	
	          case 13:
	            client = null;
	            _context.prev = 14;
	
	            client = _pgThen2.default.Client(connection);
	            _context.next = 18;
	            return client.query.apply(client, args);
	
	          case 18:
	            return _context.abrupt('return', _context.sent);
	
	          case 21:
	            _context.prev = 21;
	            _context.t0 = _context['catch'](14);
	            throw _context.t0;
	
	          case 24:
	            _context.prev = 24;
	
	            if (client) client.end();
	            return _context.finish(24);
	
	          case 27:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this, [[14, 21, 24, 27]]);
	  }));
	
	  return function query() {
	    return _ref.apply(this, arguments);
	  };
	}();
	
	var transaction = function () {
	  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(database, actions) {
	    var connection, client, result;
	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            connection = null;
	
	            if (typeof database === 'function') {
	              actions = database;
	              connection = _connections2.default.postgres.default;
	            } else {
	              connection = _connections2.default.postgres[database];
	            }
	            client = null;
	            _context2.prev = 3;
	
	            client = _pgThen2.default.Client(connection);
	            _context2.next = 7;
	            return client.query('BEGIN');
	
	          case 7:
	            _context2.next = 9;
	            return actions(client);
	
	          case 9:
	            result = _context2.sent;
	            _context2.next = 12;
	            return client.query('COMMIT');
	
	          case 12:
	            return _context2.abrupt('return', result);
	
	          case 15:
	            _context2.prev = 15;
	            _context2.t0 = _context2['catch'](3);
	            _context2.next = 19;
	            return client.query('ROLLBACK');
	
	          case 19:
	            throw _context2.t0;
	
	          case 20:
	            _context2.prev = 20;
	
	            if (client) client.end();
	            return _context2.finish(20);
	
	          case 23:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, this, [[3, 15, 20, 23]]);
	  }));
	
	  return function transaction(_x, _x2) {
	    return _ref2.apply(this, arguments);
	  };
	}();
	
	var _pgThen = __webpack_require__(17);
	
	var _pgThen2 = _interopRequireDefault(_pgThen);
	
	var _connections = __webpack_require__(18);
	
	var _connections2 = _interopRequireDefault(_connections);
	
	var _manager = __webpack_require__(19);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	var slice = [].slice;
	
	// configure pg
	_pgThen2.default.pg.defaults.parseInt8 = true;
	
	function configure(options) {
	  _connections2.default.configure(options);
	  return new _manager.DbManager({ connections: _connections2.default });
	}
	
	exports.default = { configure: configure, query: query, transaction: transaction };

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("pg-then");

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var connections = {
	  postgres: {},
	  redis: {}
	};
	
	function init(type, name, options) {
	  if (name === 'default') {
	    throw new Error('databse name "default" is reserved.');
	  }
	  var arr = [type === 'postgres' ? 'postgresql' : type, '://'];
	  var credentials = options.credentials;
	  if (credentials) {
	    if (credentials.username) {
	      arr.push(options.credentials.username);
	    } else if (type === 'postgres') {
	      throw new Error('Missing username in postgres credentials');
	    }
	    if (credentials.password) {
	      arr.push(':');
	      arr.push(options.credentials.password);
	    }
	    arr.push('@');
	  }
	  arr.push(options.host);
	  if (options.port) {
	    arr.push(':');
	    arr.push(options.port);
	  }
	  var server = arr.join('');
	  arr.push('/');
	  arr.push(options.db);
	  var connection = {
	    server: server,
	    db: options.db,
	    database: options.db,
	    string: arr.join(''),
	    host: options.host,
	    port: options.port,
	    options: options.options,
	    default: options.default
	  };
	  if (credentials) {
	    if (credentials.username) {
	      connection.user = credentials.username;
	    }
	    if (credentials.password) {
	      connection.password = credentials.password;
	    }
	  }
	  connections[type][name] = connection;
	  if (connection.default) {
	    connections[type].default = connection;
	  }
	}
	
	function configure(config) {
	  for (var type in config) {
	    var typedConfig = config[type];
	    for (var name in typedConfig) {
	      var options = typedConfig[name];
	      options.default = options.default || Object.keys(typedConfig).length === 1;
	      init(type, name, options);
	    }
	  }
	}
	
	exports.default = {
	  configure: configure,
	  postgres: connections.postgres,
	  redis: connections.redis
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DbManager = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _fs = __webpack_require__(20);
	
	var _fs2 = _interopRequireDefault(_fs);
	
	var _path = __webpack_require__(21);
	
	var _path2 = _interopRequireDefault(_path);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DbManager = exports.DbManager = function () {
	  function DbManager(data) {
	    _classCallCheck(this, DbManager);
	
	    this.connections = data.connections;
	    this.version = data.version;
	  }
	
	  _createClass(DbManager, [{
	    key: 'dropDbIfExists',
	    value: function () {
	      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	        var dbname, queryTerminate, queryDrop;
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                dbname = this.connections.postgres.default.db;
	                queryTerminate = '\n      SELECT pg_terminate_backend(pg_stat_activity.pid)\n      FROM pg_stat_activity\n      WHERE pg_stat_activity.datname = $1\n      ;';
	                /* eslint-disable no-undef */
	
	                _context.next = 4;
	                return db.query('postgres', queryTerminate, [dbname]);
	
	              case 4:
	                queryDrop = 'DROP DATABASE IF EXISTS "' + dbname + '";';
	                _context.next = 7;
	                return db.query('postgres', queryDrop);
	
	              case 7:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));
	
	      function dropDbIfExists() {
	        return _ref.apply(this, arguments);
	      }
	
	      return dropDbIfExists;
	    }()
	  }, {
	    key: 'createDbIfNotExists',
	    value: function () {
	      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
	        var dbname, queryCheck, result, queryCreate;
	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                if (this.connections.postgres.postgres) {
	                  _context2.next = 2;
	                  break;
	                }
	
	                return _context2.abrupt('return');
	
	              case 2:
	                // Can't create database
	                dbname = this.connections.postgres.default.db;
	                queryCheck = '\n      SELECT 1 AS exists\n      FROM pg_database\n      WHERE datname = $1\n      ';
	                _context2.next = 6;
	                return db.query('postgres', queryCheck, [dbname]);
	
	              case 6:
	                result = _context2.sent;
	
	                if (!(result.rowCount === 0)) {
	                  _context2.next = 11;
	                  break;
	                }
	
	                queryCreate = 'CREATE DATABASE "' + dbname + '"';
	                _context2.next = 11;
	                return db.query('postgres', queryCreate);
	
	              case 11:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, this);
	      }));
	
	      function createDbIfNotExists() {
	        return _ref2.apply(this, arguments);
	      }
	
	      return createDbIfNotExists;
	    }()
	  }, {
	    key: 'getCurrentVersion',
	    value: function () {
	      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
	        var queryCheck, resultCheck, queryGetVersion, resultVersion, currentVer;
	        return regeneratorRuntime.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                queryCheck = '\n      SELECT 1 AS exists FROM pg_class WHERE relname = \'version\';\n    ';
	                _context3.next = 3;
	                return db.query(queryCheck);
	
	              case 3:
	                resultCheck = _context3.sent;
	
	                if (!(resultCheck.rowCount === 0)) {
	                  _context3.next = 6;
	                  break;
	                }
	
	                return _context3.abrupt('return', -1);
	
	              case 6:
	                queryGetVersion = 'SELECT ver FROM version ORDER BY ver DESC LIMIT 1;';
	                _context3.next = 9;
	                return db.query(queryGetVersion);
	
	              case 9:
	                resultVersion = _context3.sent;
	
	                if (!(resultVersion.rowCount === 0)) {
	                  _context3.next = 12;
	                  break;
	                }
	
	                return _context3.abrupt('return', -1);
	
	              case 12:
	                currentVer = resultVersion.rows[0].ver;
	
	                this.version = currentVer;
	                return _context3.abrupt('return', currentVer);
	
	              case 15:
	              case 'end':
	                return _context3.stop();
	            }
	          }
	        }, _callee3, this);
	      }));
	
	      function getCurrentVersion() {
	        return _ref3.apply(this, arguments);
	      }
	
	      return getCurrentVersion;
	    }()
	  }, {
	    key: 'getPatchFolders',
	    value: function () {
	      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
	        var patchMainPath, currentVer, clusters, patchFolders, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, c, folders, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, f, ver;
	
	        return regeneratorRuntime.wrap(function _callee4$(_context4) {
	          while (1) {
	            switch (_context4.prev = _context4.next) {
	              case 0:
	                patchMainPath = _path2.default.join(__dirname, 'patches');
	                _context4.next = 3;
	                return this.getCurrentVersion();
	
	              case 3:
	                currentVer = _context4.sent;
	                clusters = _fs2.default.readdirSync(patchMainPath);
	                patchFolders = [];
	                _iteratorNormalCompletion = true;
	                _didIteratorError = false;
	                _iteratorError = undefined;
	                _context4.prev = 9;
	                _iterator = clusters[Symbol.iterator]();
	
	              case 11:
	                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	                  _context4.next = 47;
	                  break;
	                }
	
	                c = _step.value;
	
	                if (!(c.charAt(0) === '.')) {
	                  _context4.next = 15;
	                  break;
	                }
	
	                return _context4.abrupt('continue', 44);
	
	              case 15:
	                folders = _fs2.default.readdirSync(_path2.default.join(patchMainPath, c));
	                _iteratorNormalCompletion2 = true;
	                _didIteratorError2 = false;
	                _iteratorError2 = undefined;
	                _context4.prev = 19;
	                _iterator2 = folders[Symbol.iterator]();
	
	              case 21:
	                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
	                  _context4.next = 30;
	                  break;
	                }
	
	                f = _step2.value;
	
	                if (!(f.charAt(0) === '.')) {
	                  _context4.next = 25;
	                  break;
	                }
	
	                return _context4.abrupt('continue', 27);
	
	              case 25:
	                ver = Number.parseFloat(f);
	
	                if (ver > currentVer) {
	                  patchFolders.push([ver, _path2.default.join(patchMainPath, c, f)]);
	                }
	
	              case 27:
	                _iteratorNormalCompletion2 = true;
	                _context4.next = 21;
	                break;
	
	              case 30:
	                _context4.next = 36;
	                break;
	
	              case 32:
	                _context4.prev = 32;
	                _context4.t0 = _context4['catch'](19);
	                _didIteratorError2 = true;
	                _iteratorError2 = _context4.t0;
	
	              case 36:
	                _context4.prev = 36;
	                _context4.prev = 37;
	
	                if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                  _iterator2.return();
	                }
	
	              case 39:
	                _context4.prev = 39;
	
	                if (!_didIteratorError2) {
	                  _context4.next = 42;
	                  break;
	                }
	
	                throw _iteratorError2;
	
	              case 42:
	                return _context4.finish(39);
	
	              case 43:
	                return _context4.finish(36);
	
	              case 44:
	                _iteratorNormalCompletion = true;
	                _context4.next = 11;
	                break;
	
	              case 47:
	                _context4.next = 53;
	                break;
	
	              case 49:
	                _context4.prev = 49;
	                _context4.t1 = _context4['catch'](9);
	                _didIteratorError = true;
	                _iteratorError = _context4.t1;
	
	              case 53:
	                _context4.prev = 53;
	                _context4.prev = 54;
	
	                if (!_iteratorNormalCompletion && _iterator.return) {
	                  _iterator.return();
	                }
	
	              case 56:
	                _context4.prev = 56;
	
	                if (!_didIteratorError) {
	                  _context4.next = 59;
	                  break;
	                }
	
	                throw _iteratorError;
	
	              case 59:
	                return _context4.finish(56);
	
	              case 60:
	                return _context4.finish(53);
	
	              case 61:
	                patchFolders.sort(function (a, b) {
	                  return a[0] - b[0];
	                });
	                return _context4.abrupt('return', patchFolders);
	
	              case 63:
	              case 'end':
	                return _context4.stop();
	            }
	          }
	        }, _callee4, this, [[9, 49, 53, 61], [19, 32, 36, 44], [37,, 39, 43], [54,, 56, 60]]);
	      }));
	
	      function getPatchFolders() {
	        return _ref4.apply(this, arguments);
	      }
	
	      return getPatchFolders;
	    }()
	  }, {
	    key: 'updateVersion',
	    value: function () {
	      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(client, patchVer) {
	        var currentVer, query;
	        return regeneratorRuntime.wrap(function _callee5$(_context5) {
	          while (1) {
	            switch (_context5.prev = _context5.next) {
	              case 0:
	                _context5.next = 2;
	                return this.getCurrentVersion();
	
	              case 2:
	                currentVer = _context5.sent;
	
	                if (!(patchVer <= currentVer)) {
	                  _context5.next = 5;
	                  break;
	                }
	
	                return _context5.abrupt('return');
	
	              case 5:
	                query = 'INSERT INTO version (ver) VALUES ($1);';
	                _context5.next = 8;
	                return client.query(query, [patchVer]);
	
	              case 8:
	                this.version = patchVer;
	
	              case 9:
	              case 'end':
	                return _context5.stop();
	            }
	          }
	        }, _callee5, this);
	      }));
	
	      function updateVersion(_x, _x2) {
	        return _ref5.apply(this, arguments);
	      }
	
	      return updateVersion;
	    }()
	  }, {
	    key: 'update',
	    value: function () {
	      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
	        var _this = this;
	
	        var patchFolders;
	        return regeneratorRuntime.wrap(function _callee7$(_context7) {
	          while (1) {
	            switch (_context7.prev = _context7.next) {
	              case 0:
	                _context7.next = 2;
	                return this.createDbIfNotExists();
	
	              case 2:
	                _context7.next = 4;
	                return this.getPatchFolders();
	
	              case 4:
	                patchFolders = _context7.sent;
	                _context7.next = 7;
	                return db.transaction(function () {
	                  var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(client) {
	                    var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, patchFolder, patchVer, patchPath, ver, files, updatorPath, updator, query;
	
	                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
	                      while (1) {
	                        switch (_context6.prev = _context6.next) {
	                          case 0:
	                            _iteratorNormalCompletion3 = true;
	                            _didIteratorError3 = false;
	                            _iteratorError3 = undefined;
	                            _context6.prev = 3;
	                            _iterator3 = patchFolders[Symbol.iterator]();
	
	                          case 5:
	                            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
	                              _context6.next = 34;
	                              break;
	                            }
	
	                            patchFolder = _step3.value;
	                            patchVer = patchFolder[0];
	                            patchPath = patchFolder[1];
	                            _context6.next = 11;
	                            return _this.getCurrentVersion();
	
	                          case 11:
	                            ver = _context6.sent;
	
	                            if (!(patchVer <= ver)) {
	                              _context6.next = 14;
	                              break;
	                            }
	
	                            return _context6.abrupt('continue', 31);
	
	                          case 14:
	                            files = _fs2.default.readdirSync(patchPath);
	
	                            if (!files.includes('update.js')) {
	                              _context6.next = 22;
	                              break;
	                            }
	
	                            updatorPath = '.' + _path2.default.join(patchPath, 'update.js').slice(__dirname.length);
	                            updator = __webpack_require__(22)(updatorPath);
	                            _context6.next = 20;
	                            return updator.putPatch(client);
	
	                          case 20:
	                            _context6.next = 29;
	                            break;
	
	                          case 22:
	                            if (!files.includes('query.sql')) {
	                              _context6.next = 28;
	                              break;
	                            }
	
	                            query = _fs2.default.readFileSync(_path2.default.join(patchPath, 'query.sql'), 'utf8');
	                            _context6.next = 26;
	                            return client.query(query);
	
	                          case 26:
	                            _context6.next = 29;
	                            break;
	
	                          case 28:
	                            return _context6.abrupt('continue', 31);
	
	                          case 29:
	                            _context6.next = 31;
	                            return _this.updateVersion(client, patchVer);
	
	                          case 31:
	                            _iteratorNormalCompletion3 = true;
	                            _context6.next = 5;
	                            break;
	
	                          case 34:
	                            _context6.next = 40;
	                            break;
	
	                          case 36:
	                            _context6.prev = 36;
	                            _context6.t0 = _context6['catch'](3);
	                            _didIteratorError3 = true;
	                            _iteratorError3 = _context6.t0;
	
	                          case 40:
	                            _context6.prev = 40;
	                            _context6.prev = 41;
	
	                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                              _iterator3.return();
	                            }
	
	                          case 43:
	                            _context6.prev = 43;
	
	                            if (!_didIteratorError3) {
	                              _context6.next = 46;
	                              break;
	                            }
	
	                            throw _iteratorError3;
	
	                          case 46:
	                            return _context6.finish(43);
	
	                          case 47:
	                            return _context6.finish(40);
	
	                          case 48:
	                          case 'end':
	                            return _context6.stop();
	                        }
	                      }
	                    }, _callee6, _this, [[3, 36, 40, 48], [41,, 43, 47]]);
	                  }));
	
	                  return function (_x3) {
	                    return _ref7.apply(this, arguments);
	                  };
	                }());
	
	              case 7:
	              case 'end':
	                return _context7.stop();
	            }
	          }
	        }, _callee7, this);
	      }));
	
	      function update() {
	        return _ref6.apply(this, arguments);
	      }
	
	      return update;
	    }()
	  }, {
	    key: 'rebuild',
	    value: function () {
	      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
	        return regeneratorRuntime.wrap(function _callee8$(_context8) {
	          while (1) {
	            switch (_context8.prev = _context8.next) {
	              case 0:
	                _context8.next = 2;
	                return this.dropDbIfExists();
	
	              case 2:
	                _context8.next = 4;
	                return this.update();
	
	              case 4:
	              case 'end':
	                return _context8.stop();
	            }
	          }
	        }, _callee8, this);
	      }));

	      function rebuild() {
	        return _ref8.apply(this, arguments);
	      }

	      return rebuild;
	    }()
	  }]);

	  return DbManager;
	}();

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./connections": 18,
		"./connections.js": 18,
		"./index": 16,
		"./index.js": 16,
		"./manager": 19,
		"./manager.js": 19,
		"./patches/000-049/00/query.sql": 23,
		"./patches/000-049/01/query.sql": 24,
		"./patches/000-049/02/query.sql": 25
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 22;


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("./patches/000-049/00/query.sql");

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("./patches/000-049/01/query.sql");

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("./patches/000-049/02/query.sql");

/***/ }
/******/ ]);
//# sourceMappingURL=models.js.map