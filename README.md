README [![Build Status](https://travis-ci.org/maboiteaspam/phantomizer_demo.png?v=0.1.11)](https://travis-ci.org/maboiteaspam/phantomizer_demo)
====

This document will introduce you phantomizer command line tool.


INSTALL
====
Start by checking ot the project, navigate to the directory.
Then install using regular npm command line.

    npm install

You should then be able to run

    node_modules/.bin/phantomizer --version

To have a global cli access

    npm install -g maboiteaspam/phantomizer

Thus, You should be able to run

    phantomizer --version


USAGE
====

phantomizer command line provides integrated tools to help you during your development activity.

To start phantomizer you must first browse the directory where you have checkout your project.

    cd [my project path]

You can initialize a project

    phantomizer --init demo

You can browse it

    phantomizer --server demo

You can export it

    phantomizer --export demo

You can browse and test it once it is exported

    phantomizer --browse_export demo

You can test it

    phantomizer --test demo

You can document it

    phantomizer --document demo
    see http://maboiteaspam.github.io/phantomizer_demo/demo/documentation/js/docco-style.html for syntax hints

You can code-review it

    phantomizer --code_review demo


COMMAND LINE OPTIONS
====

    phantomizer --[switch] [project]
    phantomizer --verbose --[switch] [project] --target [target]
    phantomizer --version

    --version
    Provide current version of phantomizer

    --verbose
    Gives you more information during execution, affects GruntJS

    --debug
    Gives even you more information during execution, affects GruntJS

    --force
    Particularly for GruntJS

    --help
    Displays command line help


    --init [project]
    Initialize directory and file required fo a project.


    --server [project]
    Starts a new web sever for the given project.


    --document [project]
    Document Javascript and Css files of your project.
    see http://maboiteaspam.github.io/phantomizer_demo/demo/documentation/js/docco-style.html for syntax hints


    --code_review [project] [ --format [junit|checkstyle] ]
    Review Javascript and CSS source code with jshint / csslint

    --code_review [project] --format junit
    Review Javascript and CSS source code with jshint / csslint into a junit formated output file.

    --code_review [project] --format checkstyle
    Review Javascript and CSS source code with jshint / csslint into a checkstyle formated output file.


    --test [project_dir] [ --environment [environment] ] [ --format [junit|tap] ]
    Test your project with qunit

    --test [project_dir] --format junit
    Test your project with qunit and produces jUnit compatible format

    --test [project_dir] --format tap
    Test your project with qunit and produces TAP compatible format


    --export [project] --target [target]
    Builds and exports your project for delivery.

    --browse_export [project] --target [target]
    Browse and test your project once it is exported.


    --list_tasks [project]
    List available GruntJS tasks for configuration.

    --describe_task [project] --task [task]
    Describe task options after auto config has occurred.


    --list_envs [project]
    List available environments for configuration adjustments.

    --describe_env[project] --environment [env]
    Describe env options used for auto-config.


Documentation Index
====

http://maboiteaspam.github.io/phantomizer_demo/


DEMO PROJECT
====

Introduce a knockout integration.
Introduce more specifically phantomizer usage on client side.

Demo project Documentation Index

http://maboiteaspam.github.io/phantomizer_demo/demo/documentation/js/index.html

http://maboiteaspam.github.io/phantomizer_demo/demo/documentation/js/docco-style.html

http://maboiteaspam.github.io/phantomizer_demo/demo/documentation/js/tests/index/index.html

http://maboiteaspam.github.io/phantomizer_demo/demo/documentation/js/wbm/index-wbm.html

http://maboiteaspam.github.io/phantomizer_demo/demo/documentation/js/wbm/inlined.html

http://maboiteaspam.github.io/phantomizer_demo/demo/documentation/js/wbm/ejs.html

http://maboiteaspam.github.io/phantomizer_demo/demo/documentation/js/wbm/knockout.html

http://maboiteaspam.github.io/phantomizer_demo/demo/documentation/js/tests/knockout/knockout.html


BACKBONE PROJECT
====

You ll find there the TodosMvc demo project provided by backbone project to introduce their library.

Original backbone demo

http://backbonejs.org/examples/todos/index.html

It is a bit rewrote to fit the project folders.
To solve the problem of global variable assignation,
the scripts.prepend property of the config.json file helped a lot.

Backbone project Documentation Index

http://maboiteaspam.github.io/phantomizer_demo/backbone/documentation/js/index.html


ZEPTO PROJECT
====

A Zepto integration of TodosMVC backbone example.

Zepto project Documentation Index

http://maboiteaspam.github.io/phantomizer_demo/zepto/documentation/js/index.html

http://maboiteaspam.github.io/phantomizer_demo/zepto/documentation/js/todos/view.html


IE6 PROJECT
====

A working example of IE6 support with its specific integration.

IE6 project Documentation Index

http://maboiteaspam.github.io/phantomizer_demo/ie6/documentation/js/index.html




