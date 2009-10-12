/**
 * xqtouch.js
 *
 * http://github.com/SlexAxton/xqtouch
 *
 * This script attempts to patch the jquery api used in the jqTouch application
 * onto the xui platform.
 *
 * Some changes had to be made to the xui library directly, but they are very general
 * additions and/or bugfixes to the library and could possibly be pulled into the
 * master repository. Currently my branch of XUI is at the following address:
 *
 * http://github.com/SlexAxton/xui
 *
 * Alot of the code for this project is taken directly from jQuery 1.3.2 in order to
 * maintain compatibility. I have tried to mark the functions that are copy and pasted
 * from the jquery library as best as possible.
 *
 * jQuery (by John Resig | http://ejohn.org) is available at: http://www.jquery.com/
 * 
 * @author  Alex Sexton - AlexSexton@gmail.com | @slexaxton
 * @license MIT
 * 
 */
(function xqtouch(x$){
    // For speed and munging
    var window = this,
    document = window.document,
    undefined,
    
    xq = jQuery = window.jQuery = window.$ = function( selector, context ) {
	// The jQuery object is actually just the init constructor 'enhanced'
	return new xq.fn.init( selector, context );
    };
    
    xq.fn = xq.prototype = {
	init: function(selector, context) {
	    return this;
	},
	append: function() {
	    return this;
	},
	prepend: function() {
	    return this;
	}
    };
    
    xq.fn.init.prototype = xq.fn;
    
    // jQuery extend function -- needed for jqTouch's use of extend()
    xq.extend = xq.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;
	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
	    deep = target;
	    target = arguments[1] || {};
	    // skip the boolean and the target
	    i = 2;
	}
	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !xq.isFunction(target) )
	    target = {};
	// extend jQuery itself if only one argument is passed
	if ( length == i ) {
	    target = this;
	    --i;
	}
	for ( ; i < length; i++ )
	    // Only deal with non-null/undefined values
	    if ( (options = arguments[ i ]) != null )
		// Extend the base object
		for ( var name in options ) {
		    var src = target[ name ], copy = options[ name ];
		    // Prevent never-ending loop
		    if ( target === copy )
			continue;
		    // Recurse if we're merging object values
		    if ( deep && copy && typeof copy === "object" && !copy.nodeType )
			target[ name ] = xq.extend( deep, 
			    // Never move original objects, clone them
			    src || ( copy.length != null ? [ ] : { } )
			, copy );
		    // Don't bring in undefined values
		    else if ( copy !== undefined )
			target[ name ] = copy;
		}
	// Return the modified object
	return target;
    };
    
    xq.extend({
	// jQuery isFunction
	isFunction: function( obj ) {
		return toString.call(obj) === "[object Function]";
	}
    });
    
    xq.fn.extend({
	// Webkit specific domready function
	ready: function(fn) { 
	    var t = setInterval(function () {
		if (/^(loaded|complete)$/.test(document.readyState)) {
		    clearInterval(t), fn();
		}
	    }, 0);
	}
    });
    
    // Naive support object
    xq.support = {};
    
})(this.x$);

