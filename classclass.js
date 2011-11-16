/**
 * Copyright (c) 2011 Ken Colton
 * Heavily inspired by John Resig's Simple Inheritance.
 * http://ejohn.org/blog/simple-javascript-inheritance/
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * License available in GPL-LICENSE.txt or <http://www.gnu.org/licenses/>.
 */

(function() {
    
    var initializing = false;
    
    /**
     * A class for keeping track of classes? fancy
     */
    this.Class = function(name)
    {    
        // Record the name for future use
        this.name = name;
    }

    Class.prototype = {

        Extends: function(extends_name)
        {
            // Store the extendsName for future reference
            var classObj = this;
            classObj.extends_name = extends_name;
            return classObj;
        },

        With: function(props)
        {
            var classObj = this;

            // Setup the prototype for this new class
            if (classObj.extends_name) {
                // We are extending, so create a prototype from the parent
                // By setting initializing to true, we skip really calling __construct
                initializing = true;
                classObj.currentPrototype = new window[classObj.extends_name];
                initializing = false;

                classObj.parentPrototype = window[classObj.extends_name].prototype;
                
                // If we are extending a class that was not defined using this utility we
                // need to create a __construct for them because we depend on its existence
                if (typeof classObj.parentPrototype.__construct != 'function') {
                    classObj.parentPrototype.__construct = window[classObj.extends_name];
                }
                
            } else {
                // Not extending anything, so we have a very basic setup
                classObj.currentPrototype = { };
                classObj.parentPrototype = null;
            }
            
            
            // Loop through all of the properties given to us for the new class
            for (var propName in props) {

                // Check if we are overriding a parent function
                if (classObj.parentPrototype &&
                    typeof props[propName] == 'function' && 
                    typeof classObj.parentPrototype[propName] == 'function' && 
                    classObj.checkIfCallsParentFunc(props[propName])) {

                    // This is some magic to stop our variables from colliding
                    // and driving you insane
                    classObj.currentPrototype[propName] = (function(propName, fn) {
                        return function() {
                            // We are being good citizens and saving any existing parentFunc reference
                            // and then replacing it at the end. This is not necessary, nor do we 
                            // expect parentFunc to point to anything outside of this wrappper
                            var savedParentFunc = this.parentFunc;

                            // Set parentFunc reference to reference the parent version of the 
                            // function that we overrode
                            this.parentFunc = classObj.parentPrototype[propName];

                            // Now we can call the overriding function
                            var returnValue = fn.apply(this, arguments);

                            // Restore the original parentFunc member
                            this.parentFunc = savedParentFunc;

                            return returnValue;
                        };
                    })(propName, props[propName]);

                } else {
                    // We are not overriding a parent function
                    classObj.currentPrototype[propName] = props[propName];
                }
            }
            

            // Setup the actual class now that we have everthing built the way we want
            classObj.constructor = window[classObj.name] = function() {
                if (!initializing && this.__construct) {
                    this.__construct.apply(this, arguments);
                }
            };
            
            classObj.constructor.prototype = classObj.currentPrototype;
            classObj.constructor.prototype.constructor = classObj.constructor;
            
            // We wont by chaining after this, but why not
            return classObj;
        },

        checkIfCallsParentFunc: function(checkFunc)
        {
            if (/xyz/.test(function(){xyz;})) {
                // We are in a browser that will return the function contents in a toString call
                // Check if there is a call to parentFunc somewhere in the function contents
                return /\bparentFunc\b/.test(checkFunc);
            }

            // We are in an uncooperative browser, so error on the side of caution and assume 
            // the function calls the parent because we dont know
            return true;
        }
    };


})();
