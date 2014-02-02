"use strict";


// EJS demonstration
// --------------

// take advantage of EJS to statically build the html layout
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
        // loads ejs in a lazy loading manner, for demo purpose,
        // this way, after the whole build occurred, that dependency won t be loaded
        // the truth is, IRL, it is unlikely possible that you dont need your template engine on runtime
        require(["wbm/vendors/ejs/ejs_production.min"],function(){
            // load head and footer view fragment
            var head = new EJS({url: 'layout/head.ejs'}).render({name:"demo"});
            $(head).insertBefore(".content")
            var foot = new EJS({url: 'layout/foot.ejs'}).render({});
            $(foot).insertAfter(".content")
            // call it when your setup has finished
            next();
        });
    },"static");

    // declare, execute runtime logic
    // --------------

    // declare the required main handler, there could be only one like this
    // it is always executed on client side browser,
    // no matter the build optimization applied
    phantomizer.render(function(next){
        $("<span>It works !</span>").appendTo(".content")
        next();
    });
});
