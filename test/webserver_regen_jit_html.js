'use strict';

var should = require('should');
var grunt = require('grunt');
var request = require('request');
var log = require('npmlog');

var argv_str = process.argv.join(' ');
var log_stdout = argv_str.match("--stdout") || process.env["TEST_STDOUT"];
var log_verbose = argv_str.match("--verbose") || process.env["TEST_VERBOSE"];
var log_debug = argv_str.match("--debug") || process.env["TEST_DEBUG"];

describe('phantomizer command line, webserver built page regeneration', function () {

  this.slow(2500);
  this.timeout(50000);

  var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
  var demo_dir = __dirname+"/../demo/";

  before(function(){
    log.level = log_stdout?"info":"silent";
  })

  var phantomizer = null;
  beforeEach(function(done){
    phantomizer = open_phantomizer([base_cmd,"--server","demo"]);
    phantomizer.stdout.on('data', function (data) {
      if( data.toString().match(/Press enter to leave/) ){
        // helps to prevent some issues
        // when the computer has some slawliness ending the process
        setTimeout(function(){
          done();
        },500);
      }
    });
  });
  afterEach(function(done){
    phantomizer.stdin.write("\n");
    phantomizer.stdout.on('data', function (data) {
      if( data.toString().match(/See you soon/) ){
        // helps to prevent some issues
        // when the computer has some slawliness ending the process
        open_phantomizer([base_cmd,"--clean","demo"],function(){
          setTimeout(function(){
            done();
          },500);
        });
      }
    });
  });

  var html_url = "http://localhost:8080/index.html";

  // check HTML optimization
  // ----------
  it('should render optimized file on request, stryke-build', function(done) {
    request(html_url+'?build_profile=stryke-build', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/<script id="phantom_proof">/);
        (body).should.match(/require\(\['index']/);
        (body).should.match(/Index file/);
        (body).should.match(/css\/index.css/);
      }
      if( error ) throw error;
      done();
    })
  });
  it('should render optimized file on request, stryke-assets-build', function(done) {
    request(html_url+'?build_profile=stryke-assets-build', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/<script id="phantom_proof">/);
        (body).should.match(/src='\/js\/index-ba.js'/);
        (body).should.not.match(/require\(\['index']/);
        (body).should.match(/\/extras-loader.js/);
        (body).should.match(/css\/index-im-ba.css/);
      }
      if( error ) throw error;
      request('http://localhost:8080/js/index-ba.js', function (error, response, body) {
        if( ! error ){
          (response).should.have.status(200);
          (body).should.not.be.empty;
        }
        if( error ) throw error;
        request('http://localhost:8080/css/index-ba.css', function (error, response, body) {
          if( ! error ){
            (response).should.have.status(200);
            (body).should.not.be.empty;
          }
          if( error ) throw error;
          done();
        });
      });
    })
  });
  it('should render optimized file on request, stryke-assets-min-build', function(done) {
    request(html_url+'?build_profile=stryke-assets-min-build', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/<script id="phantom_proof">/);
        (body).should.match(/src='\/js\/index-mba.js'/);
        (body).should.not.match(/require\(\['index']/);
        (body).should.match(/\/extras-loader.js/);
        (body).should.match(/css\/index-im-mba.css/);
      }
      if( error ) throw error;
      request('http://localhost:8080/js/index-mba.js', function (error, response, body) {
        if( ! error ){
          (response).should.have.status(200);
          (body).should.not.be.empty;
        }
        if( error ) throw error;
        request('http://localhost:8080/css/index-mba.css', function (error, response, body) {
          if( ! error ){
            (response).should.have.status(200);
            (body).should.not.be.empty;
          }
          if( error ) throw error;
          done();
        });
      });
    })
  });

  var str_original = '<input type="hidden" name="keep_it" value="test purpose" />';
  var proof_original = '<input type="hidden" name="keep_it" value="test purpose">';
  var file = "demo/project/www-core/index.html";
  function update_file(file,search,replace){
    var c = grunt.file.read(file);
    c = c.replace(search,replace);
    grunt.file.write(file,c);
  }

  // check HTML regen
  // ----------
  it('should update JIT a modified build HTML request, stryke-build', function(done) {

    var str_modified = '<input type="hidden" name="keep_it" value="i was modified '+(new Date().getTime())+'">';

    request(html_url+'?build_profile=stryke-build', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.containEql(proof_original);
        (body).should.not.containEql(str_modified);
      }
      if( error ) throw error;

      setTimeout(function(){
        update_file(file,str_original,str_modified);
        request(html_url+'?build_profile=stryke-build', function (error, response, body) {
          if( ! error ){
            update_file(file,str_modified,str_original);
            (response).should.have.status(200);
            (body).should.containEql(str_modified);
            (body).should.not.containEql(proof_original);
          }
          if( error ) throw error;
          done();
        });
      },1500);
    })
  });
  it('should update JIT a modified build HTML request, stryke-assets-build', function(done) {

    var str_modified = '<input type="hidden" name="keep_it" value="i was modified '+(new Date().getTime())+'">';

    request(html_url+'?build_profile=stryke-assets-build', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.containEql(proof_original);
        (body).should.not.containEql(str_modified);
      }
      if( error ) throw error;
      setTimeout(function(){
        update_file(file,str_original,str_modified);
        request(html_url+'?build_profile=stryke-assets-build', function (error, response, body) {
          if( ! error ){
            update_file(file,str_modified,str_original);
            (response).should.have.status(200);
            (body).should.containEql(str_modified);
            (body).should.not.containEql(proof_original);
          }
          if( error ) throw error;
          done();
        });
      },1500);
    })
  });
  it('should update JIT a modified build HTML request, stryke-assets-min-build', function(done) {

    var str_modified = '<input type="hidden" name="keep_it" value="i was modified '+(new Date().getTime())+'">';

    request(html_url+'?build_profile=stryke-assets-min-build', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.containEql(proof_original);
        (body).should.not.containEql(str_modified);
      }
      if( error ) throw error;

      setTimeout(function(){
        update_file(file,str_original,str_modified);
        request(html_url+'?build_profile=stryke-assets-min-build', function (error, response, body) {
          if( ! error ){
            update_file(file,str_modified,str_original);
            (response).should.have.status(200);
            (body).should.containEql(str_modified);
            (body).should.not.containEql(proof_original);
          }
          if( error ) throw error;
          done();
        });
      },1500);
    })
  });

});

function open_phantomizer(args,cb){
  var stdout = "";
  var stderr = "";
  if( log_verbose ){
    args.push("--verbose");
  }
  if( log_debug ){
    args.push("--debug");
  }
  if( log_verbose ){
    args.push("--verbose");
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