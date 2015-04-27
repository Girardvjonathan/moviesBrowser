var gulp       = require('gulp');
var concat     = require('gulp-concat');

gulp.task('concat', function() {
    gulp.src('app/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('www/assets/js'));
});

gulp.task('copy', function() {
    gulp.src('app/**/*.css')
        .pipe(gulp.dest('www/assets/css'));
    gulp.src('app/**/*.html')
        .pipe(gulp.dest('www/assets/partials'));
});
//not working
gulp.task('watch', function () {
    gulp.watch('app/**/*.*', ['concat']);
    gulp.watch('app/**/*.*', ['copy']);
});
