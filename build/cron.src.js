// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Bootstrap for the Google JS Library (Closure).
 *
 * In uncompiled mode base.js will write out Closure's deps file, unless the
 * global <code>CLOSURE_NO_DEPS</code> is set to true.  This allows projects to
 * include their own deps file(s) from different locations.
 *
 */


/**
 * @define {boolean} Overridden to true by the compiler when --closure_pass
 *     or --mark_as_compiled is specified.
 */
var COMPILED = false;


/**
 * Base namespace for the Closure library.  Checks to see goog is
 * already defined in the current scope before assigning to prevent
 * clobbering if base.js is loaded more than once.
 *
 * @const
 */
var goog = goog || {}; // Identifies this file as the Closure base.


/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
goog.global = this;


/**
 * @define {boolean} DEBUG is provided as a convenience so that debugging code
 * that should not be included in a production js_binary can be easily stripped
 * by specifying --define goog.DEBUG=false to the JSCompiler. For example, most
 * toString() methods should be declared inside an "if (goog.DEBUG)" conditional
 * because they are generally used for debugging purposes and it is difficult
 * for the JSCompiler to statically determine whether they are used.
 */
goog.DEBUG = true;


/**
 * @define {string} LOCALE defines the locale being used for compilation. It is
 * used to select locale specific data to be compiled in js binary. BUILD rule
 * can specify this value by "--define goog.LOCALE=<locale_name>" as JSCompiler
 * option.
 *
 * Take into account that the locale code format is important. You should use
 * the canonical Unicode format with hyphen as a delimiter. Language must be
 * lowercase, Language Script - Capitalized, Region - UPPERCASE.
 * There are few examples: pt-BR, en, en-US, sr-Latin-BO, zh-Hans-CN.
 *
 * See more info about locale codes here:
 * http://www.unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers
 *
 * For language codes you should use values defined by ISO 693-1. See it here
 * http://www.w3.org/WAI/ER/IG/ert/iso639.htm. There is only one exception from
 * this rule: the Hebrew language. For legacy reasons the old code (iw) should
 * be used instead of the new code (he), see http://wiki/Main/IIISynonyms.
 */
goog.LOCALE = 'en';  // default to en


/**
 * Creates object stubs for a namespace.  The presence of one or more
 * goog.provide() calls indicate that the file defines the given
 * objects/namespaces.  Build tools also scan for provide/require statements
 * to discern dependencies, build dependency files (see deps.js), etc.
 * @see goog.require
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 */
goog.provide = function(name) {
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice. This is intended
    // to teach new developers that 'goog.provide' is effectively a variable
    // declaration. And when JSCompiler transforms goog.provide into a real
    // variable declaration, the compiled JS should work the same as the raw
    // JS--even when the raw JS uses goog.provide incorrectly.
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];

    var namespace = name;
    while ((namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }

  goog.exportPath_(name);
};


/**
 * Marks that the current file should only be used for testing, and never for
 * live code in production.
 * @param {string=} opt_message Optional message to add to the error that's
 *     raised when used in production code.
 */
goog.setTestOnly = function(opt_message) {
  if (COMPILED && !goog.DEBUG) {
    opt_message = opt_message || '';
    throw Error('Importing test-only code into non-debug environment' +
                opt_message ? ': ' + opt_message : '.');
  }
};


if (!COMPILED) {

  /**
   * Check if the given name has been goog.provided. This will return false for
   * names that are available only as implicit namespaces.
   * @param {string} name name of the object to look for.
   * @return {boolean} Whether the name has been provided.
   * @private
   */
  goog.isProvided_ = function(name) {
    return !goog.implicitNamespaces_[name] && !!goog.getObjectByName(name);
  };

  /**
   * Namespaces implicitly defined by goog.provide. For example,
   * goog.provide('goog.events.Event') implicitly declares
   * that 'goog' and 'goog.events' must be namespaces.
   *
   * @type {Object}
   * @private
   */
  goog.implicitNamespaces_ = {};
}


/**
 * Builds an object structure for the provided namespace path,
 * ensuring that names that already exist are not overwritten. For
 * example:
 * "a.b.c" -> a = {};a.b={};a.b.c={};
 * Used by goog.provide and goog.exportSymbol.
 * @param {string} name name of the object that this file defines.
 * @param {*=} opt_object the object to expose at the end of the path.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is |goog.global|.
 * @private
 */
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || goog.global;

  // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.  See the testExportSymbolExceptions in
  // base_test.html for an example.
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }

  // Certain browsers cannot parse code in the form for((a in b); c;);
  // This pattern is produced by the JSCompiler when it collapses the
  // statement above into the conditional loop below. To prevent this from
  // happening, use a for-loop and reserve the init logic as below.

  // Parentheses added to eliminate strict JS warning in Firefox.
  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      // last part and we have an object; use it
      cur[part] = opt_object;
    } else if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};


/**
 * Returns an object based on its fully qualified external name.  If you are
 * using a compilation pass that renames property names beware that using this
 * function will not find renamed properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object=} opt_obj The object within which to look; default is
 *     |goog.global|.
 * @return {Object} The object or, if not found, null.
 */
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || goog.global;
  for (var part; part = parts.shift(); ) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};


/**
 * Globalizes a whole namespace, such as goog or goog.lang.
 *
 * @param {Object} obj The namespace to globalize.
 * @param {Object=} opt_global The object to add the properties to.
 * @deprecated Properties may be explicitly exported to the global scope, but
 *     this should no longer be done in bulk.
 */
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};


/**
 * Adds a dependency from a file to the files it requires.
 * @param {string} relPath The path to the js file.
 * @param {Array} provides An array of strings with the names of the objects
 *                         this file provides.
 * @param {Array} requires An array of strings with the names of the objects
 *                         this file requires.
 */
goog.addDependency = function(relPath, provides, requires) {
  if (!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, '/');
    var deps = goog.dependencies_;
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = path;
      if (!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {};
      }
      deps.pathToNames[path][provide] = true;
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};




// NOTE(user): The debug DOM loader was included in base.js as an orignal
// way to do "debug-mode" development.  The dependency system can sometimes
// be confusing, as can the debug DOM loader's asyncronous nature.
//
// With the DOM loader, a call to goog.require() is not blocking -- the
// script will not load until some point after the current script.  If a
// namespace is needed at runtime, it needs to be defined in a previous
// script, or loaded via require() with its registered dependencies.
// User-defined namespaces may need their own deps file.  See http://go/js_deps,
// http://go/genjsdeps, or, externally, DepsWriter.
// http://code.google.com/closure/library/docs/depswriter.html
//
// Because of legacy clients, the DOM loader can't be easily removed from
// base.js.  Work is being done to make it disableable or replaceable for
// different environments (DOM-less JavaScript interpreters like Rhino or V8,
// for example). See bootstrap/ for more information.


