"use strict";

require([
    "vendors/go-phantomizer/phantomizer"
],function (phantomizer) {

    /* required  call */
    phantomizer.render(function(next){
        /*
         This file is served because it does not exist in www-core.
         */
        $("<span>It works !</span>").appendTo("body")
        next();
    });
});
