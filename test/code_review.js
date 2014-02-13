'use strict';

var should = require('should');
var grunt = require('grunt');
var request = require('request');
var log = require('npmlog');

var argv_str = process.argv.join(' ');

describe('phantomizer command line, code review function', function () {


  var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
  var demo_dir = __dirname+"/../demo/";

  var project_name = "demo";

  this.timeout(5000);

  before(function(done){

    log.level = "silent";

    open_phantomizer([base_cmd,"--clean", project_name],function(code,stdout,stderr){
      done();
    });
  });
  after(function(done){
    open_phantomizer([base_cmd,"--clean", project_name],function(code,stdout,stderr){
      done();
    });
  });

  it('should code review a project with jshint/csslint', function(done) {
    open_phantomizer([base_cmd,"--code_review", project_name, "--force"],function(code,stdout,stderr){
      stdout.should.match(/(Welcome to phantomizer !)/);

      stdout.should.match(/(jshint:default)/);

      stdout.should.match(/(ERROR[^ ]+ at)/);
      stdout.should.match(/(jshint-errors[.]js)/);
      stdout.should.match(/(JSHint found )/);
      stdout.should.match(/(2 errors)/);
      stdout.should.match(/( in [0-9]+ files)/);

      stdout.should.match(/(csslint:default)/);

      stdout.should.match(/(Expected end of v)/);
      stdout.should.match(/(Rule is empty)/);
      stdout.should.match(/(csslint-errors[.]css)/);

      done();
    });
  });

  it('should code review a project with jshint/csslint, checkstyle', function(done) {
    open_phantomizer([base_cmd,"--code_review", project_name, "--format", "checkstyle", "--force"],function(code,stdout,stderr){
      stdout.should.match(/(Welcome to phantomizer !)/);

      stdout.should.match(/(jshint:checkstyle)/);

      stdout.should.match(/(code_review\/jshint_checkstyle.xml" created.)/);

      stdout.should.match(/(csslint:checkstyle)/);

      stdout.should.match(/(Expected end of v)/);
      stdout.should.match(/(Rule is empty)/);
      stdout.should.match(/(csslint-errors[.]css)/);

      var files = {
        'code_review/csslint_checkstyle.xml':'demo/code_review/csslint_checkstyle.xml',
        'code_review/jshint_checkstyle.xml':'demo/code_review/jshint_checkstyle.xml'
      };
      for(var n in files ){
        grunt.file.exists(files[n]).should.eql(true,'File is missing: '+n)
      }

      done();
    });
  });

  it('should code review a project with jshint/csslint, junit', function(done) {
    open_phantomizer([base_cmd,"--code_review", project_name, "--format", "junit", "--force"],function(code,stdout,stderr){
      stdout.should.match(/(Welcome to phantomizer !)/);

      stdout.should.match(/(jshint:junit)/);

      stdout.should.match(/(code_review\/jshint_junit.xml" created.)/);

      stdout.should.match(/(csslint:junit)/);

      stdout.should.match(/(Expected end of v)/);
      stdout.should.match(/(Rule is empty)/);
      stdout.should.match(/(csslint-errors[.]css)/);

      var files = {
        'code_review/csslint_junit.xml':'demo/code_review/csslint_junit.xml',
        'code_review/jshint_junit.xml':'demo/code_review/jshint_junit.xml'
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