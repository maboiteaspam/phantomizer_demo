'use strict';

var should = require('should');
var grunt = require('grunt');
var request = require('request');
var log = require('npmlog');

var argv_str = process.argv.join(' ');

describe('phantomizer command line, document function', function () {


  var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
  var demo_dir = __dirname+"/../demo/";

  var project_name = "demo";

  this.timeout(5000);

  before(function(done){

    log.level = argv_str.match("--stdout")?"info":"silent";

    open_phantomizer([base_cmd,"--clean", project_name],function(code,stdout,stderr){
      done();
    });
  });
  after(function(done){
    open_phantomizer([base_cmd,"--clean", project_name],function(code,stdout,stderr){
      done();
    });
  });

  it('should code review a project with docco/styledocco', function(done) {
    open_phantomizer([base_cmd,"--document", project_name],function(code,stdout,stderr){
      stdout.should.match(/(Welcome to phantomizer !)/);

      stdout.should.match(/(phantomizer-docco)/);
      stdout.should.match(/(Directory\s+[0-9]+\/[0-9]+)/);
      stdout.should.match(/( -> )/);
      stdout.should.match(/(phantomizer-styledocco)/);
      stdout.should.match(/([0-9]+\/[0-9]+)/);

      stdout.should.match(/(Done, without errors)/);

      var files = {
        'documentation/css/index.html':'demo/documentation/css/index.html',
        'documentation/css/www-core-css-csslint-errors.html':'demo/documentation/css/www-core-css-csslint-errors.html',
        'documentation/js/index.html':'demo/documentation/js/index.html',
        'documentation/js/wbm/inlined.html':'demo/documentation/js/wbm/inlined.html',
        'documentation/js/tests/index/index.html':'demo/documentation/js/tests/index/index.html'
      };
      for(var n in files ){
        grunt.file.exists(files[n]).should.eql(true,'File is missing: '+n)
      }

      done();

    });
  });

});

function open_phantomizer(args,cb){
  var stdout = "";
  var stderr = "";
  if( argv_str.match("--verbose") ){
    args.push("--verbose");
  }
  if( argv_str.match("--debug") ){
    args.push("--debug");
  }
  if( argv_str.match("--verbose") ){
    log.info('stdout', '', "");
    log.info('stdout', '', "");
    log.info('stdout', '', "node"+args.join(" "));
  }
  var phantomizer = require('child_process').spawn("node", args);
  phantomizer.stdout.on('data', function (data) {
    log.info('stdout', '', data.toString().trim());
    stdout+=data.toString();
  });
  phantomizer.stderr.on('data', function (data) {
    log.info('stderr', '', data.toString().trim());
    stderr+=data.toString();
  });
  phantomizer.on('exit', function (code) {
    if(cb) cb(code,stdout,stderr);
  });
  return phantomizer;
}