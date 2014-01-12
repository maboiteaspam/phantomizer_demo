README

This document will introduce you phantomizer command line tool.


INSTALL

    npm install

You should be able to run

    node_modules/.bin/phantomizer --version

    npm install -g maboiteaspam/phantomizer

You should be able to run

    phantomizer --version


USAGE

    phantomizer command line gives you access to some tools to help
    you during your development activity.
    To start phantomizer you must first browse the directory where you have initialized your project.

General usage

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
