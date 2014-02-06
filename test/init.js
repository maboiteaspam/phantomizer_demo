'use strict';

var should = require('should');
var grunt = require('grunt');
var request = require('request');
var log = require('npmlog');

describe('phantomizer command line, init function', function () {


  var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
  var demo_dir = __dirname+"/../demo/";

  var project_name = "test_init_project";
  var gitignoreRegExp = new RegExp("^"+project_name+"([/].*)?$","img");

  this.timeout(5000);

  before(function(){

    log.level = "silent";
    log.level = "info";

    grunt.file.delete(project_name);
    // reset gitignore
    var gitignore = grunt.file.read(".gitignore");
    gitignore.replace(gitignoreRegExp,"");
    if(gitignore)grunt.file.write(".gitignore",gitignore);
  });
  after(function(){
    //grunt.file.delete(project_name);
  });

  it('should init a project', function(done) {
    open_phantomizer([base_cmd,"--init", project_name],function(code,stdout,stderr){
      stdout.should.match(/(Welcome to phantomizer !)/);
      stdout.should.match(/(Setting up directory structure)/);
      stdout.indexOf( process.cwd() ).should.be.greaterThan( -1 );
      stdout.should.match( /test_init_project\/project/ );

      var files = {
        'config.json':process.cwd()+'/'+project_name+'/config.json',
        'playground.html':process.cwd()+'/'+project_name+'/project/www-core/playground.html',
        'playground.js':process.cwd()+'/'+project_name+'/project/www-core/js/playground.js'
      };
      for( var file in files ){
        grunt.file.exists(files[file]).should.be.eql(true,'File is missing: '+files[file]);
      }
      var gitignore = grunt.file.read(".gitignore");
      gitignore.should.match(gitignoreRegExp);
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