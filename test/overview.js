'use strict';

var should = require('should');
var grunt = require('grunt');
var request = require('request');
var log = require('npmlog');

var argv_str = process.argv.join(' ');

describe('phantomizer command line, general testing', function () {

  var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
  var demo_dir = __dirname+"/../demo/";

  before(function(){
    log.level = argv_str.match("--stdout")?"info":"silent";
  })

  it('should have a version with the format #.#.#', function(done) {
    open_phantomizer([base_cmd,"--version"],function(code,stdout,stderr){
      stdout.should.match(/(phantomizer\s+\d+[.]\d+[.]\d+)/);
      done();
    });
  });
  it('should clean project working directory after clean task', function(done) {
    open_phantomizer([base_cmd,"--clean","demo"],function(code,stdout,stderr){
      var files = {
        'dev/www/index.html':demo_dir+"export/dev/www/index.html",
        'documentation/':demo_dir+"documentation/",
        'run/':demo_dir+"run/"
      };
      for(var n in files ){
        grunt.file.exists(files[n]).should.eql(false,'File is missing: '+n)
      }
      done();
    });
  });
  it('should provide the files in export_dir after export task', function(done) {
    this.timeout(40000);
    open_phantomizer([base_cmd,"--export","demo"],function(code,stdout,stderr){
      var files = {
        'dev/www/index.html':demo_dir+"export/dev/www/index.html"
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