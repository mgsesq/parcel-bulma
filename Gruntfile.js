module.exports = function (grunt) {

    var pngquant = require('imagemin-pngquant');
    var mozjpeg = require('imagemin-mozjpeg');
    var gifsicle = require('imagemin-gifsicle');

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
                sourceMap: true,
                outputStyle: 'compact'
            },
            primary: {
                files: {
                    "public/css/styles.min.css": "assets/sass/main.scss"
                }
            }
        },

        postcss: {
            options: {
                processors: [
                    //require('pixrem')(), // add fallbacks for rem units
                    require('autoprefixer-core')({browsers: 'last 3 versions'}), // add vendor prefixes
                    require('cssnano')(), // minify the result
                    require('postcss-wcag-contrast')({ /* options */ }) // turning this off for now, "Fatal error: foreground.alpha is not a function" - seems to be a local problem though
                ]
            },
            primary: {
                map: {
                    inline: false, // save all sourcemaps as separate files...
                    annotation: 'public/css/' // ...to the specified directory
                },
                src: 'public/css/*.css'
            }
        },

        imagemin: {                          // Task
            dynamic: {                         // Another target
                options: {                       // Target options
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [mozjpeg()]
                },
                files: [{
                  expand: true,                  // Enable dynamic expansion
                    cwd: 'assets/img',                   // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'public/img'                  // Destination path prefix
                }]
            }
        },

        clean: {
            build: {
                src: ['public/']
            }
        },

        watch: {
            primary: {
                options: {
                    reload: false,
                    spawn: false,
                    interrupt: false,
                    livereload: true
                },
                files: [
                    'assets/sass/**/*.scss',
                    'assets/js/**/*.js',
                    'assets/img/**/*.{png,jpg,gif}',
                    'assets/html/**/*.html'
                ],
                tasks: ['newer:copy', 'newer:uglify', 'newer:sass', 'newer:imagemin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-postcss');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'uglify', 'sass', 'postcss']);
    grunt.registerTask('prod', ['clean', 'copy', 'uglify', 'sass', 'postcss', 'imagemin']);

    grunt.registerTask('img', ['copy', 'uglify', 'sass', 'postcss', 'imagemin']);
};
