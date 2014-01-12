"use strict";

require([
    "vendors/go-phantomizer/phantomizer",
    "wbm/vendors/ejs/ejs_production"
],function (phantomizer) {

    /* required  call */
    phantomizer.beforeRender(function(next){
        var head = new EJS({url: 'layout/head.ejs'}).render({});
        $(head).insertBefore(".content")
        var foot = new EJS({url: 'layout/foot.ejs'}).render({});
        $(foot).insertAfter(".content")
        next();
    },"static");
    // required main call
    phantomizer.render(function(next){
        $("<span>It works !</span>").appendTo(".content")
        next();
    });
});
