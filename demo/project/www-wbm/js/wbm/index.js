"use strict";

require([
    "vendors/go-phantomizer/phantomizer"
],function (phantomizer) {

    /* required  call */
    phantomizer.render(function(next){
        /*
         This file is not server because it can not overwrite www-core.
         */
        $("<span>It does not work !</span>").appendTo("body")
        next();
    });
});
