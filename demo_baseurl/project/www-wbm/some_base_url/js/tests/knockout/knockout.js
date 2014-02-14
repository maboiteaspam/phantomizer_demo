"use strict";
// Qunit test demonstration
// --------------

// take advantage of Qunit to provide test integration

// define a new anonymous module
define([
],function(){
    // The Test structure
    // --------------

    // a set of two methods
    // init : to load fixtures, patch the rendering
    // run : actually declare the specs and their assertions
    function Test(){}

    // Fixture loading
    // --------------

    /**
     * Load your fixture there
     * @param next
     */
    Test.prototype.init = function(next){
        next();
    };

    // Specs declaration
    // --------------

    /**
     * Declare the specs and theirs assertions
     */
    Test.prototype.run = function(){

        // declare a new asynchronous test (description, assertion count, handler)
        asyncTest("It displays 'It works !'", 1, function(assert){
            // ensure the rendered text is correct
            assert.equal( $(".test").html(), "It works !", "View displays 'It works !'" );
            // do this call to tell qunit it can continue
            start();
        });
        asyncTest("It displays 'demo'", 1, function(assert){
            // ensure the rendered text is correct
            assert.equal( $(".head span").html(), "demo", "View displays 'demo'" );
            // do this call to tell qunit it can continue
            start();
        });
    };
    // **pass the module**
    return new Test();
});
