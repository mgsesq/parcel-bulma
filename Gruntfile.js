module.exports = function(grunt) {
    const sass = require('node-sass');

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      copy: {
          javascript: {
              cwd: 'assets/js/vendors',  // set working folder / root to copy
              src: '**/*',           // copy all files and subfolders
              dest: 'public/js/vendors',    // destination folder
              expand: true           // required when using cwdcd
          },
          css: {
              cwd: 'assets/css',  // set working folder / root to copy
              src: '**/*',           // copy all files and subfolders
              dest: 'public/css',    // destination folder
              expand: true           // required when using cwdcd
          }
      },

      uglify: {
          options: {
              sourceMap: true
          },
          primary: {
              files: {
                  "public/js/scripts.min.js": [
                      "assets/js/scripts.core.js",
                      "assets/js/components/**/*.js"
                  ]
              }
          }
      },

      sass: {
          options: {
              implementation: sass,
              sourceMap: true,
              outputStyle: 'compact'
          },
          primary: {
              files: {
                  "public/css/styles.min.css": "assets/sass/main.scss"
              }
          }
      }
    });
  
  
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-postcss');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'uglify', 'sass']);
};