/**
 * @define {boolean} Whether to enable the debug loader.
 *
 * If enabled, a call to goog.require() will attempt to load the namespace by
 * appending a script tag to the DOM (if the namespace has been registered).
 *
 * If disabled, goog.require() will simply assert that the namespace has been
 * provided (and depend on the fact that some outside tool correctly ordered
 * the script).
 */
goog.ENABLE_DEBUG_LOADER = true;


/**
 * Implements a system for the dynamic resolution of dependencies
 * that works in parallel with the BUILD system. Note that all calls
 * to goog.require will be stripped by the JSCompiler when the
 * --closure_pass option is used.
 * @see goog.provide
 * @param {string} name Namespace to include (as was given in goog.provide())
 *     in the form "goog.package.part".
 */
goog.require = function(name) {

  // if the object already exists we do not need do do anything
  // TODO(user): If we start to support require based on file name this has
  //            to change
  // TODO(user): If we allow goog.foo.* this has to change
  // TODO(user): If we implement dynamic load after page load we should probably
  //            not remove this code for the compiled output
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return;
    }

    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return;
      }
    }

    var errorMessage = 'goog.require could not find: ' + name;
    if (goog.global.console) {
      goog.global.console['error'](errorMessage);
    }


      throw Error(errorMessage);

  }
};


/**
 * Path for included scripts
 * @type {string}
 */
goog.basePath = '';


/**
 * A hook for overriding the base path.
 * @type {string|undefined}
 */
goog.global.CLOSURE_BASE_PATH;


/**
 * Whether to write out Closure's deps file. By default,
 * the deps are written.
 * @type {boolean|undefined}
 */
goog.global.CLOSURE_NO_DEPS;


/**
 * A function to import a single script. This is meant to be overridden when
 * Closure is being run in non-HTML contexts, such as web workers. It's defined
 * in the global scope so that it can be set before base.js is loaded, which
 * allows deps.js to be imported properly.
 *
 * The function is passed the script source, which is a relative URI. It should
 * return true if the script was imported, false otherwise.
 */
goog.global.CLOSURE_IMPORT_SCRIPT;


/**
 * Null function used for default values of callbacks, etc.
 * @return {void} Nothing.
 */
goog.nullFunction = function() {};


/**
 * The identity function. Returns its first argument.
 *
 * @param {...*} var_args The arguments of the function.
 * @return {*} The first argument.
 * @deprecated Use goog.functions.identity instead.
 */
goog.identityFunction = function(var_args) {
  return arguments[0];
};


/**
 * When defining a class Foo with an abstract method bar(), you can do:
 *
 * Foo.prototype.bar = goog.abstractMethod
 *
 * Now if a subclass of Foo fails to override bar(), an error
 * will be thrown when bar() is invoked.
 *
 * Note: This does not take the name of the function to override as
 * an argument because that would make it more difficult to obfuscate
 * our JavaScript code.
 *
 * @type {!Function}
 * @throws {Error} when invoked to indicate the method should be
 *   overridden.
 */
goog.abstractMethod = function() {
  throw Error('unimplemented abstract method');
};


/**
 * Adds a {@code getInstance} static method that always return the same instance
 * object.
 * @param {!Function} ctor The constructor for the class to add the static
 *     method to.
 */
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    return ctor.instance_ || (ctor.instance_ = new ctor());
  };
};


if (!COMPILED && goog.ENABLE_DEBUG_LOADER) {
  /**
   * Object used to keep track of urls that have already been added. This
   * record allows the prevention of circular dependencies.
   * @type {Object}
   * @private
   */
  goog.included_ = {};


  /**
   * This object is used to keep track of dependencies and other data that is
   * used for loading scripts
   * @private
   * @type {Object}
   */
  goog.dependencies_ = {
    pathToNames: {}, // 1 to many
    nameToPath: {}, // 1 to 1
    requires: {}, // 1 to many
    // used when resolving dependencies to prevent us from
    // visiting the file twice
    visited: {},
    written: {} // used to keep track of script files we have written
  };


  /**
   * Tries to detect whether is in the context of an HTML document.
   * @return {boolean} True if it looks like HTML document.
   * @private
   */
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != 'undefined' &&
           'write' in doc;  // XULDocument misses write.
  };


  /**
   * Tries to detect the base path of the base.js script that bootstraps Closure
   * @private
   */
  goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else if (!goog.inHtmlDocument_()) {
      return;
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName('script');
    // Search backwards since the current script is in almost all cases the one
    // that has base.js.
    for (var i = scripts.length - 1; i >= 0; --i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf('?');
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == 'base.js') {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };


  /**
   * Imports a script if, and only if, that script hasn't already been imported.
   * (Must be called at execution time)
   * @param {string} src Script source.
   * @private
   */
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT ||
        goog.writeScriptTag_;
    if (!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true;
    }
  };


  /**
   * The default implementation of the import function. Writes a script tag to
   * import the script.
   *
   * @param {string} src The script source.
   * @return {boolean} True if the script was imported, false otherwise.
   * @private
   */
  goog.writeScriptTag_ = function(src) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      doc.write(
          '<script type="text/javascript" src="' + src + '"></' + 'script>');
      return true;
    } else {
      return false;
    }
  };


  /**
   * Resolves dependencies based on the dependencies added using addDependency
   * and calls importScript_ in the correct order.
   * @private
   */
  goog.writeScripts_ = function() {
    // the scripts we need to write this time
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;

    function visitNode(path) {
      if (path in deps.written) {
        return;
      }

      // we have already visited this one. We can get here if we have cyclic
      // dependencies
      if (path in deps.visited) {
        if (!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path);
        }
        return;
      }

      deps.visited[path] = true;

      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          // If the required name is defined, we assume that it was already
          // bootstrapped by other means.
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error('Undefined nameToPath for ' + requireName);
            }
          }
        }
      }

      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }

    for (var path in goog.included_) {
      if (!deps.written[path]) {
        visitNode(path);
      }
    }

    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i]);
      } else {
        throw Error('Undefined script input');
      }
    }
  };


  /**
   * Looks at the dependency rules and tries to determine the script file that
   * fulfills a particular rule.
   * @param {string} rule In the form goog.namespace.Class or project.script.
   * @return {?string} Url corresponding to the rule, or null.
   * @private
   */
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };

  goog.findBasePath_();

  // Allow projects to manage the deps files themselves.
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + 'deps.js');
  }
}



//==============================================================================
// Language Enhancements
//==============================================================================


