/**
 * Created by chris_000 on 2/23/2015.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var watch = require('gulp-watch');
var browser = require('browser-sync');
var less = require('gulp-less');

gulp.task('unify', function() {
    gulp.src('app/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/'))
});
gulp.task('unify-prod', function() {
    gulp.src('app/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'))
});
gulp.task('thirdParty', function(){
    gulp.src([
        'node_modules/angular/angular.min.js',
        'thirdParty/firebase.min.js',
        'node_modules/angularfire/dist/angularfire.min.js'
    ])
        .pipe(concat('thirdparty.js'))
        .pipe(gulp.dest('dist/'));
});
gulp.task('less', function(){
    gulp.src(['styles/**/*.less','app/**/*.less'])
        .pipe(less())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist/'))
});
gulp.task('webServer', function() {
    browser({
        server:{
            baseDir: './'
        },
        files: ["index.html","app/**/*.html","dist/**/*.*"]
    });
});
gulp.task('watch', function(){
    gulp.watch('app/**/*.js', ['unify']);
    gulp.watch(['styles/**/*.less','app/**/*.less'], ['less']);
});
gulp.task('deploy', shell.task(
    [
        'firebase deploy'
        //,'firebase open'
    ],
    {cwd: process.cwd()}
));

gulp.task('develop', ['thirdParty', 'unify', 'less', 'watch', 'webServer']);
gulp.task('publish', ['thirdParty', 'less', 'unify-prod', 'deploy']);