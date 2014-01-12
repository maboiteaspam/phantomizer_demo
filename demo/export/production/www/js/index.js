"use strict";

require([
    "vendors/go-phantomizer/phantomizer"
],function (phantomizer) {

    phantomizer.render(function(next){
        $("<span>It works !</span>").appendTo("body")
        next();
    });
});
