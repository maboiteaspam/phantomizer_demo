'use strict';

var should = require('should');
var request = require('request');
var express = require('express');
var http = require('http');
var log = require('npmlog');

var argv_str = process.argv.join(' ');
var log_stdout = argv_str.match("--stdout") || process.env["TEST_STDOUT"];
var log_verbose = argv_str.match("--verbose") || process.env["TEST_VERBOSE"];
var log_debug = argv_str.match("--debug") || process.env["TEST_DEBUG"];

describe('phantomizer command line, router configuration, functionning', function () {

  this.slow(2500);
  this.timeout(5000);

  var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";

  var phantomizer = null;
  var app = null;
  var http_clear = null;
  before(function(done){

    log.level = log_stdout?"info":"silent";

    if( !app ){
      app = express();
      app.use("/get_protected_urls_3",express.basicAuth('some_user3', 'some_password3'));
      app.use("/get_protected_urls_2",express.basicAuth('some_user2', 'some_password2'));
      app.use("/get_protected_urls",express.basicAuth('some_user', 'some_password'));
      app.get("/get_urls",function(req, res){
        res.json( ['/get_urls.htm','/get_urls.html'] );
      });
      app.get("/get_urls_old_data_style",function(req, res){
        res.json( {data:['/get_urls_old_data_style.htm','/get_urls_old_data_style.html']} );
      });
      app.get("/get_protected_urls_3",function(req, res){
        res.json( ['/get_protected_urls_3.htm','/get_protected_urls_3.html'] );
      });
      app.get("/get_protected_urls_2",function(req, res){
        res.json( ['/get_protected_urls_2.htm','/get_protected_urls_2.html'] );
      });
      app.get("/get_protected_urls",function(req, res){
        res.json( ['/get_protected_urls.htm','/get_protected_urls.html'] );
      });
      http_clear = http.createServer(app).listen(8001);
    }

    if(!phantomizer){
      phantomizer = open_phantomizer([base_cmd,"--server","router_tests"]);
      phantomizer.stdout.on('data', function (data) {
        if( data.toString().match(/Press enter to leave/) ){
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
    if( app ){
      http_clear.close();
    }
    if(phantomizer){
      phantomizer.stdin.write("\n");
      phantomizer.stdout.on('data', function (data) {
        if( data.toString().match(/See you soon/) ){
          setTimeout(function(){
            done();
          },500);
        }
      });
    }else{
      done();
    }
  })


  it('should be able to read route.url inlined in config file', function(done) {
    request('http://localhost:8080/index.html', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/Index file/);
      }
      done(error)
    })
  });

  it('should be able to read route.urls inlined in config file', function(done) {
    request('http://localhost:8080/index_array.html', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/Index file/);
      }
      done(error)
    })
  });

  it('should be able to read route.urls_datasource from a remote url', function(done) {
    request('http://localhost:8080/get_urls.html', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/Index file/);
      }
      done(error)
    })
  });

  it('should be able to read route.urls_datasource from a remote url protected by user / password, auth_file', function(done) {
    request('http://localhost:8080/get_protected_urls.html', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/Index file/);
      }
      done(error)
    })
  });

  it('should be able to read route.urls_datasource from a remote url protected by user / password, env_var', function(done) {
    request('http://localhost:8080/get_protected_urls_2.html', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/Index file/);
      }
      done(error)
    })
  });

  it('should be able to read route.urls_datasource from a remote url protected by user / password, config', function(done) {
    request('http://localhost:8080/get_protected_urls_3.html', function (error, response, body) {
      if( ! error ){
        (response).should.have.status(200);
        (body).should.match(/Index file/);
      }
      done(error)
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