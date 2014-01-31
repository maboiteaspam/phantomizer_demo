README
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

    cd <my project path>

You can initialize a project

    phantomizer --init demo

You can browse it

    phantomizer --server demo

You can export it

    phantomizer --export demo


COMMAND LINE OPTIONS
====

    phantomizer --<switch> <project>
    phantomizer --verbose --<switch> <project> --target <target>
    phantomizer --version

    --version
    Provide current version of phantomizer

    --verbose
    Gives you more information during execution

    --init <project>
    Initialize directory and file required fo a project.

    --server <project>
    Starts a new web sever for the given project.

    --document <project>
    Document Javascript and Css files of your project.

    --test <project> --target <target>
    Tests your project using phantomjs an headless browser.

    --export <project> --target <target>
    Builds and exports your project for delivery.


Documentation Index
====

http://maboiteaspam.github.io/phantomizer_demo/


DEMO PROJECT
====

Introduce a knockout integration.
Introduce more specifically phantomizer usage on client side.

Demo project Documentation Index

http://maboiteaspam.github.io/phantomizer_demo/demo/documentation/js/index.html

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

