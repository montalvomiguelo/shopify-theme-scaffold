'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    rename = require('gulp-rename');

gulp.task('scripts', function() {
  return gulp.src('theme/assets/js/script-*.js')
    .pipe(concat('script.js'))
    .pipe(gulp.dest('.build/assets'));
});

gulp.task('compress', function(cb) {
  pump([
    gulp.src('.build/assets/script.js'),
    uglify(),
    rename('script.js.liquid'),
    gulp.dest('.build/assets')
  ],
    cb
  );
});
