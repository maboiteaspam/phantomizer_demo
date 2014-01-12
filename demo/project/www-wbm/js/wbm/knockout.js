"use strict";

require([
    "vendors/go-phantomizer/phantomizer",
    "vendors//go-knockout/knockout-3.0.0.min"
],function (phantomizer, ko_) {
    var ko = window.ko || ko_;
    /* required  call */
    phantomizer.afterStaticRender(function(next){
        var n = $(".head").get(0);
        ko.applyBindings({name:'demo'},n)
        ko.cleanNode(n);
        next();
    });
    // required main call
    phantomizer.render(function(next){
        $("<span class='test'>It works !</span>").appendTo(".content")
        next();
    });
});
