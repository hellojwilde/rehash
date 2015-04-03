var babel = require('gulp-babel');
var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var webpackConfig = require('./example/webpack.config');

gulp.task('build-node', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      experimental: true
    }))
    .pipe(gulp.dest('lib/'));
});

gulp.task('build-examples', function() {
  return gulp.src('example/')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('example/'));
});

gulp.task('build', ['build-node', 'build-examples']);

gulp.task('deploy', ['build-examples'], function() {
  return gulp.src('./example/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['build']);
