var gulp = require('gulp'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    uglifyJs = require('gulp-uglify'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    bowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    stylus = require('gulp-stylus'),
    es = require('event-stream'),
    runSequence = require('run-sequence'),
    clean = require('gulp-clean');

gulp.task('copy-fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('../src/main/resources/auth/fonts'));
});

gulp.task('main-bower-files', function() {
    return gulp.src(bowerFiles(), {
        base: 'bower_components',
    });
});

gulp.task('copy-css', function() {
    return gulp.src('app/css/*.css')
        .pipe(stylus())
        .pipe(gulp.dest('injected/auth/css'));
});

gulp.task('copy-js', function() {
    return gulp.src('app/js/*.js')
        .pipe(gulp.dest('injected/auth/js'));
});

gulp.task('inject', ['copy-css', 'copy-js'], function() {
    // copy all custom css & javascript to /auth
    // inject to which use bootstrap
    return gulp.src('app/*.html')
        .pipe(inject(gulp.src(bowerFiles(), {
            read: false
        }), {
            name: 'bower',
            addPrefix: '../..',
            addRootSlash: false,
            removeTags: true
        }))
        .pipe(gulp.dest('injected/auth'));
});

gulp.task('html', ['main-bower-files'], function() {
    var assets = useref.assets();

    return gulp.src('injected/auth/*.html')
        .pipe(assets)
        .pipe(rev())
        .pipe(gulpif('*.js', uglifyJs().on('error', function(e){
            console.log(e);
            })  ))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(revReplace())
        .pipe(gulpif('*.html', minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        })))
        .pipe(gulp.dest('../src/main/resources/auth'));
});

gulp.task('clean', function() {
    return gulp.src('../src/main/resources/auth', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('clean-injected', function() {
    return gulp.src('injected', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('build', function(callback) {
    runSequence('clean', ['copy-fonts'], 'inject', 'html', 'clean-injected');
});