/**
 * This is a "fixed" version of the typeof operator.  It differs from the typeof
 * operator in such a way that null returns 'null' and arrays return 'array'.
 * @param {*} value The value to get the type of.
 * @return {string} The name of the type.
 */
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals tyepof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }

      // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.
      var className = Object.prototype.toString.call(
          /** @type {Object} */ (value));
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == '[object Window]') {
        return 'object';
      }

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use goog.isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if ((className == '[object Array]' ||
           // In IE all non value types are wrapped as objects across window
           // boundaries (not iframe though) so we have to do object detection
           // for this edge case
           typeof value.length == 'number' &&
           typeof value.splice != 'undefined' &&
           typeof value.propertyIsEnumerable != 'undefined' &&
           !value.propertyIsEnumerable('splice')

          )) {
        return 'array';
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if ((className == '[object Function]' ||
          typeof value.call != 'undefined' &&
          typeof value.propertyIsEnumerable != 'undefined' &&
          !value.propertyIsEnumerable('call'))) {
        return 'function';
      }


    } else {
      return 'null';
    }

  } else if (s == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox
    // typeof behaves similarly for HTML{Applet,Embed,Object}Elements
    // and RegExps.  We would like to return object for those and we can
    // detect an invalid function by making sure that the function
    // object has a call method.
    return 'object';
  }
  return s;
};


/**
 * Safe way to test whether a property is enumarable.  It allows testing
 * for enumerable on objects where 'propertyIsEnumerable' is overridden or
 * does not exist (like DOM nodes in IE). Does not use browser native
 * Object.propertyIsEnumerable.
 * @param {Object} object The object to test if the property is enumerable.
 * @param {string} propName The property name to check for.
 * @return {boolean} True if the property is enumarable.
 * @private
 */
goog.propertyIsEnumerableCustom_ = function(object, propName) {
  // KJS in Safari 2 is not ECMAScript compatible and lacks crucial methods
  // such as propertyIsEnumerable.  We therefore use a workaround.
  // Does anyone know a more efficient work around?
  if (propName in object) {
    for (var key in object) {
      if (key == propName &&
          Object.prototype.hasOwnProperty.call(object, propName)) {
        return true;
      }
    }
  }
  return false;
};


/**
 * Safe way to test whether a property is enumarable.  It allows testing
 * for enumerable on objects where 'propertyIsEnumerable' is overridden or
 * does not exist (like DOM nodes in IE).
 * @param {Object} object The object to test if the property is enumerable.
 * @param {string} propName The property name to check for.
 * @return {boolean} True if the property is enumarable.
 * @private
 */
goog.propertyIsEnumerable_ = function(object, propName) {
  // In IE if object is from another window, cannot use propertyIsEnumerable
  // from this window's Object. Will raise a 'JScript object expected' error.
  if (object instanceof Object) {
    return Object.prototype.propertyIsEnumerable.call(object, propName);
  } else {
    return goog.propertyIsEnumerableCustom_(object, propName);
  }
};


/**
 * Returns true if the specified value is not |undefined|.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.  Additionally, this function assumes that the global
 * undefined variable has not been redefined.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
goog.isDef = function(val) {
  return val !== undefined;
};


/**
 * Returns true if the specified value is |null|
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
goog.isNull = function(val) {
  return val === null;
};


/**
 * Returns true if the specified value is defined and not null
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
goog.isDefAndNotNull = function(val) {
  // Note that undefined == null.
  return val != null;
};


/**
 * Returns true if the specified value is an array
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArray = function(val) {
  return goog.typeOf(val) == 'array';
};


/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == 'array' || type == 'object' && typeof val.length == 'number';
};


/**
 * Returns true if the object looks like a Date. To qualify as Date-like
 * the value needs to be an object and have a getFullYear() function.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == 'function';
};


/**
 * Returns true if the specified value is a string
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
goog.isString = function(val) {
  return typeof val == 'string';
};


/**
 * Returns true if the specified value is a boolean
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
goog.isBoolean = function(val) {
  return typeof val == 'boolean';
};


/**
 * Returns true if the specified value is a number
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
goog.isNumber = function(val) {
  return typeof val == 'number';
};


/**
 * Returns true if the specified value is a function
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
goog.isFunction = function(val) {
  return goog.typeOf(val) == 'function';
};


/**
 * Returns true if the specified value is an object.  This includes arrays
 * and functions.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
goog.isObject = function(val) {
  var type = goog.typeOf(val);
  return type == 'object' || type == 'array' || type == 'function';
};


/**
 * Gets a unique ID for an object. This mutates the object so that further
 * calls with the same object as a parameter returns the same value. The unique
 * ID is guaranteed to be unique across the current session amongst objects that
 * are passed into {@code getUid}. There is no guarantee that the ID is unique
 * or consistent across sessions. It is unsafe to generate unique ID for
 * function prototypes.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
goog.getUid = function(obj) {
  // TODO(user): Make the type stricter, do not accept null.

  // In Opera window.hasOwnProperty exists but always returns false so we avoid
  // using it. As a consequence the unique ID generated for BaseClass.prototype
  // and SubClass.prototype will be the same.
  return obj[goog.UID_PROPERTY_] ||
      (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};


/**
 * Removes the unique ID from an object. This is useful if the object was
 * previously mutated using {@code goog.getUid} in which case the mutation is
 * undone.
 * @param {Object} obj The object to remove the unique ID field from.
 */
goog.removeUid = function(obj) {
  // TODO(user): Make the type stricter, do not accept null.

  // DOM nodes in IE are not instance of Object and throws exception
  // for delete. Instead we try to use removeAttribute
  if ('removeAttribute' in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  /** @preserveTry */
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};


/**
 * Name for unique ID property. Initialized in a way to help avoid collisions
 * with other closure javascript on the same page.
 * @type {string}
 * @private
 */
goog.UID_PROPERTY_ = 'closure_uid_' +
    Math.floor(Math.random() * 2147483648).toString(36);


/**
 * Counter for UID.
 * @type {number}
 * @private
 */
goog.uidCounter_ = 0;


/**
 * Adds a hash code field to an object. The hash code is unique for the
 * given object.
 * @param {Object} obj The object to get the hash code for.
 * @return {number} The hash code for the object.
 * @deprecated Use goog.getUid instead.
 */
goog.getHashCode = goog.getUid;


/**
 * Removes the hash code field from an object.
 * @param {Object} obj The object to remove the field from.
 * @deprecated Use goog.removeUid instead.
 */
goog.removeHashCode = goog.removeUid;


/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>goog.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>goog.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated goog.cloneObject is unsafe. Prefer the goog.object methods.
 */
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }

  return obj;
};


/**
 * Forward declaration for the clone method. This is necessary until the
 * compiler can better support duck-typing constructs as used in
 * goog.cloneObject.
 *
 * TODO(user): Remove once the JSCompiler can infer that the check for
 * proto.clone is safe in goog.cloneObject.
 *
 * @type {Function}
 */
Object.prototype.clone;


/**
 * A native implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 * @suppress {deprecated} The compiler thinks that Function.prototype.bind
 *     is deprecated because some people have declared a pure-JS version.
 *     Only the pure-JS version is truly deprecated.
 */
goog.bindNative_ = function(fn, selfObj, var_args) {
  return /** @type {!Function} */ (fn.call.apply(fn.bind, arguments));
};


/**
 * A pure-JS implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 */
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error();
  }

  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      // Prepend the bound arguments to the current arguments.
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };

  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};


