'use strict';

var should = require('should');
var grunt = require('grunt');
var request = require('request');
var log = require('npmlog');

describe('phantomizer command line, init function', function () {


  var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
  var demo_dir = __dirname+"/../demo/";

  var project_name = "demo";

  this.timeout(5000);

  before(function(done){

    log.level = "silent";
    log.level = "info";

    open_phantomizer([base_cmd,"--clean", project_name],function(code,stdout,stderr){
      done();
    });
  });
  after(function(done){
    open_phantomizer([base_cmd,"--clean", project_name],function(code,stdout,stderr){
      done();
    });
  });

  it('should test a project with qunit', function(done) {
    open_phantomizer([base_cmd,"--test", project_name],function(code,stdout,stderr){
      stdout.should.match(/(Welcome to phantomizer !)/);

      stdout.should.match(/([0-9]+\/[0-9]+ assertions failed \([0-9]+ms\))/);

      stdout.should.match(/(It fails !!)/);
      stdout.should.match(/(Actual:[^"]+"It works !")/);
      stdout.should.match(/(Expected:[^"]+"It worked !")/);
      stdout.should.match(/(2\/6 assertions)/);


      stdout.should.not.match( /error[.]onError:/ );
      stdout.should.not.match( /PhantomJS timed out/ );

      done();
    });
  });

  it('should test a project with qunit and export to junit', function(done) {
    open_phantomizer([base_cmd,"--test", project_name, "--format","junit"],function(code,stdout,stderr){
      stdout.should.match(/(Welcome to phantomizer !)/);

      stdout.should.match(/([0-9]+\/[0-9]+ assertions failed \([0-9]+ms\))/);

      stdout.should.match(/(It fails !!)/);
      stdout.should.match(/(Actual:[^"]+"It works !")/);
      stdout.should.match(/(Expected:[^"]+"It worked !")/);
      stdout.should.match(/(2\/6 assertions)/);


      stdout.should.match( /Writing Junit Report/ );

      var files = {
        'dev/index.xml':'demo/qunit/dev/index.xml',
        'dev/index-wbm.xml':'demo/qunit/dev/index-wbm.xml',
        'dev/knockout.xml':'demo/qunit/dev/knockout.xml'
      };
      for(var n in files ){
        grunt.file.exists(files[n]).should.eql(true,'File is missing: '+n)
      }

      done();
    });
  });

  it('should test a project with qunit and export to tap', function(done) {
    open_phantomizer([base_cmd,"--test", project_name, "--format","tap"],function(code,stdout,stderr){
      stdout.should.match(/(Welcome to phantomizer !)/);

      stdout.should.match(/([0-9]+\/[0-9]+ assertions failed \([0-9]+ms\))/);

      stdout.should.match(/(It fails !!)/);
      stdout.should.match(/(Actual:[^"]+"It works !")/);
      stdout.should.match(/(Expected:[^"]+"It worked !")/);
      stdout.should.match(/(2\/6 assertions)/);


      stdout.should.match( /Writing Tap Report/ );

      var files = {
        'dev/index.tap':'demo/qunit/dev/index.tap',
        'dev/index-wbm.tap':'demo/qunit/dev/index-wbm.tap',
        'dev/knockout.tap':'demo/qunit/dev/knockout.tap'
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