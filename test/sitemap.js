'use strict';

var path = require('path');
var should = require('should');
var grunt = require('grunt');
var request = require('request');
var log = require('npmlog');

var argv_str = process.argv.join(' ');

describe('phantomizer command line, sitemap generator function', function () {


  var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
  var demo_dir = __dirname+"/../demo/";

  var project_name = "demo";

  this.slow(10000);
  this.timeout(20000);

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

  it('should generate a sitemap when using staging environment', function(done) {
    open_phantomizer([base_cmd,"--export", project_name, "--environment", "staging"],function(code,stdout,stderr){

      stdout.should.match(/(Welcome to phantomizer !)/);
      stdout.should.match(/(phantomizer-sitemap)/);
      stdout.should.match(/Export done !/);

      var file = 'demo/export/staging/www/sitemap.xml';
      grunt.file.exists(file).should.eql(true,'File is missing: '+path.relative(process.cwd(),file));

      var c = grunt.file.read(file);
      c.should.match(/<loc>http:\/\/my[.]host[.]com\/index-wbm.html<\/loc>/)
      c.should.match(/http:\/\/www[.]sitemaps[.]org/)
      c.should.match(/knockout[.]html/)
      c.should.not.match(/knockout-1[.]html/)
      c.should.not.match(/knockout-2[.]html/)
      c.match(/<loc>[^<]+<\/loc>/g).length.should.eql(5)

      done();

    });
  });

  it('should not generate a sitemap when using dev environment', function(done) {
    open_phantomizer([base_cmd,"--export", project_name, "--environment", "dev"],function(code,stdout,stderr){

      stdout.should.match(/(Welcome to phantomizer !)/);
      stdout.should.not.match(/(phantomizer-sitemap)/);
      stdout.should.match(/Export done !/);

      var file = 'demo/export/dev/www/sitemap.xml';
      grunt.file.exists(file).should.eql(false,'File must be missing: '+path.relative(process.cwd(),file));

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