/**
 * Partially applies this function to a particular 'this object' and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of |this| 'pre-specified'.<br><br>
 *
 * Remaining arguments specified at call-time are appended to the pre-
 * specified ones.<br><br>
 *
 * Also see: {@link #partial}.<br><br>
 *
 * Usage:
 * <pre>var barMethBound = bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @suppress {deprecated} See above.
 */
goog.bind = function(fn, selfObj, var_args) {
  // TODO(nicksantos): narrow the type signature.
  if (Function.prototype.bind &&
      // NOTE(nicksantos): Somebody pulled base.js into the default
      // Chrome extension environment. This means that for Chrome extensions,
      // they get the implementation of Function.prototype.bind that
      // calls goog.bind instead of the native one. Even worse, we don't want
      // to introduce a circular dependency between goog.bind and
      // Function.prototype.bind, so we have to hack this to make sure it
      // works correctly.
      Function.prototype.bind.toString().indexOf('native code') != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};


/**
 * Like bind(), except that a 'this object' is not required. Useful when the
 * target function is already bound.
 *
 * Usage:
 * var g = partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to fn.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 */
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Prepend the bound arguments to the current arguments.
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs);
  };
};


/**
 * Copies all the members of a source object to a target object. This method
 * does not work on all browsers for all objects that contain keys such as
 * toString or hasOwnProperty. Use goog.object.extend for this purpose.
 * @param {Object} target Target.
 * @param {Object} source Source.
 */
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }

  // For IE7 or lower, the for-in-loop does not contain any properties that are
  // not enumerable on the prototype object (for example, isPrototypeOf from
  // Object.prototype) but also it will not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
};


/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 */
goog.now = Date.now || (function() {
  // Unary plus operator converts its operand to a number which in the case of
  // a date is done by calling getTime().
  return +new Date();
});


/**
 * Evals javascript in the global scope.  In IE this uses execScript, other
 * browsers use goog.global.eval. If goog.global.eval does not evaluate in the
 * global scope (for example, in Safari), appends a script tag instead.
 * Throws an exception if neither execScript or eval is defined.
 * @param {string} script JavaScript string.
 */
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, 'JavaScript');
  } else if (goog.global.eval) {
    // Test to see if eval works
    if (goog.evalWorksForGlobals_ == null) {
      goog.global.eval('var _et_ = 1;');
      if (typeof goog.global['_et_'] != 'undefined') {
        delete goog.global['_et_'];
        goog.evalWorksForGlobals_ = true;
      } else {
        goog.evalWorksForGlobals_ = false;
      }
    }

    if (goog.evalWorksForGlobals_) {
      goog.global.eval(script);
    } else {
      var doc = goog.global.document;
      var scriptElt = doc.createElement('script');
      scriptElt.type = 'text/javascript';
      scriptElt.defer = false;
      // Note(user): can't use .innerHTML since "t('<test>')" will fail and
      // .text doesn't work in Safari 2.  Therefore we append a text node.
      scriptElt.appendChild(doc.createTextNode(script));
      doc.body.appendChild(scriptElt);
      doc.body.removeChild(scriptElt);
    }
  } else {
    throw Error('goog.globalEval not available');
  }
};


/**
 * Indicates whether or not we can call 'eval' directly to eval code in the
 * global scope. Set to a Boolean by the first call to goog.globalEval (which
 * empirically tests whether eval works for globals). @see goog.globalEval
 * @type {?boolean}
 * @private
 */
goog.evalWorksForGlobals_ = null;


/**
 * Optional map of CSS class names to obfuscated names used with
 * goog.getCssName().
 * @type {Object|undefined}
 * @private
 * @see goog.setCssNameMapping
 */
goog.cssNameMapping_;


/**
 * Optional obfuscation style for CSS class names. Should be set to either
 * 'BY_WHOLE' or 'BY_PART' if defined.
 * @type {string|undefined}
 * @private
 * @see goog.setCssNameMapping
 */
goog.cssNameMappingStyle_;


/**
 * Handles strings that are intended to be used as CSS class names.
 *
 * This function works in tandem with @see goog.setCssNameMapping.
 *
 * Without any mapping set, the arguments are simple joined with a
 * hyphen and passed through unaltered.
 *
 * When there is a mapping, there are two possible styles in which
 * these mappings are used. In the BY_PART style, each part (i.e. in
 * between hyphens) of the passed in css name is rewritten according
 * to the map. In the BY_WHOLE style, the full css name is looked up in
 * the map directly. If a rewrite is not specified by the map, the
 * compiler will output a warning.
 *
 * When the mapping is passed to the compiler, it will replace calls
 * to goog.getCssName with the strings from the mapping, e.g.
 *     var x = goog.getCssName('foo');
 *     var y = goog.getCssName(this.baseClass, 'active');
 *  becomes:
 *     var x= 'foo';
 *     var y = this.baseClass + '-active';
 *
 * If one argument is passed it will be processed, if two are passed
 * only the modifier will be processed, as it is assumed the first
 * argument was generated as a result of calling goog.getCssName.
 *
 * @param {string} className The class name.
 * @param {string=} opt_modifier A modifier to be appended to the class name.
 * @return {string} The class name or the concatenation of the class name and
 *     the modifier.
 */
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };

  var renameByParts = function(cssName) {
    // Remap all the parts individually.
    var parts = cssName.split('-');
    var mapped = [];
    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join('-');
  };

  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == 'BY_WHOLE' ?
        getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }

  if (opt_modifier) {
    return className + '-' + rename(opt_modifier);
  } else {
    return rename(className);
  }
};


/**
 * Sets the map to check when returning a value from goog.getCssName(). Example:
 * <pre>
 * goog.setCssNameMapping({
 *   "goog": "a",
 *   "disabled": "b",
 * });
 *
 * var x = goog.getCssName('goog');
 * // The following evaluates to: "a a-b".
 * goog.getCssName('goog') + ' ' + goog.getCssName(x, 'disabled')
 * </pre>
 * When declared as a map of string literals to string literals, the JSCompiler
 * will replace all calls to goog.getCssName() using the supplied map if the
 * --closure_pass flag is set.
 *
 * @param {!Object} mapping A map of strings to strings where keys are possible
 *     arguments to goog.getCssName() and values are the corresponding values
 *     that should be returned.
 * @param {string=} style The style of css name mapping. There are two valid
 *     options: 'BY_PART', and 'BY_WHOLE'.
 * @see goog.getCssName for a description.
 */
goog.setCssNameMapping = function(mapping, style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = style;
};


/**
 * Abstract implementation of goog.getMsg for use with localized messages.
 * @param {string} str Translatable string, places holders in the form {$foo}.
 * @param {Object=} opt_values Map of place holder name to value.
 * @return {string} message with placeholders filled.
 */
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {};
  for (var key in values) {
    var value = ('' + values[key]).replace(/\$/g, '$$$$');
    str = str.replace(new RegExp('\\{\\$' + key + '\\}', 'gi'), value);
  }
  return str;
};


