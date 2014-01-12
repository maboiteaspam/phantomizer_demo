"use strict";

require([
    "vendors/go-phantomizer/phantomizer"
],function (phantomizer) {

    // execute something during the build because static
    phantomizer.afterStaticRender(function(next){
        var h = [];
        // collect img with class inlined
        $("img.inlined").each(function(k,v){
            var s = $(v).attr("src");
            h.push(
                // get the base64 version of the picture, this route is provided by phantomizer
                $.get("/stryke_b64"+s,function(d){
                    // apply the inlined src
                    $(v).attr("src",d)
                    // clean the class
                    $(v).removeClass("inlined")
                })
            )
        });
        // when this task is done, pass to next handler
        $.when.apply(null, h ).then(next);
    });
    /* required call */
    phantomizer.render(function(next){
        $("<span>It works !</span>").appendTo("body")
        next();
    });
});
