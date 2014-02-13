'use strict';

var should = require('should');
var grunt = require('grunt');
var request = require('request');
var log = require('npmlog');

describe('phantomizer command line, init function', function () {


  var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
  var demo_dir = __dirname+"/../demo/";

  var project_name = "demo";

  this.timeout(15000);

  before(function(done){

    log.level = "info";
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

      setTimeout(function(){
        done();
      },500)
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

      grunt.file.read(files['dev/index.xml']).should.match( /tests="2" failures="1"/ );
      grunt.file.read(files['dev/index.xml']).should.match( /<testcase name="It displays &apos;It works !&apos;" tests="1" failures="0" errors="0" time="[^"]+" timestamp="[^"]+">[^<]+<\/testcase>/ );
      grunt.file.read(files['dev/index.xml']).should.match( /<testcase name="It fails !!" tests="1" failures="1" errors="0" time="[^"]+" timestamp="[^"]+">/ );

      grunt.file.read(files['dev/knockout.xml']).should.match( /tests="2" failures="0"/ );

      setTimeout(function(){
        done();
      },500)
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

      grunt.file.read(files['dev/index.tap']).should.match( /^# module: undefined/ );
      grunt.file.read(files['dev/index.tap']).should.match( /ok 1 - / );
      grunt.file.read(files['dev/index.tap']).should.match( /not ok 2 - / );

      grunt.file.read(files['dev/knockout.tap']).should.match( /^# module: undefined/ );
      grunt.file.read(files['dev/knockout.tap']).should.match( /ok 1 - / );
      grunt.file.read(files['dev/knockout.tap']).should.match( /ok 2 - / );

      setTimeout(function(){
        done();
      },500)
    });
  });


  it('should test an exported project with qunit', function(done) {
    this.timeout(35000);
    open_phantomizer([base_cmd,"--export", project_name, "--environment", "staging"],function(code,stdout,stderr){
      open_phantomizer([base_cmd,"--test", project_name, "--environment", "staging"],function(code,stdout,stderr){
        stdout.should.match(/(Welcome to phantomizer !)/);

        stdout.should.match(/([0-9]+\/[0-9]+ assertions failed \([0-9]+ms\))/);

        stdout.should.match(/(It fails !!)/);
        stdout.should.match(/(Actual:[^"]+"It works !")/);
        stdout.should.match(/(Expected:[^"]+"It worked !")/);
        stdout.should.match(/(2\/6 assertions)/);


        stdout.should.not.match( /error[.]onError:/ );
        stdout.should.not.match( /PhantomJS timed out/ );

        setTimeout(function(){
          done();
        },500)
      });
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