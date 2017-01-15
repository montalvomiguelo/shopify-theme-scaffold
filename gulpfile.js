'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

gulp.task('scripts', function() {
  return gulp.src('theme/assets/js/script-*.js')
    .pipe(concat('script.js'))
    .pipe(rename({extname: '.js.liquid'}))
    .pipe(gulp.dest('.build/assets'));
});

gulp.task('sass', function() {
  return gulp.src('theme/assets/scss/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({extname: '.css.liquid'}))
    .pipe(gulp.dest('.build/assets'));
});

gulp.task('build', ['scripts', 'sass']);

gulp.task('default', ['build']);