/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated,
 * unless they are exported in turn via this function or
 * goog.exportProperty
 *
 * <p>Also handy for making public items that are defined in anonymous
 * closures.
 *
 * ex. goog.exportSymbol('Foo', Foo);
 *
 * ex. goog.exportSymbol('public.path.Foo.staticFunction',
 *                       Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. goog.exportSymbol('public.path.Foo.prototype.myMethod',
 *                       Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Object the name should point to.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is |goog.global|.
 */
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};


/**
 * Exports a property unobfuscated into the object's namespace.
 * ex. goog.exportProperty(Foo, 'staticFunction', Foo.staticFunction);
 * ex. goog.exportProperty(Foo.prototype, 'myMethod', Foo.prototype.myMethod);
 * @param {Object} object Object whose static property is being exported.
 * @param {string} publicName Unobfuscated name to export.
 * @param {*} symbol Object the name should point to.
 */
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { }
 *
 * function ChildClass(a, b, c) {
 *   ParentClass.call(this, a, b);
 * }
 *
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // works
 * </pre>
 *
 * In addition, a superclass' implementation of a method can be invoked
 * as follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.superClass_.foo.call(this, a);
 *   // other code
 * };
 * </pre>
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
};


/**
 * Call up to the superclass.
 *
 * If this is called from a constructor, then this calls the superclass
 * contructor with arguments 1-N.
 *
 * If this is called from a prototype method, then you must pass
 * the name of the method as the second argument to this function. If
 * you do not, you will get a runtime error. This calls the superclass'
 * method with arguments 2-N.
 *
 * This function only works if you use goog.inherits to express
 * inheritance relationships between your classes.
 *
 * This function is a compiler primitive. At compile-time, the
 * compiler will do macro expansion to remove a lot of
 * the extra overhead that this function introduces. The compiler
 * will also enforce a lot of the assumptions that this function
 * makes, and treat it as a compiler error if you break them.
 *
 * @param {!Object} me Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 */
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (caller.superClass_) {
    // This is a constructor. Call the superclass constructor.
    return caller.superClass_.constructor.apply(
        me, Array.prototype.slice.call(arguments, 1));
  }

  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for (var ctor = me.constructor;
       ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }

  // If we did not find the caller in the prototype chain,
  // then one of two things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error(
        'goog.base called from a method of one name ' +
        'to a method of a different name');
  }
};


/**
 * Allow for aliasing within scope functions.  This function exists for
 * uncompiled code - in compiled code the calls will be inlined and the
 * aliases applied.  In uncompiled code the function is simply run since the
 * aliases as written are valid JavaScript.
 * @param {function()} fn Function to call.  This function can contain aliases
 *     to namespaces (e.g. "var dom = goog.dom") or classes
 *    (e.g. "var Timer = goog.Timer").
 */
goog.scope = function(fn) {
  fn.call(goog.global);
};


goog.provide('sage.cron.Job');



/**
 * @constructor
 * @param {!string|!sage.cron.Spec} spec the interval specification.
 * @param {!Function} block the function associated with this cron.
 */
sage.cron.Job = function(spec, block) {
  if (typeof spec === 'string') {
    spec = new sage.cron.Spec(spec);
  }

  /**
   * @type {!sage.cron.Spec}
   * @private
   */
  this.cronspec_ = spec;

  /**
   * @type {!Function}
   * @private
   */
  this.block_ = block;

  /**
   * @type {?Date}
   */
  this.last_at = null;

  this.calcNextAt_();

};


/**
 * @private
 * @return {undefined} returns nothing.
 */
sage.cron.Job.prototype.calcNextAt_ = function() {
  /** @type {Date} */
  var now = new Date();
  /** @type {Date|undefined} */
  var temp;
  if (this.last_at) {
    temp = /** @type {Date} */ this.cronspec.next(this.last_at);
    while (temp < now) {
      temp = this.cronspec.next(temp);
    }
  } else {
    temp = this.cronspec.next(now);
  }

  /** @type {Date} */
  this.next_at = temp;
};


/**
 * @param {Date|undefined} date get the timeout from date.
 * @return {number} returns the timeout value.
 */
sage.cron.Job.prototype.getNextTimeout = function(date) {
  if (!date) {
    date = new Date();
  }

  if (! this.next_at) {
    this.calcNextAt();
  }

  return Math.max(10, this.next_at - date);
};


/**
 * @return {undefined} returns nothing.
 */
sage.cron.Job.prototype.run = function() {
  this.last_at = new Date();
  setTimeout(this.job, 10);
  this.calcNextAt();
};

goog.provide('sage.cron.Scheduler');
goog.require('sage.cron.Job');



/**
 * the cron scheduler
 * @constructor
 */
sage.cron.Scheduler = function() {
  /**
   * @private
   * @type {Array.<sage.cron.Job>}
   */
  this.jobs_ = [];

  /**
   * @type {boolean}
   * @private
   */
  this.running_ = false;
};


/**
 * @param {sage.cron.Job} job a cron job to add.
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.add = function(job) {
  this.jobs_.push(job);
  if (this.running_) {
    this.next();
  }
};


/**
 * @param {sage.cron.Job} job the job to remove.
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.remove = function(job) {
  /** @type {number} */
  var index;
  while ((index = this.jobs.indexOf(job)) !== -1) {
    this.jobs_.splice(index);
  }
};


/**
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.start = function() {
  if (!this.running_) {
    this.running_ = true;
    this.next();
  }
};


/**
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.stop = function() {
  if (this.running_) {
    this.running_ = false;
    clearTimeout(this.stored_timeout_);
    delete this.stored_timeout_;
  }
};


/**
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.next = function() {

  /** @type {boolean} */
  var stop = !this.running || this.stored_timeout_ || this.jobs.length === 0;
  if (stop) {
    return;
  }

  /** @type {sage.cron.Job} */
  var job = this.jobs[0];
  for (var i = 1, l = this.jobs.length; i < l; i++) {
    if (this.jobs[i].next_at_ < job.next_at_) {
      job = this.jobs[i];
    }
  }

  var self = this;
  this.storedTimeout = setTimeout(function() {
    job.run();
    delete self.storedTimeout;
    self.next();
  }, job.getNextTimeout());
};
goog.provide('sage.util.Parser');
goog.provide('sage.util.StringParser');



/**
 * @constructor
 */
sage.util.Parser = function() {};


/**
 * @param {*} item item to parse.
 * @return {*} returns the parsed content.
 */
sage.util.Parser.prototype.parse = function(item) {
  return this.parseInternal.apply(this, arguments);
};


/**
 * @param {*} item item to parse.
 * @return {*} returns the parsed content.
 */
sage.util.Parser.prototype.parseInternal = function(item) {
  return item;
};



/**
 * @constructor
 * @param {RegExp} regex the parser regex.
 * @extends {sage.util.Parser}
 */
