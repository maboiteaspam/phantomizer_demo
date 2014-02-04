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

  this.timeout(5000);

  var phantomizer = null;
  before(function(done){
    if(!phantomizer){
      phantomizer = open_phantomizer([base_cmd,"--server","bootstrap"]);
      phantomizer.stdout.on('data', function (data) {
        if( data.toString().match(/Press enter to leave/) ){
          // helps to prevent some issues
          // when the computer has some slawliness ending the process
          setTimeout(function(){
            done();
          },500);
        }
      });
    }else{
      done();
    }
  });
  after(function(done){
    if(phantomizer){
      phantomizer.stdin.write("\n");
      phantomizer.stdout.on('data', function (data) {
        if( data.toString().match(/See you soon/) ){
          // helps to prevent some issues
          // when the computer has some slawliness ending the process
          setTimeout(function(){
            done();
          },500);
        }
      });
    }else{
      done();
    }
  });


  it('should inject scripts and css in the right order', function(done) {
    request('http://localhost:8080/index.html', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/Index file/);

        ( body.indexOf("<body>") ).should.be.below(  body.indexOf("/js/vendors/go-jquery/jquery-2.0.3.min.js") );
        ( body.indexOf("/js/vendors/go-jquery/jquery-2.0.3.min.js") ).should.be.below(  body.indexOf("/js/vendors/go-bootstrap/3.10/js/bootstrap.min.js") );
        ( body.indexOf("/js/vendors/go-bootstrap/3.10/js/bootstrap.min.js") ).should.be.below(  body.indexOf("/js/require-2.1.10.min.js") );
        ( body.indexOf("/js/require-2.1.10.min.js") ).should.be.below(  body.indexOf("</body>") );

        ( body.indexOf("<head>") ).should.be.below(  body.indexOf("/js/vendors/go-bootstrap/3.10/css/bootstrap.min.css") );
        ( body.indexOf("/js/vendors/go-bootstrap/3.10/css/bootstrap.min.css") ).should.be.below(  body.indexOf("/css/index.css") );
        ( body.indexOf("/css/index.css") ).should.be.below(  body.indexOf("</head>") );
      }
      if( error ) throw error;
      done();
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