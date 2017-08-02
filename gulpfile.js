'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var merge = require('merge-stream');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

var options = {
  src: {
    root: 'theme',
    scripts: 'theme/assets/js',
    sass: 'theme/assets/scss',
    icons: 'theme/icons',
  },
  dist: {
    root: '.build',
    assets: '.build/assets',
    snippets: '.build/snippets'
  },
  store: 'your-store.myshopify.com',
  themeId: '123456789'
};

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
  return gulp.src(options.src.scripts + '/script.js')
    .pipe($.newer({
      dest: options.dist.assets,
      ext: '.js.liquid',
      extra: options.src.scripts + '/**/*.js'
    }))
    .pipe($.include()).on('error', console.log)
    .pipe($.rename({extname: '.js.liquid'}))
    .pipe(gulp.dest(options.dist.assets));
});

gulp.task('sass', function() {
  return gulp.src(options.src.sass + '/style.scss')
    .pipe($.newer({
      dest: options.dist.assets,
      ext: '.css.liquid',
      extra: options.src.sass + '/**/*.scss'
    }))
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.rename({extname: '.css.liquid'}))
    .pipe(gulp.dest(options.dist.assets));
});

gulp.task('icons', function() {
  return gulp.src(options.src.icons + '/**/*.svg')
    .pipe($.newer({
      dest: options.dist.snippets,
      ext: '.liquid'
    }))
    .pipe($.svgmin({
      plugins: [{removeTitle: true}, {removeDesc: true}],
    }))
    .pipe($.cheerio({
      run: processSvg
    }))
    .pipe($.rename({extname: '.liquid'}))
    .pipe(gulp.dest(options.dist.snippets));
});

gulp.task('copy', function() {
  return gulp.src([
      options.src.root + '/**/*',
      '!' + options.src.scripts + '{,/**}',
      '!' + options.src.sass + '{,/**}',
      '!' + options.src.icons + '{,/**}'
    ])
    .pipe($.newer(options.dist.root))
    .pipe(gulp.dest(options.dist.root));
});

gulp.task('serve', ['scripts', 'sass', 'icons', 'copy'], function() {
  browserSync.init({
    proxy: 'https://' + options.store + '?preview_theme_id=' + options.themeId,
    injectChanges: false
  });

  gulp.watch(options.src.scripts + '/**/*.js', ['scripts']);
  gulp.watch(options.src.sass + '/**/*.scss', ['sass']);
  gulp.watch(options.src.icons + '/**/*.svg', ['icons']);
  gulp.watch([
    options.src.root + '/**/*',
    '!' + options.src.scripts + '/**/*',
    '!' + options.src.sass + '/**/*',
    '!' + options.src.icons + '/**/*'
  ], ['copy']);

  gulp.watch('/tmp/theme.update').on('change', browserSync.reload);
});

gulp.task('minify', function() {
  var scripts = gulp.src(options.dist.assets + '/*.js.liquid')
    .pipe($.uglify())
    .pipe(gulp.dest(options.dist.assets));

  var sass = gulp.src(options.src.sass + '/style.scss')
    .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
    .pipe($.rename({extname: '.css.liquid'}))
    .pipe(gulp.dest(options.dist.assets));

  return merge(scripts, sass);
});

gulp.task('clean', function() {
  return del([options.dist.root + '/**/*', '!' + options.dist.root + '/**/*.yml*']);
});

gulp.task('compress', function() {
  return gulp.src(options.dist.root + '/**/*')
    .pipe($.zip('your-theme-name.zip'))
    .pipe(gulp.dest('upload'));
});

gulp.task('default', ['serve']);

gulp.task('build', function() {
  runSequence(['scripts', 'icons', 'copy'], 'minify');
});

gulp.task('dist', function() {
  runSequence('clean', ['scripts', 'icons', 'copy'], 'minify', 'compress');
});
