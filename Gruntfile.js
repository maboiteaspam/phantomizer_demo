
module.exports = function(grunt) {

    // Phantomizer modules
    // --------------
    //
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // phantomizer webserver
    grunt.loadNpmTasks('phantomizer-grunt');

    // specific optimizer tasks
    grunt.loadNpmTasks('phantomizer-manifest');
    grunt.loadNpmTasks('phantomizer-html-builder');
    grunt.loadNpmTasks('phantomizer-html-assets');
    grunt.loadNpmTasks('phantomizer-requirejs');
    grunt.loadNpmTasks('phantomizer-uglifyjs');
    grunt.loadNpmTasks('phantomizer-strykejs');
    grunt.loadNpmTasks('phantomizer-htmlcompressor');
    grunt.loadNpmTasks('phantomizer-imgopt');
    grunt.loadNpmTasks('phantomizer-manifest');
    grunt.loadNpmTasks('phantomizer-gm');

    // document tasks
    grunt.loadNpmTasks('phantomizer-styledocco');
    grunt.loadNpmTasks('phantomizer-docco');

    // test tasks
    grunt.loadNpmTasks('phantomizer-qunit-runner');

    // project export tasks
    grunt.loadNpmTasks('phantomizer-export-build');

    grunt.loadNpmTasks('phantomizer-confess');

    grunt.loadNpmTasks('phantomizer-websupport');


    // Demo documentation and release support
    // --------------
    //
    // specific to that github hosting

    // Project configuration.
    var config = grunt.config();
    config['pkg'] = grunt.file.readJSON('package.json');
    config['gh-pages'] = {
        options: {
            base: '.',
            add: true
        },
        src: [
            'demo/documentation/**',
            'backbone/documentation/**'
        ]
    };
    config['release'] = {
        options: {
            // update the package json file version number or not
            bump: true, //default: true
            //file: 'component.json', //default: package.json
            // it is actually git add command
            add: false, //default: true
            // it is actually git commit command
            commit: false, //default: true
            // git tag  command
            // tag: false, //default: true
            // git push  command
            // push: false, //default: true
            // pushTags: false, //default: true
            npm: false, //default: true
            // true will apply the version number as the tag
            npmtag: true, //default: no tag
            // folder: 'folder/to/publish/to/npm', //default project root
            tagName: '<%= version %>', //default: '<%= version %>'
            // commitMessage: 'release <%= version %>', //default: 'release <%= version %>'
            //tagMessage: 'tagging version <%= version %>', //default: 'Version <%= version %>',
            github: {
                repo: 'maboiteaspam/phantomizer_demo', //put your user/repo here
                usernameVar: 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains Github username
                passwordVar: 'GITHUB_PASSWORD' //ENVIRONMENT VARIABLE that contains Github password
            }
        }
    };
    grunt.initConfig(config);
    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-release');

    grunt.registerTask('demo-doc', [],function(){
        var done = this.async();
        var cp = require('child_process')
        var cmd = __dirname+"/node_modules/.bin/phantomizer "
        cmd += "--document demo "
        cp.exec(cmd, function (error, stdout, stderr) {
            console.log(error)
            console.log(stdout)
            console.log(stderr)
            done();
        });
    });

    grunt.registerTask('backbone-doc', [],function(){
        var done = this.async();
        var cp = require('child_process')
        var cmd = __dirname+"/node_modules/.bin/phantomizer "
        cmd += "--document backbone "
        cp.exec(cmd, function (error, stdout, stderr) {
            console.log(error)
            console.log(stdout)
            console.log(stderr)
            done();
        });
    });

    grunt.registerTask('cleanup-grunt-temp', [],function(){
        var wrench = require('wrench')
        wrench.rmdirSyncRecursive(__dirname + '/.grunt', !true);
        wrench.rmdirSyncRecursive(__dirname + '/demo/documentation', !true);
        wrench.rmdirSyncRecursive(__dirname + '/backbone/documentation', !true);
    });

    // to generate and publish the docco style documentation
    // execute this
    // grunt
    grunt.registerTask('default', ['demo-doc','backbone-doc','gh-pages', 'cleanup-grunt-temp']);

    // to release the project in a new version
    // use one of those commands
    // grunt --no-write -v release # test only
    // grunt release:patch
    // grunt release:minor
    // grunt release:major
    // grunt release:prerelease

};
