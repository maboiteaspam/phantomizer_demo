"use strict";

require([
    "vendors/go-phantomizer/phantomizer",
    "vendors/json2",
    "vendors/go-jquery/jquery-1.10.2.min",
    "vendors/go-underscore/underscore.1.5.2.min",
    "vendors/backbone",
    "vendors/backbone.localStorage"
],function (phantomizer) {

    phantomizer.render(function(next){
        next();
    });
});
