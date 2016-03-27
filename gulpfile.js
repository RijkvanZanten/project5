'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleancss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var cssbeautify = require('gulp-cssbeautify');
var nodemon = require('gulp-nodemon')

gulp.task('sass', function() {
  return gulp.src('./sass/*.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(cssbeautify({
      indent: '    ',
      autosemicolon: true
    }))
    .pipe(rename('master.css'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(cleancss()) // minify
    .pipe(rename('master.min.css'))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('sass:watch', function() {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('reload', ['sass'], function() {
  nodemon({
    script: 'app.js',
    ext: 'js ejs'
  }).on('restart', function() {

  });
});

gulp.task('serve', ['reload', 'sass:watch']);
