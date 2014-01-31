"use strict";

// Knockout demonstration
// --------------

// take advantage of Knockout to statically build the html layout
//
// declare main() javascript function of the page-template
require([
    "vendors/go-phantomizer/phantomizer"
],function (phantomizer) {

    // render static HTML
    // --------------

    // attach an handler to the render build, before the main, after the templating
    // because it is static it is executed only when the application is not built at all
    phantomizer.afterStaticRender(function(next){
        // loads knockout in a lazy loading manner, for demo purpose,
        // this way, after the whole build occurred, that dependency won t be loaded
        // the truth is, IRL, it is unlikely possible that you dont need your template engine on runtime
        require(["vendors/go-knockout/knockout-3.0.0.min"],function(ko_){
            var ko = window.ko || ko_;
            var n = $(".head").get(0);
            ko.applyBindings({name:'demo'},n)
            ko.cleanNode(n);
            next();
        });
    });

    // declare, execute runtime logic
    // --------------

    // declare the required main handler, there could be only one like this
    // it is always executed on client side browser,
    // no matter the build optimization applied
    phantomizer.render(function(next){
        $("<span class='test'>It works !</span>").appendTo(".content")
        next();
    });
});
