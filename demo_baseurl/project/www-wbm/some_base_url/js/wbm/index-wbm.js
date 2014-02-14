"use strict";

// web directories priority
// --------------

// this file demonstrate the effect of having a multiple set of directory
// to serve files
//
// files are available on file system, in that order
//      <project_name>/project/www-core/
//                                      /js/
//                                      /js/index.js <- this file is found first
//                                      /img/
//                                      /css/
//      <project_name>/project/www-wbm/
//                                      /js/
//                                      /js/index.js <- this file is found last, it won t be displayed on client side
//                                      /js/index-wbm.js <- this file is found first, it is displayed
//                                      /img/
//                                      /css/
//
// The file url /js/index.js exists in each web directories,
// only the first one is served
//
// the file url /js/index-wbm.js exists only in wbm,
// this file is served

require([
  "vendors/go-phantomizer/phantomizer"
],function (phantomizer) {


  // declare, execute runtime logic
  // --------------

  // declare the required main handler, there could be only one like this
  // it is always executed on client side browser,
  // no matter the build optimization applied
  phantomizer.render(function(next){
    // This file is served because it does not exist in www-core.
    $("<span class='test'>It works !</span>").appendTo("body");
    next();
  });
});
