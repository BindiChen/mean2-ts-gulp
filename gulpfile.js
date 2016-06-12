var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  typescript = require('gulp-typescript'),
  sourcemaps = require('gulp-sourcemaps'),
  tscConfig = require('./tsconfig.json');

var appSrc = 'prototype/lib/',
    tsSrc = 'prototype/src/';

// gulp.task('html', function() {
//   gulp.src(appSrc + '**/*.html');
// });

// gulp.task('css', function() {
//   gulp.src(appSrc + '**/*.css');
// });

gulp.task('copylibs', function() {
  return gulp
    .src([
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',
      'node_modules/angular2/bundles/angular2.dev.js',
      'node_modules/angular2/bundles/http.dev.js',
      'node_modules/angular2/bundles/router.dev.js'
    ])
    .pipe(gulp.dest('prototype/public/js/angular2'));
});

gulp.task('typescript', function () {
  return gulp
    .src(tsSrc + '**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(appSrc));
});
gulp.task('watch', function() {
  gulp.watch(tsSrc + '**/*.ts', ['typescript']);
  gulp.watch(appSrc + 'css/*.css', ['css']);
  gulp.watch(appSrc + '**/*.html', ['html']);
});

gulp.task('webserver', function() {
  nodemon({ script: 'prototype/lib/server/app'
          , ext: 'html js'
          , env: { 'NODE_ENV': 'development' } })
    .on('restart', function () {
      console.log('restarted!')
    });
});

gulp.task('default', ['copylibs', 'typescript', 'watch', 'webserver']);