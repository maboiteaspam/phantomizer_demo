"use strict";

require([
    "vendors/go-phantomizer/phantomizer",
    "vendors//go-knockout/knockout-3.0.0.min"
],function (phantomizer, ko) {

    /* required  call */
    phantomizer.afterStaticRender(function(next){
        ko.applyBindings({name:'demo'},$(".content>div:eq(0)").get(0))
        ko.cleanNode($(".content>div:eq(0)").get(0));
        next();
    },"static");
    // required main call
    phantomizer.render(function(next){
        $("<span>It works !</span>").appendTo(".content")
        next();
    });
});
