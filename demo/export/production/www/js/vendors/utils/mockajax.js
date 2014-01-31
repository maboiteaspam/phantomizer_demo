"use strict";

// lets you mock any jQuery / Zepto ajax call
define(["vendors/utils/dfrer","vendors/utils/json"],function(dfrer, json){
    (function($) {
        var mocks = [];
        var mock_delay = 1;
        // save original ajax handler and overwrite it
        var _ajax = $.ajax;

        // match a mock given a plain obect and the url / type / dataType keys
        function mock_match(mock,options){
            if( mock.url && options.url && mock.url != options.url ) return false;
            if( mock.type && options.type && mock.type != options.type ) return false;
            if( mock.dataType && options.dataType && mock.dataType != options.dataType ) return false;
            return true;
        }

        function find_mock(options){
            for( var n in mocks ){
                if( mock_match(mocks[n],options) ){
                    return mocks[n];
                }
            }
            return false;
        }

        function find_mock_index(options){
            for( var n in mocks ){
                if( mock_match(mocks[n],options) ){
                    return n;
                }
            }
            return -1;
        }

        // overwrite original ajax handler
        $.ajax = function(options){
            var mock = find_mock(options)
// if a mock can be found, return the pre defiend response
            if( mock ){
                var delay = mock.delay?mock.delay:mock_delay;
                var dfd = new dfrer();
                if(mock.respond.code == 200 ){
                    var data = json.parse(json.stringify(mock.respond.data))
                    window.setTimeout(function(){
                        if( options.success ) options.success(data);
                        dfd.resolve(data);
                    },delay);
                }else{
                    window.setTimeout(function(){
                        if( options.error ) options.error(data);
                        dfd.reject(data);
                    },delay);
                }
                return dfd;
            }else{
// otherwise return normal request handler
                return _ajax(options)
            }
        };

// helper - create a rejected deferer
        $.rejected = function(data){
            var dfd = new dfrer();
            window.setTimeout(function(){
                dfd.reject(data);
            },mock_delay);
            return dfd;
        };

// helper - create a resolved deferer
        $.resolved = function(data){
            var dfd = new dfrer();
            window.setTimeout(function(){
                dfd.resolve(data);
            },mock_delay);
            return dfd;
        };

// force a specific delays on current mocks and those registered later
        $.setMockDelay = function(delay){
            mock_delay = delay;
            for( var n in mocks ){
                if( mocks[n].delay) mocks[n].delay = delay;
            }
        };

// actually mock an ajax call
        $.mock = function(options){
            /*
            options = {
                 url: url                // catch that url
                 ,dataType: "json"       // catch that datatype
                 ,type: verb             // catch that verb
                 ,delay: delay           // wait that delay
                 ,respond: {
                     code: parseInt(code)    // respond that code
                     ,data: data             // respond that data
                     ,dataType: dataType     // respond that datatype
                 }
             }
             */
            mocks.push(options)
        };

// remove a mock
        $.removeMock = function(options){
            var found = false;
            var mock_index = find_mock_index(options)
            while( mock_index > -1 ){
                found = true;
                if( mock_index == 0 ){
                    mocks.shift();
                }else if( mock_index == mocks.length-1 ){
                    mocks.pop();
                }else{
                    var t = mocks;
                    mocks = [];
                    for( var n in t ){
                        if( n != mock_index ) mocks.push(t[n])
                    }
                }
                mock_index = find_mock_index(options)
            }
            return found;
        };
    })(window.Zepto || window.jQuery || $);
})
