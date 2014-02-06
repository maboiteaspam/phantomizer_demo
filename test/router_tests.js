'use strict';

var should = require('should');
var request = require('request');
var express = require('express');
var http = require('http');
var log = require('npmlog');

describe('phantomizer command line, router configuration, functionning', function () {

  this.timeout(5000);

  var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";

  var phantomizer = null;
  var app = null;
  var http_clear = null;
  before(function(done){

    log.level = "info";
    log.level = "silent";

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
          done();
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