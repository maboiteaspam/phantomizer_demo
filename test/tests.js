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
        var stdout = "";
        var stderr = "";
        var args = [base_cmd,"--version"];
        var phantomizer = spawn("node", args);
        phantomizer.stdout.on('data', function (data) {
            console.log(data.toString());
            stdout+=data.toString();
        });
        phantomizer.stderr.on('data', function (data) {
            console.log(data.toString());
            stderr+=data.toString();
        });
        phantomizer.on('close', function (code) {
            stdout.should.match(/(phantomizer\s+\d+[.]\d+[.]\d+)/);
            done();
        });
    });
    it('should provide the files in export_dir after export export task', function(done) {
        var stdout = "";
        var stderr = "";
        var args = [base_cmd,"--export","demo"];
        var phantomizer = spawn("node", args);
        phantomizer.stdout.on('data', function (data) {
            console.log(data.toString());
            stdout+=data.toString();
        });
        phantomizer.stderr.on('data', function (data) {
            console.log(data.toString());
            stderr+=data.toString();
        });
        phantomizer.on('close', function (code) {
            (grunt.file.exists(demo_dir+"export/dev/www/index.html")).should.be.true;
            done();
        });
    });
    it('should clean project working directory after clean task', function(done) {
        var stdout = "";
        var stderr = "";
        var args = [base_cmd,"--clean","demo"];
        var phantomizer = spawn("node", args);
        phantomizer.stdout.on('data', function (data) {
            console.log(data.toString());
            stdout+=data.toString();
        });
        phantomizer.stderr.on('data', function (data) {
            console.log(data.toString());
            stderr+=data.toString();
        });
        phantomizer.on('close', function (code) {
            (grunt.file.exists(demo_dir+"export/dev/www/index.html")).should.be.false;
            (grunt.file.exists(demo_dir+"documentation/")).should.be.false;
            (grunt.file.exists(demo_dir+"run/")).should.be.false;
            done();
        });
    });
});