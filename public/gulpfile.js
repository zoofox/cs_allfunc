var gulp = require("gulp");
var cssmin = require('gulp-cssmin');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

gulp.task('sass', function () {
 	gulp.src('./scss/dh.scss')
 	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
 	.pipe(cssmin())
   	.pipe(gulp.dest('./css/'));
});

gulp.task('watch', function () {
    watch('./scss/dh.scss', batch(function (events, done) {
    	console.log(done);
        gulp.start('sass',done);
    }));
});
gulp.task('minifyjs', function() {
    gulp.src('./jellyfish-static-source/js/**/barrage.js')
        //.pipe(concat('main.js'))    //合并所有js到main.js
        //.pipe(gulp.dest('./test/js'))    //输出main.js到文件夹
        //.pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('./test/js/'));  //输出

});
gulp.task('watchjs', function () {
    watch('./jellyfish-static-source/js/**/*.js', batch(function (events, done) {
    	console.log(done);
        gulp.start('minifyjs',done);
    }));
});

gulp.task('default', function(){
    gulp.run('sass', 'watch','minifyjs','watchjs');
   
});