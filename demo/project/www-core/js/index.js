"use strict";

require([
  "vendors/go-phantomizer/phantomizer"
],function (phantomizer) {

  phantomizer.render(function(next){
    $("<span class='test'>It works !</span>").appendTo("body");
    next();
  });

  function that_is_useless(){
    return "test purpose, keep this value";
  }
  that_is_useless();
});
