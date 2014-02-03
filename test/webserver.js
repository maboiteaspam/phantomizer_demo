'use strict';

var should = require('should');
var grunt = require('grunt');
var request = require('request');

var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
var demo_dir = __dirname+"/../demo/";

describe('phantomizer command line', function () {

  this.timeout(5000);

  var phantomizer = null;
  before(function(done){
    if(!phantomizer){
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
    }else{
      done();
    }
  })
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
  })


  it('should be able to execute a webserver', function(done) {
    request('http://localhost:8080', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/ejs[.]html/);
      }
      if( error ) throw error;
      done();
    })
  });
  it('should be able to load file from all webdirectories', function(done) {
    request('http://localhost:8080', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/ejs[.]html/);
        (body).should.match(/index[.]html/);
        (body).should.match(/index-wbm[.]html/);
        (body).should.match(/href='\/css'/);
      }
      if( error ) throw error;
      done();
    })
  });
  it('should serve directories in the right order of precedence', function(done) {
    request('http://localhost:8080/index.html', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/Index file/);
        (body).should.not.match(/This file is not server because it can not overwrite www-core./);
      }
      if( error ) throw error;
      done();
    })
  });
  it('should serve correctly files from www-wbm', function(done) {
    request('http://localhost:8080/ejs.html', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/Enable the device preview and focus this text field/);
      }
      if( error ) throw error;
      done();
    })
  });
  it('should serve 404 for files not found', function(done) {
    request('http://localhost:8080/no-such-url.html', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(404);
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
    //console.log(data.toString());
    stdout+=data.toString();
  });
  phantomizer.stderr.on('data', function (data) {
    //console.log(data.toString());
    stderr+=data.toString();
  });
  phantomizer.on('exit', function (code) {
    if(cb) cb(code,stdout,stderr);
  });
  return phantomizer;
}