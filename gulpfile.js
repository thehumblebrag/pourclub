/**
 * Gulp build
 *
 * Build process for developing a SASS + Angular/JS web application.
 * Default build for development will watch and recompile, with debug
 * information on each change of local styleheets + javascript files.
 *
 * For usage information see README.md for this project.
 */

var gulp = require('gulp');
var gutil = require('gulp-util');

// Plugins
var compass = require('gulp-compass');
var jshint = require('gulp-jshint-cached');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');

// Configuration
var config = {
    stylesheets: './public/stylesheets',
    scripts: './public/scripts',
    vendor: './public/vendor',
}

// Remove all existing compiled files
gulp.task('clean', function () {
    gulp.src([config.stylesheets + '/*.css', config.scripts + '/*min.js'])
        .pipe(clean({ force: true, read: false }));
});

// Find Javascript errors and bugs
gulp.task('lint', function () {
    gulp.src([config.scripts + '/*.js', '!' + config.scripts + '/*-min.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile modularized SCSS into single CSS stylesheet
gulp.task('compass', function () {
    gulp.src(config.stylesheets + '/sass/styles.scss')
        .pipe(plumber())
        .pipe(compass({
            css: config.stylesheets,
            sass: config.stylesheets + '/sass',
            outputStyle: 'expanded',
            debugInfo: true
        }))
        .pipe(autoprefixer("last 3 version", "> 1%", "ie 8", "ie 7"))
        .pipe(gulp.dest(config.stylesheets));
});

// Continuously concat angularJS code for
gulp.task('scripts', function () {
     gulp.src([config.vendor + '/angular/angular.js',
               config.vendor + '/angular-resource/angular-resource.js',
               config.vendor + '/angular-eyesight/angular-eyesight.js',
               config.scripts + '/**/*.js',
               '!' + config.scripts + '/**/*min.js'])
        .pipe(plumber())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest(config.scripts));
});

// Run development level tasks, and watch for changes
gulp.task('default', ['clean', 'compass', 'scripts', 'compass'], function () {
    gulp.watch(config.scripts + '/**/*.js', ['scripts']);
    gulp.watch(config.stylesheets + '/**/*.scss', ['compass']);
});

// Run production tasks including minfication, and without debug
gulp.task('production', ['clean', 'compass', 'scripts' ]);
