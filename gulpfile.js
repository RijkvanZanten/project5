'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleancss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var cssbeautify = require('gulp-cssbeautify');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var bowerComponentsJS = [
  'bower_components/countUp/index.js'
];

var bowerComponentsCSS = [
];

gulp.task('bower:JS', function() {
  gulp.src(bowerComponentsJS)
  .pipe(concat('dependencies.js'))
  .pipe(gulp.dest('./assets/js'))
  .pipe(uglify())
  .pipe(rename('dependencies.min.js'))
  .pipe(gulp.dest('./assets/js'));
});

gulp.task('bower:CSS', function() {
  gulp.src(bowerComponentsCSS)
  .pipe(concat('dependencies.css'))
  .pipe(cssbeautify({
    indent: '    ',
    autosemicolon: true
  }))
  .pipe(gulp.dest('./assets/css'))
  .pipe(cleancss())
  .pipe(rename('dependencies.min.css'))
  .pipe(gulp.dest('./assets/css'));
})

gulp.task('bower', ['bower:JS', 'bower:CSS']);

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
