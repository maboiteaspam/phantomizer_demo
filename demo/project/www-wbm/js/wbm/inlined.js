"use strict";

// Demonstrate html-picture in-lining
// --------------

// takes advantage of the build process
// to inline HTML pictures using base64
require([
    "vendors/go-phantomizer/phantomizer"
],function (phantomizer) {

    // render static HTML
    // --------------

    // attach an handler to the render build, before the main, after the templating
    // because it is static it is executed only when the application is not built at all
    phantomizer.afterStaticRender(function(next){

        var h = [];
        // iterate each img.inlined and inline them in base64
        $("img.inlined").each(function(k,v){
            var s = $(v).attr("src");
            h.push(
                // get the base64 version of the picture,
                // this route is provided by phantomizer
                $.get("/stryke_b64"+s,function(d){
                    // apply the inlined src
                    $(v).attr("src",d)
                    // clean the class
                    $(v).removeClass("inlined")
                })
            )
        });
        // when this task is done,
        $.when.apply(null, h )
            // pass to next handler
            .then(next);
    });

    // declare, execute runtime logic
    // --------------

    // declare the required main handler, there could be only one like this
    // it is always executed on client side browser,
    // no matter the build optimization applied
    phantomizer.render(function(next){
        $("<span>It works !</span>").appendTo("body")
        next();
    });
});
