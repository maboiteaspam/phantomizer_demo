"use strict";

require([
  "vendors/go-phantomizer/phantomizer",
],function (phantomizer) {

  phantomizer.render(function(next){
    $("<span class='test'>It works !</span>").appendTo("body");
    next();
  });
});
