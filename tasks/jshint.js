"use strict";

module.exports = function(grunt) {
    // load task
    grunt.loadNpmTasks('grunt-contrib-jshint');

    return {
        files: ["index.js", "lib/*.js"],
        options: {
            jshintrc: '.jshintrc'
        }
    };
};