"use strict";
/*global $:false */
/*global jQuery:false */
/*global window:false */
Object.keys = Object.keys || (function() {
  var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !{toString: null}.propertyIsEnumerable("toString"),
          DontEnums = [
    'toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'constructor'
  ],
          DontEnumsLength = DontEnums.length;

  return function(o) {
    if (typeof o !== "object" && typeof o !== "function" || o === null)
      throw new TypeError("Object.keys called on a non-object");

    var result = [];
    for (var name in o) {
      if (hasOwnProperty.call(o, name))
        result.push(name);
    }

    if (hasDontEnumBug) {
      for (var i = 0; i < DontEnumsLength; i++) {
        if (hasOwnProperty.call(o, DontEnums[i]))
          result.push(DontEnums[i]);
      }
    }

    return result;
  };
})();

Array.prototype.addAll = function() {
  var arr;
  /** Adds all the elements in the
   specified arrays to this array. 
   */
  for (var a = 0; a < arguments.length; a++) {
    arr = arguments[a];
    for (var i = 0; i < arr.length; i++) {
      this.push(arr[i]);
    }
  }
};

$.extend({
  getUrlVars: function() {
    var vars = [], hash;
    var hashes = decodeURIComponent(window.location.href).slice(window.location.href.indexOf('?') + 1).split('&');

    for (var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name) {
    return $.getUrlVars()[name];
  }
});
