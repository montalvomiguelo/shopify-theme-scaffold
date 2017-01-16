'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var merge = require('merge-stream');
var del = require('del');
var newer = require('gulp-newer');
var runSequence = require('run-sequence');

gulp.task('scripts', function() {
  return gulp.src('theme/assets/js/script-*.js')
    .pipe(newer('.build/assets/script.js.liquid'))
    .pipe(concat('script.js'))
    .pipe(rename({extname: '.js.liquid'}))
    .pipe(gulp.dest('.build/assets'));
});

gulp.task('sass', function() {
  return gulp.src('theme/assets/scss/styles.scss')
    .pipe(newer({
      dest: '.build/assets',
      ext: '.css.liquid',
      extra: 'theme/assets/scss/**/*.scss'
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({extname: '.css.liquid'}))
    .pipe(gulp.dest('.build/assets'));
});

gulp.task('copy', function() {
  var fonts = gulp.src('theme/assets/static/fonts/**/*')
    .pipe(newer('.build/assets'))
    .pipe(gulp.dest('.build/assets'));

  var images = gulp.src('theme/assets/static/img/**/*')
    .pipe(newer('.build/assets'))
    .pipe(gulp.dest('.build/assets'));

  var theme = gulp.src(['theme/**/*', '!theme/assets/**/*'])
    .pipe(newer('.build'))
    .pipe(gulp.dest('.build'));

  return merge(fonts, images, theme);
});

gulp.task('build', ['scripts', 'sass', 'copy']);

gulp.task('clean', function() {
  return del(['.build/**/*', '!.build/**/*.yml*']);
});

gulp.task('watch', function() {
  gulp.watch('theme/assets/scss/**/*.scss', ['sass']);
  gulp.watch('theme/assets/js/**/*.js', ['scripts']);
  gulp.watch([
    'theme/**/*',
    '!theme/assets/**/*',
    'theme/assets/static/img/**/*',
    'theme/assets/static/fonts/**/*'
  ], ['copy']);
});

gulp.task('default', function() {
  runSequence('clean', ['build']);
});
