"use strict";

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');

    return {
        test: {
            options: {
                reporter: 'spec'
            },
            src: ['test/**/*.js']
        },

        coverage: {
            options: {
                reporter: 'html-cov',
                // use the quiet flag to suppress the mocha console output
                quiet: true,
                // specify a destination file to capture the mocha
                // output (the quiet option does not suppress this)
                captureFile: 'coverage.html'
            },
            src: ['lib/**/*.js']
        }
    };
};