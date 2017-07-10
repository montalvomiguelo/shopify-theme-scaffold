'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var merge = require('merge-stream');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

function processSvg($, file) {
  var $svg = $('svg');
  var $newSvg = $('<svg aria-hidden="true" focusable="false" role="presentation" class="icon" />');
  var fileName = file.relative.replace('.svg', '');
  var viewBoxAttr = $svg.attr('viewbox');

  // Add necessary attributes
  if (viewBoxAttr) {
    var width = parseInt(viewBoxAttr.split(' ')[2], 10);
    var height = parseInt(viewBoxAttr.split(' ')[3], 10);
    var widthToHeightRatio = width / height;
    if (widthToHeightRatio >= 1.5) {
      $newSvg.addClass('icon--wide');
    }
    $newSvg.attr('viewBox', viewBoxAttr);
  }

  // Add required classes to full color icons
  if (file.relative.indexOf('-full-color') >= 0) {
    $newSvg.addClass('icon--full-color');
  }

  $newSvg
    .addClass(fileName)
    .append($svg.contents());

  $newSvg.append($svg.contents());
  $svg.after($newSvg);
  $svg.remove();
}

gulp.task('scripts', function() {
  return gulp.src(['theme/assets/js/script-*.js'])
    .pipe($.newer('.build/assets/script.js.liquid'))
    .pipe($.concat('script.js'))
    .pipe($.rename({extname: '.js.liquid'}))
    .pipe(gulp.dest('.build/assets'));
});

gulp.task('sass', function() {
  return gulp.src('theme/assets/scss/styles.scss')
    .pipe($.newer({
      dest: '.build/assets',
      ext: '.css.liquid',
      extra: 'theme/assets/scss/**/*.scss'
    }))
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.rename({extname: '.css.liquid'}))
    .pipe(gulp.dest('.build/assets'));
});

gulp.task('copy', function() {
  var images = gulp.src('theme/assets/static/img/**/*')
    .pipe($.newer('.build/assets'))
    .pipe(gulp.dest('.build/assets'));

  var theme = gulp.src(['theme/**/*', '!theme/assets/**/*', '!theme/icons/**/*'])
    .pipe($.newer('.build'))
    .pipe(gulp.dest('.build'));

  return merge(images, theme);
});

gulp.task('icons', function() {
  return gulp.src('theme/icons/**/*.svg')
    .pipe($.newer({
      dest: '.build/snippets',
      ext: '.liquid'
    }))
    .pipe($.svgmin({
      plugins: [{removeTitle: true}, {removeDesc: true}],
    }))
    .pipe($.cheerio({
      run: processSvg
    }))
    .pipe($.rename({extname: '.liquid'}))
    .pipe(gulp.dest('.build/snippets'));
});

gulp.task('serve', ['scripts', 'sass', 'copy', 'icons'], function() {
  browserSync.init({
    proxy: 'https://your-store.myshopify.com',
    injectChanges: false,
  });

  gulp.watch('theme/assets/scss/**/*.scss', ['sass']);
  gulp.watch('theme/assets/js/**/*.js', ['scripts']);
  gulp.watch([
    'theme/**/*',
    '!theme/assets/**/*',
    '!theme/icons/**/*',
    'theme/assets/static/img/**/*',
  ], ['copy']);
  gulp.watch('theme/icons/**/*.svg', ['icons']);

  gulp.watch('/tmp/theme.update').on('change', browserSync.reload);
});

gulp.task('minify', function() {
  var sass = gulp.src('theme/assets/scss/styles.scss')
    .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
    .pipe($.rename({extname: '.css.liquid'}))
    .pipe(gulp.dest('.build/assets'));

  var scripts = gulp.src('.build/assets/*.js.liquid')
    .pipe($.uglify())
    .pipe(gulp.dest('.build/assets'));

  var images = gulp.src('.build/assets/*.+(png|jpg|jpeg|gif|svg)')
    .pipe($.imagemin([
      $.imagemin.gifsicle(),
      $.imagemin.jpegtran(),
      $.imagemin.optipng(),
      $.imagemin.svgo({plugins: [{cleanupIDs: false}, {removeUselessDefs: false}]})
    ]))
    .pipe(gulp.dest('.build/assets'));

  return merge(sass, scripts, images);
});

gulp.task('clean', function() {
  return del(['.build/**/*', 'dist', '!.build/**/*.yml*']);
});

gulp.task('compress', function() {
  return gulp.src('.build/**/*')
    .pipe($.zip('your-theme-name.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['serve']);

gulp.task('build', function() {
  runSequence(['scripts', 'copy', 'icons'], 'minify');
});

gulp.task('dist', function() {
  runSequence('clean', ['scripts', 'copy', 'icons'], 'minify', 'compress');
});
