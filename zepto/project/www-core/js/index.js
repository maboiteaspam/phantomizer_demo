"use strict";

// A refactoring of Backbone demo application
// ----------
// it is refactored to take advantage of requirejs
//
// Originally provided by [JÃ©rÃ´me Gravel-Niquet](http://jgn.me/)
// to Backbone project
require([
  "vendors/go-phantomizer/phantomizer",
  "todos/model",
  "todos/view"
],function (phantomizer, TodoModel, TodoAppView) {

  phantomizer.render(function(next){
    // Create our global collection of **Todos**.
    var TodoList = TodoModel.list;
    var App = TodoAppView( new TodoList(),next );
  });
});
