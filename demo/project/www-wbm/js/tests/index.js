"use strict";

define([],
    function(){

        function Test(){}
        Test.prototype.init = function(next){
            next();
        };
        Test.prototype.run = function(){

            // declare a new asynchronous test (description, assertion count, handler)
            asyncTest("It displays 'It works !'", 1, function(assert){
                // ensure the rendered text is correct
                assert.equal( $(".test").html(), "It works !", "View display 'It works !'" );
                // do this call to tell qunit it can continue
                start();
            });
        };
        return new Test();
    });