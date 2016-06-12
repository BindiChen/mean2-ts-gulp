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

gulp.task('copyAngularJS2', function() {
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

/*
* Get Bootstrap and font-awesome css, js and fonts 
*/
gulp.task('getCSS', function() {
  return gulp
    .src([
      'node_modules/font-awesome/css/font-awesome.css',
      'node_modules/bootstrap/dist/css/bootstrap.css'
    ])
    .pipe(gulp.dest('prototype/public/css'))
});

gulp.task('getJS', function() {
  return gulp
    .src([
      'node_modules/bootstrap/dist/js/bootstrap.js'
    ])
    .pipe(gulp.dest('prototype/public/js'))
});

gulp.task('getFonts', function() {
  return gulp
    .src([
      'node_modules/font-awesome/fonts/*',
      'node_modules/bootstrap/dist/fonts/*'
    ])
    .pipe(gulp.dest('prototype/public/fonts'))
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

gulp.task('default', ['copyAngularJS2', 'typescript', 'getCSS', 'getJS', 'getFonts', 'watch', 'webserver']);