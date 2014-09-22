var gulp = require('gulp');
var shell = require('gulp-shell');
var fs = require('fs');
var myOS = require('os').platform();
var downloadatomshell = require('gulp-download-atom-shell');
var binpath = 'binaries/atom';
if (myOS.substr(0,3) == "win") { binpath = 'binaries\\atom.exe'; }

gulp.task('downloadatomshell', function(cb){
    downloadatomshell({
        version: '0.16.2',
        outputDir: 'binaries'
    }, cb);
});

gulp.task('admin', shell.task([ binpath + ' app' ]));