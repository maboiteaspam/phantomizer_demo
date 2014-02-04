"use strict";

require([
  "vendors/go-phantomizer/phantomizer",
],function (phantomizer) {

  phantomizer.render(function(next){
    $(document).ready(function(){console.log("ready")})
    console.log("before ready ???")
    console.log("ready???")
    $("<span class='test'>It works !</span>").appendTo("body");
    next();
  });
});
