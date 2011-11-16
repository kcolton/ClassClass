===== ClassClass =====

** CAUTION: This is still a work in progress **

Copyright (c) 2011 Ken Colton
Heavily inspired by John Resig's Simple Inheritance.
http://ejohn.org/blog/simple-javascript-inheritance/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

License available in GPL-LICENSE.txt or <http://www.gnu.org/licenses/>.

===== Description =====

ClassClass allows you to create JavaScript "Classes" (prototype objects) using a familiar Class syntax.

===== Usage =====

See demo.html for complete usage.

/**
 * We define a number of classes in a heirarchy and then demo
 * imporant OO features such as calling the parent function,
 * method overriding and lookup
 */

/**
 * Define the Animal class
 */
new Class('Animal').With({
    __construct: function(name)
    {
        this.name = name;
        console.log('constructing animal ' + this.name);
    },
    
    foo: function()
    {
        console.log('foo animal ' + this.name);
        // This will go all the way back down to the base bar for the object
        this.bar();
    }
});

/**
 * Define the K9 class
 */
new Class('K9').Extends('Animal').With({
    __construct: function(name)
    {
        console.log('constructing k9 ' + name);
        // Calling parents also works for constructors
        this.parentFunc(name);
    },
    
    foo: function()
    {
        console.log('foo k9 ' + this.name);
        // Call parnet foo
        this.parentFunc();
    },
    
    bar: function()
    {
        console.log('bar k9 ' + this.name);
    }
});

/**
 * Define the Animal class
 */
new Class('Dog').Extends('K9').With({
    
    // Note there is no constructor here and K9 constructor will automatically get called
    
    foo: function()
    {
        console.log('foo dog ' + this.name);
        // Call the parent foo
        this.parentFunc();
    },
    
    bar: function()
    {
        console.log('bar dog ' + this.name);
        // Call the parent bar
        this.parentFunc();
    }
});

var wonton = new Dog('wonton');
wonton.foo();