sage.util.StringParser = function(regex) {
  goog.base(this);
  /** @type {RegExp} */
  this.regex = regex;
};
goog.inherits(sage.util.StringParser, sage.util.Parser);


/**
 * A string to test if this parser should parse the string.
 * @param {!string} string a string.
 * @return {boolean} returns the result;.
 */
sage.util.StringParser.prototype.test = function(string) {
  this.regex.lastIndex = 0;
  return this.regex.test(string);
};


/**
 * @param {!string} string a string.
 * @return {Array.<string>} returns what e parser can extact from the string.
 */
sage.util.StringParser.prototype.parseInternal = function(string) {
  if (this.test(string)) {
    this.regex.lastIndex = 0;
    return string.match(this.regex);
  }
};
goog.provide('sage.cron.syntax.AllParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 */
sage.cron.syntax.AllParser = function() {
  var regexp = /^\*$/;
  goog.base(this, regexp);
};
goog.inherits(sage.cron.syntax.AllParser, sage.util.StringParser);


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.AllParser.prototype.parseInternal = function(spec, parser) {
  return parser.range.getValues();
};
goog.provide('sage.cron.syntax.RangeParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 * @param {string} allow Allowable string in parser.
 */
sage.cron.syntax.RangeParser = function(allow) {
  var regexp = new RegExp('^' + allow + '-' + allow + '$');
  goog.base(this, regexp, this.parseInternal);
};
goog.inherits(sage.cron.syntax.RangeParser, sage.util.StringParser);


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.RangeParser.prototype.parseInternal = function(spec, parser) {
  var parts = spec.split('-');
  var startAt = parseInt(parts[0]) - parser.range.from;
  var endAt = parseInt(parts[1]) - parser.range.from;
  return parser.range.getValues().slice(startAt, endAt + 1);
};
goog.provide('sage.cron.syntax.IncrementParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 * @param {string} allow Allowable string in parser.
 */
sage.cron.syntax.IncrementParser = function(allow) {
  var regexp = new RegExp('^[^\/]+\/' + allow + '$');
  goog.base(this, regexp);
};
goog.inherits(sage.cron.syntax.IncrementParser, sage.util.StringParser);


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.IncrementParser.prototype.parseInternal =
    function(spec, parser) {

  var parts = /** @type {Array.<string>} */ spec.split('/');
  var range = /** @type {Array.<number>} */parser.parse(parts[0]);
  var increment = /** @type {number} */ parseInt(parts[1]);
  /** @type {Array.<number>} */
  var result = [];
  for (var i = 0, l = range.length; i < l; i += increment) {
    result.push(range[i]);
  }
  return result;
};

goog.provide('sage.util.Range');



/**
 * @constructor
 * @param {number} from the start point.
 * @param {number} to the end point.
 */
sage.util.Range = function(from, to) {

  if (from > to) {
    throw new Error('sage.util.Range: from is larger than to');
  }

  /** @type {number} */
  this.from = from;
  /** @type {number} */
  this.to = to;
  /** @type {number} */
  this.length = 1 + to - from;
};


/**
 * @param {number} index the position of required value.
 * @return {number} returns the number at index.
 */
sage.util.Range.prototype.valueAt = function(index) {
  if (index < 0 || index >= this.length) {
    return undefined;
  }
  return this.from + index;
};


/**
 * @param {number} value a value that might be within range.
 * @return {number} returns the index of value.
 */
sage.util.Range.prototype.indexOf = function(value) {
  var index = -1;

  if (value >= this.from && value <= this.to) {
    index = value - this.from;
  }

  return index;
};


/**
 * @param {?number} from the start point.
 * @param {?number} to the end point.
 * @return {Array.<number>} returns an array of all values.
 */
sage.util.Range.prototype.getValues = function(from, to) {

  if (arguments.length !== 2) {
    to = this.to;
    if (arguments.length === 0) {
      from = this.from;
    }
  }

  return this.getValuesInternal(from, to);
};


/**
 * @param {number} from the start point.
 * @param {number} to the end point.
 * @return {Array.<number>} returns an array of all values.
 */
sage.util.Range.prototype.getValuesInternal = function(from, to) {
  var length, result;

  if (from > to || from < this.from || to > this.to) {
    var str = 'sage.util.Range: ';
    str += 'values are out of range';
    throw new Error(str);
  }

  length = /** @type {number} */ 1 + to - from;
  result = new Array(length);
  if (length > 0) while (length--) {
    result[length] = from + length;
  }
  return result;
};


/**
 * @return {string} returns the string representation of this range;.
 */
sage.util.Range.prototype.toString = function() {
  return 'Range[' + this.from + '..' + this.to + ']';
};
goog.provide('sage.util.array');


/**
 * @param {Array} array the array to remove duplicates from.
 * @return {Array} returns the modified array;.
 */
sage.util.array.uniq = function(array) {
  var len = array.length, value, at;
  for (var i = 0; i < len; i += 1) {
    value = array[i];
    at = i + 1;
    while ((at = array.indexOf(value, at)) !== -1) {
      array.splice(at, 1); len--;
    }
  }
  return array;
};
goog.provide('sage.util.RangeParser');
goog.require('sage.util.Parser');
goog.require('sage.util.Range');
goog.require('sage.util.array');



/**
 * @constructor
 * @extends {sage.util.Parser}
 * @param {number} from the start point.
 * @param {number} to the end point.
 */
sage.util.RangeParser = function(from, to) {
  /** @type {sage.util.Range} */
  this.range = new sage.util.Range(from, to);

  /** @type {Array.<sage.util.StringParser>} */
  this.parsers = [];
};
goog.inherits(sage.util.RangeParser, sage.util.Parser);


/**
 * @param {string} string a range string to parse.
 * @return {Array} returns an array of parsed values.
 */
sage.util.RangeParser.prototype.parseInternal = function(string) {

  var result = /** @type {Array} */ [];
  var len = /** @type {number} */ this.parsers.length;
  var parser, result;

  for (var i = 0; i < len; i++) {
    parser = /** @type {sage.util.Parser} */ this.parsers[i];
    if (parser.test(string)) {
      result = parser.parse(string, this);
      sage.util.array.uniq(result);
      result.sort(function(a, b) {return a - b});
      break;
    }
  }
  return result;
};
goog.provide('sage.cron.syntax.SingleParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 * @param {string} allow Allowable string in parser.
 */
sage.cron.syntax.SingleParser = function(allow) {
  var regexp = new RegExp('^' + allow + '$');
  goog.base(this, regexp);
};
goog.inherits(sage.cron.syntax.SingleParser, sage.util.StringParser);


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.SingleParser.prototype.parseInternal = function(spec, parser) {
  var at = parseInt(spec) - parser.range.from;
  return [parser.range.valueAt(at)];
};
goog.provide('sage.cron.syntax.AliasParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 * @param {string} allow Allowable string in parser.
 */
sage.cron.syntax.AliasParser = function(allow) {
  var regexp = /([a-z][a-z][a-z])|([A-Z][A-Z][A-Z])/g;
  goog.base(this, regexp);
  /** @type {Object.<number>} */
  this.aliases = {};
};
goog.inherits(sage.cron.syntax.AliasParser, sage.util.StringParser);


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.AliasParser.prototype.parseInternal = function(spec, parser) {
  spec = spec.replace(this.matcher, function(string) {
    string = string.toLowerCase();
    if (string in parser.aliases) {
      string = parser.aliases[string];
    }
    return string;
  });
  return parser.parse(spec);
};
goog.provide('sage.cron.syntax.CommaParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 */
sage.cron.syntax.CommaParser = function() {
  var regexp = /\,/;
  goog.base(this, regexp, this.parseInternal);
};
goog.inherits(sage.cron.syntax.CommaParser, sage.util.StringParser);


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.CommaParser.prototype.parseInternal = function(spec, parser) {

  var parts, results, len;

  /** @type {Array.<string>} */
  parts = spec.split(',');
  /** @type {number} */
  len = parts.length;
  /** @type {Array.<number>} */
  results = [];

  for (var i = 0; i < len; i++) {
    results.push.apply(results, parser.parse(parts[i]));
  }
  return results;
};
goog.provide('sage.cron.AliasSpecParser');
goog.provide('sage.cron.SpecParser');

goog.require('sage.cron.syntax.AliasParser');
goog.require('sage.cron.syntax.AllParser');
goog.require('sage.cron.syntax.CommaParser');
goog.require('sage.cron.syntax.IncrementParser');
goog.require('sage.cron.syntax.RangeParser');
goog.require('sage.cron.syntax.SingleParser');
goog.require('sage.util.RangeParser');



/**
 * @constructor
 * @param {number} from start of range.
 * @param {number} to end of range.
 * @param {string} allowable_string allowable string.
 * @extends {sage.util.RangeParser}
 */
sage.cron.SpecParser = function(from, to, allowable_string) {
  goog.base(this, from, to);

  /** @type {string} */
  this.allow = allowable_string;

  this.parsers[0] = new sage.cron.syntax.CommaParser();
  this.parsers[1] = new sage.cron.syntax.AllParser();
  this.parsers[2] = new sage.cron.syntax.SingleParser(this.allow);
  this.parsers[3] = new sage.cron.syntax.RangeParser(this.allow);
  this.parsers[4] = new sage.cron.syntax.IncrementParser(this.allow);
};
goog.inherits(sage.cron.SpecParser, sage.util.RangeParser);



/**
 * @constructor
 * @extends {sage.cron.SpecParser}
 * @param {number} from start of range.
 * @param {number} to end of range.
 * @param {string} allowable_string allowable string.
 */
sage.cron.AliasSpecParser = function(from, to, allowable_string) {
  goog.base(this, from, to, allowable_string);
  this.parsers[5] = new sage.cron.syntax.AliasParser(this.allow);
};
goog.inherits(sage.cron.AliasSpecParser, sage.cron.SpecParser);
goog.provide('sage.cron.SpecDayParser');
goog.provide('sage.cron.SpecHourParser');
goog.provide('sage.cron.SpecMinuteParser');
goog.provide('sage.cron.SpecMonthParser');
goog.provide('sage.cron.SpecSecondParser');
goog.provide('sage.cron.SpecWeekdayParser');
goog.require('sage.cron.SpecParser');
goog.require('sage.util.Parser');


/** @type {sage.cron.SpecParser} */
sage.cron.SpecSecondParser =
    new sage.cron.SpecParser(0, 59, '[1-5]?[0-9]');


/** @type {sage.cron.SpecParser} */
sage.cron.SpecMinuteParser =
    new sage.cron.SpecParser(0, 59, '[1-5]?[0-9]');


/** @type {sage.cron.SpecParser} */
sage.cron.SpecHourParser =
    new sage.cron.SpecParser(0, 23, '(([0-1]?[0-9])|([2][0-3]))');


/** @type {sage.cron.SpecParser} */
sage.cron.SpecDayParser =
    new sage.cron.SpecParser(1, 31, '(([0]?[1-9])|([1-2][0-9])|([3][0-1]))');


/** @type {sage.cron.SpecParser} */
sage.cron.SpecMonthParser =
    new sage.cron.AliasSpecParser(1, 12, '(([0]?[1-9])|([1][0-2]))');


/**
 * @const
 * @type {Object.<number>}
 */
sage.cron.SpecMonthParser.aliases = {
  'jan': 1,
  'feb': 2,
  'mar': 3,
  'apr': 4,
  'may': 5,
  'jun': 6,
  'jul': 7,
  'aug': 8,
  'sep': 9,
  'oct': 10,
  'nov': 11,
  'dec': 12
};


/** @type {sage.cron.SpecParser} */
sage.cron.SpecWeekdayParser =
    new sage.cron.AliasSpecParser(1, 7, '([0]?[1-7])');


/**
 * @const
 * @type {Object.<number>}
 */
sage.cron.SpecWeekdayParser.aliases = {
  'sun': 1,
  'mon': 2,
  'tue': 3,
  'wed': 4,
  'thu': 5,
  'fri': 6,
  'sat': 7
};
goog.provide('sage.util.date');
goog.require('sage.util.array');


/**
 * @param {Date} date the Date object to modify.
 * @param {number} time the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addTime = function(date, time) {
  var current = date.getTime();
  date.setTime(current + time);
  return date;
};


/**
 * @param {Date} date the Date object to modify.
 * @param {number} seconds the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addSeconds = function(date, seconds) {
  var current = date.getSeconds();
  date.setSeconds(current + seconds);
  return date;
};


/**
 * @param {Date} date the Date object to modify.
 * @param {number} minutes the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addMinutes = function(date, minutes) {
  var current = date.getMinutes();
  date.setMinutes(current + minutes);
  return date;
};


/**
 * @param {Date} date the date object to modify.
 * @param {number} hours the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addHours = function(date, hours) {
  /** @type {number} */
  var current = date.getHours();
  date.setHours(current + hours);
  return date;
};


/**
 * @param {Date} date the date object to modify.
 * @param {number} days the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addDays = function(date, days) {
  var current = date.getDate();
  date.setDate(current + days);
  return date;
};


/**
 * @param {Date} date the date object to modify.
 * @param {number} months the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addMonths = function(date, months) {
  var current = date.getMonth();
  date.setMonth(current + months);
  return date;
};


/**
 * @param {Date} date the date object to modify.
 * @param {number} years the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addYears = function(date, years) {
  var current = date.getFullYear();
  date.setFullYear(current + years);
  return date;
};
goog.provide('sage.cron.Spec');
goog.require('sage.cron.SpecDayParser');
goog.require('sage.cron.SpecHourParser');
goog.require('sage.cron.SpecMinuteParser');
goog.require('sage.cron.SpecMonthParser');
goog.require('sage.cron.SpecSecondParser');
goog.require('sage.cron.SpecWeekdayParser');
goog.require('sage.util.date');



/**
 * @constructor
 * @param {string} spec a string spec.
 */
sage.cron.Spec = function(spec) {
  spec = spec.trim();

  if (spec in sage.cron.Spec.aliases_) {
    spec = sage.cron.Spec.aliases_[spec];
  }

  /** @type {string} */
  this.spec = spec;

  var parts = /** @type {Array} */ spec.split(' ');

  if (parts.length !== 6) {
    /** @type {string} */
    var errorString;
    errorString = 'CronSpec only accepts specifications with 6 parts:';
    errorString += spec;
    errorString += ' is invalid';
    throw new Error(errorString);
  }

  /** @type {Array.<number>} */
  this.seconds = sage.cron.SpecSecondParser.parse(parts[0]);
  /** @type {Array.<number>} */
  this.minutes = sage.cron.SpecMinuteParser.parse(parts[1]);
  /** @type {Array.<number>} */
  this.hours = sage.cron.SpecHourParser.parse(parts[2]);
  /** @type {Array.<number>} */
  this.days = sage.cron.SpecDayParser.parse(parts[3]);
  /** @type {Array.<number>} */
  this.months = sage.cron.SpecMonthParser.parse(parts[4]);
  /** @type {Array.<number>} */
  this.weekdays = sage.cron.SpecWeekdayParser.parse(parts[5]);
};


/**
 * @param {Date} date the current date.
 * @return {Date} the next date.
 */
sage.cron.Spec.prototype.next = function(date) {
  /** @type {Date} */
  var next = new Date();
  next.setTime(date.getTime());
  sage.util.date.addSeconds(next, 1);
  next.setMilliseconds(0);

  var len_seconds = this.seconds.length;
  var do_seconds = len_seconds && len_seconds !== 60;

  var len_minutes = this.minutes.length;
  var do_minutes = len_minutes && len_minutes !== 60;

  var len_hours = this.hours.length;
  var do_hours = len_hours && len_hours !== 24;

  var len_weekdays = this.weekdays.length;
  var do_weekdays = len_weekdays && len_weekdays !== 7;

  var len_days = this.days.length;
  var do_days = len_days && len_days.length !== 31;

  var len_months = this.months.length;
  var do_months = len_months && len_months !== 12;

  var done = false, count, flag;
  while (!done) {
    count = next.getSeconds();
    if (do_seconds && this.seconds.indexOf(count) === -1) {
      flag = true;
      for (var i = 0; i < len_seconds; i++) {
        if (this.seconds[i] >= count) {
          next.setSeconds(this.seconds[i]);
          flag = false;
          break;
        }
      }
      if (flag) {
        next.setSeconds(0);
        sage.util.date.addMinutes(next, 1);
      }
      continue;
    }

    count = next.getMinutes();
    if (do_minutes && this.minutes.indexOf(count) == -1) {
      flag = true;
      for (var i = 0; i < len_minutes; i++) {
        if (this.minutes[i] >= count) {
          next.setMinutes(this.minutes[i]);
          flag = false;
          break;
        }
      }
      if (flag) {
        next.setMinutes(0);
        sage.util.date.addHours(next, 1);
      }
      continue;
    }

    count = next.getHours();
    if (do_hours && this.hours.indexOf(count) == -1) {
      flag = true;
      for (var i = 0; i < len_hours; i++) {
        if (this.hours[i] >= count) {
          next.setHours(this.hours[i]);
          flag = false;
          break;
        }
      }
      if (flag) {
        sage.util.date.addDays(next, 1);
        next.setSeconds(0);
        next.setMinutes(0);
        next.setHours(0);
        continue;
      }
    }

    count = next.getDay() + 1;
    if (do_weekdays && this.weekdays.indexOf(count) == -1) {
      flag = true;
      for (var i = 0; i < len_weekdays; i++) {
        if (this.weekdays[i] >= count) {
          var delta = this.weekdays[i] - count;
          sage.util.date.addDays(next, delta - 1);
          flag = false;
          break;
        }
      }
      if (flag) {
        sage.util.date.addDays(next, 8 - count);
        next.setSeconds(0);
        next.setMinutes(0);
        next.setHours(0);
        continue;
      }
    }

    count = next.getDate();
    if (do_days && this.days.indexOf(count) == -1) {
      flag = true;
      for (var i = 0; i < len_days; i++) {
        if (this.days[i] >= count) {
          while (next.getDate() != this.days[i])
            next.setDate(this.days[i]);
          flag = false;
          break;
        }
      }
      next.setSeconds(0);
      next.setHours(0);
      next.setMinutes(0);
      if (flag) {
        next.setDate(1);
        sage.util.date.addMonths(next, 1);
      }
      continue;
    }

    count = next.getMonth() + 1;
    if (do_months && this.months.indexOf(count) == -1) {
      flag = true;
      for (var i = 0; i < len_months; i++) {
        if (this.months[i] >= count) {
          next.setMonth(this.months[i] - 1);
          flag = false;
          break;
        }
      }
      next.setSeconds(0);
      next.setMinutes(0);
      next.setHours(0);
      next.setDate(1);
      if (flag) {
        next.setMonth(0);
        sage.util.date.addYears(next, 1);
      }
      continue;
    }
    done = true;
  }

  return next;
};


/**
 * @type {Object.<string>}
 * @const
 * @private
 */
sage.cron.Spec.aliases_ = {
  '@second' : '* * * * * *',   //on every second
  '@minute' : '0 * * * * *',   //at x:00 for every minute x
  '@halfminute' : '0,30 * * * * *',//at x:00 and x:30 for every minute x
  '@hour' : '0 0 * * * *',   //at x:00:00 for every hour x
  '@halfhour' : '0 0,30 * * *',  //at x:00:00 and x:30:00 for every hour x
  '@daily' : '0 0 0 * * *',   //at midnight of every day
  '@monthly' : '0 0 0 1 * *',   //at the first of every month, 00:00:00
  '@yearly' : '0 0 0 1 1 *',   //at 1Jan 00:00:00 every year
  '@weekly' : '0 0 0 * * 1',   //on sunday 00:00:00 every week
  '@weekday' : '0 0 0 * * 2-6'  //midnight on every weekday
};


/**
 * @param {Date} date object.
 * @param {sage.cron.Spec} cronspec the cron interval specification.
 * @return {Date} returns next date.
 */
sage.cron.Spec.next = function(date, cronspec) {
  return cronspec.next(date);
};
goog.provide('cron.js');
goog.require('sage.cron.Job');
goog.require('sage.cron.Scheduler');
goog.require('sage.cron.Spec');

goog.exportSymbol('Cron', sage.cron.Schduler);
goog.exportSymbol('Cron.Spec', sage.cron.Spec);
goog.exportSymbol('Cron.Spec.prototype.next', sage.cron.Spec.prototype.next);
goog.exportSymbol('Cron.Spec.next', sage.cron.Spec.next);
goog.exportSymbol('Cron.Job', sage.cron.Job);



