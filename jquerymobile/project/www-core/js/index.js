"use strict";

require([
  "vendors/go-phantomizer/phantomizer",
],function (phantomizer) {

  phantomizer.beforeRender(function(next){
    $("head base").remove();
    $('<base href="'+window.location.pathname+'" />').prependTo("head"); // required for jqmobile
    next();
  },"static");

  phantomizer.render(function(next){
    $.holdReady( false ); // required for jqmobile
    $("<span class='test'>It works !</span>").appendTo("body");
    next();
  });
});
