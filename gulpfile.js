var gulp = require('gulp');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var mainBowerFiles = require('gulp-main-bower-files');
var gulpFilter = require('gulp-filter');
var browserSync = require('browser-sync');

gulp.task('concat', function () {
    gulp.src('app/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/assets/js'));
});

gulp.task('copy', function () {
    gulp.src('app/**/*.css')
        .pipe(gulp.dest('public/assets/css'));
    gulp.src('app/**/*.html')
        .pipe(gulp.dest('public/assets/partials'));
});

gulp.task('bower_components', function () {
    var filter = gulpFilter(['*.js']);
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles({
            overrides: {
                "moment": {
                    main: [
                        "moment.js",
                        "locale/*.js",
                        "min/locales.min.js",
                        "min/moment-with-locales.min.js"
                    ]
                },
                "bootstrap": {
                    main: [
                        "dist/js/boostrap.js",
                        "dist/css/*"
                    ]
                }
            }
        }))
        .pipe(gulp.dest('public/bower_components'));
});
gulp.task('init', function () {
    runSequence('copy', 'concat', 'bower_components');
});

gulp.task('serve', function () {
    browserSync({
        notify: false,
        port: 9020,
        server: {
            baseDir: ['public'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    })
});

//not working
gulp.task('watch', function () {
    runSequence('copy', 'concat', 'bower_components');
    gulp.watch('app/**/*.*', ['concat']);
    gulp.watch('app/**/*.*', ['copy']);
});
