README

This document will introduce you phantomizer command line tool.

1. COMMAND LINE
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

2. Structure
    Each project is initalized with default following directory structure.

    /config.json
        Configuration file of your project.
        You can edit and modify the settings of your project and it s built requirements.
    /project
        WebRoot directory of your project.
    /documentation
        Holds the generated Javascript and Css documentation files.
    /export
        The built version of your project will goes here.
    /run
        All the temporary files such meta and build results are stored here.

3. Configuration
    phantomizer use the file config.json on top of your project directory.
    This document contains all the builds and running settings for your project.
    The configuration file is a plain json object.
    Is relies heavily on GruntJs library to implement and execute your build.

