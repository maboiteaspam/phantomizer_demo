'use strict';

var should = require('should');
var grunt = require('grunt');
var request = require('request');
var log = require('npmlog');

log.level = "info";
log.level = "silent";

var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
var demo_dir = __dirname+"/../demo/";

describe('phantomizer command line', function () {

  it('should have a version with the format #.#.#', function(done) {
    open_phantomizer([base_cmd,"--version"],function(code,stdout,stderr){
      stdout.should.match(/(phantomizer\s+\d+[.]\d+[.]\d+)/);
      done();
    });
  });
  it('should clean project working directory after clean task', function(done) {
    open_phantomizer([base_cmd,"--clean","demo"],function(code,stdout,stderr){
      (grunt.file.exists(demo_dir+"export/dev/www/index.html")).should.be.false;
      (grunt.file.exists(demo_dir+"documentation/")).should.be.false;
      (grunt.file.exists(demo_dir+"run/")).should.be.false;
      done();
    });
  });
  it('should provide the files in export_dir after export task', function(done) {
    this.timeout(20000);
    open_phantomizer([base_cmd,"--export","demo"],function(code,stdout,stderr){
      (grunt.file.exists(demo_dir+"export/dev/www/index.html")).should.be.true;
      done();
    });
  });
});

function open_phantomizer(args,cb){
  var stdout = "";
  var stderr = "";
  var phantomizer = require('child_process').spawn("node", args);
  phantomizer.stdout.on('data', function (data) {
    log.info('stdout', '', data.toString());
    stdout+=data.toString();
  });
  phantomizer.stderr.on('data', function (data) {
    log.info('stderr', '', data.toString());
    stderr+=data.toString();
  });
  phantomizer.on('exit', function (code) {
    if(cb) cb(code,stdout,stderr);
  });
  return phantomizer;
}