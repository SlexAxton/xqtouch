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
 * The hitch function is by Peter Higgins
 * http://higginsforpresident.net/js/static/jq.hitch.js
 * and is under Either AFL/New BSD license, see: http://dojotoolkit.org/license
 * 
 * @author  Alex Sexton - AlexSexton@gmail.com | @slexaxton
 *
 * @thanks  Paul Irish - paul.irish@gmail.com | @paul_irish
 * 
 * @license MIT
 * 
 */
(function xqtouch(x$){
    // For speed and munging
    var window = this,
    document = window.document,
    expando = "jQuery" + (+new Date()),
    uuid = 0,
    windowData = {},
    
    xq = window.jQuery = window.$ = function( selector, context ) {
	// The jQuery object is actually just the init constructor 'enhanced'
	return new xq.fn.init( selector, context );
    };
    
    xq.fn = xq.prototype = {
	init: function(selector, context) {
	    this.selector = selector;
	    this.context  = context;
	    this.xObj = x$(selector);	    
	    return this;
	}
    };
    
    xq.fn.init.prototype = xq.fn;
    
    // jQuery extend function -- added a few things to make jslint pass -- needed for jqTouch's use of extend()
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
	if ( typeof target !== "object" && !xq.isFunction(target) ){
	    target = {};
	}
	// extend jQuery itself if only one argument is passed
	if ( length == i ) {
	    target = this;
	    --i;
	}
	for ( ; i < length; i++ ){
	    // Only deal with non-null/undefined values
	    if ( (options = arguments[ i ]) !== null ){
		// Extend the base object
		for ( var name in options ) {
		    if(name){
			var src = target[ name ], copy = options[ name ];
			// Prevent never-ending loop
			if ( target === copy ){
			    continue;
			}
			// Recurse if we're merging object values
			if ( deep && copy && typeof copy === "object" && !copy.nodeType ){
			    target[ name ] = xq.extend(deep, src || ((copy.length !== null) ? [ ] : { }), copy );
			}
			// Don't bring in undefined values
			else if ( copy !== undefined ){
			    target[ name ] = copy;
			}
		    }
		}
	    }
	}
	// Return the modified object
	return target;
    };
    
    xq.extend({
	// jQuery isFunction
	isFunction: function( obj ) {
		return window.toString.call(obj) === "[object Function]";
	},
	// Directly out of Peter Higgin's brain
	hitch: function(scope, method){
	    // summary: Create a function that will only ever execute in a given scope
	    if(!method){ method = scope; scope = null; }
	    if(typeof method == "string"){
		scope = scope || window;
		if(!scope[method]){ throw(['method not found']); }
		return function(){ return scope[method].apply(scope, arguments || []); };
	    }
	    return !scope ? method : function(){ return method.apply(scope, arguments || []); };
	},
	support: {},
	cache: {},
	// data is directly from jQuery
	data: function( elem, name, data ) {
	    elem = elem == window ?
		windowData :
		elem;
	    var id = elem[ expando ];
	    // Compute a unique ID for the element
	    if ( !id ){
		id = elem[ expando ] = ++uuid;
	    }
	    // Only generate the data cache if we're
	    // trying to access or manipulate it
	    if ( name && !xq.cache[ id ] ){
		xq.cache[ id ] = {};
	    }
	    // Prevent overriding the named cache with undefined values
	    if ( data !== undefined ){
		xq.cache[ id ][ name ] = data;
	    }
	    // Return the named cache data, or the ID for the element
	    return name ?
		xq.cache[ id ][ name ] :
		id;
	}
    });
    
    xq.fn.extend({
	ready: function(fn) {
	    // Webkit specific domready function
	    this.xObj.on('DOMContentLoaded',fn);
	    return this;
	},
	prepend: function(obj) {
	    this.xObj.top(obj);
	    return this;
	},
	append: function(obj) {
	    this.xObj.bottom(obj);
	    return this;
	},
	live: function(eventType, fn) {
	    // Save references to our selector for long-term use
	    var liveSelector = this.selector,
	        that         = this;
	    
	    // Attach the event to the document
	    x$(document).on(eventType, function(e){
		// Get all dom elements that match the selector at this point
		var currentMatches = x$(liveSelector).elements,
		    testElem       = e.originalTarget,
		    exists         = true;
		    
		// While we still have elements to test
		while(exists){
		    // If the element or it's parents match, run the function
		    // with the jquery type scope
		    if (currentMatches.indexOf(testElem) >= 0) {
			(xq.hitch(testElem, fn))(e);
			return that;
		    }
		    // If it doesn't match find a parent, or end the loop
		    else {
			if (testElem.parentNode) {
			    testElem = testElem.parentNode;
			}
			else {
			    exists = false;
			}
		    }
		}
		return that;
	    });
	},
	trigger: function(eventString) {
	    // yikes
	    return this;
	},
	each: function(fn) {
	    this.xObj.each(function(elem){
		// Use xui but change the scope a bit
		(xq.hitch(elem, fn))(elem);
	    });
	},
	css: function(styleObj, val){
	    // Check for the case where a key value pair is passed in
	    if( typeof(styleObj) === "string" ) {
		var key = styleObj;
		styleObj = {};
		styleObj[key] = val;
	    }
	    this.xObj.css(styleObj);
	    return this;
	},
	bind: function(eventType, fn) {
	    this.xObj.each(function(elem){
		// Find this element's events
		var evs        = xq.data(elem, 'events'),
		
		    // Create a function that has the right scope
		    customFunc = function(e) {
			(xq.hitch(elem, fn))(e);
		    };
		    
		// If an event has already been added to this elem
		if (typeof(evs) === "object") {
		    // If this type of event already exists
		    if (evs[eventType]) {
			// Add our event to the list
			evs[eventType].push(customFunc);
		    }
		    else {
			// Otherwise create our array for the event type
			evs[eventType] = [customFunc];
		    }
		}
		// Otherwise create the events object and add an entry for our event
		else {
		    evs = {};
		    evs[eventType] = [customFunc];
		}
		
		// Save our events back into our element data
		xq.data(elem, 'events', evs);
		
		// Run this function on this event with xui
		x$(elem).on(eventType, customFunc);
		
	    });
	    return this;
	},
	unbind: function(eventString) {
	    // Obtain an array of all events needing unbinding
	    var event_list = eventString.split(' ');
	    
	    this.xObj.each(function(elem){
		// Get all the events objects currently attached to the element
		var bound_evs = xq.data(elem, 'events');
		
		// Go through each event in the list passed in
		for(var ev in event_list) {
		    // If this event is present in the currently attached events
		    if(bound_evs[event_list[ev]]) {
			// Go through each function that is attached to the elements event
			for (var fn in bound_evs[event_list[ev]]){
			    // If it's present
			    if (bound_evs[event_list[ev]][fn]) {
				//console.log(event_list[ev], bound_evs[event_list[ev]][fn]);
				// Pass the event string and the bound function reference into the remove function
				elem.removeEventListener(event_list[ev], bound_evs[event_list[ev]][fn], false);
			    }
			}
			// Remove the event from the data cache
			delete(bound_evs[event_list[ev]]);
		    }
		}
	    });
	    return this;
	},
	data: function(name, data) {
	    // Handle setting data
	    if (data !== undefined) {
		this.xObj.each(function(elem){
		    xq.data(elem, name, data);
		});
		return this;
	    }
	    // Handle returning data
	    return xq.data(this.xObj.elements[0],name);
	}
    });
})(this.x$);