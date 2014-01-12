'use strict';

// let us know if we run a phantomjs instance
var is_phantom;

define(["vendors/utils/mockajax",
    "vendors/utils/url_util",
    'vendors/go-qunit/phantomjs-bridge',
    'vendors/go-qunit/qunit-1.12.0'],
    function( mockajax, url_util, bridge){

    url_util = new url_util();

    var QUnit = window.QUnit;
    QUnit.config.autostart = false;
    // Don't re-order tests.
    QUnit.config.reorder = false;
    // Run tests serially, not in parallel.
    QUnit.config.autorun = false;
    if( is_phantom == true ){
        QUnit = bridge(QUnit);
    }

    var QUnitLoader = function(){
        var spec_files = url_util.get_param( window.location.search,"spec_files");
        if( spec_files.length > 0 ){
            this.spec_files = spec_files.replace(/%2F/g,"/").split(",");
        }
    }
    QUnitLoader.prototype.spec_files = [];
    QUnitLoader.prototype.tests = [];
    QUnitLoader.prototype.load = function(next){
        var that = this;
// iterate the spec files provided in get arguments, load them with require, and initialize them
// it call next when all tests are done
        if( that.spec_files.length > 0 ){
            $("head").append("<link rel=\"stylesheet\" href=\"/js/vendors/go-qunit/qunit-1.11.0.css\">");

            $("<div id=\"qunit\"></div>").appendTo("body");
            $("<div id=\"qunit-fixture\"></div>").appendTo("body");
            $("#qunit").css("width","100%")
            QUnit.load();
            require(that.spec_files,function(){
                that.tests = [];
                for(var n=0;n<arguments.length;n++){
                    that.tests.push(arguments[n])
                }
                var n = -1;
                var d = that.tests.length;
                var iter = function(){
                    n++;
                    if( that.tests[n] != null ){
// this where test load stubs
                        that.tests[n].init(iter);
                    }
                    if(n==d){
                        if( next ) next(true);
                    }
                }
                iter();
            });
        }else if( next ){
            next(false);
        }
    };
// starts the qunit testing execution
    QUnitLoader.prototype.start = function(next){
        var that = this;
        var started = false;
        var delay = url_util.get_param( location.search, "delay");
        $.setMockDelay(delay || 0);
        if( that.spec_files.length > 0 ){
            for( var n in that.tests){
                that.tests[n].run();
            }
            QUnit.start();
            started=true;
        }
        if( next ) next(started);
    }

    return QUnitLoader;
})