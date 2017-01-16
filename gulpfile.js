'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var merge = require('merge-stream');
var del = require('del');

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

gulp.task('build', ['scripts', 'sass'], function() {
  var fonts = gulp.src('theme/assets/static/fonts/**/*')
    .pipe(gulp.dest('.build/assets'));

  var images = gulp.src('theme/assets/static/img/**/*')
    .pipe(gulp.dest('.build/assets'));

  var theme = gulp.src(['theme/**/*', '!theme/assets/**/*'])
    .pipe(gulp.dest('.build'));

  return merge(fonts, images, theme);
});

gulp.task('clean', function() {
  del(['.build/**/*', '!.build/**/*.yml*']);
});

gulp.task('watch', function() {
  gulp.watch('theme/assets/scss/**/*.scss', ['sass']);
  gulp.watch('theme/assets/js/**/*.js', ['scripts']);
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
