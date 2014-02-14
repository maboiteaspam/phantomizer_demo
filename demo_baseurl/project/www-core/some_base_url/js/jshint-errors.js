"use strict";

/* this file is specifically deigned to trigger css lint errors */

require([
  "vendors/go-phantomizer/phantomizer"
],function (phantomizer) {

  phantomizer.render(function(next){
    $("<span class='test'>It works !</span>").appendTo("body")
    next();
  });

  that_is_useless();
});

function that_is_useless(){
  return "test purpose, keep this value"
}