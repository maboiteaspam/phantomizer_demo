'use strict';

var should = require('should');
var grunt = require('grunt');
var request = require('request');
var log = require('npmlog');

describe('phantomizer command line, webserver built assets regeneration', function () {

  this.timeout(50000);

  var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
  var demo_dir = __dirname+"/../demo/";

  before(function(){
    log.level = "info";
    log.level = "silent";
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

  function update_file(file,search,replace){
    var c = grunt.file.read(file);
    c = c.replace(search,replace);
    grunt.file.write(file,c);
  }

  // check CSS regen
  // ----------
  var css_str_original = ".test_purpose{\n    font-size:12px;\n}";
  var css_file = "demo/project/www-core/css/index.css";
  it('should update JIT a modified build CSS request, stryke-build', function(done) {

    var css_url = "http://localhost:8080/css/index.css";
    var str_modified = '.i_was_modified_'+(new Date().getTime())+"{\n    font-size:12px;\n}";
    var css_proof_original = "\n.test_purpose{\n    font-size:12px;\n}";

    request(html_url+'?build_profile=stryke-build', function (error, response, body) {
      if( error ) throw error;

      request(css_url, function (error, response, body) {
        if( error ) throw error;
        (response).should.have.status(200);
        (body).should.containEql(css_proof_original);
        (body).should.not.containEql(str_modified);
        setTimeout(function(){
          update_file(css_file,css_str_original,str_modified);
          request(html_url+'?build_profile=stryke-build', function (error, response, body) {
            request(css_url, function (error, response, body) {
              update_file(css_file,str_modified,css_str_original);
              if( error ) throw error;
              (response).should.have.status(200);
              (body).should.containEql(str_modified);
              (body).should.not.containEql(css_proof_original);
              done();
            });
          });
        },1500);
      });
    })
  });
  it('should update JIT a modified build CSS request, stryke-assets-build', function(done) {

    var css_url = "http://localhost:8080/css/index-im-ba.css";
    var str_modified = '\n.i_was_modified_'+(new Date().getTime())+"{\nfont-size:12px;\n}";
    var css_proof_original = "\n.test_purpose{\nfont-size:12px;\n}";

    request(html_url+'?build_profile=stryke-assets-build', function (error, response, body) {
      if( error ) throw error;

      request(css_url, function (error, response, body) {
        if( error ) throw error;
        (response).should.have.status(200);
        (body).should.containEql(css_proof_original);
        (body).should.not.containEql(str_modified);
        setTimeout(function(){
          update_file(css_file,css_str_original,str_modified);
          request(html_url+'?build_profile=stryke-assets-build', function (error, response, body) {
            request(css_url, function (error, response, body) {
              update_file(css_file,str_modified,css_str_original);
              if( error ) throw error;
              (response).should.have.status(200);
              (body).should.containEql(str_modified);
              (body).should.not.containEql(css_proof_original);
              done();
            });
          });
        },1500);
      });
    })
  });
  it('should update JIT a modified build CSS request, stryke-assets-min-build', function(done) {

    var css_url = "http://localhost:8080/css/index-im-mba.css";
    var d = new Date().getTime();
    var str_modified = '.i_was_modified_'+(d)+"{\n    font-size:12px;\n}";
    var str_modified_min = '}.i_was_modified_'+(d)+"{font-size:12px;}";
    var css_proof_original = "}.test_purpose{font-size:12px;}";

    request(html_url+'?build_profile=stryke-assets-min-build', function (error, response, body) {
      if( error ) throw error;

      request(css_url, function (error, response, body) {
        if( error ) throw error;
        (response).should.have.status(200);
        (body).should.containEql(css_proof_original);
        (body).should.not.containEql(str_modified);
        setTimeout(function(){
          update_file(css_file,css_str_original,str_modified);
          request(html_url+'?build_profile=stryke-assets-min-build', function (error, response, body) {
            request(css_url, function (error, response, body) {
              update_file(css_file,str_modified,css_str_original);
              if( error ) throw error;
              (response).should.have.status(200);
              (body).should.containEql(str_modified_min);
              (body).should.not.containEql(css_proof_original);
              done();
            });
          });
        },1500);
      });
    })
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