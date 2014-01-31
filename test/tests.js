'use strict';

var grunt = require('grunt');
var should = require('should');
var cp = require('child_process');
var spawn = require('child_process').spawn;

var base_cmd = __dirname+"/../node_modules/.bin/phantomizer";
var demo_dir = __dirname+"/../demo/";

describe('phantomizer command line', function () {

    this.timeout(10000);

    it('should have a version with the format #.#.#', function(done) {
        var cmd = base_cmd+" --version ";
        cp.exec(cmd, function (error, stdout, stderr) {
            stdout.should.match(/(phantomizer\s+\d+[.]\d+[.]\d+)/);
            done();
        })
            .on("data",function(f){
                console.log(f)
            });
    });
    it('should provide the files in export_dir after export export task', function(done) {
        var cmd = base_cmd+" --export demo ";
        cp.exec(cmd, function (error, stdout, stderr) {
            (grunt.file.exists(demo_dir+"export/dev/www/index.html")).should.be.true;
            done();
        })
            .on("data",function(f){
                console.log(f)
            });
    });
    it('should clean project working directory after clean task', function(done) {
        var args = [base_cmd,"--clean","demo"];
        var phantomizer = spawn("node", args);
        phantomizer.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        phantomizer.stderr.on('data', function (data) {
            console.log(data.toString());
        });
        phantomizer.on('close', function (code) {
            (grunt.file.exists(demo_dir+"export/dev/www/index.html")).should.be.false;
            (grunt.file.exists(demo_dir+"documentation/")).should.be.false;
            (grunt.file.exists(demo_dir+"run/")).should.be.false;
            done();
        });
    });
});